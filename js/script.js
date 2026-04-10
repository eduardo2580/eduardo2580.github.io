/**
 * BÍBLIA SAGRADA — 100% OFFLINE
 * Modern Re-design
 */

/* ══════════════════════════ BOOK DATA ═══════════════════════════ */
const BOOKS = {
    ot: [
        { id: 'GEN', name: 'Gênesis', chapters: 50 },
        { id: 'EXO', name: 'Êxodo', chapters: 40 },
        { id: 'LEV', name: 'Levítico', chapters: 27 },
        { id: 'NUM', name: 'Números', chapters: 36 },
        { id: 'DEU', name: 'Deuteronômio', chapters: 34 },
        { id: 'JOS', name: 'Josué', chapters: 24 },
        { id: 'JDG', name: 'Juízes', chapters: 21 },
        { id: 'RUT', name: 'Rute', chapters: 4 },
        { id: '1SA', name: '1 Samuel', chapters: 31 },
        { id: '2SA', name: '2 Samuel', chapters: 24 },
        { id: '1KI', name: '1 Reis', chapters: 22 },
        { id: '2KI', name: '2 Reis', chapters: 25 },
        { id: '1CH', name: '1 Crônicas', chapters: 29 },
        { id: '2CH', name: '2 Crônicas', chapters: 36 },
        { id: 'EZR', name: 'Esdras', chapters: 10 },
        { id: 'NEH', name: 'Neemias', chapters: 13 },
        { id: 'EST', name: 'Ester', chapters: 10 },
        { id: 'JOB', name: 'Jó', chapters: 42 },
        { id: 'PSA', name: 'Salmos', chapters: 150 },
        { id: 'PRO', name: 'Provérbios', chapters: 31 },
        { id: 'ECC', name: 'Eclesiastes', chapters: 12 },
        { id: 'SNG', name: 'Cânticos', chapters: 8 },
        { id: 'ISA', name: 'Isaías', chapters: 66 },
        { id: 'JER', name: 'Jeremias', chapters: 52 },
        { id: 'LAM', name: 'Lamentações', chapters: 5 },
        { id: 'EZK', name: 'Ezequiel', chapters: 48 },
        { id: 'DAN', name: 'Daniel', chapters: 12 },
        { id: 'HOS', name: 'Oséias', chapters: 14 },
        { id: 'JOL', name: 'Joel', chapters: 3 },
        { id: 'AMO', name: 'Amós', chapters: 9 },
        { id: 'OBA', name: 'Obadias', chapters: 1 },
        { id: 'JON', name: 'Jonas', chapters: 4 },
        { id: 'MIC', name: 'Miquéias', chapters: 7 },
        { id: 'NAM', name: 'Naum', chapters: 3 },
        { id: 'HAB', name: 'Habacuque', chapters: 3 },
        { id: 'ZEP', name: 'Sofonias', chapters: 3 },
        { id: 'HAG', name: 'Ageu', chapters: 2 },
        { id: 'ZEC', name: 'Zacarias', chapters: 14 },
        { id: 'MAL', name: 'Malaquias', chapters: 4 },
    ],
    nt: [
        { id: 'MAT', name: 'Mateus', chapters: 28 },
        { id: 'MRK', name: 'Marcos', chapters: 16 },
        { id: 'LUK', name: 'Lucas', chapters: 24 },
        { id: 'JHN', name: 'João', chapters: 21 },
        { id: 'ACT', name: 'Atos', chapters: 28 },
        { id: 'ROM', name: 'Romanos', chapters: 16 },
        { id: '1CO', name: '1 Coríntios', chapters: 16 },
        { id: '2CO', name: '2 Coríntios', chapters: 13 },
        { id: 'GAL', name: 'Gálatas', chapters: 6 },
        { id: 'EPH', name: 'Efésios', chapters: 6 },
        { id: 'PHP', name: 'Filipenses', chapters: 4 },
        { id: 'COL', name: 'Colossenses', chapters: 4 },
        { id: '1TH', name: '1 Tessalonicenses', chapters: 5 },
        { id: '2TH', name: '2 Tessalonicenses', chapters: 3 },
        { id: '1TI', name: '1 Timóteo', chapters: 6 },
        { id: '2TI', name: '2 Timóteo', chapters: 4 },
        { id: 'TIT', name: 'Tito', chapters: 3 },
        { id: 'PHM', name: 'Filemom', chapters: 1 },
        { id: 'HEB', name: 'Hebreus', chapters: 13 },
        { id: 'JAS', name: 'Tiago', chapters: 5 },
        { id: '1PE', name: '1 Pedro', chapters: 5 },
        { id: '2PE', name: '2 Pedro', chapters: 3 },
        { id: '1JN', name: '1 João', chapters: 5 },
        { id: '2JN', name: '2 João', chapters: 1 },
        { id: '3JN', name: '3 João', chapters: 1 },
        { id: 'JUD', name: 'Judas', chapters: 1 },
        { id: 'REV', name: 'Apocalipse', chapters: 22 },
    ]
};

