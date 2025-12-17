
import { getAudioCtx } from "./audio.js";
// Enregistrement et export du canvas
let mediaRecorder = null; //c'est l'objet qui enregistre le canvas et l'audio
let recordedChunks = [];
let isRecording = false;
let videoBlob = null;

export function startRecording(canvas, audioEl, recordBtn,exportBtn,quality){
    if(isRecording) return;

    // reset
    recordedChunks = [];
    videoBlob = null;
    exportBtn.style.display = 'none';

    // redémarrer la musique depuis le début
    audioEl.currentTime = 0;
    audioEl.play();

    // Capturer le canvas 60fps
    const canvasStream = canvas.captureStream(60);

    // Capturer l'audio de l'element audio
    const dest = getAudioCtx().createMediaStreamDestination();
    // combiner video + audio
    const videoTrack = canvasStream.getVideoTracks()[0];
    const audioTrack = dest.stream.getAudioTracks()[0];
    const combinedStream = new MediaStream([videoTrack, audioTrack]);

    // Qualité selon la selection
    let britate;
    switch(quality){
        case 'low':
            britate = 2000000; //2 Mbps
            break;
        case 'medium':
            britate = 5000000;
        case 'high':
            britate = 8000000; 
            break;
        case 'ultra':
            britate = 15000000; 
            break;
        default:
            britate = 8000000;
    }

    // options d'enregistrement
    let options = {mimeType:'video/webm;codeds=vp9', videoBitsPerSecond: britate};
    if(!MediaRecorder.isTypeSupported(options.mimeType)){
        options = {mimeType:'video/webm;codeds=vp8', videoBitsPerSecond: britate};
    }
    if(!MediaRecorder.isTypeSupported(options.mimeType)){
        options = {mimeType:'video/webm', videoBitsPerSecond: britate};
    }

    mediaRecorder = new MediaRecorder(combinedStream, options);
    mediaRecorder.ondataavailable = (event) =>{
        if(event.data.size > 0 ){
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = ()=>{
        // creer le blob video
        videoBlob = new Blob(recordedChunks, {type:'video/webm'});

        // Afficher le btn d'export
        recordBtn.innerHTML = '<i class="fa-solid fa-circle-dot"></i><span>Enregistrer</span>';
        recordBtn.style.display = 'inline-flex';
        recordBtn.disabled = false;

        exportBtn.style.display = 'inline-flex';
        exportBtn.innerHTML = '<i class="fa-solid fa-download"></i><span>Exporter</span>';

        isRecording = false;
        alert('Enregistrement terminé');
    };
    
    // arreter automatiquement a la fin de la musique
    audioEl.onended = ()=>{
        if(isRecording){
            mediaRecorder.stop();
        }
    };

    mediaRecorder.start();
    isRecording = true;

    recordBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>ça enregistre</span>';
    recordBtn.disabled = true;

}

// fonction export video
export function exportVideo(){
    if(!videoBlob) return;

    const url = URL.createObjectURL(videoBlob);

    // telecharger
    const a = document.createElement('a');
    a.href = url;
    a.download = `music-visualizer-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(()=> URL.revokeObjectURL(url),100);
}

export function showRecordButton(recordBtn){
    recordBtn.style.display = 'inline-flex';
}

export function isCurrentlyRecording(){
    return isRecording;
}
