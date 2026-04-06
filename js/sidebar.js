/**
 * sidebar.js — Standalone sidebar / navigation menu controller
 *
 * Behaviour summary
 * ─────────────────
 * Desktop (≥ 769 px)
 *   • Sidebar is always visible, inline beside #main.
 *   • Toggle button collapses / expands it with a smooth slide.
 *   • State is persisted to localStorage so the preference survives
 *     page reloads.
 *   • No backdrop / blockout at any size.
 *
 * Mobile / small screen (≤ 768 px)  — Apple-style overlay
 *   • Sidebar slides in from the left as a full-height overlay.
 *   • No backdrop / blockout — page content stays fully visible.
 *   • Tap anywhere outside the sidebar → closes.
 *   • Swipe-left anywhere on the sidebar → closes.
 *   • Swipe-right from the left edge of the screen → opens.
 *   • Escape key → closes.
 *   • Focus is trapped inside while open (accessibility).
 *   • Any book/chapter button click inside the sidebar closes it.
 *
 * No external dependencies.  Works alongside script.js / daily.js.
 */

(function SidebarController() {
    'use strict';

    /* ── constants ───────────────────────────────────────────── */
    const MOBILE_BP        = 768;          // px — matches CSS breakpoint
    const EDGE_SWIPE_ZONE  = 28;           // px from left edge to trigger open swipe
    const SWIPE_THRESHOLD  = 55;           // px horizontal travel to commit a swipe
    const STORAGE_KEY      = 'bible_sidebar_open';
    const TRANSITION_MS    = 320;

    /* ── element refs ────────────────────────────────────────── */
    const sidebar   = document.getElementById('sidebar');
    const backdrop  = document.getElementById('backdrop');
    const toggleBtn = document.getElementById('toggleSidebar');
    const main      = document.getElementById('main');

    if (!sidebar || !toggleBtn) return; // guard

    /* ── state ───────────────────────────────────────────────── */
    let isOpen        = false;
    let isMobile      = window.innerWidth <= MOBILE_BP;
    let touchStartX   = 0;
    let touchStartY   = 0;
    let touchDeltaX   = 0;
    let isSwiping     = false;
    let swipeDir      = null; // 'open' | 'close'
    let focusableEls  = [];
    let lastFocused   = null;

    /* ══════════════════════════════════════════════════════════
     * OPEN / CLOSE
     * ══════════════════════════════════════════════════════════ */
    function open(animate = true) {
        if (isOpen) return;
        isOpen = true;

        sidebar.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
        updateAria();

        if (isMobile) {
            trapFocus();
        } else {
            applyDesktopLayout(true, animate);
            localStorage.setItem(STORAGE_KEY, '1');
        }

        setToggleIcon(true);
    }

    function close(animate = true) {
        if (!isOpen) return;
        isOpen = false;

        sidebar.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        updateAria();

        if (isMobile) {
            releaseFocus();
        } else {
            applyDesktopLayout(false, animate);
            localStorage.setItem(STORAGE_KEY, '0');
        }

        setToggleIcon(false);
    }

    function updateAria() {
        const closeLabel = window.t?.('closeMenu') || 'Fechar menu';
        const openLabel = window.t?.('openMenu') || 'Abrir menu';
        toggleBtn.setAttribute('aria-label', isOpen ? closeLabel : openLabel);
    }

    function toggle() {
        isOpen ? close() : open();
    }

    /* ══════════════════════════════════════════════════════════
     * DESKTOP LAYOUT — sidebar pushes content
     * ══════════════════════════════════════════════════════════ */
    function applyDesktopLayout(show, animate) {
        const sidebarW = getSidebarWidth();

        if (!animate) {
            sidebar.style.transition = 'none';
            if (main) main.style.transition = 'none';
        }

        if (show) {
            sidebar.style.transform = 'translateX(0)';
            sidebar.style.width     = sidebarW + 'px';
        } else {
            sidebar.style.transform = `translateX(-${sidebarW}px)`;
        }

        if (!animate) {
            // Re-enable transitions on next frame
            requestAnimationFrame(() => {
                sidebar.style.transition = '';
                if (main) main.style.transition = '';
            });
        }
    }

    function getSidebarWidth() {
        return parseInt(
            getComputedStyle(document.documentElement)
                .getPropertyValue('--sidebar-w') || '280',
            10
        );
    }

    /* ══════════════════════════════════════════════════════════
     * FOCUS TRAP (accessibility — mobile overlay)
     * ══════════════════════════════════════════════════════════ */
    function trapFocus() {
        lastFocused = document.activeElement;
        focusableEls = Array.from(
            sidebar.querySelectorAll(
                'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'
            )
        ).filter(el => !el.closest('[hidden]'));

        if (focusableEls.length) focusableEls[0].focus();
        document.addEventListener('keydown', handleFocusTrap);
    }

    function releaseFocus() {
        document.removeEventListener('keydown', handleFocusTrap);
        if (lastFocused) lastFocused.focus();
    }

    function handleFocusTrap(e) {
        if (!isOpen || !isMobile) return;
        if (e.key === 'Escape') { close(); return; }
        if (e.key !== 'Tab') return;

        focusableEls = Array.from(
            sidebar.querySelectorAll(
                'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'
            )
        ).filter(el => !el.closest('[hidden]'));

        if (!focusableEls.length) { e.preventDefault(); return; }

        const first = focusableEls[0];
        const last  = focusableEls[focusableEls.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    /* ══════════════════════════════════════════════════════════
     * TOGGLE BUTTON ICON
     * ══════════════════════════════════════════════════════════ */
    function setToggleIcon(opened) {
        const icon = toggleBtn.querySelector('i');
        if (!icon) return;
        if (opened && isMobile) {
            icon.className = 'bi bi-x-lg';
        } else {
            icon.className = 'bi bi-list';
        }
    }

    /* ══════════════════════════════════════════════════════════
     * SWIPE GESTURES (mobile)
     * ══════════════════════════════════════════════════════════ */
    function onTouchStart(e) {
        if (!isMobile) return;
        touchStartX  = e.touches[0].clientX;
        touchStartY  = e.touches[0].clientY;
        touchDeltaX  = 0;
        isSwiping    = false;
        swipeDir     = null;

        // Only start "open" swipe from left edge
        if (!isOpen && touchStartX > EDGE_SWIPE_ZONE) return;
        isSwiping = true;
    }

    function onTouchMove(e) {
        if (!isMobile || !isSwiping) return;

        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;

        // Abort if primarily vertical
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dx) < 10) {
            isSwiping = false;
            return;
        }

        touchDeltaX = dx;
        swipeDir    = dx > 0 ? 'open' : 'close';

        // Live drag feedback
        if (isOpen && swipeDir === 'close') {
            const sidebarW = getSidebarWidth();
            const drag     = Math.max(0, Math.min(sidebarW, -dx));
            sidebar.style.transition = 'none';
            sidebar.style.transform  = `translateX(-${drag}px)`;
            e.preventDefault();
        } else if (!isOpen && swipeDir === 'open') {
            const sidebarW = getSidebarWidth();
            const drag     = Math.max(0, Math.min(sidebarW, dx));
            sidebar.style.transition = 'none';
            sidebar.style.transform  = `translateX(calc(-${sidebarW}px + ${drag}px))`;
            e.preventDefault();
        }
    }

    function onTouchEnd() {
        if (!isMobile || !isSwiping) return;
        isSwiping = false;

        // Re-enable CSS transitions
        sidebar.style.transition = '';

        if (swipeDir === 'close' && touchDeltaX < -SWIPE_THRESHOLD) {
            close();
        } else if (swipeDir === 'open' && touchDeltaX > SWIPE_THRESHOLD) {
            open();
        } else {
            // Snap back
            if (isOpen) sidebar.classList.add('open');
            else        sidebar.classList.remove('open');
            sidebar.style.transform = '';
        }
    }

    /* ══════════════════════════════════════════════════════════
     * OUTSIDE TAP TO CLOSE (mobile — replaces backdrop click)
     * Tap anywhere outside #sidebar while it's open → close.
     * ══════════════════════════════════════════════════════════ */
    document.addEventListener('pointerdown', e => {
        if (!isMobile || !isOpen) return;
        if (!sidebar.contains(e.target) && e.target !== toggleBtn) {
            close();
        }
    }, { passive: true });
    sidebar.addEventListener('click', e => {
        if (!isMobile) return;
        const target = e.target.closest('button, a');
        if (target && target !== toggleBtn) {
            // Small delay so the click action fires first
            setTimeout(close, 80);
        }
    });

    /* ══════════════════════════════════════════════════════════
     * RESIZE — swap between mobile and desktop modes
     * ══════════════════════════════════════════════════════════ */
    let resizeTimer;
    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const wasMobile = isMobile;
            isMobile = window.innerWidth <= MOBILE_BP;

            if (wasMobile === isMobile) return;

            // Crossed breakpoint — reset inline styles set during swipe/drag
            sidebar.style.transform  = '';
            sidebar.style.transition = '';

            if (isMobile) {
                releaseFocus();
                if (isOpen) sidebar.classList.add('open');
                else        sidebar.classList.remove('open');
            } else {
                releaseFocus();
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored === '0') {
                    isOpen = true;   // trick close() into running
                    close(false);
                } else {
                    isOpen = false;  // trick open() into running
                    open(false);
                }
            }

            setToggleIcon(isOpen);
        }, 100);
    }

    /* ══════════════════════════════════════════════════════════
     * INITIAL STATE
     * ══════════════════════════════════════════════════════════ */
    function init() {
        // ARIA
        toggleBtn.setAttribute('aria-controls', 'sidebar');
        toggleBtn.setAttribute('aria-expanded', 'false');
        updateAria();
        sidebar.setAttribute('aria-label', 'Menu de navegação');
        sidebar.setAttribute('role', 'navigation');

        if (isMobile) {
            // Mobile: always start closed
            isOpen = false;
            sidebar.classList.remove('open');
        } else {
            // Desktop: restore from localStorage (default open)
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored === '0') {
                isOpen = false;
                applyDesktopLayout(false, false);
                setToggleIcon(false);
                toggleBtn.setAttribute('aria-expanded', 'false');
            } else {
                isOpen = true;
                applyDesktopLayout(true, false);
                setToggleIcon(false); // hamburger icon on desktop
                toggleBtn.setAttribute('aria-expanded', 'true');
            }
        }

        /* ── event listeners ──────────────────────────────── */
        toggleBtn.addEventListener('click', toggle);

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && isOpen) close();
        });

        // Touch gestures
        document.addEventListener('touchstart', onTouchStart, { passive: true });
        document.addEventListener('touchmove',  onTouchMove,  { passive: false });
        document.addEventListener('touchend',   onTouchEnd,   { passive: true });

        window.addEventListener('resize', onResize);
    }

    /* ── expose a minimal public API (optional) ─────────────── */
    window.SidebarMenu = { open, close, toggle, updateAria };

    /* ── wait for DOM ────────────────────────────────────────── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();