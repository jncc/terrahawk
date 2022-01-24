
export let getBoundsOfBboxRectangle = (center: { lat: number, lng: number }) => {
  // we could vary the size of the bbox dynamically here
  let [latPad, lngPad] = [0.03, 0.06]

  return {
    southWest: { lat: center.lat - latPad, lng: center.lng - lngPad },
    northEast: { lat: center.lat + latPad, lng: center.lng + lngPad },
  }
}
