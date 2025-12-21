// app.js

import { initAudio, setupAnalyser, getAnalyser, getAudioCtx, setSourceNode, getSourceNode } from './audio.js';
import { setRunning, getRunning, loop, initBackground, updateBackground, setMode, stopLoop } from './visualizer.js';
import { estimateBPM, updateSmoothing, rgbToHex} from './utils.js';
import { getVisualizerColor, setVisualizerColor, setDefaultColor,setDefaultInputColor } from './visualizer.js';
import { rgbToString } from './colorExtractor.js';
import { setAudioFiles } from './playback.js';
import { setupControls } from './controls.js';
import { initAide } from './aide.js';
import { validateFiles, validateBackgroundFile, showNotification } from './fileUploadVerification.js';

// import {startRecording, exportVideo,showRecordButton} from './recorder.js' //pour l'enregistrement vid du canvas

// IIFE : Immediatly invoked function Expression : Permet d'executer immediatement la fonction.
// (function(params){...})(); = Appelle tout de suite la fonction
(async function() { //Pour encapsuler le code

    // DOM
    const fileInput = document.getElementById("file")
    const audioEl = document.getElementById("audio")
    const playBtn = document.getElementById("play")
    const canvas = document.getElementById("c")
    const bgFileInput = document.getElementById("bg");
    const modeSelect = document.getElementById("modeSelect")
    let selectedFiles = []; //let tableau des fichiers audio dans l'input

        // Gestion des fichiers audio
    const audioList = document.getElementById('audioList');
    const trackName = document.getElementById('trackName');

    // Pour les couleurs
    const primaryColor = document.getElementById("primaryColor");
    primaryColor.value = "#ffffd2";
    let defaultColorInput = document.getElementById("defaultColor");
    let defaultColor;

    //pour l'enregistrement vid
    const recordBtn = document.getElementById("record");
    const exportBtn = document.getElementById("export");
    const qualitySelect = document.getElementById("qualitySelect");

    

    // Pour pouvoir dessiner en 2D avec canvas : Canvas = feuille blanche / contexte = le crayon pur dessiner (2d,3d,...)
    const ctx = canvas.getContext("2d")
    const fftSelect = document.getElementById("fttSelect")
    const smoothInput = document.getElementById("smooth")
    const bpmLabel = document.getElementById("bpm")

    // Lors de l'initialisation de l'app
    initAide();

    // initialiser le node
    initAudio(fftSelect, smoothInput);
     // creer l'audioContext et l'analyseur
    if(getSourceNode()) getSourceNode().disconnect() // nettoyer si il l'ancien si il y a plusieurs source node
    const sourceNode = getAudioCtx().createMediaElementSource(audioEl)  //creer la source node qui peut se relier à d'autres nodes
    setSourceNode(sourceNode);
    getSourceNode().connect(getAnalyser()) //connecter la source au node analyser pouq qu'il analyse
    getAnalyser().connect(getAudioCtx().destination) //relie l'analiseur au destination final : les speakers de l'appareil
    //petit schéma : audioEl - sourceNode - analyser - destination : on peut alors analyser le son et l'entendre en même temps
  
    // =====

    function resize(){ //pour bien resizer le visualiser 
        canvas.width = canvas.clientWidth * devicePixelRatio
        canvas.height = canvas.clientHeight * devicePixelRatio
    }
    window.addEventListener("resize", resize); // Quand la fenetre change de taille, recalculer la taille avec resize()
    resize(); //lancer la fonction une première fois au début

    // Quand on upload une nouvelle musique,
    // Changement : Ajout de vérification
    fileInput.addEventListener("change", async (e) => {
        if (e.target.files.length === 0) return;
        
        console.log('📁 Fichiers sélectionnés:', e.target.files.length);
        
        // ✅ VALIDATION DES FICHIERS AUDIO
        const result = await validateFiles(Array.from(e.target.files), 'audio');
        
        console.log('✅ Fichiers valides:', result.validFiles.length);
        console.log('❌ Fichiers invalides:', result.invalidFiles.length);
        
        // Si TOUS les fichiers sont invalides
        if (result.validFiles.length === 0) {
            showNotification('❌ Aucun fichier audio valide détecté', 'error');
            result.invalidFiles.forEach(invalid => {
                console.error(`❌ ${invalid.file.name}: ${invalid.reason}`);
                showNotification(`❌ ${invalid.file.name}: ${invalid.reason}`, 'error');
            });
            e.target.value = ''; // Reset l'input
            return; // ARRÊTER ICI
        }
        
        // Si certains fichiers sont invalides
        if (result.hasInvalid) {
            result.invalidFiles.forEach(invalid => {
                console.warn(`⚠️ ${invalid.file.name}: ${invalid.reason}`);
                showNotification(`❌ ${invalid.file.name}: ${invalid.reason}`, 'error');
            });
        }
        
        // ✅ CONTINUER SEULEMENT AVEC LES FICHIERS VALIDES
        if (result.validFiles.length > 0) {
            selectedFiles = result.validFiles; // Utiliser SEULEMENT les fichiers valides
            setAudioFiles(selectedFiles);
            renderAudioList();
            trackName.textContent = result.validFiles[0].name; // Premier fichier VALIDE
            document.querySelector('.canvas-placeholder').style.display = 'none';
        }
        
        playMusic(audioEl, 0, document.querySelector(".file-list").firstElementChild);
        showNotification(`✅ ${result.validFiles.length} fichier(s) audio valide(s)`, 'success');
    });

    // Quand on change le background
    bgFileInput.addEventListener("change", async (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        
        console.log('🖼️ Image sélectionnée:', f.name);
        
        // ✅ VALIDATION DE L'IMAGE
        const validFile = await validateBackgroundFile(f);
        
        if (!validFile) {
            console.error('❌ Image invalide');
            e.target.value = ''; // Reset l'input
            return; // ARRÊTER ICI
        }
        
        console.log('✅ Image valide');
        
        // ✅ CONTINUER SEULEMENT SI VALIDE
        const bgUrl = URL.createObjectURL(validFile);
        await updateBackground(bgUrl);
        setupDefaultColor();
        if (defaultColorInput.checked == false) defaultColorInput.checked = true;
    });
    // Quand on change de mode :
    modeSelect.addEventListener("change", ()=>{
        switch(modeSelect.value){ //pour initialiser les smoothing pour chaque mode
                case 'bars':
                    updateSmoothing(document.getElementById('smoothValue'),smoothInput,0.8);
                    break;
                case 'circle':
                    updateSmoothing(document.getElementById('smoothValue'),smoothInput,0.5);
                    break
                case 'wave':
                    updateSmoothing(document.getElementById('smoothValue'),smoothInput,0.8);
                    break;
                case 'dual-wave':
                    updateSmoothing(document.getElementById('smoothValue'),smoothInput,0.8);
                    break;
                 case 'kaleidoscope':
                    updateSmoothing(document.getElementById('smoothValue'),smoothInput,0.65);
                    break;
                
            }
        setMode(modeSelect.value);
    })

    // Quand on clique sur le bouton play...
    playBtn.addEventListener("click", ()=>{
        if(!audioEl) return;
        if(!getAudioCtx()) initAudio(fftSelect, smoothInput);
        if(getAudioCtx().state === 'suspended') getAudioCtx().resume();
        if(audioEl.paused){
            audioEl.play();
             playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`
            setRunning(true);
            loop(canvas, ctx);
        }else{
            audioEl.pause();
             playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`
            setRunning(false);
        }
    });

    //Quand on change la couleur
    primaryColor.addEventListener("input", ()=>{
        setVisualizerColor(primaryColor.value);
        defaultColorInput.checked = false
    });

    // Quad on remet la couleur pad défaut
    defaultColorInput.addEventListener("change",()=>{
       setupDefaultColor();
    });

    // Quand on change le fft
    fftSelect.addEventListener("change",()=>{
        if(!getAnalyser()) return;
        getAnalyser().fftSize = parseInt(fftSelect.value);
        setupAnalyser();
    })

    // quand on change le smoothing
    smoothInput.addEventListener("input",()=>{
        if(getAnalyser()) getAnalyser().smoothingTimeConstant = parseFloat(smoothInput.value);
    });
    smoothInput.addEventListener("change",()=>{
        if(getAnalyser()) getAnalyser().smoothingTimeConstant = parseFloat(smoothInput.value);
    });

    // Enregistrement video
    recordBtn.addEventListener("click",()=>{
        const audioEl = document.getElementById("audio");
        const canvas = document.getElementById("c");

        if(!audioEl.src) return;

        if(!audioEl.paused) audioEl.pause(); //mettre en pause si en cours
        
        const quality = qualitySelect.value;

        // Redémarer et enregistrer
        setRunning(true);
        startRecording(canvas,audioEl,recordBtn,exportBtn,quality);
    } );


    //pour le background img
    initBackground(() => { //initialiser le bg image et le couleur pad defaut
        if(getRunning()) loop(canvas, ctx);
    });
    
        //approximation du bpm
    bpmLabel.textContent = 'BPM = ' + estimateBPM().toFixed(0)

    function getAudioSrc(index){ //retourne la source de l'audio qu'on veut play
        if(selectedFiles.length === 0) return;
        const file = selectedFiles[index];
        const url = URL.createObjectURL(file);
        return url;
    }

    function renderAudioList(){ //fonction pour afficher la liste
        audioList.innerHTML = '';
            selectedFiles.forEach((file, index) => {
                const item = document.createElement('div');
                item.dataset.status = "0";
                item.dataset.status = index == 0 ?  "1": "0" ;
                item.className = `file-item ${item.dataset.status === "1" ? 'active' : ''}`;
                item.innerHTML = `
                    <span class="file-icon"><i class="fa-solid fa-music"></i></span>
                    <span class="file-label" style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${file.name}</span>
                    <span class="file-remove"><i class="fa-solid fa-xmark"></i></span>
                `;

                //quand on suppr un fichier
                item.querySelector(".file-remove").addEventListener("click",()=>{
                    if(item.dataset.status == "1"){ //si on suppr une musique active...
                        selectedFiles.splice(index,1); //retirer le fichier du tab
                        setAudioFiles(selectedFiles)
                        renderAudioList(); //mise à jour
                        if(selectedFiles.length !== 0) playMusic(audioEl,0,document.querySelector(".file-list").firstChild);
                        else audioEl.pause();
                    }
                    else{
                        selectedFiles.splice(index,1); //retirer le fichier du tab
                        setAudioFiles(selectedFiles);
                        renderAudioList(); //mise à jour
                    }
                });

                //quand on clique sur une musique
                item.querySelector(".file-label").addEventListener("click",()=>{
                    if(item.dataset.status !== "1"){
                        document.querySelectorAll(".file-item").forEach((e)=>{
                            e.dataset.status = "0";
                            e.className = `file-item`;
                        })
                        item.dataset.status ="1"
                        item.className = `file-item ${item.dataset.status === "1" ? 'active' : ''}`;
                        playMusic(audioEl,index,item);                        
                    }
                })

                audioList.appendChild(item);
            });
    }

    function playMusic(audio,index,item){
        item.dataset.status ="1";
        item.className = `file-item ${item.dataset.status === "1" ? 'active' : ''}`;
        trackName.textContent = selectedFiles[index].name //le nom de la chanson en bas à droite
        stopLoop();
        //creer un url temporaire qui pointe vers le fichier choisi
        audio.src = getAudioSrc(index);
        audio.load()
        audio.play()
        console.log("La musique joue")
        playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
       console.log(smoothInput.value)
        setupAnalyser(); //prépare le tableu dataArray et le buffer (voir fonction plus bas)
        setRunning(true);
        loop(canvas, ctx); //demarer la boucle pour animer le visualiser (fonction définie en dessous)
        console.log()
    }

    setupControls(audioEl, playBtn, canvas, ctx);

    function setupDefaultColor(){
        setDefaultColor();
        setDefaultInputColor(primaryColor);
    }

})();