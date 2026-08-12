/**
 * READING PLANS — generic engine for fixed-duration, self-paced plans.
 * Powers: Bible in 6 Months, New Testament in 90 Days, Proverbs in 31 Days.
 * Reuses the visual language of daily.js/teens.js (ink/gold/parchment tokens).
 */
(function () {

    /* ════════════════════════════════════════════════════════════
       PLAN CONFIGS
    ════════════════════════════════════════════════════════════ */
    const CONFIGS = {
        bible6: {
            ns: 'bible6',
            days: 183,
            icon: 'ph-book-bookmark',
            getBooks: () => ALL_BOOKS,
        },
        nt90: {
            ns: 'nt90',
            days: 90,
            icon: 'ph-cross',
            getBooks: () => BOOKS.nt,
        },
        prov31: {
            ns: 'prov31',
            days: 31,
            icon: 'ph-lightbulb',
            getBooks: () => BOOKS.ot.filter(b => b.id === 'PRO'),
        },
    };

    /* ════════════════════════════════════════════════════════════
       PLAN BUILDING
    ════════════════════════════════════════════════════════════ */
    const planCache = {};
    function buildPlan(id) {
        if (planCache[id]) return planCache[id];
        const cfg = CONFIGS[id];
        const books = cfg.getBooks();
        const all = [];
        for (const b of books)
            for (let c = 1; c <= b.chapters; c++)
                all.push({ bookId: b.id, bookName: b.name, chapter: c });
        const total = all.length;
        const days = cfg.days;
        const base = Math.floor(total / days);
        const extra = total % days;
        const plan = [];
        let idx = 0;
        for (let d = 0; d < days; d++) {
            const count = (d < extra ? base + 1 : base) || 1;
            plan.push(all.slice(idx, idx + count));
            idx += count;
        }
        planCache[id] = plan;
        return plan;
    }
    function totalChapters(id) {
        return buildPlan(id).reduce((sum, day) => sum + day.length, 0);
    }

    /* ════════════════════════════════════════════════════════════
       STORAGE
    ════════════════════════════════════════════════════════════ */
    function storageKeys(id) {
        return { start: `plan_${id}_start_v1`, completed: `plan_${id}_completed_v1` };
    }
    function loadStart(id) {
        try {
            const raw = localStorage.getItem(storageKeys(id).start);
            if (!raw) return null;
            const d = new Date(raw);
            return isNaN(d.getTime()) ? null : d;
        } catch (_) { return null; }
    }
    function saveStart(id, date) {
        try { localStorage.setItem(storageKeys(id).start, date.toISOString()); } catch (_) {}
    }
    function clearStart(id) {
        try { localStorage.removeItem(storageKeys(id).start); } catch (_) {}
    }
    function loadCompleted(id) {
        try { return new Set(JSON.parse(localStorage.getItem(storageKeys(id).completed) || '[]')); }
        catch (_) { return new Set(); }
    }
    function saveCompleted(id, set) {
        try { localStorage.setItem(storageKeys(id).completed, JSON.stringify([...set])); } catch (_) {}
    }
    function clearCompleted(id) {
        try { localStorage.removeItem(storageKeys(id).completed); } catch (_) {}
    }

    function currentDay(id) {
        const cfg = CONFIGS[id];
        const start = loadStart(id);
        if (!start) return null;
        const diff = Math.floor((new Date() - start) / 86400000);
        return Math.max(1, Math.min(diff + 1, cfg.days));
    }
    function formatDayDate(id, dayNum) {
        const start = loadStart(id);
        if (!start) return '';
        const d = new Date(start);
        d.setDate(d.getDate() + dayNum - 1);
        const locale = window.langLocale ? window.langLocale(window.state?.lang) : 'pt-BR';
        return d.toLocaleDateString(locale, { day: 'numeric', month: 'long' });
    }

    /* ════════════════════════════════════════════════════════════
       I18N HELPER
    ════════════════════════════════════════════════════════════ */
    function t(id, key) {
        const ns = CONFIGS[id].ns;
        if (typeof window.t === 'function') {
            const r = window.t(key, ns);
            if (r !== key && r != null) return r;
        }
        return key;
    }

    /* ════════════════════════════════════════════════════════════
       TOAST
    ════════════════════════════════════════════════════════════ */
    function showToast(msg) {
        let toast = document.getElementById('rplanToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'rplanToast';
            toast.className = 'rplan-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('show'), 2600);
    }

    /* ════════════════════════════════════════════════════════════
       CONFETTI
    ════════════════════════════════════════════════════════════ */
    function launchConfetti() {
        const canvas = document.createElement('canvas');
        Object.assign(canvas.style, {
            position: 'fixed', inset: '0', width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: '9999',
        });
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        const COLORS = ['#c9a96e', '#e8d5a8', '#8b6f3a', '#8b1a1a', '#f5edd8', '#fffbe6', '#d4ac0d', '#ffffff'];
        const particles = Array.from({ length: 180 }, () => {
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
                alpha: 1, decay: .012 + Math.random() * .009,
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
                if (p.shape === 'rect') ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                else { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
                ctx.restore();
            }
            if (alive > 0) requestAnimationFrame(tick); else canvas.remove();
        })();
    }

    /* ════════════════════════════════════════════════════════════
       STYLES
    ════════════════════════════════════════════════════════════ */
    function injectStyles() {
        if (document.getElementById('rplan-styles-v1')) return;
        const s = document.createElement('style');
        s.id = 'rplan-styles-v1';
        s.textContent = `
.rplan-wrap { padding: 0 1.25rem 3rem; max-width: 600px; margin: 0 auto; }

.rplan-hero {
    position: relative; overflow: hidden;
    background: var(--ink, #1a140a);
    border: 1px solid rgba(201,169,110,.2);
    border-radius: 20px;
    padding: 2rem 1.5rem 1.75rem;
    margin-bottom: 1.5rem;
}
.rplan-hero::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none;
    background:
        radial-gradient(ellipse 60% 50% at 90% 20%, rgba(201,169,110,.13) 0%, transparent 70%),
        radial-gradient(ellipse 40% 60% at 10% 90%, rgba(139,26,26,.1) 0%, transparent 70%);
}
.rplan-hero-icon::after {
    position: absolute; right: -0.4rem; bottom: -1rem;
    font-size: 6rem; color: rgba(255,255,255,.03); line-height: 1;
    pointer-events: none; user-select: none;
}
.rplan-hero-tag {
    font-size: .65rem; font-weight: 700; letter-spacing: .2em;
    text-transform: uppercase; color: var(--gold, #c9a96e);
    opacity: .75; margin: 0 0 .4rem;
}
.rplan-hero-title {
    font-family: 'Cinzel', serif;
    font-size: 1.6rem; font-weight: 800; line-height: 1.15;
    color: var(--parchment, #f5edd8); margin: 0 0 .5rem;
}
.rplan-hero-desc {
    font-size: .82rem; line-height: 1.55;
    color: rgba(245,237,216,.55); margin: 0 0 1.25rem;
}
.rplan-hero-date {
    font-size: .8rem; color: rgba(245,237,216,.45);
    margin: 0 0 1.25rem; font-style: italic;
}
.rplan-hero-progress-wrap {
    height: 5px; background: rgba(255,255,255,.1);
    border-radius: 999px; overflow: hidden;
}
.rplan-hero-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold-dark,#8b6f3a), var(--gold,#c9a96e));
    border-radius: 999px;
    transition: width .7s cubic-bezier(.4,0,.2,1);
}
.rplan-hero-progress-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: .4rem;
}
.rplan-hero-pct {
    font-size: .7rem; font-weight: 700; color: var(--gold,#c9a96e);
    letter-spacing: .05em;
}
.rplan-hero-daycount {
    font-size: .7rem; color: rgba(255,255,255,.3); letter-spacing: .04em;
}

.rplan-chips { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
.rplan-chip {
    display: inline-flex; align-items: center; gap: .35rem;
    background: var(--parchment-d, #ede3d0);
    border: 1px solid rgba(139,111,58,.15);
    border-radius: 999px; padding: .35rem .85rem;
    font-size: .72rem; font-weight: 700; letter-spacing: .04em;
    color: var(--ink, #1a140a);
}
.rplan-chip i { color: var(--gold-dark,#8b6f3a); font-size: .85rem; }

.rplan-note {
    background: var(--parchment-d, #ede3d0);
    border: 1px solid rgba(139,111,58,.18);
    border-radius: 14px; padding: .9rem 1rem;
    margin-bottom: 1.5rem;
    display: flex; align-items: flex-start; gap: .75rem;
}
.rplan-note-icon { font-size: 1.1rem; color: var(--gold-dark,#8b6f3a); flex-shrink: 0; margin-top: .1rem; opacity: .7; }
.rplan-note-label {
    font-size: .65rem; font-weight: 700; letter-spacing: .08em;
    text-transform: uppercase; color: var(--gold-dark,#8b6f3a); margin-bottom: .2rem;
}
.rplan-note-chapters { font-size: .88rem; font-weight: 600; line-height: 1.45; color: var(--ink,#1a140a); }

.rplan-section-label {
    font-size: .66rem; font-weight: 700; letter-spacing: .12em;
    text-transform: uppercase; color: rgba(0,0,0,.35);
    margin: 0 0 .6rem; padding: 0 .1rem;
}

.rplan-book-block { margin-bottom: 1.5rem; border: 1px solid rgba(0,0,0,.07); border-radius: 14px; overflow: hidden; }
.rplan-book-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: .75rem 1rem; background: var(--ink, #1a140a); cursor: pointer; user-select: none;
}
.rplan-book-header-left { display: flex; align-items: center; gap: .6rem; }
.rplan-book-badge {
    width: 28px; height: 28px; border-radius: 7px;
    background: rgba(201,169,110,.18);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold,#c9a96e); font-size: .75rem; font-weight: 700;
    font-family: 'Cinzel', serif; flex-shrink: 0;
}
.rplan-book-name { font-family: 'Cinzel', serif; font-size: .9rem; font-weight: 700; color: var(--parchment,#f5edd8); margin: 0; }
.rplan-book-chap { font-size: .7rem; color: rgba(245,237,216,.4); letter-spacing: .06em; margin-top: .1rem; }
.rplan-book-chevron { color: rgba(245,237,216,.35); font-size: .85rem; transition: transform .2s ease; }
.rplan-book-block.open .rplan-book-chevron { transform: rotate(90deg); }
.rplan-book-verses { display: none; padding: .25rem 0 .5rem; background: rgba(255,255,255,.55); }
.rplan-book-block.open .rplan-book-verses { display: block; }

.rplan-conclude-wrap {
    background: var(--parchment-d, #ede3d0);
    border: 1px solid rgba(139,111,58,.2);
    border-radius: 16px; padding: 1.25rem; margin-top: 1.5rem;
}
.rplan-progress-label { font-size: .66rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--gold-dark,#8b6f3a); margin-bottom: .5rem; }
.rplan-progress-track { height: 6px; background: rgba(0,0,0,.08); border-radius: 999px; overflow: hidden; margin-bottom: .4rem; }
.rplan-progress-bar { height: 100%; background: linear-gradient(90deg, var(--gold-dark,#8b6f3a), var(--gold,#c9a96e)); border-radius: 999px; transition: width .8s cubic-bezier(.4,0,.2,1); }
.rplan-progress-bar.bar-done { background: linear-gradient(90deg, #059669, #10b981); }
.rplan-progress-info { font-size: .72rem; color: rgba(0,0,0,.4); letter-spacing: .04em; margin-bottom: 1rem; }

.btn-rplan-conclude {
    width: 100%; padding: .9rem 1.25rem;
    background: var(--gold-dark, #8b6f3a); color: var(--parchment, #f5edd8);
    border: none; border-radius: 12px; font-family: 'Cinzel', serif;
    font-size: .9rem; font-weight: 700; letter-spacing: .04em;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: .5rem;
    transition: all .2s ease; box-shadow: 0 3px 14px rgba(139,111,58,.3);
}
.btn-rplan-conclude:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 5px 20px rgba(139,111,58,.4); }
.btn-rplan-conclude:disabled { opacity: .7; cursor: not-allowed; transform: none; }
.btn-rplan-conclude.done { background: #059669; box-shadow: 0 3px 14px rgba(5,150,105,.3); }

.rplan-done-banner {
    background: rgba(5,150,105,.08); border: 1px solid rgba(5,150,105,.25);
    border-radius: 12px; padding: .75rem 1rem; display: flex; align-items: center; gap: .65rem; margin-bottom: 1.5rem;
}
.rplan-done-banner i { color: #059669; font-size: 1rem; }
.rplan-done-banner span { font-size: .82rem; font-weight: 600; color: #059669; }

.rplan-reset-link {
    display: flex; align-items: center; justify-content: center; gap: .4rem;
    margin-top: 1.25rem; padding: .6rem; font-size: .75rem; font-weight: 600;
    color: rgba(139,26,26,.6); cursor: pointer; user-select: none;
}
.rplan-reset-link:hover { color: rgba(139,26,26,.9); }

/* ── overlay / sheet ── */
.rplan-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.5);
    display: flex; align-items: flex-end; justify-content: center;
    z-index: 2000; opacity: 0; pointer-events: none; transition: opacity .25s ease;
}
.rplan-overlay.open { opacity: 1; pointer-events: auto; }
.rplan-sheet {
    background: var(--parchment, #f5edd8); border-radius: 20px 20px 0 0;
    padding: 1.5rem 1.5rem 2rem; width: 100%; max-width: 500px;
    transform: translateY(20px); transition: transform .25s ease;
}
.rplan-overlay.open .rplan-sheet { transform: translateY(0); }
.rplan-sheet-handle { width: 36px; height: 4px; background: rgba(0,0,0,.15); border-radius: 999px; margin: 0 auto 1.25rem; }
.btn-sheet {
    width: 100%; padding: .85rem 1rem; border-radius: 12px; border: none;
    font-size: .85rem; font-weight: 700; cursor: pointer; letter-spacing: .02em;
    display: flex; align-items: center; justify-content: center; gap: .5rem;
}
.btn-sheet.danger { background: #b91c1c; color: #fff; }
.btn-sheet.ghost { background: transparent; color: var(--ink, #1a140a); opacity: .55; }

/* ── start screen ── */
.rplan-start-info {
    display: flex; align-items: center; gap: .6rem;
    font-size: .78rem; color: rgba(0,0,0,.45);
    margin-top: 1rem; justify-content: center; text-align: center;
}

/* ── toast ── */
.rplan-toast {
    position: fixed; left: 50%; bottom: 100px; transform: translate(-50%, 20px);
    background: var(--ink, #1a140a); color: var(--parchment, #f5edd8);
    padding: .7rem 1.25rem; border-radius: 999px; font-size: .8rem; font-weight: 600;
    box-shadow: 0 6px 24px rgba(0,0,0,.25); opacity: 0; pointer-events: none;
    transition: opacity .25s ease, transform .25s ease; z-index: 3000; white-space: nowrap;
}
.rplan-toast.show { opacity: 1; transform: translate(-50%, 0); }
        `;
        document.head.appendChild(s);
    }

    /* ════════════════════════════════════════════════════════════
       RESET MODAL
    ════════════════════════════════════════════════════════════ */
    function openResetModal(id) {
        document.getElementById('rplanResetOverlay')?.remove();
        const overlay = document.createElement('div');
        overlay.id = 'rplanResetOverlay';
        overlay.className = 'rplan-overlay';
        overlay.innerHTML = `
            <div class="rplan-sheet" style="text-align:center">
                <div class="rplan-sheet-handle"></div>
                <div style="width:56px;height:56px;border-radius:50%;background:rgba(185,28,28,.1);
                    color:#b91c1c;font-size:1.5rem;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem">
                    <i class="ph ph-warning"></i>
                </div>
                <p style="font-size:1.15rem;font-weight:800;letter-spacing:-.02em;margin:0 0 .4rem">${t(id, 'resetTitle')}</p>
                <p style="font-size:.8rem;opacity:.5;line-height:1.5;margin:0 0 1.5rem">${t(id, 'resetSub')}</p>
                <button class="btn-sheet danger" id="rplanResetConfirm">
                    <i class="ph ph-trash"></i> ${t(id, 'resetConfirm')}
                </button>
                <button class="btn-sheet ghost" id="rplanResetCancel" style="margin-top:.4rem">${t(id, 'cancel')}</button>
            </div>`;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('open'));
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
        document.getElementById('rplanResetCancel')?.addEventListener('click', () => overlay.remove());
        document.getElementById('rplanResetConfirm')?.addEventListener('click', () => {
            clearStart(id);
            clearCompleted(id);
            overlay.remove();
            showToast(t(id, 'resetSuccess'));
            renderStartScreen(id);
        });
    }

    /* ════════════════════════════════════════════════════════════
       START SCREEN
    ════════════════════════════════════════════════════════════ */
    function renderStartScreen(id) {
        const cfg = CONFIGS[id];
        injectStyles();
        const content = document.getElementById('content');
        content.className = 'fade-in';
        content.innerHTML = `
            <div class="rplan-wrap">
                <div class="rplan-hero">
                    <p class="rplan-hero-tag">${t(id, 'tag')}</p>
                    <h2 class="rplan-hero-title">${t(id, 'title')}</h2>
                    <p class="rplan-hero-desc">${t(id, 'desc')}</p>
                </div>
                <div class="rplan-chips">
                    <span class="rplan-chip"><i class="ph ph-calendar-blank"></i> ${cfg.days} ${t(id, 'daysWord')}</span>
                    <span class="rplan-chip"><i class="ph ph-book-open"></i> ${totalChapters(id)} ${window.t('chaptersWord') || 'chapters'}</span>
                </div>
                <button class="btn-rplan-conclude" id="rplanStartBtn">
                    <i class="ph ph-play-circle"></i> ${t(id, 'startBtn')}
                </button>
                <div class="rplan-start-info">
                    <i class="ph ph-info"></i> ${t(id, 'startInfo')}
                </div>
            </div>`;
        document.getElementById('rplanStartBtn')?.addEventListener('click', () => {
            saveStart(id, new Date());
            showToast(t(id, 'planStarted'));
            renderDayView(id);
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ════════════════════════════════════════════════════════════
       DAY VIEW
    ════════════════════════════════════════════════════════════ */
    async function renderDayView(id) {
        const cfg = CONFIGS[id];
        const day = currentDay(id);
        if (day == null) { renderStartScreen(id); return; }

        window.speechSynthesis?.cancel();
        if (typeof window.ttsSetPlaying === 'function') window.ttsSetPlaying(false);

        injectStyles();
        const plan = buildPlan(id);
        const portions = plan[day - 1];

        const loader = document.getElementById('loader');
        const content = document.getElementById('content');
        const errMsg = document.getElementById('error-msg');

        loader?.classList.remove('d-none');
        content?.classList.add('d-none');
        errMsg?.classList.add('d-none');

        try {
            const chapterData = await Promise.all(portions.map(p => fetchChapter(p.bookId, p.chapter)));
            loader?.classList.add('d-none');
            content?.classList.remove('d-none');
            paintDayView(id, day, portions, chapterData);
        } catch (e) {
            loader?.classList.add('d-none');
            if (errMsg) {
                errMsg.classList.remove('d-none');
                errMsg.innerHTML = `
                    <div style="text-align:center;padding:2rem">
                        <i class="ph ph-warning-circle" style="font-size:2.5rem;opacity:.4"></i>
                        <p style="margin-top:1rem">${window.t('errorGeneric') || 'Erro ao carregar.'}</p>
                        <button onclick="window.openReadingPlan('${id}')" class="btn-nav" style="margin:auto">
                            ${window.t('tryAgain') || 'Tentar Novamente'}
                        </button>
                    </div>`;
            }
        }
    }

    function paintDayView(id, day, portions, chapterData) {
        const cfg = CONFIGS[id];
        const content = document.getElementById('content');
        content.innerHTML = '';
        content.className = 'fade-in';

        const completed = loadCompleted(id);
        const dayKey = `d${day}`;
        const alreadyDone = completed.has(dayKey);
        const pct = Math.round((day / cfg.days) * 100);
        const chapLabels = portions.map(p => `${p.bookName} ${p.chapter}`).join(' · ');

        const wrap = document.createElement('div');
        wrap.className = 'rplan-wrap';

        wrap.innerHTML = `
            <div class="rplan-hero">
                <p class="rplan-hero-tag">${t(id, 'planName')}</p>
                <h2 class="rplan-hero-title">${t(id, 'title')}</h2>
                <p class="rplan-hero-date">${formatDayDate(id, day)}</p>
                <div class="rplan-hero-progress-wrap">
                    <div class="rplan-hero-progress-fill" style="width:${pct}%"></div>
                </div>
                <div class="rplan-hero-progress-row">
                    <span class="rplan-hero-daycount">${t(id, 'day')} ${day} ${t(id, 'of')} ${cfg.days}</span>
                    <span class="rplan-hero-pct">${pct}%</span>
                </div>
            </div>

            <div class="rplan-chips">
                <span class="rplan-chip"><i class="ph ph-book-open"></i> ${portions.length} ${portions.length === 1 ? (window.t('chapterWord') || 'capítulo') : (window.t('chaptersWord') || 'capítulos')}</span>
                <span class="rplan-chip"><i class="ph ph-calendar-blank"></i> ${t(id, 'today')}</span>
                ${alreadyDone ? `<span class="rplan-chip" style="background:rgba(5,150,105,.1);border-color:rgba(5,150,105,.25);color:#059669"><i class="ph ph-check-circle" style="color:#059669"></i> ${t(id, 'concluded')}</span>` : ''}
            </div>

            ${alreadyDone ? `
                <div class="rplan-done-banner">
                    <i class="ph ph-check-circle"></i>
                    <span>${t(id, 'done')}</span>
                </div>` : ''}

            <div class="rplan-note">
                <i class="ph ph-book rplan-note-icon"></i>
                <div>
                    <div class="rplan-note-label">${window.t('todayReading') || 'Leitura de Hoje'}</div>
                    <div class="rplan-note-chapters">${chapLabels}</div>
                </div>
            </div>

            <p class="rplan-section-label">${window.t('chaptersLabel') || 'Capítulos'}</p>
        `;

        portions.forEach((p, i) => {
            const block = document.createElement('div');
            block.className = 'rplan-book-block';

            const header = document.createElement('div');
            header.className = 'rplan-book-header';
            header.innerHTML = `
                <div class="rplan-book-header-left">
                    <div class="rplan-book-badge">${i + 1}</div>
                    <div>
                        <p class="rplan-book-name">${p.bookName}</p>
                        <p class="rplan-book-chap">${window.t('chapter') || 'Capítulo'} ${p.chapter}</p>
                    </div>
                </div>
                <i class="ph ph-caret-right rplan-book-chevron"></i>
            `;

            const versesWrap = document.createElement('div');
            versesWrap.className = 'rplan-book-verses';

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
            if (i === 0) block.classList.add('open');
            wrap.appendChild(block);
        });

        const concludeWrap = document.createElement('div');
        concludeWrap.className = 'rplan-conclude-wrap';
        concludeWrap.innerHTML = `
            <div class="rplan-progress-label">${t(id, 'progressLabel')}</div>
            <div class="rplan-progress-track">
                <div class="rplan-progress-bar ${alreadyDone ? 'bar-done' : ''}" style="width:${alreadyDone ? 100 : pct}%"></div>
            </div>
            <div class="rplan-progress-info">
                ${t(id, 'day')} ${day} ${t(id, 'of')} ${cfg.days} &nbsp;·&nbsp; ${pct}% ${t(id, 'concluded').toLowerCase()}
            </div>
            <button class="btn-rplan-conclude ${alreadyDone ? 'done' : ''}" id="rplanConcludeBtn" ${alreadyDone ? 'disabled' : ''}>
                <i class="ph ph-check-circle"></i>
                ${alreadyDone ? t(id, 'done') : t(id, 'concludeBtn')}
            </button>
        `;

        if (!alreadyDone) {
            const btn = concludeWrap.querySelector('#rplanConcludeBtn');
            const bar = concludeWrap.querySelector('.rplan-progress-bar');
            btn.addEventListener('click', () => {
                launchConfetti();
                completed.add(dayKey);
                saveCompleted(id, completed);
                btn.disabled = true;
                btn.classList.add('done');
                btn.innerHTML = `<i class="ph ph-check-circle"></i> ${t(id, 'done')}`;
                if (bar) { bar.style.width = '100%'; bar.classList.add('bar-done'); }
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 1200);
            });
        }

        const resetLink = document.createElement('div');
        resetLink.className = 'rplan-reset-link';
        resetLink.innerHTML = `<i class="ph ph-arrow-counter-clockwise"></i> ${t(id, 'resetBtn')}`;
        resetLink.onclick = () => openResetModal(id);

        wrap.appendChild(concludeWrap);
        wrap.appendChild(resetLink);
        content.appendChild(wrap);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ════════════════════════════════════════════════════════════
       ENTRY POINT
    ════════════════════════════════════════════════════════════ */
    function openReadingPlan(id) {
        if (!CONFIGS[id]) return;
        const day = currentDay(id);
        if (day == null) renderStartScreen(id);
        else renderDayView(id);
    }

    window.openReadingPlan = openReadingPlan;
    window.READING_PLAN_IDS = Object.keys(CONFIGS);

})();
