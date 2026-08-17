/* Maçonnerie DMD — service worker.
   But : l'application s'ouvre même sans réseau sur le chantier, sans jamais
   rester bloquée sur une vieille version quand le réseau est là.

   Deux comportements seulement :
   • la page de l'app  -> RÉSEAU D'ABORD, cache en secours ;
   • icônes, polices, prévention -> CACHE D'ABORD, rafraîchi en arrière-plan.

   Rien d'autre n'est intercepté : les appels à Supabase passent toujours
   directement au réseau, pour ne jamais servir de données périmées.
*/
const CACHE = 'dmd-v1';

// Le strict minimum pour que l'app démarre hors ligne.
const ESSENTIEL = [
  '/DMD.html',
  '/manifest.webmanifest',
  '/icones/dmd-192.png',
  '/icones/dmd-512.png',
  '/icones/dmd-512-maskable.png',
  '/icones/dmd-apple-180.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      // addAll échoue en bloc si UN fichier manque : on les ajoute un par un.
      .then(c => Promise.all(ESSENTIEL.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(noms => Promise.all(noms.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Permet à la page de forcer l'activation d'une nouvelle version.
self.addEventListener('message', e => {
  if (e.data === 'dmd-maj') self.skipWaiting();
});

function estPageApp(req) {
  if (req.mode === 'navigate') return true;
  const u = new URL(req.url);
  return u.origin === self.location.origin && u.pathname === '/DMD.html';
}

self.addEventListener('fetch', e => {
  const req = e.request;

  // On ne touche qu'aux lectures. Les écritures (Supabase) passent tout droit.
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Jamais de cache pour la base de données ni l'authentification.
  if (/supabase\.(co|in)$/.test(url.hostname)) return;

  // --- La page de l'app : réseau d'abord ---
  if (estPageApp(req)) {
    e.respondWith(
      fetch(req)
        .then(rep => {
          if (rep && rep.ok) {
            const copie = rep.clone();
            caches.open(CACHE).then(c => c.put('/DMD.html', copie)).catch(() => {});
          }
          return rep;
        })
        .catch(() => caches.match('/DMD.html').then(r => r || Response.error()))
    );
    return;
  }

  // --- Le reste (icônes, polices, dossier prevention/) : cache d'abord ---
  e.respondWith(
    caches.match(req).then(cache => {
      const reseau = fetch(req)
        .then(rep => {
          // On ne met en cache que ce qui a vraiment répondu, et pas les
          // réponses opaques (CDN sans CORS) dont on ignore le statut réel.
          if (rep && rep.ok && rep.type !== 'opaque') {
            const copie = rep.clone();
            caches.open(CACHE).then(c => c.put(req, copie)).catch(() => {});
          }
          return rep;
        })
        .catch(() => cache);            // hors ligne : on garde ce qu'on a
      return cache || reseau;
    })
  );
});
