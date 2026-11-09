/**
 * Основной скрипт сайта Ямбирнского филиала МОУ «Лесно-Конобеевская СШ»
 * Чистый Vanilla JS (ES6+), без внешних библиотек. Подключается с атрибутом defer.
 */

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1w6Z_wfOYJVKxtMHhz9ut6euiLY3YtkkOGNj1Wd_Pr0yJTdmKruN19uZYEyXpLZQSQPQgGHH9i84a/pub?output=csv";
const FEEDBACK_POST_URL = "https://script.google.com/macros/s/AKfycbzCzPpC8lYIeG_GkCYJKTJAhXjM4Ti0vO_9njDpi7lPdC1Rr2Ue8REEE38Tv_dou3X1Kg/exec";
const A11Y_STORAGE_KEY = "yambirno_visually_impaired";

/**
 * Санитизация пользовательского ввода (Защита от XSS-инъекций и опасных URI)
 * Вырезает HTML-теги, опасные спецсимволы и нормализует пробелы.
 */
function sanitizeInput(rawString, maxLength = 1000) {
  if (typeof rawString !== "string") return "";
  return rawString
    .replace(/<[^>]*>?/gm, "") // Удаляем любые HTML-теги
    .replace(/javascript:|data:|vbscript:/gi, "") // Блокируем выполнение URI-скриптов
    .replace(/[<>"'`\\]/g, "") // Удаляем спецсимволы для предотвращения инъекций атрибутов
    .trim()
    .slice(0, maxLength);
}

document.addEventListener("DOMContentLoaded", () => {
  initAccessibilityMode();
  initScrollRevealAndCounters();
  initTeacherFilter();
  initLiveSheetWidget();
  initFeedbackForm();
});

/* ==========================================================================
   1. ДОСТУПНОСТЬ (A11Y) И ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ
   ========================================================================== */
function initAccessibilityMode() {
  const toggleBtn = document.getElementById("a11y-toggle");
  if (!toggleBtn) return;

  const applyMode = (isEnabled) => {
    document.body.classList.toggle("visually-impaired", isEnabled);
    toggleBtn.setAttribute("aria-pressed", String(isEnabled));
    // Атрибут aria-label всегда остается "Версия для слабовидящих" по стандарту A11y
    toggleBtn.setAttribute("aria-label", "Версия для слабовидящих");

    const textSpan = toggleBtn.querySelector(".a11y-btn-text");
    if (textSpan) {
      textSpan.textContent = isEnabled ? "Обычная версия сайта" : "Версия для слабовидящих";
    }
  };

  let savedState = false;
  try {
    savedState = localStorage.getItem(A11Y_STORAGE_KEY) === "true";
  } catch (_) {
    savedState = false;
  }

  applyMode(savedState);

  toggleBtn.addEventListener("click", () => {
    const nextState = !document.body.classList.contains("visually-impaired");
    applyMode(nextState);
    try {
      localStorage.setItem(A11Y_STORAGE_KEY, String(nextState));
    } catch (_) {
      // Игнорируем ошибку, если localStorage заблокирован политикой браузера
    }
  });
}

/* ==========================================================================
   2. ИНТЕГРАЦИЯ С GOOGLE SHEETS (ВИДЖЕТ "ЖИВАЯ ИНФОРМАЦИЯ")
   ========================================================================== */
function initLiveSheetWidget() {
  const newsEl = document.getElementById("col-news");
  const scheduleEl = document.getElementById("col-schedule");
  const importantEl = document.getElementById("col-important");
  const refreshBtn = document.getElementById("refresh-sheet-btn");
  const statusEl = document.getElementById("widget-status");

  if (!newsEl || !scheduleEl || !importantEl) return;

  const parseCSV = (csvText) => {
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
        if (currentRow.some((cell) => cell !== "")) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = "";
      } else {
        currentCell += char;
      }
    }

    if (currentCell.length > 0 || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some((cell) => cell !== "")) {
        rows.push(currentRow);
      }
    }
    return rows;
  };

  const loadSheetData = async () => {
    if (refreshBtn) {
      refreshBtn.classList.add("loading");
      refreshBtn.disabled = true;
    }
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
      const rows = parseCSV(csvText);

      if (!rows || rows.length === 0) {
        throw new Error("Пустой ответ CSV");
      }

      const firstRowJoined = rows[0].join(" ").toLowerCase();
      const hasHeader =
        rows.length > 1 &&
        (firstRowJoined.includes("новост") ||
          firstRowJoined.includes("расписан") ||
          firstRowJoined.includes("важн"));

      const dataRows = hasHeader ? rows.slice(1) : rows;

      const col1Values = dataRows.map((r) => sanitizeInput(r[0] || "", 500)).filter(Boolean);
      const col2Values = dataRows.map((r) => sanitizeInput(r[1] || "", 500)).filter(Boolean);
      const col3Values = dataRows.map((r) => sanitizeInput(r[2] || "", 500)).filter(Boolean);

      // Использование textContent гарантирует защиту от XSS при выводе данных из таблицы
      newsEl.textContent = col1Values.length > 0 ? col1Values.join("\n") : "Нет новых объявлений";
      scheduleEl.textContent = col2Values.length > 0 ? col2Values.join("\n") : "Расписание по стандарту";
      importantEl.textContent = col3Values.length > 0 ? col3Values.join("\n") : "Желаем хорошего дня!";

      if (statusEl) {
        const now = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
        statusEl.textContent = `Актуально на ${now}`;
      }
    } catch (_) {
      newsEl.textContent = "Информация обновляется";
      scheduleEl.textContent = "Информация обновляется";
      importantEl.textContent = "Информация обновляется";
      if (statusEl) {
        statusEl.textContent = "Информация обновляется";
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
   3. ДВУХЭТАПНАЯ ФОРМА ОБРАТНОЙ СВЯЗИ, ЗАЩИТА XSS И 152-ФЗ
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

  // Приватный флаг согласия 152-ФЗ (до клика форма заблокирована физически и программно)
  let isConsentConfirmed = false;
  formFieldset.disabled = true;
  submitBtn.disabled = true;

  // Переход с Этапа 1 на Этап 2 только после явного клика пользователя
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

  // Валидация ФИО: только буквы и пробелы, минимум 2 слова
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

  // Валидация Контакта: телефон или Email
  const validateContact = () => {
    const cleanVal = sanitizeInput(contactInput.value, 100);
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

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

  // Валидация текста обращения
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

  // Отправка формы
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Жесткая блокировка отправки, если согласие 152-ФЗ не было подтверждено
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

    // Санитизация всех значений перед формированием пакета для отправки
    const sanitizedFio = sanitizeInput(fioInput.value, 120).replace(/\s+/g, " ");
    const sanitizedContact = sanitizeInput(contactInput.value, 100);
    const sanitizedComment = sanitizeInput(commentInput.value, 2000);

    submitBtn.disabled = true;
    submitBtnText.textContent = "Отправка обращения...";
    submitLoader.classList.remove("hidden");

    const payload = {
      fio: sanitizedFio,
      contact: sanitizedContact,
      comment: sanitizedComment,
      consent152FZ: true,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch(FEEDBACK_POST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok && response.type !== "opaque") {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      formResponse.textContent = "Спасибо! Ваше обращение успешно отправлено в администрацию школы.";
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
      submitBtnText.textContent = "Отправить";
      submitLoader.classList.add("hidden");
    }
  });
}

/* ==========================================================================
   4. ПЛАВНОЕ ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ, СЧЕТЧИКИ И ФИЛЬТР ПЕДАГОГОВ
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
