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

/* ══════════════════════════ BIBLE VERSIONS ══════════════════════ */
const BIBLE_VERSIONS = [
    { id: 'ara', abbr: 'ARA', name: 'Almeida Revisada Atualizada' },
    { id: 'acf', abbr: 'ACF', name: 'Almeida Corrigida e Fiel' },
    { id: 'nvi', abbr: 'NVI', name: 'Nova Versão Internacional' },
    { id: 'ar_svd', abbr: 'SVD', name: 'The Arabic Bible (Arabic)' },
    { id: 'zh_cuv', abbr: 'CUV', name: 'Chinese Union Version (Chinese)' },
    { id: 'zh_ncv', abbr: 'NCV', name: 'New Chinese Version (Chinese)' },
    { id: 'de_schlachter', abbr: 'SCH', name: 'Schlachter (German)' },
    { id: 'el_greek', abbr: 'MGR', name: 'Modern Greek (Greek)' },
    { id: 'en_bbe', abbr: 'BBE', name: 'Basic English (English)' },
    { id: 'en_kjv', abbr: 'KJV', name: 'King James Version (English)' },
    { id: 'eo_esperanto', abbr: 'ESP', name: 'Esperanto (Esperanto)' },
    { id: 'es_rvr', abbr: 'RVR', name: 'Reina Valera (Spanish)' },
    { id: 'fi_finnish', abbr: 'FIN', name: 'Finnish Bible (Finnish)' },
    { id: 'fi_pr', abbr: 'PR', name: 'Pyhä Raamattu (Finnish)' },
    { id: 'fr_apee', abbr: 'APEE', name: "Le Bible de l'Épée (French)" },
    { id: 'ko_ko', abbr: 'KOR', name: 'Korean Version (Korean)' },
    { id: 'ro_cornilescu', abbr: 'VDC', name: 'Versiunea Dumitru Cornilescu (Romanian)' },
    { id: 'ru_synodal', abbr: 'RST', name: 'Синодальный перевод (Russian)' },
    { id: 'vi_vietnamese', abbr: 'VIE', name: 'Tiếng Việt (Vietnamese)' },
];

function getBibleData(versionId) {
    switch (versionId) {
        case 'acf': return window.BIBLE_DATA_ACF;
        case 'nvi': return window.BIBLE_DATA_NVI;
        case 'ar_svd': return window.BIBLE_DATA_AR_SVD;
        case 'zh_cuv': return window.BIBLE_DATA_ZH_CUV;
        case 'zh_ncv': return window.BIBLE_DATA_ZH_NCV;
        case 'de_schlachter': return window.BIBLE_DATA_DE_SCHLACHTER;
        case 'el_greek': return window.BIBLE_DATA_EL_GREEK;
        case 'en_bbe': return window.BIBLE_DATA_EN_BBE;
        case 'en_kjv': return window.BIBLE_DATA_EN_KJV;
        case 'eo_esperanto': return window.BIBLE_DATA_EO_ESPERANTO;
        case 'es_rvr': return window.BIBLE_DATA_ES_RVR;
        case 'fi_finnish': return window.BIBLE_DATA_FI_FINNISH;
        case 'fi_pr': return window.BIBLE_DATA_FI_PR;
        case 'fr_apee': return window.BIBLE_DATA_FR_APEE;
        case 'ko_ko': return window.BIBLE_DATA_KO_KO;
        case 'ro_cornilescu': return window.BIBLE_DATA_RO_CORNILESCU;
        case 'ru_synodal': return window.BIBLE_DATA_RU_SYNODAL;
        case 'vi_vietnamese': return window.BIBLE_DATA_VI_VIETNAMESE;
        case 'ara':
        default: return window.BIBLE_DATA;
    }
}

/* ══════════════════════════ APP LANGUAGES ════════════════════════ */
const LANGUAGES = [
    { id: 'pt', abbr: 'PT', name: 'Português' },
    { id: 'en', abbr: 'EN', name: 'English' },
    { id: 'es', abbr: 'ES', name: 'Español' },
    { id: 'fr', abbr: 'FR', name: 'Français' },
    { id: 'de', abbr: 'DE', name: 'Deutsch' },
    { id: 'ar', abbr: 'AR', name: 'العربية' },
    { id: 'zh', abbr: 'ZH', name: '中文' },
    { id: 'el', abbr: 'EL', name: 'Ελληνικά' },
    { id: 'eo', abbr: 'EO', name: 'Esperanto' },
    { id: 'fi', abbr: 'FI', name: 'Suomi' },
    { id: 'ko', abbr: 'KO', name: '한국어' },
    { id: 'ro', abbr: 'RO', name: 'Română' },
    { id: 'ru', abbr: 'RU', name: 'Русский' },
    { id: 'vi', abbr: 'VI', name: 'Tiếng Việt' },
];

// Locale codes used for date formatting and speech synthesis.
const LOCALE_MAP = {
    pt: 'pt-BR', en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', ar: 'ar-SA',
    zh: 'zh-CN', el: 'el-GR', eo: 'eo', fi: 'fi-FI', ko: 'ko-KR', ro: 'ro-RO',
    ru: 'ru-RU', vi: 'vi-VN',
};

