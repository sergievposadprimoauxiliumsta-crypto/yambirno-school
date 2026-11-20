// Контракт имени кэша и списка обязательных ассетов
const CACHE_NAME = "yambirno-school-v8";
const NETWORK_TIMEOUT_MS = 4000;

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./feedback.html",
  "./styles.css",
  "./script.js"
];

// Дополнительные файлы кэшируются мягко (не ломают install, если ещё не загружены)
const OPTIONAL_ASSETS = [
  "./privacy.html",
  "./manifest.json"
];

const STATIC_ASSET_REGEX = /\.(css|js|json|png|jpe?g|webp|svg|ico|woff2?)$/i;

function isCacheableResponse(response) {
  return Boolean(response && response.status === 200 && response.type === "basic");
}

function fetchWithTimeout(request, timeoutMs) {
  if (typeof AbortController === "undefined") {
    return fetch(request);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(request, { signal: controller.signal }).finally(() => {
    clearTimeout(timeoutId);
  });
}

function putInCacheSafe(request, response) {
  if (!isCacheableResponse(response)) return Promise.resolve();
  const cloned = response.clone();
  return caches
    .open(CACHE_NAME)
    .then((cache) => cache.put(request, cloned))
    .catch(() => {});
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(ASSETS_TO_CACHE);
      await Promise.allSettled(
        OPTIONAL_ASSETS.map(async (assetUrl) => {
          const response = await fetch(assetUrl);
          if (isCacheableResponse(response)) {
            await cache.put(assetUrl, response);
          }
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  let requestUrl;
  try {
    requestUrl = new URL(event.request.url);
  } catch (_) {
    return;
  }

  // Строгая проверка origin (защита от префиксного обхода CWE-20)
  if (requestUrl.origin !== self.location.origin) return;

  // Не перехватываем файл самого Service Worker
  if (requestUrl.pathname.endsWith("/sw.js")) return;

  const isNavigation =
    event.request.mode === "navigate" ||
    (event.request.headers.get("accept") || "").includes("text/html");

  // Для статики (CSS, JS, иконки, манифест): Stale-While-Revalidate
  if (!isNavigation && STATIC_ASSET_REGEX.test(requestUrl.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const networkUpdate = fetch(event.request)
          .then((networkResponse) => {
            if (isCacheableResponse(networkResponse)) {
              event.waitUntil(putInCacheSafe(event.request, networkResponse));
            }
            return networkResponse;
          })
          .catch(() => null);

        if (cachedResponse) {
          return cachedResponse;
        }

        return networkUpdate.then(
          (networkResponse) =>
            networkResponse ||
            new Response("", { status: 504, statusText: "Offline" })
        );
      })
    );
    return;
  }

  // Для HTML-страниц: Network-First с таймаутом 4 сек + офлайн-фоллбэк с ignoreSearch
  event.respondWith(
    fetchWithTimeout(event.request, NETWORK_TIMEOUT_MS)
      .then((networkResponse) => {
        if (isCacheableResponse(networkResponse)) {
          event.waitUntil(putInCacheSafe(event.request, networkResponse));
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedExact = await caches.match(event.request, { ignoreSearch: true });
        if (cachedExact) return cachedExact;

        if (isNavigation) {
          const fallbackIndex = await caches.match("./index.html");
          if (fallbackIndex) return fallbackIndex;
        }

        return new Response(
          "Нет подключения к интернету. Пожалуйста, проверьте сеть и обновите страницу.",
          {
            status: 503,
            statusText: "Service Unavailable",
            headers: { "Content-Type": "text/plain; charset=utf-8" }
          }
        );
      })
  );
});
