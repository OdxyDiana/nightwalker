const CALENDAR_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const CALENDAR_WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];
const CALENDAR_MIN_YEAR = 1900;
const CALENDAR_MAX_YEAR = 2999;

const calendarState = {
  year: 0,
  month: 0,
  selected: null,
  news: [],
  newsByDay: new Map(),
  elements: {},
};

const padNumber = (number) => String(number).padStart(2, "0");

const toDateKey = (year, month, day) =>
  `${year}-${padNumber(month + 1)}-${padNumber(day)}`;

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const getMonthNames = () => {
  const formatter = new Intl.DateTimeFormat("es", { month: "long" });
  return Array.from({ length: 12 }, (_, month) =>
    capitalize(formatter.format(new Date(2000, month, 1))),
  );
};

const formatNewsDate = (dateKey) => {
  const [, year, month, day] = dateKey.match(CALENDAR_DATE_REGEX);
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Number(year), Number(month) - 1, Number(day)));
};

const loadCalendarNews = () => {
  const source =
    typeof calendario !== "undefined" ? calendario : window.calendario;
  const news = (source && Array.isArray(source.noticias) && source.noticias) || [];

  calendarState.news = news
    .filter((item) => {
      const isValid = item && CALENDAR_DATE_REGEX.test(item.fecha);
      if (!isValid) {
        console.warn("Calendario: noticia ignorada por fecha inválida", item);
      }
      return isValid;
    })
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  calendarState.newsByDay = new Map();
  calendarState.news.forEach((item) => {
    const dayNews = calendarState.newsByDay.get(item.fecha) || [];
    dayNews.push(item);
    calendarState.newsByDay.set(item.fecha, dayNews);
  });
};

const createCalendarButton = (icon, label, onClick) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className =
    "calendar-nav-button h-8 w-8 flex items-center justify-center text-color cursor-pointer";
  button.setAttribute("aria-label", label);
  button.innerHTML = `<i class="ph ph-${icon}"></i>`;
  button.addEventListener("click", onClick);
  return button;
};

const goToMonth = (year, month) => {
  const total = year * 12 + month;
  const newYear = Math.floor(total / 12);
  if (newYear < CALENDAR_MIN_YEAR || newYear > CALENDAR_MAX_YEAR) return;
  calendarState.year = newYear;
  calendarState.month = total - newYear * 12;
  renderCalendarDays();
};

const changeMonth = (delta) =>
  goToMonth(calendarState.year, calendarState.month + delta);

const selectDay = (dateKey) => {
  calendarState.selected =
    calendarState.selected === dateKey ? null : dateKey;
  renderCalendarDays();
  highlightNews();
};

