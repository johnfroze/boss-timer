const SUPABASE_URL = "https://fmgmwkacearosppillyc.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtZ213a2FjZWFyb3NwcGlsbHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NjQ3ODksImV4cCI6MjA4OTE0MDc4OX0.0biWvboYfON0kH-tesaKu2vUStbsH-r0Zahh8NYyqHY"

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

const bosses = ["scald","berserker","vulva","warlord"]

function getCooldown(){

const mode = document.getElementById("mode").value

if(mode === "normal"){
return 8 * 3600
}

return 2 * 3600

}

async function startTimer(boss){

const floor = document.getElementById("floor").value
const mode = document.getElementById("mode").value

const end = Date.now() + getCooldown() * 1000

await supabaseClient
.from("timers")
.upsert({
boss: boss,
floor: floor,
mode: mode,
end_time: end
})

}

async function resetTimer(boss){

const floor = document.getElementById("floor").value
const mode = document.getElementById("mode").value

await supabaseClient
.from("timers")
.delete()
.match({
boss: boss,
floor: floor,
mode: mode
})

}

async function updateTimers(){

const floor = document.getElementById("floor").value
const mode = document.getElementById("mode").value

const { data } = await supabaseClient
.from("timers")
.select("*")
.eq("floor", floor)
.eq("mode", mode)

bosses.forEach(boss => {

const record = data.find(t => t.boss === boss)

if(!record){
document.getElementById(boss).innerText = "READY"
return
}

let remaining = Math.floor((record.end_time - Date.now()) / 1000)

if(remaining <= 0){

document.getElementById(boss).innerText = "READY"

}else{

let h = Math.floor(remaining/3600)
let m = Math.floor((remaining%3600)/60)
let s = remaining%60

document.getElementById(boss).innerText =
`${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`

}

})

}

setInterval(updateTimers,1000)
