/**
 * LEITURA DIÁRIA — Bíblia em 1 Ano
 * Adapted for New Design
 */

(function () {
    const DAYS_IN_YEAR = 365;

    function buildYearPlan() {
        const all = [];
        for (const b of ALL_BOOKS)
            for (let c = 1; c <= b.chapters; c++)
                all.push({ bookId: b.id, bookName: b.name, chapter: c });

        const total = all.length;
        const base  = Math.floor(total / DAYS_IN_YEAR);
        const extra = total % DAYS_IN_YEAR;
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

    function launchConfetti() {
        const canvas = document.createElement('canvas');
        Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '9999' });
        canvas.width  = window.innerWidth; canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        const COLORS = ['#c9a96e','#e8d5a8','#8b6f3a','#8b1a1a','#f5edd8','#fffbe6','#d4ac0d','#ffffff'];
        const particles = Array.from({ length: 180 }, () => {
            const angle = Math.random() * Math.PI * 2;
            const speed = 4 + Math.random() * 10;
            return {
                x: canvas.width * (0.15 + Math.random() * 0.7),
                y: canvas.height * (0.3 + Math.random() * 0.35),
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - (7 + Math.random() * 7),
                size: 5 + Math.random() * 8,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.28,
                shape: Math.random() < 0.55 ? 'rect' : 'circle', alpha: 1, decay: 0.011 + Math.random() * 0.009,
            };
        });
        (function tick() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = 0;
            for (const p of particles) {
                p.x += p.vx; p.y += p.vy; p.vy += 0.34; p.vx *= 0.992;
                p.rotation += p.rotSpeed; p.alpha -= p.decay;
                if (p.alpha <= 0) continue; alive++;
                ctx.save(); ctx.globalAlpha = p.alpha; ctx.translate(p.x, p.y); ctx.rotate(p.rotation); ctx.fillStyle = p.color;
                if (p.shape === 'rect') ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
                else { ctx.beginPath(); ctx.arc(0, 0, p.size/2, 0, Math.PI*2); ctx.fill(); }
                ctx.restore();
            }
            if (alive > 0) requestAnimationFrame(tick); else canvas.remove();
        })();
    }

    function renderDailyContent(doy, portions, chapterData) {
        const content  = document.getElementById('content');
        const dateStr  = formatDateLocalized(doy);
        const isToday  = doy === todayDayOfYear();
        const dayLabel = isToday ? window.t('today', 'daily') : `${window.t('day', 'daily')} ${doy}`;
        const chapLabels = portions.map(p => `${p.bookName} ${p.chapter}`).join(' · ');

        content.innerHTML = '';
        content.insertAdjacentHTML('beforeend', `
            <div class="fade-in">
                <h1 class="bible-heading">${window.t('title', 'daily')}</h1>
                <div class="bible-subheading">${dateStr}</div>
                <div class="ornament">✦ ✦ ✦</div>

                <div class="verse-card-wrapper">
                    <div class="verse-card" style="background: var(--parchment-d); color: var(--ink); border-color: var(--gold-dark);">
                        <div class="verse-header" style="color: var(--gold-dark);">${dayLabel} ${window.t('of', 'daily')} ${DAYS_IN_YEAR}</div>
                        <div class="verse-reference" style="color: var(--red-bible); font-size: 1.2rem;">${window.t('planName', 'daily')}</div>
                        <div class="verse-text" style="color: var(--ink-soft); margin-bottom: 0.5rem; font-weight: 700;">${chapLabels}</div>
                    </div>
                </div>
            </div>
        `);

        portions.forEach((p, i) => {
            const verses = chapterData[i];
            content.insertAdjacentHTML('beforeend', `
                <h2 class="bible-heading" style="font-size: 1.3rem; margin-top: 2rem;">${p.bookName} — ${window.t('chapter')} ${p.chapter}</h2>
                <div class="ornament" style="margin: 0.5rem 0;">✦</div>
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

        // Conclude Button
        const progressPct = Math.round((doy / DAYS_IN_YEAR) * 100);
        const footer = document.createElement('div');
        footer.className = 'verse-card-wrapper';
        footer.style.marginTop = '2rem';
        footer.innerHTML = `
            <div class="verse-card" style="background: var(--ink); text-align: center;">
                <div class="verse-header">${window.t('annualProgress', 'daily')}</div>
                <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin: 1rem 0; overflow: hidden;">
                    <div style="width: ${progressPct}%; height: 100%; background: var(--gold);"></div>
                </div>
                <div class="verse-header" style="margin-bottom: 1.5rem;">${progressPct}% ${window.t('concluded', 'daily')}</div>
                <button class="btn-nav" id="concludeBtn" style="width: 100%; justify-content: center; background: var(--gold); color: var(--ink); border: none;">
                    <i class="ph ph-check-circle"></i> ${window.t('concludeBtn', 'daily')}
                </button>
            </div>
        `;
        content.appendChild(footer);

        footer.querySelector('#concludeBtn').onclick = (e) => {
            launchConfetti();
            e.target.disabled = true;
            e.target.innerHTML = `<i class="ph-fill ph-check-circle"></i> ${window.t('done', 'daily')}`;
        };
    }

    async function loadDailyReading() {
        window.speechSynthesis?.cancel();
        window.state.currentView = 'plans';
        const doy      = todayDayOfYear();
        const plan     = buildYearPlan();
        const portions = plan[doy - 1];

        const loader  = document.getElementById('loader');
        const content = document.getElementById('content');
        loader?.classList.remove('d-none');
        content?.classList.add('d-none');

        try {
            const chapterData = await Promise.all(portions.map(p => fetchChapter(p.bookId, p.chapter)));
            loader?.classList.add('d-none');
            content?.classList.remove('d-none');
            renderDailyContent(doy, portions, chapterData);
        } catch (e) {
            loader?.classList.add('d-none');
        }
    }

    window.loadDailyReading = loadDailyReading;
})();
