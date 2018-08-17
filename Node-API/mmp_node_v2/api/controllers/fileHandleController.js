'use strict'
var config = require('../../config.json')
let Client = require('ssh2-sftp-client');
let sftp = new Client();
// var config.remoteDir =config.remoteDir;
var schema = require('../models/auth');
var _this = this;
var formidable = require('formidable');
var mntCtrl = require('../controllers/monitoringController')
var db =  require('../controllers/dbConn')
var fs = require('fs');
var shell = require('shelljs');
const dirTree = require('directory-tree');
const decompress = require('decompress');
var moment = require('moment');
var and = require('../controllers/triggerPostAndroid')
var ios = require('../controllers/triggerPostIOS')
var sleep = require('sleep');
var mysql = require('mysql');


var con_deviceData = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "r_mobi",
    connectionLimit: 10,
    multipleStatements: true
})
con_deviceData.connect(function(err){
        if(!err) {
            console.log("Database is connected ...filehandle Controller.js  nn");    
        }else {
            console.log("Error connecting database ... con_deviceData"+err);    
        }
    });

exports.uploadFile = function(req,res){
                    var form = new formidable.IncomingForm();
                    
                    form.parse(req, function (err, fields, files) {
                        console.log("******fileds****** : : ",fields)
                        var data = {
                            userName: fields.user_name,
                            fileName: fields.fileName,
                            authToken: fields.authToken,
                            app_privilege:fields.app_privilege
                            }
                            console.log("================"+data.userName)
                            schema.validateAuthToken(data, function(err, content) {
                                console.log("----", JSON.stringify(content.verified))
                                    if(JSON.stringify(content.verified) == 'false') {
                                            console.log(err);
                                            res.send( "{\r\n   \"errorMsg\": \"Unauthorized user\",\r\n   \"code\": 500\r\n}");  
                                    } else {
                                console.log("++++FILE NAME ++++ :: ", files)
                                        if(files.fileName.name.slice(-4)==".apk"){
                                        var oldpath = files.fileName.path;
                                        console.log(fields)
                                        console.log(files)
                                        var newpath = config.remoteDir.concat(data.userName) +"/" + files.fileName.name;
                                        console.log(newpath)
                                        
                                        fs.rename(oldpath, newpath, function (err) {
                                            if (err) {
                                                console.log("reached")
                                                res.redirect(fields.furl);
                                            }
                                        })
                                        var app_id="";
                                        mntCtrl.getAppVersion(data,files.fileName.name, function(err, result){
                                            console.log(result)
                                            mntCtrl.getAppFamily(data,files.fileName.name, function(err, result_family){
                                                mntCtrl.getAppIconPath(data,files.fileName.name,function(err,result_img){

                                                    console.log(result_img);
                                                    console.log("result_img[0]", result_img[0]);

                                                            console.log("result_img[1]", result_img[1]);
                                                            var app_type="Android"
                                                    var app_name=result_img[0].toString();
                                                    var app_path=config.remoteDir.concat(data.userName)+'/'+files.fileName.name;
                                                    var img_path= "appIcons/"+result_img[1].toString();
                                                    _this.insertApp(data,files.fileName.name,app_name,result,result_family,img_path,app_path,app_type,function(er,p){
                                            // _this.insertApp(data,files.fileName.name,result,result_family, function(er, p){
                                                app_id=p.insertId;
                                                console.log("APP ID 1 :: "+app_id)
                                                // if(files.fileName.name.slice(-4)==".apk"){
                                                fs.rename(config.remoteDir.concat(data.userName)+'/'+files.fileName.name,config.remoteDir.concat(data.userName)+'/'+files.fileName.name.slice(0,-4)+'_'.concat(app_id).concat(".apk"), function (err) {
                                                        if (err) throw err;
                                                        updateFileName(config.remoteDir.concat(data.userName)+'/'+files.fileName.name.slice(0,-4)+'_'.concat(app_id).concat(".apk"),app_id, function(er, res){
                                                            console.log('File Renamed.');
                                                        })
                                                        
                                                      });
                                                      res.status(200).json({ app_id: app_id,message:'Succesfully uploaded'});
                                                    })
                                                })
                                            })
                                        })    
                                    }
                                            else if(files.fileName.name.slice(-4)==".ipa"){
                                                var oldpath = files.fileName.path;
                                                console.log(fields)
                                                console.log(files)
                                                var newpath = config.remoteDir.concat(data.userName) +"/" + files.fileName.name;
                                                console.log(newpath)
                        
                                                fs.rename(oldpath, newpath, function (err) {
                                                    if (err) {
                                                        console.log("reached")
                                                        res.redirect(fields.furl);
                                                    }
                                                })
                                                var app_id="";
                                                mntCtrl.getAppVersion(data,files.fileName.name, function(err, result){
                                                    mntCtrl.getAppFamily(data,files.fileName.name, function(err, result_family){
                                                        mntCtrl.getAppIconPath(data,files.fileName.name,function(err,result_img){

                                                            console.log(result_img[0]);
                                                            console.log(result_img[1]);
                                                            var app_type="iOS"
                                                            var app_name=result_img[0].toString();
                                                            var app_path=config.remoteDir.concat(data.userName)+'/'+files.fileName.name;
                                                            var img_path= "appIcons/"+result_img[1].toString();
                                                            _this.insertApp(data,files.fileName.name,app_name,result,result_family,img_path,app_path,app_type,function(er,p){
                                                    // _this.insertApp(data,files.fileName.name,result, result_family,function(er, p){
                                                        app_id=p.insertId;
                                                        console.log("APP ID 1 :: "+app_id)
                                                        // if(files.fileName.name.slice(-4)==".apk"){
                                                        fs.rename(config.remoteDir.concat(data.userName)+'/'+files.fileName.name,config.remoteDir.concat(data.userName)+'/'+files.fileName.name.slice(0,-4)+'_'.concat(app_id).concat(".ipa"), function (err) {
                                                                if (err) throw err;
                                                                updateFileName(config.remoteDir.concat(data.userName)+'/'+files.fileName.name.slice(0,-4)+'_'.concat(app_id).concat(".ipa"),app_id, function(er, res){
                                                                    console.log('File Renamed.');
                                                                })
                                                                
                                                               
                                                              });
                                                              res.status(200).json({ app_id: app_id,message:'Succesfully uploaded'});
                                                            })
                                                        })
                                                    })
                                                })   
                                                }
                                                else{
                                                    console.log("Not a valid file")
                                                    res.status(401).json({ error: 'Not a valid file'});
                                                }
                            }
                    })
             })
          }


