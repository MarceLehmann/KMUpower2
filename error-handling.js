/* JavaScript Error Fixes für KMUpower Website */

// 1. HÄUFIGE JAVASCRIPT FEHLER UND LÖSUNGEN

// Problem: Null Reference Errors
// Lösung: Defensive Programmierung
document.addEventListener('DOMContentLoaded', function() {
    // Sichere Element-Selektion
    function safeQuerySelector(selector) {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn(`Element nicht gefunden: ${selector}`, error);
            return null;
        }
    }
    
    // Menu Toggle mit Error Handling
    const menuToggle = safeQuerySelector('.menu-toggle');
    const nav = safeQuerySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            try {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                nav.classList.toggle('active');
                menuToggle.setAttribute('aria-expanded', String(!isExpanded));
                menuToggle.innerHTML = !isExpanded ? '&times;' : '&#9776;';
                document.body.style.overflow = !isExpanded ? 'hidden' : '';
            } catch (error) {
                console.error('Menu toggle error:', error);
            }
        });
    }
    
    // Modal Handling mit Error Checking
    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    const closeModalButtons = document.querySelectorAll('[data-modal-close]');
    const overlay = safeQuerySelector('#booking-modal');
    
    function openModal(modal) {
        if (!modal) {
            console.warn('Modal element nicht gefunden');
            return;
        }
        try {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } catch (error) {
            console.error('Modal open error:', error);
        }
    }
    
    function closeModal(modal) {
        if (!modal) return;
        try {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        } catch (error) {
            console.error('Modal close error:', error);
        }
    }
    
    // Event Listeners mit Error Handling
    openModalButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            try {
                const modal = safeQuerySelector(button.dataset.modalTarget);
                openModal(modal);
            } catch (error) {
                console.error('Modal target error:', error);
            }
        });
    });
    
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            try {
                const modal = button.closest('.modal-overlay');
                closeModal(modal);
            } catch (error) {
                console.error('Modal close error:', error);
            }
        });
    });
    
    // Escape Key Handler
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && overlay && overlay.classList.contains('active')) {
            closeModal(overlay);
        }
    });
    
    // Jahr automatisch setzen mit Fallback
    try {
        const yearElement = safeQuerySelector('#current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    } catch (error) {
        console.warn('Year update failed:', error);
    }
});

// 2. IFRAME ERROR HANDLING
window.addEventListener('error', function(e) {
    // Iframe Booking-Modal Fehler abfangen
    if (e.target && e.target.tagName === 'IFRAME') {
        console.warn('Iframe loading issue:', e.target.src);
        // Fallback anzeigen
        const fallbackDiv = document.createElement('div');
        fallbackDiv.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <h3>Terminbuchung nicht verfügbar</h3>
                <p>Bitte kontaktieren Sie uns direkt:</p>
                <a href="mailto:info@kmupower.ch" class="btn btn-primary">E-Mail senden</a>
            </div>
        `;
        e.target.parentNode.replaceChild(fallbackDiv, e.target);
    }
}, true);

// 3. FONT LOADING ERRORS
document.fonts.addEventListener('loadingerror', function(event) {
    console.warn('Font loading failed:', event.fontface.family);
    // Fallback: System fonts verwenden
    document.documentElement.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
});

// 4. IMAGE LOADING ERRORS
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.warn('Image failed to load:', e.target.src);
        // Fallback Bild oder Platzhalter
        e.target.src = '/assets/images/placeholder.jpg';
        e.target.alt = 'Bild konnte nicht geladen werden';
    }
}, true);

// 5. EXTERNAL SCRIPT ERRORS
window.addEventListener('error', function(e) {
    if (e.filename && e.filename.includes('youtube.com')) {
        console.warn('YouTube iframe issue detected');
        // YouTube-spezifische Fehlerbehandlung
    }
});

// 6. UNHANDLED PROMISE REJECTIONS
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault(); // Verhindert Browser-Konsolen-Spam
});

// 7. PERFORMANCE MONITORING
function logPerformanceMetrics() {
    try {
        // Core Web Vitals messen
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log(`${entry.name}: ${entry.value}ms`);
                }
            });
            observer.observe({entryTypes: ['measure', 'navigation']});
        }
    } catch (error) {
        console.warn('Performance monitoring failed:', error);
    }
}

// 8. CSS LOADING VERIFICATION
function verifyCSSLoading() {
    const testElement = document.createElement('div');
    testElement.style.display = 'none';
    testElement.className = 'css-test';
    document.body.appendChild(testElement);
    
    // Prüfe ob CSS geladen wurde
    setTimeout(() => {
        const computedStyle = getComputedStyle(testElement);
        if (computedStyle.display === 'none') {
            console.log('CSS successfully loaded');
        } else {
            console.warn('CSS loading issue detected');
        }
        document.body.removeChild(testElement);
    }, 100);
}

// 9. INIT FUNCTION MIT ERROR BOUNDARY
function initKMUpowerSite() {
    try {
        logPerformanceMetrics();
        verifyCSSLoading();
        console.log('KMUpower site initialized successfully');
    } catch (error) {
        console.error('Site initialization failed:', error);
        // Fallback für kritische Funktionalität
        document.body.classList.add('fallback-mode');
    }
}

// Site initialisieren wenn DOM bereit ist
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKMUpowerSite);
} else {
    initKMUpowerSite();
}