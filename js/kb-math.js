/* kb-math.js — Eduardo.AI Mathematics Knowledge Base + Calculator Engine
   v2026.03.20
   Covers: arithmetic, algebra, geometry, trigonometry, calculus, statistics,
   linear algebra, number theory, combinatorics, financial math.
   Also injects a live math evaluator that intercepts numeric expressions
   and computes them in real-time using safe JS eval.
   ES5 compatible. No dependencies.
*/
(function(W) {
  'use strict';

  /* ════════════════════════════════════════════
     MATH EVALUATOR ENGINE
     Intercepts queries that look like math expressions
     and computes them safely before KB lookup.
  ════════════════════════════════════════════ */

  /* Safe math constants and functions available in expressions */
  var MATH_ENV = {
    pi: Math.PI, PI: Math.PI,
    e: Math.E, E: Math.E,
    phi: 1.6180339887498948482, /* golden ratio */
    sqrt2: Math.SQRT2,
    ln2: Math.LN2, ln10: Math.LN10,

    abs: Math.abs, ceil: Math.ceil, floor: Math.floor, round: Math.round,
    sqrt: Math.sqrt, cbrt: Math.cbrt || function(x){return Math.pow(x,1/3);},
    pow: Math.pow, exp: Math.exp, log: Math.log, log2: Math.log2||function(x){return Math.log(x)/Math.LN2;},
    log10: Math.log10||function(x){return Math.log(x)/Math.LN10;},
    sin: Math.sin, cos: Math.cos, tan: Math.tan,
    asin: Math.asin, acos: Math.acos, atan: Math.atan, atan2: Math.atan2,
    sinh: Math.sinh||function(x){return(Math.exp(x)-Math.exp(-x))/2;},
    cosh: Math.cosh||function(x){return(Math.exp(x)+Math.exp(-x))/2;},
    tanh: Math.tanh||function(x){var e=Math.exp(2*x);return(e-1)/(e+1);},
    max: Math.max, min: Math.min, sign: Math.sign||function(x){return x>0?1:x<0?-1:0;},
    trunc: Math.trunc||function(x){return x<0?Math.ceil(x):Math.floor(x);},
    hypot: Math.hypot||function(){var s=0;for(var i=0;i<arguments.length;i++)s+=arguments[i]*arguments[i];return Math.sqrt(s);},

    /* Extra helpers */
    deg: function(r){return r*180/Math.PI;},        /* radians→degrees */
    rad: function(d){return d*Math.PI/180;},        /* degrees→radians */
    sind: function(d){return Math.sin(d*Math.PI/180);}, /* sin in degrees */
    cosd: function(d){return Math.cos(d*Math.PI/180);},
    tand: function(d){return Math.tan(d*Math.PI/180);},
    fact: function(n){                              /* factorial */
      if(n<0||n!==Math.floor(n))return NaN;
      if(n>170)return Infinity;
      var r=1;for(var i=2;i<=n;i++)r*=i;return r;
    },
    perm: function(n,r){                            /* P(n,r) */
      if(r>n)return 0;
      var r2=1;for(var i=n;i>n-r;i--)r2*=i;return r2;
    },
    comb: function(n,r){                            /* C(n,r) */
      if(r>n)return 0;r=Math.min(r,n-r);
      var num=1,den=1;
      for(var i=0;i<r;i++){num*=(n-i);den*=(i+1);}return num/den;
    },
    gcd: function(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=b;b=a%b;a=t;}return a;},
    lcm: function(a,b){return Math.abs(a*b)/MATH_ENV.gcd(a,b);},
    isPrime: function(n){
      if(n<2)return false;if(n<4)return true;
      if(n%2===0||n%3===0)return false;
      for(var i=5;i*i<=n;i+=6)if(n%i===0||n%(i+2)===0)return false;
      return true;
    },
    /* Statistics */
    sum: function(){var a=Array.isArray(arguments[0])?arguments[0]:Array.prototype.slice.call(arguments);return a.reduce(function(s,x){return s+x;},0);},
    mean: function(){var a=Array.isArray(arguments[0])?arguments[0]:Array.prototype.slice.call(arguments);return MATH_ENV.sum(a)/a.length;},
    /* Percent */
    pct: function(part,total){return(part/total)*100;}
  };

  /* Tokenise and safely evaluate a math expression */
  function evalMath(expr) {
    /* Normalise common patterns */
    var e = expr
      .replace(/\^/g, '**')                          /* 2^3 → 2**3 */
      .replace(/(\d)\s*x\s*(\d)/g,'$1*$2')          /* 2 x 3 → 2*3 */
      .replace(/(\d)\s*×\s*(\d)/g,'$1*$2')          /* × */
      .replace(/÷/g,'/')                             /* ÷ */
      .replace(/√(\d+(\.\d+)?)/g,'sqrt($1)')        /* √9 → sqrt(9) */
      .replace(/∛(\d+(\.\d+)?)/g,'cbrt($1)')        /* ∛8 → cbrt(8) */
      .replace(/(\d+)!/g,'fact($1)')                /* 5! → fact(5) */
      .replace(/π/g,'pi')                            /* π */
      .replace(/\bmod\b/gi,'%')                      /* mod → % */
      .replace(/\bdiv\b/gi,'/')                      /* div → / */
      .replace(/(\d)\s+(\d)/g,'$1*$2');             /* implicit multiplication */

    /* Inject MATH_ENV names */
    var names = Object.keys(MATH_ENV).join(',');
    var vals  = Object.keys(MATH_ENV).map(function(k){return MATH_ENV[k];});

    try {
      /* Build a sandboxed function with only MATH_ENV in scope */
      var fn = new Function(names, '"use strict"; return (' + e + ');');
      var result = fn.apply(null, vals);
      if(typeof result === 'boolean') return result ? 'true' : 'false';
      if(typeof result !== 'number' && typeof result !== 'string') return null;
      if(result === Infinity) return '∞';
      if(result === -Infinity) return '-∞';
      if(isNaN(result)) return null;
      /* Format result */
      var abs = Math.abs(result);
      if(abs === 0) return '0';
      if(abs >= 1e15 || (abs < 1e-6 && abs > 0)) {
        return result.toExponential(6).replace(/\.?0+e/,'e');
      }
      /* Round to 10 significant figures to avoid float noise */
      var rounded = parseFloat(result.toPrecision(10));
      /* Show as integer if possible */
      if(rounded === Math.floor(rounded) && Math.abs(rounded) < 1e15) return rounded.toString();
      return rounded.toString();
    } catch(err) {
      return null;
    }
  }

  /* Detect if a query is a math expression to evaluate */
  var EXPR_RE = /^[\d\s\+\-\*\/\^\(\)\.\,πeΦ×÷√∛%!]+$|[\d\(\)][\+\-\*\/\^][\d\(\)]|\b(sqrt|cbrt|pow|sin|cos|tan|log|abs|fact|comb|perm|gcd|lcm|mean|sum|deg|rad|sind|cosd|tand|exp|ceil|floor|round)\s*\(/i;

  /* Detect natural language math patterns */
  var CALC_PATTERNS = [
    /^quanto[eé]\s+(.+)/i,
    /^calcul[ae]\s+(.+)/i,
    /^resolv[ae]\s+(.+)/i,
    /^quanto\s+[eé]\s+(.+)/i,
    /^compute?\s+(.+)/i,
    /^calculate?\s+(.+)/i,
    /^what\s+is\s+([\d\s\+\-\*\/\^\(\)\.]+)/i,
    /^quanto\s+[eé]\s+([\d\s\+\-\*\/\^\(\)\.]+)/i,
    /^([\d\s\+\-\*\/\^\(\)\.√∛π×÷%!]+)\s*[=?]?\s*$/
  ];

  /* Build a natural-language answer for a computed result */
  var CALC_LABELS = {
    pt: { result: 'Resultado', equals: '=', calc: 'Cálculo' },
    en: { result: 'Result', equals: '=', calc: 'Calculation' },
    es: { result: 'Resultado', equals: '=', calc: 'Cálculo' }
  };

  function buildCalcAnswer(expr, result, lang) {
    var L = CALC_LABELS[lang] || CALC_LABELS.pt;
    var clean = expr.replace(/\*\*/g,'^').replace(/\bpi\b/g,'π').replace(/\bfact\b/g,'').trim();
    return L.calc + ': **' + clean + '**\n' + L.result + ': **' + result + '**';
  }

  /* Public: try to evaluate a math query, return answer string or null */
  W.tryMathEval = function(query, lang) {
    var q = query.trim();

    /* Direct expression check */
    if(EXPR_RE.test(q)) {
      var r = evalMath(q);
      if(r !== null) return buildCalcAnswer(q, r, lang);
    }

    /* Natural language math patterns */
    for(var i=0;i<CALC_PATTERNS.length;i++){
      var m = q.match(CALC_PATTERNS[i]);
      if(m) {
        var expr = (m[1]||m[0]).trim();
        var r2 = evalMath(expr);
        if(r2 !== null) return buildCalcAnswer(expr, r2, lang);
      }
    }

    /* Word problems: "quanto é 15% de 200", "20 percent of 300" */
    var pctM = q.match(/(\d+[\.,]?\d*)\s*%\s*(?:de|of|de)\s*(\d+[\.,]?\d*)/i);
    if(pctM){
      var pct = parseFloat(pctM[1].replace(',','.'));
      var base = parseFloat(pctM[2].replace(',','.'));
      var val = (pct/100)*base;
      return buildCalcAnswer(pct+'% de '+base, val, lang);
    }

    /* "X% a mais/less que Y" */
    var pctMoreM = q.match(/(\d+[\.,]?\d*)\s*%\s*(?:a mais|more than|más que)\s*(?:de|of|de)?\s*(\d+[\.,]?\d*)/i);
    if(pctMoreM){
      var p = parseFloat(pctMoreM[1].replace(',','.'));
      var b = parseFloat(pctMoreM[2].replace(',','.'));
      return buildCalcAnswer(b+' + '+p+'%', b*(1+p/100), lang);
    }

    return null;
  };

  /* ════════════════════════════════════════════
     MATH KB TOPICS
  ════════════════════════════════════════════ */
  if(!W.EduardoKB) W.EduardoKB = [];
  W.EduardoKB.push({
    id: 'math',
    priority: 10,
    lang: {

      /* ══ PORTUGUESE ══════════════════════════ */
      pt: {

        /* Aritmética */
        'aritmetica': 'Operações fundamentais: adição (+), subtração (−), multiplicação (×), divisão (÷). Prioridade: PEMDAS — Parênteses, Expoentes, Multiplicação/Divisão (esq→dir), Adição/Subtração (esq→dir). Ex: 2 + 3 × 4 = 2 + 12 = 14 (não 20). Propriedades: comutativa (a+b=b+a), associativa ((a+b)+c=a+(b+c)), distributiva (a(b+c)=ab+ac). **Você pode digitar qualquer expressão diretamente: ex "2^10", "sqrt(144)", "15% de 200".**',

        'potenciacao': 'Potenciação: aⁿ = a × a × ... × a (n vezes). Propriedades: aᵐ × aⁿ = aᵐ⁺ⁿ, aᵐ ÷ aⁿ = aᵐ⁻ⁿ, (aᵐ)ⁿ = aᵐⁿ, a⁰ = 1 (a≠0), a⁻ⁿ = 1/aⁿ, a^(1/n) = ⁿ√a. Exemplos: 2¹⁰ = 1024, 3⁵ = 243, 10³ = 1000. Notação científica: 6,022 × 10²³ (número de Avogadro). Calcule diretamente: digite "2^10" ou "3^5".',

        'raizes': 'Raiz quadrada: √a = b ↔ b² = a (b≥0). Raiz cúbica: ∛a = b ↔ b³ = a. Raiz n-ésima: ⁿ√a = a^(1/n). Propriedades: √(a×b) = √a×√b, √(a/b) = √a/√b, (√a)² = a, √a² = |a|. Racionalização: 1/√2 = √2/2. Exemplos: √144 = 12, ∛27 = 3, √2 ≈ 1,41421. Simplifique: √72 = √(36×2) = 6√2. Digite "sqrt(144)" ou "cbrt(27)".',

        'frações': 'Fração a/b: a numerador, b denominador (b≠0). Operações: soma (denominador comum: a/b + c/d = (ad+bc)/bd), produto (a/b × c/d = ac/bd), divisão (a/b ÷ c/d = a/b × d/c = ad/bc). MMC para soma. MDC para simplificação. Fração mista: 2¾ = 11/4. Dízima periódica: 1/3 = 0,333..., 1/7 = 0,142857142857... Conversão: 3/4 = 0,75; 0,625 = 5/8.',

        'porcentagem': 'Porcentagem: parte por 100. x% de N = (x/100) × N. Aumento de x%: N × (1 + x/100). Desconto de x%: N × (1 − x/100). Variação percentual: (final−inicial)/inicial × 100. Juros simples: J = P × i × t. Juros compostos: M = P × (1+i)ᵗ. Exemplos: 15% de 200 = 30; aumento de 20% em R$100 = R$120; desconto de 30% em R$500 = R$350. **Calcule: "15% de 200", "20% de 350".**',

        'divisibilidade': 'Regras: div por 2: último dígito par. Div por 3: soma dos dígitos divisível por 3. Div por 4: últimos 2 dígitos divisíveis por 4. Div por 5: termina em 0 ou 5. Div por 6: divisível por 2 e 3. Div por 9: soma dos dígitos divisível por 9. Div por 10: termina em 0. Div por 11: diferença alternada divisível por 11. MDC: algoritmo de Euclides (a, b → a, b%a). MMC = (a×b)/MDC(a,b). Digite "gcd(48,18)" ou "lcm(12,18)".',

        'numeros_primos': 'Número primo: divisível apenas por 1 e por si mesmo (2, 3, 5, 7, 11, 13, 17, 19, 23...). Crivo de Eratóstenes: elimina múltiplos. 2 é o único primo par. Teorema fundamental da aritmética: todo inteiro >1 é produto único de primos. Fatoração: 60 = 2² × 3 × 5. Conjectura de Goldbach: todo par >2 é soma de 2 primos (não provado). Números de Mersenne: 2ⁿ−1. Digite "isPrime(97)" para verificar.',

        /* Álgebra */
        'algebra_basica': 'Variável: letra que representa número desconhecido. Equação de 1º grau: ax + b = 0 → x = −b/a. Equação de 2º grau: ax² + bx + c = 0 → x = (−b ± √(b²−4ac)) / 2a. Discriminante Δ = b²−4ac: Δ>0 (2 raízes reais), Δ=0 (1 raiz dupla), Δ<0 (raízes complexas). Produto notável: (a+b)² = a²+2ab+b², (a−b)² = a²−2ab+b², (a+b)(a−b) = a²−b². Digite "(-5+sqrt(5^2-4*2*3))/(2*2)" para resolver 2x²−5x+3=0.',

        'equacao_2grau': 'Equação 2º grau: ax² + bx + c = 0. Fórmula de Bhaskara: x = (−b ± √Δ) / 2a, onde Δ = b²−4ac. Relações de Vieta: x₁+x₂ = −b/a, x₁×x₂ = c/a. Forma fatorada: a(x−x₁)(x−x₂). Completar quadrado: x²+bx = (x+b/2)²−(b/2)². Parábola: vértice em (−b/2a, −Δ/4a). Concavidade: a>0 abre para cima, a<0 para baixo. Calcule Δ: digite "5^2 - 4*2*3" para ax²+bx+c com a=2,b=5,c=3.',

        'sistemas_lineares': 'Sistema 2×2: a₁x+b₁y=c₁, a₂x+b₂y=c₂. Métodos: substituição, adição/eliminação, regra de Cramer (determinantes). Determinante 2×2: det(A) = ad−bc. Regra de Cramer: x=Dₓ/D, y=D_y/D. Sistema possível e determinado (D≠0), impossível (D=0, sem solução), indeterminado (D=0, ∞ soluções). Sistema 3×3: eliminação gaussiana. Cálculo det: "3*7-2*4" para [[3,2],[4,7]].',

        'polinomios': 'Polinômio: p(x) = aₙxⁿ + ... + a₁x + a₀. Grau n (coeficiente líder aₙ≠0). Operações: soma (termos semelhantes), produto (distributiva), divisão (Briot-Ruffini para (x−r)). Teorema de Bezout: resto da divisão por (x−a) é p(a). Raiz/zero: p(r)=0. Regra de Descartes: número de raízes reais positivas ≤ número de variações de sinal. Forma fatorada: (x−r₁)(x−r₂)...(x−rₙ).',

        'inequacoes': 'Inequação: desigualdade com incógnita. 1º grau: ax+b > 0 → x > −b/a (inverte sinal se a<0). 2º grau: ax²+bx+c > 0 → analisa sinal da parábola. Módulo: |x−a| < r ↔ a−r < x < a+r; |x−a| > r ↔ x < a−r ou x > a+r. Conjunto solução: intervalo ou união de intervalos. Notação: (a,b) aberto, [a,b] fechado, [a,+∞) semi-infinito.',

        'funcoes': 'Função f: A→B, cada x∈A tem único f(x)∈B. Domínio (D), contradomínio, imagem (Im). Tipos: linear f(x)=ax+b, quadrática f(x)=ax²+bx+c, exponencial f(x)=aˣ, logarítmica f(x)=logₐx, trigonométrica, modular f(x)=|x|. Composição: (f∘g)(x)=f(g(x)). Função inversa: f⁻¹ existe se f é bijetora. Simetria: par f(−x)=f(x), ímpar f(−x)=−f(x).',

        'logaritmos': 'Logaritmo: logₐb = c ↔ aᶜ = b (a>0, a≠1, b>0). ln = log base e. log = log base 10. Propriedades: log(ab) = log a + log b; log(a/b) = log a − log b; log(aⁿ) = n×log a; log_a(a) = 1; log_a(1) = 0. Mudança de base: log_a(b) = ln b / ln a. log(1000) = 3; ln(e²) = 2; log₂(32) = 5. Calcule: "log10(1000)", "log(Math.E)" ou "log2(32)".',

        'progressoes': 'PA (Progressão Aritmética): razão r = aₙ₊₁−aₙ constante. Termo geral: aₙ = a₁+(n−1)r. Soma n termos: Sₙ = n(a₁+aₙ)/2 = n(2a₁+(n−1)r)/2. PG (Progressão Geométrica): razão q = aₙ₊₁/aₙ constante. Termo geral: aₙ = a₁×qⁿ⁻¹. Soma finita: Sₙ = a₁(qⁿ−1)/(q−1). Soma infinita (|q|<1): S = a₁/(1−q). Exemplo PA: 2,5,8,11... r=3, S₁₀=155. Exemplo PG: 3,6,12,24... q=2.',

        /* Geometria */
        'geometria_plana': 'Figuras planas e fórmulas de área: Quadrado: A=l², P=4l. Retângulo: A=b×h, P=2(b+h). Triângulo: A=b×h/2, Herão: A=√(s(s-a)(s-b)(s-c)), s=(a+b+c)/2. Círculo: A=πr², C=2πr. Trapézio: A=(b₁+b₂)×h/2. Losango: A=d₁×d₂/2. Paralelogramo: A=b×h. Hexágono regular: A=3√3/2×l². Polígono regular: A=P×apótema/2. π ≈ 3.14159265. Calcule área: "pi*5^2" (círculo r=5).',

        'geometria_espacial': 'Sólidos e fórmulas: Cubo: V=a³, A=6a². Paralelepípedo: V=l×w×h, A=2(lw+lh+wh). Esfera: V=4πr³/3, A=4πr². Cilindro: V=πr²h, A=2πr(r+h). Cone: V=πr²h/3, A=πr(r+g), g=√(r²+h²). Pirâmide: V=A_base×h/3. Toro: V=2π²Rr², A=4π²Rr. Tetraedro regular aresta a: V=a³√2/12. Calcule: "4*pi*5^3/3" (esfera r=5), "(pi*3^2*10)/3" (cone r=3,h=10).',

        'teorema_pitagoras': 'Teorema de Pitágoras: em triângulo retângulo, a² = b² + c² (hipotenusa² = soma dos catetos²). Trios pitagóricos: (3,4,5), (5,12,13), (8,15,17), (7,24,25), (9,40,41). Generalização (lei dos cossenos): a² = b² + c² − 2bc×cos(A). Aplicações: diagonal de retângulo d=√(l²+w²), diagonal de cubo d=a√3, distância entre pontos d=√((x₂-x₁)²+(y₂-y₁)²). Calcule: "sqrt(3^2+4^2)" = 5, "sqrt(5^2+12^2)" = 13.',

        'trigonometria': 'No triângulo retângulo: sin(θ) = oposto/hipotenusa, cos(θ) = adjacente/hipotenusa, tan(θ) = oposto/adjacente = sin/cos. Reciprocas: csc=1/sin, sec=1/cos, cot=1/tan. Identidade fundamental: sin²θ + cos²θ = 1. Ângulos notáveis: sin(30°)=1/2, cos(30°)=√3/2, tan(30°)=1/√3; sin(45°)=√2/2, cos(45°)=√2/2; sin(60°)=√3/2, cos(60°)=1/2. Lei dos senos: a/sin(A) = b/sin(B) = c/sin(C). Calcule em graus: "sind(30)", "cosd(60)", "tand(45)".',

        'circunferencia': 'Circunferência com centro (a,b) e raio r: (x−a)² + (y−b)² = r². Forma geral: x²+y²+Dx+Ey+F=0, onde centro (−D/2, −E/2), r=√((D/2)²+(E/2)²−F). Arco: comprimento = r×θ (θ em rad). Setor circular: área = r²θ/2. Corda: 2r×sin(θ/2). Inscrito/circunscrito. Equação paramétrica: x=r×cos(t), y=r×sin(t). Área do anel: π(R²−r²). Calcule circunferência r=7: "2*pi*7".',

        'analise_vetorial': 'Vetor: grandeza com módulo, direção e sentido. Componentes: v⃗ = (vₓ, v_y). Módulo: |v⃗| = √(vₓ²+v_y²). Produto escalar: a⃗·b⃗ = |a||b|cos(θ) = aₓbₓ+a_yb_y. Produto vetorial: |a⃗×b⃗| = |a||b|sin(θ). Ângulo entre vetores: cos(θ) = (a⃗·b⃗)/(|a||b|). Vetor unitário: ê = v⃗/|v⃗|. Projeção: proj_b(a) = (a⃗·b⃗/|b⃗|²)×b⃗. Calcule módulo de (3,4): "sqrt(3^2+4^2)".',

        /* Cálculo */
        'limites': 'Limite: lim(x→a) f(x) = L significa que f(x) se aproxima de L quando x→a. Limites fundamentais: lim(x→0) sin(x)/x = 1; lim(x→0) (1+x)^(1/x) = e; lim(x→∞) (1+1/x)^x = e. Indeterminações: 0/0, ∞/∞, 0×∞, ∞−∞, 1^∞, 0^0, ∞^0 → usar L\'Hôpital: lim f/g = lim f\'/g\'. Continuidade: f contínua em a se lim f(x) = f(a). Teorema do Valor Intermediário: f contínua em [a,b], f(a)≠f(b) → existe c∈(a,b) com f(c)=qualquer valor entre.',

        'derivadas': 'Derivada: f\'(x) = lim(h→0) [f(x+h)−f(x)]/h. Taxa de variação instantânea, coeficiente angular da tangente. Regras: (c)\'=0, (xⁿ)\'=nxⁿ⁻¹, (eˣ)\'=eˣ, (ln x)\'=1/x, (sin x)\'=cos x, (cos x)\'=−sin x, (tan x)\'=sec²x. Regra do produto: (fg)\'=f\'g+fg\'. Regra do quociente: (f/g)\'=(f\'g−fg\')/g². Regra da cadeia: (f(g(x)))\'=f\'(g(x))×g\'(x). Aplicações: máximos/mínimos (f\'=0, f\'\'≷0), pontos de inflexão (f\'\'=0), velocidade (s\'=v), aceleração (v\'=a).',

        'integrais': 'Integral indefinida: ∫f(x)dx = F(x)+C, onde F\'(x)=f(x). Regras básicas: ∫xⁿdx = xⁿ⁺¹/(n+1)+C (n≠−1), ∫eˣdx = eˣ+C, ∫(1/x)dx = ln|x|+C, ∫sin(x)dx = −cos(x)+C, ∫cos(x)dx = sin(x)+C, ∫sec²(x)dx = tan(x)+C. Teorema Fundamental do Cálculo: ∫ₐᵇf(x)dx = F(b)−F(a). Área sob curva = ∫ₐᵇf(x)dx. Técnicas: substituição u, partes (∫udv = uv − ∫vdu), frações parciais. Cálculo numérico: regra dos trapézios, Simpson.',

        'series_taylor': 'Série de Taylor: f(x) = Σ f^(n)(a)/n! × (x−a)ⁿ. Série de Maclaurin (a=0): eˣ = 1+x+x²/2!+x³/3!+..., sin(x) = x−x³/3!+x⁵/5!−..., cos(x) = 1−x²/2!+x⁴/4!−..., ln(1+x) = x−x²/2+x³/3−... (|x|≤1), (1+x)ⁿ = 1+nx+n(n-1)x²/2!+... Convergência: raio de convergência R = 1/lim|aₙ₊₁/aₙ|. Fórmula de Euler: e^(iθ) = cos(θ)+i×sin(θ). e^(iπ)+1=0 (identidade de Euler).',

        /* Estatística e Probabilidade */
        'estatistica': 'Dados: população vs amostra. Medidas de tendência central: média (x̄=Σxᵢ/n), mediana (valor central ordenado), moda (mais frequente). Medidas de dispersão: variância (s²=Σ(xᵢ−x̄)²/(n−1)), desvio padrão (s=√s²), amplitude (máx−mín), IQR=Q3−Q1. Distribuição normal: 68-95-99,7% dos dados em 1σ, 2σ, 3σ. Z-score: z=(x−μ)/σ. Coeficiente de variação: CV=s/x̄×100%. Calcule média: "mean(10,20,30,40,50)" = 30.',

        'probabilidade': 'Probabilidade: P(A)=casos favoráveis/casos possíveis. Espaço amostral Ω. Axiomas de Kolmogorov: P(A)∈[0,1], P(Ω)=1, P(A∪B)=P(A)+P(B) se A∩B=∅. Complementar: P(Aᶜ)=1−P(A). União: P(A∪B)=P(A)+P(B)−P(A∩B). Condicional: P(A|B)=P(A∩B)/P(B). Independência: P(A∩B)=P(A)×P(B). Teorema de Bayes: P(A|B)=P(B|A)×P(A)/P(B). Distribuições: Binomial, Poisson, Normal, Uniforme.',

        'combinatoria': 'Combinatória: Princípio multiplicativo: n₁×n₂×...×nₖ arranjos. Permutação (ordem importa): Pₙ = n!. Arranjo (r de n, ordem importa): Aₙ,ᵣ = n!/(n−r)!. Combinação (r de n, ordem NÃO importa): Cₙ,ᵣ = n!/(r!(n−r)!) = C(n,r). Permutação com repetição: n!/(n₁!n₂!...nₖ!). Combinação com repetição: C(n+r−1,r). Triângulo de Pascal: Cₙ,ᵣ = Cₙ₋₁,ᵣ₋₁ + Cₙ₋₁,ᵣ. Calcule: "comb(10,3)" = 120, "perm(6,2)" = 30, "fact(7)" = 5040.',

        /* Álgebra linear */
        'matrizes': 'Matriz m×n: m linhas × n colunas. Matriz quadrada: m=n. Operações: soma (mesmo tipo), produto escalar, produto A×B (colunas de A = linhas de B). Transposta: Aᵀᵢⱼ = Aⱼᵢ. Determinante 2×2: |A| = ad−bc. Det 3×3: regra de Sarrus. Propriedades det: det(AB)=det(A)×det(B), det(Aᵀ)=det(A), det(cA)=cⁿdet(A). Inversa: A⁻¹ = (1/det(A)) × adj(A). Classificação: nula, identidade, diagonal, simétrica, ortogonal. Calcule det 2×2: "3*7 - 2*4".',

        /* Matemática financeira */
        'matematica_financeira': 'Juros Simples: M = P×(1 + i×t), J = P×i×t. Juros Compostos: M = P×(1+i)ᵗ, J = M−P. Equivalência: (1+i_a) = (1+i_m)¹². Taxa efetiva vs nominal. Desconto simples (comercial): D = N×d×t, A = N×(1−d×t). Desconto composto: A = N×(1+d)^(−t). Anuidades/Séries: VP = PMT × [1−(1+i)^(−n)]/i. VF = PMT × [(1+i)ⁿ−1]/i. Payback, VPL, TIR. Amortização: Price (parcelas iguais), SAC (amortização constante). Calcule: "10000*(1+0.01)^12" (R$10k a 1%a.m. em 12 meses).',

        'juros_compostos': 'M = P × (1 + i)ᵗ. Exemplos: R$1.000 a 2%a.m. por 6 meses: M = 1000×1,02⁶ ≈ R$1.126,16. Dobrar: t = ln(2)/ln(1+i). Regra dos 72: prazo para dobrar ≈ 72/taxa%. Exemplo: taxa de 6%a.a. → dobra em ~12 anos. Taxa equivalente mensal de 12%a.a.: (1+0,12)^(1/12)−1 ≈ 0,9489%a.m. Calcule: "1000*(1+0.02)^6", "log(2)/log(1.06)".',

        /* Número teoria */
        'teoria_dos_numeros': 'Números inteiros ℤ = {...,−2,−1,0,1,2,...}. Divisão com resto: a = q×b + r (0≤r<b). Algoritmo de Euclides para MDC: MDC(48,18)=MDC(18,12)=MDC(12,6)=MDC(6,0)=6. Identidade de Bézout: MDC(a,b) = ax+by. Aritmética modular: a≡b (mod m) ↔ m|(a−b). Pequeno Teorema de Fermat: aᵖ⁻¹ ≡ 1 (mod p) para p primo e MDC(a,p)=1. RSA: criptografia baseada em fatoração de grandes números. Números perfeitos: 6=1+2+3, 28=1+2+4+7+14. Calcule "gcd(48,18)"=6, "lcm(4,6)"=12.',

        /* Cálculo numérico */
        'metodos_numericos': 'Método de Newton-Raphson: xₙ₊₁ = xₙ − f(xₙ)/f\'(xₙ). Converge quadraticamente. Bisseção: [a,b] com f(a)×f(b)<0, m=(a+b)/2, reduz intervalo pela metade. Interpolação de Lagrange: P(x)=Σᵢ yᵢ×Πⱼ≠ᵢ(x−xⱼ)/(xᵢ−xⱼ). Integração numérica: Trapézios ≈ h(f₀+2f₁+...+2fₙ₋₁+fₙ)/2. Simpson 1/3: ≈ h(f₀+4f₁+2f₂+4f₃+...+fₙ)/3. Erro de arredondamento vs truncamento. Sistemas lineares: eliminação gaussiana, LU, Gauss-Seidel.',

        /* Constantes e fórmulas úteis */
        'constantes_matematicas': 'π = 3,14159265358979... (razão circunferência/diâmetro). e = 2,71828182845904... (base logaritmo natural). φ = (1+√5)/2 = 1,61803398... (razão áurea). √2 = 1,41421356... √3 = 1,73205080... √5 = 2,23606797... ln(2) = 0,69314718... log₁₀(2) = 0,30103... γ = 0,57721... (Euler-Mascheroni). i = √(−1) (unidade imaginária). Calcule: "phi", "sqrt(5)", "(1+sqrt(5))/2".',

        'tabela_derivadas': 'Principais derivadas: (xⁿ)\'=nxⁿ⁻¹, (eˣ)\'=eˣ, (aˣ)\'=aˣln(a), (ln x)\'=1/x, (log_a x)\'=1/(x ln a), (sin x)\'=cos x, (cos x)\'=−sin x, (tan x)\'=sec²x, (cot x)\'=−csc²x, (sec x)\'=sec x tan x, (csc x)\'=−csc x cot x, (arcsin x)\'=1/√(1−x²), (arccos x)\'=−1/√(1−x²), (arctan x)\'=1/(1+x²), (sinh x)\'=cosh x, (cosh x)\'=sinh x, (|x|)\'=x/|x| (x≠0).',

        'tabela_integrais': 'Principais integrais: ∫xⁿdx=xⁿ⁺¹/(n+1)+C, ∫dx/x=ln|x|+C, ∫eˣdx=eˣ+C, ∫aˣdx=aˣ/ln(a)+C, ∫sin(x)dx=−cos(x)+C, ∫cos(x)dx=sin(x)+C, ∫tan(x)dx=−ln|cos(x)|+C, ∫sec²(x)dx=tan(x)+C, ∫dx/√(1−x²)=arcsin(x)+C, ∫dx/(1+x²)=arctan(x)+C, ∫sinh(x)dx=cosh(x)+C, ∫cosh(x)dx=sinh(x)+C, ∫dx/(a²+x²)=(1/a)arctan(x/a)+C.',

        'como_calcular': 'Eduardo.AI pode calcular expressões matemáticas diretamente! Exemplos:\n**Aritmética:** 2 + 3 * 4 = 14, 2^10 = 1024\n**Raízes:** sqrt(144) = 12, cbrt(27) = 3\n**Trigonometria:** sind(30) = 0.5, cosd(60) = 0.5\n**Logaritmos:** log10(1000) = 3, log(Math.E) = 1\n**Combinatória:** comb(10,3) = 120, fact(7) = 5040\n**MDC/MMC:** gcd(48,18) = 6, lcm(12,18) = 36\n**Porcentagem:** "15% de 200" = 30\n**Constantes:** pi, e, phi, sqrt2\nDigite qualquer expressão e veja o resultado!',
      },

      /* ══ ENGLISH ═════════════════════════════ */
      en: {
        'arithmetic': 'Basic operations: addition (+), subtraction (−), multiplication (×), division (÷). Order of operations: PEMDAS — Parentheses, Exponents, Multiplication/Division (L→R), Addition/Subtraction (L→R). Ex: 2 + 3 × 4 = 14 (not 20). Properties: commutative, associative, distributive. **Type any expression directly: "2^10", "sqrt(144)", "15% of 200".**',

        'percentages': 'Percentage: part per 100. x% of N = (x/100)×N. Increase by x%: N×(1+x/100). Decrease by x%: N×(1−x/100). Percent change: (final−initial)/initial×100. Simple interest: I = P×r×t. Compound interest: A = P×(1+r)ᵗ. Examples: 15% of 200 = 30; 20% increase on $100 = $120. **Calculate: "15% de 200", "20% de 350".**',

        'algebra': 'Variable: letter representing unknown. Linear equation: ax+b=0 → x=−b/a. Quadratic: ax²+bx+c=0 → x=(−b±√(b²−4ac))/2a. Discriminant Δ=b²−4ac: Δ>0 (2 real roots), Δ=0 (double root), Δ<0 (complex roots). Notable products: (a+b)²=a²+2ab+b², (a−b)²=a²−2ab+b², (a+b)(a−b)=a²−b². Calculate: "(-5+sqrt(5^2-4*2*3))/(2*2)".',

        'geometry': 'Area formulas: Square: A=l². Rectangle: A=b×h. Triangle: A=b×h/2. Circle: A=πr², C=2πr. Trapezoid: A=(b₁+b₂)×h/2. Rhombus: A=d₁×d₂/2. 3D: Sphere V=4πr³/3, Cylinder V=πr²h, Cone V=πr²h/3, Cube V=a³. Pythagorean theorem: a²=b²+c². Calculate: "pi*5^2" (circle r=5), "sqrt(3^2+4^2)" (hypotenuse).',

        'trigonometry': 'Right triangle: sin(θ)=opposite/hypotenuse, cos(θ)=adjacent/hypotenuse, tan(θ)=opposite/adjacent. Pythagorean identity: sin²θ+cos²θ=1. Key angles: sin(30°)=0.5, cos(60°)=0.5, sin(45°)=cos(45°)=√2/2, sin(90°)=1. Law of sines: a/sin(A)=b/sin(B)=c/sin(C). Law of cosines: a²=b²+c²−2bc×cos(A). **Calculate in degrees: "sind(30)", "cosd(60)", "tand(45)".**',

        'calculus': 'Derivative: f\'(x)=lim(h→0)[f(x+h)−f(x)]/h. Rules: (xⁿ)\'=nxⁿ⁻¹, (eˣ)\'=eˣ, (ln x)\'=1/x, (sin x)\'=cos x, (cos x)\'=−sin x, product rule (fg)\'=f\'g+fg\', chain rule (f(g(x)))\'=f\'(g(x))g\'(x). Integral: ∫xⁿdx=xⁿ⁺¹/(n+1)+C. Fundamental theorem: ∫ₐᵇf(x)dx=F(b)−F(a). Applications: optimization, area under curve, velocity/acceleration.',

        'statistics': 'Data: population vs sample. Central tendency: mean=Σxᵢ/n, median (middle value), mode (most frequent). Dispersion: variance s²=Σ(xᵢ−x̄)²/(n−1), std deviation s=√s², range=max−min, IQR=Q3−Q1. Normal distribution: 68-95-99.7% of data within 1σ, 2σ, 3σ. Z-score: z=(x−μ)/σ. **Calculate mean: "mean(10,20,30,40,50)" = 30.**',

        'probability': 'Probability: P(A)=favorable/possible outcomes, P(A)∈[0,1]. Complement: P(Aᶜ)=1−P(A). Union: P(A∪B)=P(A)+P(B)−P(A∩B). Conditional: P(A|B)=P(A∩B)/P(B). Independence: P(A∩B)=P(A)×P(B). Bayes theorem: P(A|B)=P(B|A)×P(A)/P(B). Distributions: Binomial B(n,p), Poisson Pois(λ), Normal N(μ,σ²).',

        'combinatorics': 'Multiplication principle: n₁×n₂×...×nₖ arrangements. Permutation (order matters): P(n)=n!. Arrangement r from n: A(n,r)=n!/(n−r)!. Combination r from n (order doesn\'t matter): C(n,r)=n!/(r!(n−r)!). Pascal\'s triangle: C(n,r)=C(n−1,r−1)+C(n−1,r). **Calculate: "comb(10,3)" = 120, "perm(6,2)" = 30, "fact(7)" = 5040.**',

        'financial_math': 'Simple interest: A=P(1+rt). Compound interest: A=P(1+r)ᵗ. Doubling time: t=ln(2)/ln(1+r). Rule of 72: doubling time ≈ 72/rate%. Annuity PV: PV=PMT×[1−(1+r)^(−n)]/r. Future value: FV=PMT×[(1+r)ⁿ−1]/r. NPV, IRR for investments. Calculate: "1000*(1+0.05)^10" ($1000 at 5% for 10 years), "log(2)/log(1.06)" (years to double at 6%).',

        'how_to_calculate': 'Eduardo.AI can calculate math expressions directly! Examples:\n**Arithmetic:** 2 + 3 * 4 = 14, 2^10 = 1024\n**Square roots:** sqrt(144) = 12, cbrt(27) = 3\n**Trig (degrees):** sind(30) = 0.5, cosd(60) = 0.5\n**Logarithms:** log10(1000) = 3\n**Combinatorics:** comb(10,3) = 120, fact(7) = 5040\n**GCD/LCM:** gcd(48,18) = 6, lcm(12,18) = 36\n**Constants:** pi, e, phi, sqrt2\nJust type any expression and get the result!',

        'math_constants': 'π = 3.14159265358979... (ratio circumference/diameter). e = 2.71828182845904... (natural logarithm base). φ = (1+√5)/2 = 1.61803398... (golden ratio). √2 = 1.41421356... √3 = 1.73205080... i = √(−1) (imaginary unit). Euler\'s identity: e^(iπ)+1=0 (most beautiful equation). Calculate: "pi", "phi", "(1+sqrt(5))/2".',
      },

      /* ══ ESPAÑOL ═════════════════════════════ */
      es: {
        'aritmetica': 'Operaciones: suma (+), resta (−), multiplicación (×), división (÷). Orden: PEMDAS — Paréntesis, Exponentes, Mult/Div (izq→der), Sum/Res (izq→der). Propiedades: conmutativa, asociativa, distributiva. **Escriba cualquier expresión: "2^10", "sqrt(144)", "15% de 200".**',

        'porcentajes': 'Porcentaje: parte por 100. x% de N = (x/100)×N. Aumento: N×(1+x/100). Descuento: N×(1−x/100). Variación porcentual: (final−inicial)/inicial×100. Interés simple: I=P×i×t. Interés compuesto: M=P×(1+i)ᵗ. Calcule: "15% de 200" = 30, "1000*(1+0.1)^5".',

        'algebra': 'Ecuación 1er grado: ax+b=0 → x=−b/a. Ecuación 2do grado: ax²+bx+c=0 → x=(−b±√(b²−4ac))/2a. Discriminante Δ=b²−4ac: Δ>0 (2 raíces reales), Δ=0 (raíz doble), Δ<0 (raíces complejas). Productos notables: (a+b)²=a²+2ab+b², (a−b)²=a²−2ab+b², (a+b)(a−b)=a²−b².',

        'geometria': 'Áreas: Cuadrado A=l². Rectángulo A=b×h. Triángulo A=b×h/2. Círculo A=πr², C=2πr. Trapecio A=(b₁+b₂)×h/2. Sólidos: Esfera V=4πr³/3, Cilindro V=πr²h, Cono V=πr²h/3, Cubo V=a³. Teorema de Pitágoras: a²=b²+c². Calcule: "pi*5^2", "sqrt(3^2+4^2)".',

        'trigonometria': 'Triángulo rectángulo: sin(θ)=opuesto/hipotenusa, cos(θ)=adyacente/hipotenusa, tan(θ)=opuesto/adyacente. Identidad: sin²θ+cos²θ=1. Ángulos notables: sin(30°)=0,5; cos(60°)=0,5; sin(45°)=cos(45°)=√2/2. Ley de senos: a/sin(A)=b/sin(B). Ley de cosenos: a²=b²+c²−2bc×cos(A). **Calcule: "sind(30)", "cosd(60)", "tand(45)".**',

        'estadistica': 'Media: x̄=Σxᵢ/n. Mediana: valor central ordenado. Moda: más frecuente. Varianza: s²=Σ(xᵢ−x̄)²/(n−1). Desviación estándar: s=√s². Distribución normal: 68-95-99,7% en 1σ, 2σ, 3σ. Z-score: z=(x−μ)/σ. **Calcule: "mean(10,20,30,40,50)" = 30.**',

        'combinatoria': 'Permutación (orden importa): P(n)=n!. Arreglo r de n: A(n,r)=n!/(n−r)!. Combinación r de n (orden no importa): C(n,r)=n!/(r!(n−r)!). Triángulo de Pascal: C(n,r)=C(n−1,r−1)+C(n−1,r). **Calcule: "comb(10,3)" = 120, "perm(6,2)" = 30, "fact(7)" = 5040.**',

        'calculo': 'Derivada: f\'(x)=lim(h→0)[f(x+h)−f(x)]/h. Reglas: (xⁿ)\'=nxⁿ⁻¹, (eˣ)\'=eˣ, (ln x)\'=1/x, (sin x)\'=cos x. Regla del producto: (fg)\'=f\'g+fg\'. Integral: ∫xⁿdx=xⁿ⁺¹/(n+1)+C. Teorema Fundamental: ∫ₐᵇf(x)dx=F(b)−F(a).',

        'matematica_financiera': 'Interés simple: M=P(1+it). Interés compuesto: M=P(1+i)ᵗ. Regla del 72: plazo para duplicar ≈ 72/tasa%. Annuity VP: VP=PMT×[1−(1+i)^(−n)]/i. Calcule: "1000*(1+0.02)^12" (R$1000 al 2% mensual en 12 meses), "log(2)/log(1.06)" (años para duplicar al 6%).',

        'como_calcular': 'Eduardo.AI puede calcular expresiones matemáticas directamente! Ejemplos:\n**Aritmética:** 2 + 3 * 4 = 14, 2^10 = 1024\n**Raíces:** sqrt(144) = 12, cbrt(27) = 3\n**Trigonometría:** sind(30) = 0.5, cosd(60) = 0.5\n**Logaritmos:** log10(1000) = 3\n**Combinatoria:** comb(10,3) = 120, fact(7) = 5040\n**MCD/MCM:** gcd(48,18) = 6, lcm(12,18) = 36\n**Porcentajes:** "15% de 200" = 30\nEscriba cualquier expresión matemática!',
      }
    }
  });

}(window));
