// Firebase config
const firebaseConfig = {

apiKey: "YOUR_KEY",
authDomain: "YOUR_PROJECT.firebaseapp.com",
databaseURL: "YOUR_DATABASE_URL",
projectId: "YOUR_PROJECT_ID",
storageBucket: "YOUR_BUCKET",
messagingSenderId: "XXXX",
appId: "XXXX"

};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const bosses=["scald","berserker","vulva","warlord"];

function getCooldown(){

let mode=document.getElementById("mode").value;

if(mode==="normal"){
return 8*3600;
}

return 2*3600;

}

function getPath(boss){

let floor=document.getElementById("floor").value;
let mode=document.getElementById("mode").value;

return `timers/floor${floor}/${mode}/${boss}`;

}

function startTimer(boss){

let cooldown=getCooldown();
let end=Date.now()+cooldown*1000;

db.ref(getPath(boss)).set(end);

}

function resetTimer(boss){

db.ref(getPath(boss)).remove();

}

function updateTimers(){

let now=Date.now();

bosses.forEach(boss=>{

let path=getPath(boss);

db.ref(path).on("value",snap=>{

let end=snap.val();

if(!end){

document.getElementById(boss).innerText="READY";
return;

}

let remaining=Math.floor((end-now)/1000);

if(remaining<=0){

document.getElementById(boss).innerText="READY";

}else{

let h=Math.floor(remaining/3600);
let m=Math.floor((remaining%3600)/60);
let s=remaining%60;

document.getElementById(boss).innerText=
`${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;

}

});

});

}

setInterval(updateTimers,1000);

document.getElementById("floor").addEventListener("change",updateTimers);
document.getElementById("mode").addEventListener("change",updateTimers);
