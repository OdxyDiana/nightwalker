const SWITCH_ACCOUNT_DB_NAME = "nightwalker-cuentas";
const SWITCH_ACCOUNT_DB_VERSION = 1;
const SWITCH_ACCOUNT_KEY_ID = "principal";
const SWITCH_ACCOUNT_DEFAULT_ROUTES = {
  login: "/login",
  logout: "/login?logout=1",
};

const switchAccountState = {
  supported: false,
  busy: false,
  accounts: [],
  elements: {},
};

const getSwitchAccountRoutes = () => {
  const source =
    typeof cambioCuenta !== "undefined" ? cambioCuenta : window.cambioCuenta;
  return { ...SWITCH_ACCOUNT_DEFAULT_ROUTES, ...(source && source.rutas) };
};

const isSwitchAccountSupported = () =>
  Boolean(
    window.indexedDB &&
      window.isSecureContext &&
      window.crypto &&
      window.crypto.subtle,
  );

const toAccountId = (username) =>
  username.trim().toLowerCase().replace(/\s+/g, "_");

/** INDEXEDDB **/
let switchAccountDbPromise = null;

const openSwitchAccountDb = () => {
  if (switchAccountDbPromise) return switchAccountDbPromise;

  switchAccountDbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(
      SWITCH_ACCOUNT_DB_NAME,
      SWITCH_ACCOUNT_DB_VERSION,
    );
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("cuentas")) {
        db.createObjectStore("cuentas", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("claves")) {
        db.createObjectStore("claves");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return switchAccountDbPromise;
};

const runSwitchAccountRequest = async (storeName, mode, action) => {
  const db = await openSwitchAccountDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const request = action(transaction.objectStore(storeName));
    transaction.oncomplete = () => resolve(request.result);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
};

const getStoredAccounts = () =>
  runSwitchAccountRequest("cuentas", "readonly", (store) => store.getAll());

const getStoredAccount = (id) =>
  runSwitchAccountRequest("cuentas", "readonly", (store) => store.get(id));

const putStoredAccount = (account) =>
  runSwitchAccountRequest("cuentas", "readwrite", (store) =>
    store.put(account),
  );

const deleteStoredAccount = (id) =>
  runSwitchAccountRequest("cuentas", "readwrite", (store) =>
    store.delete(id),
  );

/** CIFRADO **/
// La clave se crea como no exportable: se puede guardar y usar, pero sus bytes
// nunca son accesibles desde JS.
const getEncryptionKey = async () => {
  const storedKey = await runSwitchAccountRequest(
    "claves",
    "readonly",
    (store) => store.get(SWITCH_ACCOUNT_KEY_ID),
  );
  if (storedKey) return storedKey;

  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
  await runSwitchAccountRequest("claves", "readwrite", (store) =>
    store.put(key, SWITCH_ACCOUNT_KEY_ID),
  );
  return key;
};

const encryptPassword = async (password) => {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(password),
  );
  return { iv, ciphertext };
};

const decryptPassword = async (account) => {
  const key = await getEncryptionKey();
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: account.iv },
    key,
    account.ciphertext,
  );
  return new TextDecoder().decode(plaintext);
};

/** SESIÓN DEL FORO **/
const getForumUserdata = () =>
  typeof _userdata !== "undefined" ? _userdata : window._userdata;

const getCurrentUser = () => {
  const userdata = getForumUserdata();
  if (!userdata || Number(userdata.session_logged_in) !== 1) return null;

  let avatar = userdata.avatar_link || "";
  if (!avatar && userdata.avatar) {
    const match = String(userdata.avatar).match(/src=["']([^"']+)["']/);
    if (match) avatar = match[1];
  }
  return { username: String(userdata.username || ""), avatar };
};

// El logout de ForoActivo necesita el token tid: se usa el enlace propio del foro
// (a#logout) o cualquier enlace de logout que lo lleve; si no, la ruta configurada.
const getLogoutUrl = () => {
  const logoutLink =
    document.querySelector("a#logout[href]") ||
    document.querySelector('a[href*="logout"][href*="tid="]');
  return logoutLink
    ? logoutLink.getAttribute("href")
    : getSwitchAccountRoutes().logout;
};

