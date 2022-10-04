import { geojsonToArcGIS } from '@terraformer/arcgis'
import * as fs from 'fs';
import { mainModule } from 'process';

const sourceFolder = "data/input"
const outputFolder = "data/output"

function translateFile(filePath:string, outputPath:string) {
  try {
    // Get the content of the JSON file 
    const data = fs.readFileSync(filePath);
    const obj = JSON.parse(data.toString())

    var outputStream = fs.createWriteStream(outputPath)

    let output = <object[]>geojsonToArcGIS(obj);

    outputStream.write(JSON.stringify(output))

    // output.forEach(polygon => {
    //   let strData = JSON.stringify(polygon);
    //   outputStream.write(`${strData}\n`)
    // })


    outputStream.on('error', function (err) {
      console.log(err);
    });

    outputStream.end()
  
  } catch (err){
    console.log(err);
  }
}

function getOutputFilename(file:string) {
  let filename = file.split("/").pop();
  let p1 = filename?.split(".")[0];
  
  let outpath: string =  `${p1}-esri.json`
  return outpath
}

let files = fs.readdirSync(sourceFolder);

files.forEach(file => {
  let inputFilePath: string = `${sourceFolder}/${file}`

  let outFile = getOutputFilename(file)
  let outputFilePath: string = `${outputFolder}/${outFile}`
  translateFile(inputFilePath, outputFilePath)
});