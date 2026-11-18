/**
 * Основной скрипт сайта Ямбирнского филиала МОУ «Лесно-Конобеевская СШ»
 * Включает:
 * 1) Интерактивный движок "Живая школьная доска: от 1 до 11 класса" (Human Student Cadence & Wet-Wipe Physics)
 * 2) Расписание для 1–11 классов с автоконвертацией в карточки дневника и живым прогрессом текущего урока
 * 3) Динамическое чтение времени звонков из Google Таблицы (A28:B35) с автовозвратом к стандарту
 * 4) Отправку расписания и утренней погоды в родительский чат в 1 клик ("📤 В чат")
 * 5) Фотогалерею с Lightbox и управлением из таблицы, капсулу Dynamic Island и квитанцию 152-ФЗ
 */

// [PRESERVED]: Контракты эндпоинтов, координат и ключей локального хранилища
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1w6Z_wfOYJVKxtMHhz9ut6euiLY3YtkkOGNj1Wd_Pr0yJTdmKruN19uZYEyXpLZQSQPQgGHH9i84a/pub?output=csv";
const FEEDBACK_POST_URL = "https://script.google.com/macros/s/AKfycbzCzPpC8lYIeG_GkCYJKTJAhXjM4Ti0vO_9njDpi7lPdC1Rr2Ue8REEE38Tv_dou3X1Kg/exec";

const YAMBIRNO_LAT = 54.1286;
const YAMBIRNO_LON = 41.9708;

const A11Y_STORAGE_KEY = "yambirno_visually_impaired";
const GRADE_STORAGE_KEY = "yambirno_selected_grade";
const SHEET_CACHE_KEY = "yambirno_live_sheet_cache_v10";

// [PRESERVED]: Палитра векторных аватаров учителей
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

// [PRESERVED]: Полные названия учебных дней недели
const DAY_NAMES_FULL = {
  1: "Понедельник",
  2: "Вторник",
  3: "Среда",
  4: "Четверг",
  5: "Пятница"
};

// [PRESERVED]: Стандартное время звонков (используется по умолчанию, если в таблице ячейка пустая)
const DEFAULT_BELL_TIMES = {
  1: { start: "08:30", end: "09:15", startMin: 510, endMin: 555 },
  2: { start: "09:25", end: "10:10", startMin: 565, endMin: 610 },
  3: { start: "10:25", end: "11:10", startMin: 625, endMin: 670 },
  4: { start: "11:25", end: "12:10", startMin: 685, endMin: 730 },
  5: { start: "12:20", end: "13:05", startMin: 740, endMin: 785 },
  6: { start: "13:15", end: "14:00", startMin: 795, endMin: 840 },
  7: { start: "14:10", end: "14:55", startMin: 850, endMin: 895 }
};

let activeBellTimes = cloneDefaultBells();
let isCustomBellScheduleActive = false;

// [PRESERVED]: Клонирование базовой сетки звонков
function cloneDefaultBells() {
  const copy = {};
  Object.keys(DEFAULT_BELL_TIMES).forEach((k) => {
    copy[k] = { ...DEFAULT_BELL_TIMES[k] };
  });
  return copy;
}

// [PRESERVED]: Программа примеров для движка "Живая школьная доска" (от 1 до 11 класса)
const CHALKBOARD_CURRICULUM = [
  {
    grade: 1,
    badge: "1 класс • Арифметика",
    topic: "Тема урока: Сложение чисел в пределах 10",
    problem: "3 + 2",
    steps: " = 3 + 1 + 1",
    answer: " = 5"
  },
  {
    grade: 2,
    badge: "2 класс • Математика",
    topic: "Тема урока: Таблица умножения",
    problem: "6 × 4",
    steps: " = 6 + 6 + 6 + 6",
    answer: " = 24"
  },
  {
    grade: 3,
    badge: "3 класс • Математика",
    topic: "Тема урока: Взаимосвязь умножения и деления",
    problem: "48 : 6",
    steps: " (так как 6 × 8 = 48)",
    answer: " = 8"
  },
  {
    grade: 4,
    badge: "4 класс • Задачи на движение",
    topic: "Тема урока: Формула пути S = v · t",
    problem: "S = 12 км/ч × 3 ч",
    steps: " = 12 · 3",
    answer: " = 36 км"
  },
  {
    grade: 5,
    badge: "5 класс • Обыкновенные дроби",
    topic: "Тема урока: Сложение дробей с одинаковым знаменателем",
    problem: "2/7 + 3/7",
    steps: " = (2 + 3) / 7",
    answer: " = 5/7"
  },
  {
    grade: 6,
    badge: "6 класс • Введение в алгебру",
    topic: "Тема урока: Решение линейных уравнений",
    problem: "3x − 7 = 8",
    steps: " → 3x = 8 + 7 → 3x = 15",
    answer: " → x = 5"
  },
  {
    grade: 7,
    badge: "7 класс • Алгебра",
    topic: "Тема урока: Формулы сокращённого умножения",
    problem: "(a + b)²",
    steps: " = (a + b)(a + b)",
    answer: " = a² + 2ab + b²"
  },
  {
    grade: 8,
    badge: "8 класс • Алгебра",
    topic: "Тема урока: Квадратное уравнение и дискриминант",
    problem: "x² − 5x + 6 = 0",
    steps: " → D = 25 − 24 = 1",
    answer: " → x₁ = 2, x₂ = 3"
  },
  {
    grade: 9,
    badge: "9 класс • Подготовка к ОГЭ",
    topic: "Тема урока: Теорема Пифагора",
    problem: "a = 3, b = 4, c = √(a² + b²)",
    steps: " = √(9 + 16) = √25",
    answer: " = 5"
  },
  {
    grade: 10,
    badge: "10 класс • Тригонометрия",
    topic: "Тема урока: Основное тригонометрическое тождество",
    problem: "sin²α + cos²α",
    steps: " = (a/c)² + (b/c)² = c²/c²",
    answer: " = 1"
  },
  {
    grade: 11,
    badge: "11 класс • Математический анализ (ЕГЭ)",
    topic: "Тема урока: Производная и точки экстремума",
    problem: "f(x) = x³ − 3x",
    steps: " → f'(x) = 3x² − 3 = 0",
    answer: " → x = ±1"
  }
];

// [PRESERVED]: Резервные тексты меню по СанПиН
const DEFAULT_SANPIN_BREAKFAST =
  "Горячее блюдо, витаминизированный горячий напиток, хлебобулочное/молочное изделие согласно утверждённому 10-дневному цикличному меню.";
const DEFAULT_SANPIN_LUNCH =
  "Первое горячее блюдо, порционное мясное/рыбное блюдо с гарниром, сезонная овощная нарезка/салат, напиток по нормам СанПиН.";
const DEFAULT_SANPIN_NOTE =
  "Фактическое ежедневное меню заверяется руководителем и размещается на информационном стенде школьной столовой.";

