import { frameworks } from '../../../frameworks'

export let getBoundsOfBboxRectangle = (center: { lat: number, lng: number }, framework: string) => {
  let padding = frameworks[framework].bboxPadding
  return {
    southWest: { lat: center.lat - padding.latPad, lng: center.lng - padding.lngPad },
    northEast: { lat: center.lat + padding.latPad, lng: center.lng + padding.lngPad },
  }
}
