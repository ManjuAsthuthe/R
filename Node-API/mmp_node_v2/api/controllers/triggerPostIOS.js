'use strict';
var express = require('express');
var query = require('url');
var app = express();
var schema = require('../models/auth');
var Promise = require('bluebird')
// var record = require('../models/records')
var adb = require('adbkit')
var wd = require('wd');
var client = adb.createClient()
var shell = require('shelljs');
var condenseWhitespace = require('condense-whitespace');
var _this = this;
var mysql = require('mysql');
var express = require('express');
var query = require('url');
var app = express();
var schema = require('../models/auth');
var Promise = require('bluebird')
// var record = require('../models/records')
var adb = require('adbkit')
var client = adb.createClient()
var config = require('../../config.json');
var shell = require('shelljs');
var condenseWhitespace = require('condense-whitespace');
var extract = require('extract-comments');
var stringExtractor = require('string-extractor');
var _this = this;
var mysql = require('mysql');

var con_deviceData = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "r_mobi",
    connectionLimit: 10
})
con_deviceData.connect(function(err){
    if(!err) {
        console.log("Database is connected ... nn");    
    }else {
        console.log("Error connecting database ... con_deviceData"+err);    
    }
});

exports.getiOSDeviceId = function(req,res){
    var data = {
        username: query.parse(req.url,true).query.user_name,
        authToken: query.parse(req.url,true).query.authToken
    }
    var arryItems = []
    var records = {
        records : arryItems
    }
    schema.validateAuthToken(data, function(err, content) {
        var device_name,deviceID,deviceOS,androidVersion="";
        console.log("----", JSON.stringify(content.verified))
        if(JSON.stringify(content.verified) == 'false') {
            console.log(err);
            res.send('Invalid token');  
        } else {
            console.log('Authorised user status >> '+JSON.stringify(content));
            var list = shell.exec("system_profiler SPUSBDataType | sed -n -E -e '/(iPhone|iPad)/,/Serial/s/ *Serial Number: *(.+)/\\1/p'").stdout;
            console.log(list.split("\n").filter(function(n){ return n != "" }).length);
            for(var i=0;i<list.split("\n").filter(function(n){ return n != "" }).length;i++){
                var devName=shell.exec("idevicename -u "+list.split("\n").filter(function(n){ return n != "" })[i]).stdout
                var record ={};
                record.deviceOS="iOS"
                record.device_name=devName
                record.deviceID=list.split("\n").filter(function(n){ return n != "" })[i]
                arryItems.push(record)
                }
              
                let recordsJSON = JSON.stringify(records)
                res.send(recordsJSON)
        }
    })

}

exports.installIPA = function(req,res){
    var data = {
        username: req.body.user_name,
        authToken: req.body.authToken,
        ipaName: req.body.ipa_name,
        device_id: req.body.device_id
    };
    var arryItems = []
    var records = {
        records : arryItems
    }
    var APP_PATH='/Users/samarth.handur/Documents/Ichiba-Android-Homepage-Scenarios/apps/'
    schema.validateAuthToken(data, function(err, content) {
        var device_name,deviceID,deviceOS,androidVersion="";
        console.log("----", JSON.stringify(content.verified))
        if(JSON.stringify(content.verified) == 'false') {
            console.log(err);
            res.send('Invalid token');  
        } else {
            console.log('Authorised user status >> '+JSON.stringify(content));
            var ins = shell.exec("ideviceinstaller -u "+data.device_id+" -i "+APP_PATH.concat(data.ipaName));
            res.send(ins);
        }
    })
}

