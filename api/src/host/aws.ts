
import { APIGatewayProxyHandler } from 'aws-lambda'

import { env } from '../env'
import { getAlive } from '../endpoints/alive'
import { getPolygons } from '../endpoints/polygons'
import { getLookups } from '../endpoints/lookups'
import { getStats } from '../endpoints/stats'
import { getAthena } from '../endpoints/athena'
import { getChoropleth } from '../endpoints/choropleth'
import { getPolygon } from '../endpoints/polygon'
import { getThumb } from '../endpoints/thumb'
import { getNpms } from '../endpoints/npms'

export let helloHandler: APIGatewayProxyHandler = async (event) => {

  console.log('helloHandler received event', event)
  return success({ message: 'Hello!', node_env: env.NODE_ENV, headers: event.headers })
}

export let errorHandler: APIGatewayProxyHandler = async (event) => {

  console.log('errorHandler received event', event)
  throw 'Forced exception'
}

export let aliveHandler: APIGatewayProxyHandler = async (event) => {
  return success(await getAlive(event.queryStringParameters))
}

export let athenaHandler: APIGatewayProxyHandler = async (event) => {
  return success(await getAthena(event.queryStringParameters))
}

export let choroplethHandler: APIGatewayProxyHandler = async (event) => {
  let body = JSON.parse(event.body ?? "{}")
  return success(await getChoropleth(body))
}

export let polygonsHandler: APIGatewayProxyHandler = async (event) => {
  let body = JSON.parse(event.body ?? "{}")
  return success(await getPolygons(body))
}

export let polygonHandler: APIGatewayProxyHandler = async (event) => {
  let body = JSON.parse(event.body ?? "{}")
  return success(await getPolygon(body))
}

export let lookupsHandler: APIGatewayProxyHandler = async (event) => {
  return success(await getLookups(event.queryStringParameters))
}

export let statsHandler: APIGatewayProxyHandler = async (event) => {

  let body = JSON.parse(event.body ?? "{}")
  let result = await getStats(body)
  return success(result)
}

export let thumbHandler: APIGatewayProxyHandler = async (event) => {
    let result = await getThumb(event.queryStringParameters)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
      },
      body: result.toString('base64'), // somehow this lets you return binary media, see https://docs.aws.amazon.com/apigateway/latest/developerguide/lambda-proxy-binary-media.html
      isBase64Encoded: true
    }
}

export let npmsHandler: APIGatewayProxyHandler = async (event) => {
  return success(await getNpms(event.queryStringParameters))
}

let success = (data: any) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  }
}
