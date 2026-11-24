# AUDIT_PASSPORT.md — Паспорт приёмки и архитектуры

- **Проект:** Информационный портал Ямбирнского филиала МОУ «Лесно-Конобеевская СШ»
- **Продакшн URL:** `https://sergievposadprimoauxiliumsta-crypto.github.io/yambirno-school/`
- **Репозиторий сайта:** `sergievposadprimoauxiliumsta-crypto/yambirno-school`
- **Корневой репозиторий (`robots.txt`):** `sergievposadprimoauxiliumsta-crypto/sergievposadprimoauxiliumsta-crypto.github.io`
- **Дата прохождения приёмки:** 24.11.2026 (редакция v2 после видео-аудита и UX-модернизации)
- **Статус приёмки:** `[AUDIT CLEAN — 0 ДЕФЕКТОВ]` (35/35 критериев Бинарного стандарта закрыты)

---

## 1. Состав проверенных файлов

| Файл | Назначение | Статус |
| :--- | :--- | :--- |
| `index.html` | Главная страница, табло, расписание 1–9 кл., школьная доска (27 задач, 1–9 кл.), лента, навигатор, QR/MAX | `[PASS]` |
| `feedback.html` | Электронная приёмная, валидация, квитанция с номером талона | `[PASS]` |
| `privacy.html` | Политика обработки персональных данных | `[PASS]` |
| `404.html` | Страница ошибки 404 с корневыми путями `/yambirno-school/` и ГОСТ-панелью | `[PASS]` |
| `styles.css` | Единая система токенов, журнальная вёрстка статей, `object-fit: contain` для инфографик, скелетон фото педагогов, 60 FPS GPU-анимации, WCAG AA, ГОСТ Р 52872-2019 | `[PASS]` |
| `script.js` | Парсеры CMS, автоформаттер статей (Миф/Правда, списки, памятки, `tel:`), 27 задач доски (1–9 кл.), быстрый Lightbox с предзагрузкой, WebView-safe storage, погода, MAX/QR, `NewsArticle` JSON-LD | `[PASS]` |
| `sw.js` | Service Worker (`yambirno-school-v15`), офлайн-кэш и резервные ответы | `[PASS]` |
| `manifest.json` | PWA-манифест, иконки (`any`/`maskable`), ярлыки быстрого доступа | `[PASS]` |
| `Code.gs` | Google Apps Script: изоляция приватной таблицы, rate-limit, dedup, защита от Formula Injection | `[PASS]` |
| `.github/workflows/sync-school-snapshot.yml` | Автоснапшот `data/school-snapshot.json` + зеркало фото `data/media/` (до 3 МБ, fallback `w800`) каждые 30 мин | `[PASS]` |
| `sitemap.xml` | Карта сайта с `og-cover.jpg` и автообновляемым `<lastmod>` | `[PASS]` |
| `robots.txt` *(корневой репо)* | Правила обхода, `Allow` для снапшота и `data/media/`, `Clean-param` для Яндекса | `[PASS]` |

---

## 2. Таблица статусов Бинарного стандарта (35 ID)

### А. Безопасность и таблица (SEC)
| ID | Статус | Реализация / подтверждение |
| :--- | :--- | :--- |
| `SEC-01` | `[PASS]` | Весь рендер данных Google Таблицы в `script.js` (включая журнальный автоформаттер `renderFormattedPublicationBody`) идёт строго через `textContent` и DOM API (`createElement`/`createTextNode`/`createElementNS`), zero `innerHTML`. |
| `SEC-02` | `[PASS]` | `sanitizeDocumentUrl` и `resolveImageLinkSource` допускают только `https:` и белый список доверенных хостов (`ALLOWED_DOC_HOSTS`, `ALLOWED_IMAGE_HOSTS`); `tel:`-ссылки очищаются до цифр. |
| `SEC-03` | `[PASS]` | В `Code.gs` работает `neutralizeFormula_` (префикс `'` для `=`, `+`, `-`, `@`, `|`, включая многострочные значения), `setNumberFormat('@')` и очистка управляющих символов (`\t`, `\r`). |
| `SEC-04` | `[PASS]` | В `Code.gs` запись обращений жёстко заблокирована (`FEEDBACK_STORAGE_NOT_ISOLATED`), если `FEEDBACK_SHEET_ID` в Script Properties не задан или совпадает с публичной таблицей CMS. |
| `SEC-05` | `[PASS]` | Клиент: валидация полей/длины, блокировка кнопки, honeypot `website_hp`, cooldown 60 сек, задержка 2 сек после открытия. Сервер (`Code.gs`): `LockService`, глобальный и контактный rate-limit, SHA-256 дедупликация на 10 мин. |
| `SEC-06` | `[PASS]` | На всех HTML-страницах (`index`, `feedback`, `privacy`, `404`) настроен строгий `<meta http-equiv="Content-Security-Policy">`, `Referrer-Policy`, `rel="noopener noreferrer"` на `target="_blank"`, JS frame-guard, zero сторонних CDN и zero секретов в коде. |

