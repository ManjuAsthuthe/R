var express = require('express');
var app = express();
var adb = require('adbkit');
var client = adb.createClient();
var shell = require('shelljs');
var query = require('url');
var fs = require('fs');
var extract = require('ipa-extract-info');
var util = require('util')
var ApkReader = require('node-apk-parser')
 
var reader = ApkReader.readFile('appName.apk')
var manifest = reader.readManifestSync()
 



app.get('/', (req, res) => {
    res.send("I'm Listening")
});


app.get('/version', (req, res) => {
    // console.log(manifest.versionCode);
    console.log(manifest.versionName);
    res.send("Success")
});

app.get('/ipa/extract', (req,res) => {

    var fd = fs.openSync(__dirname + 'appName.ipa', 'r');
    var hh ;

    extract(fd, function(err, info, raw){
    if (err) throw err;
    console.log(info); // the parsed plist
    // console.log(raw);  // the unparsed plist
    });

    res.send("Extracted");
});



app.get('/api/tap', (req,res) => {
    console.log(query.parse(req.url, true).query.device_id)
    console.log(query.parse(req.url, true).query.x_coord)
    console.log(query.parse(req.url, true).query.y_coord)
    var data = {
        Device_Id : query.parse(req.url, true).query.device_id,
        X_Coord : query.parse(req.url, true).query.x_coord,
        Y_Coord : query.parse(req.url, true).query.y_coord
    };
    console.log(data.Device_Id)
    console.log(data.X_Coord)
    console.log(data.Y_Coord)

    shell.exec("adb -s " + data.Device_Id + " shell input tap " + data.X_Coord + " " + data.Y_Coord);
    var rs = "{\r\n \"response_status\": \"200\",\r\n \"data\": \"Touched successfully\"\r\n}";

    res.send(rs);
});

app.listen(5000, () => console.log('Listening on port 5000...'))