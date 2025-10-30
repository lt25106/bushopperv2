import { Map, MapStyle, config, Marker, helpers, GeoJSONSource, LngLat } from "@maptiler/sdk"
import { initializeApp } from "firebase/app"
import { getDatabase, set, ref, get } from "firebase/database"
import { firebaseConfig } from "./firebaseconfig.c.js"

const [routes, services, stops]: [routes, services, stops] = await Promise.all([
  fetch("https://data.busrouter.sg/v1/routes.min.geojson").then(res => res.json()),
  fetch("https://data.busrouter.sg/v1/services.min.json").then(res => res.json()),
  fetch("https://data.busrouter.sg/v1/stops.min.geojson").then(res => res.json())
])

initializeApp(firebaseConfig)
const db = getDatabase()

config.apiKey = 'iBKpu3YshpPXQzg7ZH1Y'
const map = new Map({
  container: 'map', // container id
  style: MapStyle.DATAVIZ.DARK,
  center: [103.8198, 1.3521], // starting position [lng, lat]
  zoom: 9 // starting zoom
})

map.on("ready", e => {
  map.setProjection({type: 'globe'})
})

const popup = document.getElementById("popup") as HTMLDivElement
const h1 = popup.querySelector("h1") as HTMLHeadingElement
const span = popup.querySelector("span") as HTMLSpanElement
const dialog = document.querySelector("dialog") as HTMLDialogElement
const confirm = popup.querySelector("button")!

const currentbustops: Busstop[] = []
let currentbusroute: Busroute | undefined

function cleanbusstops() {
  currentbustops.forEach(busstop => {
    if (!allowedmarkers.includes(busstop)) {
      busstop.removemarker()
    }
    busstop.removelistener()
  })
}

class Busstop {
  id: string
  name: string
  lnglatcoords: point
  services: string[]
  color: string
  marker?: Marker

  constructor(stopid: string, color: hsl,name?: string) {
    const fullbusstop = stops.features.find(feature => feature.id == stopid)!
    this.id = stopid
    this.name = name ? name : fullbusstop.properties.name
    this.lnglatcoords = fullbusstop.geometry.coordinates
    this.services = fullbusstop.properties.services
    this.onclicked = this.onclicked.bind(this)
    this.color = color
    currentbustops.push(this)
  }

  onclicked() {
    allowedmarkers.push(this)
    stoproute.push(this)
    h1.textContent = this.name
    const opposite = this.opposite() ? "<button>Opp</button>" : ""
    span.innerHTML = `${opposite}<button>${this.services.join("</button><button>")}</button>`
    popup.style.bottom = "0"
    cleanbusstops()
    span.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", e => {
        const busroute = new Busroute(button.textContent)
        busroute.addroute()
        if (!allowedbusroutes.includes(currentbusroute!)) currentbusroute?.removeroute()
        currentbusroute = busroute
        confirm.style.display = "inline"
      })
    })

    if (!currentbusroute) return
    currentbusroute.croproute(allowedmarkers.at(-2)!.lnglatcoords,this.lnglatcoords)
  }

  addmarker() {
    this.marker = new Marker({ color: this.color }).setLngLat(this.lnglatcoords).addTo(map)
    this.marker.getElement().addEventListener("click", this.onclicked)
    if (this.color == "hsl(76, 59%, 53%)") this.marker.getElement().style.zIndex = "1"
  }

  removemarker() { this.marker?.remove() }
  removelistener() {
    this.marker!.getElement().removeEventListener("click", this.onclicked)
  }

  opposite() {
    if (this.id.at(-1) == "1") {
      return stops.features.find(feature => feature.id.slice(0,4) == this.id.slice(0,4) && feature.id[4] == "9")
    }
    if (this.id.at(-1) == "9") {
      return stops.features.find(feature => feature.id.slice(0,4) == this.id.slice(0,4) && feature.id[4] == "1")
    }
    return
  }
}

class Busroute {
  num: string
  lnglatpoints: line
  stops: string[][]
  routeonmap?: helperpolyline

  constructor(busnum: string) {
    if (busnum == "Opp") {
      this.num = busnum
      this.lnglatpoints = [allowedmarkers.at(-1)!.lnglatcoords,allowedmarkers.at(-1)!.opposite()!.geometry.coordinates]
      this.stops = [[allowedmarkers.at(-1)!.id,allowedmarkers.at(-1)!.opposite()!.id]]
      return
    }
    const fullbusroute = routes.features.filter(feature => feature.properties.number == busnum)!
    this.num = busnum
    if (fullbusroute.length == 1 || services[busnum].routes[0].includes(allowedmarkers.at(-1)!.id)) this.lnglatpoints = fullbusroute[0].geometry.coordinates
    else this.lnglatpoints = fullbusroute[1].geometry.coordinates
    this.stops = services[busnum].routes

  }