const ALL_BOOKS = [...BOOKS.ot, ...BOOKS.nt];

/* ════════════════════════ TRANSLATIONS ═════════════════════════ */
const TRANSLATIONS = {
    pt: {
        brand: '✦ Bíblia Sagrada',
        searchPlaceholder: 'Buscar na Bíblia...',
        daily: '✦ Diário',
        todayReading: 'Leitura de Hoje',
        ot: '✦ Antigo Testamento',
        nt: '✦ Novo Testamento',
        listen: 'Ouvir',
        stop: 'Parar',
        search: 'Busca',
        results: 'resultado(s)',
        goToRef: 'IR PARA REFERÊNCIA',
        noResults: 'Nenhum versículo encontrado.',
        chapter: 'Capítulo',
        loading: 'Carregando a Palavra…',
        tryAgain: 'Tentar Novamente',
        errorData: 'Arquivo de dados não encontrado',
        errorChapter: 'Capítulo não encontrado',
        errorGeneric: 'Erro ao carregar dados',
        errorDataInstruction: 'Adicione ao index.html antes de script.js',
        fontDown: 'Diminuir fonte',
        fontUp: 'Aumentar fonte',
        listenTitle: 'Ouvir a Palavra',
        scrollTop: 'Voltar ao topo',
        menuTitle: 'Menu de livros',
        closeMenu: 'Fechar menu',
        openMenu: 'Abrir menu',
        prev: 'Cap',
        next: 'Cap',
        langBtn: 'Português',
        hello: 'Olá',
        verseOfDay: 'Versículo do Dia',
        bible: 'Bíblia',
        plans: 'Planos',
        settings: 'Mais',
        home: 'Início',
        username: 'Nome do Usuário',
        language: 'Idioma',
        theme: 'Tema',
        light: 'Claro',
        dark: 'Escuro',
        dailyPlan: 'Diário',
        teensPlan: 'Teens',
        daily: {
            title: "Leitura Diária",
            planName: "Plano Bíblico Anual",
            today: "Hoje",
            day: "Dia",
            of: "de",
            annualProgress: "Progresso Anual",
            concluded: "Concluído",
            concludeBtn: "Concluir Leitura",
            done: "Leitura Concluída!"
        },
        teens: {
            title: "Plano Teens",
            tag: "Jornada Bíblica",
            bannerTitle: "Explorando<br>a Palavra",
            startDesc: "Comece sua jornada de leitura bíblica hoje mesmo!",
            startBtn: "Iniciar Plano",
            concluded: "Concluído",
            conclude: "Concluir Dia",
            backToPlan: "Voltar ao Plano"
        }
    },
    en: {
        brand: '✦ Holy Bible',
        searchPlaceholder: 'Search the Bible...',
        daily: '✦ Daily',
        todayReading: "Today's Reading",
        ot: '✦ Old Testament',
        nt: '✦ New Testament',
        listen: 'Listen',
        stop: 'Stop',
        search: 'Search',
        results: 'result(s)',
        goToRef: 'GO TO REFERENCE',
        noResults: 'No verses found.',
        chapter: 'Chapter',
        loading: 'Loading the Word...',
        tryAgain: 'Try Again',
        errorData: 'Data file not found',
        errorChapter: 'Chapter not found',
        errorGeneric: 'Error loading data',
        errorDataInstruction: 'Add to index.html before script.js',
        fontDown: 'Decrease font',
        fontUp: 'Increase font',
        listenTitle: 'Listen to the Word',
        scrollTop: 'Back to top',
        menuTitle: 'Book Menu',
        closeMenu: 'Close menu',
        openMenu: 'Open menu',
        prev: 'Chap',
        next: 'Chap',
        langBtn: 'English',
        hello: 'Hello',
        verseOfDay: 'Verse of the Day',
        bible: 'Bible',
        plans: 'Plans',
        settings: 'More',
        home: 'Home',
        username: 'User Name',
        language: 'Language',
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        dailyPlan: 'Daily',
        teensPlan: 'Teens',
        daily: {
            title: "Daily Reading",
            planName: "Annual Bible Plan",
            today: "Today",
            day: "Day",
            of: "of",
            annualProgress: "Annual Progress",
            concluded: "Concluded",
            concludeBtn: "Conclude Reading",
            done: "Reading Done!"
        },
        teens: {
            title: "Teens Plan",
            tag: "Bible Journey",
            bannerTitle: "Exploring<br>the Word",
            startDesc: "Start your bible reading journey today!",
            startBtn: "Start Plan",
            concluded: "Concluded",
            conclude: "Conclude Day",
            backToPlan: "Back to Plan"
        }
    }
};

