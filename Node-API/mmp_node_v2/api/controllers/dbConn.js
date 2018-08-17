

var mysql = require('mysql');
var config = require('../../config.json')
var mergeJSON = require("merge-json") ;
var schema = require('../models/auth');
var moment = require('moment');
var _this = this;
var DateTime = require('datetime-converter-nodejs');
var query = require('url');
var s =[];

var db_config = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "r_mobi",
  
};

var con_deviceData = mysql.createPool(db_config);

var executeDBQuery = function(qr, callback){
    con_deviceData.query(qr, function(err, result){
        if(err){
           callback(err,null)
            }else
            {
            callback(null,result)
        }
    })
}
// con_deviceData.connect(function(err){
//         if(!err) {
//             console.log("Database is connected ..DB CON. nn");    
//         }else {
//             console.log("Error connecting database ... con_deviceData"+err);    
//         }
//     });

    con_deviceData.getConnection(function(err){
        if(err){
            console.log("\n\t ******* Cannot  establish a connection with database *******" + err)
        }else{
            console.log("\n\t ******* New connection established with database *******")
        }
    });


    function reconnect(con_deviceData){
        console.log("\n New connection tentative");

        con_deviceData = mysql.createPool(db_config);

        con_deviceData.getConnection(function(err){
            if(err){
                setTimeout(reconnect(con_deviceData), 2000);
            }else{
                console.log("\n\t ******* New connection established with database *******")
                return con_deviceData;
            }
        });
    }

    con_deviceData.on('error', function(err){

        if(err.code === "PROTOCOL_CONNECTION_LOST"){    
            console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
            return reconnect(con_deviceData);
        }
    
        else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){
            console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
            return reconnect(con_deviceData);
        }
    
        else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){
            console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
            return reconnect(con_deviceData);
        }
    
        else if(err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE"){
            console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        }
    
        else{
            console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
            return reconnect(con_deviceData);
        }
    
    });



// con_bookDevice.connect();
// exports.bookDevice = function(req, res){
//     var data = {
//         state: req.body.state,
//         start_time: req.body.start_time,
//         device_id: req.body.device_id,
//         authToken: req.body.authToken,
//         user_name: req.body.user_name,
//         end_time: req.body.end_time
//         }
//          schema.validateAuthToken(data, function(err, content) {
//                 if(JSON.stringify(content.verified) == 'false') {
//                         console.log(err);
//                         res.send({"errorMsg": "Unauthorized user",
//                             "code": 500
//                         });  
//                 } else {
//                     _this.getUserBookedSlots(data, function(er,dat){
//                         if(er){
//                             res.send({"errorMsg": er,
//                             "code": 500
//                         })
//                         }else{
//                             try{                            
//                                 var booked = false 
//                                 for(var i=0;i<dat.length;i++){
//                                     if((moment(data.start_time).format("YYYY-MM-DD HH:mm:ss")>=moment(dat[i].start_time).format("YYYY-MM-DD HH:mm:ss")                                                
//                                         && moment(data.start_time).format("YYYY-MM-DD HH:mm:ss")<=moment(dat[i].end_time).format("YYYY-MM-DD HH:mm:ss"))
//                                         || (moment(data.end_time).format("YYYY-MM-DD HH:mm:ss")<=moment(dat[i].end_time).format("YYYY-MM-DD HH:mm:ss")                                                
//                                         && moment(data.end_time).format("YYYY-MM-DD HH:mm:ss")>=moment(dat[i].start_time).format("YYYY-MM-DD HH:mm:ss")))
//                                    {
//                                     booked = true                                    
//                                     break;
//                                 }                                
//                             }
//                             if(!booked)
//                             {
//                               console.log("Not booked, proceding to book this");
//                                 {
//                                     con_bookDevice.query("insert into deviceState(device_id, end_time,start_time,user_name, port) values ('"+data.device_id+"','"+data.end_time+"','"+data.start_time+"','"+data.user_name+"','"+data.state+"');", function(err, result){
// //                                        con_bookDevice.close();
//                                         if(err){
//                                             res.send({"error": err,
//                                             "status": 400});
//                                         }else{
//                                             res.send({"statusMsg": "updated sucesfully",
//                                             "code": 200})
//                                         }
//                                     });
//                                 }
//                             } else {
//                                 console.log("check3");
//                                 res.send({"statusMsg": "This device is already booked in this time slot",
//                                 "code": 400
//                              });
//                             }     
//                         }catch(errorMsg){
//                             res.send(errorMsg)
//                             }   
//                         }
//                     })
//                 }
//         })
// }

// exports.getUserBookedSlots = function(data, callback){
//     console.log("select * from deviceState where user_name = "+"'"+data.user_name+"'"+"")
//         con_bookDevice.query("select * from deviceState where user_name = "+"'"+data.user_name+"'"+"", function(err, result){
// //            con_bookDevice.close();
//              if(err){
//                 callback(err,null);
//             }else{
//                 callback(null,result);
//         }
//     })
// }

exports.insertTestData = function(req,res){
     var data = {
        cycle_id: req.body.cycle_id,
        end_time: req.body.end_time,
        test_name:req.body.test_name,
        test_status:req.body.test_status,
        memory_consumed:req.body.memory_consumed,
        start_time: req.body.start_time,
        cpu_usage: req.body.cpu_usage,
        battery_usage: req.body.battery_usage,
        test_time: req.body.test_time,
        battery_before:req.body.battery_before,
        battery_after:req.body.battery_after,
        failure_exp:req.body.failure_exp
        }
        var qr = "INSERT INTO testData (cycle_id,test_name,test_status, memory_consumed, start_time, end_time, cpu_usage, battery_usage,test_time, failure_exp, battery_before, battery_after) VALUES "
			      		+ "('"+data.cycle_id+"','"+data.test_name+"','"+data.test_status+"','"
			      		+data.memory_consumed+"','"+data.start_time+"','"
			      		+data.end_time+"','"+data.cpu_usage+"','"+data.battery_usage+"','"+data.test_time+"','"+data.battery_after+"','"+data.battery_before+"','"+data.failure_exp+"')";
        console.log(qr)
            con_deviceData.query(qr, function(err, result){
                if(err){
                    console.log("inserted failure"+ err)
                    res.send({"errorMsg": err,
                    "status": 400
                    });
                }else
                    {
                        console.log("inserted sucesfully")
                    res.send({
                            "statusMsg": "inserted sucesfully",
                            "code": 200
                            })
                        }
         })
}
exports.updateTestData = function(req,res){
    var data = {
       cycle_id: req.body.cycle_id,
       end_time: req.body.end_time,
       test_name:req.body.test_name,
       test_status:req.body.test_status,
       memory_consumed:req.body.memory_consumed,
       start_time: req.body.start_time,
       cpu_usage: req.body.cpu_usage,
       battery_usage: req.body.battery_usage,
       test_time: req.body.test_time,
       battery_before:req.body.battery_before,
       battery_after:req.body.battery_after,
       failure_exp:req.body.failure_exp
       }
       var qr = "UPDATE testData set test_name='"+data.test_name+"',test_status='"+data.test_status+"', memory_consumed='"+data.memory_consumed+"', start_time='"+data.start_time+"', end_time='"+data.end_time+"', cpu_usage='"+data.cpu_usage+"', battery_usage='"+data.battery_usage+"',test_time='"+data.test_time+"' ,battery_before='"+data.battery_before+"',battery_after='"+data.battery_after+"', failure_exp='"+data.failure_exp+"' where cycle_id="+data.cycle_id+"";
       console.log(qr)
           con_deviceData.query(qr, function(err, result){
               if(err){
                   console.log("updated failure"+ err)
                   res.send({"errorMsg": err,
                   "status": 400
                   });
               }else
                   {
                       console.log("updated sucesfully")
                   res.send({
                           "statusMsg": "updated sucesfully",
                           "code": 200
                           })
                       }
        })
}

