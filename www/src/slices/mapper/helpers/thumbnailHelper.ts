
import { RootState } from '../../../state/store'
import { Indexname } from '../types'

export const height = 100
export const width  = 100

export const getThumbnailTypeArgument = (thumbType: RootState['mapper']['thumbType'], indexname: Indexname) => {
  switch (thumbType) {
    case 'trueColour': return 'trueColour'
    case 'falseColour': return 'falseColour'
    case 'index' : return indexname.toLowerCase()
  }
}