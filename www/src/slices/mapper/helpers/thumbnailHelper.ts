
import { RootState } from '../../../state/store'
import { Indexname } from '../types'

export const height = 100
export const width  = 100

export const getThumbnailTypeArgument = (thumbType: RootState['mapper']['thumbType'],
  indexname: Indexname,
  platform: RootState['mapper']['platform']) => {
    
  switch (thumbType) {
    case 'ard':
      if (platform === 's1') {
        return 'falseColour'
      } else {
        return 'trueColour'
      }
    case 'index' : return indexname.toLowerCase()
  }
}