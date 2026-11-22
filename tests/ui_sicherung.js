const {chromium}=require('playwright');const fs=require('fs'),path=require('path'),os=require('os');(async()=>{const b=await chromium.launch();const ctx=await b.newContext({acceptDownloads:true,viewport:{width:820,height:1100}});const p=await ctx.newPage();const ok=(c,m)=>console.log((c?'OK   ':'FEHLER ')+m);const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file://'+path.resolve(process.argv[2]||'lernwerkstatt/index.html'));
await p.evaluate(()=>{useSet('probe');const ts=SETS.probe.blocks.flatMap(b=>b.tasks);S.done={};ts.slice(0,12).forEach(t=>S.done[t.id]={solved:'self',tries:1,tips:0});S.heft=[ts[3].id,ts[5].id];S.stamps=[{k:'x',day:1}];S.theme='hell';save();pinOk=true;view='eltern';cur=null;render()});
let txt=await p.locator('#sicherung').innerText();ok(/Noch keine Sicherung/i.test(txt),'Hinweis: noch keine Sicherung');
const [dl]=await Promise.all([p.waitForEvent('download'),p.click('[data-act="bksave"]')]);const f=path.join(os.tmpdir(),dl.suggestedFilename());await dl.saveAs(f);
ok(/^lernwerkstatt-sicherung-[0-9]{4}-[0-9]{2}-[0-9]{2}[.]json$/.test(dl.suggestedFilename()),'Dateiname '+dl.suggestedFilename());
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
console.log('errors',errs);await b.close()})();
