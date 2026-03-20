/* chat.js — Eduardo.AI v2026.03.20
   Clean minimal engine. ES5 + full WebKit/watchOS.
*/
(function(W,D){
'use strict';

var MIN_SCORE=2,TOP_N=2;
var lang='pt',busy=false,history=[],opI=0;

var $msgs=D.getElementById('messages');
var $wrap=D.getElementById('messages-wrap');
var $inp=D.getElementById('chat-input');
var $send=D.getElementById('send-btn');
var $typ=D.getElementById('typing');
var $sdot=D.getElementById('status-dot');
var $stxt=D.getElementById('status-text');
var $disc=D.getElementById('disc');
var $lbtns=D.getElementsByClassName('lang-btn');

/* strings */
var S={
  ph:{pt:'mensagem ou código CID (ex: F20)…',en:'message or ICD code (e.g. F20)…',es:'mensaje o código CIE (ej: F20)…'},
  online:{pt:'online',en:'online',es:'en línea'},
  busy:{pt:'buscando…',en:'searching…',es:'buscando…'},
  typing:{pt:'Eduardo.AI está digitando…',en:'Eduardo.AI is typing…',es:'Eduardo.AI está escribiendo…'},
  disc:{pt:'uso educacional · não substitui profissional',en:'educational use · not a substitute for professional advice',es:'uso educativo · no sustituye a un profesional'},
  nf:{pt:'Não encontrei informações sobre isso. Tente perguntar sobre tecnologia, ciência, física, história, medicina ou evolução.',en:"Couldn't find that. Try asking about tech, science, physics, history, medicine or evolution.",es:'No encontré eso. Prueba con tecnología, ciencia, física, historia, medicina o evolución.'},
  hint:{pt:'Talvez você queira saber sobre: ',en:'Maybe you want to know about: ',es:'Quizás te interese: '},
  icdh:{pt:'CID-10: ',en:'ICD-10: ',es:'CIE-10: '},
  icdd:{pt:'\n\n⚠ Informação educacional. Consulte um profissional de saúde.',en:'\n\n⚠ Educational only. Consult a healthcare professional.',es:'\n\n⚠ Solo educativo. Consulte a un profesional de salud.'},
  icdm:{pt:'Código não encontrado. Ver: https://icd.who.int',en:'Code not found. See: https://icd.who.int',es:'Código no encontrado. Ver: https://icd.who.int'}
};
function s(k){var e=S[k];return e?(e[lang]||e.pt):''}

var OP={
  pt:['','Sobre isso: ','','Claro: ','','Boa pergunta! '],
  en:['','About that: ','','Sure: ','','Good question! '],
  es:['','Sobre eso: ','','Claro: ','','¡Buena pregunta! ']
};
function op(){var l=OP[lang]||OP.pt,o=l[opI%l.length];opI++;return o}

/* helpers */
function norm(t){return String(t).toLowerCase().replace(/[^a-záàãâéêíóôõúüçñ\s0-9]/g,' ').replace(/\s+/g,' ').trim()}
function tok(t){return norm(t).split(' ').filter(function(w){return w.length>2})}
function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function hms(){var d=new Date();return('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)+':'+('0'+d.getSeconds()).slice(-2)}

/* render markdown-ish */
function rend(text){
  if(!text)return'';
  var lks=[],PH='\x00';
  var o=String(text).replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g,function(_,u,l){
    var safe=/^(https?:|mailto:)/.test(u.trim())?u.trim():'#';
    lks.push({u:safe,l:l});return PH+(lks.length-1)+PH;
  });
  o=esc(o);
  o=o.replace(new RegExp(esc(PH)+'(\\d+)'+esc(PH),'g'),function(_,i){
    var lk=lks[parseInt(i,10)];if(!lk)return'';
    return'<a href="'+lk.u+'" target="_blank" rel="noopener">'+esc(lk.l)+'</a>';
  });
  o=o.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  o=o.replace(/\n/g,'<br>');
  return o;
}

/* append one message line */
function line(text,role,type){
  var wrap=D.createElement('div');
  wrap.className='msg-line';

  /* meta column: time + who */
  var meta=D.createElement('div');
  meta.className='ml-meta';

  var tm=D.createElement('span');
  tm.className='ml-time';
  tm.textContent=hms();

  var who=D.createElement('span');
  who.className='ml-who '+(role==='user'?'you':'ai');
  who.textContent=role==='user'?(lang==='pt'?'você':lang==='es'?'tú':'you'):'ai';

  meta.appendChild(tm);
  meta.appendChild(who);

  /* body */
  var body=D.createElement('div');
  var isICD=type&&type.indexOf('icd:')===0;
  body.className='ml-body '+(role==='user'?'you':role==='sys'?'sys':isICD?'icd':'ai');

  if(role==='user'||role==='sys'){body.textContent=text;}
  else{body.innerHTML=rend(text);}

  wrap.appendChild(meta);
  wrap.appendChild(body);
  if($msgs)$msgs.appendChild(wrap);

  var entry=null;
  if(role==='bot'){
    entry={wrap:wrap,body:body,who:who,type:type||'kb',origQ:null};
    history.push(entry);
  }
  scroll();
  return entry;
}

function divider(t){
  var el=D.createElement('div');el.className='msg-div';
  el.textContent=t||'';
  if($msgs)$msgs.appendChild(el);scroll();
}

function scroll(){
  if(!$wrap)return;
  if(W.requestAnimationFrame){
    W.requestAnimationFrame(function(){$wrap.scrollTop=$wrap.scrollHeight});
  }else{$wrap.scrollTop=$wrap.scrollHeight}
}

/* typing */
function showTyping(){
  if($typ){$typ.setAttribute('aria-label',s('typing'));$typ.className='on'}
  if($sdot){$sdot.className='busy'}
  if($stxt)$stxt.textContent=s('busy');
  scroll();
}
function hideTyping(){
  if($typ)$typ.className='';
  if($sdot)$sdot.className='';
  if($stxt)$stxt.textContent=s('online');
}

/* identity */
var IDR=[
  /^(ol[aá]|oi|hey|hi|hello|hola|buenas)[\s!?]*$/i,
  /\b(quem [eé] voc[eê]|who are you|qui[eé]n eres|o que [eé] eduardo|what is eduardo|qu[eé] es eduardo)\b/i,
  /^eduardo(\.ai?)?[\s!?]*$/i,
  /\b(se apresente|introduce yourself|preséntate)\b/i
];
function isID(t){for(var i=0;i<IDR.length;i++)if(IDR[i].test(t))return true;return false}
function idAns(){
  var id=W.IDENTITY;
  if(id&&id.greeting&&id.greeting[lang])return id.greeting[lang];
  var nm=(id&&id.name)||'Eduardo Souza Rodrigues';
  return({
    pt:'Olá! Sou Eduardo.AI, assistente de '+nm+'. Posso ajudar com tecnologia, ciência, física, história, medicina (CID-10) e muito mais.',
    en:"Hi! I'm Eduardo.AI, "+nm+"'s assistant. Ask me about tech, science, physics, history, medicine (ICD-10) and more.",
    es:'¡Hola! Soy Eduardo.AI, asistente de '+nm+'. Pregúntame sobre tecnología, ciencia, física, historia, medicina (CIE-10) y más.'
  })[lang]||''
}

/* ICD */
var ICDR=/^([A-Za-z]\d{2}(\.\d{1,2})?)$/;
function icdCode(t){var x=t.trim();return ICDR.test(x)?x.toUpperCase():null}
function icdAns(code){
  if(typeof W.lookupICDCode!=='function')return null;
  var r=W.lookupICDCode(code,lang);
  if(!r)return s('icdh')+code+'\n\n'+s('icdm');
  return s('icdh')+code+' — '+r.label+'\n\n'+r.detail+s('icdd');
}

/* KB */
function buildKB(lc){
  var kb={};
  var plugs=W.EduardoKB;
  if(plugs&&plugs.length){
    var sorted=plugs.slice().sort(function(a,b){return(b.priority||0)-(a.priority||0)});
    for(var p=0;p<sorted.length;p++){
      var ld=sorted[p].lang;if(!ld)continue;
      var en=ld[lc]||ld['pt'];if(!en)continue;
      var ks=Object.keys(en);
      for(var k=0;k<ks.length;k++)if(!kb[ks[k]])kb[ks[k]]=en[ks[k]];
    }
  }
  var ac=W.ANSWER_CACHE&&W.ANSWER_CACHE[lc];
  if(ac){var aks=Object.keys(ac);for(var i=0;i<aks.length;i++)if(aks[i]!=='unknown'&&aks[i]!=='default'&&!kb[aks[i]])kb[aks[i]]=ac[aks[i]];}
  return kb;
}

function scoreAll(q,lc){
  var kb=buildKB(lc),qr=norm(q),qt=tok(q),sc=[],ks=Object.keys(kb);
  for(var i=0;i<ks.length;i++){
    var key=ks[i],ans=kb[key];
    if(!ans||typeof ans!=='string'||ans.length<8)continue;
    var cl=ans.replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g,'$1').replace(/\*\*([^*]+)\*\*/g,'$1').replace(/\n/g,' ').toLowerCase();
    var kl=key.replace(/_/g,' ').toLowerCase();
    var score=0;
    if(cl.indexOf(qr)>=0)score+=12;
    if(kl.indexOf(qr)>=0)score+=12;
    if(qt.length>0){var ok=true;for(var w=0;w<qt.length;w++){if(cl.indexOf(qt[w])<0&&kl.indexOf(qt[w])<0){ok=false;break}}if(ok)score+=6}
    for(var w2=0;w2<qt.length;w2++){
      var qw=qt[w2];
      if(kl.indexOf(qw)>=0)score+=4;else if(cl.indexOf(qw)>=0)score+=1;
      if(qw.length>=4){var st=qw.slice(0,4);if(kl.indexOf(st)>=0)score+=2;else if(cl.indexOf(st)>=0)score+=0.5}
    }
    if(score>=MIN_SCORE)sc.push({key:key,answer:ans,score:score});
  }
  sc.sort(function(a,b){return b.score-a.score});
  return sc;
}

function reply(q,lc){
  var r=scoreAll(q,lc);if(!r.length)return null;
  var top=r.slice(0,TOP_N);
  if(top.length>1&&top[0].score>top[1].score*1.8)top=[top[0]];
  var parts=[];for(var i=0;i<top.length;i++)parts.push(top[i].answer.replace(/\n{3,}/g,'\n\n').trim());
  return op()+parts.join('\n\n—\n\n');
}

function fallback(q,lc){
  var kb=buildKB(lc),qt=tok(q),hints=[],ks=Object.keys(kb);
  for(var i=0;i<ks.length&&hints.length<4;i++){
    var kl=ks[i].replace(/_/g,' ').toLowerCase();
    for(var w=0;w<qt.length;w++){
      if(kl.indexOf(qt[w])>=0||(qt[w].length>=4&&kl.indexOf(qt[w].slice(0,4))>=0)){hints.push('**'+ks[i].replace(/_/g,' ')+'**');break}
    }
  }
  if(hints.length)return s('hint')+hints.join(', ')+'.';
  return s('nf');
}

/* retranslate */
function retrans(nl){
  for(var i=0;i<history.length;i++){
    var e=history[i];if(!e||!e.body)continue;
    if(e.who)e.who.textContent='ai';
    var t=e.type||'kb',txt=null;
    if(t==='identity'||t==='greeting')txt=(W.GREETINGS&&W.GREETINGS[nl])||idAns();
    else if(t&&t.indexOf('icd:')===0)txt=icdAns(t.slice(4));
    else if(e.origQ)txt=reply(e.origQ,nl)||fallback(e.origQ,nl);
    if(txt)e.body.innerHTML=rend(txt);
  }
}

/* language */
function applyLang(l){
  var prev=lang;lang=l;
  for(var i=0;i<$lbtns.length;i++){
    var b=$lbtns[i];b.className=b.getAttribute('data-lang')===l?'lang-btn active':'lang-btn';
  }
  if($inp)$inp.placeholder=s('ph');
  if($disc)$disc.textContent=s('disc');
  if($stxt)$stxt.textContent=s('online');
  if(l!==prev)retrans(l);
}

for(var li=0;li<$lbtns.length;li++){
  (function(b){b.addEventListener('click',function(){applyLang(b.getAttribute('data-lang')||'pt')},false)}($lbtns[li]));
}

/* send */
function send(){
  if(busy||!$inp)return;
  var text=$inp.value.trim();if(!text)return;
  var al=lang;$inp.value='';busy=true;
  if($send)$send.disabled=true;

  line(text,'user','user');

  if(isID(text)){deliver(idAns(),'identity',null);return}

  var ic=icdCode(text);
  if(ic){var ir=icdAns(ic);if(ir){deliver(ir,'icd:'+ic,null);return}}

  showTyping();
  setTimeout(function(){
    hideTyping();
    var r=reply(text,al)||fallback(text,al);
    var e=deliver(r,'kb',text);
    if(e)e.origQ=text;
  },160);
}

function deliver(text,type,origQ){
  hideTyping();
  var e=line(text,'bot',type);
  if(e&&origQ)e.origQ=origQ;
  busy=false;
  if($send)$send.disabled=false;
  return e;
}

/* input events */
if($inp){
  $inp.addEventListener('keydown',function(e){
    var k=e.key||e.keyCode;
    if((k==='Enter'||k===13)&&!e.shiftKey){if(e.preventDefault)e.preventDefault();send()}
  },false);
  $inp.addEventListener('input',function(){if($send)$send.disabled=!$inp.value.trim()},false);
}
if($send)$send.addEventListener('click',function(){send()},false);

/* Ctrl+L clear */
D.addEventListener('keydown',function(e){
  if((e.ctrlKey||e.metaKey)&&(e.key==='l'||e.key==='L'||e.keyCode===76)){
    if($msgs)$msgs.innerHTML='';history=[];divider('cleared');
  }
},false);

/* greeting */
function greet(){
  var day=new Date().toLocaleDateString(
    lang==='en'?'en-US':lang==='es'?'es-ES':'pt-BR',
    {weekday:'long',year:'numeric',month:'long',day:'numeric'}
  );
  divider(day);
  var gt=(W.GREETINGS&&W.GREETINGS[lang])||idAns();
  var e=line(gt,'bot','greeting');if(e)e.type='greeting';
}

/* iOS viewport */
function fixVP(){
  var vp=W.visualViewport;
  var h=vp?Math.round(vp.height):W.innerHeight;
  var app=D.getElementById('app');
  if(app)app.style.height=h+'px';
  scroll();
}
if(W.visualViewport){
  W.visualViewport.addEventListener('resize',fixVP,{passive:true});
  W.visualViewport.addEventListener('scroll',fixVP,{passive:true});
}else{W.addEventListener('resize',fixVP,{passive:true})}

/* boot */
function boot(){
  applyLang('pt');
  if($inp)$inp.disabled=false;
  greet();
  setTimeout(function(){if(!('ontouchstart' in W)&&$inp)$inp.focus()},350);
}

if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,false);else boot();
W.chatSend=send;

}(window,document));
