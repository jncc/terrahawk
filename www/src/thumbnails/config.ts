export const ardUrlBase = 'https://dap.ceda.ac.uk/neodc/sentinel_ard/data'
export const indicesUrlBase = 'https://gws-access.jasmin.ac.uk/public/defra_eo/test/change-detection/indices'

export const thumbnailCacheLimit = 100
export const thumbnailBuffer = 0.1 // percent to add around the edge

export const thumbnailConfig = {
  trueColour: {
    text: 'trueColour',
    rgbDomains: {
      red: [0, 256],
      green: [0, 256],
      blue: [0, 256]
    },
    colourScale: 'rgb'
  },
  falseColour: {
    text: 'falseColour',
    rgbDomains: {
      red: [-20, 20],
      green: [-30, 20],
      blue: [-10, 40]
    },
    colourScale: 'rgb'
  },
  rvi: {
    text: 'RVI',
    domain: [1, 1.6],
    colourScale: 'rvi'
  },
  rviv: {
    text: 'RVIv',
    domain: [0, 4],
    colourScale: 'rviv'
  },
  ndmi: {
    text: 'NDMI',
    domain: [-1, 1],
    colourScale: 'ndmi'
  },
  ndvi: {
    text: 'NDVI',
    domain: [-1, 1],
    colourScale: 'ndvi'
  },
  ndwi: {
    text: 'NDWI',
    domain: [-1, 1],
    colourScale: 'ndwi'
  },
  evi: {
    text: 'EVI',
    domain: [-2, 3],
    colourScale: 'evi'
  },
  nbr: {
    text: 'NBR',
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
    name: 'evi',
    colours: ['#f7fcf5', '#d5efcf', '#9ed898', '#54b567', '#1d8641', '#00441b'],
    positions: [0,0.2,0.4,0.6,0.8,1]
  },
  {
    name: 'ndvi',
    colours: ['#f2f2f2', '#f0c9c0', '#edb48e', '#ebb25e', '#e8c32e', '#e6e600', '#8bd000', '#3ebb00', '#00a600'],
    positions: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
  },
  {
    name: 'rvi',
    colours: ['#440154', '#443a83', '#31688e', '#20908d', '#35b779', '#8fd744', '#fde725'],
    positions: [0, 0.16666, 0.33333, 0.49999, 0.66666, 0.83333, 1]
  },
  {
    name: 'rviv',
    colours: ['#440154', '#462c7b', '#3a528b', '#2b728e', '#20908d', '#27ae80', '#5dc962', '#abdc32', '#fde725'],
    positions: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
  }
]