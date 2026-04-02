/**
 * BÍBLIA SAGRADA — 100% OFFLINE
 *
 * Data source: js/bible-data.js (generated from por-almeida_usfx.xml)
 * Add to index.html BEFORE this file:
 *   <script src="js/bible-data.js"></script>
 *
 * No API calls. No network. No CORS. Works forever offline.
 *
 * window.BIBLE_DATA = { "GEN_1": [{verse:1, text:"..."}, ...], ... }
 */

/* ══════════════════════════ BOOK DATA ═══════════════════════════ */
const BOOKS = {
    ot: [
        { id:'GEN', name:'Gênesis',       chapters:50  },
        { id:'EXO', name:'Êxodo',         chapters:40  },
        { id:'LEV', name:'Levítico',      chapters:27  },
        { id:'NUM', name:'Números',       chapters:36  },
        { id:'DEU', name:'Deuteronômio',  chapters:34  },
        { id:'JOS', name:'Josué',         chapters:24  },
        { id:'JDG', name:'Juízes',        chapters:21  },
        { id:'RUT', name:'Rute',          chapters:4   },
        { id:'1SA', name:'1 Samuel',      chapters:31  },
        { id:'2SA', name:'2 Samuel',      chapters:24  },
        { id:'1KI', name:'1 Reis',        chapters:22  },
        { id:'2KI', name:'2 Reis',        chapters:25  },
        { id:'1CH', name:'1 Crônicas',    chapters:29  },
        { id:'2CH', name:'2 Crônicas',    chapters:36  },
        { id:'EZR', name:'Esdras',        chapters:10  },
        { id:'NEH', name:'Neemias',       chapters:13  },
        { id:'EST', name:'Ester',         chapters:10  },
        { id:'JOB', name:'Jó',            chapters:42  },
        { id:'PSA', name:'Salmos',        chapters:150 },
        { id:'PRO', name:'Provérbios',    chapters:31  },
        { id:'ECC', name:'Eclesiastes',   chapters:12  },
        { id:'SNG', name:'Cânticos',      chapters:8   },
        { id:'ISA', name:'Isaías',        chapters:66  },
        { id:'JER', name:'Jeremias',      chapters:52  },
        { id:'LAM', name:'Lamentações',   chapters:5   },
        { id:'EZK', name:'Ezequiel',      chapters:48  },
        { id:'DAN', name:'Daniel',        chapters:12  },
        { id:'HOS', name:'Oséias',        chapters:14  },
        { id:'JOL', name:'Joel',          chapters:3   },
        { id:'AMO', name:'Amós',          chapters:9   },
        { id:'OBA', name:'Obadias',       chapters:1   },
        { id:'JON', name:'Jonas',         chapters:4   },
        { id:'MIC', name:'Miquéias',      chapters:7   },
        { id:'NAM', name:'Naum',          chapters:3   },
        { id:'HAB', name:'Habacuque',     chapters:3   },
        { id:'ZEP', name:'Sofonias',      chapters:3   },
        { id:'HAG', name:'Ageu',          chapters:2   },
        { id:'ZEC', name:'Zacarias',      chapters:14  },
        { id:'MAL', name:'Malaquias',     chapters:4   },
    ],
    nt: [
        { id:'MAT', name:'Mateus',            chapters:28 },
        { id:'MRK', name:'Marcos',            chapters:16 },
        { id:'LUK', name:'Lucas',             chapters:24 },
        { id:'JHN', name:'João',              chapters:21 },
        { id:'ACT', name:'Atos',              chapters:28 },
        { id:'ROM', name:'Romanos',           chapters:16 },
        { id:'1CO', name:'1 Coríntios',       chapters:16 },
        { id:'2CO', name:'2 Coríntios',       chapters:13 },
        { id:'GAL', name:'Gálatas',           chapters:6  },
        { id:'EPH', name:'Efésios',           chapters:6  },
        { id:'PHP', name:'Filipenses',        chapters:4  },
        { id:'COL', name:'Colossenses',       chapters:4  },
        { id:'1TH', name:'1 Tessalonicenses', chapters:5  },
        { id:'2TH', name:'2 Tessalonicenses', chapters:3  },
        { id:'1TI', name:'1 Timóteo',         chapters:6  },
        { id:'2TI', name:'2 Timóteo',         chapters:4  },
        { id:'TIT', name:'Tito',              chapters:3  },
        { id:'PHM', name:'Filemom',           chapters:1  },
        { id:'HEB', name:'Hebreus',           chapters:13 },
        { id:'JAS', name:'Tiago',             chapters:5  },
        { id:'1PE', name:'1 Pedro',           chapters:5  },
        { id:'2PE', name:'2 Pedro',           chapters:3  },
        { id:'1JN', name:'1 João',            chapters:5  },
        { id:'2JN', name:'2 João',            chapters:1  },
        { id:'3JN', name:'3 João',            chapters:1  },
        { id:'JUD', name:'Judas',             chapters:1  },
        { id:'REV', name:'Apocalipse',        chapters:22 },
    ]
};

