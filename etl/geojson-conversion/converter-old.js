
// read each file in input folder 
// write out to output folder - {filename}-esri.json

const Terraformer = require('@terraformer/arcgis');
const fsPromises = require('fs.promises');

// const filePath = path.resolve(__dirname, './example.json')
const filePath = "data/LivingEngland_zone1_test.geojson"

const main = async () => {
  try {
    // Get the content of the JSON file 
    const data = await fsPromises.readFile(filePath);
    const obj = JSON.parse(data)

    output = Terraformer.geojsonToArcGIS(obj);

    string = JSON.stringify(output);


    await fsPromises.writeFile("data/output.json", string)
  
  } catch (err){
    console.log(err);
  }
}

main()
