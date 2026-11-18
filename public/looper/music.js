export const barSeconds=bpm=>240/bpm;
export function quantizeBeat(beat,help=true){return help?Math.round(beat*2)/2:beat;}
export function waveBytes(channels,sampleRate){const length=channels[0].length,n=channels.length,ab=new ArrayBuffer(44+length*n*2),v=new DataView(ab);const str=(at,s)=>{for(let i=0;i<s.length;i++)v.setUint8(at+i,s.charCodeAt(i));};str(0,'RIFF');v.setUint32(4,36+length*n*2,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,n,true);v.setUint32(24,sampleRate,true);v.setUint32(28,sampleRate*n*2,true);v.setUint16(32,n*2,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,length*n*2,true);let off=44;for(let i=0;i<length;i++)for(let ch=0;ch<n;ch++){const x=Math.max(-1,Math.min(1,channels[ch][i]||0));v.setInt16(off,x<0?x*32768:x*32767,true);off+=2;}return ab;}
export function validateProject(p){if(!p||p.format!=='divergencia-looper'||p.version!==1||!Number.isFinite(p.bpm)||p.bpm<50||p.bpm>160||!Array.isArray(p.tracks)||p.tracks.length!==4)throw Error('Este archivo no es un proyecto válido de Looper MusicAl.');for(const [i,t]of p.tracks.entries()){if(t.bars!==(i===0?4:1)||typeof t.name!=='string'||!Number.isFinite(t.volume)||t.volume<0||t.volume>1)throw Error('El proyecto contiene una pista no válida.');if(t.audio&&(typeof t.audio!=='string'||t.audio.length>16000000||!Number.isFinite(t.sourceBpm)||t.sourceBpm<30||t.sourceBpm>240))throw Error('El audio del proyecto no es válido.');}return p;}
export const presetGroups=['Aula','Pop','Hiphop','Electrónica'];
export const padSounds=['pandero','claves','maracas','triangle','kick','snare','hat','crash'];
export const presets=[
{id:'aula-base',group:'Aula',name:'Bordón que acompaña',description:'Piano real · do y sol, con espacio para improvisar.',base:true},
{id:'pop-base',group:'Pop',name:'Cuatro acordes',description:'Piano real · do, la menor, fa y sol.',base:true},
{id:'hiphop-base',group:'Hiphop',name:'Piano a contratiempo',description:'Piano real · un motivo breve en la menor.',base:true},
{id:'electro-base',group:'Electrónica',name:'Pequeño viaje',description:'Sonido electrónico · arpegio en do mayor.',base:true},
{id:'aula-ronda',group:'Aula',name:'Ronda de piano',description:'Piano real · un ostinato pentatónico de do, re, mi, sol y la.',base:true},
{id:'pop-move',group:'Pop',name:'Pop en movimiento',description:'Piano real · acordes a contratiempo sobre notas graves.',base:true},
{id:'hiphop-bass',group:'Hiphop',name:'Bajo con espacio',description:'Bajo electrónico y piano real · un diálogo en la menor.',base:true},
{id:'electro-night',group:'Electrónica',name:'Pulso nocturno',description:'Sonidos electrónicos · acordes luminosos y un bajo tranquilo.',base:true},
{id:'aula-pulse',group:'Aula',name:'El pulso del pandero',description:'Cuatro golpes para sostener al grupo.'},
{id:'aula-claves',group:'Aula',name:'Claves que conversan',description:'Un ostinato de negras y corcheas.'},
{id:'aula-shaker',group:'Aula',name:'Maracas en movimiento',description:'Ocho corcheas, una vuelta completa.'},
{id:'aula-triangle',group:'Aula',name:'Un brillo al empezar',description:'Triángulo en el primer tiempo.'},
{id:'pop-rhythm',group:'Pop',name:'Paso a paso',description:'Pandero y claves · pulso y respuesta.'},
{id:'hiphop-rhythm',group:'Hiphop',name:'Entre los pulsos',description:'Pandero grave y claves a contratiempo.'},
{id:'electro-rhythm',group:'Electrónica',name:'Motor encendido',description:'Bombo y charles reales · una base rítmica regular.'},
{id:'pop-bright',group:'Pop',name:'Luz entre acordes',description:'Maracas y triángulo · un acompañamiento ligero.'}
];
const hit=(sound,beat,volume=.8,rate=1)=>({sound,beat,volume,rate});
export function presetEvents(id){switch(id){case'aula-base':return Array.from({length:4},(_,b)=>[hit('piano',b*4,.75,.5),hit('piano',b*4,.45,Math.pow(2,-5/12))]).flat();case'pop-base':return [[0,4,7],[-3,0,4],[-7,-3,0],[-5,-1,2]].flatMap((ch,b)=>ch.flatMap(n=>[hit('piano',b*4,.43,2**(n/12)),hit('piano',b*4+2,.22,2**(n/12))]));case'hiphop-base':return [0,3,4,7,8,11,12,14.5].flatMap((b,i)=>[hit('piano',b,.6,2**([-3,0,4,7][i%4]/12)),hit('piano',b,.3,2**(-15/12))]);case'electro-base':return Array.from({length:32},(_,i)=>hit('synth',i*.5,.5,2**([0,4,7,12,7,4,0,7][i%8]/12)));case'aula-ronda':return Array.from({length:4},(_,b)=>[0,2,4,7,9,7,4,2].map((n,i)=>hit('piano',b*4+i*.5,i===0?.65:.42,2**(n/12)))).flat();
case'pop-move':return [[0,4,7],[-7,-3,0],[-3,0,4],[-5,-1,2]].flatMap((ch,b)=>[hit('piano',b*4,.6,2**((ch[0]-12)/12)),...[.5,1.5,3].flatMap(beat=>ch.map(n=>hit('piano',b*4+beat,.3,2**(n/12))))]);
case'hiphop-bass':return Array.from({length:4},(_,b)=>{const root=[-3,-3,-7,-5][b];return [hit('synth',b*4,.7,2**((root-24)/12)),hit('synth',b*4+1.5,.5,2**((root-24)/12)),hit('synth',b*4+2.5,.6,2**((root-17)/12)),hit('piano',b*4+1,.34,2**(root/12)),hit('piano',b*4+3,.3,2**((root+7)/12))];}).flat();
case'electro-night':return [[0,4,7],[-3,0,4],[-7,-3,0],[-5,-1,2]].flatMap((ch,b)=>[hit('synth',b*4,.65,2**((ch[0]-24)/12)),hit('synth',b*4+2,.45,2**((ch[0]-24)/12)),...ch.flatMap((n,i)=>[hit('synth',b*4+i*.5,.28,2**(n/12)),hit('synth',b*4+2+i*.5,.24,2**((n+12)/12))])]);
case'aula-pulse':return [0,1,2,3].map(b=>hit('pandero',b));case'aula-claves':return [0,1,1.5,2.5,3].map(b=>hit('claves',b));case'aula-shaker':return Array.from({length:8},(_,i)=>hit('maracas',i*.5,i%2?.45:.7));case'aula-triangle':return [hit('triangle',0,.5)];case'pop-rhythm':return [hit('pandero',0),hit('claves',1,.65),hit('pandero',2),hit('claves',3,.65)];case'hiphop-rhythm':return [hit('pandero',0),hit('pandero',1.5,.6),hit('claves',1,.7),hit('claves',3,.7),hit('maracas',2.5,.4),hit('pandero',2.5,.7)];case'electro-rhythm':return [0,1,2,3].map(b=>hit('kick',b,.7)).concat(Array.from({length:8},(_,i)=>hit('hat',i*.5,.3)));case'pop-bright':return [hit('triangle',0,.35),...[.5,1.5,2.5,3.5].map(b=>hit('maracas',b,.5))];default:throw Error('No se encuentra ese sonido.');}}