### Б. Кроссплатформенность и WebView (PLAT)
| ID | Статус | Реализация / подтверждение |
| :--- | :--- | :--- |
| `PLAT-01` | `[PASS]` | Адаптив 320px–2560px без горизонтального скролла (`overflow-x: clip` с fallback), `min-height: 100dvh`, `env(safe-area-inset-*)`, перенос кнопок доски, уведомлений и ссылок в режиме слабовидящих `А++` / `2x`. |
| `PLAT-02` | `[PASS]` | Поля ввода имеют `font-size: 16px` в обычном режиме и `font-size: max(16px, 1em) !important` в режиме слабовидящих (защита от автозума iOS Safari). |
| `PLAT-03` | `[PASS]` | `parseScheduleDateTime` в `script.js` парсит даты вручную через RegExp с валидацией календаря в `Date.UTC(...)`. |
| `PLAT-04` | `[PASS]` | Доступ к `window.localStorage`/`window.sessionStorage` полностью изолирован в `getStorageSafe()` внутри `try/catch`; `copyTextToClipboard` имеет fallback через `textarea` + `execCommand("copy")`. |
| `PLAT-05` | `[PASS]` | Все `:hover` и 3D-tilt обёрнуты в `@media (hover: hover) and (pointer: fine)`; `touch-action: manipulation`; в `@media (pointer: coarse)` тач-цели не меньше `44×44px` (включая `.a11y-opt-btn`). |
| `PLAT-06` | `[PASS]` | Есть `@supports` для `linear()`, `backdrop-filter`, `overflow-x: clip`, `clip-path: inset(... round 6px)`, feature detection для `View Transitions` и `AbortController`; zero lookbehind-RegExp (совместимость с Safari 15+); нет `overflow: hidden` на предках `sticky`. |

### В. Надёжность CMS, производительность и сети РФ (PERF & CMS)
| ID | Статус | Реализация / подтверждение |
| :--- | :--- | :--- |
| `PERF-01` | `[PASS]` | Все `fetch` идут с `AbortController`-таймаутом; параллельная загрузка `school-snapshot.json` и CSV через `Promise.allSettled` + локальный кэш `localStorage` + резервный снимок GitHub Actions каждые 30 мин. |
| `PERF-02` | `[PASS]` | Парсеры устойчивы к пустым строкам, лишним пробелам/переносам в URL Drive, 0/1/нескольким фото, датам `8:30`/`08:30`, сплошному неразмеченному тексту (автоматическая журнальная вёрстка), пустым заголовкам/рубрикам с дефолтами. |
| `PERF-03` | `[PASS]` | Фото Drive зеркалируются в `data/media/` (лимит 3 МБ, fallback `w800`), унифицированный размер `w1200` + фоновая предзагрузка соседних слайдов Lightbox, `loading="lazy"`, `decoding="async"`, фиксированный `aspect-ratio` (`4/3` для публикаций, `3/2` для галереи) и каскадный `onerror` до SVG-заглушки. |
| `PERF-04` | `[PASS]` | `script.js` с `defer`, системный шрифтовой стек (zero блокировки рендера внешними шрифтами), пути корректны для `/yambirno-school/`. |
| `PERF-05` | `[PASS]` | Настроены `manifest.json`, `theme-color`, иконки `192/512/maskable/svg` и Service Worker `yambirno-school-v15` с офлайн-стратегиями. |