// Right-to-left languages need the document direction flipped.
const RTL_LANGS = ['ar'];
window.applyDocumentDirection = function (lang) {
    const isRtl = RTL_LANGS.includes(lang);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = window.langLocale(lang);
};
window.LOCALE_MAP = LOCALE_MAP;
window.langLocale = function (lang) {
    return LOCALE_MAP[lang] || LOCALE_MAP.pt;
};

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
        tabSearch: 'Busca',
        tabAssistant: 'Assistente IA',
        assistantIntro: 'Encontre versículos por tema, instantaneamente e sem internet — tudo roda no seu dispositivo.',
        assistantTopicPlaceholder: 'Digite um tema (ex: perdão, medo, fé)...',
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
        version: 'Versão da Bíblia',
        chooseVersion: 'Escolher versão da Bíblia',
        chooseLanguage: 'Escolher idioma do app',
        dailyPlan: 'Diário',
        teensPlan: 'Teens',
        chapterWord: 'capítulo',
        chaptersWord: 'capítulos',
        chaptersLabel: 'Capítulos',
        otherPlans: 'OUTROS PLANOS',
        privacy: {
            navLabel: 'Privacidade e Dados',
            heroTitle: 'Seu estudo bíblico pertence a você.',
            heroDesc: 'Tudo o que você grava aqui — progresso, preferências, notas — fica somente neste dispositivo. Nada é enviado para nenhum servidor.',
            badgeLocal: '🔒 100% local', badgeNoTrack: '🚫 Sem rastreamento', badgeNoAds: '🚫 Sem anúncios', badgeNoSell: '🚫 Nunca vendemos dados',
            exportTitle: 'Exportar meus dados', exportDesc: 'Baixe uma cópia de tudo em um arquivo',
            importTitle: 'Importar backup', importDesc: 'Restaure a partir de um arquivo salvo',
            deleteTitle: 'Apagar tudo', deleteDesc: 'Remove permanentemente todos os dados deste aparelho',
            policyLink: 'Ler política de privacidade completa',
            exportModalTitle: 'Exportar seus dados', exportModalSub: 'Um arquivo com suas preferências e progresso de leitura.',
            choicePlainTitle: 'Arquivo simples (.json)', choicePlainDesc: 'Legível, fácil de conferir. Guarde em local de confiança.',
            choiceEncTitle: 'Arquivo protegido por senha', choiceEncDesc: 'Criptografado no seu dispositivo — recomendado se for guardar na nuvem.',
            passphraseLabel: 'Crie uma senha para este backup', passphraseHint: 'Você vai precisar dela para importar este arquivo depois. Não a perca — não há como recuperá-la.',
            downloadBtn: 'Baixar arquivo', exportedOk: '✓ Arquivo baixado com sucesso',
            importModalTitle: 'Importar backup', importModalSub: 'Selecione o arquivo exportado anteriormente.',
            fileDropLabel: 'Toque para escolher o arquivo', fileChosen: 'Arquivo selecionado',
            importPassphraseLabel: 'Senha do backup', importBtn: 'Restaurar dados',
            importedOk: '✓ Dados restaurados. Recarregando…', importInvalid: 'Arquivo inválido ou corrompido.',
            importWrongPass: 'Senha incorreta. Tente novamente.', importNeedsPass: 'Este arquivo é protegido por senha.',
            deleteModalTitle: 'Apagar todos os dados?', deleteModalSub: 'Esta ação não pode ser desfeita.',
            deleteWarning: 'Isso remove permanentemente suas preferências, nome, tema, versão escolhida e todo o progresso salvo em planos de leitura neste dispositivo. Considere exportar antes.',
            deleteConfirmLabel: 'Digite', deleteConfirmWord: 'APAGAR', deleteConfirmLabelEnd: 'para confirmar',
            deleteBtn: 'Apagar tudo permanentemente', deletedOk: '✓ Dados apagados. Recarregando…',
            cancel: 'Cancelar', close: 'Fechar',
        },
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
            backToPlan: "Voltar ao Plano",
            days: 'dias', daysTitle: 'Dias', chapters: 'Capítulos', books: 'Livros',
            howItWorks: 'Como funciona', startInfo: 'O progresso é salvo automaticamente.',
            preview: 'Prévia do plano', andMore: 'e mais',
            planStarted: '🚀 Plano iniciado!', day: 'Dia', of: 'de',
            today: 'Hoje', future: 'Futuro', complete: 'Completo', late: 'Atrasado',
            todayChapters: 'Leitura do dia', startReading: 'Começar a ler',
            reRead: 'Reler', completedDay: 'concluído!', keepItUp: 'Continue assim!',
            chapter: 'capítulo', chapterPlural: 'capítulos',
            read: 'lido', readPlural: 'lidos', saved: 'salvo', savedPlural: 'salvos',
            backupTitle: 'Backup', backupDesc: 'Exporte ou importe seu progresso.',
            exportTitle: 'Exportar', exportDesc: 'Salve seu progresso em arquivo.',
            importTitle: 'Importar', importDesc: 'Restaure de um backup.',
            downloadBtn: 'Baixar JSON', copyBtn: 'Copiar JSON', pasteBtn: 'Colar JSON',
            tapChoose: 'Toque para escolher', dragDrop: 'ou arraste aqui',
            daysRead: 'Dias lidos', tapExport: 'Toque para exportar',
            fileExported: '✓ Arquivo exportado', jsonCopied: '✓ JSON copiado',
            invalidJson: 'JSON inválido', errorImport: 'Erro ao importar',
            restored: 'capítulos restaurados', errorLoad: 'Erro ao carregar',
            back: 'Voltar', prev: 'Ant', next: 'Próx',
            resetBtn: 'Resetar plano', resetTitle: 'Resetar plano?',
            resetSub: 'Todo o progresso será apagado permanentemente.',
            resetConfirm: 'Sim, resetar', cancel: 'Cancelar',
            resetSuccess: '✓ Plano resetado', brand: 'BibleXtra',
        },
        bible6: {
            title: "Bíblia em 6 Meses", planName: "Bíblia em 6 Meses", tag: "PLANO XTRA",
            desc: "Leia a Bíblia inteira em apenas 6 meses, em porções diárias equilibradas.",
            startBtn: "Iniciar Plano", startInfo: "Seu progresso é salvo automaticamente.",
            planStarted: "🚀 Plano iniciado!", daysWord: "dias",
            day: "Dia", of: "de", today: "Hoje", progressLabel: "Progresso do Plano",
            concluded: "Concluído", concludeBtn: "Concluir Leitura", done: "Leitura Concluída!",
            resetBtn: "Resetar plano", resetTitle: "Resetar plano?",
            resetSub: "Todo o progresso será apagado permanentemente.",
            resetConfirm: "Sim, resetar", cancel: "Cancelar", resetSuccess: "✓ Plano resetado",
        },
        nt90: {
            title: "Novo Testamento em 90 Dias", planName: "Novo Testamento em 90 Dias", tag: "PLANO XTRA",
            desc: "Percorra todo o Novo Testamento em 90 dias, do Evangelho de Mateus ao Apocalipse.",
            startBtn: "Iniciar Plano", startInfo: "Seu progresso é salvo automaticamente.",
            planStarted: "🚀 Plano iniciado!", daysWord: "dias",
            day: "Dia", of: "de", today: "Hoje", progressLabel: "Progresso do Plano",
            concluded: "Concluído", concludeBtn: "Concluir Leitura", done: "Leitura Concluída!",
            resetBtn: "Resetar plano", resetTitle: "Resetar plano?",
            resetSub: "Todo o progresso será apagado permanentemente.",
            resetConfirm: "Sim, resetar", cancel: "Cancelar", resetSuccess: "✓ Plano resetado",
        },
        prov31: {
            title: "Provérbios em 31 Dias", planName: "Provérbios em 31 Dias", tag: "PLANO XTRA",
            desc: "Um capítulo de Provérbios por dia — sabedoria para cada dia do mês.",
            startBtn: "Iniciar Plano", startInfo: "Seu progresso é salvo automaticamente.",
            planStarted: "🚀 Plano iniciado!", daysWord: "dias",
            day: "Dia", of: "de", today: "Hoje", progressLabel: "Progresso do Plano",
            concluded: "Concluído", concludeBtn: "Concluir Leitura", done: "Leitura Concluída!",
            resetBtn: "Resetar plano", resetTitle: "Resetar plano?",
            resetSub: "Todo o progresso será apagado permanentemente.",
            resetConfirm: "Sim, resetar", cancel: "Cancelar", resetSuccess: "✓ Plano resetado",
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
        tabSearch: 'Search',
        tabAssistant: 'AI Assistant',
        assistantIntro: 'Find verses by topic instantly, fully offline — everything runs on your device.',
        assistantTopicPlaceholder: 'Type a topic (e.g. forgiveness, fear, faith)...',
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
        version: 'Bible Version',
        chooseVersion: 'Choose Bible version',
        chooseLanguage: 'Choose app language',
        dailyPlan: 'Daily',
        teensPlan: 'Teens',
        chapterWord: 'chapter',
        chaptersWord: 'chapters',
        chaptersLabel: 'Chapters',
        otherPlans: 'OTHER PLANS',
        privacy: {
            navLabel: 'Privacy & Data',
            heroTitle: 'Your Bible study belongs to you.',
            heroDesc: 'Everything you save here — progress, preferences, notes — stays on this device only. Nothing is ever sent to a server.',
            badgeLocal: '🔒 100% local', badgeNoTrack: '🚫 No tracking', badgeNoAds: '🚫 No ads', badgeNoSell: '🚫 We never sell data',
            exportTitle: 'Export my data', exportDesc: 'Download a copy of everything as a file',
            importTitle: 'Import backup', importDesc: 'Restore from a previously saved file',
            deleteTitle: 'Delete everything', deleteDesc: 'Permanently removes all data from this device',
            policyLink: 'Read the full privacy policy',
            exportModalTitle: 'Export your data', exportModalSub: 'A file with your preferences and reading progress.',
            choicePlainTitle: 'Plain file (.json)', choicePlainDesc: 'Readable, easy to inspect. Keep it somewhere you trust.',
            choiceEncTitle: 'Password-protected file', choiceEncDesc: 'Encrypted on your device — recommended if you\'ll store it in the cloud.',
            passphraseLabel: 'Create a password for this backup', passphraseHint: 'You\'ll need it to import this file later. Don\'t lose it — it can\'t be recovered.',
            downloadBtn: 'Download file', exportedOk: '✓ File downloaded successfully',
            importModalTitle: 'Import backup', importModalSub: 'Choose the file you exported earlier.',
            fileDropLabel: 'Tap to choose a file', fileChosen: 'File selected',
            importPassphraseLabel: 'Backup password', importBtn: 'Restore data',
            importedOk: '✓ Data restored. Reloading…', importInvalid: 'Invalid or corrupted file.',
            importWrongPass: 'Wrong password. Try again.', importNeedsPass: 'This file is password-protected.',
            deleteModalTitle: 'Delete all data?', deleteModalSub: 'This action cannot be undone.',
            deleteWarning: 'This permanently removes your preferences, name, theme, chosen version, and all saved reading-plan progress on this device. Consider exporting first.',
            deleteConfirmLabel: 'Type', deleteConfirmWord: 'DELETE', deleteConfirmLabelEnd: 'to confirm',
            deleteBtn: 'Permanently delete everything', deletedOk: '✓ Data deleted. Reloading…',
            cancel: 'Cancel', close: 'Close',
        },
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
            backToPlan: "Back to Plan",
            days: 'days', daysTitle: 'Days', chapters: 'Chapters', books: 'Books',
            howItWorks: 'How it works', startInfo: 'Your progress is saved automatically.',
            preview: 'Plan preview', andMore: 'and more',
            planStarted: '🚀 Plan started!', day: 'Day', of: 'of',
            today: 'Today', future: 'Future', complete: 'Complete', late: 'Late',
            todayChapters: "Today's reading", startReading: 'Start reading',
            reRead: 'Re-read', completedDay: 'completed!', keepItUp: 'Keep it up!',
            chapter: 'chapter', chapterPlural: 'chapters',
            read: 'read', readPlural: 'read', saved: 'saved', savedPlural: 'saved',
            backupTitle: 'Backup', backupDesc: 'Export or import your progress.',
            exportTitle: 'Export', exportDesc: 'Save your progress to a file.',
            importTitle: 'Import', importDesc: 'Restore from a backup.',
            downloadBtn: 'Download JSON', copyBtn: 'Copy JSON', pasteBtn: 'Paste JSON',
            tapChoose: 'Tap to choose', dragDrop: 'or drag here',
            daysRead: 'Days read', tapExport: 'Tap to export',
            fileExported: '✓ File exported', jsonCopied: '✓ JSON copied',
            invalidJson: 'Invalid JSON', errorImport: 'Error importing',
            restored: 'chapters restored', errorLoad: 'Error loading',
            back: 'Back', prev: 'Prev', next: 'Next',
            resetBtn: 'Reset plan', resetTitle: 'Reset plan?',
            resetSub: 'All progress will be permanently erased.',
            resetConfirm: 'Yes, reset', cancel: 'Cancel',
            resetSuccess: '✓ Plan reset', brand: 'BibleXtra',
        },
        bible6: {
            title: "Bible in 6 Months", planName: "Bible in 6 Months", tag: "XTRA PLAN",
            desc: "Read the entire Bible in just 6 months, in balanced daily portions.",
            startBtn: "Start Plan", startInfo: "Your progress is saved automatically.",
            planStarted: "🚀 Plan started!", daysWord: "days",
            day: "Day", of: "of", today: "Today", progressLabel: "Plan Progress",
            concluded: "Concluded", concludeBtn: "Conclude Reading", done: "Reading Done!",
            resetBtn: "Reset plan", resetTitle: "Reset plan?",
            resetSub: "All progress will be permanently erased.",
            resetConfirm: "Yes, reset", cancel: "Cancel", resetSuccess: "✓ Plan reset",
        },
        nt90: {
            title: "New Testament in 90 Days", planName: "New Testament in 90 Days", tag: "XTRA PLAN",
            desc: "Walk through the entire New Testament in 90 days, from Matthew to Revelation.",
            startBtn: "Start Plan", startInfo: "Your progress is saved automatically.",
            planStarted: "🚀 Plan started!", daysWord: "days",
            day: "Day", of: "of", today: "Today", progressLabel: "Plan Progress",
            concluded: "Concluded", concludeBtn: "Conclude Reading", done: "Reading Done!",
            resetBtn: "Reset plan", resetTitle: "Reset plan?",
            resetSub: "All progress will be permanently erased.",
            resetConfirm: "Yes, reset", cancel: "Cancel", resetSuccess: "✓ Plan reset",
        },
        prov31: {
            title: "Proverbs in 31 Days", planName: "Proverbs in 31 Days", tag: "XTRA PLAN",
            desc: "One chapter of Proverbs a day — wisdom for every day of the month.",
            startBtn: "Start Plan", startInfo: "Your progress is saved automatically.",
            planStarted: "🚀 Plan started!", daysWord: "days",
            day: "Day", of: "of", today: "Today", progressLabel: "Plan Progress",
            concluded: "Concluded", concludeBtn: "Conclude Reading", done: "Reading Done!",
            resetBtn: "Reset plan", resetTitle: "Reset plan?",
            resetSub: "All progress will be permanently erased.",
            resetConfirm: "Yes, reset", cancel: "Cancel", resetSuccess: "✓ Plan reset",
        }
    },
    es: {
        brand: '✦ Santa Biblia',
        searchPlaceholder: 'Buscar en la Biblia...',
        daily: '✦ Diario',
        todayReading: 'Lectura de Hoy',
        ot: '✦ Antiguo Testamento',
        nt: '✦ Nuevo Testamento',
        listen: 'Escuchar',
        stop: 'Detener',
        search: 'Buscar',
        results: 'resultado(s)',
        goToRef: 'IR A REFERENCIA',
        noResults: 'No se encontraron versículos.',
        chapter: 'Capítulo',
        tabSearch: 'Buscar',
        tabAssistant: 'Asistente IA',
        assistantIntro: 'Encuentra versículos por tema al instante y sin internet — todo funciona en tu dispositivo.',
        assistantTopicPlaceholder: 'Escribe un tema (ej: perdón, miedo, fe)...',
        loading: 'Cargando la Palabra…',
        tryAgain: 'Intentar de Nuevo',
        errorData: 'Archivo de datos no encontrado',
        errorChapter: 'Capítulo no encontrado',
        errorGeneric: 'Error al cargar los datos',
        errorDataInstruction: 'Agregar a index.html antes de script.js',
        fontDown: 'Reducir fuente',
        fontUp: 'Aumentar fuente',
        listenTitle: 'Escuchar la Palabra',
        scrollTop: 'Volver arriba',
        menuTitle: 'Menú de libros',
        closeMenu: 'Cerrar menú',
        openMenu: 'Abrir menú',
        prev: 'Cap',
        next: 'Cap',
        langBtn: 'Español',
        hello: 'Hola',
        verseOfDay: 'Versículo del Día',
        bible: 'Biblia',
        plans: 'Planes',
        settings: 'Más',
        home: 'Inicio',
        username: 'Nombre de Usuario',
        language: 'Idioma',
        theme: 'Tema',
        light: 'Claro',
        dark: 'Oscuro',
        version: 'Versión de la Biblia',
        chooseVersion: 'Elegir versión de la Biblia',
        chooseLanguage: 'Elegir idioma del app',
        dailyPlan: 'Diario',
        teensPlan: 'Teens',
        chapterWord: 'capítulo',
        chaptersWord: 'capítulos',
        chaptersLabel: 'Capítulos',
        otherPlans: 'OTROS PLANES',
        privacy: {
            navLabel: 'Privacidad y Datos',
            heroTitle: 'Tu estudio bíblico te pertenece.',
            heroDesc: 'Todo lo que guardas aquí — progreso, preferencias, notas — permanece solo en este dispositivo. Nada se envía jamás a un servidor.',
            badgeLocal: '🔒 100% local', badgeNoTrack: '🚫 Sin rastreo', badgeNoAds: '🚫 Sin anuncios', badgeNoSell: '🚫 Nunca vendemos datos',
            exportTitle: 'Exportar mis datos', exportDesc: 'Descarga una copia de todo en un archivo',
            importTitle: 'Importar respaldo', importDesc: 'Restaura desde un archivo guardado',
            deleteTitle: 'Borrar todo', deleteDesc: 'Elimina permanentemente todos los datos de este dispositivo',
            policyLink: 'Leer la política de privacidad completa',
            exportModalTitle: 'Exportar tus datos', exportModalSub: 'Un archivo con tus preferencias y progreso de lectura.',
            choicePlainTitle: 'Archivo simple (.json)', choicePlainDesc: 'Legible, fácil de revisar. Guárdalo en un lugar de confianza.',
            choiceEncTitle: 'Archivo protegido con contraseña', choiceEncDesc: 'Cifrado en tu dispositivo — recomendado si lo guardarás en la nube.',
            passphraseLabel: 'Crea una contraseña para este respaldo', passphraseHint: 'La necesitarás para importar este archivo después. No la pierdas — no se puede recuperar.',
            downloadBtn: 'Descargar archivo', exportedOk: '✓ Archivo descargado con éxito',
            importModalTitle: 'Importar respaldo', importModalSub: 'Selecciona el archivo exportado anteriormente.',
            fileDropLabel: 'Toca para elegir el archivo', fileChosen: 'Archivo seleccionado',
            importPassphraseLabel: 'Contraseña del respaldo', importBtn: 'Restaurar datos',
            importedOk: '✓ Datos restaurados. Recargando…', importInvalid: 'Archivo inválido o corrupto.',
            importWrongPass: 'Contraseña incorrecta. Intenta de nuevo.', importNeedsPass: 'Este archivo está protegido con contraseña.',
            deleteModalTitle: '¿Borrar todos los datos?', deleteModalSub: 'Esta acción no se puede deshacer.',
            deleteWarning: 'Esto elimina permanentemente tus preferencias, nombre, tema, versión elegida y todo el progreso guardado en planes de lectura en este dispositivo. Considera exportar antes.',
            deleteConfirmLabel: 'Escribe', deleteConfirmWord: 'BORRAR', deleteConfirmLabelEnd: 'para confirmar',
            deleteBtn: 'Borrar todo permanentemente', deletedOk: '✓ Datos borrados. Recargando…',
            cancel: 'Cancelar', close: 'Cerrar',
        },
        daily: {
            title: "Lectura Diaria",
            planName: "Plan Bíblico Anual",
            today: "Hoy",
            day: "Día",
            of: "de",
            annualProgress: "Progreso Anual",
            concluded: "Completado",
            concludeBtn: "Concluir Lectura",
            done: "¡Lectura Completada!"
        },
        teens: {
            title: "Plan Teens",
            tag: "Viaje Bíblico",
            bannerTitle: "Explorando<br>la Palabra",
            startDesc: "¡Comienza tu viaje de lectura bíblica hoy mismo!",
            startBtn: "Iniciar Plan",
            concluded: "Completado",
            conclude: "Concluir Día",
            backToPlan: "Volver al Plan",
            days: 'días', daysTitle: 'Días', chapters: 'Capítulos', books: 'Libros',
            howItWorks: 'Cómo funciona', startInfo: 'Tu progreso se guarda automáticamente.',
            preview: 'Vista previa del plan', andMore: 'y más',
            planStarted: '🚀 ¡Plan iniciado!', day: 'Día', of: 'de',
            today: 'Hoy', future: 'Futuro', complete: 'Completo', late: 'Atrasado',
            todayChapters: 'Lectura de hoy', startReading: 'Comenzar a leer',
            reRead: 'Releer', completedDay: '¡completado!', keepItUp: '¡Sigue así!',
            chapter: 'capítulo', chapterPlural: 'capítulos',
            read: 'leído', readPlural: 'leídos', saved: 'guardado', savedPlural: 'guardados',
            backupTitle: 'Copia de seguridad', backupDesc: 'Exporta o importa tu progreso.',
            exportTitle: 'Exportar', exportDesc: 'Guarda tu progreso en un archivo.',
            importTitle: 'Importar', importDesc: 'Restaura desde una copia de seguridad.',
            downloadBtn: 'Descargar JSON', copyBtn: 'Copiar JSON', pasteBtn: 'Pegar JSON',
            tapChoose: 'Toca para elegir', dragDrop: 'o arrastra aquí',
            daysRead: 'Días leídos', tapExport: 'Toca para exportar',
            fileExported: '✓ Archivo exportado', jsonCopied: '✓ JSON copiado',
            invalidJson: 'JSON inválido', errorImport: 'Error al importar',
            restored: 'capítulos restaurados', errorLoad: 'Error al cargar',
            back: 'Volver', prev: 'Ant', next: 'Sig',
            resetBtn: 'Restablecer plan', resetTitle: '¿Restablecer plan?',
            resetSub: 'Todo el progreso se borrará permanentemente.',
            resetConfirm: 'Sí, restablecer', cancel: 'Cancelar',
            resetSuccess: '✓ Plan restablecido', brand: 'BibleXtra',
        },
        bible6: {
            title: "Biblia en 6 Meses", planName: "Biblia en 6 Meses", tag: "PLAN XTRA",
            desc: "Lee toda la Biblia en solo 6 meses, en porciones diarias equilibradas.",
            startBtn: "Iniciar Plan", startInfo: "Tu progreso se guarda automáticamente.",
            planStarted: "🚀 ¡Plan iniciado!", daysWord: "días",
            day: "Día", of: "de", today: "Hoy", progressLabel: "Progreso del Plan",
            concluded: "Completado", concludeBtn: "Concluir Lectura", done: "¡Lectura Completada!",
            resetBtn: "Restablecer plan", resetTitle: "¿Restablecer plan?",
            resetSub: "Todo el progreso se borrará permanentemente.",
            resetConfirm: "Sí, restablecer", cancel: "Cancelar", resetSuccess: "✓ Plan restablecido",
        },
        nt90: {
            title: "Nuevo Testamento en 90 Días", planName: "Nuevo Testamento en 90 Días", tag: "PLAN XTRA",
            desc: "Recorre todo el Nuevo Testamento en 90 días, desde Mateo hasta Apocalipsis.",
            startBtn: "Iniciar Plan", startInfo: "Tu progreso se guarda automáticamente.",
            planStarted: "🚀 ¡Plan iniciado!", daysWord: "días",
            day: "Día", of: "de", today: "Hoy", progressLabel: "Progreso del Plan",
            concluded: "Completado", concludeBtn: "Concluir Lectura", done: "¡Lectura Completada!",
            resetBtn: "Restablecer plan", resetTitle: "¿Restablecer plan?",
            resetSub: "Todo el progreso se borrará permanentemente.",
            resetConfirm: "Sí, restablecer", cancel: "Cancelar", resetSuccess: "✓ Plan restablecido",
        },
        prov31: {
            title: "Proverbios en 31 Días", planName: "Proverbios en 31 Días", tag: "PLAN XTRA",
            desc: "Un capítulo de Proverbios al día: sabiduría para cada día del mes.",
            startBtn: "Iniciar Plan", startInfo: "Tu progreso se guarda automáticamente.",
            planStarted: "🚀 ¡Plan iniciado!", daysWord: "días",
            day: "Día", of: "de", today: "Hoy", progressLabel: "Progreso del Plan",
            concluded: "Completado", concludeBtn: "Concluir Lectura", done: "¡Lectura Completada!",
            resetBtn: "Restablecer plan", resetTitle: "¿Restablecer plan?",
            resetSub: "Todo el progreso se borrará permanentemente.",
            resetConfirm: "Sí, restablecer", cancel: "Cancelar", resetSuccess: "✓ Plan restablecido",
        }
    },
    fr: {
        "brand": "✦ Sainte Bible",
        "searchPlaceholder": "Rechercher dans la Bible...",
        "todayReading": "Lecture du Jour",
        "ot": "✦ Ancien Testament",
        "nt": "✦ Nouveau Testament",
        "listen": "Écouter",
        "stop": "Arrêter",
        "search": "Recherche",
        "results": "résultat(s)",
        "goToRef": "ALLER À LA RÉFÉRENCE",
        "noResults": "Aucun verset trouvé.",
        "chapter": "Chapitre",
        "tabSearch": "Recherche",
        "tabAssistant": "Assistant IA",
        "assistantIntro": "Trouvez des versets par thème instantanément, hors ligne — tout fonctionne sur votre appareil.",
        "assistantTopicPlaceholder": "Entrez un thème (ex: pardon, peur, foi)...",
        "loading": "Chargement de la Parole...",
        "tryAgain": "Réessayer",
        "errorData": "Fichier de données introuvable",
        "errorChapter": "Chapitre introuvable",
        "errorGeneric": "Erreur lors du chargement des données",
        "errorDataInstruction": "Ajouter à index.html avant script.js",
        "fontDown": "Réduire la police",
        "fontUp": "Agrandir la police",
        "listenTitle": "Écouter la Parole",
        "scrollTop": "Retour en haut",
        "menuTitle": "Menu des livres",
        "closeMenu": "Fermer le menu",
        "openMenu": "Ouvrir le menu",
        "prev": "Chap",
        "next": "Chap",
        "langBtn": "Français",
        "hello": "Bonjour",
        "verseOfDay": "Verset du Jour",
        "bible": "Bible",
        "plans": "Plans",
        "settings": "Plus",
        "home": "Accueil",
        "username": "Nom d'utilisateur",
        "language": "Langue",
        "theme": "Thème",
        "light": "Clair",
        "dark": "Sombre",
        "version": "Version de la Bible",
        "chooseVersion": "Choisir la version de la Bible",
        "chooseLanguage": "Choisir la langue de l'app",
        "dailyPlan": "Quotidien",
        "teensPlan": "Ados",
        "chapterWord": "chapitre",
        "chaptersWord": "chapitres",
        "chaptersLabel": "Chapitres",
        "otherPlans": "AUTRES PLANS",
        "privacy": {
                "navLabel": "Confidentialité et Données",
                "heroTitle": "Votre étude biblique vous appartient.",
                "heroDesc": "Tout ce que vous enregistrez ici — progression, préférences, notes — reste uniquement sur cet appareil. Rien n'est jamais envoyé à un serveur.",
                "badgeLocal": "🔒 100% local",
                "badgeNoTrack": "🚫 Aucun suivi",
                "badgeNoAds": "🚫 Aucune publicité",
                "badgeNoSell": "🚫 Nous ne vendons jamais vos données",
                "exportTitle": "Exporter mes données",
                "exportDesc": "Téléchargez une copie de tout dans un fichier",
                "importTitle": "Importer une sauvegarde",
                "importDesc": "Restaurer à partir d'un fichier enregistré",
                "deleteTitle": "Tout supprimer",
                "deleteDesc": "Supprime définitivement toutes les données de cet appareil",
                "policyLink": "Lire la politique de confidentialité complète",
                "exportModalTitle": "Exporter vos données",
                "exportModalSub": "Un fichier avec vos préférences et votre progression de lecture.",
                "choicePlainTitle": "Fichier simple (.json)",
                "choicePlainDesc": "Lisible, facile à consulter. Conservez-le dans un endroit sûr.",
                "choiceEncTitle": "Fichier protégé par mot de passe",
                "choiceEncDesc": "Chiffré sur votre appareil — recommandé si vous le stockez dans le cloud.",
                "passphraseLabel": "Créez un mot de passe pour cette sauvegarde",
                "passphraseHint": "Vous en aurez besoin pour importer ce fichier plus tard. Ne le perdez pas — il ne peut pas être récupéré.",
                "downloadBtn": "Télécharger le fichier",
                "exportedOk": "✓ Fichier téléchargé avec succès",
                "importModalTitle": "Importer une sauvegarde",
                "importModalSub": "Choisissez le fichier exporté précédemment.",
                "fileDropLabel": "Touchez pour choisir un fichier",
                "fileChosen": "Fichier sélectionné",
                "importPassphraseLabel": "Mot de passe de la sauvegarde",
                "importBtn": "Restaurer les données",
                "importedOk": "✓ Données restaurées. Rechargement…",
                "importInvalid": "Fichier invalide ou corrompu.",
                "importWrongPass": "Mot de passe incorrect. Réessayez.",
                "importNeedsPass": "Ce fichier est protégé par un mot de passe.",
                "deleteModalTitle": "Supprimer toutes les données ?",
                "deleteModalSub": "Cette action est irréversible.",
                "deleteWarning": "Cela supprime définitivement vos préférences, votre nom, votre thème, la version choisie et toute la progression enregistrée dans les plans de lecture sur cet appareil. Pensez à exporter d'abord.",
                "deleteConfirmLabel": "Tapez",
                "deleteConfirmWord": "SUPPRIMER",
                "deleteConfirmLabelEnd": "pour confirmer",
                "deleteBtn": "Supprimer définitivement tout",
                "deletedOk": "✓ Données supprimées. Rechargement…",
                "cancel": "Annuler",
                "close": "Fermer"
        },
        "daily": {
                "title": "Lecture Quotidienne",
                "planName": "Plan Biblique Annuel",
                "today": "Aujourd'hui",
                "day": "Jour",
                "of": "de",
                "annualProgress": "Progression Annuelle",
                "concluded": "Terminé",
                "concludeBtn": "Terminer la Lecture",
                "done": "Lecture Terminée !"
        },
        "teens": {
                "title": "Plan Ados",
                "tag": "Parcours Biblique",
                "bannerTitle": "Explorer<br>la Parole",
                "startDesc": "Commencez dès aujourd'hui votre parcours de lecture biblique !",
                "startBtn": "Démarrer le Plan",
                "concluded": "Terminé",
                "conclude": "Terminer le Jour",
                "backToPlan": "Retour au Plan",
                "days": "jours",
                "daysTitle": "Jours",
                "chapters": "Chapitres",
                "books": "Livres",
                "howItWorks": "Comment ça marche",
                "startInfo": "Votre progression est enregistrée automatiquement.",
                "preview": "Aperçu du plan",
                "andMore": "et plus",
                "planStarted": "🚀 Plan démarré !",
                "day": "Jour",
                "of": "de",
                "today": "Aujourd'hui",
                "future": "Futur",
                "complete": "Complet",
                "late": "En retard",
                "todayChapters": "Lecture du jour",
                "startReading": "Commencer à lire",
                "reRead": "Relire",
                "completedDay": "terminé !",
                "keepItUp": "Continuez ainsi !",
                "chapter": "chapitre",
                "chapterPlural": "chapitres",
                "read": "lu",
                "readPlural": "lus",
                "saved": "enregistré",
                "savedPlural": "enregistrés",
                "backupTitle": "Sauvegarde",
                "backupDesc": "Exportez ou importez votre progression.",
                "exportTitle": "Exporter",
                "exportDesc": "Enregistrez votre progression dans un fichier.",
                "importTitle": "Importer",
                "importDesc": "Restaurer à partir d'une sauvegarde.",
                "downloadBtn": "Télécharger JSON",
                "copyBtn": "Copier le JSON",
                "pasteBtn": "Coller le JSON",
                "tapChoose": "Toucher pour choisir",
                "dragDrop": "ou glisser ici",
                "daysRead": "Jours lus",
                "tapExport": "Toucher pour exporter",
                "fileExported": "✓ Fichier exporté",
                "jsonCopied": "✓ JSON copié",
                "invalidJson": "JSON invalide",
                "errorImport": "Erreur lors de l'importation",
                "restored": "chapitres restaurés",
                "errorLoad": "Erreur de chargement",
                "back": "Retour",
                "prev": "Préc",
                "next": "Suiv",
                "resetBtn": "Réinitialiser le plan",
                "resetTitle": "Réinitialiser le plan ?",
                "resetSub": "Toute la progression sera définitivement effacée.",
                "resetConfirm": "Oui, réinitialiser",
                "cancel": "Annuler",
                "resetSuccess": "✓ Plan réinitialisé",
                "brand": "BibleXtra"
        },
        "bible6": {
                "title": "Bible en 6 Mois",
                "planName": "Bible en 6 Mois",
                "tag": "PLAN XTRA",
                "desc": "Lisez la Bible entière en seulement 6 mois, en portions quotidiennes équilibrées.",
                "startBtn": "Démarrer le Plan",
                "startInfo": "Votre progression est enregistrée automatiquement.",
                "planStarted": "🚀 Plan démarré !",
                "daysWord": "jours",
                "day": "Jour",
                "of": "de",
                "today": "Aujourd'hui",
                "progressLabel": "Progression du Plan",
                "concluded": "Terminé",
                "concludeBtn": "Terminer la Lecture",
                "done": "Lecture Terminée !",
                "resetBtn": "Réinitialiser le plan",
                "resetTitle": "Réinitialiser le plan ?",
                "resetSub": "Toute la progression sera définitivement effacée.",
                "resetConfirm": "Oui, réinitialiser",
                "cancel": "Annuler",
                "resetSuccess": "✓ Plan réinitialisé"
        },
        "nt90": {
                "title": "Nouveau Testament en 90 Jours",
                "planName": "Nouveau Testament en 90 Jours",
                "tag": "PLAN XTRA",
                "desc": "Parcourez tout le Nouveau Testament en 90 jours, de Matthieu à l'Apocalypse.",
                "startBtn": "Démarrer le Plan",
                "startInfo": "Votre progression est enregistrée automatiquement.",
                "planStarted": "🚀 Plan démarré !",
                "daysWord": "jours",
                "day": "Jour",
                "of": "de",
                "today": "Aujourd'hui",
                "progressLabel": "Progression du Plan",
                "concluded": "Terminé",
                "concludeBtn": "Terminer la Lecture",
                "done": "Lecture Terminée !",
                "resetBtn": "Réinitialiser le plan",
                "resetTitle": "Réinitialiser le plan ?",
                "resetSub": "Toute la progression sera définitivement effacée.",
                "resetConfirm": "Oui, réinitialiser",
                "cancel": "Annuler",
                "resetSuccess": "✓ Plan réinitialisé"
        },
        "prov31": {
                "title": "Proverbes en 31 Jours",
                "planName": "Proverbes en 31 Jours",
                "tag": "PLAN XTRA",
                "desc": "Un chapitre de Proverbes par jour — la sagesse pour chaque jour du mois.",
                "startBtn": "Démarrer le Plan",
                "startInfo": "Votre progression est enregistrée automatiquement.",
                "planStarted": "🚀 Plan démarré !",
                "daysWord": "jours",
                "day": "Jour",
                "of": "de",
                "today": "Aujourd'hui",
                "progressLabel": "Progression du Plan",
                "concluded": "Terminé",
                "concludeBtn": "Terminer la Lecture",
                "done": "Lecture Terminée !",
                "resetBtn": "Réinitialiser le plan",
                "resetTitle": "Réinitialiser le plan ?",
                "resetSub": "Toute la progression sera définitivement effacée.",
                "resetConfirm": "Oui, réinitialiser",
                "cancel": "Annuler",
                "resetSuccess": "✓ Plan réinitialisé"
        }
},
    de: {
        "brand": "✦ Heilige Bibel",
        "searchPlaceholder": "Bibel durchsuchen...",
        "todayReading": "Heutige Lesung",
        "ot": "✦ Altes Testament",
        "nt": "✦ Neues Testament",
        "listen": "Anhören",
        "stop": "Stopp",
        "search": "Suche",
        "results": "Ergebnis(se)",
        "goToRef": "ZUR STELLE GEHEN",
        "noResults": "Keine Verse gefunden.",
        "chapter": "Kapitel",
        "tabSearch": "Suche",
        "tabAssistant": "KI-Assistent",
        "assistantIntro": "Finden Sie Verse nach Thema sofort und offline — alles läuft auf Ihrem Gerät.",
        "assistantTopicPlaceholder": "Thema eingeben (z. B. Vergebung, Angst, Glaube)...",
        "loading": "Das Wort wird geladen...",
        "tryAgain": "Erneut versuchen",
        "errorData": "Datendatei nicht gefunden",
        "errorChapter": "Kapitel nicht gefunden",
        "errorGeneric": "Fehler beim Laden der Daten",
        "errorDataInstruction": "Vor script.js zu index.html hinzufügen",
        "fontDown": "Schrift verkleinern",
        "fontUp": "Schrift vergrößern",
        "listenTitle": "Das Wort anhören",
        "scrollTop": "Nach oben",
        "menuTitle": "Bücher-Menü",
        "closeMenu": "Menü schließen",
        "openMenu": "Menü öffnen",
        "prev": "Kap",
        "next": "Kap",
        "langBtn": "Deutsch",
        "hello": "Hallo",
        "verseOfDay": "Vers des Tages",
        "bible": "Bibel",
        "plans": "Pläne",
        "settings": "Mehr",
        "home": "Start",
        "username": "Benutzername",
        "language": "Sprache",
        "theme": "Thema",
        "light": "Hell",
        "dark": "Dunkel",
        "version": "Bibelversion",
        "chooseVersion": "Bibelversion wählen",
        "chooseLanguage": "App-Sprache wählen",
        "dailyPlan": "Täglich",
        "teensPlan": "Teens",
        "chapterWord": "Kapitel",
        "chaptersWord": "Kapitel",
        "chaptersLabel": "Kapitel",
        "otherPlans": "WEITERE PLÄNE",
        "privacy": {
                "navLabel": "Datenschutz & Daten",
                "heroTitle": "Ihr Bibelstudium gehört Ihnen.",
                "heroDesc": "Alles, was Sie hier speichern — Fortschritt, Einstellungen, Notizen — bleibt nur auf diesem Gerät. Nichts wird jemals an einen Server gesendet.",
                "badgeLocal": "🔒 100% lokal",
                "badgeNoTrack": "🚫 Kein Tracking",
                "badgeNoAds": "🚫 Keine Werbung",
                "badgeNoSell": "🚫 Wir verkaufen niemals Daten",
                "exportTitle": "Meine Daten exportieren",
                "exportDesc": "Laden Sie eine Kopie von allem als Datei herunter",
                "importTitle": "Backup importieren",
                "importDesc": "Aus einer zuvor gespeicherten Datei wiederherstellen",
                "deleteTitle": "Alles löschen",
                "deleteDesc": "Entfernt dauerhaft alle Daten von diesem Gerät",
                "policyLink": "Vollständige Datenschutzrichtlinie lesen",
                "exportModalTitle": "Ihre Daten exportieren",
                "exportModalSub": "Eine Datei mit Ihren Einstellungen und Ihrem Lesefortschritt.",
                "choicePlainTitle": "Einfache Datei (.json)",
                "choicePlainDesc": "Lesbar, leicht zu prüfen. An einem vertrauenswürdigen Ort aufbewahren.",
                "choiceEncTitle": "Passwortgeschützte Datei",
                "choiceEncDesc": "Auf Ihrem Gerät verschlüsselt — empfohlen, wenn Sie sie in der Cloud speichern.",
                "passphraseLabel": "Erstellen Sie ein Passwort für dieses Backup",
                "passphraseHint": "Sie benötigen es, um diese Datei später zu importieren. Verlieren Sie es nicht — es kann nicht wiederhergestellt werden.",
                "downloadBtn": "Datei herunterladen",
                "exportedOk": "✓ Datei erfolgreich heruntergeladen",
                "importModalTitle": "Backup importieren",
                "importModalSub": "Wählen Sie die zuvor exportierte Datei.",
                "fileDropLabel": "Tippen, um eine Datei zu wählen",
                "fileChosen": "Datei ausgewählt",
                "importPassphraseLabel": "Backup-Passwort",
                "importBtn": "Daten wiederherstellen",
                "importedOk": "✓ Daten wiederhergestellt. Wird neu geladen…",
                "importInvalid": "Ungültige oder beschädigte Datei.",
                "importWrongPass": "Falsches Passwort. Versuchen Sie es erneut.",
                "importNeedsPass": "Diese Datei ist passwortgeschützt.",
                "deleteModalTitle": "Alle Daten löschen?",
                "deleteModalSub": "Diese Aktion kann nicht rückgängig gemacht werden.",
                "deleteWarning": "Dies entfernt dauerhaft Ihre Einstellungen, Namen, Thema, gewählte Version und den gesamten gespeicherten Fortschritt der Lesepläne auf diesem Gerät. Erwägen Sie, vorher zu exportieren.",
                "deleteConfirmLabel": "Tippen Sie",
                "deleteConfirmWord": "LÖSCHEN",
                "deleteConfirmLabelEnd": "zur Bestätigung",
                "deleteBtn": "Alles dauerhaft löschen",
                "deletedOk": "✓ Daten gelöscht. Wird neu geladen…",
                "cancel": "Abbrechen",
                "close": "Schließen"
        },
        "daily": {
                "title": "Tägliche Lesung",
                "planName": "Jährlicher Bibelplan",
                "today": "Heute",
                "day": "Tag",
                "of": "von",
                "annualProgress": "Jahresfortschritt",
                "concluded": "Abgeschlossen",
                "concludeBtn": "Lesung abschließen",
                "done": "Lesung abgeschlossen!"
        },
        "teens": {
                "title": "Teens-Plan",
                "tag": "Bibel-Reise",
                "bannerTitle": "Das Wort<br>entdecken",
                "startDesc": "Beginnen Sie noch heute Ihre Bibellese-Reise!",
                "startBtn": "Plan starten",
                "concluded": "Abgeschlossen",
                "conclude": "Tag abschließen",
                "backToPlan": "Zurück zum Plan",
                "days": "Tage",
                "daysTitle": "Tage",
                "chapters": "Kapitel",
                "books": "Bücher",
                "howItWorks": "So funktioniert es",
                "startInfo": "Ihr Fortschritt wird automatisch gespeichert.",
                "preview": "Planvorschau",
                "andMore": "und mehr",
                "planStarted": "🚀 Plan gestartet!",
                "day": "Tag",
                "of": "von",
                "today": "Heute",
                "future": "Zukünftig",
                "complete": "Abgeschlossen",
                "late": "Verspätet",
                "todayChapters": "Heutige Lesung",
                "startReading": "Lesung beginnen",
                "reRead": "Erneut lesen",
                "completedDay": "abgeschlossen!",
                "keepItUp": "Weiter so!",
                "chapter": "Kapitel",
                "chapterPlural": "Kapitel",
                "read": "gelesen",
                "readPlural": "gelesen",
                "saved": "gespeichert",
                "savedPlural": "gespeichert",
                "backupTitle": "Backup",
                "backupDesc": "Exportieren oder importieren Sie Ihren Fortschritt.",
                "exportTitle": "Exportieren",
                "exportDesc": "Speichern Sie Ihren Fortschritt in einer Datei.",
                "importTitle": "Importieren",
                "importDesc": "Aus einem Backup wiederherstellen.",
                "downloadBtn": "JSON herunterladen",
                "copyBtn": "JSON kopieren",
                "pasteBtn": "JSON einfügen",
                "tapChoose": "Zum Wählen tippen",
                "dragDrop": "oder hierher ziehen",
                "daysRead": "Gelesene Tage",
                "tapExport": "Zum Exportieren tippen",
                "fileExported": "✓ Datei exportiert",
                "jsonCopied": "✓ JSON kopiert",
                "invalidJson": "Ungültiges JSON",
                "errorImport": "Fehler beim Importieren",
                "restored": "Kapitel wiederhergestellt",
                "errorLoad": "Fehler beim Laden",
                "back": "Zurück",
                "prev": "Vor",
                "next": "Nächstes",
                "resetBtn": "Plan zurücksetzen",
                "resetTitle": "Plan zurücksetzen?",
                "resetSub": "Der gesamte Fortschritt wird dauerhaft gelöscht.",
                "resetConfirm": "Ja, zurücksetzen",
                "cancel": "Abbrechen",
                "resetSuccess": "✓ Plan zurückgesetzt",
                "brand": "BibleXtra"
        },
        "bible6": {
                "title": "Bibel in 6 Monaten",
                "planName": "Bibel in 6 Monaten",
                "tag": "XTRA-PLAN",
                "desc": "Lesen Sie die gesamte Bibel in nur 6 Monaten, in ausgewogenen täglichen Abschnitten.",
                "startBtn": "Plan starten",
                "startInfo": "Ihr Fortschritt wird automatisch gespeichert.",
                "planStarted": "🚀 Plan gestartet!",
                "daysWord": "Tage",
                "day": "Tag",
                "of": "von",
                "today": "Heute",
                "progressLabel": "Planfortschritt",
                "concluded": "Abgeschlossen",
                "concludeBtn": "Lesung abschließen",
                "done": "Lesung abgeschlossen!",
                "resetBtn": "Plan zurücksetzen",
                "resetTitle": "Plan zurücksetzen?",
                "resetSub": "Der gesamte Fortschritt wird dauerhaft gelöscht.",
                "resetConfirm": "Ja, zurücksetzen",
                "cancel": "Abbrechen",
                "resetSuccess": "✓ Plan zurückgesetzt"
        },
        "nt90": {
                "title": "Neues Testament in 90 Tagen",
                "planName": "Neues Testament in 90 Tagen",
                "tag": "XTRA-PLAN",
                "desc": "Durchlaufen Sie das gesamte Neue Testament in 90 Tagen, von Matthäus bis Offenbarung.",
                "startBtn": "Plan starten",
                "startInfo": "Ihr Fortschritt wird automatisch gespeichert.",
                "planStarted": "🚀 Plan gestartet!",
                "daysWord": "Tage",
                "day": "Tag",
                "of": "von",
                "today": "Heute",
                "progressLabel": "Planfortschritt",
                "concluded": "Abgeschlossen",
                "concludeBtn": "Lesung abschließen",
                "done": "Lesung abgeschlossen!",
                "resetBtn": "Plan zurücksetzen",
                "resetTitle": "Plan zurücksetzen?",
                "resetSub": "Der gesamte Fortschritt wird dauerhaft gelöscht.",
                "resetConfirm": "Ja, zurücksetzen",
                "cancel": "Abbrechen",
                "resetSuccess": "✓ Plan zurückgesetzt"
        },
        "prov31": {
                "title": "Sprüche in 31 Tagen",
                "planName": "Sprüche in 31 Tagen",
                "tag": "XTRA-PLAN",
                "desc": "Ein Kapitel der Sprüche pro Tag — Weisheit für jeden Tag des Monats.",
                "startBtn": "Plan starten",
                "startInfo": "Ihr Fortschritt wird automatisch gespeichert.",
                "planStarted": "🚀 Plan gestartet!",
                "daysWord": "Tage",
                "day": "Tag",
                "of": "von",
                "today": "Heute",
                "progressLabel": "Planfortschritt",
                "concluded": "Abgeschlossen",
                "concludeBtn": "Lesung abschließen",
                "done": "Lesung abgeschlossen!",
                "resetBtn": "Plan zurücksetzen",
                "resetTitle": "Plan zurücksetzen?",
                "resetSub": "Der gesamte Fortschritt wird dauerhaft gelöscht.",
                "resetConfirm": "Ja, zurücksetzen",
                "cancel": "Abbrechen",
                "resetSuccess": "✓ Plan zurückgesetzt"
        }
},
    ar: {
        "brand": "✦ الكتاب المقدس",
        "searchPlaceholder": "ابحث في الكتاب المقدس...",
        "todayReading": "قراءة اليوم",
        "ot": "✦ العهد القديم",
        "nt": "✦ العهد الجديد",
        "listen": "استماع",
        "stop": "إيقاف",
        "search": "بحث",
        "results": "نتيجة (نتائج)",
        "goToRef": "الانتقال إلى المرجع",
        "noResults": "لم يتم العثور على آيات.",
        "chapter": "الإصحاح",
        "tabSearch": "بحث",
        "tabAssistant": "المساعد الذكي",
        "assistantIntro": "ابحث عن آيات حسب الموضوع فورًا وبدون إنترنت — كل شيء يعمل على جهازك.",
        "assistantTopicPlaceholder": "اكتب موضوعًا (مثل: الغفران، الخوف، الإيمان)...",
        "loading": "جارٍ تحميل الكلمة...",
        "tryAgain": "حاول مرة أخرى",
        "errorData": "ملف البيانات غير موجود",
        "errorChapter": "الإصحاح غير موجود",
        "errorGeneric": "خطأ في تحميل البيانات",
        "errorDataInstruction": "أضف إلى index.html قبل script.js",
        "fontDown": "تصغير الخط",
        "fontUp": "تكبير الخط",
        "listenTitle": "استمع إلى الكلمة",
        "scrollTop": "العودة إلى الأعلى",
        "menuTitle": "قائمة الأسفار",
        "closeMenu": "إغلاق القائمة",
        "openMenu": "فتح القائمة",
        "prev": "الإصحاح",
        "next": "الإصحاح",
        "langBtn": "العربية",
        "hello": "مرحبًا",
        "verseOfDay": "آية اليوم",
        "bible": "الكتاب المقدس",
        "plans": "الخطط",
        "settings": "المزيد",
        "home": "الرئيسية",
        "username": "اسم المستخدم",
        "language": "اللغة",
        "theme": "المظهر",
        "light": "فاتح",
        "dark": "داكن",
        "version": "نسخة الكتاب المقدس",
        "chooseVersion": "اختر نسخة الكتاب المقدس",
        "chooseLanguage": "اختر لغة التطبيق",
        "dailyPlan": "يومي",
        "teensPlan": "المراهقون",
        "chapterWord": "إصحاح",
        "chaptersWord": "إصحاحات",
        "chaptersLabel": "الإصحاحات",
        "otherPlans": "خطط أخرى",
        "privacy": {
                "navLabel": "الخصوصية والبيانات",
                "heroTitle": "دراستك للكتاب المقدس ملك لك.",
                "heroDesc": "كل ما تحفظه هنا — التقدم، التفضيلات، الملاحظات — يبقى على هذا الجهاز فقط. لا يُرسل شيء أبدًا إلى أي خادم.",
                "badgeLocal": "🔒 محلي بنسبة 100%",
                "badgeNoTrack": "🚫 بدون تتبع",
                "badgeNoAds": "🚫 بدون إعلانات",
                "badgeNoSell": "🚫 لا نبيع بياناتك أبدًا",
                "exportTitle": "تصدير بياناتي",
                "exportDesc": "قم بتنزيل نسخة من كل شيء كملف",
                "importTitle": "استيراد نسخة احتياطية",
                "importDesc": "الاستعادة من ملف محفوظ مسبقًا",
                "deleteTitle": "حذف كل شيء",
                "deleteDesc": "يزيل جميع البيانات نهائيًا من هذا الجهاز",
                "policyLink": "قراءة سياسة الخصوصية الكاملة",
                "exportModalTitle": "تصدير بياناتك",
                "exportModalSub": "ملف يحتوي على تفضيلاتك وتقدم القراءة.",
                "choicePlainTitle": "ملف عادي (.json)",
                "choicePlainDesc": "قابل للقراءة وسهل الفحص. احتفظ به في مكان موثوق.",
                "choiceEncTitle": "ملف محمي بكلمة مرور",
                "choiceEncDesc": "مشفر على جهازك — يُنصح به إذا كنت ستخزنه في السحابة.",
                "passphraseLabel": "أنشئ كلمة مرور لهذه النسخة الاحتياطية",
                "passphraseHint": "ستحتاجها لاستيراد هذا الملف لاحقًا. لا تفقدها — لا يمكن استعادتها.",
                "downloadBtn": "تنزيل الملف",
                "exportedOk": "✓ تم تنزيل الملف بنجاح",
                "importModalTitle": "استيراد نسخة احتياطية",
                "importModalSub": "اختر الملف الذي تم تصديره سابقًا.",
                "fileDropLabel": "اضغط لاختيار ملف",
                "fileChosen": "تم اختيار الملف",
                "importPassphraseLabel": "كلمة مرور النسخة الاحتياطية",
                "importBtn": "استعادة البيانات",
                "importedOk": "✓ تمت استعادة البيانات. جارٍ إعادة التحميل…",
                "importInvalid": "ملف غير صالح أو تالف.",
                "importWrongPass": "كلمة مرور خاطئة. حاول مرة أخرى.",
                "importNeedsPass": "هذا الملف محمي بكلمة مرور.",
                "deleteModalTitle": "حذف جميع البيانات؟",
                "deleteModalSub": "لا يمكن التراجع عن هذا الإجراء.",
                "deleteWarning": "سيؤدي هذا إلى إزالة تفضيلاتك واسمك والمظهر والنسخة المختارة وكل تقدم خطط القراءة المحفوظة على هذا الجهاز نهائيًا. ننصح بالتصدير أولاً.",
                "deleteConfirmLabel": "اكتب",
                "deleteConfirmWord": "حذف",
                "deleteConfirmLabelEnd": "للتأكيد",
                "deleteBtn": "حذف كل شيء نهائيًا",
                "deletedOk": "✓ تم حذف البيانات. جارٍ إعادة التحميل…",
                "cancel": "إلغاء",
                "close": "إغلاق"
        },
        "daily": {
                "title": "القراءة اليومية",
                "planName": "خطة الكتاب المقدس السنوية",
                "today": "اليوم",
                "day": "اليوم",
                "of": "من",
                "annualProgress": "التقدم السنوي",
                "concluded": "مكتمل",
                "concludeBtn": "إنهاء القراءة",
                "done": "تمت القراءة!"
        },
        "teens": {
                "title": "خطة المراهقين",
                "tag": "رحلة الكتاب المقدس",
                "bannerTitle": "استكشاف<br>الكلمة",
                "startDesc": "ابدأ رحلة قراءة الكتاب المقدس اليوم!",
                "startBtn": "بدء الخطة",
                "concluded": "مكتمل",
                "conclude": "إنهاء اليوم",
                "backToPlan": "العودة إلى الخطة",
                "days": "أيام",
                "daysTitle": "الأيام",
                "chapters": "الإصحاحات",
                "books": "الأسفار",
                "howItWorks": "كيف تعمل",
                "startInfo": "يتم حفظ تقدمك تلقائيًا.",
                "preview": "معاينة الخطة",
                "andMore": "والمزيد",
                "planStarted": "🚀 بدأت الخطة!",
                "day": "اليوم",
                "of": "من",
                "today": "اليوم",
                "future": "مستقبلي",
                "complete": "مكتمل",
                "late": "متأخر",
                "todayChapters": "قراءة اليوم",
                "startReading": "ابدأ القراءة",
                "reRead": "إعادة القراءة",
                "completedDay": "اكتمل!",
                "keepItUp": "واصل التقدم!",
                "chapter": "إصحاح",
                "chapterPlural": "إصحاحات",
                "read": "مقروء",
                "readPlural": "مقروءة",
                "saved": "محفوظ",
                "savedPlural": "محفوظة",
                "backupTitle": "نسخة احتياطية",
                "backupDesc": "تصدير أو استيراد تقدمك.",
                "exportTitle": "تصدير",
                "exportDesc": "احفظ تقدمك في ملف.",
                "importTitle": "استيراد",
                "importDesc": "الاستعادة من نسخة احتياطية.",
                "downloadBtn": "تنزيل JSON",
                "copyBtn": "نسخ JSON",
                "pasteBtn": "لصق JSON",
                "tapChoose": "اضغط للاختيار",
                "dragDrop": "أو اسحب هنا",
                "daysRead": "الأيام المقروءة",
                "tapExport": "اضغط للتصدير",
                "fileExported": "✓ تم تصدير الملف",
                "jsonCopied": "✓ تم نسخ JSON",
                "invalidJson": "JSON غير صالح",
                "errorImport": "خطأ في الاستيراد",
                "restored": "إصحاحات مستعادة",
                "errorLoad": "خطأ في التحميل",
                "back": "رجوع",
                "prev": "السابق",
                "next": "التالي",
                "resetBtn": "إعادة تعيين الخطة",
                "resetTitle": "إعادة تعيين الخطة؟",
                "resetSub": "سيتم مسح كل التقدم نهائيًا.",
                "resetConfirm": "نعم، إعادة التعيين",
                "cancel": "إلغاء",
                "resetSuccess": "✓ تمت إعادة تعيين الخطة",
                "brand": "BibleXtra"
        },
        "bible6": {
                "title": "الكتاب المقدس في 6 أشهر",
                "planName": "الكتاب المقدس في 6 أشهر",
                "tag": "خطة إضافية",
                "desc": "اقرأ الكتاب المقدس بأكمله في 6 أشهر فقط، في أجزاء يومية متوازنة.",
                "startBtn": "بدء الخطة",
                "startInfo": "يتم حفظ تقدمك تلقائيًا.",
                "planStarted": "🚀 بدأت الخطة!",
                "daysWord": "أيام",
                "day": "اليوم",
                "of": "من",
                "today": "اليوم",
                "progressLabel": "تقدم الخطة",
                "concluded": "مكتمل",
                "concludeBtn": "إنهاء القراءة",
                "done": "تمت القراءة!",
                "resetBtn": "إعادة تعيين الخطة",
                "resetTitle": "إعادة تعيين الخطة؟",
                "resetSub": "سيتم مسح كل التقدم نهائيًا.",
                "resetConfirm": "نعم، إعادة التعيين",
                "cancel": "إلغاء",
                "resetSuccess": "✓ تمت إعادة تعيين الخطة"
        },
        "nt90": {
                "title": "العهد الجديد في 90 يومًا",
                "planName": "العهد الجديد في 90 يومًا",
                "tag": "خطة إضافية",
                "desc": "اقرأ العهد الجديد بأكمله في 90 يومًا، من متى إلى الرؤيا.",
                "startBtn": "بدء الخطة",
                "startInfo": "يتم حفظ تقدمك تلقائيًا.",
                "planStarted": "🚀 بدأت الخطة!",
                "daysWord": "أيام",
                "day": "اليوم",
                "of": "من",
                "today": "اليوم",
                "progressLabel": "تقدم الخطة",
                "concluded": "مكتمل",
                "concludeBtn": "إنهاء القراءة",
                "done": "تمت القراءة!",
                "resetBtn": "إعادة تعيين الخطة",
                "resetTitle": "إعادة تعيين الخطة؟",
                "resetSub": "سيتم مسح كل التقدم نهائيًا.",
                "resetConfirm": "نعم، إعادة التعيين",
                "cancel": "إلغاء",
                "resetSuccess": "✓ تمت إعادة تعيين الخطة"
        },
        "prov31": {
                "title": "الأمثال في 31 يومًا",
                "planName": "الأمثال في 31 يومًا",
                "tag": "خطة إضافية",
                "desc": "إصحاح واحد من الأمثال كل يوم — حكمة لكل يوم من الشهر.",
                "startBtn": "بدء الخطة",
                "startInfo": "يتم حفظ تقدمك تلقائيًا.",
                "planStarted": "🚀 بدأت الخطة!",
                "daysWord": "أيام",
                "day": "اليوم",
                "of": "من",
                "today": "اليوم",
                "progressLabel": "تقدم الخطة",
                "concluded": "مكتمل",
                "concludeBtn": "إنهاء القراءة",
                "done": "تمت القراءة!",
                "resetBtn": "إعادة تعيين الخطة",
                "resetTitle": "إعادة تعيين الخطة؟",
                "resetSub": "سيتم مسح كل التقدم نهائيًا.",
                "resetConfirm": "نعم، إعادة التعيين",
                "cancel": "إلغاء",
                "resetSuccess": "✓ تمت إعادة تعيين الخطة"
        }
},
    zh: {
        "brand": "✦ 圣经",
        "searchPlaceholder": "搜索圣经...",
        "todayReading": "今日阅读",
        "ot": "✦ 旧约",
        "nt": "✦ 新约",
        "listen": "收听",
        "stop": "停止",
        "search": "搜索",
        "results": "个结果",
        "goToRef": "跳转到经文",
        "noResults": "未找到相关经文。",
        "chapter": "章",
        "tabSearch": "搜索",
        "tabAssistant": "AI 助手",
        "assistantIntro": "按主题即时查找经文，完全离线 — 一切都在您的设备上运行。",
        "assistantTopicPlaceholder": "输入主题（如：饶恕、恐惧、信心）...",
        "loading": "正在加载圣言...",
        "tryAgain": "重试",
        "errorData": "未找到数据文件",
        "errorChapter": "未找到该章节",
        "errorGeneric": "加载数据时出错",
        "errorDataInstruction": "请在 script.js 之前添加到 index.html",
        "fontDown": "缩小字体",
        "fontUp": "放大字体",
        "listenTitle": "收听圣言",
        "scrollTop": "返回顶部",
        "menuTitle": "书卷菜单",
        "closeMenu": "关闭菜单",
        "openMenu": "打开菜单",
        "prev": "章",
        "next": "章",
        "langBtn": "中文",
        "hello": "你好",
        "verseOfDay": "每日经文",
        "bible": "圣经",
        "plans": "计划",
        "settings": "更多",
        "home": "主页",
        "username": "用户名",
        "language": "语言",
        "theme": "主题",
        "light": "浅色",
        "dark": "深色",
        "version": "圣经版本",
        "chooseVersion": "选择圣经版本",
        "chooseLanguage": "选择应用语言",
        "dailyPlan": "每日",
        "teensPlan": "青少年",
        "chapterWord": "章",
        "chaptersWord": "章",
        "chaptersLabel": "章节",
        "otherPlans": "其他计划",
        "privacy": {
                "navLabel": "隐私与数据",
                "heroTitle": "您的圣经学习属于您自己。",
                "heroDesc": "您在此保存的一切——进度、偏好设置、笔记——仅保留在此设备上，绝不会发送到任何服务器。",
                "badgeLocal": "🔒 100% 本地",
                "badgeNoTrack": "🚫 无跟踪",
                "badgeNoAds": "🚫 无广告",
                "badgeNoSell": "🚫 我们绝不出售数据",
                "exportTitle": "导出我的数据",
                "exportDesc": "将所有内容的副本下载为文件",
                "importTitle": "导入备份",
                "importDesc": "从先前保存的文件恢复",
                "deleteTitle": "删除所有内容",
                "deleteDesc": "永久删除此设备上的所有数据",
                "policyLink": "阅读完整隐私政策",
                "exportModalTitle": "导出您的数据",
                "exportModalSub": "包含您的偏好设置和阅读进度的文件。",
                "choicePlainTitle": "普通文件（.json）",
                "choicePlainDesc": "可读性强，易于检查。请妥善保管在可信的位置。",
                "choiceEncTitle": "密码保护文件",
                "choiceEncDesc": "在您的设备上加密——如果将存储在云端，建议使用此选项。",
                "passphraseLabel": "为此备份创建密码",
                "passphraseHint": "稍后导入此文件时需要用到它。请勿丢失——它无法找回。",
                "downloadBtn": "下载文件",
                "exportedOk": "✓ 文件下载成功",
                "importModalTitle": "导入备份",
                "importModalSub": "选择之前导出的文件。",
                "fileDropLabel": "点击选择文件",
                "fileChosen": "已选择文件",
                "importPassphraseLabel": "备份密码",
                "importBtn": "恢复数据",
                "importedOk": "✓ 数据已恢复，正在重新加载…",
                "importInvalid": "文件无效或已损坏。",
                "importWrongPass": "密码错误，请重试。",
                "importNeedsPass": "此文件受密码保护。",
                "deleteModalTitle": "删除所有数据？",
                "deleteModalSub": "此操作无法撤销。",
                "deleteWarning": "这将永久删除您在此设备上的偏好设置、姓名、主题、所选版本以及所有已保存的阅读计划进度。建议先导出数据。",
                "deleteConfirmLabel": "输入",
                "deleteConfirmWord": "删除",
                "deleteConfirmLabelEnd": "以确认",
                "deleteBtn": "永久删除所有内容",
                "deletedOk": "✓ 数据已删除，正在重新加载…",
                "cancel": "取消",
                "close": "关闭"
        },
        "daily": {
                "title": "每日阅读",
                "planName": "年度圣经计划",
                "today": "今天",
                "day": "第",
                "of": "天，共",
                "annualProgress": "年度进度",
                "concluded": "已完成",
                "concludeBtn": "完成阅读",
                "done": "阅读完成！"
        },
        "teens": {
                "title": "青少年计划",
                "tag": "圣经之旅",
                "bannerTitle": "探索<br>圣言",
                "startDesc": "今天就开始您的圣经阅读之旅！",
                "startBtn": "开始计划",
                "concluded": "已完成",
                "conclude": "完成今日",
                "backToPlan": "返回计划",
                "days": "天",
                "daysTitle": "天数",
                "chapters": "章节",
                "books": "书卷",
                "howItWorks": "使用说明",
                "startInfo": "您的进度会自动保存。",
                "preview": "计划预览",
                "andMore": "等等",
                "planStarted": "🚀 计划已开始！",
                "day": "第",
                "of": "天，共",
                "today": "今天",
                "future": "未来",
                "complete": "已完成",
                "late": "已延迟",
                "todayChapters": "今日阅读",
                "startReading": "开始阅读",
                "reRead": "重新阅读",
                "completedDay": "已完成！",
                "keepItUp": "继续保持！",
                "chapter": "章",
                "chapterPlural": "章",
                "read": "已读",
                "readPlural": "已读",
                "saved": "已保存",
                "savedPlural": "已保存",
                "backupTitle": "备份",
                "backupDesc": "导出或导入您的进度。",
                "exportTitle": "导出",
                "exportDesc": "将您的进度保存为文件。",
                "importTitle": "导入",
                "importDesc": "从备份恢复。",
                "downloadBtn": "下载 JSON",
                "copyBtn": "复制 JSON",
                "pasteBtn": "粘贴 JSON",
                "tapChoose": "点击选择",
                "dragDrop": "或拖拽到此处",
                "daysRead": "已读天数",
                "tapExport": "点击导出",
                "fileExported": "✓ 文件已导出",
                "jsonCopied": "✓ JSON 已复制",
                "invalidJson": "JSON 无效",
                "errorImport": "导入出错",
                "restored": "个章节已恢复",
                "errorLoad": "加载出错",
                "back": "返回",
                "prev": "上一个",
                "next": "下一个",
                "resetBtn": "重置计划",
                "resetTitle": "重置计划？",
                "resetSub": "所有进度将被永久清除。",
                "resetConfirm": "是，重置",
                "cancel": "取消",
                "resetSuccess": "✓ 计划已重置",
                "brand": "BibleXtra"
        },
        "bible6": {
                "title": "六个月读圣经",
                "planName": "六个月读圣经",
                "tag": "额外计划",
                "desc": "仅用 6 个月，按每日均衡的分量读完整本圣经。",
                "startBtn": "开始计划",
                "startInfo": "您的进度会自动保存。",
                "planStarted": "🚀 计划已开始！",
                "daysWord": "天",
                "day": "第",
                "of": "天，共",
                "today": "今天",
                "progressLabel": "计划进度",
                "concluded": "已完成",
                "concludeBtn": "完成阅读",
                "done": "阅读完成！",
                "resetBtn": "重置计划",
                "resetTitle": "重置计划？",
                "resetSub": "所有进度将被永久清除。",
                "resetConfirm": "是，重置",
                "cancel": "取消",
                "resetSuccess": "✓ 计划已重置"
        },
        "nt90": {
                "title": "90 天读新约",
                "planName": "90 天读新约",
                "tag": "额外计划",
                "desc": "用 90 天时间，从马太福音到启示录，通读整本新约。",
                "startBtn": "开始计划",
                "startInfo": "您的进度会自动保存。",
                "planStarted": "🚀 计划已开始！",
                "daysWord": "天",
                "day": "第",
                "of": "天，共",
                "today": "今天",
                "progressLabel": "计划进度",
                "concluded": "已完成",
                "concludeBtn": "完成阅读",
                "done": "阅读完成！",
                "resetBtn": "重置计划",
                "resetTitle": "重置计划？",
                "resetSub": "所有进度将被永久清除。",
                "resetConfirm": "是，重置",
                "cancel": "取消",
                "resetSuccess": "✓ 计划已重置"
        },
        "prov31": {
                "title": "31 天读箴言",
                "planName": "31 天读箴言",
                "tag": "额外计划",
                "desc": "每天一章箴言——每月每一天都有智慧相伴。",
                "startBtn": "开始计划",
                "startInfo": "您的进度会自动保存。",
                "planStarted": "🚀 计划已开始！",
                "daysWord": "天",
                "day": "第",
                "of": "天，共",
                "today": "今天",
                "progressLabel": "计划进度",
                "concluded": "已完成",
                "concludeBtn": "完成阅读",
                "done": "阅读完成！",
                "resetBtn": "重置计划",
                "resetTitle": "重置计划？",
                "resetSub": "所有进度将被永久清除。",
                "resetConfirm": "是，重置",
                "cancel": "取消",
                "resetSuccess": "✓ 计划已重置"
        }
},
    el: {
        "brand": "✦ Αγία Γραφή",
        "searchPlaceholder": "Αναζήτηση στη Γραφή...",
        "todayReading": "Ανάγνωση Σήμερα",
        "ot": "✦ Παλαιά Διαθήκη",
        "nt": "✦ Καινή Διαθήκη",
        "listen": "Ακρόαση",
        "stop": "Διακοπή",
        "search": "Αναζήτηση",
        "results": "αποτέλεσμα(τα)",
        "goToRef": "ΜΕΤΑΒΑΣΗ ΣΤΗΝ ΠΑΡΑΠΟΜΠΗ",
        "noResults": "Δεν βρέθηκαν εδάφια.",
        "chapter": "Κεφάλαιο",
        "tabSearch": "Αναζήτηση",
        "tabAssistant": "Βοηθός AI",
        "assistantIntro": "Βρείτε εδάφια ανά θέμα άμεσα, εντελώς εκτός σύνδεσης — όλα λειτουργούν στη συσκευή σας.",
        "assistantTopicPlaceholder": "Πληκτρολογήστε ένα θέμα (π.χ. συγχώρεση, φόβος, πίστη)...",
        "loading": "Φόρτωση του Λόγου...",
        "tryAgain": "Δοκιμάστε Ξανά",
        "errorData": "Το αρχείο δεδομένων δεν βρέθηκε",
        "errorChapter": "Το κεφάλαιο δεν βρέθηκε",
        "errorGeneric": "Σφάλμα φόρτωσης δεδομένων",
        "errorDataInstruction": "Προσθέστε στο index.html πριν το script.js",
        "fontDown": "Σμίκρυνση γραμματοσειράς",
        "fontUp": "Μεγέθυνση γραμματοσειράς",
        "listenTitle": "Ακούστε τον Λόγο",
        "scrollTop": "Επιστροφή στην κορυφή",
        "menuTitle": "Μενού βιβλίων",
        "closeMenu": "Κλείσιμο μενού",
        "openMenu": "Άνοιγμα μενού",
        "prev": "Κεφ",
        "next": "Κεφ",
        "langBtn": "Ελληνικά",
        "hello": "Γεια σου",
        "verseOfDay": "Εδάφιο της Ημέρας",
        "bible": "Γραφή",
        "plans": "Πλάνα",
        "settings": "Περισσότερα",
        "home": "Αρχική",
        "username": "Όνομα Χρήστη",
        "language": "Γλώσσα",
        "theme": "Θέμα",
        "light": "Ανοιχτό",
        "dark": "Σκούρο",
        "version": "Έκδοση Γραφής",
        "chooseVersion": "Επιλέξτε έκδοση της Γραφής",
        "chooseLanguage": "Επιλέξτε γλώσσα εφαρμογής",
        "dailyPlan": "Καθημερινό",
        "teensPlan": "Έφηβοι",
        "chapterWord": "κεφάλαιο",
        "chaptersWord": "κεφάλαια",
        "chaptersLabel": "Κεφάλαια",
        "otherPlans": "ΑΛΛΑ ΠΛΑΝΑ",
        "privacy": {
                "navLabel": "Απόρρητο & Δεδομένα",
                "heroTitle": "Η μελέτη της Γραφής σας ανήκει σε εσάς.",
                "heroDesc": "Όλα όσα αποθηκεύετε εδώ — πρόοδος, προτιμήσεις, σημειώσεις — παραμένουν μόνο σε αυτή τη συσκευή. Τίποτα δεν αποστέλλεται ποτέ σε διακομιστή.",
                "badgeLocal": "🔒 100% τοπικό",
                "badgeNoTrack": "🚫 Χωρίς παρακολούθηση",
                "badgeNoAds": "🚫 Χωρίς διαφημίσεις",
                "badgeNoSell": "🚫 Ποτέ δεν πουλάμε δεδομένα",
                "exportTitle": "Εξαγωγή των δεδομένων μου",
                "exportDesc": "Κατεβάστε ένα αντίγραφο όλων σε ένα αρχείο",
                "importTitle": "Εισαγωγή αντιγράφου ασφαλείας",
                "importDesc": "Επαναφορά από προηγουμένως αποθηκευμένο αρχείο",
                "deleteTitle": "Διαγραφή όλων",
                "deleteDesc": "Αφαιρεί μόνιμα όλα τα δεδομένα από αυτή τη συσκευή",
                "policyLink": "Διαβάστε την πλήρη πολιτική απορρήτου",
                "exportModalTitle": "Εξαγωγή δεδομένων σας",
                "exportModalSub": "Ένα αρχείο με τις προτιμήσεις σας και την πρόοδο ανάγνωσης.",
                "choicePlainTitle": "Απλό αρχείο (.json)",
                "choicePlainDesc": "Ευανάγνωστο, εύκολο να ελεγχθεί. Φυλάξτε το σε αξιόπιστο μέρος.",
                "choiceEncTitle": "Αρχείο προστατευμένο με κωδικό",
                "choiceEncDesc": "Κρυπτογραφημένο στη συσκευή σας — συνιστάται αν θα το αποθηκεύσετε στο cloud.",
                "passphraseLabel": "Δημιουργήστε έναν κωδικό για αυτό το αντίγραφο ασφαλείας",
                "passphraseHint": "Θα τον χρειαστείτε για να εισάγετε αυτό το αρχείο αργότερα. Μην τον χάσετε — δεν μπορεί να ανακτηθεί.",
                "downloadBtn": "Λήψη αρχείου",
                "exportedOk": "✓ Το αρχείο λήφθηκε με επιτυχία",
                "importModalTitle": "Εισαγωγή αντιγράφου ασφαλείας",
                "importModalSub": "Επιλέξτε το αρχείο που εξήχθη προηγουμένως.",
                "fileDropLabel": "Πατήστε για να επιλέξετε αρχείο",
                "fileChosen": "Το αρχείο επιλέχθηκε",
                "importPassphraseLabel": "Κωδικός αντιγράφου ασφαλείας",
                "importBtn": "Επαναφορά δεδομένων",
                "importedOk": "✓ Τα δεδομένα επαναφέρθηκαν. Επαναφόρτωση…",
                "importInvalid": "Μη έγκυρο ή κατεστραμμένο αρχείο.",
                "importWrongPass": "Λανθασμένος κωδικός. Δοκιμάστε ξανά.",
                "importNeedsPass": "Αυτό το αρχείο προστατεύεται με κωδικό.",
                "deleteModalTitle": "Διαγραφή όλων των δεδομένων;",
                "deleteModalSub": "Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.",
                "deleteWarning": "Αυτό αφαιρεί μόνιμα τις προτιμήσεις σας, το όνομα, το θέμα, την επιλεγμένη έκδοση και όλη την αποθηκευμένη πρόοδο των πλάνων ανάγνωσης σε αυτή τη συσκευή. Σκεφτείτε να κάνετε πρώτα εξαγωγή.",
                "deleteConfirmLabel": "Πληκτρολογήστε",
                "deleteConfirmWord": "ΔΙΑΓΡΑΦΗ",
                "deleteConfirmLabelEnd": "για επιβεβαίωση",
                "deleteBtn": "Μόνιμη διαγραφή όλων",
                "deletedOk": "✓ Τα δεδομένα διαγράφηκαν. Επαναφόρτωση…",
                "cancel": "Ακύρωση",
                "close": "Κλείσιμο"
        },
        "daily": {
                "title": "Καθημερινή Ανάγνωση",
                "planName": "Ετήσιο Πλάνο Γραφής",
                "today": "Σήμερα",
                "day": "Ημέρα",
                "of": "από",
                "annualProgress": "Ετήσια Πρόοδος",
                "concluded": "Ολοκληρώθηκε",
                "concludeBtn": "Ολοκλήρωση Ανάγνωσης",
                "done": "Η Ανάγνωση Ολοκληρώθηκε!"
        },
        "teens": {
                "title": "Πλάνο Εφήβων",
                "tag": "Ταξίδι στη Γραφή",
                "bannerTitle": "Εξερευνώντας<br>τον Λόγο",
                "startDesc": "Ξεκινήστε το ταξίδι ανάγνωσης της Γραφής σήμερα!",
                "startBtn": "Έναρξη Πλάνου",
                "concluded": "Ολοκληρώθηκε",
                "conclude": "Ολοκλήρωση Ημέρας",
                "backToPlan": "Επιστροφή στο Πλάνο",
                "days": "ημέρες",
                "daysTitle": "Ημέρες",
                "chapters": "Κεφάλαια",
                "books": "Βιβλία",
                "howItWorks": "Πώς λειτουργεί",
                "startInfo": "Η πρόοδός σας αποθηκεύεται αυτόματα.",
                "preview": "Προεπισκόπηση πλάνου",
                "andMore": "και περισσότερα",
                "planStarted": "🚀 Το πλάνο ξεκίνησε!",
                "day": "Ημέρα",
                "of": "από",
                "today": "Σήμερα",
                "future": "Μελλοντικό",
                "complete": "Ολοκληρωμένο",
                "late": "Καθυστερημένο",
                "todayChapters": "Σημερινή ανάγνωση",
                "startReading": "Έναρξη ανάγνωσης",
                "reRead": "Επανάγνωση",
                "completedDay": "ολοκληρώθηκε!",
                "keepItUp": "Συνεχίστε έτσι!",
                "chapter": "κεφάλαιο",
                "chapterPlural": "κεφάλαια",
                "read": "διαβασμένο",
                "readPlural": "διαβασμένα",
                "saved": "αποθηκευμένο",
                "savedPlural": "αποθηκευμένα",
                "backupTitle": "Αντίγραφο ασφαλείας",
                "backupDesc": "Εξαγωγή ή εισαγωγή της προόδου σας.",
                "exportTitle": "Εξαγωγή",
                "exportDesc": "Αποθηκεύστε την πρόοδό σας σε αρχείο.",
                "importTitle": "Εισαγωγή",
                "importDesc": "Επαναφορά από αντίγραφο ασφαλείας.",
                "downloadBtn": "Λήψη JSON",
                "copyBtn": "Αντιγραφή JSON",
                "pasteBtn": "Επικόλληση JSON",
                "tapChoose": "Πατήστε για επιλογή",
                "dragDrop": "ή σύρετε εδώ",
                "daysRead": "Ημέρες ανάγνωσης",
                "tapExport": "Πατήστε για εξαγωγή",
                "fileExported": "✓ Το αρχείο εξήχθη",
                "jsonCopied": "✓ Το JSON αντιγράφηκε",
                "invalidJson": "Μη έγκυρο JSON",
                "errorImport": "Σφάλμα εισαγωγής",
                "restored": "κεφάλαια επαναφέρθηκαν",
                "errorLoad": "Σφάλμα φόρτωσης",
                "back": "Πίσω",
                "prev": "Προηγ",
                "next": "Επόμ",
                "resetBtn": "Επαναφορά πλάνου",
                "resetTitle": "Επαναφορά πλάνου;",
                "resetSub": "Όλη η πρόοδος θα διαγραφεί μόνιμα.",
                "resetConfirm": "Ναι, επαναφορά",
                "cancel": "Ακύρωση",
                "resetSuccess": "✓ Το πλάνο επαναφέρθηκε",
                "brand": "BibleXtra"
        },
        "bible6": {
                "title": "Η Γραφή σε 6 Μήνες",
                "planName": "Η Γραφή σε 6 Μήνες",
                "tag": "ΠΛΑΝΟ XTRA",
                "desc": "Διαβάστε ολόκληρη τη Γραφή σε μόλις 6 μήνες, σε ισορροπημένα καθημερινά τμήματα.",
                "startBtn": "Έναρξη Πλάνου",
                "startInfo": "Η πρόοδός σας αποθηκεύεται αυτόματα.",
                "planStarted": "🚀 Το πλάνο ξεκίνησε!",
                "daysWord": "ημέρες",
                "day": "Ημέρα",
                "of": "από",
                "today": "Σήμερα",
                "progressLabel": "Πρόοδος Πλάνου",
                "concluded": "Ολοκληρώθηκε",
                "concludeBtn": "Ολοκλήρωση Ανάγνωσης",
                "done": "Η Ανάγνωση Ολοκληρώθηκε!",
                "resetBtn": "Επαναφορά πλάνου",
                "resetTitle": "Επαναφορά πλάνου;",
                "resetSub": "Όλη η πρόοδος θα διαγραφεί μόνιμα.",
                "resetConfirm": "Ναι, επαναφορά",
                "cancel": "Ακύρωση",
                "resetSuccess": "✓ Το πλάνο επαναφέρθηκε"
        },
        "nt90": {
                "title": "Καινή Διαθήκη σε 90 Ημέρες",
                "planName": "Καινή Διαθήκη σε 90 Ημέρες",
                "tag": "ΠΛΑΝΟ XTRA",
                "desc": "Διατρέξτε ολόκληρη την Καινή Διαθήκη σε 90 ημέρες, από τον Ματθαίο ως την Αποκάλυψη.",
                "startBtn": "Έναρξη Πλάνου",
                "startInfo": "Η πρόοδός σας αποθηκεύεται αυτόματα.",
                "planStarted": "🚀 Το πλάνο ξεκίνησε!",
                "daysWord": "ημέρες",
                "day": "Ημέρα",
                "of": "από",
                "today": "Σήμερα",
                "progressLabel": "Πρόοδος Πλάνου",
                "concluded": "Ολοκληρώθηκε",
                "concludeBtn": "Ολοκλήρωση Ανάγνωσης",
                "done": "Η Ανάγνωση Ολοκληρώθηκε!",
                "resetBtn": "Επαναφορά πλάνου",
                "resetTitle": "Επαναφορά πλάνου;",
                "resetSub": "Όλη η πρόοδος θα διαγραφεί μόνιμα.",
                "resetConfirm": "Ναι, επαναφορά",
                "cancel": "Ακύρωση",
                "resetSuccess": "✓ Το πλάνο επαναφέρθηκε"
        },
        "prov31": {
                "title": "Παροιμίες σε 31 Ημέρες",
                "planName": "Παροιμίες σε 31 Ημέρες",
                "tag": "ΠΛΑΝΟ XTRA",
                "desc": "Ένα κεφάλαιο των Παροιμιών την ημέρα — σοφία για κάθε ημέρα του μήνα.",
                "startBtn": "Έναρξη Πλάνου",
                "startInfo": "Η πρόοδός σας αποθηκεύεται αυτόματα.",
                "planStarted": "🚀 Το πλάνο ξεκίνησε!",
                "daysWord": "ημέρες",
                "day": "Ημέρα",
                "of": "από",
                "today": "Σήμερα",
                "progressLabel": "Πρόοδος Πλάνου",
                "concluded": "Ολοκληρώθηκε",
                "concludeBtn": "Ολοκλήρωση Ανάγνωσης",
                "done": "Η Ανάγνωση Ολοκληρώθηκε!",
                "resetBtn": "Επαναφορά πλάνου",
                "resetTitle": "Επαναφορά πλάνου;",
                "resetSub": "Όλη η πρόοδος θα διαγραφεί μόνιμα.",
                "resetConfirm": "Ναι, επαναφορά",
                "cancel": "Ακύρωση",
                "resetSuccess": "✓ Το πλάνο επαναφέρθηκε"
        }
},
    eo: {
        "brand": "✦ Sankta Biblio",
        "searchPlaceholder": "Serĉi en la Biblio...",
        "todayReading": "Hodiaŭa Legado",
        "ot": "✦ Malnova Testamento",
        "nt": "✦ Nova Testamento",
        "listen": "Aŭskulti",
        "stop": "Halti",
        "search": "Serĉo",
        "results": "rezulto(j)",
        "goToRef": "IRI AL REFERENCO",
        "noResults": "Neniuj versoj trovitaj.",
        "chapter": "Ĉapitro",
        "tabSearch": "Serĉo",
        "tabAssistant": "AI-Asistanto",
        "assistantIntro": "Trovu versojn laŭ temo tuj, tute eksterrete — ĉio funkcias sur via aparato.",
        "assistantTopicPlaceholder": "Tajpu temon (ekz. pardono, timo, fido)...",
        "loading": "Ŝarĝante la Vorton...",
        "tryAgain": "Reprovi",
        "errorData": "Datumdosiero ne trovita",
        "errorChapter": "Ĉapitro ne trovita",
        "errorGeneric": "Eraro dum ŝarĝado de datumoj",
        "errorDataInstruction": "Aldonu al index.html antaŭ script.js",
        "fontDown": "Malgrandigi tiparon",
        "fontUp": "Grandigi tiparon",
        "listenTitle": "Aŭskulti la Vorton",
        "scrollTop": "Reen al supro",
        "menuTitle": "Libro-menuo",
        "closeMenu": "Fermi menuon",
        "openMenu": "Malfermi menuon",
        "prev": "Ĉap",
        "next": "Ĉap",
        "langBtn": "Esperanto",
        "hello": "Saluton",
        "verseOfDay": "Verso de la Tago",
        "bible": "Biblio",
        "plans": "Planoj",
        "settings": "Pli",
        "home": "Hejmo",
        "username": "Uzantonomo",
        "language": "Lingvo",
        "theme": "Etoso",
        "light": "Hela",
        "dark": "Malhela",
        "version": "Biblia Versio",
        "chooseVersion": "Elekti Biblian version",
        "chooseLanguage": "Elekti lingvon de la apo",
        "dailyPlan": "Ĉiutaga",
        "teensPlan": "Junuloj",
        "chapterWord": "ĉapitro",
        "chaptersWord": "ĉapitroj",
        "chaptersLabel": "Ĉapitroj",
        "otherPlans": "ALIAJ PLANOJ",
        "privacy": {
                "navLabel": "Privateco kaj Datumoj",
                "heroTitle": "Via Biblia studo apartenas al vi.",
                "heroDesc": "Ĉio, kion vi konservas ĉi tie — progreso, preferoj, notoj — restas nur en ĉi tiu aparato. Nenio estas iam ajn sendata al servilo.",
                "badgeLocal": "🔒 100% loka",
                "badgeNoTrack": "🚫 Neniu spurado",
                "badgeNoAds": "🚫 Neniuj reklamoj",
                "badgeNoSell": "🚫 Ni neniam vendas datumojn",
                "exportTitle": "Eksporti miajn datumojn",
                "exportDesc": "Elŝutu kopion de ĉio kiel dosiero",
                "importTitle": "Importi savkopion",
                "importDesc": "Restaŭri el antaŭe konservita dosiero",
                "deleteTitle": "Forigi ĉion",
                "deleteDesc": "Permanente forigas ĉiujn datumojn de ĉi tiu aparato",
                "policyLink": "Legi la kompletan privatecan politikon",
                "exportModalTitle": "Eksporti viajn datumojn",
                "exportModalSub": "Dosiero kun viaj preferoj kaj lega progreso.",
                "choicePlainTitle": "Simpla dosiero (.json)",
                "choicePlainDesc": "Legebla, facile kontrolebla. Konservu ĝin ie fidinda.",
                "choiceEncTitle": "Pasvortprotektita dosiero",
                "choiceEncDesc": "Ĉifrita sur via aparato — rekomendata se vi konservos ĝin en la nubo.",
                "passphraseLabel": "Kreu pasvorton por ĉi tiu savkopio",
                "passphraseHint": "Vi bezonos ĝin por importi ĉi tiun dosieron poste. Ne perdu ĝin — ĝi ne rehaveblas.",
                "downloadBtn": "Elŝuti dosieron",
                "exportedOk": "✓ Dosiero sukcese elŝutita",
                "importModalTitle": "Importi savkopion",
                "importModalSub": "Elektu la antaŭe eksportitan dosieron.",
                "fileDropLabel": "Tuŝu por elekti dosieron",
                "fileChosen": "Dosiero elektita",
                "importPassphraseLabel": "Pasvorto de savkopio",
                "importBtn": "Restaŭri datumojn",
                "importedOk": "✓ Datumoj restaŭritaj. Reŝarĝante…",
                "importInvalid": "Nevalida aŭ difektita dosiero.",
                "importWrongPass": "Malĝusta pasvorto. Provu denove.",
                "importNeedsPass": "Ĉi tiu dosiero estas pasvortprotektita.",
                "deleteModalTitle": "Ĉu forigi ĉiujn datumojn?",
                "deleteModalSub": "Ĉi tiu ago ne malfareblas.",
                "deleteWarning": "Ĉi tio permanente forigas viajn preferojn, nomon, etoson, elektitan version, kaj ĉiun konservitan progreson en legaj planoj sur ĉi tiu aparato. Konsideru eksporti unue.",
                "deleteConfirmLabel": "Tajpu",
                "deleteConfirmWord": "FORIGI",
                "deleteConfirmLabelEnd": "por konfirmi",
                "deleteBtn": "Permanente forigi ĉion",
                "deletedOk": "✓ Datumoj forigitaj. Reŝarĝante…",
                "cancel": "Nuligi",
                "close": "Fermi"
        },
        "daily": {
                "title": "Ĉiutaga Legado",
                "planName": "Jara Biblia Plano",
                "today": "Hodiaŭ",
                "day": "Tago",
                "of": "de",
                "annualProgress": "Jara Progreso",
                "concluded": "Finita",
                "concludeBtn": "Fini Legadon",
                "done": "Legado Finita!"
        },
        "teens": {
                "title": "Plano por Junuloj",
                "tag": "Biblia Vojaĝo",
                "bannerTitle": "Esplorante<br>la Vorton",
                "startDesc": "Komencu vian Biblian legan vojaĝon hodiaŭ!",
                "startBtn": "Komenci Planon",
                "concluded": "Finita",
                "conclude": "Fini Tagon",
                "backToPlan": "Reen al Plano",
                "days": "tagoj",
                "daysTitle": "Tagoj",
                "chapters": "Ĉapitroj",
                "books": "Libroj",
                "howItWorks": "Kiel ĝi funkcias",
                "startInfo": "Via progreso estas aŭtomate konservata.",
                "preview": "Antaŭrigardo de plano",
                "andMore": "kaj pli",
                "planStarted": "🚀 Plano komencita!",
                "day": "Tago",
                "of": "de",
                "today": "Hodiaŭ",
                "future": "Estonta",
                "complete": "Kompleta",
                "late": "Malfrua",
                "todayChapters": "Hodiaŭa legado",
                "startReading": "Komenci legi",
                "reRead": "Relegi",
                "completedDay": "finita!",
                "keepItUp": "Daŭrigu tiel!",
                "chapter": "ĉapitro",
                "chapterPlural": "ĉapitroj",
                "read": "legita",
                "readPlural": "legitaj",
                "saved": "konservita",
                "savedPlural": "konservitaj",
                "backupTitle": "Savkopio",
                "backupDesc": "Eksportu aŭ importu vian progreson.",
                "exportTitle": "Eksporti",
                "exportDesc": "Konservu vian progreson en dosiero.",
                "importTitle": "Importi",
                "importDesc": "Restaŭri el savkopio.",
                "downloadBtn": "Elŝuti JSON",
                "copyBtn": "Kopii JSON",
                "pasteBtn": "Alglui JSON",
                "tapChoose": "Tuŝu por elekti",
                "dragDrop": "aŭ trenu ĉi tien",
                "daysRead": "Legitaj tagoj",
                "tapExport": "Tuŝu por eksporti",
                "fileExported": "✓ Dosiero eksportita",
                "jsonCopied": "✓ JSON kopiita",
                "invalidJson": "Nevalida JSON",
                "errorImport": "Eraro dum importado",
                "restored": "ĉapitroj restaŭritaj",
                "errorLoad": "Eraro dum ŝarĝado",
                "back": "Reen",
                "prev": "Antaŭa",
                "next": "Sekva",
                "resetBtn": "Restarigi planon",
                "resetTitle": "Ĉu restarigi planon?",
                "resetSub": "Ĉiu progreso estos permanente forigita.",
                "resetConfirm": "Jes, restarigi",
                "cancel": "Nuligi",
                "resetSuccess": "✓ Plano restarigita",
                "brand": "BibleXtra"
        },
        "bible6": {
                "title": "Biblio en 6 Monatoj",
                "planName": "Biblio en 6 Monatoj",
                "tag": "XTRA PLANO",
                "desc": "Legu la tutan Biblion en nur 6 monatoj, en ekvilibraj ĉiutagaj partoj.",
                "startBtn": "Komenci Planon",
                "startInfo": "Via progreso estas aŭtomate konservata.",
                "planStarted": "🚀 Plano komencita!",
                "daysWord": "tagoj",
                "day": "Tago",
                "of": "de",
                "today": "Hodiaŭ",
                "progressLabel": "Plana Progreso",
                "concluded": "Finita",
                "concludeBtn": "Fini Legadon",
                "done": "Legado Finita!",
                "resetBtn": "Restarigi planon",
                "resetTitle": "Ĉu restarigi planon?",
                "resetSub": "Ĉiu progreso estos permanente forigita.",
                "resetConfirm": "Jes, restarigi",
                "cancel": "Nuligi",
                "resetSuccess": "✓ Plano restarigita"
        },
        "nt90": {
                "title": "Nova Testamento en 90 Tagoj",
                "planName": "Nova Testamento en 90 Tagoj",
                "tag": "XTRA PLANO",
                "desc": "Trairu la tutan Novan Testamenton en 90 tagoj, de Mateo ĝis Apokalipso.",
                "startBtn": "Komenci Planon",
                "startInfo": "Via progreso estas aŭtomate konservata.",
                "planStarted": "🚀 Plano komencita!",
                "daysWord": "tagoj",
                "day": "Tago",
                "of": "de",
                "today": "Hodiaŭ",
                "progressLabel": "Plana Progreso",
                "concluded": "Finita",
                "concludeBtn": "Fini Legadon",
                "done": "Legado Finita!",
                "resetBtn": "Restarigi planon",
                "resetTitle": "Ĉu restarigi planon?",
                "resetSub": "Ĉiu progreso estos permanente forigita.",
                "resetConfirm": "Jes, restarigi",
                "cancel": "Nuligi",
                "resetSuccess": "✓ Plano restarigita"
        },
        "prov31": {
                "title": "Sentencoj en 31 Tagoj",
                "planName": "Sentencoj en 31 Tagoj",
                "tag": "XTRA PLANO",
                "desc": "Unu ĉapitro de Sentencoj ĉiutage — saĝeco por ĉiu tago de la monato.",
                "startBtn": "Komenci Planon",
                "startInfo": "Via progreso estas aŭtomate konservata.",
                "planStarted": "🚀 Plano komencita!",
                "daysWord": "tagoj",
                "day": "Tago",
                "of": "de",
                "today": "Hodiaŭ",
                "progressLabel": "Plana Progreso",
                "concluded": "Finita",
                "concludeBtn": "Fini Legadon",
                "done": "Legado Finita!",
                "resetBtn": "Restarigi planon",
                "resetTitle": "Ĉu restarigi planon?",
                "resetSub": "Ĉiu progreso estos permanente forigita.",
                "resetConfirm": "Jes, restarigi",
                "cancel": "Nuligi",
                "resetSuccess": "✓ Plano restarigita"
        }
},
    fi: {
        "brand": "✦ Pyhä Raamattu",
        "searchPlaceholder": "Hae Raamatusta...",
        "todayReading": "Tämän Päivän Lukukappale",
        "ot": "✦ Vanha Testamentti",
        "nt": "✦ Uusi Testamentti",
        "listen": "Kuuntele",
        "stop": "Pysäytä",
        "search": "Haku",
        "results": "tulos(ta)",
        "goToRef": "SIIRRY VIITTEESEEN",
        "noResults": "Jakeita ei löytynyt.",
        "chapter": "Luku",
        "tabSearch": "Haku",
        "tabAssistant": "Tekoälyavustaja",
        "assistantIntro": "Löydä jakeita aiheen mukaan heti, täysin ilman verkkoyhteyttä — kaikki toimii laitteellasi.",
        "assistantTopicPlaceholder": "Kirjoita aihe (esim. anteeksianto, pelko, usko)...",
        "loading": "Ladataan Sanaa...",
        "tryAgain": "Yritä Uudelleen",
        "errorData": "Tietotiedostoa ei löytynyt",
        "errorChapter": "Lukua ei löytynyt",
        "errorGeneric": "Virhe ladattaessa tietoja",
        "errorDataInstruction": "Lisää index.html-tiedostoon ennen script.js:ää",
        "fontDown": "Pienennä fonttia",
        "fontUp": "Suurenna fonttia",
        "listenTitle": "Kuuntele Sanaa",
        "scrollTop": "Takaisin ylös",
        "menuTitle": "Kirjavalikko",
        "closeMenu": "Sulje valikko",
        "openMenu": "Avaa valikko",
        "prev": "Luku",
        "next": "Luku",
        "langBtn": "Suomi",
        "hello": "Hei",
        "verseOfDay": "Päivän Jae",
        "bible": "Raamattu",
        "plans": "Suunnitelmat",
        "settings": "Lisää",
        "home": "Koti",
        "username": "Käyttäjänimi",
        "language": "Kieli",
        "theme": "Teema",
        "light": "Vaalea",
        "dark": "Tumma",
        "version": "Raamatunkäännös",
        "chooseVersion": "Valitse raamatunkäännös",
        "chooseLanguage": "Valitse sovelluksen kieli",
        "dailyPlan": "Päivittäinen",
        "teensPlan": "Nuoret",
        "chapterWord": "luku",
        "chaptersWord": "lukua",
        "chaptersLabel": "Luvut",
        "otherPlans": "MUUT SUUNNITELMAT",
        "privacy": {
                "navLabel": "Yksityisyys ja Tiedot",
                "heroTitle": "Raamatuntutkistelusi kuuluu sinulle.",
                "heroDesc": "Kaikki mitä tallennat tänne — edistyminen, asetukset, muistiinpanot — pysyy vain tällä laitteella. Mitään ei koskaan lähetetä palvelimelle.",
                "badgeLocal": "🔒 100 % paikallinen",
                "badgeNoTrack": "🚫 Ei seurantaa",
                "badgeNoAds": "🚫 Ei mainoksia",
                "badgeNoSell": "🚫 Emme koskaan myy tietoja",
                "exportTitle": "Vie tietoni",
                "exportDesc": "Lataa kopio kaikesta tiedostona",
                "importTitle": "Tuo varmuuskopio",
                "importDesc": "Palauta aiemmin tallennetusta tiedostosta",
                "deleteTitle": "Poista kaikki",
                "deleteDesc": "Poistaa pysyvästi kaikki tiedot tältä laitteelta",
                "policyLink": "Lue koko tietosuojakäytäntö",
                "exportModalTitle": "Vie tietosi",
                "exportModalSub": "Tiedosto, joka sisältää asetuksesi ja lukemisen edistymisen.",
                "choicePlainTitle": "Tavallinen tiedosto (.json)",
                "choicePlainDesc": "Luettava, helppo tarkistaa. Säilytä luotettavassa paikassa.",
                "choiceEncTitle": "Salasanalla suojattu tiedosto",
                "choiceEncDesc": "Salattu laitteellasi — suositellaan, jos tallennat sen pilveen.",
                "passphraseLabel": "Luo salasana tälle varmuuskopiolle",
                "passphraseHint": "Tarvitset sitä tuodaksesi tämän tiedoston myöhemmin. Älä hukkaa sitä — sitä ei voi palauttaa.",
                "downloadBtn": "Lataa tiedosto",
                "exportedOk": "✓ Tiedosto ladattu onnistuneesti",
                "importModalTitle": "Tuo varmuuskopio",
                "importModalSub": "Valitse aiemmin viety tiedosto.",
                "fileDropLabel": "Napauta valitaksesi tiedoston",
                "fileChosen": "Tiedosto valittu",
                "importPassphraseLabel": "Varmuuskopion salasana",
                "importBtn": "Palauta tiedot",
                "importedOk": "✓ Tiedot palautettu. Ladataan uudelleen…",
                "importInvalid": "Virheellinen tai vioittunut tiedosto.",
                "importWrongPass": "Väärä salasana. Yritä uudelleen.",
                "importNeedsPass": "Tämä tiedosto on salasanalla suojattu.",
                "deleteModalTitle": "Poistetaanko kaikki tiedot?",
                "deleteModalSub": "Tätä toimintoa ei voi peruuttaa.",
                "deleteWarning": "Tämä poistaa pysyvästi asetuksesi, nimesi, teeman, valitun käännöksen ja kaiken tallennetun lukusuunnitelmien edistymisen tällä laitteella. Harkitse viemistä ensin.",
                "deleteConfirmLabel": "Kirjoita",
                "deleteConfirmWord": "POISTA",
                "deleteConfirmLabelEnd": "vahvistaaksesi",
                "deleteBtn": "Poista kaikki pysyvästi",
                "deletedOk": "✓ Tiedot poistettu. Ladataan uudelleen…",
                "cancel": "Peruuta",
                "close": "Sulje"
        },
        "daily": {
                "title": "Päivittäinen Lukeminen",
                "planName": "Vuotuinen Raamattusuunnitelma",
                "today": "Tänään",
                "day": "Päivä",
                "of": "/",
                "annualProgress": "Vuotuinen Edistyminen",
                "concluded": "Suoritettu",
                "concludeBtn": "Merkitse Luetuksi",
                "done": "Lukeminen Suoritettu!"
        },
        "teens": {
                "title": "Nuorten Suunnitelma",
                "tag": "Raamatullinen Matka",
                "bannerTitle": "Tutkitaan<br>Sanaa",
                "startDesc": "Aloita raamatunlukumatkasi jo tänään!",
                "startBtn": "Aloita Suunnitelma",
                "concluded": "Suoritettu",
                "conclude": "Merkitse Päivä Valmiiksi",
                "backToPlan": "Takaisin Suunnitelmaan",
                "days": "päivää",
                "daysTitle": "Päivät",
                "chapters": "Luvut",
                "books": "Kirjat",
                "howItWorks": "Näin se toimii",
                "startInfo": "Edistymisesi tallennetaan automaattisesti.",
                "preview": "Suunnitelman esikatselu",
                "andMore": "ja lisää",
                "planStarted": "🚀 Suunnitelma aloitettu!",
                "day": "Päivä",
                "of": "/",
                "today": "Tänään",
                "future": "Tuleva",
                "complete": "Valmis",
                "late": "Myöhässä",
                "todayChapters": "Tämän päivän lukukappale",
                "startReading": "Aloita lukeminen",
                "reRead": "Lue uudelleen",
                "completedDay": "suoritettu!",
                "keepItUp": "Jatka samaan malliin!",
                "chapter": "luku",
                "chapterPlural": "lukua",
                "read": "luettu",
                "readPlural": "luettu",
                "saved": "tallennettu",
                "savedPlural": "tallennettu",
                "backupTitle": "Varmuuskopio",
                "backupDesc": "Vie tai tuo edistymisesi.",
                "exportTitle": "Vie",
                "exportDesc": "Tallenna edistymisesi tiedostoon.",
                "importTitle": "Tuo",
                "importDesc": "Palauta varmuuskopiosta.",
                "downloadBtn": "Lataa JSON",
                "copyBtn": "Kopioi JSON",
                "pasteBtn": "Liitä JSON",
                "tapChoose": "Napauta valitaksesi",
                "dragDrop": "tai vedä tähän",
                "daysRead": "Luetut päivät",
                "tapExport": "Napauta viedäksesi",
                "fileExported": "✓ Tiedosto viety",
                "jsonCopied": "✓ JSON kopioitu",
                "invalidJson": "Virheellinen JSON",
                "errorImport": "Virhe tuonnissa",
                "restored": "lukua palautettu",
                "errorLoad": "Virhe latauksessa",
                "back": "Takaisin",
                "prev": "Edell",
                "next": "Seur",
                "resetBtn": "Nollaa suunnitelma",
                "resetTitle": "Nollataanko suunnitelma?",
                "resetSub": "Kaikki edistyminen poistetaan pysyvästi.",
                "resetConfirm": "Kyllä, nollaa",
                "cancel": "Peruuta",
                "resetSuccess": "✓ Suunnitelma nollattu",
                "brand": "BibleXtra"
        },
        "bible6": {
                "title": "Raamattu 6 Kuukaudessa",
                "planName": "Raamattu 6 Kuukaudessa",
                "tag": "XTRA-SUUNNITELMA",
                "desc": "Lue koko Raamattu vain 6 kuukaudessa, tasapainoisina päivittäisinä osina.",
                "startBtn": "Aloita Suunnitelma",
                "startInfo": "Edistymisesi tallennetaan automaattisesti.",
                "planStarted": "🚀 Suunnitelma aloitettu!",
                "daysWord": "päivää",
                "day": "Päivä",
                "of": "/",
                "today": "Tänään",
                "progressLabel": "Suunnitelman Edistyminen",
                "concluded": "Suoritettu",
                "concludeBtn": "Merkitse Luetuksi",
                "done": "Lukeminen Suoritettu!",
                "resetBtn": "Nollaa suunnitelma",
                "resetTitle": "Nollataanko suunnitelma?",
                "resetSub": "Kaikki edistyminen poistetaan pysyvästi.",
                "resetConfirm": "Kyllä, nollaa",
                "cancel": "Peruuta",
                "resetSuccess": "✓ Suunnitelma nollattu"
        },
        "nt90": {
                "title": "Uusi Testamentti 90 Päivässä",
                "planName": "Uusi Testamentti 90 Päivässä",
                "tag": "XTRA-SUUNNITELMA",
                "desc": "Käy läpi koko Uusi testamentti 90 päivässä, Matteuksesta Ilmestyskirjaan.",
                "startBtn": "Aloita Suunnitelma",
                "startInfo": "Edistymisesi tallennetaan automaattisesti.",
                "planStarted": "🚀 Suunnitelma aloitettu!",
                "daysWord": "päivää",
                "day": "Päivä",
                "of": "/",
                "today": "Tänään",
                "progressLabel": "Suunnitelman Edistyminen",
                "concluded": "Suoritettu",
                "concludeBtn": "Merkitse Luetuksi",
                "done": "Lukeminen Suoritettu!",
                "resetBtn": "Nollaa suunnitelma",
                "resetTitle": "Nollataanko suunnitelma?",
                "resetSub": "Kaikki edistyminen poistetaan pysyvästi.",
                "resetConfirm": "Kyllä, nollaa",
                "cancel": "Peruuta",
                "resetSuccess": "✓ Suunnitelma nollattu"
        },
        "prov31": {
                "title": "Sananlaskut 31 Päivässä",
                "planName": "Sananlaskut 31 Päivässä",
                "tag": "XTRA-SUUNNITELMA",
                "desc": "Yksi luku Sananlaskuja päivässä — viisautta kuukauden jokaiselle päivälle.",
                "startBtn": "Aloita Suunnitelma",
                "startInfo": "Edistymisesi tallennetaan automaattisesti.",
                "planStarted": "🚀 Suunnitelma aloitettu!",
                "daysWord": "päivää",
                "day": "Päivä",
                "of": "/",
                "today": "Tänään",
                "progressLabel": "Suunnitelman Edistyminen",
                "concluded": "Suoritettu",
                "concludeBtn": "Merkitse Luetuksi",
                "done": "Lukeminen Suoritettu!",
                "resetBtn": "Nollaa suunnitelma",
                "resetTitle": "Nollataanko suunnitelma?",
                "resetSub": "Kaikki edistyminen poistetaan pysyvästi.",
                "resetConfirm": "Kyllä, nollaa",
                "cancel": "Peruuta",
                "resetSuccess": "✓ Suunnitelma nollattu"
        }
},
    ko: {
        "brand": "✦ 성경",
        "searchPlaceholder": "성경 검색...",
        "todayReading": "오늘의 읽기",
        "ot": "✦ 구약성경",
        "nt": "✦ 신약성경",
        "listen": "듣기",
        "stop": "정지",
        "search": "검색",
        "results": "개 결과",
        "goToRef": "본문으로 이동",
        "noResults": "찾은 구절이 없습니다.",
        "chapter": "장",
        "tabSearch": "검색",
        "tabAssistant": "AI 어시스턴트",
        "assistantIntro": "주제별로 구절을 즉시, 완전히 오프라인으로 찾아보세요 — 모든 것이 기기에서 실행됩니다.",
        "assistantTopicPlaceholder": "주제를 입력하세요 (예: 용서, 두려움, 믿음)...",
        "loading": "말씀을 불러오는 중...",
        "tryAgain": "다시 시도",
        "errorData": "데이터 파일을 찾을 수 없습니다",
        "errorChapter": "장을 찾을 수 없습니다",
        "errorGeneric": "데이터 로드 중 오류 발생",
        "errorDataInstruction": "script.js 이전에 index.html에 추가하세요",
        "fontDown": "글자 축소",
        "fontUp": "글자 확대",
        "listenTitle": "말씀 듣기",
        "scrollTop": "맨 위로",
        "menuTitle": "성경책 메뉴",
        "closeMenu": "메뉴 닫기",
        "openMenu": "메뉴 열기",
        "prev": "장",
        "next": "장",
        "langBtn": "한국어",
        "hello": "안녕하세요",
        "verseOfDay": "오늘의 말씀",
        "bible": "성경",
        "plans": "읽기 계획",
        "settings": "더보기",
        "home": "홈",
        "username": "사용자 이름",
        "language": "언어",
        "theme": "테마",
        "light": "밝게",
        "dark": "어둡게",
        "version": "성경 버전",
        "chooseVersion": "성경 버전 선택",
        "chooseLanguage": "앱 언어 선택",
        "dailyPlan": "매일",
        "teensPlan": "청소년",
        "chapterWord": "장",
        "chaptersWord": "장",
        "chaptersLabel": "장",
        "otherPlans": "다른 계획",
        "privacy": {
                "navLabel": "개인정보 및 데이터",
                "heroTitle": "당신의 성경 공부는 당신의 것입니다.",
                "heroDesc": "여기에 저장하는 모든 것 — 진행 상황, 설정, 메모 — 은 오직 이 기기에만 남습니다. 어떤 서버로도 전송되지 않습니다.",
                "badgeLocal": "🔒 100% 로컬",
                "badgeNoTrack": "🚫 추적 없음",
                "badgeNoAds": "🚫 광고 없음",
                "badgeNoSell": "🚫 데이터를 절대 판매하지 않음",
                "exportTitle": "내 데이터 내보내기",
                "exportDesc": "모든 내용의 사본을 파일로 다운로드",
                "importTitle": "백업 가져오기",
                "importDesc": "이전에 저장한 파일에서 복원",
                "deleteTitle": "모두 삭제",
                "deleteDesc": "이 기기의 모든 데이터를 영구적으로 삭제합니다",
                "policyLink": "전체 개인정보 보호정책 읽기",
                "exportModalTitle": "데이터 내보내기",
                "exportModalSub": "설정 및 읽기 진행 상황이 포함된 파일입니다.",
                "choicePlainTitle": "일반 파일 (.json)",
                "choicePlainDesc": "읽기 쉽고 확인하기 편합니다. 신뢰할 수 있는 곳에 보관하세요.",
                "choiceEncTitle": "비밀번호로 보호된 파일",
                "choiceEncDesc": "기기에서 암호화됩니다 — 클라우드에 저장할 경우 권장합니다.",
                "passphraseLabel": "이 백업을 위한 비밀번호를 만드세요",
                "passphraseHint": "나중에 이 파일을 가져올 때 필요합니다. 분실하지 마세요 — 복구할 수 없습니다.",
                "downloadBtn": "파일 다운로드",
                "exportedOk": "✓ 파일이 성공적으로 다운로드되었습니다",
                "importModalTitle": "백업 가져오기",
                "importModalSub": "이전에 내보낸 파일을 선택하세요.",
                "fileDropLabel": "탭하여 파일 선택",
                "fileChosen": "파일 선택됨",
                "importPassphraseLabel": "백업 비밀번호",
                "importBtn": "데이터 복원",
                "importedOk": "✓ 데이터가 복원되었습니다. 다시 불러오는 중…",
                "importInvalid": "잘못되었거나 손상된 파일입니다.",
                "importWrongPass": "비밀번호가 틀렸습니다. 다시 시도하세요.",
                "importNeedsPass": "이 파일은 비밀번호로 보호되어 있습니다.",
                "deleteModalTitle": "모든 데이터를 삭제하시겠습니까?",
                "deleteModalSub": "이 작업은 취소할 수 없습니다.",
                "deleteWarning": "이 기기에 저장된 설정, 이름, 테마, 선택한 버전 및 모든 읽기 계획 진행 상황이 영구적으로 삭제됩니다. 먼저 내보내기를 고려하세요.",
                "deleteConfirmLabel": "입력하세요",
                "deleteConfirmWord": "삭제",
                "deleteConfirmLabelEnd": "(확인을 위해)",
                "deleteBtn": "모든 항목 영구 삭제",
                "deletedOk": "✓ 데이터가 삭제되었습니다. 다시 불러오는 중…",
                "cancel": "취소",
                "close": "닫기"
        },
        "daily": {
                "title": "매일 성경 읽기",
                "planName": "연간 성경 읽기 계획",
                "today": "오늘",
                "day": "일",
                "of": "/",
                "annualProgress": "연간 진행 상황",
                "concluded": "완료됨",
                "concludeBtn": "읽기 완료",
                "done": "읽기 완료!"
        },
        "teens": {
                "title": "청소년 계획",
                "tag": "성경 여정",
                "bannerTitle": "말씀<br>탐구하기",
                "startDesc": "오늘 성경 읽기 여정을 시작하세요!",
                "startBtn": "계획 시작",
                "concluded": "완료됨",
                "conclude": "오늘 완료",
                "backToPlan": "계획으로 돌아가기",
                "days": "일",
                "daysTitle": "일수",
                "chapters": "장",
                "books": "성경책",
                "howItWorks": "이용 방법",
                "startInfo": "진행 상황이 자동으로 저장됩니다.",
                "preview": "계획 미리보기",
                "andMore": "그 외",
                "planStarted": "🚀 계획이 시작되었습니다!",
                "day": "일",
                "of": "/",
                "today": "오늘",
                "future": "예정",
                "complete": "완료",
                "late": "지연됨",
                "todayChapters": "오늘의 읽기",
                "startReading": "읽기 시작",
                "reRead": "다시 읽기",
                "completedDay": "완료!",
                "keepItUp": "계속 힘내세요!",
                "chapter": "장",
                "chapterPlural": "장",
                "read": "읽음",
                "readPlural": "읽음",
                "saved": "저장됨",
                "savedPlural": "저장됨",
                "backupTitle": "백업",
                "backupDesc": "진행 상황을 내보내거나 가져오세요.",
                "exportTitle": "내보내기",
                "exportDesc": "진행 상황을 파일로 저장합니다.",
                "importTitle": "가져오기",
                "importDesc": "백업에서 복원합니다.",
                "downloadBtn": "JSON 다운로드",
                "copyBtn": "JSON 복사",
                "pasteBtn": "JSON 붙여넣기",
                "tapChoose": "탭하여 선택",
                "dragDrop": "또는 여기로 드래그",
                "daysRead": "읽은 날",
                "tapExport": "탭하여 내보내기",
                "fileExported": "✓ 파일이 내보내졌습니다",
                "jsonCopied": "✓ JSON이 복사되었습니다",
                "invalidJson": "잘못된 JSON",
                "errorImport": "가져오기 오류",
                "restored": "개 장이 복원되었습니다",
                "errorLoad": "로드 오류",
                "back": "뒤로",
                "prev": "이전",
                "next": "다음",
                "resetBtn": "계획 초기화",
                "resetTitle": "계획을 초기화하시겠습니까?",
                "resetSub": "모든 진행 상황이 영구적으로 삭제됩니다.",
                "resetConfirm": "예, 초기화",
                "cancel": "취소",
                "resetSuccess": "✓ 계획이 초기화되었습니다",
                "brand": "BibleXtra"
        },
        "bible6": {
                "title": "6개월 성경 통독",
                "planName": "6개월 성경 통독",
                "tag": "추가 계획",
                "desc": "단 6개월 만에 균형 잡힌 매일 분량으로 성경 전체를 읽으세요.",
                "startBtn": "계획 시작",
                "startInfo": "진행 상황이 자동으로 저장됩니다.",
                "planStarted": "🚀 계획이 시작되었습니다!",
                "daysWord": "일",
                "day": "일",
                "of": "/",
                "today": "오늘",
                "progressLabel": "계획 진행률",
                "concluded": "완료됨",
                "concludeBtn": "읽기 완료",
                "done": "읽기 완료!",
                "resetBtn": "계획 초기화",
                "resetTitle": "계획을 초기화하시겠습니까?",
                "resetSub": "모든 진행 상황이 영구적으로 삭제됩니다.",
                "resetConfirm": "예, 초기화",
                "cancel": "취소",
                "resetSuccess": "✓ 계획이 초기화되었습니다"
        },
        "nt90": {
                "title": "90일 신약성경 통독",
                "planName": "90일 신약성경 통독",
                "tag": "추가 계획",
                "desc": "마태복음부터 요한계시록까지, 90일 동안 신약성경 전체를 읽으세요.",
                "startBtn": "계획 시작",
                "startInfo": "진행 상황이 자동으로 저장됩니다.",
                "planStarted": "🚀 계획이 시작되었습니다!",
                "daysWord": "일",
                "day": "일",
                "of": "/",
                "today": "오늘",
                "progressLabel": "계획 진행률",
                "concluded": "완료됨",
                "concludeBtn": "읽기 완료",
                "done": "읽기 완료!",
                "resetBtn": "계획 초기화",
                "resetTitle": "계획을 초기화하시겠습니까?",
                "resetSub": "모든 진행 상황이 영구적으로 삭제됩니다.",
                "resetConfirm": "예, 초기화",
                "cancel": "취소",
                "resetSuccess": "✓ 계획이 초기화되었습니다"
        },
        "prov31": {
                "title": "31일 잠언 통독",
                "planName": "31일 잠언 통독",
                "tag": "추가 계획",
                "desc": "매일 잠언 한 장씩 — 매달 매일을 위한 지혜.",
                "startBtn": "계획 시작",
                "startInfo": "진행 상황이 자동으로 저장됩니다.",
                "planStarted": "🚀 계획이 시작되었습니다!",
                "daysWord": "일",
                "day": "일",
                "of": "/",
                "today": "오늘",
                "progressLabel": "계획 진행률",
                "concluded": "완료됨",
                "concludeBtn": "읽기 완료",
                "done": "읽기 완료!",
                "resetBtn": "계획 초기화",
                "resetTitle": "계획을 초기화하시겠습니까?",
                "resetSub": "모든 진행 상황이 영구적으로 삭제됩니다.",
                "resetConfirm": "예, 초기화",
                "cancel": "취소",
                "resetSuccess": "✓ 계획이 초기화되었습니다"
        }
},
    ro: {
        "brand": "✦ Sfânta Biblie",
        "searchPlaceholder": "Caută în Biblie...",
        "todayReading": "Lectura de Azi",
        "ot": "✦ Vechiul Testament",
        "nt": "✦ Noul Testament",
        "listen": "Ascultă",
        "stop": "Oprește",
        "search": "Căutare",
        "results": "rezultat(e)",
        "goToRef": "MERGI LA REFERINȚĂ",
        "noResults": "Niciun verset găsit.",
        "chapter": "Capitol",
        "tabSearch": "Căutare",
        "tabAssistant": "Asistent AI",
        "assistantIntro": "Găsește versete pe teme instant, complet offline — totul rulează pe dispozitivul tău.",
        "assistantTopicPlaceholder": "Introdu un subiect (ex: iertare, frică, credință)...",
        "loading": "Se încarcă Cuvântul...",
        "tryAgain": "Încearcă din nou",
        "errorData": "Fișierul de date nu a fost găsit",
        "errorChapter": "Capitolul nu a fost găsit",
        "errorGeneric": "Eroare la încărcarea datelor",
        "errorDataInstruction": "Adaugă în index.html înainte de script.js",
        "fontDown": "Micșorează fontul",
        "fontUp": "Mărește fontul",
        "listenTitle": "Ascultă Cuvântul",
        "scrollTop": "Înapoi sus",
        "menuTitle": "Meniul cărților",
        "closeMenu": "Închide meniul",
        "openMenu": "Deschide meniul",
        "prev": "Cap",
        "next": "Cap",
        "langBtn": "Română",
        "hello": "Bună",
        "verseOfDay": "Versetul Zilei",
        "bible": "Biblie",
        "plans": "Planuri",
        "settings": "Mai mult",
        "home": "Acasă",
        "username": "Nume de utilizator",
        "language": "Limbă",
        "theme": "Temă",
        "light": "Deschis",
        "dark": "Întunecat",
        "version": "Versiune a Bibliei",
        "chooseVersion": "Alege versiunea Bibliei",
        "chooseLanguage": "Alege limba aplicației",
        "dailyPlan": "Zilnic",
        "teensPlan": "Adolescenți",
        "chapterWord": "capitol",
        "chaptersWord": "capitole",
        "chaptersLabel": "Capitole",
        "otherPlans": "ALTE PLANURI",
        "privacy": {
                "navLabel": "Confidențialitate și Date",
                "heroTitle": "Studiul tău biblic îți aparține.",
                "heroDesc": "Tot ce salvezi aici — progres, preferințe, notițe — rămâne doar pe acest dispozitiv. Nimic nu este trimis vreodată către un server.",
                "badgeLocal": "🔒 100% local",
                "badgeNoTrack": "🚫 Fără urmărire",
                "badgeNoAds": "🚫 Fără reclame",
                "badgeNoSell": "🚫 Nu vindem niciodată date",
                "exportTitle": "Exportă datele mele",
                "exportDesc": "Descarcă o copie a tuturor datelor ca fișier",
                "importTitle": "Importă backup",
                "importDesc": "Restaurează dintr-un fișier salvat anterior",
                "deleteTitle": "Șterge tot",
                "deleteDesc": "Elimină permanent toate datele de pe acest dispozitiv",
                "policyLink": "Citește politica completă de confidențialitate",
                "exportModalTitle": "Exportă datele tale",
                "exportModalSub": "Un fișier cu preferințele și progresul tău de citire.",
                "choicePlainTitle": "Fișier simplu (.json)",
                "choicePlainDesc": "Lizibil, ușor de verificat. Păstrează-l într-un loc de încredere.",
                "choiceEncTitle": "Fișier protejat cu parolă",
                "choiceEncDesc": "Criptat pe dispozitivul tău — recomandat dacă îl vei stoca în cloud.",
                "passphraseLabel": "Creează o parolă pentru acest backup",
                "passphraseHint": "Vei avea nevoie de ea pentru a importa acest fișier mai târziu. Nu o pierde — nu poate fi recuperată.",
                "downloadBtn": "Descarcă fișierul",
                "exportedOk": "✓ Fișier descărcat cu succes",
                "importModalTitle": "Importă backup",
                "importModalSub": "Alege fișierul exportat anterior.",
                "fileDropLabel": "Atinge pentru a alege un fișier",
                "fileChosen": "Fișier selectat",
                "importPassphraseLabel": "Parola backup-ului",
                "importBtn": "Restaurează datele",
                "importedOk": "✓ Date restaurate. Se reîncarcă…",
                "importInvalid": "Fișier invalid sau corupt.",
                "importWrongPass": "Parolă greșită. Încearcă din nou.",
                "importNeedsPass": "Acest fișier este protejat cu parolă.",
                "deleteModalTitle": "Ștergi toate datele?",
                "deleteModalSub": "Această acțiune nu poate fi anulată.",
                "deleteWarning": "Aceasta elimină permanent preferințele, numele, tema, versiunea aleasă și tot progresul salvat al planurilor de citire de pe acest dispozitiv. Ia în considerare exportarea mai întâi.",
                "deleteConfirmLabel": "Scrie",
                "deleteConfirmWord": "ȘTERGE",
                "deleteConfirmLabelEnd": "pentru a confirma",
                "deleteBtn": "Șterge totul permanent",
                "deletedOk": "✓ Date șterse. Se reîncarcă…",
                "cancel": "Anulează",
                "close": "Închide"
        },
        "daily": {
                "title": "Lectura Zilnică",
                "planName": "Plan Biblic Anual",
                "today": "Astăzi",
                "day": "Ziua",
                "of": "din",
                "annualProgress": "Progres Anual",
                "concluded": "Încheiat",
                "concludeBtn": "Încheie Lectura",
                "done": "Lectură Încheiată!"
        },
        "teens": {
                "title": "Plan pentru Adolescenți",
                "tag": "Călătorie Biblică",
                "bannerTitle": "Explorând<br>Cuvântul",
                "startDesc": "Începe-ți astăzi călătoria de citire a Bibliei!",
                "startBtn": "Începe Planul",
                "concluded": "Încheiat",
                "conclude": "Încheie Ziua",
                "backToPlan": "Înapoi la Plan",
                "days": "zile",
                "daysTitle": "Zile",
                "chapters": "Capitole",
                "books": "Cărți",
                "howItWorks": "Cum funcționează",
                "startInfo": "Progresul tău este salvat automat.",
                "preview": "Previzualizare plan",
                "andMore": "și altele",
                "planStarted": "🚀 Plan început!",
                "day": "Ziua",
                "of": "din",
                "today": "Astăzi",
                "future": "Viitor",
                "complete": "Complet",
                "late": "Întârziat",
                "todayChapters": "Lectura de azi",
                "startReading": "Începe să citești",
                "reRead": "Recitește",
                "completedDay": "încheiată!",
                "keepItUp": "Continuă tot așa!",
                "chapter": "capitol",
                "chapterPlural": "capitole",
                "read": "citit",
                "readPlural": "citite",
                "saved": "salvat",
                "savedPlural": "salvate",
                "backupTitle": "Backup",
                "backupDesc": "Exportă sau importă progresul tău.",
                "exportTitle": "Exportă",
                "exportDesc": "Salvează progresul într-un fișier.",
                "importTitle": "Importă",
                "importDesc": "Restaurează dintr-un backup.",
                "downloadBtn": "Descarcă JSON",
                "copyBtn": "Copiază JSON",
                "pasteBtn": "Lipește JSON",
                "tapChoose": "Atinge pentru a alege",
                "dragDrop": "sau trage aici",
                "daysRead": "Zile citite",
                "tapExport": "Atinge pentru a exporta",
                "fileExported": "✓ Fișier exportat",
                "jsonCopied": "✓ JSON copiat",
                "invalidJson": "JSON invalid",
                "errorImport": "Eroare la import",
                "restored": "capitole restaurate",
                "errorLoad": "Eroare la încărcare",
                "back": "Înapoi",
                "prev": "Anter",
                "next": "Următ",
                "resetBtn": "Resetează planul",
                "resetTitle": "Resetezi planul?",
                "resetSub": "Tot progresul va fi șters permanent.",
                "resetConfirm": "Da, resetează",
                "cancel": "Anulează",
                "resetSuccess": "✓ Plan resetat",
                "brand": "BibleXtra"
        },
        "bible6": {
                "title": "Biblia în 6 Luni",
                "planName": "Biblia în 6 Luni",
                "tag": "PLAN XTRA",
                "desc": "Citește întreaga Biblie în doar 6 luni, în porțiuni zilnice echilibrate.",
                "startBtn": "Începe Planul",
                "startInfo": "Progresul tău este salvat automat.",
                "planStarted": "🚀 Plan început!",
                "daysWord": "zile",
                "day": "Ziua",
                "of": "din",
                "today": "Astăzi",
                "progressLabel": "Progresul Planului",
                "concluded": "Încheiat",
                "concludeBtn": "Încheie Lectura",
                "done": "Lectură Încheiată!",
                "resetBtn": "Resetează planul",
                "resetTitle": "Resetezi planul?",
                "resetSub": "Tot progresul va fi șters permanent.",
                "resetConfirm": "Da, resetează",
                "cancel": "Anulează",
                "resetSuccess": "✓ Plan resetat"
        },
        "nt90": {
                "title": "Noul Testament în 90 de Zile",
                "planName": "Noul Testament în 90 de Zile",
                "tag": "PLAN XTRA",
                "desc": "Parcurge întregul Nou Testament în 90 de zile, de la Matei la Apocalipsa.",
                "startBtn": "Începe Planul",
                "startInfo": "Progresul tău este salvat automat.",
                "planStarted": "🚀 Plan început!",
                "daysWord": "zile",
                "day": "Ziua",
                "of": "din",
                "today": "Astăzi",
                "progressLabel": "Progresul Planului",
                "concluded": "Încheiat",
                "concludeBtn": "Încheie Lectura",
                "done": "Lectură Încheiată!",
                "resetBtn": "Resetează planul",
                "resetTitle": "Resetezi planul?",
                "resetSub": "Tot progresul va fi șters permanent.",
                "resetConfirm": "Da, resetează",
                "cancel": "Anulează",
                "resetSuccess": "✓ Plan resetat"
        },
        "prov31": {
                "title": "Proverbe în 31 de Zile",
                "planName": "Proverbe în 31 de Zile",
                "tag": "PLAN XTRA",
                "desc": "Un capitol din Proverbe pe zi — înțelepciune pentru fiecare zi a lunii.",
                "startBtn": "Începe Planul",
                "startInfo": "Progresul tău este salvat automat.",
                "planStarted": "🚀 Plan început!",
                "daysWord": "zile",
                "day": "Ziua",
                "of": "din",
                "today": "Astăzi",
                "progressLabel": "Progresul Planului",
                "concluded": "Încheiat",
                "concludeBtn": "Încheie Lectura",
                "done": "Lectură Încheiată!",
                "resetBtn": "Resetează planul",
                "resetTitle": "Resetezi planul?",
                "resetSub": "Tot progresul va fi șters permanent.",
                "resetConfirm": "Da, resetează",
                "cancel": "Anulează",
                "resetSuccess": "✓ Plan resetat"
        }
},
    ru: {
        "brand": "✦ Библия",
        "searchPlaceholder": "Поиск по Библии...",
        "todayReading": "Чтение на Сегодня",
        "ot": "✦ Ветхий Завет",
        "nt": "✦ Новый Завет",
        "listen": "Слушать",
        "stop": "Стоп",
        "search": "Поиск",
        "results": "результат(ов)",
        "goToRef": "ПЕРЕЙТИ К СТИХУ",
        "noResults": "Стихи не найдены.",
        "chapter": "Глава",
        "tabSearch": "Поиск",
        "tabAssistant": "ИИ-помощник",
        "assistantIntro": "Находите стихи по теме мгновенно и полностью офлайн — всё работает на вашем устройстве.",
        "assistantTopicPlaceholder": "Введите тему (напр.: прощение, страх, вера)...",
        "loading": "Загрузка Слова...",
        "tryAgain": "Повторить",
        "errorData": "Файл данных не найден",
        "errorChapter": "Глава не найдена",
        "errorGeneric": "Ошибка загрузки данных",
        "errorDataInstruction": "Добавьте в index.html перед script.js",
        "fontDown": "Уменьшить шрифт",
        "fontUp": "Увеличить шрифт",
        "listenTitle": "Слушать Слово",
        "scrollTop": "Наверх",
        "menuTitle": "Меню книг",
        "closeMenu": "Закрыть меню",
        "openMenu": "Открыть меню",
        "prev": "Гл",
        "next": "Гл",
        "langBtn": "Русский",
        "hello": "Привет",
        "verseOfDay": "Стих Дня",
        "bible": "Библия",
        "plans": "Планы",
        "settings": "Ещё",
        "home": "Главная",
        "username": "Имя пользователя",
        "language": "Язык",
        "theme": "Тема",
        "light": "Светлая",
        "dark": "Тёмная",
        "version": "Перевод Библии",
        "chooseVersion": "Выбрать перевод Библии",
        "chooseLanguage": "Выбрать язык приложения",
        "dailyPlan": "Ежедневный",
        "teensPlan": "Подростки",
        "chapterWord": "глава",
        "chaptersWord": "главы",
        "chaptersLabel": "Главы",
        "otherPlans": "ДРУГИЕ ПЛАНЫ",
        "privacy": {
                "navLabel": "Конфиденциальность и Данные",
                "heroTitle": "Ваше изучение Библии принадлежит только вам.",
                "heroDesc": "Всё, что вы сохраняете здесь — прогресс, настройки, заметки — остаётся только на этом устройстве. Ничего никогда не отправляется на сервер.",
                "badgeLocal": "🔒 100% локально",
                "badgeNoTrack": "🚫 Без слежки",
                "badgeNoAds": "🚫 Без рекламы",
                "badgeNoSell": "🚫 Мы никогда не продаём данные",
                "exportTitle": "Экспортировать мои данные",
                "exportDesc": "Скачать копию всего в виде файла",
                "importTitle": "Импортировать резервную копию",
                "importDesc": "Восстановить из ранее сохранённого файла",
                "deleteTitle": "Удалить всё",
                "deleteDesc": "Безвозвратно удаляет все данные с этого устройства",
                "policyLink": "Прочитать полную политику конфиденциальности",
                "exportModalTitle": "Экспорт ваших данных",
                "exportModalSub": "Файл с вашими настройками и прогрессом чтения.",
                "choicePlainTitle": "Обычный файл (.json)",
                "choicePlainDesc": "Читаемый, легко проверить. Храните в надёжном месте.",
                "choiceEncTitle": "Файл, защищённый паролем",
                "choiceEncDesc": "Зашифрован на вашем устройстве — рекомендуется при хранении в облаке.",
                "passphraseLabel": "Создайте пароль для этой резервной копии",
                "passphraseHint": "Он понадобится вам для импорта этого файла позже. Не потеряйте его — восстановить будет невозможно.",
                "downloadBtn": "Скачать файл",
                "exportedOk": "✓ Файл успешно скачан",
                "importModalTitle": "Импортировать резервную копию",
                "importModalSub": "Выберите ранее экспортированный файл.",
                "fileDropLabel": "Нажмите, чтобы выбрать файл",
                "fileChosen": "Файл выбран",
                "importPassphraseLabel": "Пароль резервной копии",
                "importBtn": "Восстановить данные",
                "importedOk": "✓ Данные восстановлены. Перезагрузка…",
                "importInvalid": "Неверный или повреждённый файл.",
                "importWrongPass": "Неверный пароль. Попробуйте снова.",
                "importNeedsPass": "Этот файл защищён паролем.",
                "deleteModalTitle": "Удалить все данные?",
                "deleteModalSub": "Это действие нельзя отменить.",
                "deleteWarning": "Это безвозвратно удалит ваши настройки, имя, тему, выбранный перевод и весь сохранённый прогресс планов чтения на этом устройстве. Рекомендуем сначала экспортировать данные.",
                "deleteConfirmLabel": "Введите",
                "deleteConfirmWord": "УДАЛИТЬ",
                "deleteConfirmLabelEnd": "для подтверждения",
                "deleteBtn": "Удалить всё безвозвратно",
                "deletedOk": "✓ Данные удалены. Перезагрузка…",
                "cancel": "Отмена",
                "close": "Закрыть"
        },
        "daily": {
                "title": "Ежедневное Чтение",
                "planName": "Годовой План Чтения Библии",
                "today": "Сегодня",
                "day": "День",
                "of": "из",
                "annualProgress": "Годовой Прогресс",
                "concluded": "Завершено",
                "concludeBtn": "Завершить Чтение",
                "done": "Чтение Завершено!"
        },
        "teens": {
                "title": "План для Подростков",
                "tag": "Библейское Путешествие",
                "bannerTitle": "Исследуем<br>Слово",
                "startDesc": "Начните своё путешествие по чтению Библии уже сегодня!",
                "startBtn": "Начать План",
                "concluded": "Завершено",
                "conclude": "Завершить День",
                "backToPlan": "Вернуться к Плану",
                "days": "дней",
                "daysTitle": "Дни",
                "chapters": "Главы",
                "books": "Книги",
                "howItWorks": "Как это работает",
                "startInfo": "Ваш прогресс сохраняется автоматически.",
                "preview": "Предпросмотр плана",
                "andMore": "и другое",
                "planStarted": "🚀 План начат!",
                "day": "День",
                "of": "из",
                "today": "Сегодня",
                "future": "Будущее",
                "complete": "Завершено",
                "late": "Просрочено",
                "todayChapters": "Чтение на сегодня",
                "startReading": "Начать чтение",
                "reRead": "Перечитать",
                "completedDay": "завершено!",
                "keepItUp": "Продолжайте в том же духе!",
                "chapter": "глава",
                "chapterPlural": "главы",
                "read": "прочитано",
                "readPlural": "прочитано",
                "saved": "сохранено",
                "savedPlural": "сохранено",
                "backupTitle": "Резервная копия",
                "backupDesc": "Экспорт или импорт вашего прогресса.",
                "exportTitle": "Экспорт",
                "exportDesc": "Сохраните ваш прогресс в файл.",
                "importTitle": "Импорт",
                "importDesc": "Восстановить из резервной копии.",
                "downloadBtn": "Скачать JSON",
                "copyBtn": "Копировать JSON",
                "pasteBtn": "Вставить JSON",
                "tapChoose": "Нажмите, чтобы выбрать",
                "dragDrop": "или перетащите сюда",
                "daysRead": "Прочитано дней",
                "tapExport": "Нажмите для экспорта",
                "fileExported": "✓ Файл экспортирован",
                "jsonCopied": "✓ JSON скопирован",
                "invalidJson": "Неверный JSON",
                "errorImport": "Ошибка импорта",
                "restored": "глав восстановлено",
                "errorLoad": "Ошибка загрузки",
                "back": "Назад",
                "prev": "Пред",
                "next": "След",
                "resetBtn": "Сбросить план",
                "resetTitle": "Сбросить план?",
                "resetSub": "Весь прогресс будет безвозвратно удалён.",
                "resetConfirm": "Да, сбросить",
                "cancel": "Отмена",
                "resetSuccess": "✓ План сброшен",
                "brand": "BibleXtra"
        },
        "bible6": {
                "title": "Библия за 6 Месяцев",
                "planName": "Библия за 6 Месяцев",
                "tag": "ДОП. ПЛАН",
                "desc": "Прочитайте всю Библию всего за 6 месяцев, сбалансированными ежедневными порциями.",
                "startBtn": "Начать План",
                "startInfo": "Ваш прогресс сохраняется автоматически.",
                "planStarted": "🚀 План начат!",
                "daysWord": "дней",
                "day": "День",
                "of": "из",
                "today": "Сегодня",
                "progressLabel": "Прогресс Плана",
                "concluded": "Завершено",
                "concludeBtn": "Завершить Чтение",
                "done": "Чтение Завершено!",
                "resetBtn": "Сбросить план",
                "resetTitle": "Сбросить план?",
                "resetSub": "Весь прогресс будет безвозвратно удалён.",
                "resetConfirm": "Да, сбросить",
                "cancel": "Отмена",
                "resetSuccess": "✓ План сброшен"
        },
        "nt90": {
                "title": "Новый Завет за 90 Дней",
                "planName": "Новый Завет за 90 Дней",
                "tag": "ДОП. ПЛАН",
                "desc": "Пройдите весь Новый Завет за 90 дней, от Евангелия от Матфея до Откровения.",
                "startBtn": "Начать План",
                "startInfo": "Ваш прогресс сохраняется автоматически.",
                "planStarted": "🚀 План начат!",
                "daysWord": "дней",
                "day": "День",
                "of": "из",
                "today": "Сегодня",
                "progressLabel": "Прогресс Плана",
                "concluded": "Завершено",
                "concludeBtn": "Завершить Чтение",
                "done": "Чтение Завершено!",
                "resetBtn": "Сбросить план",
                "resetTitle": "Сбросить план?",
                "resetSub": "Весь прогресс будет безвозвратно удалён.",
                "resetConfirm": "Да, сбросить",
                "cancel": "Отмена",
                "resetSuccess": "✓ План сброшен"
        },
        "prov31": {
                "title": "Притчи за 31 День",
                "planName": "Притчи за 31 День",
                "tag": "ДОП. ПЛАН",
                "desc": "Одна глава Притчей в день — мудрость на каждый день месяца.",
                "startBtn": "Начать План",
                "startInfo": "Ваш прогресс сохраняется автоматически.",
                "planStarted": "🚀 План начат!",
                "daysWord": "дней",
                "day": "День",
                "of": "из",
                "today": "Сегодня",
                "progressLabel": "Прогресс Плана",
                "concluded": "Завершено",
                "concludeBtn": "Завершить Чтение",
                "done": "Чтение Завершено!",
                "resetBtn": "Сбросить план",
                "resetTitle": "Сбросить план?",
                "resetSub": "Весь прогресс будет безвозвратно удалён.",
                "resetConfirm": "Да, сбросить",
                "cancel": "Отмена",
                "resetSuccess": "✓ План сброшен"
        }
},
    vi: {
        "brand": "✦ Kinh Thánh",
        "searchPlaceholder": "Tìm kiếm trong Kinh Thánh...",
        "todayReading": "Bài Đọc Hôm Nay",
        "ot": "✦ Cựu Ước",
        "nt": "✦ Tân Ước",
        "listen": "Nghe",
        "stop": "Dừng",
        "search": "Tìm kiếm",
        "results": "kết quả",
        "goToRef": "ĐI ĐẾN CÂU KINH THÁNH",
        "noResults": "Không tìm thấy câu nào.",
        "chapter": "Chương",
        "tabSearch": "Tìm kiếm",
        "tabAssistant": "Trợ lý AI",
        "assistantIntro": "Tìm câu Kinh Thánh theo chủ đề ngay lập tức, hoàn toàn ngoại tuyến — mọi thứ chạy trên thiết bị của bạn.",
        "assistantTopicPlaceholder": "Nhập chủ đề (vd: sự tha thứ, nỗi sợ, đức tin)...",
        "loading": "Đang tải Lời Chúa...",
        "tryAgain": "Thử Lại",
        "errorData": "Không tìm thấy tệp dữ liệu",
        "errorChapter": "Không tìm thấy chương",
        "errorGeneric": "Lỗi khi tải dữ liệu",
        "errorDataInstruction": "Thêm vào index.html trước script.js",
        "fontDown": "Giảm cỡ chữ",
        "fontUp": "Tăng cỡ chữ",
        "listenTitle": "Nghe Lời Chúa",
        "scrollTop": "Lên đầu trang",
        "menuTitle": "Menu sách",
        "closeMenu": "Đóng menu",
        "openMenu": "Mở menu",
        "prev": "Chg",
        "next": "Chg",
        "langBtn": "Tiếng Việt",
        "hello": "Xin chào",
        "verseOfDay": "Câu Kinh Thánh Trong Ngày",
        "bible": "Kinh Thánh",
        "plans": "Kế hoạch",
        "settings": "Thêm",
        "home": "Trang chủ",
        "username": "Tên người dùng",
        "language": "Ngôn ngữ",
        "theme": "Giao diện",
        "light": "Sáng",
        "dark": "Tối",
        "version": "Bản dịch Kinh Thánh",
        "chooseVersion": "Chọn bản dịch Kinh Thánh",
        "chooseLanguage": "Chọn ngôn ngữ ứng dụng",
        "dailyPlan": "Hằng ngày",
        "teensPlan": "Thanh thiếu niên",
        "chapterWord": "chương",
        "chaptersWord": "chương",
        "chaptersLabel": "Các chương",
        "otherPlans": "KẾ HOẠCH KHÁC",
        "privacy": {
                "navLabel": "Quyền riêng tư & Dữ liệu",
                "heroTitle": "Việc học Kinh Thánh của bạn thuộc về bạn.",
                "heroDesc": "Mọi thứ bạn lưu ở đây — tiến độ, tùy chọn, ghi chú — chỉ được giữ trên thiết bị này. Không có gì được gửi đến máy chủ nào cả.",
                "badgeLocal": "🔒 100% cục bộ",
                "badgeNoTrack": "🚫 Không theo dõi",
                "badgeNoAds": "🚫 Không quảng cáo",
                "badgeNoSell": "🚫 Chúng tôi không bao giờ bán dữ liệu",
                "exportTitle": "Xuất dữ liệu của tôi",
                "exportDesc": "Tải xuống bản sao của mọi thứ dưới dạng tệp",
                "importTitle": "Nhập bản sao lưu",
                "importDesc": "Khôi phục từ tệp đã lưu trước đó",
                "deleteTitle": "Xóa tất cả",
                "deleteDesc": "Xóa vĩnh viễn toàn bộ dữ liệu khỏi thiết bị này",
                "policyLink": "Đọc chính sách quyền riêng tư đầy đủ",
                "exportModalTitle": "Xuất dữ liệu của bạn",
                "exportModalSub": "Một tệp chứa tùy chọn và tiến độ đọc của bạn.",
                "choicePlainTitle": "Tệp thường (.json)",
                "choicePlainDesc": "Dễ đọc, dễ kiểm tra. Hãy lưu giữ ở nơi đáng tin cậy.",
                "choiceEncTitle": "Tệp được bảo vệ bằng mật khẩu",
                "choiceEncDesc": "Được mã hóa trên thiết bị của bạn — khuyến nghị nếu bạn sẽ lưu trữ trên đám mây.",
                "passphraseLabel": "Tạo mật khẩu cho bản sao lưu này",
                "passphraseHint": "Bạn sẽ cần mật khẩu này để nhập tệp sau này. Đừng để mất — không thể khôi phục được.",
                "downloadBtn": "Tải tệp xuống",
                "exportedOk": "✓ Đã tải tệp xuống thành công",
                "importModalTitle": "Nhập bản sao lưu",
                "importModalSub": "Chọn tệp đã xuất trước đó.",
                "fileDropLabel": "Chạm để chọn tệp",
                "fileChosen": "Đã chọn tệp",
                "importPassphraseLabel": "Mật khẩu bản sao lưu",
                "importBtn": "Khôi phục dữ liệu",
                "importedOk": "✓ Đã khôi phục dữ liệu. Đang tải lại…",
                "importInvalid": "Tệp không hợp lệ hoặc bị hỏng.",
                "importWrongPass": "Sai mật khẩu. Vui lòng thử lại.",
                "importNeedsPass": "Tệp này được bảo vệ bằng mật khẩu.",
                "deleteModalTitle": "Xóa tất cả dữ liệu?",
                "deleteModalSub": "Hành động này không thể hoàn tác.",
                "deleteWarning": "Thao tác này sẽ xóa vĩnh viễn tùy chọn, tên, giao diện, bản dịch đã chọn và toàn bộ tiến độ kế hoạch đọc đã lưu trên thiết bị này. Hãy cân nhắc xuất dữ liệu trước.",
                "deleteConfirmLabel": "Nhập",
                "deleteConfirmWord": "XÓA",
                "deleteConfirmLabelEnd": "để xác nhận",
                "deleteBtn": "Xóa vĩnh viễn tất cả",
                "deletedOk": "✓ Đã xóa dữ liệu. Đang tải lại…",
                "cancel": "Hủy",
                "close": "Đóng"
        },
        "daily": {
                "title": "Bài Đọc Hằng Ngày",
                "planName": "Kế Hoạch Đọc Kinh Thánh Hằng Năm",
                "today": "Hôm nay",
                "day": "Ngày",
                "of": "trong",
                "annualProgress": "Tiến Độ Hằng Năm",
                "concluded": "Đã hoàn thành",
                "concludeBtn": "Hoàn Thành Bài Đọc",
                "done": "Đã Hoàn Thành Bài Đọc!"
        },
        "teens": {
                "title": "Kế Hoạch Thanh Thiếu Niên",
                "tag": "Hành Trình Kinh Thánh",
                "bannerTitle": "Khám Phá<br>Lời Chúa",
                "startDesc": "Bắt đầu hành trình đọc Kinh Thánh của bạn ngay hôm nay!",
                "startBtn": "Bắt Đầu Kế Hoạch",
                "concluded": "Đã hoàn thành",
                "conclude": "Hoàn Thành Ngày",
                "backToPlan": "Quay Lại Kế Hoạch",
                "days": "ngày",
                "daysTitle": "Ngày",
                "chapters": "Chương",
                "books": "Sách",
                "howItWorks": "Cách hoạt động",
                "startInfo": "Tiến độ của bạn được lưu tự động.",
                "preview": "Xem trước kế hoạch",
                "andMore": "và nhiều hơn",
                "planStarted": "🚀 Đã bắt đầu kế hoạch!",
                "day": "Ngày",
                "of": "trong",
                "today": "Hôm nay",
                "future": "Sắp tới",
                "complete": "Hoàn thành",
                "late": "Trễ",
                "todayChapters": "Bài đọc hôm nay",
                "startReading": "Bắt đầu đọc",
                "reRead": "Đọc lại",
                "completedDay": "đã hoàn thành!",
                "keepItUp": "Tiếp tục phát huy!",
                "chapter": "chương",
                "chapterPlural": "chương",
                "read": "đã đọc",
                "readPlural": "đã đọc",
                "saved": "đã lưu",
                "savedPlural": "đã lưu",
                "backupTitle": "Sao lưu",
                "backupDesc": "Xuất hoặc nhập tiến độ của bạn.",
                "exportTitle": "Xuất",
                "exportDesc": "Lưu tiến độ của bạn vào tệp.",
                "importTitle": "Nhập",
                "importDesc": "Khôi phục từ bản sao lưu.",
                "downloadBtn": "Tải JSON xuống",
                "copyBtn": "Sao chép JSON",
                "pasteBtn": "Dán JSON",
                "tapChoose": "Chạm để chọn",
                "dragDrop": "hoặc kéo vào đây",
                "daysRead": "Số ngày đã đọc",
                "tapExport": "Chạm để xuất",
                "fileExported": "✓ Đã xuất tệp",
                "jsonCopied": "✓ Đã sao chép JSON",
                "invalidJson": "JSON không hợp lệ",
                "errorImport": "Lỗi khi nhập",
                "restored": "chương đã được khôi phục",
                "errorLoad": "Lỗi khi tải",
                "back": "Quay lại",
                "prev": "Trước",
                "next": "Tiếp",
                "resetBtn": "Đặt lại kế hoạch",
                "resetTitle": "Đặt lại kế hoạch?",
                "resetSub": "Toàn bộ tiến độ sẽ bị xóa vĩnh viễn.",
                "resetConfirm": "Có, đặt lại",
                "cancel": "Hủy",
                "resetSuccess": "✓ Đã đặt lại kế hoạch",
                "brand": "BibleXtra"
        },
        "bible6": {
                "title": "Kinh Thánh Trong 6 Tháng",
                "planName": "Kinh Thánh Trong 6 Tháng",
                "tag": "KẾ HOẠCH XTRA",
                "desc": "Đọc toàn bộ Kinh Thánh chỉ trong 6 tháng, với các phần đọc hằng ngày cân đối.",
                "startBtn": "Bắt Đầu Kế Hoạch",
                "startInfo": "Tiến độ của bạn được lưu tự động.",
                "planStarted": "🚀 Đã bắt đầu kế hoạch!",
                "daysWord": "ngày",
                "day": "Ngày",
                "of": "trong",
                "today": "Hôm nay",
                "progressLabel": "Tiến Độ Kế Hoạch",
                "concluded": "Đã hoàn thành",
                "concludeBtn": "Hoàn Thành Bài Đọc",
                "done": "Đã Hoàn Thành Bài Đọc!",
                "resetBtn": "Đặt lại kế hoạch",
                "resetTitle": "Đặt lại kế hoạch?",
                "resetSub": "Toàn bộ tiến độ sẽ bị xóa vĩnh viễn.",
                "resetConfirm": "Có, đặt lại",
                "cancel": "Hủy",
                "resetSuccess": "✓ Đã đặt lại kế hoạch"
        },
        "nt90": {
                "title": "Tân Ước Trong 90 Ngày",
                "planName": "Tân Ước Trong 90 Ngày",
                "tag": "KẾ HOẠCH XTRA",
                "desc": "Đọc trọn vẹn Tân Ước trong 90 ngày, từ Ma-thi-ơ đến Khải Huyền.",
                "startBtn": "Bắt Đầu Kế Hoạch",
                "startInfo": "Tiến độ của bạn được lưu tự động.",
                "planStarted": "🚀 Đã bắt đầu kế hoạch!",
                "daysWord": "ngày",
                "day": "Ngày",
                "of": "trong",
                "today": "Hôm nay",
                "progressLabel": "Tiến Độ Kế Hoạch",
                "concluded": "Đã hoàn thành",
                "concludeBtn": "Hoàn Thành Bài Đọc",
                "done": "Đã Hoàn Thành Bài Đọc!",
                "resetBtn": "Đặt lại kế hoạch",
                "resetTitle": "Đặt lại kế hoạch?",
                "resetSub": "Toàn bộ tiến độ sẽ bị xóa vĩnh viễn.",
                "resetConfirm": "Có, đặt lại",
                "cancel": "Hủy",
                "resetSuccess": "✓ Đã đặt lại kế hoạch"
        },
        "prov31": {
                "title": "Châm Ngôn Trong 31 Ngày",
                "planName": "Châm Ngôn Trong 31 Ngày",
                "tag": "KẾ HOẠCH XTRA",
                "desc": "Mỗi ngày một chương Châm Ngôn — sự khôn ngoan cho mỗi ngày trong tháng.",
                "startBtn": "Bắt Đầu Kế Hoạch",
                "startInfo": "Tiến độ của bạn được lưu tự động.",
                "planStarted": "🚀 Đã bắt đầu kế hoạch!",
                "daysWord": "ngày",
                "day": "Ngày",
                "of": "trong",
                "today": "Hôm nay",
                "progressLabel": "Tiến Độ Kế Hoạch",
                "concluded": "Đã hoàn thành",
                "concludeBtn": "Hoàn Thành Bài Đọc",
                "done": "Đã Hoàn Thành Bài Đọc!",
                "resetBtn": "Đặt lại kế hoạch",
                "resetTitle": "Đặt lại kế hoạch?",
                "resetSub": "Toàn bộ tiến độ sẽ bị xóa vĩnh viễn.",
                "resetConfirm": "Có, đặt lại",
                "cancel": "Hủy",
                "resetSuccess": "✓ Đã đặt lại kế hoạch"
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
    version: savedConfig.version || 'nvi',
    currentView: 'home'
};
const state = window.state;
window.applyDocumentDirection(state.lang);

function saveConfig() {
    localStorage.setItem('bible_config', JSON.stringify({
        fontSize: state.fontSize,
        lang: state.lang,
        userName: state.userName,
        theme: state.theme,
        version: state.version
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
    const version = state.version || 'ara';
    const dataKey = `${bookId}_${chapter}`;
    const cacheKey = `${version}_${dataKey}`;
    const cached = await dbGet(cacheKey);
    if (cached) return cached;
    const verses = getBibleData(version)?.[dataKey];
    if (verses) {
        dbPut(cacheKey, verses);
        return verses;
    }
    throw new Error(`${window.t('errorChapter')}: ${dataKey}`);
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
        case 'quiz':
            window.openQuizDashboard?.();
            break;
        case 'memorize':
            window.openMemorizeDashboard?.();
            break;
        case 'bible6':
        case 'nt90':
        case 'prov31':
            window.openReadingPlan?.(viewName);
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
        document.getElementById('name-modal-overlay')?.classList.remove('d-none');
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
        if (state.currentView === 'home') renderHome();
        if (state.currentView === 'settings') renderSettings();
    } else {
        input.focus();
        input.style.borderColor = 'var(--red-bible)';
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

/**
 * Searches the query across ALL loaded Bible versions (not just the one
 * currently selected). A verse is returned once even if it matches in
 * several versions — each result keeps track of which version(s) it was
 * found in, so we can jump straight to the matching text later on.
 */
function searchVerses(query) {
    const q = normalise(query.trim());
    if (q.length < 2) return [];

    const MAX_RESULTS = 60;
    const byRef = new Map(); // "BOOK_c_v" -> result entry
    const results = [];

    outer:
    for (const version of BIBLE_VERSIONS) {
        const data = getBibleData(version.id);
        if (!data) continue;
        for (const book of ALL_BOOKS) {
            for (let c = 1; c <= book.chapters; c++) {
                const verses = data[`${book.id}_${c}`];
                if (!verses) continue;
                for (const v of verses) {
                    if (!normalise(v.text).includes(q)) continue;
                    const refKey = `${book.id}_${c}_${v.verse}`;
                    let entry = byRef.get(refKey);
                    if (!entry) {
                        entry = { book, chapter: c, verse: v.verse, versions: {} };
                        byRef.set(refKey, entry);
                        results.push(entry);
                        if (results.length >= MAX_RESULTS) {
                            entry.versions[version.id] = v.text;
                            break outer;
                        }
                    }
                    entry.versions[version.id] = v.text;
                }
            }
        }
    }

    // Pick the text to preview for each result: prefer the version the
    // user currently reads in, then fall back to whichever matched.
    for (const entry of results) {
        entry.text = entry.versions[state.version]
            || entry.versions['ara']
            || Object.values(entry.versions)[0];
        entry.matchedVersions = Object.keys(entry.versions);
    }

    return results;
}

// Which sub-tab of the Search view is active: 'search' (classic verse
// search) or 'assistant' (Bible Assistant chat). Not persisted — resets
// to classic search whenever the app is reloaded.
let searchTab = 'search';

function renderSearchInput() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="search-container fade-in">
            <h1 class="bible-heading">${window.t('search')}</h1>
            <div class="search-tabs">
                <button class="search-tab-btn${searchTab === 'search' ? ' active' : ''}" data-tab="search">
                    <i class="ph ph-magnifying-glass"></i> ${window.t('tabSearch')}
                </button>
                <button class="search-tab-btn${searchTab === 'assistant' ? ' active' : ''}" data-tab="assistant">
                    <i class="ph ph-sparkle"></i> ${window.t('tabAssistant')}
                </button>
            </div>
            <div id="searchTabBody"></div>
        </div>
    `;

    document.querySelectorAll('.search-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (searchTab === btn.dataset.tab) return;
            searchTab = btn.dataset.tab;
            renderSearchInput();
        });
    });

    if (searchTab === 'assistant') {
        renderAssistantTab();
    } else {
        renderClassicSearch();
    }
}

function renderClassicSearch() {
    const body = document.getElementById('searchTabBody');
    body.innerHTML = `
        <div class="search-box">
            <i class="ph ph-magnifying-glass"></i>
            <input type="text" id="searchInput" placeholder="${window.t('searchPlaceholder')}" autocomplete="off" />
        </div>
        <div id="searchResults"></div>
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

        // Show which version(s) this result matched in, so it's clear the
        // preview text may belong to a version other than the one active.
        const versionBadges = r.matchedVersions.map(id => {
            const v = BIBLE_VERSIONS.find(bv => bv.id === id);
            const active = id === state.version;
            return `<span class="version-badge${active ? ' active' : ''}">${v ? v.abbr : id}</span>`;
        }).join('');

        div.innerHTML = `
            <span class="verse-num">${r.book.name} ${r.chapter}:${r.verse} ${versionBadges}</span>
            <span class="verse-text" style="font-size:${state.fontSize}rem">
                ${r.text.replace(re, '<mark>$1</mark>')}
            </span>`;
        div.onclick = () => {
            // If the currently selected version doesn't contain this match,
            // switch to a version that does, so the verse the user tapped on
            // is exactly what shows up inside the chapter content.
            if (!r.versions[state.version]) {
                const matchedVersion = r.matchedVersions[0];
                if (matchedVersion && matchedVersion !== state.version) {
                    state.version = matchedVersion;
                    saveConfig();
                }
            }
            switchView('bible', { bookId: r.book.id, chapter: r.chapter, verse: r.verse });
        };
        wrap.appendChild(div);
    }
}


/* ════════════════════════ TOPICAL VERSE FINDER (100% LOCAL) ══════════════════════════
   No network calls, no API key, no waiting — everything below runs against
   the Bible data already bundled with the app. It's a curated cross-reference
   index (topic -> verse references) plus the existing local full-text search,
   so results are instant. */
const BIBLE_TOPICS = [
    { id: 'love', pt: 'Amor', en: 'Love', es: 'Amor', refs: [['JHN', 3, 16], ['1CO', 13, 4], ['1CO', 13, 13], ['1JN', 4, 8], ['ROM', 8, 38]] },
    { id: 'forgiveness', pt: 'Perdão', en: 'Forgiveness', es: 'Perdón', refs: [['MAT', 6, 14], ['EPH', 4, 32], ['COL', 3, 13], ['1JN', 1, 9], ['LUK', 6, 37]] },
    { id: 'faith', pt: 'Fé', en: 'Faith', es: 'Fe', refs: [['HEB', 11, 1], ['ROM', 10, 17], ['MRK', 11, 24], ['JAS', 2, 17], ['2CO', 5, 7]] },
    { id: 'hope', pt: 'Esperança', en: 'Hope', es: 'Esperanza', refs: [['ROM', 15, 13], ['JER', 29, 11], ['ROM', 8, 24], ['PSA', 42, 11], ['1PE', 1, 3]] },
    { id: 'fear', pt: 'Medo', en: 'Fear', es: 'Miedo', refs: [['ISA', 41, 10], ['PSA', 23, 4], ['2TI', 1, 7], ['JOS', 1, 9], ['PSA', 56, 3]] },
    { id: 'peace', pt: 'Paz', en: 'Peace', es: 'Paz', refs: [['JHN', 14, 27], ['PHP', 4, 6], ['PHP', 4, 7], ['ISA', 26, 3], ['COL', 3, 15]] },
    { id: 'wisdom', pt: 'Sabedoria', en: 'Wisdom', es: 'Sabiduría', refs: [['PRO', 3, 5], ['PRO', 9, 10], ['JAS', 1, 5], ['PRO', 1, 7], ['ECC', 7, 12]] },
    { id: 'prayer', pt: 'Oração', en: 'Prayer', es: 'Oración', refs: [['PHP', 4, 6], ['1TH', 5, 17], ['MAT', 6, 6], ['JAS', 5, 16], ['JHN', 15, 7]] },
    { id: 'salvation', pt: 'Salvação', en: 'Salvation', es: 'Salvación', refs: [['ROM', 10, 9], ['EPH', 2, 8], ['JHN', 3, 16], ['ACT', 4, 12], ['ROM', 6, 23]] },
    { id: 'family', pt: 'Família', en: 'Family', es: 'Familia', refs: [['JOS', 24, 15], ['EPH', 6, 1], ['PRO', 22, 6], ['PSA', 127, 3], ['DEU', 6, 6]] },
    { id: 'strength', pt: 'Força', en: 'Strength', es: 'Fuerza', refs: [['PHP', 4, 13], ['ISA', 40, 31], ['PSA', 46, 1], ['2CO', 12, 9], ['NEH', 8, 10]] },
    { id: 'patience', pt: 'Paciência', en: 'Patience', es: 'Paciencia', refs: [['ROM', 12, 12], ['JAS', 1, 4], ['GAL', 6, 9], ['ECC', 7, 8], ['PSA', 27, 14]] },
    { id: 'gratitude', pt: 'Gratidão', en: 'Gratitude', es: 'Gratitud', refs: [['1TH', 5, 18], ['PSA', 100, 4], ['COL', 3, 17], ['PHP', 4, 6], ['PSA', 107, 1]] },
    { id: 'humility', pt: 'Humildade', en: 'Humility', es: 'Humildad', refs: [['JAS', 4, 10], ['PRO', 22, 4], ['1PE', 5, 6], ['PHP', 2, 3], ['MIC', 6, 8]] },
    { id: 'anger', pt: 'Ira', en: 'Anger', es: 'Ira', refs: [['EPH', 4, 26], ['JAS', 1, 19], ['PRO', 15, 1], ['PRO', 29, 11], ['COL', 3, 8]] },
    { id: 'anxiety', pt: 'Ansiedade', en: 'Anxiety', es: 'Ansiedad', refs: [['PHP', 4, 6], ['1PE', 5, 7], ['MAT', 6, 34], ['PSA', 94, 19], ['JHN', 14, 27]] },
    { id: 'friendship', pt: 'Amizade', en: 'Friendship', es: 'Amistad', refs: [['PRO', 17, 17], ['ECC', 4, 9], ['JHN', 15, 13], ['PRO', 27, 17], ['1SA', 18, 1]] },
    { id: 'work', pt: 'Trabalho', en: 'Work', es: 'Trabajo', refs: [['COL', 3, 23], ['PRO', 14, 23], ['ECC', 3, 13], ['2TH', 3, 10], ['PRO', 22, 29]] },
    { id: 'guidance', pt: 'Direção/Guia', en: 'Guidance', es: 'Guía', refs: [['PRO', 3, 5], ['PRO', 3, 6], ['PSA', 32, 8], ['ISA', 30, 21], ['PSA', 119, 105]] },
    { id: 'grace', pt: 'Graça', en: 'Grace', es: 'Gracia', refs: [['EPH', 2, 8], ['2CO', 12, 9], ['ROM', 3, 24], ['TIT', 2, 11], ['JHN', 1, 16]] },
];

function topicLabel(topic) {
    const lang = state.lang || 'pt';
    return topic[lang] || topic.pt;
}

function resolveTopicRefs(topic) {
    const version = state.version || 'ara';
    const data = getBibleData(version) || getBibleData('ara');
    return topic.refs.map(([bookId, chapter, verse]) => {
        const book = ALL_BOOKS.find(b => b.id === bookId);
        const verses = data?.[`${bookId}_${chapter}`];
        const v = verses?.find(vv => vv.verse === verse);
        return { book, chapter, verse, text: v ? v.text : null };
    }).filter(r => r.book);
}

function matchTopics(query) {
    const q = normalise(query.trim());
    if (!q) return [];
    return BIBLE_TOPICS.filter(t =>
        normalise(t.pt).includes(q) || normalise(t.en).includes(q) || normalise(t.es).includes(q) ||
        q.includes(normalise(t.pt)) || q.includes(normalise(t.en)) || q.includes(normalise(t.es))
    );
}

function renderAssistantTab() {
    const body = document.getElementById('searchTabBody');
    body.innerHTML = `
        <p class="assistant-intro">${window.t('assistantIntro')}</p>
        <div class="search-box">
            <i class="ph ph-tag"></i>
            <input type="text" id="topicInput" placeholder="${window.t('assistantTopicPlaceholder')}" autocomplete="off" />
        </div>
        <div class="assistant-chips" id="topicChips"></div>
        <div id="topicResults"></div>
    `;

    const chipsWrap = document.getElementById('topicChips');
    chipsWrap.innerHTML = BIBLE_TOPICS.map(t => `<button class="assistant-chip" data-topic="${t.id}">${topicLabel(t)}</button>`).join('');
    chipsWrap.querySelectorAll('.assistant-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            const topic = BIBLE_TOPICS.find(t => t.id === btn.dataset.topic);
            document.getElementById('topicInput').value = topicLabel(topic);
            showTopicResults(topic);
        });
    });

    const input = document.getElementById('topicInput');
    let timer;
    input.addEventListener('input', e => {
        clearTimeout(timer);
        const q = e.target.value.trim();
        if (!q) { document.getElementById('topicResults').innerHTML = ''; return; }
        timer = setTimeout(() => {
            const topics = matchTopics(q);
            if (topics.length) {
                showTopicResults(topics[0]);
            } else {
                // Fall back to the fast local full-text search when the
                // typed word isn't in the curated topic list.
                showFullTextFallback(q);
            }
        }, 150);
    });
    input.focus();
}

