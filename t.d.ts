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
type game = {
  buses: string[]
  distance: number
  stops: string[]
  time: number
}
type leaderboard = {
  [route: string]: {
    [uid: string]: game
  }
}
type byplayer = {
  [player: string]: {
    [routes: string]: game
  }
}
type bydate = {
  [date: string]: {
    buses: string[]
    distance: number
    stops: string[]
    uid: string
    route: string
    time: number
  }[]
}
type allusers = {
  [uid: string]: {
    name: string
  }
}