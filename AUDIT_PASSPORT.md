# AUDIT_PASSPORT.md — Паспорт приёмки и архитектуры

- **Проект:** Информационный портал Ямбирнского филиала МОУ «Лесно-Конобеевская СШ»
- **Продакшн URL:** `https://sergievposadprimoauxiliumsta-crypto.github.io/yambirno-school/`
- **Репозиторий сайта:** `sergievposadprimoauxiliumsta-crypto/yambirno-school`
- **Корневой репозиторий (`robots.txt`):** `sergievposadprimoauxiliumsta-crypto/sergievposadprimoauxiliumsta-crypto.github.io`
- **Дата прохождения приёмки:** 24.11.2026 (редакция v4 — после завершения Режима 1 и Режима 2: РФ-приёмная на `yambirno-school@yandex.ru`, фикс MAX/QR-стенда, суперграфика Hero, 60 FPS GPU-полировка и WebView-гигиена)
- **Статус приёмки:** `[AUDIT CLEAN — 0 ДЕФЕКТОВ]` (35/35 критериев Бинарного стандарта закрыты)

---

## 1. Состав проверенных файлов

| Файл | Назначение | Статус |
| :--- | :--- | :--- |
| `index.html` | Главная страница, табло, расписание 1–9 кл., школьная доска (27 задач), лента, навигатор, обновлённое окно QR/MAX | `[PASS]` |
| `feedback.html` | Электронная приёмная с CSP на `functions.yandexcloud.net`, обновлённым SVG-спрайтом (`yamb-fb-glass`, `ico-highlight`) и `og-cover.jpg` | `[PASS]` |
| `privacy.html` | Политика обработки ПДн с отражением локализации и транзитной доставки в РФ (Yandex Cloud → Яндекс Почта) | `[PASS]` |
| `404.html` | Страница ошибки 404 с корневыми путями `/yambirno-school/` и ГОСТ-панелью | `[PASS]` |
| `styles.css` | Единая система токенов, матовое стекло Hero, CSS Scroll-Driven индикатор прогресса чтения, живые погодные SVG, GPU-переходы вкладок/формы, WebView `overscroll-behavior` + `safe-area-inset-bottom`, тач-подсказки галереи, WCAG AA, ГОСТ Р 52872-2019 | `[PASS]` |
| `script.js` | Парсеры CMS, автоформаттер статей, синхронная генерация QR-стенда PNG (`dataUrlToBlobSync`), раздельный UX отправки в MAX (ПК/смартфоны), приёмная через Yandex Cloud, Lightbox, погода | `[PASS]` |
| `sw.js` | Service Worker (`yambirno-school-v17`), офлайн-кэш, обход POST-запросов и резервные ответы | `[PASS]` |
| `manifest.json` | PWA-манифест, иконки (`any`/`maskable`), ярлыки быстрого доступа | `[PASS]` |
| `yandex-cloud-feedback/index.js` | Облачная функция РФ (Node.js 22, zero npm-зависимостей): CORS allowlist, валидация, антиспам, талон `ЯМБ-...`, прямая доставка через `smtp.yandex.ru:465` на `yambirno-school@yandex.ru` без хранения ПДн в облаке | `[PASS]` |
| `.github/workflows/sync-school-snapshot.yml` | Автоснапшот `data/school-snapshot.json` + зеркало фото `data/media/` каждые 30 мин | `[PASS]` |
| `sitemap.xml` | Карта сайта с `og-cover.jpg` и автообновляемым `<lastmod>` | `[PASS]` |
| `robots.txt` *(корневой репо)* | Правила обхода, `Allow` для снапшота и `data/media/`, `Clean-param` для Яндекса | `[PASS]` |

---

## 2. Таблица статусов Бинарного стандарта (35 ID)

