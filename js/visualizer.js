// visualizer.js

import { normalize, smooth, compress, logIndex, roundRect, getBands, smoothSpectrum, estimateBPM, rgbToHex } from './utils.js';
import { detectBeats, getDataArray, getBufferLength, getAudioCtx, getAnalyser } from './audio.js';
import { drawBars, drawCircle, drawWave, drawBlob, drawPulseRing, drawKaleidoscope} from './modes.js';
import { getDominantColor, lightenColor,rgbToString } from './colorExtractor.js';

let running = false // indique si le visualiser est en marche ou non
let currentMode = 'bars';
let visualizerColor = {r:255,g:255,b:255}; //couleur blanc par défaut
let loopID = null;
let defaultColor;


//pour le background img
const bg = new Image;
bg.src  = "bg.jpg"

export function setRunning(value){
    running = value;
}

export function getRunning(){
    return running;
}

export function setMode(mode){
    currentMode = mode;
}

export function getVisualizerColor(){
    return visualizerColor;
}

//La fonction loop pour dessiner le visualiser
export function loop(canvas, ctx){
    if(!running) return;
    loopID = requestAnimationFrame(() => loop(canvas, ctx)); //Appeler la fonction loop comme setInterval mais plus smooth. relancé a chaque frame
    
    const analyser = getAnalyser();
    const dataArray = getDataArray();
    const bufferLength = getBufferLength();
    
    if(!analyser || !dataArray) return;
    
    analyser.getByteFrequencyData(dataArray); // Recup le spectre audio
    const bands = getBands(dataArray, getAudioCtx().sampleRate); //pour bien séparer les fréquences

                //nettoyer le canvas pour un nouveau dessin a chaque loop appelé
    const W = canvas.width , H = canvas.height;
    ctx.clearRect(0,0,W,H)
    
    //Dessiner le fond flouté/assombri
    ctx.drawImage(bg,0,0,W,H);
    
    // Overlay sombre pour effet blur
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0,0,W,H);

    //Préparer les barres du visualiser
    const bars = 110;
    const step = Math.floor(bufferLength / bars); //le nbr de frequence par bars
    const barW = Math.max(2,(W/bars)*0.2); //La largauer de chaque bar
    let x =(W - (bars * barW))/2; //position de départ
    let maxVal = 0;
    const spectrum = new Float32Array(bars); //le tableau des bars

    //calculer la hauteur de chaque bar:
    for(let i=0; i<bars; i++){
        //Index logarithmique pour rendu edm
        const idx = logIndex(i,bars,bufferLength - 1); 
        let raw = dataArray[idx] / 255; //recup la valeur brute
        raw = normalize(raw); //dynamic scaling
        raw = smooth(i,raw); //lissage dynamique
        raw = compress(raw);
        spectrum[i] = raw;

        // let sum = 0;
        // for(let j=0; j<step;j++){
        //     sum += dataArray[i*step + j]
        // }
        // const v = sum / (step*255)
        // spectrum[i] = v;
        // if(v > maxVal) maxVal = v;
    }

    //Detection des beats
    const beat = detectBeats(Array.from(dataArray));
    //envoyer les spectrums dans l'algo de detection de beats
    if(beat){ //quand beat detecté, on pulse les bars
        // for(let i = 0; i<count; i++){
        //     const index =  Math.floor(Math.random() * bassEnd)
        //     beatTargets.push(index)
        // }
        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = rgbToString(visualizerColor,1);
        ctx.fillRect(0,0,W,H);
        ctx.restore();
    }



    //Dessiner chaque le visualiser selon le mode selectionné
    switch(currentMode){
        case 'bars':
            drawBars(ctx,W,H,bars,barW,x,visualizerColor);
            break;
        case 'circle':
            drawCircle(ctx,W,H,bars,visualizerColor);
            break
        case 'wave':
            drawWave(ctx, W ,H,bars,visualizerColor);
            break;
        case 'blob':
            drawBlob(ctx, W, H, bars, visualizerColor);
            break;
        case 'pulse-ring':
             drawPulseRing(ctx, W, H, bars, visualizerColor);
             break;
        case 'kaleidoscope':
             drawKaleidoscope(ctx, W, H, bars, visualizerColor);
             break;
    }

    
    // Dessiner l'image centrale (le même background mais net)
    /*if(bg.complete) {
        ctx.save();
        const imgSize = Math.min(W, H) * 0.4; // Taille de l'image (40% du canvas)
        const imgX = (W - imgSize) / 2;
        const imgY = (H - imgSize) / 2;
        
        // Ombre autour de l'image
        ctx.shadowBlur = 50;
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        
        // Carré/Rectangle arrondi pour le fond de l'image
        const cornerRadius = 20;
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        roundRect(ctx, imgX - 20, imgY - 20, imgSize + 40, imgSize + 40, cornerRadius);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        
        // Dessiner l'image du background au centre (net, pas flouté)
        ctx.drawImage(bg, imgX, imgY, imgSize, imgSize);
        ctx.restore();
    }*/
    
}

export function stopLoop(){ //pour stopper l'animation
    if(loopID){
        cancelAnimationFrame(loopID);
        loopID = null;
        console.log("La musique s'arrête")
    }
}

export function initBackground(callback){
      bg.onload = ()=>{
        //extraire la couleur
        const dominantColor = getDominantColor(bg);
        //éclaircir
        visualizerColor = lightenColor(dominantColor, 150);
        if(callback) callback();
        defaultColor = visualizerColor;
        return defaultColor;
    }
}
// Pour updater le bg du visualiser 
export  function updateBackground(newSrc){
    return new Promise((resolve)=>{
        bg.src = newSrc;
        bg.onload = ()=>{
            //extraire la couleur
            const dominantColor = getDominantColor(bg);
            //éclaircir
            visualizerColor = lightenColor(dominantColor, 150);
            console.log("nouvelle couleur du visualizer :", rgbToString(visualizerColor,1))
            defaultColor = visualizerColor;
            resolve();
        }
})
}
export function setDefaultColor(){
    visualizerColor = defaultColor;
}
export function setDefaultInputColor(input){
    input.value =  rgbToHex(visualizerColor);
    console.log("OK")
}

export function setVisualizerColor(newColor){
    visualizerColor = newColor;
}