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
  const bydate: bydate = {}
  for (const [route,attempts] of Object.entries(leaderboard)) {
    for (const [uid,routepath] of Object.entries(attempts)) {
      const date = new Date(routepath.time).toLocaleDateString("en-GB")
      if (!bydate[date]) bydate[date] = []
      bydate[date].push({...routepath, uid, route})
    }
  }
  for (const [date,routes] of Object.entries(bydate)) {
    let table = ""
    routes.forEach(route => {
      const routeshown = []
      for (let i = 0; i < route.stops.length; i++) {
        routeshown.push(idtoname(route.stops[i]))
        if (route.buses[i]) routeshown.push(route.buses[i])
      }

      const date = new Date(route.time)
      table += `
      <tr>
        <td>
          <span onclick="startgame('${route.route}')">        
            ${idtoname(route.route.split(" → ")[0])} → ${idtoname(route.route.split(" → ")[1])}
          </span><br><br>
          <details>
            <summary>${allusers[route.uid].name}</summary>
            ${(route.distance/1000).toFixed(1)}km<br>
            ${date.toLocaleDateString("en-GB")}<br>
            ${date.toLocaleTimeString("en-GB")}
          </details>
        </td>
        <td>${routeshown.join(" → ")}</td>
      </tr>
      `
    })
    div.innerHTML += `
    <h1>${date}</h1>
    <table>
      <tbody>
        ${table}
      <tbody>
    </table>
    `
  }
})

const stops: stops = await fetch("https://data.busrouter.sg/v1/stops.min.geojson").then(res => res.json())
const div = document.querySelector("body > div") as HTMLDivElement

function idtoname(id: string) {
  return stops.features.find(feature => feature.id == id)!.properties.name
}

function startgame(route: string) {
  const start = idtoname(route.split(" → ")[0]) + ` (${route.split(" → ")[0]})`
  const end = idtoname(route.split(" → ")[1]) + ` (${route.split(" → ")[1]})`
  localStorage.setItem("busstops",JSON.stringify([start,end]))
  window.location.href = "game.html"
}

window.startgame = startgame

declare global {
  interface Window {
    startgame: (arg0: string) => void;
  }
}