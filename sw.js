const STATIC_CACHE = 'static-v11';
const DYNAMIC_CACHE = 'dynamic-v11';

const STATIC_ASSETS = [
    './',
    './index.html',
    './css/style.css?v=11',
    './js/script.js?v=7',
    './manifest.json',
    './assets/images/hacker.png',
    './assets/images/Poza%20Profil.jpg',
    './assets/cv/Cristian_Trifan_CV.pdf'
];

const EXTERNAL_RESOURCES = [];

self.addEventListener('install', event => {
    event.waitUntil(precacheAssets());
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    const { request } = event;

    if (request.method !== 'GET') {
        return;
    }

    if (request.destination === 'image') {
        event.respondWith(serveImage(request));
    } else if (request.destination === 'style' || request.destination === 'script') {
        event.respondWith(serveAsset(request));
    } else if (request.destination === 'font') {
        event.respondWith(serveFont(request));
    } else {
        event.respondWith(servePage(request));
    }
});

async function serveImage(request) {
    if (!isCacheableUrl(request.url)) {
        return fetch(request);
    }

    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        return new Response('', { status: 404 });
    }
}

async function serveAsset(request) {
    if (!isCacheableUrl(request.url)) {
        return fetch(request);
    }
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        return new Response('', { status: 404 });
    }
}

async function serveFont(request) {
    if (!isCacheableUrl(request.url)) {
        return fetch(request);
    }
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        return new Response('', { status: 404 });
    }
}

async function servePage(request) {
    if (!isCacheableUrl(request.url)) {
        return fetch(request);
    }
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('', { status: 404 });
    }
}

async function precacheAssets() {
    const staticCache = await caches.open(STATIC_CACHE);

    await Promise.all(
        STATIC_ASSETS.map(asset =>
            staticCache.add(asset).catch(() => {})
        )
    );
}

function isCacheableUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.origin === self.location.origin;
    } catch (error) {
        return false;
    }
}
