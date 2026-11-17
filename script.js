/**
 * Основной скрипт сайта Ямбирнского филиала МОУ «Лесно-Конобеевская СШ»
 * Чистый Vanilla JS (ES6+), без внешних библиотек. Подключается с атрибутом defer.
 */

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1w6Z_wfOYJVKxtMHhz9ut6euiLY3YtkkOGNj1Wd_Pr0yJTdmKruN19uZYEyXpLZQSQPQgGHH9i84a/pub?output=csv";
const FEEDBACK_POST_URL = "https://script.google.com/macros/s/AKfycbzCzPpC8lYIeG_GkCYJKTJAhXjM4Ti0vO_9njDpi7lPdC1Rr2Ue8REEE38Tv_dou3X1Kg/exec";
const A11Y_STORAGE_KEY = "yambirno_visually_impaired";
const SHEET_CACHE_KEY = "yambirno_live_sheet_cache_v4";

// Цветовые палитры для автоматических круглых SVG-аватаров учителей
const AVATAR_PALETTES = [
  { bg: "#dbeafe", fg: "#1e40af" },
  { bg: "#fef3c7", fg: "#b45309" },
  { bg: "#dcfce7", fg: "#15803d" },
  { bg: "#e0e7ff", fg: "#3730a3" },
  { bg: "#ccfbf1", fg: "#0f766e" },
  { bg: "#fce7f3", fg: "#9d174d" },
  { bg: "#e0f2fe", fg: "#0369a1" },
  { bg: "#ecfccb", fg: "#3f6212" },
  { bg: "#f3e8ff", fg: "#6b21a8" },
  { bg: "#ffedd5", fg: "#9a3412" },
  { bg: "#fae8ff", fg: "#86198f" },
  { bg: "#f1f5f9", fg: "#334155" }
];

let customSheetSchoolStatus = "";

/**
 * Санитизация пользовательского ввода (Защита от XSS и формульных инъекций)
 */
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

/**
 * Генерация круглого SVG-аватара (Data URI) с инициалами учителя
 */
