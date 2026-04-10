/**
 * PLANO ADOLESCENTES — New Design Patch
 * Full feature parity with v1, adapted to the new app's design system.
 *
 * Design tokens used (from new app):
 *   --ink, --gold, --gold-dark, --parchment, --parchment-d, --accent
 *   Phosphor icons (ph ph-*), .fade-in, .bible-heading, .bible-subheading,
 *   .ornament, .verse, .verse-num, .verse-text, .chap-nav, .btn-nav,
 *   .settings-list, .settings-item, .verse-card, .verse-card-wrapper
 */

(function () {

    /* ════════════════════════════════════════════════════════════
       CONSTANTS & STORAGE
    ════════════════════════════════════════════════════════════ */
    const TEENS_DAYS = 297;
    const STORAGE_KEY = 'teensplan_completed_v1';
    const STORAGE_START = 'teensplan_startdate_v1';

    /* ── storage helpers ─────────────────────────────────────── */
    function loadStartDate() {
        try {
            const raw = localStorage.getItem(STORAGE_START);
            if (!raw) return null;
            const d = new Date(raw);
            return isNaN(d.getTime()) ? null : d;
        } catch (_) { return null; }
    }
    function saveStartDate(date) {
        try { localStorage.setItem(STORAGE_START, date.toISOString()); } catch (_) { }
    }
    function clearStartDate() {
        try { localStorage.removeItem(STORAGE_START); } catch (_) { }
    }
    function loadCompleted() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? new Set(JSON.parse(raw)) : new Set();
        } catch (_) { return new Set(); }
    }
    function saveCompleted() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])); } catch (_) { }
    }
    function clearCompleted() {
        try { localStorage.removeItem(STORAGE_KEY); } catch (_) { }
    }

    /* ── plan builder ────────────────────────────────────────── */
    function buildTeensPlan() {
        const all = [];
        for (const b of ALL_BOOKS)
            for (let c = 1; c <= b.chapters; c++)
                all.push({ bookId: b.id, bookName: b.name, chapter: c });
        const total = all.length;
        const base = Math.floor(total / TEENS_DAYS);
        const extra = total % TEENS_DAYS;
        const plan = [];
        let idx = 0;
        for (let d = 0; d < TEENS_DAYS; d++) {
            const count = d < extra ? base + 1 : base;
            plan.push(all.slice(idx, idx + count));
            idx += count;
        }
        return plan;
    }

    /* ── state ───────────────────────────────────────────────── */
    let TEENS_PLAN = null;
    let teensStart = loadStartDate();
    const completed = loadCompleted();

    function todayTeensDay() {
        if (!teensStart) return 1;
        const diff = Math.floor((new Date() - teensStart) / 86400000);
        return Math.max(1, Math.min(diff + 1, TEENS_DAYS));
    }
    function completedKey(day, bookId, chapter) { return `${day}-${bookId}-${chapter}`; }
    function formatDayDate(dayNum) {
        if (!teensStart) return '';
        const d = new Date(teensStart);
        d.setDate(d.getDate() + dayNum - 1);
        const locale = (window.state?.lang === 'pt') ? 'pt-BR' : 'en-US';
        return d.toLocaleDateString(locale, { day: '2-digit', month: 'short' }).replace('.', '');
    }

    /* ── i18n helper ─────────────────────────────────────────── */
    function t(key, ns) {
        if (typeof window.t === 'function') {
            const result = window.t(key, ns);
            if (result !== key && result != null) return result;
        }
        // minimal fallback strings (Portuguese)
        const fb = {
            title: 'Plano Adolescentes', tag: 'PLANO XTRA', bannerTitle: 'Plano<br>Adolescentes',
            days: 'dias', daysTitle: 'Dias', chapters: 'Capítulos', books: 'Livros',
            howItWorks: 'Como funciona', startDesc: 'Leia a Bíblia em 297 dias.',
            startInfo: 'O progresso é salvo automaticamente.',
            preview: 'Prévia do plano', andMore: 'e mais', startBtn: 'Iniciar Plano',
            planStarted: '🚀 Plano iniciado!', backToPlan: 'Dia', day: 'Dia', of: 'de',
            today: 'Hoje', future: 'Futuro', complete: 'Completo', late: 'Atrasado',
            todayChapters: 'Leitura do dia', startReading: 'Começar a ler',
            reRead: 'Reler', completedDay: 'concluído!', keepItUp: 'Continue assim!',
            concluded: 'Concluído', conclude: 'Marcar como lido',
            chapter: 'capítulo', chapterPlural: 'capítulos',
            read: 'lido', readPlural: 'lidos', saved: 'salvo', savedPlural: 'salvos',
            backupTitle: 'Backup', backupDesc: 'Exporte ou importe seu progresso.',
            exportTitle: 'Exportar', exportDesc: 'Salve seu progresso em arquivo.',
            importTitle: 'Importar', importDesc: 'Restaure de um backup.',
            downloadBtn: 'Baixar JSON', copyBtn: 'Copiar JSON', pasteBtn: 'Colar JSON',
            tapChoose: 'Toque para escolher', dragDrop: 'ou arraste aqui',
            daysRead: 'Dias lidos', tapExport: 'Toque para exportar',
            fileExported: '✓ Arquivo exportado', jsonCopied: '✓ JSON copiado',
            invalidJson: 'JSON inválido', errorImport: 'Erro ao importar',
            restored: 'capítulos restaurados', errorLoad: 'Erro ao carregar',
            back: 'Voltar', prev: 'Ant', next: 'Próx',
            resetBtn: 'Resetar plano', resetTitle: 'Resetar plano?',
            resetSub: 'Todo o progresso será apagado permanentemente.',
            resetConfirm: 'Sim, resetar', cancel: 'Cancelar',
            resetSuccess: '✓ Plano resetado', brand: 'BibleXtra',
        };
        return fb[key] ?? key;
    }

    /* ── toast ───────────────────────────────────────────────── */
    function showToast(msg) {
        let toast = document.getElementById('teensToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'teensToast';
            toast.className = 'teens-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
    }

    /* ── confetti ─────────────────────────────────────────────── */
    function launchConfetti() {
        const canvas = document.createElement('canvas');
        Object.assign(canvas.style, {
            position: 'fixed', inset: '0', width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: '9999'
        });
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        const COLORS = ['#c9a96e', '#e8d5a8', '#8b6f3a', '#8b1a1a', '#f5edd8', '#fffbe6', '#d4ac0d', '#ffffff'];
        const particles = Array.from({ length: 200 }, () => {
            const angle = Math.random() * Math.PI * 2;
            const speed = 4 + Math.random() * 10;
            return {
                x: canvas.width * (0.15 + Math.random() * 0.7),
                y: canvas.height * (0.3 + Math.random() * 0.35),
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - (7 + Math.random() * 7),
                size: 5 + Math.random() * 8,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.28,
                shape: Math.random() < 0.55 ? 'rect' : 'circle',
                alpha: 1, decay: 0.011 + Math.random() * 0.009,
            };
        });
        (function tick() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = 0;
            for (const p of particles) {
                p.x += p.vx; p.y += p.vy; p.vy += 0.34; p.vx *= 0.992;
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
       INJECT STYLES  (new design tokens, but new UI aesthetic)
    ════════════════════════════════════════════════════════════ */
    function injectStyles() {
        if (document.getElementById('teens-styles-v2')) return;
        const style = document.createElement('style');
        style.id = 'teens-styles-v2';
        style.textContent = `
/* ── Teens global layout ──────────────────────────────────── */
.teens-wrap { padding: 0 1.25rem 3rem; max-width: 600px; margin: 0 auto; }

/* ── Teens banner (adapts to new ink/gold palette) ─────────── */
.teens-banner-v2 {
    position: relative; overflow: hidden; border-radius: 18px;
    background: var(--ink, #1a140a);
    padding: 2rem 1.5rem 1.75rem;
    margin-bottom: 1.75rem;
    border: 1px solid rgba(201,169,110,0.18);
}
.teens-banner-v2::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background:
        radial-gradient(ellipse 55% 45% at 85% 25%, rgba(201,169,110,.12) 0%, transparent 70%),
        radial-gradient(ellipse 40% 60% at 15% 85%, rgba(139,111,58,.08) 0%, transparent 70%);
}
.teens-banner-v2::after {
    content: 'XTRA'; position: absolute; right: -0.25rem; bottom: -0.75rem;
    font-size: 5.5rem; font-weight: 900; letter-spacing: -0.04em;
    color: rgba(255,255,255,.04); line-height: 1; pointer-events: none; user-select: none;
}
.teens-banner-tag-v2 {
    font-size: .65rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase;
    color: var(--gold, #c9a96e); opacity: .75; margin: 0 0 .5rem;
}
.teens-banner-title-v2 {
    font-size: 2rem; font-weight: 800; line-height: 1.1; letter-spacing: -.03em;
    color: var(--parchment, #f5edd8); margin: 0 0 1rem;
}
.teens-banner-meta-v2 { display: flex; align-items: center; gap: .6rem; flex-wrap: wrap; margin-bottom: 1rem; }
.teens-badge-v2 {
    display: inline-flex; align-items: center; gap: .3rem;
    background: rgba(201,169,110,.15); border: 1px solid rgba(201,169,110,.3);
    color: var(--gold, #c9a96e); font-size: .65rem; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase; padding: .25rem .65rem; border-radius: 999px;
}
.teens-badge-days-v2 {
    display: inline-flex; align-items: center;
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
    color: rgba(255,255,255,.5); font-size: .65rem; font-weight: 600;
    letter-spacing: .06em; padding: .25rem .65rem; border-radius: 999px;
}
.teens-progress-bar-wrap {
    height: 4px; background: rgba(255,255,255,.1); border-radius: 999px;
    overflow: hidden; margin-top: .5rem;
}
.teens-progress-bar-fill {
    height: 100%; background: linear-gradient(90deg, var(--gold-dark,#8b6f3a), var(--gold,#c9a96e));
    border-radius: 999px; transition: width .6s cubic-bezier(.4,0,.2,1);
}
.teens-progress-pct {
    font-size: .7rem; font-weight: 700; color: var(--gold,#c9a96e);
    letter-spacing: .05em; margin-top: .35rem; text-align: right;
}

/* ── Welcome cards ────────────────────────────────────────── */
.teens-welcome-cards {
    display: grid; grid-template-columns: repeat(3,1fr);
    gap: .65rem; margin-bottom: 1.5rem;
}
.teens-welcome-card {
    background: var(--parchment-d, #ede3d0); border-radius: 14px;
    padding: .9rem .5rem; text-align: center;
    border: 1px solid rgba(139,111,58,.12);
}
.teens-welcome-card-icon { font-size: 1.1rem; color: var(--gold-dark,#8b6f3a); margin-bottom: .3rem; }
.teens-welcome-card-val  {
    font-size: 1.4rem; font-weight: 800; letter-spacing: -.03em;
    color: var(--ink,#1a140a); line-height: 1;
}
.teens-welcome-card-label {
    font-size: .6rem; font-weight: 700; letter-spacing: .08em;
    text-transform: uppercase; color: rgba(0,0,0,.4); margin-top: .2rem;
}

/* ── Info card ────────────────────────────────────────────── */
.teens-info-card {
    background: var(--parchment-d, #ede3d0);
    border: 1px solid rgba(139,111,58,.15);
    border-radius: 14px; padding: .9rem 1rem; margin-bottom: 1.5rem;
}
.teens-info-title {
    font-size: .68rem; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; color: var(--gold-dark,#8b6f3a); margin: 0 0 .35rem;
}
.teens-info-text {
    font-size: .84rem; color: var(--ink,#1a140a); opacity: .75;
    margin: 0; line-height: 1.55;
}

/* ── Preview list ─────────────────────────────────────────── */
.teens-section-label {
    font-size: .66rem; font-weight: 700; letter-spacing: .12em;
    text-transform: uppercase; color: rgba(0,0,0,.35); margin: 0 0 .55rem;
}
.teens-preview-list {
    border: 1px solid rgba(0,0,0,.08); border-radius: 14px;
    overflow: hidden; margin-bottom: 1.25rem;
}
.teens-preview-row {
    display: flex; align-items: baseline; gap: .65rem;
    padding: .65rem .9rem; border-bottom: 1px solid rgba(0,0,0,.05);
}
.teens-preview-row:last-child { border-bottom: none; }
.teens-preview-day  { font-size: .72rem; font-weight: 700; color: var(--gold-dark,#8b6f3a); white-space: nowrap; min-width: 40px; }
.teens-preview-text { font-size: .78rem; color: var(--ink,#1a140a); opacity: .65; line-height: 1.4; }

/* ── Start / CTA button ───────────────────────────────────── */
.btn-teens-cta {
    width: 100%; padding: .9rem 1.25rem; border-radius: 12px; border: none;
    background: var(--gold-dark, #8b6f3a); color: var(--parchment, #f5edd8);
    font-size: .95rem; font-weight: 700; letter-spacing: .02em;
    cursor: pointer; display: flex; align-items: center;
    justify-content: center; gap: .5rem;
    transition: all .2s ease; box-shadow: 0 3px 16px rgba(139,111,58,.3);
    margin-bottom: .75rem;
}
.btn-teens-cta:hover { transform: translateY(-1px); box-shadow: 0 5px 20px rgba(139,111,58,.4); }
.btn-teens-cta:active { transform: translateY(0); }
.btn-teens-cta.done { background: var(--ink,#1a140a); color: var(--parchment,#f5edd8); box-shadow: 0 3px 16px rgba(0,0,0,.2); }

/* ── Day scroller ─────────────────────────────────────────── */
.teens-days-wrap {
    margin: 0 -1.25rem 1.75rem; padding: 0 1.25rem;
    overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch;
}
.teens-days-wrap::-webkit-scrollbar { display: none; }
.teens-days-inner {
    display: flex; gap: .45rem; padding: .2rem .25rem .5rem;
    width: max-content;
}
.teens-day-btn {
    display: flex; flex-direction: column; align-items: center; gap: .15rem;
    background: transparent; border: 1.5px solid transparent; border-radius: 11px;
    padding: .5rem .65rem; cursor: pointer; min-width: 48px;
    transition: all .15s ease; color: inherit;
}
.teens-day-btn:hover  { background: rgba(139,111,58,.08); border-color: rgba(139,111,58,.25); }
.teens-day-btn.active { background: rgba(139,111,58,.12); border-color: var(--gold-dark,#8b6f3a); }
.teens-day-btn.done-d { opacity: .4; }
.teens-day-num  { font-size: .95rem; font-weight: 700; line-height: 1; }
.teens-day-btn.active .teens-day-num { color: var(--gold-dark,#8b6f3a); }
.teens-day-date { font-size: .58rem; letter-spacing: .04em; text-transform: uppercase; opacity: .5; }

/* ── Day header ───────────────────────────────────────────── */
.teens-day-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: .75rem; flex-wrap: wrap; margin-bottom: 1rem;
}
.teens-day-title   { font-size: 1.3rem; font-weight: 700; letter-spacing: -.02em; margin: 0; }
.teens-day-subdate { font-size: .75rem; opacity: .45; margin-top: .15rem; }
.teens-status-pill {
    font-size: .64rem; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; padding: .25rem .65rem;
    border-radius: 999px; flex-shrink: 0; margin-top: .2rem;
}
.teens-status-today  { background: rgba(139,111,58,.12); color: var(--gold-dark,#8b6f3a); border: 1px solid rgba(139,111,58,.3); }
.teens-status-done   { background: rgba(16,185,129,.1);  color: #059669; border: 1px solid rgba(16,185,129,.25); }
.teens-status-late   { background: rgba(220,38,38,.08);  color: #b91c1c; border: 1px solid rgba(220,38,38,.2); }
.teens-status-future { background: rgba(0,0,0,.05);      color: rgba(0,0,0,.4); border: 1px solid rgba(0,0,0,.1); }

/* ── Today chapters note ──────────────────────────────────── */
.teens-note-card {
    background: var(--parchment-d, #ede3d0);
    border: 1px solid rgba(139,111,58,.15);
    border-radius: 12px; padding: .8rem .95rem;
    margin-bottom: 1.25rem; display: flex; align-items: flex-start; gap: .7rem;
}
.teens-note-icon    { font-size: 1rem; opacity: .55; flex-shrink: 0; margin-top: .1rem; }
.teens-note-label   { font-size: .65rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--gold-dark,#8b6f3a); margin-bottom: .15rem; }
.teens-note-content { font-size: .83rem; font-weight: 500; line-height: 1.45; }

/* ── Checklist ────────────────────────────────────────────── */
.teens-checklist {
    display: flex; flex-direction: column; gap: 0;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(0,0,0,.08); border-radius: 14px; overflow: hidden;
}
.teens-check-item {
    display: flex; align-items: center; gap: .8rem; padding: .85rem .95rem;
    cursor: pointer; border-bottom: 1px solid rgba(0,0,0,.06);
    transition: background .12s ease; position: relative;
}
.teens-check-item:last-child { border-bottom: none; }
.teens-check-item:hover { background: rgba(139,111,58,.04); }
.teens-check-item.done-item { background: rgba(16,185,129,.03); }
.teens-check-item.done-item:hover { background: rgba(16,185,129,.07); }

.teens-circle-btn {
    width: 28px; height: 28px; border-radius: 50%;
    border: 1.5px solid rgba(0,0,0,.18); background: transparent;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; cursor: pointer; transition: all .18s ease;
    color: transparent; padding: 0;
}
.teens-circle-btn i { font-size: .85rem; }
.teens-check-item.done-item .teens-circle-btn {
    background: #10b981; border-color: #10b981; color: #fff;
}
.teens-circle-btn:hover { border-color: var(--gold-dark,#8b6f3a); background: rgba(139,111,58,.08); }
.teens-check-item.done-item .teens-circle-btn:hover { background: #0ea472; border-color: #0ea472; }

.teens-chap-name { flex: 1; font-size: .93rem; font-weight: 500; transition: color .12s; }
.teens-check-item.done-item .teens-chap-name {
    opacity: .4; text-decoration: line-through; text-decoration-color: rgba(0,0,0,.2);
}
.teens-open-icon { font-size: .75rem; opacity: .25; transition: opacity .12s, transform .12s; flex-shrink: 0; }
.teens-check-item:hover .teens-open-icon { opacity: .55; transform: translateX(2px); }

/* ── Celebration card ─────────────────────────────────────── */
.teens-celebrate {
    background: var(--parchment-d,#ede3d0);
    border: 1px solid rgba(139,111,58,.2);
    border-radius: 14px; padding: 1.35rem; text-align: center; margin-top: .75rem;
}
.teens-celebrate-emoji { font-size: 2.2rem; margin-bottom: .4rem; }
.teens-celebrate-title { font-size: 1.1rem; font-weight: 800; letter-spacing: -.02em; color: var(--gold-dark,#8b6f3a); margin: 0 0 .25rem; }
.teens-celebrate-sub   { font-size: .78rem; opacity: .55; margin: 0; }

/* ── Backup trigger ───────────────────────────────────────── */
.teens-backup-btn {
    display: flex; align-items: center; justify-content: space-between; gap: .65rem;
    margin-bottom: 1.25rem; padding: .7rem .9rem;
    background: rgba(139,111,58,.05); border: 1px dashed rgba(139,111,58,.28);
    border-radius: 12px; cursor: pointer; transition: all .15s ease;
    color: inherit; width: 100%; text-align: left;
}
.teens-backup-btn:hover { background: rgba(139,111,58,.1); border-color: rgba(139,111,58,.5); }
.teens-backup-btn-left  { display: flex; align-items: center; gap: .55rem; }
.teens-backup-btn-icon  {
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(139,111,58,.12); display: flex; align-items: center;
    justify-content: center; color: var(--gold-dark,#8b6f3a); font-size: .9rem; flex-shrink: 0;
}
.teens-backup-btn-text strong { display: block; font-size: .82rem; font-weight: 700; }
.teens-backup-btn-text span   { font-size: .68rem; opacity: .5; }
.teens-backup-chevron { opacity: .4; font-size: .8rem; flex-shrink: 0; }

/* ── Reset button ─────────────────────────────────────────── */
.teens-reset-btn {
    width: 100%; padding: .65rem 1rem; border-radius: 11px; margin-top: .5rem;
    border: 1.5px solid rgba(185,28,28,.18); background: rgba(185,28,28,.04);
    color: #b91c1c; font-size: .78rem; font-weight: 700; letter-spacing: .03em;
    cursor: pointer; display: flex; align-items: center;
    justify-content: center; gap: .4rem; transition: all .15s ease;
}
.teens-reset-btn:hover { background: rgba(185,28,28,.1); border-color: rgba(185,28,28,.4); }

/* ── Back button (reading view) ───────────────────────────── */
.teens-back {
    display: inline-flex; align-items: center; gap: .4rem;
    background: transparent; border: 1px solid rgba(0,0,0,.1);
    border-radius: 999px; padding: .38rem .9rem;
    font-size: .78rem; font-weight: 600; cursor: pointer;
    color: inherit; transition: all .14s ease; margin-bottom: 1.75rem;
}
.teens-back:hover { background: rgba(139,111,58,.08); border-color: rgba(139,111,58,.35); color: var(--gold-dark,#8b6f3a); }

/* ── Mark done button ─────────────────────────────────────── */
.btn-teens-mark {
    background: var(--gold-dark,#8b6f3a) !important;
    color: var(--parchment,#f5edd8) !important; border: none !important;
    font-weight: 700 !important; transition: all .2s ease !important;
}
.btn-teens-mark:hover:not(:disabled) { transform: translateY(-1px); opacity: .9; }
.btn-teens-mark.marked {
    background: var(--ink,#1a140a) !important;
    color: var(--parchment,#f5edd8) !important;
}

/* ── Backup overlay ───────────────────────────────────────── */
.teens-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.55);
    backdrop-filter: blur(3px); z-index: 10000;
    display: flex; align-items: flex-end; justify-content: center;
    opacity: 0; pointer-events: none; transition: opacity .25s ease;
}
.teens-overlay.open { opacity: 1; pointer-events: all; }
.teens-sheet {
    background: var(--parchment, #f5edd8); border-radius: 22px 22px 0 0;
    width: 100%; max-width: 520px; padding: 0 1.25rem 2.5rem;
    max-height: 92vh; overflow-y: auto;
    transform: translateY(100%); transition: transform .3s cubic-bezier(.4,0,.2,1);
}
.teens-overlay.open .teens-sheet { transform: translateY(0); }
.teens-sheet-handle {
    width: 38px; height: 4px; border-radius: 999px;
    background: rgba(0,0,0,.15); margin: .7rem auto 1.4rem;
}
.teens-sheet-title { font-size: 1.15rem; font-weight: 800; letter-spacing: -.02em; margin: 0 0 .2rem; }
.teens-sheet-sub   { font-size: .76rem; opacity: .5; margin: 0 0 1.25rem; }

.teens-stat-row    { display: flex; gap: .5rem; margin-bottom: 1rem; }
.teens-stat-item   {
    flex: 1; background: rgba(0,0,0,.04); border: 1px solid rgba(0,0,0,.07);
    border-radius: 11px; padding: .6rem .65rem; text-align: center;
}
.teens-stat-val    { font-size: 1.25rem; font-weight: 800; letter-spacing: -.03em; color: var(--gold-dark,#8b6f3a); line-height: 1; }
.teens-stat-label  { font-size: .62rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; opacity: .4; margin-top: .2rem; }

.teens-card {
    border: 1px solid rgba(0,0,0,.08); border-radius: 14px;
    overflow: hidden; margin-bottom: .85rem;
}
.teens-card-head   { display: flex; align-items: center; gap: .7rem; padding: .9rem 1rem .55rem; }
.teens-card-ico    {
    width: 36px; height: 36px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: .95rem; flex-shrink: 0;
}
.teens-card-ico.exp { background: rgba(139,111,58,.1); color: var(--gold-dark,#8b6f3a); }
.teens-card-ico.imp { background: rgba(16,185,129,.1); color: #059669; }
.teens-card-title  { font-size: .9rem; font-weight: 700; margin: 0 0 .1rem; }
.teens-card-desc   { font-size: .72rem; opacity: .5; margin: 0; }
.teens-card-body   { padding: 0 1rem .9rem; display: flex; flex-direction: column; gap: .45rem; }

.btn-sheet {
    display: flex; align-items: center; justify-content: center; gap: .45rem;
    width: 100%; padding: .75rem 1rem; border-radius: 11px; border: none;
    font-size: .86rem; font-weight: 700; cursor: pointer; transition: all .18s ease;
}
.btn-sheet.primary { background: var(--gold-dark,#8b6f3a); color: var(--parchment,#f5edd8); }
.btn-sheet.primary:hover { opacity: .9; transform: translateY(-1px); }
.btn-sheet.secondary { background: rgba(139,111,58,.07); color: var(--gold-dark,#8b6f3a); border: 1px solid rgba(139,111,58,.2); }
.btn-sheet.secondary:hover { background: rgba(139,111,58,.13); }
.btn-sheet.success { background: #059669; color: #fff; }
.btn-sheet.success:hover { opacity: .9; transform: translateY(-1px); }
.btn-sheet.danger  { background: #b91c1c; color: #fff; }
.btn-sheet.danger:hover { opacity: .9; }
.btn-sheet.ghost   { background: transparent; color: rgba(0,0,0,.55); border: 1px solid rgba(0,0,0,.12); }

.teens-drop-zone {
    border: 2px dashed rgba(16,185,129,.35); border-radius: 11px;
    padding: 1.4rem 1rem; text-align: center; cursor: pointer;
    transition: all .18s ease; background: rgba(16,185,129,.03); position: relative;
}
.teens-drop-zone:hover, .teens-drop-zone.drag-over { border-color: #10b981; background: rgba(16,185,129,.08); }
.teens-drop-zone input[type=file] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
.teens-drop-zone-icon { font-size: 1.6rem; color: #10b981; margin-bottom: .35rem; }
.teens-drop-zone-text { font-size: .82rem; font-weight: 600; margin: 0 0 .15rem; }
.teens-drop-zone-hint { font-size: .68rem; opacity: .45; margin: 0; }

/* ── Toast ────────────────────────────────────────────────── */
.teens-toast {
    position: fixed; bottom: 1.5rem; left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: var(--ink,#1a140a); color: var(--parchment,#f5edd8);
    font-size: .8rem; font-weight: 600; padding: .6rem 1.2rem;
    border-radius: 999px; box-shadow: 0 4px 20px rgba(0,0,0,.25);
    opacity: 0; transition: opacity .2s, transform .2s;
    pointer-events: none; z-index: 10001; white-space: nowrap;
}
.teens-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

@keyframes teensIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.teens-in { animation: teensIn .28s cubic-bezier(.4,0,.2,1) forwards; }
        `;
        document.head.appendChild(style);
    }

    /* ════════════════════════════════════════════════════════════
       RESET MODAL
    ════════════════════════════════════════════════════════════ */
    function openResetModal() {
        document.getElementById('teensResetOverlay')?.remove();
        const count = completed.size;
        const chapLabel = count === 1 ? t('chapter', 'teens') : t('chapterPlural', 'teens');
        const readLabel = count === 1 ? t('read', 'teens') : t('readPlural', 'teens');

        const overlay = document.createElement('div');
        overlay.id = 'teensResetOverlay';
        overlay.className = 'teens-overlay';
        overlay.innerHTML = `
            <div class="teens-sheet" style="text-align:center">
                <div class="teens-sheet-handle"></div>
                <div style="width:56px;height:56px;border-radius:50%;background:rgba(185,28,28,.1);
                    color:#b91c1c;font-size:1.5rem;display:flex;align-items:center;
                    justify-content:center;margin:0 auto 1rem">
                    <i class="ph ph-warning"></i>
                </div>
                <p style="font-size:1.15rem;font-weight:800;letter-spacing:-.02em;margin:0 0 .4rem">${t('resetTitle', 'teens')}</p>
                <p style="font-size:.8rem;opacity:.5;line-height:1.5;margin:0 0 1.5rem">
                    ${count} ${chapLabel} ${readLabel}. ${t('resetSub', 'teens')}
                </p>
                <button class="btn-sheet danger" id="teensResetConfirm">
                    <i class="ph ph-trash"></i> ${t('resetConfirm', 'teens')}
                </button>
                <button class="btn-sheet ghost" id="teensResetCancel" style="margin-top:.4rem">
                    ${t('cancel', 'teens')}
                </button>
            </div>`;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('open'));

        overlay.addEventListener('click', e => { if (e.target === overlay) closeModal('teensResetOverlay'); });
        document.getElementById('teensResetCancel')?.addEventListener('click', () => closeModal('teensResetOverlay'));
        document.getElementById('teensResetConfirm')?.addEventListener('click', () => {
            clearCompleted(); clearStartDate();
            completed.clear(); teensStart = null; TEENS_PLAN = null;
            closeModal('teensResetOverlay');
            showToast(t('resetSuccess', 'teens'));
            openWelcomeScreen();
        });
    }

    /* ════════════════════════════════════════════════════════════
       BACKUP MODAL
    ════════════════════════════════════════════════════════════ */
    function openBackupModal(dayNum) {
        document.getElementById('teensBackupOverlay')?.remove();
        if (!TEENS_PLAN) TEENS_PLAN = buildTeensPlan();
        const totalChapters = TEENS_PLAN.reduce((s, p) => s + p.length, 0);
        const daysWithProgress = (() => {
            const ds = new Set();
            completed.forEach(k => ds.add(k.split('-')[0]));
            return ds.size;
        })();
        const pct = Math.round((completed.size / totalChapters) * 100) || 0;

        const overlay = document.createElement('div');
        overlay.id = 'teensBackupOverlay';
        overlay.className = 'teens-overlay';
        overlay.innerHTML = `
            <div class="teens-sheet">
                <div class="teens-sheet-handle"></div>
                <p class="teens-sheet-title">${t('backupTitle', 'teens')}</p>
                <p class="teens-sheet-sub">${t('backupDesc', 'teens')}</p>
                <div class="teens-stat-row">
                    <div class="teens-stat-item"><div class="teens-stat-val">${completed.size}</div><div class="teens-stat-label">${t('chapters', 'teens')}</div></div>
                    <div class="teens-stat-item"><div class="teens-stat-val">${daysWithProgress}</div><div class="teens-stat-label">${t('daysRead', 'teens')}</div></div>
                    <div class="teens-stat-item"><div class="teens-stat-val">${pct}%</div><div class="teens-stat-label">${t('concluded', 'teens')}</div></div>
                </div>
                <div class="teens-card">
                    <div class="teens-card-head">
                        <div class="teens-card-ico exp"><i class="ph ph-export"></i></div>
                        <div><p class="teens-card-title">${t('exportTitle', 'teens')}</p><p class="teens-card-desc">${t('exportDesc', 'teens')}</p></div>
                    </div>
                    <div class="teens-card-body">
                        <button class="btn-sheet primary" id="teensExportFile"><i class="ph ph-download-simple"></i> ${t('downloadBtn', 'teens')}</button>
                        <button class="btn-sheet secondary" id="teensCopyJson"><i class="ph ph-clipboard"></i> ${t('copyBtn', 'teens')}</button>
                    </div>
                </div>
                <div class="teens-card">
                    <div class="teens-card-head">
                        <div class="teens-card-ico imp"><i class="ph ph-import"></i></div>
                        <div><p class="teens-card-title">${t('importTitle', 'teens')}</p><p class="teens-card-desc">${t('importDesc', 'teens')}</p></div>
                    </div>
                    <div class="teens-card-body">
                        <div class="teens-drop-zone" id="teensDropZone">
                            <input type="file" id="teensImportInput" accept=".json">
                            <div class="teens-drop-zone-icon"><i class="ph ph-file-arrow-up"></i></div>
                            <p class="teens-drop-zone-text">${t('tapChoose', 'teens')}</p>
                            <p class="teens-drop-zone-hint">${t('dragDrop', 'teens')}</p>
                        </div>
                        <button class="btn-sheet success" id="teensPasteJson"><i class="ph ph-clipboard-text"></i> ${t('pasteBtn', 'teens')}</button>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('open'));

        overlay.addEventListener('click', e => { if (e.target === overlay) closeModal('teensBackupOverlay'); });
        document.getElementById('teensExportFile')?.addEventListener('click', () => {
            exportProgress(); showToast(t('fileExported', 'teens'));
        });
        document.getElementById('teensCopyJson')?.addEventListener('click', async () => {
            const json = buildExportJson();
            try { await navigator.clipboard.writeText(json); }
            catch (_) {
                const ta = document.createElement('textarea');
                ta.value = json; ta.style.cssText = 'position:fixed;opacity:0';
                document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
            }
            showToast(t('jsonCopied', 'teens'));
        });
        document.getElementById('teensImportInput')?.addEventListener('change', e => {
            const file = e.target.files?.[0]; if (!file) return;
            handleImportFile(file, dayNum); e.target.value = '';
        });
        const dropZone = document.getElementById('teensDropZone');
        dropZone?.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
        dropZone?.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
        dropZone?.addEventListener('drop', e => {
            e.preventDefault(); dropZone.classList.remove('drag-over');
            const file = e.dataTransfer?.files?.[0]; if (file) handleImportFile(file, dayNum);
        });
        document.getElementById('teensPasteJson')?.addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                handleImportText(text, dayNum);
            } catch (_) { showToast('⚠️ Não foi possível acessar a área de transferência.'); }
        });
    }

    function closeModal(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('open');
        setTimeout(() => el.remove(), 300);
    }

    function buildExportJson() {
        return JSON.stringify({
            version: 1, plan: 'teensplan',
            exportedAt: new Date().toISOString(),
            startDate: teensStart ? teensStart.toISOString() : null,
            completed: [...completed],
        }, null, 2);
    }

    function exportProgress() {
        const blob = new Blob([buildExportJson()], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
        a.href = url; a.download = `plano-adolescentes-backup-${date}.json`; a.click();
        URL.revokeObjectURL(url);
    }

    function applyImportData(data, dayNum) {
        if (data.plan !== 'teensplan' || !Array.isArray(data.completed))
            throw new Error(t('invalidJson', 'teens'));
        data.completed.forEach(k => completed.add(k));
        saveCompleted();
        if (data.startDate) {
            const d = new Date(data.startDate);
            if (!isNaN(d.getTime())) { teensStart = d; saveStartDate(d); }
        }
        closeModal('teensBackupOverlay');
        showToast(`✓ ${data.completed.length} ${t('restored', 'teens')}`);
        openDashboard(dayNum);
    }

    function handleImportFile(file, dayNum) {
        const reader = new FileReader();
        reader.onload = e => {
            try { applyImportData(JSON.parse(e.target.result), dayNum); }
            catch (err) { showToast(`⚠️ ${err.message}`); }
        };
        reader.readAsText(file);
    }

    function handleImportText(text, dayNum) {
        try { applyImportData(JSON.parse(text), dayNum); }
        catch (err) { showToast(`⚠️ ${err.message || t('errorImport', 'teens')}`); }
    }

    /* ════════════════════════════════════════════════════════════
       WELCOME SCREEN
    ════════════════════════════════════════════════════════════ */
    function openWelcomeScreen() {
        injectStyles();
        prepareContent();
        if (!TEENS_PLAN) TEENS_PLAN = buildTeensPlan();
        const totalChapters = TEENS_PLAN.reduce((s, p) => s + p.length, 0);

        let previewRows = '';
        for (let d = 1; d <= 5; d++) {
            const portions = TEENS_PLAN[d - 1] || [];
            previewRows += `
                <div class="teens-preview-row">
                    <span class="teens-preview-day">Dia ${d}</span>
                    <span class="teens-preview-text">${portions.map(p => `${p.bookName} ${p.chapter}`).join(', ')}</span>
                </div>`;
        }

        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="teens-wrap teens-in">
                <div class="teens-banner-v2">
                    <p class="teens-banner-tag-v2">${t('tag', 'teens')}</p>
                    <h2 class="teens-banner-title-v2">${t('bannerTitle', 'teens').replace('<br>', ' ')}</h2>
                    <div class="teens-banner-meta-v2">
                        <span class="teens-badge-v2"><i class="ph ph-lightning"></i> ${t('brand')}</span>
                        <span class="teens-badge-days-v2">${TEENS_DAYS} ${t('days', 'teens')}</span>
                    </div>
                </div>

                <div class="teens-welcome-cards">
                    <div class="teens-welcome-card">
                        <div class="teens-welcome-card-icon"><i class="ph ph-calendar"></i></div>
                        <div class="teens-welcome-card-val">${TEENS_DAYS}</div>
                        <div class="teens-welcome-card-label">${t('daysTitle', 'teens')}</div>
                    </div>
                    <div class="teens-welcome-card">
                        <div class="teens-welcome-card-icon"><i class="ph ph-book-open"></i></div>
                        <div class="teens-welcome-card-val">${totalChapters}</div>
                        <div class="teens-welcome-card-label">${t('chapters', 'teens')}</div>
                    </div>
                    <div class="teens-welcome-card">
                        <div class="teens-welcome-card-icon"><i class="ph ph-bookmarks"></i></div>
                        <div class="teens-welcome-card-val">${ALL_BOOKS.length}</div>
                        <div class="teens-welcome-card-label">${t('books', 'teens')}</div>
                    </div>
                </div>

                <div class="teens-info-card">
                    <p class="teens-info-title"><i class="ph ph-info"></i> ${t('howItWorks', 'teens')}</p>
                    <p class="teens-info-text">${t('startDesc', 'teens')} ${t('startInfo', 'teens')}</p>
                </div>

                <p class="teens-section-label">${t('preview', 'teens')}</p>
                <div class="teens-preview-list">
                    ${previewRows}
                    <div class="teens-preview-row" style="justify-content:center;opacity:.35;font-size:.72rem;padding:.55rem .9rem">
                        … ${t('andMore', 'teens')} ${TEENS_DAYS - 5} ${t('days', 'teens')}
                    </div>
                </div>

                <button class="btn-teens-cta" id="btnTeensIniciar">
                    <i class="ph ph-play-circle"></i> ${t('startBtn', 'teens')}
                </button>
            </div>`;

        document.getElementById('btnTeensIniciar')?.addEventListener('click', () => {
            teensStart = new Date();
            teensStart.setHours(0, 0, 0, 0);
            saveStartDate(teensStart);
            showToast(t('planStarted', 'teens'));
            openDashboard(1);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.closeSidebar?.();
    }

    /* ════════════════════════════════════════════════════════════
       DASHBOARD
    ════════════════════════════════════════════════════════════ */
    function openDashboard(dayNum) {
        injectStyles();
        prepareContent();
        if (!TEENS_PLAN) TEENS_PLAN = buildTeensPlan();

        const portions = TEENS_PLAN[dayNum - 1] || [];
        const today = todayTeensDay();
        const totalChapters = TEENS_PLAN.reduce((s, p) => s + p.length, 0);
        const globalPct = Math.round((completed.size / totalChapters) * 100) || 0;

        const allDone = portions.length > 0 && portions.every(p =>
            completed.has(completedKey(dayNum, p.bookId, p.chapter)));

        /* day scroller window */
        const winStart = Math.max(1, dayNum - 5);
        const winEnd = Math.min(TEENS_DAYS, winStart + 29);
        let dayCards = '';
        for (let d = winStart; d <= winEnd; d++) {
            const ps = TEENS_PLAN[d - 1] || [];
            const isDone = ps.length > 0 && ps.every(p => completed.has(completedKey(d, p.bookId, p.chapter)));
            dayCards += `
                <button class="teens-day-btn ${d === dayNum ? 'active' : ''} ${isDone ? 'done-d' : ''}" data-day="${d}">
                    <span class="teens-day-num">${d}</span>
                    <span class="teens-day-date">${formatDayDate(d)}</span>
                    ${isDone ? `<i class="ph ph-check" style="font-size:.58rem;color:#10b981;margin-top:-2px"></i>` : ''}
                </button>`;
        }

        /* status */
        let sc = 'teens-status-future', sl = t('future', 'teens');
        if (allDone) { sc = 'teens-status-done'; sl = t('complete', 'teens'); }
        else if (dayNum === today) { sc = 'teens-status-today'; sl = t('today', 'teens'); }
        else if (dayNum < today) { sc = 'teens-status-late'; sl = t('late', 'teens'); }

        /* checklist */
        let checkItems = '';
        portions.forEach((p, idx) => {
            const key = completedKey(dayNum, p.bookId, p.chapter);
            const done = completed.has(key);
            checkItems += `
                <div class="teens-check-item ${done ? 'done-item' : ''}" data-idx="${idx}">
                    <button class="teens-circle-btn" data-idx="${idx}" aria-label="Marcar">
                        <i class="ph ph-check-bold"></i>
                    </button>
                    <span class="teens-chap-name">${p.bookName} ${p.chapter}</span>
                    <i class="ph ph-caret-right teens-open-icon" data-idx="${idx}"></i>
                </div>`;
        });

        const chapCount = completed.size;
        const chapLabel = chapCount === 1 ? t('chapter', 'teens') : t('chapterPlural', 'teens');
        const savedLabel = chapCount === 1 ? t('saved', 'teens') : t('savedPlural', 'teens');

        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="teens-wrap teens-in">
                <div class="teens-banner-v2">
                    <p class="teens-banner-tag-v2">${t('tag', 'teens')}</p>
                    <h2 class="teens-banner-title-v2">${t('bannerTitle', 'teens').replace('<br>', ' ')}</h2>
                    <div class="teens-banner-meta-v2">
                        <span class="teens-badge-v2"><i class="ph ph-lightning"></i> ${t('brand')}</span>
                        <span class="teens-badge-days-v2">${TEENS_DAYS} ${t('days', 'teens')}</span>
                    </div>
                    <div class="teens-progress-bar-wrap">
                        <div class="teens-progress-bar-fill" style="width:${globalPct}%"></div>
                    </div>
                    <div class="teens-progress-pct">${globalPct}%</div>
                </div>

                <div class="teens-days-wrap">
                    <div class="teens-days-inner" id="teensDaysScroller">${dayCards}</div>
                </div>

                <div class="teens-day-header">
                    <div>
                        <h3 class="teens-day-title">${t('day', 'teens')} ${dayNum} <span style="font-weight:400;font-size:1rem;opacity:.35">${t('of', 'teens')} ${TEENS_DAYS}</span></h3>
                        <div class="teens-day-subdate">${formatDayDate(dayNum)}</div>
                    </div>
                    <span class="teens-status-pill ${sc}">${sl}</span>
                </div>

                <div class="teens-note-card">
                    <i class="ph ph-book teens-note-icon"></i>
                    <div>
                        <div class="teens-note-label">${t('todayChapters', 'teens')}</div>
                        <div class="teens-note-content">${portions.map(p => `${p.bookName} ${p.chapter}`).join(' · ') || '—'}</div>
                    </div>
                </div>

                <button class="teens-backup-btn" id="btnTeensBackup">
                    <div class="teens-backup-btn-left">
                        <div class="teens-backup-btn-icon"><i class="ph ph-shield-check"></i></div>
                        <div class="teens-backup-btn-text">
                            <strong>${t('backupTitle', 'teens')}</strong>
                            <span>${chapCount} ${chapLabel} ${savedLabel} · ${t('tapExport', 'teens')}</span>
                        </div>
                    </div>
                    <i class="ph ph-caret-right teens-backup-chevron"></i>
                </button>

                <div class="teens-checklist" id="teensChecklist">${checkItems}</div>

                <button class="btn-teens-cta ${allDone ? 'done' : ''}" id="btnTeensStart">
                    ${allDone
                ? `<i class="ph ph-arrow-counter-clockwise"></i> ${t('reRead', 'teens')}`
                : `<i class="ph ph-play-circle"></i> ${t('startReading', 'teens')}`}
                </button>

                ${allDone ? `
                    <div class="teens-celebrate">
                        <div class="teens-celebrate-emoji">🎉</div>
                        <p class="teens-celebrate-title">${t('day', 'teens')} ${dayNum} ${t('completedDay', 'teens')}</p>
                        <p class="teens-celebrate-sub">${t('keepItUp', 'teens')}</p>
                    </div>` : ''}

                <button class="teens-reset-btn" id="btnTeensReset">
                    <i class="ph ph-arrow-counter-clockwise"></i> ${t('resetBtn', 'teens')}
                </button>
            </div>`;

        /* events */
        document.getElementById('btnTeensBackup')?.addEventListener('click', () => openBackupModal(dayNum));
        document.getElementById('btnTeensReset')?.addEventListener('click', openResetModal);

        document.getElementById('teensDaysScroller')?.querySelectorAll('.teens-day-btn').forEach(btn =>
            btn.addEventListener('click', () => openDashboard(+btn.dataset.day)));

        document.getElementById('teensChecklist')?.querySelectorAll('.teens-check-item').forEach(item => {
            const idx = +item.dataset.idx;
            const p = portions[idx];
            const key = completedKey(dayNum, p.bookId, p.chapter);
            item.querySelector('.teens-circle-btn')?.addEventListener('click', e => {
                e.stopPropagation();
                completed.has(key) ? completed.delete(key) : completed.add(key);
                saveCompleted(); openDashboard(dayNum);
            });
            item.querySelector('.teens-chap-name')?.addEventListener('click', () => openReading(dayNum, idx));
            item.querySelector('.teens-open-icon')?.addEventListener('click', () => openReading(dayNum, idx));
        });

        document.getElementById('btnTeensStart')?.addEventListener('click', () => {
            let target = 0;
            for (let i = 0; i < portions.length; i++) {
                if (!completed.has(completedKey(dayNum, portions[i].bookId, portions[i].chapter))) { target = i; break; }
            }
            openReading(dayNum, target);
        });

        setTimeout(() => {
            document.querySelector('#teensDaysScroller .teens-day-btn.active')
                ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }, 60);

        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.closeSidebar?.();
    }

    /* ════════════════════════════════════════════════════════════
       READING VIEW
    ════════════════════════════════════════════════════════════ */
    async function openReading(dayNum, chapterIdx) {
        if (!TEENS_PLAN) TEENS_PLAN = buildTeensPlan();
        injectStyles();

        const portions = TEENS_PLAN[dayNum - 1] || [];
        if (!portions.length) return;
        chapterIdx = Math.max(0, Math.min(chapterIdx, portions.length - 1));

        window.speechSynthesis?.cancel();
        if (typeof window.ttsSetPlaying === 'function') window.ttsSetPlaying(false);

        const loader = document.getElementById('loader');
        const content = document.getElementById('content');
        const errMsg = document.getElementById('error-msg');
        loader?.classList.remove('d-none');
        content?.classList.add('d-none');
        errMsg?.classList.add('d-none');

        let verses;
        try {
            const p = portions[chapterIdx];
            verses = await fetchChapter(p.bookId, p.chapter);
        } catch (_) {
            loader?.classList.add('d-none');
            if (errMsg) {
                errMsg.classList.remove('d-none');
                errMsg.innerHTML = `
                    <div style="text-align:center;padding:2rem">
                        <i class="ph ph-warning-circle" style="font-size:2.5rem;opacity:.4"></i>
                        <p style="margin-top:1rem">${t('errorLoad', 'teens')}</p>
                        <button class="btn-nav" style="margin:auto" onclick="window._teensBackToDash()">${t('back', 'teens')}</button>
                    </div>`;
                window._teensBackToDash = () => openDashboard(dayNum);
            }
            return;
        }

        loader?.classList.add('d-none');
        content?.classList.remove('d-none');
        content.innerHTML = '';
        content.className = 'teens-in';

        const p = portions[chapterIdx];
        const key = completedKey(dayNum, p.bookId, p.chapter);
        const isDone = completed.has(key);

        /* chapter pills */
        let chapPills = '';
        portions.forEach((pp, i) => {
            const done = completed.has(completedKey(dayNum, pp.bookId, pp.chapter));
            chapPills += `
                <button class="chap-btn ${i === chapterIdx ? 'active' : ''}" data-cidx="${i}"
                    style="${done && i !== chapterIdx ? 'opacity:.4;text-decoration:line-through' : ''}">
                    ${pp.chapter}
                </button>`;
        });

        const fontSize = window.state?.fontSize ?? 1.1;
        const verseRows = verses.map(v => `
            <div class="verse">
                <span class="verse-num">${v.verse}</span>
                <span class="verse-text" style="font-size:${fontSize}rem">${v.text}</span>
            </div>`).join('');

        content.innerHTML = `
            <button class="teens-back" id="teensBackBtn">
                <i class="ph ph-arrow-left"></i> ${t('backToPlan', 'teens')} ${dayNum}
            </button>
            <h1 class="bible-heading">${p.bookName}</h1>
            <div class="bible-subheading">${window.t ? window.t('chapter') : 'Capítulo'} ${p.chapter}</div>
            <div class="ornament">✦ ✦ ✦</div>
            <div class="chapter-row">${chapPills}</div>
            <div id="teensVerses">${verseRows}</div>
            <div class="chap-nav">
                <button class="btn-nav" id="teensPrev" ${chapterIdx === 0 ? 'disabled' : ''}>
                    <i class="ph ph-caret-left"></i> ${t('prev', 'teens')}
                </button>
                <button class="btn-nav btn-teens-mark ${isDone ? 'marked' : ''}" id="teensDoneBtn">
                    <i class="ph ${isDone ? 'ph-check-circle' : 'ph-circle'}"></i>
                    ${isDone ? t('concluded', 'teens') : t('conclude', 'teens')}
                </button>
                <button class="btn-nav" id="teensNext" ${chapterIdx === portions.length - 1 ? 'disabled' : ''}>
                    ${t('next', 'teens')} <i class="ph ph-caret-right"></i>
                </button>
            </div>`;

        /* verse highlight on tap */
        content.querySelectorAll('.verse').forEach(v =>
            v.addEventListener('click', () => v.classList.toggle('highlight')));

        /* chapter pill navigation */
        content.querySelectorAll('.chap-btn').forEach(btn =>
            btn.addEventListener('click', () => openReading(dayNum, +btn.dataset.cidx)));

        document.getElementById('teensBackBtn')?.addEventListener('click', () => openDashboard(dayNum));
        document.getElementById('teensPrev')?.addEventListener('click', () => {
            if (chapterIdx > 0) openReading(dayNum, chapterIdx - 1);
        });
        document.getElementById('teensNext')?.addEventListener('click', () => {
            if (chapterIdx < portions.length - 1) openReading(dayNum, chapterIdx + 1);
        });
        document.getElementById('teensDoneBtn')?.addEventListener('click', () => {
            if (completed.has(key)) {
                completed.delete(key); saveCompleted();
                openReading(dayNum, chapterIdx);
            } else {
                completed.add(key); saveCompleted();
                const allNowDone = portions.every(pp =>
                    completed.has(completedKey(dayNum, pp.bookId, pp.chapter)));
                if (allNowDone) { launchConfetti(); setTimeout(() => openDashboard(dayNum), 600); }
                else if (chapterIdx < portions.length - 1) openReading(dayNum, chapterIdx + 1);
                else openDashboard(dayNum);
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ════════════════════════════════════════════════════════════
       HELPERS
    ════════════════════════════════════════════════════════════ */
    function prepareContent() {
        const content = document.getElementById('content');
        const loader = document.getElementById('loader');
        const errMsg = document.getElementById('error-msg');
        loader?.classList.add('d-none');
        errMsg?.classList.add('d-none');
        content?.classList.remove('d-none');
        if (content) { content.innerHTML = ''; content.className = 'teens-in'; }
    }

    /* ════════════════════════════════════════════════════════════
       PUBLIC API  (called from sidebar / other parts of app)
    ════════════════════════════════════════════════════════════ */
    window.openTeensDashboard = function (day) {
        if (window.state) window.state.currentView = 'plans';
        if (!teensStart) openWelcomeScreen();
        else openDashboard(day || todayTeensDay());
    };
    window.openTeensReading = openReading;
    window.openTeensWelcome = openWelcomeScreen;

    /* ════════════════════════════════════════════════════════════
       SIDEBAR ENTRY
    ════════════════════════════════════════════════════════════ */
    function buildTeensSidebar() {
        const container = document.getElementById('teensBooks');
        if (!container) return;
        /* avoid duplicating if already built */
        if (container.querySelector('#teensBtn')) return;

        const btn = document.createElement('button');
        btn.className = 'book-btn';
        btn.id = 'teensBtn';
        btn.innerHTML = `<i class="ph ph-lightning"></i> ${t('title', 'teens')}`;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.book-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (!TEENS_PLAN) TEENS_PLAN = buildTeensPlan();
            if (!teensStart) openWelcomeScreen();
            else openDashboard(todayTeensDay());
        });
        container.appendChild(btn);
    }

    /* ── init ────────────────────────────────────────────────── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildTeensSidebar);
    } else {
        buildTeensSidebar();
    }

})();
