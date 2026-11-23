const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1w6Z_wfOYJVKxtMHhz9ut6euiLY3YtkkOGNj1Wd_Pr0yJTdmKruN19uZYEyXpLZQSQPQgGHH9i84a/pub?output=csv";
const SHEET3_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1w6Z_wfOYJVKxtMHhz9ut6euiLY3YtkkOGNj1Wd_Pr0yJTdmKruN19uZYEyXpLZQSQPQgGHH9i84a/pub?gid=809598510&single=true&output=csv";
const SNAPSHOT_JSON_URL = "data/school-snapshot.json";
const FEEDBACK_POST_URL = "https://script.google.com/macros/s/AKfycbzCzPpC8lYIeG_GkCYJKTJAhXjM4Ti0vO_9njDpi7lPdC1Rr2Ue8REEE38Tv_dou3X1Kg/exec";

const YAMBIRNO_LAT = 54.1286;
const YAMBIRNO_LON = 41.9708;

const A11Y_STORAGE_KEY = "yambirno_visually_impaired";
const A11Y_SETTINGS_KEY = "yambirno_a11y_settings_v2";
const GRADE_STORAGE_KEY = "yambirno_selected_grade";
const SHEET_CACHE_KEY = "yambirno_live_sheet_cache_v15";
const SHEET3_CACHE_KEY = "yambirno_publications_cache_v3";
const FEEDBACK_COOLDOWN_KEY = "yambirno_feedback_last_sent";
const FEEDBACK_CONSENT_SESSION_KEY = "yambirno_feedback_consent_session_v1";
const MEDIA_MAP_CACHE_KEY = "yambirno_media_map_v1";

const SITE_CANONICAL_URL = "https://sergievposadprimoauxiliumsta-crypto.github.io/yambirno-school/";
const HERO_FALLBACK_IMAGE_URL = "og-cover.jpg";
const MAX_SHARE_DEEPLINK_BASE = "https://max.ru/:share";
const MAX_WEB_URL = "https://web.max.ru/";
// При появлении официального школьного чата/канала в MAX укажите его HTTPS-адрес ниже:
const MAX_SCHOOL_CHAT_URL = "";
const SCHOOL_QR_SVG_URL = "assets/img/qr-school.svg";
const SCHOOL_QR_POSTER_FILENAME = "QR-Shkola-Yambirno.png";
const SCHOOL_QR_PATH_FALLBACK = "M4,4h7v1h-7zM16,4h1v1h-1zM18,4h1v1h-1zM20,4h1v1h-1zM27,4h1v1h-1zM32,4h1v1h-1zM34,4h7v1h-7zM4,5h1v1h-1zM10,5h1v1h-1zM18,5h1v1h-1zM20,5h3v1h-3zM24,5h1v1h-1zM26,5h1v1h-1zM31,5h1v1h-1zM34,5h1v1h-1zM40,5h1v1h-1zM4,6h1v1h-1zM6,6h3v1h-3zM10,6h1v1h-1zM12,6h2v1h-2zM15,6h6v1h-6zM25,6h3v1h-3zM34,6h1v1h-1zM36,6h3v1h-3zM40,6h1v1h-1zM4,7h1v1h-1zM6,7h3v1h-3zM10,7h1v1h-1zM12,7h1v1h-1zM14,7h8v1h-8zM24,7h1v1h-1zM26,7h7v1h-7zM34,7h1v1h-1zM36,7h3v1h-3zM40,7h1v1h-1zM4,8h1v1h-1zM6,8h3v1h-3zM10,8h1v1h-1zM12,8h1v1h-1zM14,8h1v1h-1zM16,8h1v1h-1zM18,8h1v1h-1zM20,8h2v1h-2zM23,8h2v1h-2zM27,8h1v1h-1zM29,8h1v1h-1zM32,8h1v1h-1zM34,8h1v1h-1zM36,8h3v1h-3zM40,8h1v1h-1zM4,9h1v1h-1zM10,9h1v1h-1zM12,9h2v1h-2zM15,9h2v1h-2zM18,9h4v1h-4zM24,9h1v1h-1zM26,9h1v1h-1zM31,9h1v1h-1zM34,9h1v1h-1zM40,9h1v1h-1zM4,10h7v1h-7zM12,10h1v1h-1zM14,10h1v1h-1zM16,10h1v1h-1zM18,10h1v1h-1zM20,10h1v1h-1zM22,10h1v1h-1zM24,10h1v1h-1zM26,10h1v1h-1zM28,10h1v1h-1zM30,10h1v1h-1zM32,10h1v1h-1zM34,10h7v1h-7zM12,11h1v1h-1zM14,11h1v1h-1zM17,11h1v1h-1zM19,11h4v1h-4zM24,11h3v1h-3zM30,11h1v1h-1zM32,11h1v1h-1zM4,12h1v1h-1zM6,12h5v1h-5zM14,12h1v1h-1zM17,12h1v1h-1zM20,12h1v1h-1zM23,12h1v1h-1zM26,12h6v1h-6zM34,12h5v1h-5zM8,13h1v1h-1zM11,13h2v1h-2zM14,13h1v1h-1zM16,13h1v1h-1zM19,13h1v1h-1zM22,13h1v1h-1zM24,13h2v1h-2zM27,13h1v1h-1zM29,13h2v1h-2zM32,13h1v1h-1zM35,13h1v1h-1zM39,13h1v1h-1zM6,14h1v1h-1zM10,14h1v1h-1zM13,14h1v1h-1zM15,14h1v1h-1zM17,14h1v1h-1zM19,14h2v1h-2zM23,14h1v1h-1zM25,14h1v1h-1zM28,14h5v1h-5zM34,14h1v1h-1zM36,14h1v1h-1zM38,14h3v1h-3zM6,15h1v1h-1zM12,15h1v1h-1zM14,15h2v1h-2zM18,15h2v1h-2zM22,15h5v1h-5zM28,15h1v1h-1zM30,15h4v1h-4zM35,15h2v1h-2zM40,15h1v1h-1zM5,16h1v1h-1zM8,16h1v1h-1zM10,16h1v1h-1zM13,16h2v1h-2zM19,16h3v1h-3zM23,16h1v1h-1zM26,16h5v1h-5zM32,16h9v1h-9zM4,17h1v1h-1zM7,17h3v1h-3zM11,17h3v1h-3zM15,17h1v1h-1zM18,17h1v1h-1zM20,17h1v1h-1zM22,17h3v1h-3zM26,17h2v1h-2zM30,17h1v1h-1zM32,17h1v1h-1zM35,17h1v1h-1zM4,18h2v1h-2zM7,18h1v1h-1zM9,18h4v1h-4zM17,18h3v1h-3zM22,18h1v1h-1zM24,18h3v1h-3zM29,18h1v1h-1zM31,18h2v1h-2zM35,18h3v1h-3zM39,18h2v1h-2zM6,19h1v1h-1zM9,19h1v1h-1zM13,19h2v1h-2zM16,19h1v1h-1zM19,19h1v1h-1zM24,19h2v1h-2zM28,19h1v1h-1zM31,19h6v1h-6zM4,20h1v1h-1zM6,20h2v1h-2zM10,20h1v1h-1zM12,20h2v1h-2zM15,20h5v1h-5zM22,20h1v1h-1zM24,20h1v1h-1zM27,20h5v1h-5zM33,20h2v1h-2zM36,20h1v1h-1zM38,20h2v1h-2zM7,21h1v1h-1zM9,21h1v1h-1zM12,21h2v1h-2zM18,21h3v1h-3zM25,21h1v1h-1zM27,21h1v1h-1zM32,21h1v1h-1zM37,21h3v1h-3zM4,22h2v1h-2zM7,22h2v1h-2zM10,22h1v1h-1zM12,22h4v1h-4zM17,22h2v1h-2zM22,22h1v1h-1zM24,22h3v1h-3zM29,22h1v1h-1zM31,22h4v1h-4zM36,22h1v1h-1zM39,22h2v1h-2zM4,23h1v1h-1zM6,23h1v1h-1zM12,23h1v1h-1zM14,23h5v1h-5zM20,23h1v1h-1zM25,23h4v1h-4zM30,23h2v1h-2zM33,23h2v1h-2zM40,23h1v1h-1zM4,24h5v1h-5zM10,24h3v1h-3zM15,24h1v1h-1zM17,24h2v1h-2zM20,24h3v1h-3zM24,24h1v1h-1zM26,24h1v1h-1zM28,24h4v1h-4zM33,24h2v1h-2zM36,24h1v1h-1zM38,24h1v1h-1zM4,25h3v1h-3zM9,25h1v1h-1zM11,25h4v1h-4zM16,25h1v1h-1zM20,25h5v1h-5zM26,25h2v1h-2zM29,25h1v1h-1zM32,25h2v1h-2zM37,25h1v1h-1zM4,26h2v1h-2zM7,26h2v1h-2zM10,26h5v1h-5zM16,26h1v1h-1zM18,26h4v1h-4zM24,26h1v1h-1zM26,26h1v1h-1zM28,26h6v1h-6zM35,26h3v1h-3zM40,26h1v1h-1zM4,27h1v1h-1zM6,27h3v1h-3zM12,27h3v1h-3zM16,27h4v1h-4zM21,27h2v1h-2zM25,27h4v1h-4zM31,27h1v1h-1zM33,27h1v1h-1zM35,27h2v1h-2zM39,27h1v1h-1zM5,28h4v1h-4zM10,28h2v1h-2zM13,28h2v1h-2zM17,28h2v1h-2zM20,28h1v1h-1zM23,28h1v1h-1zM25,28h1v1h-1zM28,28h3v1h-3zM34,28h1v1h-1zM36,28h1v1h-1zM38,28h2v1h-2zM4,29h1v1h-1zM6,29h4v1h-4zM11,29h1v1h-1zM13,29h2v1h-2zM16,29h2v1h-2zM19,29h1v1h-1zM21,29h2v1h-2zM24,29h1v1h-1zM27,29h1v1h-1zM32,29h1v1h-1zM35,29h1v1h-1zM4,30h1v1h-1zM6,30h1v1h-1zM9,30h5v1h-5zM15,30h1v1h-1zM19,30h2v1h-2zM23,30h1v1h-1zM25,30h1v1h-1zM31,30h2v1h-2zM34,30h2v1h-2zM37,30h1v1h-1zM39,30h2v1h-2zM4,31h1v1h-1zM7,31h1v1h-1zM12,31h2v1h-2zM16,31h1v1h-1zM18,31h2v1h-2zM23,31h3v1h-3zM27,31h2v1h-2zM30,31h2v1h-2zM35,31h1v1h-1zM4,32h1v1h-1zM6,32h1v1h-1zM9,32h3v1h-3zM13,32h1v1h-1zM15,32h2v1h-2zM18,32h4v1h-4zM23,32h1v1h-1zM26,32h1v1h-1zM29,32h2v1h-2zM32,32h9v1h-9zM12,33h3v1h-3zM16,33h1v1h-1zM18,33h1v1h-1zM20,33h1v1h-1zM22,33h3v1h-3zM27,33h1v1h-1zM29,33h1v1h-1zM31,33h2v1h-2zM36,33h2v1h-2zM4,34h7v1h-7zM15,34h2v1h-2zM19,34h1v1h-1zM22,34h1v1h-1zM26,34h1v1h-1zM28,34h3v1h-3zM32,34h1v1h-1zM34,34h1v1h-1zM36,34h1v1h-1zM38,34h3v1h-3zM4,35h1v1h-1zM10,35h1v1h-1zM12,35h2v1h-2zM16,35h3v1h-3zM24,35h1v1h-1zM28,35h1v1h-1zM30,35h1v1h-1zM32,35h1v1h-1zM36,35h2v1h-2zM40,35h1v1h-1zM4,36h1v1h-1zM6,36h3v1h-3zM10,36h1v1h-1zM12,36h1v1h-1zM14,36h2v1h-2zM18,36h2v1h-2zM22,36h5v1h-5zM29,36h1v1h-1zM31,36h6v1h-6zM38,36h3v1h-3zM4,37h1v1h-1zM6,37h3v1h-3zM10,37h1v1h-1zM12,37h1v1h-1zM14,37h3v1h-3zM18,37h3v1h-3zM27,37h1v1h-1zM32,37h3v1h-3zM36,37h3v1h-3zM40,37h1v1h-1zM4,38h1v1h-1zM6,38h3v1h-3zM10,38h1v1h-1zM12,38h1v1h-1zM16,38h1v1h-1zM18,38h1v1h-1zM21,38h2v1h-2zM24,38h2v1h-2zM30,38h1v1h-1zM37,38h1v1h-1zM39,38h2v1h-2zM4,39h1v1h-1zM10,39h1v1h-1zM13,39h1v1h-1zM16,39h3v1h-3zM20,39h1v1h-1zM25,39h2v1h-2zM32,39h2v1h-2zM36,39h1v1h-1zM40,39h1v1h-1zM4,40h7v1h-7zM12,40h5v1h-5zM18,40h1v1h-1zM20,40h2v1h-2zM26,40h2v1h-2zM29,40h2v1h-2zM33,40h1v1h-1zM36,40h1v1h-1zM38,40h3v1h-3z";

const ALLOWED_DOC_HOSTS = [
  "drive.google.com",
  "docs.google.com",
  "disk.yandex.ru",
  "disk.yandex.com",
  "gosuslugi.ru",
  "edu.ru",
  "ryazangov.ru",
  "takzdorovo.ru",
  "vk.ru",
  "vk.com",
  "uchi.ru",
  "sergievposadprimoauxiliumsta-crypto.github.io"
];

const ALLOWED_IMAGE_HOSTS = [
  "drive.google.com",
  "googleusercontent.com",
  "skrinshoter.ru",
  "userapi.com",
  "yandex.net",
  "sergievposadprimoauxiliumsta-crypto.github.io"
];

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

const RU_WEEKDAYS_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

const RU_MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря"
];

const DEFAULT_BELL_TIMES = {
  0: null,
  1: { start: "08:30", end: "09:10", startMin: 510, endMin: 550 },
  2: { start: "09:20", end: "10:00", startMin: 560, endMin: 600 },
  3: { start: "10:10", end: "10:50", startMin: 610, endMin: 650 },
  4: { start: "11:10", end: "11:50", startMin: 670, endMin: 710 },
  5: { start: "12:10", end: "12:50", startMin: 730, endMin: 770 },
  6: { start: "13:00", end: "13:40", startMin: 780, endMin: 820 },
  7: { start: "13:50", end: "14:30", startMin: 830, endMin: 870 },
  8: null
};

let activeBellTimes = cloneDefaultBells();
let isCustomBellScheduleActive = false;

function cloneDefaultBells() {
  const copy = {};
  Object.keys(DEFAULT_BELL_TIMES).forEach((k) => {
    const val = DEFAULT_BELL_TIMES[k];
    copy[k] = val ? { ...val } : null;
  });
  return copy;
}

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
  }
];

const DEFAULT_SANPIN_BREAKFAST =
  "Горячее блюдо, витаминизированный горячий напиток, хлебобулочное/молочное изделие согласно утверждённому 10-дневному цикличному меню.";
const DEFAULT_SANPIN_LUNCH =
  "Первое горячее блюдо, порционное мясное/рыбное блюдо с гарниром, сезонная овощная нарезка/салат, напиток по нормам СанПиН.";
const DEFAULT_SANPIN_NOTE =
  "Фактическое ежедневное меню заверяется руководителем и размещается на информационном стенде школьной столовой.";

let customSheetSchoolStatus = "";
let latestParsedSheetData = null;
let latestRawSheet3Rows = null;
let latestSnapshotPromise = null;
let snapshotMediaMap = loadCachedMediaMap();
let activePublicationsCache = [];
let activePublicationModalItem = null;
let activePubFilterKey = "all";
let lastRenderedPublicationsSignature = "";
let hasCheckedInitialPubHash = false;
let currentSelectedWeekday = getDefaultSchoolWeekday();
let hasExplicitSavedGrade = false;
let currentSelectedGrade = getSavedGradeSelection();
let currentSelectedMenuWeek = 1;
let isTomorrowWeekendWeather = false;
let toastTimeoutId = null;
let lastModalTriggerEl = null;
let maxModalTriggerEl = null;
let activeMaxSharePayload = null;
let cachedQrPosterPromise = null;
let openLightboxSlidesFn = null;
const glidePillRefreshers = [];
let isGlideResizeBound = false;
let glideResizeRafId = 0;
let chalkboardSyncCallback = null;
let refreshClockStatusCallback = null;
let imageLoadSequence = 0;

function getMoscowTimeParts(baseMs = Date.now()) {
  const msk = new Date(baseMs + 3 * 3600000);
  return {
    year: msk.getUTCFullYear(),
    month: msk.getUTCMonth(),
    day: msk.getUTCDate(),
    weekday: msk.getUTCDay(),
    hours: msk.getUTCHours(),
    minutes: msk.getUTCMinutes(),
    seconds: msk.getUTCSeconds()
  };
}

