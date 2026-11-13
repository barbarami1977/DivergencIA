const json=(x,status=200)=>new Response(JSON.stringify(x),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Allow-Methods':'GET, POST, OPTIONS'}});
const error=(s,status=400)=>{throw Object.assign(new Error(s),{status})};
const same=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
function view(r,token){const host=token===r.host;const me=r.players.find(p=>p.token===token);if(!host&&!me)error('Vuelve a entrar con el código de sala.',403);return {code:r.code,role:host?'teacher':'student',phase:r.phase,round:r.round,version:r.version,mode:r.mode,speed:r.speed,instrument:r.instrument||'piano',sequence:host&&r.phase==='listen'?r.sequence:undefined,players:host?r.players.map(p=>({id:p.id,name:p.name,active:p.active,result:r.answers[p.id]?.correct===true?'correct':r.answers[p.id]?'wrong':'pending',answered:!!r.answers[p.id]})):undefined,active:r.players.filter(p=>p.active).length,total:r.players.length,submitted:Object.keys(r.answers).length,me:me?{id:me.id,name:me.name,active:me.active,answered:!!r.answers[me.id],correct:['review','winner','tie'].includes(r.phase)?r.answers[me.id]?.correct:undefined}:undefined,winner:r.winner?{name:r.winner.name}:null};}
async function api(request,env){if(request.method==='OPTIONS')return json({});const url=new URL(request.url);const token=request.headers.get('Authorization')?.replace(/^Bearer /,'')||'';try{
 if(!env.DB)error('El modo aula aún no está disponible.',503);
 let body={};if(request.method==='POST'){if(Number(request.headers.get('content-length'))>4096)error('Respuesta demasiado larga.');body=await request.json()}
 const action=body.action||'state';
 if(action==='create'){
  await env.DB.prepare('DELETE FROM music_rooms WHERE expires < ?').bind(Date.now()).run();
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';const code=Array.from(crypto.getRandomValues(new Uint8Array(6)),n=>alphabet[n%alphabet.length]).join('');
  const host=crypto.randomUUID(),r={code,host,players:[],answers:{},sequence:[],round:0,phase:'lobby',version:0,mode:body.mode==='ear'?'ear':'lights',instrument:['marimba','flute'].includes(body.instrument)?body.instrument:'piano',speed:['slow','normal','fast'].includes(body.speed)?body.speed:'normal',winner:null};
  await env.DB.prepare('INSERT INTO music_rooms (code,state,revision,expires) VALUES (?,?,0,?)').bind(code,JSON.stringify(r),Date.now()+6*3600000).run();return json({token:host,room:view(r,host)});
 }
 const code=String(body.code||url.searchParams.get('code')||'').toUpperCase().trim();if(!/^[A-Z2-9]{6}$/.test(code))error('Introduce el código de seis caracteres.');
 for(let retry=0;retry<8;retry++){
  const row=await env.DB.prepare('SELECT state,revision,expires FROM music_rooms WHERE code=?').bind(code).first();if(!row||row.expires<Date.now())error('La sala no existe o ha caducado.',404);const r=JSON.parse(row.state);
  if(request.method==='GET')return json({room:view(r,token)});
  let issuedToken=token;
  if(action==='join'){
   if(r.phase!=='lobby')error('La partida ya ha empezado. Espera a la próxima.');if(r.players.length>=40)error('La sala está completa.');const name=String(body.name||'').trim().replace(/[<>\x00-\x1f]/g,'').slice(0,24);if(!name)error('Escribe un alias.');if(r.players.some(p=>p.name.toLocaleLowerCase()===name.toLocaleLowerCase()))error('Ese alias ya está ocupado. Elige otro.');issuedToken=crypto.randomUUID();r.players.push({id:crypto.randomUUID(),token:issuedToken,name,active:true});
  }else if(action==='answer'){
   const p=r.players.find(p=>p.token===token);if(!p)error('No tienes acceso a esta respuesta.',403);if(r.phase!=='respond'||body.round!==r.round||!p.active)error('Esta ronda no acepta más respuestas.');if(!r.answers[p.id]){const answer=body.notes;if(!Array.isArray(answer)||answer.length!==r.sequence.length||!answer.every(n=>Number.isInteger(n)&&n>=0&&n<5))error('Completa la secuencia antes de enviarla.');r.answers[p.id]={correct:same(answer,r.sequence)};}
  }else{
   if(token!==r.host)error('Solo el docente puede controlar la partida.',403);
   if(action==='next'){
    if(!['lobby','review','tie'].includes(r.phase))error('Cierra la ronda actual antes de continuar.');if(r.players.filter(p=>p.active).length<1&&r.phase==='lobby')error('Necesitas al menos un participante.');
    if(r.phase==='tie'){r.players.forEach(p=>p.active=r.contenders.includes(p.id))}else{r.sequence.push(crypto.getRandomValues(new Uint8Array(1))[0]%5);r.round++}
    r.contenders=r.players.filter(p=>p.active).map(p=>p.id);r.answers={};r.phase='listen';r.version++;
   }else if(action==='open'){if(r.phase!=='listen'||body.round!==r.round)error('La ronda ya ha cambiado.');r.phase='respond';}
   else if(action==='close'){
    if(r.phase!=='respond')error('La ronda no está abierta.');r.players.filter(p=>p.active).forEach(p=>{if(!r.answers[p.id])r.answers[p.id]={correct:false};p.active=r.answers[p.id].correct});const alive=r.players.filter(p=>p.active);if(alive.length===1&&r.players.length>1){r.winner={name:alive[0].name};r.phase='winner'}else if(!alive.length){r.phase='tie'}else r.phase='review';
   }else if(action==='reset'){r.players.forEach(p=>p.active=true);r.answers={};r.sequence=[];r.round=0;r.phase='lobby';r.winner=null;r.version++;}
   else if(action==='end'){r.phase='ended';r.winner=null;r.players=[];r.answers={};r.sequence=[];}
   else error('Acción desconocida.');
  }
  const changed=await env.DB.prepare('UPDATE music_rooms SET state=?,revision=revision+1 WHERE code=? AND revision=?').bind(JSON.stringify(r),code,row.revision).run();if(changed.meta.changes)return json({token:issuedToken,room:view(r,issuedToken)});
 }
 error('Hay muchas respuestas a la vez. Vuelve a intentarlo.',409);
 }catch(e){return json({error:e.status?e.message:'No hemos podido conectar con la sala. Inténtalo de nuevo.'},e.status||500)}}
export {api};
