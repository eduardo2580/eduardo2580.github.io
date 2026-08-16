/**
 * MAPAS BÍBLICOS INTERATIVOS — Motor do mapa
 * Usa Leaflet + tiles do OpenStreetMap (vendorizados localmente para funcionar offline).
 * Depende de: js/vendor/leaflet/leaflet.js, js/maps-data.js — carregar antes deste arquivo.
 */
(function () {

    // Precisa bater com MAPTILES_NAME em sw.js — mesma Cache Storage, origem compartilhada.
    const TILE_CACHE_NAME = 'bible-sagrada-maptiles-v1';
    const OFFLINE_KEY = 'bible_maps_offline_v1';
    const ALL_LAYER_IDS = ['places', 'journey1', 'journey2', 'journey3', 'journeyToRome', 'exodus', 'tribes', 'jesus'];

    const D = window.BIBLE_MAPS;

    let map = null;
    let layerGroups = {};
    let placeMarkers = {};
    let activeLayers = new Set(['places']);
    let pendingPassage = null;

    /* ════════════════════════ PERSISTÊNCIA (áreas offline) ═══════ */
    function loadOfflineSet() {
        try { return new Set(JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]')); }
        catch (_) { return new Set(); }
    }
    function saveOfflineSet(set) {
        try { localStorage.setItem(OFFLINE_KEY, JSON.stringify([...set])); } catch (_) { }
    }
    let offlineDownloaded = loadOfflineSet();

    /* ════════════════════════ HELPERS ═════════════════════════════ */
    function placeById(id) { return D.PLACES.find(p => p.id === id); }

    function tileXY(lat, lon, z) {
        const latRad = lat * Math.PI / 180;
        const n = Math.pow(2, z);
        const x = Math.floor((lon + 180) / 360 * n);
        const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
        return { x, y };
    }

    /* ════════════════════════ DOWNLOAD OFFLINE ═══════════════════
       Baixa uma grade modesta de tiles (poucos zooms, poucos ladrilhos por zoom)
       ao redor de um lugar, para uso quando não há conexão.
    */
    async function downloadAreaOffline(place, btnEl) {
        if (!('caches' in window)) return;
        if (btnEl) { btnEl.disabled = true; btnEl.classList.add('loading'); btnEl.innerHTML = '<i class="ph ph-spinner-gap ph-spin"></i> Baixando…'; }

        const zooms = [6, 8, 11, 13];
        const subdomains = ['a', 'b', 'c'];
        const urls = [];
        zooms.forEach(z => {
            const { x, y } = tileXY(place.lat, place.lng, z);
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const tx = x + dx, ty = y + dy;
                    if (tx < 0 || ty < 0) continue;
                    const s = subdomains[(tx + ty) % subdomains.length];
                    urls.push(`https://${s}.tile.openstreetmap.org/${z}/${tx}/${ty}.png`);
                }
            }
        });

        try {
            const cache = await caches.open(TILE_CACHE_NAME);
            let done = 0;
            for (const url of urls) {
                try {
                    const existing = await cache.match(url);
                    if (!existing) {
                        const resp = await fetch(url, { mode: 'no-cors' });
                        await cache.put(url, resp);
                    }
                } catch (_) { /* um tile falho não interrompe o restante */ }
                done++;
                if (btnEl) btnEl.innerHTML = `<i class="ph ph-spinner-gap ph-spin"></i> Baixando… ${Math.round(done / urls.length * 100)}%`;
            }
            offlineDownloaded.add(place.id);
            saveOfflineSet(offlineDownloaded);
        } catch (e) {
            console.error('Falha ao baixar região offline:', e);
        }
        renderPlaceList();
    }

    /* ════════════════════════ CONSTRUÇÃO DO MAPA ══════════════════ */
    function mainIcon() {
        return L.divIcon({
            className: '', html: '<span class="map-pin map-pin-main"><i class="ph-fill ph-star"></i></span>',
            iconSize: [30, 30], iconAnchor: [15, 28], popupAnchor: [0, -26],
        });
    }
    function stopIcon(num, color) {
        return L.divIcon({
            className: '', html: `<span class="map-pin map-stop" style="background:${color}">${num}</span>`,
            iconSize: [24, 24], iconAnchor: [12, 12], popupAnchor: [0, -14],
        });
    }
    function tribeIcon(label) {
        return L.divIcon({
            className: '', html: `<span class="map-tribe-label">${label}</span>`,
            iconSize: null, iconAnchor: [0, 0],
        });
    }

    function placePopup(p) {
        return `<div class="map-popup"><strong>${p.name}</strong><p>${p.blurb}</p></div>`;
    }

    function buildRouteLayer(route) {
        const group = L.layerGroup();
        const latlngs = [];
        route.stops.forEach((stop, idx) => {
            const place = placeById(stop.placeId);
            if (!place) return;
            latlngs.push([place.lat, place.lng]);
            L.marker([place.lat, place.lng], { icon: stopIcon(idx + 1, route.color) })
                .bindPopup(`<div class="map-popup"><strong>${idx + 1}. ${place.name}</strong><p>${stop.label}</p><em>${stop.ref}</em></div>`)
                .addTo(group);
        });
        L.polyline(latlngs, {
            color: route.color, weight: 3, opacity: 0.85,
            dashArray: route.id === 'exodus' ? '6,8' : null,
        }).addTo(group);
        group._routeMeta = route;
        return group;
    }

    function buildLayerGroups() {
        layerGroups = {};
        placeMarkers = {};

        const placesLayer = L.layerGroup();
        D.PLACES.filter(p => p.category === 'principal').forEach(p => {
            const marker = L.marker([p.lat, p.lng], { icon: mainIcon() }).bindPopup(placePopup(p)).addTo(placesLayer);
            placeMarkers[p.id] = marker;
        });
        layerGroups.places = placesLayer;

        const tribesLayer = L.layerGroup();
        D.TRIBES.forEach(t => {
            L.circle([t.lat, t.lng], { radius: t.radiusKm * 1000, color: '#8b6f3a', weight: 1, fillColor: '#c9a96e', fillOpacity: 0.18 }).addTo(tribesLayer);
            L.marker([t.lat, t.lng], { icon: tribeIcon(t.name) })
                .bindPopup(`<div class="map-popup"><strong>${t.name}</strong><p>${t.note}</p></div>`)
                .addTo(tribesLayer);
        });
        L.marker([31.9, 35.35], {
            icon: L.divIcon({ className: '', html: '<span class="map-tribe-label map-tribe-levi">Levi (disperso)</span>', iconSize: null }),
        }).bindPopup(`<div class="map-popup"><strong>Levi</strong><p>${D.LEVI_NOTE}</p></div>`).addTo(tribesLayer);
        layerGroups.tribes = tribesLayer;

        layerGroups.exodus = buildRouteLayer(D.EXODUS_ROUTE);
        layerGroups.jesus = buildRouteLayer(D.JESUS_MINISTRY);
        ['journey1', 'journey2', 'journey3', 'journeyToRome'].forEach(jid => {
            layerGroups[jid] = buildRouteLayer(D.JOURNEYS[jid]);
        });
    }

    function applyActiveLayers() {
        if (!map) return;
        Object.keys(layerGroups).forEach(id => {
            const shouldShow = activeLayers.has(id);
            const has = map.hasLayer(layerGroups[id]);
            if (shouldShow && !has) layerGroups[id].addTo(map);
            if (!shouldShow && has) map.removeLayer(layerGroups[id]);
        });
        renderLegend();
    }

    function renderLegend() {
        const el = document.getElementById('mapsLegend');
        if (!el) return;
        const items = [];
        ['journey1', 'journey2', 'journey3', 'journeyToRome', 'exodus', 'jesus'].forEach(id => {
            if (activeLayers.has(id) && layerGroups[id]) {
                const meta = layerGroups[id]._routeMeta;
                items.push(`<span class="maps-legend-item"><span class="maps-legend-dot" style="background:${meta.color}"></span>${meta.name}</span>`);
            }
        });
        el.innerHTML = items.join('');
    }

    function syncChipUI() {
        document.querySelectorAll('.maps-chip[data-layer]').forEach(btn => {
            btn.classList.toggle('active', activeLayers.has(btn.dataset.layer));
        });
    }

    function showBanner(text) {
        const b = document.getElementById('mapsBanner');
        if (!b) return;
        b.innerHTML = `<i class="ph ph-map-trifold"></i> ${text}`;
        b.classList.remove('d-none');
    }

    /* ════════════════════════ INTERAÇÃO ═══════════════════════════ */
    function toggleLayer(id, btn) {
        if (activeLayers.has(id)) { activeLayers.delete(id); btn?.classList.remove('active'); }
        else { activeLayers.add(id); btn?.classList.add('active'); }
        applyActiveLayers();
    }

    function wireChips() {
        document.querySelectorAll('.maps-chip[data-layer]').forEach(btn => {
            btn.addEventListener('click', () => toggleLayer(btn.dataset.layer, btn));
        });
    }

    function flyToPlace(id) {
        const p = placeById(id);
        if (!p || !map) return;
        if (!activeLayers.has('places')) { activeLayers.add('places'); syncChipUI(); applyActiveLayers(); }
        document.getElementById('bibleMap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        map.flyTo([p.lat, p.lng], 11, { duration: 0.9 });
        setTimeout(() => placeMarkers[id]?.openPopup(), 500);
    }

    function applyPassage(cfg) {
        activeLayers = new Set(cfg.layers);
        syncChipUI();
        applyActiveLayers();
        map.setView(cfg.center, cfg.zoom);
        showBanner(cfg.title);
        if (cfg.focusPlace) {
            setTimeout(() => placeMarkers[cfg.focusPlace]?.openPopup(), 450);
        }
    }

    /* ════════════════════════ RENDER ═══════════════════════════════ */
    function renderPlaceList() {
        const wrap = document.getElementById('mapsPlaceList');
        if (!wrap) return;
        wrap.innerHTML = D.PLACES.filter(p => p.category === 'principal').map(p => {
            const downloaded = offlineDownloaded.has(p.id);
            return `
            <div class="maps-place-card">
                <div class="maps-place-info" onclick="MapsApp.flyToPlace('${p.id}')">
                    <div class="maps-place-name"><i class="ph-fill ph-map-pin"></i> ${p.name}</div>
                    <div class="maps-place-blurb">${p.blurb}</div>
                </div>
                <button class="maps-offline-btn ${downloaded ? 'downloaded' : ''}" onclick="MapsApp.downloadPlace('${p.id}', this)">
                    <i class="ph ${downloaded ? 'ph-check-circle' : 'ph-download-simple'}"></i> ${downloaded ? 'Disponível offline' : 'Baixar offline'}
                </button>
            </div>`;
        }).join('');
    }

    function renderDashboard() {
        if (map) { try { map.remove(); } catch (_) { } map = null; }
        const content = document.getElementById('content');
        content.innerHTML = `
        <div class="fade-in maps-view">
            <button class="quiz-back-btn" onclick="switchView('home')"><i class="ph ph-arrow-left"></i> Voltar</button>
            <h1 class="bible-heading">Mapas Bíblicos</h1>
            <div class="ornament">✦ ✦ ✦</div>
            <p class="maps-intro">Explore os lugares da Bíblia num mapa do OpenStreetMap com suporte offline. Toque numa camada para mostrar ou esconder.</p>

            <div id="mapsBanner" class="maps-banner d-none"></div>

            <div class="maps-layer-chips" id="mapsLayerChips">
                <button class="maps-chip active" data-layer="places"><i class="ph ph-map-pin"></i> Lugares</button>
                <button class="maps-chip" data-layer="journey1"><i class="ph ph-compass"></i> 1ª Viagem de Paulo</button>
                <button class="maps-chip" data-layer="journey2"><i class="ph ph-compass"></i> 2ª Viagem de Paulo</button>
                <button class="maps-chip" data-layer="journey3"><i class="ph ph-compass"></i> 3ª Viagem de Paulo</button>
                <button class="maps-chip" data-layer="journeyToRome"><i class="ph ph-anchor"></i> Viagem a Roma</button>
                <button class="maps-chip" data-layer="exodus"><i class="ph ph-footprints"></i> Rota do Êxodo</button>
                <button class="maps-chip" data-layer="tribes"><i class="ph ph-flag-banner-fold"></i> Tribos de Israel</button>
                <button class="maps-chip" data-layer="jesus"><i class="ph ph-cross"></i> Ministério de Jesus</button>
            </div>

            <div id="bibleMap" class="bible-map"></div>
            <div class="maps-legend" id="mapsLegend"></div>
            <div class="maps-attrib">Mapas © colaboradores do <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>. Toque em "Baixar offline" para usar sem internet.</div>

            <h2 class="maps-subheading">Lugares principais</h2>
            <div class="maps-place-list" id="mapsPlaceList"></div>
        </div>`;

        activeLayers = new Set(['places']);
        wireChips();
        renderPlaceList();
        setTimeout(initMap, 30);
    }

    function initMap() {
        const el = document.getElementById('bibleMap');
        if (!el || typeof L === 'undefined') return;
        map = L.map('bibleMap', { scrollWheelZoom: false, worldCopyJump: true }).setView([32.0, 33.0], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
        }).addTo(map);

        buildLayerGroups();
        applyActiveLayers();
        setTimeout(() => map?.invalidateSize(), 150);

        if (pendingPassage) {
            applyPassage(pendingPassage);
            pendingPassage = null;
        }
    }

    /* ════════════════════════ API PÚBLICA ══════════════════════════ */
    window.openMapsDashboard = renderDashboard;

    window.MapsApp = {
        flyToPlace,
        downloadPlace(id, btnEl) {
            const p = placeById(id);
            if (p) downloadAreaOffline(p, btnEl);
        },
        /**
         * Chamado a partir do leitor bíblico (ex.: botão "Ver no mapa" em Atos 16).
         * Muda para a aba de mapas e centraliza/realça o contexto geográfico da passagem.
         */
        showPassage(bookId, chapter, refLabel) {
            const cfg = window.getMapContextForPassage?.(bookId, chapter);
            if (!cfg) return false;
            pendingPassage = Object.assign({}, cfg, { title: refLabel ? `${refLabel} — ${cfg.title}` : cfg.title });
            window.switchView('maps');
            return true;
        },
    };

})();
