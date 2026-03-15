const SUPABASE_URL="https://fmgmwkacearosppillyc.supabase.co"
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtZ213a2FjZWFyb3NwcGlsbHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NjQ3ODksImV4cCI6MjA4OTE0MDc4OX0.0biWvboYfON0kH-tesaKu2vUStbsH-r0Zahh8NYyqHY"
const WEBHOOK="https://discord.com/api/webhooks/1482770887886503947/VEpm8ajXgiGM1C24UsGC2BkQswsgnFLb3f4V5dtw0QGCJZwEXgn6LLwTG9TBqQ7y6Zo-"


const supabaseClient = supabase.createClient(SUPABASE_URL,SUPABASE_KEY)

const bosses=["scald","berserker","vulva","warlord"]

function cooldown(){

let mode=document.getElementById("mode").value

if(mode==="normal") return 8*3600
return 2*3600

}

async function startTimer(boss){

let floor=document.getElementById("floor").value
let mode=document.getElementById("mode").value
let player=document.getElementById("player").value || "Unknown"

let end=Date.now()+cooldown()*1000

await supabaseClient
.from("timers")
.upsert({
boss:boss,
floor:floor,
mode:mode,
player:player,
end_time:end
})

}

async function resetTimer(boss){

let floor=document.getElementById("floor").value
let mode=document.getElementById("mode").value

await supabaseClient
.from("timers")
.delete()
.match({boss:boss,floor:floor,mode:mode})

}

async function updateTimers(){

let floor=document.getElementById("floor").value
let mode=document.getElementById("mode").value

let {data}=await supabaseClient
.from("timers")
.select("*")
.eq("floor",floor)
.eq("mode",mode)

bosses.forEach(boss=>{

let record=data.find(x=>x.boss===boss)

if(!record){

document.getElementById(boss).innerText="READY"
document.getElementById(boss+"_bar").style.width="0%"
document.getElementById(boss+"_by").innerText=""

return

}

let total=cooldown()
let remaining=Math.floor((record.end_time-Date.now())/1000)

if(remaining<=0){

document.getElementById(boss).innerText="READY"
document.getElementById(boss+"_bar").style.width="0%"
document.getElementById(boss+"_by").innerText=""

}else{

let h=Math.floor(remaining/3600)
let m=Math.floor((remaining%3600)/60)
let s=remaining%60

document.getElementById(boss).innerText=
`${h}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`

let percent=100-(remaining/total*100)

document.getElementById(boss+"_bar").style.width=percent+"%"

document.getElementById(boss+"_by").innerText="Started by "+record.player

}

})

}

setInterval(updateTimers,1000)