exports.tapIOSView = function(req, res){
    var data = {
        username: req.body.user_name,
        authToken: req.body.authToken,
        ipaName: req.body.ipa_name,
        device_id: req.body.device_id
    };
    schema.validateAuthToken(data, function(err, content) {
        var device_name,deviceID,deviceOS,androidVersion="";
        console.log("----", JSON.stringify(content.verified))
        if(JSON.stringify(content.verified) == 'false') {
            console.log(err);
            res.send('Invalid token');  
        } else {
            console.log('Authorised user status >> '+JSON.stringify(content));
            res.send("ins");
        }
    })
}
exports.setAppStatus = function(data, callback){
    var qr = 'update appData set monitoring_status = "BUSY", device_id=' + JSON.stringify(data.device_id) + ',device_name=' + JSON.stringify(data.deviceName) + ',device_os= "iOS",os_version=' + JSON.stringify(data.iOSVersion) + ' where user_name = ' + JSON.stringify(data.username) + ' and apk_name = ' + JSON.stringify(data.apkName) + ''
    console.log(qr)
    con_deviceData.query(qr, function(err, result){
//            con_bookDevice.close();
             if(err){
                callback(err,null);
            }else{
                callback(null,result);
        }
    })
}
exports.initiateIOSMonitoring = function(req,res){
    var data = {
        username: req.body.user_name,
        authToken: req.body.authToken,
        device_id: req.body.device_id,
        iOSVersion: req.body.os_version,
        apkName: req.body.apk_name,
        deviceName: req.body.device_name
    };
    schema.validateAuthToken(data, function(err, content) {
        console.log("----", JSON.stringify(content.verified))
        if(JSON.stringify(content.verified) == 'false') {
            console.log(err);
            res.send('Invalid token');  
        } else {
            console.log("i am here")
            _this.setAppStatus(data, function(err, dat){
                if(!err){
                    console.log("updated record")
                }
            })
            console.log("sh /Users/samarth.handur/shell_iOS.sh triggerTest "+data.username+" "+data.device_id+" " +data.iOSVersion+" " +data.apkName+" " +data.deviceName+" > "+config.remoteDir.concat(data.username)+"/monitoring-logs.txt 2>&1 &")
            shell.exec("sh /Users/samarth.handur/shell_iOS.sh triggerTest  "+data.username+" "+data.device_id+" " +data.iOSVersion+" " +data.apkName+" " +data.deviceName+" > "+config.remoteDir.concat(data.username)+"/monitoring-logs_".concat(data.device_id)+".txt 2>&1 &").stdout;
          
            res.send("{\r\n   \"response_status\": \"200\",\r\n   \"data\": \"Started test\"\r\n}");
        }
    })

}

exports.resetAppStatus = function(data, callback){
    var qr = 'update appData set monitoring_status = "FREE" where user_name = '+JSON.stringify(data.username)+' and apk_name = '+JSON.stringify(data.apk_name)+''
    console.log(qr)
    con_deviceData.query(qr, function(err, result){
//            con_bookDevice.close();
             if(err){
                callback(err,null);
            }else{
                callback(null,result);
        }
    })
}
   exports.stopIOSMonitoring = function(req,res){
    var data = {
        username: req.body.user_name,
        authToken: req.body.authToken,
        device_id: req.body.device_id,
        apk_name: req.body.apk_name
    };
    schema.validateAuthToken(data, function(err, content) {
        console.log("----", JSON.stringify(content.verified))
        if(JSON.stringify(content.verified) == 'false') {
            console.log(err);
            res.send('Invalid token');  
        } else {
            _this.resetAppStatus(data, function(err, dat){
                if(!err){
                    console.log("updated record")
                }
            })
            console.log("ps -ax | grep  'MonitoringIOS-0.0.1-SNAPSHOT-jar-with-dependencies.jar '"+data.username+'" "'+data.device_id)
            var pid = shell.exec("ps -ax | grep  'MonitoringIOS-0.0.1-SNAPSHOT-jar-with-dependencies.jar '"+data.username+'" "'+data.device_id).stdout;
            console.log("pid lenghth ============================= ",pid)
           console.log(pid.split("\n").length);
            var line = "";
                   for(var i=0;i<=pid.split("\n").length;i++){
                       if(pid.split("\n")[i].includes("usr/bin/java")){
                           line = pid.split("\n")[i];
                           break;
                       }
                   }
            console.log(line.substr(0,6))
            console.log("kill "+line.substr(0,6))
            shell.exec("kill "+line.substr(0,6)).stdout
   
            res.send("killed")
       
        }
    })

}

exports.haltIOSMonitoring = function(data){
    // var data = {
    //     username: req.body.user_name,
    //     authToken: req.body.authToken,
    //     device_id: req.body.device_id,
    //     apk_name: req.body.apk_name
    // };
    // schema.validateAuthToken(data, function(err, content) {
    //     console.log("----", JSON.stringify(content.verified))
    //     if(JSON.stringify(content.verified) == 'false') {
    //         console.log(err);
    //         res.send('Invalid token');  
    //     } else {
            // _this.resetAppStatus(data, function(err, dat){
            //     if(!err){
            //         console.log("updated record")
            //     }
            // })
            console.log("ps -ax | grep  'MonitoringIOS-0.0.1-SNAPSHOT-jar-with-dependencies.jar '"+data.username+'" "'+data.device_id)
            var pid = shell.exec("ps -ax | grep  'MonitoringIOS-0.0.1-SNAPSHOT-jar-with-dependencies.jar '"+data.username+'" "'+data.device_id).stdout;
            console.log("pid lenghth ============================= ",pid)
           console.log(pid.split("\n").length);
            var line = "";
                   for(var i=0;i<=pid.split("\n").length;i++){
                       if(pid.split("\n")[i].includes("usr/bin/java")){
                           line = pid.split("\n")[i];
                           break;
                       }
                   }
            console.log(line.substr(0,6))
            console.log("kill "+line.substr(0,6))
            shell.exec("kill "+line.substr(0,6)).stdout
   var result = 'killed';
            
       
    //     }
    // })

}