const ALL_BOOKS = [...BOOKS.ot, ...BOOKS.nt];

/* ══════════════════════════ STATE ══════════════════════════════ */
let state = { bookId:'JHN', chapter:1, fontSize:1.1, verses:[] };

/* ═══════════════════════ INDEXEDDB CACHE ═══════════════════════ */
const DB_NAME    = 'BibleDB_local';
const DB_VERSION = 1;
const STORE      = 'chapters';
let db = null;

function initDB() {
    return new Promise(resolve => {
        if (!window.indexedDB) { resolve(false); return; }
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = e => {
            const d = e.target.result;
            if (!d.objectStoreNames.contains(STORE))
                d.createObjectStore(STORE, { keyPath:'id' });
        };
        req.onsuccess  = e => { db = e.target.result; resolve(true); };
        req.onerror    = () => resolve(false);
    });
}

function dbGet(key) {
    return new Promise(resolve => {
        if (!db) { resolve(null); return; }
        try {
            const req = db.transaction(STORE,'readonly').objectStore(STORE).get(key);
            req.onsuccess = () => resolve(req.result?.verses ?? null);
            req.onerror   = () => resolve(null);
        } catch { resolve(null); }
    });
}

function dbPut(key, verses) {
    if (!db) return;
    try {
        db.transaction(STORE,'readwrite').objectStore(STORE)
          .put({ id:key, verses });
    } catch {}
}

/* ═══════════════════ CHAPTER LOADING ═══════════════════════════ */
async function fetchChapter(bookId, chapter) {
    const key = `${bookId}_${chapter}`;

    // 1 — IndexedDB warm cache
    const cached = await dbGet(key);
    if (cached) return cached;

    // 2 — Bundled data (always present)
    const verses = window.BIBLE_DATA?.[key];
    if (verses) {
        dbPut(key, verses);
        return verses;
    }

    throw new Error(`Capítulo não encontrado: ${key}`);
}

/* ══════════════════════════ SEARCH ════════════════════════════ */
function normalise(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
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
                    results.push({ book, chapter:c, verse:v.verse, text:v.text });
                    if (results.length >= 60) return results;
                }
            }
        }
    }
    return results;
}

function renderSearch(query, results) {
    const content = document.getElementById('content');
    content.innerHTML = '';
    content.className = 'fade-in';
    const esc = query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const re  = new RegExp(`(${esc})`, 'gi');

    content.innerHTML = `
        <h1 class="bible-heading">Busca</h1>
        <div class="bible-subheading">"${query}" — ${results.length} resultado(s)</div>
        <div class="ornament">✦ ✦ ✦</div>`;

    if (!results.length) {
        content.innerHTML += `<p style="text-align:center;opacity:.6;margin-top:2rem">Nenhum versículo encontrado.</p>`;
        return;
    }

    const wrap = document.createElement('div');
    for (const r of results) {
        const div = document.createElement('div');
        div.className = 'verse';
        div.style.cursor = 'pointer';
        div.innerHTML = `
            <span class="verse-num" style="min-width:5rem;font-size:.75rem">
                ${r.book.name.slice(0,3)} ${r.chapter}:${r.verse}
            </span>
            <span class="verse-text" style="font-size:${state.fontSize}rem">
                ${r.text.replace(re,'<mark>$1</mark>')}
            </span>`;
        div.onclick = () => loadChapter(r.book.id, r.chapter);
        wrap.appendChild(div);
    }
    content.appendChild(wrap);
    window.scrollTo({ top:0, behavior:'smooth' });
}

/* ═══════════════════════ RENDER UI ═════════════════════════════ */
function buildSidebar() {
    ['ot','nt'].forEach(section => {
        const container = document.getElementById(section + 'Books');
        if (!container) return;
        BOOKS[section].forEach(book => {
            const btn = document.createElement('button');
            btn.className   = 'book-btn';
            btn.textContent = book.name;
            btn.dataset.id  = book.id;
            btn.onclick     = () => loadChapter(book.id, 1);
            container.appendChild(btn);
        });
    });
}

function updateActiveBook() {
    document.querySelectorAll('.book-btn').forEach(btn =>
        btn.classList.toggle('active', btn.dataset.id === state.bookId));
}

