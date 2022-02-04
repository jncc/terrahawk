export function getMarkerColour(match: boolean) {
  let markerColour = '#8c8c8c' // grey

  if (match) {
    markerColour = '#4e9455' // green
  }

  return markerColour
}