exports.uploadTestScript = function(req,res){
            var form = new formidable.IncomingForm(); 
            form.parse(req, function (err, fields, files) {
                if(files.fileName){
                console.log("FIELDS :: ",fields)
                console.log("files :: ",files)
                var data = {
                    userName: fields.user_name,
                    app_id:fields.app_id,
                    // app_name:fields.app_name,
                    // app_type:fields.app_type,
                    script_name:fields.script_name
                    }
                    console.log("================"+data.userName)
                                console.log("files.fileName.File.name  :: ", files.fileName.name)
                                if(files.fileName.name.slice(-4)==".zip"){
                                var oldpath = files.fileName.path;
                                console.log(fields)
                                console.log(files)
                                var newpath = config.remoteDir.concat(data.userName) +"/" + files.fileName.name;
                                console.log(newpath)
                                
                                fs.rename(oldpath, newpath, function (err) {
                                    if (err) {
                                        console.log("reached")
                                        // res.redirect(fields.furl);
                                    }
                                })
                                var category='CALABASH'
                                    _this.insertScript(data,files.fileName.name,category,  function(er, p){
                                        fs.rename(config.remoteDir.concat(data.userName)+'/'+files.fileName.name,config.remoteDir.concat(data.userName)+'/'+files.fileName.name.slice(0,-4)+'_'.concat(p.insertId).concat(".zip"), function (err) {
                                            if (err) throw err;
                                            console.log('File Renamed.');
                                          });
                                          res.status(200).json({ script_id: p.insertId,message:'Succesfully uploaded'});
                                            })
                                            
                                        // res.redirect(fields.surl.concat(files.fileName.name))
                            }
                            else{
                                if(files.fileName.name.slice(-4)==".jar"){
                                    console.log("its a jar file")
                                    var oldpath = files.fileName.path;
                                    console.log(fields)
                                    console.log(files)
                                    var newpath = config.remoteDir.concat(data.userName) +"/" + files.fileName.name;
                                    console.log(newpath)
                                
                                fs.rename(oldpath, newpath, function (err) {
                                    if (err) {
                                        console.log("reached")
                                        // res.redirect(fields.furl);
                                    }
                                })
                                var category='APPIUM'
                                    _this.insertScript(data,files.fileName.name,category, function(er, p){
                                        fs.rename(config.remoteDir.concat(data.userName)+'/'+files.fileName.name,config.remoteDir.concat(data.userName)+'/'+files.fileName.name.slice(0,-4)+'_'.concat(p.insertId).concat(".jar"), function (err) {
                                            if (err) throw err;
                                            console.log('File Renamed.');
                                          });
                                          res.status(200).json({ script_id: p.insertId,message:'Succesfully uploaded'});
                                            })
                                }else{
                                console.log("Not a valid file")
                                res.status(500).json({ error: 'Not a valid file'});
                                }
                                // res.redirect(fields.furl);
                            }
                        }else{
                            res.status(500).json({ error: 'No files data present'});
                        }
            })
          }
