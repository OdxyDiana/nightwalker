// Notificaciones del tablón: se leen de GET /notif (con la cookie de sesión) y se refrescan por sondeo.
// No se usa el aviso en vivo de FA.js (/sub/<canal> en el dominio push): si falla, FA.js se vuelve a
// registrar sin parar; con /notif basta una petición por minuto.
const NOTIFICATIONS_URL = "/notif";
const NOTIFICATIONS_REFRESH_MS = 60000;

// En el foro el texto sale de las frases del idioma del foro (_lang['Notif_*'], con enlaces), igual que
// Toolbar.compileNotif de FAToolbar.js pero sin depender de él. Lo de abajo solo se usa si no hay _lang (en local).
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

// Frase de _lang y sus datos por tipo; mismos datos que Toolbar.compileNotif (FAToolbar.js)
const describeNotification = (text) => {
  const { from = {}, post = {}, forum = {}, group = {}, award = {} } = text;
  const base = { id: from.id, name: from.name, nid: text.id };
  const topic = {
    topic_id: post.topic_id,
    topic_name: post.topic_name,
    topic_title: post.topic_title,
    topic_display_name: post.topic_display_name,
    post_id: post.post_id,
    start: post.start,
  };
  const forumData = {
    forum_id: forum.forum_id,
    forum_name: forum.forum_name,
    forum_title: forum.forum_title,
  };
  const withTitle = post.topic_title !== undefined ? "2" : "";
  const asGuest = from.id == -1 ? "_guest" : "";

  switch (text.type) {
    case 0:
      return ["Notif_priv_msg", { ...base, msg_id: text.msg_id }];
    case 1:
      return ["Notif_report", base];
    case 2:
      return ["Notif_friend_req", base];
    case 3:
      return [
        "Notif_group_req",
        {
          ...base,
          group_id: group.id,
          group_url_name: group.url_name,
          group_name: group.name,
        },
      ];
    case 4:
      return ["Notif_friend_con", base];
    case 5:
      return ["Notif_wall_msg", { ...base, self: text.self }];
    case 6:
      return ["Notif_abuse", { nid: text.id }];
    case 7:
      return [
        `Notif_topic_watch${post.start ? "_p" : ""}${asGuest}${withTitle}`,
        { ...base, ...topic },
      ];
    case 8:
      return ["Notif_mention", { ...base, ...topic }];
    case 9:
      return ["Notif_hashtag", { ...base, ...topic, tag: text.tag }];
    case 10:
      return [
        `Notif_advert_${post.type}`,
        {
          nid: text.id,
          ad_id: post.ad_id,
          ad_title: post.ad_title,
          ad_url: post.ad_url,
          forum_id: post.forum_id,
        },
      ];
    case 11:
      return ["Notif_like", { ...base, ...topic }];
    case 12:
      return ["Notif_dislike", { ...base, ...topic }];
    case 13:
      return ["Notif_forum_watch", { ...base, ...topic, ...forumData }];
    case 14:
      return [
        "Notif_award",
        {
          nid: text.id,
          award_notif: award.award_notif,
          award_image: award.award_image,
        },
      ];
    case 15:
      return ["Notif_followers_new_topic", { ...base, ...topic, ...forumData }];
    case 16:
      return [
        `Notif_followers_new_post${post.start ? "_p" : ""}${withTitle}`,
        { ...base, ...topic },
      ];
    case 17:
      return ["Notif_donation", { ...base, amount: text.amount }];
  }
  return null;
};

// jQuery.vsprintf es el de la plataforma; si no está se sustituyen a mano los %(dato)s
const formatNotification = (template, args) => {
  try {
    if (window.jQuery?.vsprintf) return jQuery.vsprintf(template, [args]);
  } catch {}
  return template.replace(/%(?:\((\w+)\))?[sd%]/g, (match, key) =>
    match === "%%" ? "%" : (args[key] ?? ""),
  );
};

const compileNotification = (notification) => {
  if (typeof _lang === "undefined") return null;
  try {
    const [key, args] = describeNotification(notification.text) ?? [];
    const template = key && _lang[key];
    return template ? formatNotification(template, args) || null : null;
  } catch {
    return null;
  }
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
  const compiled = compileNotification(notification);
  if (compiled) {
    // Mismo HTML que inserta la barra del foro con .html() (frases del propio foro)
    message.innerHTML = compiled;
    content.append(message);
  } else {
    const author = document.createElement("a");
    author.href = `/u${text.from.id}`;
    author.className = "font-bold";
    author.textContent = text.from.name;
    message.append(author, ` ${NOTIFICATION_TEXTS[text.type] ?? NOTIFICATION_FALLBACK_TEXT}`);

    // Los mensajes privados llevan a su lectura; el resto, solo al perfil de quien las envía
    if (text.type === 0 && text.msg_id) {
      const link = document.createElement("a");
      link.href = `/privmsg?folder=inbox&nid=${text.id}`;
      link.className = "hover:text-color-accent";
      link.append(message);
      content.append(link);
    } else {
      content.append(message);
    }
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
    list.textContent = (typeof _lang !== "undefined" && _lang.Notif_no_notifications) || "No hay nuevas notificaciones.";
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
