// playback.js - Gestion complète de la playlist et de la lecture

let audioFiles = [];
let currentTrackIndex = 0;
let isRepeat = false;
let isShuffle = false;

export function setAudioFiles(files) {
    audioFiles = files;
    currentTrackIndex = 0;
}

export function getAudioFiles() {
    return audioFiles;
}

export function getCurrentTrackIndex() {
    return currentTrackIndex;
}

export function getCurrentTrack() {
    if (audioFiles.length === 0) return null;
    return audioFiles[currentTrackIndex];
}

export function nextTrack() {
    if (audioFiles.length === 0) return null;
    
    if (isShuffle) {
        currentTrackIndex = Math.floor(Math.random() * audioFiles.length);
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % audioFiles.length;
    }
    
    return getCurrentTrack();
}

export function prevTrack() {
    if (audioFiles.length === 0) return null;
    
    currentTrackIndex = (currentTrackIndex - 1 + audioFiles.length) % audioFiles.length;
    return getCurrentTrack();
}

export function playTrack(index) {
    if (index < 0 || index >= audioFiles.length) return null;
    currentTrackIndex = index;
    return getCurrentTrack();
}

export function setRepeat(value) {
    isRepeat = value;
}

export function getRepeat() {
    return isRepeat;
}

export function setShuffle(value) {
    isShuffle = value;
}

export function getShuffle() {
    return isShuffle;
}

export function getTrackProgress(audio) {
    if (!audio || audio.duration === 0) return 0;
    return (audio.currentTime / audio. duration) * 100;
}

export function setTrackProgress(audio, percentage) {
    if (!audio || audio.duration === 0) return;
    audio.currentTime = (percentage / 100) * audio.duration;
}

export function formatTime(seconds) {
    if (! seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}