exports.insertApp= function(data,files, app_name,result,result_family,img_path,app_path,app_type, callback){
          var qr= "insert into appData (user_name,file_name,app_name,app_version,time_uploaded, app_family,icon_path, app_path,app_type, app_privilege) values ('"+data.userName+"','"+files+"','"+app_name+"','"+result+"','"+moment().format("YYYY-MM-DD HH:mm:ss")+"', '"+result_family+"','"+img_path+"','"+app_path+"','"+app_type+"','"+data.app_privilege+"')";
          console.log(qr)
          con_deviceData.query(qr,function(err,res){
            if(err){
                console.log(err);
                callback(err,null)
            }else{
                console.log(res);
                callback(null,res)
          }          
        })  
    }
var updateFileName = function(dat,cycle_id, callback){
    var qr = 'update appData set app_path = "'+dat+'" where app_id='+cycle_id;
    con_deviceData.query(qr,function(err,res){
        if(err){
            console.log(err);
            callback(err,null)
        }else{
            console.log(res);
            callback(null,res)
      }          
    }) 
}
exports.insertScript = function(data, files, category,callback){
    var qr = "insert into customTest (user_name,script_file_name,uploaded_time,app_id,script_type,script_status, script_category, script_name) values ('"+data.userName+"','"+files+"','"+moment().format("YYYY-MM-DD HH:mm:ss")+"','"+data.app_id+"','CUSTOM','ACTIVE','"+category+"','"+data.script_name+"')";
    console.log(qr)
    con_deviceData.query(qr, function(err, res){
        if(err){
            console.log(err);
            callback(err,null)
        }else{
             console.log(res);
             callback(null,res)
        }
})
}

exports.deleteApp = function(req,res){
    var data = {
        authToken: req.body.authToken,
        app_name: req.body.app_name, 
        app_version: req.body.app_version,
        user_name:req.body.user_name
    }
    schema.validateAuthToken(data, function(err, content) {
        console.log("----", JSON.stringify(content.verified))
            if(JSON.stringify(content.verified) == 'false') {
                    console.log(err);
                    res.send( {"errorMsg": "Unauthorized user",
                              "code": 500});  
            } else {
                console.log("valid user=================")
                console.log(data.apk_name)
                
                // and.HaltAndroidMonitoring(data);
                db.getUserSpecificAppCycleID(data, function(er, result){
                if(er){
                    res.send({
                        "error":er,
                    })
                }else{
                    console.log("cycle_ID Length :: "+result.length)
                    console.log("cycle ids :: "+result)
                    for(var i=0;i<result.length;i++){
                        var qr = 'delete from testData  where cycle_id = '+JSON.stringify(result[i].cycle_id)+''
                        console.log(qr)    
                        con_deviceData.query(qr, function(err, result){
                                 if(err){
                                    console.log(err)
                                }else{
                                    console.log(result)
                                    
                            }
                        })
                    }
                    var qr = 'delete from testCycle  where user_name = '+JSON.stringify(data.user_name)+' and app_name='+JSON.stringify(data.app_name)+'and app_version = '+JSON.stringify(data.app_version)
                    console.log(qr)    
                    con_deviceData.query(qr, function(err, result){
                             if(err){
                                console.log(error)
                                res.send({
                                    "error":err
                                })
                            }else{
                                console.log(result)
                                res.send({
                                    "status":"deleted successfully"
                                })   
                             }
                        })
                     }
                })
            }
        })
}
exports.deleteCustomTestScripts = function(req,res){
    var data = {
        script_id: req.body.script_id,
        authToken: req.body.authToken,
        }
        console.log(data)
        schema.validateAuthToken(data, function(err, content) {
           console.log("----", JSON.stringify(content.verified))
               if(JSON.stringify(content.verified) == 'false') {
                       console.log(err);
                       res.send( {"errorMsg": "Unauthorized user","code": 500});  
               } else {
                var qr = 'UPDATE  customTest set script_status="DELETED" where script_id in ('+data.script_id+')'
                console.log(qr)    
                con_deviceData.query(qr, function(err, result){
                         if(err){
                            res.status(500).json({
                                "error":"something went wrong"
                            })
                        }else{
                            console.log(result)
                            res.send({
                                "status":"deleted successfully"
                            })   
                         }
                    })

               }
            })
}

