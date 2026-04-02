/**
 * LEITURA DIÁRIA — Bíblia em 1 Ano
 *
 * Divide toda a Bíblia (1189 capítulos) em 365 porções diárias.
 * O dia exibido corresponde ao dia do ano do relógio do sistema.
 * Requer bible-data.js e script.js carregados antes deste arquivo.
 */

/* ══════════════════════════ PLANO ══════════════════════════════ */

const TOTAL_CHAPTERS = (() => {
    let n = 0;
    for (const b of ALL_BOOKS) n += b.chapters;
    return n; // 1189
})();

const DAYS_IN_YEAR = 365;

function buildYearPlan() {
    const all = [];
    for (const b of ALL_BOOKS)
        for (let c = 1; c <= b.chapters; c++)
            all.push({ bookId: b.id, bookName: b.name, chapter: c });

    const plan  = [];
    const base  = Math.floor(TOTAL_CHAPTERS / DAYS_IN_YEAR); // 3
    const extra = TOTAL_CHAPTERS % DAYS_IN_YEAR;             // 4
    let   idx   = 0;
    for (let d = 0; d < DAYS_IN_YEAR; d++) {
        const count = d < extra ? base + 1 : base;
        plan.push(all.slice(idx, idx + count));
        idx += count;
    }
    return plan;
}

const YEAR_PLAN = buildYearPlan();

function todayDayOfYear() {
    const now    = new Date();
    const start  = new Date(now.getFullYear(), 0, 0);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.min(Math.floor((now - start) / oneDay), DAYS_IN_YEAR);
}

function formatDatePtBR(date) {
    return date.toLocaleDateString('pt-BR', { day:'numeric', month:'long', year:'numeric' });
}

/* ══════════════════════════ CONFETTI ═══════════════════════════
 * Pure-canvas particle burst — no external library.
 * A full-screen <canvas> is created on top of the page, runs the
 * animation loop, then removes itself once all particles fade out.
 * ════════════════════════════════════════════════════════════════ */
function launchConfetti() {
    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, {
        position:      'fixed',
        inset:         '0',
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
        zIndex:        '9999',
    });
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx    = canvas.getContext('2d');
    const COLORS = [
        '#c9a96e','#e8d5a8','#8b6f3a',   // golds
        '#8b1a1a','#c0392b',               // reds
        '#f5edd8','#fffbe6',               // parchment / cream
        '#d4ac0d','#f39c12',               // amber
        '#ffffff',                          // white sparks
    ];

    const particles = Array.from({ length: 180 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 10;
        return {
            x:        canvas.width  * (0.15 + Math.random() * 0.7),
            y:        canvas.height * (0.3  + Math.random() * 0.35),
            vx:       Math.cos(angle) * speed,
            vy:       Math.sin(angle) * speed - (7 + Math.random() * 7),
            size:     5 + Math.random() * 8,
            color:    COLORS[Math.floor(Math.random() * COLORS.length)],
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.28,
            shape:    Math.random() < 0.55 ? 'rect' : 'circle',
            alpha:    1,
            decay:    0.011 + Math.random() * 0.009,
        };
    });

    function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = 0;
        for (const p of particles) {
            p.x  += p.vx;
            p.y  += p.vy;
            p.vy += 0.34;         // gravity
            p.vx *= 0.992;        // air drag
            p.rotation += p.rotSpeed;
            p.alpha    -= p.decay;
            if (p.alpha <= 0) continue;
            alive++;

            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            if (p.shape === 'rect') {
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
        if (alive > 0) requestAnimationFrame(tick);
        else canvas.remove();
    }

    requestAnimationFrame(tick);
}

/* ══════════════════════════ CONCLUDE BUTTON ════════════════════
 * Appended at the bottom of each daily reading.
 * On click: confetti + button morphs to green ✓ + inspirational
 * quote fades in + page scrolls back to top.
 * ════════════════════════════════════════════════════════════════ */
