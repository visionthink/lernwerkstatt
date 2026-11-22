// Sprachprüfung aller Aufgabentexte (auch Unterwegs-Varianten). Aufruf: node textcheck.js check.js
const els={};const mk=()=>({innerHTML:'',dataset:{},setAttribute(){},value:''});global.document={getElementById:id=>els[id]||(els[id]=mk()),querySelectorAll:()=>[],addEventListener(){}};global.localStorage={getItem:()=>null,setItem(){}};global.window={scrollTo(){}};
eval(require('fs').readFileSync(process.argv[2],'utf8')+`
const strip=x=>String(x==null?'':x).replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ');
const RULES=[
 ['Doppelpunkt vor Rechnung',/[a-zäöüß]: [0-9][0-9 ]* [·:+−=-] [0-9]/],
 ['Doppelpunkt direkt nach Rechnung',/[0-9] [·:] [0-9]+: /],
 ['Einzahl/Mehrzahl nach 1',/(^|[^0-9 ]|[^0-9] )1 (Kinder|Kindern|Personen|Skifahrer|Bällen|Bälle|Karten|übrigen|Plätze|Gondeln|Autos|Dosen|Mannschaften|Abteile|Seiten|Aufgaben|Tipps|Minuten|Tage|Blöcke|Teiler |Sessel bleiben|Euro sind)/],
 ['„Rest“ statt R in Rechnung',/= [0-9 ]+ Rest [0-9]/],
 ['doppelte Satzzeichen',/[.!?,]{2,}/],
 ['fehlendes Leerzeichen',/[a-zäöüß]{2,}[.!?,][A-ZÄÖÜa-zäöü]/],
 ['klein nach Doppelpunkt',/[a-zäöüß)“]: +[a-zäöüß]{2}/]];
const hits={};let n=0;const add=(r,w,t)=>{(hits[r]=hits[r]||new Map()).set(w,t)};
for(const k of Object.keys(SETS)){useSet(k);BLOCKS.forEach((b,bi)=>{[b.info].forEach(x=>RULES.forEach(([r,re])=>{if(re.test(strip(x)))add(r,k+'/'+b.id,strip(x))}));b.tasks.forEach((t0,ti)=>{for(let i=0;i<(t0.gen?150:1);i++){cur=Object.assign({b:bi,i:ti},fresh());const t=curT();n++;const L=[t.q,t.explain,t.lob,...(t.tips||[]),...(t.opts||[]),...(t.items||[]),...(t.words||[]),...(t.rows||[]).map(r=>r.label)];if(t.alt){try{const a=t.alt();L.push(a.q,a.explain,...(a.tips||[]),...(a.opts||[]),...(a.items||[]))}catch(e){}}
 for(const x of L){const s=strip(x);if(t0.id==='mp_r1'&&/Kurz geschrieben/.test(s))continue;RULES.forEach(([r,re])=>{const m=s.match(re);if(m)add(r,t0.id+' '+m[0],s.slice(Math.max(0,m.index-40),m.index+60))})}}})})}
for(const k in MERK){const m=MERK[k];(m.cards||[]).forEach(c=>{[c[1],c[3],...c[4],...c[5],c[6]].forEach(x=>{const s=strip(x);RULES.forEach(([r,re])=>{const mm=s.match(re);if(mm)add(r,'merk/'+c[0]+' '+mm[0],s.slice(Math.max(0,mm.index-40),mm.index+60))})})})}
PROBEN.forEach(p=>[p.note,p.tipT,...(p.tips||[]),...(p.plan||[]).map(x=>x[1])].forEach(x=>{const s=strip(x);RULES.forEach(([r,re])=>{const mm=s.match(re);if(mm)add(r,'plan/'+p.name+' '+mm[0],s.slice(Math.max(0,mm.index-40),mm.index+60))})}));
let bad=0;for(const r in hits){bad+=hits[r].size;console.log('## '+r+' ('+hits[r].size+')');[...hits[r]].slice(0,60).forEach(([w,t])=>console.log('   '+w.split(' ')[0]+': …'+t+'…'))}
console.log('Texte geprüft in',n,'Aufgaben-Varianten');console.log(bad?'TEXT FEHLER':'TEXT OK');if(bad)process.exit(1)`);
