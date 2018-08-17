'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')
var User = mongoose.model('User')
var fle = require('../controllers/fileHandleController')
var jwt = require('jsonwebtoken')

var query = require('url');
var schema = require('../models/auth');

console.log('user controller.js is initialised')

exports.register = function(req, res){
    var newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    newUser.save(function(err, user) {
      if (err) {
        return res.status(400).send({
          status: false,
          message: err
        });
      } else {
fle.createUserFolderOnLogin(user)
        user.hash_password = undefined;
        return res.status(200).send({
          status:true,
          user:user._id
      })
    }
})
}

exports.signIn = function(req, res){
    User.findOne({
        email: req.body.email
      }, function(err, user) {
        if (err) throw err;
        if (!user) {
          res.status(401).json({ message: 'Authentication failed. User not found.' });
        } else if (user) {
          if (!user.comparePassword(req.body.password)) {
            res.status(401).json({ message: 'Authentication failed. Wrong password.' });
          } else {
            return res.json({
              token: jwt.sign(
                { email: user.email, 
                  _id: user._id
                  // exp: Math.floor(Date.now() / 1000) + (60 * 60),
              }, 'RESTFULAPIs'),
              email: user.email, 
              fullName: user.user_name, 
              _id: user._id,
              organisation: user.organisation
            });
          }
        }
      });
}

exports.loginRequired = function(req, res, next){
    if (req.user) {
        next();
      } else {
        return res.status(401).json({ message: 'Unauthorized user!' });
      }
}

exports.deleteUser = function(req,res){
  User.remove({ email: req.body.email }, function(err, result) {
    if (err) {
      return res.status(400).send({
        status: false,
        message: err
      });
    }
    else {
      return res.status(200).send({
        status: true,
        message: result.ok
      });
    }
});
}
exports.isTokenValid = function(req, res){
  var data = {
    authToken: query.parse(req.url,true).query.authToken
    }
          schema.validateAuthToken(data, function(err, content) {
            if(JSON.stringify(content.verified) == 'false') {
                    console.log(err);
                    res.send(JSON.parse("{\r\n   \"status\": false,\r\n   \"code\": 500\r\n}"));  
            } else {
              res.send(JSON.parse("{\r\n   \"status\": true,\r\n   \"code\": 200\r\n}")); 
            }
          })
}