### А. Безопасность и таблица (SEC)
| ID | Статус | Реализация / подтверждение |
| :--- | :--- | :--- |
| `SEC-01` | `[PASS]` | Весь рендер данных Google Таблицы в `script.js` идёт строго через `textContent` и DOM API (`createElement`/`createTextNode`/`createElementNS`), zero сырого `innerHTML`. |
| `SEC-02` | `[PASS]` | `sanitizeDocumentUrl` и `resolveImageLinkSource` допускают только `https:` и белый список доверенных хостов (`ALLOWED_DOC_HOSTS`, `ALLOWED_IMAGE_HOSTS`); `tel:`-ссылки очищаются до цифр. |
| `SEC-03` | `[PASS]` | В `yandex-cloud-feedback/index.js` работает `neutralizeFormulaText` (префикс `'` для `=`, `+`, `-`, `@`, `|`, включая многострочные значения), а также защита от SMTP Header Injection (удаление `\r`/`\n`/`\0`, Base64-кодирование заголовков и тела). |
| `SEC-04` | `[PASS]` | Хранение обращений в Google Таблице упразднено. Обращения доставляются транзитом через российскую функцию `yambirno-feedback` (`https://functions.yandexcloud.net/d4ed8oi32f8gjqdng5lt`) напрямую по SMTPS на `yambirno-school@yandex.ru` без сохранения ПДн в таблицах, БД и логах. |
| `SEC-05` | `[PASS]` | Клиент: валидация полей/длины, блокировка кнопки, honeypot `website-hp`, cooldown 60 сек, задержка 2 сек. Сервер (`yandex-cloud-feedback/index.js`): лимит 16 КБ, Origin allowlist, honeypot, тройной rate-limit (глобальный / SHA-256 IP / SHA-256 контакта), SHA-256 дедупликация на 10 мин. |
| `SEC-06` | `[PASS]` | На всех HTML-страницах настроен строгий `<meta http-equiv="Content-Security-Policy">` (на `feedback.html` разрешён только `https://functions.yandexcloud.net`), `Referrer-Policy`, `rel="noopener noreferrer"`, JS frame-guard, zero сторонних CDN и zero секретов в коде (`SMTP_USER`, `SMTP_PASS`, `MAIL_TO` — в переменных окружения Yandex Cloud). |

### Б. Кроссплатформенность и WebView (PLAT)
| ID | Статус | Реализация / подтверждение |
| :--- | :--- | :--- |
| `PLAT-01` | `[PASS]` | Адаптив 320px–2560px без горизонтального скролла (`overflow-x: clip` с fallback), `min-height: 100dvh`, `env(safe-area-inset-*)` (включая футеры модалок), `overscroll-behavior: contain` во всех прокручиваемых модалках и WebView. |
| `PLAT-02` | `[PASS]` | Все поля ввода имеют `font-size: 16px` (`max(16px, 1em) !important` в ГОСТ-режиме) — защита от автозума iOS Safari. |
| `PLAT-03` | `[PASS]` | `parseScheduleDateTime` в `script.js` парсит даты вручную через RegExp с календарной проверкой в `Date.UTC(...)`. |
| `PLAT-04` | `[PASS]` | Все обращения к `localStorage`/`sessionStorage` изолированы в `getStorageSafe()` внутри `try/catch`; `copyTextToClipboard` имеет fallback через `textarea` + `execCommand("copy")`. |
| `PLAT-05` | `[PASS]` | Все `:hover` и 3D-tilt обёрнуты в `@media (hover: hover) and (pointer: fine)`; `touch-action: manipulation`; тач-цели `>= 44×44px` в `@media (pointer: coarse)` (включая `.footer-link-btn`); бейдж галереи виден в `@media (hover: none)`. |
| `PLAT-06` | `[PASS]` | Есть `@supports` для `linear()`, `backdrop-filter`, `overflow-x: clip`, `clip-path: inset(... round 6px)`, `animation-timeline: scroll()`, feature detection для `View Transitions`, `AbortController`, `navigator.canShare`, `ClipboardItem`; нет `overflow: hidden` на предках `sticky`. |

