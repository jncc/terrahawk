interface Dictionary<T> {
  [Key: string]: T
}

export const projections : Dictionary<string> = {
  osgb: '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs',
  tm65: '+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +ellps=mod_airy +towgs84=482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15 +units=m +no_defs'
}

export const thumbnailBuffer = 0.05 // percent to add around the edge

export const thumbnailConfig : Dictionary<any> = {
  trueColour: {
    text: 'trueColour',
    displayName: 'True colour',
    rgbDomains: {
      red: [0, 256],
      green: [0, 256],
      blue: [0, 256]
    },
    colourScale: 'rgb'
  },
  falseColour: {
    text: 'falseColour',
    displayName: 'Backscatter',
    rgbDomains: {
      red: [-20, 20],
      green: [-30, 20],
      blue: [-10, 40]
    },
    colourScale: 'rgb'
  },
  rvi: {
    text: 'RVI',
    displayName: 'RVI',
    domain: [0.40, 1.03],
    colourScale: 'sar'
  },
  vvvh: {
    text: 'VVVH',
    displayName: 'VV/VH',
    domain: [0.50, 0.72],
    colourScale: 'sar'
  },
  vhvv: {
    text: 'VHVV',
    displayName: 'VH/VV',
    domain: [1.34, 1.96],
    colourScale: 'sar'
  },
  rfdi: {
    text: 'RFDI',
    displayName: 'RFDI',
    domain: [0.48, 0.80],
    colourScale: 'sar'
  },
  ndmi: {
    text: 'NDMI',
    displayName: 'NDMI',
    domain: [-1, 1],
    colourScale: 'ndmi'
  },
  ndvi: {
    text: 'NDVI',
    displayName: 'NDVI',
    domain: [-1, 1],
    colourScale: 'ndvi'
  },
  ndwi: {
    text: 'NDWI',
    displayName: 'NDWI',
    domain: [-1, 1],
    colourScale: 'ndwi'
  },
  nbr: {
    text: 'NBR',
    displayName: 'NBR',
    domain: [-1, 1],
    colourScale: 'nbr'
  }
}

export const colourScales = [
  {
    name: 'nbr',
    colours: ['#000004', '#1d1147', '#51127c', '#822681', '#b63679', '#e65164', '#fb8861', '#fec287', '#fcfdbf'],
    positions: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
  },
  {
    name: 'ndmi',
    colours: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
    positions: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
  },
  {
    name: 'ndwi',
    colours: ['#cde3f9', '#94c5df', '#73b3d8', '#57a0cf', '#3e8ec4', '#2879b9', '#1563aa', '#084b94', '#08306b'],
    positions: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
  },
  {
    name: 'ndvi',
    colours: ['#f2f2f2', '#f0c9c0', '#edb48e', '#ebb25e', '#e8c32e', '#e6e600', '#8bd000', '#3ebb00', '#00a600'],
    positions: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
  },
  {
    name: 'sar',
    colours: ['#440154', '#443a83', '#31688e', '#20908d', '#35b779', '#8fd744', '#fde725'],
    positions: [0, 0.16666, 0.33333, 0.49999, 0.66666, 0.83333, 1]
  }
]
