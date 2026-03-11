// async function analyzeImage(){

// let file=document.getElementById("imageInput").files[0]

// if(!file){

// alert("Upload image first")

// return
// }

// navigator.geolocation.getCurrentPosition(async function(position){

// let lat=position.coords.latitude
// let lon=position.coords.longitude

// let formData=new FormData()

// formData.append("image",file)
// formData.append("lat",lat)
// formData.append("lon",lon)

// let response=await fetch("/analyze",{

// method:"POST",
// body:formData

// })

// let data=await response.json()

// document.getElementById("resultBox").innerText=data.result

// // risk score detect

// let match=data.result.match(/\d+/)

// if(match){

// let score=match[0]

// let risk=100-score

// document.getElementById("riskBar").style.width=risk+"%"

// }

// })

// }


const video=document.getElementById("camera")

navigator.mediaDevices.getUserMedia({video:true})
.then(stream=>{
video.srcObject=stream
})


async function analyzeImage(){

let file=document.getElementById("imageInput").files[0]

if(!file){
alert("Upload image")
return
}

document.getElementById("loader").style.display="block"

navigator.geolocation.getCurrentPosition(async function(position){

let lat=position.coords.latitude
let lon=position.coords.longitude

let formData=new FormData()

formData.append("image",file)
formData.append("lat",lat)
formData.append("lon",lon)

let response=await fetch("/analyze",{

method:"POST",
body:formData

})

let data=await response.json()

document.getElementById("loader").style.display="none"

document.getElementById("resultBox").innerText=data.result

let scoreMatch=data.result.match(/\d+/)

if(scoreMatch){

let score=scoreMatch[0]

let risk=100-score

document.getElementById("riskBar").style.width=risk+"%"

}

})

}



async function captureFrame(){

let canvas=document.createElement("canvas")

canvas.width=video.videoWidth
canvas.height=video.videoHeight

let ctx=canvas.getContext("2d")

ctx.drawImage(video,0,0)

canvas.toBlob(async function(blob){

let formData=new FormData()

formData.append("image",blob,"camera.jpg")

let response=await fetch("/analyze",{

method:"POST",
body:formData

})

let data=await response.json()

document.getElementById("resultBox").innerText=data.result

})

}
function copyComplaint(){
    let text=document.getElementById("resultBox").innerText
    navigator.clipboard.writeText(text)
    alert("Complaint letter copied to clipboard!")
}

async function sendMessage(){

let input=document.getElementById("userInput")

let message=input.value

let chat=document.getElementById("chatMessages")

chat.innerHTML+="<p><b>You:</b> "+message+"</p>"

let response=await fetch("/chat",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

message:message

})

})

let data=await response.json()

chat.innerHTML+="<p><b>AI:</b> "+data.reply+"</p>"

input.value=""

}