const logoutFromForum = () =>
  fetch(getLogoutUrl(), {
    credentials: "same-origin",
    redirect: "manual",
  }).catch(() => null);

// Un login correcto responde con una redirección (302); con redirect "manual"
// el navegador no la sigue y devuelve una respuesta "opaqueredirect".
const loginToForum = async (username, password) => {
  const body = new URLSearchParams({
    username,
    password,
    autologin: "on",
    login: "1",
    redirect: "",
    query: "",
  });
  const response = await fetch(getSwitchAccountRoutes().login, {
    method: "POST",
    credentials: "same-origin",
    redirect: "manual",
    body,
  });
  return response.type === "opaqueredirect";
};

const loginToStoredAccount = async (account) => {
  const password = await decryptPassword(account);
  return loginToForum(account.username, password);
};

/** FLUJOS **/
const connectAccount = async (username, password) => {
  const currentUser = getCurrentUser();
  const previousAccount = currentUser
    ? await getStoredAccount(toAccountId(currentUser.username))
    : null;

  // Siempre se cierra la sesión antes de entrar, aunque _userdata no la detecte
  await logoutFromForum();

  if (!(await loginToForum(username, password))) {
    if (previousAccount) await loginToStoredAccount(previousAccount);
    return false;
  }

  const id = toAccountId(username);
  const existing = await getStoredAccount(id);
  const { iv, ciphertext } = await encryptPassword(password);
  await putStoredAccount({
    id,
    username: existing ? existing.username : username.trim(),
    avatar: existing ? existing.avatar : "",
    iv,
    ciphertext,
    creada: existing ? existing.creada : Date.now(),
  });
  return true;
};

const switchToAccount = async (id) => {
  const account = await getStoredAccount(id);
  if (!account) return false;

  const currentUser = getCurrentUser();
  const previousAccount = currentUser
    ? await getStoredAccount(toAccountId(currentUser.username))
    : null;

  // Siempre se cierra la sesión antes de entrar, aunque _userdata no la detecte
  await logoutFromForum();
  if (await loginToStoredAccount(account)) return true;

  if (previousAccount && previousAccount.id !== id) {
    await loginToStoredAccount(previousAccount);
  }
  return false;
};

// ForoActivo expone el nombre y avatar reales en _userdata: si la sesión actual
// es una cuenta guardada, se actualizan para que no se queden desfasados.
const syncCurrentAccount = async () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const account = await getStoredAccount(toAccountId(currentUser.username));
  if (!account) return;

  const avatar = currentUser.avatar || account.avatar;
  if (account.username === currentUser.username && account.avatar === avatar) {
    return;
  }
  await putStoredAccount({ ...account, username: currentUser.username, avatar });
};

/** MODAL **/
const isModalNative = (modal) => typeof modal.showModal === "function";

// view: "form" (conectar/añadir) o "picker" (elegir entre las cuentas guardadas)
const openSwitchAccountModal = ({
  username = "",
  error = "",
  view = "form",
} = {}) => {
  const { modal, form, unsupported, picker } = switchAccountState.elements;
  if (!modal) return;

  const showPicker = switchAccountState.supported && view === "picker";
  picker.hidden = !showPicker;
  form.hidden = !switchAccountState.supported || showPicker;
  unsupported.hidden = switchAccountState.supported;
  modal.setAttribute(
    "aria-labelledby",
    showPicker ? "switch-account-picker-title" : "switch-account-title",
  );
  form.reset();
  form.elements.username.value = username;
  showSwitchAccountError(error);

  if (isModalNative(modal)) {
    if (!modal.open) modal.showModal();
  } else {
    modal.setAttribute("open", "");
    modal.classList.add("is-fallback-open");
  }

  if (showPicker) {
    const firstAccount = picker.querySelector(
      ".switch-account-item:not(.is-current) button",
    );
    if (firstAccount) firstAccount.focus();
    return;
  }
  const focusTarget = username
    ? form.elements.password
    : form.elements.username;
  if (switchAccountState.supported) focusTarget.focus();
};

// Botón de la navbar: si hay cuentas guardadas muestra el selector, si no el login
const openSwitchAccountFromNavbar = () =>
  openSwitchAccountModal({
    view: switchAccountState.accounts.length ? "picker" : "form",
  });

