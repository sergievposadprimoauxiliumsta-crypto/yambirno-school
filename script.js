/**
 * Основной скрипт сайта Ямбирнского филиала МОУ «Лесно-Конобеевская СШ»
 * Чистый Vanilla JS (ES6+), без внешних библиотек. Подключается с атрибутом defer.
 */

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1w6Z_wfOYJVKxtMHhz9ut6euiLY3YtkkOGNj1Wd_Pr0yJTdmKruN19uZYEyXpLZQSQPQgGHH9i84a/pub?output=csv";
const FEEDBACK_POST_URL = "https://script.google.com/macros/s/AKfycbzCzPpC8lYIeG_GkCYJKTJAhXjM4Ti0vO_9njDpi7lPdC1Rr2Ue8REEE38Tv_dou3X1Kg/exec";
const A11Y_STORAGE_KEY = "yambirno_visually_impaired";
const SHEET_CACHE_KEY = "yambirno_live_sheet_cache_v2";

/**
 * Санитизация пользовательского ввода (Защита от XSS и формульных инъекций в Google Таблицах)
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
   1. ЖИВЫЕ ЧАСЫ, СЕГОДНЯШНЯЯ ДАТА И СТАТУС УЧЕБНОГО ДНЯ
   ========================================================================== */
function initLiveDateTimeClock() {
  const dateEl = document.getElementById("live-date-display");
  const timeEl = document.getElementById("live-time-display");
  const statusEl = document.getElementById("school-day-status");
  const widgetTodayPill = document.getElementById("widget-today-pill");

  const updateClock = () => {
    const now = new Date();

    const dateFormatted = now.toLocaleDateString("ru-RU", {
      weekday: "long",
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

    // Определяем статус школы по дню недели и времени (кроме страницы обратной связи)
    if (statusEl && statusEl.textContent !== "Электронная приёмная 24/7") {
      const day = now.getDay(); // 0 - Вс, 6 - Сб
      const hour = now.getHours();

      if (day === 0 || day === 6) {
        statusEl.textContent = "🏡 Выходной день • Приём обращений онлайн";
      } else if (hour >= 8 && hour < 14) {
        statusEl.textContent = "🟢 Идут учебные занятия (08:00–14:00)";
      } else if (hour >= 14 && hour < 17) {
        statusEl.textContent = "🎨 Внеурочная деятельность и консультации (до 17:00)";
      } else {
        statusEl.textContent = "🌙 Учебный день завершён • Приём обращений 24/7";
      }
    }
  };

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   2. ДОСТУПНОСТЬ (A11Y) И ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ
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
      textSpan.textContent = isEnabled ? "Обычная версия сайта" : "Версия для слабовидящих";
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
   3. ИНТЕГРАЦИЯ С GOOGLE SHEETS:
      - СТРОКА 2 (rows[1]) -> Виджет "Живая информация"
      - СТРОКА 3 (rows[2]) -> Виджет "Меню школьной столовой"
      - Офлайн-кэш в localStorage для сельской местности
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
      void el.offsetWidth; // Перезапуск CSS-анимации
      el.classList.add("flash-updated");
    });

    newsEl.textContent = dataObj.col1News || "На сегодня новых объявлений нет";
    scheduleEl.textContent = dataObj.col2Schedule || "Уроки проводятся по основному расписанию";
    importantEl.textContent = dataObj.col3Important || "Желаем хорошего дня!";

    // Если в 3-й строке таблицы заполнено меню столовой — выводим его
    if (menuBreakfastEl && dataObj.menuBreakfast) menuBreakfastEl.textContent = dataObj.menuBreakfast;
    if (menuLunchEl && dataObj.menuLunch) menuLunchEl.textContent = dataObj.menuLunch;
    if (menuNoteEl && dataObj.menuNote) menuNoteEl.textContent = dataObj.menuNote;

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
      statusEl.textContent = "Обновление данных...";
    }

    try {
      const urlWithNoCache = `${SHEET_CSV_URL}&_t=${Date.now()}`;
      const response = await fetch(urlWithNoCache, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`HTTP ошибка: ${response.status}`);
      }

      const csvText = await response.text();
      const rows = parseCSVPreserveRowIndex(csvText);

      // СТРОКА 2 (индекс 1): Живая информация
      const secondRow = rows.length > 1 ? rows[1] : [];
      // СТРОКА 3 (индекс 2): Меню школьной столовой
      const thirdRow = rows.length > 2 ? rows[2] : [];

      const nowLabel = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

      const parsedData = {
        col1News: sanitizeInput(secondRow[0] || "", 600),
        col2Schedule: sanitizeInput(secondRow[1] || "", 600),
        col3Important: sanitizeInput(secondRow[2] || "", 600),
        menuBreakfast: sanitizeInput(thirdRow[0] || "", 300),
        menuLunch: sanitizeInput(thirdRow[1] || "", 300),
        menuNote: sanitizeInput(thirdRow[2] || "", 300),
        timeLabel: nowLabel
      };

      renderWidgetData(parsedData, false);

      try {
        localStorage.setItem(SHEET_CACHE_KEY, JSON.stringify(parsedData));
      } catch (_) {}
    } catch (_) {
      // При отсутствии интернета пробуем достать последнюю сохраненную копию из памяти
      let cached = null;
      try {
        const rawCache = localStorage.getItem(SHEET_CACHE_KEY);
        if (rawCache) cached = JSON.parse(rawCache);
      } catch (_) {}

      if (cached) {
        renderWidgetData(cached, true);
      } else {
        newsEl.classList.remove("is-loading-shimmer");
        scheduleEl.classList.remove("is-loading-shimmer");
        importantEl.classList.remove("is-loading-shimmer");
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
   4. ПЕРЕКЛЮЧАТЕЛЬ ВКЛАДОК ЦИФРОВОГО НАВИГАТОРА (ДНЕВНИК И УЧИ.РУ)
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
   5. ДВУХЭТАПНАЯ ФОРМА ОБРАТНОЙ СВЯЗИ (ЗАПИСЬ ВСЕХ СТОЛБЦОВ В КОД.GS)
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

  const fioHint = document.getElementById("fio-hint");
  const contactHint = document.getElementById("contact-hint");
  const commentHint = document.getElementById("comment-hint");

  const submitBtn = document.getElementById("submit-btn");
  const submitBtnText = document.getElementById("submit-btn-text");
  const submitLoader = document.getElementById("submit-loader");
  const formResponse = document.getElementById("form-response");

  let isConsentConfirmed = false;
  formFieldset.disabled = true;
  submitBtn.disabled = true;

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
      fioHint.textContent = "Только буквы и пробелы, минимум 2 слова (Фамилия и Имя)";
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
      contactHint.textContent = "Укажите действующий номер телефона или адрес электронной почты";
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
      commentHint.textContent = "✓ Текст обращения заполнен";
      commentHint.className = "field-hint valid-text";
    } else {
      commentHint.textContent = "Пожалуйста, изложите суть вашего вопроса (от 5 до 2000 символов)";
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
    const sanitizedComment = sanitizeInput(commentInput.value, 2000);

    submitBtn.disabled = true;
    submitBtnText.textContent = "Отправка обращения...";
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

      formResponse.textContent = "Спасибо! Ваше обращение успешно записано в реестр школы и передано руководителю филиала.";
      formResponse.className = "form-response success";
      formResponse.classList.remove("hidden");

      form.reset();
      [fioInput, contactInput, commentInput].forEach((el) => {
        el.classList.remove("is-valid", "is-invalid");
      });
    } catch (_) {
      formResponse.textContent = "Не удалось отправить обращение. Проверьте подключение к интернету и попробуйте снова.";
      formResponse.className = "form-response error";
      formResponse.classList.remove("hidden");
    } finally {
      submitBtn.disabled = false;
      submitBtnText.textContent = "Отправить обращение";
      submitLoader.classList.add("hidden");
    }
  });
}

/* ==========================================================================
   6. ПЛАВНОЕ ПОЯВЛЕНИЕ, СЧЕТЧИКИ, ФИЛЬТР ПЕДАГОГОВ И SERVICE WORKER
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
  const teacherCards = document.querySelectorAll(".teacher-card");

  if (filterBtns.length === 0 || teacherCards.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-filter");

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