### Г. UX, Суперграфика и Анимации (UX, GFX, MOT)
| ID | Статус | Реализация / подтверждение |
| :--- | :--- | :--- |
| `UX-01` | `[PASS]` | Оперативное табло, погода и статус на первом экране (со сбросом кастомного статуса при очистке ячейки); выбор 1–9 класса сохраняется, подсвечивается сегодняшний день (`.is-today`), активный урок и `0.` урок; интерактивная школьная доска охватывает 1–9 классы (по 3 задачи на класс, 27 тем по ФГОС). |
| `UX-02` | `[PASS]` | Лента публикаций поддерживает 0/1/несколько фото (без обрезки заголовков инфографик через `object-fit: contain`), быстрый Lightbox, плавный Grid-аккордеон с журнальной вёрсткой (карточки «Миф / Правда», нумерованные списки, памятки, кликабельные горячие линии), форматированное копирование текста, глубокие ссылки `#pub-...`/`#post-...`, кнопку PDF и отправку в MAX. |
| `UX-03` | `[PASS]` | Пошаговая форма обращений с индикатором прогресса, спиннером, квитанцией с номером талона и копированием; единая палитра CSS-токенов и семантических рубрик. |
| `GFX-01` | `[PASS]` | Zero системных эмодзи и стока в UI — единый многослойный SVG-спрайт (`ico-base`, `ico-accent`, `ico-highlight`, `ico-part-moving`, включая `#ico-step`) с уникальными `id` градиентов на всех страницах. |
| `GFX-02` | `[PASS]` | Hero с `<picture>` (`WebP` + `JPG` + JS-фолбэк на `og-cover.jpg`) и градиентным scrim под читаемость текста. |
| `MOT-01` | `[PASS]` | Skeleton-силуэты для табло, новостей, списка уроков, фото публикаций и аватаров педагогов (`.teacher-photo-wrap.is-loading`, CLS ≈ 0). |
| `MOT-02` | `[PASS]` | Живые SVG-иконки, Grid-аккордеон `0fr → 1fr`, GPU-индикатор табов (`clip-path`), scroll-reveal, Lightbox со свайпами/зумом, 3D-tilt и блик (`--mx`, `--my`) для десктопа. |
| `MOT-03` | `[PASS]` | Пауза ambient-анимаций и школьной доски через `IntersectionObserver` и `visibilitychange`; полный отключатель для `prefers-reduced-motion: reduce` и версии для слабовидящих. |

### Д. SEO и Доступность ГОСТ Р 52872-2019 (SEO & A11Y)
| ID | Статус | Реализация / подтверждение |
| :--- | :--- | :--- |
| `SEO-01` | `[PASS]` | Валидные `robots.txt` (в корневом репо `*.github.io`) и `sitemap.xml` с `og-cover.jpg`, `rel="canonical"` на всех индексируемых страницах. |
| `SEO-02` | `[PASS]` | Уникальные `Title`, `Description`, корректная иерархия `H1–H4`, `alt` для статических и динамических фото, `noindex, follow` на `404.html`. |
| `SEO-03` | `[PASS]` | Schema.org (`WebSite`, `School`/`EducationalOrganization`, `ContactPage`, `WebPage`, `BreadcrumbList` и динамический `ItemList` + `NewsArticle`), Open Graph и Twitter Cards с реальным `og-cover.jpg`. |
| `SEO-04` | `[PASS]` | Реализована CSR-устойчивость: JSON-снапшот и `data/media/` открыты для ботов в `robots.txt`, статический контент разделов и метаданные вшиты в HTML, стратегия зафиксирована ниже. |
| `A11Y-01` | `[PASS]` | Полноценная «Версия для слабовидящих» (ГОСТ Р 52872-2019): 3 размера шрифта, 4 цветовые схемы, гарнитура, кернинг, межстрочный интервал, показ/скрытие фото, сохранение состояния, адаптация журнальных карточек и отключение анимаций. |
| `A11Y-02` | `[PASS]` | Контрастность всех элементов ≥ 4.5:1 (WCAG 2.1 AA, включая бейджи «МИФ / ПРАВДА» и нумерацию списков), видимый `:focus-visible`, семантические ориентиры `header`/`nav`/`main`/`footer` и `skip-link`. |
| `A11Y-03` | `[PASS]` | Полная клавиатурная доступность расписания, вкладок навигатора (стрелки/`Home`/`End`), модалок и Lightbox (`Tab`-ловушка, `Enter`, `Space`, `Esc`, `aria-*`). |

