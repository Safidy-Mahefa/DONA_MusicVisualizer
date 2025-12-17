// Les modes de visualiser
import { roundRect, smoothSpectrum } from "./utils.js";
import { rgbToString } from "./colorExtractor.js";
import { getAnalyser } from "./audio.js";


let visualizerColor = {r:255,g:255,b:255}; //couleur blanc par défaut
export function setVisualizerColorForModes(color){
    visualizerColor = color;
}

//mode Bars
export  function drawBars(ctx,W,H,bars,barW,x,visualizerColor){
    ctx.save();
    ctx.translate(-300, H* 0.3) //position du viz par rapport au canva : deplacer 40% vers le bas
    ctx.scale(1,0.4); //la taille globale de l'ensemble des bars (horizontal,vertical)
    for(let i=0; i<bars; i++){
        const v = smoothSpectrum[i]; //intensité audio
        if(i < 2){ //ignorer le 3 premiers barres
            x += barW + ((W/bars)*0.2);
            continue;
        }

        // Compression intelliigente pour éviter la sauration:
        let adjustedV = v;
        if(i<bars * 0.2){ //30% premières barres
            adjustedV = Math.pow(v,3) // compression plus forte pour les basses
        }else if(i<bars * 0.6){ //les barres du milieu
            adjustedV = Math.pow(v,1.9)
        }
        else if(i<bars * 0.9){
             adjustedV = Math.pow(v,1.5)
        }
        else if(i>bars*0.9 && i<bars*0.98 ){
            adjustedV = Math.pow(v,1.8)
        }
        else if(i>bars*0.98){
             adjustedV = Math.pow(v,30.2)
        }
        //ce qui donne la hauteur des bars
        const h =(adjustedV** 2.02)*H; //hauteur : variante hardstyle: (adjustedV** 2.02)*H; variante elasticPulse : (adjustedV*adjustedV*0.7+v*0.3) * H ;var Lofi :  Math.pow(adjustedV,0.8)*H*0.75 ; var edm commercial : (Math.pow(adjustedV,1.8)*0.8+v*0.2)*H
        const hue = Math.floor(200 - (i/bars)*200);
        ctx.fillStyle = rgbToString(visualizerColor,1); //couleur des bars
        const ry = H - h; //position des bars dans le canva
        const r = barW * 0.25; //border radius des bars
        roundRect(ctx, x, ry/2, barW, h, r);
        ctx.fill();
        x += barW + ((W / bars) * 0.4)
    }
    ctx.restore();
 
}

// Mode cercle
export  function drawCircle(ctx,W,H,bars,visualizerColor){
    ctx.save();
    const centerX = W/2;
    const centerY = H/2;
    const radius = Math.min(W,H) * 0.25;
    const maxBarHeight = Math.min(W,H)*0.15;

    //dessiner le cercle centrale
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
    ctx.strokeStyle =  rgbToString(visualizerColor,0.5);
    ctx.lineWidth = 2;
    ctx.stroke();
    // dessiner les barres en cercle
    for(let i=0; i<bars; i++){
        const v = smoothSpectrum[i]; //intensité audio


        // Compression intelliigente pour éviter la sauration:
        let adjustedV = v;
        if(i<bars * 0.2){ //30% premières barres
            adjustedV = Math.pow(v,3) // compression plus forte pour les basses
        }else if(i<bars * 0.6){ //les barres du milieu
            adjustedV = Math.pow(v,1.9)
        }
        else if(i<bars * 0.9){
             adjustedV = Math.pow(v,1.5)
        }
        else if(i>bars*0.9 && i<bars*0.98 ){
            adjustedV = Math.pow(v,1.8)
        }
        else if(i>bars*0.98){
             adjustedV = Math.pow(v,30.2)
        }

        const barHeight = Math.max(maxBarHeight*0.01,(Math.pow(adjustedV,2) * 0.6 + adjustedV * 0.4) * maxBarHeight);
        const angle = (i/bars) * Math.PI * 2 - Math.PI /2;

        const innerX = centerX + Math.cos(angle) * radius;
        const innerY = centerY + Math.sin(angle) * radius;
        const outerX = centerX + Math.cos(angle) * (radius + barHeight);
        const outerY = centerY + Math.sin(angle) * (radius + barHeight);

        const gradient = ctx.createLinearGradient(innerX,innerY,outerX,outerY);
        const alpha = 0.5 + adjustedV * 0.5;
        gradient.addColorStop(0,rgbToString(visualizerColor,alpha));
        gradient.addColorStop(1,rgbToString(visualizerColor,alpha));

        ctx.beginPath();
        ctx.moveTo(innerX,innerY);
        ctx.lineTo(outerX,outerY);
        ctx.strokeStyle =gradient;
        ctx.lineWidth = Math.max(2,(W/bars)*0.4);
        ctx.lineCap = 'round';
        ctx.stroke();


    }
    ctx.restore();

}