window.t = function (key, section = null) {
    const lang = window.state.lang || 'pt';
    if (section && TRANSLATIONS[lang] && TRANSLATIONS[lang][section]) {
        return TRANSLATIONS[lang][section][key] || key;
    }
    return TRANSLATIONS[lang]?.[key] || key;
};

/* ══════════════════════════ STATE ══════════════════════════════ */
// Load config from localStorage
function getInitialConfig() {
    let config = JSON.parse(localStorage.getItem('bible_config') || '{}');
    // Migration from old keys
    if (!config.lang && localStorage.getItem('bible_lang')) {
        config.lang = localStorage.getItem('bible_lang');
    }
    if (!config.fontSize && localStorage.getItem('bible_font_size')) {
        config.fontSize = parseFloat(localStorage.getItem('bible_font_size'));
    }
    return config;
}
const savedConfig = getInitialConfig();

window.state = {
    bookId: 'JHN',
    chapter: 1,
    fontSize: savedConfig.fontSize || 1.1,
    verses: [],
    lang: savedConfig.lang || 'pt',
    userName: savedConfig.userName || '',
    theme: savedConfig.theme || 'light',
    currentView: 'home'
};
const state = window.state;

function saveConfig() {
    localStorage.setItem('bible_config', JSON.stringify({
        fontSize: state.fontSize,
        lang: state.lang,
        userName: state.userName,
        theme: state.theme
    }));
}

function applyTheme() {
    document.body.classList.toggle('dark-theme', state.theme === 'dark');
}

/* ═══════════════════════ INDEXEDDB CACHE ═══════════════════════ */
const DB_NAME = 'BibleDB_local';
const DB_VERSION = 1;
const STORE = 'chapters';
let db = null;

function initDB() {
    return new Promise(resolve => {
        if (!window.indexedDB) { resolve(false); return; }
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = e => {
            const d = e.target.result;
            if (!d.objectStoreNames.contains(STORE))
                d.createObjectStore(STORE, { keyPath: 'id' });
        };
        req.onsuccess = e => { db = e.target.result; resolve(true); };
        req.onerror = () => resolve(false);
    });
}

function dbGet(key) {
    return new Promise(resolve => {
        if (!db) { resolve(null); return; }
        try {
            const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(key);
            req.onsuccess = () => resolve(req.result?.verses ?? null);
            req.onerror = () => resolve(null);
        } catch { resolve(null); }
    });
}

function dbPut(key, verses) {
    if (!db) return;
    try {
        db.transaction(STORE, 'readwrite').objectStore(STORE)
            .put({ id: key, verses });
    } catch { }
}

/* ═══════════════════ CHAPTER LOADING ═══════════════════════════ */
async function fetchChapter(bookId, chapter) {
    const key = `${bookId}_${chapter}`;
    const cached = await dbGet(key);
    if (cached) return cached;
    const verses = window.BIBLE_DATA?.[key];
    if (verses) {
        dbPut(key, verses);
        return verses;
    }
    throw new Error(`${window.t('errorChapter')}: ${key}`);
}

