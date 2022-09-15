
export let getBoundsOfBboxRectangle = (center: { lat: number, lng: number }) => {
  // we could vary the size of the bbox dynamically here
  let [latPad, lngPad] = [0.02, 0.04]

  return {
    southWest: { lat: center.lat - latPad, lng: center.lng - lngPad },
    northEast: { lat: center.lat + latPad, lng: center.lng + lngPad },
  }
}
