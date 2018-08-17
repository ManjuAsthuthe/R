'use strict';
var express = require('express');
var query = require('url');
var app = express();
var schema = require('../models/auth');
var Promise = require('bluebird')
// var record = require('../models/records')
var adb = require('adbkit')
var client = adb.createClient()
var moment = require('moment');
var config = require('../../config.json');
var shell = require('shelljs');
var condenseWhitespace = require('condense-whitespace');
var extract = require('extract-comments');
var stringExtractor = require('string-extractor');
var _this = this;
var mysql = require('mysql');

console.log('Trigger post android.js is initialised')

exports.getAndroidDeviceId = function (req, res) {
    var data = {
        username: query.parse(req.url, true).query.user_name,
        authToken: query.parse(req.url, true).query.authToken
    }
    schema.validateAuthToken(data, function (err, content) {
        var device_name, deviceID, deviceOS, androidVersion = "";
        console.log("----", JSON.stringify(content.verified))
        if (JSON.stringify(content.verified) == 'false') {
            console.log(err);
            res.send('Invalid token');
        } else {
            console.log('Authorised user status >> ' + JSON.stringify(content));
            var list = shell.exec('adb devices').stdout;
            var arryItems = []
            console.log("sam===> ", list.substring(24).split("\n").filter(function (n) { return n != "" }).length);
            // res.send(list.substring(24).split("\n").filter(function(n){ return n != "" })[0].slice(0,-6));
            for (var i = 0; i < list.substring(24).split("\n").filter(function (n) { return n != "" }).length; i++) {
                var devName = shell.exec("adb -s " + list.substring(24).split("\n").filter(function (n) { return n != "" })[i].slice(0, -6) + " shell getprop ro.product.model").stdout
                var osId = shell.exec("adb -s " + list.substring(24).split("\n").filter(function (n) { return n != "" })[i].slice(0, -6) + " shell getprop ro.build.version.release").stdout
                var record = {};
                record.deviceOS = "Android";
                record.device_name = devName;
                record.androidVersion = osId;
                record.device_id = list.substring(24).split("\n").filter(function (n) { return n != "" })[i].slice(0, -6);
                arryItems.push(record)
            }
            var records = {
                records: arryItems
            }
            let recordsJSON = JSON.stringify(records)
            for (var i = 0; i <= recordsJSON.length; i++) {
                var qr = ''
                con_deviceData.query(qr, function (err, result) {
                    //            con_bookDevice.close();
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, result);
                    }
                })
            }
            res.send(recordsJSON)
        }
    }
    )
};
exports.getInstallAPK = function (req, res) {
    var data = {
        username: req.body.user_name,
        authToken: req.body.authToken,
        apkName: req.body.apk_name,
        device_id: req.body.device_id
    };
    var APP_PATH = '/Users/samarth.handur/Documents/Ichiba-Android-Homepage-Scenarios/apps/'
    schema.validateAuthToken(data, function (err, content) {
        if (JSON.stringify(content.verified) == 'false') {
            console.log(err);
            res.send('Invalid token');
        } else {
            console.log('Authorised user');
            shell.exec("adb -s " + data.device_id + " install " + APP_PATH.concat(data.apkName)).stdout
            res.send("{\r\n   \"result\": \"Installed Succesfully\"}")
        }
    })
};

exports.executeADBCommands = function (req, res) {
    var data = {
        username: req.body.user_name,
        authToken: req.body.authToken,
        adbCommand: req.body.adbCommand,
        device_id: req.body.device_id
    };
    schema.validateAuthToken(data, function (err, content) {
        if (JSON.stringify(content.verified) == 'false') {
            console.log(err);
            res.send('Invalid token');
        } else {
            console.log('Authorised user');
            var devices = shell.exec(data.adbCommand).stdout
            console.log(devices);
            res.send(devices);
        }
    })
}
exports.tapAndroidView = function (req, res) {
    var data = {
        username: query.parse(req.url, true).query.user_name,
        // authToken: query.parse(req.url,true).query.authToken,
        device_id: query.parse(req.url, true).query.device_id,
        x_coord: query.parse(req.url, true).query.x_coord,
        y_coord: query.parse(req.url, true).query.y_coord,
    };
    shell.exec("adb -s " + data.device_id + " shell input tap " + data.x_coord + " " + data.y_coord);
    var rs = "{\r\n   \"response_status\": \"200\",\r\n   \"data\": \"Touched succesfully\"\r\n}";
    res.send(rs);
}



