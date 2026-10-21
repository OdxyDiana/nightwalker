// Notificaciones del tablón: se leen de GET /notif (con la cookie de sesión) y se refrescan por sondeo.
// No se usa el aviso en vivo de FA.js (/sub/<canal> en el dominio push): si falla, FA.js se vuelve a
// registrar sin parar; con /notif basta una petición por minuto.
const NOTIFICATIONS_URL = "/notif";
const NOTIFICATIONS_REFRESH_MS = 60000;

// Texto por tipo (FA.Notification.NOTIF_*); lo que va después del nombre de quien la envía
const NOTIFICATION_TEXTS = {
  0: "te ha enviado un mensaje privado",
  2: "te ha enviado una solicitud de amistad",
  3: "ha respondido a tu solicitud de grupo",
  4: "se ha conectado",
  5: "ha escrito en tu muro",
  7: "ha respondido en un tema que sigues",
  8: "te ha mencionado",
  11: "ha dado me gusta a tu mensaje",
  12: "ha dado no me gusta a tu mensaje",
  13: "ha publicado en un foro que sigues",
  14: "te ha otorgado una medalla",
  15: "ha publicado un tema nuevo",
  16: "ha publicado un mensaje nuevo",
};
const NOTIFICATION_FALLBACK_TEXT = "tiene una novedad para ti";

// En local no existe /notif: se usa la constante `notificaciones` de la página, si está
let usingSample = false;

const loadNotifications = async () => {
  try {
    const response = await fetch(NOTIFICATIONS_URL, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(response.status);
    usingSample = false;
    return await response.json();
  } catch {
    usingSample = typeof notificaciones !== "undefined";
    return typeof notificaciones !== "undefined" ? notificaciones : null;
  }
};

// POST /notif con los text.id (como FA.Notification.markAsRead); en local solo se toca el ejemplo
const markAsRead = async (ids) => {
  if (!ids.length) return;
  if (usingSample) {
    notificaciones.store.forEach((n) => {
      if (ids.includes(n.text.id) && !n.read) {
        n.read = 1;
        notificaciones.unread--;
      }
    });
    return refreshNotifications();
  }
  const body = new URLSearchParams();
  ids.forEach((id) => body.append("id[]", id));
  try {
    const response = await fetch(NOTIFICATIONS_URL, {
      method: "POST",
      credentials: "same-origin",
      headers: { "X-Requested-With": "XMLHttpRequest" },
      body,
    });
    if (response.ok) refreshNotifications();
  } catch {}
};

const buildReadButton = (label, onClick) => {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.title = label;
  button.setAttribute("aria-label", label);
  button.className =
    "flex shrink-0 items-center justify-center p-1.5 surface-3 border border-color-1 rounded-sm cursor-pointer hover:border-(--accent-color)";
  button.innerHTML = '<i class="ph-fill ph-check"></i>';
  button.addEventListener("click", onClick);
  return button;
};

const buildNotification = (notification) => {
  const { text, time, read } = notification;
  const item = document.createElement("div");
  item.className = `notification-item surface-2 border rounded-sm p-1.5 text-[0.6875rem] leading-snug flex items-center gap-2 ${
    read ? "border-color-1" : "border-(--accent-color)"
  }`;

  const content = document.createElement("div");
  content.className = "flex flex-col gap-0.5 min-w-0 flex-1";

  const message = document.createElement("p");
  const author = document.createElement("a");
  author.href = `/u${text.from.id}`;
  author.className = "font-bold";
  author.textContent = text.from.name;
  message.append(author, ` ${NOTIFICATION_TEXTS[text.type] ?? NOTIFICATION_FALLBACK_TEXT}`);

  // Los mensajes privados llevan a su lectura; el resto, solo al perfil de quien las envía
  if (text.type === 0 && text.msg_id) {
    const link = document.createElement("a");
    link.href = `/privmsg?folder=inbox&mode=read&p=${text.msg_id}`;
    link.className = "hover:text-color-accent";
    link.append(message);
    content.append(link);
  } else {
    content.append(message);
  }

  const date = document.createElement("span");
  date.className = "italic opacity-75";
  date.textContent = time;
  content.append(date);
  item.append(content);

  // El botón va a la derecha, centrado en vertical, como el aspa del foro original
  if (!read) {
    item.append(buildReadButton("Marcar como leída", () => markAsRead([text.id])));
  }
  return item;
};

const renderNotifications = (data) => {
  const list = document.querySelector("#tablon-notificaciones");
  const actions = document.querySelector("#tablon-notificaciones-acciones");
  const title = document.querySelector("#tablon-notificaciones-titulo");
  if (!list || !title || !actions) return;

  let badge = title.querySelector(".notification-unread");
  if (!badge) {
    badge = document.createElement("span");
    badge.className =
      "notification-unread px-1.5 py-0.5 surface-1 border border-(--accent-color) rounded-sm text-xs text-color-accent";
    title.append(badge);
  }

  list.replaceChildren();
  actions.replaceChildren();
  if (!data || !Array.isArray(data.store)) {
    badge.hidden = true;
    list.textContent = "No se han podido cargar las notificaciones.";
    return;
  }

  badge.hidden = !data.unread;
  badge.textContent = data.unread;
  if (!data.store.length) {
    list.textContent = "No tienes notificaciones.";
    return;
  }
  if (data.unread > 0) {
    const markAll = document.createElement("button");
    markAll.type = "button";
    markAll.className =
      "flex w-full items-center justify-center gap-1.5 p-1 surface-2 border border-color-1 rounded-sm uppercase text-[0.625rem] font-bold cursor-pointer hover:border-(--accent-color)";
    markAll.innerHTML =
      '<i class="ph-fill ph-checks"></i><span>Marcar todas como leídas</span>';
    markAll.addEventListener("click", () =>
      markAsRead(data.store.filter((n) => !n.read).map((n) => n.text.id)),
    );
    actions.append(markAll);
  }
  data.store.forEach((notification) => list.append(buildNotification(notification)));
};

const refreshNotifications = async () =>
  renderNotifications(await loadNotifications());

document.addEventListener("DOMContentLoaded", () => {
  refreshNotifications();
  setInterval(() => {
    if (!document.hidden) refreshNotifications();
  }, NOTIFICATIONS_REFRESH_MS);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshNotifications();
  });
});
