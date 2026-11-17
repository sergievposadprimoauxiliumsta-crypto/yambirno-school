/**
 * Основной скрипт сайта Ямбирнского филиала МОУ «Лесно-Конобеевская СШ»
 * Включает:
 * 1) Автоматический прогноз погоды в с. Ямбирно (сейчас + завтра утром к 08:00 с советом про зонтик/одежду)
 * 2) Индивидуальное расписание для каждого класса с 1 по 9 (с сохранением выбранного класса в памяти телефона)
 * 3) Поддержку ссылок на фото из Скриншотера (skrinshoter.ru), Google Диска и GitHub
 * 4) Динамическое создание 13-й, 14-й и последующих карточек учителей из столбцов F–J
 */

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1w6Z_wfOYJVKxtMHhz9ut6euiLY3YtkkOGNj1Wd_Pr0yJTdmKruN19uZYEyXpLZQSQPQgGHH9i84a/pub?output=csv";
const FEEDBACK_POST_URL = "https://script.google.com/macros/s/AKfycbzCzPpC8lYIeG_GkCYJKTJAhXjM4Ti0vO_9njDpi7lPdC1Rr2Ue8REEE38Tv_dou3X1Kg/exec";

// Координаты с. Ямбирно (Шацкий район, Рязанская область) для метеосервиса Open-Meteo
const YAMBIRNO_LAT = 54.1286;
const YAMBIRNO_LON = 41.9708;

const A11Y_STORAGE_KEY = "yambirno_visually_impaired";
const GRADE_STORAGE_KEY = "yambirno_selected_grade";
const SHEET_CACHE_KEY = "yambirno_live_sheet_cache_v7";

const AVATAR_PALETTES = [
  { bg: "#dbeafe", fg: "#1e40af" },
  { bg: "#fef3c7", fg: "#b45309" },
  { bg: "#dcfce7", fg: "#15803d" },
  { bg: "#e0e7ff", fg: "#3730a3" },
  { bg: "#e0f2fe", fg: "#0369a1" },
  { bg: "#ecfccb", fg: "#3f6212" },
  { bg: "#f3e8ff", fg: "#6b21a8" },
  { bg: "#ffedd5", fg: "#9a3412" },
  { bg: "#fae8ff", fg: "#86198f" },
  { bg: "#ccfbf1", fg: "#0f766e" },
  { bg: "#dbeafe", fg: "#1e3a8a" },
  { bg: "#fce7f3", fg: "#9d174d" }
];

const DAY_NAMES_FULL = {
  1: "Понедельник",
  2: "Вторник",
  3: "Среда",
  4: "Четверг",
  5: "Пятница"
};

const DEFAULT_SANPIN_BREAKFAST =
  "Горячее блюдо, витаминизированный горячий напиток, хлебобулочное/молочное изделие согласно утверждённому 10-дневному цикличному меню.";
const DEFAULT_SANPIN_LUNCH =
  "Первое горячее блюдо, порционное мясное/рыбное блюдо с гарниром, сезонная овощная нарезка/салат, напиток по нормам СанПиН.";
const DEFAULT_SANPIN_NOTE =
  "Фактическое ежедневное меню заверяется руководителем и размещается на информационном стенде школьной столовой.";

// Базовое резервное расписание по классам 1–9 (если в таблице пока заполнена только старая версия)
const DEFAULT_GRADE_SCHEDULES = {
  1: {
    1: "1. Разговоры о важном\n2. Обучение грамоте\n3. Письмо\n4. Математика",
    2: "1. Обучение грамоте\n2. Письмо\n3. Математика\n4. Окружающий мир",
    3: "1. Обучение грамоте\n2. Письмо\n3. Математика\n4. Физкультура",
    4: "1. Обучение грамоте\n2. Письмо\n3. Музыка\n4. ИЗО",
    5: "1. Обучение грамоте\n2. Окружающий мир\n3. Труд (технология)\n4. Физкультура"
  },
  2: {
    1: "1. Разговоры о важном\n2. Русский язык\n3. Математика\n4. Литературное чтение",
    2: "1. Русский язык\n2. Математика\n3. Английский язык\n4. Окружающий мир",
    3: "1. Математика\n2. Русский язык\n3. Литературное чтение\n4. Физкультура",
    4: "1. Русский язык\n2. Математика\n3. Английский язык\n4. Музыка",
    5: "1. Русский язык\n2. Литературное чтение\n3. ИЗО\n4. Труд (технология)"
  },
  3: {
    1: "1. Разговоры о важном\n2. Русский язык\n3. Математика\n4. Литературное чтение",
    2: "1. Математика\n2. Русский язык\n3. Английский язык\n4. Окружающий мир",
    3: "1. Русский язык\n2. Математика\n3. Литературное чтение\n4. Физкультура",
    4: "1. Математика\n2. Русский язык\n3. Английский язык\n4. Музыка",
    5: "1. Русский язык\n2. Окружающий мир\n3. ИЗО\n4. Труд (технология)"
  },
  4: {
    1: "1. Разговоры о важном\n2. Русский язык\n3. Математика\n4. Литературное чтение",
    2: "1. Русский язык\n2. Математика\n3. Английский язык\n4. Окружающий мир",
    3: "1. Математика\n2. Русский язык\n3. ОРКСЭ\n4. Физкультура",
    4: "1. Русский язык\n2. Математика\n3. Английский язык\n4. Литературное чтение",
    5: "1. Русский язык\n2. Окружающий мир\n3. ИЗО\n4. Труд (технология)"
  },
  5: {
    1: "1. Разговоры о важном\n2. Русский язык\n3. Математика\n4. История\n5. Биология",
    2: "1. Математика\n2. Русский язык\n3. Английский язык\n4. Литература\n5. Физкультура",
    3: "1. Русский язык\n2. Математика\n3. География\n4. Литература\n5. Труд (технология)",
    4: "1. Математика\n2. Русский язык\n3. История\n4. Английский язык\n5. Музыка",
    5: "1. Русский язык\n2. Математика\n3. Литература\n4. ИЗО\n5. Физкультура"
  },
  6: {
    1: "1. Разговоры о важном\n2. Русский язык\n3. Математика\n4. История\n5. Биология",
    2: "1. Математика\n2. Русский язык\n3. Английский язык\n4. География\n5. Литература",
    3: "1. Русский язык\n2. Математика\n3. Обществознание\n4. Литература\n5. Физкультура",
    4: "1. Математика\n2. Русский язык\n3. История\n4. Английский язык\n5. Труд (технология)",
    5: "1. Русский язык\n2. Математика\n3. Литература\n4. Музыка / ИЗО\n5. Физкультура"
  },
  7: {
    1: "1. Разговоры о важном\n2. Русский язык\n3. Алгебра\n4. Физика\n5. История",
    2: "1. Геометрия\n2. Русский язык\n3. Английский язык\n4. География\n5. Биология",
    3: "1. Алгебра\n2. Русский язык\n3. Литература\n4. Физика\n5. Информатика",
    4: "1. Геометрия\n2. Русский язык\n3. История\n4. Обществознание\n5. Английский язык",
    5: "1. Алгебра\n2. Литература\n3. География\n4. Труд (технология)\n5. Физкультура"
  },
  8: {
    1: "1. Разговоры о важном\n2. Алгебра\n3. Русский язык\n4. Химия\n5. История\n6. Биология",
    2: "1. Геометрия\n2. Литература\n3. Английский язык\n4. Физика\n5. География\n6. Физкультура",
    3: "1. Алгебра\n2. Русский язык\n3. Химия\n4. Обществознание\n5. Информатика\n6. ОБЗР",
    4: "1. Геометрия\n2. Русский язык\n3. История\n4. Физика\n5. Английский язык\n6. Биология",
    5: "1. Алгебра\n2. Литература\n3. География\n4. Английский язык\n5. Профориентация\n6. Физкультура"
  },
  9: {
    1: "1. Разговоры о важном\n2. Алгебра\n3. Русский язык\n4. Физика\n5. История\n6. Химия",
    2: "1. Геометрия\n2. Литература\n3. Английский язык\n4. Обществознание\n5. Биология\n6. Информатика",
    3: "1. Алгебра\n2. Русский язык\n3. Химия\n4. География\n5. Физика\n6. Физкультура",
    4: "1. Геометрия\n2. Русский язык\n3. История\n4. Литература\n5. Английский язык\n6. ОБЗР",
    5: "1. Алгебра\n2. Литература\n3. Физика\n4. Химия\n5. Биология\n6. Консультация ОГЭ"
  }
};