exports.listFiles = function(req, res){
    var data = {
        userName: req.body.user_name,
        authToken: req.body.authToken,
        }
        console.log(data)
         schema.validateAuthToken(data, function(err, content) {
            console.log("----", JSON.stringify(content.verified))
                if(JSON.stringify(content.verified) == 'false') {
                        console.log(err);
                        res.send( "{\r\n   \"errorMsg\": \"Unauthorized user\",\r\n   \"code\": 500\r\n}");  
                } else {
                        try{
                            const tree = dirTree(config.remoteDir.concat(data.userName)+'/');
                            res.send(tree)
                            
                        }catch(err){
                            var e = "{\r\n   \"errorMsg\": \""+err+"\",\r\n   \"code\": 500\r\n}"                                        
                            return e;
                        }      
                }
         })
    }

exports.createUserFolderOnLogin = function(data){
                    if(!fs.existsSync(config.remoteDir.concat(data.email))){
                        fs.mkdirSync(config.remoteDir.concat(data.email))
                }
                    else{
                        console.log("error")
                }
                }


exports.unzipFiles = function(data, script){
        return new Promise(function(resolve, reject) { 
            decompress(config.remoteDir.concat(data.user_name)+'/'+script[0].script_file_name.slice(0,-4).concat("_").concat(data.script_id).concat(".zip"), config.remoteDir.concat(data.user_name)).then(files => {          
                console.log('decompression done!');
                fs.rename(config.remoteDir.concat(data.user_name)+'/'+script[0].script_file_name.slice(0,-4), config.remoteDir.concat(data.user_name)+'/'+script[0].script_file_name.slice(0,-4).concat("_").concat(data.script_id), function (err) {
                    if (err) throw err;
                    console.log('File Renamed.');
                  });
              
                resolve();
            }).catch((err) => { 
                reject(err);
            });                          
        });
        console.log(config.remoteDir.concat(data.userName)+'/'+data.fileName)

}
var getScriptNameFromScriptId = function(data, callback){
    var qr = 'select * from customTest where script_id in ('+data.script_id+')'
                    console.log(qr)    
                    con_deviceData.query(qr, function(err, result){
                             if(err){
                                console.log(err)
                                callback(err,null)
                            }else{
                                console.log(result)
                                callback(null,result)
                             }
})
}

