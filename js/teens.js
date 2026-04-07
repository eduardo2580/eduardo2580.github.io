/**
 * PLANO ADOLESCENTES
 * Adapted for New Design
 */

(function () {
    const TEENS_DAYS      = 297;
    const STORAGE_KEY     = 'teensplan_completed_v1';
    const STORAGE_START   = 'teensplan_startdate_v1';

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

    function loadCompleted() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? new Set(JSON.parse(raw)) : new Set();
        } catch (_) { return new Set(); }
    }

    function saveCompleted() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])); } catch (_) {}
    }

    let TEENS_PLAN  = null;
    let teensStart  = loadStartDate();
    const completed = loadCompleted();

    function todayTeensDay() {
        if (!teensStart) return 1;
        const diff = Math.floor((new Date() - teensStart) / 86400000);
        return Math.max(1, Math.min(diff + 1, TEENS_DAYS));
    }

    function completedKey(day, bookId, chapter) { return `${day}-${bookId}-${chapter}`; }

    function openWelcomeScreen() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="fade-in">
                <h1 class="bible-heading">${window.t('title', 'teens')}</h1>
                <div class="ornament">✦ ✦ ✦</div>

                <div class="verse-card-wrapper">
                    <div class="verse-card" style="background: var(--ink); text-align: center;">
                        <div class="verse-header">${window.t('tag', 'teens')}</div>
                        <div class="verse-reference">${window.t('bannerTitle', 'teens').replace('<br>', ' ')}</div>
                        <div class="verse-text" style="font-size: 1rem; opacity: 0.8;">
                            ${window.t('startDesc', 'teens')}
                        </div>
                        <button class="btn-nav" id="btnTeensIniciar" style="width: 100%; justify-content: center; background: var(--gold); color: var(--ink); border: none;">
                            <i class="ph ph-play-circle"></i> ${window.t('startBtn', 'teens')}
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('btnTeensIniciar')?.addEventListener('click', () => {
            teensStart = new Date();
            teensStart.setHours(0, 0, 0, 0);
            saveStartDate(teensStart);
            openDashboard(1);
        });
    }

    function openDashboard(dayNum) {
        if (!TEENS_PLAN) TEENS_PLAN = buildTeensPlan();
        const content = document.getElementById('content');
        const portions = TEENS_PLAN[dayNum - 1] || [];
        const totalChapters = TEENS_PLAN.reduce((s, p) => s + p.length, 0);
        const globalPct = Math.round((completed.size / totalChapters) * 100) || 0;

        content.innerHTML = `
            <div class="fade-in">
                <h1 class="bible-heading">${window.t('title', 'teens')} — Dia ${dayNum}</h1>
                <div class="bible-subheading">${globalPct}% ${window.t('concluded', 'teens')}</div>

                <div style="height: 6px; background: var(--parchment-d); border-radius: 3px; margin: 1rem 1.5rem; overflow: hidden;">
                    <div style="width: ${globalPct}%; height: 100%; background: var(--gold-dark);"></div>
                </div>

                <div class="settings-list">
                    ${portions.map((p, idx) => {
                        const done = completed.has(completedKey(dayNum, p.bookId, p.chapter));
                        return `
                            <div class="settings-item" onclick="window.openTeensReading(${dayNum}, ${idx})">
                                <div class="settings-label" style="${done ? 'text-decoration: line-through; opacity: 0.5' : ''}">
                                    ${p.bookName} ${p.chapter}
                                </div>
                                <i class="ph ${done ? 'ph-check-circle' : 'ph-circle'}"></i>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="chap-nav">
                    <button class="btn-nav" ${dayNum <= 1 ? 'disabled' : ''} onclick="window.openTeensDashboard(${dayNum - 1})">
                        <i class="ph ph-caret-left"></i> ${dayNum - 1}
                    </button>
                    <button class="btn-nav" ${dayNum >= TEENS_DAYS ? 'disabled' : ''} onclick="window.openTeensDashboard(${dayNum + 1})">
                        ${dayNum + 1} <i class="ph ph-caret-right"></i>
                    </button>
                </div>
            </div>
        `;
    }

    async function openReading(dayNum, chapterIdx) {
        if (!TEENS_PLAN) TEENS_PLAN = buildTeensPlan();
        const portions = TEENS_PLAN[dayNum - 1] || [];
        const p = portions[chapterIdx];
        const key = completedKey(dayNum, p.bookId, p.chapter);
        const isDone = completed.has(key);

        const loader = document.getElementById('loader');
        const content = document.getElementById('content');
        loader?.classList.remove('d-none');
        content?.classList.add('d-none');

        try {
            const verses = await fetchChapter(p.bookId, p.chapter);
            loader?.classList.add('d-none');
            content?.classList.remove('d-none');

            content.innerHTML = `
                <div class="fade-in">
                    <button class="btn-nav" style="margin: 1rem 1.5rem" onclick="window.openTeensDashboard(${dayNum})">
                        <i class="ph ph-arrow-left"></i> ${window.t('backToPlan', 'teens')}
                    </button>
                    <h1 class="bible-heading">${p.bookName} ${p.chapter}</h1>
                    <div class="ornament">✦ ✦ ✦</div>
                    <div id="teensVerses">
                        ${verses.map(v => `
                            <div class="verse">
                                <span class="verse-num">${v.verse}</span>
                                <span class="verse-text" style="font-size:${window.state.fontSize}rem">${v.text}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="chap-nav">
                        <button class="btn-nav" id="teensDone" style="width: 100%; justify-content: center; background: ${isDone ? 'var(--parchment-d)' : 'var(--gold)'}; color: var(--ink); border: none;">
                            <i class="ph ${isDone ? 'ph-check-circle' : 'ph-circle'}"></i> ${isDone ? window.t('concluded', 'teens') : window.t('conclude', 'teens')}
                        </button>
                    </div>
                </div>
            `;

            document.getElementById('teensDone').onclick = () => {
                if (completed.has(key)) completed.delete(key); else completed.add(key);
                saveCompleted();
                openReading(dayNum, chapterIdx);
            };
        } catch (e) {
            loader?.classList.add('d-none');
        }
    }

    window.openTeensDashboard = (day) => {
        window.state.currentView = 'plans';
        if (!teensStart) openWelcomeScreen();
        else openDashboard(day || todayTeensDay());
    };
    window.openTeensReading = openReading;
})();
