document.addEventListener("DOMContentLoaded", () => {
  if ("content" in document.createElement("template")) {
    let topic = document.querySelector("#post-wrapper");

    if (!!topic) {
      let templateTopic = topic.querySelector("#post-template");

      // Los mensajes de ejemplo solo existen en local (topic-data.js); en el foro llegan ya hechos
      if (templateTopic && typeof postContent !== "undefined") {
        const demoPosts = demoVariants.map((variant) => ({
          ...postContent[0],
          author: variant.author ?? postContent[0].author,
          fields: postContent[0].fields.map((field) => ({
            ...field,
            content: variant[field.label] ?? field.content,
          })),
        }));
        demoPosts.reverse().forEach((post) => {
          let clone = document.importNode(templateTopic.content, true);
          let postProfile = clone.querySelector(".post-profile");

          postProfile.querySelector(".post-author-name a").innerHTML =
            post.author;
          postProfile.querySelector(
            ".post-author .post-author-avatar img",
          ).src = post.avatarSrc;

          post.fields.forEach((field) => {
            let template = postProfile.querySelector(
              "#post-author-fields-template",
            );
            template.content.querySelector(
              ".post-author-field .post-author-field-label span",
            ).textContent = field.label;
            template.content.querySelector(
              ".post-author-field .post-author-field-content",
            ).innerHTML = field.content;

            let cloneField = document.importNode(template.content, true);
            postProfile
              .querySelector(".post-profile .post-author-field-container")
              .append(cloneField);
          });
          topic.prepend(postProfile);
        });
      }
    }
  }
  addPostFieldsToHeaderAndFooter();
  addClassToPostFields();
  addProfileToggle();
  addPostButtonTitles();
});

// En móvil la ficha del personaje se pliega tras un botón para no agobiar
const addProfileToggle = () => {
  document.querySelectorAll(".post-profile").forEach((profile) => {
    const header = profile.querySelector("#post-header");
    if (!header || header.querySelector(".post-profile-toggle")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "post-profile-toggle xl:hidden flex items-center justify-center gap-2 p-2 surface-1 border border-color-3 rounded-sm uppercase text-xs font-bold cursor-pointer hover:border-(--accent-color)";
    button.setAttribute("aria-expanded", "false");
    button.innerHTML =
      '<i class="ph-fill ph-caret-down transition-transform"></i><span>Ver más</span>';

    button.addEventListener("click", () => {
      const isOpen = profile.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
      button.querySelector("span").textContent = isOpen
        ? "Ocultar más"
        : "Ver más";
    });

    header.append(button);
  });
};

// Los botones del post usan el tooltip del tema (data-title) en vez del title nativo
const addPostButtonTitles = () => {
  document.querySelectorAll("#post-buttons a").forEach((button) => {
    const text =
      button.getAttribute("title") ||
      button.getAttribute("aria-label") ||
      button.querySelector("img")?.getAttribute("alt");
    if (!text) return;

    button.dataset.title = text;
    button.setAttribute("aria-label", text);
    button.removeAttribute("title");
  });
};
