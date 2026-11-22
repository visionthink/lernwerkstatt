// Versionsanzeige und automatisches Update. Aufruf: node ui_version.js ../index.html
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
(async()=>{const file=path.resolve(process.argv[2]||'lernwerkstatt/index.html'),html=fs.readFileSync(file,'utf8');const ver=(html.match(/const APP_VERSION='([^']+)'/)||[])[1];
let served=html;const srv=http.createServer((q,r)=>{if(q.url.startsWith('/index.html')||q.url==='/'){r.writeHead(200,{'content-type':'text/html; charset=utf-8'});r.end(served)}else{r.writeHead(404);r.end()}}).listen(0);await new Promise(r=>srv.on('listening',r));const url='http://127.0.0.1:'+srv.address().port+'/index.html';
const ok=(c,m)=>console.log((c?'OK   ':'FEHLER ')+m);const errs=[];const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:800,height:1200},serviceWorkers:'block'});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(String(e)));
ok(/^v[0-9]+$/.test(ver||''),'Versionsnummer eingebaut ('+ver+')');
await p.goto(url);await p.evaluate(()=>{window.__rl=0;updReload=()=>{window.__rl++}});await p.waitForTimeout(2200);ok(await p.evaluate(()=>window.__rl===0),'Gleiche Version: kein Neuladen beim Start');
await p.evaluate(()=>{pinOk=true;view='eltern';render()});let t=await p.locator('#version').innerText();ok(t.includes(ver)&&/vom [0-9]+[.][0-9]+[.]20[0-9]{2}/.test(t),'Elternbereich zeigt Version und Datum');ok((await p.locator('main, body').first().innerText()).includes('App-Version '+ver),'Version in der Kopfzeile des Elternbereichs');
await p.click('[data-act="upd"]');await p.waitForTimeout(400);ok(/aktuell/.test(await p.locator('#version').innerText()),'Nach Update suchen: aktuell');
served=html.replace("const APP_VERSION='"+ver+"'","const APP_VERSION='v9999'");
await p.click('[data-act="upd"]');await p.waitForTimeout(500);ok(await p.evaluate(()=>window.__rl===1)&&/v9999/.test(await p.locator('#version').innerText()),'Neue Version gefunden: App lädt neu');
await p.evaluate(()=>{window.__rl=0;try{sessionStorage.clear()}catch(e){}updCheck(false)});await p.waitForTimeout(500);ok(await p.evaluate(()=>window.__rl===1),'Beim Start: neue Version lädt automatisch');
await p.evaluate(()=>{window.__rl=0;updCheck(false)});await p.waitForTimeout(500);ok(await p.evaluate(()=>window.__rl===0),'Keine Neulade-Schleife, falls die neue Version nicht ankommt');
srv.close();await p.evaluate(()=>{updCheck(true)});await p.waitForTimeout(800);ok(/Keine Internetverbindung/.test(await p.locator('#version').innerText()),'Offline: verständliche Meldung');
ok(JSON.parse(await p.evaluate(()=>bkData())).appVersion===ver,'Sicherung enthält die App-Version');
console.log('errors',errs);await b.close();process.exit(0)})();