function formatMoscowClock(parts) {
  const hh = String(parts.hours).padStart(2, "0");
  const mm = String(parts.minutes).padStart(2, "0");
  const ss = String(parts.seconds).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function formatMoscowShortTime(parts) {
  const hh = String(parts.hours).padStart(2, "0");
  const mm = String(parts.minutes).padStart(2, "0");
  return `${hh}:${mm}`;
}

function formatMoscowHeaderDate(parts) {
  const wd = RU_WEEKDAYS_SHORT[parts.weekday] || "";
  const monthWord = RU_MONTHS_GENITIVE[parts.month] || "";
  return `${wd}, ${parts.day} ${monthWord} ${parts.year} г.`;
}

function formatMoscowShortDate(parts) {
  const dd = String(parts.day).padStart(2, "0");
  const monthWord = RU_MONTHS_GENITIVE[parts.month] || "";
  return `${dd} ${monthWord}`;
}

function formatMoscowFullDateTime(parts) {
  const dd = String(parts.day).padStart(2, "0");
  const mm = String(parts.month + 1).padStart(2, "0");
  return `${dd}.${mm}.${parts.year}, ${formatMoscowClock(parts)} (МСК)`;
}

function clearElement(el) {
  if (!el) return;
  if (typeof el.replaceChildren === "function") {
    el.replaceChildren();
    return;
  }
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function setElementChild(el, childNode) {
  if (!el) return;
  clearElement(el);
  if (childNode) el.appendChild(childNode);
}

function getStorageSafe(kind) {
  try {
    return kind === "session" ? window.sessionStorage : window.localStorage;
  } catch (_) {
    return null;
  }
}

function safeStorageGet(kind, key) {
  try {
    const storage = getStorageSafe(kind);
    return storage ? storage.getItem(key) : null;
  } catch (_) {
    return null;
  }
}

function safeStorageSet(kind, key, value) {
  try {
    const storage = getStorageSafe(kind);
    if (storage) storage.setItem(key, value);
  } catch (_) {}
}

function isReducedMotionPreferred() {
  const prefersReduced = Boolean(
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const isVisuallyImpaired = Boolean(
    document.body && document.body.classList.contains("visually-impaired")
  );
  return prefersReduced || isVisuallyImpaired;
}

function isDesktopHoverPointer() {
  return Boolean(
    window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

function runViewTransition(updateDomFn) {
  if (typeof document.startViewTransition === "function" && !isReducedMotionPreferred()) {
    try {
      document.startViewTransition(updateDomFn);
      return;
    } catch (_) {}
  }
  updateDomFn();
}

function createSpriteIcon(symbolId, extraClass = "", size = 16) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", `ui-ico ${extraClass}`.trim());
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("aria-hidden", "true");

  const use = document.createElementNS(svgNS, "use");
  use.setAttribute("href", `#${symbolId}`);
  svg.appendChild(use);
  return svg;
}

function updateElementSpriteIcon(containerEl, symbolId) {
  if (!containerEl) return;
  const useEl = containerEl.querySelector("use");
  if (useEl) {
    useEl.setAttribute("href", `#${symbolId}`);
  }
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 6500) {
  if (typeof AbortController === "undefined") {
    return fetch(url, options);
  }
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timerId);
  }
}

function isSafeMirroredMediaPath(pathStr) {
  return typeof pathStr === "string" && /^data\/media\/[a-zA-Z0-9_-]{10,80}\.(jpg|jpeg|png|webp|gif)$/i.test(pathStr);
}

function loadCachedMediaMap() {
  try {
    const raw = safeStorageGet("local", MEDIA_MAP_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const clean = {};
    Object.keys(parsed).forEach((k) => {
      if (/^[a-zA-Z0-9_-]{10,80}$/.test(k) && isSafeMirroredMediaPath(parsed[k])) {
        clean[k] = parsed[k];
      }
    });
    return clean;
  } catch (_) {
    return {};
  }
}

function updateSnapshotMediaMap(rawMap) {
  if (!rawMap || typeof rawMap !== "object") return;
  const clean = {};
  Object.keys(rawMap).forEach((k) => {
    if (/^[a-zA-Z0-9_-]{10,80}$/.test(k) && isSafeMirroredMediaPath(rawMap[k])) {
      clean[k] = rawMap[k];
    }
  });
  if (Object.keys(clean).length > 0) {
    snapshotMediaMap = clean;
    safeStorageSet("local", MEDIA_MAP_CACHE_KEY, JSON.stringify(clean));
  }
}

function fetchSchoolSnapshotOnce(forceReload = false) {
  if (!forceReload && latestSnapshotPromise) {
    return latestSnapshotPromise;
  }
  const pendingPromise = (async () => {
    try {
      const response = await fetchWithTimeout(
        SNAPSHOT_JSON_URL,
        { cache: forceReload ? "no-store" : "default" },
        4500
      );
      if (!response.ok) {
        if (latestSnapshotPromise === pendingPromise) latestSnapshotPromise = null;
        return null;
      }
      const data = await response.json();
      if (!data || typeof data !== "object" || !Array.isArray(data.panelRows)) {
        if (latestSnapshotPromise === pendingPromise) latestSnapshotPromise = null;
        return null;
      }
      if (data.mediaMap) updateSnapshotMediaMap(data.mediaMap);
      return data;
    } catch (_) {
      if (latestSnapshotPromise === pendingPromise) latestSnapshotPromise = null;
      return null;
    }
  })();
  latestSnapshotPromise = pendingPromise;
  return pendingPromise;
}

function isValidCsvResponse(text, expectedMarkers = []) {
  if (typeof text !== "string" || text.trim().length < 15) return false;
  const head = text.replace(/^\uFEFF/, "").slice(0, 320).trim().toLowerCase();
  if (
    head.startsWith("<!doctype") ||
    head.startsWith("<html") ||
    head.startsWith("<head") ||
    head.startsWith("<script") ||
    head.startsWith("{")
  ) {
    return false;
  }
  if (!text.includes(",") && !text.includes("\n")) return false;
  if (expectedMarkers.length > 0) {
    const lowerAll = text.toLowerCase();
    return expectedMarkers.some((marker) => lowerAll.includes(marker));
  }
  return true;
}

function pluralRu(n, one, few, many) {
  const mod10 = Math.abs(n) % 10;
  const mod100 = Math.abs(n) % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

function getDefaultSchoolWeekday() {
  const wd = getMoscowTimeParts().weekday;
  return wd >= 1 && wd <= 5 ? wd : 1;
}

function getSavedGradeSelection() {
  const raw = safeStorageGet("local", GRADE_STORAGE_KEY);
  const saved = parseInt(raw || "", 10);
  if (saved >= 1 && saved <= 9) {
    hasExplicitSavedGrade = true;
    return saved;
  }
  hasExplicitSavedGrade = false;
  return 1;
}

function escapeXml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sanitizeInput(rawString, maxLength = 1000) {
  if (typeof rawString !== "string") return "";
  return rawString
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "")
    .replace(/[<>]/g, "")
    .replace(/javascript:|data:|vbscript:/gi, "")
    .trim()
    .slice(0, maxLength);
}

async function copyTextToClipboard(text) {
  if (!text) return false;

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {}
  }

  try {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.setAttribute("aria-hidden", "true");
    helper.style.position = "fixed";
    helper.style.top = "0";
    helper.style.left = "-9999px";
    helper.style.fontSize = "16px";
    document.body.appendChild(helper);
    helper.focus({ preventScroll: true });
    helper.select();
    helper.setSelectionRange(0, helper.value.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(helper);
    return Boolean(ok);
  } catch (_) {
    return false;
  }
}

function isHostInAllowlist(hostname, allowlist) {
  const host = String(hostname || "").toLowerCase();
  return allowlist.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}

function sanitizeDocumentUrl(rawUrl) {
  if (typeof rawUrl !== "string") return "";
  const cleaned = rawUrl.replace(/[\x00-\x1F\x7F]/g, "").trim();
  if (!/^https:\/\/[^\s"'<>]+$/i.test(cleaned)) return "";

  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol !== "https:") return "";
    return isHostInAllowlist(parsed.hostname, ALLOWED_DOC_HOSTS) ? parsed.href : "";
  } catch (_) {
    return "";
  }
}

function getFocusableElements(container) {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll(
      'a[href]:not(.hidden):not([hidden]), button:not([disabled]):not(.hidden):not([hidden]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => el.offsetParent !== null);
}

function handleModalFocusTrap(e, modalEl) {
  if (e.key !== "Tab" || modalEl.classList.contains("hidden")) return;
  const focusables = getFocusableElements(modalEl);
  if (focusables.length === 0) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first || !modalEl.contains(document.activeElement)) {
      e.preventDefault();
      last.focus();
    }
  } else if (document.activeElement === last || !modalEl.contains(document.activeElement)) {
    e.preventDefault();
    first.focus();
  }
}

function lockPageScrollForModal(rememberTrigger = true) {
  if (rememberTrigger) {
    lastModalTriggerEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }
  document.documentElement.classList.add("modal-open");
  document.body.classList.add("modal-open");
}

function unlockPageScrollAfterModal(customFocusTarget = null) {
  const pubModal = document.getElementById("publication-modal");
  const lbModal = document.getElementById("gallery-lightbox");
  const qrModal = document.getElementById("qr-modal");
  const maxModal = document.getElementById("max-share-modal");
  const isAnyModalOpen =
    Boolean(pubModal && !pubModal.classList.contains("hidden")) ||
    Boolean(lbModal && !lbModal.classList.contains("hidden")) ||
    Boolean(qrModal && !qrModal.classList.contains("hidden")) ||
    Boolean(maxModal && !maxModal.classList.contains("hidden"));

  if (!isAnyModalOpen) {
    document.documentElement.classList.remove("modal-open");
    document.body.classList.remove("modal-open");
  }

  const focusEl = customFocusTarget || lastModalTriggerEl;
  if (focusEl && document.contains(focusEl)) {
    try {
      focusEl.focus({ preventScroll: true });
    } catch (_) {
      focusEl.focus();
    }
  }
  if (!customFocusTarget && !isAnyModalOpen) {
    lastModalTriggerEl = null;
  }
}

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

function buildInitialsSvgDataUri(initials, index = 0) {
  const palette = AVATAR_PALETTES[index % AVATAR_PALETTES.length];
  const safeChars = escapeXml(sanitizeInput(initials, 3).toUpperCase() || "УЧ");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><circle cx='60' cy='60' r='60' fill='${palette.bg}'/><text x='60' y='70' font-family='sans-serif' font-size='34' font-weight='bold' fill='${palette.fg}' text-anchor='middle'>${safeChars}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function buildPublicationFallbackSvg(titleText) {
  const safeTitle = escapeXml(sanitizeInput(titleText || "Материал школы", 40));
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 375'><defs><linearGradient id='pg' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#1e3a8a'/><stop offset='100%' stop-color='#2563eb'/></linearGradient><linearGradient id='pa' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#fbbf24'/><stop offset='100%' stop-color='#d97706'/></linearGradient></defs><rect width='600' height='375' fill='url(#pg)'/><circle cx='300' cy='148' r='54' fill='#ffffff' opacity='0.14'/><circle cx='300' cy='132' r='16' fill='url(#pa)'/><path d='M256 154 C274 146 290 151 300 160 C310 151 326 146 344 154 V192 C326 184 310 189 300 198 C290 189 274 184 256 192 Z' fill='#ffffff' opacity='0.95'/><path d='M300 160 V198' stroke='#1e3a8a' stroke-width='3'/><text x='300' y='252' font-family='sans-serif' font-size='21' font-weight='bold' fill='#ffffff' text-anchor='middle'>${safeTitle}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function extractInitialsFromFio(fioString) {
  const parts = sanitizeInput(fioString, 120).split(/\s+/).filter(Boolean);
  if (parts.length >= 3) return (parts[1][0] + parts[2][0]).toUpperCase();
  if (parts.length === 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return "УЧ";
}

function resolveImageLinkSource(rawUrlCell, fallbackSvg, driveWidth = 640) {
  const cleaned = (rawUrlCell || "").trim();
  if (!cleaned) return { src: fallbackSvg, altTry: null, fallback: fallbackSvg };

  const isSafeRelativePath =
    /^(?!.*(?:^|\/)\.\.(?:\/|$))[a-zA-Z0-9_\-./]+\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(cleaned) &&
    !cleaned.startsWith("//");
  if (isSafeRelativePath) {
    return { src: cleaned, altTry: null, fallback: fallbackSvg };
  }

  if (!/^https:\/\/[^\s"'<>]+$/i.test(cleaned)) {
    return { src: fallbackSvg, altTry: null, fallback: fallbackSvg };
  }

  let parsed;
  try {
    parsed = new URL(cleaned);
  } catch (_) {
    return { src: fallbackSvg, altTry: null, fallback: fallbackSvg };
  }

  if (parsed.protocol !== "https:" || !isHostInAllowlist(parsed.hostname, ALLOWED_IMAGE_HOSTS)) {
    return { src: fallbackSvg, altTry: null, fallback: fallbackSvg };
  }

  const host = parsed.hostname.toLowerCase();

  if (host === "drive.google.com") {
    const driveMatch =
      parsed.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      parsed.search.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      const fileId = driveMatch[1];
      const mirroredPath = snapshotMediaMap && snapshotMediaMap[fileId];
      if (isSafeMirroredMediaPath(mirroredPath)) {
        return {
          src: mirroredPath,
          altTry: `https://drive.google.com/thumbnail?id=${fileId}&sz=w${driveWidth}`,
          fallback: fallbackSvg
        };
      }
      return {
        src: `https://drive.google.com/thumbnail?id=${fileId}&sz=w${driveWidth}`,
        altTry: `https://lh3.googleusercontent.com/d/${fileId}=w${driveWidth}`,
        fallback: fallbackSvg
      };
    }
    return { src: fallbackSvg, altTry: null, fallback: fallbackSvg };
  }

  if (host === "skrinshoter.ru" || host.endsWith(".skrinshoter.ru")) {
    const hasImgExt = /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(parsed.pathname);
    if (hasImgExt) {
      return { src: parsed.href, altTry: null, fallback: fallbackSvg };
    }
    const cleanNoSlash = parsed.href.replace(/\/+$/, "");
    return {
      src: `${cleanNoSlash}.jpg`,
      altTry: `${cleanNoSlash}.png`,
      fallback: fallbackSvg
    };
  }

  return { src: parsed.href, altTry: null, fallback: fallbackSvg };
}

function resolveTeacherPhotoSource(rawPhotoCell, teacherFio, cardIndex) {
  const cleaned = (rawPhotoCell || "").trim();
  const fallbackSvg = buildInitialsSvgDataUri(extractInitialsFromFio(teacherFio), cardIndex);

  if (!cleaned) return { src: fallbackSvg, altTry: null, fallback: fallbackSvg };

  if (/^[А-Яа-яЁёA-Za-z]{1,3}$/.test(cleaned)) {
    const customSvg = buildInitialsSvgDataUri(cleaned, cardIndex);
    return { src: customSvg, altTry: null, fallback: customSvg };
  }

  return resolveImageLinkSource(cleaned, fallbackSvg, 320);
}

function truncateAtWordBoundary(text, maxLen = 220) {
  const str = String(text || "").trim();
  if (str.length <= maxLen) return { short: str, rest: "", isTruncated: false };

  let cut = str.lastIndexOf(" ", maxLen);
  if (cut < Math.floor(maxLen * 0.6)) cut = maxLen;
  return {
    short: str.slice(0, cut).trim(),
    rest: str.slice(cut).trim(),
    isTruncated: true
  };
}

function buildStablePublicationId(rawDateCell, rawTitleCell, usedIdsSet) {
  const seed = `${String(rawDateCell || "").trim().toLowerCase()}|${String(rawTitleCell || "").trim().toLowerCase()}`;
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const baseId = `p${(hash >>> 0).toString(36)}`;
  let candidate = baseId;
  let suffix = 2;
  while (usedIdsSet.has(candidate)) {
    candidate = `${baseId}-${suffix}`;
    suffix += 1;
  }
  usedIdsSet.add(candidate);
  return candidate;
}

document.addEventListener("DOMContentLoaded", () => {
  initHeroBackdropFallback();
  initAccessibilityMode();
  initLiveDateTimeClockAndAmbient();
  initAmbientAnimationPause();
  initYambirnoWeatherWidget();
  initChalkboardEngine();
  initScrollRevealAndCounters();
  initDigitalNavigatorTabs();
  initWeekdayAndGradeSwitchers();
  initGlidePills();
  initShareScheduleToChat();
  initShareAndQrModule();
  initCopyButtons();
  initGalleryLightbox();
  initPublicationModalEvents();
  initScrollSpyAndProgressRing();
  initLiveSheetWidgetAndMenu();
  initFeedbackForm();
  initMotionTiltAndParallax();
  registerOfflineServiceWorker();
});

function initHeroBackdropFallback() {
  const backdrop = document.getElementById("hero-backdrop");
  const img = document.getElementById("hero-backdrop-img");
  const scrim = document.querySelector(".hero-scrim");
  if (!backdrop || !img) return;

  let triedCoverFallback = false;

  const handleImageError = () => {
    if (!triedCoverFallback) {
      triedCoverFallback = true;
      backdrop.querySelectorAll("source").forEach((srcEl) => srcEl.remove());
      img.src = HERO_FALLBACK_IMAGE_URL;
      return;
    }
    backdrop.classList.add("hidden");
    if (scrim) scrim.classList.add("hidden");
  };

  img.addEventListener("error", handleImageError);
  if (img.complete && img.naturalWidth === 0) {
    handleImageError();
  }
}

function initAmbientAnimationPause() {
  const targets = [
    document.getElementById("live-widget-card"),
    document.getElementById("hero-ambient")
  ].filter(Boolean);

  if (targets.length === 0) return;

  const visibilityMap = new Map();
  targets.forEach((el) => visibilityMap.set(el, true));

  const syncPauseState = () => {
    const tabHidden = Boolean(document.hidden);
    targets.forEach((el) => {
      const inView = visibilityMap.get(el) !== false;
      el.classList.toggle("ambient-paused", tabHidden || !inView);
    });
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap.set(entry.target, entry.isIntersecting);
        });
        syncPauseState();
      },
      { threshold: 0.01 }
    );
    targets.forEach((el) => observer.observe(el));
  }

  document.addEventListener("visibilitychange", syncPauseState);
  syncPauseState();
}

