/* chat.js — Eduardo.AI v2026.03.20
   Robust input normalization: handles typos, missing accents,
   abbreviations, leetspeak, mixed case, extra spaces, slang.
   ES5 + full WebKit/watchOS compatible.
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

var S={
  ph:{pt:'mensagem, cálculo ou código CID… (ex: "o que é metal", "F20", "2^10")',en:'message, calculation or ICD code… (e.g. "what is metal", "F20", "2^10")',es:'mensaje, cálculo o código CIE… (ej: "qué es metal", "F20", "2^10")'},
  online:{pt:'online',en:'online',es:'en línea'},
  busy:{pt:'calculando…',en:'calculating…',es:'calculando…'},
  busyKB:{pt:'buscando…',en:'searching…',es:'buscando…'},
  typing:{pt:'Eduardo.AI está digitando…',en:'Eduardo.AI is typing…',es:'Eduardo.AI está escribiendo…'},
  disc:{pt:'uso educacional · não substitui profissional',en:'educational use · not professional advice',es:'uso educativo · no sustituye al profesional'},
  nf:{pt:'Não encontrei isso. Tente: ciência, matemática, história, medicina, tecnologia, dicionário.\n\n**Cálculos:** "2^10", "sqrt(144)", "15% de 200"\n**Dicionário:** "o que é banana", "o que é átomo"\n**Medicina:** "F20", "I21"',en:"Couldn't find that. Try: science, math, history, medicine, technology, dictionary.\n\n**Calc:** \"2^10\", \"sqrt(144)\"\n**Dict:** \"what is banana\", \"what is atom\"\n**Medicine:** \"F20\", \"I21\"",es:'No encontré eso. Prueba: ciencia, matemáticas, historia, medicina, tecnología.\n\n**Cálculos:** "2^10", "sqrt(144)"\n**Diccionario:** "qué es banana"\n**Medicina:** "F20", "I21"'},
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

/* ═══════════════════════════════════════════
   INPUT NORMALIZATION ENGINE
   Converts raw user input into a clean,
   accent-free, lowercase, expanded form
   that the KB scorer can match reliably.
═══════════════════════════════════════════ */

/* 1. Remove all diacritics / accents */
function removeAccents(s){
  return String(s)
    .replace(/[áàãâä]/g,'a')
    .replace(/[éèêë]/g,'e')
    .replace(/[íìîï]/g,'i')
    .replace(/[óòõôö]/g,'o')
    .replace(/[úùûü]/g,'u')
    .replace(/[ç]/g,'c')
    .replace(/[ñ]/g,'n')
    .replace(/[ý]/g,'y')
    .replace(/[æ]/g,'ae')
    .replace(/[ø]/g,'o')
    .replace(/[ß]/g,'ss');
}