function showFullTextFallback(q) {
    const wrap = document.getElementById('topicResults');
    const results = searchVerses(q);
    const directRef = parseReference(q);
    wrap.innerHTML = '<div id="searchResults"></div>';
    renderSearchResults(q, results, directRef);
}

function showTopicResults(topic) {
    const wrap = document.getElementById('topicResults');
    const refs = resolveTopicRefs(topic);
    wrap.innerHTML = `<h3 class="topic-heading">${topicLabel(topic)}</h3>` + refs.map(r => `
        <div class="verse topic-verse" data-book="${r.book.id}" data-chapter="${r.chapter}" data-verse="${r.verse}">
            <span class="verse-num">${r.book.name} ${r.chapter}:${r.verse}</span>
            <span class="verse-text" style="font-size:${state.fontSize}rem">${r.text || ''}</span>
        </div>
    `).join('');
    wrap.querySelectorAll('.topic-verse').forEach(el => {
        el.addEventListener('click', () => {
            switchView('bible', { bookId: el.dataset.book, chapter: parseInt(el.dataset.chapter), verse: parseInt(el.dataset.verse) });
        });
    });
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
                    <div class="action-item" onclick="switchView('quiz')">
                        <div class="action-circle"><i class="ph ph-trophy"></i></div>
                        <span class="action-label">QUIZ</span>
                    </div>
                    <div class="action-item" onclick="switchView('memorize')">
                        <div class="action-circle"><i class="ph ph-brain"></i></div>
                        <span class="action-label">MEMORIZAR</span>
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
                <div class="settings-item" onclick="switchView('bible6')">
                    <div class="settings-label">🗓️ ${window.t('title', 'bible6')}</div>
                    <i class="ph ph-caret-right"></i>
                </div>
                <div class="settings-item" onclick="switchView('nt90')">
                    <div class="settings-label">✝️ ${window.t('title', 'nt90')}</div>
                    <i class="ph ph-caret-right"></i>
                </div>
                <div class="settings-item" onclick="switchView('prov31')">
                    <div class="settings-label">💡 ${window.t('title', 'prov31')}</div>
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
                        <div style="font-size: 0.9rem; opacity: 0.6">${currentLanguageLabel()}</div>
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
                <div class="settings-item" id="versionToggleBtn">
                    <div>
                        <div class="settings-label">${window.t('version')}</div>
                        <div style="font-size: 0.9rem; opacity: 0.6">${currentVersionLabel()}</div>
                    </div>
                    <i class="ph ph-books"></i>
                </div>
            </div>

            <div class="ornament">✦ ✦ ✦</div>
            <div class="privacy-section">
                <div class="privacy-hero">
                    <i class="ph ph-shield-check"></i>
                    <h3>${window.t('heroTitle', 'privacy')}</h3>
                    <p>${window.t('heroDesc', 'privacy')}</p>
                    <div class="privacy-badges">
                        <span class="privacy-badge">${window.t('badgeLocal', 'privacy')}</span>
                        <span class="privacy-badge">${window.t('badgeNoTrack', 'privacy')}</span>
                        <span class="privacy-badge">${window.t('badgeNoAds', 'privacy')}</span>
                        <span class="privacy-badge">${window.t('badgeNoSell', 'privacy')}</span>
                    </div>
                </div>
                <div class="settings-list" style="padding: 0;">
                    <div class="settings-item" id="exportDataBtn">
                        <div>
                            <div class="settings-label">${window.t('exportTitle', 'privacy')}</div>
                            <div class="settings-desc">${window.t('exportDesc', 'privacy')}</div>
                        </div>
                        <i class="ph ph-download-simple"></i>
                    </div>
                    <div class="settings-item" id="importDataBtn">
                        <div>
                            <div class="settings-label">${window.t('importTitle', 'privacy')}</div>
                            <div class="settings-desc">${window.t('importDesc', 'privacy')}</div>
                        </div>
                        <i class="ph ph-upload-simple"></i>
                    </div>
                    <div class="settings-item danger" id="deleteDataBtn">
                        <div>
                            <div class="settings-label">${window.t('deleteTitle', 'privacy')}</div>
                            <div class="settings-desc">${window.t('deleteDesc', 'privacy')}</div>
                        </div>
                        <i class="ph ph-trash"></i>
                    </div>
                    <div class="settings-item" id="privacyPolicyBtn">
                        <div>
                            <div class="settings-label">${window.t('policyLink', 'privacy')}</div>
                        </div>
                        <i class="ph ph-file-text"></i>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('langToggleBtn')?.addEventListener('click', openLanguageModal);

    document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);
    document.getElementById('versionToggleBtn')?.addEventListener('click', openVersionModal);

    document.getElementById('exportDataBtn')?.addEventListener('click', openExportModal);
    document.getElementById('importDataBtn')?.addEventListener('click', openImportModal);
    document.getElementById('deleteDataBtn')?.addEventListener('click', openDeleteModal);
    document.getElementById('privacyPolicyBtn')?.addEventListener('click', () => {
        window.open('privacy.html', '_blank', 'noopener');
    });
}

