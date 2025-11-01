import { initializeApp } from "firebase/app"
import { onValue, getDatabase, ref } from "firebase/database"
import { firebaseConfig } from "./firebaseconfig.c.js"
import "./searchbar.c.js"

initializeApp(firebaseConfig)
const db = getDatabase()

let allusers: allusers
onValue(ref(db,"users"), snapshot => {
  allusers = snapshot.val()
})

onValue(ref(db,"leaderboard"), snapshot => {
  div.innerHTML = ""
  const leaderboard: leaderboard = snapshot.val()
  const byplayer: byplayer = {}
  for (const [route,attempts] of Object.entries(leaderboard)) {
    for (const [playername,path] of Object.entries(attempts)) {
      if (!byplayer[playername]) byplayer[playername] = {}
      byplayer[playername][route] = path
    }
  }

  for (const [uid,routes] of Object.entries(byplayer)) {
    let table = ""
    for (const [name,route] of Object.entries(routes)) {
      const routeshown = []
      for (let i = 0; i < route.stops.length; i++) {
        routeshown.push(busidtoname(route.stops[i]))
        if (route.buses[i]) routeshown.push(route.buses[i])
      }
      const datetime = new Date(route.time)
      table += `
      <tr>
        <td>
          <span onclick="startgame('${name}')">        
            ${busidtoname(name.split(" → ")[0])} → ${busidtoname(name.split(" → ")[1])}
          </span><br>
          <details>
            <summary>${datetime.toLocaleDateString("en-GB")}</summary>
            ${(route.distance/1000).toFixed(1)}km<br>
            ${datetime.toLocaleTimeString("en-GB")}
          </details>
        </td>
        <td>${routeshown.join(" → ")}</td>
      </tr>
      `
    }
    div.innerHTML += `
    <h1>${allusers[uid].name.replace(/[<>]/g, "")}</h1>
    <table>
      <tbody>
        ${table}
      </tbody>
    </table>
    `
  }
})

const stops: stops = await fetch("https://data.busrouter.sg/v1/stops.min.geojson").then(res => res.json())
const div = document.querySelector("body > div") as HTMLDivElement

function busidtoname(id: string) {
  return stops.features.find(feature => feature.id == id)!.properties.name
}

function startgame(route: string) {
  const start = busidtoname(route.split(" → ")[0]) + ` (${route.split(" → ")[0]})`
  const end = busidtoname(route.split(" → ")[1]) + ` (${route.split(" → ")[1]})`
  localStorage.setItem("busstops",JSON.stringify([start,end]))
  window.location.href = "game.html"
}

window.startgame = startgame

declare global {
  interface Window {
    startgame: (arg0: string) => void;
  }
}