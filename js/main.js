// Copyright Protection Core
document.addEventListener('DOMContentLoaded', () => {
    // 1. Primary Protections
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('copy', e => {
        e.preventDefault();
        e.clipboardData.setData('text', `© ${new Date().getFullYear()} Eduardo Souza Rodrigues - Content Protected`);
    });
    
    // 2. Dynamic Watermark
    const watermark = document.createElement('div');
    watermark.innerHTML = `© ${new Date().getFullYear()} Eduardo Souza Rodrigues - Unauthorized Use Prohibited`;
    watermark.style = `position:fixed;bottom:10px;right:10px;opacity:0.2;
        transform:rotate(-15deg);z-index:99999;pointer-events:none;
        font-family:Arial,sans-serif;color:red;font-size:14px;`;
    document.body.appendChild(watermark);

    // 3. Keyboard Lockdown
    document.addEventListener('keydown', e => {
        if (e.key === 'PrintScreen' || e.ctrlKey && e.key === 's') {
            e.preventDefault();
            showWarning('Content protection active - Screenshots disabled');
        }
    });

    // 4. Content Guard
    new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'characterData') return;
            showWarning('DOM modification detected');
            mutation.target.remove();
        });
    }).observe(document.body, { childList: true, subtree: true });
});

function showWarning(message) {
    const warning = document.createElement('div');
    warning.textContent = message;
    warning.style = `position:fixed;top:20px;left:50%;transform:translateX(-50%);
        background:#e74c3c;color:white;padding:10px 20px;border-radius:5px;
        z-index:2147483647;box-shadow:0 2px 5px rgba(0,0,0,0.3);`;
    document.body.appendChild(warning);
    setTimeout(() => warning.remove(), 3000);
}
///

// Get the modal
const modal = document.getElementById('termsModal');

// When the page loads, show the modal immediately
document.addEventListener('DOMContentLoaded', function() {
    modal.style.display = 'block';
});

// When user clicks accept
function acceptTerms() {
    modal.style.display = 'none';
}

// When user clicks decline
function declineTerms() {
    alert('You must accept the terms to use this website.');
    modal.style.display = 'none';
    location.reload(); // Optional: reload the page to maintain blocked state
}

// Close modal when clicking outside (optional)
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}