function currentVersionLabel() {
    const v = BIBLE_VERSIONS.find(v => v.id === state.version) || BIBLE_VERSIONS[0];
    return `${v.abbr} — ${v.name}`;
}

function currentLanguageLabel() {
    const l = LANGUAGES.find(l => l.id === state.lang) || LANGUAGES[0];
    return l.name;
}

function openLanguageModal() {
    let overlay = document.getElementById('language-modal-overlay');
    if (overlay) overlay.remove();

    overlay = document.createElement('div');
    overlay.id = 'language-modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="name-modal version-modal">
            <h2>${window.t('chooseLanguage')}</h2>
            <div class="version-option-list">
                ${LANGUAGES.map(l => `
                    <button class="version-option${l.id === state.lang ? ' active' : ''}" data-lang="${l.id}">
                        <span class="version-abbr">${l.abbr}</span>
                        <span class="version-name">${l.name}</span>
                        <i class="ph ${l.id === state.lang ? 'ph-fill ph-check-circle' : 'ph-circle'}"></i>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });

    overlay.querySelectorAll('.version-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const langId = btn.dataset.lang;
            if (langId !== state.lang) {
                state.lang = langId;
                saveConfig();
                window.applyDocumentDirection(state.lang);
                renderTopBar();
            }
            overlay.remove();
            if (state.currentView === 'settings') switchView('settings');
        });
    });
}

function openVersionModal() {
    let overlay = document.getElementById('version-modal-overlay');
    if (overlay) overlay.remove();

    overlay = document.createElement('div');
    overlay.id = 'version-modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="name-modal version-modal">
            <h2>${window.t('chooseVersion')}</h2>
            <div class="version-option-list">
                ${BIBLE_VERSIONS.map(v => `
                    <button class="version-option${v.id === state.version ? ' active' : ''}" data-version="${v.id}">
                        <span class="version-abbr">${v.abbr}</span>
                        <span class="version-name">${v.name}</span>
                        <i class="ph ${v.id === state.version ? 'ph-fill ph-check-circle' : 'ph-circle'}"></i>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });

    overlay.querySelectorAll('.version-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const versionId = btn.dataset.version;
            if (versionId !== state.version) {
                state.version = versionId;
                saveConfig();
                // Keep whatever chapter is loaded (even if we're currently on
                // another screen, e.g. Settings) in sync with the new version,
                // so the book content always matches the selected version.
                refreshOpenChapter();
            }
            overlay.remove();
            if (state.currentView === 'settings') switchView('settings');
        });
    });
}

