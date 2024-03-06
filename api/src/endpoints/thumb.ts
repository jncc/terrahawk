import { ThumbnailGenerator } from '../thumbnails/thumbnailGenerator'
import { parseArgs } from './thumbArgParser'
import { env } from '../env'

export const getThumb = async (input: any) => {
  console.log(`At ${(new Date()).toISOString()} - entering function`)

  let args = parseArgs(input)
  let frame = args.frameName
  let bbox = JSON.parse(args.bbox) as number[]
  let thumbType = args.thumbType
  let framework = args.framework

  console.log(`Generating ${thumbType} thumbnail for frame ${frame} with bbox ${bbox}`)

  let ardUrlBase = env.CEDA_ARD_URL_BASE
  let indicesUrlBase = env.CEDA_INDICES_URL_BASE

  // special handling for Cairngorms S1 data which is not yet in CEDA
  if (frame.startsWith("S1") && framework === "spaceint2022_cairngorms") {
    indicesUrlBase = env.GWS_INDICES_URL_BASE
  }

  let thumbGenerator : ThumbnailGenerator = new ThumbnailGenerator(ardUrlBase, indicesUrlBase)
  let thumbCanvas = thumbGenerator.getThumbnail(frame, bbox, thumbType)
  return (await thumbCanvas).toBuffer('image/png')
}