function initChalkboardEngine() {
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
  const quizLabelEl = document.getElementById("chalkboard-quiz-label");
  const nextBtn = document.getElementById("chalkboard-next-btn");
  const revealBtn = document.getElementById("chalkboard-reveal-btn");

  if (!widget || !problemEl || !stepsEl || !answerEl) return;

  let currentIdx = 0;
  let isQuizMode = false;
  let isViewportVisible = true;
  let runToken = 0;
  let revealResolver = null;
  let pauseWaiters = [];
  const totalSteps = CHALKBOARD_CURRICULUM.length;

  const flushPauseWaiters = () => {
    if (pauseWaiters.length === 0) return;
    const waiters = pauseWaiters;
    pauseWaiters = [];
    waiters.forEach((fn) => fn());
  };

  const notifyCanResume = () => {
    if (!document.hidden && isViewportVisible) {
      flushPauseWaiters();
    }
  };

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isViewportVisible = entry.isIntersecting;
        });
        notifyCanResume();
      },
      { threshold: 0.05 }
    );
    obs.observe(widget);
  }

  document.addEventListener("visibilitychange", notifyCanResume);

  const waitMs = (ms, token) =>
    new Promise((resolve) => {
      const schedule = () => {
        if (token !== runToken) {
          resolve(false);
          return;
        }
        if (document.hidden || !isViewportVisible) {
          pauseWaiters.push(schedule);
          return;
        }
        setTimeout(() => {
          if (token !== runToken) {
            resolve(false);
            return;
          }
          if (document.hidden || !isViewportVisible) {
            pauseWaiters.push(() => resolve(token === runToken));
            return;
          }
          resolve(true);
        }, ms);
      };
      schedule();
    });

  const typeChalkString = async (targetEl, text, token, baseSpeed = 58) => {
    if (isReducedMotionPreferred()) {
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

  const renderStaticReducedItem = (item) => {
    contentWrap.classList.remove("erasing");
    wetWipeEl.classList.remove("wiping");
    if (cursorEl) cursorEl.classList.add("hidden");
    if (badgeEl) badgeEl.textContent = item.badge;
    if (topicEl) topicEl.textContent = item.topic;
    if (counterEl) counterEl.textContent = `Ступень ${item.grade} из ${totalSteps}`;
    problemEl.textContent = item.problem;

    if (isQuizMode) {
      stepsEl.textContent = "";
      answerEl.textContent = "";
      if (statusEl) statusEl.textContent = "Проверьте себя и нажмите кнопку ниже";
      revealBtn.classList.remove("hidden");
    } else {
      stepsEl.textContent = item.steps;
      answerEl.textContent = item.answer;
      if (statusEl) statusEl.textContent = "Решено верно";
      revealBtn.classList.add("hidden");
    }
  };

  const runStageLoop = async (token) => {
    if (isReducedMotionPreferred()) {
      renderStaticReducedItem(CHALKBOARD_CURRICULUM[currentIdx]);
      return;
    }

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
      if (counterEl) counterEl.textContent = `Ступень ${item.grade} из ${totalSteps}`;

      if (statusEl) statusEl.textContent = "Пишет условие у доски...";
      const ok1 = await typeChalkString(problemEl, item.problem, token, 62);
      if (!ok1) return;

      if (cursorEl) cursorEl.classList.add("thinking");
      if (statusEl) statusEl.textContent = "Считает в уме...";
      const ok2 = await waitMs(950, token);
      if (!ok2) return;

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

      if (cursorEl) cursorEl.classList.remove("thinking");
      if (statusEl) statusEl.textContent = "Расписывает решение...";
      const ok3 = await typeChalkString(stepsEl, item.steps, token, 52);
      if (!ok3) return;

      const okPause = await waitMs(480, token);
      if (!okPause) return;

      if (statusEl) statusEl.textContent = "Выводит ответ...";
      const ok4 = await typeChalkString(answerEl, item.answer, token, 68);
      if (!ok4) return;

      if (statusEl) statusEl.textContent = "Решено верно";
      const okHold = await waitMs(2300, token);
      if (!okHold) return;

      if (statusEl) statusEl.textContent = "Стирает с доски...";
      wetWipeEl.classList.add("wiping");
      contentWrap.classList.add("erasing");

      const okWipe = await waitMs(750, token);
      if (!okWipe) return;

      currentIdx = (currentIdx + 1) % totalSteps;
    }
  };

  const restartFromCurrent = () => {
    runToken++;
    flushPauseWaiters();
    if (revealResolver) {
      revealResolver(false);
      revealResolver = null;
    }
    runStageLoop(runToken);
  };

  chalkboardSyncCallback = restartFromCurrent;

  if (quizToggleBtn) {
    quizToggleBtn.addEventListener("click", () => {
      isQuizMode = !isQuizMode;
      quizToggleBtn.setAttribute("aria-pressed", String(isQuizMode));
      if (quizLabelEl) {
        quizLabelEl.textContent = isQuizMode ? "Режим: Сам" : "Решить самому";
      } else {
        quizToggleBtn.textContent = isQuizMode ? "Режим: Сам" : "Решить самому";
      }
      showDynamicIslandToast(
        isQuizMode
          ? "Включён режим самопроверки на школьной доске"
          : "Включён автоматический показ решений на доске"
      );
      if (isReducedMotionPreferred()) {
        renderStaticReducedItem(CHALKBOARD_CURRICULUM[currentIdx]);
        return;
      }
      if (!isQuizMode && revealResolver) {
        revealResolver(true);
      }
    });
  }

  if (revealBtn) {
    revealBtn.addEventListener("click", () => {
      if (isReducedMotionPreferred()) {
        const item = CHALKBOARD_CURRICULUM[currentIdx];
        stepsEl.textContent = item.steps;
        answerEl.textContent = item.answer;
        revealBtn.classList.add("hidden");
        if (statusEl) statusEl.textContent = "Решено верно";
        return;
      }
      if (revealResolver) revealResolver(true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentIdx = (currentIdx + 1) % totalSteps;
      restartFromCurrent();
    });
  }

  runStageLoop(runToken);
}

function parseBellTimeRangeString(rawRangeStr, lessonNum) {
  const fallback = DEFAULT_BELL_TIMES[lessonNum] || null;
  const cleaned = sanitizeInput(rawRangeStr || "", 40);

  if (!cleaned) {
    if (lessonNum === 0 || lessonNum === 8) {
      return { bell: null, isCustom: false };
    }
    return { bell: fallback ? { ...fallback } : null, isCustom: false };
  }

  const match = cleaned.match(/(\d{1,2})[:.](\d{2})\s*[-–—]\s*(\d{1,2})[:.](\d{2})/);
  if (!match) {
    if (lessonNum === 0 || lessonNum === 8) {
      return { bell: null, isCustom: false };
    }
    return { bell: fallback ? { ...fallback } : null, isCustom: false };
  }

  const sh = parseInt(match[1], 10);
  const sm = parseInt(match[2], 10);
  const eh = parseInt(match[3], 10);
  const em = parseInt(match[4], 10);

  if (sh > 23 || sm > 59 || eh > 23 || em > 59) {
    return { bell: fallback ? { ...fallback } : null, isCustom: false };
  }

  const startFormatted = `${String(sh).padStart(2, "0")}:${String(sm).padStart(2, "0")}`;
  const endFormatted = `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;

  const isDifferentFromDefault = fallback
    ? startFormatted !== fallback.start || endFormatted !== fallback.end
    : false;

  return {
    bell: {
      start: startFormatted,
      end: endFormatted,
      startMin,
      endMin: endMin > startMin ? endMin : startMin + 40
    },
    isCustom: isDifferentFromDefault
  };
}

function classifyLessonSubject(subjectTitle, lessonNum = 1) {
  const s = (subjectTitle || "").toLowerCase();
  if (lessonNum === 0 || s.includes("важном") || s.includes("горизонт")) {
    return { cls: "subj-zero", iconId: "ico-zero-lesson" };
  }
  if (
    s.includes("математ") ||
    s.includes("мат. грамот") ||
    s.includes("алгебр") ||
    s.includes("геометр") ||
    s.includes("информат") ||
    s.includes("физик") ||
    s.includes("вероятност")
  ) {
    return { cls: "subj-math", iconId: "ico-math" };
  }
  if (
    s.includes("естественно-науч") ||
    s.includes("ен грамот") ||
    s.includes("биолог") ||
    s.includes("хими") ||
    s.includes("географ") ||
    s.includes("окружающ")
  ) {
    return { cls: "subj-sci", iconId: "ico-science" };
  }
  if (
    s.includes("русск") ||
    s.includes("литерат") ||
    s.includes("чтени") ||
    s.includes("читательск") ||
    s.includes("грамот") ||
    s.includes("письм") ||
    s.includes("английск") ||
    s.includes("родной")
  ) {
    return { cls: "subj-lang", iconId: "ico-cat-memo" };
  }
  if (
    s.includes("истори") ||
    s.includes("обществ") ||
    s.includes("орксэ") ||
    s.includes("днкр") ||
    s.includes("орлят") ||
    s.includes("служен") ||
    s.includes("край") ||
    s.includes("профориент") ||
    s.includes("проект")
  ) {
    return { cls: "subj-hist", iconId: "ico-history" };
  }
  return { cls: "subj-art", iconId: "ico-art" };
}

function parseRawScheduleIntoLessons(rawText) {
  const cleaned = sanitizeInput(rawText || "", 1200);
  if (!cleaned) return [];

  const parts = cleaned
    .replace(/(^|\s)([0-9])[.)](?=\s*[А-Яа-яЁёA-Za-z«"(])/g, "\n$2. ")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return parts.map((item, idx) => {
    const match = item.match(/^([0-9])[.)]\s*(.+)$/);
    if (match) {
      return { num: parseInt(match[1], 10), title: match[2].trim() };
    }
    return { num: idx + 1, title: item };
  });
}

function renderScheduleSkeleton(containerEl) {
  if (!containerEl) return;
  clearElement(containerEl);
  const stack = document.createElement("div");
  stack.className = "skeleton-stack";
  stack.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 5; i++) {
    const row = document.createElement("div");
    row.className = "skeleton-row";
    stack.appendChild(row);
  }
  containerEl.appendChild(stack);
}

function renderEmptyScheduleState(containerEl, isOfflineError = false) {
  if (!containerEl) return;
  const box = document.createElement("div");
  box.className = "diary-empty-state";

  const title = document.createElement("div");
  title.className = "diary-empty-title";
  title.appendChild(createSpriteIcon("ico-schedule", "", 17));
  const titleSpan = document.createElement("span");
  titleSpan.textContent = isOfflineError
    ? "Не удалось загрузить расписание"
    : "Расписание уточняется";
  title.appendChild(titleSpan);

  const text = document.createElement("p");
  text.className = "diary-empty-text";
  text.textContent = isOfflineError
    ? "Проверьте подключение к интернету и нажмите кнопку «Обновить». Приносим извинения за временные неудобства."
    : "Актуальное расписание занятий для этого класса сейчас уточняется и будет опубликовано в ближайшее время.";

  const contact = document.createElement("div");
  contact.className = "diary-empty-contact";
  contact.textContent = "Уточнить уроки можно у классного руководителя или по тел. 8 (49147) 2-63-68";

  box.appendChild(title);
  box.appendChild(text);
  box.appendChild(contact);
  containerEl.appendChild(box);
}

function getBellForLessonNumber(lessonNum) {
  if (Object.prototype.hasOwnProperty.call(activeBellTimes, lessonNum)) {
    return activeBellTimes[lessonNum];
  }
  return DEFAULT_BELL_TIMES[lessonNum] || null;
}

function renderDiaryLessonCards(containerEl, rawScheduleText, selectedDayNum, skipAnimation = false, isOfflineError = false) {
  if (!containerEl) return;
  clearElement(containerEl);

  const shiftBanner = document.getElementById("bell-shift-warning");
  if (shiftBanner) {
    shiftBanner.classList.toggle("hidden", !isCustomBellScheduleActive);
  }

  const lessons = parseRawScheduleIntoLessons(rawScheduleText);
  if (lessons.length === 0) {
    renderEmptyScheduleState(containerEl, isOfflineError);
    return;
  }

  const nowMsk = getMoscowTimeParts();
  const isTodaySelected = nowMsk.weekday === selectedDayNum;
  const currentTotalMinutes = nowMsk.hours * 60 + nowMsk.minutes;

  lessons.forEach((lessonObj, idx) => {
    const row = document.createElement("div");
    const subjMeta = classifyLessonSubject(lessonObj.title, lessonObj.num);
    row.className = `diary-lesson-row ${subjMeta.cls}`;
    if (skipAnimation || isReducedMotionPreferred()) {
      row.classList.add("no-cascade");
    } else {
      row.style.setProperty("--step", String(idx));
    }

    const left = document.createElement("div");
    left.className = "diary-lesson-left";

    const numBadge = document.createElement("span");
    numBadge.className = lessonObj.num === 0 ? "diary-lesson-num is-zero" : "diary-lesson-num";
    numBadge.textContent = String(lessonObj.num);

    const iconSpan = document.createElement("span");
    iconSpan.className = "diary-lesson-icon";
    iconSpan.setAttribute("aria-hidden", "true");
    iconSpan.appendChild(createSpriteIcon(subjMeta.iconId, "", 17));

    const nameSpan = document.createElement("span");
    nameSpan.className = "diary-lesson-name";
    nameSpan.textContent = lessonObj.title;

    left.appendChild(numBadge);
    left.appendChild(iconSpan);
    left.appendChild(nameSpan);

    const right = document.createElement("div");
    right.className = "diary-lesson-right";

    const bell = getBellForLessonNumber(lessonObj.num);
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
      } else if (isTodaySelected && currentTotalMinutes > bell.endMin && currentTotalMinutes < 1020) {
        const donePill = document.createElement("span");
        donePill.className = "lesson-done-pill";
        donePill.textContent = "Прошёл";
        right.appendChild(donePill);
      }

      const timeSpan = document.createElement("span");
      timeSpan.className = "diary-lesson-time";
      timeSpan.textContent = `${bell.start}–${bell.end}`;
      right.appendChild(timeSpan);
    }

    row.appendChild(left);
    row.appendChild(right);
    containerEl.appendChild(row);
  });
}

function buildCurrentScheduleSharePayload() {
  const dayName = DAY_NAMES_FULL[currentSelectedWeekday] || "Понедельник";
  let rawSchedule = "";
  if (
    latestParsedSheetData &&
    latestParsedSheetData.scheduleByGradeAndDay &&
    latestParsedSheetData.scheduleByGradeAndDay[currentSelectedGrade] &&
    latestParsedSheetData.scheduleByGradeAndDay[currentSelectedGrade][currentSelectedWeekday]
  ) {
    rawSchedule = latestParsedSheetData.scheduleByGradeAndDay[currentSelectedGrade][currentSelectedWeekday];
  }

  const lessons = parseRawScheduleIntoLessons(rawSchedule);
  if (lessons.length === 0) return null;

  const formattedLessons = lessons
    .map((l) => {
      const bell = getBellForLessonNumber(l.num);
      const timeStr = bell ? ` (${bell.start}–${bell.end})` : "";
      return `${l.num}. ${l.title}${timeStr}`;
    })
    .join("\n");

  const tomTemp = document.getElementById("weather-tomorrow-temp");
  const advice = document.getElementById("weather-parent-advice");
  const weatherHeading = isTomorrowWeekendWeather
    ? "Погода в с. Ямбирно завтра утром (выходной, 08:00):"
    : "Погода в с. Ямбирно к 1-му уроку:";
  const weatherLine =
    tomTemp && advice && tomTemp.textContent.trim() !== "..."
      ? `\n\n${weatherHeading} ${tomTemp.textContent.trim()}\n${advice.textContent.trim()}`
      : "";

  const textForChat =
    `Расписание уроков — ${dayName} (${currentSelectedGrade} класс):\n` +
    formattedLessons +
    weatherLine +
    `\n\nПортал школы: ${SITE_CANONICAL_URL}`;

  return {
    title: `Расписание ${currentSelectedGrade} класса (${dayName}) — Школа с. Ямбирно`,
    text: textForChat,
    url: `${SITE_CANONICAL_URL}#live-widget-card`
  };
}

function drawCanvasRoundedRect(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

async function resolveQrPathDataForCanvas() {
  try {
    const resp = await fetchWithTimeout(SCHOOL_QR_SVG_URL, { cache: "default" }, 3000);
    if (resp && resp.ok) {
      const svgText = await resp.text();
      const match = svgText.match(/<path[^>]*\bd="([^"]+)"/i);
      if (match && match[1] && /M\d+,\d+h\d+v1h-\d+z/.test(match[1])) {
        return match[1];
      }
    }
  } catch (_) {}
  return SCHOOL_QR_PATH_FALLBACK;
}

function getSchoolQrPosterAsset() {
  if (cachedQrPosterPromise) return cachedQrPosterPromise;

  cachedQrPosterPromise = (async () => {
    const pathData = await resolveQrPathDataForCanvas();
    const W = 1200;
    const H = 1500;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, W, H);

    drawCanvasRoundedRect(ctx, 48, 48, W - 96, 256, 36);
    ctx.fillStyle = "#1e3a8a";
    ctx.fill();

    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(48, 280, W - 96, 26);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fde68a";
    ctx.font = '700 28px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillText("ШАЦКИЙ РАЙОН • РЯЗАНСКАЯ ОБЛАСТЬ • С. ЯМБИРНО", W / 2, 102);

    ctx.fillStyle = "#ffffff";
    ctx.font = '800 46px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillText("Ямбирнский филиал", W / 2, 166);
    ctx.fillText("МОУ «Лесно-Конобеевская СШ»", W / 2, 228);

    drawCanvasRoundedRect(ctx, 130, 355, W - 260, 860, 40);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#cbd5e1";
    ctx.stroke();

    const vb = 45;
    const qrScale = 18;
    const qrPx = vb * qrScale;
    const qrX0 = Math.floor((W - qrPx) / 2);
    const qrY0 = 380;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(qrX0, qrY0, qrPx, qrPx);

    ctx.fillStyle = "#0f172a";
    const runRegex = /M(\d+),(\d+)h(\d+)v1h-\d+z/g;
    let m;
    while ((m = runRegex.exec(pathData)) !== null) {
      const rx = parseInt(m[1], 10);
      const ry = parseInt(m[2], 10);
      const rw = parseInt(m[3], 10);
      ctx.fillRect(qrX0 + rx * qrScale, qrY0 + ry * qrScale, rw * qrScale, qrScale);
    }

    ctx.fillStyle = "#1e40af";
    ctx.font = '800 36px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillText("Наведите камеру смартфона", W / 2, 1266);

    ctx.fillStyle = "#334155";
    ctx.font = '600 28px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillText("Расписание 1–9 классов • Погода • Меню питания", W / 2, 1324);
    ctx.fillText("Дневник, Учи.ру • Новости • Электронная приёмная", W / 2, 1368);

    ctx.fillStyle = "#64748b";
    ctx.font = '600 22px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillText("sergievposadprimoauxiliumsta-crypto.github.io/yambirno-school/", W / 2, 1432);

    const dataUrl = canvas.toDataURL("image/png");
    const blob = await new Promise((resolve) => {
      if (typeof canvas.toBlob === "function") {
        canvas.toBlob((b) => resolve(b), "image/png");
      } else {
        resolve(null);
      }
    });

    if (!blob) {
      cachedQrPosterPromise = null;
      return null;
    }

    return { blob, dataUrl };
  })().catch(() => {
    cachedQrPosterPromise = null;
    return null;
  });

  return cachedQrPosterPromise;
}

async function copyImageBlobToClipboard(blob) {
  if (!blob || !navigator.clipboard || typeof navigator.clipboard.write !== "function" || typeof ClipboardItem === "undefined") {
    return false;
  }
  try {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return true;
  } catch (_) {
    return false;
  }
}

async function downloadSchoolQrPoster() {
  const asset = await getSchoolQrPosterAsset();
  if (!asset || !asset.blob) {
    showDynamicIslandToast("Не удалось сформировать плакат — воспользуйтесь печатью");
    return false;
  }

  const blobUrl = URL.createObjectURL(asset.blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = SCHOOL_QR_POSTER_FILENAME;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);
  showDynamicIslandToast("QR-плакат (PNG) сохранён на устройство");
  return true;
}

function buildMaxDeepLinkUrl(text) {
  const safeText = String(text || SITE_CANONICAL_URL).slice(0, 1800);
  return `${MAX_SHARE_DEEPLINK_BASE}?text=${encodeURIComponent(safeText)}`;
}

function getMaxWebTargetUrl() {
  if (MAX_SCHOOL_CHAT_URL && /^https:\/\/[a-z0-9.-]*max\.ru(\/|$)/i.test(MAX_SCHOOL_CHAT_URL)) {
    return MAX_SCHOOL_CHAT_URL;
  }
  return MAX_WEB_URL;
}

async function shareToMaxMessenger(payload) {
  const modal = document.getElementById("max-share-modal");
  const titleEl = document.getElementById("max-modal-title");
  const subtitleEl = document.getElementById("max-modal-subtitle");
  const posterWrap = document.getElementById("max-modal-poster-wrap");
  const posterImg = document.getElementById("max-modal-poster-img");
  const textPreview = document.getElementById("max-modal-text-preview");
  const nativeBtn = document.getElementById("max-share-native-btn");
  const nativeLabel = document.getElementById("max-share-native-label");
  const copyPosterBtn = document.getElementById("max-copy-poster-btn");
  const downloadPosterBtn = document.getElementById("max-download-poster-btn");
  const closeBtn = document.getElementById("max-modal-close");

  const title = (payload && payload.title) || "Ямбирнский филиал МОУ «Лесно-Конобеевская СШ»";
  const url = (payload && payload.url) || SITE_CANONICAL_URL;
  const rawText = (payload && payload.text) || `Информационный портал школы с. Ямбирно: расписание 1–9 классов, меню питания и новости.\n${url}`;
  const fullText = rawText.includes(url) ? rawText : `${rawText}\n${url}`;
  const includeQrPoster = Boolean(payload && payload.includeQrPoster);

  activeMaxSharePayload = {
    title,
    url,
    text: fullText,
    includeQrPoster,
    posterBlob: null
  };

  if (!modal) {
    await copyTextToClipboard(fullText);
    window.open(buildMaxDeepLinkUrl(fullText), "_blank", "noopener,noreferrer");
    return;
  }

  if (titleEl) {
    titleEl.textContent = includeQrPoster
      ? "Отправить QR-плакат и ссылку в MAX"
      : "Отправить в мессенджер MAX";
  }
  if (subtitleEl) {
    subtitleEl.textContent = includeQrPoster
      ? "Выберите: открыть приложение MAX, браузерную версию или отправить файл плаката напрямую."
      : "Выберите удобный способ: через приложение MAX или через веб-версию в браузере.";
  }
  if (textPreview) {
    textPreview.textContent = fullText;
  }

  if (posterWrap) posterWrap.classList.toggle("hidden", !includeQrPoster);
  if (copyPosterBtn) copyPosterBtn.classList.toggle("hidden", !includeQrPoster);
  if (downloadPosterBtn) downloadPosterBtn.classList.toggle("hidden", !includeQrPoster);

  const canNativeShare = Boolean(navigator.share);
  if (nativeBtn) {
    nativeBtn.classList.toggle("hidden", !canNativeShare);
  }
  if (nativeLabel) {
    nativeLabel.textContent = includeQrPoster
      ? "Отправить плакат и ссылку (через MAX)"
      : "Поделиться через установленный MAX";
  }

  maxModalTriggerEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  lockPageScrollForModal(false);
  modal.classList.remove("hidden");
  modal.removeAttribute("hidden");
  if (closeBtn) closeBtn.focus();

  if (includeQrPoster) {
    const asset = await getSchoolQrPosterAsset();
    if (asset && activeMaxSharePayload && activeMaxSharePayload.includeQrPoster) {
      activeMaxSharePayload.posterBlob = asset.blob;
      if (posterImg && asset.dataUrl) {
        posterImg.src = asset.dataUrl;
      }
    }
  }
}

function initShareScheduleToChat() {
  const shareBtn = document.getElementById("share-schedule-btn");
  const shareMaxBtn = document.getElementById("share-schedule-max-btn");

  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const payload = buildCurrentScheduleSharePayload();
      if (!payload) {
        showDynamicIslandToast(`Расписание для ${currentSelectedGrade} класса пока уточняется`);
        return;
      }
      const copied = await copyTextToClipboard(payload.text);
      showDynamicIslandToast(
        copied
          ? `Расписание ${currentSelectedGrade} класса скопировано для чата`
          : "Не удалось скопировать — выделите расписание вручную"
      );
    });
  }

  if (shareMaxBtn) {
    shareMaxBtn.addEventListener("click", async () => {
      const payload = buildCurrentScheduleSharePayload();
      if (!payload) {
        showDynamicIslandToast(`Расписание для ${currentSelectedGrade} класса пока уточняется`);
        return;
      }
      await shareToMaxMessenger({ ...payload, includeQrPoster: false });
    });
  }
}

