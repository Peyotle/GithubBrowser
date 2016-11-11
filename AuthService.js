var buffer = require('buffer');
var AsyncStorage = require('react-native').AsyncStorage;
var _ = require('lodash');
const authKey = 'auth';
const userKey = 'user';

class AuthService {
  getAuthInfo(cb){
    AsyncStorage.multiGet([authKey, userKey], (err, val)=> {
      if(err){
        return cb(err);
      }

      if(!val){
        return cb();
      }

      var zippedObject = _.fromPairs(val);

      if(!zippedObject[authKey]){
        return cb();
      }

      var authInfo = {
        header: {
          Authorization: 'Basic ' + zippedObject[authKey]
        },
        user: JSON.parse(zippedObject[userKey])
      }
      return cb(null, authInfo);
    });
  }
  login(creds, cb) {
        var b = new buffer.Buffer(creds.userName + ':' + creds.password);
        var encodedAuth = b.toString('base64');
        fetch('https://api.github.com/user', {
          headers: {
            'Authorization' : 'Basic ' + encodedAuth
          }
        })
        .then((response)=> {
          if(response.status >= 200 && response.status < 300) {
            console.log("success");
            return response;
          }
          console.log("fail: " + response.message);
          throw {
            badCredentials: response.status == 401,
            unknownError: response.status != 401
          }
        })
        .then((response)=> {
          return response.json();
        })
        .then((results)=> {
          AsyncStorage.multiSet([
            [authKey, encodedAuth],
            [userKey, JSON.stringify(results)]
          ], (err)=> {
            if(err){
              throw err;
            }
            return cb({success: true});
          })
        })
        .catch((err)=> {
          console.log('login failed: ' + err);
          return cb(err);
        });
  }
}

module.exports = new AuthService();
