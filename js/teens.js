/**
 * PLANO ADOLESCENTES
 *
 * A 297-day reading plan.
 * The plan ONLY starts when the user taps "Iniciar".
 * Requires: ALL_BOOKS, fetchChapter, state, SidebarMenu (from script.js / sidebar.js)
 */

(function () {

    /* ══════════════════════════════════════════════════════════════
       STORAGE KEYS
    ══════════════════════════════════════════════════════════════ */
    const TEENS_DAYS      = 297;
    const STORAGE_KEY     = 'teensplan_completed_v1';
    const STORAGE_START   = 'teensplan_startdate_v1';   // ← NEW: persisted start date

    /* ── helpers ────────────────────────────────────────────────── */
    function loadStartDate() {
        try {
            const raw = localStorage.getItem(STORAGE_START);
            if (!raw) return null;
            const d = new Date(raw);
            return isNaN(d.getTime()) ? null : d;
        } catch (_) { return null; }
    }

    function saveStartDate(date) {
        try { localStorage.setItem(STORAGE_START, date.toISOString()); } catch (_) {}
    }

    function clearStartDate() {
        try { localStorage.removeItem(STORAGE_START); } catch (_) {}
    }

    /* ── plan builder ───────────────────────────────────────────── */
    function buildTeensPlan() {
        const all = [];
        for (const b of ALL_BOOKS)
            for (let c = 1; c <= b.chapters; c++)
                all.push({ bookId: b.id, bookName: b.name, chapter: c });

        const total  = all.length;
        const base   = Math.floor(total / TEENS_DAYS);
        const extra  = total % TEENS_DAYS;
        const plan   = [];
        let idx = 0;
        for (let d = 0; d < TEENS_DAYS; d++) {
            const count = d < extra ? base + 1 : base;
            plan.push(all.slice(idx, idx + count));
            idx += count;
        }
        return plan;
    }

    /* ── persistence ────────────────────────────────────────────── */
    function loadCompleted() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? new Set(JSON.parse(raw)) : new Set();
        } catch (_) { return new Set(); }
    }

    function saveCompleted() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])); } catch (_) {}
    }

    function clearCompleted() {
        try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    }

    /* ── backup / restore ───────────────────────────────────────── */
    function exportProgress() {
        const blob = new Blob([buildExportJson()], { type: 'application/json' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
        a.href = url; a.download = `plano-adolescentes-backup-${date}.json`; a.click();
        URL.revokeObjectURL(url);
    }

    function importProgress(file, onDone) {
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.plan !== 'teensplan' || !Array.isArray(data.completed))
                    throw new Error('Arquivo inválido.');
                data.completed.forEach(k => completed.add(k));
                saveCompleted();
                // restore start date if present in backup
                if (data.startDate) {
                    const d = new Date(data.startDate);
                    if (!isNaN(d.getTime())) { teensStart = d; saveStartDate(d); }
                }
                onDone(null, data.completed.length);
            } catch (err) { onDone(err.message || 'Erro ao importar.'); }
        };
        reader.readAsText(file);
    }

    /* ── state ──────────────────────────────────────────────────── */
    let TEENS_PLAN  = null;
    let currentDay  = 1;
    let teensStart  = loadStartDate();          // null until user taps Iniciar
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
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
    }

    function showToast(msg) {
        let toast = document.getElementById('teensToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'teensToast';
            toast.className = 'teens-import-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
    }

    /* ══════════════════════════════════════════════════════════════
       RESET CONFIRMATION MODAL
    ══════════════════════════════════════════════════════════════ */
    function openResetModal() {
        document.getElementById('teensResetOverlay')?.remove();

        const overlay = document.createElement('div');
        overlay.id    = 'teensResetOverlay';
        overlay.className = 'teens-reset-overlay';
        overlay.innerHTML = `
            <div class="teens-reset-sheet" id="teensResetSheet">
                <div class="teens-backup-handle"></div>
                <div class="teens-reset-icon-wrap">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                </div>
                <p class="teens-reset-title">Resetar Plano?</p>
                <p class="teens-reset-sub">
                    Todo o seu progresso (${completed.size} capítulo${completed.size !== 1 ? 's' : ''} lido${completed.size !== 1 ? 's' : ''})
                    será apagado permanentemente. Essa ação não pode ser desfeita.
                </p>
                <button class="btn-backup-action primary" id="btnResetConfirm" style="background:linear-gradient(135deg,#dc2626,#ef4444);box-shadow:0 3px 14px rgba(220,38,38,.3)">
                    <i class="bi bi-trash3-fill"></i> Sim, resetar tudo
                </button>
                <button class="btn-backup-action secondary" id="btnResetCancel" style="margin-top:.25rem">
                    Cancelar
                </button>
            </div>`;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('open'));

        overlay.addEventListener('click', e => { if (e.target === overlay) closeResetModal(); });
        document.getElementById('btnResetCancel')?.addEventListener('click', closeResetModal);
        document.getElementById('btnResetConfirm')?.addEventListener('click', () => {
            clearCompleted();
            clearStartDate();
            completed.clear();
            teensStart = null;
            TEENS_PLAN = null;
            closeResetModal();
            showToast('✓ Plano resetado com sucesso!');
            openWelcomeScreen();
        });
    }

    function closeResetModal() {
        const overlay = document.getElementById('teensResetOverlay');
        if (!overlay) return;
        overlay.classList.remove('open');
        setTimeout(() => overlay.remove(), 300);
    }

    /* ══════════════════════════════════════════════════════════════
       WELCOME / INICIO SCREEN  (shown when teensStart === null)
    ══════════════════════════════════════════════════════════════ */
    function openWelcomeScreen() {
        injectStyles();

        const content = document.getElementById('content');
        const loader  = document.getElementById('loader');
        const errMsg  = document.getElementById('error-msg');

        loader?.classList.add('d-none');
        errMsg?.classList.add('d-none');
        content?.classList.remove('d-none');
        content.innerHTML = '';
        content.className = 'teens-fade';

        if (!TEENS_PLAN) TEENS_PLAN = buildTeensPlan();
        const totalChapters = TEENS_PLAN.reduce((s, p) => s + p.length, 0);

        // Build a quick preview: first 5 days
        let previewRows = '';
        for (let d = 1; d <= 5; d++) {
            const portions = TEENS_PLAN[d - 1] || [];
            const labels   = portions.map(p => `${p.bookName} ${p.chapter}`).join(', ');
            previewRows += `
                <div class="welcome-preview-row">
                    <span class="welcome-preview-day">Dia ${d}</span>
                    <span class="welcome-preview-chapters">${labels}</span>
                </div>`;
        }

        content.innerHTML = `
            <!-- Hero banner -->
            <div class="teens-banner" style="padding-bottom:2.5rem">
                <p class="teens-banner-tag">Plano de Leitura</p>
                <h2 class="teens-banner-title">Leitura<br>para<br>Adolescentes</h2>
                <div class="teens-banner-meta">
                    <span class="teens-badge"><i class="bi bi-lightning-charge-fill"></i> Bíblia Sagrada</span>
                    <span class="teens-badge-days">${TEENS_DAYS} dias</span>
                </div>
            </div>

            <!-- Info cards -->
            <div class="welcome-cards">
                <div class="welcome-card">
                    <div class="welcome-card-icon"><i class="bi bi-calendar3"></i></div>
                    <div class="welcome-card-val">${TEENS_DAYS}</div>
                    <div class="welcome-card-label">Dias</div>
                </div>
                <div class="welcome-card">
                    <div class="welcome-card-icon"><i class="bi bi-book-fill"></i></div>
                    <div class="welcome-card-val">${totalChapters}</div>
                    <div class="welcome-card-label">Capítulos</div>
                </div>
                <div class="welcome-card">
                    <div class="welcome-card-icon"><i class="bi bi-bookmarks-fill"></i></div>
                    <div class="welcome-card-val">${ALL_BOOKS.length}</div>
                    <div class="welcome-card-label">Livros</div>
                </div>
            </div>

            <!-- Description -->
            <div class="welcome-desc-card">
                <p class="welcome-desc-title"><i class="bi bi-info-circle"></i> Como funciona</p>
                <p class="welcome-desc-text">
                    Ao tocar em <strong>Iniciar</strong>, hoje vira o <strong>Dia 1</strong> do plano.
                    A contagem avança automaticamente a cada dia — você só precisa marcar os capítulos
                    à medida que lê. Seu progresso fica salvo no dispositivo.
                </p>
            </div>

            <!-- Preview -->
            <p class="welcome-section-label">Prévia do plano</p>
            <div class="welcome-preview-list">
                ${previewRows}
                <div class="welcome-preview-row" style="justify-content:center;opacity:.45;font-size:.78rem;padding:.6rem 1rem">
                    … e mais ${TEENS_DAYS - 5} dias
                </div>
            </div>

            <!-- CTA -->
            <button class="btn-teens-start" id="btnTeensIniciar" style="margin-top:1.5rem">
                <i class="bi bi-play-fill"></i> Iniciar Plano
            </button>
        `;

        document.getElementById('btnTeensIniciar')?.addEventListener('click', () => {
            // Record TODAY as day 1
            teensStart = new Date();
            teensStart.setHours(0, 0, 0, 0);
            saveStartDate(teensStart);
            showToast('✓ Plano iniciado! Bem-vindo(a)!');
            openDashboard(1);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.innerWidth < 768) window.closeSidebar?.();
    }

    /* ══════════════════════════════════════════════════════════════
       BACKUP MODAL
    ══════════════════════════════════════════════════════════════ */
    function openBackupModal(dayNum) {
        document.getElementById('teensBackupOverlay')?.remove();

        if (!TEENS_PLAN) TEENS_PLAN = buildTeensPlan();
        const totalChapters  = TEENS_PLAN.reduce((s, p) => s + p.length, 0);
        const daysWithProgress = (() => {
            const days = new Set();
            completed.forEach(k => days.add(k.split('-')[0]));
            return days.size;
        })();
        const pct = Math.round((completed.size / totalChapters) * 100) || 0;

        const overlay = document.createElement('div');
        overlay.id        = 'teensBackupOverlay';
        overlay.className = 'teens-backup-overlay';
        overlay.innerHTML = `
            <div class="teens-backup-sheet" id="teensBackupSheet">
                <div class="teens-backup-handle"></div>
                <p class="teens-backup-sheet-title">Backup do Progresso</p>
                <p class="teens-backup-sheet-sub">Exporte para salvar seu progresso ou importe um arquivo anterior.</p>
                <div class="teens-backup-stats">
                    <div class="teens-backup-stat">
                        <div class="teens-backup-stat-val">${completed.size}</div>
                        <div class="teens-backup-stat-label">Capítulos</div>
                    </div>
                    <div class="teens-backup-stat">
                        <div class="teens-backup-stat-val">${daysWithProgress}</div>
                        <div class="teens-backup-stat-label">Dias lidos</div>
                    </div>
                    <div class="teens-backup-stat">
                        <div class="teens-backup-stat-val">${pct}%</div>
                        <div class="teens-backup-stat-label">Concluído</div>
                    </div>
                </div>
                <div class="teens-backup-card">
                    <div class="teens-backup-card-header">
                        <div class="teens-backup-card-icon export"><i class="bi bi-box-arrow-up"></i></div>
                        <div>
                            <p class="teens-backup-card-title">Exportar progresso</p>
                            <p class="teens-backup-card-desc">Baixe um arquivo .json para guardar ou transferir</p>
                        </div>
                    </div>
                    <div class="teens-backup-card-body">
                        <button class="btn-backup-action primary" id="btnModalExportFile">
                            <i class="bi bi-download"></i> Baixar arquivo .json
                        </button>
                        <button class="btn-backup-action secondary" id="btnModalCopyJson">
                            <i class="bi bi-clipboard"></i> Copiar JSON
                        </button>
                    </div>
                </div>
                <div class="teens-backup-card">
                    <div class="teens-backup-card-header">
                        <div class="teens-backup-card-icon import"><i class="bi bi-box-arrow-in-down"></i></div>
                        <div>
                            <p class="teens-backup-card-title">Importar progresso</p>
                            <p class="teens-backup-card-desc">Restaure a partir de um arquivo exportado</p>
                        </div>
                    </div>
                    <div class="teens-backup-card-body">
                        <div class="teens-drop-zone" id="teensDropZone">
                            <input type="file" id="teensImportInput" accept=".json">
                            <div class="teens-drop-zone-icon"><i class="bi bi-file-earmark-arrow-up"></i></div>
                            <p class="teens-drop-zone-text">Toque para escolher o arquivo</p>
                            <p class="teens-drop-zone-hint">ou arraste e solte aqui · apenas .json</p>
                        </div>
                        <button class="btn-backup-action success" id="btnModalPasteJson">
                            <i class="bi bi-clipboard-check"></i> Colar JSON
                        </button>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('open'));

        overlay.addEventListener('click', e => { if (e.target === overlay) closeBackupModal(); });

        document.getElementById('btnModalExportFile')?.addEventListener('click', () => {
            exportProgress(); showToast('✓ Arquivo exportado!');
        });
        document.getElementById('btnModalCopyJson')?.addEventListener('click', async () => {
            const json = buildExportJson();
            try {
                await navigator.clipboard.writeText(json);
                showToast('✓ JSON copiado!');
            } catch (_) {
                const ta = document.createElement('textarea');
                ta.value = json; ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
                document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
                showToast('✓ JSON copiado!');
            }
        });
        document.getElementById('teensImportInput')?.addEventListener('change', e => {
            const file = e.target.files?.[0]; if (!file) return;
            handleImport(file, dayNum); e.target.value = '';
        });
        const dropZone = document.getElementById('teensDropZone');
        dropZone?.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
        dropZone?.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
        dropZone?.addEventListener('drop', e => {
            e.preventDefault(); dropZone.classList.remove('drag-over');
            const file = e.dataTransfer?.files?.[0]; if (file) handleImport(file, dayNum);
        });
        document.getElementById('btnModalPasteJson')?.addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                handleImportJson(text, dayNum);
            } catch (_) { showToast('⚠️ Não foi possível acessar a área de transferência.'); }
        });
    }

    function closeBackupModal() {
        const overlay = document.getElementById('teensBackupOverlay');
        if (!overlay) return;
        overlay.classList.remove('open');
        setTimeout(() => overlay.remove(), 300);
    }

    function buildExportJson() {
        return JSON.stringify({
            version: 1,
            plan: 'teensplan',
            exportedAt: new Date().toISOString(),
            startDate: teensStart ? teensStart.toISOString() : null,
            completed: [...completed],
        }, null, 2);
    }

    function handleImport(file, dayNum) {
        importProgress(file, (err, count) => {
            if (err) { showToast(`⚠️ ${err}`); }
            else { closeBackupModal(); showToast(`✓ ${count} capítulos restaurados!`); openDashboard(dayNum); }
        });
    }

    function handleImportJson(text, dayNum) {
        try {
            const data = JSON.parse(text);
            if (data.plan !== 'teensplan' || !Array.isArray(data.completed))
                throw new Error('JSON inválido.');
            data.completed.forEach(k => completed.add(k));
            saveCompleted();
            if (data.startDate) {
                const d = new Date(data.startDate);
                if (!isNaN(d.getTime())) { teensStart = d; saveStartDate(d); }
            }
            closeBackupModal();
            showToast(`✓ ${data.completed.length} capítulos restaurados!`);
            openDashboard(dayNum);
        } catch (err) { showToast(`⚠️ ${err.message || 'Erro ao importar JSON.'}`); }
    }

    /* ── confetti ───────────────────────────────────────────────── */
    function launchConfetti() {
        const canvas = document.createElement('canvas');
        Object.assign(canvas.style, { position:'fixed', inset:'0', width:'100%', height:'100%', pointerEvents:'none', zIndex:'9999' });
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        const COLORS = ['#c9a96e','#e8d5a8','#8b6f3a','#8b1a1a','#f5edd8','#fffbe6','#d4ac0d','#ffffff'];
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
                rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.28,
                shape: Math.random() < 0.55 ? 'rect' : 'circle', alpha: 1,
                decay: 0.011 + Math.random() * 0.009,
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
                if (p.shape === 'rect') { ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2); }
                else { ctx.beginPath(); ctx.arc(0, 0, p.size/2, 0, Math.PI*2); ctx.fill(); }
                ctx.restore();
            }
            if (alive > 0) requestAnimationFrame(tick); else canvas.remove();
        })();
    }

    /* ══════════════════════════════════════════════════════════════
       INJECT STYLES
    ══════════════════════════════════════════════════════════════ */
    function injectStyles() {
        if (document.getElementById('teens-styles')) return;
        const style = document.createElement('style');
        style.id = 'teens-styles';
        style.textContent = `
/* ── Welcome screen ─────────────────────────────────────────── */
.welcome-cards {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
}
.welcome-card {
    flex: 1;
    background: rgba(155,109,255,0.06);
    border: 1px solid rgba(155,109,255,0.18);
    border-radius: 16px;
    padding: 1rem 0.5rem;
    text-align: center;
}
.welcome-card-icon {
    font-size: 1.2rem;
    color: #9b6dff;
    margin-bottom: 0.35rem;
}
.welcome-card-val {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #7c3aed;
    line-height: 1;
}
.welcome-card-label {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--bs-secondary-color, rgba(0,0,0,0.45));
    margin-top: 0.2rem;
}
.welcome-desc-card {
    background: rgba(155,109,255,0.06);
    border: 1px solid rgba(155,109,255,0.15);
    border-radius: 14px;
    padding: 1rem 1.1rem;
    margin-bottom: 1.5rem;
}
.welcome-desc-title {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #9b6dff;
    margin: 0 0 0.4rem;
}
.welcome-desc-text {
    font-size: 0.86rem;
    color: var(--bs-body-color, rgba(0,0,0,0.75));
    margin: 0;
    line-height: 1.55;
}
.welcome-section-label {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--bs-secondary-color, rgba(0,0,0,0.4));
    margin: 0 0 0.6rem;
}
.welcome-preview-list {
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 0.5rem;
}
.welcome-preview-row {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    padding: 0.7rem 1.1rem;
    border-bottom: 1px solid rgba(0,0,0,0.05);
}
.welcome-preview-row:last-child { border-bottom: none; }
.welcome-preview-day {
    font-size: 0.75rem;
    font-weight: 700;
    color: #9b6dff;
    white-space: nowrap;
    min-width: 42px;
}
.welcome-preview-chapters {
    font-size: 0.8rem;
    color: var(--bs-body-color, rgba(0,0,0,0.65));
    line-height: 1.4;
}

