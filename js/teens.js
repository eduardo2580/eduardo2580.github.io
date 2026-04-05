/**
 * PLANO ADOLESCENTES — @xtrafhop / fhopchurch
 *
 * A 297-day reading plan starting April 4 2026.
 * Requires: ALL_BOOKS, fetchChapter, state, SidebarMenu (from script.js / sidebar.js)
 *
 * UX matches chapter reader & Leitura de Hoje — unified experience.
 */

(function () {

    /* ══════════════════════════════════════════════════════════════
       PLAN DATA
    ══════════════════════════════════════════════════════════════ */
    const TEENS_START = new Date(2026, 3, 4);
    const TEENS_DAYS  = 297;

    function buildTeensPlan() {
        const all = [];
        for (const b of ALL_BOOKS)
            for (let c = 1; c <= b.chapters; c++)
                all.push({ bookId: b.id, bookName: b.name, chapter: c });

        const total = all.length;
        const base  = Math.floor(total / TEENS_DAYS);
        const extra = total % TEENS_DAYS;
        const plan  = [];
        let idx = 0;
        for (let d = 0; d < TEENS_DAYS; d++) {
            const count = d < extra ? base + 1 : base;
            plan.push(all.slice(idx, idx + count));
            idx += count;
        }
        return plan;
    }

    /* ── state ──────────────────────────────────────────────────── */
    let TEENS_PLAN  = null;
    let currentDay  = 1;
    const completed = new Set();

    function todayTeensDay() {
        const now  = new Date();
        const diff = Math.floor((now - TEENS_START) / 86400000);
        return Math.max(1, Math.min(diff + 1, TEENS_DAYS));
    }

    function completedKey(day, bookId, chapter) {
        return `${day}-${bookId}-${chapter}`;
    }

    function formatDayDate(dayNum) {
        const d = new Date(TEENS_START);
        d.setDate(d.getDate() + dayNum - 1);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
    }

    /* ── confetti (same engine as Leitura de Hoje) ────────────── */
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
        const particles = Array.from({ length: 200 }, () => {
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
                p.x += p.vx; p.y += p.vy;
                p.vy += 0.34; p.vx *= 0.992;
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

    /* ══════════════════════════════════════════════════════════════
       INJECT STYLES (once)
    ══════════════════════════════════════════════════════════════ */
    function injectStyles() {
        if (document.getElementById('teens-styles')) return;
        const style = document.createElement('style');
        style.id = 'teens-styles';
        style.textContent = `
/* ── Teens Banner ──────────────────────────────────────────── */
.teens-banner {
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    background: linear-gradient(135deg, #1a0a2e 0%, #2d1560 50%, #1a0a2e 100%);
    padding: 2.5rem 2rem 2rem;
    margin-bottom: 2rem;
    border: 1px solid rgba(180, 120, 255, 0.25);
}
.teens-banner::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse 60% 40% at 80% 30%, rgba(180, 100, 255, 0.18) 0%, transparent 70%),
        radial-gradient(ellipse 40% 50% at 20% 80%, rgba(100, 60, 200, 0.12) 0%, transparent 70%);
    pointer-events: none;
}
.teens-banner::after {
    content: 'XTRA';
    position: absolute;
    right: -0.5rem;
    bottom: -1rem;
    font-size: 6.5rem;
    font-weight: 900;
    letter-spacing: -0.04em;
    color: rgba(255, 255, 255, 0.04);
    line-height: 1;
    pointer-events: none;
    user-select: none;
}
.teens-banner-tag {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(180, 140, 255, 0.8);
    margin: 0 0 0.75rem;
}
.teens-banner-title {
    font-size: 2.4rem;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: #fff;
    margin: 0 0 1.25rem;
}
.teens-banner-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
}
.teens-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: rgba(180, 120, 255, 0.18);
    border: 1px solid rgba(180, 120, 255, 0.35);
    color: #c8a0ff;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.3rem 0.75rem;
    border-radius: 999px;
}
.teens-badge-days {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.6);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    padding: 0.3rem 0.75rem;
    border-radius: 999px;
}
.teens-banner-progress {
    margin-top: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}
.teens-banner-track {
    flex: 1;
    height: 3px;
    background: rgba(255,255,255,0.1);
    border-radius: 999px;
    overflow: hidden;
}
.teens-banner-fill {
    height: 100%;
    background: linear-gradient(90deg, #9b6dff, #c89fff);
    border-radius: 999px;
    transition: width 0.6s cubic-bezier(.4,0,.2,1);
}
.teens-banner-pct {
    font-size: 0.72rem;
    font-weight: 700;
    color: #c8a0ff;
    letter-spacing: 0.05em;
    white-space: nowrap;
}

/* ── Day Scroller ───────────────────────────────────────────── */
.days-scroller-wrap {
    margin: 0 -1rem 1.75rem;
    padding: 0 1rem;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
}
.days-scroller-wrap::-webkit-scrollbar { display: none; }
.days-scroller {
    display: flex;
    gap: 0.5rem;
    padding: 0.25rem 0.25rem 0.5rem;
    width: max-content;
}
.day-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    background: transparent;
    border: 1.5px solid transparent;
    border-radius: 12px;
    padding: 0.55rem 0.7rem;
    cursor: pointer;
    min-width: 52px;
    transition: all 0.18s ease;
    color: inherit;
}
.day-card:hover {
    background: rgba(155, 109, 255, 0.08);
    border-color: rgba(155, 109, 255, 0.2);
}
.day-card.active {
    background: rgba(155, 109, 255, 0.12);
    border-color: rgba(155, 109, 255, 0.5);
}
.day-card.done-day {
    opacity: 0.45;
}
.day-num {
    font-size: 1rem;
    font-weight: 700;
    line-height: 1;
    color: inherit;
}
.day-card.active .day-num {
    color: #9b6dff;
}
.day-date {
    font-size: 0.62rem;
    letter-spacing: 0.04em;
    color: var(--bs-secondary-color, rgba(0,0,0,0.5));
    text-transform: uppercase;
}

/* ── Day header row ─────────────────────────────────────────── */
.teens-day-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 1rem;
    gap: 0.75rem;
    flex-wrap: wrap;
}
.teens-day-label {
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0;
}
.teens-day-date-text {
    font-size: 0.8rem;
    color: var(--bs-secondary-color, rgba(0,0,0,0.5));
}
.teens-status-badge {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.28rem 0.7rem;
    border-radius: 999px;
    flex-shrink: 0;
}
.teens-status-badge.status-today {
    background: rgba(155, 109, 255, 0.12);
    color: #7a4ee0;
    border: 1px solid rgba(155, 109, 255, 0.3);
}
.teens-status-badge.status-done {
    background: rgba(16, 185, 129, 0.1);
    color: #0d9668;
    border: 1px solid rgba(16, 185, 129, 0.25);
}
.teens-status-badge.status-late {
    background: rgba(239, 68, 68, 0.1);
    color: #c53030;
    border: 1px solid rgba(239, 68, 68, 0.25);
}
.teens-status-badge.status-future {
    background: rgba(100, 100, 100, 0.08);
    color: var(--bs-secondary-color, rgba(0,0,0,0.5));
    border: 1px solid rgba(100, 100, 100, 0.15);
}

/* ── Note card (mirrors Leitura de Hoje style) ──────────────── */
.teens-note-card {
    background: rgba(155, 109, 255, 0.06);
    border: 1px solid rgba(155, 109, 255, 0.15);
    border-radius: 14px;
    padding: 0.85rem 1.1rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: flex-start;
    gap: 0.8rem;
}
.teens-note-icon {
    font-size: 1.1rem;
    margin-top: 0.05rem;
    flex-shrink: 0;
    opacity: 0.7;
}
.teens-note-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #9b6dff;
    margin-bottom: 0.2rem;
}
.teens-note-chapters {
    font-size: 0.85rem;
    color: var(--bs-body-color, rgba(0,0,0,0.75));
    font-weight: 500;
}

/* ── Checklist ──────────────────────────────────────────────── */
.teens-checklist {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 1.75rem;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 16px;
    overflow: hidden;
}
.check-item {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.9rem 1.1rem;
    cursor: pointer;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    transition: background 0.15s ease;
    position: relative;
}
.check-item:last-child { border-bottom: none; }
.check-item:hover { background: rgba(155, 109, 255, 0.04); }
.check-item.completed { background: rgba(16, 185, 129, 0.04); }
.check-item.completed:hover { background: rgba(16, 185, 129, 0.07); }
.circle-check {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1.5px solid rgba(0,0,0,0.2);
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
    transition: all 0.2s ease;
    color: transparent;
    padding: 0;
}
.circle-check i { font-size: 0.8rem; }
.check-item.completed .circle-check {
    background: #10b981;
    border-color: #10b981;
    color: #fff;
}
.circle-check:hover {
    border-color: #9b6dff;
    background: rgba(155, 109, 255, 0.1);
}
.check-item.completed .circle-check:hover {
    background: #0ea472;
    border-color: #0ea472;
}
.chapter-name {
    flex: 1;
    font-size: 0.95rem;
    font-weight: 500;
    color: inherit;
    transition: color 0.15s;
}
.check-item.completed .chapter-name {
    color: var(--bs-secondary-color, rgba(0,0,0,0.45));
    text-decoration: line-through;
    text-decoration-color: rgba(0,0,0,0.2);
}
.open-chapter {
    font-size: 0.75rem;
    opacity: 0.3;
    transition: opacity 0.15s, transform 0.15s;
    flex-shrink: 0;
}
.check-item:hover .open-chapter {
    opacity: 0.6;
    transform: translateX(2px);
}

/* ── CTA button (matches btn-conclude style) ────────────────── */
.btn-teens-start {
    width: 100%;
    padding: 0.95rem 1.5rem;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #7c3aed, #9b6dff);
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    box-shadow: 0 4px 20px rgba(123, 58, 237, 0.3);
    margin-bottom: 1rem;
}
.btn-teens-start:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(123, 58, 237, 0.4);
}
.btn-teens-start:active { transform: translateY(0); }
.btn-teens-start.all-done {
    background: linear-gradient(135deg, #059669, #10b981);
    box-shadow: 0 4px 20px rgba(5, 150, 105, 0.3);
}
.btn-teens-start.all-done:hover {
    box-shadow: 0 6px 24px rgba(5, 150, 105, 0.4);
}

/* ── Reading view header ─────────────────────────────────────── */
.teens-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: transparent;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 999px;
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 2rem;
    color: inherit;
    transition: all 0.15s;
}
.teens-back-btn:hover {
    background: rgba(155, 109, 255, 0.07);
    border-color: rgba(155, 109, 255, 0.3);
    color: #7c3aed;
}

/* ── Mark done button ────────────────────────────────────────── */
.btn-teens-done {
    background: linear-gradient(135deg, #7c3aed, #9b6dff) !important;
    color: #fff !important;
    border: none !important;
    font-weight: 700 !important;
    box-shadow: 0 2px 12px rgba(123, 58, 237, 0.25);
    transition: all 0.2s ease !important;
}
.btn-teens-done:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(123, 58, 237, 0.35) !important;
}
.btn-teens-done.btn-done-active {
    background: linear-gradient(135deg, #059669, #10b981) !important;
    box-shadow: 0 2px 12px rgba(5, 150, 105, 0.25) !important;
}

/* ── Day complete celebration card ──────────────────────────── */
.teens-complete-card {
    background: linear-gradient(135deg, rgba(155,109,255,0.08), rgba(16,185,129,0.06));
    border: 1px solid rgba(155,109,255,0.2);
    border-radius: 16px;
    padding: 1.5rem;
    text-align: center;
    margin-top: 1rem;
}
.teens-complete-emoji {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}
.teens-complete-title {
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #7c3aed;
    margin: 0 0 0.3rem;
}
.teens-complete-sub {
    font-size: 0.82rem;
    color: var(--bs-secondary-color, rgba(0,0,0,0.5));
    margin: 0;
}

/* ── Fade-in animation ───────────────────────────────────────── */
@keyframes teensIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
}
.teens-fade {
    animation: teensIn 0.3s cubic-bezier(.4,0,.2,1) forwards;
}
        `;
        document.head.appendChild(style);
    }

    /* ══════════════════════════════════════════════════════════════
       DASHBOARD VIEW
    ══════════════════════════════════════════════════════════════ */
    function openDashboard(dayNum) {
        currentDay = dayNum;
        if (!TEENS_PLAN) TEENS_PLAN = buildTeensPlan();
        injectStyles();

        const content = document.getElementById('content');
        const loader  = document.getElementById('loader');
        const errMsg  = document.getElementById('error-msg');

        loader?.classList.add('d-none');
        errMsg?.classList.add('d-none');
        content?.classList.remove('d-none');

        const portions = TEENS_PLAN[dayNum - 1] || [];
        const today    = todayTeensDay();

        /* progress */
        const overallDone = (() => {
            let n = 0;
            for (const [k] of completed.entries ? completed.entries() : []) void k;
            completed.forEach(k => { if (k.startsWith(`${dayNum}-`)) n++; });
            return n;
        })();
        const totalPortions = portions.length;
        const allDone = overallDone === totalPortions && totalPortions > 0;

        /* global % across all 297 days */
        const totalChapters = TEENS_PLAN.reduce((s, p) => s + p.length, 0);
        const globalPct = Math.round((completed.size / totalChapters) * 100) || 0;

        /* day scroller: window around currentDay */
        const windowStart = Math.max(1, dayNum - 5);
        const windowEnd   = Math.min(TEENS_DAYS, windowStart + 29);
        let dayCards = '';
        for (let d = windowStart; d <= windowEnd; d++) {
            const isDone = (() => {
                const ps = TEENS_PLAN[d - 1] || [];
                return ps.length > 0 && ps.every(p => completed.has(completedKey(d, p.bookId, p.chapter)));
            })();
            dayCards += `
                <button class="day-card ${d === dayNum ? 'active' : ''} ${isDone ? 'done-day' : ''}" data-day="${d}">
                    <span class="day-num">${d}</span>
                    <span class="day-date">${formatDayDate(d)}</span>
                    ${isDone ? '<i class="bi bi-check-lg" style="font-size:.6rem;color:#10b981;margin-top:-4px"></i>' : ''}
                </button>`;
        }

        /* status badge */
        let statusClass = 'status-future';
        let statusLabel = 'Futuro';
        if (allDone) { statusClass = 'status-done'; statusLabel = '✦ Completo!'; }
        else if (dayNum === today) { statusClass = 'status-today'; statusLabel = 'Hoje'; }
        else if (dayNum < today)  { statusClass = 'status-late';   statusLabel = 'Atrasado'; }

        /* note card chapters */
        const chapLabels = portions.map(p => `${p.bookName} ${p.chapter}`).join(' · ');

        /* checklist */
        let checklist = '';
        portions.forEach((p, idx) => {
            const key  = completedKey(dayNum, p.bookId, p.chapter);
            const done = completed.has(key);
            checklist += `
                <div class="check-item ${done ? 'completed' : ''}" data-idx="${idx}">
                    <button class="circle-check" data-idx="${idx}" aria-label="Marcar como lido">
                        <i class="bi bi-check-lg"></i>
                    </button>
                    <span class="chapter-name">${p.bookName} ${p.chapter}</span>
                    <i class="bi bi-chevron-right open-chapter" data-idx="${idx}"></i>
                </div>`;
        });

        /* celebration card if all done */
        const celebCard = allDone ? `
            <div class="teens-complete-card">
                <div class="teens-complete-emoji">🎉</div>
                <p class="teens-complete-title">Dia ${dayNum} concluído!</p>
                <p class="teens-complete-sub">Você está indo muito bem. Continue firme!</p>
            </div>` : '';

        content.innerHTML = '';
        content.className = 'teens-fade';

        content.innerHTML = `
            <!-- Banner -->
            <div class="teens-banner">
                <p class="teens-banner-tag">Plano · @xtrafhop</p>
                <h2 class="teens-banner-title">Leitura<br>para<br>Adolescentes</h2>
                <div class="teens-banner-meta">
                    <span class="teens-badge"><i class="bi bi-lightning-charge-fill"></i> fhopchurch</span>
                    <span class="teens-badge-days">${TEENS_DAYS} dias</span>
                </div>
                <div class="teens-banner-progress">
                    <div class="teens-banner-track">
                        <div class="teens-banner-fill" style="width:${globalPct}%"></div>
                    </div>
                    <span class="teens-banner-pct">${globalPct}%</span>
                </div>
            </div>

            <!-- Day scroller -->
            <div class="days-scroller-wrap">
                <div class="days-scroller" id="teensDaysScroller">${dayCards}</div>
            </div>

            <!-- Day header -->
            <div class="teens-day-header">
                <div>
                    <h3 class="teens-day-label">Dia ${dayNum} <span style="font-weight:400;font-size:1rem;opacity:.45">de ${TEENS_DAYS}</span></h3>
                    <p class="teens-day-date-text">${formatDayDate(dayNum)}</p>
                </div>
                <span class="teens-status-badge ${statusClass}">${statusLabel}</span>
            </div>

            <!-- Note card -->
            <div class="teens-note-card">
                <i class="bi bi-book teens-note-icon"></i>
                <div>
                    <div class="teens-note-label">Capítulos de hoje</div>
                    <div class="teens-note-chapters">${chapLabels || '—'}</div>
                </div>
            </div>

            <!-- Checklist -->
            <div class="teens-checklist" id="teensChecklist">${checklist}</div>

            <!-- CTA -->
            <button class="btn-teens-start ${allDone ? 'all-done' : ''}" id="btnTeensStart">
                ${allDone
                    ? '<i class="bi bi-arrow-repeat"></i> Reler o dia'
                    : '<i class="bi bi-play-fill"></i> Começar Leitura'}
            </button>

            ${celebCard}
        `;

        /* events: day cards */
        document.getElementById('teensDaysScroller')
            ?.querySelectorAll('.day-card')
            .forEach(btn => btn.addEventListener('click', () => openDashboard(+btn.dataset.day)));

        /* events: checklist */
        document.getElementById('teensChecklist')
            ?.querySelectorAll('.check-item')
            .forEach(item => {
                const idx = +item.dataset.idx;
                const p   = portions[idx];
                const key = completedKey(dayNum, p.bookId, p.chapter);

                item.querySelector('.circle-check')?.addEventListener('click', e => {
                    e.stopPropagation();
                    if (completed.has(key)) completed.delete(key);
                    else completed.add(key);
                    openDashboard(dayNum);
                });

                item.querySelector('.chapter-name')
                    ?.addEventListener('click', () => openReading(dayNum, idx));
                item.querySelector('.open-chapter')
                    ?.addEventListener('click', () => openReading(dayNum, idx));
            });

        /* events: start button */
        document.getElementById('btnTeensStart')?.addEventListener('click', () => {
            let target = 0;
            for (let i = 0; i < portions.length; i++) {
                if (!completed.has(completedKey(dayNum, portions[i].bookId, portions[i].chapter))) {
                    target = i; break;
                }
            }
            openReading(dayNum, target);
        });

        /* scroll active day card into view */
        setTimeout(() => {
            document.querySelector('#teensDaysScroller .day-card.active')
                ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }, 60);

        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.innerWidth < 768) window.closeSidebar?.();
    }

    /* ══════════════════════════════════════════════════════════════
       READING VIEW — matches chapter reader UX exactly
    ══════════════════════════════════════════════════════════════ */
    async function openReading(dayNum, chapterIdx) {
        if (!TEENS_PLAN) TEENS_PLAN = buildTeensPlan();
        injectStyles();

        const portions = TEENS_PLAN[dayNum - 1] || [];
        if (!portions.length) return;
        chapterIdx = Math.max(0, Math.min(chapterIdx, portions.length - 1));

        const content = document.getElementById('content');
        const loader  = document.getElementById('loader');
        const errMsg  = document.getElementById('error-msg');

        /* stop TTS if running */
        window.speechSynthesis?.cancel();
        if (typeof window.ttsSetPlaying === 'function') window.ttsSetPlaying(false);

        loader?.classList.remove('d-none');
        content?.classList.add('d-none');
        errMsg?.classList.add('d-none');

        let verses;
        try {
            const p = portions[chapterIdx];
            verses  = await fetchChapter(p.bookId, p.chapter);
        } catch (e) {
            loader?.classList.add('d-none');
            if (errMsg) {
                errMsg.classList.remove('d-none');
                errMsg.innerHTML = `
                    <div style="text-align:center;padding:2rem">
                        <i class="bi bi-exclamation-circle" style="font-size:2.5rem;opacity:.5"></i>
                        <p style="margin-top:1rem">${e.message}</p>
                        <button class="btn-nav" style="margin:auto" onclick="window._teensOpenDash()">Voltar</button>
                    </div>`;
                window._teensOpenDash = () => openDashboard(dayNum);
            }
            return;
        }

        loader?.classList.add('d-none');
        content?.classList.remove('d-none');
        content.innerHTML = '';
        content.className = 'teens-fade';

        const p      = portions[chapterIdx];
        const key    = completedKey(dayNum, p.bookId, p.chapter);
        const isDone = completed.has(key);

        /* chapter pills — identical to renderVerses() */
        let chapPills = '';
        portions.forEach((pp, i) => {
            const done = completed.has(completedKey(dayNum, pp.bookId, pp.chapter));
            chapPills += `
                <button class="chap-btn ${i === chapterIdx ? 'active' : ''}" data-cidx="${i}"
                    style="${done && i !== chapterIdx ? 'opacity:.45;text-decoration:line-through' : ''}">
                    ${pp.chapter}
                </button>`;
        });

        /* verse rows — identical markup to renderVerses() */
        const verseRows = verses.map(v => `
            <div class="verse">
                <span class="verse-num">${v.verse}</span>
                <span class="verse-text" style="font-size:${window.state?.fontSize ?? 1.1}rem">${v.text}</span>
            </div>
        `).join('');

        content.innerHTML = `
            <button class="teens-back-btn" id="teensBackBtn">
                <i class="bi bi-arrow-left"></i> Plano do Dia ${dayNum}
            </button>

            <h1 class="bible-heading">${p.bookName}</h1>
            <div class="bible-subheading">Capítulo ${p.chapter}</div>
            <div class="ornament">✦ ✦ ✦</div>

            <div class="chapter-row">${chapPills}</div>

            <div id="teensVerses">${verseRows}</div>

            <div class="chap-nav">
                <button class="btn-nav" id="teensPrev" ${chapterIdx === 0 ? 'disabled' : ''}>
                    <i class="bi bi-chevron-left"></i> Anterior
                </button>
                <button class="btn-nav btn-teens-done ${isDone ? 'btn-done-active' : ''}" id="teensDone">
                    ${isDone
                        ? '<i class="bi bi-check-circle-fill"></i> Concluído'
                        : '<i class="bi bi-check2-circle"></i> Concluir'}
                </button>
                <button class="btn-nav" id="teensNext" ${chapterIdx === portions.length - 1 ? 'disabled' : ''}>
                    Próximo <i class="bi bi-chevron-right"></i>
                </button>
            </div>
        `;

        /* verse click → highlight */
        content.querySelectorAll('.verse').forEach(v =>
            v.addEventListener('click', () => v.classList.toggle('highlight'))
        );

        /* chapter pills */
        content.querySelectorAll('.chap-btn').forEach(btn =>
            btn.addEventListener('click', () => openReading(dayNum, +btn.dataset.cidx))
        );

        /* back */
        document.getElementById('teensBackBtn')
            ?.addEventListener('click', () => openDashboard(dayNum));

        /* prev / next */
        document.getElementById('teensPrev')
            ?.addEventListener('click', () => { if (chapterIdx > 0) openReading(dayNum, chapterIdx - 1); });
        document.getElementById('teensNext')
            ?.addEventListener('click', () => { if (chapterIdx < portions.length - 1) openReading(dayNum, chapterIdx + 1); });

        /* mark done */
        document.getElementById('teensDone')?.addEventListener('click', () => {
            if (completed.has(key)) {
                completed.delete(key);
                openReading(dayNum, chapterIdx);
            } else {
                completed.add(key);
                /* check if the whole day is now done */
                const allNowDone = portions.every(pp =>
                    completed.has(completedKey(dayNum, pp.bookId, pp.chapter))
                );
                if (allNowDone) {
                    launchConfetti();
                    setTimeout(() => openDashboard(dayNum), 600);
                } else if (chapterIdx < portions.length - 1) {
                    openReading(dayNum, chapterIdx + 1);
                } else {
                    openDashboard(dayNum);
                }
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ══════════════════════════════════════════════════════════════
       SIDEBAR ENTRY
    ══════════════════════════════════════════════════════════════ */
    function buildTeensSidebar() {
        const container = document.getElementById('teensBooks');
        if (!container) return;

        const btn     = document.createElement('button');
        btn.className = 'book-btn';
        btn.id        = 'teensBtn';
        btn.innerHTML = `<i class="bi bi-lightning-charge-fill"></i> Plano Adolescentes`;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.book-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (!TEENS_PLAN) TEENS_PLAN = buildTeensPlan();
            openDashboard(todayTeensDay());
        });
        container.appendChild(btn);
    }

    /* ── init ─────────────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', () => {
        buildTeensSidebar();
    });

})();