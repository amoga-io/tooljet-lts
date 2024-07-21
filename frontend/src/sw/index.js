/* eslint-disable no-restricted-globals */

/* global importScripts */

/* global workbox */

// Import Workbox from a CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.3/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  const { core, precaching, routing, strategies, expiration, cacheableResponse } = workbox;

  // Set custom cache names
  core.setCacheNameDetails({
    prefix: 'canvas',
    suffix: 'v1',
    precache: 'canvas-precache',
    runtime: 'canvas-runtime',
  });

  // Precache and route the files
  precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // Runtime caching for JavaScript files with a Cache-First strategy
  routing.registerRoute(
    ({ request }) => request.destination === 'script',
    new strategies.CacheFirst({
      cacheName: 'js-runtime-cache',
      plugins: [
        new expiration.ExpirationPlugin({
          maxEntries: 50, // Adjust the number of cached JS files
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
        }),
        new cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // Cache CSS files with a Cache-First strategy
  routing.registerRoute(
    ({ request }) => request.destination === 'style',
    new strategies.CacheFirst({
      cacheName: 'css-runtime-cache',
      plugins: [
        new expiration.ExpirationPlugin({
          maxEntries: 50, // Adjust the number of cached CSS files
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
        }),
        new cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // Cache images with a Cache-First strategy and limit the number of cached images
  routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new strategies.CacheFirst({
      cacheName: 'image-cache-v2',
      plugins: [
        new expiration.ExpirationPlugin({
          maxEntries: 60, // Adjust the number of images cached to 60
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
        }),
        new cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // Cache SVG files with a Cache-First strategy and limit the number of cached SVGs
  routing.registerRoute(
    ({ request }) => request.destination === 'image' && request.url.endsWith('.svg'),
    new strategies.CacheFirst({
      cacheName: 'svg-cache-v1',
      plugins: [
        new expiration.ExpirationPlugin({
          maxEntries: 60, // Adjust the number of SVGs cached to 60
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
        }),
        new cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // Whitelist array for API endpoints
  const apiWhitelist = [
    '/api/organization-constants',
    '/api/app-environments/init',
    '/api/metadata',
    '/assets/translations/en.json',
    '/api/config',
    '/api/v2/data_sources',
    '/api/organization-variables',
  ];

  // Cache API responses with a Cache-First strategy
  routing.registerRoute(
    ({ url }) => apiWhitelist.some((endpoint) => url.pathname.startsWith(endpoint)),
    new strategies.CacheFirst({
      cacheName: 'api-cache',
      plugins: [
        new expiration.ExpirationPlugin({
          maxEntries: 50, // Adjust the number of API responses cached to 50
          maxAgeSeconds: 5 * 60, // Cache for 5 minutes
        }),
        new cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // Force the waiting service worker to become the active service worker
  self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
  });

  // Take control of all open clients as soon as the new service worker activates
  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });

  // Handle incoming messages
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
