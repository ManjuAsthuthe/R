'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bycrypt = require('bcrypt')

// set up a mongoose model and pass it using module.exports
var UserSchema =new Schema({ 
    user_name: {
        type: String,
        trim: true,
        required: true
    }, 
    password: {
        type: String,
        required: true
    }, 
    hash_password: {
        required: true,
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    organisation: {
        type: String,
        unique: false,
        required: true,
        lowercase: true
    },
    create: {
        type: Date,
        default: Date.now
    }
})
    UserSchema.methods.comparePassword = function(password){
        return bycrypt.compareSync(password, this.hash_password)
    }
    mongoose.model('User',UserSchema)