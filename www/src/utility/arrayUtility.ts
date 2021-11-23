
// Gets the nearest element to the middle of an array
export function getMiddlemostElement<T> (array: T[]) {
  return array[Math.floor((array.length - 1) / 2)]    
}

export function last<T> (array: T[]) {
  return array[array.length - 1]
}