function renderVerses(verses, bookName, chapter) {
    const content = document.getElementById('content');
    content.innerHTML = '';
    content.className = 'fade-in';
    const book = ALL_BOOKS.find(b => b.id === state.bookId);

    // Header
    const header = document.createElement('div');
    header.innerHTML = `
        <h1 class="bible-heading">${bookName}</h1>
        <div class="bible-subheading">Capítulo ${chapter}</div>
        <div class="ornament">✦ ✦ ✦</div>
        <div class="chapter-row"></div>`;
    content.appendChild(header);

    // Chapter selector
    const row = header.querySelector('.chapter-row');
    for (let c = 1; c <= book.chapters; c++) {
        const btn = document.createElement('button');
        btn.className   = 'chap-btn' + (c === chapter ? ' active' : '');
        btn.textContent = c;
        btn.onclick     = () => loadChapter(state.bookId, c);
        row.appendChild(btn);
    }

    // Verses
    const verseWrap = document.createElement('div');
    verses.forEach(v => {
        const div = document.createElement('div');
        div.className = 'verse';
        div.innerHTML = `
            <span class="verse-num">${v.verse}</span>
            <span class="verse-text" style="font-size:${state.fontSize}rem">${v.text}</span>`;
        div.onclick = () => div.classList.toggle('highlight');
        verseWrap.appendChild(div);
    });
    content.appendChild(verseWrap);

    // Prev / Next navigation
    const nav = document.createElement('div');
    nav.className = 'chap-nav';
    nav.innerHTML = `
        <button class="btn-nav" ${chapter<=1?'disabled':''} id="prevBtn">
            <i class="bi bi-chevron-left"></i> Cap ${chapter-1}
        </button>
        <button class="btn-nav" ${chapter>=book.chapters?'disabled':''} id="nextBtn">
            Cap ${chapter+1} <i class="bi bi-chevron-right"></i>
        </button>`;
    content.appendChild(nav);

    document.getElementById('prevBtn').onclick = () => loadChapter(state.bookId, chapter-1);
    document.getElementById('nextBtn').onclick = () => loadChapter(state.bookId, chapter+1);

    if (window.innerWidth < 768) closeSidebar();
    window.scrollTo({ top:0, behavior:'smooth' });
}

/* ═══════════════════ LOAD CHAPTER ═════════════════════════════ */
async function loadChapter(bookId, chapter) {
    // Stop any ongoing TTS when navigating to a new chapter
    window.speechSynthesis?.cancel();
    ttsSetPlaying(false);

    state.bookId  = bookId;
    state.chapter = chapter;
    updateActiveBook();

    const loader  = document.getElementById('loader');
    const content = document.getElementById('content');
    const errMsg  = document.getElementById('error-msg');

    loader?.classList.remove('d-none');
    content?.classList.add('d-none');
    errMsg?.classList.add('d-none');

    try {
        const verses = await fetchChapter(bookId, chapter);
        state.verses = verses;
        renderVerses(verses, ALL_BOOKS.find(b=>b.id===bookId).name, chapter);
        loader?.classList.add('d-none');
        content?.classList.remove('d-none');
    } catch(e) {
        loader?.classList.add('d-none');
        if (errMsg) {
            errMsg.classList.remove('d-none');
            errMsg.innerHTML = `
                <div style="text-align:center;padding:2rem">
                    <i class="bi bi-exclamation-circle" style="font-size:2.5rem;opacity:.5"></i>
                    <p style="margin-top:1rem">${e.message}</p>
                    <button onclick="loadChapter('${bookId}',${chapter})" class="btn-nav" style="margin:auto">
                        Tentar Novamente
                    </button>
                </div>`;
        }
    }
}

/* ═══════════════════ SIDEBAR ═══════════════════════════════════ */
function closeSidebar() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('backdrop')?.classList.remove('visible');
}

/* ═══════════════════════ TEXT-TO-SPEECH ════════════════════════
 * Uses the Web Speech API (SpeechSynthesis).
 * The button #tts-wrap is hidden by default in HTML; we reveal it
 * here only if the browser supports the API.
 *
 * Flow:
 *  • Click Ouvir  → reads all verse text of the current chapter
 *  • Click Parar  → cancels immediately
 *  • Navigate     → auto-cancelled at the top of loadChapter()
 *  • Voices       → prefers pt-BR, falls back to any pt-* voice
 * ════════════════════════════════════════════════════════════════ */
let _ttsSpeaking = false;

function ttsSetPlaying(on) {
    _ttsSpeaking = on;
    const btn   = document.getElementById('ttsBtn');
    const icon  = document.getElementById('ttsIcon');
    const label = document.getElementById('ttsLabel');
    if (!btn) return;
    btn.classList.toggle('tts-speaking', on);
    if (icon)  icon.className    = on ? 'bi bi-stop-fill' : 'bi bi-volume-up-fill';
    if (label) label.textContent = on ? 'Parar' : 'Ouvir';
}