/* ════════════════════════ NAVIGATION ══════════════════════════ */
function switchView(viewName, params = {}) {
    state.currentView = viewName;
    window.speechSynthesis?.cancel();
    ttsSetPlaying(false);

    // Update Bottom Nav UI
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    const content = document.getElementById('content');
    content.innerHTML = '';

    // Hide/Show Top Bar based on view
    renderTopBar();

    switch (viewName) {
        case 'home':
            renderHome();
            break;
        case 'bible':
            if (params.bookId) {
                loadChapter(params.bookId, params.chapter || 1, params.verse);
            } else {
                renderBibleSelector();
            }
            break;
        case 'plans':
            renderPlans();
            break;
        case 'daily':
            if (typeof window.loadDailyReading === 'function') {
                window.loadDailyReading();
            } else {
                const content = document.getElementById('content');
                content.innerHTML = `<div style="text-align:center;padding:3rem;opacity:.5">
            <i class="ph ph-warning-circle" style="font-size:2rem"></i>
            <p style="margin-top:1rem">Plano diário não carregado.</p>
        </div>`;
            }
            break;
        case 'teens':
            window.openTeensDashboard?.();
            break;
        case 'search':
            renderSearchInput();
            break;
        case 'settings':
            renderSettings();
            break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderTopBar() {
    const placeholder = document.getElementById('top-bar-placeholder');
    const themeIcon = state.theme === 'dark' ? 'ph-sun' : 'ph-moon';

    if (state.currentView !== 'home') {
        placeholder.innerHTML = `
            <div class="top-bar">
                <div class="user-info">
                    <div class="avatar" onclick="switchView('settings')">
                        <i class="ph ph-user"></i>
                    </div>
                    <h1 class="greeting">${window.t('brand')}</h1>
                </div>
                <div style="display:flex; gap:0.5rem">
                    <button class="icon-btn" id="themeToggleBtnTop">
                        <i class="ph ${themeIcon}"></i>
                    </button>
                    <button class="icon-btn" onclick="switchView('search')">
                        <i class="ph ph-magnifying-glass"></i>
                    </button>
                </div>
            </div>
        `;
        document.getElementById('themeToggleBtnTop')?.addEventListener('click', toggleTheme);
        return;
    }

    placeholder.innerHTML = `
        <div class="top-bar">
            <div class="user-info">
                <div class="avatar" onclick="switchView('settings')">
                    <i class="ph ph-user"></i>
                </div>
                <h1 class="greeting">${window.t('hello')}, ${state.userName || '...'}! 👋</h1>
            </div>
            <button class="icon-btn" id="themeToggleBtnTop">
                <i class="ph ${themeIcon}"></i>
            </button>
        </div>
    `;
    document.getElementById('themeToggleBtnTop')?.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    saveConfig();
    applyTheme();
    renderTopBar();
    if (state.currentView === 'settings') renderSettings();
}

/* ════════════════════════ PROFILE ══════════════════════════ */
function checkProfile() {
    if (!state.userName) {
        const name = prompt('Como gostaria de ser chamado?', '');
        state.userName = name || 'Eduardo';
        saveConfig();
    }
}

function saveProfile() {
    const input = document.getElementById('user-name-input');
    const name = input.value.trim();
    if (name) {
        state.userName = name;
        saveConfig();
        document.getElementById('name-modal-overlay').classList.add('d-none');
        renderTopBar();
        renderHome();
    }
}

/* ════════════════════════ SEARCH ════════════════════════════ */
function normalise(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function levenshtein(a, b) {
    const tmp = [];
    for (let i = 0; i <= a.length; i++) { tmp[i] = [i]; }
    for (let j = 0; j <= b.length; j++) { tmp[0][j] = j; }
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            tmp[i][j] = Math.min(
                tmp[i - 1][j] + 1,
                tmp[i][j - 1] + 1,
                tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
        }
    }
    return tmp[a.length][b.length];
}

function findBestBookMatch(query) {
    const q = normalise(query);
    if (q.length < 2) return null;
    let best = null;
    let minDistance = 3;
    for (const book of ALL_BOOKS) {
        const bookName = normalise(book.name);
        if (bookName.startsWith(q)) return book;
        const distance = levenshtein(q, bookName.substring(0, q.length));
        if (distance < minDistance) {
            minDistance = distance;
            best = book;
        }
    }
    return best;
}

function todayDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

function parseReference(query) {
    const q = query.trim();
    if (q.length < 2) return null;
    const refRegex = /^(\d?\s*[a-zA-Z\u00C0-\u017F\s]+)\s+(\d+)(?::(\d+))?$/i;
    const match = q.match(refRegex);
    if (match) {
        const bookQuery = match[1].trim();
        const chapter = parseInt(match[2]);
        const verse = match[3] ? parseInt(match[3]) : null;
        const book = findBestBookMatch(bookQuery);
        if (book && chapter > 0 && chapter <= book.chapters) {
            return { book, chapter, verse };
        }
    }
    if (!/\d/.test(q)) {
        const book = findBestBookMatch(q);
        if (book) return { book, chapter: null, verse: null };
    }
    return null;
}

function searchVerses(query) {
    if (!query.trim() || !window.BIBLE_DATA) return [];
    const q = normalise(query.trim());
    const results = [];
    for (const book of ALL_BOOKS) {
        for (let c = 1; c <= book.chapters; c++) {
            const verses = window.BIBLE_DATA[`${book.id}_${c}`];
            if (!verses) continue;
            for (const v of verses) {
                if (normalise(v.text).includes(q)) {
                    results.push({ book, chapter: c, verse: v.verse, text: v.text });
                    if (results.length >= 60) return results;
                }
            }
        }
    }
    return results;
}

function renderSearchInput() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="search-container fade-in">
            <h1 class="bible-heading">${window.t('search')}</h1>
            <div class="search-box">
                <i class="ph ph-magnifying-glass"></i>
                <input type="text" id="searchInput" placeholder="${window.t('searchPlaceholder')}" autocomplete="off" />
            </div>
            <div id="searchResults"></div>
        </div>
    `;

    const searchInput = document.getElementById('searchInput');
    let searchTimer;
    searchInput?.addEventListener('input', e => {
        clearTimeout(searchTimer);
        const q = e.target.value.trim();
        if (!q) { document.getElementById('searchResults').innerHTML = ''; return; }
        searchTimer = setTimeout(() => {
            const directRef = parseReference(q);
            const results = searchVerses(q);
            renderSearchResults(q, results, directRef);
        }, 400);
    });
    searchInput.focus();
}

function renderSearchResults(query, results, directRef = null) {
    const wrap = document.getElementById('searchResults');
    wrap.innerHTML = '';

    if (directRef) {
        const refDiv = document.createElement('div');
        refDiv.className = 'verse-card';
        refDiv.style.marginBottom = '1.5rem';
        refDiv.style.cursor = 'pointer';
        const chapStr = directRef.chapter ? ` ${directRef.chapter}` : '';
        const vStr = directRef.verse ? `:${directRef.verse}` : '';
        refDiv.innerHTML = `
            <div class="verse-header">${window.t('goToRef')}</div>
            <div class="verse-reference">${directRef.book.name}${chapStr}${vStr}</div>
        `;
        refDiv.onclick = () => switchView('bible', { bookId: directRef.book.id, chapter: directRef.chapter || 1, verse: directRef.verse });
        wrap.appendChild(refDiv);
    }

    if (!results.length && !directRef) {
        wrap.innerHTML = `<p style="text-align:center;opacity:.6;margin-top:2rem">${window.t('noResults')}</p>`;
        return;
    }

    const esc = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(${esc})`, 'gi');

    for (const r of results) {
        const div = document.createElement('div');
        div.className = 'verse';
        div.innerHTML = `
            <span class="verse-num">${r.book.name} ${r.chapter}:${r.verse}</span>
            <span class="verse-text" style="font-size:${state.fontSize}rem">
                ${r.text.replace(re, '<mark>$1</mark>')}
            </span>`;
        div.onclick = () => switchView('bible', { bookId: r.book.id, chapter: r.chapter, verse: r.verse });
        wrap.appendChild(div);
    }
}