exports.updateDeviceData = function(req,res){
    var data = {
       cycle_id: req.body.cycle_id,
       monitoring_status: req.body.monitoring_status
       }
        var qr = 'update testCycle set monitoring_status= "FREE" where cycle_id='+data.cycle_id+''
        console.log(qr)
        con_deviceData.query(qr, function(err, result){
                if(err){
                    res.status(400).json({"errorMsg": err,
                    "status": 400});
                }else
                var qr_2='update deviceData set device_status="FREE" where device_id=(select device_id from testCycle where cycle_id='+data.cycle_id+');'
                con_deviceData.query(qr_2,function(er,r){
                    if(err){
                        res.status(400).json({"errorMsg": err,
                        "status": 400});
                    }else
                    {
                        console.log("updated sucesfully")
                        res.send({"statusMsg": "updated sucesfully",
                        "code": 200})
                    }
                })
                
        })
}
//con_deviceData.connect()
exports.getTotalDevices = function(req,res){
    var data = {
          user_name: query.parse(req.url,true).query.user_name,
          authToken: query.parse(req.url,true).query.authToken,
      }
           schema.validateAuthToken(data, function(err, content) {
                  if(JSON.stringify(content.verified) == 'false') {
                          console.log(err);
                          es.status(500).json({"errorMsg": "Unauthorized user"});  
                  } else {
                      _this.getBusyAppDetails(data, function(er,dat){
                        if(er){
                            es.status(500).json({"errorMsg": er})
                        }else{
                            var result_deviceData=[];
                            var finalBusyDevice=[];
                            console.log("No error")
                            if(dat.length>0){
                                for(var i=0;i<dat.length;i++){
                                    fetchMyAppBusyDeviceData(dat[i], data).then(function (record){  
                                        console.log(record)  
                                        if(record[0].device_name!=null ){
                                            result_deviceData.push(record[0])
                                        }
                                    })
                            }
                            

                        }
                       var qr = "select * from deviceData where device_status='FREE'";
                      console.log(qr)
                      executeDBQuery(qr, function(er, r){
                          if(er){
                            res.send({
                                "error":er
                            })
                          }else{
                          
                            res.send({"busyDevices":result_deviceData,"freeDevices":r})
                          }
                      })
                    }
           })
  }
})
}
exports.getAppSpecificDevices = function(req,res){
  var data = {
        // username: query.parse(req.url,true).query.user_name,
        authToken: query.parse(req.url,true).query.authToken,
        app_id: query.parse(req.url,true).query.app_id
    }
         schema.validateAuthToken(data, function(err, content) {
                if(JSON.stringify(content.verified) == 'false') {
                        console.log(err);
                        es.status(500).json({"errorMsg": "Unauthorized user"});  
                } else {
                    if(data.app_id!=null){
                    _this.getAppNameFromAppId(data,function(er,apk_name){
                    // console.log("=========",apk_name[0].file_name.slice(-4))
                    if(apk_name[0]!=null){
                    if(apk_name[0].file_name.slice(-4) === ".apk"){
                        var qr = "select * from deviceData where device_os='Android' and device_status='FREE'";
                        console.log(qr)
                        executeDBQuery(qr, function(er, r){
                            if(er){
                                es.status(500).json({
                              "error":er
                            })
                            }else{
                                res.send(r)
                            }
                        })
                        }
                        else if(apk_name[0].file_name.slice(-4) === ".ipa"){
                                var qr = "select * from deviceData where device_os='iOS' and device_status='FREE'";
                                console.log(qr)
                                executeDBQuery(qr, function(er, r){
                                    if(er){
                                        res.send({
                                        "error":er
                                    })
                                    }else{
                                        res.send(r)
                                    }
                                })
                            }
                    else{
                        es.status(500).json({
                            "error":"Invalid/unsupported app type"
                        })
                    }
                }else{
                    es.status(500).json({
                        "error":"Empty file name"
                    })
                }
                })
            }else{
                res.status(500).json({
                    "error":"Empty app_id sent"
                })
            }
                }
         })
}

exports.getMyAppsDetails = function(req,res){
        var data = {
        authToken: req.body.authToken,
        user_name: req.body.user_name,
        }
              schema.validateAuthToken(data, function(err, content) {
                if(JSON.stringify(content.verified) == 'false') {
                        console.log(err);
                        es.status(500).json({"errorMsg":"Unauthorized user"});  
                } else {
                    var result = [];
                    var finalData = [];
                    getSortedByTimeUploadedUniqueApps(data, function(err, apps){
                        if(err){
                            res.status(500).json({"errorMsg": err})
                        }else{
                            console.log("No error")
                            if(apps.length>0){
                                var obj = {};
                                for (var i=0;i<apps.length;i++){
                                    if(!obj[apps[i].app_family]) obj[apps[i].app_family] = apps[i];
                                }
                                var newArr = [];
                                for ( var key in obj ) newArr.push(obj[key]);
                                    console.log(newArr)
                                    res.send(newArr)             
                        }else{
                            res.send([])
                        }
                        }            
                    })
                }
              })
}
exports.getAppScriptDetails = function(req,res){
    var data = {
        authToken: req.body.authToken,
        user_name: req.body.user_name,
        // app_id: req.body.app_id
        }
        schema.validateAuthToken(data, function(err, content) {
            if(JSON.stringify(content.verified) == 'false') {
                    console.log(err);
                    es.status(500).json({"error":"Unauthorized user"});  
            } else {
                fetchAllScriptData(data, function(er, scriptData){
                    fetchGenericScripts(function(err, result){
                    if(er){
                        console.log("=======error======",er)
                        res.status(500).json({"error":"Unable to get script details"});  
                    }else{
                        console.log("SCRIPT DATA :: ", scriptData)
                        
                        res.send(scriptData.concat(result));
                    }
                })
                })
            }
        });
    
}

