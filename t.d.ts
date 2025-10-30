type point = [number, number]
type line = point[]
type routes = {
  type: "FeatureCollection",
  features: {
    type: "Feature",
    properties: {
      number: string,
      pattern: number
    },
    geometry: {
      type: "LineString",
      coordinates: line
    }
  }[]
}
type services = {
  [servicenumber: string]: {
    name: string,
    routes: string[][]
  }
}
type stops = {
  type: "FeatureCollection",
  features: {
    type: "Feature",
    id: string,
    properties: {
      number: string,
      name: string,
      road: string,
      services: string[]
    },
    geometry: {
      type: "Point",
      coordinates: point
    }
  }[]
}
type helperpolyline = {
  polylineLayerId: string
  polylineOutlineLayerId: string
  polylineSourceId: string
}
type hsl = `hsl(${string},${string}%,${string}%)`
type leaderboard = {
  [route: string]: {
    [name: string]: game
  }
}
type game = {
  buses: string[]
  distance: number
  stops: string[]
  time: number
}
type byplayer = {
  [player: string]: {
    [routes: string]: game
  }
}