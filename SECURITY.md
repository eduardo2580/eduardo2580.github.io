# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | ✅        |

---

## Scope

This policy covers the Eduardo.AI interactive portfolio, including:

- Client-side JavaScript (`js/`)
- Service Worker (`sw.js`)
- IndexedDB data handling (`js/db.js`)
- Web Speech API integration (`js/voice.js`)
- WebLLM / WebGPU model loading (`js/chat.js`)
- PWA manifest and caching behaviour

**Out of scope:** third-party CDNs (WebLLM, Google Fonts, jsDelivr), the WebGPU/WASM runtime, or Phi-3.5-mini model weights.

---

## Reporting a Vulnerability

If you discover a security issue, **do not open a public GitHub issue**. Instead:

1. **Email:** [eduardo.kvsw3@aleeas.com](mailto:eduardo.kvsw3@aleeas.com)
   Subject line: `[SECURITY] Brief description`

2. **Include in your report:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (optional)

---

## What to Look For

Given the nature of this project (a fully client-side PWA), relevant security concerns include:

- **XSS vulnerabilities** in message rendering (`renderMsgContent()` in `js/chat.js`)
- **Malicious cached content** injected via the IndexedDB learned-answers store
- **Service Worker cache poisoning** that could serve tampered files
- **Voice/microphone permission bypass** or unexpected data exposure via Web Speech API
- **WebLLM prompt injection** through user input affecting the system prompt

---

*Eduardo Souza Rodrigues — [eduardo2580.github.io](https://eduardo2580.github.io)*