function initShareAndQrModule() {
  const shareSiteMaxBtn = document.getElementById("share-site-max-btn");
  const copySiteUrlBtn = document.getElementById("copy-site-url-btn");
  const openQrModalBtn = document.getElementById("open-qr-modal-btn");
  const qrCardPreviewBtn = document.getElementById("qr-card-preview-btn");
  const footerQrBtn = document.getElementById("footer-qr-btn");

  const qrModal = document.getElementById("qr-modal");
  const qrModalClose = document.getElementById("qr-modal-close");
  const qrModalMaxBtn = document.getElementById("qr-modal-max-btn");
  const qrModalPrintBtn = document.getElementById("qr-modal-print-btn");
  const qrModalDownloadBtn = document.getElementById("qr-modal-download-btn");

  const maxModal = document.getElementById("max-share-modal");
  const maxModalClose = document.getElementById("max-modal-close");
  const maxNativeBtn = document.getElementById("max-share-native-btn");
  const maxAppBtn = document.getElementById("max-share-app-btn");
  const maxWebBtn = document.getElementById("max-share-web-btn");
  const maxCopyPosterBtn = document.getElementById("max-copy-poster-btn");
  const maxDownloadPosterBtn = document.getElementById("max-download-poster-btn");
  const maxCopyTextBtn = document.getElementById("max-copy-text-btn");

  const siteSharePayload = {
    title: "Ямбирнский филиал МОУ «Лесно-Конобеевская СШ»",
    text: `Информационный портал Ямбирнского филиала (с. Ямбирно): расписание 1–9 классов, погода к 1-му уроку, меню питания, Дневник и Учи.ру:\n${SITE_CANONICAL_URL}`,
    url: SITE_CANONICAL_URL,
    includeQrPoster: true
  };

  if (shareSiteMaxBtn) {
    shareSiteMaxBtn.addEventListener("click", () => shareToMaxMessenger(siteSharePayload));
  }

  if (copySiteUrlBtn) {
    copySiteUrlBtn.addEventListener("click", async () => {
      const copied = await copyTextToClipboard(SITE_CANONICAL_URL);
      showDynamicIslandToast(
        copied
          ? "Ссылка на портал школы скопирована"
          : "Не удалось скопировать — скопируйте адрес из строки браузера"
      );
    });
  }

  if (maxModal) {
    const closeMaxModal = () => {
      if (maxModal.classList.contains("hidden")) return;
      maxModal.classList.add("hidden");
      maxModal.setAttribute("hidden", "");
      const returnEl = maxModalTriggerEl;
      maxModalTriggerEl = null;
      unlockPageScrollAfterModal(returnEl);
    };

    if (maxModalClose) maxModalClose.addEventListener("click", closeMaxModal);

    maxModal.addEventListener("click", (e) => {
      if (e.target === maxModal) closeMaxModal();
    });

    document.addEventListener("keydown", (e) => {
      if (maxModal.classList.contains("hidden")) return;
      if (e.key === "Escape") {
        closeMaxModal();
        return;
      }
      handleModalFocusTrap(e, maxModal);
    });

    if (maxNativeBtn) {
      maxNativeBtn.addEventListener("click", async () => {
        if (!activeMaxSharePayload || !navigator.share) return;
        const { title, text, url, includeQrPoster } = activeMaxSharePayload;
        try {
          if (includeQrPoster) {
            let blob = activeMaxSharePayload.posterBlob;
            if (!blob) {
              const asset = await getSchoolQrPosterAsset();
              blob = asset && asset.blob;
            }
            if (blob && typeof File !== "undefined") {
              const posterFile = new File([blob], SCHOOL_QR_POSTER_FILENAME, { type: "image/png" });
              if (typeof navigator.canShare === "function" && navigator.canShare({ files: [posterFile] })) {
                await navigator.share({ title, text, files: [posterFile] });
                showDynamicIslandToast("QR-плакат и ссылка переданы в MAX");
                closeMaxModal();
                return;
              }
            }
          }
          await navigator.share({ title, text, url });
          showDynamicIslandToast("Готово к отправке в MAX");
          closeMaxModal();
        } catch (err) {
          if (err && err.name === "AbortError") return;
          showDynamicIslandToast("Выберите приложение или браузер MAX ниже");
        }
      });
    }

    if (maxAppBtn) {
      maxAppBtn.addEventListener("click", async () => {
        if (!activeMaxSharePayload) return;
        const { text, includeQrPoster } = activeMaxSharePayload;
        let posterCopied = false;

        if (includeQrPoster) {
          let blob = activeMaxSharePayload.posterBlob;
          if (!blob) {
            const asset = await getSchoolQrPosterAsset();
            blob = asset && asset.blob;
          }
          posterCopied = await copyImageBlobToClipboard(blob);
          if (!posterCopied) {
            await copyTextToClipboard(text);
          }
        } else {
          await copyTextToClipboard(text);
        }

        window.open(buildMaxDeepLinkUrl(text), "_blank", "noopener,noreferrer");
        showDynamicIslandToast(
          includeQrPoster && posterCopied
            ? "MAX открывается! QR-плакат в буфере — нажмите Ctrl+V в чате"
            : "Открываем приложение MAX с готовым текстом"
        );
      });
    }

    if (maxWebBtn) {
      maxWebBtn.addEventListener("click", async () => {
        if (!activeMaxSharePayload) return;
        const { text, includeQrPoster } = activeMaxSharePayload;
        let posterCopied = false;
        let textCopied = false;

        if (includeQrPoster) {
          let blob = activeMaxSharePayload.posterBlob;
          if (!blob) {
            const asset = await getSchoolQrPosterAsset();
            blob = asset && asset.blob;
          }
          posterCopied = await copyImageBlobToClipboard(blob);
          if (!posterCopied) {
            textCopied = await copyTextToClipboard(text);
          }
        } else {
          textCopied = await copyTextToClipboard(text);
        }

        window.open(getMaxWebTargetUrl(), "_blank", "noopener,noreferrer");
        if (includeQrPoster && posterCopied) {
          showDynamicIslandToast("QR-плакат скопирован! Нажмите Ctrl+V в веб-версии MAX");
        } else if (textCopied) {
          showDynamicIslandToast("Скопировано! Нажмите Ctrl+V в веб-версии MAX");
        } else {
          showDynamicIslandToast("Открыт MAX в браузере — вставьте плакат или ссылку");
        }
      });
    }

    if (maxCopyPosterBtn) {
      maxCopyPosterBtn.addEventListener("click", async () => {
        let blob = activeMaxSharePayload && activeMaxSharePayload.posterBlob;
        if (!blob) {
          const asset = await getSchoolQrPosterAsset();
          blob = asset && asset.blob;
        }
        const ok = await copyImageBlobToClipboard(blob);
        if (ok) {
          showDynamicIslandToast("QR-плакат (картинка) скопирован — вставьте Ctrl+V в MAX");
        } else {
          await downloadSchoolQrPoster();
        }
      });
    }

    if (maxDownloadPosterBtn) {
      maxDownloadPosterBtn.addEventListener("click", () => {
        downloadSchoolQrPoster();
      });
    }

    if (maxCopyTextBtn) {
      maxCopyTextBtn.addEventListener("click", async () => {
        if (!activeMaxSharePayload) return;
        const ok = await copyTextToClipboard(activeMaxSharePayload.text);
        showDynamicIslandToast(
          ok ? "Текст и ссылка скопированы" : "Не удалось скопировать текст"
        );
      });
    }
  }

  if (!qrModal) return;

  const openQrModal = () => {
    lockPageScrollForModal(true);
    qrModal.classList.remove("hidden");
    qrModal.removeAttribute("hidden");
    if (qrModalClose) qrModalClose.focus();
    getSchoolQrPosterAsset();
  };

  const closeQrModal = () => {
    if (qrModal.classList.contains("hidden")) return;
    document.body.classList.remove("printing-qr");
    qrModal.classList.add("hidden");
    qrModal.setAttribute("hidden", "");
    unlockPageScrollAfterModal();
  };

  [openQrModalBtn, qrCardPreviewBtn, footerQrBtn].filter(Boolean).forEach((btn) => {
    btn.addEventListener("click", openQrModal);
  });

  if (qrModalClose) qrModalClose.addEventListener("click", closeQrModal);

  qrModal.addEventListener("click", (e) => {
    if (e.target === qrModal) closeQrModal();
  });

  document.addEventListener("keydown", (e) => {
    if (qrModal.classList.contains("hidden")) return;
    if (maxModal && !maxModal.classList.contains("hidden")) return;
    if (e.key === "Escape") {
      closeQrModal();
      return;
    }
    handleModalFocusTrap(e, qrModal);
  });

  if (qrModalMaxBtn) {
    qrModalMaxBtn.addEventListener("click", () => shareToMaxMessenger(siteSharePayload));
  }

  if (qrModalDownloadBtn) {
    qrModalDownloadBtn.addEventListener("click", () => {
      downloadSchoolQrPoster();
    });
  }

  if (qrModalPrintBtn) {
    qrModalPrintBtn.addEventListener("click", () => {
      document.body.classList.add("printing-qr");
      window.addEventListener(
        "afterprint",
        () => document.body.classList.remove("printing-qr"),
        { once: true }
      );
      window.print();
    });
  }
}

function initLiveDateTimeClockAndAmbient() {
  const dateEl = document.getElementById("live-date-display");
  const timeEl = document.getElementById("live-time-display");
  const statusEl = document.getElementById("school-day-status");
  const statusTextEl = document.getElementById("school-day-status-text");
  const widgetTodayPill = document.getElementById("widget-today-pill");
  const widgetTodayText = document.getElementById("widget-today-text");
  const heroAmbient = document.getElementById("hero-ambient");
  if (!dateEl && !timeEl && !statusEl && !widgetTodayPill && !heroAmbient) return;

  let lastScheduleMinute = -1;

  const updateClock = () => {
    const msk = getMoscowTimeParts();
    const hour = msk.hours;
    const currentMinuteKey = msk.weekday * 1440 + hour * 60 + msk.minutes;

    if (heroAmbient) {
      heroAmbient.classList.toggle("ambient-morning", hour >= 6 && hour < 11);
      heroAmbient.classList.toggle("ambient-evening", hour >= 17 || hour < 6);
    }

    if (dateEl) dateEl.textContent = formatMoscowHeaderDate(msk);
    if (timeEl) timeEl.textContent = formatMoscowClock(msk);

    if (widgetTodayPill) {
      const shortDate = formatMoscowShortDate(msk);
      if (widgetTodayText) {
        widgetTodayText.textContent = `Сегодня, ${shortDate}`;
      } else {
        widgetTodayPill.textContent = `Сегодня, ${shortDate}`;
      }
    }

    if (statusEl) {
      const day = msk.weekday;
      let statusLabel = "";
      let iconId = "ico-school-day";

      if (customSheetSchoolStatus) {
        statusLabel = customSheetSchoolStatus;
        iconId = customSheetSchoolStatus.toLowerCase().includes("выходн")
          ? "ico-day-off"
          : "ico-school-day";
      } else if (day === 0 || day === 6) {
        statusLabel = "Выходной день • Приём обращений открыт";
        iconId = "ico-day-off";
      } else if (hour >= 8 && hour < 17) {
        statusLabel = "Учебный день (работа по расписанию)";
        iconId = "ico-school-day";
      } else {
        statusLabel = "Учебный день завершён • Приём обращений 24/7";
        iconId = "ico-day-off";
      }

      if (statusTextEl) {
        statusTextEl.textContent = statusLabel;
        updateElementSpriteIcon(statusEl, iconId);
      } else {
        statusEl.textContent = statusLabel;
      }
    }

    if (currentMinuteKey !== lastScheduleMinute) {
      const shouldRefreshSchedule =
        lastScheduleMinute !== -1 && latestParsedSheetData && msk.weekday === currentSelectedWeekday;
      lastScheduleMinute = currentMinuteKey;
      if (shouldRefreshSchedule) {
        renderDaySpecificScheduleAndMenu(latestParsedSheetData, currentSelectedWeekday, currentSelectedGrade, true);
      }
    }
  };

  refreshClockStatusCallback = updateClock;
  updateClock();
  setInterval(() => {
    if (!document.hidden) updateClock();
  }, 1000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateClock();
  });
}

function decodeWmoWeather(code) {
  if (code === 0) return { iconId: "ico-weather-sun", text: "Ясно", rain: false, snow: false, sky: "clear" };
  if (code === 1 || code === 2) return { iconId: "ico-weather-sun", text: "Переменная облачность", rain: false, snow: false, sky: "clear" };
  if (code === 3) return { iconId: "ico-weather-cloud", text: "Пасмурно", rain: false, snow: false, sky: "cloudy" };
  if (code === 45 || code === 48) return { iconId: "ico-weather-cloud", text: "Туман", rain: false, snow: false, sky: "cloudy" };
  if (code >= 51 && code <= 57) return { iconId: "ico-weather-rain", text: "Морось", rain: true, snow: false, sky: "rain" };
  if (code >= 61 && code <= 67) return { iconId: "ico-weather-rain", text: "Дождь", rain: true, snow: false, sky: "rain" };
  if (code >= 71 && code <= 77) return { iconId: "ico-weather-snow", text: "Снег", rain: false, snow: true, sky: "snow" };
  if (code >= 80 && code <= 82) return { iconId: "ico-weather-rain", text: "Ливень", rain: true, snow: false, sky: "rain" };
  if (code >= 85 || code === 86) return { iconId: "ico-weather-snow", text: "Снегопад", rain: false, snow: true, sky: "snow" };
  if (code >= 95) return { iconId: "ico-weather-rain", text: "Гроза", rain: true, snow: false, sky: "rain" };
  return { iconId: "ico-weather-sun", text: "Без осадков", rain: false, snow: false, sky: "clear" };
}

function findTomorrowMorningWeatherIndex(hourlyTimes) {
  if (!Array.isArray(hourlyTimes) || hourlyTimes.length === 0) return 32;
  const tomorrowMsk = getMoscowTimeParts(Date.now() + 86400000);
  const y = tomorrowMsk.year;
  const m = String(tomorrowMsk.month + 1).padStart(2, "0");
  const d = String(tomorrowMsk.day).padStart(2, "0");
  const targetKey = `${y}-${m}-${d}T08:00`;
  const exactIdx = hourlyTimes.indexOf(targetKey);
  if (exactIdx !== -1) return exactIdx;
  return hourlyTimes.length > 32 ? 32 : hourlyTimes.length - 1;
}

async function initYambirnoWeatherWidget() {
  const weatherBox = document.getElementById("yambirno-weather-box");
  const topPill = document.getElementById("top-weather-pill");
  const topText = document.getElementById("top-weather-text");
  if (!weatherBox && !topPill) return;

  const nowIconEl = document.getElementById("weather-now-icon");
  const nowTempEl = document.getElementById("weather-now-temp");
  const nowDescEl = document.getElementById("weather-now-desc");
  const tomLabelEl = document.getElementById("weather-tomorrow-label");
  const tomTempEl = document.getElementById("weather-tomorrow-temp");
  const tomDescEl = document.getElementById("weather-tomorrow-desc");
  const adviceEl = document.getElementById("weather-parent-advice");

  const tomorrowMsk = getMoscowTimeParts(Date.now() + 86400000);
  const isTomorrowWeekend = tomorrowMsk.weekday === 0 || tomorrowMsk.weekday === 6;
  isTomorrowWeekendWeather = isTomorrowWeekend;

  if (tomLabelEl) {
    if (isTomorrowWeekend) {
      tomLabelEl.textContent = "Завтра утром (выходной, 08:00):";
    } else if (tomorrowMsk.weekday === 1) {
      tomLabelEl.textContent = "Завтра утром (Пн, 08:00):";
    } else {
      tomLabelEl.textContent = "Завтра утром (08:00):";
    }
  }

  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${YAMBIRNO_LAT}&longitude=${YAMBIRNO_LON}&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&timezone=Europe%2FMoscow&forecast_days=2`;

  try {
    const res = await fetchWithTimeout(apiUrl, {}, 6500);
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

    if (topPill) {
      if (topText) {
        topText.textContent = `с. Ямбирно: ${curSign}`;
        updateElementSpriteIcon(topPill, curWmo.iconId);
      } else {
        topPill.textContent = `с. Ямбирно: ${curSign}`;
      }
    }

    if (nowIconEl) {
      setElementChild(nowIconEl, createSpriteIcon(curWmo.iconId, "", 22));
    }
    if (nowTempEl) nowTempEl.textContent = curSign;
    if (nowDescEl) nowDescEl.textContent = `${curWmo.text}, ветер ${curWind} м/с`;

    const morningIndex = findTomorrowMorningWeatherIndex(data.hourly && data.hourly.time);
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

    if (tomTempEl) {
      clearElement(tomTempEl);
      tomTempEl.appendChild(createSpriteIcon(tomWmo.iconId, "", 18));
      const valNode = document.createElement("span");
      valNode.textContent = tomSign;
      tomTempEl.appendChild(valNode);
    }
    if (tomDescEl) tomDescEl.textContent = `${tomWmo.text} (осадки ${tomPrecipProb}%)`;

    if (adviceEl) {
      adviceEl.classList.remove("advice-rain", "advice-cold", "advice-weekend");
      if (isTomorrowWeekend) {
        adviceEl.classList.add("advice-weekend");
        if (tomWmo.rain || (tomPrecipProb >= 40 && tomTempRaw > 0)) {
          adviceEl.textContent = "Завтра выходной — уроков нет. Если планируете прогулку, возьмите зонт или дождевик.";
        } else if (tomWmo.snow || (tomPrecipProb >= 40 && tomTempRaw <= 0)) {
          adviceEl.textContent = "Завтра выходной — уроков нет. Ожидается снег, одевайтесь на прогулку потеплее.";
        } else if (tomTempRaw <= -12) {
          adviceEl.textContent = "Завтра выходной — уроков нет. Утро будет морозным — берегите тепло.";
        } else {
          adviceEl.textContent = "Завтра выходной — уроков нет. Хорошего отдыха всей семье!";
        }
      } else if (tomWmo.rain || (tomPrecipProb >= 40 && tomTempRaw > 0)) {
        adviceEl.textContent = "Совет на утро: возможен дождь — дайте ребёнку в школу зонт или дождевик.";
        adviceEl.classList.add("advice-rain");
      } else if (tomWmo.snow || (tomPrecipProb >= 40 && tomTempRaw <= 0)) {
        adviceEl.textContent = "Совет на утро: ожидается снег — оденьте ребёнка потеплее, на улице может быть скользко.";
        adviceEl.classList.add("advice-cold");
      } else if (tomTempRaw <= -12) {
        adviceEl.textContent = "Совет на утро: морозное утро — не забудьте тёплую шапку, шарф и варежки.";
        adviceEl.classList.add("advice-cold");
      } else if (tomTempRaw <= 4) {
        adviceEl.textContent = "Совет на утро: прохладно и без осадков — рекомендуем тёплую куртку по сезону.";
      } else {
        adviceEl.textContent = "Совет на утро: осадков к 1-му уроку не ожидается — зонт не понадобится.";
      }
    }
  } catch (_) {
    if (topPill) {
      if (topText) topText.textContent = "с. Ямбирно";
      else topPill.textContent = "с. Ямбирно";
    }
    if (nowDescEl) nowDescEl.textContent = "Метеоданные обновляются";
    if (adviceEl) {
      adviceEl.classList.remove("advice-rain", "advice-cold", "advice-weekend");
      if (isTomorrowWeekend) {
        adviceEl.classList.add("advice-weekend");
        adviceEl.textContent = "Завтра выходной — уроков нет. Хорошего отдыха!";
      } else {
        adviceEl.textContent = "Удачного учебного дня и хорошей погоды!";
      }
    }
  }
}

function initAccessibilityMode() {
  const toggleBtn = document.getElementById("a11y-toggle");
  const panel = document.getElementById("a11y-panel");
  if (!toggleBtn) return;

  const sizeBtns = panel ? panel.querySelectorAll("[data-a11y-size]") : [];
  const themeBtns = panel ? panel.querySelectorAll("[data-a11y-theme]") : [];
  const fontBtns = panel ? panel.querySelectorAll("[data-a11y-font]") : [];
  const spacingBtns = panel ? panel.querySelectorAll("[data-a11y-spacing]") : [];
  const lhBtns = panel ? panel.querySelectorAll("[data-a11y-lh]") : [];
  const imagesToggleBtn = document.getElementById("a11y-images-toggle");
  const resetBtn = document.getElementById("a11y-reset-btn");

  const defaultSettings = {
    size: "normal",
    theme: "yellow",
    font: "sans",
    spacing: "normal",
    lh: "normal",
    showImages: false
  };

  let settings = { ...defaultSettings };
  try {
    const rawSettings =
      safeStorageGet("local", A11Y_SETTINGS_KEY) ||
      safeStorageGet("local", "yambirno_a11y_settings_v1");
    if (rawSettings) {
      const parsed = JSON.parse(rawSettings);
      settings = { ...defaultSettings, ...parsed };
    }
  } catch (_) {}

  const saveSettings = () => {
    safeStorageSet("local", A11Y_SETTINGS_KEY, JSON.stringify(settings));
  };

  const applySettings = () => {
    document.body.classList.remove(
      "a11y-size-large",
      "a11y-size-xlarge",
      "a11y-theme-white",
      "a11y-theme-black",
      "a11y-theme-blue",
      "a11y-font-serif",
      "a11y-spacing-medium",
      "a11y-spacing-large",
      "a11y-lh-medium",
      "a11y-lh-large",
      "a11y-show-images"
    );

    if (settings.size === "large") document.body.classList.add("a11y-size-large");
    if (settings.size === "xlarge") document.body.classList.add("a11y-size-xlarge");
    if (settings.theme === "white") document.body.classList.add("a11y-theme-white");
    if (settings.theme === "black") document.body.classList.add("a11y-theme-black");
    if (settings.theme === "blue") document.body.classList.add("a11y-theme-blue");
    if (settings.font === "serif") document.body.classList.add("a11y-font-serif");
    if (settings.spacing === "medium") document.body.classList.add("a11y-spacing-medium");
    if (settings.spacing === "large") document.body.classList.add("a11y-spacing-large");
    if (settings.lh === "medium") document.body.classList.add("a11y-lh-medium");
    if (settings.lh === "large") document.body.classList.add("a11y-lh-large");
    if (settings.showImages) document.body.classList.add("a11y-show-images");

    sizeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-a11y-size") === settings.size)));
    themeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-a11y-theme") === settings.theme)));
    fontBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-a11y-font") === settings.font)));
    spacingBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-a11y-spacing") === settings.spacing)));
    lhBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-a11y-lh") === settings.lh)));

    if (imagesToggleBtn) {
      imagesToggleBtn.setAttribute("aria-pressed", String(settings.showImages));
      imagesToggleBtn.textContent = settings.showImages ? "Показаны" : "Скрыты";
    }
  };

  const applyMode = (isEnabled, announce = false) => {
    document.body.classList.toggle("visually-impaired", isEnabled);
    toggleBtn.setAttribute("aria-pressed", String(isEnabled));
    toggleBtn.setAttribute("aria-label", "Версия для слабовидящих");

    if (panel) {
      panel.classList.toggle("hidden", !isEnabled);
      if (isEnabled) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
    }

    if (isEnabled) {
      applySettings();
      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.remove("reveal-pending");
        el.classList.add("visible");
      });
    }

    const textSpan = toggleBtn.querySelector(".a11y-btn-text");
    if (textSpan) {
      textSpan.textContent = isEnabled ? "✕ Обычный вид сайта" : "Версия для слабовидящих";
    }

    if (typeof chalkboardSyncCallback === "function") {
      chalkboardSyncCallback();
    }
    refreshAllGlidePills();

    if (announce) {
      showDynamicIslandToast(isEnabled ? "Включена версия для слабовидящих" : "Включён обычный вид сайта");
    }
  };

  const savedState = safeStorageGet("local", A11Y_STORAGE_KEY) === "true";
  applySettings();
  applyMode(savedState, false);

  toggleBtn.addEventListener("click", () => {
    const nextState = !document.body.classList.contains("visually-impaired");
    applyMode(nextState, true);
    safeStorageSet("local", A11Y_STORAGE_KEY, String(nextState));
  });

  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      settings.size = btn.getAttribute("data-a11y-size") || "normal";
      applySettings();
      saveSettings();
    });
  });

  themeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      settings.theme = btn.getAttribute("data-a11y-theme") || "yellow";
      applySettings();
      saveSettings();
    });
  });

  fontBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      settings.font = btn.getAttribute("data-a11y-font") || "sans";
      applySettings();
      saveSettings();
    });
  });

  spacingBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      settings.spacing = btn.getAttribute("data-a11y-spacing") || "normal";
      applySettings();
      saveSettings();
    });
  });

  lhBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      settings.lh = btn.getAttribute("data-a11y-lh") || "normal";
      applySettings();
      saveSettings();
    });
  });

  if (imagesToggleBtn) {
    imagesToggleBtn.addEventListener("click", () => {
      settings.showImages = !settings.showImages;
      applySettings();
      saveSettings();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      settings = { ...defaultSettings };
      applySettings();
      saveSettings();
      showDynamicIslandToast("Настройки версии для слабовидящих сброшены");
    });
  }
}

function parseCSVPreserveRowIndex(csvText) {
  const cleanText = String(csvText || "").replace(/^\uFEFF/, "");
  const rows = [];
  let currentRow = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

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
}

function parseMultiplePhotoUrls(rawCell) {
  if (typeof rawCell !== "string" || !rawCell.trim()) return [];
  return rawCell
    .split(/[\n,;]+|\s+(?=https?:\/\/)/i)
    .map((item) => item.trim())
    .filter((item) => item.length > 3);
}

function parseScheduleDateTime(rawDateStr) {
  const cleaned = sanitizeInput(rawDateStr || "", 60);
  if (!cleaned) {
    return { timestamp: 0, displayStr: "", isoDate: "", isFuture: false };
  }

  let day = 0;
  let month = 0;
  let year = 0;
  let hours = 0;
  let minutes = 0;
  let hasTimePart = false;

  const ruMatch = cleaned.match(
    /^(\d{1,2})[./\-](\d{1,2})[./\-](\d{2,4})(?:[T\s,]+(\d{1,2})[:.](\d{2})(?:[:.]\d{2})?)?$/
  );
  const isoMatch = !ruMatch
    ? cleaned.match(
        /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s,]+(\d{1,2})[:.](\d{2})(?:[:.]\d{2})?)?/
      )
    : null;

  if (ruMatch) {
    day = parseInt(ruMatch[1], 10);
    month = parseInt(ruMatch[2], 10);
    year = parseInt(ruMatch[3], 10);
    if (year < 100) year += 2000;
    if (ruMatch[4] !== undefined && ruMatch[5] !== undefined) {
      hours = parseInt(ruMatch[4], 10);
      minutes = parseInt(ruMatch[5], 10);
      hasTimePart = true;
    }
  } else if (isoMatch) {
    year = parseInt(isoMatch[1], 10);
    month = parseInt(isoMatch[2], 10);
    day = parseInt(isoMatch[3], 10);
    if (isoMatch[4] !== undefined && isoMatch[5] !== undefined) {
      hours = parseInt(isoMatch[4], 10);
      minutes = parseInt(isoMatch[5], 10);
      hasTimePart = true;
    }
  } else {
    return { timestamp: 0, displayStr: cleaned, isoDate: "", isFuture: false };
  }

  if (
    year < 2000 ||
    year > 2100 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return { timestamp: 0, displayStr: cleaned, isoDate: "", isFuture: false };
  }

  const checkDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  if (
    checkDate.getUTCFullYear() !== year ||
    checkDate.getUTCMonth() !== month - 1 ||
    checkDate.getUTCDate() !== day
  ) {
    return { timestamp: 0, displayStr: cleaned, isoDate: "", isFuture: false };
  }

  const targetMs = Date.UTC(year, month - 1, day, hours - 3, minutes, 0);
  const dd = String(day).padStart(2, "0");
  const mmNum = String(month).padStart(2, "0");
  const monthWord = RU_MONTHS_GENITIVE[month - 1] || mmNum;
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const displayStr = hasTimePart
    ? `${dd} ${monthWord} ${year} г. в ${hh}:${mm}`
    : `${dd} ${monthWord} ${year} г.`;
  const isoDate = `${year}-${mmNum}-${dd}T${hh}:${mm}:00+03:00`;

  return {
    timestamp: targetMs,
    displayStr,
    isoDate,
    isFuture: targetMs > Date.now()
  };
}

function classifyPublicationBadgeTheme(badgeText) {
  const b = (badgeText || "").toLowerCase();
  if (b.includes("важн") || b.includes("срочн") || b.includes("вниман")) {
    return {
      key: "urgent",
      label: "Важно",
      cardCls: "pub-theme-urgent",
      badgeCls: "pub-badge-urgent",
      iconId: "ico-cat-urgent"
    };
  }
  if (b.includes("здоров") || b.includes("профилакт") || b.includes("питан")) {
    return {
      key: "health",
      label: "Профилактика и здоровье",
      cardCls: "pub-theme-health",
      badgeCls: "pub-badge-health",
      iconId: "ico-cat-health"
    };
  }
  if (b.includes("безопасн") || b.includes("пдд") || b.includes("мчс")) {
    return {
      key: "safety",
      label: "Безопасность",
      cardCls: "pub-theme-safety",
      badgeCls: "pub-badge-safety",
      iconId: "ico-cat-safety"
    };
  }
  if (b.includes("праздник") || b.includes("событ") || b.includes("конкурс") || b.includes("побед")) {
    return {
      key: "event",
      label: "Праздник",
      cardCls: "pub-theme-event",
      badgeCls: "pub-badge-event",
      iconId: "ico-cat-holiday"
    };
  }
  if (b.includes("памятк") || b.includes("родител")) {
    return {
      key: "memo",
      label: "Памятка родителям",
      cardCls: "",
      badgeCls: "",
      iconId: "ico-cat-memo"
    };
  }
  return {
    key: "info",
    label: "Информация",
    cardCls: "",
    badgeCls: "",
    iconId: "ico-doc-pdf"
  };
}

function buildPublicationLightboxSlides(pubItem) {
  const fallbackSvg = buildPublicationFallbackSvg(pubItem.title);
  const totalPhotos = Array.isArray(pubItem.photos) ? pubItem.photos.length : 0;
  return (pubItem.photos || []).map((rawUrl, idx) => {
    const resolved = resolveImageLinkSource(rawUrl, fallbackSvg, 1600);
    return {
      src: resolved.src,
      altTry: resolved.altTry,
      fallback: resolved.fallback,
      title: pubItem.title || "Фото материала",
      desc:
        totalPhotos > 1
          ? `Изображение ${idx + 1} из ${totalPhotos}${pubItem.dateDisplay ? ` • ${pubItem.dateDisplay}` : ""}`
          : pubItem.dateDisplay || ""
    };
  });
}

function attachSafeImageFallback(imgEl, resolved, loadingContainer = null) {
  const seq = String(++imageLoadSequence);
  imgEl.dataset.loadSeq = seq;
  let triedAlt = false;

  const isStale = () => imgEl.dataset.loadSeq !== seq;
  const finishLoading = () => {
    if (isStale()) return;
    if (loadingContainer) loadingContainer.classList.remove("is-loading");
  };

  if (loadingContainer) {
    loadingContainer.classList.add("is-loading");
  }

  imgEl.onload = () => {
    finishLoading();
  };

  imgEl.onerror = () => {
    if (isStale()) return;
    if (!triedAlt && resolved.altTry) {
      triedAlt = true;
      imgEl.src = resolved.altTry;
    } else {
      imgEl.onerror = null;
      if (resolved.fallback && imgEl.src !== resolved.fallback) {
        imgEl.src = resolved.fallback;
      } else {
        finishLoading();
      }
    }
  };

  imgEl.src = resolved.src;

  if (imgEl.complete && imgEl.naturalWidth > 0) {
    finishLoading();
  }
}

function syncPublicationsStructuredData(publications) {
  const existing = document.getElementById("publications-jsonld");
  if (!Array.isArray(publications) || publications.length === 0) {
    if (existing) existing.remove();
    return;
  }

  const items = publications.slice(0, 20).map((pub, idx) => {
    const article = {
      "@type": "NewsArticle",
      headline: pub.title,
      articleSection: pub.badge,
      inLanguage: "ru-RU",
      url: `${SITE_CANONICAL_URL}#pub-${pub.id}`,
      mainEntityOfPage: `${SITE_CANONICAL_URL}#pub-${pub.id}`,
      publisher: {
        "@id": `${SITE_CANONICAL_URL}#school`
      }
    };
    if (pub.isoDate) article.datePublished = pub.isoDate;
    if (pub.text) article.description = truncateAtWordBoundary(pub.text, 220).short;
    if (Array.isArray(pub.photos) && pub.photos.length > 0) {
      const resolved = resolveImageLinkSource(pub.photos[0], "", 1000);
      if (resolved.src && !resolved.src.startsWith("data:")) {
        article.image = resolved.src.startsWith("https://")
          ? resolved.src
          : `${SITE_CANONICAL_URL}${resolved.src}`;
      }
    }
    return {
      "@type": "ListItem",
      position: idx + 1,
      item: article
    };
  });

  const payload = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_CANONICAL_URL}#publications-list`,
    name: "Актуальные материалы и публикации Ямбирнского филиала",
    itemListElement: items
  };

  let scriptEl = existing;
  if (!scriptEl) {
    scriptEl = document.createElement("script");
    scriptEl.id = "publications-jsonld";
    scriptEl.type = "application/ld+json";
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(payload);
}