function appendConcludeButton(container, doy) {
    const progressPct = Math.round((doy / DAYS_IN_YEAR) * 100);

    const wrap = document.createElement('div');
    wrap.style.cssText = `
        text-align:center;
        margin:3.5rem 0 2rem;
        padding-top:2rem;
        border-top:1px solid var(--gold-dark);
    `;

    wrap.innerHTML = `
        <div style="
            font-family:'Cinzel',serif;
            font-size:.68rem;
            letter-spacing:.2em;
            color:var(--gold-dark);
            margin-bottom:.55rem;
            text-transform:uppercase;
        ">Progresso Anual</div>

        <div style="
            background:rgba(201,169,110,.18);
            border-radius:99px;
            height:7px;
            margin:0 auto .8rem;
            max-width:300px;
            overflow:hidden;
        ">
            <div id="dailyProgressBar" style="
                height:100%;
                width:${progressPct}%;
                background:var(--gold);
                border-radius:99px;
                transition:width .9s cubic-bezier(.4,0,.2,1);
            "></div>
        </div>

        <div style="
            font-family:'Cinzel',serif;
            font-size:.68rem;
            letter-spacing:.12em;
            color:var(--gold-dark);
            margin-bottom:2rem;
        ">Dia ${doy} de ${DAYS_IN_YEAR} &nbsp;·&nbsp; ${progressPct}% concluído</div>

        <button id="concludeBtn" style="
            font-family:'Cinzel',serif;
            font-size:.88rem;
            letter-spacing:.13em;
            color:var(--ink);
            background:linear-gradient(135deg,var(--gold-dark) 0%,var(--gold) 55%,var(--gold-light) 100%);
            border:none;
            border-radius:8px;
            padding:.9rem 2.8rem;
            cursor:pointer;
            box-shadow:0 4px 20px rgba(201,169,110,.38);
            transition:transform .18s,box-shadow .18s;
            display:inline-flex;
            align-items:center;
            gap:.65rem;
        ">
            <i class="bi bi-check2-circle" style="font-size:1.2rem"></i>
            Concluir leitura de hoje
        </button>

        <div id="concludeMsg" style="
            margin-top:1.5rem;
            font-family:'EB Garamond',serif;
            font-size:1.05rem;
            font-style:italic;
            color:var(--ink-soft);
            opacity:0;
            transition:opacity .8s ease .25s;
            min-height:1.6em;
        "></div>
    `;

    container.appendChild(wrap);

    const btn = wrap.querySelector('#concludeBtn');
    const msg = wrap.querySelector('#concludeMsg');
    const bar = wrap.querySelector('#dailyProgressBar');

    // Hover micro-interaction
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px) scale(1.03)';
        btn.style.boxShadow = '0 8px 30px rgba(201,169,110,.55)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.boxShadow = '0 4px 20px rgba(201,169,110,.38)';
    });

    const VERSES = [
        '"A tua palavra é lâmpada que ilumina os meus passos." — Sl 119:105',
        '"Bem-aventurado o que lê, e os que ouvem as palavras desta profecia." — Ap 1:3',
        '"Procurai ao Senhor enquanto se pode achar." — Is 55:6',
        '"A palavra de Deus é viva e eficaz." — Hb 4:12',
        '"Sede cumpridores da palavra, e não somente ouvintes." — Tg 1:22',
        '"O céu e a terra passarão, mas as minhas palavras não passarão." — Mt 24:35',
        '"Bem-aventurado o homem que não anda segundo o conselho dos ímpios." — Sl 1:1',
        '"Em meu coração guardei as tuas palavras, para não pecar contra ti." — Sl 119:11',
    ];

    btn.addEventListener('click', () => {
        // 1 — confetti
        launchConfetti();

        // 2 — morph button to success
        btn.disabled = true;
        Object.assign(btn.style, {
            background:  'linear-gradient(135deg,#2e7d32,#43a047)',
            color:       '#fff',
            transform:   'scale(1.07)',
            boxShadow:   '0 6px 26px rgba(46,125,50,.45)',
            cursor:      'default',
        });
        btn.innerHTML = `<i class="bi bi-check-circle-fill" style="font-size:1.2rem"></i>&nbsp;Concluído!`;

        // 3 — animate progress bar to full briefly
        if (bar) {
            bar.style.width      = '100%';
            bar.style.background = 'linear-gradient(90deg,#2e7d32,#66bb6a)';
        }

        // 4 — inspirational verse fades in
        msg.textContent = VERSES[Math.floor(Math.random() * VERSES.length)];
        // double rAF to ensure transition triggers after paint
        requestAnimationFrame(() => requestAnimationFrame(() => {
            msg.style.opacity = '1';
        }));

        // 5 — scroll to top after a moment
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 1500);
    });
}