/* ════════════════════════ HOME DASHBOARD ══════════════════════════ */
function renderHome() {
    const content = document.getElementById('content');

    // Get Verse of the Day (seeded by date)
    const today = new Date();
    const seed = today.getFullYear() * 1000 + (today.getMonth() + 1) * 100 + today.getDate();
    const bookIdx = seed % ALL_BOOKS.length;
    const book = ALL_BOOKS[bookIdx];
    const chapNum = (seed % book.chapters) + 1;
    const key = `${book.id}_${chapNum}`;
    const chapterVerses = window.BIBLE_DATA?.[key] || [];
    const verseIdx = seed % (chapterVerses.length || 1);
    const v = chapterVerses[verseIdx] || { verse: 1, text: 'O Senhor é o meu pastor; nada me faltará.' };

    content.innerHTML = `
        <div class="fade-in">

            <!-- Ações Rápidas -->
            <div class="quick-actions-wrapper">
                <div class="quick-actions">
                    <div class="action-item" onclick="switchView('bible')">
                        <div class="action-circle"><i class="ph ph-book-open"></i></div>
                        <span class="action-label">${window.t('bible').toUpperCase()}</span>
                    </div>
                    <div class="action-item" onclick="switchView('plans')">
                        <div class="action-circle"><i class="ph ph-calendar-blank"></i></div>
                        <span class="action-label">${window.t('plans').toUpperCase()}</span>
                    </div>
                    <div class="action-item" onclick="switchView('daily')">
                        <div class="action-circle"><i class="ph ph-sun"></i></div>
                        <span class="action-label">${window.t('dailyPlan').toUpperCase()}</span>
                    </div>
                    <div class="action-item" onclick="switchView('teens')">
                        <div class="action-circle"><i class="ph ph-lightning"></i></div>
                        <span class="action-label">${window.t('teensPlan').toUpperCase()}</span>
                    </div>
                    <div class="action-item" onclick="switchView('search')">
                        <div class="action-circle"><i class="ph ph-magnifying-glass"></i></div>
                        <span class="action-label">${window.t('search').toUpperCase()}</span>
                    </div>
                </div>
            </div>

            <!-- Card Versículo -->
            <div class="verse-card-wrapper">
                <div class="verse-card" onclick="switchView('bible', {bookId: '${book.id}', chapter: ${chapNum}, verse: ${v.verse}})">
                    <div class="verse-header">${window.t('verseOfDay')}</div>
                    <div class="verse-reference">${book.name} ${chapNum}:${v.verse}</div>
                    <div class="verse-text">${v.text}</div>
                </div>
            </div>
        </div>
    `;
}

