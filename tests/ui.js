const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:820,height:1180}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto('file://'+require('path').resolve(__dirname,'../index.html'));
const ok=(c,m)=>console.log((c?'OK   ':'FEHLER ')+m);
for(const bid of ['mpb01','mpb03','mpb09','mpb16']){
 await p.evaluate(bid=>{useSet('probe');const b=BLOCKS.findIndex(x=>x.id===bid);cur=Object.assign({b,i:0},fresh());view='ueben';render()},bid);
 const t=await p.evaluate(()=>curT().q);let txt=await p.locator('#main').innerText();
 ok(txt.includes('Das brauchst du jetzt')&&!txt.includes(t),bid+': Karte vor dem Block, Frage noch nicht sichtbar');
 if(bid==='mpb01')
 await p.click('text=Verstanden');txt=await p.locator('#main').innerText();
 const card=await p.evaluate(()=>merkOf(curT().id)[4].map(x=>x.replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ')));
 ok(txt.includes(t.slice(0,30))&&!card.some(l=>l.length>8&&txt.includes(l))&&!txt.includes('Merkzettel'),bid+': Frage sichtbar, Karteninhalt nicht');
 // falsch antworten
 await p.evaluate(()=>{const t=curT();if(t.type==='choice')cur.sel=(t.a+1)%t.opts.length;else if(t.type==='words')cur.sel=[0];else if(t.type==='grid')cur.sel=[];else cur.sel='1';check('s');render()}).catch(e=>console.log('x',e.message));
 txt=await p.locator('#main').innerText();const st=await p.evaluate(()=>cur.status);
 ok(st!=='open'||!txt.includes('Merkzettel'),bid+': nach Fehler (noch offen) kein Merkzettel, Status '+st);
 // Lösung zeigen lassen
 await p.evaluate(()=>{cur.status='shown';render()});txt=await p.locator('#main').innerText();ok(txt.includes('Zum Nachlesen'),bid+': nach Abschluss zum Nachlesen');
 if(bid==='mpb01')
 // zurück zu Aufgabe 1: keine Karte mehr
 await p.evaluate(()=>{cur=Object.assign({b:cur.b,i:0},fresh());render()});txt=await p.locator('#main').innerText();ok(!txt.includes('Das brauchst du jetzt'),bid+': Karte erscheint nicht nochmal');
}
console.log('errors',errs);await b.close()})();
