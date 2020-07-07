
let btnGrabarAgain= document.getElementById('btn-grabar-giff');
let btnSubir= document.getElementById('btn-subir-giff');
let imgGif =document.getElementById('img-giff');
let title= document.getElementById('header-create');
document.getElementById('btnStart').addEventListener('click', function(){
    document.getElementById('welcome-container').style.display="none";
    document.getElementById('capture-container').style.display="block";
    setRecord();
})
let isRecording = false;
let record;
const videoRecord= document.getElementById('video-record');
function setRecord(){
    navigator.mediaDevices.getUserMedia({ //navigator= api permite acceder al microfono y a la cam
        audio: false,
        video: {
            height: {
                max: 480,

            }
        }
    }).then(function(stream){  //lo que captura en el momento
        videoRecord.srcObject= stream; //cambiar el src
        videoRecord.play()
        let btnCapture= document.getElementById('capture-record');
        btnCapture.addEventListener('click', function(){
            title.innerHTML+="Capturando tu Guifo";
            isRecording=!isRecording;
            if(isRecording){
                record=RecordRTC(stream,{ //genera el tipo de grabacion
                    type: 'gif',
                    frameRate: 1,
                    quality: 10,
                    width: 360,
                    hidden: 240,
                    onGifRecordingStarted: function(){ //temporizador
                        console.log('Grabando');
                    }
                } )
                record.startRecording();//empieza a grabar
                startTimer();
               btnCapture.innerHTML='Terminar'; 
               btnCapture.classList="btn-terminar";
               record.camera=stream; 
            }
            else{
                record.stopRecording(function(){
                    record.camera.stop();//camara para de grabar
                    let form= new FormData();//formulario para guardar el video y subirlo a la api
                    form.append('file', record.getBlob(), 'document.gif');//trabajador para generar el video
                    btnGrabarAgain.style.display="block";
                    btnSubir.style.display="block";
                    let urlGif= URL.createObjectURL(record.getBlob()); //generar la url de la preview
                    imgGif.src= urlGif; //cambiar el src a la imagen 
                    imgGif.style.display="block";
                    videoRecord.style.display="none";
                    btnCapture.style.display="none";
                    record.destroy(); //destruye la grabacion 
                    record=null;
                    btnSubir.addEventListener('click', async function(){
                        document.getElementById('img-giff').style.display="none";
                        document.getElementById('container-loading').style.display="flex";
                        animateSteps(document.getElementsByClassName('step-load'));
                        document.getElementById('actions-toolbar').style.display="none";
                        /* document.getElementById('capture-container').style.display="none" */
                        let gifID= await sendGiff(form)
                        document.getElementById('img-giff').style.display="block";
                        document.getElementById('container-loading').style.display="none";
                        document.getElementById('finish-actions').style.display="flex";
                        document.getElementById('container-finish').style.display="flex";
                        document.getElementById('img-giff').classList.add('miniature');
                        document.getElementById('copy-gif').addEventListener('click', async function(){
                                await navigator.clipboard.writeText(urlGif);
                                alert("Tu guifo ha sido copiado con exito");
                        })
                        document.getElementById('dowload-gif').addEventListener('click', function() {
                            fetch(urlGif).then(function(response) {
                                return response.blob().then((url)=>{
                                    let a = document.createElement("a");
                                    a.href = URL.createObjectURL(url);
                                    a.setAttribute("download", 'mygif.gif');
                                    a.click();
                                }
                                );
                            });
                            }
                        )
                        
                        getPersonalGiff(gifID);



                    })

            }
            )}
        })
    })
}
let contador = 0;
function animateSteps(step) {
    setInterval(() => {
      if (contador < step.length) {
        step.item(contador).classList.toggle('step-load-active')
        contador++;
      } else {
        contador = 0;
      }
    }, 300)
} 
async function sendGiff(giff){
    console.log(giff);
  let postGif=  await fetch('https://upload.giphy.com/v1/gifs?api_key=ix1BLWrWqAyVCAN4QoNYxEQuBNxw3Mdl', {
       method: 'POST',
       headers:{
        'Access-Control-Allow-Origin':'*'
       },
           
       body: giff,
   })
   .then(response => response.json())
    .then((data) =>  data.data)
    return postGif;
}
function getPersonalGiff(ID){
     fetch('https://api.giphy.com/v1/gifs/'+ID.id+'?api_key=ix1BLWrWqAyVCAN4QoNYxEQuBNxw3Mdl')
    .then(response => response.json())
    .then((data)=>{
        const url=data.data.url;
        localStorage.setItem('gif'+ID.id, JSON.stringify(data.data))
    })
}
function startTimer(){
    
    let minuto=0;
    let segundo=0;
    let timer= setInterval(()=>{     
    if(isRecording){
        if(segundo<60){
            if(segundo<10){
                segundo ='0'+segundo;
            }
            let contador= document.getElementById('contador');
            
            contador.style.visibility="visible";
            contador.innerHTML= `00:00:0${minuto}:${segundo}`;
            segundo++;
        }
        else{
            minuto++;
            segundo=0;
        }

    }
    else{
        clearInterval(timer);
    }
    }, 1000)
        
}

    window.addEventListener('load', function(){
        let gifs=[];
        for(let i=0;i<localStorage.length;i++ ){
            let gif= localStorage.getItem(localStorage.key(i))
            gif=JSON.parse(gif);
            if(gif && gif.images){
            gifs.push(gif)
            }
        }
        gifs.forEach(gif=>{
        document.getElementById('wrapper-my-giff').innerHTML+=
		`
			
            <div class="container-my-gif>
                <div class="personal-gif>
				    <img class="my-giff-giff"src="${gif.images.original.url}" alt="gif">
                </div>
            </div>
	    `
			
        })

    })


