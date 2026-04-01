/**
 * BÍBLIA SAGRADA - OFFLINE SCRIPT
 * Logic: 
 * 1. Initialize IndexedDB.
 * 2. Launch background sync (Genesis to Revelation) automatically.
 * 3. Handle Chapter Loading (DB First -> API Fallback -> Save to DB).
 */

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

/* ── STATE ── */
let state = {
    bookId: 'JHN',
    chapter: 1,
    fontSize: 1.1,
    verses: [],
};

/* ══════════════ OFFLINE STORAGE (IndexedDB) ═════════════ */
const DB_NAME = 'BibleDB';
const DB_VERSION = 1;
const STORE_NAME = 'chapters';
let db = null;

async function initDB() {
    return new Promise((resolve) => {
        if (!window.indexedDB) {
            console.warn("IndexedDB não suportado.");
            resolve(false);
            return;
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            let database = e.target.result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                database.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = (e) => {
            db = e.target.result;
            resolve(true);
        };
        request.onerror = () => resolve(false);
    });
}

async function getChapterFromDB(cacheId) {
    if (!db) return null;
    return new Promise((resolve) => {
        try {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.get(cacheId);
            request.onsuccess = () => resolve(request.result ? request.result.verses : null);
            request.onerror = () => resolve(null);
        } catch (e) { resolve(null); }
    });
}

async function saveChapterToDB(cacheId, verses) {
    if (!db) return;
    return new Promise((resolve) => {
        try {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const request = store.put({ id: cacheId, verses: verses, timestamp: Date.now() });
            request.onsuccess = () => resolve();
            request.onerror = () => resolve();
        } catch (e) { resolve(); }
    });
}

/* ══════════════ BACKGROUND SYNC ═════════════════════════ */
let isSyncing = false;
let syncPaused = false;

function setSyncUI(text, status = 'loading') {
    const st = document.getElementById('syncStatus');
    if (!st) return;
    const txt = document.getElementById('syncText');
    const icon = st.querySelector('i');

    st.style.display = 'flex';
    txt.textContent = text;
    st.className = 'sync-status';

    if (status === 'success') {
        st.classList.add('success');
        icon.className = 'bi bi-check-circle-fill';
        setTimeout(() => st.style.opacity = '0', 5000);
    } else if (status === 'error' || status === 'paused') {
        st.classList.add('error');
        icon.className = status === 'paused' ? 'bi bi-pause-circle-fill' : 'bi bi-exclamation-circle-fill';
    } else {
        st.style.opacity = '1';
        icon.className = 'bi bi-cloud-arrow-down-fill';
    }
}

async function startBackgroundSync() {
    if (isSyncing || !db) return;
    isSyncing = true;
    syncPaused = false;

    setSyncUI('Sincronizando capítulos para uso offline...');

    let downloadedCount = 0;
    let totalChapters = ALL_BOOKS.reduce((acc, book) => acc + book.chapters, 0);
    let consecutiveErrors = 0;

    for (const book of ALL_BOOKS) {
        if (syncPaused) break;
        for (let c = 1; c <= book.chapters; c++) {
            if (syncPaused) break;
            if (!navigator.onLine) {
                syncPaused = true;
                setSyncUI('Offline: Sincronização pausada', 'paused');
                break;
            }

            const cacheId = `${book.id}_${c}`;
            const cached = await getChapterFromDB(cacheId);

            if (!cached) {
                setSyncUI(`Baixando: ${book.name} ${c}...`);
                try {
                    const verses = await fetchChapterFromAPI(book.id, c);
                    await saveChapterToDB(cacheId, verses);
                    consecutiveErrors = 0;
                    await new Promise(r => setTimeout(r, 600)); // Rate limit protection
                } catch (e) {
                    consecutiveErrors++;
                    if (consecutiveErrors >= 3) {
                        syncPaused = true;
                        setSyncUI('Erro na conexão. Retentando em breve...', 'error');
                        setTimeout(startBackgroundSync, 60000);
                        break;
                    }
                }
            }
            downloadedCount++;
        }
    }
    isSyncing = false;
    if (!syncPaused) setSyncUI('Todos os capítulos salvos offline!', 'success');
}

/* ══════════════ API FETCH LOGIC ════════════════════════ */
const API_BASE = 'https://bible-api.com/';

async function fetchChapterFromAPI(bookId, chapter) {
    const nameMap = {
        GEN: 'genesis', EXO: 'exodus', LEV: 'leviticus', NUM: 'numbers', DEU: 'deuteronomy',
        JOS: 'joshua', JDG: 'judges', RUT: 'ruth', '1SA': '1+samuel', '2SA': '2+samuel',
        '1KI': '1+kings', '2KI': '2+kings', '1CH': '1+chronicles', '2CH': '2+chronicles',
        EZR: 'ezra', NEH: 'nehemiah', EST: 'esther', JOB: 'job', PSA: 'psalms', PRO: 'proverbs',
        ECC: 'ecclesiastes', SNG: 'song+of+solomon', ISA: 'isaiah', JER: 'jeremiah',
        LAM: 'lamentations', EZK: 'ezequiel', DAN: 'daniel', HOS: 'hosea', JOL: 'joel',
        AMO: 'amos', OBA: 'obadiah', JON: 'jonah', MIC: 'micah', NAM: 'naum', HAB: 'habakkuk',
        ZEP: 'zephaniah', HAG: 'haggai', ZEC: 'zechariah', MAL: 'malachi',
        MAT: 'matthew', MRK: 'mark', LUK: 'luke', JHN: 'john', ACT: 'acts', ROM: 'romans',
        '1CO': '1+corinthians', '2CO': '2+corinthians', GAL: 'galatians', EPH: 'ephesians',
        PHP: 'philippians', COL: 'colossians', '1TH': '1+thessalonians', '2TH': '2+thessalonians',
        '1TI': '1+timothy', '2TI': '2+timothy', TIT: 'titus', PHM: 'philemon', HEB: 'hebrews',
        JAS: 'james', '1PE': '1+peter', '2PE': '2+peter', '1JN': '1+john', '2JN': '2+john',
        '3JN': '3+john', JUD: 'jude', REV: 'revelation'
    };

    const slug = nameMap[bookId] || bookId.toLowerCase();
    const url = `${API_BASE}${slug}+${chapter}?translation=almeida`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const data = await res.json();
    return data.verses;
}

async function fetchChapter(bookId, chapter) {
    const cacheId = `${bookId}_${chapter}`;
    const cachedVerses = await getChapterFromDB(cacheId);
    if (cachedVerses) return cachedVerses;

    if (!navigator.onLine) throw new Error('Offline e capítulo não baixado.');

    const verses = await fetchChapterFromAPI(bookId, chapter);
    await saveChapterToDB(cacheId, verses);
    return verses;
}

/* ══════════════ UI & NAVIGATION ═════════════════════════ */
function buildSidebar() {
    ['ot', 'nt'].forEach(section => {
        const container = document.getElementById(section + 'Books');
        if (!container) return;
        BOOKS[section].forEach(book => {
            const btn = document.createElement('button');
            btn.className = 'book-btn';
            btn.textContent = book.name;
            btn.dataset.id = book.id;
            btn.onclick = () => loadBook(book.id, 1);
            container.appendChild(btn);
        });
    });
}

function updateActiveBook() {
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.id === state.bookId);
    });
}