function openPublicationModal(pubItem, updateUrlHash = true) {
  const modal = document.getElementById("publication-modal");
  const badgeEl = document.getElementById("pub-modal-badge");
  const dateEl = document.getElementById("pub-modal-date");
  const titleEl = document.getElementById("pub-modal-title");
  const galleryEl = document.getElementById("pub-modal-gallery");
  const bodyEl = document.getElementById("pub-modal-body");
  const docLinkEl = document.getElementById("pub-modal-doc-link");
  const closeBtn = document.getElementById("pub-modal-close");

  if (!modal || !titleEl || !bodyEl) return;

  activePublicationModalItem = pubItem;

  if (badgeEl) badgeEl.textContent = pubItem.badge || "Информация";
  if (dateEl) dateEl.textContent = pubItem.dateDisplay || "";
  titleEl.textContent = pubItem.title || "Объявление школы";
  bodyEl.textContent = pubItem.text || "";

  if (galleryEl) {
    clearElement(galleryEl);
    if (Array.isArray(pubItem.photos) && pubItem.photos.length > 0) {
      const fallbackSvg = buildPublicationFallbackSvg(pubItem.title);
      const totalPhotos = pubItem.photos.length;
      const pubSlides = buildPublicationLightboxSlides(pubItem);

      pubItem.photos.forEach((rawUrl, idx) => {
        const wrap = document.createElement("div");
        wrap.className = "pub-modal-photo-item";
        wrap.setAttribute("tabindex", "0");
        wrap.setAttribute("role", "button");
        wrap.setAttribute("aria-label", `Увеличить изображение ${idx + 1} из ${totalPhotos}`);
        wrap.setAttribute("title", "Нажмите, чтобы увеличить на весь экран");

        const img = document.createElement("img");
        img.setAttribute("referrerpolicy", "no-referrer");
        img.loading = "lazy";
        img.decoding = "async";
        img.width = 600;
        img.height = 375;
        img.alt = `${pubItem.title || "Фото материала"} — изображение ${idx + 1}`;

        const resolved = resolveImageLinkSource(rawUrl, fallbackSvg, 1200);
        attachSafeImageFallback(img, resolved, wrap);

        const zoomHint = document.createElement("span");
        zoomHint.className = "pub-modal-photo-zoom";
        zoomHint.setAttribute("aria-hidden", "true");
        zoomHint.appendChild(createSpriteIcon("ico-zoom", "", 13));
        const zoomTxt = document.createElement("span");
        zoomTxt.textContent = "Увеличить";
        zoomHint.appendChild(zoomTxt);

        const openZoom = () => {
          if (typeof openLightboxSlidesFn === "function") {
            openLightboxSlidesFn(pubSlides, idx);
          }
        };

        wrap.addEventListener("click", openZoom);
        wrap.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openZoom();
          }
        });

        wrap.appendChild(img);
        wrap.appendChild(zoomHint);
        galleryEl.appendChild(wrap);
      });
      galleryEl.classList.remove("hidden");
    } else {
      galleryEl.classList.add("hidden");
    }
  }

  if (docLinkEl) {
    if (pubItem.docUrl) {
      docLinkEl.href = pubItem.docUrl;
      docLinkEl.setAttribute("rel", "noopener noreferrer ugc");
      docLinkEl.classList.remove("hidden");
    } else {
      docLinkEl.href = "#";
      docLinkEl.classList.add("hidden");
    }
  }

  if (updateUrlHash && pubItem.id) {
    try {
      history.replaceState(null, "", `#pub-${pubItem.id}`);
    } catch (_) {}
  }

  lockPageScrollForModal(true);
  modal.classList.remove("hidden");
  modal.removeAttribute("hidden");
  if (closeBtn) closeBtn.focus();
}

function tryOpenPublicationFromUrl() {
  if (!Array.isArray(activePublicationsCache) || activePublicationsCache.length === 0) return;

  let pubId = "";
  try {
    const hashMatch = window.location.hash.match(/^#(?:pub|post)-([a-zA-Z0-9_-]+)$/);
    const searchParams = new URLSearchParams(window.location.search);
    pubId = (hashMatch && hashMatch[1]) || searchParams.get("pub") || searchParams.get("post") || "";
  } catch (_) {}

  if (!pubId) return;
  const matched =
    activePublicationsCache.find((item) => item.id === pubId) ||
    activePublicationsCache.find((item) => item.rowIndex === pubId);
  if (matched) {
    openPublicationModal(matched, false);
  }
}

function initPublicationModalEvents() {
  const modal = document.getElementById("publication-modal");
  const closeBtn = document.getElementById("pub-modal-close");
  const copyBtn = document.getElementById("pub-modal-copy-btn");
  const copyLinkBtn = document.getElementById("pub-modal-link-btn");
  const pubMaxBtn = document.getElementById("pub-modal-max-btn");
  const titleEl = document.getElementById("pub-modal-title");
  const bodyEl = document.getElementById("pub-modal-body");

  if (!modal) return;

  const closeModal = () => {
    if (modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    modal.setAttribute("hidden", "");
    activePublicationModalItem = null;
    try {
      if (window.location.hash.startsWith("#pub-") || window.location.hash.startsWith("#post-")) {
        history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }
    } catch (_) {}
    unlockPageScrollAfterModal();
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (modal.classList.contains("hidden")) return;
    const lb = document.getElementById("gallery-lightbox");
    const maxM = document.getElementById("max-share-modal");
    if ((lb && !lb.classList.contains("hidden")) || (maxM && !maxM.classList.contains("hidden"))) return;

    if (e.key === "Escape") {
      closeModal();
      return;
    }
    handleModalFocusTrap(e, modal);
  });

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#pub-") || window.location.hash.startsWith("#post-")) {
      tryOpenPublicationFromUrl();
    }
  });

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", async () => {
      const pubId = activePublicationModalItem && activePublicationModalItem.id;
      const directUrl = pubId
        ? `${window.location.origin}${window.location.pathname}#pub-${pubId}`
        : window.location.href;
      const copied = await copyTextToClipboard(directUrl);
      showDynamicIslandToast(
        copied
          ? "Прямая ссылка на материал скопирована"
          : "Не удалось скопировать ссылку — скопируйте её из адресной строки"
      );
    });
  }

  if (pubMaxBtn) {
    pubMaxBtn.addEventListener("click", async () => {
      const item = activePublicationModalItem;
      const pubId = item && item.id;
      const directUrl = pubId ? `${SITE_CANONICAL_URL}#pub-${pubId}` : SITE_CANONICAL_URL;
      const pubTitle = (item && item.title) || (titleEl ? titleEl.textContent : "Новость школы");
      const excerpt = item && item.text ? truncateAtWordBoundary(item.text, 180).short + "..." : "";
      await shareToMaxMessenger({
        title: `${pubTitle} — Школа с. Ямбирно`,
        text: `${pubTitle}${excerpt ? "\n" + excerpt : ""}\nПодробнее: ${directUrl}`,
        url: directUrl
      });
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const fullText = `${titleEl ? titleEl.textContent : ""}\n\n${bodyEl ? bodyEl.textContent : ""}`.trim();
      if (!fullText) return;
      const copied = await copyTextToClipboard(fullText);
      showDynamicIslandToast(
        copied ? "Текст публикации скопирован" : "Не удалось скопировать — выделите текст вручную"
      );
    });
  }
}

function renderPublicationFilters(publications) {
  const bar = document.getElementById("pub-filters-bar");
  if (!bar) return;

  const categoriesMap = new Map();
  publications.forEach((pub) => {
    const theme = classifyPublicationBadgeTheme(pub.badge);
    if (!categoriesMap.has(theme.key)) {
      categoriesMap.set(theme.key, { ...theme, count: 0 });
    }
    categoriesMap.get(theme.key).count += 1;
  });

  if (categoriesMap.size <= 1) {
    clearElement(bar);
    bar.classList.add("hidden");
    activePubFilterKey = "all";
    return;
  }

  if (activePubFilterKey !== "all" && !categoriesMap.has(activePubFilterKey)) {
    activePubFilterKey = "all";
  }

  clearElement(bar);

  const makeChip = (key, label, count, iconId) => {
    const btn = document.createElement("button");
    btn.type = "button";
    const isActive = activePubFilterKey === key;
    btn.className = isActive ? "pub-filter-chip active" : "pub-filter-chip";
    btn.setAttribute("aria-pressed", String(isActive));

    if (iconId) btn.appendChild(createSpriteIcon(iconId, "", 15));
    const txt = document.createElement("span");
    txt.textContent = `${label} (${count})`;
    btn.appendChild(txt);

    btn.addEventListener("click", () => {
      if (activePubFilterKey === key) return;
      activePubFilterKey = key;
      runViewTransition(() => {
        renderPublicationCards(activePublicationsCache);
        renderPublicationFilters(activePublicationsCache);
      });
    });
    return btn;
  };

  bar.appendChild(makeChip("all", "Все материалы", publications.length, "ico-board"));
  categoriesMap.forEach((cat) => {
    bar.appendChild(makeChip(cat.key, cat.label, cat.count, cat.iconId));
  });

  bar.classList.remove("hidden");
}

function renderPublicationCards(publications) {
  const gridEl = document.getElementById("publications-grid");
  if (!gridEl) return;

  clearElement(gridEl);

  const filtered =
    activePubFilterKey === "all"
      ? publications
      : publications.filter((p) => classifyPublicationBadgeTheme(p.badge).key === activePubFilterKey);

  gridEl.classList.toggle("is-single-item", filtered.length === 1);

  filtered.forEach((pub) => {
    const theme = classifyPublicationBadgeTheme(pub.badge);
    const card = document.createElement("article");
    card.id = `pub-${pub.id}`;
    card.className = `pub-card surface-card elevate-card reveal visible ${theme.cardCls}`.trim();

    if (pub.photos.length > 0) {
      const fallbackSvg = buildPublicationFallbackSvg(pub.title);
      const mediaWrap = document.createElement("div");
      mediaWrap.className = "pub-card-media";
      mediaWrap.setAttribute("tabindex", "0");
      mediaWrap.setAttribute("role", "button");
      mediaWrap.setAttribute("aria-label", `Открыть материал: ${pub.title}`);
      mediaWrap.setAttribute("title", "Нажмите, чтобы открыть материал полностью");

      const img = document.createElement("img");
      img.className = "pub-card-img";
      img.setAttribute("referrerpolicy", "no-referrer");
      img.loading = "lazy";
      img.decoding = "async";
      img.width = 600;
      img.height = 375;
      img.alt = pub.title;

      attachSafeImageFallback(img, resolveImageLinkSource(pub.photos[0], fallbackSvg, 640), mediaWrap);
      mediaWrap.appendChild(img);

      if (pub.photos.length > 1) {
        const multiBadge = document.createElement("span");
        multiBadge.className = "pub-multi-badge";
        multiBadge.appendChild(createSpriteIcon("ico-gallery", "", 14));
        const multiText = document.createElement("span");
        multiText.textContent = `${pub.photos.length} фото`;
        multiBadge.appendChild(multiText);
        mediaWrap.appendChild(multiBadge);
      }

      const openCardModal = () => openPublicationModal(pub, true);
      mediaWrap.addEventListener("click", openCardModal);
      mediaWrap.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openCardModal();
        }
      });
      card.appendChild(mediaWrap);

      if (pub.photos.length > 1) {
        const thumbsBar = document.createElement("div");
        thumbsBar.className = "pub-card-thumbs";
        thumbsBar.setAttribute("role", "group");
        thumbsBar.setAttribute("aria-label", `Фотографии материала «${pub.title}»`);

        const pubSlides = buildPublicationLightboxSlides(pub);
        pub.photos.slice(0, 5).forEach((photoUrl, photoIdx) => {
          const tBtn = document.createElement("button");
          tBtn.type = "button";
          tBtn.className = "pub-card-thumb-btn";
          tBtn.setAttribute("aria-label", `Открыть фото ${photoIdx + 1} из ${pub.photos.length}`);

          const tImg = document.createElement("img");
          tImg.setAttribute("referrerpolicy", "no-referrer");
          tImg.loading = "lazy";
          tImg.decoding = "async";
          tImg.width = 120;
          tImg.height = 88;
          tImg.alt = "";
          attachSafeImageFallback(tImg, resolveImageLinkSource(photoUrl, fallbackSvg, 240));

          tBtn.appendChild(tImg);
          tBtn.addEventListener("click", () => {
            if (typeof openLightboxSlidesFn === "function") {
              openLightboxSlidesFn(pubSlides, photoIdx);
            } else {
              openPublicationModal(pub, true);
            }
          });
          thumbsBar.appendChild(tBtn);
        });
        card.appendChild(thumbsBar);
      }
    }

    const content = document.createElement("div");
    content.className = "pub-card-content";

    const metaRow = document.createElement("div");
    metaRow.className = "pub-card-meta";

    const badgeSpan = document.createElement("span");
    badgeSpan.className = `pub-badge ${theme.badgeCls}`.trim();
    badgeSpan.appendChild(createSpriteIcon(theme.iconId, "", 14));
    const badgeLabel = document.createElement("span");
    badgeLabel.textContent = pub.badge;
    badgeSpan.appendChild(badgeLabel);
    metaRow.appendChild(badgeSpan);

    if (pub.dateDisplay) {
      const dateSpan = document.createElement("span");
      dateSpan.className = "pub-date-text";
      dateSpan.appendChild(createSpriteIcon("ico-calendar", "", 13));
      const dTxt = document.createElement("span");
      dTxt.textContent = pub.dateDisplay;
      dateSpan.appendChild(dTxt);
      metaRow.appendChild(dateSpan);
    }

    content.appendChild(metaRow);

    const titleEl = document.createElement("h3");
    titleEl.className = "pub-card-title";
    titleEl.textContent = pub.title;
    content.appendChild(titleEl);

    const splitText = truncateAtWordBoundary(pub.text, 220);
    let expandWrap = null;
    let excerptEl = null;

    if (pub.text) {
      excerptEl = document.createElement("p");
      excerptEl.className = splitText.isTruncated
        ? "pub-card-excerpt pub-excerpt-masked"
        : "pub-card-excerpt";
      excerptEl.textContent = splitText.isTruncated ? `${splitText.short}...` : pub.text;
      content.appendChild(excerptEl);

      if (splitText.isTruncated) {
        expandWrap = document.createElement("div");
        expandWrap.className = "pub-expand-wrap";
        expandWrap.setAttribute("aria-hidden", "true");
        const expandInner = document.createElement("div");
        expandInner.className = "pub-expand-inner";
        const restP = document.createElement("p");
        restP.className = "pub-card-excerpt pub-card-excerpt-rest";
        restP.textContent = splitText.rest;
        expandInner.appendChild(restP);
        expandWrap.appendChild(expandInner);
        content.appendChild(expandWrap);
      }
    }

    const footer = document.createElement("div");
    footer.className = "pub-card-footer";

    if (splitText.isTruncated && expandWrap && excerptEl) {
      const toggleExpandBtn = document.createElement("button");
      toggleExpandBtn.type = "button";
      toggleExpandBtn.className = "btn-pub-action";
      toggleExpandBtn.setAttribute("aria-expanded", "false");
      toggleExpandBtn.appendChild(createSpriteIcon("ico-cat-memo", "ui-ico--book", 15));
      const toggleLabel = document.createElement("span");
      toggleLabel.textContent = "Читать полностью";
      toggleExpandBtn.appendChild(toggleLabel);

      toggleExpandBtn.addEventListener("click", () => {
        const nextOpen = !expandWrap.classList.contains("is-open");
        expandWrap.classList.toggle("is-open", nextOpen);
        expandWrap.setAttribute("aria-hidden", String(!nextOpen));
        excerptEl.classList.toggle("is-expanded", nextOpen);
        excerptEl.textContent = nextOpen ? splitText.short : `${splitText.short}...`;
        toggleExpandBtn.setAttribute("aria-expanded", String(nextOpen));
        toggleLabel.textContent = nextOpen ? "Свернуть текст" : "Читать полностью";
      });
      footer.appendChild(toggleExpandBtn);
    }

    if (pub.photos.length > 0 || splitText.isTruncated) {
      const modalBtn = document.createElement("button");
      modalBtn.type = "button";
      modalBtn.className = splitText.isTruncated ? "btn-pub-action btn-pub-doc" : "btn-pub-action";
      modalBtn.appendChild(
        createSpriteIcon(pub.photos.length > 0 ? "ico-gallery" : "ico-link", "", 15)
      );
      const modalLabel = document.createElement("span");
      modalLabel.textContent =
        pub.photos.length > 1
          ? `Открыть (${pub.photos.length} фото)`
          : pub.photos.length === 1
          ? "Открыть с фото"
          : "Окно / ссылка";
      modalBtn.appendChild(modalLabel);
      modalBtn.addEventListener("click", () => openPublicationModal(pub, true));
      footer.appendChild(modalBtn);
    }

    if (pub.docUrl) {
      const docLink = document.createElement("a");
      docLink.href = pub.docUrl;
      docLink.target = "_blank";
      docLink.rel = "noopener noreferrer ugc";
      docLink.className = "btn-pub-action btn-pub-doc";
      docLink.appendChild(createSpriteIcon("ico-doc-pdf", "", 15));
      const docSpan = document.createElement("span");
      docSpan.textContent = "Документ ↗";
      docLink.appendChild(docSpan);
      footer.appendChild(docLink);
    }

    if (footer.children.length > 0) {
      content.appendChild(footer);
    }

    card.appendChild(content);
    gridEl.appendChild(card);
  });

  bindTiltToSelector("#publications-grid .pub-card");
}