// Mode wave (onde sinusoidale)
export function drawWave(ctx, W ,H,bars,visualizerColor){
    ctx.save();
    const centerY = H/2;
    const step = W / bars;

    ctx.beginPath();
    ctx.moveTo(0, centerY);

    // dessin
    for(let i=3; i<bars; i++){
        const v = smoothSpectrum[i]; //intensité audio


        // Compression intelliigente pour éviter la sauration:
        let adjustedV = v;
        if(i<bars * 0.2){ //30% premières barres
            adjustedV = Math.pow(v,3) // compression plus forte pour les basses
        }else if(i<bars * 0.6){ //les barres du milieu
            adjustedV = Math.pow(v,1.9)
        }
        else if(i<bars * 0.9){
             adjustedV = Math.pow(v,1.5)
        }
        else if(i>bars*0.9 && i<bars*0.98 ){
            adjustedV = Math.pow(v,1.8)
        }
        else if(i>bars*0.98){
             adjustedV = Math.pow(v,30.2)
        }
        const x = i * step;
        const y = centerY - (adjustedV * H * 0.3);
        ctx.lineTo(x,y)
    }

    ctx.strokeStyle =  rgbToString(visualizerColor,1);
    ctx.lineWidth = 3;
    ctx.stroke();



}
// ========================================

// Fonction helper pour compression audio
function compressAudio(v, i, bars) {
    let adjustedV = v;
    if (i < bars * 0.2) {
        adjustedV = Math.pow(v, 3);
    } else if (i < bars * 0.6) {
        adjustedV = Math.pow(v, 1.9);
    } else if (i < bars * 0.9) {
        adjustedV = Math.pow(v, 1.5);
    } else if (i > bars * 0.9 && i < bars * 0.98) {
        adjustedV = Math.pow(v, 1.8);
    } else if (i > bars * 0.98) {
        adjustedV = Math.pow(v, 30.2);
    }
    return adjustedV;
}

// 2. MODE BLOB/METABALL 🟣
export function drawBlob(ctx, W, H, bars, visualizerColor) {
    if (getAnalyser()) getAnalyser().smoothingTimeConstant = 0.85;
    ctx.save();

    const centerX = W / 2;
    const centerY = H / 2;
    const points = [];
    const numPoints = 8;

    // Calculer l'amplitude moyenne
    let avgAmplitude = 0;
    for (let i = 0; i < bars; i++) {
        avgAmplitude += smoothSpectrum[i];
    }
    avgAmplitude /= bars;

    // Créer les points du blob
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const barIndex = Math.floor((i / numPoints) * bars);
        const v = smoothSpectrum[barIndex];
        const adjustedV = compressAudio(v, barIndex, bars);
        
        const baseRadius = Math.min(W, H) * 0.15;
        const radius = baseRadius + adjustedV * baseRadius * 1.5;
        
        points.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
        });
    }

    // Dessiner le blob avec des courbes de Bézier
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < numPoints; i++) {
        const current = points[i];
        const next = points[(i + 1) % numPoints];
        const controlX = (current.x + next.x) / 2;
        const controlY = (current.y + next.y) / 2;
        
        ctx.quadraticCurveTo(current.x, current.y, controlX, controlY);
    }

    ctx.closePath();

    // Gradient radial
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(W, H) * 0.3);
    gradient.addColorStop(0, rgbToString(visualizerColor, 0.8));
    gradient.addColorStop(1, rgbToString(visualizerColor, 0.2));
    
    ctx.fillStyle = gradient;
    ctx.fill();

    // Contour avec glow
    ctx.strokeStyle = rgbToString(visualizerColor, 1);
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = rgbToString(visualizerColor, 0.6);
    ctx.stroke();

    ctx.restore();
}