/* ══════════════════════════ RENDER ═════════════════════════════ */

function renderDailyContent(content, doy, portions, chapterData) {
    content.innerHTML = '';
    content.className = 'fade-in';

    const year       = new Date().getFullYear();
    const date       = new Date(year, 0, doy);
    const dateStr    = formatDatePtBR(date);
    const isToday    = doy === todayDayOfYear();
    const dayLabel   = isToday ? 'Hoje' : `Dia ${doy}`;
    const chapLabels = portions.map(p => `${p.bookName} ${p.chapter}`).join(' · ');

    content.insertAdjacentHTML('beforeend', `
        <h1 class="bible-heading">Leitura do Dia</h1>
        <div class="bible-subheading">${dateStr}</div>
        <div class="ornament">✦ ✦ ✦</div>
        <div class="note-card" style="text-align:center;margin-bottom:2rem;">
            <div class="note-label">${dayLabel} de ${DAYS_IN_YEAR} · Bíblia em 1 Ano</div>
            <div style="font-size:1rem;color:var(--ink-soft);margin-top:.25rem">${chapLabels}</div>
        </div>
    `);

    portions.forEach((p, i) => {
        const verses = chapterData[i];
        content.insertAdjacentHTML('beforeend', `
            <h2 style="
                font-family:'Cinzel',serif;
                font-size:1.1rem;
                color:var(--red-bible);
                margin:2rem 0 .4rem;
                letter-spacing:.05em;
            ">${p.bookName} — Capítulo ${p.chapter}</h2>
            <div style="border-bottom:1px solid var(--gold-dark);margin-bottom:1rem;opacity:.4;"></div>
        `);
        const verseWrap = document.createElement('div');
        verses.forEach(v => {
            const div = document.createElement('div');
            div.className = 'verse';
            div.innerHTML = `
                <span class="verse-num">${v.verse}</span>
                <span class="verse-text" style="font-size:${state.fontSize}rem">${v.text}</span>`;
            div.onclick = () => div.classList.toggle('highlight');
            verseWrap.appendChild(div);
        });
        content.appendChild(verseWrap);
    });

    // Conclude button — no prev/next
    appendConcludeButton(content, doy);

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.innerWidth < 768) closeSidebar();
}

/* ══════════════════════════ LOAD ═══════════════════════════════ */

async function loadDailyReading() {
    window.speechSynthesis?.cancel();
    ttsSetPlaying(false);

    const doy      = todayDayOfYear();
    const portions = YEAR_PLAN[doy - 1];

    const loader  = document.getElementById('loader');
    const content = document.getElementById('content');
    const errMsg  = document.getElementById('error-msg');

    loader?.classList.remove('d-none');
    content?.classList.add('d-none');
    errMsg?.classList.add('d-none');
    document.querySelectorAll('.book-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('dailyBtn')?.classList.add('active');

    try {
        const chapterData = await Promise.all(
            portions.map(p => fetchChapter(p.bookId, p.chapter))
        );
        loader?.classList.add('d-none');
        content?.classList.remove('d-none');
        renderDailyContent(content, doy, portions, chapterData);
    } catch (e) {
        loader?.classList.add('d-none');
        if (errMsg) {
            errMsg.classList.remove('d-none');
            errMsg.innerHTML = `
                <div style="text-align:center;padding:2rem">
                    <i class="bi bi-exclamation-circle" style="font-size:2.5rem;opacity:.5"></i>
                    <p style="margin-top:1rem">${e.message}</p>
                    <button onclick="loadDailyReading()" class="btn-nav" style="margin:auto">
                        Tentar Novamente
                    </button>
                </div>`;
        }
    }
}

/* ══════════════════════════ SIDEBAR ════════════════════════════ */

function buildDailySidebar() {
    const container = document.getElementById('dailyBooks');
    if (!container) return;

    const btn = document.createElement('button');
    btn.className = 'book-btn';
    btn.id        = 'dailyBtn';
    btn.innerHTML = `<i class="bi bi-calendar-check" style="margin-right:.5rem;font-size:.85rem"></i>Leitura de Hoje`;
    btn.onclick   = () => {
        document.querySelectorAll('.book-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadDailyReading();
    };
    container.appendChild(btn);
}

window.addEventListener('DOMContentLoaded', () => {
    buildDailySidebar();
});