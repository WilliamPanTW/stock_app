self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open('v2').then(c => c.addAll(['./', 'index.html'])));
});
self.addEventListener('activate', e =>
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== 'v2').map(k => caches.delete(k))))
    .then(() => self.clients.claim()))
);
// Network first so updates show up; fall back to cache when offline
self.addEventListener('fetch', e =>
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))
);
// Tapping a notification opens/focuses the app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' })
    .then(list => list.length ? list[0].focus() : clients.openWindow('./')));
});
