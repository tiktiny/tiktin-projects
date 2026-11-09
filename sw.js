// PROJECTS – דף האפליקציה נטען תמיד מהרשת (גרסה עדכנית), המטמון משמש רק כשאין חיבור (גרסה 0.34)
const C='projects-0.34';
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(C).then(c=>c.addAll(['./','manifest.webmanifest','logo.png','icon-192.png','icon-512.png']).catch(()=>{}))); });
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('projects-')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{ const u=new URL(e.request.url); if(e.request.method!=='GET'||u.origin!==location.origin) return;
  const page = e.request.mode==='navigate' || u.pathname.endsWith('/') || u.pathname.endsWith('.html');
  if(page){   // דף האפליקציה: קודם רשת, ורק בלי חיבור – מהמטמון
    e.respondWith(fetch(e.request).then(r=>{ if(r.ok){ const cp=r.clone(); caches.open(C).then(c=>c.put('./',cp)); } return r; })
      .catch(()=>caches.open(C).then(c=>c.match('./')).then(h=>h||Response.error())));
    return; }
  e.respondWith(caches.open(C).then(async c=>{ const hit=await c.match(e.request,{ignoreSearch:true});
    const net=fetch(e.request).then(r=>{ if(r.ok) c.put(e.request,r.clone()); return r; }).catch(()=>hit||Response.error());
    return hit||net; })); });
