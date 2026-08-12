/* ============================================================
   Bíblia Sagrada — Privacy & Data Manager
   ------------------------------------------------------------
   Everything this app stores, lives on this device:
     - localStorage  → preferences + reading-plan progress
     - IndexedDB     → an on-device cache of Bible text
                        (already bundled in js/bible-data*.js,
                        never fetched from a server)
   Nothing here ever leaves the device unless the user
   explicitly taps "Export" and chooses to share the file.
   ============================================================ */
(function () {
    'use strict';

    const APP_DB_NAME = 'BibleDB_local';
    const ENC_FORMAT = 'biblia-sagrada-encrypted-backup';
    const PBKDF2_ITERATIONS = 210000;

    /* ───────────────────── helpers ───────────────────── */

    function bufToB64(buf) {
        const bytes = new Uint8Array(buf);
        let bin = '';
        for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        return btoa(bin);
    }

    function b64ToBuf(b64) {
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return bytes.buffer;
    }

    function timestampSlug() {
        const d = new Date();
        const pad = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }

    function downloadFile(content, mime, filename) {
        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 400);
    }

    /* ───────────────────── data collection ───────────────────── */

    // Every key this app writes to localStorage lives under the origin's
    // own storage — there's no third-party or shared state here, so we
    // simply snapshot the whole thing.
    function collectLocalStorage() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data[key] = localStorage.getItem(key);
        }
        return data;
    }

    async function buildExportPayload() {
        return {
            app: 'Bíblia Sagrada',
            format: 'biblia-sagrada-backup',
            formatVersion: 1,
            exportedAt: new Date().toISOString(),
            localStorage: collectLocalStorage()
        };
    }

    /* ───────────────────── encryption (WebCrypto AES-GCM) ─────────────────────
       Used only when the user opts in while exporting. The cache of Bible
       text itself isn't secret, but reading-plan progress, notes on
       preferences, and a display name are personal — and once a backup file
       leaves the device (cloud drive, chat app, email) the device's own
       protections no longer apply, so encrypting the file at that moment is
       the place it actually matters. */

    async function deriveKey(passphrase, salt, usage) {
        const enc = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']
        );
        return crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            [usage]
        );
    }

    async function encryptString(plaintext, passphrase) {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(passphrase, salt, 'encrypt');
        const ciphertext = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv }, key, new TextEncoder().encode(plaintext)
        );
        return {
            format: ENC_FORMAT,
            version: 1,
            kdf: 'PBKDF2-SHA256',
            iterations: PBKDF2_ITERATIONS,
            salt: bufToB64(salt),
            iv: bufToB64(iv),
            ciphertext: bufToB64(ciphertext)
        };
    }

    async function decryptPayload(payload, passphrase) {
        const salt = b64ToBuf(payload.salt);
        const iv = b64ToBuf(payload.iv);
        const key = await deriveKey(passphrase, salt, 'decrypt');
        const plainBuf = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv }, key, b64ToBuf(payload.ciphertext)
        );
        return new TextDecoder().decode(plainBuf);
    }

    /* ───────────────────── public: export ───────────────────── */

    /**
     * @param {{ passphrase?: string }} options
     * @returns {Promise<{ encrypted: boolean }>}
     */
    async function exportData(options = {}) {
        const passphrase = (options.passphrase || '').trim();
        const payload = await buildExportPayload();
        const json = JSON.stringify(payload, null, 2);

        if (!passphrase) {
            downloadFile(json, 'application/json', `biblia-sagrada-backup-${timestampSlug()}.json`);
            return { encrypted: false };
        }

        const encPayload = await encryptString(json, passphrase);
        downloadFile(
            JSON.stringify(encPayload),
            'application/json',
            `biblia-sagrada-backup-${timestampSlug()}.enc.json`
        );
        return { encrypted: true };
    }

    /* ───────────────────── public: import ───────────────────── */

    class NeedsPassphraseError extends Error {
        constructor() { super('NEEDS_PASSPHRASE'); this.code = 'NEEDS_PASSPHRASE'; }
    }
    class InvalidBackupError extends Error {
        constructor() { super('INVALID_BACKUP'); this.code = 'INVALID_BACKUP'; }
    }
    class WrongPassphraseError extends Error {
        constructor() { super('WRONG_PASSPHRASE'); this.code = 'WRONG_PASSPHRASE'; }
    }

    /**
     * @param {string} fileText  Raw text content of the chosen file.
     * @param {string} [passphrase]
     * @returns {Promise<{ restoredKeys: number }>}
     */
    async function importData(fileText, passphrase) {
        let parsed;
        try {
            parsed = JSON.parse(fileText);
        } catch (_) {
            throw new InvalidBackupError();
        }

        let payload = parsed;

        if (parsed && parsed.format === ENC_FORMAT) {
            const pass = (passphrase || '').trim();
            if (!pass) throw new NeedsPassphraseError();
            let plaintext;
            try {
                plaintext = await decryptPayload(parsed, pass);
            } catch (_) {
                throw new WrongPassphraseError();
            }
            try {
                payload = JSON.parse(plaintext);
            } catch (_) {
                throw new WrongPassphraseError();
            }
        }

        if (!payload || typeof payload.localStorage !== 'object' || !payload.localStorage) {
            throw new InvalidBackupError();
        }

        const entries = Object.entries(payload.localStorage);
        entries.forEach(([key, value]) => {
            try { localStorage.setItem(key, value); } catch (_) { /* ignore quota errors */ }
        });

        return { restoredKeys: entries.length };
    }

    /* ───────────────────── public: delete everything ───────────────────── */

    /**
     * Wipes every trace of the user's data on this device: all
     * localStorage entries (preferences + reading-plan progress) and the
     * IndexedDB Bible-text cache. Does not touch the offline app-shell
     * cache (that's just static app files re-derived from the install,
     * not personal data) so the app keeps working offline afterwards.
     */
    async function deleteEverything() {
        try { localStorage.clear(); } catch (_) { /* ignore */ }

        await new Promise((resolve) => {
            try {
                const req = indexedDB.deleteDatabase(APP_DB_NAME);
                req.onsuccess = () => resolve();
                req.onerror = () => resolve();
                req.onblocked = () => resolve();
            } catch (_) { resolve(); }
        });
    }

    window.PrivacyManager = {
        exportData,
        importData,
        deleteEverything,
        collectLocalStorage,
        NeedsPassphraseError,
        InvalidBackupError,
        WrongPassphraseError
    };
})();