let customSheetSchoolStatus = "";
let latestParsedSheetData = null;
let currentSelectedWeekday = getDefaultSchoolWeekday();
let currentSelectedGrade = getSavedGradeSelection();

function getDefaultSchoolWeekday() {
  const jsDay = new Date().getDay();
  return jsDay >= 1 && jsDay <= 5 ? jsDay : 1;
}

function getSavedGradeSelection() {
  try {
    const saved = parseInt(localStorage.getItem(GRADE_STORAGE_KEY) || "1", 10);
    if (saved >= 1 && saved <= 9) return saved;
  } catch (_) {}
  return 1;
}

function sanitizeInput(rawString, maxLength = 1000) {
  if (typeof rawString !== "string") return "";
  return rawString
    .replace(/<[^>]*>?/gm, "")
    .replace(/javascript:|data:|vbscript:/gi, "")
    .replace(/[<>"'`\\]/g, "")
    .replace(/^[=+\-@]+/, "")
    .trim()
    .slice(0, maxLength);
}

function buildInitialsSvgDataUri(initials, index = 0) {
  const palette = AVATAR_PALETTES[index % AVATAR_PALETTES.length];
  const safeChars = sanitizeInput(initials, 3).toUpperCase() || "УЧ";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><circle cx='60' cy='60' r='60' fill='${palette.bg}'/><text x='60' y='70' font-family='sans-serif' font-size='34' font-weight='bold' fill='${palette.fg}' text-anchor='middle'>${safeChars}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function extractInitialsFromFio(fioString) {
  const parts = sanitizeInput(fioString, 120).split(/\s+/).filter(Boolean);
  if (parts.length >= 3) return (parts[1][0] + parts[2][0]).toUpperCase();
  if (parts.length === 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return "УЧ";
}

/**
 * Надежный обработчик фото (Столбец F):
 * Поддерживает Скриншотер (skrinshoter.ru), Google Диск, прямые URL и локальные файлы GitHub
 */
function resolveTeacherPhotoSource(rawPhotoCell, teacherFio, cardIndex) {
  const cleaned = (rawPhotoCell || "").trim();
  const fallbackSvg = buildInitialsSvgDataUri(extractInitialsFromFio(teacherFio), cardIndex);

  if (!cleaned) return { src: fallbackSvg, altTry: null, fallback: fallbackSvg };

  if (/^[А-Яа-яЁёA-Za-z]{1,3}$/.test(cleaned)) {
    const customSvg = buildInitialsSvgDataUri(cleaned, cardIndex);
    return { src: customSvg, altTry: null, fallback: customSvg };
  }

  // Ссылки с Google Диска
  const driveMatch =
    cleaned.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    cleaned.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (cleaned.includes("drive.google.com") && driveMatch && driveMatch[1]) {
    return {
      src: `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w400`,
      altTry: null,
      fallback: fallbackSvg
    };
  }

  // Ссылки со Скриншотера (skrinshoter.ru)
  if (cleaned.includes("skrinshoter.ru")) {
    const hasImgExt = /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(cleaned);
    if (hasImgExt) {
      return {
        src: cleaned,
        altTry: `https://wsrv.nl/?url=${encodeURIComponent(cleaned)}&w=300&h=300&fit=cover`,
        fallback: fallbackSvg
      };
    }
    // Если вставлена короткая ссылка на страницу просмотра skrinshoter.ru/s/XXXX, пробуем прямое расширение .jpg и прокси
    const cleanNoSlash = cleaned.replace(/\/+$/, "");
    return {
      src: `${cleanNoSlash}.jpg`,
      altTry: `${cleanNoSlash}.png`,
      fallback: fallbackSvg
    };
  }

  const isSafeUrlOrPath =
    /^https?:\/\/[^\s"'<>]+$/i.test(cleaned) ||
    /^[a-zA-Z0-9_\-./]+\.(jpg|jpeg|png|webp|gif|svg)$/i.test(cleaned);

  if (isSafeUrlOrPath) {
    return {
      src: cleaned,
      altTry: cleaned.startsWith("http") ? `https://wsrv.nl/?url=${encodeURIComponent(cleaned)}&w=300&h=300&fit=cover` : null,
      fallback: fallbackSvg
    };
  }

  return { src: fallbackSvg, altTry: null, fallback: fallbackSvg };
}

document.addEventListener("DOMContentLoaded", () => {
  initLiveDateTimeClock();
  initYambirnoWeatherWidget();
  initAccessibilityMode();
  initScrollRevealAndCounters();
  initTeacherFilter();
  initDigitalNavigatorTabs();
  initWeekdayAndGradeSwitchers();
  initLiveSheetWidgetAndMenu();
  initFeedbackForm();
  registerOfflineServiceWorker();
});

/* ==========================================================================
   1. ПРОГНОЗ ПОГОДЫ В С. ЯМБИРНО (СЕЙЧАС + ЗАВТРА К 08:00 УТРА С СОВЕТОМ)
   ========================================================================== */
function decodeWmoWeather(code) {
  if (code === 0) return { icon: "☀️", text: "Ясно", rain: false, snow: false };
  if (code === 1 || code === 2) return { icon: "🌤️", text: "Переменная облачность", rain: false, snow: false };
  if (code === 3) return { icon: "☁️", text: "Пасмурно", rain: false, snow: false };
  if (code === 45 || code === 48) return { icon: "🌫️", text: "Туман", rain: false, snow: false };
  if (code >= 51 && code <= 57) return { icon: "🌦️", text: "Морось", rain: true, snow: false };
  if (code >= 61 && code <= 67) return { icon: "🌧️", text: "Дождь", rain: true, snow: false };
  if (code >= 71 && code <= 77) return { icon: "❄️", text: "Снег", rain: false, snow: true };
  if (code >= 80 && code <= 82) return { icon: "🌧️", text: "Ливень", rain: true, snow: false };
  if (code === 85 || code === 86) return { icon: "🌨️", text: "Снегопад", rain: false, snow: true };
  if (code >= 95) return { icon: "⛈️", text: "Гроза", rain: true, snow: false };
  return { icon: "🌤️", text: "Без осадков", rain: false, snow: false };
}

async function initYambirnoWeatherWidget() {
  const topPill = document.getElementById("top-weather-pill");
  const nowIconEl = document.getElementById("weather-now-icon");
  const nowTempEl = document.getElementById("weather-now-temp");
  const nowDescEl = document.getElementById("weather-now-desc");
  const tomTempEl = document.getElementById("weather-tomorrow-temp");
  const tomDescEl = document.getElementById("weather-tomorrow-desc");
  const adviceEl = document.getElementById("weather-parent-advice");

  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${YAMBIRNO_LAT}&longitude=${YAMBIRNO_LON}&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&timezone=Europe%2FMoscow&forecast_days=2`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Weather HTTP error");
    const data = await res.json();

    // 1. Текущая погода в с. Ямбирно
    const curTemp = Math.round(data.current.temperature_2m);
    const curSign = curTemp > 0 ? `+${curTemp}°C` : `${curTemp}°C`;
    const curWmo = decodeWmoWeather(data.current.weather_code);
    const curWind = Math.round(data.current.wind_speed_10m);

    if (topPill) {
      topPill.textContent = `${curWmo.icon} с. Ямбирно: ${curSign}`;
    }
    if (nowIconEl) nowIconEl.textContent = curWmo.icon;
    if (nowTempEl) nowTempEl.textContent = curSign;
    if (nowDescEl) nowDescEl.textContent = `${curWmo.text}, ветер ${curWind} м/с`;

    // 2. Погода завтра утром к 08:00 (индекс 24 + 8 = 32 в массиве hourly)
    const morningIndex = 32;
    const tomTempRaw =
      data.hourly && data.hourly.temperature_2m && data.hourly.temperature_2m[morningIndex] !== undefined
        ? Math.round(data.hourly.temperature_2m[morningIndex])
        : curTemp;
    const tomSign = tomTempRaw > 0 ? `+${tomTempRaw}°C` : `${tomTempRaw}°C`;
    const tomCode =
      data.hourly && data.hourly.weather_code && data.hourly.weather_code[morningIndex] !== undefined
        ? data.hourly.weather_code[morningIndex]
        : data.current.weather_code;
    const tomPrecipProb =
      data.hourly && data.hourly.precipitation_probability && data.hourly.precipitation_probability[morningIndex] !== undefined
        ? data.hourly.precipitation_probability[morningIndex]
        : 0;

    const tomWmo = decodeWmoWeather(tomCode);

    if (tomTempEl) tomTempEl.textContent = `${tomWmo.icon} ${tomSign}`;
    if (tomDescEl) tomDescEl.textContent = `${tomWmo.text} (осадки ${tomPrecipProb}%)`;

    // 3. Формируем понятную рекомендацию для родителей на утро
    if (adviceEl) {
      adviceEl.classList.remove("advice-rain", "advice-cold");
      if (tomWmo.rain || (tomPrecipProb >= 40 && tomTempRaw > 0)) {
        adviceEl.textContent = "☔ Совет на утро: возможен дождь — дайте ребёнку в школу зонт или дождевик!";
        adviceEl.classList.add("advice-rain");
      } else if (tomWmo.snow || (tomPrecipProb >= 40 && tomTempRaw <= 0)) {
        adviceEl.textContent = "❄️ Совет на утро: ожидается снег — оденьте ребёнка потеплее, на улице может быть скользко.";
        adviceEl.classList.add("advice-cold");
      } else if (tomTempRaw <= -12) {
        adviceEl.textContent = "🧣 Совет на утро: морозное утро — не забудьте тёплую шапку, шарф и варежки.";
        adviceEl.classList.add("advice-cold");
      } else if (tomTempRaw <= 4) {
        adviceEl.textContent = "🧥 Совет на утро: прохладно и без осадков — рекомендуем тёплую куртку по сезону.";
      } else {
        adviceEl.textContent = "☀️ Совет на утро: осадков к 1-му уроку не ожидается — зонт не нужен!";
      }
    }
  } catch (_) {
    if (topPill) topPill.textContent = "📍 с. Ямбирно";
    if (nowDescEl) nowDescEl.textContent = "Метеоданные обновляются";
    if (adviceEl) adviceEl.textContent = "Удачного учебного дня и хорошей погоды!";
  }
}

/* ==========================================================================
   2. ЖИВЫЕ ЧАСЫ, ДАТА И СТАТУС ШКОЛЫ
   ========================================================================== */
function initLiveDateTimeClock() {
  const dateEl = document.getElementById("live-date-display");
  const timeEl = document.getElementById("live-time-display");
  const statusEl = document.getElementById("school-day-status");
  const widgetTodayPill = document.getElementById("widget-today-pill");

  const updateClock = () => {
    const now = new Date();

    const dateFormatted = now.toLocaleDateString("ru-RU", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    const capitalizedDate = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);

    const timeFormatted = now.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    if (dateEl) dateEl.textContent = capitalizedDate;
    if (timeEl) timeEl.textContent = timeFormatted;

    if (widgetTodayPill) {
      const shortDate = now.toLocaleDateString("ru-RU", { day: "2-digit", month: "long" });
      widgetTodayPill.textContent = `📅 Сегодня, ${shortDate}`;
    }

    if (statusEl) {
      if (customSheetSchoolStatus) {
        statusEl.textContent = `🟢 ${customSheetSchoolStatus}`;
      } else {
        const day = now.getDay();
        const hour = now.getHours();

        if (day === 0 || day === 6) {
          statusEl.textContent = "🏡 Выходной день • Приём обращений открыт";
        } else if (hour >= 8 && hour < 17) {
          statusEl.textContent = "🟢 Учебный день (работа по расписанию)";
        } else {
          statusEl.textContent = "🌙 Учебный день завершён • Приём обращений 24/7";
        }
      }
    }
  };

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   3. ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ
   ========================================================================== */
function initAccessibilityMode() {
  const toggleBtn = document.getElementById("a11y-toggle");
  if (!toggleBtn) return;

  const applyMode = (isEnabled) => {
    document.body.classList.toggle("visually-impaired", isEnabled);
    toggleBtn.setAttribute("aria-pressed", String(isEnabled));
    toggleBtn.setAttribute("aria-label", "Версия для слабовидящих");

    const textSpan = toggleBtn.querySelector(".a11y-btn-text");
    if (textSpan) {
      textSpan.textContent = isEnabled ? "✕ Обычный вид сайта" : "Версия для слабовидящих";
    }
  };

  let savedState = false;
  try {
    savedState = localStorage.getItem(A11Y_STORAGE_KEY) === "true";
  } catch (_) {}

  applyMode(savedState);

  toggleBtn.addEventListener("click", () => {
    const nextState = !document.body.classList.contains("visually-impaired");
    applyMode(nextState);
    try {
      localStorage.setItem(A11Y_STORAGE_KEY, String(nextState));
    } catch (_) {}
  });
}

/* ==========================================================================
   4. ДИНАМИЧЕСКОЕ ОБНОВЛЕНИЕ КАРТОЧЕК УЧИТЕЛЕЙ (С ПОДДЕРЖКОЙ SKRINSHOTER.RU)
   ========================================================================== */
function createNewTeacherCardElement() {
  const article = document.createElement("article");
  article.className = "teacher-card surface-card reveal visible";
  article.setAttribute("data-category", "main");

  article.innerHTML = `
    <div class="teacher-photo-wrap">
      <img src="" alt="" class="teacher-photo" width="96" height="96" referrerpolicy="no-referrer">
    </div>
    <span class="teacher-badge">Основной состав</span>
    <h3 class="teacher-name"></h3>
    <p class="teacher-role"></p>
    <p class="teacher-meta"></p>
  `;
  return article;
}

function populateSingleTeacherCard(card, rowData, idx) {
  const photoEl = card.querySelector(".teacher-photo");
  const badgeEl = card.querySelector(".teacher-badge");
  const nameEl = card.querySelector(".teacher-name");
  const roleEl = card.querySelector(".teacher-role");
  const metaEl = card.querySelector(".teacher-meta");

  const newFio = rowData.fio || (nameEl ? nameEl.textContent : "Педагог школы");
  const newBadge = rowData.badge || "Основной состав";
  const newRole = rowData.role || "";
  const newDesc = rowData.desc || "";
  const newPhotoRaw = rowData.photo || "";

  if (nameEl && rowData.fio) nameEl.textContent = rowData.fio;

  if (badgeEl && newBadge) {
    badgeEl.textContent = newBadge;
    const badgeLower = newBadge.toLowerCase();

    badgeEl.classList.remove("badge-gold", "badge-outline");
    if (badgeLower.includes("совместител")) {
      card.setAttribute("data-category", "part-time");
      badgeEl.classList.add("badge-outline");
    } else {
      card.setAttribute("data-category", "main");
      if (
        badgeLower.includes("отличник") ||
        badgeLower.includes("почетн") ||
        badgeLower.includes("почётн") ||
        badgeLower.includes("заслужен")
      ) {
        badgeEl.classList.add("badge-gold");
      }
    }
  }

  if (roleEl && newRole) roleEl.textContent = newRole;
  if (metaEl && newDesc) metaEl.textContent = newDesc;

  if (photoEl && (newPhotoRaw || rowData.fio)) {
    photoEl.setAttribute("referrerpolicy", "no-referrer");
    const resolved = resolveTeacherPhotoSource(newPhotoRaw, newFio, idx);
    let triedAlt = false;

    photoEl.onerror = () => {
      if (!triedAlt && resolved.altTry) {
        triedAlt = true;
        photoEl.src = resolved.altTry;
      } else {
        photoEl.onerror = null;
        photoEl.src = resolved.fallback;
      }
    };
    photoEl.src = resolved.src;
    photoEl.alt = `Фото педагога: ${newFio}`;
  }
}

function updateTeachersFromSheetRows(teachersDataArray) {
  if (!Array.isArray(teachersDataArray) || teachersDataArray.length === 0) return;

  const grid = document.getElementById("teachers-grid");
  if (!grid) return;

  const existingCards = Array.from(grid.querySelectorAll(".teacher-card"));

  teachersDataArray.forEach((rowData, idx) => {
    if (!rowData) return;

    let card = existingCards[idx];
    if (!card) {
      card = createNewTeacherCardElement();
      grid.appendChild(card);
    }

    const fioLower = (rowData.fio || "").toLowerCase();
    if (fioLower === "-" || fioLower === "удалить" || fioLower === "скрыть") {
      card.remove();
      return;
    }

    populateSingleTeacherCard(card, rowData, idx);
  });

  recalculateTeacherFilterCounts();
}

function recalculateTeacherFilterCounts() {
  const allCards = document.querySelectorAll("#teachers-grid .teacher-card");
  const mainCards = document.querySelectorAll('#teachers-grid .teacher-card[data-category="main"]');
  const partTimeCards = document.querySelectorAll('#teachers-grid .teacher-card[data-category="part-time"]');

  const btnAll = document.querySelector('.filter-btn[data-filter="all"]');
  const btnMain = document.querySelector('.filter-btn[data-filter="main"]');
  const btnPart = document.querySelector('.filter-btn[data-filter="part-time"]');
  const subtitleEl = document.getElementById("teachers-subtitle");

  if (btnAll) btnAll.textContent = `Все педагоги (${allCards.length})`;
  if (btnMain) btnMain.textContent = `Основной состав (${mainCards.length})`;
  if (btnPart) btnPart.textContent = `Совместители (${partTimeCards.length})`;
  if (subtitleEl) {
    subtitleEl.textContent = `Главная опора Ямбирнского филиала: ${mainCards.length} основных педагогов и ${partTimeCards.length} совместителя (всего ${allCards.length})`;
  }

  const activeFilterBtn = document.querySelector(".filter-btn.active");
  if (activeFilterBtn) {
    const activeCategory = activeFilterBtn.getAttribute("data-filter");
    allCards.forEach((card) => {
      const cardCat = card.getAttribute("data-category");
      card.classList.toggle("hidden", !(activeCategory === "all" || cardCat === activeCategory));
    });
  }
}

/* ==========================================================================
   5. ПЕРЕКЛЮЧАТЕЛИ ДНЕЙ НЕДЕЛИ (ПН–ПТ) И КЛАССОВ (1–9 КЛАСС)
   ========================================================================== */
function initWeekdayAndGradeSwitchers() {
  const allDayPills = document.querySelectorAll(".day-pill");
  const allGradePills = document.querySelectorAll(".grade-pill");

  allDayPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const dayNum = parseInt(pill.getAttribute("data-day") || "1", 10);
      currentSelectedWeekday = dayNum;
      syncDayAndGradeUI(currentSelectedWeekday, currentSelectedGrade);
      if (latestParsedSheetData) {
        renderDaySpecificScheduleAndMenu(latestParsedSheetData, currentSelectedWeekday, currentSelectedGrade);
      }
    });
  });

  allGradePills.forEach((gPill) => {
    gPill.addEventListener("click", () => {
      const gradeNum = parseInt(gPill.getAttribute("data-grade") || "1", 10);
      currentSelectedGrade = gradeNum;
      try {
        localStorage.setItem(GRADE_STORAGE_KEY, String(gradeNum));
      } catch (_) {}
      syncDayAndGradeUI(currentSelectedWeekday, currentSelectedGrade);
      if (latestParsedSheetData) {
        renderDaySpecificScheduleAndMenu(latestParsedSheetData, currentSelectedWeekday, currentSelectedGrade);
      }
    });
  });

  syncDayAndGradeUI(currentSelectedWeekday, currentSelectedGrade);
}

function syncDayAndGradeUI(dayNum, gradeNum) {
  const allDayPills = document.querySelectorAll(".day-pill");
  allDayPills.forEach((pill) => {
    const pDay = parseInt(pill.getAttribute("data-day") || "0", 10);
    pill.classList.toggle("active", pDay === dayNum);
  });

  const allGradePills = document.querySelectorAll(".grade-pill");
  allGradePills.forEach((gPill) => {
    const pGrade = parseInt(gPill.getAttribute("data-grade") || "0", 10);
    gPill.classList.toggle("active", pGrade === gradeNum);
  });

  const jsToday = new Date().getDay();
  const dayName = DAY_NAMES_FULL[dayNum] || "Понедельник";
  const dayLabelText = jsToday === dayNum ? `${dayName}, ${gradeNum} класс` : `${dayName} (${gradeNum} класс)`;

  const scheduleDayLabel = document.getElementById("schedule-day-label");
  const menuDayLabel = document.getElementById("menu-day-label");
  if (scheduleDayLabel) scheduleDayLabel.textContent = dayLabelText;
  if (menuDayLabel) menuDayLabel.textContent = jsToday === dayNum ? `${dayName} (сегодня)` : dayName;
}

function renderDaySpecificScheduleAndMenu(dataObj, dayNum, gradeNum = 1) {
  const scheduleEl = document.getElementById("col-schedule");
  const menuBreakfastEl = document.getElementById("menu-breakfast");
  const menuLunchEl = document.getElementById("menu-lunch");
  const menuNoteEl = document.getElementById("menu-note");

  // 1. Ищем расписание для конкретного класса (1..9) и дня недели (1..5)
  let scheduleText = "";
  if (
    dataObj.scheduleByGradeAndDay &&
    dataObj.scheduleByGradeAndDay[gradeNum] &&
    dataObj.scheduleByGradeAndDay[gradeNum][dayNum]
  ) {
    scheduleText = dataObj.scheduleByGradeAndDay[gradeNum][dayNum];
  } else if (DEFAULT_GRADE_SCHEDULES[gradeNum] && DEFAULT_GRADE_SCHEDULES[gradeNum][dayNum]) {
    scheduleText = DEFAULT_GRADE_SCHEDULES[gradeNum][dayNum];
  } else {
    scheduleText = dataObj.col2Schedule || "Занятия проводятся согласно основному расписанию уроков";
  }

  if (scheduleEl) {
    scheduleEl.classList.remove("flash-updated");
    void scheduleEl.offsetWidth;
    scheduleEl.classList.add("flash-updated");
    scheduleEl.textContent = scheduleText;
  }

  // 2. Отрисовка меню столовой для выбранного дня недели
  const dayMenuObj = (dataObj.menuByDay && dataObj.menuByDay[dayNum]) ? dataObj.menuByDay[dayNum] : {};

  if (menuBreakfastEl) {
    menuBreakfastEl.textContent = dayMenuObj.breakfast || dataObj.menuBreakfast || DEFAULT_SANPIN_BREAKFAST;
  }
  if (menuLunchEl) {
    menuLunchEl.textContent = dayMenuObj.lunch || dataObj.menuLunch || DEFAULT_SANPIN_LUNCH;
  }
  if (menuNoteEl) {
    menuNoteEl.textContent = dayMenuObj.note || dataObj.menuNote || DEFAULT_SANPIN_NOTE;
  }
}

/* ==========================================================================
   6. ЧТЕНИЕ GOOGLE ТАБЛИЦЫ (БЕЗ ОШИБОЧНЫХ ПАРАМЕТРОВ URL + ПОДДЕРЖКА 1–9 КЛ)
   ========================================================================== */
function detectWeekdayIndexFromCell(cellString) {
  const s = (cellString || "").toLowerCase().trim();
  if (s.startsWith("понедельник") || s === "пн") return 1;
  if (s.startsWith("вторник") || s === "вт") return 2;
  if (s.startsWith("среда") || s === "ср") return 3;
  if (s.startsWith("четверг") || s === "чт") return 4;
  if (s.startsWith("пятница") || s === "пт") return 5;
  return 0;
}

function detectGradeNumberFromCell(cellString) {
  const s = (cellString || "").toLowerCase().trim();
  const match = s.match(/^([1-9])\s*(класс|кл\.?|кл)$/i);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return 0;
}

function initLiveSheetWidgetAndMenu() {
  const newsEl = document.getElementById("col-news");
  const scheduleEl = document.getElementById("col-schedule");
  const importantEl = document.getElementById("col-important");
  const refreshBtn = document.getElementById("refresh-sheet-btn");
  const statusEl = document.getElementById("widget-status");

  if (!newsEl || !scheduleEl || !importantEl) return;

  const parseCSVPreserveRowIndex = (csvText) => {
    const rows = [];
    let currentRow = [];
    let currentCell = "";
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
      const char = csvText[i];
      const nextChar = csvText[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentCell += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        currentRow.push(currentCell.trim());
        currentCell = "";
      } else if ((char === "\r" || char === "\n") && !inQuotes) {
        if (char === "\r" && nextChar === "\n") i++;
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = "";
      } else {
        currentCell += char;
      }
    }

    if (currentCell.length > 0 || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      rows.push(currentRow);
    }
    return rows;
  };

  const renderWidgetData = (dataObj, isFromCache = false) => {
    latestParsedSheetData = dataObj;

    [newsEl, importantEl].forEach((el) => {
      el.classList.remove("is-loading-shimmer", "flash-updated");
      void el.offsetWidth;
      el.classList.add("flash-updated");
    });
    scheduleEl.classList.remove("is-loading-shimmer");

    newsEl.textContent = dataObj.col1News || "На сегодня дополнительных объявлений нет";
    importantEl.textContent = dataObj.col3Important || "Желаем хорошего дня!";

    if (dataObj.col4Status) {
      customSheetSchoolStatus = dataObj.col4Status;
    }

    syncDayAndGradeUI(currentSelectedWeekday, currentSelectedGrade);
    renderDaySpecificScheduleAndMenu(dataObj, currentSelectedWeekday, currentSelectedGrade);

    if (Array.isArray(dataObj.teachers) && dataObj.teachers.some(Boolean)) {
      updateTeachersFromSheetRows(dataObj.teachers);
    }

    if (statusEl) {
      statusEl.textContent = isFromCache
        ? `Офлайн-копия (${dataObj.timeLabel || "сохранено"})`
        : `Обновлено в ${dataObj.timeLabel}`;
    }
  };

  const loadSheetData = async () => {
    if (refreshBtn) {
      refreshBtn.classList.add("loading");
      refreshBtn.disabled = true;
    }
    [newsEl, scheduleEl, importantEl].forEach((el) => el.classList.add("is-loading-shimmer"));
    if (statusEl) statusEl.textContent = "Синхронизация...";

    try {
      // Чистый запрос к опубликованному CSV без лишних query-параметров, чтобы Google не блокировал ответ
      const response = await fetch(SHEET_CSV_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ошибка: ${response.status}`);

      const csvText = await response.text();
      const rows = parseCSVPreserveRowIndex(csvText);

      // БЛОК 1 (Строка 2): A2 = Новости дня, B2 = Общее расписание, C2 = Важные новости, D2 = Статус
      const secondRow = rows.length > 1 ? rows[1] : [];

      // Структура расписания по каждому классу (1..9) и дню (1..5)
      const scheduleByGradeAndDay = {};
      for (let g = 1; g <= 9; g++) {
        scheduleByGradeAndDay[g] = { ...(DEFAULT_GRADE_SCHEDULES[g] || {}) };
      }

      const menuByDay = {};
      let currentMode = "schedule_grouped";

      for (let rIdx = 2; rIdx < rows.length; rIdx++) {
        const r = rows[rIdx] || [];
        const colA = (r[0] || "").trim();
        const colALower = colA.toLowerCase();
        const colB = (r[1] || "").trim();
        const colC = (r[2] || "").trim();
        const colD = (r[3] || "").trim();

        // 1. Проверяем, если строка начинается с "1 класс" ... "9 класс" (Матрица Завуча A15:F24)
        const gradeNum = detectGradeNumberFromCell(colA);
        if (gradeNum >= 1 && gradeNum <= 9) {
          for (let d = 1; d <= 5; d++) {
            const cellLesson = sanitizeInput(r[d] || "", 600);
            if (cellLesson) {
              scheduleByGradeAndDay[gradeNum][d] = cellLesson;
            }
          }
          continue;
        }

        // 2. Проверяем заголовки таблиц ("День недели", "День питания")
        if (colALower.includes("день")) {
          if (colALower.includes("питан") || colB.toLowerCase().includes("завтрак")) {
            currentMode = "menu";
          } else {
            currentMode = "schedule_grouped";
          }
          continue;
        }

        // 3. Если строка начинается с дня недели ("Понедельник" .. "Пятница")
        const dayIndex = detectWeekdayIndexFromCell(colA);
        if (dayIndex >= 1 && dayIndex <= 5) {
          if (currentMode === "menu") {
            menuByDay[dayIndex] = {
              breakfast: sanitizeInput(colB, 400),
              lunch: sanitizeInput(colC, 400),
              note: sanitizeInput(colD, 400)
            };
          } else if (currentMode === "schedule_grouped") {
            // Совместимость с таблицей A4:D9 (1–4 классы | 5–7 классы | 8–9 классы)
            const s14 = sanitizeInput(colB, 600);
            const s57 = sanitizeInput(colC, 600);
            const s89 = sanitizeInput(colD, 600);
            if (s14) {
              [1, 2, 3, 4].forEach((g) => { scheduleByGradeAndDay[g][dayIndex] = s14; });
            }
            if (s57) {
              [5, 6, 7].forEach((g) => { scheduleByGradeAndDay[g][dayIndex] = s57; });
            }
            if (s89) {
              [8, 9].forEach((g) => { scheduleByGradeAndDay[g][dayIndex] = s89; });
            }
          }
        }
      }

      // БЛОК УЧИТЕЛЕЙ: читаем столбцы F, G, H, I, J (индексы 5..9), пока в столбце H есть ФИО учителя
      const teachersList = [];
      for (let rIdx = 1; rIdx < rows.length; rIdx++) {
        const r = rows[rIdx] || [];
        const rawPhoto = (r[5] || "").trim();
        const badge = sanitizeInput(r[6] || "", 100);
        const fio = sanitizeInput(r[7] || "", 120);
        const role = sanitizeInput(r[8] || "", 160);
        const desc = sanitizeInput(r[9] || "", 450);

        if (!fio && !role) continue;
        if (fio.toLowerCase().includes("фио учителя") || fio.toLowerCase() === "фио") continue;
        // Чтобы строка 15 (где в F15 написано "Пятница" для расписания) не считалась учителем, проверяем, что заполнен столбец H (ФИО)
        if (!fio) continue;

        teachersList.push({ photo: rawPhoto, badge, fio, role, desc });
      }

      const nowLabel = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

      const parsedData = {
        col1News: sanitizeInput(secondRow[0] || "", 600),
        col2Schedule: sanitizeInput(secondRow[1] || "", 600),
        col3Important: sanitizeInput(secondRow[2] || "", 600),
        col4Status: sanitizeInput(secondRow[3] || "", 120),
        scheduleByGradeAndDay,
        menuByDay,
        teachers: teachersList,
        timeLabel: nowLabel
      };

      renderWidgetData(parsedData, false);

      try {
        localStorage.setItem(SHEET_CACHE_KEY, JSON.stringify(parsedData));
      } catch (_) {}
    } catch (_) {
      let cached = null;
      try {
        const rawCache = localStorage.getItem(SHEET_CACHE_KEY);
        if (rawCache) cached = JSON.parse(rawCache);
      } catch (_) {}

      if (cached) {
        renderWidgetData(cached, true);
      } else {
        [newsEl, scheduleEl, importantEl].forEach((el) => el.classList.remove("is-loading-shimmer"));
        newsEl.textContent = "Информация обновляется";
        scheduleEl.textContent = DEFAULT_GRADE_SCHEDULES[currentSelectedGrade][currentSelectedWeekday];
        importantEl.textContent = "Желаем хорошего дня!";
        if (statusEl) statusEl.textContent = "Автономный режим";
      }
    } finally {
      if (refreshBtn) {
        refreshBtn.classList.remove("loading");
        refreshBtn.disabled = false;
      }
    }
  };

  if (refreshBtn) {
    refreshBtn.addEventListener("click", loadSheetData);
  }

  loadSheetData();
}

/* ==========================================================================
   7. ВКЛАДКИ ЦИФРОВОГО НАВИГАТОРА И ФОРМА ОБРАТНОЙ СВЯЗИ
   ========================================================================== */
function initDigitalNavigatorTabs() {
  const tabBtns = document.querySelectorAll(".digital-tab-btn");
  const panels = document.querySelectorAll(".digital-panel");
  if (tabBtns.length === 0 || panels.length === 0) return;

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-dtab");

      tabBtns.forEach((b) => {
        const isCurrent = b === btn;
        b.classList.toggle("active", isCurrent);
        b.setAttribute("aria-selected", String(isCurrent));
      });

      panels.forEach((panel) => {
        const isMatch = panel.id === targetId;
        panel.classList.toggle("hidden", !isMatch);
        panel.classList.toggle("active", isMatch);
      });
    });
  });
}

