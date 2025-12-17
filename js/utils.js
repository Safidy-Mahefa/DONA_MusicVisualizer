// utils.js

import { getAnalyser } from "./audio.js";
// Petits updates : DynamicScaling (remapper les valeurs en fonction de la puissance actu)
                // Smoother les barres
                // Remapper le spectre pour les musique dubstep
                // Compresseur visuel
let dynamicMax = 0;//Pour le dynamic scaling
let smoothSpectrum =[];
const SMOOTHING = 0.65;

export function normalize(v){ //dynamic scaling
    const decay = 1; //vitesse de descente du max
    dynamicMax = Math.max(dynamicMax * decay,v);
    return v/dynamicMax;
}

export function smooth(i,v){ //pour vitesse de descente
    if(!smoothSpectrum[i]) smoothSpectrum[i] = v;
    smoothSpectrum[i] = SMOOTHING * smoothSpectrum[i] + (1 - SMOOTHING) * v;
    return smoothSpectrum[i]
}

//compression
export function compress(x){
    return Math.pow(x,0.7);
}

//pour la repartition des bars et type (bass, mid, etc..)
export function logIndex(i, bars, bufferLength){
    const t = i/(bars-1);
    const logBase = Math.log10(1+t*8);
    const boosted = Math.pow(logBase,2.5);
    return Math.floor(boosted*(bufferLength - 1));
}

export function roundRect(ctx, x, y, w, h, r){  
    const min = Math.min(w,h)/2;
    if(r>min) r = min;
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    
    ctx.closePath();

                //dessiner cercle
    /*ctx.beginPath();
    const cx = x + w /2;
    const cy = y + h /2;
    const radius = h/2
    ctx.arc(cx,cy,radius,0,Math.PI * 2);*/
}

export function getBands (dataArray, sampleRate){ //pour bien séparer les catégories de songs
    const nyquist = sampleRate / 2; //la limite max des fréquences

    const bands={ //les catégories den bands
        low:0,
        mid:0,
        high:0
    }
    const counts={low:0,mid:0,high:0}; //pour l'itération de bands
    for(let i = 0; i< dataArray.length; i++){ //parcourir chaque case de dataArray
        //frequence de la case
        const freq = (i/ dataArray.length) * nyquist;

        if(freq < 200){
            bands.low += dataArray[i];
            counts.low ++;
        }
        else if(freq < 2000){
            bands.mid += dataArray[i]
            counts.mid++
        }
        else{
            bands.high += dataArray[i];
            counts.high ++;
        }
        //moyenne de chaque band
        bands.low = (bands.low / counts.low) / 255;
        bands.mid = (bands.mid / counts.mid) / 255;
        bands.high = (bands.high / counts.high) / 255;

        return bands;
    }
}
export function updateSmoothing(smoothValue,smoothInput,value){
    smoothInput.value = value;
    if(getAnalyser()) getAnalyser().smoothingTimeConstant = parseFloat(smoothInput.value);
    smoothValue.textContent = value;
}

export function estimateBPM(){
    return 120;
}
export function rgbToHex({r,g,b}){
    const toHex = c => c.toString(16).padStart(2,"0");
    return "#" + toHex(r) + toHex(g) + toHex(b);
}
export { smoothSpectrum };