function initTTS() {
    const synth = window.speechSynthesis;
    if (!synth) return;                          // API not available — leave button hidden

    const wrap = document.getElementById('tts-wrap');
    const btn  = document.getElementById('ttsBtn');
    if (!wrap || !btn) return;

    wrap.style.display = 'flex';                 // reveal the button now that we know it works

    function getChapterText() {
        // Read verse text directly from the DOM so it always matches
        // whatever is currently displayed (chapter OR search results).
        return Array.from(document.querySelectorAll('#content .verse-text'))
            .map(el => el.innerText.trim())
            .filter(Boolean)
            .join(' ');
    }

    function pickVoice() {
        const voices = synth.getVoices();
        return voices.find(v => v.lang === 'pt-BR')
            || voices.find(v => v.lang.startsWith('pt'))
            || null;
    }

    function speak() {
        const text = getChapterText();
        if (!text) return;

        // Chrome sometimes keeps a stale "speaking" state — cancel first
        synth.cancel();

        const utt   = new SpeechSynthesisUtterance(text);
        utt.lang    = 'pt-BR';
        utt.rate    = 0.92;   // slightly slower than default — better for formal text
        utt.pitch   = 1;

        const voice = pickVoice();
        if (voice) utt.voice = voice;

        utt.onstart = () => ttsSetPlaying(true);
        utt.onend   = () => ttsSetPlaying(false);
        utt.onerror = () => ttsSetPlaying(false);

        synth.speak(utt);
    }

    btn.addEventListener('click', () => {
        if (_ttsSpeaking) {
            synth.cancel();
            ttsSetPlaying(false);
            return;
        }

        // Voices load asynchronously on first call in some browsers (Chrome).
        // If the list is empty, wait for the voiceschanged event then speak.
        if (synth.getVoices().length === 0) {
            synth.addEventListener('voiceschanged', speak, { once: true });
        } else {
            speak();
        }
    });
}

/* ═══════════════════════ INIT ══════════════════════════════════ */
window.addEventListener('DOMContentLoaded', async () => {

    // Guard: bible-data.js must be loaded first
    if (!window.BIBLE_DATA) {
        document.getElementById('loader')?.classList.add('d-none');
        const errMsg = document.getElementById('error-msg');
        if (errMsg) {
            errMsg.classList.remove('d-none');
            errMsg.innerHTML = `
                <div style="text-align:center;padding:3rem;line-height:2">
                    <i class="bi bi-file-earmark-x" style="font-size:3rem;opacity:.5"></i>
                    <h3 style="margin-top:1rem">Arquivo de dados não encontrado</h3>
                    <p>Adicione ao <code>index.html</code> antes de <code>script.js</code>:</p>
                    <code style="background:rgba(0,0,0,.2);padding:.5rem 1.2rem;border-radius:6px">
                        &lt;script src="js/bible-data.js"&gt;&lt;/script&gt;
                    </code>
                </div>`;
        }
        return;
    }

    buildSidebar();
    await initDB();
    initTTS();

    // Font controls
    document.getElementById('fontUp')?.addEventListener('click', () => {
        state.fontSize = Math.min(2, +(state.fontSize+0.1).toFixed(1));
        document.querySelectorAll('.verse-text').forEach(el => el.style.fontSize = state.fontSize+'rem');
    });
    document.getElementById('fontDown')?.addEventListener('click', () => {
        state.fontSize = Math.max(0.8, +(state.fontSize-0.1).toFixed(1));
        document.querySelectorAll('.verse-text').forEach(el => el.style.fontSize = state.fontSize+'rem');
    });

    // Search (debounced — searches all 31k verses instantly from bundled data)
    let searchTimer;
    document.getElementById('searchInput')?.addEventListener('input', e => {
        clearTimeout(searchTimer);
        const q = e.target.value.trim();
        if (!q) { loadChapter(state.bookId, state.chapter); return; }
        searchTimer = setTimeout(() => {
            const results = searchVerses(q);
            renderSearch(q, results);
        }, 400);
    });

    // Keyboard navigation ← →
    document.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT') return;
        const book = ALL_BOOKS.find(b => b.id === state.bookId);
        if (!book) return;
        if (e.key === 'ArrowRight' && state.chapter < book.chapters)
            loadChapter(state.bookId, state.chapter + 1);
        if (e.key === 'ArrowLeft' && state.chapter > 1)
            loadChapter(state.bookId, state.chapter - 1);
    });

    // Scroll-to-top button
    const scrollBtn = document.getElementById('scrollTop');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            const show = window.scrollY > 300;
            scrollBtn.style.opacity       = show ? '1' : '0';
            scrollBtn.style.pointerEvents = show ? 'auto' : 'none';
        });
        scrollBtn.addEventListener('click', () =>
            window.scrollTo({ top:0, behavior:'smooth' }));
    }

    // Load first chapter
    await loadChapter('JHN', 1);
});