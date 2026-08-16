/**
 * MAPAS BÍBLICOS — Dados geográficos
 * Lugares, rotas e território usados pelo módulo js/maps.js.
 * Coordenadas são aproximadas / tradicionais, para fins de estudo e orientação —
 * não substituem pesquisa arqueológica ou acadêmica especializada.
 */
(function () {

    /* ════════════════════════ LUGARES ═══════════════════════════
       category: 'principal' (os 9 lugares pedidos) | 'apoio' (usados nas rotas)
    */
    const PLACES = [
        // --- Os 9 lugares principais ---
        { id: 'jerusalem', name: 'Jerusalém', lat: 31.7683, lng: 35.2137, category: 'principal', icon: 'ph-star', blurb: 'Capital de Israel, centro do Templo, cenário da crucificação, ressurreição e nascimento da Igreja em Pentecostes.' },
        { id: 'bethlehem', name: 'Belém', lat: 31.7054, lng: 35.2024, category: 'principal', icon: 'ph-star', blurb: 'Cidade de Davi e local do nascimento de Jesus (Mateus 2; Lucas 2).' },
        { id: 'nazareth', name: 'Nazaré', lat: 32.6996, lng: 35.3035, category: 'principal', icon: 'ph-star', blurb: 'Vila da Galileia onde Jesus cresceu e foi criado por Maria e José.' },
        { id: 'galilee', name: 'Galileia', lat: 32.8306, lng: 35.5906, category: 'principal', icon: 'ph-star', blurb: 'Região norte de Israel em torno do Mar da Galileia, palco da maior parte do ministério público de Jesus.' },
        { id: 'jericho', name: 'Jericó', lat: 31.8667, lng: 35.4500, category: 'principal', icon: 'ph-star', blurb: 'Uma das cidades mais antigas do mundo; conquistada por Josué (Josué 6) e visitada por Jesus (Lucas 19).' },
        { id: 'corinth', name: 'Corinto', lat: 37.9061, lng: 22.8781, category: 'principal', icon: 'ph-star', blurb: 'Importante cidade grega onde Paulo passou 18 meses e fundou uma igreja (Atos 18).' },
        { id: 'ephesus', name: 'Éfeso', lat: 37.9495, lng: 27.3639, category: 'principal', icon: 'ph-star', blurb: 'Grande cidade da Ásia Menor, base de Paulo por cerca de 3 anos (Atos 19); destinatária de Efésios.' },
        { id: 'rome', name: 'Roma', lat: 41.9028, lng: 12.4964, category: 'principal', icon: 'ph-star', blurb: 'Capital do Império Romano; destino final da viagem de Paulo como prisioneiro (Atos 27-28).' },
        { id: 'antioch', name: 'Antioquia (Síria)', lat: 36.2021, lng: 36.1603, category: 'principal', icon: 'ph-star', blurb: 'Onde os discípulos foram chamados "cristãos" pela primeira vez (Atos 11:26); ponto de partida das viagens de Paulo.' },

        // --- Lugares de apoio (rotas e ministério) ---
        { id: 'egypt_goshen', name: 'Gósen (Egito)', lat: 30.8000, lng: 31.9000, category: 'apoio', icon: 'ph-map-pin', blurb: 'Região do Egito onde os israelitas viveram antes do Êxodo.' },
        { id: 'red_sea_crossing', name: 'Travessia do Mar Vermelho', lat: 29.9000, lng: 32.6000, category: 'apoio', icon: 'ph-map-pin', blurb: 'Local tradicional da travessia miraculosa (Êxodo 14).' },
        { id: 'mount_sinai', name: 'Monte Sinai', lat: 28.5392, lng: 33.9734, category: 'apoio', icon: 'ph-mountains', blurb: 'Onde Moisés recebeu os Dez Mandamentos (Êxodo 19-20).' },
        { id: 'kadesh_barnea', name: 'Cades-Barneia', lat: 30.6667, lng: 34.4667, category: 'apoio', icon: 'ph-map-pin', blurb: 'Acampamento base de Israel no deserto por longo período (Números 13-14).' },
        { id: 'edom', name: 'Edom', lat: 30.5000, lng: 35.5000, category: 'apoio', icon: 'ph-map-pin', blurb: 'Território que Israel contornou a caminho de Moabe (Números 20).' },
        { id: 'moab_plains', name: 'Planícies de Moabe', lat: 31.7500, lng: 35.6200, category: 'apoio', icon: 'ph-map-pin', blurb: 'Último acampamento de Israel antes de atravessar o Jordão (Números 22; Deuteronômio 34).' },
        { id: 'mount_nebo', name: 'Monte Nebo', lat: 31.7683, lng: 35.7256, category: 'apoio', icon: 'ph-mountains', blurb: 'De onde Moisés viu a Terra Prometida antes de morrer (Deuteronômio 34).' },
        { id: 'jordan_river_baptism', name: 'Rio Jordão (Batismo)', lat: 31.8394, lng: 35.5497, category: 'apoio', icon: 'ph-drop', blurb: 'Local tradicional do batismo de Jesus por João Batista (Mateus 3).' },
        { id: 'capernaum', name: 'Cafarnaum', lat: 32.8797, lng: 35.5744, category: 'apoio', icon: 'ph-map-pin', blurb: 'Cidade à beira do Mar da Galileia que se tornou base do ministério de Jesus (Mateus 4:13).' },
        { id: 'cana', name: 'Caná', lat: 32.7500, lng: 35.3390, category: 'apoio', icon: 'ph-map-pin', blurb: 'Onde Jesus realizou seu primeiro milagre, transformando água em vinho (João 2).' },
        { id: 'samaria_sychar', name: 'Sicar (Samaria)', lat: 32.2136, lng: 35.2728, category: 'apoio', icon: 'ph-map-pin', blurb: 'Onde Jesus conversou com a mulher samaritana no poço de Jacó (João 4).' },
        { id: 'bethany', name: 'Betânia', lat: 31.7719, lng: 35.2556, category: 'apoio', icon: 'ph-map-pin', blurb: 'Vila perto de Jerusalém, lar de Marta, Maria e Lázaro (João 11).' },
        { id: 'emmaus', name: 'Emaús', lat: 31.8386, lng: 34.9933, category: 'apoio', icon: 'ph-map-pin', blurb: 'Onde o Jesus ressuscitado caminhou com dois discípulos (Lucas 24).' },
        { id: 'gaza', name: 'Gaza', lat: 31.5017, lng: 34.4668, category: 'apoio', icon: 'ph-map-pin', blurb: 'Rota onde Filipe encontrou o eunuco etíope (Atos 8).' },
        { id: 'damascus', name: 'Damasco', lat: 33.5138, lng: 36.2765, category: 'apoio', icon: 'ph-map-pin', blurb: 'Onde Saulo (Paulo) teve seu encontro com Cristo (Atos 9).' },
        { id: 'caesarea_maritima', name: 'Cesareia Marítima', lat: 32.5000, lng: 34.8933, category: 'apoio', icon: 'ph-anchor', blurb: 'Principal porto romano da Judeia; Paulo foi preso e embarcou para Roma a partir daqui (Atos 21-27).' },
        { id: 'tarsus', name: 'Tarso', lat: 36.9167, lng: 34.8958, category: 'apoio', icon: 'ph-map-pin', blurb: 'Cidade natal do apóstolo Paulo (Atos 22:3).' },
        { id: 'cyprus_salamis', name: 'Salamina (Chipre)', lat: 35.1856, lng: 33.9028, category: 'apoio', icon: 'ph-anchor', blurb: 'Primeira parada da primeira viagem missionária de Paulo (Atos 13).' },
        { id: 'perga', name: 'Perge', lat: 36.9611, lng: 30.8494, category: 'apoio', icon: 'ph-map-pin', blurb: 'Cidade da Panfília visitada na primeira viagem (Atos 13:13).' },
        { id: 'antioch_pisidia', name: 'Antioquia da Pisídia', lat: 38.3070, lng: 31.1893, category: 'apoio', icon: 'ph-map-pin', blurb: 'Onde Paulo pregou seu primeiro sermão registrado em uma sinagoga (Atos 13:14-52).' },
        { id: 'iconium', name: 'Icônio', lat: 37.8746, lng: 32.4932, category: 'apoio', icon: 'ph-map-pin', blurb: 'Cidade visitada em todas as três viagens missionárias de Paulo (Atos 14).' },
        { id: 'lystra', name: 'Listra', lat: 37.5786, lng: 32.4547, category: 'apoio', icon: 'ph-map-pin', blurb: 'Onde Paulo foi apedrejado e onde conheceu Timóteo (Atos 14; 16:1).' },
        { id: 'derbe', name: 'Derbe', lat: 37.3494, lng: 33.2497, category: 'apoio', icon: 'ph-map-pin', blurb: 'Cidade da Galácia, ponto extremo da primeira viagem (Atos 14:20).' },
        { id: 'troas', name: 'Trôade', lat: 39.7559, lng: 26.1604, category: 'apoio', icon: 'ph-anchor', blurb: 'Onde Paulo teve a visão do "homem da Macedônia" (Atos 16:8-10).' },
        { id: 'philippi', name: 'Filipos', lat: 41.0138, lng: 24.2874, category: 'apoio', icon: 'ph-map-pin', blurb: 'Primeira cidade da Europa evangelizada por Paulo; Lídia convertida e Paulo/Silas presos (Atos 16).' },
        { id: 'thessalonica', name: 'Tessalônica', lat: 40.6401, lng: 22.9444, category: 'apoio', icon: 'ph-map-pin', blurb: 'Cidade da Macedônia visitada por Paulo (Atos 17:1-9); destinatária de 1 e 2 Tessalonicenses.' },
        { id: 'berea', name: 'Bereia', lat: 40.5233, lng: 22.2000, category: 'apoio', icon: 'ph-map-pin', blurb: 'Onde os judeus "examinavam as Escrituras" para conferir a mensagem de Paulo (Atos 17:10-11).' },
        { id: 'athens', name: 'Atenas', lat: 37.9838, lng: 23.7275, category: 'apoio', icon: 'ph-map-pin', blurb: 'Onde Paulo pregou no Areópago (Atos 17:16-34).' },
        { id: 'miletus', name: 'Mileto', lat: 37.5300, lng: 27.2800, category: 'apoio', icon: 'ph-anchor', blurb: 'Onde Paulo se despediu emocionadamente dos presbíteros de Éfeso (Atos 20:17-38).' },
        { id: 'crete_fair_havens', name: 'Bons Portos (Creta)', lat: 34.9833, lng: 24.7500, category: 'apoio', icon: 'ph-anchor', blurb: 'Parada da viagem de Paulo a Roma antes da tempestade (Atos 27:8).' },
        { id: 'malta', name: 'Malta', lat: 35.9375, lng: 14.3754, category: 'apoio', icon: 'ph-anchor', blurb: 'Ilha onde o navio de Paulo naufragou a caminho de Roma (Atos 28:1).' },
    ];

    /* ════════════════════════ TRIBOS DE ISRAEL ═══════════════════
       Territórios aproximados (Josué 13-21). Levi não recebeu território
       contínuo — foi disperso em cidades levíticas entre as demais tribos.
    */
    const TRIBES = [
        { id: 'reuben', name: 'Rúben', lat: 31.40, lng: 35.72, radiusKm: 28, note: 'Leste do Mar Morto' },
        { id: 'gad', name: 'Gade', lat: 31.90, lng: 35.85, radiusKm: 26, note: 'Leste do Jordão, centro' },
        { id: 'manasseh_east', name: 'Manassés (leste)', lat: 32.65, lng: 35.95, radiusKm: 30, note: 'Basã, leste do Jordão' },
        { id: 'manasseh_west', name: 'Manassés (oeste)', lat: 32.30, lng: 35.15, radiusKm: 22, note: 'Centro, oeste do Jordão' },
        { id: 'ephraim', name: 'Efraim', lat: 32.05, lng: 35.25, radiusKm: 20, note: 'Região montanhosa central' },
        { id: 'benjamin', name: 'Benjamim', lat: 31.85, lng: 35.25, radiusKm: 14, note: 'Entre Efraim e Judá, junto a Jerusalém' },
        { id: 'dan', name: 'Dã', lat: 33.2489, lng: 35.6519, radiusKm: 12, note: 'Migrou do litoral para o extremo norte (Juízes 18)' },
        { id: 'judah', name: 'Judá', lat: 31.50, lng: 35.10, radiusKm: 32, note: 'Sul, incluindo Belém e Hebrom' },
        { id: 'simeon', name: 'Simeão', lat: 31.25, lng: 34.80, radiusKm: 20, note: 'Dentro do território de Judá, extremo sul' },
        { id: 'issachar', name: 'Issacar', lat: 32.60, lng: 35.35, radiusKm: 16, note: 'Vale de Jezreel' },
        { id: 'zebulun', name: 'Zebulom', lat: 32.75, lng: 35.20, radiusKm: 14, note: 'Baixa Galileia' },
        { id: 'asher', name: 'Aser', lat: 32.90, lng: 35.15, radiusKm: 18, note: 'Litoral norte' },
        { id: 'naphtali', name: 'Naftali', lat: 32.95, lng: 35.45, radiusKm: 20, note: 'Alta Galileia, a oeste do Mar da Galileia' },
    ];
    const LEVI_NOTE = 'Levi não recebeu território próprio: seus descendentes viviam espalhados em 48 cidades levíticas por todas as outras tribos, sustentados pelos dízimos (Josué 21).';

    /* ════════════════════════ ROTA DO ÊXODO ══════════════════════ */
    const EXODUS_ROUTE = {
        id: 'exodus',
        name: 'Rota do Êxodo',
        color: '#d4af37',
        stops: [
            { placeId: 'egypt_goshen', label: 'Partida do Egito', ref: 'Êxodo 12:37' },
            { placeId: 'red_sea_crossing', label: 'Travessia do Mar Vermelho', ref: 'Êxodo 14:21-22' },
            { placeId: 'mount_sinai', label: 'A Lei no Monte Sinai', ref: 'Êxodo 19:1-2' },
            { placeId: 'kadesh_barnea', label: 'Acampamento prolongado', ref: 'Números 13:26' },
            { placeId: 'edom', label: 'Contorno de Edom', ref: 'Números 20:21' },
            { placeId: 'moab_plains', label: 'Planícies de Moabe', ref: 'Números 22:1' },
            { placeId: 'mount_nebo', label: 'Morte de Moisés', ref: 'Deuteronômio 34:1-5' },
            { placeId: 'jericho', label: 'Travessia do Jordão sob Josué', ref: 'Josué 3:14-17' },
        ],
    };

    /* ════════════════════════ MINISTÉRIO DE JESUS ═════════════════
       Ordem simplificada — não é estritamente cronológica em cada detalhe,
       serve para dar contexto geográfico geral aos evangelhos.
    */
    const JESUS_MINISTRY = {
        id: 'jesus',
        name: 'Ministério de Jesus',
        color: '#8b1a1a',
        stops: [
            { placeId: 'bethlehem', label: 'Nascimento', ref: 'Lucas 2:1-7' },
            { placeId: 'nazareth', label: 'Infância e juventude', ref: 'Lucas 2:39-40' },
            { placeId: 'jordan_river_baptism', label: 'Batismo por João', ref: 'Mateus 3:13-17' },
            { placeId: 'cana', label: 'Primeiro milagre', ref: 'João 2:1-11' },
            { placeId: 'capernaum', label: 'Base do ministério', ref: 'Mateus 4:13' },
            { placeId: 'galilee', label: 'Ensino e milagres na Galileia', ref: 'Mateus 4:23-25' },
            { placeId: 'samaria_sychar', label: 'A mulher samaritana', ref: 'João 4:4-26' },
            { placeId: 'bethany', label: 'Ressurreição de Lázaro', ref: 'João 11:1-44' },
            { placeId: 'jericho', label: 'Zaqueu', ref: 'Lucas 19:1-10' },
            { placeId: 'jerusalem', label: 'Entrada triunfal, crucificação e ressurreição', ref: 'Mateus 21; 27-28' },
            { placeId: 'emmaus', label: 'Aparição após a ressurreição', ref: 'Lucas 24:13-35' },
        ],
    };

    /* ════════════════════════ VIAGENS DE PAULO ═══════════════════ */
    const JOURNEYS = {
        journey1: {
            id: 'journey1', name: '1ª Viagem Missionária', color: '#c0392b', ref: 'Atos 13-14',
            stops: [
                { placeId: 'antioch', label: 'Envio da igreja', ref: 'Atos 13:1-3' },
                { placeId: 'cyprus_salamis', label: 'Chipre', ref: 'Atos 13:4-12' },
                { placeId: 'perga', label: 'Perge da Panfília', ref: 'Atos 13:13' },
                { placeId: 'antioch_pisidia', label: 'Sermão na sinagoga', ref: 'Atos 13:14-52' },
                { placeId: 'iconium', label: 'Icônio', ref: 'Atos 14:1-7' },
                { placeId: 'lystra', label: 'Cura e apedrejamento', ref: 'Atos 14:8-20' },
                { placeId: 'derbe', label: 'Ponto mais distante', ref: 'Atos 14:20-21' },
                { placeId: 'antioch', label: 'Retorno e relato à igreja', ref: 'Atos 14:26-28' },
            ],
        },
        journey2: {
            id: 'journey2', name: '2ª Viagem Missionária', color: '#2980b9', ref: 'Atos 15:36-18:22',
            stops: [
                { placeId: 'antioch', label: 'Partida com Silas', ref: 'Atos 15:40' },
                { placeId: 'derbe', label: 'Revisita', ref: 'Atos 16:1' },
                { placeId: 'lystra', label: 'Timóteo se junta a Paulo', ref: 'Atos 16:1-3' },
                { placeId: 'troas', label: 'Visão do homem da Macedônia', ref: 'Atos 16:8-10' },
                { placeId: 'philippi', label: 'Lídia; prisão de Paulo e Silas', ref: 'Atos 16:11-40' },
                { placeId: 'thessalonica', label: 'Pregação na sinagoga', ref: 'Atos 17:1-9' },
                { placeId: 'berea', label: 'Bereianos nobres', ref: 'Atos 17:10-14' },
                { placeId: 'athens', label: 'Discurso no Areópago', ref: 'Atos 17:16-34' },
                { placeId: 'corinth', label: '18 meses de ministério', ref: 'Atos 18:1-17' },
                { placeId: 'ephesus', label: 'Passagem breve', ref: 'Atos 18:19-21' },
                { placeId: 'caesarea_maritima', label: 'Desembarque', ref: 'Atos 18:22' },
                { placeId: 'antioch', label: 'Retorno', ref: 'Atos 18:22' },
            ],
        },
        journey3: {
            id: 'journey3', name: '3ª Viagem Missionária', color: '#27ae60', ref: 'Atos 18:23-21:16',
            stops: [
                { placeId: 'antioch', label: 'Partida', ref: 'Atos 18:23' },
                { placeId: 'iconium', label: 'Fortalecendo os discípulos', ref: 'Atos 18:23' },
                { placeId: 'ephesus', label: 'Cerca de 3 anos de ministério', ref: 'Atos 19:1-41' },
                { placeId: 'philippi', label: 'Macedônia', ref: 'Atos 20:1-2' },
                { placeId: 'corinth', label: 'Grécia, 3 meses', ref: 'Atos 20:2-3' },
                { placeId: 'troas', label: 'Ressurreição de Êutico', ref: 'Atos 20:6-12' },
                { placeId: 'miletus', label: 'Despedida dos presbíteros de Éfeso', ref: 'Atos 20:17-38' },
                { placeId: 'caesarea_maritima', label: 'Advertência de Ágabo', ref: 'Atos 21:8-14' },
                { placeId: 'jerusalem', label: 'Chegada e prisão', ref: 'Atos 21:15-17' },
            ],
        },
        journeyToRome: {
            id: 'journeyToRome', name: 'Viagem a Roma', color: '#8e44ad', ref: 'Atos 27-28',
            stops: [
                { placeId: 'caesarea_maritima', label: 'Embarque como prisioneiro', ref: 'Atos 27:1-2' },
                { placeId: 'crete_fair_havens', label: 'Bons Portos, aviso da tempestade', ref: 'Atos 27:8-10' },
                { placeId: 'malta', label: 'Naufrágio', ref: 'Atos 28:1' },
                { placeId: 'rome', label: 'Chegada e prisão domiciliar', ref: 'Atos 28:16' },
            ],
        },
    };

    /* ════════════════════════ CONTEXTO POR PASSAGEM ═══════════════
       Chave: "LIVRO_CAPÍTULO" (específico) ou "LIVRO" (padrão do livro todo).
       layers: quais camadas ativar no mapa | focusPlace: marcador para destacar.
    */
    const PASSAGE_MAP = {
        // Êxodo
        'EXO': { title: 'Rota do Êxodo', layers: ['exodus'], center: [30.2, 34.0], zoom: 6 },
        'EXO_14': { title: 'Travessia do Mar Vermelho', layers: ['exodus'], center: [29.9, 32.6], zoom: 7, focusPlace: 'red_sea_crossing' },
        'EXO_19': { title: 'No Monte Sinai', layers: ['exodus'], center: [28.54, 33.97], zoom: 8, focusPlace: 'mount_sinai' },
        'EXO_20': { title: 'Os Dez Mandamentos', layers: ['exodus'], center: [28.54, 33.97], zoom: 8, focusPlace: 'mount_sinai' },
        'NUM': { title: 'Peregrinação no deserto', layers: ['exodus'], center: [30.5, 34.5], zoom: 6 },
        'NUM_13': { title: 'Os espias em Canaã', layers: ['exodus'], center: [30.67, 34.47], zoom: 7, focusPlace: 'kadesh_barnea' },
        'NUM_14': { title: 'Cades-Barneia', layers: ['exodus'], center: [30.67, 34.47], zoom: 7, focusPlace: 'kadesh_barnea' },
        'NUM_20': { title: 'Contornando Edom', layers: ['exodus'], center: [30.7, 35.2], zoom: 7, focusPlace: 'edom' },
        'NUM_33': { title: 'Resumo de toda a jornada do Êxodo', layers: ['exodus'], center: [30.0, 34.5], zoom: 6 },
        'DEU': { title: 'Últimas instruções antes da Terra Prometida', layers: ['exodus'], center: [31.75, 35.65], zoom: 8, focusPlace: 'moab_plains' },
        'DEU_34': { title: 'A morte de Moisés no Monte Nebo', layers: ['exodus'], center: [31.77, 35.73], zoom: 9, focusPlace: 'mount_nebo' },
        'JOS': { title: 'Conquista e divisão da terra', layers: ['exodus', 'tribes'], center: [31.9, 35.4], zoom: 8 },
        'JOS_1': { title: 'A travessia do Jordão se aproxima', layers: ['exodus'], center: [31.87, 35.45], zoom: 9, focusPlace: 'jericho' },
        'JOS_3': { title: 'Travessia do Jordão', layers: ['exodus'], center: [31.87, 35.45], zoom: 9, focusPlace: 'jericho' },
        'JOS_6': { title: 'A queda de Jericó', layers: ['places'], center: [31.87, 35.45], zoom: 10, focusPlace: 'jericho' },
        'JOS_13': { title: 'Divisão da terra entre as tribos', layers: ['tribes'], center: [31.9, 35.4], zoom: 8 },
        'JOS_14': { title: 'Divisão da terra entre as tribos', layers: ['tribes'], center: [31.9, 35.4], zoom: 8 },
        'JOS_15': { title: 'Território de Judá', layers: ['tribes'], center: [31.5, 35.1], zoom: 9, focusPlace: 'judah' },
        'JOS_16': { title: 'Território de Efraim', layers: ['tribes'], center: [32.05, 35.25], zoom: 9, focusPlace: 'ephraim' },
        'JOS_17': { title: 'Território de Manassés', layers: ['tribes'], center: [32.4, 35.5], zoom: 8, focusPlace: 'manasseh_west' },
        'JOS_18': { title: 'Território de Benjamim e outros sorteios', layers: ['tribes'], center: [31.9, 35.4], zoom: 8, focusPlace: 'benjamin' },
        'JOS_19': { title: 'Territórios de Simeão, Zebulom, Issacar, Aser, Naftali e Dã', layers: ['tribes'], center: [32.4, 35.4], zoom: 7 },
        'JOS_20': { title: 'Cidades de refúgio', layers: ['tribes'], center: [31.9, 35.4], zoom: 8 },
        'JOS_21': { title: 'Cidades levíticas', layers: ['tribes'], center: [31.9, 35.4], zoom: 8 },
        'JDG': { title: 'Território das tribos na época dos Juízes', layers: ['tribes'], center: [31.9, 35.4], zoom: 8 },
        'JDG_18': { title: 'A migração da tribo de Dã', layers: ['tribes'], center: [32.9, 35.6], zoom: 8, focusPlace: 'dan' },

        // Evangelhos — ministério de Jesus
        'MAT': { title: 'Ministério de Jesus', layers: ['jesus'], center: [32.3, 35.4], zoom: 8 },
        'MAT_1': { title: 'O nascimento de Jesus', layers: ['jesus'], center: [31.71, 35.20], zoom: 11, focusPlace: 'bethlehem' },
        'MAT_2': { title: 'O nascimento de Jesus', layers: ['jesus'], center: [31.71, 35.20], zoom: 11, focusPlace: 'bethlehem' },
        'MAT_3': { title: 'O batismo de Jesus', layers: ['jesus'], center: [31.84, 35.55], zoom: 11, focusPlace: 'jordan_river_baptism' },
        'MAT_4': { title: 'Início do ministério na Galileia', layers: ['jesus'], center: [32.88, 35.57], zoom: 10, focusPlace: 'capernaum' },
        'MAT_5': { title: 'Sermão do Monte', layers: ['jesus'], center: [32.83, 35.59], zoom: 10, focusPlace: 'galilee' },
        'MAT_21': { title: 'Entrada triunfal em Jerusalém', layers: ['jesus'], center: [31.77, 35.21], zoom: 12, focusPlace: 'jerusalem' },
        'MAT_27': { title: 'A crucificação', layers: ['jesus'], center: [31.77, 35.21], zoom: 12, focusPlace: 'jerusalem' },
        'MAT_28': { title: 'A ressurreição', layers: ['jesus'], center: [31.77, 35.21], zoom: 12, focusPlace: 'jerusalem' },
        'MRK': { title: 'Ministério de Jesus', layers: ['jesus'], center: [32.3, 35.4], zoom: 8 },
        'MRK_1': { title: 'Início do ministério na Galileia', layers: ['jesus'], center: [32.88, 35.57], zoom: 10, focusPlace: 'capernaum' },
        'LUK': { title: 'Ministério de Jesus', layers: ['jesus'], center: [32.3, 35.4], zoom: 8 },
        'LUK_1': { title: 'Anúncios do nascimento', layers: ['jesus'], center: [31.71, 35.20], zoom: 10, focusPlace: 'bethlehem' },
        'LUK_2': { title: 'O nascimento de Jesus', layers: ['jesus'], center: [31.71, 35.20], zoom: 11, focusPlace: 'bethlehem' },
        'LUK_19': { title: 'Zaqueu em Jericó', layers: ['jesus'], center: [31.87, 35.45], zoom: 11, focusPlace: 'jericho' },
        'LUK_24': { title: 'A caminho de Emaús', layers: ['jesus'], center: [31.80, 35.10], zoom: 10, focusPlace: 'emmaus' },
        'JHN': { title: 'Ministério de Jesus', layers: ['jesus'], center: [32.3, 35.4], zoom: 8 },
        'JHN_2': { title: 'As bodas de Caná', layers: ['jesus'], center: [32.75, 35.34], zoom: 11, focusPlace: 'cana' },
        'JHN_4': { title: 'A mulher samaritana', layers: ['jesus'], center: [32.21, 35.27], zoom: 11, focusPlace: 'samaria_sychar' },
        'JHN_11': { title: 'A ressurreição de Lázaro', layers: ['jesus'], center: [31.77, 35.26], zoom: 12, focusPlace: 'bethany' },

        // Atos — viagens de Paulo
        'ACT': { title: 'Viagens missionárias de Paulo', layers: ['journey1', 'journey2', 'journey3', 'journeyToRome'], center: [37.0, 30.0], zoom: 4 },
        'ACT_8': { title: 'Filipe e o eunuco etíope', layers: ['places'], center: [31.5, 34.5], zoom: 8, focusPlace: 'gaza' },
        'ACT_9': { title: 'A conversão de Saulo', layers: ['places'], center: [33.5, 36.3], zoom: 7, focusPlace: 'damascus' },
        'ACT_13': { title: '1ª Viagem Missionária de Paulo', layers: ['journey1'], center: [36.5, 32.5], zoom: 6 },
        'ACT_14': { title: '1ª Viagem Missionária de Paulo', layers: ['journey1'], center: [37.3, 33.0], zoom: 6, focusPlace: 'lystra' },
        'ACT_15': { title: 'Início da 2ª Viagem Missionária', layers: ['journey2'], center: [37.0, 32.0], zoom: 5 },
        'ACT_16': { title: "2ª Viagem: a visão da Macedônia e a prisão em Filipos", layers: ['journey2'], center: [40.5, 24.0], zoom: 6, focusPlace: 'philippi' },
        'ACT_17': { title: '2ª Viagem: Tessalônica, Bereia e Atenas', layers: ['journey2'], center: [39.5, 23.0], zoom: 6, focusPlace: 'athens' },
        'ACT_18': { title: '2ª Viagem: Corinto e retorno', layers: ['journey2'], center: [38.0, 25.0], zoom: 6, focusPlace: 'corinth' },
        'ACT_19': { title: '3ª Viagem: ministério em Éfeso', layers: ['journey3'], center: [37.95, 27.36], zoom: 7, focusPlace: 'ephesus' },
        'ACT_20': { title: '3ª Viagem: despedida em Mileto', layers: ['journey3'], center: [38.5, 25.0], zoom: 6, focusPlace: 'miletus' },
        'ACT_21': { title: '3ª Viagem: chegada e prisão em Jerusalém', layers: ['journey3'], center: [32.0, 34.7], zoom: 7, focusPlace: 'jerusalem' },
        'ACT_27': { title: 'Viagem a Roma: a tempestade', layers: ['journeyToRome'], center: [34.0, 22.0], zoom: 5, focusPlace: 'crete_fair_havens' },
        'ACT_28': { title: 'Viagem a Roma: naufrágio e chegada', layers: ['journeyToRome'], center: [38.0, 18.0], zoom: 5, focusPlace: 'malta' },
    };

    window.BIBLE_MAPS = { PLACES, TRIBES, LEVI_NOTE, EXODUS_ROUTE, JESUS_MINISTRY, JOURNEYS, PASSAGE_MAP };

    /**
     * Retorna a configuração de mapa para uma passagem (capítulo específico
     * ou, na ausência dele, o padrão do livro). Retorna null se não houver contexto.
     */
    window.getMapContextForPassage = function (bookId, chapter) {
        if (!bookId) return null;
        return PASSAGE_MAP[`${bookId}_${chapter}`] || PASSAGE_MAP[bookId] || null;
    };

})();
