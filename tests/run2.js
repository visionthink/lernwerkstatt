const els={};const mk=()=>({innerHTML:'',textContent:'',dataset:{},setAttribute(){},removeAttribute(){},value:''});
global.document={getElementById:id=>els[id]||(els[id]=mk()),querySelectorAll:()=>[],addEventListener(){}};
global.localStorage={getItem:()=>null,setItem(){}};global.window={scrollTo(){}};
const src=require('fs').readFileSync(process.argv[2],'utf8')+`
;const A=(c,m)=>{if(!c)throw new Error(m)};
function solve(t){ t=curT(); if(t.type==='zerl'){cur.sel={p:t.z.parts.map(String),r:t.z.parts.map(x=>String(Math.floor(x/t.z.d))),y:t.z.rrs.map(x=>x?String(x):''),e:String(t.z.res),x:String(t.z.rest||'')};check('s')} else if(t.type==='grid'){cur.sel=JSON.parse(JSON.stringify(t._ans));check('s')} else if(t.type==='steps'){cur.sel=t.rows.map(r=>String(r.a));t.rows.forEach((r,k)=>{if(r.rr!==undefined)cur.sel[50+k]=String(r.rr)});check('s')} else if(t.type==='recall'){cur.revealed=true;render();cur.sel=t.items.map((_,k)=>k).slice(0,t.need);selfcheck()} else {cur.sel=t.type==='choice'?t.a:t.type==='number'?String(t.a):t.a.slice();check('s')} A(cur.status==='right','fail '+t.id);render()}
for(const k of Object.keys(SETS)){useSet(k);BLOCKS.forEach((b,bi)=>b.tasks.forEach((t,ti)=>{cur=Object.assign({b:bi,i:ti},fresh());view='ueben';render();solve(t);
 A(curT().tips&&curT().tips.length===3,'tips '+k+' '+t.id+' '+JSON.stringify(cur).slice(0,300));{const tt=curT();if(tt.type==='recall')A(tt.need<=tt.items.length,'need')}}));view='heute';render();view='eltern';pinOk=true;render();console.log(k,selfCount()+'/'+TOTAL)}
useSet('hsu');
// all good first try -> due tomorrow, none today
A(dueIds().length===0,'due0');A(ids().every(id=>S.rev[id]),'rev all');
A(!S.rev.l1,'reading tasks not scheduled');
// tomorrow: shift dues
for(const id in S.rev)S.rev[id].due-=1;A(dueIds().length===TOTAL,'due all');
const l=dueIds().slice(0,5).map(id=>T[id].t);cur=Object.assign({b:0,i:0,blk:{id:'rev',title:'W',info:'',tasks:l},res:[]},fresh());view='ueben';render();
solve(l[0]);A(S.rev[l[0].id].box===2&&S.rev[l[0].id].due===today()+3,'box2 '+JSON.stringify(S.rev[l[0].id]));A(cur.res.length===1,'res');
cur.status='blockdone';render();
// late: three wrong then right on a 4-option choice
S={done:{},blocks:[],heft:[],feels:{},set:'hsu'};const x=T.g20;cur=Object.assign({b:x.bi,i:x.ti},fresh());render();
for(const w of [0,1,2,3].filter(k=>k!==x.t.a)){cur.sel=w;check('s');A(cur.status==='open','still open')}
cur.sel=x.t.a;check('g');A(S.done.g20.solved==='late'&&S.heft.includes('g20')&&selfCount()===0&&S.rev.g20.due===today(),'late '+JSON.stringify(S.done.g20));render();
// second try counts
const y=T.g23;cur=Object.assign({b:y.bi,i:y.ti},fresh());render();cur.sel=(y.t.a+1)%4;check('s');cur.sel=y.t.a;check('s');A(S.done.g23.solved==='self'&&S.rev.g23.due===today()+1,'second');
// recall miss
const z=T.r4;cur=Object.assign({b:z.bi,i:z.ti},fresh());render();cur.revealed=true;cur.sel=[0,1,2];selfcheck();A(S.done.r4.solved==='miss'&&S.heft.includes('r4'),'miss');render();
// retry from heft clears
cur=Object.assign({b:z.bi,i:z.ti,retry:true},fresh());cur.revealed=true;cur.sel=[0,1,2,3,4,5];selfcheck();A(!S.heft.includes('r4')&&S.done.r4.solved==='miss','retry');
view='eltern';pinOk=true;render();console.log(report());console.log('ALL OK');
// --- twins, ask step, day plan, time limit
S={done:{},blocks:[],heft:[],feels:{},set:'hsu'};useSet('hsu');
let nt=0,na=0;BLOCKS.forEach((b,bi)=>b.tasks.forEach((t,ti)=>{const ak=askOf(t);if(ak){na++;A(ak.a>=0&&ak.a<ak.opts.length,'ask '+t.id)}
 if(t.type==='recall')return;const tw=twinOf(t);A(tw&&tw.items.length&&tw.items.every(Boolean)&&!/Tippe/.test(tw.q),'twin '+t.id);nt++;
 cur=Object.assign({b:bi,i:ti,twin:tw},fresh());view='ueben';render();cur.revealed=true;render();cur.sel=tw.items.map((_,k)=>k);selfcheck();A(cur.status==='right'&&!S.done[t.id],'twin run '+t.id);render()}));
console.log('twins',nt,'ask steps',na);
const g=T.g20;cur=Object.assign({b:g.bi,i:g.ti},fresh());cur.tries=2;cur.status='shown';A(nextTwin()&&nextTwin().items[0]==='Kommune','nextTwin');
cur.status='right';A(!nextTwin(),'no twin when right');
const d=dayPlan();A(d.ids.length===3&&d.ids[0]==='k1','day '+d.ids);S.blocks.push('k1','k2','k3');view='heute';render();A(/Wie war es/.test(els.main.innerHTML),'feel prompt');
S.days.hsu.d-=1;A(dayPlan().ids.join()==='k4,k5,k6','next day '+dayPlan().ids);
A(!over(),'not over');tm().sec=20*60;A(over(),'over');view='heute';render();A(/Zeit für eine Pause/.test(els.main.innerHTML)&&/data-act="more"/.test(els.main.innerHTML),'Pause mit Weiterüben');tm().extra=10;A(!over(),'extra');tm().sec=29*60;A(!over(),'29 von 30');tm().sec=30*60;A(over(),'30 erreicht');S.limit=45;tm().extra=0;A(!over(),'Limit 45');tm().sec=45*60;A(over(),'45 erreicht');S.limit=0;tm().sec=500*60;A(!over(),'ohne Limit');view='heute';render();A(!/Zeit für eine Pause/.test(els.main.innerHTML)&&/heute geübt: 500 Minuten/.test(els.main.innerHTML),'ohne Limit Anzeige');delete S.limit;tm().sec=20*60;tm().extra=0;A(over(),'Standard 20');tm().extra=10;
view='ueben';const a3=T.g3;cur=Object.assign({b:a3.bi,i:a3.ti},fresh());render();A(/Erst genau lesen/.test(els.main.innerHTML),'ask shown');cur.asked=true;cur.askMiss=1;render();A(!/Erst genau lesen/.test(els.main.innerHTML),'ask gone');cur.sel=a3.t.a;check('s');A(S.done.g3.ask===1,'ask recorded');
view='eltern';pinOk=true;render();console.log(report());console.log('ALL OK 2');
// --- math generators
S={done:{},blocks:[],heft:[],feels:{},set:'mathe'};useSet('mathe');let cnt=0;
for(let rnd=0;rnd<300;rnd++)BLOCKS.forEach((b,bi)=>b.tasks.forEach((bt,ti)=>{if(!bt.gen)return;cur=Object.assign({b:bi,i:ti},fresh());view='ueben';const t=curT();cnt++;
 A(t.tips.length===3&&t.explain&&t.lob&&t.q,'fields '+t.id);A(!/NaN|undefined/.test(JSON.stringify(t)),'nan '+t.id+JSON.stringify(t));
 if(t.type==='choice'){A(new Set(t.opts).size===t.opts.length,'dup opts '+t.id+' '+t.opts);A(t.a>=0&&t.a<t.opts.length,'a')}
 if(t.type==='words'){A(new Set(t.words).size===t.words.length,'dup words '+t.id+' '+t.words);A(t.a.length===3,'3 parts')}
 if(t.type==='steps'){const sm=t.rows.filter(r=>!r.sum).reduce((x,r)=>x+r.a,0);A(sm===t.rows.at(-1).a&&t.rows.at(-1).sum,'sum '+t.id)}
 if(t.type==='number')A(Number.isInteger(t.a)&&t.a>0,'num');
 if(t.id==='m2d'){const m=t.q.match(/([0-9]+) · ([0-9]+)/),a=+m[2],n=+m[1],val=x=>+x.replace(/[^0-9]/g,'');const ps=parts(n);const lines=t.opts.slice(0,3).map((o,k)=>val(o.split('=')[1])===a*ps[k]);const sumOk=val(t.opts[3].split('=')[1])===t.opts.slice(0,3).reduce((x,o)=>x+val(o.split('=')[1]),0);const wrong=[...lines,sumOk].map((ok,k)=>ok?-1:k).filter(k=>k>=0);A(wrong.length===1&&wrong[0]===t.a,'m2d '+t.opts+' '+t.a)}
 if(rnd<2){render();if(t.ask)cur.asked=true;render();solve(bt);}}));
console.log('math instances',cnt);
// steps wrong row, then twin with new numbers
S={done:{},blocks:[],heft:[],feels:{},set:'mathe'};const m3=T.m3a;cur=Object.assign({b:m3.bi,i:m3.ti},fresh());let t3=curT();cur.sel=t3.rows.map(r=>String(r.a));cur.sel[1]='1';check('s');A(cur.status==='open'&&cur.badRows.join()==='1'&&/Rot markiert/.test(cur.msg),'bad row');render();
cur.sel[1]=String(t3.rows[1].a);cur.sel[t3.rows.length-1]='5';check('s');A(/Addition/.test(cur.msg),'sum msg');check('s');cur.sel=t3.rows.map(r=>String(r.a));check('s');A(S.done.m3a.solved==='late','late steps');
const tw3=nextTwin();A(tw3&&tw3.type==='steps'&&tw3.id==='m3a~','math twin');cur=Object.assign({b:m3.bi,i:m3.ti,twin:tw3},fresh());render();cur.sel=tw3.rows.map(r=>String(r.a));check('s');A(cur.status==='right'&&S.done.m3a.solved==='late'&&!nextTwin(),'twin done');render();
view='heute';render();view='heft';render();view='eltern';pinOk=true;render();console.log(report());console.log('ALL OK 3');
// --- Mathe-Probe: alle Generatoren 300-mal
const dv=n=>{const d=[];for(let k=1;k<=n;k++)if(n%k===0)d.push(k);return d},ip=n=>n>1&&dv(n).length===2,num=x=>+String(x).replace(/[^0-9]/g,'');
S={done:{},blocks:[],heft:[],feels:{},set:'probe'};useSet('probe');let pc=0;const seen={};const longest={};
for(let rnd=0;rnd<300;rnd++)BLOCKS.forEach((b,bi)=>b.tasks.forEach((bt,ti)=>{cur=Object.assign({b:bi,i:ti},fresh());view='ueben';const t=curT();pc++;
 A(t.q&&t.lob&&t.tips&&t.tips.length===3,'fields '+t.id);A(!/NaN|undefined|null|Infinity/.test(JSON.stringify(Object.assign({},t,{gen:0}))),'nan '+t.id+' '+JSON.stringify(t));
 if(t.type!=='recall')A(t.explain,'explain '+t.id);
 if(t.type==='choice'){A(t.opts.length>=3&&new Set(t.opts).size===t.opts.length&&t.a>=0&&t.a<t.opts.length,'choice '+t.id+' '+t.opts)}
 if(t.type==='words'){A(new Set(t.words).size===t.words.length&&t.a.length>0&&t.a.every(k=>k>=0&&k<t.words.length),'words '+t.id)}
 if(t.type==='steps'){A(t.rows.every(r=>Number.isInteger(r.a)&&r.a>=0),'rows '+t.id);const si=t.rows.findIndex(r=>r.sum);if(si>=0)A(t.rows.slice(0,si).reduce((x,r)=>x+r.a,0)===t.rows[si].a,'sum '+t.id)}
 if(t.type==='number')A(Number.isInteger(t.a)&&t.a>=0,'num '+t.id);
 if(t.type==='recall')A(t.need>=1&&t.need<=t.items.length,'need '+t.id);
 if(t.ask)A(t.ask.a>=0&&t.ask.a<t.ask.opts.length&&new Set(t.ask.opts).size===t.ask.opts.length,'ask '+t.id);
 // Zerlegung: nur Antwort 0 ist gültig
 if(t.id==='mp_d1'||t.id==='mp_d5'){const m=t.q.match(/rechnest ([0-9\u00a0 ]+) : ([0-9]+)/),a=num(m[1]),d=+m[2];A(t.opts.length===4,'4 opts '+t.q);t.opts.forEach((o,k)=>{const l=o.split(' + ').map(num),ok=l.every(x=>x>0&&x%d===0)&&l.reduce((x,y)=>x+y,0)===a;A(ok===(k===0),'zerleg '+t.q+' | '+o)})}
 // Teilen: Ergebnis stimmt
 if(t.type==='steps'&&/^Rechne .* : [0-9]+ halbschriftlich/.test(t.q)&&!/im Heft/.test(t.q)){const m=t.q.match(/Rechne ([0-9\u00a0 ]+) : ([0-9]+)/),a=num(m[1]),d=+m[2],res=t.rows.find(r=>r.sum).a,rest=t.rows.find(r=>r.sum).rr||0;A(res*d+rest===a&&rest<d,'div '+t.q);let rs=0,ps=0;t.rows.filter(r=>!r.sum).forEach(r=>{const mm=r.label.match(/([0-9\u00a0 ]+) : ([0-9]+)/),p=num(mm[1]);ps+=p;rs+=r.rr||0;A(Math.floor(p/+mm[2])===r.a&&p%+mm[2]===(r.rr||0),'teil '+r.label)});A(ps===a&&rs===rest,'teile summe '+t.q);A(t.rows.filter(r=>!r.sum&&r.rr).length===(rest?1:0),'nur letzter Rest')}
 if(/halbschriftlich im Heft/.test(t.q)){const m=t.q.match(/Rechne ([0-9\u00a0 ]+) : ([0-9]+) halbschriftlich im Heft/),a=num(m[1]),d=+m[2];if(t.type==='number')A(t.a*d===a,'heft '+t.q);else{A(t.rows[0].a*d+t.rows[0].rr===a&&t.rows[0].rr<d&&t.rows[0].rr>0,'heftrest '+t.q)}}
 if(t.id==='mp_r1'){const m=t.q.match(/Rechne ([0-9]+) : ([0-9]+)/);A(t.rows[0].a*+m[2]+t.rows[0].rr===+m[1]&&t.rows[0].rr<+m[2]&&t.rows.length===1,'r1')}
 if(t.id==='mp_r5'){const m=t.q.match(/Rechne ([0-9]+) · ([0-9]+) [+] ([0-9]+)/);A(+m[1]*+m[2]+ +m[3]===t.a,'r5')}
 if(t.id==='mp_r7'){const m=t.q.match(/Stimmt ([0-9\u00a0 ]+) : ([0-9]+) = ([0-9]+) R ([0-9]+)/);A(+m[3]*+m[2]+ +m[4]!==num(m[1])&&+m[4]<+m[2],'r7 '+t.q)}
 if(t.id==='mp_r2'){const d=+t.q.match(/durch ([0-9]+)/)[1];A(t.a.map(k=>+t.words[k]).join()===dv(d).length&&false||t.a.map(k=>+t.words[k]).join()===[...Array(d-1).keys()].map(x=>x+1).join(),'r2')}
 // Sachaufgaben
 if(['mp_sa2','mp_sa5','mp_x3'].includes(t.id)){const n=t.q.match(/[0-9]+/g).map(Number);const a=n[0],d=t.id==='mp_sa5'?n[1]:n[1];A(Math.ceil(a/d)===t.a&&a%d!==0,'mindestens '+t.q)}
 if(t.id==='mp_sa4'){const n=t.q.match(/[0-9]+/g).map(Number);A(Math.floor(n[0]/n[1])===t.a&&n[0]%n[1]!==0,'sa4')}
 if(t.id==='mp_sa1'){const n=t.q.match(/[0-9]+/g).map(Number);A(t.rows[0].a===Math.floor(n[0]/n[1])&&t.rows[1].a===n[0]%n[1]&&t.rows[1].a>0,'sa1')}
 if(t.id==='mp_sa3'){const n=t.q.match(/[0-9]+/g).map(Number),d=n[1]+1;A(t.rows[0].a===Math.floor(n[0]/d)&&t.rows[1].a===n[0]%d&&t.rows[1].a>0&&+t.ask.opts[t.ask.a]===d,'sa3')}
 // Teiler und Primzahlen
 if(t.id==='mp_t1'){const N=+t.q.match(/von ([0-9]+)/)[1];t.rows.forEach(r=>{const mm=r.label.split(' : ').map(Number);A(mm[0]===N&&N%mm[1]===0&&N/mm[1]===r.a,'t1')})}
 if(t.id==='mp_t2'||t.id==='mp_t3'||t.id==='mp_x4'){const N=+t.q.match(/von ([0-9]+)/)[1],got=t.type==='words'?t.a.map(k=>+t.words[k]):t.items.map(Number);A(got.join()===dv(N).join(),'teiler '+t.id)}
 if(t.id==='mp_t4'){t.words.forEach((w,k)=>{let tr;const m=w.match(/^([0-9]+) ist ein Teiler von ([0-9]+)\.$/);if(m)tr=+m[2]%+m[1]===0;else tr={'1 ist ein Teiler von jeder Zahl.':true,'Jede Zahl ist ein Teiler von sich selbst.':true,'2 ist ein Teiler von jeder Zahl.':false,'10 ist ein Teiler von jeder geraden Zahl.':false}[w];A(tr!==undefined&&tr===t.a.includes(k),'t4 '+w)})}
 if(t.id==='mp_t6'){const D=+t.q.match(/durch ([0-9]+) teilen/)[1];A(t.a.join()===t.words.map((w,k)=>+w%D===0?k:-1).filter(k=>k>=0).join()&&t.a.length===3&&t.words.length===6,'t6')}if(t.id==='mp_t7'){const n=+t.q.match(/du ([0-9]+) ohne/)[1];A(t.a.join()===t.words.map((w,k)=>n%+w===0?k:-1).filter(k=>k>=0).join()&&t.a.length>=2&&t.a.length<=5,'t7');A(/Quersumme ist ([0-9]+)/.test(t.explain)&&+t.explain.match(/Quersumme ist ([0-9]+)/)[1]===String(n).split('').reduce((a,b)=>a+ +b,0),'t7 qs')}
 if(t.id==='mp_p2'||t.id==='mp_p6'){A(t.words.every((w,k)=>ip(+w)===t.a.includes(k)),'prim '+t.id)}
 if(t.id==='mp_p4'){const n=+t.q.match(/Ist ([0-9]+)/)[1];A(t.opts[t.a].startsWith(ip(n)?'Ja':'Nein'),'p4')}
 if(t.id==='mp_p5')A(t.items.map(Number).join()===[2,3,5,7,11,13,17,19].join(),'p5');
 // Geodreieck-Figuren
 if(t._rel){const [s1,s2]=t._seg,v1=[s1[2]-s1[0],s1[3]-s1[1]],v2=[s2[2]-s2[0],s2[3]-s2[1]],cos=Math.abs(v1[0]*v2[0]+v1[1]*v2[1])/Math.hypot(...v1)/Math.hypot(...v2),deg=Math.acos(Math.min(1,cos))*180/Math.PI;
   A({s:deg>89.5,p:deg<0.5,k:deg>=29&&deg<=61}[t._rel],'lines '+t._rel+' '+deg);[...s1,...s2].forEach((c,i)=>A(c>=0&&c<=(i%2?220:260),'inside '+c))}
 if(t._pts){const P=t._pts,n=P.length;let ra=0;for(let i=0;i<n;i++){const a=P[(i+n-1)%n],b=P[i],c=P[(i+1)%n],u=[a[0]-b[0],a[1]-b[1]],v=[c[0]-b[0],c[1]-b[1]];if(Math.abs(u[0]*v[0]+u[1]*v[1])<1e-6)ra++}A(ra===t.a,'winkel '+t.explain+' '+ra);
   const pts=t.svg.match(/points="([^"]+)"/)[1].split(' ').map(x=>x.split(',').map(Number));A(pts.every(([x,y])=>x>=0&&x<=260&&y>=0&&y<=190),'shape inside')}
 if(t.id==='mp_g8'||t.id==='mp_g9'){const V='abe',par=s=>{const [x,y]=s.split(' und ');return V.includes(x)===V.includes(y)};t.opts.forEach((o,k)=>A(par(o)===(t.id==='mp_g8'?k===t.a:k!==t.a),'court '+o))}
 if(t.id==='mp_f1'||t.id==='mp_f3'){const sq=t.q.split(': ')[1].replace(', …','').split(', ').map(Number).concat(t.rows.map(r=>r.a));for(let i=2;i<sq.length;i++)A(sq[i]===sq[i-1]+sq[i-2],'fib')}


 if(t.type==='zerl'){const z=t.z,D=x=>String(Math.floor(x/z.d)),can={p:z.parts.map(String),r:z.parts.map(D),y:z.rrs.map(x=>x?String(x):''),e:String(z.res),x:String(z.rest||'')};A(zOk(t,can),'zerl can '+t.id+' '+zCheck(t,can));A(z.parts.reduce((x,y)=>x+y,0)===z.a&&z.res*z.d+z.rest===z.a,'zerl math');
   A(!zOk(t,{p:[String(z.a-z.rest)],r:[D(z.a-z.rest)],e:String(z.res),x:String(z.rest||'')}),'one part');
   const big=z.parts[0],restp=z.a-z.rest-big;A(zOk(t,{p:[String(big),String(restp)],r:[D(big),D(restp)],e:String(z.res),x:String(z.rest||'')}),'alt zerl '+t.id);
   if(z.rest){A(zOk(t,{p:[String(big),String(z.a-big)],r:[D(big),D(z.a-big)],y:['',String(z.rest)],e:String(z.res),x:String(z.rest)}),'klasse zerl');
     A(!zOk(t,{p:[String(big),String(z.a-big)],r:[D(big),D(z.a-big)],y:['',''],e:String(z.res),x:String(z.rest)}),'fehlender zeilenrest');
     A(/hinter das R/.test(zCheck(t,{p:[String(big),String(z.a-big)],r:[D(big),D(z.a-big)],y:['',String(z.rest)],e:String(z.res),x:String(z.rest===1?2:1)}))||z.d===2,'endrest')}
   if(z.parts.length>1){const bad={p:can.p.slice(),r:can.r.slice(),y:can.y.slice(),e:can.e,x:can.x};bad.p[0]=String(z.parts[0]+1);A(!zOk(t,bad)&&/nicht ohne Rest|ergeben/.test(zCheck(t,bad)),'bad part '+zCheck(t,bad))}}
 if(t.type==='grid'&&t.mode==='angles'){A(t.right.length>0&&t.right.length<t.angs.length,'angles n');A(!gOk(t,[]),'angles leer');const wr=t.angs.map((_,i)=>i).find(i=>!t.right.includes(i));A(!gOk(t,t.right.concat(wr))&&/kein rechter/.test(gMsg(t,t.right.concat(wr))),'angles falsch');
   t.angs.forEach(g=>g.forEach(([x,y])=>A(x>=10&&x<=250&&y>=5&&y<=t.H-5,'angles inside')));const tp=t.angs.map(angTap);tp.forEach((p,i)=>tp.forEach((q,j)=>{if(i<j)A(Math.hypot(p[0]-q[0],p[1]-q[1])>=18,'tap overlap '+i+' '+j)}));
   t.angs.forEach((g,i)=>{const u=vsub(g[1],g[0]),v=vsub(g[2],g[0]),deg=Math.acos(vdot(u,v)/vlen(u)/vlen(v))*180/Math.PI;A(t.right.includes(i)?Math.abs(deg-90)<1e-6:Math.abs(deg-90)>12,'winkel klar '+deg)})}
 if(t.type==='choice'&&!t.pics&&t.a!==undefined){const L=t.opts.map(o=>o.length),others=L.filter((x,k)=>k!==t.a);if(L[t.a]>Math.max(...others)*1.3&&L[t.a]-Math.max(...others)>12)longest[t.id]=(longest[t.id]||0)+1}
 if(t.type==='grid'){A(gOk(t,JSON.parse(JSON.stringify(t._ans))),'grid ans '+t.id+' '+JSON.stringify(t._ans));['open','right','sol'].forEach(md=>{const h=gView(t,md==='open'?null:t._ans,md);A(!/NaN|undefined/.test(h),'gview '+t.id+' '+md)});
   if(t.mode==='perp'||t.mode==='par'){A(inside(t.P,t.W,t.H,1),'P inside');const onG=vcrs(vsub(t.P,t.g.p),t.g.d)===0;A(t.mode==='perp'?(t.id==='mp_gs3'?!onG:onG):!onG,'P on g '+t.id);
     const bad=gPts(t.W,t.H).filter(X=>!gOkLine(t,X)&&!eqp(X,t.P));A(bad.length>0&&!gOk(t,bad[0]),'bad');gPts(t.W,t.H).filter(X=>gOkLine(t,X)).forEach(X=>{const v=vsub(X,t.P);A(t.mode==='perp'?Math.abs(vdot(v,t.g.d))<1e-9:Math.abs(vcrs(v,t.g.d))<1e-9,'geom')})}
   if(t.mode==='dist'){A(!gOk(t,[[2,t.k.y-3],[9,t.k.y-3]])&&!gOk(t,[[2,t.k.y-4],[9,t.k.y-3]])&&gOk(t,[[3,t.k.y+4],[5,t.k.y+4]])===(t.k.y+4<=t.H),'dist')}
   if(t.mode==='corners'){const P=t.pts,n=P.length;let ra=[];for(let i=0;i<n;i++){const a=P[(i+n-1)%n],b=P[i],c=P[(i+1)%n],u=[a[0]-b[0],a[1]-b[1]],v=[c[0]-b[0],c[1]-b[1]];if(u[0]*v[0]+u[1]*v[1]===0)ra.push(i)}A(ra.join()===t.right.join(),'corners');A(!gOk(t,[]) ===(t.right.length>0),'zero ok');A(P.every(([x,y])=>x>=20&&x<=240&&y>=20&&y<=170),'fig inside')}
   if(t.mode==='lines'){const V='abe',par=(x,y)=>V.includes(x)===V.includes(y);if(t.need==='pair'){['a','b','c','d','e','f'].forEach(x=>['a','b','c','d','e','f'].forEach(y=>{if(x!==y)A(gOk(t,[x,y])===(t.rel==='par'?par(x,y):!par(x,y)),'pair '+x+y)}))}else{A(t._ans.every(x=>x!==t.ref&&(t.rel==='par'?par(x,t.ref):!par(x,t.ref))),'all');A(t._ans.length===(t.rel==='par'?2:3),'all n')}}}
 if(t.pics){A(t.opts.length===3&&new Set(t.opts).size===3&&t.opts.every(o=>o.startsWith('<svg')&&!/NaN/.test(o)),'pics '+t.id)}
 if(rnd<2){render();if(t.ask)cur.asked=true;render();solve(bt)}
 seen[bt.id]=1}));
console.log('probe instances',pc,'tasks',Object.keys(seen).length,'blocks',BLOCKS.length);console.log('auffaellig laengste Antwort:',JSON.stringify(longest));
// Demo-Modus: jede Seite jedes Pakets rendern
for(const k of Object.keys(SETS)){demo={set:k,b:0,inst:{}};SETS[k].blocks.forEach((b,bi)=>{demo.b=bi;view='demo';render();const h=els.main.innerHTML;A(!/undefined|NaN/.test(h),'demo '+k+' '+b.id);A((h.match(/class="panel stack"><div class="row"/g)||[]).length===b.tasks.length,'demo count '+b.id)})}
// Probelauf: nichts wird gespeichert, Zustand kommt zurück
let saved=0;global.localStorage.setItem=()=>{saved++};S={done:{},blocks:[],heft:[],feels:{},set:'hsu'};useSet('hsu');const before=JSON.stringify(S);
demo={set:'probe',b:0,inst:{}};demoSnap=JSON.stringify(S);useSet('probe');cur=Object.assign({b:0,i:0},fresh());view='ueben';render();A(/Probelauf/.test(els.main.innerHTML),'probelauf banner');
solve(BLOCKS[0].tasks[0]);A(saved===0,'saved during demo '+saved);S=JSON.parse(demoSnap);demoSnap=null;useSet(S.set);A(JSON.stringify(S)===before,'restored');
// Proben-Tab
view='probe';render();A(/Matheprobe am Mittwoch, 25.11./.test(els.main.innerHTML),'probe tab');view='heute';useSet('probe');render();{const H=els.main.innerHTML,i1=H.indexOf('zone z1'),i2=H.indexOf('zone z2'),i3=H.indexOf('zone z3');A(/Deine nächste Probe.*Matheprobe/.test(H)&&i1>=0&&i1<i2&&i2<i3&&H.indexOf('class="plan"')>i2&&H.indexOf('class="plan"')<i3&&H.indexOf('blist')>i3,'Startseite Bereiche '+H.slice(0,300))}for(const st of Object.keys(SETS)){useSet(st);view='heute';render();const H=els.main.innerHTML,cnt=r=>(H.match(r)||[]).length;A(cnt(/<section/g)===cnt(/<[/]section>/g)&&cnt(/<details/g)===cnt(/<[/]details>/g)&&cnt(/<article/g)===cnt(/<[/]article>/g),'Startseite Tags offen/zu '+st);const z1=H.slice(H.indexOf('zone z1'),H.indexOf('zone z2'));A(!/Weitere Pakete/.test(H)||z1.includes('Weitere Pakete'),'Weitere Pakete in Bereich 1 '+st)}useSet('probe');
{const near=(a,b)=>Math.abs(a[0]-b[0])<1e-6&&Math.abs(a[1]-b[1])<1e-6;A(near(skiAt(0),SKI_T[0])&&near(skiAt(1),SKI_T[SKI_T.length-1]),'ski Enden');
 const M=[[0,300],[60,260],[395,28],[560,250],[600,300]],inPoly=(pt,P)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if(((yi>pt[1])!==(yj>pt[1]))&&(pt[0]<(xj-xi)*(pt[1]-yi)/(yj-yi)+xi))c=!c}return c};
 for(let f=0;f<=1.0001;f+=0.01)A(inPoly(skiAt(f),M),'Skifahrer auf dem Berg bei '+f.toFixed(2));
 let prev=-1;for(let f=0;f<=1.0001;f+=0.05){const q=skiAt(f);A(q[1]<=SKI_T[0][1]+1e-6,'ski Höhe')}
 SKI_ST.forEach(([f,name])=>{const q=skiAt(f),right=q[0]<395,w=name.length*10;if(f<1)A(right?q[0]-12-w>=0:q[0]+12+w<=600,'Label im Bild '+name)});
 useSet('probe');const ts=SETS.probe.blocks.flatMap(b=>b.tasks),n=ts.length,save0=JSON.stringify(S);
 const setD=k=>{S.done={};S.heft=[];ts.slice(0,k).forEach(t=>S.done[t.id]={solved:'self'})};
 for(const [k,word,goal] of [[0,'zur Mittelstation',Math.ceil(n/4)],[Math.ceil(n/4),'zur Hütte',Math.ceil(n/2)],[Math.ceil(n/2),'zum Gipfelgrat',Math.ceil(n*3/4)],[Math.ceil(n*3/4),'zum Gipfel',n]]){setD(k);const h=skiHTML(PROBEN.find(p=>p.set==='probe'));A(h.includes('Noch '+(goal-k)+' Aufgaben '.replace('Aufgaben ',goal-k===1?'Aufgabe ':'Aufgaben ')+'bis '+word),'Skitext '+k+' '+h.slice(h.indexOf('<h3>'),h.indexOf('</p>')))}
 setD(n);A(skiHTML(null).includes('Gipfel erreicht'),'Gipfel erreicht');
 setD(n);S.heft=[ts[0].id];A(skiStat('probe').d===n-1,'Fehlerheft zählt nicht');
 setD(n);S.stamps=[];S.newStamp=null;stampCheck();stampCheck();A(S.stamps.filter(x=>x.k==='probe@2026-11-25').length===1&&S.newStamp===S.stamps.length-1,'Stempel einmal');
 const t0=today();S.log=[t0-2,t0-1,t0];A(streak()===3,'streak3');S.log=[t0-3,t0-2,t0-1];A(streak()===3,'streak gestern');S.log=[t0-5,t0];A(streak()===1,'streak1');S.log=[];A(streak()===0,'streak0');
 A(PASS.length===12&&new Set(PASS.map(x=>x[0])).size===12,'Pass Ziele');
 S=JSON.parse(save0);useSet('probe')}
{const save1=JSON.stringify(S);useSet('probe');const right=t=>t.type==='zerl'?{p:t.z.parts.map(String),r:t.z.parts.map(x=>String(Math.floor(x/t.z.d))),y:t.z.rrs.map(x=>x?String(x):''),e:String(t.z.res),x:String(t.z.rest||'')}:t.type==='grid'?JSON.parse(JSON.stringify(t._ans)):t.type==='steps'?(()=>{const v=t.rows.map(r=>String(r.a));t.rows.forEach((r,k)=>{if(r.rr!==undefined)v[50+k]=String(r.rr)});return v})():t.type==='choice'?t.a:t.type==='number'?String(t.a):t.a.slice();
 for(let rnd=0;rnd<60;rnd++){S.heft=[];S.gp=[];gpStart('probe');A(view==='gp'&&gp.slots.length===20,'GP Anzahl '+gp.slots.length);A(new Set(gp.slots.map(x=>x.twin.id)).size===20,'GP doppelt');A(gp.slots.every(x=>x.twin.type!=='recall'),'GP Heft-Aufgabe');
  gp.slots.forEach((sl,k)=>{gp.i=k;render();A(!/Tipp holen|Lösung zeigen|Merkzettel/.test(els.main.innerHTML),'GP zeigt Hilfe');A(!isOk(sl.twin,sl.sel),'GP leer ok '+sl.twin.id);sl.sel=right(sl.twin);A(isOk(sl.twin,sl.sel),'GP richtig nicht ok '+sl.twin.id);{const t=sl.twin,w=right(t);let bad=null;if(t.type==='number')bad=String(t.a+1);else if(t.type==='choice')bad=(t.a+1)%t.opts.length;else if(t.type==='words')bad=w.length>1?w.slice(1):w.concat(t.words.map((_,j)=>j).find(j=>!w.includes(j)));else if(t.type==='steps'){bad=w.slice();bad[0]=String(+w[0]+1)}else if(t.type==='zerl'){bad=JSON.parse(JSON.stringify(w));bad.e=String(+bad.e+1)}if(bad!==null)A(!isOk(t,bad),'GP falsch als richtig '+t.id);if(t.type==='steps'&&t.rows.some(r=>r.rr!==undefined)){const b2=w.slice();const k=t.rows.findIndex(r=>r.rr!==undefined);b2[50+k]=String(+w[50+k]+1);A(!isOk(t,b2),'GP Rest falsch als richtig')}}A(gpHas(sl),'GP has '+sl.twin.id)});
  gpSubmit();A(gp.end.p===gp.end.max+2&&gp.end.pct===100&&gp.end.note===1&&S.heft.length===0&&S.gp.length===1,'GP volle Punkte');render();A(els.main.innerHTML.includes(gp.end.p+' von '+gp.end.max+' Punkten'),'GP Ergebnis');
  S.heft=[];gpStart('probe');gpSubmit();A(gp.end.p===0&&gp.end.note===6&&S.heft.length===19,'GP leer');
  gpStart('probe');gp.slots.forEach((sl,k)=>{if(k%2)sl.sel=right(sl.twin)});gpSubmit();const exp=gp.slots.filter((_,k)=>k%2).reduce((a,sl)=>a+gpPts(sl.twin),0);A(gp.end.p===exp,'GP halbe Punkte')}
 A(gpNote(95)===1&&gpNote(94)===2&&gpNote(80)===2&&gpNote(79)===3&&gpNote(65)===3&&gpNote(50)===4&&gpNote(49)===5&&gpNote(25)===5&&gpNote(24)===6&&gpNote(0)===6,'Notenschlüssel');
 gp=null;clearInterval(gpTimer);view='heute';cur=null;S=JSON.parse(save1);useSet('probe')}
{useSet('probe');for(let rnd=0;rnd<80;rnd++){paperMake();const H=paperHTML(),cnt=re=>(H.match(re)||[]).length;A(cnt(/<section/g)===cnt(/<[/]section>/g)&&cnt(/<div/g)===cnt(/<[/]div>/g)&&cnt(/<table/g)===cnt(/<[/]table>/g),'Papier Tags');
 const probe=H.slice(0,H.indexOf('lpage')),txt=probe.replace(/<svg[\s\S]*?<[/]svg>/g,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ');const big=(txt.match(/[0-9]{1,3}(?: [0-9]{3})+|[0-9]+/g)||[]).map(v=>+v.replace(/ /g,'')).filter(v=>v>1000);A(!big.length,'Papier Zahl über 1000 '+big);
 const pts=[...probe.matchAll(/___ [/] ([0-9]+) P</g)].map(m=>+m[1]);A(pts.reduce((a,b)=>a+b,0)===66&&probe.includes('/ 66 Punkte'),'Papier Punkte '+pts);
 A(new Set(paperData.ks.map(kopfQ)).size===8,'Papier Kopf doppelt');A(!/Tippe|Fülle|dein Heft/.test(txt),'Papier App-Anweisung');
 A(cnt(/class="ppage /g)===7&&cnt(/class="ppage lpage"/g)===2,'Papier Seiten');
 paperData.ks.forEach(t=>A(kopfQ(t).includes('____'),'Kopf Lücke '+t.q));
 paperData.rs.forEach(t=>{const s=t.rows.find(r=>r.sum)||t.rows[0],m=divOf(t).split(' : ').map(x=>+x.replace(/ /g,''));A(s.a*m[1]+s.rr===m[0]&&s.rr<m[1]&&s.rr>0,'Papier Rest')});
 paperData.dv.forEach(t=>{const s=t.rows.find(r=>r.sum),m=divOf(t).split(' : ').map(x=>+x.replace(/ /g,''));A(s.a*m[1]===m[0],'Papier Div')});
 A(paperData.tN.every(x=>paperData.N%x===0)&&paperData.tN.length===Array.from({length:paperData.N},(_,i)=>i+1).filter(x=>paperData.N%x===0).length,'Papier Teiler')}
 paperData=null;view='heute'}



console.log('ALL OK 4');`;
eval(src);