const buildCalendarHeader = () => {
  const header = document.createElement("div");
  header.className =
    "calendar-header flex flex-wrap items-center justify-between gap-2 mb-2";

  const monthSelect = document.createElement("select");
  monthSelect.className =
    "calendar-month-select w-full min-w-0 appearance-none bg-transparent h-8 pl-2 pr-6 text-color uppercase font-bold text-sm cursor-pointer focus:outline-none";
  monthSelect.setAttribute("aria-label", "Mes");
  getMonthNames().forEach((name, month) => {
    const option = document.createElement("option");
    option.value = month;
    option.textContent = name;
    monthSelect.append(option);
  });
  monthSelect.addEventListener("change", () =>
    goToMonth(calendarState.year, Number(monthSelect.value)),
  );

  const yearInput = document.createElement("input");
  yearInput.type = "number";
  yearInput.min = CALENDAR_MIN_YEAR;
  yearInput.max = CALENDAR_MAX_YEAR;
  yearInput.className =
    "calendar-year-input shrink-0 bg-transparent h-8 w-[4em] px-1 text-center text-color font-bold text-sm focus:outline-none";
  yearInput.setAttribute("aria-label", "Año");
  yearInput.addEventListener("change", () => {
    const year = Number(yearInput.value);
    if (
      Number.isInteger(year) &&
      year >= CALENDAR_MIN_YEAR &&
      year <= CALENDAR_MAX_YEAR
    ) {
      goToMonth(year, calendarState.month);
    } else {
      yearInput.value = calendarState.year;
    }
  });

  const monthWrapper = document.createElement("div");
  monthWrapper.className = "relative flex min-w-0 flex-1 items-center";
  const caret = document.createElement("i");
  caret.className =
    "ph ph-caret-down absolute right-2 text-xs pointer-events-none";
  monthWrapper.append(monthSelect, caret);

  const title = document.createElement("div");
  title.className =
    "calendar-title calendar-nav-group flex min-w-0 items-center surface-3 rounded-sm basis-full order-first @xs:flex-1 @xs:order-none";
  title.append(monthWrapper, yearInput);

  const prevGroup = document.createElement("div");
  prevGroup.className = "calendar-nav-group flex surface-3 rounded-sm";
  prevGroup.append(
    createCalendarButton("caret-double-left", "Año anterior", () =>
      changeMonth(-12),
    ),
    createCalendarButton("caret-left", "Mes anterior", () => changeMonth(-1)),
  );

  const nextGroup = document.createElement("div");
  nextGroup.className = "calendar-nav-group flex surface-3 rounded-sm";
  nextGroup.append(
    createCalendarButton("caret-right", "Mes siguiente", () => changeMonth(1)),
    createCalendarButton("caret-double-right", "Año siguiente", () =>
      changeMonth(12),
    ),
  );

  header.append(prevGroup, title, nextGroup);

  calendarState.elements.monthSelect = monthSelect;
  calendarState.elements.yearInput = yearInput;
  return header;
};

const createOutsideDay = (day) => {
  const cell = document.createElement("span");
  cell.className =
    "calendar-day calendar-day-outside flex items-center justify-center h-9 xl:h-10 rounded-sm text-xs xl:text-sm opacity-30";
  cell.textContent = day;
  return cell;
};

const createDay = (day, todayKey) => {
  const { year, month, selected, newsByDay } = calendarState;
  const dateKey = toDateKey(year, month, day);
  const dayNews = newsByDay.get(dateKey);

  const button = document.createElement("button");
  button.type = "button";
  button.className =
    "calendar-day relative flex flex-col items-center justify-center h-9 xl:h-10 rounded-sm surface-3 text-sm text-color cursor-pointer";
  button.dataset.fecha = dateKey;
  button.setAttribute("aria-pressed", selected === dateKey);
  button.setAttribute("aria-label", formatNewsDate(dateKey));

  const number = document.createElement("span");
  number.textContent = day;
  button.append(number);

  if (dateKey === todayKey) button.classList.add("is-today");
  if (selected === dateKey) button.classList.add("is-selected");
  if (dayNews) {
    button.classList.add("has-news");
    const label = `${dayNews.length} ${dayNews.length === 1 ? "noticia" : "noticias"}`;
    button.dataset.title = label;
    button.setAttribute(
      "aria-label",
      `${formatNewsDate(dateKey)}, ${label}`,
    );
    const dot = document.createElement("span");
    dot.className = "calendar-day-dot block w-1 h-1 rounded-full";
    button.append(dot);
  }

  button.addEventListener("click", () => selectDay(dateKey));
  return button;
};

const renderCalendarDays = () => {
  const { year, month, elements } = calendarState;
  const today = new Date();
  const todayKey = toDateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  elements.monthSelect.value = month;
  elements.yearInput.value = year;

  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;

  const cells = [];
  for (let i = 0; i < offset; i++) {
    cells.push(createOutsideDay(daysInPrevMonth - offset + i + 1));
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(createDay(day, todayKey));
  }
  for (let day = 1; cells.length < totalCells; day++) {
    cells.push(createOutsideDay(day));
  }

  elements.days.replaceChildren(...cells);
};