/* ═══════════════════ PRIVACY & DATA MODALS ═══════════════════════ */

function closePrivacyModal(overlay) {
    overlay?.remove();
}

function openExportModal() {
    let overlay = document.getElementById('privacy-export-overlay');
    if (overlay) overlay.remove();

    let mode = 'plain'; // 'plain' | 'encrypted'

    overlay = document.createElement('div');
    overlay.id = 'privacy-export-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="name-modal privacy-modal">
            <h2>${window.t('exportModalTitle', 'privacy')}</h2>
            <div class="privacy-modal-sub">${window.t('exportModalSub', 'privacy')}</div>
            <div class="choice-row">
                <button type="button" class="privacy-choice active" data-mode="plain">
                    <i class="ph ph-file-text"></i>
                    <div><strong>${window.t('choicePlainTitle', 'privacy')}</strong>
                    <span class="desc">${window.t('choicePlainDesc', 'privacy')}</span></div>
                </button>
                <button type="button" class="privacy-choice" data-mode="encrypted">
                    <i class="ph ph-lock-key"></i>
                    <div><strong>${window.t('choiceEncTitle', 'privacy')}</strong>
                    <span class="desc">${window.t('choiceEncDesc', 'privacy')}</span></div>
                </button>
            </div>
            <div id="export-pass-wrap" class="d-none">
                <label class="settings-label" style="font-size:.85rem;">${window.t('passphraseLabel', 'privacy')}</label>
                <input type="password" id="export-pass-input" autocomplete="new-password" />
                <div class="field-hint">${window.t('passphraseHint', 'privacy')}</div>
            </div>
            <button type="button" class="primary-btn" id="export-confirm-btn">
                <i class="ph ph-download-simple"></i> ${window.t('downloadBtn', 'privacy')}
            </button>
            <div class="status-msg" id="export-status"></div>
            <button type="button" class="ghost-btn" id="export-close-btn">${window.t('close', 'privacy')}</button>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => { if (e.target === overlay) closePrivacyModal(overlay); });
    overlay.querySelector('#export-close-btn').addEventListener('click', () => closePrivacyModal(overlay));

    const passWrap = overlay.querySelector('#export-pass-wrap');
    overlay.querySelectorAll('.privacy-choice').forEach(btn => {
        btn.addEventListener('click', () => {
            mode = btn.dataset.mode;
            overlay.querySelectorAll('.privacy-choice').forEach(b => b.classList.toggle('active', b === btn));
            passWrap.classList.toggle('d-none', mode !== 'encrypted');
        });
    });

    overlay.querySelector('#export-confirm-btn').addEventListener('click', async () => {
        const statusEl = overlay.querySelector('#export-status');
        const btn = overlay.querySelector('#export-confirm-btn');
        const passphrase = overlay.querySelector('#export-pass-input')?.value || '';

        if (mode === 'encrypted' && !passphrase.trim()) {
            statusEl.textContent = window.t('passphraseLabel', 'privacy');
            statusEl.className = 'status-msg err';
            return;
        }

        btn.disabled = true;
        try {
            await window.PrivacyManager.exportData(mode === 'encrypted' ? { passphrase } : {});
            statusEl.textContent = window.t('exportedOk', 'privacy');
            statusEl.className = 'status-msg ok';
        } catch (err) {
            statusEl.textContent = String(err?.message || err);
            statusEl.className = 'status-msg err';
        } finally {
            btn.disabled = false;
        }
    });
}