/* 2. Common abbreviations → full form */
var ABBREV = [
  /* Portuguese */
  [/\btb\b/g,'tambem'],
  [/\btbm\b/g,'tambem'],
  [/\btb\b/g,'tambem'],
  [/\bpq\b/g,'porque'],
  [/\bporq\b/g,'porque'],
  [/\bpq\b/g,'porque'],
  [/\bkd\b/g,'onde esta'],
  [/\bcd\b/g,'onde esta'],
  [/\bmto\b/g,'muito'],
  [/\bmtu\b/g,'muito'],
  [/\bmt\b/g,'muito'],
  [/\bvc\b/g,'voce'],
  [/\bvcs\b/g,'voces'],
  [/\bvc\b/g,'voce'],
  [/\bblz\b/g,'beleza ok'],
  [/\bflw\b/g,'falou tchau'],
  [/\bvlw\b/g,'valeu obrigado'],
  [/\bmsm\b/g,'mesmo'],
  [/\bsmp\b/g,'sempre'],
  [/\bpfv\b/g,'por favor'],
  [/\bpf\b/g,'por favor'],
  [/\bóbg\b/g,'obrigado'],
  [/\bobg\b/g,'obrigado'],
  [/\bobgd\b/g,'obrigado'],
  [/\brsrs\b/g,'risos'],
  [/\bhahaha\b/g,'risos'],
  [/\bhehe\b/g,'risos'],
  [/\bkkkk+\b/g,'risos'],
  [/\bkkk\b/g,'risos'],
  [/\bq\b/g,'que'],
  [/\bpra\b/g,'para'],
  [/\bpras\b/g,'para as'],
  [/\bta\b/g,'esta'],
  [/\btá\b/g,'esta'],
  [/\bnao\b/g,'nao'],
  [/\bsim\b/g,'sim'],
  [/\bhj\b/g,'hoje'],
  [/\bamh\b/g,'amanha'],
  [/\bont\b/g,'ontem'],
  [/\bqdo\b/g,'quando'],
  [/\bqndo\b/g,'quando'],
  [/\bqto\b/g,'quanto'],
  [/\bqnto\b/g,'quanto'],
  [/\bokei\b/g,'ok'],
  [/\boq\b/g,'o que'],
  [/\boque\b/g,'o que'],
  [/\bwhat'?s\b/g,'what is'],
  [/\bwhats\b/g,'what is'],
  [/\bdnv\b/g,'de novo'],
  [/\btlg\b/g,'também'],
  [/\bsdd\b/g,'saudade'],
  [/\bsds\b/g,'saudade'],
  /* English */
  [/\bu\b/g,'you'],
  [/\bur\b/g,'your'],
  [/\bb4\b/g,'before'],
  [/\bb\/c\b/g,'because'],
  [/\bbcuz\b/g,'because'],
  [/\bcuz\b/g,'because'],
  [/\bidk\b/g,'i dont know'],
  [/\bimo\b/g,'in my opinion'],
  [/\bimho\b/g,'in my opinion'],
  [/\bfyi\b/g,'for your information'],
  [/\basap\b/g,'as soon as possible'],
  [/\bomg\b/g,'oh my'],
  [/\bwtf\b/g,'what'],
  [/\blol\b/g,'funny'],
  [/\bbfn\b/g,'bye'],
  [/\bthx\b/g,'thanks'],
  [/\bthnx\b/g,'thanks'],
  [/\btx\b/g,'thanks'],
  [/\bgr8\b/g,'great'],
  [/\bn8\b/g,'night'],
  [/\bw\//g,'with '],
  [/\bw\/o\b/g,'without'],
  [/\bpls\b/g,'please'],
  [/\bplz\b/g,'please'],
  [/\bplease\b/g,'please'],
  [/\babt\b/g,'about'],
  [/\btbh\b/g,'to be honest'],
  [/\bngl\b/g,'not gonna lie'],
  [/\bbrb\b/g,'be right back'],
  [/\bafk\b/g,'away'],
  [/\bidk\b/g,'dont know'],
  [/\bsmh\b/g,''],
  [/\bfr\b/g,'for real'],
  [/\bnvm\b/g,'nevermind'],
  /* Spanish */
  [/\bxq\b/g,'porque'],
  [/\bxfa\b/g,'por favor'],
  [/\bxf\b/g,'por favor'],
  [/\bxa\b/g,'para'],
  [/\btb\b/g,'tambien'],
  [/\bq\b/g,'que'],
  [/[¿¡]/g,''],
  /* Common typo corrections */
  [/\bporquê\b/g,'porque'],
  [/\bvocê\b/g,'voce'],
  [/\batravés\b/g,'atraves'],
  [/\bcaráter\b/g,'carater'],
];

/* 3. Common word-level typo pairs (Portuguese focus) */
var TYPOS = {
  'quimica':'quimica',
  'quimia':'quimica',
  'chimia':'quimica',
  'matematica':'matematica',
  'matematiks':'matematica',
  'matematic':'matematica',
  'fisika':'fisica',
  'fisic':'fisica',
  'hisotria':'historia',
  'hsitoria':'historia',
  'istoria':'historia',
  'estoria':'historia',
  'medicinia':'medicina',
  'medecina':'medicina',
  'mediicna':'medicina',
  'psicologya':'psicologia',
  'psicolgia':'psicologia',
  'tecnolgia':'tecnologia',
  'techologia':'tecnologia',
  'technologia':'tecnologia',
  'tecnologia':'tecnologia',
  'informatica':'informatica',
  'computacao':'computacao',
  'progamacao':'programacao',
  'programcao':'programacao',
  'programacao':'programacao',
  'javascript':'javascript',
  'javscript':'javascript',
  'javacsript':'javascript',
  'phython':'python',
  'pyhton':'python',
  'pythn':'python',
  'pytho':'python',
  'relatividade':'relatividade',
  'relativdade':'relatividade',
  'relativiade':'relatividade',
  'quantica':'quantica',
  'kwantica':'quantica',
  'evolucao':'evolucao',
  'evolcao':'evolucao',
  'evoluçao':'evolucao',
  'darwin':'darwin',
  'inteligencia':'inteligencia',
  'intelgencia':'inteligencia',
  'inteligecia':'inteligencia',
  'artificial':'artificial',
  'artifical':'artificial',
  'atomo':'atomo',
  'atómo':'atomo',
  'enxaqueca':'enxaqueca',
  'enxaqueka':'enxaqueca',
  'migrena':'enxaqueca',
  'migrânea':'enxaqueca',
  'diabetes':'diabetes',
  'diabets':'diabetes',
  'diab':'diabetes',
  'hipertensao':'hipertensao',
  'hipertenção':'hipertensao',
  'pressao':'pressao',
  'cancer':'cancer',
  'canser':'cancer',
  'kanser':'cancer',
  'alzheimer':'alzheimer',
  'alzeimer':'alzheimer',
  'alzaimer':'alzheimer',
  'parkinsons':'parkinson',
  'parkinson':'parkinson',
  'depressao':'depressao',
  'depressa':'depressao',
  'ansiedade':'ansiedade',
  'ansiedad':'ansiedade',
  'esquizofrenia':'esquizofrenia',
  'esquizofre':'esquizofrenia',
  'vcê':'voce',
  'vc':'voce',
  'banana':'banana',
  'bananna':'banana',
  'banan':'banana',
  'morango':'morango',
  'mornago':'morango',
  'strawbery':'strawberry',
  'strawbeery':'strawberry',
  'maça':'maca',
  'maca':'maca',
  'laranaja':'laranja',
  'laraja':'laranja',
  'computdor':'computador',
  'computadr':'computador',
  'celulr':'celular',
  'celuler':'celular',
  'telefon':'telefone',
  'agua':'agua',
  'agua':'agua',
  'café':'cafe',
  'caffe':'cafe',
  'coffe':'coffee',
  'cofee':'coffee',
  'Brasil':'brasil',
  'brasil':'brasil',
  'brazill':'brasil',
  'brazile':'brasil',
};

/* 4. Language detection hints (helps with cross-lang queries) */
var LANG_HINTS_PT = /\b(que|como|onde|quando|porque|voce|para|com|uma|uma|por|mais|mas|muito|nao|sim|tambem|agora|depois|antes|sempre|nunca|ainda|cada|outro|toda|tudo|algo|nada|alguem|ningue)\b/i;
var LANG_HINTS_ES = /\b(que|como|donde|cuando|porque|usted|para|con|una|por|más|pero|mucho|no|si|también|ahora|después|antes|siempre|nunca|todavía|cada|otro|toda|todo|algo|nada|alguien|nadie)\b/i;
var LANG_HINTS_EN = /\b(what|how|where|when|why|you|for|with|the|and|but|very|not|yes|also|now|after|before|always|never|still|every|other|all|something|nothing|someone)\b/i;

function detectLang(text) {
  var t = text.toLowerCase();
  var ptScore = (t.match(LANG_HINTS_PT) || []).length;
  var esScore = (t.match(LANG_HINTS_ES) || []).length;
  var enScore = (t.match(LANG_HINTS_EN) || []).length;
  if (ptScore > esScore && ptScore > enScore) return 'pt';
  if (esScore > ptScore && esScore > enScore) return 'es';
  if (enScore > ptScore && enScore > esScore) return 'en';
  return null; /* inconclusive — keep current */
}

/* 5. Master normalization function */
function normalizeInput(raw) {
  var t = String(raw).trim();

  /* Strip leading/trailing punctuation and emojis */
  t = t.replace(/^[\s\u2000-\u206F\u2E00-\u2E7F'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~\uFE00-\uFEFF]+/, '');
  t = t.replace(/[\s\u2000-\u206F\u2E00-\u2E7F'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~\uFE00-\uFEFF]+$/, '');

  /* Lower case */
  t = t.toLowerCase();

  /* Apply abbreviation expansions */
  for (var i = 0; i < ABBREV.length; i++) {
    t = t.replace(ABBREV[i][0], ABBREV[i][1]);
  }

  /* Remove accents */
  t = removeAccents(t);

  /* Collapse repeated characters (ex: "banaaana" → "banana", "mtooo" → "mto") */
  t = t.replace(/(.)\1{2,}/g, '$1');

  /* Normalize whitespace */
  t = t.replace(/\s+/g, ' ').trim();

  /* Word-level typo corrections */
  var words = t.split(' ');
  for (var w = 0; w < words.length; w++) {
    if (TYPOS[words[w]]) words[w] = TYPOS[words[w]];
  }
  t = words.join(' ');

  return t;
}

/* Unified norm used for both query and KB matching */
function norm(t) {
  return normalizeInput(String(t))
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tok(t) {
  return norm(t).split(' ').filter(function(w){ return w.length > 2; });
}

function esc(t){
  return String(t)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function hms(){
  var d=new Date();
  return('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)+':'+('0'+d.getSeconds()).slice(-2);
}

/* ── RENDER ── */
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
  o=o.replace(/_\(([^)]+)\)_/g,'<em>$1</em>');
  o=o.replace(/\n/g,'<br>');
  return o;
}

/* ── MESSAGE LINE ── */
function line(text,role,type){
  var wrap=D.createElement('div');
  wrap.className='msg-line';
  var meta=D.createElement('div');meta.className='ml-meta';
  var tm=D.createElement('span');tm.className='ml-time';tm.textContent=hms();
  var who=D.createElement('span');who.className='ml-who '+(role==='user'?'you':'ai');
  who.textContent=role==='user'?(lang==='pt'?'você':lang==='es'?'tú':'you'):'ai';
  meta.appendChild(tm);meta.appendChild(who);
  var body=D.createElement('div');
  var isICD=type&&type.indexOf('icd:')===0;
  var isMath=type==='math';
  body.className='ml-body '+(role==='user'?'you':role==='sys'?'sys':isICD?'icd':isMath?'math':'ai');
  if(role==='user'||role==='sys'){body.textContent=text;}
  else{body.innerHTML=rend(text);}
  wrap.appendChild(meta);wrap.appendChild(body);
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
  var el=D.createElement('div');el.className='msg-div';el.textContent=t||'';
  if($msgs)$msgs.appendChild(el);scroll();
}

function scroll(){
  if(!$wrap)return;
  if(W.requestAnimationFrame){W.requestAnimationFrame(function(){$wrap.scrollTop=$wrap.scrollHeight});}
  else{$wrap.scrollTop=$wrap.scrollHeight;}
}

/* ── STATUS ── */
function showTyping(mode){
  if($typ){$typ.setAttribute('aria-label',s('typing'));$typ.className='on';}
  if($sdot)$sdot.className='busy';
  if($stxt)$stxt.textContent=mode==='math'?s('busy'):s('busyKB');
  scroll();
}
function hideTyping(){
  if($typ)$typ.className='';
  if($sdot)$sdot.className='';
  if($stxt)$stxt.textContent=s('online');
}

/* ── IDENTITY ── */
var IDR=[
  /^(ol[aá]?|oi|eai|eaí|e aí|hey|hi|hello|hola|buenas|bom\s?dia|boa\s?tarde|boa\s?noite|howdy|sup|yo)[\s!?]*$/i,
  /\b(quem [eé] voc[eê]|who are you|qui[eé]n eres|o que [eé] eduardo|what is eduardo|qu[eé] es eduardo|quem eh vc|quem eh voce)\b/i,
  /^eduardo(\.?ai?)?[\s!?]*$/i,
  /\b(se apresente|introduce yourself|preséntate|me apresenta|fala de voce|fala sobre voce)\b/i
];
function isID(t){
  var n=norm(t);
  for(var i=0;i<IDR.length;i++)if(IDR[i].test(n)||IDR[i].test(t))return true;
  return false;
}
function idAns(){
  var id=W.IDENTITY;
  if(id&&id.greeting&&id.greeting[lang])return id.greeting[lang];
  var nm=(id&&id.name)||'Eduardo Souza Rodrigues';
  return({
    pt:'Olá! Sou Eduardo.AI, assistente de '+nm+'. Posso ajudar com tecnologia, ciência, física, história, medicina (CID-10), **matemática e cálculos**, dicionário e muito mais.',
    en:"Hi! I'm Eduardo.AI, "+nm+"'s assistant. I can help with tech, science, physics, history, medicine (ICD-10), **math and calculations**, dictionary, and more.",
    es:'¡Hola! Soy Eduardo.AI, asistente de '+nm+'. Puedo ayudar con tecnología, ciencia, física, historia, medicina, **matemáticas y cálculos**, diccionario y más.'
  })[lang]||'';
}

/* ── ICD ── */
var ICDR=/^([A-Za-z]\d{2}(\.\d{1,2})?)$/;
function icdCode(t){var x=t.trim();return ICDR.test(x)?x.toUpperCase():null;}
function icdAns(code){
  if(typeof W.lookupICDCode!=='function')return null;
  var r=W.lookupICDCode(code,lang);
  if(!r)return s('icdh')+code+'\n\n'+s('icdm');
  return s('icdh')+code+' — '+r.label+'\n\n'+r.detail+s('icdd');
}

/* ── KB ENGINE ── */
function buildKB(lc){
  var kb={};
  var plugs=W.EduardoKB;
  if(plugs&&plugs.length){
    var sorted=plugs.slice().sort(function(a,b){return(b.priority||0)-(a.priority||0);});
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

function scoreAll(rawQ, lc){
  var kb=buildKB(lc);
  /* Normalize both the query and each KB key/answer for matching */
  var qNorm=norm(rawQ);
  var qTok=tok(rawQ);
  var sc=[],ks=Object.keys(kb);

  for(var i=0;i<ks.length;i++){
    var key=ks[i];
    var ans=kb[key];
    if(!ans||typeof ans!=='string'||ans.length<8)continue;

    /* Normalize key and answer text for matching */
    var kNorm=norm(key.replace(/_/g,' '));
    var aNorm=norm(ans.replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g,'$1').replace(/\*\*([^*]+)\*\*/g,'$1').replace(/\n/g,' '));

    var score=0;

    /* Exact phrase match */
    if(aNorm.indexOf(qNorm)>=0) score+=12;
    if(kNorm.indexOf(qNorm)>=0) score+=14;
    if(kNorm===qNorm)            score+=10; /* bonus for exact key match */

    /* All tokens present */
    if(qTok.length>0){
      var allOk=true;
      for(var w=0;w<qTok.length;w++){
        var nw=norm(qTok[w]);
        if(aNorm.indexOf(nw)<0&&kNorm.indexOf(nw)<0){allOk=false;break;}
      }
      if(allOk)score+=6;
    }

    /* Per-token scoring */
    for(var w2=0;w2<qTok.length;w2++){
      var qw=norm(qTok[w2]);
      if(kNorm.indexOf(qw)>=0)       score+=4;
      else if(aNorm.indexOf(qw)>=0)  score+=1;
      /* Stem (5 chars) */
      if(qw.length>=5){
        var st=qw.slice(0,5);
        if(kNorm.indexOf(st)>=0)     score+=3;
        else if(aNorm.indexOf(st)>=0)score+=0.5;
      } else if(qw.length>=4){
        var st4=qw.slice(0,4);
        if(kNorm.indexOf(st4)>=0)    score+=2;
        else if(aNorm.indexOf(st4)>=0)score+=0.3;
      }
    }

    if(score>=MIN_SCORE) sc.push({key:key,answer:ans,score:score});
  }
  sc.sort(function(a,b){return b.score-a.score;});
  return sc;
}

function reply(q,lc){
  /* Also try with alternate language if score is low */
  var r=scoreAll(q,lc);

  /* Try alternate langs if no good match */
  if(!r.length||r[0].score<6){
    var altLangs=['pt','en','es'].filter(function(l){return l!==lc;});
    for(var ai=0;ai<altLangs.length;ai++){
      var rAlt=scoreAll(q,altLangs[ai]);
      if(rAlt.length&&rAlt[0].score>(r.length?r[0].score:0)){
        r=rAlt;break;
      }
    }
  }

  if(!r.length)return null;
  var top=r.slice(0,TOP_N);
  if(top.length>1&&top[0].score>top[1].score*1.8)top=[top[0]];
  var parts=[];
  for(var i=0;i<top.length;i++)parts.push(top[i].answer.replace(/\n{3,}/g,'\n\n').trim());
  return op()+parts.join('\n\n—\n\n');
}

function fallback(q,lc){
  var kb=buildKB(lc);
  var qt=tok(q);
  var hints=[],ks=Object.keys(kb);
  for(var i=0;i<ks.length&&hints.length<4;i++){
    var kl=norm(ks[i].replace(/_/g,' '));
    for(var w=0;w<qt.length;w++){
      var nw=norm(qt[w]);
      if(kl.indexOf(nw)>=0||(nw.length>=4&&kl.indexOf(nw.slice(0,4))>=0)){
        hints.push('**'+ks[i].replace(/_/g,' ')+'**');
        break;
      }
    }
  }
  if(hints.length)return s('hint')+hints.join(', ')+'.';
  return s('nf');
}

/* ── RETRANSLATE ── */
function retrans(nl){
  for(var i=0;i<history.length;i++){
    var e=history[i];if(!e||!e.body)continue;
    if(e.who)e.who.textContent='ai';
    var t=e.type||'kb',txt=null;
    if(t==='identity'||t==='greeting')txt=(W.GREETINGS&&W.GREETINGS[nl])||idAns();
    else if(t&&t.indexOf('icd:')===0)txt=icdAns(t.slice(4));
    else if(t==='math'&&e.origQ)txt=W.tryMathEval?W.tryMathEval(e.origQ,nl):null;
    else if(e.origQ)txt=reply(e.origQ,nl)||fallback(e.origQ,nl);
    if(txt)e.body.innerHTML=rend(txt);
  }
}

/* ── LANGUAGE ── */
function applyLang(l){
  var prev=lang;lang=l;
  for(var i=0;i<$lbtns.length;i++){
    var b=$lbtns[i];
    b.className=b.getAttribute('data-lang')===l?'lang-btn active':'lang-btn';
  }
  if($inp)$inp.placeholder=s('ph');
  if($disc)$disc.textContent=s('disc');
  if($stxt)$stxt.textContent=s('online');
  if(l!==prev)retrans(l);
}
for(var li=0;li<$lbtns.length;li++){
  (function(b){
    b.addEventListener('click',function(){applyLang(b.getAttribute('data-lang')||'pt');},false);
  }($lbtns[li]));
}

/* ── SEND ── */
function send(){
  if(busy||!$inp)return;
  var rawText=$inp.value.trim();
  if(!rawText)return;

  var al=lang;
  $inp.value='';
  busy=true;
  if($send)$send.disabled=true;

  line(rawText,'user','user');

  /* Auto-detect language from input */
  var detected=detectLang(rawText);
  if(detected&&detected!==al){
    /* Don't switch UI lang, but use detected for lookup */
    al=detected;
  }

  /* Normalized version for pattern matching */
  var text=normalizeInput(rawText);

  /* 0. Conversational / small-talk */
  if(W.tryConversational){
    var cr=W.tryConversational(rawText,al)||W.tryConversational(text,al);
    if(cr){deliver(cr,'conv',null);return;}
  }

  /* 0b. Dictionary lookup */
  if(W.tryDictionary){
    var dr=W.tryDictionary(rawText,al)||W.tryDictionary(text,al);
    if(dr){deliver(dr,'dict',null);return;}
  }

  /* 1. Identity */
  if(isID(rawText)||isID(text)){deliver(idAns(),'identity',null);return;}

  /* 2. ICD code — try raw (preserves case) */
  var ic=icdCode(rawText.trim())||icdCode(rawText.trim().toUpperCase());
  if(ic){var ir=icdAns(ic);if(ir){deliver(ir,'icd:'+ic,null);return;}}

  /* 3. Math evaluator */
  if(W.tryMathEval){
    var mr=W.tryMathEval(rawText,al)||W.tryMathEval(text,al);
    if(mr){
      showTyping('math');
      setTimeout(function(){
        hideTyping();
        var e=deliver(mr,'math',rawText);
        if(e)e.origQ=rawText;
      },60);
      return;
    }
  }

  /* 4. KB scoring — use BOTH raw and normalized query */
  showTyping('kb');
  setTimeout(function(){
    hideTyping();
    var r=reply(rawText,al)||reply(text,al)||fallback(rawText,al)||fallback(text,al);
    var e=deliver(r,'kb',rawText);
    if(e)e.origQ=rawText;
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

/* ── INPUT EVENTS ── */
if($inp){
  $inp.addEventListener('keydown',function(e){
    var k=e.key||e.keyCode;
    if((k==='Enter'||k===13)&&!e.shiftKey){
      if(e.preventDefault)e.preventDefault();
      send();
    }
  },false);
  $inp.addEventListener('input',function(){
    if($send)$send.disabled=!$inp.value.trim();
  },false);
}
if($send)$send.addEventListener('click',function(){send();},false);

/* Ctrl+L / Cmd+L — clear */
D.addEventListener('keydown',function(e){
  if((e.ctrlKey||e.metaKey)&&(e.key==='l'||e.key==='L'||e.keyCode===76)){
    if($msgs)$msgs.innerHTML='';
    history=[];
    divider('cleared');
  }
},false);

/* ── GREETING ── */
function greet(){
  var day=new Date().toLocaleDateString(
    lang==='en'?'en-US':lang==='es'?'es-ES':'pt-BR',
    {weekday:'long',year:'numeric',month:'long',day:'numeric'}
  );
  divider(day);
  var gt=(W.GREETINGS&&W.GREETINGS[lang])||idAns();
  var e=line(gt,'bot','greeting');
  if(e)e.type='greeting';
}

/* ── iOS VIEWPORT ── */
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
}else{
  W.addEventListener('resize',fixVP,{passive:true});
}

/* ── BOOT ── */
function boot(){
  applyLang('pt');
  if($inp)$inp.disabled=false;
  greet();
  setTimeout(function(){
    if(!('ontouchstart' in W)&&$inp)$inp.focus();
  },350);
}

if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,false);
else boot();

W.chatSend=send;

}(window,document));
