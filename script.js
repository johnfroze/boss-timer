const cooldown = 7200;

let timers = {};

function startTimer(boss){

let end = Date.now() + cooldown * 1000;

timers[boss] = end;

localStorage.setItem(boss,end);

}

function updateTimers(){

let now = Date.now();

["scald","berserker","vulva","warlord"].forEach(boss=>{

let end = timers[boss] || localStorage.getItem(boss);

if(!end){
document.getElementById(boss).innerText="READY";
return;
}

let remaining = Math.floor((end-now)/1000);

if(remaining<=0){

document.getElementById(boss).innerText="READY";

notifyBoss(boss);

localStorage.removeItem(boss);

timers[boss]=null;

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