
import * as express from 'express'
import * as cors from 'cors'
import * as asyncHandler from 'express-async-handler'

import { env } from '../env'
import { MonthlyQuery } from '../query'
import { getAlive } from '../endpoints/alive'
import { getPolygons } from '../endpoints/polygons'
import { getLookups } from '../endpoints/lookups'
import { getColours } from '../endpoints/colours'
import { getStats } from '../endpoints/stats'
import { getAthena } from '../endpoints/athena'
import { getThumb } from '../endpoints/thumb'

if (env.NODE_ENV === 'development') {

    let app = express()
    app.use(cors())
    app.use(express.json())

    app.get(['/', '/hello'], (req, res) => res.send('Hello from the API.'))

    app.get('/error', (req, res) => { throw 'Forced exception!!!' })

    app.get('/alive', asyncHandler(async(req, res) => {

        let result = await getAlive(req.query)
        res.json(result)
    }))

    app.post('/athena', asyncHandler(async(req, res) => {

        let result = await getAthena(req.query)
        res.json(result)
    }))

    app.post('/polygons', asyncHandler(async(req, res) => {

        let result = await getPolygons(req.body) // req.body for POST
        res.json(result)
    }))

    app.get('/lookups', asyncHandler(async(req, res) => {

        let result = await getLookups(req.query) // req.query for GET
        res.json(result)
    }))

    app.post('/colours', asyncHandler(async(req, res) => {

        let result = await getColours(req.body)
        res.json(result)
    }))

    app.post('/stats', asyncHandler(async(req, res) => {

        let result = await getStats(req.body)
        res.json(result)
    }))

    app.get('/thumb', asyncHandler(async(req, res) => {

        let result = await getThumb(req.query)
        res.setHeader('Content-Type', 'image/png')
        res.send(result)
    }))

    app.listen(8000, () => {
        console.log('API listening on http://localhost:8000')
    })
}
