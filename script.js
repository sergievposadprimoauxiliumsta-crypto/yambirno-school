const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1w6Z_wfOYJVKxtMHhz9ut6euiLY3YtkkOGNj1Wd_Pr0yJTdmKruN19uZYEyXpLZQSQPQgGHH9i84a/pub?output=csv";
const SHEET3_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1w6Z_wfOYJVKxtMHhz9ut6euiLY3YtkkOGNj1Wd_Pr0yJTdmKruN19uZYEyXpLZQSQPQgGHH9i84a/pub?gid=809598510&single=true&output=csv";
const FEEDBACK_POST_URL = "https://script.google.com/macros/s/AKfycbzCzPpC8lYIeG_GkCYJKTJAhXjM4Ti0vO_9njDpi7lPdC1Rr2Ue8REEE38Tv_dou3X1Kg/exec";

const YAMBIRNO_LAT = 54.1286;
const YAMBIRNO_LON = 41.9708;

const A11Y_STORAGE_KEY = "yambirno_visually_impaired";
const A11Y_SETTINGS_KEY = "yambirno_a11y_settings_v1";
const GRADE_STORAGE_KEY = "yambirno_selected_grade";
const SHEET_CACHE_KEY = "yambirno_live_sheet_cache_v13";
const SHEET3_CACHE_KEY = "yambirno_publications_cache_v1";
const FEEDBACK_COOLDOWN_KEY = "yambirno_feedback_last_sent";

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

const DEFAULT_BELL_TIMES = {
  1: { start: "08:30", end: "09:10", startMin: 510, endMin: 550 },
  2: { start: "09:20", end: "10:00", startMin: 560, endMin: 600 },
  3: { start: "10:10", end: "10:50", startMin: 610, endMin: 650 },
  4: { start: "11:10", end: "11:50", startMin: 670, endMin: 710 },
  5: { start: "12:10", end: "12:50", startMin: 730, endMin: 770 },
  6: { start: "13:00", end: "13:40", startMin: 780, endMin: 820 },
  7: { start: "13:50", end: "14:30", startMin: 830, endMin: 870 }
};

let activeBellTimes = cloneDefaultBells();
let isCustomBellScheduleActive = false;

