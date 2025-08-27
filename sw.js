const CACHE_NAME = 'cristian-portfolio-v3';
const STATIC_CACHE = 'static-v3';
const DYNAMIC_CACHE = 'dynamic-v3';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/script.js',
    '/assets/images/hacker.png',
    '/assets/images/Poza Profil.jpg',
    '/assets/cv/CV-Cristian.pdf'
];

// Do not cache external CDN resources to avoid stale font/CSS
const EXTERNAL_RESOURCES = [];

// Install event - cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                return caches.open(DYNAMIC_CACHE);
            })
            .then(cache => {
                console.log('Caching external resources');
                return cache.addAll(EXTERNAL_RESOURCES);
            })
            .catch(error => {
                console.log('Cache installation failed:', error);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Handle different types of requests
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

// Serve images with cache-first strategy
async function serveImage(request) {
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
        // Return a placeholder if network fails
        return new Response('', { status: 404 });
    }
}

// Serve CSS/JS with cache-first strategy
async function serveAsset(request) {
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

// Serve fonts with cache-first strategy
async function serveFont(request) {
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

// Serve pages with network-first strategy
async function servePage(request) {
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

// Background sync for offline functionality
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Perform any background tasks here
        console.log('Background sync completed');
    } catch (error) {
        console.log('Background sync failed:', error);
    }
}