function openImportModal() {
    let overlay = document.getElementById('privacy-import-overlay');
    if (overlay) overlay.remove();

    let chosenFile = null;

    overlay = document.createElement('div');
    overlay.id = 'privacy-import-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="name-modal privacy-modal">
            <h2>${window.t('importModalTitle', 'privacy')}</h2>
            <div class="privacy-modal-sub">${window.t('importModalSub', 'privacy')}</div>
            <div class="file-drop" id="import-file-drop">
                <i class="ph ph-file-arrow-up"></i>
                <span id="import-file-label">${window.t('fileDropLabel', 'privacy')}</span>
            </div>
            <input type="file" id="import-file-input" accept=".json,application/json" class="d-none" />
            <div id="import-pass-wrap" class="d-none">
                <label class="settings-label" style="font-size:.85rem;">${window.t('importPassphraseLabel', 'privacy')}</label>
                <input type="password" id="import-pass-input" autocomplete="current-password" />
            </div>
            <button type="button" class="primary-btn" id="import-confirm-btn" disabled>
                <i class="ph ph-upload-simple"></i> ${window.t('importBtn', 'privacy')}
            </button>
            <div class="status-msg" id="import-status"></div>
            <button type="button" class="ghost-btn" id="import-close-btn">${window.t('close', 'privacy')}</button>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => { if (e.target === overlay) closePrivacyModal(overlay); });
    overlay.querySelector('#import-close-btn').addEventListener('click', () => closePrivacyModal(overlay));

    const fileInput = overlay.querySelector('#import-file-input');
    const fileDrop = overlay.querySelector('#import-file-drop');
    const fileLabel = overlay.querySelector('#import-file-label');
    const confirmBtn = overlay.querySelector('#import-confirm-btn');
    const passWrap = overlay.querySelector('#import-pass-wrap');
    const statusEl = overlay.querySelector('#import-status');

    fileDrop.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        chosenFile = file;
        fileLabel.textContent = `${window.t('fileChosen', 'privacy')}: ${file.name}`;
        fileDrop.classList.add('has-file');
        confirmBtn.disabled = false;
        statusEl.textContent = '';
        // Guess if it needs a passphrase, but let the actual import attempt decide.
        passWrap.classList.remove('d-none');
    });

    confirmBtn.addEventListener('click', async () => {
        if (!chosenFile) return;
        confirmBtn.disabled = true;
        statusEl.className = 'status-msg';
        statusEl.textContent = '';
        try {
            const text = await chosenFile.text();
            const passphrase = overlay.querySelector('#import-pass-input')?.value || '';
            const result = await window.PrivacyManager.importData(text, passphrase);
            statusEl.textContent = window.t('importedOk', 'privacy');
            statusEl.className = 'status-msg ok';
            setTimeout(() => window.location.reload(), 900);
        } catch (err) {
            let msg = window.t('importInvalid', 'privacy');
            if (err?.code === 'NEEDS_PASSPHRASE') msg = window.t('importNeedsPass', 'privacy');
            else if (err?.code === 'WRONG_PASSPHRASE') msg = window.t('importWrongPass', 'privacy');
            statusEl.textContent = msg;
            statusEl.className = 'status-msg err';
            confirmBtn.disabled = false;
        }
    });
}

