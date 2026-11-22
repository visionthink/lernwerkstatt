const {chromium}=require('playwright');const fs=require('fs'),path=require('path'),os=require('os');(async()=>{const b=await chromium.launch();const ctx=await b.newContext({acceptDownloads:true,viewport:{width:820,height:1100}});const p=await ctx.newPage();const ok=(c,m)=>console.log((c?'OK   ':'FEHLER ')+m);const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file://'+path.resolve(process.argv[2]||'lernwerkstatt/index.html'));
await p.evaluate(()=>{useSet('probe');const ts=SETS.probe.blocks.flatMap(b=>b.tasks);S.done={};ts.slice(0,12).forEach(t=>S.done[t.id]={solved:'self',tries:1,tips:0});S.heft=[ts[3].id,ts[5].id];S.stamps=[{k:'x',day:1}];S.theme='hell';save();pinOk=true;view='eltern';cur=null;render()});
let txt=await p.locator('#sicherung').innerText();ok(/Noch keine Sicherung/i.test(txt),'Hinweis: noch keine Sicherung');
const [dl]=await Promise.all([p.waitForEvent('download'),p.click('[data-act="bksave"]')]);const f=path.join(os.tmpdir(),dl.suggestedFilename());await dl.saveAs(f);
ok(/^lernwerkstatt-sicherung-[0-9]{4}-[0-9]{2}-[0-9]{2}[.]txt$/.test(dl.suggestedFilename()),'Dateiname '+dl.suggestedFilename());
const j=JSON.parse(fs.readFileSync(f,'utf8'));ok(j.app==='lernwerkstatt'&&Object.keys(j.state.done).length===12&&j.state.heft.length===2,'Sicherung enthält den Lernstand');
await p.evaluate(()=>render());txt=await p.locator('#sicherung').innerText();ok(/Letzte Sicherung/i.test(txt)&&/Downloads/.test(txt),'Meldung und Datum der letzten Sicherung');
// Lernstand verlieren
await p.evaluate(()=>{localStorage.clear()});await p.reload();ok(await p.evaluate(()=>Object.keys(S.done).length===0),'Lernstand gelöscht (simuliert)');
await p.evaluate(()=>{pinOk=true;view='eltern';render()});
// falsche Datei
const bad=path.join(os.tmpdir(),'falsch.json');fs.writeFileSync(bad,'{"hallo":1}');await p.setInputFiles('#bkfile',bad);await p.waitForTimeout(300);txt=await p.locator('#sicherung').innerText();ok(/keine Sicherung der Lernwerkstatt/.test(txt),'falsche Datei wird abgelehnt');
await p.setInputFiles('#bkfile',f);await p.waitForTimeout(300);txt=await p.locator('#sicherung').innerText();ok(/Sicherung laden\?/i.test(txt)&&/12 bearbeitete Aufgaben/.test(txt)&&/wird ersetzt/.test(txt),'Nachfrage mit Inhalt der Sicherung');
await p.click('[data-act="bkno"]');ok(await p.evaluate(()=>Object.keys(S.done).length===0),'Abbrechen ändert nichts');
await p.setInputFiles('#bkfile',f);await p.waitForTimeout(300);await p.click('[data-act="bkyes"]');
ok(await p.evaluate(()=>Object.keys(S.done).length===12&&S.heft.length===2&&S.stamps.length===1),'Lernstand wiederhergestellt');
await p.reload();ok(await p.evaluate(()=>Object.keys(S.done).length===12),'bleibt nach Neustart erhalten');
// Tablet: Teilen-Menü wie Chrome/Samsung auf Android (nur Textdateien erlaubt, JSON nicht)
const p2=await ctx.newPage();p2.on('pageerror',e=>errs.push(String(e)));
await p2.addInitScript(()=>{window.__sh=[];navigator.canShare=d=>!!(d&&d.files&&d.files.every(f=>f.type==='text/plain'&&/[.]txt$/.test(f.name)));navigator.share=d=>{window.__sh.push(d);return window.__shMode==='abort'?Promise.reject(Object.assign(new Error('x'),{name:'AbortError'})):window.__shMode==='fail'?Promise.reject(Object.assign(new Error('x'),{name:'NotAllowedError'})):Promise.resolve()}});
await p2.goto('file://'+path.resolve(process.argv[2]||'lernwerkstatt/index.html'));await p2.evaluate(()=>{S.lastBackup=null;save();pinOk=true;view='eltern';render()});
await p2.click('[data-act="bksave"]');await p2.waitForTimeout(200);
let sh=await p2.evaluate(()=>window.__sh.map(d=>({n:d.files[0].name,t:d.files[0].type})));ok(sh.length===1&&sh[0].t==='text/plain'&&/[.]txt$/.test(sh[0].n),'Tablet: Teilen-Menü öffnet sich mit Textdatei');
txt=await p2.locator('#sicherung').innerText();ok(/Sicherung geteilt/.test(txt)&&/Letzte Sicherung/.test(txt),'Tablet: Meldung nach dem Teilen');
const shared=await p2.evaluate(async()=>await window.__sh[0].files[0].text());ok(JSON.parse(shared).app==='lernwerkstatt','Tablet: geteilte Datei enthält die Sicherung');
await p2.evaluate(()=>{S.lastBackup=null;save();window.__shMode='abort';render()});await p2.click('[data-act="bksave"]');await p2.waitForTimeout(200);txt=await p2.locator('#sicherung').innerText();ok(/abgebrochen/.test(txt)&&await p2.evaluate(()=>!S.lastBackup),'Tablet: Abbrechen zählt nicht als Sicherung');
await p2.evaluate(()=>{window.__shMode='fail';render()});const [dl2]=await Promise.all([p2.waitForEvent('download'),p2.click('[data-act="bksave"]')]);ok(/[.]txt$/.test(dl2.suggestedFilename()),'Tablet: Teilen verweigert, dann Download');
// Als Text kopieren und wieder laden
await p2.evaluate(()=>{window.__clip=null;Object.defineProperty(navigator,'clipboard',{value:{writeText:t=>{window.__clip=t;return Promise.resolve()}},configurable:true});render()});
await p2.click('.bkalt summary');await p2.click('[data-act="bkcopy"]');await p2.waitForTimeout(200);const clip=await p2.evaluate(()=>window.__clip);ok(clip&&JSON.parse(clip).app==='lernwerkstatt'&&/kopiert/.test(await p2.locator('#sicherung').innerText()),'Als Text kopieren');
await p2.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('nein'))},configurable:true});document.execCommand=()=>false;render()});await p2.click('.bkalt summary');await p2.click('[data-act="bkcopy"]');await p2.waitForTimeout(200);
ok(await p2.locator('#bkout').count()===1&&JSON.parse(await p2.locator('#bkout').inputValue()).app==='lernwerkstatt','Kopieren gesperrt: Text wird zum Markieren angezeigt');
await p2.evaluate(()=>{S.done={};save();render()});await p2.locator('#bkin').fill('Quatsch');await p2.click('[data-act="bkpaste"]');ok(/keine Sicherung/.test(await p2.locator('#sicherung').innerText()),'Falscher Text wird abgelehnt');
if(!(await p2.locator('#bkin').isVisible()))await p2.click('.bkalt summary');await p2.locator('#bkin').fill(clip);await p2.click('[data-act="bkpaste"]');ok(/Sicherung laden\?/.test(await p2.locator('#sicherung').innerText()),'Text einfügen: Nachfrage erscheint');await p2.click('[data-act="bkyes"]');ok(await p2.evaluate(()=>Object.keys(S.done).length===12),'Text einfügen: Lernstand wiederhergestellt');
ok(await p2.evaluate(()=>!document.getElementById('bkfile').hasAttribute('accept')),'Dateiauswahl ohne Typ-Filter (Android graut sonst Dateien aus)');
console.log('errors',errs);await b.close()})();