function renderVerses(verses, bookName, chapter) {
    const content = document.getElementById('content');
    if (!content) return;
    content.innerHTML = '';
    content.className = 'fade-in';

    const header = document.createElement('div');
    header.innerHTML = `
    <h1 class="bible-heading">${bookName}</h1>
    <div class="bible-subheading">Capítulo ${chapter}</div>
    <div class="ornament">✦ ✦ ✦</div>
    <div class="chapter-row"></div>
  `;
    content.appendChild(header);

    const book = ALL_BOOKS.find(b => b.id === state.bookId);
    const row = header.querySelector('.chapter-row');
    for (let c = 1; c <= book.chapters; c++) {
        const btn = document.createElement('button');
        btn.className = 'chap-btn' + (c === chapter ? ' active' : '');
        btn.textContent = c;
        btn.onclick = () => loadChapter(state.bookId, c);
        row.appendChild(btn);
    }

    const verseContainer = document.createElement('div');
    verses.forEach(v => {
        const vDiv = document.createElement('div');
        vDiv.className = 'verse';
        vDiv.innerHTML = `<span class="verse-num">${v.verse}</span><span class="verse-text" style="font-size:${state.fontSize}rem">${v.text.trim()}</span>`;
        vDiv.onclick = () => vDiv.classList.toggle('highlight');
        verseContainer.appendChild(vDiv);
    });
    content.appendChild(verseContainer);

    const nav = document.createElement('div');
    nav.className = 'chap-nav';
    nav.innerHTML = `
    <button class="btn-nav" ${chapter <= 1 ? 'disabled' : ''} id="prevBtn"><i class="bi bi-chevron-left"></i> Cap ${chapter - 1}</button>
    <button class="btn-nav" ${chapter >= book.chapters ? 'disabled' : ''} id="nextBtn">Cap ${chapter + 1} <i class="bi bi-chevron-right"></i></button>
  `;
    content.appendChild(nav);

    document.getElementById('prevBtn').onclick = () => loadChapter(state.bookId, chapter - 1);
    document.getElementById('nextBtn').onclick = () => loadChapter(state.bookId, chapter + 1);

    if (window.innerWidth < 768) closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadChapter(bookId, chapter) {
    state.bookId = bookId;
    state.chapter = chapter;
    updateActiveBook();
    
    document.getElementById('loader')?.classList.remove('d-none');
    document.getElementById('content')?.classList.add('d-none');
    document.getElementById('error-msg')?.classList.add('d-none');

    try {
        const verses = await fetchChapter(bookId, chapter);
        state.verses = verses;
        const book = ALL_BOOKS.find(b => b.id === bookId);
        renderVerses(verses, book.name, chapter);
        document.getElementById('loader')?.classList.add('d-none');
        document.getElementById('content')?.classList.remove('d-none');
    } catch (e) {
        document.getElementById('loader')?.classList.add('d-none');
        const err = document.getElementById('error-msg');
        err.classList.remove('d-none');
        err.innerHTML = `Erro: ${e.message} <br><br> <button onclick="loadChapter('${bookId}',${chapter})" class="btn-nav" style="margin:auto">Tentar Novamente</button>`;
    }
}

function loadBook(bookId, chapter) { loadChapter(bookId, chapter || 1); }

/* ── SIDEBAR CONTROLS ── */
function closeSidebar() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('backdrop')?.classList.remove('visible');
}

/* ══════════════ INIT ═════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', async () => {
    buildSidebar();
    const dbReady = await initDB();
    await loadChapter('JHN', 1);

    if (dbReady) {
        // Automatically start downloading every chapter in background
        setTimeout(startBackgroundSync, 2000);
    }
});

// Font size controls
document.getElementById('fontUp')?.addEventListener('click', () => {
    state.fontSize = Math.min(2, state.fontSize + 0.1);
    document.querySelectorAll('.verse-text').forEach(el => el.style.fontSize = state.fontSize + 'rem');
});
document.getElementById('fontDown')?.addEventListener('click', () => {
    state.fontSize = Math.max(0.8, state.fontSize - 0.1);
    document.querySelectorAll('.verse-text').forEach(el => el.style.fontSize = state.fontSize + 'rem');
});