import { colourScales} from './config'
import { Canvas } from 'canvas'

/*
    Hacked logic from plotty (https://github.com/santilland/plotty)
    because the library doesn't work server side
*/

export function renderColorScaleToCanvas(name : string, canvas : Canvas) {
    /* eslint-disable no-param-reassign */
    const csDef = colourScales.find(c => c.name == name)
    canvas.height = 1
    const ctx = canvas.getContext('2d')
  
    if (csDef) {
      canvas.width = 256
      const gradient = ctx.createLinearGradient(0, 0, 256, 1)
  
      for (let i = 0; i < csDef.colours.length; ++i) {
        gradient.addColorStop(csDef.positions[i], csDef.colours[i])
      }
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 256, 1)
    } else {
      throw new Error('Color scale not defined.')
    }
    /* eslint-enable no-param-reassign */
  }
  
export function renderWithColourScale(canvas : Canvas,
    colorScaleCanvas : Canvas,
    noDataValue : number,
    data : any[],
    height : number,
    width : number,
    domain : number[]) {

    const clampHigh = true
    const clampLow = true
  
    canvas.width = width
    canvas.height = height
  
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
  
    const imageData = ctx.createImageData(w, h)
  
    const trange = domain[1] - domain[0]
    const steps = colorScaleCanvas.width
    const csImageData = colorScaleCanvas.getContext('2d').getImageData(0, 0, steps, 1).data
    let alpha
  
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w) + x
        // TODO: Possible increase of performance through use of worker threads?
  
        let c = Math.floor(((data[i] - domain[0]) / trange) * (steps - 1))
        alpha = 255
        if (c < 0) {
          c = 0
          if (!clampLow) {
            alpha = 0
          }
        } else if (c > 255) {
          c = 255
          if (!clampHigh) {
            alpha = 0
          }
        }
        // NaN values should be the only values that are not equal to itself
        if (data[i] === noDataValue || data[i] !== data[i]) {
          alpha = 0
        }
  
        const index = ((y * w) + x) * 4
        imageData.data[index + 0] = csImageData[c * 4]
        imageData.data[index + 1] = csImageData[(c * 4) + 1]
        imageData.data[index + 2] = csImageData[(c * 4) + 2]
        imageData.data[index + 3] = Math.min(alpha, csImageData[(c * 4) + 3])
      }
    }
  
    ctx.putImageData(imageData, 0, 0) // at coords 0,0
  }