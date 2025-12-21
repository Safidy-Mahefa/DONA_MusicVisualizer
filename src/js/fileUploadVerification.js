// fileUploadValidation.js
// ============================================
// CHARGEMENT DES SIGNATURES
// ============================================
let FILE_SIGNATURES = null;

async function loadSignatures() {
    try {
        const response = await fetch('./assets/signatures.json');
        FILE_SIGNATURES = await response.json();
        console.log('✅ Signatures de fichiers chargées');
    } catch (error) {
        console.error('❌ Erreur chargement signatures:', error);
    }
}

// Charger immédiatement
loadSignatures();

// ============================================
// FONCTIONS DE VÉRIFICATION
// ============================================

function arrayBufferToHex(buffer, length = 16) {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes.slice(0, length))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

export async function verifyFileSignature(file, expectedCategory = null) {
    if (!FILE_SIGNATURES) {
        throw new Error('Signatures non chargées');
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            const fileHex = arrayBufferToHex(arrayBuffer);
            
            const categoriesToCheck = expectedCategory 
                ? [expectedCategory] 
                : Object.keys(FILE_SIGNATURES);
            
            for (const category of categoriesToCheck) {
                if (!FILE_SIGNATURES[category]) continue;
                
                for (const [format, data] of Object.entries(FILE_SIGNATURES[category])) {
                    const offset = data.offset * 2;
                    
                    for (const signature of data.signatures) {
                        const fileSignature = fileHex.substring(offset, offset + signature.length)
                        if (fileSignature === signature) {
                            resolve({
                                valid: true,
                                category: category,
                                format: format,
                                mime: data.mime,
                                extension: data.extension,
                                detectedSignature: signature
                            });
                            return;
                        }
                    }
                }
            }
            
            resolve({
                valid: false,
                error: 'Format de fichier non reconnu',
                fileSignature: fileHex.substring(0, 20)
            });
        };
        
        reader.onerror = () => reject(new Error('Erreur lecture fichier'));
        reader.readAsArrayBuffer(file.slice(0, 16));
    });
}

export async function validateFile(file, expectedCategory) {
    try {
        const result = await verifyFileSignature(file, expectedCategory);
        if (!result.valid) {
            return {
                valid: false,
                message: `Format non reconnu ou invalide`,
                file: file
            };
        }
        
        if (result.category !== expectedCategory) {
            return {
                valid: false,
                message: `Type incorrect : ${result.category} détecté au lieu de ${expectedCategory}`,
                file: file,
                detected: result
            };
        }
        
        return {
            valid: true,
            message: `Fichier ${result.format.toUpperCase()} valide`,
            file: file,
            fileInfo: result
        };
    } catch (error) {
        return {
            valid: false,
            message: error.message,
            file: file
        };
    }
}

/**
 * Valide un tableau de fichiers
 * Retourne seulement les fichiers valides
 */
export async function validateFiles(files, expectedCategory) {
    const validFiles = [];
    const invalidFiles = [];
    
    for (const file of files) {
        const validation = await validateFile(file, expectedCategory);
        const videoValidation = await validateFile(file, "videos");

        if (validation.valid) {
            validFiles.push(file);
        }
        else if (expectedCategory == 'audio' && videoValidation.valid) {
            validFiles.push(file);
        }
        else {
            invalidFiles.push({
                file: file,
                reason: validation.message
            });
        }
    }
    
    return {
        validFiles,
        invalidFiles,
        hasInvalid: invalidFiles.length > 0
    };
}

export function showNotification(message, type = 'error') {
    const colors = {
        error: '#d63031',
        success: '#00b894',
        warning: '#fdcb6e'
    };
    
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 4000);
}

// ============================================
// VALIDATION POUR BACKGROUND
// ============================================
export async function validateBackgroundFile(file) {
    const validation = await validateFile(file, 'images');
    
    if (!validation.valid) {
        showNotification(`❌ ${file.name}: ${validation.message}`, 'error');
        return null;
    }
    
    showNotification(`✅ Image ${validation.fileInfo.format.toUpperCase()} valide`, 'success');
    return file;
}

// ============================================
// CSS ANIMATIONS
// ============================================
const style = document.createElement('style');
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
`;
document.head.appendChild(style);
