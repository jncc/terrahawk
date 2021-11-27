
import { createCanvas } from 'canvas'
import { getThumbnail } from './thumbnails/thumbnailGenerator'

export const getThumb = async (args: any) => {

  console.log(`At ${(new Date()).toISOString()} - entering function`)

  let canvas = createCanvas(200, 200)

  let ctx = canvas.getContext('2d')
  ctx.fillStyle = 'green';
  ctx.fillRect(10, 10, 150, 100);

   return canvas.createPNGStream()

// 
// 

   // https://dap.ceda.ac.uk/neodc/sentinel_ard/data/sentinel_2/2020/03/27/S2A_20200327_lat54lon066_T30UXE_ORB137_utm30n_osgb_vmsk_sharp_rad_srefdem_stdsref.tif
  //  let xx = getThumbnail('S2B_20200312_lat54lon066_T30UXE_ORB137_utm30n_osgb', '757625', )
}
