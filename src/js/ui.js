    // Toggle sidebar sur mobile
    // (tout ton JS inchangé, sauf modification emoji vers icônes)
    const activityItems = document.querySelectorAll('.activity-item');
    const sidebar = document.querySelector('.sidebar');
    
    activityItems.forEach(item => {
        item.addEventListener('click', () => {
            activityItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
            }
        });
    });


    // Gestion des fichiers background img
    const bgInput = document.getElementById('bg');
    const bgList = document.getElementById('bgList');
    
    bgInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            bgList.innerHTML = '';
            Array.from(e.target.files).forEach((file, index) => {
                const item = document.createElement('div');
                item.className = `file-item ${index === 0 ? 'active' : ''}`;
                item.innerHTML = `
                    <span class="file-icon"><i class="fa-regular fa-image"></i></span>
                    <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${file.name}</span>
                    <span class="file-remove"><i class="fa-solid fa-xmark"></i></span>
                `;
                bgList.appendChild(item);
            });
        }
    });

    // Bouton play/pause
    const playBtn = document.getElementById('play');

    // Animation de la barre de progression (simulation)
    const progressFill = document.getElementById('progressFill');
    let progress = 0;

    // Mise à jour des valeurs de sliders
    document.getElementById('smooth').addEventListener('input', (e) => {
        document.getElementById('smoothValue').textContent = parseFloat(e.target.value).toFixed(2);
    });


    // Gestion des boutons de qualité
    document.querySelectorAll('.quality-selector').forEach(selector => {
        selector.querySelectorAll('.quality-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selector.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    });

    // Gestion du volume
    document.getElementById('volume').addEventListener('input', (e) => {
        const volumeIcon = document.querySelector('.volume-icon i');
        const value = parseInt(e.target.value);
        if (value === 0) volumeIcon.className = 'fa-solid fa-volume-xmark';
        else if (value < 50) volumeIcon.className = 'fa-solid fa-volume-low';
        else volumeIcon.className = 'fa-solid fa-volume-high';
    });

    // Ajuster le canvas au chargement
    window.addEventListener('load', () => {
        const canvas = document.getElementById('c');
        const container = document.getElementById('canvaContainer');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    });

    window.addEventListener('resize', () => {
        const canvas = document.getElementById('c');
        const container = document.getElementById('canvaContainer');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    });

    // Section parametres et aides
    // Gestion de la navigation entre les panels
document.addEventListener('DOMContentLoaded', () => {
    const activityItems = document.querySelectorAll('.activity-item');
    const panels = {
        'files': document.getElementById('panel-files'),
        'settings': document.getElementById('panel-settings'),
        'effects': document.getElementById('panel-effects'),
        'export': document.getElementById('panel-export'),
        'info': document.getElementById('panel-info')
    };

    // Fonction pour changer de panel
    function switchPanel(panelName) {
        // Ne rien faire si c'est un panel désactivé
        const activityItem = document.querySelector(`[data-panel="${panelName}"]`);
        if (activityItem && activityItem.classList.contains('export-disabled')) {
            return;
        }

        // Retirer la classe active de tous les activity items
        activityItems.forEach(item => item.classList.remove('active'));
        
        // Cacher tous les panels
        Object.values(panels).forEach(panel => {
            if (panel) panel.style.display = 'none';
        });

        // Activer le panel demandé
        const activeItem = document.querySelector(`[data-panel="${panelName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        if (panels[panelName]) {
            panels[panelName].style.display = 'block';
            panels[panelName].classList.add('active');
        }
    }

    // Ajouter les écouteurs d'événements
    activityItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const panelName = item.getAttribute('data-panel');
            if (!item.classList.contains('export-disabled')) {
                switchPanel(panelName);
            }
        });
    });

    // Afficher le panel files par défaut
    switchPanel('files');

    // === Gestion des paramètres ===
    
    // Thème
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            const theme = e.target.value;
            // Implémenter le changement de thème
            console.log('Thème changé:', theme);
        });
    }

    // Langue
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            // Implémenter le changement de langue
            console.log('Langue changée:', lang);
        });
    }

    // Qualité du rendu
    const renderQuality = document.getElementById('renderQuality');
    if (renderQuality) {
        renderQuality.addEventListener('change', (e) => {
            const quality = e.target.value;
            // Implémenter le changement de qualité
            console.log('Qualité du rendu:', quality);
        });
    }

    // FPS cible
    const targetFPS = document.getElementById('targetFPS');
    if (targetFPS) {
        targetFPS.addEventListener('change', (e) => {
            const fps = e.target.value;
            // Implémenter le changement de FPS
            console.log('FPS cible:', fps);
        });
    }

    // Mode économie d'énergie
    const powerSaving = document.getElementById('powerSaving');
    if (powerSaving) {
        powerSaving.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            // Implémenter le mode économie d'énergie
            console.log('Mode économie d\'énergie:', enabled);
        });
    }

    // Antialiasing
    const antialiasing = document.getElementById('antialiasing');
    if (antialiasing) {
        antialiasing.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            // Implémenter l'antialiasing
            console.log('Antialiasing:', enabled);
        });
    }

    // Égaliseur
    const equalizerPreset = document.getElementById('equalizerPreset');
    if (equalizerPreset) {
        equalizerPreset.addEventListener('change', (e) => {
            const preset = e.target.value;
            // Implémenter l'égaliseur
            console.log('Preset égaliseur:', preset);
        });
    }

    // Normalisation audio
    const audioNormalization = document.getElementById('audioNormalization');
    if (audioNormalization) {
        audioNormalization.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            // Implémenter la normalisation
            console.log('Normalisation audio:', enabled);
        });
    }

    // Crossfade
    const crossfade = document.getElementById('crossfade');
    if (crossfade) {
        crossfade.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            // Implémenter le crossfade
            console.log('Crossfade:', enabled);
        });
    }

    // Animations réduites
    const reducedMotion = document.getElementById('reducedMotion');
    if (reducedMotion) {
        reducedMotion.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            if (enabled) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        });
    }

    // Rapports d'erreur
    const errorReporting = document.getElementById('errorReporting');
    if (errorReporting) {
        errorReporting.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            localStorage.setItem('errorReporting', enabled);
        });
    }

    // Analytics
    const analytics = document.getElementById('analytics');
    if (analytics) {
        analytics.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            localStorage.setItem('analytics', enabled);
        });
    }

    // Vider le cache
    const clearCache = document.getElementById('clearCache');
    if (clearCache) {
        clearCache.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir vider le cache?')) {
                // Vider le cache
                localStorage.clear();
                console.log('Cache vidé');
                alert('Cache vidé avec succès!');
            }
        });
    }

    // Exporter les paramètres
    const exportSettings = document.getElementById('exportSettings');
    if (exportSettings) {
        exportSettings.addEventListener('click', () => {
            const settings = {
                theme: themeSelect?.value,
                language: languageSelect?.value,
                renderQuality: renderQuality?.value,
                targetFPS: targetFPS?.value,
                // Ajouter tous les autres paramètres
            };
            
            const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'audio-visualizer-settings.json';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    // Importer les paramètres
    const importSettings = document.getElementById('importSettings');
    if (importSettings) {
        importSettings.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const settings = JSON.parse(e.target.result);
                            // Appliquer les paramètres
                            if (themeSelect && settings.theme) themeSelect.value = settings.theme;
                            if (languageSelect && settings.language) languageSelect.value = settings.language;
                            // Appliquer tous les autres paramètres
                            alert('Paramètres importés avec succès!');
                        } catch (error) {
                            alert('Erreur lors de l\'importation des paramètres');
                        }
                    };
                    reader.readAsText(file);
                }
            });
            input.click();
        });
    }

    // Réinitialiser les paramètres
    const resetSettings = document.getElementById('resetSettings');
    if (resetSettings) {
        resetSettings.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres?')) {
                // Réinitialiser tous les paramètres
                localStorage.clear();
                location.reload();
            }
        });
    }

    // Simuler l'utilisation du stockage
    function updateStorageInfo() {
        const storageFill = document.getElementById('storageFill');
        const storageUsed = document.getElementById('storageUsed');
        
        if (storageFill && storageUsed) {
            // Calculer l'utilisation approximative
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length;
                }
            }
            
            const usedMB = (total / 1024 / 1024).toFixed(2);
            const percentage = Math.min((usedMB / 50) * 100, 100);
            
            storageFill.style.width = percentage + '%';
            storageUsed.textContent = usedMB + ' MB utilisés';
        }
    }

    // Mettre à jour les infos de stockage au chargement
    updateStorageInfo();

    // Détection de la sortie audio
    const audioOutput = document.getElementById('audioOutput');
    if (audioOutput && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                devices.forEach(device => {
                    if (device.kind === 'audiooutput') {
                        const option = document.createElement('option');
                        option.value = device.deviceId;
                        option.text = device.label || `Sortie ${audioOutput.options.length}`;
                        audioOutput.appendChild(option);
                    }
                });
            })
            .catch(err => console.error('Erreur lors de l\'énumération des périphériques:', err));
    }
});