document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector("nav a.nav-icon.light-theme")
    .addEventListener("click", () => changeLightTheme());
  document
    .querySelector("nav a.nav-icon.dark-theme")
    .addEventListener("click", () => changeDarkTheme());
});

const changeDarkTheme = () => {
  document.documentElement.setAttribute("data-theme", "dark");
  localStorage.setItem("data-theme", "dark");
};

const changeLightTheme = () => {
  document.documentElement.setAttribute("data-theme", "light");
  localStorage.setItem("data-theme", "light");
};

const getThemeInLocalStorage = () => {
  let themeLocalStorage = localStorage.getItem("data-theme");
  document.documentElement.setAttribute(
    "data-theme",
    themeLocalStorage ? themeLocalStorage : "dark",
  );
};
(() => getThemeInLocalStorage())();

const addPostFieldsToHeaderAndFooter = () => {
  const postAuthorFields = document.querySelectorAll(".post-author-field");
  const header = document.querySelector("#post-header");
  const footer = document.querySelector("#post-footer");
  const headerFields = [
    "post",
    "wons",
    "apodos",
    "medallas",
    "personaje",
    "grupo",
    "fans",
    "empresa",
    "edad",
  ];

  const footerFields = [
    "pareja",
    "inventario",
    "quote",
    "reputacion",
    "nivelreputacion",
  ];

  postAuthorFields.forEach((field) => {
    const labelText = extractLabelText(
      field,
      ".post-author-field-label .label",
    );
    if (headerFields.includes(labelText)) {
      header.appendChild(field);
    } else if (footerFields.includes(labelText)) {
      footer.appendChild(field);
    }
  });
};

const addClassToPostFields = () => {
  const postAuthorFields = document.querySelectorAll(".post-author-field");
  postAuthorFields.forEach((field) => {
    const labelText = extractLabelText(
      field,
      ".post-author-field-label .label",
    );

    field.classList.add(`post-field-${labelText}`);
  });
};

const extractLabelText = (contentElement, labelSelector) => {
  const labelElement = contentElement.querySelector(labelSelector);
  let labelText = labelElement.textContent;
  labelText = labelText.replace(":", "").replace("*", "").trimEnd();
  labelText = labelText.toLowerCase().replace(/\s+/g, "-");
  return labelText;
};

const addProfileFieldsToHeader = () => {
  const headerFields = ["quote", "portada"];

  const profileFields = document.querySelectorAll(".profile-field-container");
  const header = document.querySelector("#profile-header");
  profileFields.forEach((field) => {
    const labelText = extractLabelText(field, ".profile-field-label .label");
    if (headerFields.includes(labelText)) {
      header.appendChild(field);
    }
  });
};

const addClassToProfileFields = () => {
  const profileFields = document.querySelectorAll(".profile-field-container");
  profileFields.forEach((field) => {
    const labelText = extractLabelText(field, ".profile-field-label .label");
    field.classList.add(`profile-field-${labelText}`);
  });
};