// [PRESERVED]: Базовое расписание 1–11 классов (фоллбэк до загрузки CSV)
const DEFAULT_GRADE_SCHEDULES = {
  1: {
    1: "1. Разговоры о важном 2. Обучение грамоте 3. Письмо 4. Математика",
    2: "1. Обучение грамоте 2. Письмо 3. Математика 4. Окружающий мир",
    3: "1. Обучение грамоте 2. Письмо 3. Математика 4. Физкультура",
    4: "1. Обучение грамоте 2. Письмо 3. Музыка 4. ИЗО",
    5: "1. Обучение грамоте 2. Окружающий мир 3. Труд (технология) 4. Физкультура"
  },
  2: {
    1: "1. Разговоры о важном 2. Русский язык 3. Математика 4. Литературное чтение",
    2: "1. Русский язык 2. Математика 3. Английский язык 4. Окружающий мир",
    3: "1. Математика 2. Русский язык 3. Литературное чтение 4. Физкультура",
    4: "1. Русский язык 2. Математика 3. Английский язык 4. Музыка",
    5: "1. Русский язык 2. Литературное чтение 3. ИЗО 4. Труд (технология)"
  },
  3: {
    1: "1. Разговоры о важном 2. Русский язык 3. Математика 4. Литературное чтение",
    2: "1. Математика 2. Русский язык 3. Английский язык 4. Окружающий мир",
    3: "1. Русский язык 2. Математика 3. Литературное чтение 4. Физкультура",
    4: "1. Математика 2. Русский язык 3. Английский язык 4. Музыка",
    5: "1. Русский язык 2. Окружающий мир 3. ИЗО 4. Труд (технология)"
  },
  4: {
    1: "1. Разговоры о важном 2. Русский язык 3. Математика 4. Литературное чтение",
    2: "1. Русский язык 2. Математика 3. Английский язык 4. Окружающий мир",
    3: "1. Математика 2. Русский язык 3. ОРКСЭ 4. Физкультура",
    4: "1. Русский язык 2. Математика 3. Английский язык 4. Литературное чтение",
    5: "1. Русский язык 2. Окружающий мир 3. ИЗО 4. Труд (технология)"
  },
  5: {
    1: "1. Разговоры о важном 2. Русский язык 3. Математика 4. История 5. Биология",
    2: "1. Математика 2. Русский язык 3. Английский язык 4. Литература 5. Физкультура",
    3: "1. Русский язык 2. Математика 3. География 4. Литература 5. Труд (технология)",
    4: "1. Математика 2. Русский язык 3. История 4. Английский язык 5. Музыка",
    5: "1. Русский язык 2. Математика 3. Литература 4. ИЗО 5. Физкультура"
  },
  6: {
    1: "1. Разговоры о важном 2. Русский язык 3. Математика 4. История 5. Биология",
    2: "1. Математика 2. Русский язык 3. Английский язык 4. География 5. Литература",
    3: "1. Русский язык 2. Математика 3. Обществознание 4. Литература 5. Физкультура",
    4: "1. Математика 2. Русский язык 3. История 4. Английский язык 5. Труд (технология)",
    5: "1. Русский язык 2. Математика 3. Литература 4. Музыка / ИЗО 5. Физкультура"
  },
  7: {
    1: "1. Разговоры о важном 2. Русский язык 3. Алгебра 4. Физика 5. История",
    2: "1. Геометрия 2. Русский язык 3. Английский язык 4. География 5. Биология",
    3: "1. Алгебра 2. Русский язык 3. Литература 4. Физика 5. Информатика",
    4: "1. Геометрия 2. Русский язык 3. История 4. Обществознание 5. Английский язык",
    5: "1. Алгебра 2. Литература 3. География 4. Труд (технология) 5. Физкультура"
  },
  8: {
    1: "1. Разговоры о важном 2. Алгебра 3. Русский язык 4. Химия 5. История 6. Биология",
    2: "1. Геометрия 2. Литература 3. Английский язык 4. Физика 5. География 6. Физкультура",
    3: "1. Алгебра 2. Русский язык 3. Химия 4. Обществознание 5. Информатика 6. ОБЗР",
    4: "1. Геометрия 2. Русский язык 3. История 4. Физика 5. Английский язык 6. Биология",
    5: "1. Алгебра 2. Литература 3. География 4. Английский язык 5. Профориентация 6. Физкультура"
  },
  9: {
    1: "1. Разговоры о важном 2. Алгебра 3. Русский язык 4. Физика 5. История 6. Химия",
    2: "1. Геометрия 2. Литература 3. Английский язык 4. Обществознание 5. Биология 6. Информатика",
    3: "1. Алгебра 2. Русский язык 3. Химия 4. География 5. Физика 6. Физкультура",
    4: "1. Геометрия 2. Русский язык 3. История 4. Литература 5. Английский язык 6. ОБЗР",
    5: "1. Алгебра 2. Литература 3. Физика 4. Химия 5. Биология 6. Консультация ОГЭ"
  },
  10: {
    1: "1. Разговоры о важном 2. Алгебра 3. Русский язык 4. Физика 5. История 6. Английский язык",
    2: "1. Геометрия 2. Литература 3. Химия 4. Обществознание 5. Биология 6. Информатика",
    3: "1. Алгебра 2. Русский язык 3. История 4. География 5. Физика 6. Физкультура",
    4: "1. Геометрия 2. Литература 3. Обществознание 4. Английский язык 5. ОБЗР 6. Индивидуальный проект",
    5: "1. Алгебра 2. Литература 3. Физика 4. Химия 5. Биология 6. Физкультура"
  },
  11: {
    1: "1. Разговоры о важном 2. Алгебра 3. Русский язык 4. Физика 5. История 6. Химия",
    2: "1. Геометрия 2. Литература 3. Английский язык 4. Обществознание 5. Биология 6. Информатика",
    3: "1. Алгебра 2. Русский язык 3. Химия 4. География 5. Физика 6. Физкультура",
    4: "1. Геометрия 2. Русский язык 3. История 4. Литература 5. Английский язык 6. ОБЗР",
    5: "1. Алгебра 2. Литература 3. Физика 4. Обществознание 5. Практикум ЕГЭ 6. Физкультура"
  }
};

let customSheetSchoolStatus = "";
let latestParsedSheetData = null;
let currentSelectedWeekday = getDefaultSchoolWeekday();
let currentSelectedGrade = getSavedGradeSelection();
let toastTimeoutId = null;

// [PRESERVED]: Вычисление текущего учебного дня недели
function getDefaultSchoolWeekday() {
  const jsDay = new Date().getDay();
  return jsDay >= 1 && jsDay <= 5 ? jsDay : 1;
}

// [PRESERVED]: Чтение выбранного класса из localStorage
function getSavedGradeSelection() {
  try {
    const saved = parseInt(localStorage.getItem(GRADE_STORAGE_KEY) || "1", 10);
    if (saved >= 1 && saved <= 11) return saved;
  } catch (_) {}
  return 1;
}

// [PRESERVED]: Защита от XSS и формульных инъекций CSV
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

// [PRESERVED]: Показ всплывающей капсулы уведомлений Dynamic Island
function showDynamicIslandToast(message) {
  const toast = document.getElementById("dynamic-island-toast");
  const textEl = document.getElementById("dynamic-island-text");
  if (!toast || !textEl) return;

  textEl.textContent = message;
  toast.setAttribute("aria-hidden", "false");
  toast.classList.add("show");

  if (toastTimeoutId) clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => {
    toast.classList.remove("show");
    toast.setAttribute("aria-hidden", "true");
  }, 2600);
}