const closeSwitchAccountModal = () => {
  const { modal, form } = switchAccountState.elements;
  if (!modal || switchAccountState.busy) return;

  if (isModalNative(modal)) {
    modal.close();
  } else {
    modal.removeAttribute("open");
    modal.classList.remove("is-fallback-open");
  }
  form.reset();
};

const showSwitchAccountError = (message) => {
  const { error } = switchAccountState.elements;
  error.textContent = message;
  error.hidden = !message;
};

const setSwitchAccountBusy = (busy) => {
  switchAccountState.busy = busy;
  const { form, lists } = switchAccountState.elements;

  if (form) {
    Array.from(form.elements).forEach((element) => {
      element.disabled = busy;
    });
    const submit = form.querySelector('[type="submit"]');
    submit.innerHTML = busy
      ? '<i class="ph ph-spinner animate-spin"></i>'
      : "Conectar";
  }
  lists.forEach((list) => list.classList.toggle("is-busy", busy));
};

const handleSwitchAccountSubmit = async (event) => {
  event.preventDefault();
  if (switchAccountState.busy) return;

  const { form } = switchAccountState.elements;
  const username = form.elements.username.value.trim();
  const password = form.elements.password.value;
  if (!username || !password) {
    showSwitchAccountError("Escribe el usuario y la contraseña.");
    return;
  }

  showSwitchAccountError("");
  setSwitchAccountBusy(true);
  try {
    if (await connectAccount(username, password)) {
      window.location.reload();
      return;
    }
    showSwitchAccountError("Usuario o contraseña incorrectos.");
  } catch (error) {
    console.error("Cambio de cuenta: error al conectar", error);
    showSwitchAccountError("No se ha podido conectar. Inténtalo de nuevo.");
  }
  setSwitchAccountBusy(false);
  form.elements.password.value = "";
  form.elements.password.focus();
};

/** TABLÓN **/
const handleAccountClick = async (account) => {
  if (switchAccountState.busy) return;

  setSwitchAccountBusy(true);
  try {
    if (await switchToAccount(account.id)) {
      window.location.reload();
      return;
    }
    setSwitchAccountBusy(false);
    openSwitchAccountModal({
      username: account.username,
      error:
        "No se ha podido entrar en esta cuenta. Si ha cambiado la contraseña, escríbela de nuevo.",
    });
  } catch (error) {
    console.error("Cambio de cuenta: error al cambiar", error);
    setSwitchAccountBusy(false);
  }
};

const handleForgetAccount = async (account) => {
  if (switchAccountState.busy) return;
  if (!window.confirm(`¿Olvidar la cuenta ${account.username} en este dispositivo?`)) {
    return;
  }
  await deleteStoredAccount(account.id);
  await renderAccountList();
};

const createAccountItem = (account, currentId) => {
  const item = document.createElement("li");
  item.className = "switch-account-item relative flex flex-col items-center gap-1 min-w-0";
  if (account.id === currentId) item.classList.add("is-current");

  const button = document.createElement("button");
  button.type = "button";
  button.className =
    "switch-account-avatar block w-[60px] h-[60px] p-[3px] surface-2 rounded-sm cursor-pointer";
  button.dataset.title = account.username;
  button.setAttribute(
    "aria-label",
    account.id === currentId
      ? `${account.username} (cuenta actual)`
      : `Cambiar a ${account.username}`,
  );

  // Sin avatar (o si la imagen no carga) se muestra un icono
  const icon = document.createElement("span");
  icon.className =
    "w-full h-full flex items-center justify-center text-2xl text-color";
  icon.innerHTML = '<i class="ph-fill ph-user"></i>';

  if (account.avatar) {
    const image = document.createElement("img");
    image.src = account.avatar;
    image.alt = "";
    image.loading = "lazy";
    image.className = "w-full h-full object-cover object-center rounded-sm";
    image.addEventListener("error", () => image.replaceWith(icon));
    button.append(image);
  } else {
    button.append(icon);
  }
  button.addEventListener("click", () => {
    if (account.id !== currentId) handleAccountClick(account);
  });

  const name = document.createElement("span");
  name.className = "switch-account-name block w-full truncate text-center text-xs";
  name.textContent = account.username;

  const forget = document.createElement("button");
  forget.type = "button";
  forget.className =
    "switch-account-forget absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center surface-1 rounded-full text-xs text-color cursor-pointer";
  forget.setAttribute("aria-label", `Olvidar la cuenta ${account.username}`);
  forget.innerHTML = '<i class="ph ph-x"></i>';
  forget.addEventListener("click", () => handleForgetAccount(account));

  item.append(button, name, forget);
  return item;
};