var getBusyAppDevices = function (data) {
    var result_deviceData =[];
    return new Promise(function (resolve, reject) {
        _this.getBusyAppDetails(data, function(er,r){            
            if (er) {
                console.log("rejected here")
                reject()
                return
            }
            if(r.length>0){
                console.log("rejected here1")
                for(var j=0;j<r.length;j++){
                    fetchMyAppBusyDeviceData(r[j], data).then(function (record){  
                        console.log(record)  
                        if(record[0].device_name!=null ){
                            result_deviceData.push(record[0])
                        }
                    })
            }
            resolve(result_deviceData);
        } else {
            resolve([]);
        }
    })                                
         })       
   };
   

   var checking = function (data,callback) {
    var result_deviceData =[];
    // return new Promise(function (resolve, reject) {
        _this.getBusyAppDetails(data, function(er,r){            
            if (er) {
                console.log(" unable to get busyAppdetails ")
                // reject()
                callback(err,null);
            }
            if(r.length>0){
                console.log("rejected here1")
                for(var j=0;j<r.length;j++){
                    fetchMyAppBusyDeviceData(r[j], data).then(function (record){  
                        console.log(record)  
                        if(record[0].device_name!=null ){
                            result_deviceData.push(record[0])
                        }
                    })
            }
            // resolve(result_deviceData);
            callback(null,result_deviceData)
        } else {
            // resolve([]);
            callback(null,result_deviceData)
        }
    })                                
        //  })       
   };


   var getMyApps = function (dat,data) {
    var result_deviceData =[];
    var result_myapps =[];
    return new Promise(function (resolve, reject) {  
        // console.log(">>>>> here " + JSON.stringify(dat))         
        for(var i=0;i<dat.length;i++){
            fetchMyAppsData(dat[i], i == dat.length - 1, data).then(function (records) {
                console.log(">>>>> here " + i)
                var reachedLast = records[0].isLast                        
                delete records[0].isLast;
                result_myapps.push(records[0]) 
               
                if (reachedLast == true) {
                    resolve(result_myapps)
                }
            }).catch(function(error) {
                console.log(">>>>> failed ", error)
                reject(error)
            })
        }
         })       
   };

var getUniqueApps = function(data, callback){
    var qr_2 = 'select distinct app_family,app_name,app_type,app_id from appData where user_name = '+JSON.stringify(data.user_name)
    console.log(qr_2)
    executeDBQuery(qr_2, function(err, result_myapps){
             if(err){
                callback(err,null);
            }else{
                console.log(result_myapps)
                callback(null,result_myapps);
        }
    })
}

var getSortedByTimeUploadedUniqueApps = function(data, callback){
    var qr_2 = 'select app_family,app_name,app_id,time_uploaded,app_version,app_type from appData where user_name='+JSON.stringify(data.user_name)+' ORDER BY time_uploaded DESC;'
    console.log(qr_2)
    executeDBQuery(qr_2, function(err, result_myapps){
             if(err){
                callback(err,null);
            }else{
                console.log(result_myapps)
                callback(null,result_myapps);
        }
    })
}

exports.getHomePageDetails = function(req,res){
    var data = {
        authToken: req.body.authToken,
        user_name: req.body.user_name,
        }
        schema.validateAuthToken(data, function(err, content) {
            if(JSON.stringify(content.verified) == 'false') {
                    console.log(err);
                    res.send({"error":"Unauthorized user","code": 500});  
            } else {
                var result_myapps = [];
                var result_scriptData ="";
                
                var finalData = [];
                var q =[];
                _this.getAppID(data, function(er,dat){
                    if(er){
                        res.send({"errorMsg": er,"code": 500})
                    }else{
                        console.log("No error")
                        console.log("+++++++++++++++++++______", dat)
                        if(dat.length>0){
                            // res.send(dat)
                        fetchMyScriptData(data,function(er, scriptData){
                                if(er){
                                    console.log("=======error======",er)
                                }else{
                                    console.log("SCRIPT DATA :: ", scriptData)
                                    result_scriptData =scriptData;
                                }
                            })
                            getUniqueApps(data, function(er, myapps) {
                                if(er){
                                    console.log("=======error======",er)
                                }else{
                                    console.log("APP DATA :: ", myapps)
                                    result_myapps =myapps;
                                }
                            })
                    getBusyAppDevices(data).then(function (result_deviceData, error) {
                                    res.send({
                                        "myApps":result_myapps,
                                        "myScripts":result_scriptData,
                                        "myDevices":result_deviceData
                                    }) 
                                }).catch(function(error) {
                                    res.send({
                                        "myApps":result_myapps,
                                        "myScripts":result_scriptData,
                                        "myDevices":[]
                                    }) 
                                })
                                }else{
                                    res.send([])
                                    }
                    }            
                })
            }
          })
}
exports.getAppNameFromAppId = function(data,callback){
    var qr_2 = 'select file_name from appData where app_id='+data.app_id
    console.log(qr_2)
    executeDBQuery(qr_2, function(err, result){
        if(err){
            callback(err,null);
        }else{
            console.log(result)
            callback(null,result);
    }
    })
}
var getAllAppID = function(callback){
    var qr_2 = 'select distinct app_id from testCycle where monitoring_status="BUSY"'
    console.log(qr_2)
    executeDBQuery(qr_2, function(err, result){
        if(err){
            callback(err,null);
        }else{
            console.log(result)
            callback(null,result);
    }
    })
 
}
var getAppPrevilege = function(dat, callback){
    var qr_2 = 'select app_privilege from appData where app_id='+dat.app_id+''
    console.log(qr_2)
    executeDBQuery(qr_2, function(err, result){
        if(err){
            callback(err,null);
        }else{
            console.log(result)
            callback(null,result);
    }
    }) 
}
exports.getAppID = function(data, callback){
    var qr_2 = 'select app_id from appData where user_name = '+JSON.stringify(data.user_name)
    console.log(qr_2)
    executeDBQuery(qr_2, function(err, result){
             if(err){
                callback(err,null);
            }else{
                console.log(result)
                callback(null,result);
        }
    })
}
exports.getBusyAppDetails = function(data, callback){
    var qr_2 = 'select distinct ad.app_id from appData ad,testCycle tc where ad.app_id = tc.app_id and ad.user_name='+JSON.stringify(data.user_name)+' and (tc.monitoring_status="BUSY" or tc.custom_test_status="BUSY")'
    console.log(qr_2)
    executeDBQuery(qr_2, function(err, result){
             if(err){
                callback(err,null);
            }else{
                console.log(result)
                callback(null,result);
        }
    })
}
exports.getUserSpecificAppID = function(data, callback){
    var qr = 'select app_id from appData where user_name = '+JSON.stringify(data.user_name)+' and app_name = '+JSON.stringify(data.app_name)+' and app_version = '+JSON.stringify(data.app_version)
    executeDBQuery(qr, function(err, result){
             if(err){
                callback(err,null);
            }else{
                console.log(result)
                callback(null,result);
        }
    })
}

