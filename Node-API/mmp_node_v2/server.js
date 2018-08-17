'use strict'
var User = require('./api/models/user'),
    jsonwebtoken = require("jsonwebtoken");

var express = require('express'),
  app = express(),
  port = process.env.PORT || 8080,
  bodyParser = require('body-parser');

  console.log('environment port ----'+ process.env.PORT )

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req,res, next){
  if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] == 'JWT'){
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode){
      if(err){
        req.User=undefined
        req.User=decode
        next()
      }else{
        req.User=undefined
        next()
      }
    })
  }else{
    req.User=undefined
    next()
  }
})
app.use(express.static(__dirname + '/assets'));

var routes = require('./api/routes/mmp_node'); //importing route
routes(app);
app.listen(port);

console.log('Mobile monitoring platform RESTful API server started on: ' + port);