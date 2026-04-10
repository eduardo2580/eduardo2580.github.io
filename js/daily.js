/**
 * LEITURA DIÁRIA — Bíblia em 1 Ano
 * Redesign completo com tokens do design system.
 */

(function () {
    const DAYS_IN_YEAR = 365;
    const STORAGE_KEY  = 'daily_completed_v1';

    /* ── helpers ─────────────────────────────────────────────── */
    function buildYearPlan() {
        const all = [];
        for (const b of ALL_BOOKS)
            for (let c = 1; c <= b.chapters; c++)
                all.push({ bookId: b.id, bookName: b.name, chapter: c });
        const total = all.length;
        const base  = Math.floor(total / DAYS_IN_YEAR);
        const extra = total % DAYS_IN_YEAR;
        const plan  = [];
        let idx = 0;
        for (let d = 0; d < DAYS_IN_YEAR; d++) {
            const count = d < extra ? base + 1 : base;
            plan.push(all.slice(idx, idx + count));
            idx += count;
        }
        return plan;
    }

    function todayDayOfYear() {
        const now   = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        return Math.min(Math.floor((now - start) / 86400000), DAYS_IN_YEAR);
    }

    function formatDate(doy) {
        const d = new Date(new Date().getFullYear(), 0, doy);
        const locale = window.state?.lang === 'pt' ? 'pt-BR' : 'en-US';
        return d.toLocaleDateString(locale, { day: 'numeric', month: 'long' });
    }

    function loadCompleted() {
        try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')); }
        catch (_) { return new Set(); }
    }

    function saveCompleted(set) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...set])); } catch (_) {}
    }

    /* ── styles ──────────────────────────────────────────────── */
    function injectStyles() {
        if (document.getElementById('daily-styles-v2')) return;
        const s = document.createElement('style');
        s.id = 'daily-styles-v2';
        s.textContent = `
/* ── wrapper ── */
.daily-wrap { padding: 0 1.25rem 3rem; max-width: 600px; margin: 0 auto; }

/* ── hero banner ── */
.daily-hero {
    position: relative; overflow: hidden;
    background: var(--ink, #1a140a);
    border: 1px solid rgba(201,169,110,.2);
    border-radius: 20px;
    padding: 2rem 1.5rem 1.75rem;
    margin-bottom: 1.75rem;
}
.daily-hero::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none;
    background:
        radial-gradient(ellipse 60% 50% at 90% 20%, rgba(201,169,110,.13) 0%, transparent 70%),
        radial-gradient(ellipse 40% 60% at 10% 90%, rgba(139,26,26,.1) 0%, transparent 70%);
}
.daily-hero::after {
    content: '365';
    position: absolute; right: -0.5rem; bottom: -1rem;
    font-size: 6rem; font-weight: 900; letter-spacing: -.04em;
    color: rgba(255,255,255,.03); line-height: 1;
    pointer-events: none; user-select: none;
}
.daily-hero-tag {
    font-size: .65rem; font-weight: 700; letter-spacing: .2em;
    text-transform: uppercase; color: var(--gold, #c9a96e);
    opacity: .75; margin: 0 0 .4rem;
}
.daily-hero-title {
    font-family: 'Cinzel', serif;
    font-size: 1.7rem; font-weight: 800; line-height: 1.1;
    color: var(--parchment, #f5edd8); margin: 0 0 .35rem;
}
.daily-hero-date {
    font-size: .8rem; color: rgba(245,237,216,.45);
    margin: 0 0 1.25rem; font-style: italic;
}
.daily-hero-progress-wrap {
    height: 5px; background: rgba(255,255,255,.1);
    border-radius: 999px; overflow: hidden;
}
.daily-hero-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold-dark,#8b6f3a), var(--gold,#c9a96e));
    border-radius: 999px;
    transition: width .7s cubic-bezier(.4,0,.2,1);
}
.daily-hero-progress-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: .4rem;
}
.daily-hero-pct {
    font-size: .7rem; font-weight: 700; color: var(--gold,#c9a96e);
    letter-spacing: .05em;
}
.daily-hero-daycount {
    font-size: .7rem; color: rgba(255,255,255,.3); letter-spacing: .04em;
}

/* ── stat chips ── */
.daily-chips {
    display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: 1.5rem;
}
.daily-chip {
    display: inline-flex; align-items: center; gap: .35rem;
    background: var(--parchment-d, #ede3d0);
    border: 1px solid rgba(139,111,58,.15);
    border-radius: 999px; padding: .35rem .85rem;
    font-size: .72rem; font-weight: 700; letter-spacing: .04em;
    color: var(--ink, #1a140a);
}
.daily-chip i { color: var(--gold-dark,#8b6f3a); font-size: .85rem; }

/* ── note card ── */
.daily-note {
    background: var(--parchment-d, #ede3d0);
    border: 1px solid rgba(139,111,58,.18);
    border-radius: 14px; padding: .9rem 1rem;
    margin-bottom: 1.5rem;
    display: flex; align-items: flex-start; gap: .75rem;
}
.daily-note-icon {
    font-size: 1.1rem; color: var(--gold-dark,#8b6f3a);
    flex-shrink: 0; margin-top: .1rem; opacity: .7;
}
.daily-note-label {
    font-size: .65rem; font-weight: 700; letter-spacing: .08em;
    text-transform: uppercase; color: var(--gold-dark,#8b6f3a);
    margin-bottom: .2rem;
}
.daily-note-chapters {
    font-size: .88rem; font-weight: 600; line-height: 1.45;
    color: var(--ink,#1a140a);
}

/* ── section divider ── */
.daily-section-label {
    font-size: .66rem; font-weight: 700; letter-spacing: .12em;
    text-transform: uppercase; color: rgba(0,0,0,.35);
    margin: 0 0 .6rem; padding: 0 .1rem;
}

/* ── book block ── */
.daily-book-block {
    margin-bottom: 1.5rem;
    border: 1px solid rgba(0,0,0,.07);
    border-radius: 14px; overflow: hidden;
}
.daily-book-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: .75rem 1rem;
    background: var(--ink, #1a140a);
    cursor: pointer;
    user-select: none;
}
.daily-book-header-left {
    display: flex; align-items: center; gap: .6rem;
}
.daily-book-badge {
    width: 28px; height: 28px; border-radius: 7px;
    background: rgba(201,169,110,.18);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold,#c9a96e); font-size: .75rem; font-weight: 700;
    font-family: 'Cinzel', serif; flex-shrink: 0;
}
.daily-book-name {
    font-family: 'Cinzel', serif;
    font-size: .9rem; font-weight: 700;
    color: var(--parchment,#f5edd8); margin: 0;
}
.daily-book-chap {
    font-size: .7rem; color: rgba(245,237,216,.4);
    letter-spacing: .06em; margin-top: .1rem;
}
.daily-book-chevron {
    color: rgba(245,237,216,.35); font-size: .85rem;
    transition: transform .2s ease;
}
.daily-book-block.open .daily-book-chevron { transform: rotate(90deg); }
.daily-book-verses {
    display: none; padding: .25rem 0 .5rem;
    background: rgba(255,255,255,.55);
}
.daily-book-block.open .daily-book-verses { display: block; }

/* ── progress + conclude ── */
.daily-conclude-wrap {
    background: var(--parchment-d, #ede3d0);
    border: 1px solid rgba(139,111,58,.2);
    border-radius: 16px; padding: 1.25rem;
    margin-top: 1.5rem;
}
.daily-progress-label {
    font-size: .66rem; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; color: var(--gold-dark,#8b6f3a);
    margin-bottom: .5rem;
}
.daily-progress-track {
    height: 6px; background: rgba(0,0,0,.08);
    border-radius: 999px; overflow: hidden; margin-bottom: .4rem;
}
.daily-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--gold-dark,#8b6f3a), var(--gold,#c9a96e));
    border-radius: 999px;
    transition: width .8s cubic-bezier(.4,0,.2,1);
}
.daily-progress-bar.bar-done {
    background: linear-gradient(90deg, #059669, #10b981);
}
.daily-progress-info {
    font-size: .72rem; color: rgba(0,0,0,.4);
    letter-spacing: .04em; margin-bottom: 1rem;
}
.btn-conclude-daily {
    width: 100%; padding: .9rem 1.25rem;
    background: var(--gold-dark, #8b6f3a);
    color: var(--parchment, #f5edd8);
    border: none; border-radius: 12px;
    font-family: 'Cinzel', serif;
    font-size: .9rem; font-weight: 700; letter-spacing: .04em;
    cursor: pointer; display: flex; align-items: center;
    justify-content: center; gap: .5rem;
    transition: all .2s ease;
    box-shadow: 0 3px 14px rgba(139,111,58,.3);
}
.btn-conclude-daily:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 5px 20px rgba(139,111,58,.4);
}
.btn-conclude-daily:disabled { opacity: .7; cursor: not-allowed; transform: none; }
.btn-conclude-daily.done {
    background: #059669;
    box-shadow: 0 3px 14px rgba(5,150,105,.3);
}
.daily-conclude-quote {
    font-style: italic; font-size: .82rem;
    color: var(--gold-dark,#8b6f3a); text-align: center;
    margin-top: .9rem; line-height: 1.55;
    opacity: 0; max-height: 0; overflow: hidden;
    transition: opacity .5s ease, max-height .5s ease;
}
.daily-conclude-quote.visible { opacity: 1; max-height: 60px; }

/* ── already done banner ── */
.daily-done-banner {
    background: rgba(5,150,105,.08);
    border: 1px solid rgba(5,150,105,.25);
    border-radius: 12px; padding: .75rem 1rem;
    display: flex; align-items: center; gap: .65rem;
    margin-bottom: 1.5rem;
}
.daily-done-banner i { color: #059669; font-size: 1rem; }
.daily-done-banner span { font-size: .82rem; font-weight: 600; color: #059669; }
        `;
        document.head.appendChild(s);
    }

    /* ── confetti ─────────────────────────────────────────────── */
    function launchConfetti() {
        const canvas = document.createElement('canvas');
        Object.assign(canvas.style, {
            position: 'fixed', inset: '0', width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: '9999',
        });
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        const ctx    = canvas.getContext('2d');
        const COLORS = ['#c9a96e','#e8d5a8','#8b6f3a','#8b1a1a','#f5edd8','#fffbe6','#d4ac0d','#ffffff'];
        const particles = Array.from({ length: 200 }, () => {
            const angle = Math.random() * Math.PI * 2;
            const speed = 4 + Math.random() * 10;
            return {
                x: canvas.width * (.15 + Math.random() * .7),
                y: canvas.height * (.3 + Math.random() * .35),
                vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - (7 + Math.random() * 7),
                size: 5 + Math.random() * 8,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - .5) * .28,
                shape: Math.random() < .55 ? 'rect' : 'circle',
                alpha: 1, decay: .011 + Math.random() * .009,
            };
        });
        (function tick() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = 0;
            for (const p of particles) {
                p.x += p.vx; p.y += p.vy; p.vy += .34; p.vx *= .992;
                p.rotation += p.rotSpeed; p.alpha -= p.decay;
                if (p.alpha <= 0) continue; alive++;
                ctx.save(); ctx.globalAlpha = p.alpha;
                ctx.translate(p.x, p.y); ctx.rotate(p.rotation); ctx.fillStyle = p.color;
                if (p.shape === 'rect') ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
                else { ctx.beginPath(); ctx.arc(0, 0, p.size/2, 0, Math.PI*2); ctx.fill(); }
                ctx.restore();
            }
            if (alive > 0) requestAnimationFrame(tick); else canvas.remove();
        })();
    }

    /* ── render ──────────────────────────────────────────────── */
    function renderDailyContent(doy, portions, chapterData) {
        injectStyles();
        const content = document.getElementById('content');
        content.innerHTML = '';
        content.className = 'fade-in';

        const completed   = loadCompleted();
        const todayKey    = `daily_${new Date().getFullYear()}_${doy}`;
        const alreadyDone = completed.has(todayKey);
        const pct         = Math.round((doy / DAYS_IN_YEAR) * 100);
        const chapLabels  = portions.map(p => `${p.bookName} ${p.chapter}`).join(' · ');
        const QUOTES      = window.state?.lang === 'pt' ? [
            '"A tua palavra é lâmpada que ilumina os meus passos." — Sl 119:105',
            '"Bem-aventurado o que lê, e os que ouvem as palavras desta profecia." — Ap 1:3',
        ] : [
            '"Your word is a lamp to my feet and a light to my path." — Ps 119:105',
            '"Blessed is the one who reads aloud the words of this prophecy." — Rev 1:3',
        ];

        const wrap = document.createElement('div');
        wrap.className = 'daily-wrap';

        /* — hero — */
        wrap.innerHTML = `
            <div class="daily-hero">
                <p class="daily-hero-tag">${window.t('planName', 'daily') || 'Plano Bíblico Anual'}</p>
                <h2 class="daily-hero-title">${window.t('title', 'daily') || 'Leitura Diária'}</h2>
                <p class="daily-hero-date">${formatDate(doy)}</p>
                <div class="daily-hero-progress-wrap">
                    <div class="daily-hero-progress-fill" style="width:${pct}%"></div>
                </div>
                <div class="daily-hero-progress-row">
                    <span class="daily-hero-daycount">${window.t('day','daily')} ${doy} ${window.t('of','daily')} ${DAYS_IN_YEAR}</span>
                    <span class="daily-hero-pct">${pct}%</span>
                </div>
            </div>

            <div class="daily-chips">
                <span class="daily-chip"><i class="ph ph-book-open"></i> ${portions.length} ${portions.length === 1 ? 'capítulo' : 'capítulos'}</span>
                <span class="daily-chip"><i class="ph ph-calendar-blank"></i> ${window.t('today','daily') || 'Hoje'}</span>
                ${alreadyDone ? `<span class="daily-chip" style="background:rgba(5,150,105,.1);border-color:rgba(5,150,105,.25);color:#059669"><i class="ph ph-check-circle" style="color:#059669"></i> ${window.t('concluded','daily') || 'Concluído'}</span>` : ''}
            </div>

            ${alreadyDone ? `
                <div class="daily-done-banner">
                    <i class="ph ph-check-circle"></i>
                    <span>${window.t('done','daily') || 'Leitura já concluída hoje!'}</span>
                </div>` : ''}

            <div class="daily-note">
                <i class="ph ph-book daily-note-icon"></i>
                <div>
                    <div class="daily-note-label">${window.t('todayReading') || 'Leitura de Hoje'}</div>
                    <div class="daily-note-chapters">${chapLabels}</div>
                </div>
            </div>

            <p class="daily-section-label">Capítulos</p>
        `;

        /* — book blocks (collapsible) — */
        portions.forEach((p, i) => {
            const block = document.createElement('div');
            block.className = 'daily-book-block';

            const header = document.createElement('div');
            header.className = 'daily-book-header';
            header.innerHTML = `
                <div class="daily-book-header-left">
                    <div class="daily-book-badge">${i + 1}</div>
                    <div>
                        <p class="daily-book-name">${p.bookName}</p>
                        <p class="daily-book-chap">${window.t('chapter') || 'Capítulo'} ${p.chapter}</p>
                    </div>
                </div>
                <i class="ph ph-caret-right daily-book-chevron"></i>
            `;

            const versesWrap = document.createElement('div');
            versesWrap.className = 'daily-book-verses';

            const verses = chapterData[i];
            verses.forEach(v => {
                const div = document.createElement('div');
                div.className = 'verse';
                div.innerHTML = `
                    <span class="verse-num">${v.verse}</span>
                    <span class="verse-text" style="font-size:${window.state?.fontSize || 1.1}rem">${v.text}</span>
                `;
                div.onclick = () => div.classList.toggle('highlight');
                versesWrap.appendChild(div);
            });

            header.onclick = () => {
                block.classList.toggle('open');
                block.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            };

            block.appendChild(header);
            block.appendChild(versesWrap);

            /* open first block by default */
            if (i === 0) block.classList.add('open');

            wrap.appendChild(block);
        });

        /* — conclude section — */
        const concludeWrap = document.createElement('div');
        concludeWrap.className = 'daily-conclude-wrap';
        concludeWrap.innerHTML = `
            <div class="daily-progress-label">${window.t('annualProgress','daily') || 'Progresso Anual'}</div>
            <div class="daily-progress-track">
                <div class="daily-progress-bar ${alreadyDone ? 'bar-done' : ''}" style="width:${alreadyDone ? 100 : pct}%"></div>
            </div>
            <div class="daily-progress-info">
                ${window.t('day','daily')} ${doy} ${window.t('of','daily')} ${DAYS_IN_YEAR} &nbsp;·&nbsp; ${pct}% ${window.t('concluded','daily') || 'concluído'}
            </div>
            <button class="btn-conclude-daily ${alreadyDone ? 'done' : ''}" id="dailyConcludeBtn" ${alreadyDone ? 'disabled' : ''}>
                <i class="ph ${alreadyDone ? 'ph-check-circle' : 'ph-check-circle'}"></i>
                ${alreadyDone ? (window.t('done','daily') || 'Leitura Concluída!') : (window.t('concludeBtn','daily') || 'Concluir Leitura')}
            </button>
            <div class="daily-conclude-quote" id="dailyQuote"></div>
        `;

        if (!alreadyDone) {
            const btn  = concludeWrap.querySelector('#dailyConcludeBtn');
            const bar  = concludeWrap.querySelector('.daily-progress-bar');
            const quote = concludeWrap.querySelector('#dailyQuote');
            btn.addEventListener('click', () => {
                launchConfetti();
                completed.add(todayKey);
                saveCompleted(completed);
                btn.disabled = true;
                btn.classList.add('done');
                btn.innerHTML = `<i class="ph ph-check-circle"></i> ${window.t('done','daily') || 'Leitura Concluída!'}`;
                if (bar) { bar.style.width = '100%'; bar.classList.add('bar-done'); }
                quote.textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];
                quote.classList.add('visible');
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 1500);
            });
        }

        wrap.appendChild(concludeWrap);
        content.appendChild(wrap);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ── load ────────────────────────────────────────────────── */
    async function loadDailyReading() {
        window.speechSynthesis?.cancel();
        if (typeof window.ttsSetPlaying === 'function') window.ttsSetPlaying(false);

        const doy      = todayDayOfYear();
        const plan     = buildYearPlan();
        const portions = plan[doy - 1];

        const loader  = document.getElementById('loader');
        const content = document.getElementById('content');
        const errMsg  = document.getElementById('error-msg');

        loader?.classList.remove('d-none');
        content?.classList.add('d-none');
        errMsg?.classList.add('d-none');

        try {
            const chapterData = await Promise.all(
                portions.map(p => fetchChapter(p.bookId, p.chapter))
            );
            loader?.classList.add('d-none');
            content?.classList.remove('d-none');
            renderDailyContent(doy, portions, chapterData);
        } catch (e) {
            loader?.classList.add('d-none');
            if (errMsg) {
                errMsg.classList.remove('d-none');
                errMsg.innerHTML = `
                    <div style="text-align:center;padding:2rem">
                        <i class="ph ph-warning-circle" style="font-size:2.5rem;opacity:.4"></i>
                        <p style="margin-top:1rem">${window.t('errorGeneric') || 'Erro ao carregar.'}</p>
                        <button onclick="window.loadDailyReading()" class="btn-nav" style="margin:auto">
                            ${window.t('tryAgain') || 'Tentar Novamente'}
                        </button>
                    </div>`;
            }
        }
    }

    /* ── expose ──────────────────────────────────────────────── */
    window.loadDailyReading = loadDailyReading;

    document.addEventListener('DOMContentLoaded', () => {
        /* sidebar entry (se existir) */
        const container = document.getElementById('dailyBooks');
        if (container && !container.querySelector('#dailyBtn')) {
            const btn = document.createElement('button');
            btn.className = 'book-btn';
            btn.id        = 'dailyBtn';
            btn.innerHTML = `<i class="ph ph-calendar-check"></i> ${window.t('todayReading') || 'Leitura de Hoje'}`;
            btn.onclick   = loadDailyReading;
            container.appendChild(btn);
        }
    });
})();