function renderSheet3Publications(rowsArray, forceRender = false) {
  const sectionEl = document.getElementById("school-publications");
  const gridEl = document.getElementById("publications-grid");
  const navLinkEl = document.getElementById("nav-publications-link");
  const navCountEl = document.getElementById("nav-publications-count");

  if (!sectionEl || !gridEl) return;

  if (!Array.isArray(rowsArray) || rowsArray.length <= 1) {
    lastRenderedPublicationsSignature = "[]";
    activePublicationsCache = [];
    syncPublicationsStructuredData([]);
    clearElement(gridEl);
    sectionEl.classList.add("hidden");
    sectionEl.setAttribute("hidden", "");
    if (navLinkEl) navLinkEl.classList.add("hidden");
    return;
  }

  const activePublications = [];
  const usedIdsSet = new Set();

  for (let i = 1; i < rowsArray.length; i++) {
    const row = rowsArray[i] || [];
    const rawPhotosCell = (row[0] || "").trim();
    const rawTitleCell = sanitizeInput(row[1] || "", 180);
    const rawBadgeCell = sanitizeInput(row[2] || "", 60);
    const rawTextCell = sanitizeInput(row[3] || "", 12000);
    const rawDateCell = (row[4] || "").trim();
    const rawDocCell = sanitizeDocumentUrl(row[5] || "");

    const photosList = parseMultiplePhotoUrls(rawPhotosCell);
    const hasAnyContent = Boolean(photosList.length > 0 || rawTitleCell || rawTextCell || rawDocCell);
    if (!hasAnyContent) continue;

    const scheduleInfo = parseScheduleDateTime(rawDateCell);
    if (scheduleInfo.isFuture) continue;

    const finalTitle = rawTitleCell || "Объявление школы";
    const stableId = buildStablePublicationId(rawDateCell, finalTitle, usedIdsSet);

    activePublications.push({
      id: stableId,
      rowIndex: String(i),
      photos: photosList,
      title: finalTitle,
      badge: rawBadgeCell || "Информация",
      text: rawTextCell,
      dateDisplay: scheduleInfo.displayStr,
      isoDate: scheduleInfo.isoDate,
      docUrl: rawDocCell
    });
  }

  activePublicationsCache = activePublications;

  const mediaSignature = Object.keys(snapshotMediaMap || {}).length;
  const nextSignature = `${mediaSignature}|${JSON.stringify(activePublications)}`;
  if (!forceRender && nextSignature === lastRenderedPublicationsSignature) {
    return;
  }
  lastRenderedPublicationsSignature = nextSignature;

  if (activePublications.length === 0) {
    syncPublicationsStructuredData([]);
    clearElement(gridEl);
    sectionEl.classList.add("hidden");
    sectionEl.setAttribute("hidden", "");
    if (navLinkEl) navLinkEl.classList.add("hidden");
    return;
  }

  sectionEl.classList.remove("hidden");
  sectionEl.removeAttribute("hidden");

  if (navLinkEl && navCountEl) {
    navCountEl.textContent = String(activePublications.length);
    navLinkEl.classList.remove("hidden");
  }

  syncPublicationsStructuredData(activePublications);
  renderPublicationFilters(activePublications);
  renderPublicationCards(activePublications);

  if (!hasCheckedInitialPubHash) {
    hasCheckedInitialPubHash = true;
    tryOpenPublicationFromUrl();
  }
}

async function loadSheet3PublicationsData(isManualRefresh = false) {
  const sectionEl = document.getElementById("school-publications");
  if (!sectionEl) return;

  try {
    const rawCache = safeStorageGet("local", SHEET3_CACHE_KEY);
    if (rawCache) {
      const cachedRows = JSON.parse(rawCache);
      latestRawSheet3Rows = cachedRows;
      renderSheet3Publications(cachedRows, false);
    }
  } catch (_) {}

  const [snapshotRes, csvRes] = await Promise.allSettled([
    fetchSchoolSnapshotOnce(isManualRefresh),
    fetchWithTimeout(SHEET3_CSV_URL, { cache: "no-store" }, 6500)
  ]);

  const snapshot = snapshotRes.status === "fulfilled" ? snapshotRes.value : null;

  try {
    if (csvRes.status !== "fulfilled") throw new Error("Sheet3 fetch failed");
    const response = csvRes.value;
    if (!response.ok) throw new Error(`Sheet3 HTTP ${response.status}`);

    const csvText = await response.text();
    if (!isValidCsvResponse(csvText)) {
      throw new Error("Invalid Sheet3 CSV payload");
    }

    const rows = parseCSVPreserveRowIndex(csvText);
    latestRawSheet3Rows = rows;
    renderSheet3Publications(rows, false);
    safeStorageSet("local", SHEET3_CACHE_KEY, JSON.stringify(rows));
  } catch (_) {
    if (snapshot && Array.isArray(snapshot.publicationsRows) && snapshot.publicationsRows.length > 1) {
      latestRawSheet3Rows = snapshot.publicationsRows;
      renderSheet3Publications(snapshot.publicationsRows, false);
      safeStorageSet("local", SHEET3_CACHE_KEY, JSON.stringify(snapshot.publicationsRows));
    }
  }
}

function createGalleryFigureElement() {
  const figure = document.createElement("figure");
  figure.className = "gallery-item surface-card elevate-card reveal visible";
  figure.setAttribute("tabindex", "0");
  figure.setAttribute("role", "button");

  const imgWrap = document.createElement("div");
  imgWrap.className = "gallery-img-wrap";

  const img = document.createElement("img");
  img.className = "gallery-img";
  img.width = 600;
  img.height = 400;
  img.loading = "lazy";
  img.decoding = "async";
  img.setAttribute("referrerpolicy", "no-referrer");

  const zoomBadge = document.createElement("span");
  zoomBadge.className = "gallery-zoom-badge";
  zoomBadge.setAttribute("aria-hidden", "true");
  zoomBadge.appendChild(createSpriteIcon("ico-zoom", "", 13));
  const zoomText = document.createElement("span");
  zoomText.textContent = "Увеличить";
  zoomBadge.appendChild(zoomText);

  imgWrap.appendChild(img);
  imgWrap.appendChild(zoomBadge);

  const caption = document.createElement("figcaption");
  caption.className = "gallery-caption";

  figure.appendChild(imgWrap);
  figure.appendChild(caption);
  return figure;
}

function updateGalleryFromSheetRows(galleryArray) {
  if (!Array.isArray(galleryArray) || galleryArray.length === 0) return;

  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  const existingItems = Array.from(grid.querySelectorAll(".gallery-item"));

  galleryArray.forEach((itemData, idx) => {
    if (!itemData) return;

    let figure = existingItems[idx];
    if (!figure) {
      figure = createGalleryFigureElement();
      grid.appendChild(figure);
    }

    const imgEl = figure.querySelector(".gallery-img");
    const capEl = figure.querySelector(".gallery-caption");
    const defaultSvg =
      (imgEl && imgEl.getAttribute("src")) ||
      buildPublicationFallbackSvg(itemData.title || `Школьная жизнь #${idx + 1}`);

    const newTitle = itemData.title || (capEl ? capEl.textContent : `Школьная жизнь #${idx + 1}`);
    const newDesc = itemData.desc || figure.getAttribute("data-desc") || newTitle;

    figure.setAttribute("data-caption", newTitle);
    figure.setAttribute("data-desc", newDesc);
    figure.setAttribute("aria-label", `Открыть фото: ${newTitle}`);
    if (capEl && itemData.title) capEl.textContent = itemData.title;

    if (imgEl && itemData.url) {
      const resolvedThumb = resolveImageLinkSource(itemData.url, defaultSvg, 640);
      const resolvedFull = resolveImageLinkSource(itemData.url, defaultSvg, 1600);
      figure.setAttribute("data-full-src", resolvedFull.src);
      if (resolvedFull.altTry) {
        figure.setAttribute("data-full-alt", resolvedFull.altTry);
      } else {
        figure.removeAttribute("data-full-alt");
      }
      attachSafeImageFallback(imgEl, resolvedThumb);
      imgEl.alt = newTitle;
    }
  });
}

function initGalleryLightbox() {
  const grid = document.getElementById("gallery-grid");
  const lightbox = document.getElementById("gallery-lightbox");
  const lbContainer = document.getElementById("lightbox-img-container");
  const lbImg = document.getElementById("lightbox-img");
  const lbTitle = document.getElementById("lightbox-title");
  const lbDesc = document.getElementById("lightbox-desc");
  const lbCounter = document.getElementById("lightbox-counter");
  const zoomBtn = document.getElementById("lightbox-zoom");
  const zoomLabel = document.getElementById("lightbox-zoom-label");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  if (!lightbox || !lbImg) return;

  let activeSlides = [];
  let currentSlideIdx = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let isHorizontalSwipe = false;
  let isZoomed = false;
  let lbTriggerEl = null;

  const setZoomState = (nextZoom) => {
    isZoomed = Boolean(nextZoom);
    lbImg.classList.toggle("is-zoomed", isZoomed);
    if (lbContainer) {
      lbContainer.classList.toggle("is-zoomed", isZoomed);
      if (!isZoomed) {
        lbContainer.scrollLeft = 0;
        lbContainer.scrollTop = 0;
      }
    }
    if (zoomBtn) {
      zoomBtn.setAttribute("aria-pressed", String(isZoomed));
      if (zoomLabel) {
        zoomLabel.textContent = isZoomed ? "100%" : "Увеличить";
      }
    }
  };

  const resetImgTransform = () => {
    lbImg.classList.remove("is-dragging");
    lbImg.style.transform = "";
  };

  const renderSlideAt = (idx) => {
    if (activeSlides.length === 0) return;

    resetImgTransform();
    setZoomState(false);
    currentSlideIdx = (idx + activeSlides.length) % activeSlides.length;
    const slide = activeSlides[currentSlideIdx];

    attachSafeImageFallback(
      lbImg,
      {
        src: slide.src || slide.fallback || "",
        altTry: slide.altTry || null,
        fallback: slide.fallback || ""
      },
      lbContainer
    );
    lbImg.alt = slide.title || "";

    if (lbTitle) lbTitle.textContent = slide.title || "";
    if (lbDesc) {
      lbDesc.textContent = slide.desc || "";
      lbDesc.classList.toggle("hidden", !slide.desc);
    }
    if (lbCounter) lbCounter.textContent = `${currentSlideIdx + 1} / ${activeSlides.length}`;

    const hasMultiple = activeSlides.length > 1;
    if (prevBtn) prevBtn.classList.toggle("hidden", !hasMultiple);
    if (nextBtn) nextBtn.classList.toggle("hidden", !hasMultiple);
  };

  const openLightboxWithSlides = (slides, startIdx = 0) => {
    if (!Array.isArray(slides) || slides.length === 0) return;
    activeSlides = slides;
    lbTriggerEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    renderSlideAt(startIdx);
    lockPageScrollForModal(false);
    lightbox.classList.remove("hidden");
    lightbox.removeAttribute("hidden");
    if (closeBtn) closeBtn.focus();
  };

  openLightboxSlidesFn = openLightboxWithSlides;

  const closeLightbox = () => {
    if (lightbox.classList.contains("hidden")) return;
    resetImgTransform();
    setZoomState(false);
    if (lbContainer) lbContainer.classList.remove("is-loading");
    lightbox.classList.add("hidden");
    lightbox.setAttribute("hidden", "");
    const returnEl = lbTriggerEl;
    lbTriggerEl = null;
    unlockPageScrollAfterModal(returnEl);
  };

  if (grid) {
    const getFigures = () => Array.from(grid.querySelectorAll(".gallery-item"));
    const openFromGallery = (fig) => {
      const figures = getFigures();
      const idx = figures.indexOf(fig);
      if (idx === -1) return;

      const slides = figures.map((item) => {
        const imgEl = item.querySelector(".gallery-img");
        const thumbSrc = imgEl ? imgEl.src : "";
        return {
          src: item.getAttribute("data-full-src") || thumbSrc,
          altTry: item.getAttribute("data-full-alt") || null,
          fallback: thumbSrc,
          title: item.getAttribute("data-caption") || "",
          desc: item.getAttribute("data-desc") || ""
        };
      });
      openLightboxWithSlides(slides, idx);
    };

    grid.addEventListener("click", (e) => {
      const fig = e.target.closest(".gallery-item");
      if (fig) openFromGallery(fig);
    });

    grid.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const fig = e.target.closest(".gallery-item");
        if (!fig) return;
        e.preventDefault();
        openFromGallery(fig);
      }
    });
  }

  if (zoomBtn) {
    zoomBtn.addEventListener("click", () => {
      setZoomState(!isZoomed);
    });
  }

  lbImg.addEventListener("click", () => {
    if (isHorizontalSwipe) return;
    setZoomState(!isZoomed);
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn) prevBtn.addEventListener("click", () => renderSlideAt(currentSlideIdx - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => renderSlideAt(currentSlideIdx + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  lightbox.addEventListener(
    "touchstart",
    (e) => {
      if (isZoomed) return;
      if (e.changedTouches && e.changedTouches[0]) {
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
        isHorizontalSwipe = false;
      }
    },
    { passive: true }
  );

  lightbox.addEventListener(
    "touchmove",
    (e) => {
      if (isZoomed || activeSlides.length <= 1 || isReducedMotionPreferred() || !e.changedTouches || !e.changedTouches[0]) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (!isHorizontalSwipe && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        isHorizontalSwipe = true;
        lbImg.classList.add("is-dragging");
      }
      if (isHorizontalSwipe) {
        const clamped = Math.max(Math.min(dx * 0.4, 96), -96);
        lbImg.style.transform = `translate3d(${clamped.toFixed(1)}px, 0, 0)`;
      }
    },
    { passive: true }
  );

  lightbox.addEventListener(
    "touchend",
    (e) => {
      if (isZoomed) return;
      resetImgTransform();
      if (activeSlides.length <= 1 || !e.changedTouches || !e.changedTouches[0]) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 48) {
        if (dx > 0) renderSlideAt(currentSlideIdx - 1);
        else renderSlideAt(currentSlideIdx + 1);
      }
      isHorizontalSwipe = false;
    },
    { passive: true }
  );

  lightbox.addEventListener("touchcancel", resetImgTransform, { passive: true });

  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("hidden")) return;
    if (e.key === "Escape") {
      if (isZoomed) {
        setZoomState(false);
        return;
      }
      closeLightbox();
      return;
    }
    if (e.key === "ArrowLeft" && activeSlides.length > 1) {
      renderSlideAt(currentSlideIdx - 1);
      return;
    }
    if (e.key === "ArrowRight" && activeSlides.length > 1) {
      renderSlideAt(currentSlideIdx + 1);
      return;
    }
    handleModalFocusTrap(e, lightbox);
  });
}

function createNewTeacherCardElement() {
  const article = document.createElement("article");
  article.className = "teacher-card surface-card elevate-card reveal visible";
  article.setAttribute("data-category", "main");

  const photoWrap = document.createElement("div");
  photoWrap.className = "teacher-photo-wrap";

  const photo = document.createElement("img");
  photo.className = "teacher-photo";
  photo.width = 96;
  photo.height = 96;
  photo.loading = "lazy";
  photo.decoding = "async";
  photo.setAttribute("referrerpolicy", "no-referrer");
  photoWrap.appendChild(photo);

  const badge = document.createElement("span");
  badge.className = "teacher-badge";
  badge.textContent = "Основной состав";

  const name = document.createElement("h3");
  name.className = "teacher-name";

  const role = document.createElement("p");
  role.className = "teacher-role";

  const meta = document.createElement("p");
  meta.className = "teacher-meta";

  article.appendChild(photoWrap);
  article.appendChild(badge);
  article.appendChild(name);
  article.appendChild(role);
  article.appendChild(meta);
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
    attachSafeImageFallback(photoEl, resolved);
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

  const allCards = document.querySelectorAll("#teachers-grid .teacher-card");
  const mainCards = document.querySelectorAll('#teachers-grid .teacher-card[data-category="main"]');
  const partTimeCards = document.querySelectorAll('#teachers-grid .teacher-card[data-category="part-time"]');
  const subtitleEl = document.getElementById("teachers-subtitle");

  if (subtitleEl) {
    const mainWord = pluralRu(mainCards.length, "основной педагог", "основных педагога", "основных педагогов");
    const partWord = pluralRu(partTimeCards.length, "совместитель", "совместителя", "совместителей");
    subtitleEl.textContent = `Главная опора Ямбирнского филиала: ${mainCards.length} ${mainWord} и ${partTimeCards.length} ${partWord} (всего ${allCards.length})`;
  }
}

function refreshAllGlidePills() {
  glidePillRefreshers.forEach((fn) => fn());
}

function initGlidePills() {
  const groups = document.querySelectorAll("#schedule-weekday-pills, #menu-weekday-pills, #menu-week-pills");
  groups.forEach((group) => {
    if (group.querySelector(".pill-glide-indicator")) return;
    const indicator = document.createElement("span");
    indicator.className = "pill-glide-indicator";
    indicator.setAttribute("aria-hidden", "true");
    group.prepend(indicator);

    const updateIndicator = () => {
      const active = group.querySelector(".day-pill.active");
      const totalWidth = group.clientWidth;
      if (
        !active ||
        !totalWidth ||
        isReducedMotionPreferred() ||
        group.classList.contains("hidden") ||
        active.offsetWidth === 0
      ) {
        group.classList.remove("has-glide");
        return;
      }
      const leftPx = active.offsetLeft;
      const rightPx = Math.max(0, totalWidth - (leftPx + active.offsetWidth));
      group.classList.add("has-glide");
      indicator.style.setProperty("--glide-left", `${leftPx.toFixed(1)}px`);
      indicator.style.setProperty("--glide-right", `${rightPx.toFixed(1)}px`);
    };

    glidePillRefreshers.push(updateIndicator);
    requestAnimationFrame(updateIndicator);
  });

  if (!isGlideResizeBound && glidePillRefreshers.length > 0) {
    isGlideResizeBound = true;
    window.addEventListener(
      "resize",
      () => {
        if (glideResizeRafId) return;
        glideResizeRafId = requestAnimationFrame(() => {
          glideResizeRafId = 0;
          refreshAllGlidePills();
        });
      },
      { passive: true }
    );
  }
}

