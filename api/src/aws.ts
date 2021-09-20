
import * as AWS from 'aws-sdk'
import { AthenaExpress } from 'athena-express'

import { env} from './env'

export const athenaExpress = () => {

    if (env.NODE_ENV === 'development') {
        throw 'Athena-based APIs not currently supported at dev time.'
    }

    let config = {
        aws: AWS,
        getStats: true,    
    }

    return new AthenaExpress(config)
}
