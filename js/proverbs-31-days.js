/**
 * PROVERBS IN 31 DAYS PLAN
 * One chapter per day
 */

(function () {
    'use strict';
    const PLAN_ID = 'proverbs-31-days';
    const DAYS = 31;

    function buildPlan() {
        const proverbs = ALL_BOOKS.find(b => b.id === 'PRO');
        if (!proverbs) return [];
        const plan = [];
        for (let c = 1; c <= proverbs.chapters; c++) {
            plan.push([{ bookId: proverbs.id, bookName: proverbs.name, chapter: c }]);
        }
        return plan;
    }

    const PLAN = buildPlan();
    window.PLAN_PROVERBS_31_DAYS = PLAN;

    function getLang() { return window.state?.lang || 'pt'; }
    function getPlanInfo() { return window.PLANS_REGISTRY?.[PLAN_ID] || { name: { pt: 'Provérbios em 31 Dias' }, tag: { pt: 'SABEDORIA' }, color: '#8b5cf6' }; }
    function loadCompleted() { return window.loadPlanCompleted?.(PLAN_ID) || new Set(); }
    function saveCompleted(set) { window.savePlanCompleted?.(PLAN_ID, set); }
    function loadStartDate() { return window.loadPlanStartDate?.(PLAN_ID); }
    function saveStartDate(date) { window.savePlanStartDate?.(PLAN_ID, date); }
    function formatDate(dayNum) {
        const startDate = loadStartDate(); if (!startDate) return '';
        const d = new Date(startDate); d.setDate(d.getDate() + dayNum - 1);
        const locale = window.langLocale ? window.langLocale(getLang()) : 'pt-BR';
        return d.toLocaleDateString(locale, { day: 'numeric', month: 'long' });
    }
    function todayDay() {
        const startDate = loadStartDate(); if (!startDate) return 1;
        const diff = Math.floor((new Date() - startDate) / 86400000); return Math.max(1, Math.min(diff + 1, DAYS));
    }
    function completedKey(day, bookId, chapter) { return `${PLAN_ID}_${day}-${bookId}-${chapter}`; }

    function launchConfetti() {
        const canvas = document.createElement('canvas');
        Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '9999' });
        canvas.width = window.innerWidth; canvas.height = window.innerHeight; document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d'); const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#f5edd8', '#ffffff'];
        const particles = Array.from({ length: 150 }, () => {
            const angle = Math.random() * Math.PI * 2; const speed = 4 + Math.random() * 10;
            return { x: canvas.width * (0.15 + Math.random() * 0.7), y: canvas.height * (0.3 + Math.random() * 0.35),
                vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - (7 + Math.random() * 7),
                size: 5 + Math.random() * 8, color: COLORS[Math.floor(Math.random() * COLORS.length)],
                rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.28,
                shape: Math.random() < 0.55 ? 'rect' : 'circle', alpha: 1, decay: 0.011 + Math.random() * 0.009 };
        });
        (function tick() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); let alive = 0;
            for (const p of particles) {
                p.x += p.vx; p.y += p.vy; p.vy += 0.34; p.vx *= 0.992; p.rotation += p.rotSpeed; p.alpha -= p.decay;
                if (p.alpha <= 0) continue; alive++;
                ctx.save(); ctx.globalAlpha = p.alpha; ctx.translate(p.x, p.y); ctx.rotate(p.rotation); ctx.fillStyle = p.color;
                if (p.shape === 'rect') ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
                else { ctx.beginPath(); ctx.arc(0, 0, p.size/2, 0, Math.PI*2); ctx.fill(); }
                ctx.restore();
            }
            if (alive > 0) requestAnimationFrame(tick); else canvas.remove();
        })();
    }

    function openWelcomeScreen() {
        const planInfo = getPlanInfo(); const lang = getLang();
        const planName = planInfo.name?.[lang] || planInfo.name?.pt || PLAN_ID;
        const description = planInfo.description?.[lang] || planInfo.description?.pt || 'Leia um capítulo de Provérbios por dia';
        const totalChapters = PLAN.reduce((s, p) => s + p.length, 0);
        let previewRows = ''; for (let d = 1; d <= 5; d++) { const portions = PLAN[d - 1] || []; previewRows += `<div class="daily-preview-row"><span class="daily-preview-day">Dia ${d}</span><span class="daily-preview-text">${portions.map(p => `${p.bookName} ${p.chapter}`).join(', ')}</span></div>`; }
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="daily-wrap fade-in">
                <div class="daily-hero" style="border-color:${planInfo.color}29">
                    <p class="daily-hero-tag">${planInfo.tag?.[lang] || planInfo.tag?.pt || 'SABEDORIA'}</p>
                    <h2 class="daily-hero-title">${planName}</h2>
                    <p class="daily-hero-date">${description}</p>
                    <div class="daily-hero-progress-wrap"><div class="daily-hero-progress-fill" style="width:0%"></div></div>
                    <div class="daily-hero-progress-row"><span class="daily-hero-daycount">0% concluído</span></div>
                </div>
                <div class="daily-welcome-cards">
                    <div class="daily-welcome-card"><div class="daily-welcome-card-icon"><i class="ph ph-calendar"></i></div><div class="daily-welcome-card-val">${DAYS}</div><div class="daily-welcome-card-label">DIAS</div></div>
                    <div class="daily-welcome-card"><div class="daily-welcome-card-icon"><i class="ph ph-book-open"></i></div><div class="daily-welcome-card-val">${totalChapters}</div><div class="daily-welcome-card-label">CAPÍTULOS</div></div>
                    <div class="daily-welcome-card"><div class="daily-welcome-card-icon"><i class="ph ph-bookmarks"></i></div><div class="daily-welcome-card-val">1</div><div class="daily-welcome-card-label">LIVRO</div></div>
                </div>
                <div class="daily-info-card"><p class="daily-info-title"><i class="ph ph-info"></i> COMO FUNCIONA</p><p class="daily-info-text">${description} O progresso é salvo automaticamente.</p></div>
                <p class="daily-section-label">PRÉVIA DO PLANO</p>
                <div class="daily-preview-list">${previewRows}<div class="daily-preview-row" style="justify-content:center;opacity:.35;font-size:.72rem;padding:.55rem .9rem">… e mais ${DAYS - 5} dias</div></div>
                <button class="btn-conclude-daily" id="btnStartPlan"><i class="ph ph-play-circle"></i> INICIAR PLANO</button>
            </div>
        `;
        document.getElementById('btnStartPlan')?.addEventListener('click', () => { const startDate = new Date(); startDate.setHours(0, 0, 0, 0); saveStartDate(startDate); openDashboard(1); });
        window.scrollTo({ top: 0, behavior: 'smooth' }); window.closeSidebar?.();
    }

    function openDashboard(dayNum) {
        const planInfo = getPlanInfo(); const lang = getLang(); const planName = planInfo.name?.[lang] || planInfo.name?.pt || PLAN_ID;
        const totalChapters = PLAN.reduce((s, p) => s + p.length, 0);
        const startDate = loadStartDate(); const completed = loadCompleted(); dayNum = dayNum || todayDay();
        const portions = PLAN[dayNum - 1] || []; const today = todayDay();
        const globalPct = Math.round((completed.size / totalChapters) * 100) || 0;
        const allDone = portions.length > 0 && portions.every(p => completed.has(completedKey(dayNum, p.bookId, p.chapter)));
        const winStart = Math.max(1, dayNum - 5); const winEnd = Math.min(DAYS, winStart + 29);
        let dayCards = ''; for (let d = winStart; d <= winEnd; d++) { const ps = PLAN[d - 1] || []; const isDone = ps.length > 0 && ps.every(p => completed.has(completedKey(d, p.bookId, p.chapter)));
            dayCards += `<button class="daily-day-btn ${d === dayNum ? 'active' : ''} ${isDone ? 'done-d' : ''}" data-day="${d}"><span class="daily-day-num">${d}</span><span class="daily-day-date">${formatDate(d)}</span>${isDone ? '<i class="ph ph-check" style="font-size:.58rem;color:#10b981;margin-top:-2px"></i>' : ''}</button>`; }
        let sc = 'daily-status-future', sl = 'Futuro';
        if (allDone) { sc = 'daily-status-done'; sl = 'Completo'; } else if (dayNum === today) { sc = 'daily-status-today'; sl = 'Hoje'; } else if (dayNum < today) { sc = 'daily-status-late'; sl = 'Atrasado'; }
        let checkItems = ''; portions.forEach((p, idx) => { const key = completedKey(dayNum, p.bookId, p.chapter); const done = completed.has(key);
            checkItems += `<div class="daily-check-item ${done ? 'done-item' : ''}" data-idx="${idx}"><button class="daily-circle-btn" data-idx="${idx}"><i class="ph ph-check-bold"></i></button><span class="daily-chap-name">${p.bookName} ${p.chapter}</span><i class="ph ph-caret-right daily-open-icon" data-idx="${idx}"></i></div>`; });
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="daily-wrap fade-in">
                <div class="daily-hero" style="border-color:${planInfo.color}29">
                    <p class="daily-hero-tag">${planInfo.tag?.[lang] || planInfo.tag?.pt || 'SABEDORIA'}</p>
                    <h2 class="daily-hero-title">${planName}</h2>
                    <p class="daily-hero-date">${formatDate(dayNum)}</p>
                    <div class="daily-hero-progress-wrap"><div class="daily-hero-progress-fill" style="width:${globalPct}%"></div></div>
                    <div class="daily-hero-progress-row"><span class="daily-hero-daycount">Dia ${dayNum} de ${DAYS}</span><span class="daily-hero-pct">${globalPct}%</span></div>
                </div>
                <div class="daily-days-wrap"><div class="daily-days-inner" id="dailyDaysScroller">${dayCards}</div></div>
                <div class="daily-day-header"><div><h3 class="daily-day-title">Dia ${dayNum} <span style="font-weight:400;font-size:1rem;opacity:.35">de ${DAYS}</span></h3><div class="daily-day-subdate">${formatDate(dayNum)}</div></div><span class="daily-status-pill ${sc}">${sl}</span></div>
                <div class="daily-note-card"><i class="ph ph-book daily-note-icon"></i><div><div class="daily-note-label">LEITURA DO DIA</div><div class="daily-note-content">${portions.map(p => `${p.bookName} ${p.chapter}`).join(' · ') || '—'}</div></div></div>
                <div class="daily-checklist" id="dailyChecklist">${checkItems}</div>
                <button class="btn-conclude-daily ${allDone ? 'done' : ''}" id="btnStartDay">${allDone ? '<i class="ph ph-arrow-counter-clockwise"></i> RELER' : '<i class="ph ph-play-circle"></i> COMEÇAR A LER'}</button>
                ${allDone ? '<div class="daily-celebrate"><div class="daily-celebrate-emoji">🎉</div><p class="daily-celebrate-title">Dia ' + dayNum + ' concluído!</p><p class="daily-celebrate-sub">Continue assim!</p></div>' : ''}
                <button class="daily-reset-btn" id="btnResetPlan"><i class="ph ph-arrow-counter-clockwise"></i> RESETAR PLANO</button>
            </div>
        `;
        document.getElementById('btnResetPlan')?.addEventListener('click', () => { if (confirm('Tem certeza que deseja resetar este plano?')) { saveCompleted(new Set()); saveStartDate(null); openWelcomeScreen(); } });
        document.getElementById('dailyDaysScroller')?.querySelectorAll('.daily-day-btn').forEach(btn => btn.addEventListener('click', () => openDashboard(+btn.dataset.day)));
        document.getElementById('dailyChecklist')?.querySelectorAll('.daily-check-item').forEach(item => {
            const idx = +item.dataset.idx; const p = portions[idx]; const key = completedKey(dayNum, p.bookId, p.chapter);
            item.querySelector('.daily-circle-btn')?.addEventListener('click', e => { e.stopPropagation(); completed.has(key) ? completed.delete(key) : completed.add(key); saveCompleted(completed); openDashboard(dayNum); });
            item.querySelector('.daily-chap-name')?.addEventListener('click', () => openReading(dayNum, idx));
            item.querySelector('.daily-open-icon')?.addEventListener('click', () => openReading(dayNum, idx));
        });
        document.getElementById('btnStartDay')?.addEventListener('click', () => { let target = 0; for (let i = 0; i < portions.length; i++) { if (!completed.has(completedKey(dayNum, portions[i].bookId, portions[i].chapter))) { target = i; break; } } openReading(dayNum, target); });
        setTimeout(() => document.querySelector('#dailyDaysScroller .daily-day-btn.active')?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 60);
        window.scrollTo({ top: 0, behavior: 'smooth' }); window.closeSidebar?.();
    }

    async function openReading(dayNum, chapterIdx) {
        const portions = PLAN[dayNum - 1] || []; if (!portions.length) return;
        chapterIdx = Math.max(0, Math.min(chapterIdx, portions.length - 1));
        window.speechSynthesis?.cancel(); if (typeof window.ttsSetPlaying === 'function') window.ttsSetPlaying(false);
        const loader = document.getElementById('loader'); const content = document.getElementById('content'); const errMsg = document.getElementById('error-msg');
        loader?.classList.remove('d-none'); content?.classList.add('d-none'); errMsg?.classList.add('d-none');
        let verses; try { const p = portions[chapterIdx]; verses = await fetchChapter(p.bookId, p.chapter); }
        catch (_) { loader?.classList.add('d-none'); if (errMsg) { errMsg.classList.remove('d-none'); errMsg.innerHTML = '<div style="text-align:center;padding:2rem"><i class="ph ph-warning-circle" style="font-size:2.5rem;opacity:.4"></i><p style="margin-top:1rem">Erro ao carregar.</p><button class="btn-nav" style="margin:auto" onclick="openDashboard(' + dayNum + ')">Voltar</button></div>'; } return; }
        loader?.classList.add('d-none'); content?.classList.remove('d-none'); content.innerHTML = ''; content.className = 'fade-in';
        const p = portions[chapterIdx]; const completed = loadCompleted(); const key = completedKey(dayNum, p.bookId, p.chapter); const isDone = completed.has(key);
        let chapPills = ''; portions.forEach((pp, i) => { const done = completed.has(completedKey(dayNum, pp.bookId, pp.chapter)); chapPills += `<button class="chap-btn ${i === chapterIdx ? 'active' : ''}" data-cidx="${i}" style="${done && i !== chapterIdx ? 'opacity:.4;text-decoration:line-through' : ''}">${pp.chapter}</button>`; });
        const fontSize = window.state?.fontSize ?? 1.1; const verseRows = verses.map(v => '<div class="verse"><span class="verse-num">' + v.verse + '</span><span class="verse-text" style="font-size:' + fontSize + 'rem">' + v.text + '</span></div>').join('');
        content.innerHTML = `
            <button class="daily-back" id="dailyBackBtn"><i class="ph ph-arrow-left"></i> VOLTAR AO PLANO DIA ${dayNum}</button>
            <h1 class="bible-heading">${p.bookName}</h1><div class="bible-subheading">Capítulo ${p.chapter}</div><div class="ornament">✦ ✦ ✦</div>
            <div class="chapter-row">${chapPills}</div><div id="dailyVerses">${verseRows}</div>
            <div class="chap-nav">
                <button class="btn-nav" id="dailyPrev" ${chapterIdx === 0 ? 'disabled' : ''}><i class="ph ph-caret-left"></i> ANT</button>
                <button class="btn-nav btn-daily-mark ${isDone ? 'marked' : ''}" id="dailyDoneBtn"><i class="ph ${isDone ? 'ph-check-circle' : 'ph-circle'}"></i> ${isDone ? 'CONCLUÍDO' : 'CONCLUIR'}</button>
                <button class="btn-nav" id="dailyNext" ${chapterIdx === portions.length - 1 ? 'disabled' : ''}>PRÓX <i class="ph ph-caret-right"></i></button>
            </div>
        `;
        content.querySelectorAll('.verse').forEach(v => v.addEventListener('click', () => v.classList.toggle('highlight')));
        content.querySelectorAll('.chap-btn').forEach(btn => btn.addEventListener('click', () => openReading(dayNum, +btn.dataset.cidx)));
        document.getElementById('dailyBackBtn')?.addEventListener('click', () => openDashboard(dayNum));
        document.getElementById('dailyPrev')?.addEventListener('click', () => { if (chapterIdx > 0) openReading(dayNum, chapterIdx - 1); });
        document.getElementById('dailyNext')?.addEventListener('click', () => { if (chapterIdx < portions.length - 1) openReading(dayNum, chapterIdx + 1); });
        document.getElementById('dailyDoneBtn')?.addEventListener('click', () => {
            if (completed.has(key)) { completed.delete(key); saveCompleted(completed); openReading(dayNum, chapterIdx); }
            else { completed.add(key); saveCompleted(completed); const allNowDone = portions.every(pp => completed.has(completedKey(dayNum, pp.bookId, pp.chapter)));
                if (allNowDone) { launchConfetti(); setTimeout(() => openDashboard(dayNum), 600); } else if (chapterIdx < portions.length - 1) openReading(dayNum, chapterIdx + 1); else openDashboard(dayNum); }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.openProverbs31DaysWelcome = openWelcomeScreen;
    window.openProverbs31DaysDashboard = openDashboard;
    window.openProverbs31DaysReading = openReading;

    function buildSidebar() {
        const container = document.getElementById('dailyBooks') || document.getElementById('teensBooks');
        if (!container) return; if (container.querySelector('#proverbs31DaysBtn')) return;
        const btn = document.createElement('button'); btn.className = 'book-btn'; btn.id = 'proverbs31DaysBtn';
        btn.innerHTML = '<i class="ph ph-lightbulb"></i> Provérbios em 31 Dias';
        btn.addEventListener('click', () => { document.querySelectorAll('.book-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); const startDate = loadStartDate(); if (!startDate) openWelcomeScreen(); else openDashboard(todayDay()); });
        container.appendChild(btn);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildSidebar); else buildSidebar();

})();
