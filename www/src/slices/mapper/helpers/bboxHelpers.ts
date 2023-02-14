import { frameworks } from '../../../frameworks'
import { Framework } from '../types'

export let getBoundsOfBboxRectangle = (center: { lat: number, lng: number }, currentFramework: Framework) => {
  let padding = currentFramework.bboxPadding
  return {
    southWest: { lat: center.lat - padding.latPad, lng: center.lng - padding.lngPad },
    northEast: { lat: center.lat + padding.latPad, lng: center.lng + padding.lngPad },
  }
}
