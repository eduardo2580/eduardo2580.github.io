// Prevent right-click context menu
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Prevent image dragging and new window opening
        document.querySelectorAll('img').forEach(img => {
            img.oncontextmenu = e => e.preventDefault();
            img.ondragstart = e => e.preventDefault();
            img.setAttribute('draggable', false);
        });
        
        // Prevent text selection and copying
        document.addEventListener('copy', e => {
            e.clipboardData.setData('text/plain', 'Copying is disabled');
            e.preventDefault();
        });
        
        document.addEventListener('cut', e => {
            e.preventDefault();
        });
        
        document.addEventListener('paste', e => {
            e.preventDefault();
        });
        
        // Disable keyboard shortcuts (Ctrl+C, Ctrl+V, etc.)
        document.addEventListener('keydown', e => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                return false;
            }
        });
        
        // Disable printing
        window.addEventListener('beforeprint', (e) => {
            e.preventDefault();
            window.close();
        });
        
        // Prevent frame embedding
        if (window.top !== window.self) {
            window.top.location = window.self.location;
        }
        
        // Add CSS to disable text selection
        const antiCopyStyle = document.createElement('style');
        antiCopyStyle.textContent = `
            * {
                user-select: none !important;
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
            }
        `;
        document.head.appendChild(antiCopyStyle);