/**
 * aide.js - Module de gestion de l'onglet Aide
 * Gère les FAQ, raccourcis clavier, liens externes et informations
 */

// Configuration
const CONFIG = {
    developer: "Safidy Mahefa",
    version: "1.0.0 Beta",
    lastUpdate: "11 Décembre 2025",
    github: "https://github.com/Safidy-Mahefa",
    email: "safidymahefa03@gmail.com",
    bugReport: "https://github.com/Safidy-Mahefa/audio-visualizer/issues"
};

// État des raccourcis clavier
let keyboardShortcutsEnabled = false;

/**
 * Initialise le module d'aide
 */
export function initAide() {
    initFAQ();
    initAboutLinks();
    initSupportButtons();
    updateAboutInfo();
    setupKeyboardShortcuts();
    
    console.log('✅ Module Aide initialisé');
}

/**
 * Initialise le système de FAQ (accordéon)
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const summary = item.querySelector('summary');
        
        summary.addEventListener('click', (e) => {
            // Fermer les autres FAQ ouvertes (optionnel)
            // faqItems.forEach(otherItem => {
            //     if (otherItem !== item && otherItem.hasAttribute('open')) {
            //         otherItem.removeAttribute('open');
            //     }
            // });
            
            // Animation smooth
            setTimeout(() => {
                if (item.hasAttribute('open')) {
                    item.style.animation = 'fadeIn 0.3s ease-out';
                }
            }, 10);
        });
    });
}

/**
 * Initialise les liens de la section "À propos"
 */
function initAboutLinks() {
    const links = {
        website: document.querySelector('.about-link[href="#"]:nth-child(1)'),
        github: document.querySelector('.about-link[href="#"]:nth-child(2)'),
        bug: document.querySelector('.about-link[href="#"]:nth-child(3)'),
        donate: document.querySelector('.about-link[href="#"]:nth-child(4)')
    };

    // Site web - Non disponible
    if (links.website) {
        links.website.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Site web non disponible', 'Le site web est en cours de développement.', 'info');
        });
    }

    // GitHub
    if (links.github) {
        links.github.href = CONFIG.github;
        links.github.target = '_blank';
        links.github.rel = 'noopener noreferrer';
    }

    // Signaler un bug
    if (links.bug) {
        links.bug.addEventListener('click', (e) => {
            e.preventDefault();
            const subject = encodeURIComponent('Bug Report - Audio Visualizer Pro');
            const body = encodeURIComponent(
                `Bonjour,\n\n` +
                `J'ai rencontré un problème avec Audio Visualizer Pro.\n\n` +
                `Version: ${CONFIG.version}\n` +
                `Navigateur: ${navigator.userAgent}\n\n` +
                `Description du problème:\n` +
                `[Décrivez le problème ici]\n\n` +
                `Étapes pour reproduire:\n` +
                `1. \n` +
                `2. \n` +
                `3. \n\n` +
                `Comportement attendu:\n` +
                `[Décrivez ce qui devrait se passer]\n\n` +
                `Comportement actuel:\n` +
                `[Décrivez ce qui se passe réellement]\n`
            );
            window.open(`mailto:${CONFIG.email}?subject=${subject}&body=${body}`, '_blank');
        });
    }

    // Don - Non disponible
    if (links.donate) {
        links.donate.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Dons non disponibles', 'Merci pour votre soutien! Les dons ne sont pas encore configurés.', 'info');
        });
    }
}

/**
 * Initialise les boutons de support
 */
function initSupportButtons() {
    // Bouton "Contacter le support"
    const contactBtn = document.querySelector('.sidebar-section:last-child .upload-btn:not(.secondary)');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            const subject = encodeURIComponent('Support - Audio Visualizer Pro');
            const body = encodeURIComponent(
                `Bonjour,\n\n` +
                `J'ai besoin d'aide concernant Audio Visualizer Pro.\n\n` +
                `Version: ${CONFIG.version}\n` +
                `Navigateur: ${navigator.userAgent}\n\n` +
                `Ma question:\n` +
                `[Décrivez votre question ici]\n`
            );
            window.open(`mailto:${CONFIG.email}?subject=${subject}&body=${body}`, '_blank');
        });
    }

    // Bouton "Documentation complète"
    const docBtn = document.querySelector('.sidebar-section:last-child .upload-btn.secondary');
    if (docBtn) {
        docBtn.addEventListener('click', () => {
            showNotification(
                'Documentation non disponible',
                'La documentation complète est en cours de rédaction. Consultez la section Aide pour les informations essentielles.',
                'info'
            );
        });
    }
}

/**
 * Met à jour les informations de la section "À propos"
 */
function updateAboutInfo() {
    const aboutItems = document.querySelectorAll('.about-item');
    
    if (aboutItems[0]) {
        aboutItems[0].querySelector('span').textContent = CONFIG.version;
    }
    if (aboutItems[1]) {
        aboutItems[1].querySelector('span').textContent = CONFIG.lastUpdate;
    }
    if (aboutItems[2]) {
        aboutItems[2].querySelector('span').textContent = CONFIG.developer;
    }
}

/**
 * Configure les raccourcis clavier (DÉSACTIVÉS PAR DÉFAUT)
 * Note: Les raccourcis sont en cours de production
 */
