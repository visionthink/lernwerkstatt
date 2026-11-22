const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:820,height:1100}});const ok=(c,m)=>console.log((c?'OK   ':'FEHLER ')+m);const errs=[];p.on('pageerror',e=>errs.push(String(e)));
const url='file://'+require('path').resolve(process.argv[2]||'lernwerkstatt/index.html');
await p.goto(url);await p.evaluate(()=>{S.set='hsu';save()});await p.reload();
ok(await p.evaluate(()=>S.set==='probe'),'Abgeschlossenes Paket wird beim Start durch die nächste Probe ersetzt');
await p.evaluate(()=>{pinOk=true;view='eltern';render()});let t=await p.locator('#main').innerText();ok(!/HSU|Gemeinde|Lese/i.test(t),'Elternbereich ohne abgeschlossene Proben');
await p.click('text=Demo-Modus öffnen');const pk=await p.evaluate(()=>[...document.querySelectorAll('[data-act="dset"]')].map(x=>x.textContent));ok(!pk.some(x=>/HSU|Lese/.test(x))&&pk.includes('Mathe-Probe 25.11.'),'Demo zeigt nur aktuelle Pakete: '+pk.join(', '));
await p.evaluate(()=>{demo=null;view='heute';render()});t=await p.locator('#main').innerText();ok(!/HSU|Leseprobe-Training/.test(t),'Startseite ohne abgeschlossene Pakete');
await p.evaluate(()=>{const h=SETS.hsu.blocks[0].tasks[0].id,m=SETS.probe.blocks[0].tasks[0].id;S.heft=[h,m];view='heft';render()});t=await p.locator('#main').innerText();ok(await p.locator('[data-act="retry"]').count()===1,'Fehlerheft zeigt nur Aufgaben der aktuellen Pakete');
console.log('errors',errs);await b.close()})();
