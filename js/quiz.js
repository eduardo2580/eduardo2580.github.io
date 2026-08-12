/**
 * QUIZ BÍBLICO — Motor do jogo
 * Modos, categorias, XP, streaks, conquistas, níveis e estatísticas.
 * Depende de: js/quiz-data.js (dados) — carregar antes deste arquivo.
 */
(function () {

    const STORAGE_KEY = 'bible_quiz_progress_v1';

    /* ════════════════════════ PERSISTÊNCIA ═══════════════════════ */
    function defaultProgress() {
        return {
            xp: 0,
            totalQuizzes: 0,
            totalCorrect: 0,
            totalAnswered: 0,
            hasPerfect: false,
            hasExpertPerfect: false,
            dailyStreak: 0,
            bestDailyStreak: 0,
            lastDailyDate: null,
            categoryStats: {},
            unlockedAchievements: [],
        };
    }

    function loadProgress() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultProgress();
            return Object.assign(defaultProgress(), JSON.parse(raw));
        } catch (_) { return defaultProgress(); }
    }

    function saveProgress() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (_) { }
    }

    let progress = loadProgress();

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
    function dateSeed() {
        const d = new Date();
        return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    }
    function shuffleRandom(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    function seededShuffle(arr, seed) {
        const a = arr.slice();
        let s = seed >>> 0;
        function rnd() { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(rnd() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    function getLevelInfo(xp) {
        let level = 1, prevThreshold = 0, threshold = 50;
        while (xp >= threshold) {
            level++;
            prevThreshold = threshold;
            threshold = 50 * level * level;
        }
        const titles = window.QUIZ_LEVEL_TITLES || [];
        const title = titles[Math.min(level - 1, titles.length - 1)] || 'Discípulo da Palavra';
        return {
            level, title,
            currentLevelXp: xp - prevThreshold,
            neededForNext: threshold - prevThreshold,
            progressPct: Math.min(100, Math.round(((xp - prevThreshold) / (threshold - prevThreshold)) * 100)),
        };
    }
    function catMeta(id) { return (window.QUIZ_CATEGORIES || []).find(c => c.id === id); }
    function diffMeta(id) { return (window.QUIZ_DIFFICULTIES || []).find(d => d.id === id); }
    function accuracy(correct, answered) { return answered ? Math.round((correct / answered) * 100) : 0; }
    function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

    /* ════════════════════════ CONQUISTAS ═══════════════════════════ */
    const ACHIEVEMENT_CHECKS = {
        first_quiz: p => p.totalQuizzes >= 1,
        ten_quiz: p => p.totalQuizzes >= 10,
        fifty_quiz: p => p.totalQuizzes >= 50,
        fifty_correct: p => p.totalCorrect >= 50,
        hundred_correct: p => p.totalCorrect >= 100,
        perfect: p => p.hasPerfect,
        expert_perfect: p => p.hasExpertPerfect,
        streak3: p => p.dailyStreak >= 3,
        streak7: p => p.dailyStreak >= 7,
        streak30: p => p.dailyStreak >= 30,
        explorer: p => Object.keys(p.categoryStats || {}).length >= 8,
        level5: p => getLevelInfo(p.xp).level >= 5,
        level10: p => getLevelInfo(p.xp).level >= 10,
        mastery_bible: p => (p.categoryStats.bible?.correct || 0) >= 20,
        mastery_people: p => (p.categoryStats.people?.correct || 0) >= 20,
        mastery_places: p => (p.categoryStats.places?.correct || 0) >= 20,
        mastery_books: p => (p.categoryStats.books?.correct || 0) >= 20,
        mastery_jesus: p => (p.categoryStats.jesus?.correct || 0) >= 20,
        mastery_prophecy: p => (p.categoryStats.prophecy?.correct || 0) >= 20,
        mastery_theology: p => (p.categoryStats.theology?.correct || 0) >= 20,
        mastery_history: p => (p.categoryStats.history?.correct || 0) >= 20,
    };
    function evaluateAchievements() {
        const newly = [];
        (window.QUIZ_ACHIEVEMENTS || []).forEach(a => {
            if (!progress.unlockedAchievements.includes(a.id) && ACHIEVEMENT_CHECKS[a.id] && ACHIEVEMENT_CHECKS[a.id](progress)) {
                progress.unlockedAchievements.push(a.id);
                newly.push(a);
            }
        });
        return newly;
    }

    /* ════════════════════════ ESTADO DE UI (não persistido) ═══════ */
    const ui = { selectedMode: 1, selectedCategory: 'all' };
    let session = null;

    /* ════════════════════════ CONTAINER ═══════════════════════════ */
    function content() { return document.getElementById('content'); }
    function mount(html) { content().innerHTML = `<div class="quiz-app fade-in">${html}</div>`; window.scrollTo({ top: 0, behavior: 'smooth' }); }

    /* ════════════════════════ DASHBOARD ════════════════════════════ */
    function renderDashboard() {
        const lvl = getLevelInfo(progress.xp);
        const doneToday = progress.lastDailyDate === todayStr();
        const acc = accuracy(progress.totalCorrect, progress.totalAnswered);
        const unlockedCount = progress.unlockedAchievements.length;
        const totalAchv = (window.QUIZ_ACHIEVEMENTS || []).length;

        const categoriesHtml = (window.QUIZ_CATEGORIES || []).map(c => {
            const cs = progress.categoryStats[c.id];
            const pct = cs ? accuracy(cs.correct, cs.answered) : null;
            return `
                <div class="quiz-category-card" onclick="QuizApp.openCategory('${c.id}')">
                    <div class="quiz-cat-icon">${c.icon}</div>
                    <div class="quiz-cat-name">${c.name}</div>
                    <div class="quiz-cat-pct">${pct === null ? 'Não jogado' : pct + '% de acerto'}</div>
                </div>`;
        }).join('');

        const achvPreview = (window.QUIZ_ACHIEVEMENTS || []).slice(0, 8).map(a => {
            const unlocked = progress.unlockedAchievements.includes(a.id);
            return `
                <div class="quiz-achv-badge ${unlocked ? 'unlocked' : 'locked'}" title="${escapeHtml(a.name)}">
                    <i class="ph ${unlocked ? a.icon : 'ph-lock-simple'}"></i>
                </div>`;
        }).join('');

        mount(`
            <div class="quiz-header">
                <div class="ornament">✦</div>
                <h1 class="bible-heading">Quiz Bíblico</h1>
                <p class="quiz-tagline">Aprenda brincando. Cresça na Palavra.</p>
            </div>

            <div class="quiz-level-card">
                <div class="quiz-level-top">
                    <div class="quiz-level-badge"><i class="ph ph-crown"></i> Nível ${lvl.level}</div>
                    <div class="quiz-streak-chip"><i class="ph ph-fire"></i> ${progress.dailyStreak} dia${progress.dailyStreak === 1 ? '' : 's'}</div>
                </div>
                <div class="quiz-level-title">${lvl.title}</div>
                <div class="quiz-xp-bar"><div class="quiz-xp-fill" style="width:${lvl.progressPct}%"></div></div>
                <div class="quiz-xp-caption">${lvl.currentLevelXp} / ${lvl.neededForNext} XP para o próximo nível</div>
            </div>

            <div class="quiz-daily-card ${doneToday ? 'done' : ''}" onclick="${doneToday ? '' : "QuizApp.startDaily()"}">
                <div class="quiz-daily-left">
                    <i class="ph ${doneToday ? 'ph-check-circle' : 'ph-sun'}"></i>
                </div>
                <div class="quiz-daily-body">
                    <div class="quiz-daily-title">Quiz do Dia</div>
                    <div class="quiz-daily-desc">${doneToday ? 'Concluído! Volte amanhã para manter sua sequência 🔥' : '10 perguntas variadas · +25 XP de bônus'}</div>
                </div>
                ${doneToday ? '' : '<i class="ph ph-caret-right quiz-daily-arrow"></i>'}
            </div>

            <div class="quiz-stats-row">
                <div class="quiz-stat-chip"><i class="ph ph-target"></i><span>${acc}%</span><small>Precisão</small></div>
                <div class="quiz-stat-chip"><i class="ph ph-check-circle"></i><span>${progress.totalCorrect}</span><small>Acertos</small></div>
                <div class="quiz-stat-chip"><i class="ph ph-medal"></i><span>${unlockedCount}/${totalAchv}</span><small>Conquistas</small></div>
            </div>

            <button class="quiz-primary-btn" onclick="QuizApp.goToSelect()"><i class="ph ph-play"></i> Jogar Quiz</button>

            <div class="quiz-section-title">Categorias</div>
            <div class="quiz-categories-grid">${categoriesHtml}</div>

            <div class="quiz-section-title-row">
                <div class="quiz-section-title">Conquistas</div>
                <button class="quiz-link-btn" onclick="QuizApp.goToStats()">Ver estatísticas <i class="ph ph-arrow-right"></i></button>
            </div>
            <div class="quiz-achv-preview">${achvPreview}</div>
        `);
    }

    /* ════════════════════════ SELEÇÃO DE MODO/CATEGORIA ═══════════ */
    function renderSelect() {
        const modesHtml = (window.QUIZ_DIFFICULTIES || []).map(d => `
            <div class="quiz-mode-card ${ui.selectedMode === d.id ? 'active' : ''}" onclick="QuizApp.setMode(${d.id})">
                <i class="ph ${d.icon}"></i>
                <div class="quiz-mode-name">${d.name}</div>
                <div class="quiz-mode-xp">+${d.xp} XP/acerto</div>
            </div>`).join('');

        const catsHtml = ['all', ...(window.QUIZ_CATEGORIES || []).map(c => c.id)].map(id => {
            const isAll = id === 'all';
            const meta = isAll ? { icon: '📚', name: 'Todas as Categorias' } : catMeta(id);
            return `
                <div class="quiz-cat-pick ${ui.selectedCategory === id ? 'active' : ''}" onclick="QuizApp.setCategory('${id}')">
                    <span class="quiz-cat-pick-icon">${meta.icon}</span>
                    <span class="quiz-cat-pick-name">${meta.name}</span>
                </div>`;
        }).join('');

        const pool = (window.QUIZ_QUESTIONS || []).filter(q => q.diff === ui.selectedMode && (ui.selectedCategory === 'all' || q.cat === ui.selectedCategory));
        const qCount = Math.min(10, pool.length);

        mount(`
            <button class="quiz-back-btn" onclick="QuizApp.goHome()"><i class="ph ph-arrow-left"></i> Voltar</button>
            <h2 class="bible-heading">Escolha o Desafio</h2>

            <div class="quiz-section-title">Dificuldade</div>
            <div class="quiz-mode-grid">${modesHtml}</div>

            <div class="quiz-section-title">Categoria</div>
            <div class="quiz-cat-grid">${catsHtml}</div>

            <div class="quiz-pool-info">${qCount > 0 ? `${qCount} pergunta${qCount === 1 ? '' : 's'} nesta combinação` : 'Sem perguntas suficientes — tente "Todas as Categorias"'}</div>

            <button class="quiz-primary-btn" ${qCount === 0 ? 'disabled' : ''} onclick="QuizApp.startQuiz()"><i class="ph ph-play"></i> Começar Quiz</button>
        `);
    }

    /* ════════════════════════ JOGO ═════════════════════════════════ */
    function buildDisplayOpts(q) {
        const opts = q.opts.map((text, i) => ({ text, correct: i === 0 }));
        return shuffleRandom(opts);
    }

    function startQuiz() {
        const filtered = (window.QUIZ_QUESTIONS || []).filter(q => q.diff === ui.selectedMode && (ui.selectedCategory === 'all' || q.cat === ui.selectedCategory));
        const pool = shuffleRandom(filtered).slice(0, Math.min(10, filtered.length));
        if (!pool.length) return;
        session = {
            isDaily: false,
            mode: ui.selectedMode,
            category: ui.selectedCategory,
            questions: pool.map(q => ({ ...q, displayOpts: buildDisplayOpts(q) })),
            currentIndex: 0, answers: [], combo: 0, xpEarned: 0, answered: false,
        };
        renderPlay();
    }

    function startDaily() {
        if (progress.lastDailyDate === todayStr()) return;
        const pool = seededShuffle(window.QUIZ_QUESTIONS || [], dateSeed()).slice(0, 10);
        session = {
            isDaily: true,
            mode: null,
            category: 'all',
            questions: pool.map(q => ({ ...q, displayOpts: buildDisplayOpts(q) })),
            currentIndex: 0, answers: [], combo: 0, xpEarned: 0, answered: false,
        };
        renderPlay();
    }

    function renderPlay() {
        const total = session.questions.length;
        const idx = session.currentIndex;
        const q = session.questions[idx];
        const dMeta = diffMeta(q.diff);
        const cMeta = catMeta(q.cat);
        const progressPct = Math.round((idx / total) * 100);

        const optionsHtml = q.displayOpts.map((opt, i) => {
            let cls = '';
            if (session.answered) {
                if (opt.correct) cls = 'correct';
                else if (session.chosenIndex === i) cls = 'wrong';
                else cls = 'disabled';
            }
            return `<button class="quiz-option-btn ${cls}" ${session.answered ? 'disabled' : ''} onclick="QuizApp.selectAnswer(${i})">
                        <span>${escapeHtml(opt.text)}</span>
                        ${session.answered && opt.correct ? '<i class="ph ph-check-circle"></i>' : ''}
                        ${session.answered && cls === 'wrong' ? '<i class="ph ph-x-circle"></i>' : ''}
                    </button>`;
        }).join('');

        const feedbackHtml = session.answered ? `
            <div class="quiz-feedback ${session.answers[idx].correct ? 'correct' : 'wrong'}">
                <div class="quiz-feedback-head">
                    <i class="ph ${session.answers[idx].correct ? 'ph-check-circle' : 'ph-x-circle'}"></i>
                    ${session.answers[idx].correct ? 'Correto!' : 'Não foi dessa vez'}
                </div>
                <div class="quiz-feedback-note">${escapeHtml(q.note)}</div>
            </div>
            <button class="quiz-primary-btn" onclick="QuizApp.nextQuestion()">
                ${idx + 1 < total ? 'Próxima Pergunta' : 'Ver Resultado'} <i class="ph ph-arrow-right"></i>
            </button>
        ` : '';

        mount(`
            <div class="quiz-play-top">
                <button class="quiz-back-btn" onclick="QuizApp.confirmExit()"><i class="ph ph-x"></i></button>
                <div class="quiz-play-meta">
                    <span>${cMeta ? cMeta.icon + ' ' + cMeta.name : 'Quiz do Dia'}</span>
                    <span class="quiz-diff-chip">${dMeta ? dMeta.name : ''}</span>
                </div>
                <div class="quiz-combo ${session.combo > 1 ? 'active' : ''}"><i class="ph ph-fire"></i> ${session.combo}</div>
            </div>
            <div class="quiz-progressbar"><div class="quiz-progressbar-fill" style="width:${progressPct}%"></div></div>
            <div class="quiz-question-counter">Pergunta ${idx + 1} de ${total}</div>

            <div class="quiz-question-card">${escapeHtml(q.q)}</div>
            <div class="quiz-options">${optionsHtml}</div>
            ${feedbackHtml}
        `);
    }

    function selectAnswer(i) {
        if (session.answered) return;
        const q = session.questions[session.currentIndex];
        const chosen = q.displayOpts[i];
        session.answered = true;
        session.chosenIndex = i;
        session.answers[session.currentIndex] = { correct: chosen.correct };
        if (chosen.correct) {
            session.combo++;
            const base = diffMeta(q.diff).xp;
            const comboBonus = Math.min(session.combo - 1, 5) * 2;
            session.xpEarned += base + comboBonus;
        } else {
            session.combo = 0;
        }
        renderPlay();
    }

    function nextQuestion() {
        session.currentIndex++;
        session.answered = false;
        session.chosenIndex = null;
        if (session.currentIndex >= session.questions.length) {
            finishQuiz();
        } else {
            renderPlay();
        }
    }

    function confirmExit() {
        if (confirm('Deseja sair do quiz? Seu progresso nesta rodada será perdido.')) {
            session = null;
            renderDashboard();
        }
    }

    /* ════════════════════════ RESULTADO ════════════════════════════ */
    function finishQuiz() {
        const total = session.questions.length;
        const correctCount = session.answers.filter(a => a && a.correct).length;

        progress.totalQuizzes++;
        progress.totalAnswered += total;
        progress.totalCorrect += correctCount;
        session.questions.forEach((q, i) => {
            const cs = progress.categoryStats[q.cat] || { answered: 0, correct: 0 };
            cs.answered++;
            if (session.answers[i] && session.answers[i].correct) cs.correct++;
            progress.categoryStats[q.cat] = cs;
        });
        if (correctCount === total) progress.hasPerfect = true;
        if (correctCount === total && session.mode === 4) progress.hasExpertPerfect = true;

        let bonus = 0;
        if (session.isDaily) {
            if (progress.lastDailyDate === yesterdayStr()) {
                progress.dailyStreak += 1;
            } else {
                progress.dailyStreak = 1;
            }
            progress.lastDailyDate = todayStr();
            if (progress.dailyStreak > progress.bestDailyStreak) progress.bestDailyStreak = progress.dailyStreak;
            bonus = 25;
        }

        const totalXpGain = session.xpEarned + bonus;
        const levelBefore = getLevelInfo(progress.xp).level;
        progress.xp += totalXpGain;
        const levelAfter = getLevelInfo(progress.xp).level;

        session.finalCorrect = correctCount;
        session.finalTotal = total;
        session.totalXpGain = totalXpGain;
        session.leveledUp = levelAfter > levelBefore;
        session.newLevel = levelAfter;
        session.newAchievements = evaluateAchievements();

        saveProgress();
        renderResults();
    }

    function renderResults() {
        const pct = Math.round((session.finalCorrect / session.finalTotal) * 100);
        const verse = window.QUIZ_ENCOURAGEMENT[Math.floor(Math.random() * window.QUIZ_ENCOURAGEMENT.length)];

        const achvHtml = session.newAchievements.length ? `
            <div class="quiz-section-title">Novas Conquistas!</div>
            <div class="quiz-achv-unlocked-list">
                ${session.newAchievements.map(a => `
                    <div class="quiz-achv-row unlocked">
                        <i class="ph ${a.icon}"></i>
                        <div><div class="quiz-achv-row-name">${escapeHtml(a.name)}</div><div class="quiz-achv-row-desc">${escapeHtml(a.desc)}</div></div>
                    </div>`).join('')}
            </div>` : '';

        mount(`
            <div class="quiz-results">
                <div class="quiz-score-circle ${pct === 100 ? 'perfect' : ''}">
                    <div class="quiz-score-num">${session.finalCorrect}/${session.finalTotal}</div>
                    <div class="quiz-score-pct">${pct}%</div>
                </div>
                <div class="quiz-results-headline">${pct === 100 ? 'Perfeito! 🎉' : pct >= 70 ? 'Muito bem!' : pct >= 40 ? 'Bom esforço!' : 'Continue estudando!'}</div>

                <div class="quiz-results-xp"><i class="ph ph-lightning"></i> +${session.totalXpGain} XP ${session.isDaily ? '(inclui bônus diário)' : ''}</div>

                ${session.leveledUp ? `<div class="quiz-levelup-banner"><i class="ph ph-crown"></i> Você subiu para o Nível ${session.newLevel}!</div>` : ''}

                ${achvHtml}

                <div class="quiz-verse-card">
                    <div class="quiz-verse-label">Para meditar</div>
                    <div class="quiz-verse-text">"${escapeHtml(verse.text)}"</div>
                    <div class="quiz-verse-ref">${verse.ref}</div>
                </div>

                <div class="quiz-results-actions">
                    <button class="quiz-primary-btn" onclick="QuizApp.goToSelect()"><i class="ph ph-arrow-clockwise"></i> Jogar Novamente</button>
                    <button class="quiz-secondary-btn" onclick="QuizApp.goToStats()"><i class="ph ph-chart-bar"></i> Estatísticas</button>
                    <button class="quiz-secondary-btn" onclick="QuizApp.goHome()"><i class="ph ph-house"></i> Início</button>
                </div>
            </div>
        `);
    }

    /* ════════════════════════ ESTATÍSTICAS ═════════════════════════ */
    function renderStats() {
        const lvl = getLevelInfo(progress.xp);
        const acc = accuracy(progress.totalCorrect, progress.totalAnswered);

        const masteryHtml = (window.QUIZ_CATEGORIES || []).map(c => {
            const cs = progress.categoryStats[c.id] || { answered: 0, correct: 0 };
            const pct = accuracy(cs.correct, cs.answered);
            return `
                <div class="quiz-mastery-row">
                    <div class="quiz-mastery-label">${c.icon} ${c.name}</div>
                    <div class="quiz-mastery-bar"><div class="quiz-mastery-fill" style="width:${pct}%"></div></div>
                    <div class="quiz-mastery-pct">${cs.answered ? pct + '%' : '—'}</div>
                </div>`;
        }).join('');

        const achvHtml = (window.QUIZ_ACHIEVEMENTS || []).map(a => {
            const unlocked = progress.unlockedAchievements.includes(a.id);
            return `
                <div class="quiz-achv-card ${unlocked ? 'unlocked' : 'locked'}">
                    <i class="ph ${unlocked ? a.icon : 'ph-lock-simple'}"></i>
                    <div class="quiz-achv-card-name">${escapeHtml(a.name)}</div>
                    <div class="quiz-achv-card-desc">${escapeHtml(a.desc)}</div>
                </div>`;
        }).join('');

        mount(`
            <button class="quiz-back-btn" onclick="QuizApp.goHome()"><i class="ph ph-arrow-left"></i> Voltar</button>
            <h2 class="bible-heading">Suas Estatísticas</h2>

            <div class="quiz-level-card">
                <div class="quiz-level-top">
                    <div class="quiz-level-badge"><i class="ph ph-crown"></i> Nível ${lvl.level}</div>
                    <div class="quiz-streak-chip"><i class="ph ph-fire"></i> ${progress.dailyStreak} dia${progress.dailyStreak === 1 ? '' : 's'}</div>
                </div>
                <div class="quiz-level-title">${lvl.title}</div>
                <div class="quiz-xp-bar"><div class="quiz-xp-fill" style="width:${lvl.progressPct}%"></div></div>
                <div class="quiz-xp-caption">${progress.xp} XP total · ${lvl.currentLevelXp}/${lvl.neededForNext} para o próximo nível</div>
            </div>

            <div class="quiz-stats-row">
                <div class="quiz-stat-chip"><i class="ph ph-books"></i><span>${progress.totalQuizzes}</span><small>Quizzes</small></div>
                <div class="quiz-stat-chip"><i class="ph ph-target"></i><span>${acc}%</span><small>Precisão</small></div>
                <div class="quiz-stat-chip"><i class="ph ph-fire"></i><span>${progress.bestDailyStreak}</span><small>Melhor sequência</small></div>
            </div>

            <div class="quiz-section-title">Domínio por Categoria</div>
            <div class="quiz-mastery-list">${masteryHtml}</div>

            <div class="quiz-section-title">Conquistas (${progress.unlockedAchievements.length}/${(window.QUIZ_ACHIEVEMENTS || []).length})</div>
            <div class="quiz-achv-grid">${achvHtml}</div>

            <button class="quiz-danger-btn" onclick="QuizApp.resetProgress()"><i class="ph ph-trash"></i> Reiniciar Progresso</button>
        `);
    }

    function resetProgress() {
        if (confirm('Isso apagará todo o seu XP, nível, sequências e conquistas do quiz. Deseja continuar?')) {
            progress = defaultProgress();
            saveProgress();
            renderDashboard();
        }
    }

    /* ════════════════════════ NAVEGAÇÃO PÚBLICA ═══════════════════ */
    function goHome() { session = null; renderDashboard(); }
    function goToSelect() { renderSelect(); }
    function goToStats() { renderStats(); }
    function openCategory(catId) { ui.selectedCategory = catId; renderSelect(); }
    function setMode(id) { ui.selectedMode = id; renderSelect(); }
    function setCategory(id) { ui.selectedCategory = id; renderSelect(); }

    window.openQuizDashboard = function () { renderDashboard(); };
    window.QuizApp = {
        goHome, goToSelect, goToStats, openCategory, setMode, setCategory,
        startQuiz, startDaily, selectAnswer, nextQuestion, confirmExit, resetProgress,
    };

})();
