// Pour extraire la couleur du bg
export function getAverageColor(img){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img,0,0,img.width,img.height);

    const imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
    const data = imageData.data;

    let r = 0, g= 0, b=0;
    let count = 0;

    //échantillonner tt les pixels
    for(let i = 0; i < data.length; i+=4){
        r+= data[i];
        g+= data[i+1];
        b += data[i+2];
        count++;
    }

    r= Math.floor(r/count);
    g= Math.floor(g/count),
    b= Math.floor(b/count);

    return {r,g,b}
}

export function getDominantColor(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    //taille réduite pour plus de performance
    canvas.width = 50
    canvas.height = 50;
    ctx.drawImage(img,0,0,50,50);
    
    const imageData = ctx.getImageData(0,0,50,50);
    const data = imageData.data;

    const colorMap = {};

    //compter les couleurs en comptent en groupe de 30
    for(let i = 0; i < data.length; i+=4){
        const r = Math.floor(data[i]/30) * 30;
        const g = Math.floor(data[i+1]/30) * 30;
        const b = Math.floor(data[i+2]/30) * 30;

        // Ignorer les couleurs trop sombres ou trop claires
        const brightness = (r + g + b)/3;
        
        if(brightness < 30 || brightness>430) continue;

        const key = `${r},${g},${b}`;
        colorMap[key] = (colorMap[key] || 0) +1;
    }

    // trouver la couleur dominante
    let maxCount = 0;
    let dominantColor = {r:255,g:255,b:255};

    for(const [color,count] of Object.entries(colorMap)){
        if(count > maxCount){
            maxCount = count;
            const [r,g,b] = color.split(',').map(Number);
            dominantColor = {r,g,b};
        }
    }
    return dominantColor;
}

// Pour éclaircir le couleur
export function lightenColor(color,amount=150){
    return {
        r: Math.min(255,color.r + amount),
        g: Math.min(255,color.g + amount),
        b: Math.min(255,color.b + amount),
    };
}

export function rgbToString(color,alpha = 1){
    if(color instanceof Object) return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`; 
    else return  color;

}