var commonStorePath = 'http://172.104.61.150/haritha-keralam/common/uploads/'
module.exports = { 

  
  qa: { 
    gateway: {
      url: "http://localhost:7050"
    }, 
    jwt: {
      expirySeconds: 60 * 60,
      secret:'suchitwamissionecret'
    },
  },



  development: { 
    gateway: {
      url: "http://localhost:7050"
    }, 
    jwt: {
      expirySeconds: 60 * 60,
      secret:'suchitwamissionecret'
    },
  }
}