/* ── Reset button (at dashboard bottom) ─────────────────────── */
.btn-teens-reset {
    width: 100%;
    padding: 0.7rem 1rem;
    border-radius: 12px;
    border: 1.5px solid rgba(220,38,38,0.2);
    background: rgba(220,38,38,0.04);
    color: #dc2626;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    transition: all 0.18s ease;
    margin-top: 0.5rem;
}
.btn-teens-reset:hover {
    background: rgba(220,38,38,0.1);
    border-color: rgba(220,38,38,0.45);
}

/* ── Reset modal ─────────────────────────────────────────────── */
.teens-reset-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    z-index: 10000;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
}
.teens-reset-overlay.open { opacity: 1; pointer-events: all; }
.teens-reset-sheet {
    background: var(--bs-body-bg, #fff);
    border-radius: 24px 24px 0 0;
    width: 100%;
    max-width: 480px;
    padding: 0 1.5rem 2.5rem;
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(.4,0,.2,1);
    text-align: center;
}
.teens-reset-overlay.open .teens-reset-sheet { transform: translateY(0); }
.teens-reset-icon-wrap {
    width: 60px; height: 60px;
    border-radius: 50%;
    background: rgba(220,38,38,0.1);
    color: #dc2626;
    font-size: 1.6rem;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1rem;
}
.teens-reset-title {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 0.4rem;
}
.teens-reset-sub {
    font-size: 0.82rem;
    color: var(--bs-secondary-color, rgba(0,0,0,0.5));
    line-height: 1.5;
    margin: 0 0 1.5rem;
}

/* ── Teens Banner ──────────────────────────────────────────── */
.teens-banner {
    position: relative; overflow: hidden; border-radius: 20px;
    background: linear-gradient(135deg, #1a0a2e 0%, #2d1560 50%, #1a0a2e 100%);
    padding: 2.5rem 2rem 2rem; margin-bottom: 2rem;
    border: 1px solid rgba(180, 120, 255, 0.25);
}
.teens-banner::before {
    content: ''; position: absolute; inset: 0;
    background:
        radial-gradient(ellipse 60% 40% at 80% 30%, rgba(180,100,255,.18) 0%, transparent 70%),
        radial-gradient(ellipse 40% 50% at 20% 80%, rgba(100,60,200,.12) 0%, transparent 70%);
    pointer-events: none;
}
.teens-banner::after {
    content: 'XTRA'; position: absolute; right: -0.5rem; bottom: -1rem;
    font-size: 6.5rem; font-weight: 900; letter-spacing: -0.04em;
    color: rgba(255,255,255,.04); line-height: 1; pointer-events: none; user-select: none;
}
.teens-banner-tag { font-size:.7rem; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:rgba(180,140,255,.8); margin:0 0 .75rem; }
.teens-banner-title { font-size:2.4rem; font-weight:800; line-height:1.1; letter-spacing:-.03em; color:#fff; margin:0 0 1.25rem; }
.teens-banner-meta { display:flex; align-items:center; gap:.75rem; flex-wrap:wrap; }
.teens-badge { display:inline-flex; align-items:center; gap:.3rem; background:rgba(180,120,255,.18); border:1px solid rgba(180,120,255,.35); color:#c8a0ff; font-size:.7rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; padding:.3rem .75rem; border-radius:999px; }
.teens-badge-days { display:inline-flex; align-items:center; gap:.3rem; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); color:rgba(255,255,255,.6); font-size:.7rem; font-weight:600; letter-spacing:.08em; padding:.3rem .75rem; border-radius:999px; }
.teens-banner-progress { margin-top:1.25rem; display:flex; align-items:center; gap:.75rem; }
.teens-banner-track { flex:1; height:3px; background:rgba(255,255,255,.1); border-radius:999px; overflow:hidden; }
.teens-banner-fill { height:100%; background:linear-gradient(90deg,#9b6dff,#c89fff); border-radius:999px; transition:width .6s cubic-bezier(.4,0,.2,1); }
.teens-banner-pct { font-size:.72rem; font-weight:700; color:#c8a0ff; letter-spacing:.05em; white-space:nowrap; }

/* ── Day Scroller ───────────────────────────────────────────── */
.days-scroller-wrap { margin:0 -1rem 1.75rem; padding:0 1rem; overflow-x:auto; scrollbar-width:none; -webkit-overflow-scrolling:touch; }
.days-scroller-wrap::-webkit-scrollbar { display:none; }
.days-scroller { display:flex; gap:.5rem; padding:.25rem .25rem .5rem; width:max-content; }
.day-card { display:flex; flex-direction:column; align-items:center; gap:.2rem; background:transparent; border:1.5px solid transparent; border-radius:12px; padding:.55rem .7rem; cursor:pointer; min-width:52px; transition:all .18s ease; color:inherit; }
.day-card:hover { background:rgba(155,109,255,.08); border-color:rgba(155,109,255,.2); }
.day-card.active { background:rgba(155,109,255,.12); border-color:rgba(155,109,255,.5); }
.day-card.done-day { opacity:.45; }
.day-num { font-size:1rem; font-weight:700; line-height:1; color:inherit; }
.day-card.active .day-num { color:#9b6dff; }
.day-date { font-size:.62rem; letter-spacing:.04em; color:var(--bs-secondary-color,rgba(0,0,0,.5)); text-transform:uppercase; }

/* ── Day header ─────────────────────────────────────────────── */
.teens-day-header { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:1rem; gap:.75rem; flex-wrap:wrap; }
.teens-day-label { font-size:1.35rem; font-weight:700; letter-spacing:-.02em; margin:0; }
.teens-day-date-text { font-size:.8rem; color:var(--bs-secondary-color,rgba(0,0,0,.5)); }
.teens-status-badge { font-size:.68rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:.28rem .7rem; border-radius:999px; flex-shrink:0; }
.teens-status-badge.status-today { background:rgba(155,109,255,.12); color:#7a4ee0; border:1px solid rgba(155,109,255,.3); }
.teens-status-badge.status-done { background:rgba(16,185,129,.1); color:#0d9668; border:1px solid rgba(16,185,129,.25); }
.teens-status-badge.status-late { background:rgba(239,68,68,.1); color:#c53030; border:1px solid rgba(239,68,68,.25); }
.teens-status-badge.status-future { background:rgba(100,100,100,.08); color:var(--bs-secondary-color,rgba(0,0,0,.5)); border:1px solid rgba(100,100,100,.15); }

/* ── Note card ──────────────────────────────────────────────── */
.teens-note-card { background:rgba(155,109,255,.06); border:1px solid rgba(155,109,255,.15); border-radius:14px; padding:.85rem 1.1rem; margin-bottom:1.5rem; display:flex; align-items:flex-start; gap:.8rem; }
.teens-note-icon { font-size:1.1rem; margin-top:.05rem; flex-shrink:0; opacity:.7; }
.teens-note-label { font-size:.72rem; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#9b6dff; margin-bottom:.2rem; }
.teens-note-chapters { font-size:.85rem; color:var(--bs-body-color,rgba(0,0,0,.75)); font-weight:500; }

/* ── Checklist ──────────────────────────────────────────────── */
.teens-checklist { display:flex; flex-direction:column; gap:0; margin-bottom:1.75rem; border:1px solid rgba(0,0,0,.08); border-radius:16px; overflow:hidden; }
.check-item { display:flex; align-items:center; gap:.85rem; padding:.9rem 1.1rem; cursor:pointer; border-bottom:1px solid rgba(0,0,0,.06); transition:background .15s ease; position:relative; }
.check-item:last-child { border-bottom:none; }
.check-item:hover { background:rgba(155,109,255,.04); }
.check-item.completed { background:rgba(16,185,129,.04); }
.check-item.completed:hover { background:rgba(16,185,129,.07); }
.circle-check { width:28px; height:28px; border-radius:50%; border:1.5px solid rgba(0,0,0,.2); background:transparent; display:flex; align-items:center; justify-content:center; flex-shrink:0; cursor:pointer; transition:all .2s ease; color:transparent; padding:0; }
.circle-check i { font-size:.8rem; }
.check-item.completed .circle-check { background:#10b981; border-color:#10b981; color:#fff; }
.circle-check:hover { border-color:#9b6dff; background:rgba(155,109,255,.1); }
.check-item.completed .circle-check:hover { background:#0ea472; border-color:#0ea472; }
.chapter-name { flex:1; font-size:.95rem; font-weight:500; color:inherit; transition:color .15s; }
.check-item.completed .chapter-name { color:var(--bs-secondary-color,rgba(0,0,0,.45)); text-decoration:line-through; text-decoration-color:rgba(0,0,0,.2); }
.open-chapter { font-size:.75rem; opacity:.3; transition:opacity .15s,transform .15s; flex-shrink:0; }
.check-item:hover .open-chapter { opacity:.6; transform:translateX(2px); }

/* ── Buttons ─────────────────────────────────────────────────── */
.btn-teens-start { width:100%; padding:.95rem 1.5rem; border-radius:14px; border:none; background:linear-gradient(135deg,#7c3aed,#9b6dff); color:#fff; font-size:1rem; font-weight:700; letter-spacing:.02em; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:.5rem; transition:all .2s ease; box-shadow:0 4px 20px rgba(123,58,237,.3); margin-bottom:1rem; }
.btn-teens-start:hover { transform:translateY(-1px); box-shadow:0 6px 24px rgba(123,58,237,.4); }
.btn-teens-start:active { transform:translateY(0); }
.btn-teens-start.all-done { background:linear-gradient(135deg,#059669,#10b981); box-shadow:0 4px 20px rgba(5,150,105,.3); }

/* ── Reading view ─────────────────────────────────────────────── */
.teens-back-btn { display:inline-flex; align-items:center; gap:.4rem; background:transparent; border:1px solid rgba(0,0,0,.12); border-radius:999px; padding:.4rem 1rem; font-size:.8rem; font-weight:600; cursor:pointer; margin-bottom:2rem; color:inherit; transition:all .15s; }
.teens-back-btn:hover { background:rgba(155,109,255,.07); border-color:rgba(155,109,255,.3); color:#7c3aed; }
.btn-teens-done { background:linear-gradient(135deg,#7c3aed,#9b6dff) !important; color:#fff !important; border:none !important; font-weight:700 !important; box-shadow:0 2px 12px rgba(123,58,237,.25); transition:all .2s ease !important; }
.btn-teens-done:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 4px 16px rgba(123,58,237,.35) !important; }
.btn-teens-done.btn-done-active { background:linear-gradient(135deg,#059669,#10b981) !important; box-shadow:0 2px 12px rgba(5,150,105,.25) !important; }

/* ── Celebration card ──────────────────────────────────────── */
.teens-complete-card { background:linear-gradient(135deg,rgba(155,109,255,.08),rgba(16,185,129,.06)); border:1px solid rgba(155,109,255,.2); border-radius:16px; padding:1.5rem; text-align:center; margin-top:1rem; }
.teens-complete-emoji { font-size:2.5rem; margin-bottom:.5rem; }
.teens-complete-title { font-size:1.2rem; font-weight:800; letter-spacing:-.02em; color:#7c3aed; margin:0 0 .3rem; }
.teens-complete-sub { font-size:.82rem; color:var(--bs-secondary-color,rgba(0,0,0,.5)); margin:0; }

/* ── Backup trigger ──────────────────────────────────────────── */
.teens-backup-trigger { display:flex; align-items:center; justify-content:space-between; gap:.75rem; margin-bottom:1.5rem; padding:.75rem 1rem; background:rgba(155,109,255,.05); border:1px dashed rgba(155,109,255,.3); border-radius:12px; cursor:pointer; transition:all .15s ease; color:inherit; width:100%; text-align:left; }
.teens-backup-trigger:hover { background:rgba(155,109,255,.1); border-color:rgba(155,109,255,.5); }
.teens-backup-trigger-left { display:flex; align-items:center; gap:.6rem; }
.teens-backup-trigger-icon { width:32px; height:32px; border-radius:8px; background:rgba(155,109,255,.12); display:flex; align-items:center; justify-content:center; color:#7c3aed; font-size:.95rem; flex-shrink:0; }
.teens-backup-trigger-text strong { display:block; font-size:.85rem; font-weight:700; color:var(--bs-body-color,#111); }
.teens-backup-trigger-text span { font-size:.72rem; color:var(--bs-secondary-color,rgba(0,0,0,.5)); }
.teens-backup-trigger-chevron { color:rgba(155,109,255,.6); font-size:.85rem; flex-shrink:0; }

/* ── Backup overlay ──────────────────────────────────────────── */
.teens-backup-overlay { position:fixed; inset:0; background:rgba(0,0,0,.55); backdrop-filter:blur(3px); z-index:10000; display:flex; align-items:flex-end; justify-content:center; opacity:0; pointer-events:none; transition:opacity .25s ease; }
.teens-backup-overlay.open { opacity:1; pointer-events:all; }
.teens-backup-sheet { background:var(--bs-body-bg,#fff); border-radius:24px 24px 0 0; width:100%; max-width:520px; padding:0 1.25rem 2rem; max-height:92vh; overflow-y:auto; transform:translateY(100%); transition:transform .3s cubic-bezier(.4,0,.2,1); }
.teens-backup-overlay.open .teens-backup-sheet { transform:translateY(0); }
.teens-backup-handle { width:40px; height:4px; border-radius:999px; background:rgba(0,0,0,.15); margin:.75rem auto 1.5rem; }
.teens-backup-sheet-title { font-size:1.2rem; font-weight:800; letter-spacing:-.02em; margin:0 0 .25rem; }
.teens-backup-sheet-sub { font-size:.8rem; color:var(--bs-secondary-color,rgba(0,0,0,.5)); margin:0 0 1.5rem; }
.teens-backup-card { border:1px solid rgba(0,0,0,.09); border-radius:16px; overflow:hidden; margin-bottom:1rem; }
.teens-backup-card-header { display:flex; align-items:center; gap:.75rem; padding:1rem 1.1rem .6rem; }
.teens-backup-card-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; }
.teens-backup-card-icon.export { background:rgba(124,58,237,.1); color:#7c3aed; }
.teens-backup-card-icon.import { background:rgba(16,185,129,.1); color:#059669; }
.teens-backup-card-title { font-size:.95rem; font-weight:700; margin:0 0 .1rem; }
.teens-backup-card-desc { font-size:.76rem; color:var(--bs-secondary-color,rgba(0,0,0,.5)); margin:0; }
.teens-backup-card-body { padding:0 1.1rem 1rem; display:flex; flex-direction:column; gap:.5rem; }
.btn-backup-action { display:flex; align-items:center; justify-content:center; gap:.5rem; width:100%; padding:.8rem 1rem; border-radius:12px; border:none; font-size:.9rem; font-weight:700; cursor:pointer; transition:all .2s ease; }
.btn-backup-action.primary { background:linear-gradient(135deg,#7c3aed,#9b6dff); color:#fff; box-shadow:0 3px 14px rgba(123,58,237,.28); }
.btn-backup-action.primary:hover { transform:translateY(-1px); }
.btn-backup-action.secondary { background:rgba(124,58,237,.07); color:#7c3aed; border:1px solid rgba(124,58,237,.2); }
.btn-backup-action.secondary:hover { background:rgba(124,58,237,.12); }
.btn-backup-action.success { background:linear-gradient(135deg,#059669,#10b981); color:#fff; box-shadow:0 3px 14px rgba(5,150,105,.25); }
.btn-backup-action.success:hover { transform:translateY(-1px); }
.teens-drop-zone { border:2px dashed rgba(16,185,129,.35); border-radius:12px; padding:1.5rem 1rem; text-align:center; cursor:pointer; transition:all .2s ease; background:rgba(16,185,129,.03); position:relative; }
.teens-drop-zone:hover, .teens-drop-zone.drag-over { border-color:#10b981; background:rgba(16,185,129,.08); }
.teens-drop-zone input[type=file] { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; }
.teens-drop-zone-icon { font-size:1.75rem; color:#10b981; margin-bottom:.4rem; }
.teens-drop-zone-text { font-size:.85rem; font-weight:600; color:var(--bs-body-color,#111); margin:0 0 .2rem; }
.teens-drop-zone-hint { font-size:.72rem; color:var(--bs-secondary-color,rgba(0,0,0,.45)); margin:0; }
.teens-backup-stats { display:flex; gap:.5rem; margin-bottom:1rem; }
.teens-backup-stat { flex:1; background:rgba(0,0,0,.03); border:1px solid rgba(0,0,0,.07); border-radius:12px; padding:.65rem .75rem; text-align:center; }
.teens-backup-stat-val { font-size:1.3rem; font-weight:800; letter-spacing:-.03em; color:#7c3aed; line-height:1; }
.teens-backup-stat-label { font-size:.65rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--bs-secondary-color,rgba(0,0,0,.45)); margin-top:.2rem; }

/* ── Toast ───────────────────────────────────────────────────── */
.teens-import-toast { position:fixed; bottom:1.5rem; left:50%; transform:translateX(-50%) translateY(10px); background:#1a1a2e; color:#fff; font-size:.82rem; font-weight:600; padding:.65rem 1.25rem; border-radius:999px; box-shadow:0 4px 20px rgba(0,0,0,.25); opacity:0; transition:opacity .2s ease,transform .2s ease; pointer-events:none; z-index:10001; white-space:nowrap; }
.teens-import-toast.show { opacity:1; transform:translateX(-50%) translateY(0); }

@keyframes teensIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
.teens-fade { animation:teensIn .3s cubic-bezier(.4,0,.2,1) forwards; }
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

        /* per-day progress */
        let overallDone = 0;
        completed.forEach(k => { if (k.startsWith(`${dayNum}-`)) overallDone++; });
        const allDone = overallDone === portions.length && portions.length > 0;

        /* global % */
        const totalChapters = TEENS_PLAN.reduce((s, p) => s + p.length, 0);
        const globalPct     = Math.round((completed.size / totalChapters) * 100) || 0;

        /* day scroller */
        const windowStart = Math.max(1, dayNum - 5);
        const windowEnd   = Math.min(TEENS_DAYS, windowStart + 29);
        let dayCards = '';
        for (let d = windowStart; d <= windowEnd; d++) {
            const ps    = TEENS_PLAN[d - 1] || [];
            const isDone = ps.length > 0 && ps.every(p => completed.has(completedKey(d, p.bookId, p.chapter)));
            dayCards += `
                <button class="day-card ${d === dayNum ? 'active' : ''} ${isDone ? 'done-day' : ''}" data-day="${d}">
                    <span class="day-num">${d}</span>
                    <span class="day-date">${formatDayDate(d)}</span>
                    ${isDone ? '<i class="bi bi-check-lg" style="font-size:.6rem;color:#10b981;margin-top:-4px"></i>' : ''}
                </button>`;
        }

        /* status badge */
        let statusClass = 'status-future', statusLabel = 'Futuro';
        if (allDone)           { statusClass = 'status-done';   statusLabel = '✦ Completo!'; }
        else if (dayNum === today) { statusClass = 'status-today';  statusLabel = 'Hoje'; }
        else if (dayNum < today)   { statusClass = 'status-late';   statusLabel = 'Atrasado'; }

        const chapLabels = portions.map(p => `${p.bookName} ${p.chapter}`).join(' · ');

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

        const celebCard = allDone ? `
            <div class="teens-complete-card">
                <div class="teens-complete-emoji">🎉</div>
                <p class="teens-complete-title">Dia ${dayNum} concluído!</p>
                <p class="teens-complete-sub">Você está indo muito bem. Continue firme!</p>
            </div>` : '';

        content.innerHTML = '';
        content.className = 'teens-fade';
        content.innerHTML = `
            <div class="teens-banner">
                <p class="teens-banner-tag">Plano</p>
                <h2 class="teens-banner-title">Leitura<br>para<br>Adolescentes</h2>
                <div class="teens-banner-meta">
                    <span class="teens-badge"><i class="bi bi-lightning-charge-fill"></i> Bíblia Sagrada</span>
                    <span class="teens-badge-days">${TEENS_DAYS} dias</span>
                </div>
                <div class="teens-banner-progress">
                    <div class="teens-banner-track">
                        <div class="teens-banner-fill" style="width:${globalPct}%"></div>
                    </div>
                    <span class="teens-banner-pct">${globalPct}%</span>
                </div>
            </div>

            <div class="days-scroller-wrap">
                <div class="days-scroller" id="teensDaysScroller">${dayCards}</div>
            </div>

            <div class="teens-day-header">
                <div>
                    <h3 class="teens-day-label">Dia ${dayNum} <span style="font-weight:400;font-size:1rem;opacity:.45">de ${TEENS_DAYS}</span></h3>
                    <p class="teens-day-date-text">${formatDayDate(dayNum)}</p>
                </div>
                <span class="teens-status-badge ${statusClass}">${statusLabel}</span>
            </div>

            <div class="teens-note-card">
                <i class="bi bi-book teens-note-icon"></i>
                <div>
                    <div class="teens-note-label">Capítulos de hoje</div>
                    <div class="teens-note-chapters">${chapLabels || '—'}</div>
                </div>
            </div>

            <button class="teens-backup-trigger" id="btnTeensBackup">
                <div class="teens-backup-trigger-left">
                    <div class="teens-backup-trigger-icon"><i class="bi bi-shield-check"></i></div>
                    <div class="teens-backup-trigger-text">
                        <strong>Backup do Progresso</strong>
                        <span>${completed.size} capítulo${completed.size !== 1 ? 's' : ''} salvo${completed.size !== 1 ? 's' : ''} · Toque para exportar ou importar</span>
                    </div>
                </div>
                <i class="bi bi-chevron-right teens-backup-trigger-chevron"></i>
            </button>

            <div class="teens-checklist" id="teensChecklist">${checklist}</div>

            <button class="btn-teens-start ${allDone ? 'all-done' : ''}" id="btnTeensStart">
                ${allDone
                    ? '<i class="bi bi-arrow-repeat"></i> Reler o dia'
                    : '<i class="bi bi-play-fill"></i> Começar Leitura'}
            </button>

            ${celebCard}

            <!-- ── Reset button at the bottom ── -->
            <button class="btn-teens-reset" id="btnTeensReset">
                <i class="bi bi-arrow-counterclockwise"></i> Resetar Plano
            </button>
        `;

        /* ── events ── */
        document.getElementById('btnTeensBackup')
            ?.addEventListener('click', () => openBackupModal(dayNum));

        document.getElementById('btnTeensReset')
            ?.addEventListener('click', openResetModal);

        document.getElementById('teensDaysScroller')
            ?.querySelectorAll('.day-card')
            .forEach(btn => btn.addEventListener('click', () => openDashboard(+btn.dataset.day)));

        document.getElementById('teensChecklist')
            ?.querySelectorAll('.check-item')
            .forEach(item => {
                const idx = +item.dataset.idx;
                const p   = portions[idx];
                const key = completedKey(dayNum, p.bookId, p.chapter);

                item.querySelector('.circle-check')?.addEventListener('click', e => {
                    e.stopPropagation();
                    if (completed.has(key)) completed.delete(key); else completed.add(key);
                    saveCompleted();
                    openDashboard(dayNum);
                });
                item.querySelector('.chapter-name')
                    ?.addEventListener('click', () => openReading(dayNum, idx));
                item.querySelector('.open-chapter')
                    ?.addEventListener('click', () => openReading(dayNum, idx));
            });

        document.getElementById('btnTeensStart')?.addEventListener('click', () => {
            let target = 0;
            for (let i = 0; i < portions.length; i++) {
                if (!completed.has(completedKey(dayNum, portions[i].bookId, portions[i].chapter))) {
                    target = i; break;
                }
            }
            openReading(dayNum, target);
        });

        setTimeout(() => {
            document.querySelector('#teensDaysScroller .day-card.active')
                ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }, 60);

        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.innerWidth < 768) window.closeSidebar?.();
    }

    /* ══════════════════════════════════════════════════════════════
       READING VIEW
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

        const p     = portions[chapterIdx];
        const key   = completedKey(dayNum, p.bookId, p.chapter);
        const isDone = completed.has(key);

        let chapPills = '';
        portions.forEach((pp, i) => {
            const done = completed.has(completedKey(dayNum, pp.bookId, pp.chapter));
            chapPills += `
                <button class="chap-btn ${i === chapterIdx ? 'active' : ''}" data-cidx="${i}"
                    style="${done && i !== chapterIdx ? 'opacity:.45;text-decoration:line-through' : ''}">
                    ${pp.chapter}
                </button>`;
        });

        const verseRows = verses.map(v => `
            <div class="verse">
                <span class="verse-num">${v.verse}</span>
                <span class="verse-text" style="font-size:${window.state?.fontSize ?? 1.1}rem">${v.text}</span>
            </div>`).join('');

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

        content.querySelectorAll('.verse')
            .forEach(v => v.addEventListener('click', () => v.classList.toggle('highlight')));
        content.querySelectorAll('.chap-btn')
            .forEach(btn => btn.addEventListener('click', () => openReading(dayNum, +btn.dataset.cidx)));
        document.getElementById('teensBackBtn')
            ?.addEventListener('click', () => openDashboard(dayNum));
        document.getElementById('teensPrev')
            ?.addEventListener('click', () => { if (chapterIdx > 0) openReading(dayNum, chapterIdx - 1); });
        document.getElementById('teensNext')
            ?.addEventListener('click', () => { if (chapterIdx < portions.length - 1) openReading(dayNum, chapterIdx + 1); });

        document.getElementById('teensDone')?.addEventListener('click', () => {
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

    /* ══════════════════════════════════════════════════════════════
       SIDEBAR ENTRY
    ══════════════════════════════════════════════════════════════ */
    function buildTeensSidebar() {
        const container = document.getElementById('teensBooks');
        if (!container) return;

        const btn = document.createElement('button');
        btn.className = 'book-btn';
        btn.id        = 'teensBtn';
        btn.innerHTML = `<i class="bi bi-lightning-charge-fill"></i> Plano Adolescentes`;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.book-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (!TEENS_PLAN) TEENS_PLAN = buildTeensPlan();
            // Show welcome screen if not started yet, otherwise go to today's day
            if (!teensStart) openWelcomeScreen();
            else openDashboard(todayTeensDay());
        });
        container.appendChild(btn);
    }

    /* ── init ─────────────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', () => {
        buildTeensSidebar();
    });

})();