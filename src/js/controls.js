// controls.js - Gestion des événements des boutons de contrôle

import { 
    nextTrack, 
    prevTrack, 
    playTrack, 
    setRepeat, 
    getRepeat,
    setShuffle,
    getShuffle,
    getTrackProgress,
    setTrackProgress,
    formatTime,
    getCurrentTrackIndex,
    getAudioFiles
} from './playback.js';
import { setRunning, getRunning, loop, stopLoop } from './visualizer.js';
import { setupAnalyser } from './audio.js';

let repeatButton = null;
let shuffleButton = null;
let canvas;
let ctx;

export function setupControls(audioEl, playBtn, myCanvas, myCtx) {
    canvas = myCanvas;
    ctx = myCtx;
    // Boutons de contrôle
    const prevBtn = document.querySelector('.prevBtn');
    const nextBtn = document.querySelector('.nextBtn');
    repeatButton = document.querySelector('.repeatButton');
    shuffleButton = document.querySelector('.shuffleButton');
    
    // Barre de progression
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.getElementById('progressFill');
    
    // Temps
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    
    // Volume
    const volumeSlider = document.getElementById('volume');
    
    // Plein écran
    const fullscreenBtn = document.querySelector('.playback-right .control-btn');
    
    // ============ NEXT TRACK ============
    nextBtn.addEventListener('click', () => {
        const nextFile = nextTrack();
        if (nextFile) {
            playNextTrack(audioEl, nextFile, playBtn);
        }
        
    });

    // ============ PREVIOUS TRACK ============
    prevBtn. addEventListener('click', () => {
        const prevFile = prevTrack();
        if (prevFile) {
            playPrevTrack(audioEl, prevFile, playBtn);
        }
    });

    // ============ REPEAT ============
    repeatButton.addEventListener('click', () => {
        const newRepeatState = ! getRepeat();
        setRepeat(newRepeatState);
        updateRepeatButton();
    });

    // ============ SHUFFLE ============
    shuffleButton.addEventListener('click', () => {
        const newShuffleState = !getShuffle();
        setShuffle(newShuffleState);
        updateShuffleButton();
    });

    // ============ PROGRESS BAR ============
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percentage = ((e.clientX - rect.left) / rect.width) * 100;
        setTrackProgress(audioEl, percentage);
    });

    // ============ MISE À JOUR DE LA BARRE ============
    audioEl.addEventListener('timeupdate', () => {
        const progress = getTrackProgress(audioEl);
        progressFill.style.width = progress + '%';
        
        currentTimeEl.textContent = formatTime(audioEl.currentTime);
        durationEl.textContent = formatTime(audioEl. duration);
    });

    // ============ DURÉE INITIALE ============
    audioEl. addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audioEl. duration);
    });

    // ============ FIN DE LA CHANSON ============
    audioEl. addEventListener('ended', () => {
        if (getRepeat()) {
            audioEl.currentTime = 0;
            audioEl.play();
        } else {
            const nextFile = nextTrack();
            if (nextFile) {
                playNextTrack(audioEl, nextFile, playBtn);
            } else {
                playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
                setRunning(false);
                stopLoop();
            }
        }
    });

    // ============ VOLUME ============
    volumeSlider.addEventListener('input', (e) => {
        audioEl.volume = parseInt(e.target.value) / 100;
        updateVolumeIcon(parseInt(e.target.value));
    });

    // ============ FULLSCREEN ============
    fullscreenBtn.addEventListener('click', () => {
        const canvasContainer = document.getElementById('canvaContainer');
        
        if (! document.fullscreenElement) {
            canvasContainer.requestFullscreen().catch(err => {
                console. warn('Fullscreen failed:', err);
            });
            canvasContainer.style.border = "none"
        } else {
            document.exitFullscreen();
        }
    });

    // Mise à jour de l'icône fullscreen
    document.addEventListener('fullscreenchange', () => {
        const icon = fullscreenBtn.querySelector('i');
        if (document.fullscreenElement) {
            icon.className = 'fa-solid fa-compress';
        } else {
            icon.className = 'fa-solid fa-expand';
        }
    });
}

// ============ FONCTIONS HELPER ============

function playNextTrack(audioEl, file, playBtn) {
    stopLoop();
    audioEl.src = URL.createObjectURL(file);
    audioEl.load();
    audioEl.play();
    setupAnalyser(); //prépare le tableu dataArray et le buffer (voir fonction plus bas)
    playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    setRunning(true);
    loop(canvas, ctx);
    
    // Mettre à jour le nom de la piste
    const trackName = document.getElementById('trackName');
    trackName.textContent = file. name;

    // mettre à jour l'ui
    updateUiList();
}

function playPrevTrack(audioEl, file, playBtn) {
    stopLoop();
    audioEl.src = URL.createObjectURL(file);
    audioEl.load();
    audioEl.play();
    setupAnalyser();
    playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    setRunning(true);
    loop(canvas, ctx);
    
    // Mettre à jour le nom de la piste
    const trackName = document.getElementById('trackName');
    trackName.textContent = file. name;

    // mettre à jour l'ui
    updateUiList();
}

function updateRepeatButton() {
    if (getRepeat()) {
        repeatButton.style.color = '#00b894';
        repeatButton.style.background = 'rgba(0, 184, 148, 0.1)';
    } else {
        repeatButton.style.color = '#636e72';
        repeatButton. style.background = 'transparent';
    }
}

function updateShuffleButton() {
    if (getShuffle()) {
        shuffleButton.style. color = '#00b894';
        shuffleButton.style.background = 'rgba(0, 184, 148, 0.1)';
    } else {
        shuffleButton.style. color = '#636e72';
        shuffleButton.style.background = 'transparent';
    }
}

function updateVolumeIcon(value) {
    const volumeIcon = document.querySelector('.volume-icon i');
    if (value === 0) {
        volumeIcon.className = 'fa-solid fa-volume-xmark';
    } else if (value < 50) {
        volumeIcon. className = 'fa-solid fa-volume-low';
    } else {
        volumeIcon.className = 'fa-solid fa-volume-high';
    }
}

function updateUiList(){
    let trackIndex = getCurrentTrackIndex();
    let item = document.querySelector(".audioList").children[trackIndex]; //pour le UI
    if(item.dataset.status !== "1"){
        document.querySelectorAll(".file-item").forEach((e)=>{
            e.dataset.status = "0";
            e.className = `file-item`;
        })
        item.dataset.status ="1"
        item.className = `file-item ${item.dataset.status === "1" ? 'active' : ''}`;
    }
}