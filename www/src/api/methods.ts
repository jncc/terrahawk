
/**
 * Helper functions for HTTP fetching from the API.
 */

// import { env } from '../../env'
let env = { API_ENDPOINT: `https://xnqk0s6yzh.execute-api.eu-west-2.amazonaws.com`}

async function fetchAs<T>(request: Request) {
  let response = await fetch(request)
  if (response.ok) {
    return await response.json() as T
  }  
  throw new Error(`${response.status}. ${response.statusText}`)
}

export async function get<T>(path: string) {
  let request = new Request(env.API_ENDPOINT + path)
  return fetchAs<T>(request)
}

export async function post<T>(path: string, payload: object) {
  let request = new Request(env.API_ENDPOINT + path, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },        
    body: JSON.stringify(payload),
  })
  return fetchAs<T>(request)
}
