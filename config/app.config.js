var commonConfig =  { 
  gateway: {
    url: "http://localhost:7050"
  }, 
  jwt: {
    expirySeconds: 60 * 60,
    secret:'suchitwamissionecret'
  },
  response: {
    success: function(req, res,result) {
      res.send(result);
    },
    failure: function(req, res, result) {
      var ret = {
        success: 0,
        err: result
      };
      res.status(400).send(ret);
    }
  }, 
}; 
var qaConfig = commonConfig;
var devConfig = commonConfig;
devConfig.jwt.secret = "test";
module.exports = {   
  qa:qaConfig,  
  development: devConfig
}
