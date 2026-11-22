/* AVG Leistungsteam – Service Worker: macht die App offline nutzbar.
   Liegt neben index.html. Bei einem Update der App die Versionsnummer erhöhen. */
const CACHE = 'avg-lt-v2';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html']).catch(() => c.add('./'))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
/* Netz zuerst (Updates kommen sofort an), offline aus dem Speicher */
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')).then(r => r || caches.match('./'))));
});