// [PRESERVED]: Генерация SVG-аватара по инициалам
function buildInitialsSvgDataUri(initials, index = 0) {
  const palette = AVATAR_PALETTES[index % AVATAR_PALETTES.length];
  const safeChars = sanitizeInput(initials, 3).toUpperCase() || "УЧ";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><circle cx='60' cy='60' r='60' fill='${palette.bg}'/><text x='60' y='70' font-family='sans-serif' font-size='34' font-weight='bold' fill='${palette.fg}' text-anchor='middle'>${safeChars}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// [PRESERVED]: Извлечение инициалов из ФИО педагога
function extractInitialsFromFio(fioString) {
  const parts = sanitizeInput(fioString, 120).split(/\s+/).filter(Boolean);
  if (parts.length >= 3) return (parts[1][0] + parts[2][0]).toUpperCase();
  if (parts.length === 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return "УЧ";
}

// [PRESERVED]: Разрешение ссылок Google Drive / Skrinshoter / прямых URL
function resolveImageLinkSource(rawUrlCell, fallbackSvg) {
  const cleaned = (rawUrlCell || "").trim();
  if (!cleaned) return { src: fallbackSvg, altTry: null, fallback: fallbackSvg };

  const driveMatch =
    cleaned.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    cleaned.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (cleaned.includes("drive.google.com") && driveMatch && driveMatch[1]) {
    return {
      src: `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w800`,
      altTry: null,
      fallback: fallbackSvg
    };
  }

  if (cleaned.includes("skrinshoter.ru")) {
    const hasImgExt = /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(cleaned);
    if (hasImgExt) {
      return {
        src: cleaned,
        altTry: `https://wsrv.nl/?url=${encodeURIComponent(cleaned)}&w=800`,
        fallback: fallbackSvg
      };
    }
    const cleanNoSlash = cleaned.replace(/\/+$/, "");
    return {
      src: `https://wsrv.nl/?url=${encodeURIComponent(cleanNoSlash)}&w=800`,
      altTry: `${cleanNoSlash}.jpg`,
      fallback: fallbackSvg
    };
  }

  const isSafeUrlOrPath =
    /^https?:\/\/[^\s"'<>]+$/i.test(cleaned) ||
    /^[a-zA-Z0-9_\-./]+\.(jpg|jpeg|png|webp|gif|svg)$/i.test(cleaned);

  if (isSafeUrlOrPath) {
    return {
      src: cleaned,
      altTry: cleaned.startsWith("http") ? `https://wsrv.nl/?url=${encodeURIComponent(cleaned)}&w=800` : null,
      fallback: fallbackSvg
    };
  }

  return { src: fallbackSvg, altTry: null, fallback: fallbackSvg };
}

// [PRESERVED]: Разрешение фото учителя или генерация инициалов
function resolveTeacherPhotoSource(rawPhotoCell, teacherFio, cardIndex) {
  const cleaned = (rawPhotoCell || "").trim();
  const fallbackSvg = buildInitialsSvgDataUri(extractInitialsFromFio(teacherFio), cardIndex);

  if (!cleaned) return { src: fallbackSvg, altTry: null, fallback: fallbackSvg };

  if (/^[А-Яа-яЁёA-Za-z]{1,3}$/.test(cleaned)) {
    const customSvg = buildInitialsSvgDataUri(cleaned, cardIndex);
    return { src: customSvg, altTry: null, fallback: customSvg };
  }

  return resolveImageLinkSource(cleaned, fallbackSvg);
}

// [PRESERVED]: Точка входа инициализации всех модулей
document.addEventListener("DOMContentLoaded", () => {
  initLiveDateTimeClockAndAmbient();
  initYambirnoWeatherWidget();
  initAccessibilityMode();
  initChalkboardEngine();
  initScrollRevealAndCounters();
  initDigitalNavigatorTabs();
  initWeekdayAndGradeSwitchers();
  initShareScheduleToChat();
  initCopyButtons();
  initGalleryLightbox();
  initScrollSpyAndProgressRing();
  initLiveSheetWidgetAndMenu();
  initFeedbackForm();
  registerOfflineServiceWorker();
});

/* ==========================================================================
   1. ИНТЕРАКТИВНЫЙ ДВИЖОК "ЖИВАЯ ШКОЛЬНАЯ ДОСКА: ПУТЬ ОТ 1 ДО 11 КЛАССА"
   ========================================================================== */
function initChalkboardEngine() {
  // [PRESERVED]: Все DOM-хуки школьной доски
  const widget = document.getElementById("chalkboard-widget");
  const badgeEl = document.getElementById("chalkboard-grade-badge");
  const statusEl = document.getElementById("chalkboard-status-pill");
  const topicEl = document.getElementById("chalkboard-topic");
  const problemEl = document.getElementById("chalkboard-problem");
  const stepsEl = document.getElementById("chalkboard-steps");
  const answerEl = document.getElementById("chalkboard-answer");
  const cursorEl = document.getElementById("chalkboard-cursor");
  const contentWrap = document.getElementById("chalkboard-content");
  const wetWipeEl = document.getElementById("chalkboard-wet-wipe");
  const counterEl = document.getElementById("chalkboard-step-counter");
  const quizToggleBtn = document.getElementById("chalkboard-quiz-toggle");
  const nextBtn = document.getElementById("chalkboard-next-btn");
  const revealBtn = document.getElementById("chalkboard-reveal-btn");

  if (!widget || !problemEl || !stepsEl || !answerEl) return;

  let currentIdx = 0;
  let isQuizMode = false;
  let isViewportVisible = true;
  let runToken = 0;
  let revealResolver = null;

  /* [PERF]: Детекция prefers-reduced-motion для снижения нагрузки на растр текста */
  const reducedMotionQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };

  // [PRESERVED]: Экономия ресурсов (Zero-Reflow CPU Saver) вне зоны видимости
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isViewportVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    obs.observe(widget);
  }

  const waitMs = (ms, token) =>
    new Promise((resolve) => {
      const check = () => {
        if (token !== runToken) {
          resolve(false);
          return;
        }
        if (document.hidden || !isViewportVisible) {
          setTimeout(check, 400);
          return;
        }
        setTimeout(() => resolve(token === runToken), ms);
      };
      check();
    });

  // [PRESERVED]: Посимвольное письмо с поддержкой мгновенного вывода при reduced-motion
  const typeChalkString = async (targetEl, text, token, baseSpeed = 58) => {
    if (reducedMotionQuery.matches || document.body.classList.contains("visually-impaired")) {
      targetEl.textContent = text;
      return token === runToken;
    }

    targetEl.textContent = "";
    for (let i = 0; i < text.length; i++) {
      if (token !== runToken) return false;
      const ch = text[i];
      targetEl.textContent += ch;

      let delay = baseSpeed + Math.floor(Math.random() * 42);
      if (ch === "=" || ch === "→" || ch === "+" || ch === "−") {
        delay += 110;
      }
      const ok = await waitMs(delay, token);
      if (!ok) return false;
    }
    return true;
  };

  const runStageLoop = async (token) => {
    while (token === runToken) {
      const item = CHALKBOARD_CURRICULUM[currentIdx];

      contentWrap.classList.remove("erasing");
      wetWipeEl.classList.remove("wiping");
      revealBtn.classList.add("hidden");
      problemEl.textContent = "";
      stepsEl.textContent = "";
      answerEl.textContent = "";
      if (cursorEl) cursorEl.classList.remove("thinking", "hidden");

      if (badgeEl) badgeEl.textContent = item.badge;
      if (topicEl) topicEl.textContent = item.topic;
      if (counterEl) counterEl.textContent = `Ступень ${item.grade} из 11`;

      // Фаза 1: Запись условия примера
      if (statusEl) statusEl.textContent = "Пишет условие у доски...";
      const ok1 = await typeChalkString(problemEl, item.problem, token, 62);
      if (!ok1) return;

      // Фаза 2: Задумчивость ученика ("Считает в уме...")
      if (cursorEl) cursorEl.classList.add("thinking");
      if (statusEl) statusEl.textContent = "💭 Считает в уме...";
      const ok2 = await waitMs(950, token);
      if (!ok2) return;

      // Если включен режим "💡 Решить самому" — ждём клика пользователя
      if (isQuizMode) {
        if (statusEl) statusEl.textContent = "Проверьте себя и нажмите кнопку ниже";
        revealBtn.classList.remove("hidden");
        const revealed = await new Promise((res) => {
          revealResolver = res;
        });
        revealResolver = null;
        revealBtn.classList.add("hidden");
        if (!revealed || token !== runToken) return;
      }

      // Фаза 3: Запись промежуточного хода решения
      if (cursorEl) cursorEl.classList.remove("thinking");
      if (statusEl) statusEl.textContent = "Расписывает решение...";
      const ok3 = await typeChalkString(stepsEl, item.steps, token, 52);
      if (!ok3) return;

      const okPause = await waitMs(480, token);
      if (!okPause) return;

      // Фаза 4: Запись итогового ответа жёлтым мелком
      if (statusEl) statusEl.textContent = "Выводит ответ...";
      const ok4 = await typeChalkString(answerEl, item.answer, token, 68);
      if (!ok4) return;

      if (statusEl) statusEl.textContent = "✓ Решено верно!";
      const okHold = await waitMs(2300, token);
      if (!okHold) return;

      // Фаза 5: Влажное стирание с доски (Compositor Wet-Wipe без filter: blur)
      if (statusEl) statusEl.textContent = "Стирает с доски...";
      wetWipeEl.classList.add("wiping");
      contentWrap.classList.add("erasing");

      const okWipe = await waitMs(750, token);
      if (!okWipe) return;

      currentIdx = (currentIdx + 1) % CHALKBOARD_CURRICULUM.length;
    }
  };

  const restartFromCurrent = () => {
    runToken++;
    if (revealResolver) {
      revealResolver(false);
      revealResolver = null;
    }
    runStageLoop(runToken);
  };

  if (quizToggleBtn) {
    quizToggleBtn.addEventListener("click", () => {
      isQuizMode = !isQuizMode;
      quizToggleBtn.setAttribute("aria-pressed", String(isQuizMode));
      quizToggleBtn.textContent = isQuizMode ? "💡 Режим: Сам" : "💡 Решить самому";
      showDynamicIslandToast(
        isQuizMode
          ? "Включён режим самопроверки на школьной доске"
          : "Включён автоматический показ решений на доске"
      );
      if (!isQuizMode && revealResolver) {
        revealResolver(true);
      }
    });
  }

  if (revealBtn) {
    revealBtn.addEventListener("click", () => {
      if (revealResolver) revealResolver(true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentIdx = (currentIdx + 1) % CHALKBOARD_CURRICULUM.length;
      restartFromCurrent();
    });
  }

  runStageLoop(runToken);
}

/* ==========================================================================
   2. ПАРСИНГ ВРЕМЕНИ ЗВОНКОВ И КАРТОЧКИ ДНЕВНИКА С ЖИВЫМ ЗАПОЛНЕНИЕМ УРОКА
   ========================================================================== */
// [PRESERVED]: Парсер диапазонов времени звонков
function parseBellTimeRangeString(rawRangeStr, lessonNum) {
  const fallback = DEFAULT_BELL_TIMES[lessonNum] || { start: "08:30", end: "09:15", startMin: 510, endMin: 555 };
  const cleaned = sanitizeInput(rawRangeStr || "", 40);
  if (!cleaned) return { ...fallback, isCustom: false };

  const match = cleaned.match(/(\d{1,2})[:.](\d{2})\s*[-–—]\s*(\d{1,2})[:.](\d{2})/);
  if (!match) return { ...fallback, isCustom: false };

  const sh = parseInt(match[1], 10);
  const sm = parseInt(match[2], 10);
  const eh = parseInt(match[3], 10);
  const em = parseInt(match[4], 10);

  if (sh > 23 || sm > 59 || eh > 23 || em > 29 && eh === 24 || em > 59) return { ...fallback, isCustom: false };

  const startFormatted = `${String(sh).padStart(2, "0")}:${String(sm).padStart(2, "0")}`;
  const endFormatted = `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;

  const isDifferentFromDefault =
    startFormatted !== fallback.start || endFormatted !== fallback.end;

  return {
    start: startFormatted,
    end: endFormatted,
    startMin,
    endMin: endMin > startMin ? endMin : startMin + 45,
    isCustom: isDifferentFromDefault
  };
}

// [PRESERVED]: Классификация предметов по цветовым кодам и иконкам
function classifyLessonSubject(subjectTitle) {
  const s = (subjectTitle || "").toLowerCase();
  if (s.includes("математ") || s.includes("алгебр") || s.includes("геометр") || s.includes("информат") || s.includes("физик") || s.includes("вероятност")) {
    return { cls: "subj-math", icon: "📐" };
  }
  if (s.includes("русск") || s.includes("литерат") || s.includes("чтени") || s.includes("грамот") || s.includes("письм") || s.includes("английск") || s.includes("родной")) {
    return { cls: "subj-lang", icon: "📖" };
  }
  if (s.includes("биолог") || s.includes("хими") || s.includes("географ") || s.includes("окружающ")) {
    return { cls: "subj-sci", icon: "🌿" };
  }
  if (s.includes("истори") || s.includes("обществ") || s.includes("важном") || s.includes("орксэ") || s.includes("профориент") || s.includes("проект")) {
    return { cls: "subj-hist", icon: "🏛️" };
  }
  return { cls: "subj-art", icon: "⚡" };
}

// [PRESERVED]: Разбор строки расписания на отдельные уроки
function parseRawScheduleIntoLessons(rawText) {
  const cleaned = sanitizeInput(rawText || "", 800);
  if (!cleaned) return [];

  const parts = cleaned
    .replace(/(\d+)\s*[.)]\s*/g, "\n$1. ")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return parts.map((item, idx) => {
    const match = item.match(/^(\d+)\.\s*(.+)$/);
    if (match) {
      return { num: parseInt(match[1], 10), title: match[2].trim() };
    }
    return { num: idx + 1, title: item };
  });
}

// [PRESERVED]: Отрисовка карточек дневника
/* [PERF]: Сборка строк через единый DocumentFragment исключает множественные синхронные вставки в живой DOM */
function renderDiaryLessonCards(containerEl, rawScheduleText, selectedDayNum) {
  if (!containerEl) return;

  const shiftBanner = document.getElementById("bell-shift-warning");
  if (shiftBanner) {
    shiftBanner.classList.toggle("hidden", !isCustomBellScheduleActive);
  }

  const lessons = parseRawScheduleIntoLessons(rawScheduleText);
  if (lessons.length === 0) {
    containerEl.textContent = "Занятия проводятся согласно основному расписанию уроков";
    return;
  }

  const now = new Date();
  const isTodaySelected = now.getDay() === selectedDayNum;
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
  const fragment = document.createDocumentFragment();

  lessons.forEach((lessonObj, idx) => {
    const row = document.createElement("div");
    const subjMeta = classifyLessonSubject(lessonObj.title);
    row.className = `diary-lesson-row ${subjMeta.cls}`;
    row.style.setProperty("--step", String(idx));

    const left = document.createElement("div");
    left.className = "diary-lesson-left";

    const numBadge = document.createElement("span");
    numBadge.className = "diary-lesson-num";
    numBadge.textContent = String(lessonObj.num);

    const iconSpan = document.createElement("span");
    iconSpan.className = "diary-lesson-icon";
    iconSpan.setAttribute("aria-hidden", "true");
    iconSpan.textContent = subjMeta.icon;

    const nameSpan = document.createElement("span");
    nameSpan.className = "diary-lesson-name";
    nameSpan.textContent = lessonObj.title;

    left.appendChild(numBadge);
    left.appendChild(iconSpan);
    left.appendChild(nameSpan);

    const right = document.createElement("div");
    right.className = "diary-lesson-right";

    const bell = activeBellTimes[lessonObj.num] || DEFAULT_BELL_TIMES[lessonObj.num];
    if (bell) {
      if (isTodaySelected && currentTotalMinutes >= bell.startMin && currentTotalMinutes <= bell.endMin) {
        const duration = Math.max(bell.endMin - bell.startMin, 1);
        const elapsed = currentTotalMinutes - bell.startMin;
        const pct = Math.min(Math.max(Math.round((elapsed / duration) * 100), 5), 98);
        const leftMin = Math.max(bell.endMin - currentTotalMinutes, 1);

        row.classList.add("lesson-active-now");
        row.style.setProperty("--lesson-progress", `${pct}%`);

        const livePill = document.createElement("span");
        livePill.className = "lesson-live-pill";
        livePill.textContent = `● Идёт (ещё ${leftMin} мин)`;
        right.appendChild(livePill);
      } else if (isTodaySelected && currentTotalMinutes > bell.endMin && currentTotalMinutes < 980) {
        const donePill = document.createElement("span");
        donePill.className = "lesson-done-pill";
        donePill.textContent = "✓ Прошёл";
        right.appendChild(donePill);
      }

      const timeSpan = document.createElement("span");
      timeSpan.className = "diary-lesson-time";
      timeSpan.textContent = `${bell.start}–${bell.end}`;
      right.appendChild(timeSpan);
    }

    row.appendChild(left);
    row.appendChild(right);
    fragment.appendChild(row);
  });

  containerEl.replaceChildren(fragment);
}

/* ==========================================================================
   3. КНОПКА "📤 В ЧАТ" (КОПИРОВАНИЕ РАСПИСАНИЯ И УТРЕННЕЙ ПОГОДЫ ДЛЯ МЕССЕНДЖЕРА)
   ========================================================================== */
function initShareScheduleToChat() {
  // [PRESERVED]: Обработчик кнопки отправки расписания в родительский чат
  const shareBtn = document.getElementById("share-schedule-btn");
  if (!shareBtn) return;

  shareBtn.addEventListener("click", async () => {
    const dayName = DAY_NAMES_FULL[currentSelectedWeekday] || "Понедельник";
    let rawSchedule = "";
    if (
      latestParsedSheetData &&
      latestParsedSheetData.scheduleByGradeAndDay &&
      latestParsedSheetData.scheduleByGradeAndDay[currentSelectedGrade] &&
      latestParsedSheetData.scheduleByGradeAndDay[currentSelectedGrade][currentSelectedWeekday]
    ) {
      rawSchedule = latestParsedSheetData.scheduleByGradeAndDay[currentSelectedGrade][currentSelectedWeekday];
    } else if (DEFAULT_GRADE_SCHEDULES[currentSelectedGrade]) {
      rawSchedule = DEFAULT_GRADE_SCHEDULES[currentSelectedGrade][currentSelectedWeekday] || "";
    }

    const lessons = parseRawScheduleIntoLessons(rawSchedule);
    const formattedLessons = lessons
      .map((l) => {
        const bell = activeBellTimes[l.num] || DEFAULT_BELL_TIMES[l.num];
        const timeStr = bell ? ` (${bell.start}–${bell.end})` : "";
        return `${l.num}. ${l.title}${timeStr}`;
      })
      .join("\n");

    const tomTemp = document.getElementById("weather-tomorrow-temp");
    const advice = document.getElementById("weather-parent-advice");
    const weatherLine = tomTemp && advice ? `\n\n🌤 Погода в Ямбирно к 1-му уроку: ${tomTemp.textContent.trim()}\n${advice.textContent.trim()}` : "";

    const textForChat =
      `📘 Расписание уроков — ${dayName} (${currentSelectedGrade} класс):\n` +
      (formattedLessons || "По основному расписанию") +
      weatherLine;

    try {
      await navigator.clipboard.writeText(textForChat);
      showDynamicIslandToast(`✓ Расписание ${currentSelectedGrade} класса скопировано для чата!`);
    } catch (_) {
      showDynamicIslandToast("✓ Расписание скопировано");
    }
  });
}

/* ==========================================================================
   4. ЖИВЫЕ ЧАСЫ, ДАТА, СТАТУС ШКОЛЫ И AMBIENT-АТМОСФЕРА
   ========================================================================== */
function initLiveDateTimeClockAndAmbient() {
  // [PRESERVED]: Узлы часов, даты, статуса и атмосферы Hero
  const dateEl = document.getElementById("live-date-display");
  const timeEl = document.getElementById("live-time-display");
  const statusEl = document.getElementById("school-day-status");
  const widgetTodayPill = document.getElementById("widget-today-pill");
  const heroAmbient = document.getElementById("hero-ambient");

  /* [PERF]: Кэширование отформатированной даты и часа, чтобы не вызывать тяжёлый Intl.DateTimeFormat каждую секунду на слабом CPU */
  let lastRenderedDayKey = "";
  let lastRenderedStatusKey = "";

  const updateClock = () => {
    /* [PERF]: Не будим CPU и не мутируем DOM, когда вкладка свёрнута */
    if (document.hidden) return;

    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const dayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${hour}`;

    if (timeEl) {
      timeEl.textContent = now.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    }

    if (dayKey !== lastRenderedDayKey) {
      lastRenderedDayKey = dayKey;

      if (heroAmbient) {
        heroAmbient.classList.toggle("ambient-morning", hour >= 6 && hour < 11);
        heroAmbient.classList.toggle("ambient-evening", hour >= 17 || hour < 6);
      }

      if (dateEl) {
        const dateFormatted = now.toLocaleDateString("ru-RU", {
          weekday: "short",
          day: "numeric",
          month: "long",
          year: "numeric"
        });
        dateEl.textContent = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);
      }

      if (widgetTodayPill) {
        const shortDate = now.toLocaleDateString("ru-RU", { day: "2-digit", month: "long" });
        widgetTodayPill.textContent = `📅 Сегодня, ${shortDate}`;
      }
    }

    if (statusEl) {
      const statusKey = `${customSheetSchoolStatus}|${day}|${hour}`;
      if (statusKey !== lastRenderedStatusKey) {
        lastRenderedStatusKey = statusKey;
        if (customSheetSchoolStatus) {
          statusEl.textContent = `🟢 ${customSheetSchoolStatus}`;
        } else if (day === 0 || day === 6) {
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
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateClock();
  });
}

/* ==========================================================================
   5. ПРОГНОЗ ПОГОДЫ В С. ЯМБИРНО (С МИКРО-АТМОСФЕРОЙ НЕБА)
   ========================================================================== */
// [PRESERVED]: Декодер кодов погоды WMO
function decodeWmoWeather(code) {
  if (code === 0) return { icon: "☀️", text: "Ясно", rain: false, snow: false, sky: "clear" };
  if (code === 1 || code === 2) return { icon: "🌤️", text: "Переменная облачность", rain: false, snow: false, sky: "clear" };
  if (code === 3) return { icon: "☁️", text: "Пасмурно", rain: false, snow: false, sky: "cloudy" };
  if (code === 45 || code === 48) return { icon: "🌫️", text: "Туман", rain: false, snow: false, sky: "cloudy" };
  if (code >= 51 && code <= 57) return { icon: "🌦️", text: "Морось", rain: true, snow: false, sky: "rain" };
  if (code >= 61 && code <= 67) return { icon: "🌧️", text: "Дождь", rain: true, snow: false, sky: "rain" };
  if (code >= 71 && code <= 77) return { icon: "❄️", text: "Снег", rain: false, snow: true, sky: "snow" };
  if (code >= 80 && code <= 82) return { icon: "🌧️", text: "Ливень", rain: true, snow: false, sky: "rain" };
  if (code === 85 || code === 86) return { icon: "🌨️", text: "Снегопад", rain: false, snow: true, sky: "snow" };
  if (code >= 95) return { icon: "⛈️", text: "Гроза", rain: true, snow: false, sky: "rain" };
  return { icon: "🌤️", text: "Без осадков", rain: false, snow: false, sky: "clear" };
}

// [PRESERVED]: Загрузка метеоданных Open-Meteo для с. Ямбирно
async function initYambirnoWeatherWidget() {
  const weatherBox = document.getElementById("yambirno-weather-box");
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

    const curTemp = Math.round(data.current.temperature_2m);
    const curSign = curTemp > 0 ? `+${curTemp}°C` : `${curTemp}°C`;
    const curWmo = decodeWmoWeather(data.current.weather_code);
    const curWind = Math.round(data.current.wind_speed_10m);

    if (weatherBox) {
      weatherBox.classList.remove("weather-sky-clear", "weather-sky-rain", "weather-sky-snow");
      if (curWmo.sky === "clear") weatherBox.classList.add("weather-sky-clear");
      if (curWmo.sky === "rain") weatherBox.classList.add("weather-sky-rain");
      if (curWmo.sky === "snow") weatherBox.classList.add("weather-sky-snow");
    }

    if (topPill) topPill.textContent = `${curWmo.icon} с. Ямбирно: ${curSign}`;
    if (nowIconEl) nowIconEl.textContent = curWmo.icon;
    if (nowTempEl) nowTempEl.textContent = curSign;
    if (nowDescEl) nowDescEl.textContent = `${curWmo.text}, ветер ${curWind} м/с`;

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
   6. ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ
   ========================================================================== */
function initAccessibilityMode() {
  // [PRESERVED]: Переключатель режима слабовидящих и сохранение в localStorage
  const toggleBtn = document.getElementById("a11y-toggle");
  if (!toggleBtn) return;

  const applyMode = (isEnabled, announce = false) => {
    document.body.classList.toggle("visually-impaired", isEnabled);
    toggleBtn.setAttribute("aria-pressed", String(isEnabled));
    toggleBtn.setAttribute("aria-label", "Версия для слабовидящих");

    const textSpan = toggleBtn.querySelector(".a11y-btn-text");
    if (textSpan) {
      textSpan.textContent = isEnabled ? "✕ Обычный вид сайта" : "Версия для слабовидящих";
    }
    if (announce) {
      showDynamicIslandToast(isEnabled ? "Включена версия для слабовидящих" : "Включён обычный вид сайта");
    }
  };

  let savedState = false;
  try {
    savedState = localStorage.getItem(A11Y_STORAGE_KEY) === "true";
  } catch (_) {}

  applyMode(savedState, false);

  toggleBtn.addEventListener("click", () => {
    const nextState = !document.body.classList.contains("visually-impaired");
    applyMode(nextState, true);
    try {
      localStorage.setItem(A11Y_STORAGE_KEY, String(nextState));
    } catch (_) {}
  });
}
/* ==========================================================================
   7. ФОТОГАЛЕРЕЯ И МОДАЛЬНЫЙ ПРОСМОТРЩИК LIGHTBOX
   ========================================================================== */
// [PRESERVED]: Обновление карточек фотогалереи из строк Google Таблицы
function updateGalleryFromSheetRows(galleryArray) {
  if (!Array.isArray(galleryArray) || galleryArray.length === 0) return;

  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  const existingItems = Array.from(grid.querySelectorAll(".gallery-item"));
  /* [PERF]: Батчинг новых узлов через DocumentFragment, чтобы не вызывать множественный Reflow */
  const newItemsFragment = document.createDocumentFragment();

  galleryArray.forEach((itemData, idx) => {
    if (!itemData) return;

    let figure = existingItems[idx];
    const isNewFigure = !figure;
    if (isNewFigure) {
      figure = document.createElement("figure");
      figure.className = "gallery-item surface-card elevate-card reveal visible";
      figure.setAttribute("tabindex", "0");
      figure.setAttribute("role", "button");
      figure.innerHTML = `
        <div class="gallery-img-wrap">
          <img src="" alt="" class="gallery-img" loading="lazy" decoding="async" referrerpolicy="no-referrer">
          <span class="gallery-zoom-badge" aria-hidden="true">🔍 Увеличить</span>
        </div>
        <figcaption class="gallery-caption"></figcaption>
      `;
    }

    const imgEl = figure.querySelector(".gallery-img");
    const capEl = figure.querySelector(".gallery-caption");
    const defaultSvg = imgEl ? imgEl.getAttribute("src") : "";

    const newTitle = itemData.title || (capEl ? capEl.textContent : `Школьная жизнь #${idx + 1}`);
    const newDesc = itemData.desc || figure.getAttribute("data-desc") || newTitle;

    figure.setAttribute("data-caption", newTitle);
    figure.setAttribute("data-desc", newDesc);
    figure.setAttribute("aria-label", `Открыть фото: ${newTitle}`);
    if (capEl && itemData.title) capEl.textContent = itemData.title;

    if (imgEl && itemData.url) {
      const resolved = resolveImageLinkSource(itemData.url, defaultSvg);
      let triedAlt = false;
      imgEl.onerror = () => {
        if (!triedAlt && resolved.altTry) {
          triedAlt = true;
          imgEl.src = resolved.altTry;
        } else {
          imgEl.onerror = null;
          imgEl.src = resolved.fallback;
        }
      };
      imgEl.src = resolved.src;
      imgEl.alt = newTitle;
    }

    if (isNewFigure) {
      newItemsFragment.appendChild(figure);
    }
  });

  if (newItemsFragment.childNodes.length > 0) {
    grid.appendChild(newItemsFragment);
  }
}

// [PRESERVED]: Модальный просмотрщик фотографий Lightbox
function initGalleryLightbox() {
  const grid = document.getElementById("gallery-grid");
  const lightbox = document.getElementById("gallery-lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbTitle = document.getElementById("lightbox-title");
  const lbDesc = document.getElementById("lightbox-desc");
  const lbCounter = document.getElementById("lightbox-counter");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  if (!grid || !lightbox || !lbImg) return;

  let currentSlideIdx = 0;

  const getFigures = () => Array.from(grid.querySelectorAll(".gallery-item"));

  const openLightboxAt = (idx) => {
    const figures = getFigures();
    if (figures.length === 0) return;

    currentSlideIdx = (idx + figures.length) % figures.length;
    const fig = figures[currentSlideIdx];
    const imgEl = fig.querySelector(".gallery-img");

    lbImg.src = imgEl ? imgEl.src : "";
    lbImg.alt = fig.getAttribute("data-caption") || "";
    if (lbTitle) lbTitle.textContent = fig.getAttribute("data-caption") || "";
    if (lbDesc) lbDesc.textContent = fig.getAttribute("data-desc") || "";
    if (lbCounter) lbCounter.textContent = `${currentSlideIdx + 1} / ${figures.length}`;

    lightbox.classList.remove("hidden");
    lightbox.removeAttribute("hidden");
  };

  const closeLightbox = () => {
    lightbox.classList.add("hidden");
    lightbox.setAttribute("hidden", "");
  };

  grid.addEventListener("click", (e) => {
    const fig = e.target.closest(".gallery-item");
    if (!fig) return;
    const idx = getFigures().indexOf(fig);
    if (idx !== -1) openLightboxAt(idx);
  });

  grid.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const fig = e.target.closest(".gallery-item");
      if (!fig) return;
      e.preventDefault();
      const idx = getFigures().indexOf(fig);
      if (idx !== -1) openLightboxAt(idx);
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn) prevBtn.addEventListener("click", () => openLightboxAt(currentSlideIdx - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => openLightboxAt(currentSlideIdx + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightboxAt(currentSlideIdx - 1);
    if (e.key === "ArrowRight") openLightboxAt(currentSlideIdx + 1);
  });
}

/* ==========================================================================
   8. ДИНАМИЧЕСКОЕ ОБНОВЛЕНИЕ КАРТОЧЕК УЧИТЕЛЕЙ (БЕЗ КНОПОК ФИЛЬТРАЦИИ)
   ========================================================================== */
// [PRESERVED]: Фабрика карточки учителя с асинхронным декодированием фото
function createNewTeacherCardElement() {
  const article = document.createElement("article");
  article.className = "teacher-card surface-card elevate-card reveal visible";
  article.setAttribute("data-category", "main");

  article.innerHTML = `
    <div class="teacher-photo-wrap">
      <img src="" alt="" class="teacher-photo" width="96" height="96" loading="lazy" decoding="async" referrerpolicy="no-referrer">
    </div>
    <span class="teacher-badge">Основной состав</span>
    <h3 class="teacher-name"></h3>
    <p class="teacher-role"></p>
    <p class="teacher-meta"></p>
  `;
  return article;
}

// [PRESERVED]: Заполнение данных одного педагога
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

// [PRESERVED]: Пакетное обновление сетки учителей из Google Таблицы
function updateTeachersFromSheetRows(teachersDataArray) {
  if (!Array.isArray(teachersDataArray) || teachersDataArray.length === 0) return;

  const grid = document.getElementById("teachers-grid");
  if (!grid) return;

  const existingCards = Array.from(grid.querySelectorAll(".teacher-card"));
  /* [PERF]: Вставка новых карточек единым батчем через DocumentFragment */
  const newCardsFragment = document.createDocumentFragment();

  teachersDataArray.forEach((rowData, idx) => {
    if (!rowData) return;

    let card = existingCards[idx];
    const isNewCard = !card;
    if (isNewCard) {
      card = createNewTeacherCardElement();
    }

    const fioLower = (rowData.fio || "").toLowerCase();
    if (fioLower === "-" || fioLower === "удалить" || fioLower === "скрыть") {
      if (!isNewCard) card.remove();
      return;
    }

    populateSingleTeacherCard(card, rowData, idx);
    if (isNewCard) {
      newCardsFragment.appendChild(card);
    }
  });

  if (newCardsFragment.childNodes.length > 0) {
    grid.appendChild(newCardsFragment);
  }

  const allCards = grid.querySelectorAll(".teacher-card");
  const mainCards = grid.querySelectorAll('.teacher-card[data-category="main"]');
  const partTimeCards = grid.querySelectorAll('.teacher-card[data-category="part-time"]');
  const subtitleEl = document.getElementById("teachers-subtitle");

  if (subtitleEl) {
    subtitleEl.textContent = `Главная опора Ямбирнского филиала: ${mainCards.length} основных педагогов и ${partTimeCards.length} совместителя (всего ${allCards.length})`;
  }
}

/* ==========================================================================
   9. ПЕРЕКЛЮЧАТЕЛИ ДНЕЙ НЕДЕЛИ (ПН–ПТ) И КЛАССОВ (1–11 КЛАСС)
   ========================================================================== */
// [PRESERVED]: Слушатели переключения дней недели и классов
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

// [PRESERVED]: Синхронизация активных кнопок дня и класса
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

// [PRESERVED]: Отрисовка расписания и меню для выбранного дня и класса
function renderDaySpecificScheduleAndMenu(dataObj, dayNum, gradeNum = 1) {
  const scheduleEl = document.getElementById("col-schedule");
  const menuBreakfastEl = document.getElementById("menu-breakfast");
  const menuLunchEl = document.getElementById("menu-lunch");
  const menuNoteEl = document.getElementById("menu-note");

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

  renderDiaryLessonCards(scheduleEl, scheduleText, dayNum);

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
   10. ЧТЕНИЕ GOOGLE ТАБЛИЦЫ (1–11 КЛ., ЗВОНКИ A28:B35, ГАЛЕРЕЯ, УЧИТЕЛЯ)
   ========================================================================== */
// [PRESERVED]: Детекторы строк CSV-таблицы
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
  const match = s.match(/^([1-9]|10|11)\s*(класс|кл\.?|кл)$/i);
  if (match && match[1]) return parseInt(match[1], 10);
  return 0;
}

function detectBellLessonNumberFromCell(cellString) {
  const s = (cellString || "").toLowerCase().trim();
  const match = s.match(/^([1-7])\s*(урок|ур\.?)$/i);
  if (match && match[1]) return parseInt(match[1], 10);
  return 0;
}

function detectPhotoRowFromCell(cellString) {
  const s = (cellString || "").toLowerCase().trim();
  return /^фото\s*\d+/i.test(s);
}

// [PRESERVED]: Загрузка и парсинг живой таблицы школы
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

    activeBellTimes = dataObj.bellTimes || cloneDefaultBells();
    isCustomBellScheduleActive = Boolean(dataObj.hasCustomBells);

    /* [PERF]: Устранён Forced Synchronous Layout (void el.offsetWidth). Перезапуск анимации выполняется через неблокирующий rAF */
    [newsEl, importantEl].forEach((el) => {
      el.classList.remove("is-loading-shimmer", "flash-updated");
    });
    scheduleEl.classList.remove("is-loading-shimmer");

    requestAnimationFrame(() => {
      [newsEl, importantEl].forEach((el) => el.classList.add("flash-updated"));
    });

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

    if (Array.isArray(dataObj.gallery) && dataObj.gallery.some(Boolean)) {
      updateGalleryFromSheetRows(dataObj.gallery);
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
      const response = await fetch(SHEET_CSV_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ошибка: ${response.status}`);

      const csvText = await response.text();
      const rows = parseCSVPreserveRowIndex(csvText);

      const secondRow = rows.length > 1 ? rows[1] : [];

      const scheduleByGradeAndDay = {};
      for (let g = 1; g <= 11; g++) {
        scheduleByGradeAndDay[g] = { ...(DEFAULT_GRADE_SCHEDULES[g] || {}) };
      }

      const menuByDay = {};
      const galleryList = [];
      const parsedBellTimes = cloneDefaultBells();
      let hasCustomBells = false;
      let currentMode = "schedule_grouped";

      for (let rIdx = 2; rIdx < rows.length; rIdx++) {
        const r = rows[rIdx] || [];
        const colA = (r[0] || "").trim();
        const colALower = colA.toLowerCase();
        const colB = (r[1] || "").trim();
        const colC = (r[2] || "").trim();
        const colD = (r[3] || "").trim();

        // 1. Проверка заголовка "Расписание звонков" или строк "1 урок".."7 урок"
        if (colALower.includes("расписание звонков") || colALower === "звонки") {
          currentMode = "bells";
          continue;
        }
        const bellLessonNum = detectBellLessonNumberFromCell(colA);
        if (bellLessonNum >= 1 && bellLessonNum <= 7) {
          const parsedBell = parseBellTimeRangeString(colB, bellLessonNum);
          parsedBellTimes[bellLessonNum] = {
            start: parsedBell.start,
            end: parsedBell.end,
            startMin: parsedBell.startMin,
            endMin: parsedBell.endMin
          };
          if (parsedBell.isCustom) hasCustomBells = true;
          continue;
        }

        // 2. Проверка блока Фотогалереи
        if (colALower.includes("фотогалере")) {
          currentMode = "gallery";
          continue;
        }
        if (currentMode === "gallery" || detectPhotoRowFromCell(colA)) {
          if (detectPhotoRowFromCell(colA)) {
            galleryList.push({
              url: colB,
              title: sanitizeInput(colC, 140),
              desc: sanitizeInput(colD, 400)
            });
            continue;
          }
        }

        // 3. Строки матрицы расписания 1–11 классов (A15:F26)
        const gradeNum = detectGradeNumberFromCell(colA);
        if (gradeNum >= 1 && gradeNum <= 11) {
          for (let d = 1; d <= 5; d++) {
            const cellLesson = sanitizeInput(r[d] || "", 600);
            if (cellLesson) {
              scheduleByGradeAndDay[gradeNum][d] = cellLesson;
            }
          }
          continue;
        }

        // 4. Заголовки "День недели" / "День питания"
        if (colALower.includes("день")) {
          if (colALower.includes("питан") || colB.toLowerCase().includes("завтрак")) {
            currentMode = "menu";
          } else {
            currentMode = "schedule_grouped";
          }
          continue;
        }

        const dayIndex = detectWeekdayIndexFromCell(colA);
        if (dayIndex >= 1 && dayIndex <= 5) {
          if (currentMode === "menu") {
            menuByDay[dayIndex] = {
              breakfast: sanitizeInput(colB, 400),
              lunch: sanitizeInput(colC, 400),
              note: sanitizeInput(colD, 400)
            };
          } else if (currentMode === "schedule_grouped") {
            const s14 = sanitizeInput(colB, 600);
            const s57 = sanitizeInput(colC, 600);
            const s89 = sanitizeInput(colD, 600);
            if (s14) [1, 2, 3, 4].forEach((g) => { scheduleByGradeAndDay[g][dayIndex] = s14; });
            if (s57) [5, 6, 7].forEach((g) => { scheduleByGradeAndDay[g][dayIndex] = s57; });
            if (s89) [8, 9, 10, 11].forEach((g) => { scheduleByGradeAndDay[g][dayIndex] = s89; });
          }
        }
      }

      // 5. Блок учителей (столбцы F–J) с защитой от пересечения с колонкой F ("Пятница") расписания
      const teachersList = [];
      for (let rIdx = 1; rIdx < rows.length; rIdx++) {
        const r = rows[rIdx] || [];
        const colA = (r[0] || "").trim().toLowerCase();
        const isScheduleMatrixRow = colA === "класс" || detectGradeNumberFromCell(colA) > 0;

        const rawPhoto = isScheduleMatrixRow ? "" : (r[5] || "").trim();
        const badge = sanitizeInput(r[6] || "", 100);
        const fio = sanitizeInput(r[7] || "", 120);
        const role = sanitizeInput(r[8] || "", 160);
        const desc = sanitizeInput(r[9] || "", 450);

        if (!fio) continue;
        if (fio.toLowerCase().includes("фио учителя") || fio.toLowerCase() === "фио") continue;

        teachersList.push({ photo: rawPhoto, badge, fio, role, desc });
      }

      const nowLabel = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

      const parsedData = {
        col1News: sanitizeInput(secondRow[0] || "", 600),
        col2Schedule: sanitizeInput(secondRow[1] || "", 600),
        col3Important: sanitizeInput(secondRow[2] || "", 600),
        col4Status: sanitizeInput(secondRow[3] || "", 120),
        bellTimes: parsedBellTimes,
        hasCustomBells,
        scheduleByGradeAndDay,
        menuByDay,
        teachers: teachersList,
        gallery: galleryList,
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
        renderDiaryLessonCards(
          scheduleEl,
          DEFAULT_GRADE_SCHEDULES[currentSelectedGrade][currentSelectedWeekday],
          currentSelectedWeekday
        );
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
    refreshBtn.addEventListener("click", () => {
      loadSheetData();
      showDynamicIslandToast("Данные расписания, звонков и табло обновлены");
    });
  }

  loadSheetData();
}

/* ==========================================================================
   11. КОПИРОВАНИЕ КОНТАКТОВ, SCROLL-SPY И КОЛЬЦО ПРОГРЕССА ЧТЕНИЯ
   ========================================================================== */
// [PRESERVED]: Кнопки быстрого копирования реквизитов
function initCopyButtons() {
  const copyBtns = document.querySelectorAll(".btn-copy-mini");
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const textToCopy = btn.getAttribute("data-copy") || "";
      if (!textToCopy) return;
      try {
        await navigator.clipboard.writeText(textToCopy);
        showDynamicIslandToast(`✓ Скопировано: ${textToCopy}`);
      } catch (_) {
        showDynamicIslandToast("Скопировано в буфер обмена");
      }
    });
  });
}

// [PRESERVED]: ScrollSpy навигации и кольцо прогресса чтения
/* [PERF]: Полный отказ от getBoundingClientRect() и чтения scrollHeight в скролл-слушателе.
   1) ScrollSpy работает через асинхронный IntersectionObserver (0 мс на скролле).
   2) Высота документа кэшируется через ResizeObserver, а обновление кольца троттлится через rAF. */
function initScrollSpyAndProgressRing() {
  const scrollTopBtn = document.getElementById("scroll-top-btn");
  const progressCircle = document.getElementById("scroll-progress-circle");
  const spyLinks = document.querySelectorAll(".nav-link[data-scrollspy]");
  const circumference = 119.38;

  if ("IntersectionObserver" in window && spyLinks.length > 0) {
    const linkMap = new Map();
    spyLinks.forEach((link) => {
      const id = link.getAttribute("data-scrollspy");
      if (id) linkMap.set(id, link);
    });

    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activeId = entry.target.id;
            spyLinks.forEach((link) => {
              link.classList.toggle("spy-active", link.getAttribute("data-scrollspy") === activeId);
            });
          }
        });
      },
      { rootMargin: "-140px 0px -65% 0px", threshold: 0 }
    );

    linkMap.forEach((_, id) => {
      const sec = document.getElementById(id);
      if (sec) spyObserver.observe(sec);
    });
  }

  let cachedMaxScroll = Math.max(
    document.documentElement.scrollHeight - document.documentElement.clientHeight,
    1
  );

  const recalcMaxScroll = () => {
    cachedMaxScroll = Math.max(
      document.documentElement.scrollHeight - document.documentElement.clientHeight,
      1
    );
  };

  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(recalcMaxScroll);
    ro.observe(document.documentElement);
  } else {
    window.addEventListener("resize", recalcMaxScroll, { passive: true });
  }

  let isTicking = false;
  const updateProgressUI = () => {
    isTicking = false;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const progress = cachedMaxScroll > 0 ? Math.min(Math.max(scrollTop / cachedMaxScroll, 0), 1) : 0;

    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle("visible", scrollTop > 320);
    }
    if (progressCircle) {
      progressCircle.style.strokeDashoffset = String(circumference - progress * circumference);
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(updateProgressUI);
      }
    },
    { passive: true }
  );

  updateProgressUI();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* ==========================================================================
   12. ЦИФРОВОЙ НАВИГАТОР, ФОРМА ОБРАТНОЙ СВЯЗИ И SERVICE WORKER
   ========================================================================== */
// [PRESERVED]: Переключение вкладок Школьного цифрового навигатора
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

// [PRESERVED]: Двухшаговая форма обращения по 152-ФЗ с выдачей талона-квитанции
function initFeedbackForm() {
  const consentStep = document.getElementById("consent-step");
  const formStep = document.getElementById("form-step");
  const acceptBtn = document.getElementById("accept-consent-btn");
  const stepInd1 = document.getElementById("step-indicator-1");
  const stepInd2 = document.getElementById("step-indicator-2");
  const stepsProgressBar = document.getElementById("steps-progress-bar");

  const form = document.getElementById("feedback-form");
  const formFieldset = document.getElementById("form-fieldset");
  if (!consentStep || !formStep || !acceptBtn || !form || !formFieldset) return;

  const fioInput = document.getElementById("fio-input");
  const contactInput = document.getElementById("contact-input");
  const commentInput = document.getElementById("comment-input");
  const charCounter = document.getElementById("comment-char-counter");
  const topicChips = document.querySelectorAll(".topic-chip");

  const fioHint = document.getElementById("fio-hint");
  const contactHint = document.getElementById("contact-hint");
  const commentHint = document.getElementById("comment-hint");

  const submitBtn = document.getElementById("submit-btn");
  const submitBtnText = document.getElementById("submit-btn-text");
  const submitLoader = document.getElementById("submit-loader");
  const formResponse = document.getElementById("form-response");

  const receiptBox = document.getElementById("feedback-receipt");
  const receiptMeta = document.getElementById("receipt-meta");
  const receiptFio = document.getElementById("receipt-fio");
  const receiptContact = document.getElementById("receipt-contact");
  const receiptComment = document.getElementById("receipt-comment");
  const copyReceiptBtn = document.getElementById("copy-receipt-btn");
  const newFeedbackBtn = document.getElementById("new-feedback-btn");

  let isConsentConfirmed = false;
  let selectedTopicPrefix = "[Вопрос руководителю] ";

  formFieldset.disabled = true;
  submitBtn.disabled = true;

  const setTopicByPrefix = (prefix, themeName, placeholderText) => {
    selectedTopicPrefix = prefix;
    formStep.classList.remove("topic-theme-question", "topic-theme-thanks", "topic-theme-idea");
    formStep.classList.add(`topic-theme-${themeName || "question"}`);
    if (commentInput && placeholderText) {
      commentInput.placeholder = placeholderText;
    }
  };

  topicChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      topicChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const prefix = chip.getAttribute("data-topic-prefix") || "[Вопрос руководителю] ";
      const themeName = chip.getAttribute("data-topic-theme") || "question";

      if (themeName === "thanks") {
        setTopicByPrefix(prefix, "thanks", "Напишите, кого из педагогов или сотрудников школы вы хотите поблагодарить...");
      } else if (themeName === "idea") {
        setTopicByPrefix(prefix, "idea", "Опишите вашу идею или предложение по развитию школы, кружкам или мероприятиям...");
      } else {
        setTopicByPrefix(prefix, "question", "Опишите ваш вопрос руководителю школы...");
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
    if (stepsProgressBar) {
      stepsProgressBar.style.width = "100%";
      stepsProgressBar.classList.add("is-complete");
    }

    showDynamicIslandToast("✓ Согласие 152-ФЗ подтверждено");
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
    const rawLen = commentInput.value.length;
    if (charCounter) {
      charCounter.textContent = `${rawLen} / 2000`;
    }

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

      const ticketNum = `ЯМБ-${new Date().toLocaleDateString("ru-RU").replace(/\./g, "")}-${Math.floor(100 + Math.random() * 900)}`;
      if (receiptBox && receiptFio && receiptContact && receiptComment && receiptMeta) {
        receiptMeta.textContent = `Талон № ${ticketNum} • ${new Date().toLocaleString("ru-RU")}`;
        receiptFio.textContent = sanitizedFio;
        receiptContact.textContent = sanitizedContact;
        receiptComment.textContent = sanitizedComment;
        form.classList.add("hidden");
        receiptBox.classList.remove("hidden");
      } else {
        formResponse.textContent = "Спасибо! Ваше сообщение успешно записано в реестр школы.";
        formResponse.className = "form-response success";
        formResponse.classList.remove("hidden");
      }

      showDynamicIslandToast("✓ Обращение отправлено в школу");
      form.reset();
      if (charCounter) charCounter.textContent = "0 / 2000";
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

  if (copyReceiptBtn) {
    copyReceiptBtn.addEventListener("click", async () => {
      const receiptText = `${receiptMeta ? receiptMeta.textContent : ""}\nФИО: ${receiptFio ? receiptFio.textContent : ""}\nКонтакт: ${receiptContact ? receiptContact.textContent : ""}\nТекст: ${receiptComment ? receiptComment.textContent : ""}`;
      try {
        await navigator.clipboard.writeText(receiptText);
        showDynamicIslandToast("✓ Текст квитанции скопирован");
      } catch (_) {}
    });
  }

  if (newFeedbackBtn && receiptBox) {
    newFeedbackBtn.addEventListener("click", () => {
      receiptBox.classList.add("hidden");
      form.classList.remove("hidden");
      fioInput.focus();
    });
  }
}

// [PRESERVED]: Появление блоков при скролле и анимация счётчиков статистики
function initScrollRevealAndCounters() {
  const revealElements = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll("[data-target]");
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window) || document.body.classList.contains("visually-impaired") || reducedMotion) {
    revealElements.forEach((el) => el.classList.add("visible"));
    counters.forEach((el) => {
      const target = parseFloat(el.getAttribute("data-target"));
      const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      const suffix = el.getAttribute("data-suffix") || "";
      if (!isNaN(target)) el.textContent = `${target.toFixed(decimals)}${suffix}`;
    });
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

// [PRESERVED]: Регистрация офлайн-воркера
function registerOfflineServiceWorker() {
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}
