// audio.js

import { normalize, smooth, compress, logIndex } from './utils.js';

// LES VARIABLES : ce sont les nodes, elle peuvent se relier entre eux
let audioCtx, //pour manipuler l'audio : lire,analyser,controler volume et effets...
    sourceNode, // La source de notre audio : input, audio,...
    analyser, //celui qui permet d'analyser l'audio en temps reel, frame par frame...
    dataArray, //tab qui contient les donnees audio analysées
    bufferLength //La taille du tableau dataArray (pour boucler correctement sur les frequences)

let lastBeatTime = 0 //sauvegarde d le temps (en ms) du dernier beat pour eviter : les faux beats, detection trop rapide, double coups
let beatCooldown = 150 //le temps minimum entre deux beats (en ms)

const prevSpectrum = [] //contient le frame précédent
const fluxHistory = [] //historique des flux, pour calculer la moyenne pour un bon beat visualiser

export function initAudio(fftSelect, smoothInput){
    if(audioCtx) return; //si audioCtx existe déja
    //sinon
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser(); //creer l'analyseur
    analyser.fftSize = parseInt(fftSelect.value) //definir le fft
    analyser.smoothingTimeConstant = parseFloat(smoothInput.value) //definir le smoothing
}

//La fonction pour initialiser l'analiseur, préparer le tableau de données pour analyser l'audio
export function setupAnalyser(){
    //le buffer ce sont les donnés du song à analyser... il est stocké dans le tab dataArray
    bufferLength = analyser.frequencyBinCount; //frequencyBinCOunt est la moitié du fftSize, c le nbr de barre que je peux afficher
    dataArray = new Uint8Array(bufferLength); //creer un tab d'entiers(amplitude : 0 - 255) de taille = a bufferLength. 
    //chaque valeur dans ce tab représent l'energie de la frequence...pour dessiner les barres et animer en fonct de la musique
}

// La fonction pour détecter les beats
export function detectBeats(spectrum){ //spectrum c'est le dataArray
    let flux = 0; //quantité de changement ou de diff entre deux frames
    //parcourir le spectrum
    for(let i=0; i< spectrum.length; i++){
        const value = spectrum[i]; //volume actuelle de la frequence i
        const prev = prevSpectrum[i] || 0; //volume précédente de cette meme frequence, 0 si n'existe ps encore
        const diff = Math.max(0, value - prev)  // difference positive : augmentation
        flux += diff; //accumuler tt les diff positifs = energie globale qui a augmenté
        prevSpectrum[i] = value; //mise a jour du prevSpectrum
    }
    fluxHistory.push(flux) //stocker le flux dans l'historique
    if(fluxHistory.length > 43) fluxHistory.shift() //suppr le premier element
    const mean = fluxHistory.reduce((a,b)=>{ //La moyenne des du flux
        a+b
    },0)/fluxHistory.length

    // Variance et écart type
    const variance = fluxHistory.reduce((a,b)=>{
        a+(b-mean) * (b-mean)
    },0)/fluxHistory.length;
    const std = Math.sqrt(variance);
    const threshold = mean + std * 3.0; //pour limiter les faux positifs

    //vérif finale
    const now = performance.now(); //temps actuelle en ms
    //condition de beat
    if(flux > threshold && (now - lastBeatTime) > beatCooldown){ //beatCooldown est le temps min entre deux beat
        lastBeatTime = now;
        return true
    }
    return false; //sinon returner false
}

export function getAnalyser(){
    return analyser;
}

export function getAudioCtx(){
    return audioCtx;
}

export function getDataArray(){
    return dataArray;
}

export function getBufferLength(){
    return bufferLength;
}

export function setSourceNode(node){
    sourceNode = node;
}

export function getSourceNode(){
    return sourceNode;
}