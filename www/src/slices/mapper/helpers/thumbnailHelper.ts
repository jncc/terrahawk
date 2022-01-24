
import { RootState } from '../../../state/store'
import { Indexname } from '../types'

export const height = 100
export const width  = 100

export const getThumbnailTypeArgument = (thumbType: RootState['mapper']['thumbType'], indexname: Indexname) => {
  switch (thumbType) {
    // todo: support S1 falseColour as well as S2 trueColour
    case 'colour': return 'trueColour' 
    case 'index' : return indexname.toLowerCase()
  }
}