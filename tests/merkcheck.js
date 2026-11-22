// Prüft jede Rechnung im Merkzettel und die Skizze. Aufruf: node merkcheck.js check.js
const els={};const mk=()=>({innerHTML:'',dataset:{},setAttribute(){},value:''});global.document={getElementById:id=>els[id]||(els[id]=mk()),querySelectorAll:()=>[],addEventListener(){}};global.localStorage={getItem:()=>null,setItem(){}};global.window={scrollTo(){},self:1,top:1};
eval(require('fs').readFileSync(process.argv[2],'utf8')+`
let bad=0,n=0;const strip=x=>String(x).replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\\u00a0/g,' ');
const NUM='[0-9]{1,3}(?: [0-9]{3})*';
const EXPR=NUM+'(?: [·:+−-] '+NUM+')*(?: R [0-9]+)?';
const re=new RegExp('('+EXPR+')((?: = '+EXPR+')+)','g');
function ev(e){e=e.trim();let m=e.match(new RegExp('^('+NUM+') : ('+NUM+') *$'));const num=x=>+x.replace(/ /g,'');
  const r=e.match(/^(.*) R ([0-9]+)$/);if(r)return {q:ev(r[1]).v,r:+r[2]};
  const toks=e.split(/ ([·:+−-]) /);// [n,op,n,...]
  let vals=[num(toks[0])],ops=[];for(let i=1;i<toks.length;i+=2){ops.push(toks[i]);vals.push(num(toks[i+1]))}
  // Punkt vor Strich
  let v2=[vals[0]],o2=[];for(let i=0;i<ops.length;i++){if(ops[i]==='·')v2[v2.length-1]*=vals[i+1];else if(ops[i]===':'){const a=v2[v2.length-1],b=vals[i+1];v2[v2.length-1]=a%b?{q:Math.floor(a/b),r:a%b}:a/b}else{o2.push(ops[i]);v2.push(vals[i+1])}}
  let v=v2[0];for(let i=0;i<o2.length;i++)v=o2[i]==='+'?v+v2[i+1]:v-v2[i+1];return {v}}
const same=(a,b)=>{const A=a.q!==undefined?a:(a.v&&a.v.q!==undefined?a.v:{q:a.v,r:0}),B=b.q!==undefined?b:(b.v&&b.v.q!==undefined?b.v:{q:b.v,r:0});return A.q===B.q&&A.r===B.r};
for(const k of Object.keys(MERK))for(const c of MERK[k].cards){const texts=[c[3],...c[4],...c[5],c[6]].map(strip);
  for(const t of texts)for(const seg of t.split('→')){let m;re.lastIndex=0;while((m=re.exec(seg))){const parts=m[0].split(' = ');n++;const v0=ev(parts[0]);for(const p of parts.slice(1)){if(!same(v0,ev(p))){bad++;console.log('FALSCH ['+k+'/'+c[0]+']: '+m[0])}}}}}
let nt=0;for(const k of Object.keys(MERK))for(const c of MERK[k].cards)for(const t of [c[3],...c[4],...c[5],c[6]].map(strip)){for(const m0 of t.matchAll(/(?:([0-9]+) geht|geht ([0-9]+)) (nicht )?durch ([0-9]+)/g)){const m=[m0[0],m0[1]||m0[2],m0[3],m0[4]];nt++;const ok=(+m[1]%+m[3]===0)!==!!m[2];if(!ok){bad++;console.log('FALSCH ['+k+'/'+c[0]+']: '+m[0])}}}
const qs=x=>String(x).split('').reduce((a,b)=>a+ +b,0);for(let z=10;z<=10000;z++){const r={2:'02468'.includes(String(z).slice(-1)),5:'05'.includes(String(z).slice(-1)),10:String(z).slice(-1)==='0',4:+String(z).slice(-2)%4===0,3:qs(z)%3===0,9:qs(z)%9===0,6:z%2===0&&qs(z)%3===0};for(const d in r)if(r[d]!==(z%d===0)){bad++;console.log('Teilbarkeitsregel falsch: '+z+' durch '+d)}}
console.log('Aussagen „geht durch“ geprüft:',nt,'· Teilbarkeitsregeln an 10 bis 10 000 geprüft');
console.log('Rechnungen geprüft:',n,'falsch:',bad);
// Skizze: g ⊥ k und g || h aus dem SVG nachrechnen
const svg=merkFigLines(),L=[...svg.matchAll(/<line class="gl" x1="([-0-9.]+)" y1="([-0-9.]+)" x2="([-0-9.]+)" y2="([-0-9.]+)"/g)].map(m=>m.slice(1).map(Number)).slice(0,4);
const d=l=>[l[2]-l[0],l[3]-l[1]],cr=(a,b)=>a[0]*b[1]-a[1]*b[0],dt=(a,b)=>a[0]*b[0]+a[1]*b[1];
const par=Math.abs(cr(d(L[0]),d(L[1])))<1e-9,perp=Math.abs(dt(d(L[2]),d(L[3])))<1e-9;console.log('Skizze parallel:',par,' senkrecht:',perp);
const pm=svg.match(/<path class="mark[^"]*" d="M([-0-9.]+) ([-0-9.]+) A[0-9.]+ [0-9.]+ 0 0 [01] ([-0-9.]+) ([-0-9.]+)"/);const onLine=(p,l)=>Math.abs(cr(d(l),[p[0]-l[0],p[1]-l[1]]))/Math.hypot(...d(l))<0.2;
const mOk=pm&&((onLine([+pm[1],+pm[2]],L[2])&&onLine([+pm[3],+pm[4]],L[3]))||(onLine([+pm[1],+pm[2]],L[3])&&onLine([+pm[3],+pm[4]],L[2])));console.log('Winkelbogen auf beiden Linien:',!!mOk);
// Geodreieck-Skizzen nachrechnen (1 cm = 5 Einheiten)
const gd=merkFigDraw(),at=(chk,k)=>{const m=gd.match(new RegExp('data-chk="'+chk+'"[^>]*?data-'+k+'="([^"]+)"'));return m?m[1].split(',').map(Number):null};
const dist=(p,b)=>Math.abs(cr([b[2],b[3]],[p[0]-b[0],p[1]-b[1]]));let geo=true;const G=(c,m)=>{if(!c){geo=false;console.log('GEO FEHLER',m)}};
{const b=at('a','base'),w=at('a','draw'),mid=at('a','mid');G(b&&w&&mid,'a Daten');G(Math.abs(dt([b[2],b[3]],[w[2],w[3]]))<1e-3,'a nicht senkrecht');G(dist([w[0],w[1]],b)<0.05,'a nicht durch P');G(dist([mid[0],mid[1]],b)<0.05&&dist([mid[2],mid[3]],b)<0.05,'a Mittellinie nicht auf g')}
{const b=at('b','base'),w=at('b','draw'),p=at('b','p'),h2=at('b','h2');G(b&&w&&p&&h2,'b Daten');G(Math.abs(cr([b[2],b[3]],[w[2],w[3]]))<1e-3,'b nicht parallel');G(Math.abs(w[0]-p[0])<0.01&&Math.abs(w[1]-p[1])<0.01,'b nicht durch Q');G(Math.abs(dist(p,b)-10)<0.05,'b Q nicht 2 cm von h');G(dist([h2[0],h2[1]],b)<0.05&&dist([h2[2],h2[3]],b)<0.05,'b Hilfslinie nicht auf h')}
{const b=at('c','base'),w=at('c','draw'),h2=at('c','h2');G(b&&w&&h2,'c Daten');G(Math.abs(cr([b[2],b[3]],[w[2],w[3]]))<1e-3,'c nicht parallel');G(Math.abs(dist([w[0],w[1]],b)-10)<0.05,'c Abstand nicht 2 cm');G(dist([h2[0],h2[1]],b)<0.05&&dist([h2[2],h2[3]],b)<0.05,'c Hilfslinie 2 nicht auf k')}
{const t=mgTri([0,0],[1,0],[0,1],10);G(t.V[1]===80&&t.B[0]-t.A[0]===160,'Geodreieck Maße');for(let q=1;q<=6;q++){const h=t.H(q);G(h[0][1]===q*10&&h[1][1]===q*10,'Hilfslinie '+q)}}
console.log('Geodreieck-Skizzen:',geo);
if(!geo||bad||!par||!perp||!mOk){console.log('MERK FEHLER');process.exit(1)}else console.log('MERK OK')`);