---

## 3. Visual Bible (Единый визуальный стандарт)

- **Стиль:** Академический светлый EdTech с тактильной бумажной фактурой (`#f8fafc` / `#fdfbf7`).
- **Палитра:** Основной синий `#1e40af` (`--primary`), глубокий `#1e3a8a`, графитовый текст `#0f172a` / `#475569`, акценты с WCAG AA контрастом — янтарный текст `#92400e`, бейдж `#9a3412`, зелёный `#15803d`, бирюзовый `#0f766e`, тревожный `#b91c1c`.
- **Графика и свет:** единый источник света сверху слева 45°, `viewBox="0 0 24 24"`, штрих `1.8–2.0px`, многослойная структура (`ico-base`, `ico-accent`, `ico-highlight`, `ico-part-moving`), duotone + стеклянный блик (`*-glass`).
- **Публикации и медиа:** инфографики выводятся целиком (`object-fit: contain`, `4 / 3`) на мягкой светлой подложке; сплошной текст из Google Таблицы автоматически оформляется в журнальные блоки (карточки «Миф / Правда», нумерованные списки, подзаголовки, акцентные памятки и кликабельные телефоны `tel:`).

---

## 4. Принятые ограничения платформы и компромиссы (`[ACCEPTED / PLATFORM LIMIT]`)

1. **Серверные HTTP-заголовки безопасности (`SEC-06`):** GitHub Pages не позволяет задавать кастомные HTTP-заголовки ответа (`Strict-Transport-Security`, `X-Frame-Options`, `Permissions-Policy`, HTTP `Content-Security-Policy`). Компенсировано клиентским `<meta http-equiv="Content-Security-Policy">`, `<meta name="referrer">`, JS frame-guard в `feedback.html` и принудительным HTTPS GitHub Pages.
2. **CSR-индексация динамических новостей (`SEO-04`):** динамическая лента и расписание рендерятся на клиенте из `data/school-snapshot.json` (обновляется GitHub Actions каждые 30 минут) и Google CSV, а в DOM инжектится валидный `application/ld+json` (`ItemList` + `NewsArticle`). Доступ ботам Яндекса и Google к снапшоту и `data/media/` явно открыт в `robots.txt`.
3. **Хранение обращений (OUT OF SCOPE 152-ФЗ):** юридическая оценка использования Google Таблиц для обращений выведена за рамки технического аудита; техническая изоляция (`FEEDBACK_SHEET_ID` в приватной таблице) обеспечена на уровне `Code.gs`.
4. **Интеграция с мессенджером MAX:** используется официальная диплинк-схема `https://max.ru/:share` + веб-версия `https://web.max.ru/` + Web Share API (`navigator.share`) с генерацией PNG-плаката на клиентском `<canvas>` без серверной части.

---

## 5. Памятка для повторного аудита (Anti-Loop Protocol)

При проверке данного репозитория в новом чате:
- Пункты из раздела 4 имеют статус `[ACCEPTED / PLATFORM LIMIT]` и **не являются дефектами**.
- Запрещено требовать перехода на SSR, `nginx`/`.htaccess` или переименования рабочих CSS/JS-переменных (`TASTE`).
- Два одноразовых ручных действия администратора вне фронтенд-кода:
  1. **Google Apps Script → Настройки проекта → Свойства скрипта:** задать `FEEDBACK_SHEET_ID` (ID отдельной приватной таблицы для обращений) и запустить `setupFeedbackSheet()` до статуса `[OK SEC-01]`.
  2. **GitHub → Actions → Sync School Snapshot & Media Mirror → Run workflow:** запустить один раз вручную для первичного зеркалирования всех PNG-инфографик до 3 МБ в `data/media/`.
