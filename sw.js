/* Maçonnerie DMD — service worker.
   But : l'application s'ouvre même sans réseau sur le chantier, sans jamais
   rester bloquée sur une vieille version quand le réseau est là.

   Deux comportements seulement :
   • la page de l'app  -> RÉSEAU D'ABORD, cache en secours ;
   • icônes, polices, prévention -> CACHE D'ABORD, rafraîchi en arrière-plan.

   Rien d'autre n'est intercepté : les appels à Supabase passent toujours
   directement au réseau, pour ne jamais servir de données périmées.
*/
const CACHE = 'dmd-v2';

// Réseau lent = pas réseau. Sur un chantier, une requête peut « pendre » une
// minute avant d'échouer : pendant ce temps l'app restait sur son écran de
// chargement alors qu'une copie parfaitement bonne dormait dans le cache.
// Passé ce délai, on sert le cache et on laisse le réseau finir en arrière-plan.
const DELAI_RESEAU = 4000;

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

// Attention : « toute navigation » serait faux. Les anciennes pages autonomes
// (index.html, APPLI__*.html) sont toujours en ligne à la racine, et un vieux favori,
// un QR code imprimé ou un lien de courriel y mène encore. Comme la réponse était
// ensuite rangée sous /DMD.html, une seule visite suffisait à remplacer la copie
// hors ligne de l'application par une page sans grille de tuiles — et l'ouvrier
// arrivé sur un chantier sans réception n'avait plus aucun moyen d'en sortir.
// On ne retient donc que la page de l'app elle-même et la racine, qui y redirige.
function estPageApp(req) {
  const u = new URL(req.url);
  if (u.origin !== self.location.origin) return false;
  return u.pathname === '/DMD.html' || (req.mode === 'navigate' && u.pathname === '/');
}

self.addEventListener('fetch', e => {
  const req = e.request;

  // On ne touche qu'aux lectures. Les écritures (Supabase) passent tout droit.
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Jamais de cache pour la base de données ni l'authentification.
  if (/supabase\.(co|in)$/.test(url.hostname)) return;

  // --- La page de l'app : réseau d'abord, mais pas indéfiniment ---
  if (estPageApp(req)) {
    e.respondWith((async () => {
      // Le réseau est lancé tout de suite et met toujours le cache à jour,
      // même s'il répond après qu'on ait déjà servi la copie locale.
      const reseau = fetch(req)
        .then(rep => {
          // Second garde-fou : on ne range sous /DMD.html que ce qui EST /DMD.html
          // une fois les redirections suivies (la racine y mène). La clé de cache
          // est écrite en dur ; sans cette vérification, n'importe quelle autre
          // réponse viendrait prendre la place de l'application dans le cache.
          if (rep && rep.ok && rep.url && new URL(rep.url).pathname === '/DMD.html') {
            const copie = rep.clone();
            caches.open(CACHE).then(c => c.put('/DMD.html', copie)).catch(() => {});
          }
          return rep;
        })
        .catch(() => null);

      const attente = new Promise(r => setTimeout(() => r('__lent'), DELAI_RESEAU));
      const premier = await Promise.race([reseau, attente]);
      if (premier && premier !== '__lent') return premier;

      // Réseau trop lent ou en panne : on sert la copie en cache s'il y en a une.
      const cache = await caches.match('/DMD.html');
      if (cache) return cache;

      // Pas de copie locale : il ne reste qu'à attendre le réseau.
      return (await reseau) || Response.error();
    })());
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
        // Hors ligne : on garde ce qu'on a. S'il n'y a rien en cache, il faut quand
        // même rendre une vraie réponse : respondWith() reçoit sinon « undefined »
        // et lève une erreur dans le service worker au lieu d'un simple échec réseau.
        .catch(() => cache || Response.error());
      return cache || reseau;
    })
  );
});
