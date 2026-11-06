// En móvil y tablet el tablón se reduce a logo, últimos temas y búsquedas;
// el resto (.tablon-extra) queda tras un botón para no agobiar
document.addEventListener("DOMContentLoaded", () => {
  const tablon = document.querySelector("#tablon");
  if (!tablon || tablon.querySelector(".tablon-toggle")) return;

  const button = document.createElement("button");
  button.type = "button";
  button.className =
    "tablon-toggle xl:hidden col-span-12 flex items-center justify-center gap-2 p-2 surface-3 border border-color-1 rounded-sm uppercase text-xs font-bold cursor-pointer hover:border-(--accent-color)";
  button.setAttribute("aria-expanded", "false");
  button.innerHTML =
    '<i class="ph-fill ph-caret-down transition-transform"></i><span>Ver más</span>';

  button.addEventListener("click", () => {
    const isOpen = tablon.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.querySelector("span").textContent = isOpen
      ? "Ocultar más"
      : "Ver más";
  });

  tablon.append(button);
});