const createAddAccountItem = () => {
  const item = document.createElement("li");
  item.className = "switch-account-item flex flex-col items-center gap-1";

  const button = document.createElement("button");
  button.type = "button";
  button.className =
    "switch-account-add w-[60px] h-[60px] flex items-center justify-center surface-2 rounded-sm text-2xl text-color cursor-pointer";
  button.setAttribute("aria-label", "Añadir cuenta");
  button.innerHTML = '<i class="ph ph-plus"></i>';
  button.addEventListener("click", () => openSwitchAccountModal());

  const label = document.createElement("span");
  label.className = "text-xs";
  label.textContent = "Añadir";

  item.append(button, label);
  return item;
};

const buildAccountList = (accounts, currentId) => {
  const items = document.createElement("ul");
  items.className =
    "switch-account-items grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-3";
  items.append(
    ...accounts.map((account) => createAccountItem(account, currentId)),
    createAddAccountItem(),
  );

  const children = [items];
  if (!accounts.length) {
    const empty = document.createElement("p");
    empty.className = "text-center text-sm opacity-50 mt-2";
    empty.textContent = "Aún no hay cuentas guardadas";
    children.push(empty);
  }
  return children;
};

// Rellena todas las listas de cuentas: la del tablón y la de la modal
const renderAccountList = async () => {
  const { lists } = switchAccountState.elements;

  if (!switchAccountState.supported) {
    switchAccountState.accounts = [];
    lists.forEach((list) => {
      const notice = document.createElement("p");
      notice.className = "text-center text-sm opacity-50";
      notice.textContent = "Este navegador no permite guardar cuentas.";
      list.replaceChildren(notice);
    });
    return;
  }

  const accounts = (await getStoredAccounts()).sort(
    (a, b) => a.creada - b.creada,
  );
  switchAccountState.accounts = accounts;
  const currentUser = getCurrentUser();
  const currentId = currentUser ? toAccountId(currentUser.username) : null;

  lists.forEach((list) =>
    list.replaceChildren(...buildAccountList(accounts, currentId)),
  );
};

document.addEventListener("DOMContentLoaded", async () => {
  const modal = document.querySelector("#switch-account-modal");
  switchAccountState.supported = isSwitchAccountSupported();
  switchAccountState.elements = {
    modal,
    form: modal && modal.querySelector(".switch-account-form"),
    error: modal && modal.querySelector(".switch-account-error"),
    unsupported: modal && modal.querySelector(".switch-account-unsupported"),
    picker: modal && modal.querySelector(".switch-account-picker"),
    lists: document.querySelectorAll(".switch-account-list"),
  };

  if (modal) {
    const { form } = switchAccountState.elements;
    form.addEventListener("submit", handleSwitchAccountSubmit);
    modal
      .querySelectorAll("[data-switch-account-close]")
      .forEach((button) =>
        button.addEventListener("click", closeSwitchAccountModal),
      );
    // Clic en el fondo oscuro de la modal
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeSwitchAccountModal();
    });
    modal.addEventListener("cancel", (event) => {
      if (switchAccountState.busy) event.preventDefault();
    });
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        !isModalNative(modal) &&
        modal.hasAttribute("open")
      ) {
        closeSwitchAccountModal();
      }
    });

    document.querySelectorAll("[data-switch-account-open]").forEach((opener) =>
      opener.addEventListener("click", (event) => {
        event.preventDefault();
        openSwitchAccountFromNavbar();
      }),
    );
  }

  if (!switchAccountState.supported) {
    renderAccountList();
    return;
  }

  try {
    await syncCurrentAccount();
    await renderAccountList();
  } catch (error) {
    console.error("Cambio de cuenta: no se ha podido leer IndexedDB", error);
    switchAccountState.supported = false;
    renderAccountList();
  }
});
