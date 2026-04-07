/**
 * LEITURA DIÁRIA — Bíblia em 1 Ano
 *
 * Builds a 365-day reading plan that covers all 1,189 chapters.
 * Requires: ALL_BOOKS, fetchChapter, state, closeSidebar (from script.js / sidebar.js)
 */

(function () {
    /* ── constants ─────────────────────────────────────────────── */
    const DAYS_IN_YEAR = 365;

    /* ── helpers ───────────────────────────────────────────────── */
    function buildYearPlan() {
        const all = [];
        for (const b of ALL_BOOKS)
            for (let c = 1; c <= b.chapters; c++)
                all.push({ bookId: b.id, bookName: b.name, chapter: c });

        const total = all.length; // 1189
        const base  = Math.floor(total / DAYS_IN_YEAR); // 3
        const extra = total % DAYS_IN_YEAR;              // 4

        const plan = [];
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
        const diff  = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.min(Math.floor(diff / oneDay), DAYS_IN_YEAR);
    }

    function formatDateLocalized(doy) {
        const year = new Date().getFullYear();
        const date = new Date(year, 0, doy);
        const locale = window.state.lang === 'pt' ? 'pt-BR' : 'en-US';
        return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
    }

    /* ── confetti ──────────────────────────────────────────────── */
    function launchConfetti() {
        const canvas = document.createElement('canvas');
        Object.assign(canvas.style, {
            position: 'fixed', inset: '0',
            width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: '9999',
        });
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        const ctx    = canvas.getContext('2d');
        const COLORS = ['#c9a96e','#e8d5a8','#8b6f3a','#8b1a1a','#f5edd8','#fffbe6','#d4ac0d','#ffffff'];

        const particles = Array.from({ length: 180 }, () => {
            const angle = Math.random() * Math.PI * 2;
            const speed = 4 + Math.random() * 10;
            return {
                x: canvas.width  * (0.15 + Math.random() * 0.7),
                y: canvas.height * (0.3  + Math.random() * 0.35),
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - (7 + Math.random() * 7),
                size: 5 + Math.random() * 8,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.28,
                shape: Math.random() < 0.55 ? 'rect' : 'circle',
                alpha: 1,
                decay: 0.011 + Math.random() * 0.009,
            };
        });

        (function tick() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = 0;
            for (const p of particles) {
                p.x  += p.vx;  p.y  += p.vy;
                p.vy += 0.34;  p.vx *= 0.992;
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
        })();
    }

    /* ── conclude button ───────────────────────────────────────── */
    function appendConcludeButton(container, doy) {
        const progressPct = Math.round((doy / DAYS_IN_YEAR) * 100);
        const QUOTES = window.state.lang === 'pt' ? [
            '"A tua palavra é lâmpada que ilumina os meus passos." — Sl 119:105',
            '"Bem-aventurado o que lê, e os que ouvem as palavras desta profecia." — Ap 1:3',
        ] : [
            '"Your word is a lamp to my feet and a light to my path." — Ps 119:105',
            '"Blessed is the one who reads aloud the words of this prophecy." — Rev 1:3',
        ];

        const wrap = document.createElement('div');
        wrap.className = 'daily-conclude-wrap';
        wrap.innerHTML = `
            <div class="daily-progress-label">${window.t('annualProgress', 'daily')}</div>
            <div class="daily-progress-track">
                <div class="daily-progress-bar" style="width:${progressPct}%"></div>
            </div>
            <div class="daily-progress-info">${window.t('day', 'daily')} ${doy} ${window.t('of', 'daily')} ${DAYS_IN_YEAR} &nbsp;·&nbsp; ${progressPct}% ${window.t('concluded', 'daily')}</div>
            <button class="btn-conclude" id="concludeBtn">
                <i class="bi bi-check2-circle"></i> ${window.t('concludeBtn', 'daily')}
            </button>
            <div class="conclude-msg" id="concludeMsg"></div>
        `;
        container.appendChild(wrap);

        const btn = wrap.querySelector('#concludeBtn');
        const msg = wrap.querySelector('#concludeMsg');
        const bar = wrap.querySelector('.daily-progress-bar');

        btn.addEventListener('click', () => {
            launchConfetti();
            btn.disabled = true;
            btn.classList.add('done');
            btn.innerHTML = `<i class="bi bi-check-circle-fill"></i>&nbsp;${window.t('done', 'daily')}`;
            if (bar) { bar.style.width = '100%'; bar.classList.add('bar-done'); }
            msg.textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];
            msg.classList.add('visible');
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 1500);
        });
    }

    /* ── render daily content ──────────────────────────────────── */
    function renderDailyContent(doy, portions, chapterData) {
        const content  = document.getElementById('content');
        const dateStr  = formatDateLocalized(doy);
        const isToday  = doy === todayDayOfYear();
        const dayLabel = isToday ? window.t('today', 'daily') : `${window.t('day', 'daily')} ${doy}`;
        const chapLabels = portions.map(p => `${p.bookName} ${p.chapter}`).join(' · ');

        content.innerHTML = '';
        content.className = 'fade-in';

        content.insertAdjacentHTML('beforeend', `
            <h1 class="bible-heading">${window.t('title', 'daily')}</h1>
            <div class="bible-subheading">${dateStr}</div>
            <div class="ornament">✦ ✦ ✦</div>
            <div class="note-card">
                <div class="note-label">${dayLabel} ${window.t('of', 'daily')} ${DAYS_IN_YEAR} · ${window.t('planName', 'daily')}</div>
                <div class="note-chapters">${chapLabels}</div>
            </div>
        `);

        portions.forEach((p, i) => {
            const verses = chapterData[i];
            content.insertAdjacentHTML('beforeend', `
                <h2 class="daily-book-heading">${p.bookName} — ${window.t('chapter')} ${p.chapter}</h2>
                <div class="daily-book-divider"></div>
            `);
            const verseWrap = document.createElement('div');
            verses.forEach(v => {
                const div = document.createElement('div');
                div.className = 'verse';
                div.innerHTML = `
                    <span class="verse-num">${v.verse}</span>
                    <span class="verse-text" style="font-size:${window.state.fontSize}rem">${v.text}</span>
                `;
                div.onclick = () => div.classList.toggle('highlight');
                verseWrap.appendChild(div);
            });
            content.appendChild(verseWrap);
        });

        appendConcludeButton(content, doy);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.innerWidth < 768) window.closeSidebar?.();
    }

    /* ── load daily reading ────────────────────────────────────── */
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

        /* highlight sidebar button */
        document.querySelectorAll('.book-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('dailyBtn')?.classList.add('active');

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
                        <i class="bi bi-exclamation-circle" style="font-size:2.5rem;opacity:.5"></i>
                        <p style="margin-top:1rem">${window.t('errorGeneric')}</p>
                        <button onclick="loadDailyReading()" class="btn-nav" style="margin:auto">
                            ${window.t('tryAgain', 'daily')}
                        </button>
                    </div>`;
            }
        }
    }

    /* ── build sidebar entry ───────────────────────────────────── */
    function buildDailySidebar() {
        const container = document.getElementById('dailyBooks');
        if (!container) return;

        const btn = document.createElement('button');
        btn.className   = 'book-btn';
        btn.id          = 'dailyBtn';
        btn.innerHTML   = `<i class="bi bi-calendar-check"></i> ${window.t('todayReading')}`;
        btn.onclick     = loadDailyReading;
        container.appendChild(btn);
    }

    /* ── expose & init ─────────────────────────────────────────── */
    window.loadDailyReading = loadDailyReading;

    document.addEventListener('DOMContentLoaded', () => {
        buildDailySidebar();
    });
})();