const express = require('express'); 
var requestUuid = require('express-request-id')();
var cors = require('cors');
const bodyParser = require('body-parser');
var consoleArguments = require('minimist');
var argv = consoleArguments(process.argv.slice(2));
const fs = require("fs");
const path = require('path');
// Configuring the database
var env = process.env.NODE_ENV;
env = env ? env : "development";
console.log("Environment is " + env);
var dbConfig = null; 
var params = null;
var gateway = null;
const Sequelize = require('sequelize');
const mongoose = require('mongoose');
const Controller = require('./base/controller.js');

var sequelize = null; 
//jwttoken and verification


// create express app
const app = express();

app.use(cors());
app.use(requestUuid);

app.use(bodyParser.json());

var CURRENT_WORKING_DIR = process.cwd();
var APP_DIR = "./app/";
var CURRENT_MODULE =  getCurrentModule(); //null or name of the module
const PATH_SEPARATOR =  path.sep; 

CURRENT_WORKING_DIR += CURRENT_WORKING_DIR.endsWith("/") ? "" : "/";
 
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));
function getCurrentModule() {
  var tmp  = CURRENT_WORKING_DIR.split("\\");
  var index = tmp.length-2;
  var ret = null;
  if(index && (tmp[index] == "modules")) {
    ret = tmp[index+1];
  } 
  return ret;
}
function sanitizePath(str) {
   //str += str.endsWith(PATH_SEPARATOR) ? "" : PATH_SEPARATOR;
   str =  str.replace(/\\/g,"/");
   str += str.endsWith("/") ? "" : "/";
   return str;
}
function getFileFromPaths(paths, file) { 
  var ret = null;
  var i = 0;
  var ln = paths.length; 
  var path = null;
  while(i<ln) {
    path = paths[i]; 
    path = sanitizePath(path);
    path += file; 
    if (fs.existsSync(path)) { 
      ret = path;
    }  
    i++;
  }
  return ret;
}
function loadConfigForEnv(configFilePath,env) {
  var ret = {};
  var config = require(`./config/${configFilePath}`);
  
    if (!config) {
      config = {}; 
    }
    if(!config[env]) {
      config[env] = {};
    }
    config = config[env];
    return config;
}
function getLookUpPathForItem(item) {//item => controller or model etc.
  var ret = [
    APP_DIR+item+"/",
  ]; 
  if(CURRENT_MODULE) {
    ret.push("./"+item+"/");
  }
  ret = removeDuplicates(ret); 
  return ret;
}
function removeDuplicates(arr) {
  var obj = {};
  var retArr = [];
  for (var i = 0; i < arr.length; i++) {
      obj[arr[i]] = true;
  }
  for (var key in obj) {
      retArr.push(key);
  }
  return retArr;
}
module.exports = {
  connectToDb: function(callback) {  
    var that = this;
    this.connectToMysqlDb(dbConfig.sql,function(sequelize){
      that.connectToMongoDb(dbConfig.mongo, function(mongoose) {
        callback({
            sequelize:sequelize,
            mongoose: mongoose
        }); 
      });
    })
},
connectToMysqlDb: function (dbConfig,callback) {
 if(!dbConfig) {
    console.info("No mysql configuration found");
    (callback).call();
    return;
 }
 sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password,dbConfig);
 sequelize
   .authenticate()
   .then(() => {
     console.log('Connected to sql');
     if (callback) {
       callback(sequelize);
     }
   })
   .catch(err => { 
     console.warn('Could not connect to sql database.', err); 
     (callback.call)(null); 
   });
},
connectToMongoDb: function(dbConfig, callback) { 
  if(!dbConfig) {
    console.info("No mongodb configuration found");
    (callback).call();
    return;
  } 
  var config = dbConfig;
  console.log("Mongodb config is "+JSON.stringify(dbConfig));
  var url = config.url;
  delete config.url; 
  mongoose.connect(url, config).then(() => {
    console.log("Connected to mongodb");
    if (callback) {
      (callback.call)(null,mongoose);
    }
  }).catch(err => {
    console.warn('Could not connect to mongodb.', err); 
    (callback.call)(null);
  });
},
  methods: {
    
    loadController: function (controller, options) {
      var defaultJWTSecret = "myapp";
      var defaultJWTConfig =  {
        secret: defaultJWTSecret
      };
      var config = params ? params : defaultJWTConfig;
      config.jwt = config.jwt?config.jwt: defaultJWTConfig;
      config.jwt.secret = config.jwt.secret?config.jwt.secret: defaultJWTSecret;
       
      config.options = options;
      var controllerBaseObj = new Controller(controller, app, config,CURRENT_MODULE);

      var cpath = './app/controllers/' + controller + ".controller.js";
      var pathsToCheck = getLookUpPathForItem("controllers");
       
      var controllerFileName =  controller + ".controller.js";
      var cpath = getFileFromPaths(pathsToCheck,controllerFileName);
      if(!cpath) { 
        console.error("Controller file with name "+controller+".controller.js does not exits");
        var ret = new function() {
         this.methods = controllerBaseObj
        };
        return ret;
      } 
      var pathToRequire = `./app/controllers/${controllerFileName}`;
      if(CURRENT_MODULE) {
        var pathToRequire = `./app/modules/${CURRENT_MODULE}/controllers/${controllerFileName}`;
      }
       
      var controller = require(pathToRequire);
    
      controller = new controller(controllerBaseObj, options);
      var cName =  controller.name;
      //console.log(JSON.stringify(cName));



      controller.methods = controllerBaseObj;
      controller.options = options;
      controller.module = CURRENT_MODULE;
      return controller;
    }
  },
  start: function (serviceName, routes,serviceConfig) {


    if(!serviceConfig) {
      serviceConfig = { };
    }

    var port = process.env.port ? process.env.port : null;
    port = port ? port : argv.port ? argv.port : null;
    port = port? port : serviceConfig.port;
    if (!port) {
      console.error("PORT not set for " + serviceName + " service. Exiting...");

      process.exit(0);
    }

    if(!serviceConfig.db) {
      serviceConfig.db = "database.config";
    }
    if(!serviceConfig.params) {
      serviceConfig.app = "app.config";
    }
 
    dbConfig = loadConfigForEnv(serviceConfig.db,env);
    params = loadConfigForEnv(serviceConfig.app,env);  
    var gatewayConfig = params.gateway?params.gateway:{url:""};
    gateway = require('./app/components/gateway.component')(gatewayConfig);
     
    var that = this;
    this.connectToDb(function (db) {
      var options = db;
      if (routes) {
        var len = routes.length ? routes.length : 0;
        var i = 0;
        var route = null;
        while (i < len) {
          route = routes[i];
          console.debug("Loading route " + route); 
          var routeFile = `./app/routes/${route}.routes.js`;
          if(CURRENT_MODULE) {
            routeFile = `./app/modules/${CURRENT_MODULE}/routes/${route}.routes.js`;
          }
          require(routeFile)(app, that.methods, options);

          i++;
        }
        app.listen(port, () => {
          console.log("Server is listening on port " + port);
        });

      }

    });



  }




};