function setupKeyboardShortcuts() {
    // Les raccourcis sont désactivés car la fonctionnalité est en production
    // Pour activer: keyboardShortcutsEnabled = true;
    
    if (!keyboardShortcutsEnabled) {
        // Ajouter un listener pour afficher une notification si l'utilisateur essaie d'utiliser les raccourcis
        document.addEventListener('keydown', handleDisabledShortcuts);
        return;
    }

    // Code des raccourcis (actuellement désactivé)
    document.addEventListener('keydown', (e) => {
        // Ignorer si l'utilisateur tape dans un input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        const key = e.key.toLowerCase();
        const audio = document.getElementById('audio');
        const playBtn = document.getElementById('play');

        switch(key) {
            case ' ': // Espace - Play/Pause
                e.preventDefault();
                if (playBtn) playBtn.click();
                break;
            
            case 'arrowright': // Flèche droite - Piste suivante
                e.preventDefault();
                document.querySelector('.nextBtn')?.click();
                break;
            
            case 'arrowleft': // Flèche gauche - Piste précédente
                e.preventDefault();
                document.querySelector('.prevBtn')?.click();
                break;
            
            case 'arrowup': // Flèche haut - Volume +
                e.preventDefault();
                const volumeSlider = document.getElementById('volume');
                if (volumeSlider) {
                    volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 5);
                    volumeSlider.dispatchEvent(new Event('input'));
                }
                break;
            
            case 'arrowdown': // Flèche bas - Volume -
                e.preventDefault();
                const volumeSlider2 = document.getElementById('volume');
                if (volumeSlider2) {
                    volumeSlider2.value = Math.max(0, parseInt(volumeSlider2.value) - 5);
                    volumeSlider2.dispatchEvent(new Event('input'));
                }
                break;
            
            case 'f': // F - Plein écran
                e.preventDefault();
                toggleFullscreen();
                break;
            
            case 'm': // M - Muet
                e.preventDefault();
                if (audio) {
                    audio.muted = !audio.muted;
                    showNotification('Son', audio.muted ? 'Muet activé' : 'Muet désactivé', 'info');
                }
                break;
            
            case 'r': // R - Répéter
                e.preventDefault();
                document.querySelector('.repeatButton')?.click();
                break;
            
            case 's': // S - Aléatoire
                e.preventDefault();
                document.querySelector('.shuffleButton')?.click();
                break;
        }
    });
}

/**
 * Gère les raccourcis clavier désactivés
 */
function handleDisabledShortcuts(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    const key = e.key.toLowerCase();
    const shortcutKeys = [' ', 'arrowright', 'arrowleft', 'arrowup', 'arrowdown', 'f', 'm', 'r', 's'];
    
    if (shortcutKeys.includes(key) && !e.ctrlKey && !e.metaKey) {
        // Ne pas afficher la notification pour l'espace si un élément est focus
        if (key === ' ' && document.activeElement.tagName === 'BUTTON') {
            return;
        }
        
        // Afficher la notification seulement occasionnellement pour ne pas être intrusif
        if (Math.random() < 0.3) {
            showNotification(
                'Raccourcis clavier',
                'Les raccourcis clavier sont en cours de production et seront disponibles prochainement.',
                'info'
            );
        }
    }
}

/**
 * Bascule le mode plein écran
 */
function toggleFullscreen() {
    const canvasContainer = document.getElementById('canvaContainer');
    
    if (!document.fullscreenElement) {
        if (canvasContainer.requestFullscreen) {
            canvasContainer.requestFullscreen();
            showNotification('Plein écran', 'Mode plein écran activé. Appuyez sur Échap pour quitter.', 'success');
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            showNotification('Plein écran', 'Mode plein écran désactivé', 'info');
        }
    }
}

/**
 * Affiche une notification à l'utilisateur
 */
function showNotification(title, message, type = 'info') {
    // Vérifier si un système de notification existe déjà
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(notificationContainer);
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        background: ${type === 'success' ? '#00b894' : type === 'info' ? '#0984e3' : '#fdcb6e'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        min-width: 300px;
        max-width: 400px;
        pointer-events: auto;
        animation: slideIn 0.3s ease-out;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: start; gap: 12px;">
            <i class="fa-solid fa-${type === 'success' ? 'check-circle' : type === 'info' ? 'info-circle' : 'exclamation-circle'}" style="font-size: 20px; margin-top: 2px;"></i>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
                <div style="font-size: 13px; opacity: 0.95;">${message}</div>
            </div>
        </div>
    `;

    notificationContainer.appendChild(notification);

    // Auto-remove après 4 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
            if (notificationContainer.children.length === 0) {
                notificationContainer.remove();
            }
        }, 300);
    }, 4000);
}

// Ajouter les animations CSS si elles n'existent pas
if (!document.querySelector('#aide-animations')) {
    const style = document.createElement('style');
    style.id = 'aide-animations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .faq-item[open] {
            animation: fadeIn 0.3s ease-out;
        }

        .faq-item summary {
            cursor: pointer;
            user-select: none;
            transition: color 0.2s;
        }

        .faq-item summary:hover {
            color: #00b894;
        }

        .about-link {
            transition: all 0.2s;
        }

        .about-link:hover {
            transform: translateX(5px);
            color: #00b894;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Fonction publique pour activer les raccourcis clavier
 * (À utiliser quand la fonctionnalité sera prête)
 */
export function enableKeyboardShortcuts() {
    keyboardShortcutsEnabled = true;
    document.removeEventListener('keydown', handleDisabledShortcuts);
    setupKeyboardShortcuts();
    showNotification('Raccourcis clavier', 'Les raccourcis clavier sont maintenant activés!', 'success');
}

/**
 * Exporte les informations de configuration
 */
export function getConfig() {
    return CONFIG;
}