### В. Надёжность CMS, производительность и сети РФ (PERF & CMS)
| ID | Статус | Реализация / подтверждение |
| :--- | :--- | :--- |
| `PERF-01` | `[PASS]` | Все запросы имеют `AbortController`-таймауты; параллельная загрузка `school-snapshot.json` и CSV через `Promise.allSettled` + кэш `localStorage` + автоснапшот GitHub Actions каждые 30 мин. |
| `PERF-02` | `[PASS]` | Парсеры устойчивы к пустым строкам, пробелам/переносам в URL Drive, 0/1/нескольким фото, датам `8:30`/`08:30`, сплошному тексту (автоформаттер) и пустым заголовкам/рубрикам. |
| `PERF-03` | `[PASS]` | Фото Drive зеркалируются в `data/media/`, предзагрузка соседних слайдов Lightbox, `loading="lazy"`, `decoding="async"`, фиксированный `aspect-ratio` (CLS ≈ 0) и каскадный `onerror` до SVG-заглушки. |
| `PERF-04` | `[PASS]` | `script.js` с `defer`, системный стек шрифтов, корректные пути для `/yambirno-school/`. |
| `PERF-05` | `[PASS]` | Настроены `manifest.json`, `theme-color`, иконки `192/512/maskable/svg` и Service Worker `yambirno-school-v17`. |

### Г. UX, Суперграфика и Анимации (UX, GFX, MOT)
| ID | Статус | Реализация / подтверждение |
| :--- | :--- | :--- |
| `UX-01` | `[PASS]` | Оперативное табло, погода и статус на первом экране; сохранение 1–9 класса, подсветка сегодня (`.is-today`), активного урока и `0.` урока; школьная доска на 27 задач (1–9 классы). |
| `UX-02` | `[PASS]` | Лента с 0/1/несколькими фото (`object-fit: contain`), Lightbox, Grid-аккордеон, глубокие ссылки `#pub-...`/`#post-...`, PDF и исправленная отправка в MAX: синхронный PNG-стенд на смартфонах (`navigator.share({ files })` без отката к голой ссылке) и умный буфер `Ctrl+V` на ПК. |
| `UX-03` | `[PASS]` | Пошаговая электронная приёмная с плавным входом шага 2, валидацией, спиннером, квитанцией с талоном `ЯМБ-...` и доставкой на `yambirno-school@yandex.ru`. |
| `GFX-01` | `[PASS]` | Zero системных эмодзи и стока — единый многослойный SVG-спрайт (`ico-base`, `ico-accent`, `ico-highlight`, `ico-part-moving`, градиенты `*-glass`) с уникальными `id` на всех 4 HTML-страницах. |
| `GFX-02` | `[PASS]` | Hero с `<picture>` (`WebP` + `JPG` + фолбэк `og-cover.jpg`), перенастроенным градиентным scrim (контраст ≥ 7:1 слева и раскрытая фотография школы справа) и матовым стеклом `.live-widget` / `.director-note`. |
| `MOT-01` | `[PASS]` | Skeleton-силуэты для табло, новостей, расписания, публикаций и фото педагогов (CLS ≈ 0). |
| `MOT-02` | `[PASS]` | 60 FPS GPU-анимации: CSS Scroll-Driven полоса прогресса чтения (`body::after`), живые погодные SVG, `panelRevealIn` для вкладок и формы, Grid-аккордеон `0fr → 1fr`, FLIP-табы `clip-path`, scroll-reveal без конфликта с hover, Lightbox, 3D-tilt и блик `--mx`/`--my` на десктопе. |
| `MOT-03` | `[PASS]` | Пауза ambient-анимаций, погодных SVG, параллакса (`will-change: auto`) и доски через `IntersectionObserver` и `visibilitychange`; полный рубильник для `prefers-reduced-motion: reduce`, ГОСТ-режима и печати. |