/* ════════════════════════ BIBLE SELECTOR ══════════════════════════ */
function renderBibleSelector() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="fade-in">
            <h1 class="bible-heading">${window.t('bible')}</h1>
            <div class="ornament">✦ ✦ ✦</div>
            <div style="padding: 0 1.5rem">
                <h3 class="sidebar-title">${window.t('ot')}</h3>
                <div class="book-grid" id="ot-grid"></div>
                <h3 class="sidebar-title" style="margin-top: 2rem">${window.t('nt')}</h3>
                <div class="book-grid" id="nt-grid"></div>
            </div>
        </div>
    `;

    ['ot', 'nt'].forEach(section => {
        const grid = document.getElementById(section + '-grid');
        BOOKS[section].forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.textContent = book.name;
            card.onclick = () => loadChapter(book.id, 1);
            grid.appendChild(card);
        });
    });
}

function renderVerses(verses, bookName, chapter, targetVerse = null) {
    const content = document.getElementById('content');
    content.innerHTML = '';
    const book = ALL_BOOKS.find(b => b.id === state.bookId);

    // Reader UI
    content.innerHTML = `
        <div class="fade-in">
            <h1 class="bible-heading">${bookName}</h1>
            <div class="bible-subheading">${window.t('chapter')} ${chapter}</div>

            <div class="reading-controls">
                <button class="icon-btn" id="fontDown" title="${window.t('fontDown')}"><i class="ph ph-text-aa"></i>−</button>
                <button class="icon-btn" id="fontUp" title="${window.t('fontUp')}"><i class="ph ph-text-aa"></i>+</button>
                <button class="icon-btn" id="ttsBtn" title="${window.t('listenTitle')}"><i class="ph ph-speaker-high" id="ttsIcon"></i></button>
            </div>

            <div class="ornament">✦ ✦ ✦</div>

            <div class="chapter-row" id="chapterSelector"></div>

            <div id="verseWrap"></div>

            <div class="chap-nav">
                <button class="btn-nav" ${chapter <= 1 ? 'disabled' : ''} id="prevBtn">
                    <i class="ph ph-caret-left"></i> ${window.t('prev')} ${chapter - 1}
                </button>
                <button class="btn-nav" ${chapter >= book.chapters ? 'disabled' : ''} id="nextBtn">
                    ${window.t('next')} ${chapter + 1} <i class="ph ph-caret-right"></i>
                </button>
            </div>
        </div>
    `;

    // Chapter selector
    const row = document.getElementById('chapterSelector');
    for (let c = 1; c <= book.chapters; c++) {
        const btn = document.createElement('button');
        btn.className = 'chap-btn' + (c === chapter ? ' active' : '');
        btn.textContent = c;
        btn.onclick = () => loadChapter(state.bookId, c);
        row.appendChild(btn);
    }

    // Verses
    const verseWrap = document.getElementById('verseWrap');
    verses.forEach(v => {
        const div = document.createElement('div');
        div.className = 'verse';
        if (targetVerse && v.verse === targetVerse) {
            div.classList.add('highlight-target');
            div.id = 'target-verse';
        }
        div.innerHTML = `
            <span class="verse-num">${v.verse}</span>
            <span class="verse-text" style="font-size:${state.fontSize}rem">${v.text}</span>`;
        div.onclick = () => div.classList.toggle('highlight');
        verseWrap.appendChild(div);
    });

    if (targetVerse) {
        setTimeout(() => {
            const el = document.getElementById('target-verse');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => el.classList.remove('highlight-target'), 3000);
            }
        }, 500);
    }

    document.getElementById('prevBtn').onclick = () => loadChapter(state.bookId, chapter - 1);
    document.getElementById('nextBtn').onclick = () => loadChapter(state.bookId, chapter + 1);

    // Re-wire font controls
    document.getElementById('fontUp')?.addEventListener('click', () => {
        state.fontSize = Math.min(2, +(state.fontSize + 0.1).toFixed(1));
        document.querySelectorAll('.verse-text').forEach(el => el.style.fontSize = state.fontSize + 'rem');
        saveConfig();
    });
    document.getElementById('fontDown')?.addEventListener('click', () => {
        state.fontSize = Math.max(0.8, +(state.fontSize - 0.1).toFixed(1));
        document.querySelectorAll('.verse-text').forEach(el => el.style.fontSize = state.fontSize + 'rem');
        saveConfig();
    });

    initTTS();
}

async function loadChapter(bookId, chapter, verse = null) {
    state.bookId = bookId;
    state.chapter = chapter;
    state.currentView = 'bible';
    renderTopBar();

    const loader = document.getElementById('loader');
    const content = document.getElementById('content');
    const errMsg = document.getElementById('error-msg');

    loader?.classList.remove('d-none');
    content?.classList.add('d-none');
    errMsg?.classList.add('d-none');

    try {
        const verses = await fetchChapter(bookId, chapter);
        state.verses = verses;
        renderVerses(verses, ALL_BOOKS.find(b => b.id === bookId).name, chapter, verse);
        loader?.classList.add('d-none');
        content?.classList.remove('d-none');
    } catch (e) {
        loader?.classList.add('d-none');
        if (errMsg) {
            errMsg.classList.remove('d-none');
            errMsg.innerHTML = `
                <div style="text-align:center;padding:2rem">
                    <i class="ph ph-warning-circle" style="font-size:2.5rem;opacity:.5"></i>
                    <p style="margin-top:1rem">${window.t('errorGeneric')}</p>
                    <button onclick="loadChapter('${bookId}',${chapter})" class="btn-nav" style="margin:auto">
                        ${window.t('tryAgain')}
                    </button>
                </div>`;
        }
    }
}

/* ════════════════════════ PLANS ══════════════════════════ */
function renderPlans() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="fade-in">
            <h1 class="bible-heading">${window.t('plans')}</h1>
            <div class="ornament">✦ ✦ ✦</div>
            <div class="settings-list">
<div class="settings-item" onclick="switchView('daily')">
                    <div class="settings-label">📅 ${window.t('planName', 'daily')}</div>
                    <i class="ph ph-caret-right"></i>
                </div>
                <div class="settings-item" id="teensPlanBtn">
                    <div class="settings-label">⚡ ${window.t('title', 'teens')}</div>
                    <i class="ph ph-caret-right"></i>
                </div>
            </div>
        </div>
    `;

    // Teens plan integration handled by its own script via event listeners or manual trigger
    document.getElementById('teensPlanBtn')?.addEventListener('click', () => {
        // Trigger teens plan logic
        if (window.openTeensDashboard) window.openTeensDashboard();
    });
}