function hideGradeAutoHint() {
  const hintEl = document.getElementById("grade-auto-hint");
  if (hintEl) {
    hintEl.textContent = "";
    hintEl.classList.add("hidden");
  }
}

function initWeekdayAndGradeSwitchers() {
  const allDayPills = document.querySelectorAll(".day-pill[data-day]");
  const allGradePills = document.querySelectorAll(".grade-pill");
  const allWeekPills = document.querySelectorAll(".week-pill");

  if (allDayPills.length === 0 && allGradePills.length === 0 && allWeekPills.length === 0) return;

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
      hasExplicitSavedGrade = true;
      hideGradeAutoHint();
      safeStorageSet("local", GRADE_STORAGE_KEY, String(gradeNum));
      syncDayAndGradeUI(currentSelectedWeekday, currentSelectedGrade);
      if (latestParsedSheetData) {
        renderDaySpecificScheduleAndMenu(latestParsedSheetData, currentSelectedWeekday, currentSelectedGrade);
      }
    });
  });

  allWeekPills.forEach((wPill) => {
    wPill.addEventListener("click", () => {
      const weekNum = parseInt(wPill.getAttribute("data-week") || "1", 10);
      currentSelectedMenuWeek = weekNum === 2 ? 2 : 1;
      syncDayAndGradeUI(currentSelectedWeekday, currentSelectedGrade);
      if (latestParsedSheetData) {
        renderDaySpecificScheduleAndMenu(latestParsedSheetData, currentSelectedWeekday, currentSelectedGrade, true);
      }
    });
  });

  syncDayAndGradeUI(currentSelectedWeekday, currentSelectedGrade);
}

function syncDayAndGradeUI(dayNum, gradeNum) {
  const mskToday = getMoscowTimeParts().weekday;
  const allDayPills = document.querySelectorAll(".day-pill[data-day]");
  allDayPills.forEach((pill) => {
    const pDay = parseInt(pill.getAttribute("data-day") || "0", 10);
    const isActive = pDay === dayNum;
    const isToday = pDay === mskToday;
    pill.classList.toggle("active", isActive);
    pill.classList.toggle("is-today", isToday);
    pill.setAttribute("aria-pressed", String(isActive));
    const baseName = DAY_NAMES_FULL[pDay] || "";
    if (baseName) {
      pill.setAttribute("title", isToday ? `${baseName} (сегодня)` : baseName);
    }
  });

  const allGradePills = document.querySelectorAll(".grade-pill");
  allGradePills.forEach((gPill) => {
    const pGrade = parseInt(gPill.getAttribute("data-grade") || "0", 10);
    const isActive = pGrade === gradeNum;
    gPill.classList.toggle("active", isActive);
    gPill.setAttribute("aria-pressed", String(isActive));
  });

  const allWeekPills = document.querySelectorAll(".week-pill");
  allWeekPills.forEach((wPill) => {
    const pWeek = parseInt(wPill.getAttribute("data-week") || "1", 10);
    const isActive = pWeek === currentSelectedMenuWeek;
    wPill.classList.toggle("active", isActive);
    wPill.setAttribute("aria-pressed", String(isActive));
  });

  const dayName = DAY_NAMES_FULL[dayNum] || "Понедельник";
  const dayLabelText = mskToday === dayNum ? `${dayName}, ${gradeNum} класс` : `${dayName} (${gradeNum} класс)`;

  const hasWeek2 = Boolean(
    latestParsedSheetData &&
    latestParsedSheetData.menuByWeekAndDay &&
    latestParsedSheetData.menuByWeekAndDay[2] &&
    Object.keys(latestParsedSheetData.menuByWeekAndDay[2]).length > 0
  );

  const scheduleDayLabel = document.getElementById("schedule-day-label");
  const menuDayLabel = document.getElementById("menu-day-label");
  if (scheduleDayLabel) scheduleDayLabel.textContent = dayLabelText;
  if (menuDayLabel) {
    const baseMenuLabel = mskToday === dayNum ? `${dayName} (сегодня)` : dayName;
    menuDayLabel.textContent = hasWeek2 ? `${baseMenuLabel} • ${currentSelectedMenuWeek} нед.` : baseMenuLabel;
  }

  requestAnimationFrame(refreshAllGlidePills);
}

function renderDaySpecificScheduleAndMenu(dataObj, dayNum, gradeNum = 1, skipAnimation = false) {
  const scheduleEl = document.getElementById("col-schedule");
  const menuWeekPills = document.getElementById("menu-week-pills");
  const menuBreakfastSlot = document.getElementById("menu-breakfast-slot");
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
  }

  renderDiaryLessonCards(scheduleEl, scheduleText, dayNum, skipAnimation, false);

  const hasWeek2 = Boolean(
    dataObj.menuByWeekAndDay &&
    dataObj.menuByWeekAndDay[2] &&
    Object.keys(dataObj.menuByWeekAndDay[2]).length > 0
  );

  if (menuWeekPills) {
    menuWeekPills.classList.toggle("hidden", !hasWeek2);
    requestAnimationFrame(refreshAllGlidePills);
  }
  if (!hasWeek2 && currentSelectedMenuWeek !== 1) {
    currentSelectedMenuWeek = 1;
  }

  const weekMap =
    dataObj.menuByWeekAndDay && dataObj.menuByWeekAndDay[currentSelectedMenuWeek]
      ? dataObj.menuByWeekAndDay[currentSelectedMenuWeek]
      : dataObj.menuByDay || {};
  const dayMenuObj = weekMap[dayNum] || {};

  const hasAnyDayMenu = Boolean(
    (dayMenuObj.breakfast || "").trim() ||
    (dayMenuObj.lunch || "").trim() ||
    (dayMenuObj.note || "").trim()
  );
  const breakfastText = hasAnyDayMenu
    ? (dayMenuObj.breakfast || "").trim()
    : DEFAULT_SANPIN_BREAKFAST;

  if (menuBreakfastSlot && menuBreakfastEl) {
    if (breakfastText) {
      menuBreakfastEl.textContent = breakfastText;
      menuBreakfastSlot.classList.remove("hidden");
    } else {
      menuBreakfastEl.textContent = "";
      menuBreakfastSlot.classList.add("hidden");
    }
  }

  if (menuLunchEl) {
    menuLunchEl.textContent = dayMenuObj.lunch || dataObj.menuLunch || DEFAULT_SANPIN_LUNCH;
  }
  if (menuNoteEl) {
    menuNoteEl.textContent = dayMenuObj.note || dataObj.menuNote || DEFAULT_SANPIN_NOTE;
  }
}

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
  const match = s.match(/^([1-9])(?:\s*[-–]?\s*[йя])?\s*(?:класс|кл\.?)$/i);
  if (match && match[1]) return parseInt(match[1], 10);
  return 0;
}

function detectBellLessonNumberFromCell(cellString) {
  const s = (cellString || "").toLowerCase().trim();
  const match = s.match(/^([0-8])(?:\s*[-–]?\s*[йя])?\s*(?:урок|ур\.?)$/i);
  if (match && match[1] !== undefined) return parseInt(match[1], 10);
  return -1;
}

function detectPhotoRowFromCell(cellString) {
  const s = (cellString || "").toLowerCase().trim();
  return /^фото\s*\d+/i.test(s);
}

function parsePanelRowsToDataObject(rows, timeLabel) {
  const scheduleByGradeAndDay = {};
  for (let g = 1; g <= 9; g++) {
    scheduleByGradeAndDay[g] = {};
  }

  const menuByDay = {};
  const menuByWeekAndDay = { 1: {}, 2: {} };
  const galleryList = [];
  const teachersList = [];
  const parsedBellTimes = cloneDefaultBells();
  let hasCustomBells = false;

  let col1News = "";
  let col2Schedule = "";
  let col3Important = "";
  let col4Status = "";

  let currentMode = "";
  let boardCols = { news: 0, schedule: -1, important: 1, status: 2 };
  let boardReadDone = false;

  for (let rIdx = 0; rIdx < rows.length; rIdx++) {
    const r = rows[rIdx] || [];
    const colA = (r[0] || "").trim();
    const colALower = colA.toLowerCase();
    const colB = (r[1] || "").trim();
    const colC = (r[2] || "").trim();
    const colD = (r[3] || "").trim();

    if (!r.some((cell) => (cell || "").trim())) continue;
    if (colA.startsWith("ℹ️") || colALower.startsWith("панель управления сайтом")) continue;

    if (colALower.includes("оперативное табло")) {
      currentMode = "board";
      continue;
    }
    if (colALower.startsWith("новости дня")) {
      currentMode = "board";
      if (colB.toLowerCase().includes("расписан")) {
        boardCols = { news: 0, schedule: 1, important: 2, status: 3 };
      } else {
        boardCols = { news: 0, schedule: -1, important: 1, status: 2 };
      }
      continue;
    }
    if (colALower.includes("расписание уроков") || colALower === "класс") {
      currentMode = "schedule";
      continue;
    }
    if (colALower.includes("расписание звонков") || colALower === "звонки" || colB.toLowerCase().includes("расписание звонков")) {
      currentMode = "bells";
      continue;
    }
    if (
      colALower.includes("меню питания") ||
      (colALower.includes("день") && (colALower.includes("питан") || colB.toLowerCase().includes("завтрак")))
    ) {
      currentMode = colALower.includes("2") || colALower.includes("вторая") ? "menu_w2" : "menu_w1";
      continue;
    }
    if (colALower.includes("фотогалере")) {
      currentMode = "gallery";
      continue;
    }
    if (colALower.includes("педагогический коллектив")) {
      currentMode = "teachers";
      continue;
    }
    if (colALower === "урок" || colALower.startsWith("фото (ссылка")) {
      continue;
    }

    if (currentMode === "board" && !boardReadDone) {
      col1News = sanitizeInput(r[boardCols.news] || "", 600);
      col2Schedule = boardCols.schedule >= 0 ? sanitizeInput(r[boardCols.schedule] || "", 600) : "";
      col3Important = sanitizeInput(r[boardCols.important] || "", 600);
      col4Status = sanitizeInput(r[boardCols.status] || "", 120);
      boardReadDone = true;
      continue;
    }

    if (currentMode === "teachers") {
      const fio = sanitizeInput(r[2] || "", 120);
      if (!fio || fio.toLowerCase().includes("фио")) continue;
      teachersList.push({
        photo: (r[0] || "").trim(),
        badge: sanitizeInput(r[1] || "", 100),
        fio,
        role: sanitizeInput(r[3] || "", 160),
        desc: sanitizeInput(r[4] || "", 450)
      });
      continue;
    }

    const bellNumA = detectBellLessonNumberFromCell(colA);
    const bellNumB = bellNumA >= 0 ? -1 : detectBellLessonNumberFromCell(colB);
    if (bellNumA >= 0 && bellNumA <= 8) {
      const parsedBell = parseBellTimeRangeString(colB, bellNumA);
      parsedBellTimes[bellNumA] = parsedBell.bell;
      if (parsedBell.isCustom) hasCustomBells = true;
      continue;
    }
    if (currentMode === "bells" && bellNumB >= 0 && bellNumB <= 8) {
      const parsedBell = parseBellTimeRangeString(colC, bellNumB);
      parsedBellTimes[bellNumB] = parsedBell.bell;
      if (parsedBell.isCustom) hasCustomBells = true;
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

    const gradeNum = detectGradeNumberFromCell(colA);
    if (gradeNum >= 1 && gradeNum <= 9) {
      for (let d = 1; d <= 5; d++) {
        const cellLesson = sanitizeInput(r[d] || "", 1200);
        if (cellLesson) {
          scheduleByGradeAndDay[gradeNum][d] = cellLesson;
        }
      }
      continue;
    }

    const dayIndex = detectWeekdayIndexFromCell(colA);
    if (dayIndex >= 1 && dayIndex <= 5 && (currentMode === "menu_w1" || currentMode === "menu_w2")) {
      const targetWeek = currentMode === "menu_w2" ? 2 : 1;
      const entry = {
        breakfast: sanitizeInput(colB, 600),
        lunch: sanitizeInput(colC, 600),
        note: sanitizeInput(colD, 600)
      };
      menuByWeekAndDay[targetWeek][dayIndex] = entry;
      if (targetWeek === 1) menuByDay[dayIndex] = entry;
    }
  }

  if (teachersList.length === 0) {
    for (let rIdx = 1; rIdx < rows.length; rIdx++) {
      const r = rows[rIdx] || [];
      const colA = (r[0] || "").trim().toLowerCase();
      const isScheduleMatrixRow = colA === "класс" || detectGradeNumberFromCell(colA) > 0;
      const fio = sanitizeInput(r[7] || "", 120);
      if (!fio || fio.toLowerCase().includes("фио")) continue;
      teachersList.push({
        photo: isScheduleMatrixRow ? "" : (r[5] || "").trim(),
        badge: sanitizeInput(r[6] || "", 100),
        fio,
        role: sanitizeInput(r[8] || "", 160),
        desc: sanitizeInput(r[9] || "", 450)
      });
    }
  }

  return {
    col1News,
    col2Schedule,
    col3Important,
    col4Status,
    bellTimes: parsedBellTimes,
    hasCustomBells,
    scheduleByGradeAndDay,
    menuByDay,
    menuByWeekAndDay,
    teachers: teachersList,
    gallery: galleryList,
    timeLabel
  };
}

function maybeAutoSelectFilledGrade(dataObj) {
  const hintEl = document.getElementById("grade-auto-hint");
  if (hasExplicitSavedGrade || !dataObj || !dataObj.scheduleByGradeAndDay) {
    hideGradeAutoHint();
    return;
  }

  const currentMap = dataObj.scheduleByGradeAndDay[currentSelectedGrade];
  if (currentMap && currentMap[currentSelectedWeekday]) {
    hideGradeAutoHint();
    return;
  }

  for (let g = 1; g <= 9; g++) {
    if (dataObj.scheduleByGradeAndDay[g] && dataObj.scheduleByGradeAndDay[g][currentSelectedWeekday]) {
      const skippedGrade = currentSelectedGrade;
      currentSelectedGrade = g;
      if (hintEl) {
        hintEl.textContent = `Показан ${g} класс (для ${skippedGrade} класса расписание уточняется). Выберите класс ребёнка — сайт его запомнит.`;
        hintEl.classList.remove("hidden");
      }
      return;
    }
  }
}

function initLiveSheetWidgetAndMenu() {
  const newsEl = document.getElementById("col-news");
  const scheduleEl = document.getElementById("col-schedule");
  const importantEl = document.getElementById("col-important");
  const refreshBtn = document.getElementById("refresh-sheet-btn");
  const statusEl = document.getElementById("widget-status");

  if (!newsEl || !scheduleEl || !importantEl) return;

  if (document.getElementById("school-publications")) {
    setInterval(() => {
      if (!document.hidden && latestRawSheet3Rows) {
        renderSheet3Publications(latestRawSheet3Rows, false);
      }
    }, 60000);
  }

  const renderWidgetData = (dataObj, sourceMode = "live") => {
    const isFromCache = sourceMode === "cache";
    latestParsedSheetData = dataObj;

    activeBellTimes = { ...cloneDefaultBells(), ...(dataObj.bellTimes || {}) };
    isCustomBellScheduleActive = Boolean(dataObj.hasCustomBells);

    [newsEl, importantEl].forEach((el) => {
      el.classList.remove("is-loading-shimmer", "flash-updated");
      void el.offsetWidth;
      if (!isFromCache && !isReducedMotionPreferred()) {
        el.classList.add("flash-updated");
      }
    });
    scheduleEl.classList.remove("is-loading-shimmer");

    newsEl.textContent = dataObj.col1News || "На сегодня дополнительных объявлений нет";
    importantEl.textContent = dataObj.col3Important || "Желаем хорошего дня!";

    customSheetSchoolStatus = dataObj.col4Status || "";
    if (typeof refreshClockStatusCallback === "function") {
      refreshClockStatusCallback();
    }

    maybeAutoSelectFilledGrade(dataObj);
    syncDayAndGradeUI(currentSelectedWeekday, currentSelectedGrade);
    renderDaySpecificScheduleAndMenu(dataObj, currentSelectedWeekday, currentSelectedGrade, isFromCache);

    if (Array.isArray(dataObj.teachers) && dataObj.teachers.some(Boolean)) {
      updateTeachersFromSheetRows(dataObj.teachers);
    }

    if (Array.isArray(dataObj.gallery) && dataObj.gallery.some(Boolean)) {
      updateGalleryFromSheetRows(dataObj.gallery);
    }

    if (statusEl) {
      statusEl.classList.remove("is-snapshot", "is-offline");
      if (sourceMode === "snapshot") {
        statusEl.classList.add("is-snapshot");
        statusEl.textContent = `Резервный снимок (${dataObj.timeLabel || "РФ-кэш"})`;
      } else if (sourceMode === "cache") {
        statusEl.classList.add("is-offline");
        statusEl.textContent = `Сохранённая копия (${dataObj.timeLabel || "офлайн"})`;
      } else {
        statusEl.textContent = `Обновлено в ${dataObj.timeLabel}`;
      }
    }
  };

  let hasHydratedCache = false;
  try {
    const rawCache = safeStorageGet("local", SHEET_CACHE_KEY);
    if (rawCache) {
      const cached = JSON.parse(rawCache);
      renderWidgetData(cached, "cache");
      hasHydratedCache = true;
    }
  } catch (_) {}

  const loadSheetData = async (isManualRefresh = false) => {
    if (refreshBtn) {
      refreshBtn.classList.add("loading");
      refreshBtn.disabled = true;
    }
    if (!hasHydratedCache && !isManualRefresh) {
      renderScheduleSkeleton(scheduleEl);
    } else {
      [newsEl, scheduleEl, importantEl].forEach((el) => el.classList.add("is-loading-shimmer"));
    }
    if (statusEl) {
      statusEl.classList.remove("is-snapshot", "is-offline");
      statusEl.textContent = "Синхронизация...";
    }

    const snapshotPromise = fetchSchoolSnapshotOnce(isManualRefresh);
    loadSheet3PublicationsData(isManualRefresh);

    const [snapshotRes, csvRes] = await Promise.allSettled([
      snapshotPromise,
      fetchWithTimeout(SHEET_CSV_URL, { cache: "no-store" }, 6500)
    ]);

    const snapshot = snapshotRes.status === "fulfilled" ? snapshotRes.value : null;

    try {
      if (csvRes.status !== "fulfilled") throw new Error("Panel CSV fetch failed");
      const response = csvRes.value;
      if (!response.ok) throw new Error(`HTTP ошибка: ${response.status}`);

      const csvText = await response.text();
      if (!isValidCsvResponse(csvText, ["новости", "расписание", "класс", "табло", "меню"])) {
        throw new Error("Некорректный формат CSV");
      }

      const rows = parseCSVPreserveRowIndex(csvText);
      const nowLabel = formatMoscowShortTime(getMoscowTimeParts());
      const parsedData = parsePanelRowsToDataObject(rows, nowLabel);

      renderWidgetData(parsedData, "live");
      hasHydratedCache = true;
      safeStorageSet("local", SHEET_CACHE_KEY, JSON.stringify(parsedData));
    } catch (_) {
      [newsEl, scheduleEl, importantEl].forEach((el) => el.classList.remove("is-loading-shimmer"));

      if (snapshot && Array.isArray(snapshot.panelRows) && snapshot.panelRows.length >= 3) {
        const snapshotLabel = sanitizeInput(snapshot.updatedLabel || "сохранено", 40);
        const parsedSnapshot = parsePanelRowsToDataObject(snapshot.panelRows, snapshotLabel);
        renderWidgetData(parsedSnapshot, "snapshot");
        hasHydratedCache = true;
        safeStorageSet("local", SHEET_CACHE_KEY, JSON.stringify(parsedSnapshot));
      } else if (hasHydratedCache && latestParsedSheetData) {
        if (statusEl) {
          statusEl.classList.add("is-offline");
          statusEl.textContent = `Офлайн-копия (${latestParsedSheetData.timeLabel || "сохранено"})`;
        }
      } else {
        newsEl.textContent = "Информация обновляется";
        renderDiaryLessonCards(scheduleEl, "", currentSelectedWeekday, false, true);
        importantEl.textContent = "Желаем хорошего дня!";
        if (statusEl) {
          statusEl.classList.add("is-offline");
          statusEl.textContent = "Автономный режим";
        }
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
      loadSheetData(true);
      showDynamicIslandToast("Данные расписания, материалов и табло обновлены");
    });
  }

  loadSheetData(false);
}

function initCopyButtons() {
  const copyBtns = document.querySelectorAll(".btn-copy-mini");
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const textToCopy = btn.getAttribute("data-copy") || "";
      if (!textToCopy) return;
      const copied = await copyTextToClipboard(textToCopy);
      showDynamicIslandToast(
        copied ? `Скопировано: ${textToCopy}` : "Не удалось скопировать — выделите текст вручную"
      );
    });
  });
}

