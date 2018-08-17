const JSON = require('circular-json');

exports.getBoxAdmin = function(req,res){
    var BoxSDK = require('box-node-sdk');
var sdk = new BoxSDK({
	clientID: 'ozeamhnwxftpgb38n3oxt0fwopojnw1t',
	clientSecret: 'HG6llDIvJyVw6MRS0YHJH0xKmETXgj4g'
});

var client = sdk.getBasicClient('iBoVsVgc87O6TKzrunVTqkcemtyAmlFY');
    console.log("i am here - 1")
    client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
        if(err) throw err;
        res.send(currentUser)
        console.log('Hello, ' + currentUser.name + '!');
      });
      
}

