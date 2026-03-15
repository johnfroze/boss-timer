let bosses = ["scald","berserker","vulva","warlord"];

function getCooldown(){

let mode = document.getElementById("mode").value;

if(mode === "normal"){
return 8 * 3600;
}

return 2 * 3600;

}

function getKey(boss){

let floor = document.getElementById("floor").value;
let mode = document.getElementById("mode").value;

return `${floor}_${mode}_${boss}`;

}

function startTimer(boss){

let cooldown = getCooldown();
let end = Date.now() + cooldown*1000;

let key = getKey(boss);

localStorage.setItem(key,end);

}

function resetTimer(boss){

let key = getKey(boss);

localStorage.removeItem(key);

}

function updateTimers(){

let now = Date.now();

bosses.forEach(boss=>{

let key = getKey(boss);

let end = localStorage.getItem(key);

if(!end){

document.getElementById(boss).innerText="READY";
return;

}

let remaining = Math.floor((end-now)/1000);

if(remaining<=0){

document.getElementById(boss).innerText="READY";

localStorage.removeItem(key);

notifyBoss(boss);

return;

}

let h=Math.floor(remaining/3600);
let m=Math.floor((remaining%3600)/60);
let s=remaining%60;

document.getElementById(boss).innerText=
`${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;

});

}

function notifyBoss(boss){

if(Notification.permission==="granted"){

new Notification(`${boss} has respawned!`);

}

}

if(Notification.permission!=="granted"){
Notification.requestPermission();
}

setInterval(updateTimers,1000);

document.getElementById("floor").addEventListener("change",updateTimers);
document.getElementById("mode").addEventListener("change",updateTimers);