exports.getDeviceInfoFromTestCycle = function(data, callback){
    var qr_2='select * from testCycle where cycle_id='+data.cycle_id
    console.log(qr_2)
    con_deviceData.query(qr_2, function(err, result){
             if(err){
                callback(err,null);
            }else{
                if(result.length>0){
                console.log("======================",result)
                callback(null,result);
                }else{
                    callback(err,null);
                }
        }
    })
}

var getCyclesForApp = function(data, app_family, callback){
    var qr_2= 'select * from testCycle where app_id in (select app_id from appData where app_family='+JSON.stringify(app_family.app_family)+' and user_name='+JSON.stringify(data.user_name)+' and app_type='+JSON.stringify(app_family.app_type)+')'
    // var qr_2='select * from testCycle where app_id in ('+data.app_id+')'
    console.log(qr_2)
    con_deviceData.query(qr_2, function(err, result){
             if(err){
                callback(err,null);
            }else{
                if(result.length>0){
                console.log("======================",result)
                callback(null,result);
                }else{
                    callback(err,null);
                }
        }
    })
}
var getAppSpecificCyclesForComparison =  function(appFamily,callback){
    var qr_2='select cycle_id from testCycle where app_id in (select app_id from appData where app_family='+JSON.stringify(appFamily[0].app_family)+' and user_name='+JSON.stringify(appFamily[0].user_name)+')'
    console.log(qr_2)
    con_deviceData.query(qr_2, function(err, result){
             if(err){
                callback(err,null);
            }else{
                if(result.length>0){
                    console.log(result)
                    callback(null,result);
                }else{
                    callback(err,null);
                }
        }
    })
}
var getAppSpecificCycles =  function(data,callback){
    var qr_2='select * from testCycle where app_id in ('+data.app_id+')'
    console.log(qr_2)
    con_deviceData.query(qr_2, function(err, result){
             if(err){
                callback(err,null);
            }else{
                if(result.length>0){
                    callback(null,result);
                }else{
                    callback(err,null);
                }
        }
    })
}
exports.getAppInfo = function(req,res){
    var data = {
        // user_name: req.body.user_name,
        authToken: req.body.authToken,
        app_id: req.body.app_id,
        user_name: req.body.user_name
        }
        schema.validateAuthToken(data, function(err, content) {
            if(JSON.stringify(content.verified) == 'false') {
                    console.log(err);
                    res.send({"error":"Unauthorized user","code": 500});  
            } else {
                var qr='select * from appData where app_id='+data.app_id+' and user_name='+JSON.stringify(data.user_name)+'';
                con_deviceData.query(qr, function(err, result){
                    if(err){
                       res.send({"error":"Invalid query"})
                   }else{
                       console.log("==========================",result)
                       res.send(result)
                    //    callback(null,result);
               }
           })
            }
        })
}
//select * from deviceData where device_id=(select device_id from testCycle where cycle_id=2)
// exports.getAllCycleIds = function(dat, callback){
//     var qr='select cycle_id from testCycle where app_id='+dat.app_id;
//     con_deviceData.query(qr, function(err, result){
//              if(err){
//                 callback(err,null);
//             }else{
//                 console.log("==========================",result)
//                 callback(null,result);
//         }
//     })
// }
// var fetchDevicesFromCycleID = function(dat,callback){
//     var qr = 'select * from deviceData where device_id=(select device_id from testCycle where cycle_id='+dat.cycle_id+')'
//     con_deviceData.query(qr, function(err, result){
//         if(err){
//            callback(err,null);
//        }else{
//            console.log("==========================",result)
//            callback(null,result);
//    }
// })
// }
var fetchMyAppsData = function (dat, isLast, data) {
    return new Promise(function (resolve, reject) {
        // var qr = 'select (select app_name from testCycle where user_name='+JSON.stringify(data.user_name)+' and cycle_id='+dat.cycle_id+') as '+"appName"+',(select monitoring_status from testCycle where cycle_id='+dat.cycle_id+') as '+"status"+', (select device_name from deviceData where device_id=(select device_id from testCycle where cycle_id='+dat.cycle_id+')) as '+"device_name"+'';
        var qr_2= 'select ('+dat.app_id+') as '+"app_id"+', (select app_name from appData where user_name='+JSON.stringify(data.user_name)+' and app_id='+dat.app_id+') as '+"appName"+',(select if(COUNT(cycle_id)  > 0, "BUSY", "FREE") from testCycle where app_id='+dat.app_id+' and monitoring_status = "BUSY") as '+"status"+',(select app_version from appData where app_id='+dat.app_id+') as '+"app_version"+', (select time_uploaded from appData where app_id='+dat.app_id+') as '+"uploaded_time"+',(select app_type from appData where app_id='+dat.app_id+') as '+"app_type"+''
        console.log(qr_2)
        con_deviceData.query(qr_2, function(err, resultDB){
            if(err){
                console.log(err);
                reject()

            }else{                
                resultDB[0].isLast = isLast;
                resolve(resultDB);
            }
         })        
       
     });
   };
