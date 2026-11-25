const CACHE_NAME = "yambirno-school-v19";
const NETWORK_TIMEOUT_MS = 4000;
const SNAPSHOT_TIMEOUT_MS = 4500;

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./feedback.html",
  "./gfx-engine.js",
  "./tokens.css",
  "./styles.css",
  "./motion.css",
  "./script.js",
  "./motion.js"
];

const OPTIONAL_ASSETS = [
  "./privacy.html",
  "./404.html",
  "./manifest.json",
  "./data/school-snapshot.json",
  "./og-cover.jpg",
  "./icon.svg",
  "./assets/img/emblem-header-128.webp",
  "./assets/img/emblem-header-128.png",
  "./assets/img/icon-192.png",
  "./assets/img/icon-512.png",
  "./assets/img/icon-maskable-512.png",
  "./assets/img/qr-school.svg",
  "./assets/img/apple-touch-icon.png",
  "./assets/img/hero-school-1280.webp",
  "./assets/img/hero-school-1280.jpg"
];

const STATIC_ASSET_REGEX = /\.(css|js|json|png|jpe?g|webp|avif|gif|svg|ico|woff2?)$/i;
const SNAPSHOT_PATH_SUFFIX = "/data/school-snapshot.json";

function isCacheableResponse(response) {
  return Boolean(
    response &&
    response.status === 200 &&
    response.type === "basic" &&
    !response.redirected
  );
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

async function precacheFreshAsset(cache, assetUrl) {
  const freshRequest = new Request(assetUrl, { cache: "reload" });
  const response = await fetch(freshRequest);
  if (isCacheableResponse(response)) {
    await cache.put(assetUrl, response);
    return true;
  }
  return false;
}

function buildOfflineHtmlResponse() {
  const html =
    '<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Нет подключения к интернету — Школа с. Ямбирно</title></head>' +
    '<body><main><h1>Нет подключения к интернету</h1>' +
    '<p>Пожалуйста, проверьте соединение и обновите страницу. ' +
    'Приёмная Ямбирнского филиала: <a href="tel:+74914726368">8 (49147) 2-63-68</a>.</p>' +
    '<p><a href="./">Повторить загрузку</a></p></main></body></html>';

  return new Response(html, {
    status: 503,
    statusText: "Service Unavailable",
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async (cache) => {
        await Promise.all(
          ASSETS_TO_CACHE.map(async (assetUrl) => {
            const ok = await precacheFreshAsset(cache, assetUrl);
            if (!ok) {
              await cache.add(assetUrl);
            }
          })
        );

        await Promise.allSettled(
          OPTIONAL_ASSETS.map((assetUrl) => precacheFreshAsset(cache, assetUrl))
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event && event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  let requestUrl;
  try {
    requestUrl = new URL(event.request.url);
  } catch (_) {
    return;
  }

  if (requestUrl.origin !== self.location.origin) return;
  if (requestUrl.pathname.endsWith("/sw.js")) return;

  if (requestUrl.pathname.endsWith(SNAPSHOT_PATH_SUFFIX)) {
    let cacheWritePromise = Promise.resolve();
    const responsePromise = fetchWithTimeout(event.request, SNAPSHOT_TIMEOUT_MS)
      .then((networkResponse) => {
        if (isCacheableResponse(networkResponse)) {
          cacheWritePromise = putInCacheSafe(event.request, networkResponse);
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedSnapshot =
          (await caches.match(event.request, { ignoreSearch: true })) ||
          (await caches.match("./data/school-snapshot.json"));
        if (cachedSnapshot) return cachedSnapshot;

        return new Response(JSON.stringify({ ok: false, offline: true }), {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "application/json; charset=utf-8" }
        });
      });

    event.respondWith(responsePromise);
    event.waitUntil(responsePromise.then(() => cacheWritePromise, () => {}));
    return;
  }

  const isNavigation =
    event.request.mode === "navigate" ||
    (event.request.headers.get("accept") || "").includes("text/html");

  if (!isNavigation && STATIC_ASSET_REGEX.test(requestUrl.pathname)) {
    let cacheWritePromise = Promise.resolve();
    const networkUpdate = fetch(event.request)
      .then((networkResponse) => {
        if (isCacheableResponse(networkResponse)) {
          cacheWritePromise = putInCacheSafe(event.request, networkResponse);
        }
        return networkResponse;
      })
      .catch(() => null);

    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
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
    event.waitUntil(networkUpdate.then(() => cacheWritePromise));
    return;
  }

  let cacheWritePromise = Promise.resolve();
  const responsePromise = fetchWithTimeout(event.request, NETWORK_TIMEOUT_MS)
    .then((networkResponse) => {
      if (isCacheableResponse(networkResponse)) {
        cacheWritePromise = putInCacheSafe(event.request, networkResponse);
      }
      return networkResponse;
    })
    .catch(async () => {
      const cachedExact = await caches.match(event.request);
      if (cachedExact) return cachedExact;

      const cachedIgnoreSearch = await caches.match(event.request, { ignoreSearch: true });
      if (cachedIgnoreSearch) return cachedIgnoreSearch;

      if (isNavigation) {
        const fallbackIndex = await caches.match("./index.html");
        if (fallbackIndex) return fallbackIndex;
        return buildOfflineHtmlResponse();
      }

      return new Response(
        "Нет подключения к интернету. Пожалуйста, проверьте сеть и обновите страницу.",
        {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        }
      );
    });

  event.respondWith(responsePromise);
  event.waitUntil(responsePromise.then(() => cacheWritePromise, () => {}));
});