function initFeedbackForm() {
  const consentStep = document.getElementById("consent-step");
  const formStep = document.getElementById("form-step");
  const acceptBtn = document.getElementById("accept-consent-btn");
  const stepInd1 = document.getElementById("step-indicator-1");
  const stepInd2 = document.getElementById("step-indicator-2");

  const form = document.getElementById("feedback-form");
  const formFieldset = document.getElementById("form-fieldset");
  if (!consentStep || !formStep || !acceptBtn || !form || !formFieldset) return;

  const fioInput = document.getElementById("fio-input");
  const contactInput = document.getElementById("contact-input");
  const commentInput = document.getElementById("comment-input");
  const topicChips = document.querySelectorAll(".topic-chip");

  const fioHint = document.getElementById("fio-hint");
  const contactHint = document.getElementById("contact-hint");
  const commentHint = document.getElementById("comment-hint");

  const submitBtn = document.getElementById("submit-btn");
  const submitBtnText = document.getElementById("submit-btn-text");
  const submitLoader = document.getElementById("submit-loader");
  const formResponse = document.getElementById("form-response");

  let isConsentConfirmed = false;
  let selectedTopicPrefix = "[Вопрос руководителю] ";

  formFieldset.disabled = true;
  submitBtn.disabled = true;

  const setTopicByPrefix = (prefix, placeholderText) => {
    selectedTopicPrefix = prefix;
    if (commentInput && placeholderText) {
      commentInput.placeholder = placeholderText;
    }
  };

  topicChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      topicChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const prefix = chip.getAttribute("data-topic-prefix") || "[Вопрос руководителю] ";

      if (prefix.includes("Благодарность")) {
        setTopicByPrefix(prefix, "Напишите, кого из педагогов или сотрудников школы вы хотите поблагодарить...");
      } else if (prefix.includes("Предложение")) {
        setTopicByPrefix(prefix, "Опишите вашу идею или предложение по развитию школы, кружкам или мероприятиям...");
      } else {
        setTopicByPrefix(prefix, "Опишите ваш вопрос руководителю школы...");
      }
    });
  });

  try {
    const params = new URLSearchParams(window.location.search);
    const topicParam = params.get("topic");
    if (topicParam === "thanks" && topicChips[1]) topicChips[1].click();
    else if (topicParam === "idea" && topicChips[2]) topicChips[2].click();
    else if (topicParam === "question" && topicChips[0]) topicChips[0].click();
  } catch (_) {}

  acceptBtn.addEventListener("click", () => {
    isConsentConfirmed = true;
    formFieldset.disabled = false;
    submitBtn.disabled = false;

    consentStep.classList.add("hidden");
    consentStep.setAttribute("hidden", "");

    formStep.classList.remove("hidden");
    formStep.removeAttribute("hidden");
    formStep.setAttribute("aria-hidden", "false");

    if (stepInd1 && stepInd2) {
      stepInd1.classList.remove("active");
      stepInd2.classList.add("active");
    }

    fioInput.focus();
  });

  const validateFio = () => {
    const cleanVal = sanitizeInput(fioInput.value, 120).replace(/\s+/g, " ");
    const onlyLettersAndSpaces = /^[А-Яа-яЁёA-Za-z\s]+$/.test(cleanVal);
    const words = cleanVal.split(" ").filter((w) => w.length >= 2);
    const isValid = onlyLettersAndSpaces && words.length >= 2;

    fioInput.classList.toggle("is-valid", isValid);
    fioInput.classList.toggle("is-invalid", !isValid && cleanVal.length > 0);

    if (!isValid && cleanVal.length > 0) {
      fioHint.textContent = "Введите минимум 2 слова (только буквы и пробелы, без цифр и символов)";
      fioHint.className = "field-hint error-text";
    } else if (isValid) {
      fioHint.textContent = "✓ ФИО заполнено корректно";
      fioHint.className = "field-hint valid-text";
    } else {
      fioHint.textContent = "Только буквы и пробелы, минимум 2 слова";
      fioHint.className = "field-hint";
    }
    return isValid;
  };

  const validateContact = () => {
    const cleanVal = sanitizeInput(contactInput.value, 100);
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3,5}\)?[\s\-]?[0-9]{1,3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

    const isEmail = emailRegex.test(cleanVal);
    const isPhone = phoneRegex.test(cleanVal);
    const isValid = isEmail || isPhone;

    contactInput.classList.toggle("is-valid", isValid);
    contactInput.classList.toggle("is-invalid", !isValid && cleanVal.length > 0);

    if (isEmail) {
      contactHint.textContent = "✓ Распознан адрес электронной почты (Email)";
      contactHint.className = "field-hint valid-text";
    } else if (isPhone) {
      contactHint.textContent = "✓ Распознан контактный номер телефона";
      contactHint.className = "field-hint valid-text";
    } else if (cleanVal.length > 0) {
      contactHint.textContent = "Введите корректный телефон (+7 900 123-45-67) или Email";
      contactHint.className = "field-hint error-text";
    } else {
      contactHint.textContent = "Укажите удобный номер телефона или адрес электронной почты";
      contactHint.className = "field-hint";
    }
    return isValid;
  };

  const validateComment = () => {
    const cleanVal = sanitizeInput(commentInput.value, 2000);
    const isValid = cleanVal.length >= 5;

    commentInput.classList.toggle("is-valid", isValid);
    commentInput.classList.toggle("is-invalid", !isValid && cleanVal.length > 0);

    if (!isValid && cleanVal.length > 0) {
      commentHint.textContent = "Слишком короткое сообщение (минимум 5 символов)";
      commentHint.className = "field-hint error-text";
    } else if (isValid) {
      commentHint.textContent = "✓ Текст сообщения заполнен";
      commentHint.className = "field-hint valid-text";
    } else {
      commentHint.textContent = "Пожалуйста, напишите ваше сообщение (от 5 до 2000 символов)";
      commentHint.className = "field-hint";
    }
    return isValid;
  };

  fioInput.addEventListener("input", validateFio);
  contactInput.addEventListener("input", validateContact);
  commentInput.addEventListener("input", validateComment);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!isConsentConfirmed || formFieldset.disabled) return;

    formResponse.classList.add("hidden");

    const isFioOk = validateFio();
    const isContactOk = validateContact();
    const isCommentOk = validateComment();

    if (!isFioOk || !isContactOk || !isCommentOk) {
      formResponse.textContent = "Пожалуйста, проверьте правильность заполнения выделенных полей.";
      formResponse.className = "form-response error";
      formResponse.classList.remove("hidden");
      return;
    }

    const sanitizedFio = sanitizeInput(fioInput.value, 120).replace(/\s+/g, " ");
    const sanitizedContact = sanitizeInput(contactInput.value, 100);
    const sanitizedComment = sanitizeInput(`${selectedTopicPrefix}${commentInput.value}`, 2000);

    submitBtn.disabled = true;
    submitBtnText.textContent = "Отправка сообщения...";
    submitLoader.classList.remove("hidden");

    const formDataParams = new URLSearchParams();
    formDataParams.append("fio", sanitizedFio);
    formDataParams.append("contact", sanitizedContact);
    formDataParams.append("comment", sanitizedComment);

    try {
      const response = await fetch(FEEDBACK_POST_URL, {
        method: "POST",
        body: formDataParams
      });

      if (!response.ok && response.type !== "opaque") {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      formResponse.textContent = "Спасибо! Ваше сообщение успешно записано в реестр школы и передано руководителю филиала.";
      formResponse.className = "form-response success";
      formResponse.classList.remove("hidden");

      form.reset();
      [fioInput, contactInput, commentInput].forEach((el) => {
        el.classList.remove("is-valid", "is-invalid");
      });
    } catch (_) {
      formResponse.textContent = "Не удалось отправить сообщение. Проверьте подключение к интернету и попробуйте снова.";
      formResponse.className = "form-response error";
      formResponse.classList.remove("hidden");
    } finally {
      submitBtn.disabled = false;
      submitBtnText.textContent = "Отправить сообщение в школу";
      submitLoader.classList.add("hidden");
    }
  });
}

/* ==========================================================================
   8. АНИМАЦИЯ ПОЯВЛЕНИЯ, СЧЕТЧИКИ, ФИЛЬТР ПЕДАГОГОВ И SERVICE WORKER
   ========================================================================== */
function initScrollRevealAndCounters() {
  const revealElements = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll("[data-target]");

  if (!("IntersectionObserver" in window) || document.body.classList.contains("visually-impaired")) {
    revealElements.forEach((el) => el.classList.add("visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute("data-target"));
    const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1100;
    const startTime = performance.now();

    const step = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = (target * easeOut).toFixed(decimals);
      el.textContent = `${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${target.toFixed(decimals)}${suffix}`;
      }
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

function initTeacherFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  if (filterBtns.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-filter");
      const teacherCards = document.querySelectorAll("#teachers-grid .teacher-card");

      teacherCards.forEach((card) => {
        const cardCat = card.getAttribute("data-category");
        const shouldShow = category === "all" || cardCat === category;
        card.classList.toggle("hidden", !shouldShow);
      });
    });
  });
}

function registerOfflineServiceWorker() {
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}
