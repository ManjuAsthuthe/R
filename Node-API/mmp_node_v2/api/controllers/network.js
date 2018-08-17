
'use strict'
var express = require('express');
var query = require('url');
var fs = require('fs');  // file system
var app = express();
var config = require('../../config.json');
var schema = require('../models/auth');
var Promise = require('bluebird')
var mysql = require('mysql');
// var record = require('../models/records')
var shell = require('shelljs');
var config = require('../../config.json')
var ip = require('ip');
var _this = this;
var exec = require('node-ssh-exec');
var arp = require('node-arp');
var fd = process.argv[2];
var rl = require('readline-specific')
var db = require('../controllers/dbConn')
var fileTailer = require('file-tail');
const readLastLines = require('read-last-lines');
var mnt = require('../controllers/monitoringController')
//    ft = require('file-tail').startTailing(fd);

var con_deviceData = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "r_mobi",
    connectionLimit: 10
})
console.log('Network.js is initialised ..')

exports.getSystemIP =function(){
    console.log(ip.address())
    return ip.address();
};

exports.connectToLiveView = function(req, res){
    var data = {
        authToken: req.body.authToken,
        cycle_id: req.body.cycle_id
        }
         schema.validateAuthToken(data, function(err, content) {
            console.log("----", JSON.stringify(content.verified))
                if(JSON.stringify(content.verified) == 'false') {
                        console.log(err);
                        res.status(500).json({errorMsg:"Unauthorized user"});  
                } else {
                    mnt.getDeviceDetailsFromCycleId(data, function(er, dev){
                        console.log("dev :: ",dev[0].device_id)
                        // getDeviceIPAddress(data.device_id, function(result){
                            switch (dev[0].device_id) {
                                case '2335452b':
                                res.send({
                                    live_url:"http://".concat(ip.address()).concat(":9092"),
                                    device_name: dev[0].device_name        
                                })
                                break;
                                case '08df4c900c025bb2':
                                res.send({
                                    live_url:"http://".concat(ip.address()).concat(":9091"),
                                    device_name: dev[0].device_name
                                })
                                break;
                                case '5200a4fab8e884d5':
                                res.send({
                                    live_url:"http://".concat(ip.address()).concat(":9093"),
                                    device_name: dev[0].device_name
                                 })
                                 break;
                                case '520012b0e2b48483':
                                res.send({
                                    live_url:"http://".concat(ip.address()).concat(":9090"),
                                    device_name: dev[0].device_name
                                })
                                break;
                                default:
                                    console.log("not a valid device_id") 
                                    res.send({error:'Not a valid device_id'})
                                    break;
                                }
                    })
                }
            
        })
    }
var getDeviceIPAddress = function(device_id, callback){
    var ipaDDR = shell.exec("adb -s "+device_id+" shell ip route").stdout
    callback(ipaDDR.toString().slice(-14).trim());
}
exports.tailCalabashLogData = function(req,res){
   var data = {
        userName: query.parse(req.url,true).query.user_name,
        cycle_id:query.parse(req.url,true).query.cycle_id
        }
  console.log(config.remoteDir.concat(data.userName) +"/monitoring-logs_".concat(data.cycle_id)+".txt");
   readLastLines.read(config.remoteDir.concat(data.userName) +"/monitoring-logs_".concat(data.cycle_id)+".txt", 100)
    .then((lines) => res.send(lines));

}

exports.tailMonitoringLogData = function(req,res){
   var data = {
        userName: query.parse(req.url,true).query.user_name,
        cycle_id:query.parse(req.url,true).query.cycle_id
        }
//    db.getDeviceInfoFromTestCycle(data, function(er,result){
       console.log(config.remoteDir.concat(data.userName) +"/monitoring-logs_".concat(data.cycle_id)+".txt")
    readLastLines.read(config.remoteDir.concat(data.userName) +"/monitoring-logs_".concat(data.cycle_id)+".txt", 100)
    .then((lines) => res.send(lines));
//    })
   
}

exports.tailAppiumLogData = function(req,res){
    var data = {
         userName: query.parse(req.url,true).query.user_name,
         cycle_id:query.parse(req.url,true).query.cycle_id
         }
    // db.getDeviceInfoFromTestCycle(data, function(er,result){
        console.log(config.remoteDir.concat(data.userName) +"/appium-logs_".concat(data.cycle_id)+".txt")
     readLastLines.read(config.remoteDir.concat(data.userName) +"/appium-logs_".concat(data.cycle_id)+".txt", 100)
     .then((lines) => res.send(lines));
    // })
    
 }
exports.downloadMonitoringLogs = function(req,res){
    var data = {
        userName: query.parse(req.url,true).query.user_name,
        cycle_id:query.parse(req.url,true).query.cycle_id
        }
        console.log(config.remoteDir.concat(data.userName))
        console.log("/monitoring-logs_".concat(data.cycle_id)+".txt")

    var file =config.remoteDir.concat(data.userName).concat("/monitoring-logs_".concat(data.cycle_id)+".txt");
    res.download(file); 
}