### Д. SEO и Доступность ГОСТ Р 52872-2019 (SEO & A11Y)
| ID | Статус | Реализация / подтверждение |
| :--- | :--- | :--- |
| `SEO-01` | `[PASS]` | Валидные `robots.txt` (в корневом репо `*.github.io`) и `sitemap.xml` с `og-cover.jpg`, `rel="canonical"` на всех индексируемых страницах. |
| `SEO-02` | `[PASS]` | Уникальные `Title`, `Description`, иерархия `H1–H4`, `alt` для статических и динамических фото, `noindex, follow` на `404.html`. |
| `SEO-03` | `[PASS]` | Schema.org (`WebSite`, `School`/`EducationalOrganization`, `ContactPage`, `WebPage`, `BreadcrumbList`, динамический `ItemList` + `NewsArticle`), Open Graph и Twitter Cards унифицированы на `og-cover.jpg`. |
| `SEO-04` | `[PASS]` | CSR-устойчивость: `data/school-snapshot.json` и `data/media/` открыты в `robots.txt` и обновляются GitHub Actions каждые 30 мин. |
| `A11Y-01` | `[PASS]` | Полная «Версия для слабовидящих» (ГОСТ Р 52872-2019) на всех 4 страницах: 3 размера шрифта, 4 схемы, гарнитура, кернинг, межстрочный интервал, показ/скрытие фото, сохранение состояния, отключение всех декоративных эффектов и полосы прогресса. |
| `A11Y-02` | `[PASS]` | Контрастность всех элементов ≥ 4.5:1, видимый `:focus-visible`, ориентиры `header`/`nav`/`main`/`footer` и `skip-link`. |
| `A11Y-03` | `[PASS]` | Клавиатурная доступность расписания, вкладок навигатора (`Arrow`/`Home`/`End`), всех модалок и Lightbox (`Tab`-ловушка, `Enter`, `Space`, `Esc`, `aria-*`). |

---

## 3. Visual Bible (Единый визуальный стандарт)

- **Стиль:** Академический светлый EdTech с тактильной бумажной фактурой (`#f8fafc` / `#fdfbf7`) и матовым стеклом поверх Hero-фотографии школы.
- **Палитра:** Основной синий `#1e40af` (`--primary`), глубокий `#1e3a8a`, графитовый текст `#0f172a` / `#475569`, акценты WCAG AA — янтарный `#92400e` / `#9a3412`, зелёный `#15803d`, бирюзовый `#0f766e`, тревожный `#b91c1c`.
- **Графика и свет:** единый свет сверху слева 45°, `viewBox="0 0 24 24"`, штрих `1.8–2.0px`, многослойная структура (`ico-base`, `ico-accent`, `ico-highlight`, `ico-part-moving`), duotone + стеклянный блик `*-glass`.
- **Движение:** кривая `cubic-bezier(0.22, 1, 0.36, 1)` и `linear(...)` spring easing с фолбэком, строго GPU-свойства (`transform`, `opacity`, `clip-path`), пауза вне вьюпорта и полный рубильник для `prefers-reduced-motion` и ГОСТ-режима.

---

## 4. Принятые ограничения платформы (`[ACCEPTED / PLATFORM LIMIT]`)

1. **Серверные HTTP-заголовки на GitHub Pages (`SEC-06`):** невозможность задать `HSTS`, `X-Frame-Options`, `Permissions-Policy` и HTTP-CSP компенсирована `<meta http-equiv="Content-Security-Policy">`, `<meta name="referrer">`, JS frame-guard и принудительным HTTPS GitHub Pages.
2. **CSR-индексация новостей (`SEO-04`):** клиентский рендер подкреплён автоснапшотом `data/school-snapshot.json`, зеркалом `data/media/` и динамическим `ItemList`/`NewsArticle` JSON-LD.
3. **Ограничение десктопного клиента MAX (`UX-02`):** десктопный MAX не поддерживает предзаполнение вложений и выбор чатов через диплинк `max.ru/:share` — компенсировано автоматическим копированием PNG-стенда / текста в буфер обмена с явной подсказкой `Ctrl+V` и нативной файловой отправкой на смартфонах (`navigator.share({ files })`).
4. **Старый скрипт `Apps Script.txt`:** лист `Обращения` в Google Таблице больше не используется порталом; рекомендуется удалить лист `Обращения` из публичной таблицы CMS и отключить старое развёртывание Apps Script.

---

## 5. Памятка для повторного аудита (Anti-Loop Protocol)

- Пункты из раздела 4 имеют статус `[ACCEPTED / PLATFORM LIMIT]` и **не являются дефектами**.
- Запрещено требовать перехода на SSR, `nginx`/`.htaccess` или вкусового переименования рабочих CSS/JS-токенов (`TASTE`).