function buildInitialsSvgDataUri(initials, index = 0) {
  const palette = AVATAR_PALETTES[index % AVATAR_PALETTES.length];
  const safeChars = sanitizeInput(initials, 3).toUpperCase() || "УЧ";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><circle cx='60' cy='60' r='60' fill='${palette.bg}'/><text x='60' y='70' font-family='sans-serif' font-size='34' font-weight='bold' fill='${palette.fg}' text-anchor='middle'>${safeChars}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Извлечение инициалов (Имя + Отчество или первые 2 слова) из полного ФИО
 */
function extractInitialsFromFio(fioString) {
  const parts = sanitizeInput(fioString, 120)
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 3) {
    return (parts[1][0] + parts[2][0]).toUpperCase();
  }
  if (parts.length === 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return "УЧ";
}

/**
 * Умный разбор ячейки Фото (Столбец F):
 * - Конвертирует ссылки Google Диска в прямые изображения
 * - Пропускает https://, http:// и относительные пути с GitHub (например, img/ivanova.jpg)
 * - Если в ячейке 1–3 буквы или пусто — возвращает SVG-заглушку с инициалами
 */
function resolveTeacherPhotoSource(rawPhotoCell, teacherFio, cardIndex) {
  const cleaned = (rawPhotoCell || "").trim();
  const fallbackSvg = buildInitialsSvgDataUri(extractInitialsFromFio(teacherFio), cardIndex);

  if (!cleaned) {
    return { src: fallbackSvg, fallback: fallbackSvg };
  }

  // Если в ячейке просто написаны инициалы (например: "ЕА" или "ММ")
  if (/^[А-Яа-яЁёA-Za-z]{1,3}$/.test(cleaned)) {
    const customSvg = buildInitialsSvgDataUri(cleaned, cardIndex);
    return { src: customSvg, fallback: customSvg };
  }

  // Проверка на ссылку с Google Диска: https://drive.google.com/file/d/FILE_ID/view...
  const driveMatch =
    cleaned.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    cleaned.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (cleaned.includes("drive.google.com") && driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return {
      src: `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`,
      fallback: fallbackSvg
    };
  }

  // Прямая веб-ссылка (https://...) или локальный файл в репозитории GitHub (например: photos/popikhina.jpg)
  const isSafeUrlOrPath =
    /^https?:\/\/[^\s"'<>]+$/i.test(cleaned) ||
    /^[a-zA-Z0-9_\-./]+\.(jpg|jpeg|png|webp|gif|svg)$/i.test(cleaned);

  if (isSafeUrlOrPath) {
    return { src: cleaned, fallback: fallbackSvg };
  }

  return { src: fallbackSvg, fallback: fallbackSvg };
}

document.addEventListener("DOMContentLoaded", () => {
  initLiveDateTimeClock();
  initAccessibilityMode();
  initScrollRevealAndCounters();
  initTeacherFilter();
  initDigitalNavigatorTabs();
  initLiveSheetWidgetAndMenu();
  initFeedbackForm();
  registerOfflineServiceWorker();
});

/* ==========================================================================
   1. ЖИВЫЕ ЧАСЫ, СЕГОДНЯШНЯЯ ДАТА И ЧЕСТНЫЙ СТАТУС РАБОТЫ ШКОЛЫ
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
          statusEl.textContent = "🏡 Выходной день • Электронная приёмная открыта";
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
   2. ДОСТУПНОСТЬ (A11Y) И СТАБИЛЬНАЯ КНОПКА "ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ"
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
   3. ОБНОВЛЕНИЕ КАРТОЧЕК ПЕДАГОГОВ ИЗ СТОЛБЦОВ F, G, H, I, J (СТРОКИ 2–13)
   ========================================================================== */
function updateTeachersFromSheetRows(teachersDataArray) {
  if (!Array.isArray(teachersDataArray) || teachersDataArray.length === 0) return;

  const teacherCards = document.querySelectorAll("#teachers-grid .teacher-card");
  if (teacherCards.length === 0) return;

  teacherCards.forEach((card, idx) => {
    const rowData = teachersDataArray[idx];
    if (!rowData) return;

    const photoEl = card.querySelector(".teacher-photo");
    const badgeEl = card.querySelector(".teacher-badge");
    const nameEl = card.querySelector(".teacher-name");
    const roleEl = card.querySelector(".teacher-role");
    const metaEl = card.querySelector(".teacher-meta");

    const newFio = rowData.fio || (nameEl ? nameEl.textContent : "");
    const newBadge = rowData.badge || "";
    const newRole = rowData.role || "";
    const newDesc = rowData.desc || "";
    const newPhotoRaw = rowData.photo || "";

    // 1. ФИО (Столбец H)
    if (nameEl && rowData.fio) {
      nameEl.textContent = rowData.fio;
    }

    // 2. Бейдж / Статус (Столбец G) + автоматическая категория для фильтра
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

    // 3. Должность и предмет (Столбец I)
    if (roleEl && newRole) {
      roleEl.textContent = newRole;
    }

    // 4. Описание / Стаж и заслуги (Столбец J)
    if (metaEl && newDesc) {
      metaEl.textContent = newDesc;
    }

    // 5. Фото / Аватар (Столбец F) — только если задано новое фото или изменилось ФИО
    if (photoEl && (newPhotoRaw || rowData.fio)) {
      const resolved = resolveTeacherPhotoSource(newPhotoRaw, newFio, idx);
      photoEl.onerror = () => {
        photoEl.onerror = null;
        photoEl.src = resolved.fallback;
      };
      photoEl.src = resolved.src;
      photoEl.alt = `Фото педагога: ${newFio}`;
    }
  });

  // Автоматический пересчет количества учителей на кнопках фильтра
  recalculateTeacherFilterCounts();
}

function recalculateTeacherFilterCounts() {
  const allCards = document.querySelectorAll("#teachers-grid .teacher-card");
  const mainCards = document.querySelectorAll('#teachers-grid .teacher-card[data-category="main"]');
  const partTimeCards = document.querySelectorAll('#teachers-grid .teacher-card[data-category="part-time"]');

  const btnAll = document.querySelector('.filter-btn[data-filter="all"]');
  const btnMain = document.querySelector('.filter-btn[data-filter="main"]');
  const btnPart = document.querySelector('.filter-btn[data-filter="part-time"]');

  if (btnAll) btnAll.textContent = `Все педагоги (${allCards.length})`;
  if (btnMain) btnMain.textContent = `Основной состав (${mainCards.length})`;
  if (btnPart) btnPart.textContent = `Совместители (${partTimeCards.length})`;
}

/* ==========================================================================
   4. ИНТЕГРАЦИЯ С GOOGLE SHEETS:
      - СТРОКА 2 (A2:D2) -> Виджет "Живая информация" и статус
      - СТРОКА 3 (A3:C3) -> Меню столовой
      - СТРОКИ 2–13 (F2:J13) -> 12 карточек учителей
   ========================================================================== */
function initLiveSheetWidgetAndMenu() {
  const newsEl = document.getElementById("col-news");
  const scheduleEl = document.getElementById("col-schedule");
  const importantEl = document.getElementById("col-important");
  const refreshBtn = document.getElementById("refresh-sheet-btn");
  const statusEl = document.getElementById("widget-status");

  const menuBreakfastEl = document.getElementById("menu-breakfast");
  const menuLunchEl = document.getElementById("menu-lunch");
  const menuNoteEl = document.getElementById("menu-note");

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
    [newsEl, scheduleEl, importantEl].forEach((el) => {
      el.classList.remove("is-loading-shimmer", "flash-updated");
      void el.offsetWidth;
      el.classList.add("flash-updated");
    });

    newsEl.textContent = dataObj.col1News || "На сегодня дополнительных объявлений нет";
    scheduleEl.textContent = dataObj.col2Schedule || "Занятия проводятся согласно основному расписанию уроков";
    importantEl.textContent = dataObj.col3Important || "Желаем хорошего дня!";

    if (dataObj.col4Status) {
      customSheetSchoolStatus = dataObj.col4Status;
    }

    if (menuBreakfastEl && dataObj.menuBreakfast) {
      menuBreakfastEl.textContent = dataObj.menuBreakfast;
    }
    if (menuLunchEl && dataObj.menuLunch) {
      menuLunchEl.textContent = dataObj.menuLunch;
    }
    if (menuNoteEl && dataObj.menuNote) {
      menuNoteEl.textContent = dataObj.menuNote;
    }

    // Обновляем карточки учителей из столбцов F–J (если они заполнены в таблице)
    if (Array.isArray(dataObj.teachers) && dataObj.teachers.length > 0) {
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
    if (statusEl) {
      statusEl.textContent = "Синхронизация...";
    }

    try {
      const urlWithNoCache = `${SHEET_CSV_URL}&_t=${Date.now()}`;
      const response = await fetch(urlWithNoCache, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`HTTP ошибка: ${response.status}`);
      }

      const csvText = await response.text();
      const rows = parseCSVPreserveRowIndex(csvText);

      // СТРОКА 2 (индекс 1): Живая информация (A2:D2)
      const secondRow = rows.length > 1 ? rows[1] : [];
      // СТРОКА 3 (индекс 2): Меню столовой (A3:C3)
      const thirdRow = rows.length > 2 ? rows[2] : [];

      // СТРОКИ 2–13 (индексы 1..12), СТОЛБЦЫ F, G, H, I, J (индексы 5, 6, 7, 8, 9): 12 карточек учителей
      const teachersList = [];
      for (let rIdx = 1; rIdx <= 12; rIdx++) {
        const r = rows[rIdx] || [];
        const rawPhoto = (r[5] || "").trim(); // Столбец F
        const badge = sanitizeInput(r[6] || "", 100); // Столбец G
        const fio = sanitizeInput(r[7] || "", 120); // Столбец H
        const role = sanitizeInput(r[8] || "", 160); // Столбец I
        const desc = sanitizeInput(r[9] || "", 450); // Столбец J

        if (rawPhoto || badge || fio || role || desc) {
          teachersList[rIdx - 1] = {
            photo: rawPhoto,
            badge,
            fio,
            role,
            desc
          };
        } else {
          teachersList[rIdx - 1] = null;
        }
      }

      const nowLabel = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

      const parsedData = {
        col1News: sanitizeInput(secondRow[0] || "", 600),
        col2Schedule: sanitizeInput(secondRow[1] || "", 600),
        col3Important: sanitizeInput(secondRow[2] || "", 600),
        col4Status: sanitizeInput(secondRow[3] || "", 120),
        menuBreakfast: sanitizeInput(thirdRow[0] || "", 350),
        menuLunch: sanitizeInput(thirdRow[1] || "", 350),
        menuNote: sanitizeInput(thirdRow[2] || "", 350),
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
        scheduleEl.textContent = "Информация обновляется";
        importantEl.textContent = "Информация обновляется";
        if (statusEl) statusEl.textContent = "Информация обновляется";
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
   5. ПЕРЕКЛЮЧАТЕЛЬ 4 ВКЛАДОК ЦИФРОВОГО НАВИГАТОРА (ГОСУСЛУГИ, ДНЕВНИК, УЧИ.РУ)
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

/* ==========================================================================
   6. ФОРМА ОБРАТНОЙ СВЯЗИ С ВЫБОРОМ ТЕМЫ (БЛАГОДАРНОСТЬ / ИДЕЯ / ВОПРОС)
   ========================================================================== */
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
    if (topicParam === "thanks" && topicChips[1]) {
      topicChips[1].click();
    } else if (topicParam === "idea" && topicChips[2]) {
      topicChips[2].click();
    } else if (topicParam === "question" && topicChips[0]) {
      topicChips[0].click();
    }
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

    if (!isConsentConfirmed || formFieldset.disabled) {
      return;
    }

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
   7. ПЛАВНОЕ ПОЯВЛЕНИЕ, СЧЕТЧИКИ, ФИЛЬТР ПЕДАГОГОВ И SERVICE WORKER
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
