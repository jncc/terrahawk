import { getThumbnail } from 'thumbnail-generator'
import { parseArgs } from './thumbArgParser'

export const getThumb = async (input: any) => {
  console.log(`At ${(new Date()).toISOString()} - entering function`)

  let args = parseArgs(input)
  let frame = args.frameName
  let bbox = JSON.parse(args.bbox) as number[]
  let thumbType = args.thumbType

  let thumbCanvas = getThumbnail(frame, bbox, thumbType)
  return (await thumbCanvas).toBuffer('image/png')
}
