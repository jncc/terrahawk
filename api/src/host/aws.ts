
import { APIGatewayProxyHandler } from 'aws-lambda'

import { env } from '../env'
import { getAlive } from '../endpoints/alive'
import { getPolygons } from '../endpoints/polygons'
import { getChoropleth } from '../endpoints/choropleth'
import { getPolygon } from '../endpoints/polygon'
import { getThumb } from '../endpoints/thumb'
import { getNpms } from '../endpoints/npms'

import { getChoroplethDev } from '../endpoints/choroplethDev'
import { getPolygonDev } from '../endpoints/polygonDev'
import { getHabitats } from '../endpoints/habitats'

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
  let body = JSON.parse(event.body ?? "{}")
  return success(await getNpms(body))
}


export let choroplethDevHandler: APIGatewayProxyHandler = async (event) => {
  let body = JSON.parse(event.body ?? "{}")
  return success(await getChoroplethDev(body))
}

export let polygonDevHandler: APIGatewayProxyHandler = async (event) => {
  let body = JSON.parse(event.body ?? "{}")
  return success(await getPolygonDev(body))
}

export let habitatsHandler: APIGatewayProxyHandler = async (event) => {
  let body = JSON.parse(event.body ?? "{}")
  return success(await getHabitats(body))
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