// 5. MODE PULSE RING (Sonar) 💍
let rings = [];
export function drawPulseRing(ctx, W, H, bars, visualizerColor) {
    if (getAnalyser()) getAnalyser().smoothingTimeConstant = 0.5;
    ctx.save();

    const centerX = W / 2;
    const centerY = H / 2;

    // Calculer l'amplitude moyenne des basses
    let bassAmplitude = 0;
    for (let i = 0; i < bars * 0.1; i++) {
        bassAmplitude += smoothSpectrum[i];
    }
    bassAmplitude /= (bars * 0.1);
    bassAmplitude = compressAudio(bassAmplitude, 5, bars);

    // Créer un nouvel anneau si l'amplitude est forte
    if (bassAmplitude > 0.4 && (!rings.length || rings[rings.length - 1].radius > 30)) {
        rings.push({
            radius: 10,
            alpha: 1,
            speed: 2 + bassAmplitude * 3
        });
    }

    // Mettre à jour et dessiner les anneaux
    rings = rings.filter(ring => {
        ring.radius += ring.speed;
        ring.alpha -= 0.015;

        if (ring.alpha > 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, ring.radius, 0, Math.PI * 2);
            ctx.strokeStyle = rgbToString(visualizerColor, ring.alpha);
            ctx.lineWidth = 3;
            ctx.shadowBlur = 15;
            ctx.shadowColor = rgbToString(visualizerColor, ring.alpha * 0.5);
            ctx.stroke();
            return true;
        }
        return false;
    });

    // Cercle central pulsant
    const centralRadius = 30 + bassAmplitude * 40;
    ctx.beginPath();
    ctx.arc(centerX, centerY, centralRadius, 0, Math.PI * 2);
    ctx.fillStyle = rgbToString(visualizerColor, 0.3 + bassAmplitude * 0.5);
    ctx.fill();
    ctx.strokeStyle = rgbToString(visualizerColor, 1);
    ctx.lineWidth = 3;
    ctx.shadowBlur = 30;
    ctx.shadowColor = rgbToString(visualizerColor, 0.8);
    ctx.stroke();

    ctx.restore();
}


// 7. MODE KALEIDOSCOPE 🔮
export function drawKaleidoscope(ctx, W, H, bars, visualizerColor) {
    ctx.save();

    const centerX = W / 2;
    const centerY = H / 2;
    const segments = 8;
    
    // Calculer le rayon maximum en fonction de la taille du canvas
    const maxRadius = Math.min(W, H) * 0.4;
    const minRadius = maxRadius * 0.15;
    
    ctx.translate(centerX, centerY);

    for (let seg = 0; seg < segments; seg++) {
        ctx.save();
        ctx.rotate((seg / segments) * Math.PI * 2);
        
        // Dessiner un segment
        ctx.beginPath();
        ctx.moveTo(0, 0);
        
        const step = (maxRadius - minRadius) / bars;
        for (let i = 0; i < bars; i++) {
            const v = smoothSpectrum[i];
            const adjustedV = compressAudio(v, i, bars);
            
            // Calcul de la hauteur immersive et pro
            // 1. Base amplitude avec compression logarithmique
            const logScale = Math.log10(1 + adjustedV * 9) / Math.log10(10);
            
            // 2. Amplification dynamique basée sur la fréquence
            const freqBoost = 1 + (i / bars) * 0.3; // Boost progressif pour hautes fréquences
            
            // 3. Calcul de la hauteur avec courbe exponentielle pour plus de dynamisme
            const baseHeight = logScale * freqBoost;
            const heightMultiplier = Math.pow(baseHeight, 1.3); // Courbe exponentielle
            
            // 4. Hauteur finale proportionnelle au rayon
            const height = heightMultiplier * maxRadius * 0.7; // Max 70% du rayon
            
            // 5. Position avec effet de profondeur
            const distance = minRadius + i * step;
            const totalDistance = distance + height;
            
            // 6. Angle avec variation basée sur l'amplitude
            const angleVariation = adjustedV * 0.3 * (1 + Math.sin(i * 0.5) * 0.2);
            
            const x = Math.cos(angleVariation) * totalDistance;
            const y = Math.sin(angleVariation) * totalDistance;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        // Style avec gradient pour plus de profondeur
        const gradient = ctx.createRadialGradient(0, 0, minRadius, 0, 0, maxRadius);
        gradient.addColorStop(0, rgbToString(visualizerColor, 0.8));
        gradient.addColorStop(0.5, rgbToString(visualizerColor, 0.6));
        gradient.addColorStop(1, rgbToString(visualizerColor, 0.3));
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(2, maxRadius / 150);
        ctx.shadowBlur = maxRadius / 15;
        ctx.shadowColor = rgbToString(visualizerColor, 0.6);
        ctx.stroke();
        
        // Ajouter un contour intérieur pour plus de définition
        ctx.beginPath();
        ctx.arc(0, 0, minRadius, 0, Math.PI * 2);
        ctx.strokeStyle = rgbToString(visualizerColor, 0.4);
        ctx.lineWidth = Math.max(1, maxRadius / 200);
        ctx.shadowBlur = maxRadius / 25;
        ctx.stroke();
        
        ctx.restore();
    }

    ctx.restore();
}