  async addroute() {
    const geoJson: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: null,
          geometry: {
            type: "LineString",
            coordinates: this.lnglatpoints
          }
        }
      ]
    }

    this.routeonmap = await helpers.addPolyline(map, {
      data: geoJson,
      lineColor: `hsl(${Math.random()*360}, 59%, 53%)`
    })
  }

  async croproute(point1: point,point2: point) {
    const routesource = <GeoJSONSource>map.getSource(this.routeonmap!.polylineSourceId)
    const index1 = this.closestindexonpolyline(point1,this.lnglatpoints)
    const index2 = this.closestindexonpolyline(point2,this.lnglatpoints)
    await routesource.setData({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: null,
          geometry: {
            type: "LineString",
            coordinates: index1 > index2 ? this.lnglatpoints.slice(index2,index1 + 1) : this.lnglatpoints.slice(index1,index2 + 1)
          }
        }
      ]
    })
  }

  closestindexonpolyline(lnglatpoint: point, lnglatpolyline: line) {
    let closestIndex = 0
    let closestDistance = Infinity
  
    lnglatpolyline.forEach((point, index) => {
      const pointA = new LngLat(...lnglatpoint)
      const pointB = new LngLat(...point)
      const distance = pointA.distanceTo(pointB) // Distance in meters
  
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })
  
    return closestIndex
  }

  removeroute() {
    map.removeLayer(this.routeonmap!.polylineLayerId)
  }

  distance() {
    let totaldistance = 0
    for (let i = 0; i < this.lnglatpoints.length - 1; i++) {
      const start = new LngLat(...this.lnglatpoints[i])
      const end = new LngLat(...this.lnglatpoints[i + 1])
      totaldistance += start.distanceTo(end)
    }
    return totaldistance
  }
}

function getstopidandname(stringfromlocal: string): [string,hsl,string] {
  const id = stringfromlocal.slice(-6,-1)
  const name = stringfromlocal.split("(")[0].trim()
  return [id,"hsl(76, 59%, 53%)",name]
}

function confirmbus() {
  popup.style.bottom = `-${popup.scrollHeight}px`
  allowedbusroutes.push(currentbusroute!)
  const direction = (currentbusroute?.stops.length == 1 || currentbusroute?.stops[0].find(stop => stop == currentbustops[0].id)) ? 0 : 1

  currentbusroute?.stops[direction].forEach(busstop => {
    if (busstop == startbusstop.id) {
      busstopreached.start = true
      if (busstopreached.start && busstopreached.end) win()
      return
    }
    if (busstop == endbusstop.id) {
      busstopreached.end = true
      if (busstopreached.start && busstopreached.end) win()
      return
    }
    if (busstopreached.start && busstopreached.end) return
    new Busstop(busstop,"hsl(256, 59%, 53%)").addmarker()
  })
}

function win() {
  const routeshown: string[] = []
  const laststop = stoproute[0] == endbusstop ? startbusstop : endbusstop
  stoproute.push(laststop)
  currentbusroute?.croproute(allowedmarkers.at(-1)!.lnglatcoords,laststop.lnglatcoords)

  for (let i = 0; i < stoproute.length; i++) {
    routeshown.push(stoproute[i].name)
    if (allowedbusroutes[i]) routeshown.push(allowedbusroutes[i].num)
  }

  h1.style.fontFamily = "sans-serif"
  h1.style.fontWeight = "lighter"
  h1.textContent = "You win! Your route: "
  span.textContent = routeshown.join(" → ")
  confirm.textContent = "Add to Leaderboard"
  confirm.onclick = async () => {
    const name = localStorage.getItem("name") || span.querySelector("input")?.value
    if (name) {
      if (!localStorage.getItem("name")) localStorage.setItem("name", span.querySelector("input")!.value)
      await writetodb(name)
      return
    }
    h1.textContent = "Set name:"
    span.innerHTML = "<input><br>"
  }
  popup.style.bottom = "0"
  cleanbusstops()
}

async function writetodb(name: string) {
  const existingpath = await get(ref(db,`leaderboard/${endbusstop.id} → ${startbusstop.id}`))
  const finalpath = existingpath 
  ? `${endbusstop.id} → ${startbusstop.id}` 
  : `${startbusstop.id} → ${endbusstop.id}`

  let distance = 0
  allowedbusroutes.forEach(busroute => {
    distance += busroute.distance()
  })

  const data: game = {
    stops: stoproute.map(stop => stop.id),
    buses: allowedbusroutes.map(busroute => busroute.num),
    time: Date.now(),
    distance
  }

  try {
    await set(ref(db,`leaderboard/${finalpath}/${name}`),data)
    h1.textContent = "Success!"
  } catch (error) {
    console.log(error)
    h1.textContent = "Shorter distance found."
  } finally {
    confirm.remove()
    span.innerHTML = "<a href='leaderboard.html'><button>Check Leaderboard</button></a>"
  }
}

window.confirmbus = confirmbus
declare global {
  interface Window {
    confirmbus: () => void;
  }
}

const [startstring, endstring] = JSON.parse(localStorage.getItem("busstops")!)

const startbusstop = new Busstop(...getstopidandname(startstring))
const endbusstop = new Busstop(...getstopidandname(endstring))

startbusstop.addmarker()
endbusstop.addmarker()

const allowedmarkers = [startbusstop,endbusstop]
const allowedbusroutes: Busroute[] = []
const busstopreached = {
  start: false,
  end: false
}
const stoproute: Busstop[] = []