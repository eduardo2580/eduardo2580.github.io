/**
 * MEMORIZAÇÃO DE VERSÍCULOS — Motor do jogo
 * Oculta palavras progressivamente, acompanha sequência (streak) e versículos dominados.
 * Depende de: js/bible-data.js (texto ARA) — carregar antes deste arquivo.
 */
(function () {

    const STORAGE_KEY = 'bible_memorize_progress_v1';

    /* ════════════════════════ CATÁLOGO DE VERSÍCULOS ═══════════════ */
    const VERSES = [
        { id: 'psa23', bookId: 'PSA', chapter: 23, vStart: 1, vEnd: 6, ref: 'Salmos 23:1-6', title: 'O Senhor é o meu Pastor', icon: 'ph-shield-check' },
        { id: 'jhn316', bookId: 'JHN', chapter: 3, vStart: 16, vEnd: 16, ref: 'João 3:16', title: 'O maior amor', icon: 'ph-heart' },
        { id: 'rom828', bookId: 'ROM', chapter: 8, vStart: 28, vEnd: 28, ref: 'Romanos 8:28', title: 'Todas as coisas cooperam', icon: 'ph-infinity' },
        { id: 'php413', bookId: 'PHP', chapter: 4, vStart: 13, vEnd: 13, ref: 'Filipenses 4:13', title: 'Posso todas as coisas', icon: 'ph-lightning' },
        { id: 'pro35', bookId: 'PRO', chapter: 3, vStart: 5, vEnd: 6, ref: 'Provérbios 3:5-6', title: 'Confia no Senhor', icon: 'ph-compass' },
        { id: 'isa4110', bookId: 'ISA', chapter: 41, vStart: 10, vEnd: 10, ref: 'Isaías 41:10', title: 'Não temas', icon: 'ph-shield' },
        { id: 'jos19', bookId: 'JOS', chapter: 1, vStart: 9, vEnd: 9, ref: 'Josué 1:9', title: 'Sê forte e corajoso', icon: 'ph-flag' },
        { id: 'jer2911', bookId: 'JER', chapter: 29, vStart: 11, vEnd: 11, ref: 'Jeremias 29:11', title: 'Planos de paz', icon: 'ph-map-trifold' },
        { id: 'psa461', bookId: 'PSA', chapter: 46, vStart: 1, vEnd: 1, ref: 'Salmos 46:1', title: 'Refúgio e fortaleza', icon: 'ph-shield-checkered' },
        { id: 'mat633', bookId: 'MAT', chapter: 6, vStart: 33, vEnd: 33, ref: 'Mateus 6:33', title: 'Buscai primeiro', icon: 'ph-target' },
        { id: '2ti17', bookId: '2TI', chapter: 1, vStart: 7, vEnd: 7, ref: '2 Timóteo 1:7', title: 'Espírito de poder', icon: 'ph-fire' },
        { id: 'psa119105', bookId: 'PSA', chapter: 119, vStart: 105, vEnd: 105, ref: 'Salmos 119:105', title: 'Lâmpada para os pés', icon: 'ph-lightbulb-filament' },
    ];

    const STAGE_META = [
        { label: 'Leitura', percent: 0 },
        { label: 'Iniciante', percent: 0.30 },
        { label: 'Intermediário', percent: 0.60 },
        { label: 'Avançado', percent: 0.85 },
        { label: 'Recitação', percent: 1 },
    ];
    const LAST_STAGE = STAGE_META.length - 1;

    /* ════════════════════════ PERSISTÊNCIA ═══════════════════════ */
    function defaultProgress() {
        return { dailyStreak: 0, bestDailyStreak: 0, lastPracticeDate: null, verses: {} };
    }
    function defaultVerseProgress() {
        return { stage: 0, bestStage: 0, mastered: false, bestScore: 0, lastPracticed: null };
    }
    function loadProgress() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultProgress();
            const parsed = Object.assign(defaultProgress(), JSON.parse(raw));
            parsed.verses = parsed.verses || {};
            return parsed;
        } catch (_) { return defaultProgress(); }
    }
    function saveProgress() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (_) { }
    }
    let progress = loadProgress();

    function getVerseProgress(id) {
        if (!progress.verses[id]) progress.verses[id] = defaultVerseProgress();
        return progress.verses[id];
    }

    /* ════════════════════════ HELPERS ═════════════════════════════ */
    function todayStr() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
    function yesterdayStr() {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
    function recordPracticeDay() {
        const today = todayStr();
        if (progress.lastPracticeDate === today) return;
        progress.dailyStreak = (progress.lastPracticeDate === yesterdayStr()) ? progress.dailyStreak + 1 : 1;
        progress.lastPracticeDate = today;
        if (progress.dailyStreak > progress.bestDailyStreak) progress.bestDailyStreak = progress.dailyStreak;
        saveProgress();
    }
    function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
    function normalizeWord(w) { return w.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ''); }
    function isHideable(tok) { return /\p{L}/u.test(tok); }
    function tokenize(text) { return text.split(/(\s+)/).filter(t => t.length > 0); }

    function hashString(s) {
        let h = 0;
        for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
        return h >>> 0;
    }
    function mulberry32(seed) {
        return function () {
            seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
    function shuffledOrder(seedKey, n) {
        const rnd = mulberry32(hashString(seedKey));
        const arr = Array.from({ length: n }, (_, i) => i);
        for (let i = n - 1; i > 0; i--) {
            const j = Math.floor(rnd() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    /* ════════════════════ MODELO DE TEXTO (cache) ══════════════════ */
    const modelCache = {};
    function buildPassage(entry) {
        const key = `${entry.bookId}_${entry.chapter}`;
        const chapterData = (window.BIBLE_DATA && window.BIBLE_DATA[key])
            || (window.BIBLE_DATA_ACF && window.BIBLE_DATA_ACF[key])
            || (window.BIBLE_DATA_NVI && window.BIBLE_DATA_NVI[key])
            || [];
        return chapterData.filter(v => v.verse >= entry.vStart && v.verse <= entry.vEnd);
    }
    function buildTokenModel(entry) {
        const verses = buildPassage(entry);
        let globalIdx = 0;
        const origWords = [];
        const model = verses.map(v => {
            const tokens = tokenize(v.text).map(tok => {
                const hideable = isHideable(tok);
                let idx = null;
                if (hideable) {
                    idx = globalIdx++;
                    origWords.push({ idx, raw: tok, norm: normalizeWord(tok) });
                }
                return { text: tok, hideable, idx };
            });
            return { verse: v.verse, tokens };
        });
        return { model, totalHideable: globalIdx, origWords };
    }
    function getModel(entry) {
        if (!modelCache[entry.id]) modelCache[entry.id] = buildTokenModel(entry);
        return modelCache[entry.id];
    }
    function hiddenSetFor(entry, stage) {
        const { totalHideable } = getModel(entry);
        const count = Math.round(totalHideable * STAGE_META[stage].percent);
        const order = shuffledOrder(entry.id, totalHideable);
        return new Set(order.slice(0, count));
    }

    /* ════════════════════════ LCS (comparação de recitação) ═══════ */
    function lcsMatch(a, b) {
        const n = a.length, m = b.length;
        if (!n || !m) return { matched: new Set() };
        const dp = new Array(n + 1);
        for (let i = 0; i <= n; i++) dp[i] = new Uint16Array(m + 1);
        for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= m; j++) {
                dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        let i = n, j = m; const matched = new Set();
        while (i > 0 && j > 0) {
            if (a[i - 1] === b[j - 1]) { matched.add(i - 1); i--; j--; }
            else if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j--;
        }
        return { matched };
    }

    /* ════════════════════════ ESTADO DE UI (não persistido) ═══════ */
    const ui = { currentEntry: null, revealedWords: new Set() };

    /* ════════════════════════ CONTAINER ═══════════════════════════ */
    function content() { return document.getElementById('content'); }
    function mount(html) { content().innerHTML = `<div class="mem-app fade-in">${html}</div>`; window.scrollTo({ top: 0, behavior: 'smooth' }); }

    /* ════════════════════════ DASHBOARD ═══════════════════════════ */
    function renderDashboard() {
        ui.currentEntry = null;
        const total = VERSES.length;
        const mastered = VERSES.filter(v => getVerseProgress(v.id).mastered).length;
        const overallPct = Math.round(VERSES.reduce((sum, v) => sum + (getVerseProgress(v.id).bestStage / LAST_STAGE), 0) / total * 100);
        const anyProgress = VERSES.some(v => getVerseProgress(v.id).bestStage > 0);

        const tilesHtml = VERSES.map(v => {
            const p = getVerseProgress(v.id);
            const pct = Math.round((p.bestStage / LAST_STAGE) * 100);
            const dots = STAGE_META.map((s, i) => `<span class="mem-mini-dot ${i <= p.bestStage ? 'filled' : ''}"></span>`).join('');
            return `
                <div class="mem-verse-tile ${p.mastered ? 'mastered' : ''}" onclick="MemorizeApp.openVerse('${v.id}')">
                    <div class="mem-tile-icon"><i class="ph ${v.icon}"></i></div>
                    <div class="mem-tile-body">
                        <div class="mem-tile-ref">${v.ref}</div>
                        <div class="mem-tile-title">${escapeHtml(v.title)}</div>
                        <div class="mem-tile-dots">${dots}</div>
                    </div>
                    <div class="mem-tile-status">${p.mastered ? '<i class="ph ph-trophy"></i>' : pct + '%'}</div>
                </div>`;
        }).join('');

        mount(`
            <div class="mem-header">
                <div class="ornament">✦</div>
                <h1 class="bible-heading">Memorização</h1>
                <p class="mem-tagline">Esconda as palavras aos poucos. Guarde a Palavra no coração.</p>
            </div>

            <div class="mem-stats-row">
                <div class="mem-stat-chip"><i class="ph ph-chart-line"></i><span>${overallPct}%</span><small>Progresso</small></div>
                <div class="mem-stat-chip"><i class="ph ph-fire"></i><span>${progress.dailyStreak}</span><small>Sequência</small></div>
                <div class="mem-stat-chip"><i class="ph ph-trophy"></i><span>${mastered}/${total}</span><small>Dominados</small></div>
            </div>

            <div class="quiz-section-title">Escolha um Versículo</div>
            <div class="mem-tile-list">${tilesHtml}</div>

            ${anyProgress ? '<button class="quiz-danger-btn" onclick="MemorizeApp.resetProgress()"><i class="ph ph-trash"></i> Reiniciar Progresso</button>' : ''}
        `);
    }

    /* ════════════════════════ TELA DE PRÁTICA ═════════════════════ */
    function renderPractice(entryId) {
        const entry = VERSES.find(v => v.id === entryId);
        if (!entry) { renderDashboard(); return; }
        ui.currentEntry = entryId;
        const p = getVerseProgress(entryId);
        const stage = p.stage;
        const { model } = getModel(entry);
        const hiddenSet = hiddenSetFor(entry, stage);

        const versesHtml = model.map(vm => {
            const tokensHtml = vm.tokens.map(tok => {
                if (!tok.hideable) return escapeHtml(tok.text);
                const isHidden = hiddenSet.has(tok.idx) && !ui.revealedWords.has(tok.idx);
                if (isHidden) {
                    const blankLen = Math.max(3, Math.min(tok.text.length, 8));
                    return `<span class="mem-blank" onclick="MemorizeApp.reveal(${tok.idx})" title="Toque para revelar">${'\u00A0'.repeat(blankLen)}</span>`;
                }
                const wasHidden = hiddenSet.has(tok.idx);
                return `<span class="mem-word${wasHidden ? ' mem-word-revealed' : ''}">${escapeHtml(tok.text)}</span>`;
            }).join('');
            return `<div class="verse mem-verse"><span class="verse-num">${vm.verse}</span><span class="verse-text mem-verse-text">${tokensHtml}</span></div>`;
        }).join('');

        const dotsHtml = STAGE_META.map((s, i) => `<span class="mem-stage-dot ${i <= stage ? 'filled' : ''} ${i === stage ? 'current' : ''}"></span>`).join('');
        const isFinalStage = stage === LAST_STAGE;
        const peeking = ui.revealedWords.size > 0;

        mount(`
            <button class="quiz-back-btn" onclick="MemorizeApp.goHome()"><i class="ph ph-arrow-left"></i> Voltar</button>

            <div class="mem-practice-header">
                <div class="mem-ref">${entry.ref}</div>
                <div class="mem-title">${escapeHtml(entry.title)}</div>
            </div>

            <div class="mem-stage-row">
                <div class="mem-stage-dots">${dotsHtml}</div>
                <div class="mem-stage-label">${STAGE_META[stage].label} · ${Math.round(STAGE_META[stage].percent * 100)}% oculto</div>
            </div>

            <div class="mem-verse-card">${versesHtml}</div>

            ${isFinalStage ? renderRecitationPanel(entry, p) : ''}

            <div class="mem-controls">
                <button class="mem-btn mem-btn-ghost" ${stage === 0 ? 'disabled' : ''} onclick="MemorizeApp.prevStage()"><i class="ph ph-caret-left"></i> Facilitar</button>
                <button class="mem-btn mem-btn-ghost" onclick="MemorizeApp.peek()"><i class="ph ${peeking ? 'ph-eye-slash' : 'ph-eye'}"></i> ${peeking ? 'Ocultar' : 'Ver tudo'}</button>
                <button class="mem-btn mem-btn-primary" ${stage === LAST_STAGE ? 'disabled' : ''} onclick="MemorizeApp.nextStage()">Avançar <i class="ph ph-caret-right"></i></button>
            </div>
        `);
    }

    function renderRecitationPanel(entry, p) {
        return `
            <div class="mem-recite-panel">
                <div class="mem-recite-title"><i class="ph ph-microphone"></i> Teste de Recitação</div>
                <p class="mem-recite-desc">Digite o versículo de memória e veja quanto você acertou.</p>
                <textarea id="mem-recite-input" class="mem-recite-textarea" placeholder="Digite aqui o que você lembra..."></textarea>
                <button class="mem-btn mem-btn-primary" style="width:100%" onclick="MemorizeApp.checkRecitation('${entry.id}')"><i class="ph ph-check-circle"></i> Verificar</button>
                ${p.bestScore ? `<div class="mem-recite-best">Melhor pontuação até agora: ${p.bestScore}%</div>` : ''}
                <div id="mem-recite-result"></div>
            </div>
        `;
    }

    function checkRecitation(entryId) {
        const entry = VERSES.find(v => v.id === entryId);
        const input = document.getElementById('mem-recite-input');
        if (!entry || !input) return;
        const { model, origWords } = getModel(entry);
        const origNorms = origWords.map(w => w.norm);
        const typedNorms = input.value.split(/\s+/).map(normalizeWord).filter(Boolean);
        const { matched } = lcsMatch(origNorms, typedNorms);
        const score = origNorms.length ? Math.round((matched.size / origNorms.length) * 100) : 0;

        const p = getVerseProgress(entryId);
        if (score > p.bestScore) p.bestScore = score;
        let masteredNow = false;
        if (score >= 90 && !p.mastered) { p.mastered = true; masteredNow = true; }
        p.lastPracticed = todayStr();
        recordPracticeDay();
        saveProgress();

        const highlightHtml = model.map(vm => {
            const tokensHtml = vm.tokens.map(tok => {
                if (!tok.hideable) return escapeHtml(tok.text);
                const ok = matched.has(tok.idx);
                return `<span class="${ok ? 'mem-recall-correct' : 'mem-recall-missed'}">${escapeHtml(tok.text)}</span>`;
            }).join('');
            return `<div class="verse mem-verse"><span class="verse-num">${vm.verse}</span><span class="verse-text mem-verse-text">${tokensHtml}</span></div>`;
        }).join('');

        const tier = score >= 90 ? 'good' : score >= 60 ? 'ok' : 'low';
        let statusHtml;
        if (masteredNow) statusHtml = '<div class="mem-recite-mastered"><i class="ph ph-trophy"></i> Versículo dominado! 🎉</div>';
        else if (score >= 90) statusHtml = '<div class="mem-recite-mastered"><i class="ph ph-trophy"></i> Domínio confirmado!</div>';
        else statusHtml = '<div class="mem-recite-hint">Continue praticando — releia o versículo e tente novamente.</div>';

        const resultEl = document.getElementById('mem-recite-result');
        if (resultEl) {
            resultEl.innerHTML = `
                <div class="mem-recite-score ${tier}">${score}% de acerto</div>
                ${statusHtml}
                <div class="mem-recall-review">${highlightHtml}</div>
            `;
        }
    }

    /* ════════════════════════ NAVEGAÇÃO PÚBLICA ═══════════════════ */
    function openVerse(id) {
        ui.revealedWords = new Set();
        const p = getVerseProgress(id);
        if (p.stage === 0 && p.bestStage > 0) p.stage = p.bestStage;
        recordPracticeDay();
        saveProgress();
        renderPractice(id);
    }
    function goHome() { renderDashboard(); }
    function nextStage() {
        const p = getVerseProgress(ui.currentEntry);
        if (p.stage < LAST_STAGE) {
            p.stage++;
            if (p.stage > p.bestStage) p.bestStage = p.stage;
            ui.revealedWords = new Set();
            saveProgress();
            renderPractice(ui.currentEntry);
        }
    }
    function prevStage() {
        const p = getVerseProgress(ui.currentEntry);
        if (p.stage > 0) {
            p.stage--;
            ui.revealedWords = new Set();
            saveProgress();
            renderPractice(ui.currentEntry);
        }
    }
    function peek() {
        const entry = VERSES.find(v => v.id === ui.currentEntry);
        if (!entry) return;
        const { totalHideable } = getModel(entry);
        if (ui.revealedWords.size < totalHideable) {
            for (let i = 0; i < totalHideable; i++) ui.revealedWords.add(i);
        } else {
            ui.revealedWords = new Set();
        }
        renderPractice(ui.currentEntry);
    }
    function reveal(idx) {
        ui.revealedWords.add(idx);
        renderPractice(ui.currentEntry);
    }
    function resetProgress() {
        if (confirm('Isso apagará seu progresso, sequência e versículos dominados na memorização. Deseja continuar?')) {
            progress = defaultProgress();
            saveProgress();
            renderDashboard();
        }
    }

    window.openMemorizeDashboard = function () { renderDashboard(); };
    window.MemorizeApp = {
        openVerse, goHome, nextStage, prevStage, peek, reveal, checkRecitation, resetProgress,
    };

})();