function cloneDefaultBells() {
  const copy = {};
  Object.keys(DEFAULT_BELL_TIMES).forEach((k) => {
    copy[k] = { ...DEFAULT_BELL_TIMES[k] };
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
let lastRenderedPublicationsSignature = "";
let currentSelectedWeekday = getDefaultSchoolWeekday();
let currentSelectedGrade = getSavedGradeSelection();
let currentSelectedMenuWeek = 1;
let toastTimeoutId = null;
let lastModalTriggerEl = null;

function isReducedMotionPreferred() {
  return Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

function pluralRu(n, one, few, many) {
  const mod10 = Math.abs(n) % 10;
  const mod100 = Math.abs(n) % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

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
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/<[^>]*>?/gm, "")
    .replace(/javascript:|data:|vbscript:/gi, "")
    .trim()
    .slice(0, maxLength);
}

function sanitizeDocumentUrl(rawUrl) {
  if (typeof rawUrl !== "string") return "";
  const cleaned = rawUrl.trim();
  if (!/^https?:\/\/[^\s"'<>]+$/i.test(cleaned)) return "";

  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return "";
    const host = parsed.hostname.toLowerCase();
    const isAllowed = ALLOWED_DOC_HOSTS.some(
      (allowed) => host === allowed || host.endsWith(`.${allowed}`)
    );
    return isAllowed ? parsed.href : "";
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

function lockPageScrollForModal() {
  lastModalTriggerEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  document.body.style.overflow = "hidden";
}

function unlockPageScrollAfterModal() {
  document.body.style.overflow = "";
  if (lastModalTriggerEl && document.contains(lastModalTriggerEl)) {
    lastModalTriggerEl.focus();
  }
  lastModalTriggerEl = null;
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
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 375'><defs><linearGradient id='pg' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#1e3a8a'/><stop offset='100%' stop-color='#2563eb'/></linearGradient></defs><rect width='600' height='375' fill='url(#pg)'/><circle cx='300' cy='155' r='50' fill='#ffffff' opacity='0.15'/><text x='300' y='168' font-family='sans-serif' font-size='38' text-anchor='middle' fill='#fbbf24'>📢</text><text x='300' y='245' font-family='sans-serif' font-size='20' font-weight='bold' fill='#ffffff' text-anchor='middle'>${safeTitle}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function extractInitialsFromFio(fioString) {
  const parts = sanitizeInput(fioString, 120).split(/\s+/).filter(Boolean);
  if (parts.length >= 3) return (parts[1][0] + parts[2][0]).toUpperCase();
  if (parts.length === 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return "УЧ";
}

function resolveImageLinkSource(rawUrlCell, fallbackSvg) {
  const cleaned = (rawUrlCell || "").trim();
  if (!cleaned) return { src: fallbackSvg, altTry: null, fallback: fallbackSvg };

  const driveMatch =
    cleaned.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    cleaned.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (cleaned.includes("drive.google.com") && driveMatch && driveMatch[1]) {
    return {
      src: `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1000`,
      altTry: null,
      fallback: fallbackSvg
    };
  }

  if (cleaned.includes("skrinshoter.ru")) {
    const hasImgExt = /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(cleaned);
    if (hasImgExt) {
      return {
        src: cleaned,
        altTry: `https://wsrv.nl/?url=${encodeURIComponent(cleaned)}&w=1000`,
        fallback: fallbackSvg
      };
    }
    const cleanNoSlash = cleaned.replace(/\/+$/, "");
    return {
      src: `https://wsrv.nl/?url=${encodeURIComponent(cleanNoSlash)}&w=1000`,
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
      altTry: cleaned.startsWith("http") ? `https://wsrv.nl/?url=${encodeURIComponent(cleaned)}&w=1000` : null,
      fallback: fallbackSvg
    };
  }

  return { src: fallbackSvg, altTry: null, fallback: fallbackSvg };
}

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
  initPublicationModalEvents();
  initScrollSpyAndProgressRing();
  initLiveSheetWidgetAndMenu();
  initFeedbackForm();
  registerOfflineServiceWorker();
});

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
  const nextBtn = document.getElementById("chalkboard-next-btn");
  const revealBtn = document.getElementById("chalkboard-reveal-btn");

  if (!widget || !problemEl || !stepsEl || !answerEl) return;

  let currentIdx = 0;
  let isQuizMode = false;
  let isViewportVisible = true;
  let runToken = 0;
  let revealResolver = null;
  const totalSteps = CHALKBOARD_CURRICULUM.length;

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
      if (statusEl) statusEl.textContent = "✓ Решено верно!";
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
      if (statusEl) statusEl.textContent = "💭 Считает в уме...";
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

      if (statusEl) statusEl.textContent = "✓ Решено верно!";
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
        if (statusEl) statusEl.textContent = "✓ Решено верно!";
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
  if (!cleaned) return fallback ? { ...fallback, isCustom: false } : null;

  const match = cleaned.match(/(\d{1,2})[:.](\d{2})\s*[-–—]\s*(\d{1,2})[:.](\d{2})/);
  if (!match) return fallback ? { ...fallback, isCustom: false } : null;

  const sh = parseInt(match[1], 10);
  const sm = parseInt(match[2], 10);
  const eh = parseInt(match[3], 10);
  const em = parseInt(match[4], 10);

  if (sh > 23 || sm > 59 || eh > 23 || em > 59) return fallback ? { ...fallback, isCustom: false } : null;

  const startFormatted = `${String(sh).padStart(2, "0")}:${String(sm).padStart(2, "0")}`;
  const endFormatted = `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;

  const isDifferentFromDefault = fallback
    ? startFormatted !== fallback.start || endFormatted !== fallback.end
    : false;

  return {
    start: startFormatted,
    end: endFormatted,
    startMin,
    endMin: endMin > startMin ? endMin : startMin + 40,
    isCustom: isDifferentFromDefault
  };
}

function classifyLessonSubject(subjectTitle) {
  const s = (subjectTitle || "").toLowerCase();
  if (
    s.includes("математ") ||
    s.includes("мат. грамот") ||
    s.includes("алгебр") ||
    s.includes("геометр") ||
    s.includes("информат") ||
    s.includes("физик") ||
    s.includes("вероятност")
  ) {
    return { cls: "subj-math", icon: "📐" };
  }
  if (
    s.includes("естественно-науч") ||
    s.includes("ен грамот") ||
    s.includes("биолог") ||
    s.includes("хими") ||
    s.includes("географ") ||
    s.includes("окружающ")
  ) {
    return { cls: "subj-sci", icon: "🌿" };
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
    return { cls: "subj-lang", icon: "📖" };
  }
  if (
    s.includes("истори") ||
    s.includes("обществ") ||
    s.includes("важном") ||
    s.includes("горизонт") ||
    s.includes("орксэ") ||
    s.includes("днкр") ||
    s.includes("орлят") ||
    s.includes("служен") ||
    s.includes("край") ||
    s.includes("профориент") ||
    s.includes("проект")
  ) {
    return { cls: "subj-hist", icon: "🏛️" };
  }
  return { cls: "subj-art", icon: "⚡" };
}

function parseRawScheduleIntoLessons(rawText) {
  const cleaned = sanitizeInput(rawText || "", 1200);
  if (!cleaned) return [];

  const parts = cleaned
    .replace(/(^|\s)([0-9])\.(?=\s*[А-Яа-яЁёA-Za-z«"(])/g, "\n$2. ")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return parts.map((item, idx) => {
    const match = item.match(/^([0-9])\.\s*(.+)$/);
    if (match) {
      return { num: parseInt(match[1], 10), title: match[2].trim() };
    }
    return { num: idx + 1, title: item };
  });
}

function renderEmptyScheduleState(containerEl, isOfflineError = false) {
  if (!containerEl) return;
  const box = document.createElement("div");
  box.className = "diary-empty-state";

  const title = document.createElement("div");
  title.className = "diary-empty-title";
  title.textContent = isOfflineError
    ? "⏳ Не удалось загрузить расписание"
    : "⏳ Расписание уточняется";

  const text = document.createElement("p");
  text.className = "diary-empty-text";
  text.textContent = isOfflineError
    ? "Проверьте подключение к интернету и нажмите кнопку «Обновить». Приносим извинения за временные неудобства!"
    : "Актуальное расписание занятий для этого класса сейчас уточняется и будет опубликовано в ближайшее время. Приносим извинения за временные неудобства!";

  const contact = document.createElement("div");
  contact.className = "diary-empty-contact";
  contact.textContent = "Уточнить уроки можно у классного руководителя или по тел. 8 (49147) 2-63-68";

  box.appendChild(title);
  box.appendChild(text);
  box.appendChild(contact);
  containerEl.appendChild(box);
}

function renderDiaryLessonCards(containerEl, rawScheduleText, selectedDayNum, skipAnimation = false, isOfflineError = false) {
  if (!containerEl) return;
  containerEl.innerHTML = "";

  const shiftBanner = document.getElementById("bell-shift-warning");
  if (shiftBanner) {
    shiftBanner.classList.toggle("hidden", !isCustomBellScheduleActive);
  }

  const lessons = parseRawScheduleIntoLessons(rawScheduleText);
  if (lessons.length === 0) {
    renderEmptyScheduleState(containerEl, isOfflineError);
    return;
  }

  const now = new Date();
  const isTodaySelected = now.getDay() === selectedDayNum;
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

  lessons.forEach((lessonObj, idx) => {
    const row = document.createElement("div");
    const subjMeta = classifyLessonSubject(lessonObj.title);
    row.className = `diary-lesson-row ${subjMeta.cls}`;
    if (skipAnimation) {
      row.style.animation = "none";
      row.style.opacity = "1";
      row.style.transform = "none";
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
    containerEl.appendChild(row);
  });
}

function initShareScheduleToChat() {
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
    }

    const lessons = parseRawScheduleIntoLessons(rawSchedule);
    if (lessons.length === 0) {
      showDynamicIslandToast(`Расписание для ${currentSelectedGrade} класса пока уточняется`);
      return;
    }

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
      formattedLessons +
      weatherLine;

    try {
      await navigator.clipboard.writeText(textForChat);
      showDynamicIslandToast(`✓ Расписание ${currentSelectedGrade} класса скопировано для чата!`);
    } catch (_) {
      showDynamicIslandToast("✓ Расписание скопировано");
    }
  });
}

function initLiveDateTimeClockAndAmbient() {
  const dateEl = document.getElementById("live-date-display");
  const timeEl = document.getElementById("live-time-display");
  const statusEl = document.getElementById("school-day-status");
  const widgetTodayPill = document.getElementById("widget-today-pill");
  const heroAmbient = document.getElementById("hero-ambient");
  let lastScheduleMinute = -1;

  const updateClock = () => {
    const now = new Date();
    const hour = now.getHours();
    const currentMinuteKey = now.getDay() * 1440 + hour * 60 + now.getMinutes();

    if (heroAmbient) {
      heroAmbient.classList.toggle("ambient-morning", hour >= 6 && hour < 11);
      heroAmbient.classList.toggle("ambient-evening", hour >= 17 || hour < 6);
    }

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
        if (day === 0 || day === 6) {
          statusEl.textContent = "🏡 Выходной день • Приём обращений открыт";
        } else if (hour >= 8 && hour < 17) {
          statusEl.textContent = "🟢 Учебный день (работа по расписанию)";
        } else {
          statusEl.textContent = "🌙 Учебный день завершён • Приём обращений 24/7";
        }
      }
    }

    if (currentMinuteKey !== lastScheduleMinute) {
      const shouldRefreshSchedule = lastScheduleMinute !== -1 && latestParsedSheetData && now.getDay() === currentSelectedWeekday;
      lastScheduleMinute = currentMinuteKey;
      if (shouldRefreshSchedule) {
        renderDaySpecificScheduleAndMenu(latestParsedSheetData, currentSelectedWeekday, currentSelectedGrade, true);
      }
    }
  };

  updateClock();
  setInterval(updateClock, 1000);
}

function decodeWmoWeather(code) {
  if (code === 0) return { icon: "☀️", text: "Ясно", rain: false, snow: false, sky: "clear" };
  if (code === 1 || code === 2) return { icon: "🌤️", text: "Переменная облачность", rain: false, snow: false, sky: "clear" };
  if (code === 3) return { icon: "☁️", text: "Пасмурно", rain: false, snow: false, sky: "cloudy" };
  if (code === 45 || code === 48) return { icon: "🌫️", text: "Туман", rain: false, snow: false, sky: "cloudy" };
  if (code >= 51 && code <= 57) return { icon: "🌦️", text: "Морось", rain: true, snow: false, sky: "rain" };
  if (code >= 61 && code <= 67) return { icon: "🌧️", text: "Дождь", rain: true, snow: false, sky: "rain" };
  if (code >= 71 && code <= 77) return { icon: "❄️", text: "Снег", rain: false, snow: true, sky: "snow" };
  if (code >= 80 && code <= 82) return { icon: "🌧️", text: "Ливень", rain: true, snow: false, sky: "rain" };
  if (code >= 85 || code === 86) return { icon: "🌨️", text: "Снегопад", rain: false, snow: true, sky: "snow" };
  if (code >= 95) return { icon: "⛈️", text: "Гроза", rain: true, snow: false, sky: "rain" };
  return { icon: "🌤️", text: "Без осадков", rain: false, snow: false, sky: "clear" };
}

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

function initAccessibilityMode() {
  const toggleBtn = document.getElementById("a11y-toggle");
  const panel = document.getElementById("a11y-panel");
  if (!toggleBtn) return;

  const sizeBtns = panel ? panel.querySelectorAll("[data-a11y-size]") : [];
  const themeBtns = panel ? panel.querySelectorAll("[data-a11y-theme]") : [];
  const spacingBtns = panel ? panel.querySelectorAll("[data-a11y-spacing]") : [];
  const imagesToggleBtn = document.getElementById("a11y-images-toggle");
  const resetBtn = document.getElementById("a11y-reset-btn");

  const defaultSettings = {
    size: "normal",
    theme: "yellow",
    spacing: "normal",
    showImages: false
  };

  let settings = { ...defaultSettings };
  try {
    const rawSettings = localStorage.getItem(A11Y_SETTINGS_KEY);
    if (rawSettings) {
      const parsed = JSON.parse(rawSettings);
      settings = { ...defaultSettings, ...parsed };
    }
  } catch (_) {}

  const saveSettings = () => {
    try {
      localStorage.setItem(A11Y_SETTINGS_KEY, JSON.stringify(settings));
    } catch (_) {}
  };

  const applySettings = () => {
    document.body.classList.remove(
      "a11y-size-large",
      "a11y-size-xlarge",
      "a11y-theme-white",
      "a11y-theme-black",
      "a11y-spacing-medium",
      "a11y-spacing-large",
      "a11y-show-images"
    );

    if (settings.size === "large") document.body.classList.add("a11y-size-large");
    if (settings.size === "xlarge") document.body.classList.add("a11y-size-xlarge");
    if (settings.theme === "white") document.body.classList.add("a11y-theme-white");
    if (settings.theme === "black") document.body.classList.add("a11y-theme-black");
    if (settings.spacing === "medium") document.body.classList.add("a11y-spacing-medium");
    if (settings.spacing === "large") document.body.classList.add("a11y-spacing-large");
    if (settings.showImages) document.body.classList.add("a11y-show-images");

    sizeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-a11y-size") === settings.size)));
    themeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-a11y-theme") === settings.theme)));
    spacingBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-a11y-spacing") === settings.spacing)));

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
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    }

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

  applySettings();
  applyMode(savedState, false);

  toggleBtn.addEventListener("click", () => {
    const nextState = !document.body.classList.contains("visually-impaired");
    applyMode(nextState, true);
    try {
      localStorage.setItem(A11Y_STORAGE_KEY, String(nextState));
    } catch (_) {}
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

  spacingBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      settings.spacing = btn.getAttribute("data-a11y-spacing") || "normal";
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
    return { timestamp: 0, displayStr: "", isFuture: false };
  }

  let parsedDate = null;
  const ruMatch = cleaned.match(/^(\d{1,2})[./\-](\d{1,2})[./\-](\d{4})(?:\s+(\d{1,2})[:.](\d{2}))?/);
  if (ruMatch) {
    const day = parseInt(ruMatch[1], 10);
    const month = parseInt(ruMatch[2], 10) - 1;
    const year = parseInt(ruMatch[3], 10);
    const hours = ruMatch[4] !== undefined ? parseInt(ruMatch[4], 10) : 0;
    const minutes = ruMatch[5] !== undefined ? parseInt(ruMatch[5], 10) : 0;
    parsedDate = new Date(year, month, day, hours, minutes, 0);
  } else {
    const fallbackTimestamp = Date.parse(cleaned);
    if (!Number.isNaN(fallbackTimestamp)) {
      parsedDate = new Date(fallbackTimestamp);
    }
  }

  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    return { timestamp: 0, displayStr: cleaned, isFuture: false };
  }

  const nowMs = Date.now();
  const targetMs = parsedDate.getTime();
  const hasTimePart = /\d{1,2}[:.]\d{2}/.test(cleaned);
  const displayStr = hasTimePart
    ? parsedDate.toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" }) +
      " в " +
      parsedDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    : parsedDate.toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });

  return {
    timestamp: targetMs,
    displayStr,
    isFuture: targetMs > nowMs
  };
}

function classifyPublicationBadgeTheme(badgeText) {
  const b = (badgeText || "").toLowerCase();
  if (b.includes("важн") || b.includes("срочн") || b.includes("вниман")) {
    return { cardCls: "pub-theme-urgent", badgeCls: "pub-badge-urgent" };
  }
  if (b.includes("безопасн") || b.includes("памятк") || b.includes("пдд") || b.includes("мчс") || b.includes("профилакт")) {
    return { cardCls: "pub-theme-safety", badgeCls: "pub-badge-safety" };
  }
  if (b.includes("праздник") || b.includes("событ") || b.includes("конкурс") || b.includes("побед")) {
    return { cardCls: "pub-theme-event", badgeCls: "pub-badge-event" };
  }
  return { cardCls: "", badgeCls: "" };
}

function openPublicationModal(pubItem) {
  const modal = document.getElementById("publication-modal");
  const badgeEl = document.getElementById("pub-modal-badge");
  const dateEl = document.getElementById("pub-modal-date");
  const titleEl = document.getElementById("pub-modal-title");
  const galleryEl = document.getElementById("pub-modal-gallery");
  const bodyEl = document.getElementById("pub-modal-body");
  const docLinkEl = document.getElementById("pub-modal-doc-link");
  const closeBtn = document.getElementById("pub-modal-close");

  if (!modal || !titleEl || !bodyEl) return;

  if (badgeEl) badgeEl.textContent = pubItem.badge || "Информация";
  if (dateEl) dateEl.textContent = pubItem.dateDisplay || "";
  titleEl.textContent = pubItem.title || "Объявление школы";
  bodyEl.textContent = pubItem.text || "";

  if (galleryEl) {
    galleryEl.innerHTML = "";
    if (Array.isArray(pubItem.photos) && pubItem.photos.length > 0) {
      const fallbackSvg = buildPublicationFallbackSvg(pubItem.title);
      pubItem.photos.forEach((rawUrl, idx) => {
        const wrap = document.createElement("div");
        wrap.className = "pub-modal-photo-item";

        const img = document.createElement("img");
        img.setAttribute("referrerpolicy", "no-referrer");
        img.loading = "lazy";
        img.decoding = "async";
        img.alt = `${pubItem.title || "Фото материала"} — изображение ${idx + 1}`;

        const resolved = resolveImageLinkSource(rawUrl, fallbackSvg);
        let triedAlt = false;
        img.onerror = () => {
          if (!triedAlt && resolved.altTry) {
            triedAlt = true;
            img.src = resolved.altTry;
          } else {
            img.onerror = null;
            img.src = resolved.fallback;
          }
        };
        img.src = resolved.src;

        wrap.appendChild(img);
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
      docLinkEl.classList.remove("hidden");
    } else {
      docLinkEl.href = "#";
      docLinkEl.classList.add("hidden");
    }
  }

  lockPageScrollForModal();
  modal.classList.remove("hidden");
  modal.removeAttribute("hidden");
  if (closeBtn) closeBtn.focus();
}

function initPublicationModalEvents() {
  const modal = document.getElementById("publication-modal");
  const closeBtn = document.getElementById("pub-modal-close");
  const copyBtn = document.getElementById("pub-modal-copy-btn");
  const titleEl = document.getElementById("pub-modal-title");
  const bodyEl = document.getElementById("pub-modal-body");

  if (!modal) return;

  const closeModal = () => {
    if (modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    modal.setAttribute("hidden", "");
    unlockPageScrollAfterModal();
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (modal.classList.contains("hidden")) return;
    if (e.key === "Escape") {
      closeModal();
      return;
    }
    handleModalFocusTrap(e, modal);
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const fullText = `${titleEl ? titleEl.textContent : ""}\n\n${bodyEl ? bodyEl.textContent : ""}`.trim();
      if (!fullText) return;
      try {
        await navigator.clipboard.writeText(fullText);
        showDynamicIslandToast("✓ Текст публикации скопирован");
      } catch (_) {
        showDynamicIslandToast("Скопировано в буфер обмена");
      }
    });
  }
}

function renderSheet3Publications(rowsArray, forceRender = false) {
  const sectionEl = document.getElementById("school-publications");
  const gridEl = document.getElementById("publications-grid");
  const navLinkEl = document.getElementById("nav-publications-link");
  const navCountEl = document.getElementById("nav-publications-count");

  if (!sectionEl || !gridEl) return;

  if (!Array.isArray(rowsArray) || rowsArray.length <= 1) {
    lastRenderedPublicationsSignature = "[]";
    gridEl.innerHTML = "";
    sectionEl.classList.add("hidden");
    sectionEl.setAttribute("hidden", "");
    if (navLinkEl) navLinkEl.classList.add("hidden");
    return;
  }

  const activePublications = [];

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

    activePublications.push({
      photos: photosList,
      title: rawTitleCell || "Объявление школы",
      badge: rawBadgeCell || "Информация",
      text: rawTextCell,
      dateDisplay: scheduleInfo.displayStr,
      docUrl: rawDocCell
    });
  }

  const nextSignature = JSON.stringify(activePublications);
  if (!forceRender && nextSignature === lastRenderedPublicationsSignature) {
    return;
  }
  lastRenderedPublicationsSignature = nextSignature;
  gridEl.innerHTML = "";

  if (activePublications.length === 0) {
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

  activePublications.forEach((pub) => {
    const theme = classifyPublicationBadgeTheme(pub.badge);
    const card = document.createElement("article");
    card.className = `pub-card surface-card elevate-card reveal visible ${theme.cardCls}`.trim();

    if (pub.photos.length > 0) {
      const mediaWrap = document.createElement("div");
      mediaWrap.className = "pub-card-media";
      mediaWrap.setAttribute("title", "Нажмите, чтобы открыть материал полностью");

      const img = document.createElement("img");
      img.className = "pub-card-img";
      img.setAttribute("referrerpolicy", "no-referrer");
      img.loading = "lazy";
      img.decoding = "async";
      img.alt = pub.title;

      const fallbackSvg = buildPublicationFallbackSvg(pub.title);
      const resolved = resolveImageLinkSource(pub.photos[0], fallbackSvg);
      let triedAlt = false;
      img.onerror = () => {
        if (!triedAlt && resolved.altTry) {
          triedAlt = true;
          img.src = resolved.altTry;
        } else {
          img.onerror = null;
          img.src = resolved.fallback;
        }
      };
      img.src = resolved.src;
      mediaWrap.appendChild(img);

      if (pub.photos.length > 1) {
        const multiBadge = document.createElement("span");
        multiBadge.className = "pub-multi-badge";
        multiBadge.textContent = `📷 ${pub.photos.length} фото`;
        mediaWrap.appendChild(multiBadge);
      }

      mediaWrap.addEventListener("click", () => openPublicationModal(pub));
      card.appendChild(mediaWrap);
    }

    const content = document.createElement("div");
    content.className = "pub-card-content";

    const metaRow = document.createElement("div");
    metaRow.className = "pub-card-meta";

    const badgeSpan = document.createElement("span");
    badgeSpan.className = `pub-badge ${theme.badgeCls}`.trim();
    badgeSpan.textContent = pub.badge;
    metaRow.appendChild(badgeSpan);

    if (pub.dateDisplay) {
      const dateSpan = document.createElement("span");
      dateSpan.className = "pub-date-text";
      dateSpan.textContent = `📅 ${pub.dateDisplay}`;
      metaRow.appendChild(dateSpan);
    }

    content.appendChild(metaRow);

    const titleEl = document.createElement("h3");
    titleEl.className = "pub-card-title";
    titleEl.textContent = pub.title;
    content.appendChild(titleEl);

    const isLongText = pub.text.length > 220;
    if (pub.text) {
      const excerptEl = document.createElement("p");
      excerptEl.className = "pub-card-excerpt";
      excerptEl.textContent = isLongText ? `${pub.text.slice(0, 220).trim()}...` : pub.text;
      content.appendChild(excerptEl);
    }

    const footer = document.createElement("div");
    footer.className = "pub-card-footer";

    if (isLongText || pub.photos.length > 0) {
      const readBtn = document.createElement("button");
      readBtn.type = "button";
      readBtn.className = "btn-pub-action";
      readBtn.textContent = pub.photos.length > 1 ? `📖 Открыть (${pub.photos.length} фото)` : "📖 Читать полностью";
      readBtn.addEventListener("click", () => openPublicationModal(pub));
      footer.appendChild(readBtn);
    }

    if (pub.docUrl) {
      const docLink = document.createElement("a");
      docLink.href = pub.docUrl;
      docLink.target = "_blank";
      docLink.rel = "noopener noreferrer";
      docLink.className = "btn-pub-action btn-pub-doc";
      docLink.textContent = "📎 Документ ↗";
      footer.appendChild(docLink);
    }

    if (footer.children.length > 0) {
      content.appendChild(footer);
    }

    card.appendChild(content);
    gridEl.appendChild(card);
  });
}

async function loadSheet3PublicationsData() {
  const sectionEl = document.getElementById("school-publications");
  if (!sectionEl) return;

  try {
    const response = await fetch(SHEET3_CSV_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`Sheet3 HTTP ${response.status}`);

    const csvText = await response.text();
    const rows = parseCSVPreserveRowIndex(csvText);
    latestRawSheet3Rows = rows;
    renderSheet3Publications(rows, false);

    try {
      localStorage.setItem(SHEET3_CACHE_KEY, JSON.stringify(rows));
    } catch (_) {}
  } catch (_) {
    try {
      const rawCache = localStorage.getItem(SHEET3_CACHE_KEY);
      if (rawCache) {
        const cachedRows = JSON.parse(rawCache);
        latestRawSheet3Rows = cachedRows;
        renderSheet3Publications(cachedRows, false);
      }
    } catch (_) {}
  }
}

setInterval(() => {
  if (latestRawSheet3Rows) {
    renderSheet3Publications(latestRawSheet3Rows, false);
  }
}, 60000);

function updateGalleryFromSheetRows(galleryArray) {
  if (!Array.isArray(galleryArray) || galleryArray.length === 0) return;

  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  const existingItems = Array.from(grid.querySelectorAll(".gallery-item"));

  galleryArray.forEach((itemData, idx) => {
    if (!itemData) return;

    let figure = existingItems[idx];
    if (!figure) {
      figure = document.createElement("figure");
      figure.className = "gallery-item surface-card elevate-card reveal visible";
      figure.setAttribute("tabindex", "0");
      figure.setAttribute("role", "button");
      figure.innerHTML = `
        <div class="gallery-img-wrap">
          <img src="" alt="" class="gallery-img" width="600" height="400" loading="lazy" decoding="async" referrerpolicy="no-referrer">
          <span class="gallery-zoom-badge" aria-hidden="true">🔍 Увеличить</span>
        </div>
        <figcaption class="gallery-caption"></figcaption>
      `;
      grid.appendChild(figure);
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
  });
}

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

  const openLightboxAt = (idx, isNavigation = false) => {
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

    if (!isNavigation) {
      lockPageScrollForModal();
      lightbox.classList.remove("hidden");
      lightbox.removeAttribute("hidden");
      if (closeBtn) closeBtn.focus();
    }
  };

  const closeLightbox = () => {
    if (lightbox.classList.contains("hidden")) return;
    lightbox.classList.add("hidden");
    lightbox.setAttribute("hidden", "");
    unlockPageScrollAfterModal();
  };

  grid.addEventListener("click", (e) => {
    const fig = e.target.closest(".gallery-item");
    if (!fig) return;
    const idx = getFigures().indexOf(fig);
    if (idx !== -1) openLightboxAt(idx, false);
  });

  grid.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const fig = e.target.closest(".gallery-item");
      if (!fig) return;
      e.preventDefault();
      const idx = getFigures().indexOf(fig);
      if (idx !== -1) openLightboxAt(idx, false);
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn) prevBtn.addEventListener("click", () => openLightboxAt(currentSlideIdx - 1, true));
  if (nextBtn) nextBtn.addEventListener("click", () => openLightboxAt(currentSlideIdx + 1, true));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("hidden")) return;
    if (e.key === "Escape") {
      closeLightbox();
      return;
    }
    if (e.key === "ArrowLeft") {
      openLightboxAt(currentSlideIdx - 1, true);
      return;
    }
    if (e.key === "ArrowRight") {
      openLightboxAt(currentSlideIdx + 1, true);
      return;
    }
    handleModalFocusTrap(e, lightbox);
  });
}

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

function initWeekdayAndGradeSwitchers() {
  const allDayPills = document.querySelectorAll(".day-pill");
  const allGradePills = document.querySelectorAll(".grade-pill");
  const allWeekPills = document.querySelectorAll(".week-pill");

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

  const allWeekPills = document.querySelectorAll(".week-pill");
  allWeekPills.forEach((wPill) => {
    const pWeek = parseInt(wPill.getAttribute("data-week") || "1", 10);
    wPill.classList.toggle("active", pWeek === currentSelectedMenuWeek);
  });

  const jsToday = new Date().getDay();
  const dayName = DAY_NAMES_FULL[dayNum] || "Понедельник";
  const dayLabelText = jsToday === dayNum ? `${dayName}, ${gradeNum} класс` : `${dayName} (${gradeNum} класс)`;

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
    const baseMenuLabel = jsToday === dayNum ? `${dayName} (сегодня)` : dayName;
    menuDayLabel.textContent = hasWeek2 ? `${baseMenuLabel} • ${currentSelectedMenuWeek} нед.` : baseMenuLabel;
  }
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
  }
  if (!hasWeek2 && currentSelectedMenuWeek !== 1) {
    currentSelectedMenuWeek = 1;
  }

  const weekMap = (dataObj.menuByWeekAndDay && dataObj.menuByWeekAndDay[currentSelectedMenuWeek])
    ? dataObj.menuByWeekAndDay[currentSelectedMenuWeek]
    : (dataObj.menuByDay || {});
  const dayMenuObj = weekMap[dayNum] || {};

  const breakfastText = (dayMenuObj.breakfast || "").trim();
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
  const match = s.match(/^([1-9])\s*(класс|кл\.?|кл)$/i);
  if (match && match[1]) return parseInt(match[1], 10);
  return 0;
}

function detectBellLessonNumberFromCell(cellString) {
  const s = (cellString || "").toLowerCase().trim();
  const match = s.match(/^([0-8])\s*(урок|ур\.?)$/i);
  if (match && match[1] !== undefined) return parseInt(match[1], 10);
  return -1;
}

function detectPhotoRowFromCell(cellString) {
  const s = (cellString || "").toLowerCase().trim();
  return /^фото\s*\d+/i.test(s);
}

function initLiveSheetWidgetAndMenu() {
  const newsEl = document.getElementById("col-news");
  const scheduleEl = document.getElementById("col-schedule");
  const importantEl = document.getElementById("col-important");
  const refreshBtn = document.getElementById("refresh-sheet-btn");
  const statusEl = document.getElementById("widget-status");

  if (!newsEl || !scheduleEl || !importantEl) return;

  const renderWidgetData = (dataObj, isFromCache = false) => {
    latestParsedSheetData = dataObj;

    activeBellTimes = dataObj.bellTimes || cloneDefaultBells();
    isCustomBellScheduleActive = Boolean(dataObj.hasCustomBells);

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

    loadSheet3PublicationsData();

    try {
      const response = await fetch(SHEET_CSV_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ошибка: ${response.status}`);

      const csvText = await response.text();
      const rows = parseCSVPreserveRowIndex(csvText);

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
        if (colALower === "новости дня") {
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
          currentMode = (colALower.includes("2") || colALower.includes("вторая")) ? "menu_w2" : "menu_w1";
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
          if (parsedBell) {
            parsedBellTimes[bellNumA] = {
              start: parsedBell.start,
              end: parsedBell.end,
              startMin: parsedBell.startMin,
              endMin: parsedBell.endMin
            };
            if (parsedBell.isCustom) hasCustomBells = true;
          }
          continue;
        }
        if (currentMode === "bells" && bellNumB >= 0 && bellNumB <= 8) {
          const parsedBell = parseBellTimeRangeString(colC, bellNumB);
          if (parsedBell) {
            parsedBellTimes[bellNumB] = {
              start: parsedBell.start,
              end: parsedBell.end,
              startMin: parsedBell.startMin,
              endMin: parsedBell.endMin
            };
            if (parsedBell.isCustom) hasCustomBells = true;
          }
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

      const nowLabel = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

      const parsedData = {
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
        renderDiaryLessonCards(scheduleEl, "", currentSelectedWeekday, false, true);
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
      showDynamicIslandToast("Данные расписания, материалов и табло обновлены");
    });
  }

  loadSheetData();
}

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

function initScrollSpyAndProgressRing() {
  const scrollTopBtn = document.getElementById("scroll-top-btn");
  const progressCircle = document.getElementById("scroll-progress-circle");
  const spyLinks = document.querySelectorAll(".nav-link[data-scrollspy]");
  const circumference = 119.38;

  const onScroll = () => {
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

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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
  const receiptMeta = document.getElementById("receipt-meta");
  const receiptFio = document.getElementById("receipt-fio");
  const receiptContact = document.getElementById("receipt-contact");
  const receiptComment = document.getElementById("receipt-comment");
  const copyReceiptBtn = document.getElementById("copy-receipt-btn");
  const newFeedbackBtn = document.getElementById("new-feedback-btn");

  let isConsentConfirmed = false;
  let formUnlockedAtMs = 0;
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
    const hashMatch = window.location.hash.match(/topic=([a-z]+)/i);
    const searchParams = new URLSearchParams(window.location.search);
    const topicParam = (hashMatch && hashMatch[1]) || searchParams.get("topic");
    if (topicParam === "thanks" && topicChips[1]) topicChips[1].click();
    else if (topicParam === "idea" && topicChips[2]) topicChips[2].click();
    else if (topicParam === "question" && topicChips[0]) topicChips[0].click();
  } catch (_) {}

  acceptBtn.addEventListener("click", () => {
    isConsentConfirmed = true;
    formUnlockedAtMs = Date.now();
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

    showDynamicIslandToast("✓ Согласие 152-ФЗ подтверждено");
    fioInput.focus();
  });

  const validateFio = () => {
    const cleanVal = sanitizeInput(fioInput.value, 120).replace(/\s+/g, " ");
    const onlyLettersAndSpaces = /^[А-Яа-яЁёA-Za-z\-\s]+$/.test(cleanVal);
    const words = cleanVal.split(" ").filter((w) => w.length >= 2);
    const isValid = onlyLettersAndSpaces && words.length >= 2;

    fioInput.classList.toggle("is-valid", isValid);
    fioInput.classList.toggle("is-invalid", !isValid && cleanVal.length > 0);

    if (!isValid && cleanVal.length > 0) {
      fioHint.textContent = "Введите минимум 2 слова (только буквы, дефис и пробелы)";
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

    try {
      const lastSentTs = parseInt(localStorage.getItem(FEEDBACK_COOLDOWN_KEY) || "0", 10);
      const secondsSinceLast = Math.floor((Date.now() - lastSentTs) / 1000);
      if (lastSentTs && secondsSinceLast < 60) {
        const waitSec = 60 - secondsSinceLast;
        formResponse.textContent = `Повторная отправка доступна через ${waitSec} сек.`;
        formResponse.className = "form-response error";
        formResponse.classList.remove("hidden");
        return;
      }
    } catch (_) {}

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
    const fallbackTicketNum = `ЯМБ-${new Date().toLocaleDateString("ru-RU").replace(/\./g, "")}-${Math.floor(100 + Math.random() * 900)}`;

    submitBtn.disabled = true;
    submitBtnText.textContent = "Отправка сообщения...";
    submitLoader.classList.remove("hidden");

    const formDataParams = new URLSearchParams();
    formDataParams.append("fio", sanitizedFio);
    formDataParams.append("contact", sanitizedContact);
    formDataParams.append("comment", sanitizedComment);
    formDataParams.append("ticket", fallbackTicketNum);
    formDataParams.append("website_hp", hpInput ? hpInput.value : "");

    try {
      const response = await fetch(FEEDBACK_POST_URL, {
        method: "POST",
        body: formDataParams
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      let ticketNum = fallbackTicketNum;
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const payload = await response.json();
        if (payload && payload.ok === false) {
          throw new Error(payload.error || "Сервер отклонил обращение");
        }
        if (payload && payload.ticketId) {
          ticketNum = sanitizeInput(String(payload.ticketId), 60) || fallbackTicketNum;
        }
      }

      try {
        localStorage.setItem(FEEDBACK_COOLDOWN_KEY, String(Date.now()));
      } catch (_) {}

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

function initScrollRevealAndCounters() {
  const revealElements = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll("[data-target]");

  if (
    !("IntersectionObserver" in window) ||
    document.body.classList.contains("visually-impaired") ||
    isReducedMotionPreferred()
  ) {
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

function registerOfflineServiceWorker() {
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}