//    var fetchMyUniqueAppsData = function (dat, isLast, data) {
//     return new Promise(function (resolve, reject) {
//         // var qr = 'select (select app_name from testCycle where user_name='+JSON.stringify(data.user_name)+' and cycle_id='+dat.cycle_id+') as '+"appName"+',(select monitoring_status from testCycle where cycle_id='+dat.cycle_id+') as '+"status"+', (select device_name from deviceData where device_id=(select device_id from testCycle where cycle_id='+dat.cycle_id+')) as '+"device_name"+'';
//         var qr_2= 'select (select app_name from appData where user_name='+JSON.stringify(data.user_name)+' and app_id='+dat.app_id+') as '+"appName"+',(select if(COUNT(cycle_id)  > 0, "BUSY", "FREE") from testCycle where app_id='+dat.app_id+' and monitoring_status = "BUSY") as '+"status"+',(select app_version from appData where app_id='+dat.app_id+') as '+"app_version"+', (select time_uploaded from appData where app_id='+dat.app_id+') as '+"uploaded_time"+',(select app_type from appData where app_id='+dat.app_id+') as '+"app_type"+''
//         console.log(qr_2)
//         con_deviceData.query(qr_2, function(err, resultDB){
//             if(err){
//                 console.log(err);
//                 reject()

//             }else{                
//                 resultDB[0].isLast = isLast;
//                 resolve(resultDB);
//             }
//          })        
       
//      });
//    };
var fetchMyScriptData = function(data, callback){
        // var qr = 'select * from customTest where user_name='+JSON.stringify(data.user_name)+''
        var qr = 'select * from customTest  inner join appData on customTest.app_id = appData.app_id where appData.user_name='+JSON.stringify(data.user_name)+' AND customTest.script_status="ACTIVE" order by (uploaded_time) asc LIMIT 10'
        console.log(qr)
        con_deviceData.query(qr, function(err, resultDB){
            if(err){
                console.log(err);
                callback(err,null)
            }else{ 
                console.log(resultDB)               
                callback(null,resultDB);
            }
         })        
}
var fetchAllScriptData = function(data, callback){
    var qr = 'select * from customTest  inner join appData on customTest.app_id = appData.app_id AND customTest.script_status="ACTIVE" where (appData.user_name='+JSON.stringify(data.user_name)+' ) OR customTest.user_name="r_mobi"'
    // var qr = 'select * from customTest where (user_name='+JSON.stringify(data.user_name)+' ) OR user_name="r_mobi"'
    console.log(qr)
    con_deviceData.query(qr, function(err, resultDB){
        if(err){
            console.log(err);
            callback(err,null)
        }else{ 
            console.log(resultDB)               
            callback(null,resultDB);
        }
     })        
}
var fetchGenericScripts = function(callback){
    // return new Promise(function (resolve, reject) {
    var qr_2 = 'select * from customTest where script_type="GENERIC" and user_name="r_mobi"'
    //  var qr_2= 'select (select device_name from deviceData where device_id=(select device_id from testCycle where app_id='+dat.app_id+'  LIMIT 1)) as '+"device_name"+', (select device_status from deviceData where device_id=(select device_id from testCycle where app_id='+dat.app_id+' LIMIT 1)) as '+"status"+',(select device_os from deviceData where device_id=(select device_id from testCycle where app_id='+dat.app_id+' LIMIT 1)) as '+"device_os"+''
        console.log(qr_2)
        con_deviceData.query(qr_2, function(err, resultDB){
            if(err){
                console.log(resultDB)               
                callback(err,null);

            }else{                
                // resultDB[0].isLast = isLast;
                console.log(resultDB)               
                callback(null,resultDB);
            }
         })        
       
    //  });
}

var fetchMyAppBusyDeviceData = function(dat,data){
    // select(select device_name from deviceData where device_id=(select device_id from testCycle where app_id=1 LIMIT 1) )as device_name,(select os_version from deviceData where device_id=(select device_id from testCycle where app_id=1 LIMIT 1)) as os_version,(select device_id from deviceData where device_id=(select device_id from testCycle where app_id=1 LIMIT 1)) as device_id,(select device_os from deviceData where device_id=(select device_id from testCycle where app_id=1 LIMIT 1)) as device_os,(select app_name from appData where app_id=1) as app_name
    return new Promise(function (resolve, reject) {
        var qr_2 = 'select(select device_name from deviceData where device_id=(select device_id from testCycle where app_id='+dat.app_id+' and (monitoring_status ="BUSY" or custom_test_status="BUSY") LIMIT 1) and device_status="BUSY" ) as '+"device_name"+',(select os_version from deviceData where device_id=(select device_id from testCycle where app_id='+dat.app_id+' and (monitoring_status ="BUSY" or custom_test_status="BUSY") LIMIT 1) and device_status="BUSY") as '+"os_version"+',(select device_id from deviceData where device_id=(select device_id from testCycle where app_id='+dat.app_id+' and (monitoring_status ="BUSY" or custom_test_status="BUSY") LIMIT 1) and device_status="BUSY") as '+"device_id"+',(select network_type from deviceData where device_id=(select device_id from testCycle where app_id='+dat.app_id+' and (monitoring_status ="BUSY" or custom_test_status="BUSY") LIMIT 1) and device_status="BUSY" ) as '+"network_type"+',(select device_os from deviceData where device_id=(select device_id from testCycle where app_id='+dat.app_id+' and (monitoring_status ="BUSY" or custom_test_status="BUSY") LIMIT 1) and device_status="BUSY") as '+"device_os"+',(select device_image from deviceData where device_id=(select device_id from testCycle where app_id='+dat.app_id+' and (monitoring_status ="BUSY" or custom_test_status="BUSY") LIMIT 1) and device_status="BUSY") as '+"device_image"+',(select app_name from appData where app_id='+dat.app_id+') as '+"app_name"+',(select app_type from appData where app_id='+dat.app_id+') as '+"app_type"+',(select app_id from appData where app_id='+dat.app_id+') as '+"app_id"+''  
            console.log(qr_2)
            con_deviceData.query(qr_2, function(err, resultDB){
                if(err){
                    console.log(err);
                    reject()
    
                }else{                
                    // resultDB[0].isLast = isLast;
                    resolve(resultDB);
                }
             })        
           
         });

}
var fetchLiveMonitoringData = function (dat, isLast) {
    return new Promise(function (resolve, reject) {
        var qr = 'select (select start_time from testCycle where cycle_id=(select cycle_id from testCycle where app_id='+dat.app_id+' LIMIT 1) order by start_time LIMIT 1) as '+"first"+', (select end_time from testData where cycle_id=(select cycle_id from testCycle where app_id='+dat.app_id+' LIMIT 1) order by end_time DESC LIMIT 1) as '+"last"+',(select app_name from appData where app_id='+dat.app_id+' LIMIT 1) as '+"app_name"+',(select app_privilege from appData where app_id='+dat.app_id+' LIMIT 1) as '+"app_privilege"+',(select app_type from appData where app_id='+dat.app_id+' LIMIT 1) as '+"app_type"+', (select count(test_status) from testData where cycle_id=(select cycle_id from testCycle where app_id='+dat.app_id+' LIMIT 1) and test_status='+"1"+') as '+"passed_test"+', (select count(test_status) from testData where cycle_id=(select cycle_id from testCycle where app_id='+dat.app_id+' LIMIT 1) and test_status='+"0"+') as '+"failed_test"+',(select monitoring_status from testCycle where app_id='+dat.app_id+' LIMIT 1) as '+"app_status"+',(select cpu_usage from testData where cycle_id=(select cycle_id from testCycle where app_id='+dat.app_id+' LIMIT 1) LIMIT 1) as '+"cpu_usage"+', (select battery_usage from testData where cycle_id=(select cycle_id from testCycle where app_id='+dat.app_id+' LIMIT 1) LIMIT 1) as '+"battery_consumed"+', (select memory_consumed from testData where cycle_id=(select cycle_id from testCycle where app_id='+dat.app_id+' LIMIT 1) LIMIT 1) as '+"memory_consumed"+''
        console.log(qr)
        con_deviceData.query(qr, function(err, resultDB){
            if(err){
                reject()
                console.log(err);
            }else{                
                resultDB[0].isLast = isLast;
                resolve(resultDB);
            }
         })        
       
     });
   };

