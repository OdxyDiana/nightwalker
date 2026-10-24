document.addEventListener("DOMContentLoaded", () => {
  if ("content" in document.createElement("template")) {
    const wrapper = document.getElementById("profile-body");
    const profileInfo = wrapper.querySelector("#profile-info");

    if (!!wrapper) {
      const template = document.getElementById("profile-field-template");

      // El perfil de ejemplo solo existe en local (profile-data.js); en el foro los campos llegan ya hechos
      if (!!template && typeof profileData !== "undefined") {
        const user = profileData[0];

        const nickname = document.getElementById("profile-nickname");
        if (nickname) nickname.innerHTML = user.author;

        const avatarImg = document.querySelector("#profile-avatar img");
        if (avatarImg) avatarImg.src = user.avatarSrc;

        user.fields
          .slice()
          .reverse()
          .forEach((data) => {
            let clone = document.importNode(template.content, true);
            let container = clone.querySelector(".profile-field-container");

            container.querySelector(".profile-field-label span").textContent =
              data.label;
            container.querySelector(".profile-field-content").innerHTML =
              data.content;

            profileInfo.append(clone);
          });
      }
    }
  }
  addProfileFieldsToHeader();
  addClassToProfileFields();
});
