import { thumbnailCacheLimit } from './config'

var sessionStorage = window.sessionStorage

export function getCacheItem(key : string) {
  return sessionStorage.getItem(key)
}

export function setCacheItem(key : string, value : string) {
  let keys = getThumbnailKeyQueue()

  // only keep a certain number of cached thumbs at a time
  while (keys.length >= thumbnailCacheLimit) {
    let oldKey = keys.shift()

    if (oldKey && oldKey != null) {
      sessionStorage.removeItem(oldKey)
    }
  }

  if (!keys.includes(key)) {
    keys.push(key)
  }

  try {
    sessionStorage.setItem('thumbs_keys', JSON.stringify(keys))
    sessionStorage.setItem(key, value)
  } catch (error) {
    // don't stop thumbnails loading if caching fails
    // console.error(error)
  }
}

function getThumbnailKeyQueue() {
  let thumbnailKeysItem = sessionStorage.getItem('thumbs_keys')
  let thumbnailKeys : string[] = []

  if (thumbnailKeysItem && thumbnailKeysItem != null) {
    thumbnailKeys = JSON.parse(thumbnailKeysItem)
  } else {
    // if the key list doesn't exist then rebuild it
    for (let i = 0; i < sessionStorage.length; i++) {
      let key = sessionStorage.key(i)
      if (key != null && key != 'thumbs_keys' && key.startsWith('thumbs_') && !thumbnailKeys.includes(key)) {
        thumbnailKeys.push(key)
      }
    }
    
    try {
      sessionStorage.setItem('thumbs_keys', JSON.stringify(thumbnailKeys))
    } catch (error) {
      console.error(error)
    }
  }

  return thumbnailKeys
}