import { initializeApp } from "firebase/app"
import { onValue, getDatabase, ref } from "firebase/database"
import { firebaseConfig } from "./firebaseconfig.c.js"

initializeApp(firebaseConfig)
const db = getDatabase()

onValue(ref(db,"leaderboard"), snapshot => {
  div.innerHTML = ""
  const leaderboard: leaderboard = snapshot.val()
  for (const [route,attempts] of Object.entries(leaderboard)) {
    let table = ""
    for (const [name,path] of Object.entries(attempts)) {
      const routeshown: string[] = []
      for (let i = 0; i < path.stops.length; i++) {
        routeshown.push(idtoname(path.stops[i]))
        if (path.buses[i]) routeshown.push(path.buses[i])
      }
    const datetime = new Date(path.time)
      table += `
      <tr>
        <td>${name}<br>${(path.distance/1000).toFixed(1)}km<br>${datetime.toLocaleDateString("en-GB")}<br>${datetime.toLocaleTimeString("en-GB")}</td>
        <td>${routeshown.join(" → ")}</td>
      </tr>
      `
    }
  
    div.innerHTML += `
    <h1>${idtoname(route.split(" → ")[0])} → ${idtoname(route.split(" → ")[1])}</h1>
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