exports.swipeDown = function (req, res) {
    var data = {
        username: req.body.user_name,
        authToken: req.body.authToken,
        device_id: req.body.device_id,
    };
    schema.validateAuthToken(data, function (err, content) {
        if (JSON.stringify(content.verified) == 'false') {
            console.log(err);
            res.send('Invalid token');
        } else {
            console.log('Authorised user status >> ' + JSON.stringify(content));
            shell.exec("adb -s " + data.device_id + " shell input swipe 10 1000 10 10");
            var rs = "{\r\n   \"response_status\": \"200\",\r\n   \"data\": \"Touched succesfully\"\r\n}";
            res.send(rs);
        }
    })
}
exports.swipeUp = function (req, res) {
    var data = {
        username: req.body.user_name,
        authToken: req.body.authToken,
        device_id: req.body.device_id,
    };
    schema.validateAuthToken(data, function (err, content) {
        if (JSON.stringify(content.verified) == 'false') {
            console.log(err);
            res.send('Invalid token');
        } else {
            console.log('Authorised user status >> ' + JSON.stringify(content));
            shell.exec("adb -s " + data.device_id + " shell input swipe 800 400 400 1000");
            var rs = "{\r\n   \"response_status\": \"200\",\r\n   \"data\": \"Touched succesfully\"\r\n}";
            res.send(rs);
        }
    })
}
exports.swipeLeft = function (req, res) {
    var data = {
        username: req.body.user_name,
        authToken: req.body.authToken,
        device_id: req.body.device_id,
    };
    schema.validateAuthToken(data, function (err, content) {
        if (JSON.stringify(content.verified) == 'false') {
            console.log(err);
            res.send('Invalid token');
        } else {
            console.log('Authorised user status >> ' + JSON.stringify(content));
            shell.exec("adb -s " + data.device_id + " shell input swipe 1000 800 400 400");
            var rs = "{\r\n   \"response_status\": \"200\",\r\n   \"data\": \"Touched succesfully\"\r\n}";
            res.send(rs);
        }
    })
}
exports.swipeRight = function (req, res) {
    var data = {
        username: req.body.user_name,
        authToken: req.body.authToken,
        device_id: req.body.device_id,
    };
    schema.validateAuthToken(data, function (err, content) {
        if (JSON.stringify(content.verified) == 'false') {
            console.log(err);
            res.send('Invalid token');
        } else {
            console.log('Authorised user status >> ' + JSON.stringify(content));
            shell.exec("adb -s " + data.device_id + " shell input swipe 400 1000 1000 1000");
            var rs = "{\r\n   \"response_status\": \"200\",\r\n   \"data\": \"Touched succesfully\"\r\n}";
            res.send(rs);
        }
    })
}
exports.getApkPackages = function (req, res) {
    var data = {
        username: query.parse(req.url, true).query.user_name,
        authToken: query.parse(req.url, true).query.authToken,
        deviceId: query.parse(req.url, true).query.device_id
    }
    console.log("device id: " + data.deviceId)
    schema.validateAuthToken(data, function (err, content) {
        console.log("----", JSON.stringify(content.verified))
        if (JSON.stringify(content.verified) == 'false') {
            console.log(err);
            res.send('Invalid token');
        } else {
            console.log('Authorised user status >> ' + JSON.stringify(content));
            var pck = shell.exec("adb -s " + data.deviceId + " shell pm list packages -f");
            res.send("{\r\n   \"response_status\": \"200\",\r\n   \"data\": \"" + pck + "\"\r\n}");
        }
    })
}

