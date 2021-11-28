
import { createCanvas } from 'canvas'
import { getBoundingBoxWithBuffer, getThumbnail } from './thumbnails/thumbnailGenerator'

export const getThumb = async (args: any) => {

  console.log(`At ${(new Date()).toISOString()} - entering function`)

  // let canvas = createCanvas(200, 200)

  // let ctx = canvas.getContext('2d')
  // ctx.fillStyle = 'green';
  // ctx.fillRect(10, 10, 150, 100);

  // return canvas.createPNGStream()


   let frame = 'S2A_20200206_lat54lon066_T30UXE_ORB137_utm30n_osgb'
   let unnecessaryPolyid = '712395'
   let box = [501483.46637888433, 502286.5142532888, 422093.4853378338, 422896.5332122383]


   let thumbCanvas = getThumbnail(frame, box, 'trueColour')
   return (await thumbCanvas).createPNGStream()
}