function initScrollSpyAndProgressRing() {
  const scrollTopBtn = document.getElementById("scroll-top-btn");
  const progressCircle = document.getElementById("scroll-progress-circle");
  const spyLinks = document.querySelectorAll(".nav-link[data-scrollspy]");
  if (!scrollTopBtn && spyLinks.length === 0) return;

  const circumference = 119.38;
  let rafId = 0;

  const updateScrollUI = () => {
    rafId = 0;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle("visible", scrollTop > 320);
    }
    if (progressCircle) {
      progressCircle.style.strokeDashoffset = String(circumference - progress * circumference);
    }

    if (spyLinks.length > 0) {
      let currentSectionId = "";
      spyLinks.forEach((link) => {
        const targetId = link.getAttribute("data-scrollspy");
        const sec = document.getElementById(targetId);
        if (sec && !sec.classList.contains("hidden")) {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 140) {
            currentSectionId = targetId;
          }
        }
      });
      spyLinks.forEach((link) => {
        link.classList.toggle("spy-active", link.getAttribute("data-scrollspy") === currentSectionId);
      });
    }
  };

  const onScroll = () => {
    if (!rafId) rafId = requestAnimationFrame(updateScrollUI);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  updateScrollUI();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: isReducedMotionPreferred() ? "auto" : "smooth" });
    });
  }
}

function initDigitalNavigatorTabs() {
  const tabBtns = Array.from(document.querySelectorAll(".digital-tab-btn"));
  const panels = Array.from(document.querySelectorAll(".digital-panel"));
  if (tabBtns.length === 0 || panels.length === 0) return;

  const activateTab = (targetBtn, moveFocus = false) => {
    const targetId = targetBtn.getAttribute("data-dtab");

    runViewTransition(() => {
      tabBtns.forEach((b) => {
        const isCurrent = b === targetBtn;
        b.classList.toggle("active", isCurrent);
        b.setAttribute("aria-selected", String(isCurrent));
        b.setAttribute("tabindex", isCurrent ? "0" : "-1");
      });

      panels.forEach((panel) => {
        const isMatch = panel.id === targetId;
        panel.classList.toggle("hidden", !isMatch);
        panel.classList.toggle("active", isMatch);
        if (isMatch) panel.removeAttribute("hidden");
        else panel.setAttribute("hidden", "");
      });
    });

    if (moveFocus) targetBtn.focus();
  };

  tabBtns.forEach((btn, idx) => {
    btn.addEventListener("click", () => activateTab(btn, false));

    btn.addEventListener("keydown", (e) => {
      let nextIdx = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") nextIdx = (idx + 1) % tabBtns.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") nextIdx = (idx - 1 + tabBtns.length) % tabBtns.length;
      else if (e.key === "Home") nextIdx = 0;
      else if (e.key === "End") nextIdx = tabBtns.length - 1;

      if (nextIdx !== -1) {
        e.preventDefault();
        activateTab(tabBtns[nextIdx], true);
      }
    });
  });
}

function isValidRussianPhone(contact) {
  if (!/^\+?[0-9\s\-()]+$/.test(contact)) return false;
  const digits = contact.replace(/\D/g, "");
  if (digits.length === 11 && (digits.charAt(0) === "7" || digits.charAt(0) === "8")) {
    return true;
  }
  return digits.length === 10 && contact.charAt(0) !== "+";
}

function initFeedbackForm() {
  const consentStep = document.getElementById("consent-step");
  const formStep = document.getElementById("form-step");
  const acceptBtn = document.getElementById("accept-consent-btn");
  const stepInd1 = document.getElementById("step-indicator-1");
  const stepInd2 = document.getElementById("step-indicator-2");
  const stepsProgressBar = document.getElementById("steps-progress-bar");
  const frameGuardBanner = document.getElementById("frame-guard-banner");

  const form = document.getElementById("feedback-form");
  const formFieldset = document.getElementById("form-fieldset");
  if (!consentStep || !formStep || !acceptBtn || !form || !formFieldset) return;

  let isEmbeddedInFrame = false;
  try {
    isEmbeddedInFrame = window.self !== window.top;
  } catch (_) {
    isEmbeddedInFrame = true;
  }

  if (isEmbeddedInFrame) {
    if (frameGuardBanner) {
      frameGuardBanner.classList.remove("hidden");
      frameGuardBanner.removeAttribute("hidden");
    }
    consentStep.classList.add("hidden");
    consentStep.setAttribute("hidden", "");
    formStep.classList.add("hidden");
    formStep.setAttribute("hidden", "");
    acceptBtn.disabled = true;
    formFieldset.disabled = true;
    return;
  }

  const hpInput = document.getElementById("website-hp");
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
  const receiptHeading = document.getElementById("receipt-heading");
  const receiptMeta = document.getElementById("receipt-meta");
  const receiptFio = document.getElementById("receipt-fio");
  const receiptContact = document.getElementById("receipt-contact");
  const receiptComment = document.getElementById("receipt-comment");
  const copyTicketBtn = document.getElementById("copy-ticket-btn");
  const copyReceiptBtn = document.getElementById("copy-receipt-btn");
  const newFeedbackBtn = document.getElementById("new-feedback-btn");

  let isConsentConfirmed = false;
  let isSubmitting = false;
  let formUnlockedAtMs = 0;
  let selectedTopicPrefix = "[Вопрос руководителю] ";
  let lastRegisteredTicketId = "";

  const getMaxCommentBodyLen = () => Math.max(100, 2000 - selectedTopicPrefix.length);

  const syncCommentMaxLength = () => {
    const maxBodyLen = getMaxCommentBodyLen();
    if (commentInput) {
      commentInput.maxLength = maxBodyLen;
    }
    if (charCounter && commentInput) {
      charCounter.textContent = `${commentInput.value.length} / ${maxBodyLen}`;
    }
  };

  formFieldset.disabled = true;
  submitBtn.disabled = true;
  syncCommentMaxLength();

  const resetFormValidationUI = () => {
    const maxBodyLen = getMaxCommentBodyLen();
    [fioInput, contactInput, commentInput].forEach((el) => {
      el.classList.remove("is-valid", "is-invalid");
      el.setAttribute("aria-invalid", "false");
    });
    if (fioHint) {
      fioHint.textContent = "Только буквы и пробелы, минимум 2 слова";
      fioHint.className = "field-hint";
    }
    if (contactHint) {
      contactHint.textContent = "Укажите номер телефона (+7 или 8) либо адрес электронной почты";
      contactHint.className = "field-hint";
    }
    if (commentHint) {
      commentHint.textContent = `Пожалуйста, напишите ваше сообщение (от 5 до ${maxBodyLen} символов)`;
      commentHint.className = "field-hint";
    }
    syncCommentMaxLength();
    if (formResponse) {
      formResponse.classList.add("hidden");
    }
  };

  const setTopicByPrefix = (prefix, themeName, placeholderText) => {
    selectedTopicPrefix = prefix;
    formStep.classList.remove("topic-theme-question", "topic-theme-thanks", "topic-theme-idea");
    formStep.classList.add(`topic-theme-${themeName || "question"}`);
    if (commentInput && placeholderText) {
      commentInput.placeholder = placeholderText;
    }
    syncCommentMaxLength();
    if (commentInput && commentInput.value.length > 0) {
      validateComment();
    } else if (commentHint) {
      commentHint.textContent = `Пожалуйста, напишите ваше сообщение (от 5 до ${getMaxCommentBodyLen()} символов)`;
    }
  };

  topicChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      topicChips.forEach((c) => {
        const isSelected = c === chip;
        c.classList.toggle("active", isSelected);
        c.setAttribute("aria-pressed", String(isSelected));
      });
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
    const hashMatch = window.location.hash.match(/topic=([a-z]+)/i);
    const searchParams = new URLSearchParams(window.location.search);
    const topicParam = (hashMatch && hashMatch[1]) || searchParams.get("topic");
    if (topicParam === "thanks" && topicChips[1]) topicChips[1].click();
    else if (topicParam === "idea" && topicChips[2]) topicChips[2].click();
    else if (topicParam === "question" && topicChips[0]) topicChips[0].click();
  } catch (_) {}

  const unlockFormStep = (isRestoredFromSession = false) => {
    isConsentConfirmed = true;
    formUnlockedAtMs = isRestoredFromSession ? Date.now() - 2500 : Date.now();
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
      stepsProgressBar.classList.add("is-complete");
    }

    safeStorageSet("session", FEEDBACK_CONSENT_SESSION_KEY, "confirmed");

    if (!isRestoredFromSession) {
      showDynamicIslandToast("Согласие подтверждено — форма открыта");
      requestAnimationFrame(() => {
        if (typeof formStep.scrollIntoView === "function") {
          formStep.scrollIntoView({
            behavior: isReducedMotionPreferred() ? "auto" : "smooth",
            block: "start"
          });
        }
        try {
          fioInput.focus({ preventScroll: true });
        } catch (_) {}
      });
    }
  };

  if (safeStorageGet("session", FEEDBACK_CONSENT_SESSION_KEY) === "confirmed") {
    unlockFormStep(true);
  }

  acceptBtn.addEventListener("click", () => unlockFormStep(false));

  const validateFio = () => {
    const cleanVal = sanitizeInput(fioInput.value, 120).replace(/\s+/g, " ");
    const onlyLettersAndSpaces = /^[А-Яа-яЁёA-Za-z\-\s]+$/.test(cleanVal);
    const words = cleanVal.split(" ").filter((w) => w.length >= 2 && /[А-Яа-яЁёA-Za-z]/.test(w));
    const isValid = onlyLettersAndSpaces && words.length >= 2;
    const isInvalidShown = !isValid && cleanVal.length > 0;

    fioInput.classList.toggle("is-valid", isValid);
    fioInput.classList.toggle("is-invalid", isInvalidShown);
    fioInput.setAttribute("aria-invalid", String(isInvalidShown));

    if (isInvalidShown) {
      fioHint.textContent = "Введите минимум 2 слова (только буквы, дефис и пробелы)";
      fioHint.className = "field-hint error-text";
    } else if (isValid) {
      fioHint.textContent = "ФИО заполнено корректно";
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

    const isEmail = emailRegex.test(cleanVal);
    const isPhone = isValidRussianPhone(cleanVal);
    const isValid = isEmail || isPhone;
    const isInvalidShown = !isValid && cleanVal.length > 0;

    contactInput.classList.toggle("is-valid", isValid);
    contactInput.classList.toggle("is-invalid", isInvalidShown);
    contactInput.setAttribute("aria-invalid", String(isInvalidShown));

    if (isEmail) {
      contactHint.textContent = "Распознан адрес электронной почты (Email)";
      contactHint.className = "field-hint valid-text";
    } else if (isPhone) {
      contactHint.textContent = "Распознан контактный номер телефона";
      contactHint.className = "field-hint valid-text";
    } else if (isInvalidShown) {
      contactHint.textContent = "Введите корректный телефон (+7 900 123-45-67 или 8 900 123-45-67) либо Email";
      contactHint.className = "field-hint error-text";
    } else {
      contactHint.textContent = "Укажите номер телефона (+7 или 8) либо адрес электронной почты";
      contactHint.className = "field-hint";
    }
    return isValid;
  };

  function validateComment() {
    const maxBodyLen = getMaxCommentBodyLen();
    const rawLen = commentInput.value.length;
    if (charCounter) {
      charCounter.textContent = `${rawLen} / ${maxBodyLen}`;
    }

    const cleanVal = sanitizeInput(commentInput.value, maxBodyLen + 50);
    const isTooLong = cleanVal.length > maxBodyLen;
    const isValid = cleanVal.length >= 5 && !isTooLong;
    const isInvalidShown = (!isValid && cleanVal.length > 0) || isTooLong;

    commentInput.classList.toggle("is-valid", isValid);
    commentInput.classList.toggle("is-invalid", isInvalidShown);
    commentInput.setAttribute("aria-invalid", String(isInvalidShown));

    if (isTooLong) {
      commentHint.textContent = `Превышен лимит сообщения (максимум ${maxBodyLen} символов)`;
      commentHint.className = "field-hint error-text";
    } else if (isInvalidShown) {
      commentHint.textContent = "Слишком короткое сообщение (минимум 5 символов)";
      commentHint.className = "field-hint error-text";
    } else if (isValid) {
      commentHint.textContent = "Текст сообщения заполнен";
      commentHint.className = "field-hint valid-text";
    } else {
      commentHint.textContent = `Пожалуйста, напишите ваше сообщение (от 5 до ${maxBodyLen} символов)`;
      commentHint.className = "field-hint";
    }
    return isValid;
  }

  fioInput.addEventListener("input", validateFio);
  contactInput.addEventListener("input", validateContact);
  commentInput.addEventListener("input", validateComment);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!isConsentConfirmed || isSubmitting || formFieldset.disabled || submitBtn.disabled) return;

    if (hpInput && hpInput.value.trim().length > 0) {
      return;
    }

    formResponse.classList.add("hidden");

    if (Date.now() - formUnlockedAtMs < 2000) {
      formResponse.textContent = "Пожалуйста, проверьте заполненные данные перед отправкой.";
      formResponse.className = "form-response error";
      formResponse.classList.remove("hidden");
      return;
    }

    const lastSentTs = parseInt(safeStorageGet("local", FEEDBACK_COOLDOWN_KEY) || "0", 10);
    const secondsSinceLast = Math.floor((Date.now() - lastSentTs) / 1000);
    if (lastSentTs && secondsSinceLast < 60) {
      const waitSec = 60 - secondsSinceLast;
      formResponse.textContent = `Повторная отправка доступна через ${waitSec} сек.`;
      formResponse.className = "form-response error";
      formResponse.classList.remove("hidden");
      return;
    }

    const isFioOk = validateFio();
    const isContactOk = validateContact();
    const isCommentOk = validateComment();

    if (!isFioOk || !isContactOk || !isCommentOk) {
      if (!isFioOk) fioInput.setAttribute("aria-invalid", "true");
      if (!isContactOk) contactInput.setAttribute("aria-invalid", "true");
      if (!isCommentOk) commentInput.setAttribute("aria-invalid", "true");
      formResponse.textContent = "Пожалуйста, проверьте правильность заполнения выделенных полей.";
      formResponse.className = "form-response error";
      formResponse.classList.remove("hidden");
      return;
    }

    const sanitizedFio = sanitizeInput(fioInput.value, 120).replace(/\s+/g, " ");
    const sanitizedContact = sanitizeInput(contactInput.value, 100);
    const sanitizedComment = sanitizeInput(`${selectedTopicPrefix}${commentInput.value}`, 2000);
    isSubmitting = true;
    submitBtn.disabled = true;
    submitBtnText.textContent = "Отправка сообщения...";
    submitLoader.classList.remove("hidden");

    const formDataParams = new URLSearchParams();
    formDataParams.append("fio", sanitizedFio);
    formDataParams.append("contact", sanitizedContact);
    formDataParams.append("comment", sanitizedComment);
    formDataParams.append("consent_152fz", "confirmed");
    formDataParams.append("website_hp", hpInput ? hpInput.value : "");

    try {
      const response = await fetchWithTimeout(
        FEEDBACK_POST_URL,
        {
          method: "POST",
          body: formDataParams
        },
        12000
      );

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const contentType = (response.headers.get("content-type") || "").toLowerCase();
      if (!contentType.includes("application/json")) {
        const formatErr = new Error("Сервер приёмной вернул некорректный ответ. Попробуйте позже или позвоните в школу: 8 (49147) 2-63-68.");
        formatErr.isServerMessage = true;
        throw formatErr;
      }

      const payload = await response.json();
      if (!payload || payload.ok !== true || !payload.ticketId) {
        const serverErr = new Error(
          sanitizeInput(String((payload && payload.error) || "Сервер отклонил регистрацию обращения"), 240)
        );
        serverErr.isServerMessage = true;
        throw serverErr;
      }

      const ticketNum = sanitizeInput(String(payload.ticketId), 60);

      lastRegisteredTicketId = ticketNum;
      safeStorageSet("local", FEEDBACK_COOLDOWN_KEY, String(Date.now()));

      if (receiptBox && receiptFio && receiptContact && receiptComment && receiptMeta) {
        receiptMeta.textContent = `Талон № ${ticketNum} • ${formatMoscowFullDateTime(getMoscowTimeParts())}`;
        receiptFio.textContent = sanitizedFio;
        receiptContact.textContent = sanitizedContact;
        receiptComment.textContent = sanitizedComment;
        form.classList.add("hidden");
        receiptBox.classList.remove("hidden");
        if (receiptHeading) {
          try {
            receiptHeading.focus({ preventScroll: true });
          } catch (_) {
            receiptHeading.focus();
          }
        }
      } else {
        formResponse.textContent = "Спасибо! Ваше сообщение успешно записано в реестр школы.";
        formResponse.className = "form-response success";
        formResponse.classList.remove("hidden");
      }

      showDynamicIslandToast("Обращение отправлено в школу");
      form.reset();
      resetFormValidationUI();
    } catch (err) {
      formResponse.textContent =
        err && err.isServerMessage && err.message
          ? err.message
          : "Не удалось отправить сообщение. Проверьте подключение к интернету и попробуйте снова.";
      formResponse.className = "form-response error";
      formResponse.classList.remove("hidden");
    } finally {
      isSubmitting = false;
      submitBtn.disabled = false;
      submitBtnText.textContent = "Отправить сообщение в школу";
      submitLoader.classList.add("hidden");
    }
  });

  if (copyTicketBtn) {
    copyTicketBtn.addEventListener("click", async () => {
      if (!lastRegisteredTicketId) return;
      const copied = await copyTextToClipboard(lastRegisteredTicketId);
      showDynamicIslandToast(
        copied
          ? `Номер талона ${lastRegisteredTicketId} скопирован`
          : "Не удалось скопировать — выделите номер талона вручную"
      );
    });
  }

  if (copyReceiptBtn) {
    copyReceiptBtn.addEventListener("click", async () => {
      const receiptText = `${receiptMeta ? receiptMeta.textContent : ""}\nФИО: ${receiptFio ? receiptFio.textContent : ""}\nКонтакт: ${receiptContact ? receiptContact.textContent : ""}\nТекст: ${receiptComment ? receiptComment.textContent : ""}`;
      const copied = await copyTextToClipboard(receiptText);
      showDynamicIslandToast(
        copied ? "Текст квитанции скопирован" : "Не удалось скопировать — выделите текст вручную"
      );
    });
  }

  if (newFeedbackBtn && receiptBox) {
    newFeedbackBtn.addEventListener("click", () => {
      receiptBox.classList.add("hidden");
      form.reset();
      resetFormValidationUI();
      form.classList.remove("hidden");
      formStep.scrollIntoView({
        behavior: isReducedMotionPreferred() ? "auto" : "smooth",
        block: "start"
      });
      try {
        fioInput.focus({ preventScroll: true });
      } catch (_) {}
    });
  }
}

function bindTiltToSelector(selector) {
  if (!isDesktopHoverPointer()) return;
  document.querySelectorAll(selector).forEach((card) => {
    if (card.dataset.tiltBound === "1") return;
    card.dataset.tiltBound = "1";
    card.classList.add("tilt-card");

    let rafId = 0;

    card.addEventListener("pointermove", (e) => {
      if (isReducedMotionPreferred()) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -6.5;
      const ry = ((x / rect.width) - 0.5) * 6.5;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.setProperty("--mx", `${x.toFixed(1)}px`);
        card.style.setProperty("--my", `${y.toFixed(1)}px`);
        card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
        card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      });
    });

    card.addEventListener("pointerleave", () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}

function initMotionTiltAndParallax() {
  bindTiltToSelector(".fact-card, .success-card, .pillar-card");

  const hero = document.getElementById("hero-ambient");
  if (!hero) return;

  let isHeroVisible = true;
  let rafId = 0;

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        isHeroVisible = Boolean(entries[0] && entries[0].isIntersecting);
      },
      { threshold: 0 }
    ).observe(hero);
  }

  const onScroll = () => {
    if (!isHeroVisible || document.hidden || isReducedMotionPreferred()) return;
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      const offset = Math.min(window.scrollY * 0.14, 48);
      hero.style.setProperty("--hero-parallax", `${offset.toFixed(1)}px`);
      rafId = 0;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
}

function initScrollRevealAndCounters() {
  const revealElements = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll("[data-target]");

  if (!("IntersectionObserver" in window) || isReducedMotionPreferred()) {
    revealElements.forEach((el) => {
      el.classList.remove("reveal-pending");
      el.classList.add("visible");
    });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("reveal-pending");
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  const viewportCutoff = window.innerHeight * 0.95;
  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top > viewportCutoff) {
      el.classList.add("reveal-pending");
      revealObserver.observe(el);
    } else {
      el.classList.add("visible");
    }
  });

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute("data-target"));
    const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1100;
    const startTime = performance.now();

    const step = (currentTime) => {
      if (isReducedMotionPreferred()) {
        el.textContent = `${target.toFixed(decimals)}${suffix}`;
        return;
      }
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

function registerOfflineServiceWorker() {
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    const isProjectSite = location.pathname.startsWith("/yambirno-school/");
    const swUrl = isProjectSite ? "/yambirno-school/sw.js" : "./sw.js";
    const swOptions = isProjectSite ? { scope: "/yambirno-school/" } : undefined;
    navigator.serviceWorker.register(swUrl, swOptions).catch(() => {});
  }
}
