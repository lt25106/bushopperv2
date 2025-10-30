import { initializeApp } from "firebase/app"
import { onValue, getDatabase, ref } from "firebase/database"
import { firebaseConfig } from "./firebaseconfig.c.js"

initializeApp(firebaseConfig)
const db = getDatabase()

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

  for (const [playername,routes] of Object.entries(byplayer)) {
    let table = ""
    for (const [name,route] of Object.entries(routes)) {
      const routeshown = []
      for (let i = 0; i < route.stops.length; i++) {
        routeshown.push(idtoname(route.stops[i]))
        if (route.buses[i]) routeshown.push(route.buses[i])
      }
      const datetime = new Date(route.time)
      table += `
      <tr>
        <td>
          ${idtoname(name.split(" → ")[0])} → ${idtoname(name.split(" → ")[1])}<br>
          <span>
            ${(route.distance/1000).toFixed(1)}km<br>
            ${datetime.toLocaleDateString("en-GB")}<br>
            ${datetime.toLocaleTimeString("en-GB")}
          </span>
        </td>
        <td>${routeshown.join(" → ")}</td>
      </tr>
      `
    }
    div.innerHTML += `
    <h1>${playername}</h1>
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

function idtoname(id: string) {
  return stops.features.find(feature => feature.id == id)!.properties.name
}