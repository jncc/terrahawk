"use strict";
exports.__esModule = true;
var arcgis_1 = require("@terraformer/arcgis");
var fs = require("fs");
var sourceFolder = "data/input";
var outputFolder = "data/output";
function translateFile(filePath, outputPath) {
    try {
        // Get the content of the JSON file 
        var data = fs.readFileSync(filePath);
        var obj = JSON.parse(data.toString());
        var outputStream = fs.createWriteStream(outputPath);
        var output = (0, arcgis_1.geojsonToArcGIS)(obj);
        output.forEach(function (polygon) {
            var strData = JSON.stringify(polygon);
            outputStream.write("".concat(strData, "\n"));
        });
        outputStream.on('error', function (err) {
            console.log(err);
        });
        outputStream.end();
        // let strData = JSON.stringify(output);
        // fs.writeFileSync(outputPath, strData)
    }
    catch (err) {
        console.log(err);
    }
}
function getOutputFilename(file) {
    var filename = file.split("/").pop();
    //todo selects extension not filename
    var p1 = filename === null || filename === void 0 ? void 0 : filename.split(".")[0];
    var outpath = "".concat(p1, "-esri.json");
    return outpath;
}
var files = fs.readdirSync(sourceFolder);
files.forEach(function (file) {
    var inputFilePath = "".concat(sourceFolder, "/").concat(file);
    var outFile = getOutputFilename(file);
    var outputFilePath = "".concat(outputFolder, "/").concat(outFile);
    translateFile(inputFilePath, outputFilePath);
});