exports.runCalabashTest = function(data, callback){
    // var data = {
    //     userName: req.body.user_name,
    //     authToken: req.body.authToken,
    //     script_id: req.body.script_id,
    //     // deviceOS: req.body.device_os,
    //     app_id: req.body.app_id,
    //     device_id: req.body.device_id,
    //     }
         schema.validateAuthToken(data, function(err, content) {
            console.log("----", JSON.stringify(content.verified))
                if(JSON.stringify(content.verified) == 'false') {
                        console.log(err);
                        res.send({"errorMsg": "Unauthorized user","code": 500});  
                } else {
                    mntCtrl.getDeviceDetailsFromDeviceId(data, function(err, dev){
                        console.log("++++++++++++++++++++",dev[0].device_os)
                    getScriptNameFromScriptId(data, function(err,script){
                        console.log("FILE NAME :: ", config.remoteDir.concat(data.user_name)+'/'+script[0].script_file_name.slice(0,-4).concat("_").concat(data.script_id[0]))
                    console.log("===="+fs.existsSync(config.remoteDir.concat(data.user_name)+'/'+script[0].script_file_name.slice(0,-4).concat("_").concat(data.script_id[0])))
                    if (fs.existsSync(config.remoteDir.concat(data.user_name)+'/'+script[0].script_file_name.slice(0,-4).concat("_").concat(data.script_id[0])) == false) {
                        _this.unzipFiles(data, script).then(() => { 
                            console.log("file unzipped and renamed")
                            db.getAppNameFromAppId(data, function(err,appName){ 
                            console.log("cd "+config.remoteDir.concat(data.user_name)+'/'+script[0].script_file_name.slice(0,-4).concat("_").concat(data.script_id[0]))
                            if(dev[0].device_os=="iOS"){
                                var result=[];
                                mntCtrl.getAppDetails(data, function(er,q){
                                mntCtrl.setAppStatusCustomScript(data, function(er, dat){
                                    mntCtrl.insertTestRunTable(dat, data);
                                        mntCtrl.getAppStatus(dat, function(er,runDetails){
                                            mntCtrl.getDeviceInfoMntrlCntrl(runDetails[0], function (err,records) {
                                                console.log("records +++++++++++ ", records)
                                                mntCtrl.getScriptNameMntrlCntrl(runDetails,function(er,x){
                                                    var script = ({script_name:x})
                                                    records[0].scripts = x
                                                    result.push(records)
                                                    console.log("sh /Users/samarth.handur/shell_calabash_iOS.sh triggerCalabashTest  "+q[0].app_path+" "+data.device_id+ " "+config.remoteDir.concat(data.user_name)+'/'+ " "+runDetails[0].cycle_id+" "+config.remoteDir.concat(data.user_name)+'/'+x[0].script_file_name.slice(0,-4).concat("_").concat(x[0].script_id)+ " > " + config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &")
                                                        shell.exec("sh /Users/samarth.handur/shell_calabash_iOS.sh triggerCalabashTest  "+q[0].app_path+" "+data.device_id+ " "+config.remoteDir.concat(data.user_name)+'/'+ " "+runDetails[0].cycle_id+" "+config.remoteDir.concat(data.user_name)+'/'+x[0].script_file_name.slice(0,-4).concat("_").concat(x[0].script_id)+" > " + config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &").stdout
                                                        // res.status(200).json(Object.assign(runDetails, result));
                                                        callback(Object.assign(runDetails, result));
                                                    })
                                                })
                                            })
                                        })
                                    })
                            }else{
                                var result=[];
                                mntCtrl.getAppDetails(data, function(er,q){
                                    console.log(" q :: ",q[0].app_path)
                                mntCtrl.setAppStatusCustomScript(data, function(er, dat){
                                    mntCtrl.insertTestRunTable(dat, data);
                                        mntCtrl.getAppStatus(dat, function(er,runDetails){
                                            mntCtrl.getDeviceInfoMntrlCntrl(runDetails[0], function (err,records) {
                                                console.log("records", records)
                                                mntCtrl.getScriptNameMntrlCntrl(runDetails,function(er,x){
                                                    var script = ({script_name:x})
                                                    records[0].scripts = x
                                                    result.push(records)
                                                        // console.log("calabash-android run "+q[0].app_path+" ADB_DEVICE_ARG="+data.device_id+" -f html -o "+config.remoteDir.concat(data.user_name)+'/'+"test-result_"+runDetails[0].cycle_id+".html > " + config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &");
                                                        // shell.exec("calabash-android resign "+q[0].app_path)
                                                        // shell.exec("calabash-android run  "+q[0].app_path+" ADB_DEVICE_ARG="+data.device_id+" -f html -o "+config.remoteDir.concat(data.user_name)+'/'+"test-result_"+runDetails[0].cycle_id+".html > " + config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &").stdout
                                                        console.log("sh /Users/samarth.handur/shell_calabash.sh triggerCalabashTest  "+q[0].app_path+" "+data.device_id+ " "+config.remoteDir.concat(data.user_name)+'/'+ " "+runDetails[0].cycle_id+" "+config.remoteDir.concat(data.user_name)+'/'+x[0].script_file_name.slice(0,-4).concat("_").concat(x[0].script_id)+ " > " + config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &")
                                                        shell.exec("sh /Users/samarth.handur/shell_calabash.sh triggerCalabashTest  "+q[0].app_path+" "+data.device_id+ " "+config.remoteDir.concat(data.user_name)+'/'+ " "+runDetails[0].cycle_id+" "+config.remoteDir.concat(data.user_name)+'/'+x[0].script_file_name.slice(0,-4).concat("_").concat(x[0].script_id)+" > " + config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &").stdout
                                                    //  res.status(200).json(Object.assign(runDetails, result));
                                                    callback(Object.assign(runDetails, result));
                                                })
                                            })
                                        })
                                    })
                                })
                             }
                        })
                    });
                    }else{
                    console.log("already zipped")
                    db.getAppNameFromAppId(data, function(er, appName){ 
                        console.log("cd "+config.remoteDir.concat(data.user_name)+'/'+script[0].script_file_name.slice(0,-4).concat("_").concat(data.script_id[0]))
                        if(dev[0].device_os=="iOS"){
                            var result=[];
                            mntCtrl.getAppDetails(data, function(er,q){
                            mntCtrl.setAppStatusCustomScript(data, function(er, dat){
                                mntCtrl.insertTestRunTable(dat, data);
                                    mntCtrl.getAppStatus(dat, function(er,runDetails){
                                        mntCtrl.getDeviceInfoMntrlCntrl(runDetails[0], function (err,records) {
                                            console.log("records", records)
                                            mntCtrl.getScriptNameMntrlCntrl(runDetails,function(er,x){
                                                var script = ({script_name:x})
                                                records[0].scripts = x
                                                result.push(records)
                                                console.log("sh /Users/samarth.handur/shell_calabash_iOS.sh triggerCalabashTest  "+q[0].app_path+" "+data.device_id+ " "+config.remoteDir.concat(data.user_name)+'/'+ " "+runDetails[0].cycle_id+" "+config.remoteDir.concat(data.user_name)+'/'+x[0].script_file_name.slice(0,-4).concat("_").concat(x[0].script_id)+ " > " + config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &")
                                                shell.exec("sh /Users/samarth.handur/shell_calabashiOS.sh triggerCalabashTest  "+q[0].app_path+" "+data.device_id+ " "+config.remoteDir.concat(data.user_name)+'/'+ " "+runDetails[0].cycle_id+" "+config.remoteDir.concat(data.user_name)+'/'+x[0].script_file_name.slice(0,-4).concat("_").concat(x[0].script_id)+" > " + config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &").stdout
                                                console.log("calabash-ios run "+q[0].app_path+" DEVICE_TARGET="+data.device_id+" > " + config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &")
                                                shell.exec("calabash-ios run "+q[0].app_path+" DEVICE_TARGET="+data.device_id+" > " + config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &").stdout
                                        // res.status(200).json(Object.assign(runDetails, result));
                                        callback(Object.assign(runDetails, result));
                            })
                        })
                    })
                })
            })
                        }else{
                            var result=[];
                            mntCtrl.getAppDetails(data, function(er,q){
                            mntCtrl.setAppStatusCustomScript(data, function(er, dat){
                                mntCtrl.insertTestRunTable(dat, data);
                                    mntCtrl.getAppStatus(dat, function(er,runDetails){
                                        mntCtrl.getDeviceInfoMntrlCntrl(runDetails[0], function (err,records) {
                                            console.log("records", records)
                                            mntCtrl.getScriptNameMntrlCntrl(runDetails,function(er,x){
                                                var script = ({script_name:x})
                                                records[0].scripts = x
                                                result.push(records)
                                                console.log("x.script_name ::: ", x[0].script_name.slice(0,-4).concat("_").concat(data.script_id[0]) )
                                                // console.log("calabash-android run "+q[0].app_path+" ADB_DEVICE_ARG="+data.device_id+" -f html -o test-result.html > "+config.remoteDir.concat(data.user_name)+"/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &");
                                                // shell.exec("calabash-android run "+q[0].app_path+" ADB_DEVICE_ARG="+data.device_id+"  -f html -o test-result.html > "+config.remoteDir.concat(data.user_name)+"/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &").stdout
                                                console.log("sh /Users/samarth.handur/shell_calabash.sh triggerCalabashTest  "+q[0].app_path+" "+data.device_id+ " "+config.remoteDir.concat(data.user_name)+'/'+ " "+runDetails[0].cycle_id+" "+config.remoteDir.concat(data.user_name)+'/'+x[0].script_file_name.slice(0,-4).concat("_").concat(x[0].script_id)+ " > " + config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &")
                                                shell.exec("sh /Users/samarth.handur/shell_calabash.sh triggerCalabashTest  "+q[0].app_path+" "+data.device_id+ " "+config.remoteDir.concat(data.user_name)+'/'+ " "+runDetails[0].cycle_id+" "+config.remoteDir.concat(data.user_name)+'/'+x[0].script_file_name.slice(0,-4).concat("_").concat(x[0].script_id)+" > " + config.remoteDir.concat(data.user_name) + "/monitoring-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &").stdout
                                                // res.status(200).json(Object.assign(runDetails, result));
                                                callback(Object.assign(runDetails, result));
                                            })
                                         })
                                    })
                                })
                            })
                         }
                    })
                }      
            })
        })
    }
})            
}

exports.getCalabashDoneFlag = function(req,res){
    var data = {
        userName: req.body.user_name,
        cycle_id: req.body.cycle_id
    }
    fs.readFile(config.remoteDir.concat(data.userName)+"/calabash-logs_".concat(data.cycle_id)+".txt", function (err, data) {
        if (err) throw err;
        console.log(data.indexOf("n DONE"))
        if(data.indexOf("n DONE") >= 0){
         console.log(data)
         res.send({err:"found"})
        }else{
            res.send({err:"NOT found"})
        }
      });
}
exports.runAppiumJarFile = function(req,res){
    var data = {
        userName: req.body.user_name,
        authToken: req.body.authToken,
        script_id: req.body.script_id,
        app_id: req.body.app_id,
        device_id: req.body.device_id,
        }

        schema.validateAuthToken(data, function(err, content) {
            console.log("----", JSON.stringify(content.verified))
                if(JSON.stringify(content.verified) == 'false') {
                        console.log(err);
                        res.send({"errorMsg": "Unauthorized user","code": 500});  
                } else {
                    mntCtrl.getDeviceDetailsFromDeviceId(data, function(err, dev){
                        getScriptNameFromScriptId(data, function(err,script){
                            console.log("JAR FILE NAME :: ", config.remoteDir.concat(data.userName)+'/'+script[0].script_name.slice(0,-4).concat("_").concat(data.script_id).concat(".jar"))
                            if(dev[0].device_os == "iOS"){
                                console.log("iOS")
                                var result=[];
                                mntCtrl.getAppDetails(data, function(er,q){
                                mntCtrl.setAppStatusCustomScript(data, function(er, dat){
                                    mntCtrl.insertTestRunTable(dat, data);
                                        mntCtrl.getAppStatus(dat, function(er,runDetails){
                                            mntCtrl.getDeviceInfoMntrlCntrl(runDetails[0], function (err,records) {
                                                console.log("records", records)
                                                mntCtrl.getScriptNameMntrlCntrl(runDetails,function(er,x){
                                                    var script = ({script_name:x})
                                                    records[0].scripts = x
                                                    result.push(records)
                                                       console.log("calabash-ios run "+q[0].app_path+" "+data.device_id+" > " + config.remoteDir.concat(data.user_name) + "/calabash-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &")
                                                       shell.exec("calabash-ios run "+q[0].app_path+" "+data.device_id+" > " + config.remoteDir.concat(data.user_name) + "/calabash-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &").stdout
                                                       res.status(200).json(Object.assign(runDetails, result));
                                                     })
                                                })
                                            })
                                        })
                                    })
                                }
                            else {
                                if(dev[0].device_os == "Android"){
                                    console.log("Android")
                                    var result=[];
                                    mntCtrl.getAppDetails(data, function(er,q){
                                        console.log(" q:: ",q[0].file_name)
                                    mntCtrl.setAppStatusCustomScript(data, function(er, dat){
                                        mntCtrl.insertTestRunTable(dat, data);
                                            mntCtrl.getAppStatus(dat, function(er,runDetails){
                                                mntCtrl.getDeviceInfoMntrlCntrl(runDetails[0], function (err,records) {
                                                    console.log("records", records)
                                                    mntCtrl.getScriptNameMntrlCntrl(runDetails,function(er,x){
                                                        var script = ({script_name:x})
                                                        records[0].scripts = x
                                                        result.push(records)
                                                        console.log("calabash-android run "+q[0].app_path+" "+data.device_id+" > " + config.remoteDir.concat(data.user_name) + "/calabash-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &")
                                                        shell.exec("calabash-ios run "+q[0].app_path+" "+data.device_id+" > " + config.remoteDir.concat(data.user_name) + "/calabash-logs_".concat(runDetails[0].cycle_id)+".txt 2>&1 &").stdout
                                                        res.status(200).json(Object.assign(runDetails, result));
                                                    })
                                                })
                                            })
                                        })
                                    })
                                }
                             }
                        })
                     })
                }
            })
        }
  

