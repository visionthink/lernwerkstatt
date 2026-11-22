const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:820,height:1180}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file://'+require('path').resolve(process.argv[2]||'lernwerkstatt/index.html'));
const ok=(c,m)=>console.log((c?'OK   ':'FEHLER ')+m);
await p.evaluate(()=>{useSet('probe');S.heft=[];view='heute';cur=null;render()});
await p.click('button:has-text("Generalprobe")');
let txt=await p.locator('#main').innerText();ok(/Aufgabe 1 von 20/i.test(txt)&&!txt.includes('Tipp holen'),'Generalprobe startet ohne Tipps');
const t1=await p.locator('#gptimer').innerText();await p.waitForTimeout(2100);const t2=await p.locator('#gptimer').innerText();ok(t1!==t2,'Uhr läuft: '+t1+' → '+t2);
if(process.argv[3])await p.screenshot({path:'g1.png'});
// Kopfrechnen-Aufgabe (number) suchen und richtig beantworten
const k=await p.evaluate(()=>gp.slots.findIndex(s=>s.twin.type==='number'));await p.click('[data-act="gpgo"][data-k="'+k+'"]');
const a=await p.evaluate(()=>gp.slots[gp.i].twin.a);await p.fill('input[id^="num-"]',String(a));
ok(await p.locator('[data-act="gpnext"]').isEnabled(),'Weiter bleibt bedienbar');
await p.click('[data-act="gpnext"]');ok(await p.evaluate(k=>gp.i===k+1&&gpHas(gp.slots[k]),k),'Antwort gespeichert, nächste Aufgabe');
await p.click('[data-act="gpgo"][data-k="'+k+'"]');ok((await p.locator('input[id^="num-"]').inputValue())===String(a),'Antwort beim Zurückspringen noch da');
// eine Steps-Aufgabe teilweise falsch
const s=await p.evaluate(()=>gp.slots.findIndex(x=>x.twin.type==='steps'));await p.click('[data-act="gpgo"][data-k="'+s+'"]');await p.locator('.srow input').first().fill('1');
ok(await p.locator('[data-act="gpnext"]').isEnabled(),'Weiter nach halber Eingabe bedienbar');
// Pause: zur Startseite und fortsetzen
await p.click('nav >> text=Heute');txt=await p.locator('#main').innerText();ok(txt.includes('Generalprobe fortsetzen'),'Fortsetzen-Knopf auf Startseite');
await p.click('text=Generalprobe fortsetzen');ok(await p.evaluate(()=>view==='gp'),'Fortgesetzt');
await p.click('[data-act="gpend"]');txt=await p.locator('#main').innerText();ok(txt.includes('Wirklich abgeben?')&&txt.includes('noch ohne Antwort'),'Nachfrage beim Abgeben');
if(process.argv[3])await p.screenshot({path:'g2.png'});
await p.click('text=Ja, abgeben');txt=await p.locator('#main').innerText();
const r=await p.evaluate(()=>gp.end);ok(r&&txt.includes(r.p+' von '+r.max+' Punkten')&&r.p===1,'Ergebnis: '+(r&&r.p)+' Punkte');
ok(await p.evaluate(()=>S.heft.length===18&&S.gp.length>=1),'18 Aufgaben im Fehlerheft (Bonus nicht)');
if(process.argv[3])await p.screenshot({path:'g3.png',fullPage:true});
await p.click('text=Zur Startseite');ok(await p.evaluate(()=>view==='heute'&&gp===null),'zurück zur Startseite');
await p.evaluate(()=>{pinOk=true;view='eltern';render()});txt=await p.locator('#main').innerText();ok(/Generalprobe[\s\S]*1 von [0-9]+ Punkten/i.test(txt),'Ergebnis im Elternbereich');
console.log('errors',errs);await b.close()})();