const buildCalendarGrid = () => {
  const wrapper = document.createElement("div");
  wrapper.className = "calendar-month @container min-w-0 surface-2 rounded-sm p-2";

  const weekdays = document.createElement("div");
  weekdays.className =
    "grid grid-cols-7 gap-0.5 xl:gap-1 mb-1 text-center text-xs font-bold uppercase";
  CALENDAR_WEEKDAYS.forEach((weekday) => {
    const cell = document.createElement("span");
    cell.textContent = weekday;
    weekdays.append(cell);
  });

  const days = document.createElement("div");
  days.className = "grid grid-cols-7 gap-0.5 xl:gap-1";
  calendarState.elements.days = days;

  const todayButton = document.createElement("button");
  todayButton.type = "button";
  todayButton.className =
    "calendar-nav-button mt-2 w-full p-1 surface-3 rounded-sm text-color uppercase text-xs font-bold cursor-pointer";
  todayButton.textContent = "Hoy";
  todayButton.addEventListener("click", () => {
    const today = new Date();
    calendarState.selected = null;
    goToMonth(today.getFullYear(), today.getMonth());
    selectDay(toDateKey(today.getFullYear(), today.getMonth(), today.getDate()));
  });

  wrapper.append(buildCalendarHeader(), weekdays, days, todayButton);
  return wrapper;
};

const createNewsItem = (item) => {
  const listItem = document.createElement("li");
  listItem.className = "calendar-news-item surface-3 rounded-sm p-2";
  listItem.dataset.fecha = item.fecha;

  const date = document.createElement("button");
  date.type = "button";
  date.className =
    "calendar-news-date text-left text-xs uppercase font-bold cursor-pointer text-color-accent";
  date.textContent = formatNewsDate(item.fecha);
  date.setAttribute("aria-label", `Ver ${formatNewsDate(item.fecha)} en el calendario`);
  date.addEventListener("click", () => {
    const [, year, month] = item.fecha.match(CALENDAR_DATE_REGEX);
    calendarState.selected = null;
    goToMonth(Number(year), Number(month) - 1);
    selectDay(item.fecha);
  });

  const title = document.createElement(item.enlace ? "a" : "strong");
  title.className = "calendar-news-title block font-bold text-color";
  title.textContent = item.titulo || "";
  if (item.enlace) title.href = item.enlace;

  const text = document.createElement("p");
  text.className = "calendar-news-text text-sm";
  text.textContent = item.noticia || "";

  listItem.append(date, title, text);
  return listItem;
};

const buildNewsPanel = () => {
  const wrapper = document.createElement("div");
  wrapper.className = "calendar-news min-w-0 surface-2 rounded-sm p-2 flex flex-col";

  const title = document.createElement("h4");
  title.className = "text-center uppercase font-bold mb-2";
  title.textContent = "Noticias";

  const list = document.createElement("ul");
  list.className =
    "calendar-news-list relative flex flex-col gap-2 overflow-y-auto max-h-[320px]";

  if (calendarState.news.length) {
    list.append(...calendarState.news.map(createNewsItem));
  } else {
    const empty = document.createElement("li");
    empty.className = "text-center text-sm opacity-50";
    empty.textContent = "No hay noticias";
    list.append(empty);
  }

  calendarState.elements.newsList = list;
  wrapper.append(title, list);
  return wrapper;
};

const highlightNews = () => {
  const { newsList } = calendarState.elements;
  let firstMatch = null;

  newsList.querySelectorAll(".calendar-news-item").forEach((item) => {
    const isMatch = item.dataset.fecha === calendarState.selected;
    item.classList.toggle("is-highlighted", isMatch);
    if (isMatch && !firstMatch) firstMatch = item;
  });

  if (firstMatch) {
    newsList.scrollTo({ top: firstMatch.offsetTop, behavior: "smooth" });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#calendario");
  if (!container) return;

  const today = new Date();
  calendarState.year = today.getFullYear();
  calendarState.month = today.getMonth();

  loadCalendarNews();
  container.replaceChildren(buildCalendarGrid(), buildNewsPanel());
  renderCalendarDays();
});
