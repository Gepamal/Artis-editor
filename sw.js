// Hors ligne : réseau d'abord (toujours la dernière version quand il y a du réseau), sinon la dernière copie gardée.
const C = 'artis-editor';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const net = Promise.race([fetch(e.request, {cache: 'no-store'}), new Promise((_, no) => setTimeout(() => no(new Error('lent')), 4000))]);
  e.respondWith(net.then(r => { if (r.ok) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); } return r; })
    .catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match('./index.html'))));
});
