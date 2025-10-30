const dialogspan = document.querySelector('body#index > dialog > span')! as HTMLSpanElement
const [randombutton, selectedbutton] = document.querySelectorAll("body#index > dialog > button") as NodeListOf<HTMLButtonElement>
const datalists = dialogspan.querySelectorAll("datalist") as NodeListOf<HTMLDataListElement>
const inputs = dialogspan.querySelectorAll("input") as NodeListOf<HTMLInputElement>

const stops: stops = await fetch("https://data.busrouter.sg/v1/stops.min.geojson").then(res => res.json())

function showselected() {
  dialogspan.style.display = 'inline'
  randombutton.style.display = "none"
  selectedbutton.textContent = "Confirm"
  datalists.forEach(datalist => {
    stops.features.forEach(feature => {
      const option = document.createElement("option")
      option.textContent = `${feature.properties.name} (${feature.id})`
      datalist.appendChild(option)
    })
  })
  selectedbutton.onclick = () => {
    const isvalid = Array.from(inputs)
    .map(input => input.value)
    .every(value => Array
      .from(datalists[0].options)
      .some(option => option.textContent == value)
    )

    if (!isvalid) {
      alert("Invalid bus stop. Choose from the options given.")
      return
    }

    localStorage.setItem("busstops", JSON.stringify(Array.from(inputs).map(input => input.value)))
    window.location.href = "game.html"
  }
}

function generatebuses() {
  const numberofstops = stops.features.length
  let startindex = Math.floor(Math.random()*numberofstops)
  let endindex = Math.floor(Math.random()*numberofstops)
  while (overlap(stops.features[startindex].properties.services,stops.features[endindex].properties.services)) {
    startindex = Math.floor(Math.random()*numberofstops)
    endindex = Math.floor(Math.random()*numberofstops)
  }
  localStorage.setItem("busstops", JSON.stringify([
    `${stops.features[startindex].properties.name} (${stops.features[startindex].id})`,
    `${stops.features[endindex].properties.name} (${stops.features[endindex].id})`
  ]))
  window.location.href = "game.html"
}

function overlap(a: any[], b: any[]) {
  const setA = new Set(a)
  return b.some(x => setA.has(x))
}

window.showselected = showselected
window.generatebuses = generatebuses

declare global {
  interface Window {
    showselected: () => void;
    generatebuses: () => void;
  }
}

export {}