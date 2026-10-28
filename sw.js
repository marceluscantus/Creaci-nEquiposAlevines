const PREFIX='cuatro-cuartos-'+self.registration.scope;
const CACHE=PREFIX+'v1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||!e.request.url.startsWith(self.registration.scope))return;
 if(e.request.mode==='navigate'){
  e.respondWith(fetch(e.request).then(r=>{if(!r.ok)throw Error();const copy=r.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put('./index.html',copy)));return r}).catch(()=>caches.match('./index.html')));
 }else{e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request)));}
});
