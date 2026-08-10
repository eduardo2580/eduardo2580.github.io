/**
 * PLANS MANAGER - Core
 * Central system for managing all custom reading plans
 * Includes backup/restore functionality and sidebar integration
 */

(function () {
    'use strict';

    // Plan registry
    const PLANS_REGISTRY = {
        'bible-1-year': {id:'bible-1-year',name:{pt:'Bíblia em 1 Ano',en:'Bible in 1 Year',es:'Biblia en 1 Año'},days:365,tag:{pt:'COMPLETO',en:'COMPLETE',es:'COMPLETO'},color:'#8b6f3a',icon:'ph-book-open',category:'full'},
        'bible-6-months': {id:'bible-6-months',name:{pt:'Bíblia em 6 Meses',en:'Bible in 6 Months',es:'Biblia en 6 Meses'},days:180,tag:{pt:'INTENSIVO',en:'INTENSIVE',es:'INTENSIVO'},color:'#b91c1c',icon:'ph-rocket',category:'full'},
        'nt-90-days': {id:'nt-90-days',name:{pt:'Novo Testamento em 90 Dias',en:'New Testament in 90 Days',es:'Nuevo Testamento en 90 Días'},days:90,tag:{pt:'NOVO TESTAMENTO',en:'NEW TESTAMENT',es:'NUEVO TESTAMENTO'},color:'#059669',icon:'ph-cross',category:'testament'},
        'psalms-30-days': {id:'psalms-30-days',name:{pt:'Salmos em 30 Dias',en:'Psalms in 30 Days',es:'Salmos en 30 Días'},days:30,tag:{pt:'POESIA',en:'POETRY',es:'POESÍA'},color:'#3b82f6',icon:'ph-music-notes',category:'book'},
        'proverbs-31-days': {id:'proverbs-31-days',name:{pt:'Provérbios em 31 Dias',en:'Proverbs in 31 Days',es:'Proverbios en 31 Días'},days:31,tag:{pt:'SABEDORIA',en:'WISDOM',es:'SABIDURÍA'},color:'#8b5cf6',icon:'ph-lightbulb',category:'book'},
        'gospels-30-days': {id:'gospels-30-days',name:{pt:'Evangelhos em 30 Dias',en:'Gospels in 30 Days',es:'Evangelios en 30 Días'},days:30,tag:{pt:'EVANGELHOS',en:'GOSPELS',es:'EVANGELIOS'},color:'#f59e0b',icon:'ph-sun',category:'gospels'},
        'chronological': {id:'chronological',name:{pt:'Bíblia Cronológica',en:'Chronological Bible',es:'Biblia Cronológica'},days:365,tag:{pt:'CRONOLÓGICO',en:'CHRONOLOGICAL',es:'CRONOLÓGICO'},color:'#10b981',icon:'ph-clock-counter-clockwise',category:'full'},
        'jesus-teachings': {id:'jesus-teachings',name:{pt:'Ensino de Jesus',en:"Jesus' Teachings",es:'Enseñanzas de Jesús'},days:40,tag:{pt:'JESUS',en:'JESUS',es:'JESÚS'},color:'#ef4444',icon:'ph-heart',category:'thematic'},
        'women-bible': {id:'women-bible',name:{pt:'Mulheres da Bíblia',en:'Women of the Bible',es:'Mujeres de la Biblia'},days:30,tag:{pt:'MULHERES',en:'WOMEN',es:'MUJERES'},color:'#ec4899',icon:'ph-user-circle',category:'thematic'},
        'men-bible': {id:'men-bible',name:{pt:'Homens da Bíblia',en:'Men of the Bible',es:'Hombres de la Biblia'},days:30,tag:{pt:'HOMENS',en:'MEN',es:'HOMBRES'},color:'#1e40af',icon:'ph-user-circle',category:'thematic'},
        'prophecy': {id:'prophecy',name:{pt:'Profecia',en:'Prophecy',es:'Profecía'},days:60,tag:{pt:'PROFECIA',en:'PROPHECY',es:'PROFECÍA'},color:'#7c3aed',icon:'ph-eye',category:'thematic'},
        'faith': {id:'faith',name:{pt:'Fé',en:'Faith',es:'Fe'},days:30,tag:{pt:'FÉ',en:'FAITH',es:'FE'},color:'#f97316',icon:'ph-shield-check',category:'thematic'},
        'prayer': {id:'prayer',name:{pt:'Oração',en:'Prayer',es:'Oración'},days:30,tag:{pt:'ORAÇÃO',en:'PRAYER',es:'ORACIÓN'},color:'#06b6d4',icon:'ph-hands-praying',category:'thematic'},
        'marriage': {id:'marriage',name:{pt:'Casamento',en:'Marriage',es:'Matrimonio'},days:30,tag:{pt:'CASAMENTO',en:'MARRIAGE',es:'MATRIMONIO'},color:'#e91e63',icon:'ph-heart-straight',category:'thematic'},
        'family': {id:'family',name:{pt:'Família',en:'Family',es:'Familia'},days:30,tag:{pt:'FAMÍLIA',en:'FAMILY',es:'FAMILIA'},color:'#84cc16',icon:'ph-users',category:'thematic'},
        'leadership': {id:'leadership',name:{pt:'Liderança',en:'Leadership',es:'Liderazgo'},days:30,tag:{pt:'LIDERANÇA',en:'LEADERSHIP',es:'LIDERAZGO'},color:'#1e1b4b',icon:'ph-crown',category:'thematic'},
        'anxiety': {id:'anxiety',name:{pt:'Ansiedade',en:'Anxiety',es:'Ansiedad'},days:30,tag:{pt:'PAZ',en:'PEACE',es:'PAZ'},color:'#a855f7',icon:'ph-brain',category:'thematic'},
        'forgiveness': {id:'forgiveness',name:{pt:'Perdão',en:'Forgiveness',es:'Perdón'},days:30,tag:{pt:'PERDÃO',en:'FORGIVENESS',es:'PERDÓN'},color:'#22c55e',icon:'ph-hand-heart',category:'thematic'},
        'gratitude': {id:'gratitude',name:{pt:'Gratidão',en:'Gratitude',es:'Gratitud'},days:30,tag:{pt:'GRATIDÃO',en:'GRATITUDE',es:'GRATITUD'},color:'#fbbf24',icon:'ph-hands-clapping',category:'thematic'},
        'young-christians': {id:'young-christians',name:{pt:'Jovens Cristãos',en:'Young Christians',es:'Jóvenes Cristianos'},days:60,tag:{pt:'JOVENS',en:'YOUNG',es:'JÓVENES'},color:'#34d399',icon:'ph-sparkle',category:'demographic'},
        'beginners': {id:'beginners',name:{pt:'Iniciantes',en:'Beginners',es:'Principiantes'},days:30,tag:{pt:'INICIANTES',en:'BEGINNERS',es:'PRINCIPIANTES'},color:'#60a5fa',icon:'ph-book',category:'demographic'}
    };

    window.PLANS_REGISTRY = PLANS_REGISTRY;

    // Storage helpers
    window.getPlanStorageKey = function(planId) { return `plan_${planId}_completed_v1`; };
    window.getPlanStartDateKey = function(planId) { return `plan_${planId}_startdate_v1`; };
    
    window.loadPlanCompleted = function(planId) {
        try { const raw = localStorage.getItem(`plan_${planId}_completed_v1`); return raw ? new Set(JSON.parse(raw)) : new Set(); }
        catch (_) { return new Set(); }
    };
    
    window.savePlanCompleted = function(planId, set) {
        try { localStorage.setItem(`plan_${planId}_completed_v1`, JSON.stringify([...set])); } catch (_) {}
    };
    
    window.loadPlanStartDate = function(planId) {
        try { const raw = localStorage.getItem(`plan_${planId}_startdate_v1`); if (!raw) return null; const d = new Date(raw); return isNaN(d.getTime()) ? null : d; }
        catch (_) { return null; }
    };
    
    window.savePlanStartDate = function(planId, date) {
        try { localStorage.setItem(`plan_${planId}_startdate_v1`, date.toISOString()); } catch (_) {}
    };

    // Backup system
    window.exportAllPlansBackup = function() {
        const backup = { version: 1, exportedAt: new Date().toISOString(), plans: {} };
        Object.keys(PLANS_REGISTRY).forEach(planId => {
            try {
                const completed = localStorage.getItem(`plan_${planId}_completed_v1`);
                const startDate = localStorage.getItem(`plan_${planId}_startdate_v1`);
                if (completed || startDate) backup.plans[planId] = { completed: completed ? JSON.parse(completed) : [], startDate: startDate || null };
            } catch (e) {}
        });
        return backup;
    };

    window.importAllPlansBackup = function(data) {
        if (!data || !data.plans) throw new Error('Invalid backup format');
        let count = 0;
        Object.keys(data.plans).forEach(planId => {
            const planData = data.plans[planId];
            if (!planData) return;
            try {
                if (planData.completed && Array.isArray(planData.completed)) {
                    localStorage.setItem(`plan_${planId}_completed_v1`, JSON.stringify(planData.completed));
                }
                if (planData.startDate) localStorage.setItem(`plan_${planId}_startdate_v1`, planData.startDate);
                count++;
            } catch (e) {}
        });
        return count;
    };

    window.downloadPlansBackup = function() {
        const backup = window.exportAllPlansBackup();
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
        a.href = url; a.download = `bible-plans-backup-${date}.json`; a.click();
        URL.revokeObjectURL(url);
        return true;
    };

    // Sidebar integration
    function buildPlansSidebar() {
        const container = document.getElementById('dailyBooks') || document.getElementById('teensBooks');
        if (!container) return;
        if (container.querySelector('#plansContainer')) return;

        const plansContainer = document.createElement('div');
        plansContainer.id = 'plansContainer';
        plansContainer.style.marginTop = '1rem';
        plansContainer.style.borderTop = '1px solid rgba(0,0,0,.08)';
        plansContainer.style.paddingTop = '1rem';

        const title = document.createElement('p');
        title.style.fontSize = '.66rem';
        title.style.fontWeight = '700';
        title.style.letterSpacing = '.12em';
        title.style.textTransform = 'uppercase';
        title.style.color = 'rgba(0,0,0,.35)';
        title.style.margin = '0 0 .5rem';
        title.textContent = window.t?.('otherPlans') || 'OUTROS PLANOS';
        plansContainer.appendChild(title);

        const categories = {
            full: { label: 'Bíblia Completa', icon: 'ph-book-open' },
            testament: { label: 'Testamentos', icon: 'ph-book' },
            book: { label: 'Livros', icon: 'ph-books' },
            gospels: { label: 'Evangelhos', icon: 'ph-cross' },
            thematic: { label: 'Temáticos', icon: 'ph-heart' },
            demographic: { label: 'Demográficos', icon: 'ph-users' }
        };

        Object.keys(categories).forEach(category => {
            const categoryPlans = Object.keys(PLANS_REGISTRY).filter(planId => PLANS_REGISTRY[planId].category === category);
            if (categoryPlans.length === 0) return;

            const categoryHeader = document.createElement('p');
            categoryHeader.style.fontSize = '.6rem';
            categoryHeader.style.fontWeight = '700';
            categoryHeader.style.letterSpacing = '.1em';
            categoryHeader.style.textTransform = 'uppercase';
            categoryHeader.style.color = 'rgba(0,0,0,.25)';
            categoryHeader.style.margin = '0 0 .3rem';
            categoryHeader.style.display = 'flex';
            categoryHeader.style.alignItems = 'center';
            categoryHeader.style.gap = '.3rem';
            categoryHeader.innerHTML = `<i class="ph ${categories[category].icon}"></i> ${categories[category].label}`;
            plansContainer.appendChild(categoryHeader);

            categoryPlans.forEach(planId => {
                const planInfo = PLANS_REGISTRY[planId];
                const lang = window.state?.lang || 'pt';
                const planName = planInfo.name[lang] || planInfo.name.pt || planId;

                const btn = document.createElement('button');
                btn.className = 'book-btn';
                btn.id = `planBtn_${planId}`;
                btn.innerHTML = `<i class="ph ${planInfo.icon}"></i> ${planName}`;
                btn.style.marginBottom = '.3rem';
                btn.style.fontSize = '.85rem';
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.book-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const startDate = window.loadPlanStartDate(planId);
                    if (!startDate) {
                        if (window[`open${planId.replace(/-/g, '')}Welcome`]) {
                            window[`open${planId.replace(/-/g, '')}Welcome`]();
                        } else {
                            openGenericPlanWelcome(planId);
                        }
                    } else {
                        if (window[`open${planId.replace(/-/g, '')}Dashboard`]) {
                            window[`open${planId.replace(/-/g, '')}Dashboard`](1);
                        } else {
                            openGenericPlanDashboard(planId, 1);
                        }
                    }
                });
                plansContainer.appendChild(btn);
            });
        });

        container.appendChild(plansContainer);
    }

    // Add backup button to settings
    function addBackupButtonToSettings() {
        const settingsContainer = document.getElementById('settingsList') || document.querySelector('.settings-list');
        if (!settingsContainer) return;
        if (settingsContainer.querySelector('#plansBackupBtn')) return;

        const backupBtn = document.createElement('button');
        backupBtn.id = 'plansBackupBtn';
        backupBtn.className = 'settings-item';
        backupBtn.innerHTML = `
            <div class="settings-item-left">
                <i class="ph ph-shield-check"></i>
                <div>
                    <p class="settings-item-title">Backup dos Planos</p>
                    <p class="settings-item-sub">Exporte ou importe seu progresso</p>
                </div>
            </div>
            <i class="ph ph-caret-right"></i>
        `;
        backupBtn.addEventListener('click', () => {
            window.closeSidebar?.();
            openBackupModal();
        });

        const firstItem = settingsContainer.querySelector('.settings-item');
        if (firstItem) settingsContainer.insertBefore(backupBtn, firstItem.nextSibling);
        else settingsContainer.appendChild(backupBtn);
    }

    // Backup modal
    function openBackupModal() {
        if (document.getElementById('plansBackupOverlay')) return;

        let activePlans = 0; let totalChapters = 0;
        Object.keys(PLANS_REGISTRY).forEach(planId => {
            try { const c = localStorage.getItem(`plan_${planId}_completed_v1`); if (c) { activePlans++; totalChapters += JSON.parse(c).length; } } catch(e) {}
        });

        const overlay = document.createElement('div');
        overlay.id = 'plansBackupOverlay';
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-content" style="max-width:500px">
                <div class="modal-header">
                    <h3><i class="ph ph-shield-check"></i> Backup dos Planos</h3>
                    <button class="modal-close" onclick="closeBackupModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <p style="opacity:.6;margin-bottom:1rem">Exporte ou importe o progresso de todos os seus planos de leitura.</p>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:1rem">
                        <div style="background:rgba(0,0,0,.04);border:1px solid rgba(0,0,0,.07);border-radius:11px;padding:.6rem .65rem;text-align:center">
                            <div style="font-size:1.25rem;font-weight:800;color:#8b6f3a">${activePlans}</div>
                            <div style="font-size:.62rem;opacity:.4;margin-top:.2rem">PLANOS ATIVOS</div>
                        </div>
                        <div style="background:rgba(0,0,0,.04);border:1px solid rgba(0,0,0,.07);border-radius:11px;padding:.6rem .65rem;text-align:center">
                            <div style="font-size:1.25rem;font-weight:800;color:#8b6f3a">${totalChapters}</div>
                            <div style="font-size:.62rem;opacity:.4;margin-top:.2rem">CAPÍTULOS LIDOS</div>
                        </div>
                    </div>
                    <div style="border:1px solid rgba(0,0,0,.08);border-radius:14px;overflow:hidden;margin-bottom:.85rem">
                        <div style="display:flex;align-items:center;gap:.7rem;padding:.9rem 1rem .55rem">
                            <div style="width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;background:rgba(139,111,58,.1);color:#8b6f3a"><i class="ph ph-export"></i></div>
                            <div><p style="font-size:.9rem;font-weight:700;margin:0 0 .1rem">Exportar</p><p style="font-size:.72rem;opacity:.5;margin:0">Salve seu progresso em arquivo.</p></div>
                        </div>
                        <div style="padding:0 1rem .9rem;display:flex;flex-direction:column;gap:.45rem">
                            <button class="btn-nav" id="plansExportFile" onclick="exportAndDownload()"><i class="ph ph-download-simple"></i> Baixar JSON</button>
                            <button class="btn-nav" id="plansCopyJson" onclick="exportAndCopy()"><i class="ph ph-clipboard"></i> Copiar JSON</button>
                        </div>
                    </div>
                    <div style="border:1px solid rgba(0,0,0,.08);border-radius:14px;overflow:hidden">
                        <div style="display:flex;align-items:center;gap:.7rem;padding:.9rem 1rem .55rem">
                            <div style="width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;background:rgba(16,185,129,.1);color:#059669"><i class="ph ph-import"></i></div>
                            <div><p style="font-size:.9rem;font-weight:700;margin:0 0 .1rem">Importar</p><p style="font-size:.72rem;opacity:.5;margin:0">Restaure de um backup.</p></div>
                        </div>
                        <div style="padding:0 1rem .9rem;display:flex;flex-direction:column;gap:.45rem">
                            <input type="file" id="plansImportInput" accept=".json" style="display:none" onchange="handleImport(event)">
                            <button class="btn-nav" id="plansChooseFile" onclick="document.getElementById('plansImportInput').click()"><i class="ph ph-file-arrow-up"></i> Escolher Arquivo</button>
                            <button class="btn-nav" id="plansPasteJson" onclick="pasteImport()"><i class="ph ph-clipboard-text"></i> Colar JSON</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    window.closeBackupModal = function() {
        const overlay = document.getElementById('plansBackupOverlay');
        if (overlay) overlay.remove();
    };

    window.exportAndDownload = function() { window.downloadPlansBackup(); window.closeBackupModal(); };
    window.exportAndCopy = async function() {
        const backup = window.exportAllPlansBackup();
        const json = JSON.stringify(backup, null, 2);
        try { await navigator.clipboard.writeText(json); } catch(_) {
            const ta = document.createElement('textarea'); ta.value = json; ta.style.cssText = 'position:fixed;opacity:0';
            document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
        }
        window.closeBackupModal();
    };
    window.handleImport = function(e) {
        const file = e.target.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = e2 => { try { const data = JSON.parse(e2.target.result); const count = window.importAllPlansBackup(data); alert(`✓ ${count} planos restaurados`); } catch(err) { alert(`✗ ${err.message}`); } };
        reader.readAsText(file); e.target.value = ''; window.closeBackupModal();
    };
    window.pasteImport = async function() {
        try { const text = await navigator.clipboard.readText(); const data = JSON.parse(text); const count = window.importAllPlansBackup(data); alert(`✓ ${count} planos restaurados`); } catch(e) { alert('✗ Não foi possível colar'); }
        window.closeBackupModal();
    };

    // Generic plan views
    function openGenericPlanWelcome(planId) {
        const planInfo = PLANS_REGISTRY[planId];
        if (!planInfo) return;
        const lang = window.state?.lang || 'pt';
        const planName = planInfo.name[lang] || planInfo.name.pt || planId;
        const days = planInfo.days || 365;

        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="plan-wrap fade-in">
                <div class="daily-hero" style="border-color:${planInfo.color}29">
                    <p class="daily-hero-tag">${planInfo.tag[lang] || planInfo.tag.pt || 'PLANO'}</p>
                    <h2 class="daily-hero-title">${planName}</h2>
                    <p class="daily-hero-date">${planInfo.description[lang] || planInfo.description.pt || ''}</p>
                </div>
                <button class="btn-conclude-daily" id="btnStartPlan" style="margin-top:1rem">
                    <i class="ph ph-play-circle"></i> INICIAR PLANO
                </button>
            </div>
        `;
        document.getElementById('btnStartPlan')?.addEventListener('click', () => {
            const startDate = new Date(); startDate.setHours(0,0,0,0);
            window.savePlanStartDate(planId, startDate);
            openGenericPlanDashboard(planId, 1);
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.closeSidebar?.();
    }

    function openGenericPlanDashboard(planId, dayNum) {
        const planInfo = PLANS_REGISTRY[planId];
        if (!planInfo) return;
        const lang = window.state?.lang || 'pt';
        const planName = planInfo.name[lang] || planInfo.name.pt || planId;
        const days = planInfo.days || 365;

        const startDate = window.loadPlanStartDate(planId);
        const completed = window.loadPlanCompleted(planId);

        function todayDay() { if (!startDate) return 1; const diff = Math.floor((new Date() - startDate) / 86400000); return Math.max(1, Math.min(diff + 1, days)); }
        function formatDate(doy) { if (!startDate) return ''; const d = new Date(startDate); d.setDate(d.getDate() + doy - 1); const locale = window.langLocale ? window.langLocale(lang) : 'pt-BR'; return d.toLocaleDateString(locale, { day: 'numeric', month: 'long' }); }

        dayNum = dayNum || todayDay();
        const pct = Math.round((dayNum / days) * 100);

        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="daily-wrap fade-in">
                <div class="daily-hero" style="border-color:${planInfo.color}29">
                    <p class="daily-hero-tag">${planInfo.tag[lang] || planInfo.tag.pt || 'PLANO'}</p>
                    <h2 class="daily-hero-title">${planName}</h2>
                    <p class="daily-hero-date">${formatDate(dayNum)}</p>
                    <div class="daily-hero-progress-wrap">
                        <div class="daily-hero-progress-fill" style="width:${pct}%"></div>
                    </div>
                    <div class="daily-hero-progress-row">
                        <span class="daily-hero-daycount">Dia ${dayNum} de ${days}</span>
                        <span class="daily-hero-pct">${pct}%</span>
                    </div>
                </div>
                <button class="btn-conclude-daily" id="btnStartDay" style="margin-top:1rem">
                    <i class="ph ph-play-circle"></i> COMEÇAR DIA ${dayNum}
                </button>
                <button class="btn-conclude-daily" id="btnResetPlan" style="margin-top:.5rem;background:rgba(185,28,28,.1);color:#b91c1c">
                    <i class="ph ph-arrow-counter-clockwise"></i> RESETAR PLANO
                </button>
            </div>
        `;
        document.getElementById('btnResetPlan')?.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja resetar este plano?')) {
                window.savePlanCompleted(planId, new Set());
                window.savePlanStartDate(planId, null);
                openGenericPlanWelcome(planId);
            }
        });
        document.getElementById('btnStartDay')?.addEventListener('click', () => {
            // This would need the actual plan data - for now just show message
            alert('Plano em desenvolvimento. Em breve!');
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.closeSidebar?.();
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { buildPlansSidebar(); addBackupButtonToSettings(); });
    } else {
        buildPlansSidebar(); addBackupButtonToSettings();
    }

})();
