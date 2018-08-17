var mysql = require('mysql');
var jwt = require('jsonwebtoken')


exports.validateAuthToken= function (data, done, err) {
    try{
        var verifiedJwt =jwt.verify(data.authToken ,'RESTFULAPIs')
        console.log(verifiedJwt)
        if(verifiedJwt){
            console.log("verified token !!")
                return done(null, {verified: true});
        }
        else{
            return done(null, {verified: false});
        }
    }
    catch(err){
        return done(null, {verified: false});
    }
}