function openDeleteModal() {
    let overlay = document.getElementById('privacy-delete-overlay');
    if (overlay) overlay.remove();

    overlay = document.createElement('div');
    overlay.id = 'privacy-delete-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="name-modal privacy-modal">
            <h2>${window.t('deleteModalTitle', 'privacy')}</h2>
            <div class="privacy-modal-sub">${window.t('deleteModalSub', 'privacy')}</div>
            <div class="danger-warning">${window.t('deleteWarning', 'privacy')}</div>
            <label class="settings-label" style="font-size:.85rem;">
                ${window.t('deleteConfirmLabel', 'privacy')}
                <span class="confirm-type">${window.t('deleteConfirmWord', 'privacy')}</span>
                ${window.t('deleteConfirmLabelEnd', 'privacy')}
            </label>
            <input type="text" id="delete-confirm-input" autocomplete="off" />
            <button type="button" class="primary-btn danger-btn" id="delete-confirm-btn" disabled>
                <i class="ph ph-trash"></i> ${window.t('deleteBtn', 'privacy')}
            </button>
            <div class="status-msg" id="delete-status"></div>
            <button type="button" class="ghost-btn" id="delete-close-btn">${window.t('cancel', 'privacy')}</button>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => { if (e.target === overlay) closePrivacyModal(overlay); });
    overlay.querySelector('#delete-close-btn').addEventListener('click', () => closePrivacyModal(overlay));

    const input = overlay.querySelector('#delete-confirm-input');
    const confirmBtn = overlay.querySelector('#delete-confirm-btn');
    const expectedWord = window.t('deleteConfirmWord', 'privacy');

    input.addEventListener('input', () => {
        confirmBtn.disabled = input.value.trim().toUpperCase() !== expectedWord.toUpperCase();
    });

    confirmBtn.addEventListener('click', async () => {
        confirmBtn.disabled = true;
        const statusEl = overlay.querySelector('#delete-status');
        try {
            await window.PrivacyManager.deleteEverything();
            statusEl.textContent = window.t('deletedOk', 'privacy');
            statusEl.className = 'status-msg ok';
            setTimeout(() => window.location.reload(), 900);
        } catch (err) {
            statusEl.textContent = String(err?.message || err);
            statusEl.className = 'status-msg err';
            confirmBtn.disabled = false;
        }
    });
}

/**
 * Re-fetches the chapter currently associated with state.bookId/state.chapter
 * using whichever Bible version is now selected, and — if the reader is
 * actually on screen — re-renders it immediately. This is what makes the
 * book content "follow" the selected version even when the version was
 * changed from a different screen (e.g. Settings).
 */
async function refreshOpenChapter() {
    if (!state.bookId || !state.chapter) return;
    try {
        const verses = await fetchChapter(state.bookId, state.chapter);
        state.verses = verses;
        if (state.currentView === 'bible') {
            const book = ALL_BOOKS.find(b => b.id === state.bookId);
            if (book) renderVerses(verses, book.name, state.chapter);
        }
    } catch (e) {
        // Silently ignore — the chapter will simply reload fresh next time
        // the user navigates to it.
    }
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
        utt.lang = window.langLocale(state.lang);
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