/* ════════════════════════ SETTINGS ══════════════════════════ */
function renderSettings() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="fade-in">
            <h1 class="bible-heading">${window.t('settings')}</h1>
            <div class="ornament">✦ ✦ ✦</div>
            <div class="settings-list">
                <div class="settings-item" onclick="document.getElementById('name-modal-overlay').classList.remove('d-none')">
                    <div>
                        <div class="settings-label">${window.t('username')}</div>
                        <div style="font-size: 0.9rem; opacity: 0.6">${state.userName}</div>
                    </div>
                    <i class="ph ph-user-edit"></i>
                </div>
                <div class="settings-item" id="langToggleBtn">
                    <div>
                        <div class="settings-label">${window.t('language')}</div>
                        <div style="font-size: 0.9rem; opacity: 0.6">${state.lang === 'pt' ? 'Português' : 'English'}</div>
                    </div>
                    <i class="ph ph-globe"></i>
                </div>
                <div class="settings-item" id="themeToggleBtn">
                    <div>
                        <div class="settings-label">${window.t('theme')}</div>
                        <div style="font-size: 0.9rem; opacity: 0.6">${state.theme === 'dark' ? window.t('dark') : window.t('light')}</div>
                    </div>
                    <i class="ph ${state.theme === 'dark' ? 'ph-sun' : 'ph-moon'}"></i>
                </div>
            </div>
        </div>
    `;

    document.getElementById('langToggleBtn')?.addEventListener('click', () => {
        state.lang = state.lang === 'pt' ? 'en' : 'pt';
        saveConfig();
        switchView('settings');
        renderTopBar();
    });

    document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);
}

/* ═══════════════════════ TEXT-TO-SPEECH ════════════════════════ */
let _ttsSpeaking = false;
function ttsSetPlaying(on) {
    _ttsSpeaking = on;
    const btn = document.getElementById('ttsBtn');
    const icon = document.getElementById('ttsIcon');
    if (!btn) return;
    btn.classList.toggle('tts-speaking', on);
    if (icon) icon.className = on ? 'ph-fill ph-stop-circle' : 'ph ph-speaker-high';
}

function initTTS() {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const btn = document.getElementById('ttsBtn');
    if (!btn) return;

    function getChapterText() {
        return Array.from(document.querySelectorAll('#content .verse-text'))
            .map(el => el.innerText.trim())
            .filter(Boolean)
            .join(' ');
    }

    function speak() {
        const text = getChapterText();
        if (!text) return;
        synth.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = state.lang === 'pt' ? 'pt-BR' : 'en-US';
        utt.rate = 0.95;

        const voices = synth.getVoices();
        const voice = voices.find(v => v.lang.replace('_', '-') === utt.lang) || voices.find(v => v.lang.startsWith(state.lang));
        if (voice) utt.voice = voice;

        utt.onstart = () => ttsSetPlaying(true);
        utt.onend = () => ttsSetPlaying(false);
        utt.onerror = () => ttsSetPlaying(false);
        synth.speak(utt);
    }

    btn.onclick = () => {
        if (_ttsSpeaking) { synth.cancel(); ttsSetPlaying(false); return; }
        if (synth.getVoices().length === 0) {
            synth.addEventListener('voiceschanged', speak, { once: true });
        } else { speak(); }
    };
}

/* ═══════════════════════ INIT ══════════════════════════════════ */
window.addEventListener('DOMContentLoaded', async () => {
    if (!window.BIBLE_DATA) {
        document.getElementById('loader')?.classList.add('d-none');
        return;
    }

    await initDB();

    // Bottom Nav Events
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    // Profile Modal
    document.getElementById('save-name-btn')?.addEventListener('click', saveProfile);
    document.getElementById('user-name-input')?.addEventListener('keypress', e => {
        if (e.key === 'Enter') saveProfile();
    });

    // Scroll to Top
    const scrollBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        const show = window.scrollY > 300;
        scrollBtn.style.opacity = show ? '1' : '0';
        scrollBtn.classList.toggle('visible', show);
    });
    scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    applyTheme();
    checkProfile();
    switchView('home');
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' })
        .then(reg => {
            reg.update();
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                    }
                });
            });
        });
    let isRefreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (isRefreshing) return;
        isRefreshing = true;
        window.location.reload();
    });
}