exports.getAllLiveMonitoringData = function(req,res){
    var result = [];
        getAllAppID(function(er,dat){
            if(er){
                res.send({"errorMsg": er,"code": 500})
            }else{
                if(dat.length>0){   
                for(var i=0;i<dat.length;i++){
                    fetchLiveMonitoringData(dat[i], i == dat.length - 1).then(function (records) {
                        var reachedLast = records[0].isLast                        
                        delete records[0].isLast;
                            result.push(records)
                        if (reachedLast == true) {  
                            console.log(result) 
                            var finalData = []
                            // for(var k=0;k<result.length;k++){
                            //     console.log("===="+JSON.stringify(result[k][0].app_status))
                            //     if(result[k][0].app_status != null && result[k][0].app_privilege==1){
                            //         finalData.push(result[k])
                            //     }  
                            // }  
                            res.send(result)                                                 
                        }
                    // })
                    });
                }
            }else{
                res.status(500).json({error:"no monitoring data"})
            }
            }            
        })
    }
    var getAppCycleInfo = function(data, app_family, callback){
        var qr = 'select * from appData where app_family='+JSON.stringify(app_family)+' and user_name='+JSON.stringify(data.user_name)+' ORDER BY time_uploaded DESC LIMIT 1'

       console.log(qr)
        con_deviceData.query(qr, function(err, resultDB){
            if(err){
                console.log(err);
                callback(err,null)
            }else{              
                console.log(resultDB)
                callback(null,resultDB)
            }
         })        
       
    //  });
    }

    var getAppSpecificCycleInfo = function(data, callback){
        var qr = 'select * from appData where app_id in ('+data.app_id+')'
       console.log(qr)
        con_deviceData.query(qr, function(err, resultDB){
            if(err){
                console.log(err);
                callback(err,null)
            }else{              
                console.log(resultDB)
                callback(null,resultDB)
            }
         })               
       
    //  });
    }
    var getDeviceInfo = function(dat, isLast){
        return new Promise(function (resolve, reject) {    
        var qr='select (select device_id from testCycle where cycle_id='+dat.cycle_id+') as "device_id", (select device_name from deviceData where device_id=(select device_id from testCycle where cycle_id='+dat.cycle_id+') )as "device_name",(select network_type from deviceData where device_id=(select device_id from testCycle where cycle_id='+dat.cycle_id+') )as "network_type",(select monitoring_status from testCycle where cycle_id='+dat.cycle_id+') as "monitoring_status",(select start_time from testCycle where cycle_id='+dat.cycle_id+') as "start_time",('+dat.cycle_id+') as "cycle_id",(select app_version from appData where app_id=(select app_id from testCycle where cycle_id='+dat.cycle_id+')) as "app_version",(select time_uploaded from appData where app_id=(select app_id from testCycle where cycle_id='+dat.cycle_id+')) as "uploaded_time"'
        //var qr = 'select * from deviceData where device_id=(select device_id from testCycle where cycle_id='+dat.cycle_id+')'
        console.log(qr)
        con_deviceData.query(qr, function(err, resultDB){
            if(err){
                reject()
                console.log(err);
            }else{ 
                    resultDB[0].isLast = isLast;
                    resolve(resultDB);
            }
         })
        })
    }

    var getScriptInfo = function(records, callback){
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
var getAppVersions = function(data,app_family, callback){
    // console.log(records.length)
        var qr='select app_version,app_id from appData where app_family='+JSON.stringify(app_family)+' and user_name='+JSON.stringify(data.user_name)+''
        //var qr = 'select * from deviceData where device_id=(select device_id from testCycle where cycle_id='+dat.cycle_id+')'
        console.log(qr)
        con_deviceData.query(qr, function(err, ver){
            if(err){
                console.log(err);
                callback(err,null)
            }else{ 
                callback(null,ver)
                
            }
           
         })
}

var fetchCycleBasedComparisonData = function (dat, isLast) {
    return new Promise(function (resolve, reject) {
        // var qr = 'select (select app_name from testCycle where user_name='+JSON.stringify(data.user_name)+' and cycle_id='+dat.cycle_id+') as '+"appName"+',(select monitoring_status from testCycle where cycle_id='+dat.cycle_id+') as '+"status"+', (select device_name from deviceData where device_id=(select device_id from testCycle where cycle_id='+dat.cycle_id+')) as '+"device_name"+'';
        var qr_2= 'select min(memory_consumed) as min_memory,max(memory_consumed) as max_memory,min(cpu_usage) as min_cpu,max(cpu_usage) as max_cpu,min(battery_usage) as min_battery,max(battery_usage) as max_battery, (cycle_id) as cycle_id from testData where cycle_id ='+dat.cycle_id+''
        console.log(qr_2)
        con_deviceData.query(qr_2, function(err, resultDB){
            if(err){
                console.log(err);
                // callback(err,null)
                reject(err)

            }else{                
                resultDB[0].isLast = isLast;
                // callback(null,resultDB);
                resolve(resultDB)
            }
         })        
       
     });
   };
exports.getCycleBasedComparisonData = function(req,res){
    var data = {
        authToken: req.body.authToken,
        app_id: req.body.app_id,
        // user_name: req.body.user_name
        }
        schema.validateAuthToken(data, function(err, content) {
            if(JSON.stringify(content.verified) == 'false') {
                    console.log(err);
                    res.send({"error":"Unauthorized user","code": 500});  
            } else {
                getAppFamilyByAppId(data,function(err,appFamily){
                getAppSpecificCyclesForComparison(appFamily,function(err, dat){
                    if(dat!=null){
                //         console.log("dat",JSON.stringify(dat))

                //         fetchCycleBasedComparisonData(dat,function (err,records) {
                //             res.send(records)
                //         })
                    // }
                        for(var i=0;i<dat.length;i++){
                            var result_compare_data=[]
                        fetchCycleBasedComparisonData(dat[i], i == dat.length - 1).then(function (records) {
                            var reachedLast = records[0].isLast                        
                            delete records[0].isLast;
                            if(records[0].cycle_id!=null){
                            result_compare_data.push(records[0]) 
                        }
                            if (reachedLast == true) {
                                res.send(result_compare_data)
                            }
                        })
                   
                    }
            }else{
                res.status(500).json({error:"Something went wrong"})
            }
        })
    })
    
}
        })
    }
var getAppFamilyByAppId = function(data, callback){
    // var qr='select app_version,app_id from appData where app_id='+data.app_id+''
        var qr = 'select * from appData where app_id='+data.app_id+''
         console.log(qr)
        con_deviceData.query(qr, function(err, appFamily){
            if(err){
                console.log(err);
                callback(err,null)
            }else{
                // console.log(appFamily) 
                callback(null,appFamily)
                
            }
           
         })
}
    exports.getAppCycleData = function(req,res){
        var data = {
            authToken: req.body.authToken,
            user_name: req.body.user_name,
            app_id:req.body.app_id
            }
            schema.validateAuthToken(data, function(err, content) {
                if(JSON.stringify(content.verified) == 'false') {
                        console.log(err);
                        es.status(500).json(
                            {
                                "errorMsg":"Unauthorized user"
                                
                            });  
                } else {
                    getAppFamilyByAppId(data, function(err, appFamily){
                        if(appFamily[0]!=null){
                        console.log("appFamily[0].app_family",JSON.stringify(appFamily[0].app_family))
                        getCyclesForApp(data,appFamily[0], function(err, dat){
                            if(err){
                                console.log(err)
                                    res.status(401).json({error:'Something went wrong'});     
                        }else{
                            if(dat!=null){
                                getAppCycleInfo(data,appFamily[0].app_family, function (err, r) {
                                    console.log(" r[0] :: ",r[0])
                                var result=[]
                                getAppVersions(data,appFamily[0].app_family,function(er,ver){
                                    for(var i=0;i<dat.length;i++){
                                        getDeviceInfo(dat[i], i == dat.length - 1, data).then(function (records) {
                                            getScriptInfo(records, function(er, x){
                                                    var vers = ({app_versions:ver})
                                                    var script = ({script_name:x})
                                                    records[0].scripts = x
                                                    var reachedLast = records[0].isLast                        
                                                    delete records[0].isLast;
                                                    result.push(records)
                                                    var cycleData = ({cycle_data:Object.assign(result,script)})                              
                                                    if (reachedLast == true) { 
                                                        res.status(200).json(Object.assign(r[0], vers, cycleData));
                                                }
                                            })
                                            })
                                        }
                                    })
                                })
                            }
                            else{
                                var qr='select * from appData where app_id='+data.app_id+' ORDER BY time_uploaded DESC LIMIT 1'
                                con_deviceData.query(qr, function(err, result){
                                    if(err){
                                        res.send(err)
                                    }else{
                                        
                                        console.log("****",result)
                                        if(result.length > 0){
                                            getAppVersions(data,appFamily[0].app_family,function(er,ver){
                                        var vers = ({app_versions:ver})
                                        var cycleData=({cycle_data:[]})
                                        res.status(200).json(Object.assign(result[0], vers,cycleData)); 
                                            })
                                        }else{
                                            res.status(500).json({error:'Invalid/Empty app data'}); 
                                        }
                                    }
                                // })
                            })
                                }
                            }
                    }) 
                }else{
                    res.status(500).json({error:'Invalid/Empty app data'});
                }
                })
            // }
                }
            })
    }
    exports.getAppCycleDataWithAppID = function(req,res){
        var data = {
            authToken: req.body.authToken,
            app_id: req.body.app_id
            }
            schema.validateAuthToken(data, function(err, content) {
                if(JSON.stringify(content.verified) == 'false') {
                        console.log(err);
                        es.status(500).json(
                            {
                                "errorMsg":"Unauthorized user"
                                
                            });  
                } else {
                    getAppSpecificCycles(data, function(er,dat){
                        if(er){
                            res.send({error:"Something went wrong"})
                        }else{
                            getAppSpecificCycleInfo(data, function(er,r){
                                console.log(" r[0] :: ",r[0])
                                var result=[]
                                if(dat!=null){
                                for(var i=0;i<dat.length;i++){
                                    getDeviceInfo(dat[i], i == dat.length - 1, data).then(function (records) {
                                        getScriptInfo(records, function(er, x){
                                                var script = ({script_name:x})
                                                records[0].scripts = x
                                                var reachedLast = records[0].isLast                        
                                                delete records[0].isLast;
                                                result.push(records)
                                                var cycleData = ({cycle_data:Object.assign(result,script)})                              
                                                if (reachedLast == true) { 
                                                    res.status(200).json(cycleData);
                                            }
                                        })
                                        })
                                    }
                                }else{
                                    var cycleData=({cycleData:[]})
                                    res.status(200).json(Object.assign(cycleData)); 
                                }
                            })
                        }
                    })

                }
            
            })
    }
    exports.getCycleTestData = function(req,res){
        var data = {
            cycle_id: req.body.cycle_id,
            authToken: req.body.authToken
            }
            schema.validateAuthToken(data, function(err, content) {
                if(JSON.stringify(content.verified) == 'false') {
                        console.log(err);
                        es.status(500).json(
                            {
                                "errorMsg":"Unauthorized user"
                                
                            });  
                } else {
                    var qr = 'select * from testData where cycle_id='+data.cycle_id
                    con_deviceData.query(qr, function(err, result){
                        if(err){
                            res.send(err)
                        }else{
                            if(result.length>0){
                            res.status(200).json(result); 
                            }else{
                                res.status(500).json({error:"no data"}); 
                            }
                        }
                    })
    }
    })
    }

    exports.deleteTestData = function(req,res){
        var data = {
            cycle_id: req.body.cycle_id,
            authToken: req.body.authToken
            }
            schema.validateAuthToken(data, function(err, content) {
                if(JSON.stringify(content.verified) == 'false') {
                        console.log(err);
                        es.status(500).json(
                            {
                                "errorMsg":"Unauthorized user"
                               
                            });  
                } else {
                    var qr = 'delete from testData where cycle_id='+data.cycle_id
                    con_deviceData.query(qr, function(err, result){
                        if(err){
                            es.status(500).json({error:err})
                        }else{
                            res.send({
                                "status":"deleted succesfully",
                                "code":200
                            })
                        }
                    })
                }
            })
        }
        var getMaxMemory=function(app_id, callback){
            var qr = 'select (select MAX(memory_consumed)from testData where cycle_id IN (select cycle_id from testCycle where app_id='+app_id+')) as "maxMemory"'
            con_deviceData.query(qr, function(err, result){
                if(err){
                    callback(err,null)
                }else{
                    callback(null,result)
                }
            })
        }
           
        var getMinMemory=function(app_id, callback){
            var qr = 'select (select MIN(memory_consumed) from testData where cycle_id IN (select cycle_id from testCycle where app_id='+app_id+')) as "minMemory"'
            console.log(qr)
            con_deviceData.query(qr, function(err, result){
                if(err){
                    callback(err,null)
                }else{
                    callback(null,result)
                }
            })
        }
           
        var getMaxBattery=function(app_id, callback){
            var qr = 'select (select MAX(battery_usage)from testData where cycle_id IN (select cycle_id from testCycle where app_id='+app_id+')) as "maxBattery"'
            con_deviceData.query(qr, function(err, result){
                if(err){
                    callback(err,null)
                }else{
                    callback(null,result)
                }
            })
        }
        var getMinBattery=function(app_id, callback){
            var qr = 'select (select MIN(battery_usage)from testData where cycle_id IN (select cycle_id from testCycle where app_id='+app_id+')) as "minBattery"'
            con_deviceData.query(qr, function(err, result){
                if(err){
                    callback(err,null)
                }else{
                    callback(null,result)
                }
            })
        }
        var getMaxCPU=function(app_id, callback){
            var qr = 'select (select MAX(cpu_usage)from testData where cycle_id IN (select cycle_id from testCycle where app_id='+app_id+')) as "maxCPU"'
            con_deviceData.query(qr, function(err, result){
                if(err){
                    callback(err,null)
                }else{
                    callback(null,result)
                }
            })
        }
        var getMinCPU=function(app_id, callback){
            var qr = 'select (select MIN(cpu_usage)from testData where cycle_id IN (select cycle_id from testCycle where app_id='+app_id+')) "minCpu"'
            con_deviceData.query(qr, function(err, result){
                if(err){
                    callback(err,null)
                }else{
                    callback(null,result)
                }
            })
        }
        var getTotalTests=function(app_id, callback){
            var qr = 'select (select count(id) from testData where cycle_id IN (select cycle_id from testCycle where app_id='+app_id+')) as "totalTests"'
            console.log(qr)
            con_deviceData.query(qr, function(err, result){
                if(err){
                    callback(err,null)
                }else{
                    // console.log("########################################",result)
                    callback(null,result)
                }
            })
        }
        
        exports.appBenchMarkData=function(req,res){
            var data = {
                app_id: req.body.app_id,
                authToken: req.body.authToken
                }
                schema.validateAuthToken(data, function(err, content) {
                    if(JSON.stringify(content.verified) == 'false') {
                            console.log(err);
                            es.status(500).json(
                                {
                                    "errorMsg":"Unauthorized user",
                                    "code": 500
                                });  
                    } else {
                        var benchMarkData=[];
                                getMaxMemory(data.app_id, function(er, result){
                                    getMinMemory(data.app_id, function(er, p){
                                        getMaxBattery(data.app_id, function(er, q){
                                            getMinBattery(data.app_id, function(er, r){
                                                getMaxCPU(data.app_id, function(er, s){
                                                    getMinCPU(data.app_id, function(er, t){
                                                        getTotalTests(data.app_id, function(er,u){
                                                            console.log("************",u)
                                                        try{
                                                            if(result[0].maxMemory!=null){
                                                        res.send({maxMemory:result[0].maxMemory,minMemory:p[0].minMemory,maxBattery:q[0].maxBattery,minBattery:r[0].minBattery,maxCPU:s[0].maxCPU,minCPU:t[0].minCpu,totalTests:u[0].totalTests})
                                                            }else{
                                                                res.status(500).json({error:"no data available"})
                                                            }
                                                    }catch(errorMsg){
                                                        es.status(500).json({errorMsg:"No such app_id"})
                                                     }  
                                                    })
                                                });
                                            })
                                        })
                                    })
                                })
                            })  
                            }
                            
                        })
                    }
    exports.getCombinedCycleData = function(data,callback){
        var qr = 'select * from testData where cycle_id IN ('+data.cycle_id+')'
        console.log(qr)
        con_deviceData.query(qr, function(err, result){
            if(err){
                callback(err,null)
            }else{
                // console.log("########################################",result)
                callback(null,result)
            }
        })
    } 
       exports.getAggregatedCycleData = function(req,res){
           var data = {
            cycle_id: req.body.cycle_id,
            authToken: req.body.authToken
            }
            schema.validateAuthToken(data, function(err, content) {
                if(JSON.stringify(content.verified) == 'false') {
                        console.log(err);
                        res.status(500).json(
                            {
                                "errorMsg":"Unauthorized user"
                               
                            });  
                } else {
                    _this.getCombinedCycleData(data, function(er, result){
                        if(result !=null){
                        res.send(result)
                        }else{
                            res.status(500).json({error:"Invalid/Empty combination of cycle_id's"}); 
                        }
                    })
                }
            })

       }

       exports.getAppTestDataComparision = function(req,res){
        var data = {
         app_id: req.body.app_id,
         authToken: req.body.authToken
         }
         var y=[];
         schema.validateAuthToken(data, function(err, content) {
             if(JSON.stringify(content.verified) == 'false') {
                     console.log(err);
                     res.status(500).json(
                         {
                             "errorMsg":"Unauthorized user"
                            
                         });  
             } else {
                console.log("data.app_id.length   ::  ",data.app_id.length)
                 var qr = 'select testCycle.app_id, testData.* from testData join testCycle on testData.cycle_id = testCycle.cycle_id where testCycle.app_id  in ('+data.app_id+')'
                    console.log(qr)
                    var y=[];
                    con_deviceData.query(qr, function(err, result){

                        if(err){
                            res.send({error:err})
                        }else{
                            for(var i=0;i<result.length;i++){
                               result[i].app_id
                            }
                            if(result[0].app_id)
                            res.send(result);
                    }
                   
                })
             }
         })

    }
