/**
 * PLANO ADOLESCENTES — @xtrafhop / fhopchurch
 *
 * A 297-day reading plan starting April 4 2026.
 * Requires: ALL_BOOKS, fetchChapter, state, SidebarMenu (from script.js / sidebar.js)
 *
 * UX matches chapter reader & Leitura de Hoje — unified experience.
 * Progress is persisted to localStorage so it survives page reloads / offline use.
 */

(function () {

    /* ══════════════════════════════════════════════════════════════
       PLAN DATA
    ══════════════════════════════════════════════════════════════ */
    const TEENS_START    = new Date(2026, 3, 4);
    const TEENS_DAYS     = 297;
    const STORAGE_KEY    = 'teensplan_completed_v1';   // bump suffix to reset all progress

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

    /* ── persistence ────────────────────────────────────────────── */
    function loadCompleted() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? new Set(JSON.parse(raw)) : new Set();
        } catch (_) {
            return new Set();
        }
    }

    function saveCompleted() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
        } catch (_) {
            // storage quota exceeded or private-browsing restriction — fail silently
        }
    }

    /* ── backup / restore ───────────────────────────────────────── */
    function exportProgress() {
        const blob = new Blob([buildExportJson()], { type: 'application/json' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
        a.href     = url;
        a.download = `plano-adolescentes-backup-${date}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function importProgress(file, onDone) {
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.plan !== 'teensplan' || !Array.isArray(data.completed))
                    throw new Error('Arquivo inválido.');
                // merge: union of current + imported (never loses progress)
                data.completed.forEach(k => completed.add(k));
                saveCompleted();
                onDone(null, data.completed.length);
            } catch (err) {
                onDone(err.message || 'Erro ao importar.');
            }
        };
        reader.readAsText(file);
    }

    /* ── state ──────────────────────────────────────────────────── */
    let TEENS_PLAN  = null;
    let currentDay  = 1;
    const completed = loadCompleted();   // ← restored from localStorage on load

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

    /* ── Backup modal ────────────────────────────────────────────── */
    function openBackupModal(dayNum) {
        // remove stale modal if any
        document.getElementById('teensBackupOverlay')?.remove();

        if (!TEENS_PLAN) TEENS_PLAN = buildTeensPlan();
        const totalChapters = TEENS_PLAN.reduce((s, p) => s + p.length, 0);
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
                <p class="teens-backup-sheet-sub">Exporte para salvar seu progresso ou importe um arquivo anterior para restaurá-lo.</p>

                <!-- Stats -->
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

                <!-- Export card -->
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
                            <i class="bi bi-clipboard"></i> Copiar JSON para a área de transferência
                        </button>
                    </div>
                </div>

                <!-- Import card -->
                <div class="teens-backup-card">
                    <div class="teens-backup-card-header">
                        <div class="teens-backup-card-icon import"><i class="bi bi-box-arrow-in-down"></i></div>
                        <div>
                            <p class="teens-backup-card-title">Importar progresso</p>
                            <p class="teens-backup-card-desc">Restaure a partir de um arquivo exportado anteriormente</p>
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
                            <i class="bi bi-clipboard-check"></i> Colar JSON da área de transferência
                        </button>
                    </div>
                </div>

            </div>
        `;
        document.body.appendChild(overlay);

        // animate in
        requestAnimationFrame(() => overlay.classList.add('open'));

        // close on overlay backdrop click
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeBackupModal();
        });

        // ── Export: download file
        document.getElementById('btnModalExportFile')?.addEventListener('click', () => {
            exportProgress();
            showToast('✓ Arquivo exportado com sucesso!');
        });

        // ── Export: copy JSON to clipboard
        document.getElementById('btnModalCopyJson')?.addEventListener('click', async () => {
            const json = buildExportJson();
            try {
                await navigator.clipboard.writeText(json);
                showToast('✓ JSON copiado para a área de transferência!');
            } catch (_) {
                // fallback: select a textarea
                const ta = document.createElement('textarea');
                ta.value = json;
                ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
                showToast('✓ JSON copiado!');
            }
        });

        // ── Import: file input
        document.getElementById('teensImportInput')?.addEventListener('change', e => {
            const file = e.target.files?.[0];
            if (!file) return;
            handleImport(file, dayNum);
            e.target.value = '';
        });

        // ── Import: drag and drop
        const dropZone = document.getElementById('teensDropZone');
        dropZone?.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
        dropZone?.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
        dropZone?.addEventListener('drop', e => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const file = e.dataTransfer?.files?.[0];
            if (file) handleImport(file, dayNum);
        });

        // ── Import: paste JSON from clipboard
        document.getElementById('btnModalPasteJson')?.addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                handleImportJson(text, dayNum);
            } catch (_) {
                showToast('⚠️ Não foi possível acessar a área de transferência. Use o arquivo.');
            }
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
            completed: [...completed],
        }, null, 2);
    }

    function handleImport(file, dayNum) {
        importProgress(file, (err, count) => {
            if (err) {
                showToast(`⚠️ ${err}`);
            } else {
                closeBackupModal();
                showToast(`✓ ${count} capítulos restaurados com sucesso!`);
                openDashboard(dayNum);
            }
        });
    }

    function handleImportJson(text, dayNum) {
        try {
            const data = JSON.parse(text);
            if (data.plan !== 'teensplan' || !Array.isArray(data.completed))
                throw new Error('JSON inválido.');
            data.completed.forEach(k => completed.add(k));
            saveCompleted();
            closeBackupModal();
            showToast(`✓ ${data.completed.length} capítulos restaurados com sucesso!`);
            openDashboard(dayNum);
        } catch (err) {
            showToast(`⚠️ ${err.message || 'Erro ao importar JSON.'}`);
        }
    }
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

            <!-- Backup trigger -->
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

        /* events: backup modal trigger */
        document.getElementById('btnTeensBackup')
            ?.addEventListener('click', () => openBackupModal(dayNum));

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
                    saveCompleted();                   // ← persist after toggle
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
                saveCompleted();                       // ← persist after unmark
                openReading(dayNum, chapterIdx);
            } else {
                completed.add(key);
                saveCompleted();                       // ← persist after mark
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