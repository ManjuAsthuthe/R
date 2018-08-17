
'use strict';
var express = require('express');
var query = require('url');
var app = express();
var schema = require('../models/auth');
// var db = require('../controllers/dbConn/');
var Promise = require('bluebird')
// var record = require('../models/records')
var adb = require('adbkit')
var sleep = require('sleep');
var client = adb.createClient()
var moment = require('moment');
var config = require('../../config.json');
var shell = require('shelljs');
var condenseWhitespace = require('condense-whitespace');
var extract = require('extract-comments');
var stringExtractor = require('string-extractor');
var _this = this;
var mntrl = require('../controllers/fileHandleController')
var mysql = require('mysql');
var util = require('util')
var ApkReader = require('node-apk-parser')
var fs = require('fs');
var dJSON = require('dirty-json');
var ipaMetadata = require('ipa-metadata');



var con_deviceData = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "r_mobi",
    connectionLimit: 10,
    multipleStatements: true
})
con_deviceData.connect(function (err) {
    if (!err) {
        console.log("Database is connected .monitoring controller.js is initalised.. nn");
    } else {
        console.log("Error connecting database ... con_deviceData" + err);
    }
});
exports.getAppVersion = function(data,file, callback){
    var data = {
        app_name:file,
        user_name:data.userName
    }
try{
    sleep.sleep(5);
    if(file.slice(-4) == ".apk"){  
        console.log("=========="+config.remoteDir.concat(data.user_name)+'/'+file)
        var reader = ApkReader.readFile(config.remoteDir.concat(data.user_name)+'/'+file)
        var manifest = reader.readManifestSync();
        var result = util.inspect(manifest, { depth: null });
        dJSON.parse(result).then(function (r) {
            console.log("APP VERSION :: "+(JSON.stringify(r)))
            callback(null,JSON.parse(JSON.stringify(r)).versionName)
     })
    
    }else{
        if(file.slice(-4) == ".ipa"){
            console.log("=========="+config.remoteDir.concat(data.user_name)+'/'+file)
            ipaMetadata(config.remoteDir.concat(data.user_name)+'/'+file, function(error, ios){
             console.log("IPA APP VERSION :: "+JSON.stringify(ios));
            callback(null, JSON.parse(JSON.stringify(ios)).metadata.CFBundleShortVersionString)
          });
    }
}
}catch(e){
    console.log(e)
    callback(e, null)
}
}
exports.getAppFamily = function(data,file, callback){
    var data = {
        app_name:file,
        user_name:data.userName
    }
try{
    sleep.sleep(5);
    if(file.slice(-4) == ".apk"){  
        console.log("=========="+config.remoteDir.concat(data.user_name)+'/'+file)
        var reader = ApkReader.readFile(config.remoteDir.concat(data.user_name)+'/'+file)
        var manifest = reader.readManifestSync();
        var result = util.inspect(manifest, { depth: null });
        dJSON.parse(result).then(function (r) {
            console.log("APP VERSION :: "+(JSON.stringify(r)))
            callback(null,JSON.parse(JSON.stringify(r)).package)
     })
    
    }else{
        if(file.slice(-4) == ".ipa"){
            console.log("=========="+config.remoteDir.concat(data.user_name)+'/'+file)
            ipaMetadata(config.remoteDir.concat(data.user_name)+'/'+file, function(error, ios){
             console.log("IPA APP VERSION :: "+JSON.stringify(ios));
            callback(null, JSON.parse(JSON.stringify(ios)).metadata.CFBundleIdentifier)
          });
    }
}
}catch(e){
    console.log(e)
    callback(e, null)
}
}
exports.getAppIconPath = function(data,file,callback){
    var data= {
        app_name:file,
        user_name:data.userName
    }
try{
    sleep.sleep(5);
    if(file.slice(-4)== ".apk"){
        console.log("=========="+config.remoteDir.concat(data.user_name)+'/'+file)
        console.log('java -jar /Users/samarth.handur/apkBot-0.0.1-SNAPSHOT-jar-with-dependencies.jar '+config.remoteDir.concat(data.user_name)+'/'+file+' '+'/Users/samarth.handur/Downloads/mmp_node_version02/assets/appIcons/');
         var img= shell.exec('java -jar /Users/samarth.handur/apkBot-0.0.1-SNAPSHOT-jar-with-dependencies.jar '+config.remoteDir.concat(data.user_name)+'/'+file+' '+'/Users/samarth.handur/Downloads/mmp_node_version02/assets/appIcons').stdout
       
         console.log("*&******&&&******",img.split(/\r?\n/))
        callback(null,img.split(/\r?\n/))
    }else{
        if(file.slice(-4)== ".ipa"){
            console.log("=========="+config.remoteDir.concat(data.user_name)+'/'+file)
            var img= shell.exec('java -jar /Users/samarth.handur/ipaBot-0.0.1-SNAPSHOT-jar-with-dependencies.jar '+config.remoteDir.concat(data.user_name)+'/'+file+' '+'/Users/samarth.handur/Downloads/mmp_node_version02/assets/appIcons').stdout
            console.log("*&******&&&******",img.split(/\r?\n/))
            callback(null,img.split(/\r?\n/))
            }
    }
}catch(e){
    console.log(e)
    callback(e,null)
    }
}
exports.resetAppStatus = function (data, callback) {
    var qr = 'update deviceData set device_status = "FREE" where device_id = '+JSON.stringify(data.device_id)+';update testCycle set monitoring_status = "FREE" where cycle_id = '+data.cycle_id+''
    // select(select user_name from appData where app_id=(select app_id from testCycle where cycle_id='+data.cycle_id+') )as  '+"user_name"+',(select device_id from testCycle where cycle_id='+data.cycle_id+') as '+"device_id"+',(select file_name from appData where app_id=((select app_id from testCycle where cycle_id='+data.cycle_id+'))) as '+"app_name"+'
    console.log(qr)
    con_deviceData.query(qr, function (err, result) {
        if (err) {
            console.log("====================="+err)
            callback(err, null);
        } else {
            console.log(result)
            callback(null, result);
        }
    })
}
exports.setAppStatus = function (data,  callback) {
    var CurrentDate = moment().format("YYYY-MM-DD HH:mm:ss");
    // INSERT INTO testCycle (app_id,user_name,start_time,app_name,app_version, device_id,monitoring_status) values (1,’email.com','NULL','ICHIBA-ANDROID.apk','4.2.3','NULL','FREE')
    var qr = 'INSERT INTO testCycle (app_id, start_time, device_id, monitoring_status, custom_test_status) VALUES ('+JSON.stringify(data.app_id)+',"'+CurrentDate+'",'+JSON.stringify(data.device_id)+',"BUSY","FREE"); UPDATE deviceData SET device_status = "BUSY" WHERE device_id = '+JSON.stringify(data.device_id)
    console.log(qr)
    con_deviceData.query(qr, function (err, result) {
        // console.log("output: ", result);
        if (err) {
            console.log("Query Callback", err);
            callback(err, null);
        } else {
            console.log(JSON.stringify(result[0].insertId))
            callback(null, {"cycle_id":result[0].insertId});
        }
    })
}
exports.setAppStatusCustomScript = function (data,  callback) {
    var CurrentDate = moment().format("YYYY-MM-DD HH:mm:ss");
    // INSERT INTO testCycle (app_id,user_name,start_time,app_name,app_version, device_id,monitoring_status) values (1,’email.com','NULL','ANDROID.apk','4.2.3','NULL','FREE')
    var qr = 'INSERT INTO testCycle (app_id, start_time, device_id, monitoring_status, custom_test_status) VALUES ('+JSON.stringify(data.app_id)+',"'+CurrentDate+'",'+JSON.stringify(data.device_id)+',"BUSY",NULL); UPDATE deviceData SET device_status = "BUSY" WHERE device_id = '+JSON.stringify(data.device_id)
    console.log(qr)
    con_deviceData.query(qr, function (err, result) {
        // console.log("output: ", result);
        if (err) {
            console.log("Query Callback", err);
            callback(err, null);
        } else {
            console.log(JSON.stringify(result[0].insertId))
            callback(null, {"cycle_id":result[0].insertId});
        }
    })
}
exports.setAppStatusWithCycleId = function (data, dat, callback) {
    var CurrentDate = moment().format("YYYY-MM-DD HH:mm:ss");
    // INSERT INTO testCycle (app_id,user_name,start_time,app_name,app_version, device_id,monitoring_status) values (1,’email.com','NULL','ANDROID.apk','4.2.3','NULL','FREE')
    var qr = 'INSERT INTO testCycle (app_id,customTest_id, start_time, device_id, monitoring_status, custom_test_status) VALUES ('+JSON.stringify(data.app_id)+',NULL,"'+CurrentDate+'",'+JSON.stringify(dat.device_id)+',"BUSY","FREE"); UPDATE deviceData SET device_status = "BUSY" WHERE device_id = '+JSON.stringify(dat.device_id)
    console.log(qr)
    con_deviceData.query(qr, function (err, result) {
        // console.log("output: ", result);
        if (err) {
            console.log("Query Callback", err);
            callback(err, null);
        } else {
            console.log(JSON.stringify(result[0].insertId))
            callback(null, {"cycle_id":result[0].insertId});
        }
    })
}
exports.getDeviceDetailsFromCycleId = function(data, callback){
    var qr = 'select(select user_name from appData where app_id=(select app_id from testCycle where cycle_id='+data.cycle_id+') )as  '+"user_name"+',(select device_id from testCycle where cycle_id='+data.cycle_id+') as '+"device_id"+',(select file_name from appData where app_id=((select app_id from testCycle where cycle_id='+data.cycle_id+'))) as '+"app_name"+', ('+data.cycle_id+') as '+"cycle_id"+', (select device_status from deviceData where device_id=(select device_id from testCycle where cycle_id='+data.cycle_id+')) as '+"device_status"+',(select device_name from deviceData where device_id=(select device_id from testCycle where cycle_id='+data.cycle_id+')) as '+"device_name"+',(select os_version from deviceData where device_id=(select device_id from testCycle where cycle_id='+data.cycle_id+')) as '+"device_os"+',(select app_path from appData where app_id=(select app_id from testCycle where cycle_id='+data.cycle_id+')) as '+"app_path"+''
    console.log(qr)
    con_deviceData.query(qr, function (err, dat) {
        if (err) {
            console.log(err)
            callback(err, null);
        } else {
            console.log(JSON.stringify(dat))
            callback(null, dat);
        }
    })
}
exports.getAppStatus = function (data, callback) {
    // var qr = 'select exists (select * from appData where apk_name=' + JSON.stringify(data.apkName) + ' and device_id=' + JSON.stringify(data.device_id) + ' and user_name=' + JSON.stringify(data.apkName) + ')'
    var qr = 'select * from testCycle where cycle_id='+data.cycle_id
    console.log(qr)
    con_deviceData.query(qr, function (err, result) {
        //            con_bookDevice.close();
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
}

exports.getAppDetails = function(data, callback){
    var qr = 'select * from appData where app_id='+data.app_id
    console.log(qr)
    con_deviceData.query(qr, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            console.log(JSON.stringify(result))
            callback(null, result);
        }
    })
}
exports.getDeviceDetails = function(runDetails, callback){
    var qr = 'select * from deviceData where device_id='+JSON.stringify(runDetails[0].device_id)
    console.log(qr)
    con_deviceData.query(qr, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            console.log(JSON.stringify(result))
            callback(null, result);
        }
    })
}
exports.getDeviceDetailsFromDeviceId = function(data, callback){
    var qr = 'select * from deviceData where device_id='+JSON.stringify(data.device_id)
    console.log(qr)
    con_deviceData.query(qr, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            console.log(JSON.stringify(result))
            callback(null, result);
        }
    })
}
exports.insertTestRunTable = function(dat,data){
    console.log("insertTestRunTable ::  ",data.script_id.length)
    if(data.script_id.length>0){
    for(var i=0;i<data.script_id.length;i++){
    var qr = 'insert into testRunTable (cycle_id, script_id) values ('+dat.cycle_id+','+data.script_id[i]+')'
    console.log(qr)
    con_deviceData.query(qr, function (err, result) {
        if (err) {
            // callback(err, null);
        } else {
            console.log(JSON.stringify(result))
            // callback(null);
        }
    })
}
    }else{
        var qr = 'insert into testRunTable (cycle_id, script_id) values ('+dat.cycle_id+','+data.script_id+')'
    console.log(qr)
    con_deviceData.query(qr, function (err, result) {
        if (err) {
            // callback(err, null);
        } else {
            console.log(JSON.stringify(result))
            // callback(null);
        }
    })
    }
}
exports.insertTestRunTableWithCycleId = function(data,p){
    console.log("data*** ",data)
    console.log("p.script_id :: ",p)
    for(var i=0;i<p.length;i++){
    var qr = 'insert into testRunTable (cycle_id, script_id) values ('+data.cycle_id+','+p[i].script_id+')'
    console.log(qr)
    con_deviceData.query(qr, function (err, result) {
        if (err) {
            // callback(err, null);
        } else {
            console.log(JSON.stringify(result))
            // callback(null);
        }
    })
}
}
var getScriptDetails = function(records, callback){
    console.log(records.length)
    var qr='select script_name from customTest where script_id IN (select script_id from testRunTable where cycle_id='+records[0].cycle_id+');'
    //var qr = 'select * from deviceData where device_id=(select device_id from testCycle where cycle_id='+dat.cycle_id+')'
    console.log(qr)
    con_deviceData.query(qr, function(err, resultDB){
        if(err){
            console.log(err);
            callback(err,null)
        }else{ 
            callback(null,resultDB)
            
        }
       
     })
}
exports.initiateMonitoring = function (data, callback) {
    // var data = {
    //     user_name: req.body.user_name,
    //     authToken: req.body.authToken,
    //     device_id: req.body.device_id,
    //     platformVersion: req.body.os_version,
    //     app_id: req.body.app_id,
    //     deviceName: req.body.device_name,
    //     script_id: req.body.script_id
    // };
    schema.validateAuthToken(data, function (err, content) {
        console.log("----", JSON.stringify(content.verified))
        if (JSON.stringify(content.verified) == 'false') {
            console.log(err);
            res.send('Invalid token');
        } else {
            console.log("i am here",  data.script_id)
            console.log("contains... ??   ",data.script_id.includes('33'))
            if(data.script_id.includes('33')){
                console.log("its an ICHIBA Application")
                _this.getAppDetails(data,function(er,p){
                    console.log( "p[0]  :: ", p[0])
                if(p[0].file_name.slice(-4)==".apk"){
                    console.log("ITS AN ANDROID APPLICATION");
                    var result=[];
                   
                    _this.setAppStatus(data, function (err, dat) {
                        _this.insertTestRunTable(dat, data);
                        _this.getAppStatus(dat, function(er,runDetails){
                            _this.getDeviceInfoMntrlCntrl(runDetails[0], function (err,records) {
                                console.log("records", records)
                                _this.getScriptNameMntrlCntrl(runDetails,function(er,x){
                                var script = ({script_name:x})
                                records[0].scripts = x
                                result.push(records)
                            _this.getDeviceDetails(runDetails, function(err,q){
                                console.log("sh /Users/samarth.handur/shell.sh triggerTest_Ichiba  " + runDetails[0].cycle_id + " " + runDetails[0].device_id + " " + q[0].os_version + "  " + q[0].device_name + " " + p[0].app_path + " "+p[0].app_family+" > " + config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &")
                                shell.exec("sh /Users/samarth.handur/shell.sh triggerTest_Ichiba  " + runDetails[0].cycle_id + " " + runDetails[0].device_id + " " + q[0].os_version + "  " + q[0].device_name + " " + p[0].app_path + " "+p[0].app_family+" > " + config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &").stdout;
                                // res.status(200).json(Object.assign(runDetails, result));
                                callback(Object.assign(runDetails, result))
                                    })
                                })
                                })
                            })
                            }) 
                    }else if (p[0].file_name.slice(-4) == ".ipa"){
                        console.log("ITS AN IOS APPLICATION");
                        var result=[];
                        _this.setAppStatus(data, function (err, dat) {
                            _this.insertTestRunTable(dat, data);
                            _this.getAppStatus(dat, function(er,runDetails){
                                _this.getDeviceInfoMntrlCntrl(runDetails[0], function (err,records) {
                                    console.log("records", records)
                                    _this.getScriptNameMntrlCntrl(runDetails,function(er,x){
                                    var script = ({script_name:x})
                                    records[0].scripts = x
                                    result.push(records)
                                _this.getDeviceDetails(runDetails, function(err,q){ 
                                    console.log("sh /Users/samarth.handur/shell_iOS.sh triggerTest_Ichiba "+runDetails[0].cycle_id +" "+runDetails[0].device_id+" " +q[0].os_version+"  " +q[0].device_name+" " +p[0].app_path+" "+p[0].app_family+" > "+config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &")
                                    shell.exec("sh /Users/samarth.handur/shell_iOS.sh triggerTest_Ichiba "+runDetails[0].cycle_id +" "+runDetails[0].device_id+" " +q[0].os_version+"  " +q[0].device_name+" " +p[0].app_path+" "+p[0].app_family+" > "+config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &").stdout;
                                    // res.status(200).json(Object.assign(runDetails, result));
                                   callback( Object.assign(runDetails, result));
                                    })
                                })
                                })
                            })
                            })
                        }
                    else {
                        res.send({
                            "error":"invalid app type"
                        })
                    }
                })
            }else{
                console.log("its other than ichiba Application")
            _this.getAppDetails(data,function(er,p){
                console.log( "p[0]  :: ", p[0])
            if(p[0].file_name.slice(-4)==".apk"){
                console.log("ITS AN ANDROID APPLICATION");
                var result=[];
               
                _this.setAppStatus(data, function (err, dat) {
                    _this.insertTestRunTable(dat, data);
                    _this.getAppStatus(dat, function(er,runDetails){
                        _this.getDeviceInfoMntrlCntrl(runDetails[0], function (err,records) {
                            console.log("records", records)
                            _this.getScriptNameMntrlCntrl(runDetails,function(er,x){
                            var script = ({script_name:x})
                            records[0].scripts = x
                            result.push(records)
                        _this.getDeviceDetails(runDetails, function(err,q){
                            console.log("sh /Users/samarth.handur/shell.sh triggerTest  " + runDetails[0].cycle_id + " " + runDetails[0].device_id + " " + q[0].os_version + "  " + q[0].device_name + " " + p[0].app_path + " "+p[0].app_family+" > " + config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &")
                            shell.exec("sh /Users/samarth.handur/shell.sh triggerTest  " + runDetails[0].cycle_id + " " + runDetails[0].device_id + " " + q[0].os_version + "  " + q[0].device_name + " " + p[0].app_path + " "+p[0].app_family+" > " + config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &").stdout;
                            // res.status(200).json(Object.assign(runDetails, result));
                            callback( Object.assign(runDetails, result));
                                })
                            })
                            })
                        })
                        }) 
                }else if (p[0].file_name.slice(-4) == ".ipa"){
                    console.log("ITS AN IOS APPLICATION");
                    var result=[];
                    _this.setAppStatus(data, function (err, dat) {
                        _this.insertTestRunTable(dat, data);
                        _this.getAppStatus(dat, function(er,runDetails){
                            _this.getDeviceInfoMntrlCntrl(runDetails[0], function (err,records) {
                                console.log("records", records)
                                _this.getScriptNameMntrlCntrl(runDetails,function(er,x){
                                var script = ({script_name:x})
                                records[0].scripts = x
                                result.push(records)
                            _this.getDeviceDetails(runDetails, function(err,q){ 
                                console.log("sh /Users/samarth.handur/shell_iOS.sh triggerTest "+runDetails[0].cycle_id +" "+runDetails[0].device_id+" " +q[0].os_version+"  " +q[0].device_name+" " +p[0].app_path+" "+p[0].app_family+" > "+config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &")
                                shell.exec("sh /Users/samarth.handur/shell_iOS.sh triggerTest "+runDetails[0].cycle_id +" "+runDetails[0].device_id+" " +q[0].os_version+"  " +q[0].device_name+" " +p[0].app_path+" "+p[0].app_family+" > "+config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &").stdout;
                                // res.status(200).json(Object.assign(runDetails, result));
                                callback( Object.assign(runDetails, result));
                                })
                            })
                            })
                        })
                        })
                    }
                else {
                    res.send({
                        "error":"invalid app type"
                    })
                }
            })
        }
        }

    })

}

exports.stopMonitoring = function (req, res) {
    var data = {
        authToken: req.body.authToken,
        cycle_id: req.body.cycle_id
        // device_id:req.body.device_id
    };
    schema.validateAuthToken(data, function (err, content) {
        console.log("----", JSON.stringify(content.verified))
        if (JSON.stringify(content.verified) == 'false') {
            console.log(err);
            res.send('Invalid token');
        } else {
            console.log("i am here")
            _this.getDeviceDetailsFromCycleId(data, function(err, dat){
                console.log(dat)
            if(dat !=null){
            _this.resetAppStatus(dat[0], function (err, result) {
                if (!err) {
                    console.log(JSON.stringify(dat[0]))
                    // try{
                    if(dat[0].app_name!=null){
                    if(dat[0].app_name.slice(-4) == ".apk"){
                        console.log("it is Android application")
                    try{
                        console.log("dat info :: :: ",dat[0].user_name)
                        console.log("dat info :: :: ",dat[0].device_id)
                    // console.log("ps -ax | grep  'MonitoringAndroid-0.0.1-SNAPSHOT-jar-with-dependencies.jar' "+data.cycle_id+" "+dat[0].device_id+"  "+dat[0].device_os+" "+dat[0].device_name+" "+dat[0].app_path+"")
                    console.log("ps -ax | grep  'shell.sh'")
                    var pid = shell.exec("ps -ax | grep  'shell.sh'").stdout;
                    console.log("pid*******",pid.toString())
                   
                    // console.log("usr/bin/java -jar /Users/samarth.handur/MonitoringAndroid-0.0.1-SNAPSHOT-jar-with-dependencies.jar "+data.cycle_id)
                    console.log("PRESENT.. ??",pid.toString().includes("sh /Users/samarth.handur/shell.sh triggerTest "+data.cycle_id))
                        if(pid.toString().includes("sh /Users/samarth.handur/shell.sh triggerTest "+data.cycle_id) == true){
                            var line = "";
                            console.log(pid.split("\n"))
                            // line = pid.split("\n");
                            console.log("i am here")
                            console.log("line.substr(0, 6)", pid.split("\n")[0].substr(0, 6))
                            console.log("kill " + pid.split("\n")[0].substr(0, 6))
                            shell.exec("kill " + pid.split("\n")[0].substr(0, 6)).stdout
        
                    res.send({
                        "status":"stopped succesfully",
                        "appName": dat[0].app_name
                    })

                    }else if(pid.toString().includes("sh /Users/samarth.handur/shell.sh triggerTest_Ichiba "+data.cycle_id) == true){
                    
                        var line = "";
                        console.log(pid.split("\n"))
                        // line = pid.split("\n");
                        console.log("i am here")
                        console.log("line.substr(0, 6)", pid.split("\n")[0].substr(0, 6))
                        console.log("kill " + pid.split("\n")[0].substr(0, 6))
                        shell.exec("kill " + pid.split("\n")[0].substr(0, 6)).stdout
    
                res.send({
                    "status":"stopped succesfully",
                    "appName": dat[0].app_name
                })
                    
                    
                }else{
                        res.send({
                            "status":"No such cycle_id is active for "+dat[0].app_name
                        })
                    }
                    
                }catch(e){
                    res.send({
                        "msg":"no such PID"
                    })
                }
            }else{
                console.log("it is iOS application")
                try{
                    console.log("dat info :: :: ",dat[0].user_name)
                    console.log("dat info :: :: ",dat[0].device_id)
                    console.log("ps -ax | grep  'shell_iOS.sh'")
                    var pid = shell.exec("ps -ax | grep  'shell_iOS.sh'").stdout;
                    console.log("pid  ============================= ",pid.toString())
               
                    var line = "";
                    console.log("sh /Users/samarth.handur/shell_iOS.sh triggerTest "+data.cycle_id)
                    console.log("PRESENT.. ??",pid.toString().includes("sh /Users/samarth.handur/shell_iOS.sh triggerTest "+data.cycle_id))

                    if (pid.toString().includes("sh /Users/samarth.handur/shell_iOS.sh triggerTest "+data.cycle_id)) {
                        line = pid.split("\n");
                        // break;
                    // }
                    var line = "";
                    console.log(pid.split("\n"))
                    // line = pid.split("\n");
                    console.log("i am here")
                    console.log("line.substr(0, 6)", pid.split("\n")[0].substr(0, 6))
                    console.log("kill " + pid.split("\n")[0].substr(0, 6))
                    shell.exec("kill " + pid.split("\n")[0].substr(0, 6)).stdout
                    res.send({
                        "status":"stopped succesfully",
                        "appName":dat.app_name
                    })
                }else{
                    res.status(500).json({
                        "status":"No such cycle_id is active for "+dat[0].app_name
                    })
                }  
                }catch(e){
                    res.status(500).json({
                        "msg":"no such PID"
                    })
                }
            }
        }else{
            res.status(500).json({
                        "error":"not a valid cycle_id"
                    })
        }
                }else{
                    res.status(500).json({
                        "error":err
                    })
                }
            })
        }else{
            res.status(500).json({
                "error":"Empty cycle_id"
            })
        }
        })
        }
    })

}

exports.copyTestReport = function (req, res) {
    var data = {
        username: query.parse(req.url, true).query.user_name,
        deviceId: query.parse(req.url, true).query.device_id
    }
    shell.exec("cp /Users/samarth.handur/MMP/test-output/Generic-Framewrok/Generic-Test1.html /Users/samarth.handur/MMP/" + data.username + "/").stdout;
    res.send("{\r\n   \"response_status\": \"200\",\r\n   \"data\": \"copied test report\"\r\n}");
}
var getAppDetailsFromCycleId = function(data, callback){
    var qr = 'select * from appData where app_id=(select app_id from testCycle where cycle_id='+data.cycle_id+')'
    console.log(qr)
    con_deviceData.query(qr, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            console.log(JSON.stringify(result))
            callback(null, result);
        }
    })
}
var getScriptDetailsFromCycleId = function(p, callback){
    var qr = 'select * from testRunTable where cycle_id='+p.cycle_id
    console.log(qr)
    con_deviceData.query(qr, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            console.log(JSON.stringify(result))
            callback(null, result);
        }
    })
}
exports.getScriptNameMntrlCntrl = function(p, callback){
    var qr = 'select * from customTest where script_id IN (select script_id from testRunTable where cycle_id='+p[0].cycle_id+');'
    console.log(qr)
    con_deviceData.query(qr, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            console.log(JSON.stringify(result))
            callback(null, result);
        }
    })
}
exports.getDeviceInfoMntrlCntrl = function(dat, callback){
    // return new Promise(function (resolve, reject) {    
    var qr='select (select device_id from testCycle where cycle_id='+dat.cycle_id+') as "device_id", (select device_name from deviceData where device_id=(select device_id from testCycle where cycle_id='+dat.cycle_id+') )as "device_name",((select network_type from deviceData where device_id=(select device_id from testCycle where cycle_id='+dat.cycle_id+') )) as "network_type",(select os_version from deviceData where device_id=(select device_id from testCycle where cycle_id='+dat.cycle_id+') )as "os_version",(select monitoring_status from testCycle where cycle_id='+dat.cycle_id+') as "monitoring_status",(select custom_test_status from testCycle where cycle_id='+dat.cycle_id+') as "custom_test_status",(select start_time from testCycle where cycle_id='+dat.cycle_id+') as "start_time",('+dat.cycle_id+') as "cycle_id"'
    //var qr = 'select * from deviceData where device_id=(select device_id from testCycle where cycle_id='+dat.cycle_id+')'
    console.log(qr)
    con_deviceData.query(qr, function(err, resultDB){
        if(err){
            // reject()
            console.log(err);
            callback(err,null)
        }else{ 
            console.log(resultDB)
                callback(null,resultDB)
                // resolve(resultDB);
        }
     })
    // })
}
exports.initiateMonitoringWithExistingCycleID = function (req, res) {
    var data = {
        cycle_id: req.body.cycle_id,
        authToken: req.body.authToken
    };
    schema.validateAuthToken(data, function (err, content) {
        console.log("----", JSON.stringify(content.verified))
        if (JSON.stringify(content.verified) == 'false') {
            console.log(err);
            res.send('Invalid token');
        } else {
            console.log("i am here")
            _this.getDeviceDetailsFromCycleId(data, function(err, device_data){
                console.log("***",device_data)
                if(device_data[0].device_status === "FREE"){
                getAppDetailsFromCycleId(data, function(err, y){
                    console.log("+++++++",y[0])
                    getScriptDetailsFromCycleId(data, function(err, p){
                        console.log("####",p[0].script_id)
                        if(y[0].file_name.slice(-4)==".apk"){
                            console.log("ITS AN ANDROID APPLICATION");
                                _this.setAppStatusWithCycleId(y[0], device_data[0],function (err, dat) {
                                    console.log("dat  ::  ",dat)
                                    _this.insertTestRunTableWithCycleId(dat, p);
                                        _this.getAppStatus(dat, function(er,runDetails){
                                        var result=[];
                                            _this.getDeviceInfoMntrlCntrl(runDetails[0], function (err,records) {
                                                console.log("records", records)
                                                _this.getScriptNameMntrlCntrl(runDetails, function(er, x){
                                                    console.log("getScriptNameMntrlCntrl :: ",JSON.stringify(x))
                                                    if(x[0].script_type=="GENERIC"){
                                                    var script = ({script_name:x})
                                                    records[0].scripts = x
                                                    result.push(records)
                                                    console.log("result array :: ",result)
                                                    if(p[0].script_id == 33){
                                                        console.log("sh /Users/samarth.handur/shell.sh triggerTest_Ichiba  " + runDetails[0].cycle_id + " " + runDetails[0].device_id + " " + records[0].os_version + "  " + records[0].device_name + " " + y[0].app_path + " "+y[0].app_family+" > " + config.remoteDir.concat(y[0].user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &")
                                                        shell.exec("sh /Users/samarth.handur/shell.sh triggerTest_Ichiba  " + runDetails[0].cycle_id + " " + runDetails[0].device_id + " " + records[0].os_version + "  " + records[0].device_name + " " + y[0].app_path + " "+y[0].app_family+" > " + config.remoteDir.concat(y[0].user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &").stdout;
                                                            res.status(200).json(Object.assign(runDetails, result));
                                                    }else{
                                                    console.log("sh /Users/samarth.handur/shell.sh triggerTest  " + runDetails[0].cycle_id + " " + runDetails[0].device_id + " " + records[0].os_version + "  " + records[0].device_name + " " + y[0].app_path + " "+y[0].app_family+" > " + config.remoteDir.concat(y[0].user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &")
                                                    shell.exec("sh /Users/samarth.handur/shell.sh triggerTest  " + runDetails[0].cycle_id + " " + runDetails[0].device_id + " " + records[0].os_version + "  " + records[0].device_name + " " + y[0].app_path + " "+y[0].app_family+" > " + config.remoteDir.concat(y[0].user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &").stdout;
                                                        res.status(200).json(Object.assign(runDetails, result));
                                                }
                                            }else{
                                                var script = ({script_name:x})
                                                    records[0].scripts = x
                                                    result.push(records)
                                                    console.log("result array :: ",result)
                                                    if(p[0].script_id == 33){
                                                        console.log("sh /Users/samarth.handur/shell.sh triggerTest_Ichiba  " + runDetails[0].cycle_id + " " + runDetails[0].device_id + " " + records[0].os_version + "  " + records[0].device_name + " " + y[0].app_path + " "+y[0].app_family+" > " + config.remoteDir.concat(y[0].user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &")
                                                        shell.exec("sh /Users/samarth.handur/shell.sh triggerTest_Ichiba  " + runDetails[0].cycle_id + " " + runDetails[0].device_id + " " + records[0].os_version + "  " + records[0].device_name + " " + y[0].app_path + " "+y[0].app_family+" > " + config.remoteDir.concat(y[0].user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &").stdout;
                                                            res.status(200).json(Object.assign(runDetails, result));
                                                    }else{
                                                        console.log("sh /Users/samarth.handur/shell_calabash.sh triggerCalabashTest  "+y[0].app_path+" "+runDetails[0].device_id+ " "+config.remoteDir.concat(y[0].user_name)+'/'+ " "+runDetails[0].cycle_id+" "+config.remoteDir.concat(y[0].user_name)+'/'+x[0].script_file_name.slice(0,-4).concat("_").concat(x[0].script_id)+ " > " + config.remoteDir.concat(y[0].user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &")
                                                        shell.exec("sh /Users/samarth.handur/shell_calabash.sh triggerCalabashTest  "+y[0].app_path+" "+runDetails[0].device_id+ " "+config.remoteDir.concat(y[0].user_name)+'/'+ " "+runDetails[0].cycle_id+" "+config.remoteDir.concat(y[0].user_name)+'/'+x[0].script_file_name.slice(0,-4).concat("_").concat(x[0].script_id)+" > " + config.remoteDir.concat(y[0].user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &").stdout
                                                        // res.status(200).json(Object.assign(runD
                                                        res.status(200).json(Object.assign(runDetails, result));
                                                }
                                            }
                                                        })
                                                        
                                                    })
                                                })
                                            }) 
                }else if (y[0].file_name.slice(-4) == ".ipa"){
                    console.log("ITS AN IOS APPLICATION");
                    _this.setAppStatusWithCycleId(y[0], device_data[0],function (err, dat) {
                        console.log("dat  ::  ",dat)
                        _this.insertTestRunTableWithCycleId(dat, p);
                        _this.getAppStatus(dat, function(er,runDetails){
                            var result=[];
                            _this.getDeviceInfoMntrlCntrl(runDetails[0], function (err,records) {
                                console.log("records", records)
                                _this.getScriptNameMntrlCntrl(runDetails, function(er, x){
                                    var script = ({script_name:x})
                                    records[0].scripts = x
                                    result.push(records)
                                console.log("result array :: ",result)
                                console.log("sh /Users/samarth.handur/shell_iOS.sh triggerTest "+runDetails[0].cycle_id +" "+runDetails[0].device_id+" " +records[0].os_version+"  " +records[0].device_name+" " +y[0].app_path+" "+y[0].app_family+" > "+config.remoteDir.concat(y[0].user_name)+"/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &")
                                shell.exec("sh /Users/samarth.handur/shell_iOS.sh triggerTest "+runDetails[0].cycle_id +" "+runDetails[0].device_id+" " +records[0].os_version+"  " +records[0].device_name+" " +y[0].app_path+" "+y[0].app_family+" > "+config.remoteDir.concat(y[0].user_name)+"/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &").stdout;
                                res.status(200).json(Object.assign(runDetails, result));
                                })
                            })
                        })
                    })
                }
                else {
                    res.status(500).json({
                        "error":"invalid app type"
                    })
                }
            })
        // }
        })
    }else{
        res.status(500).json({
            "error":"Device is not free"
        })
    }

    })
        }

    })

}

exports.testController = function(req,res){
    var data = {
        user_name: req.body.user_name,
        authToken: req.body.authToken,
        device_id: req.body.device_id,
        platformVersion: req.body.os_version,
        app_id: req.body.app_id,
        deviceName: req.body.device_name,
        script_id: req.body.script_id
    };
    schema.validateAuthToken(data, function (err, content) {
        console.log("----", JSON.stringify(content.verified))
        if (JSON.stringify(content.verified) == 'false') {
            console.log(err);
            res.send('Invalid token');
        } else {
            console.log("data.script_id", data.script_id)
            if(data.script_id.includes('4') || data.script_id.includes('5')){
                console.log("includes")
                _this.initiateMonitoring(data,function(result){
                    res.send(result)
                })
                }else{
                    console.log("not includes")
                    mntrl.runCalabashTest(data,function(result){
                        res.send(result)
                    })
                    
                }
            }
        })

}