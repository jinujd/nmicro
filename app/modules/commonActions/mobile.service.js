var server = require('../../../server.js'); 
var routes = ['user'];
var serviceName = "mobile";
var servicePort = 8082;
var currentPath = process.cwd();
server.start(serviceName, routes,{
    port: 3307,
    db: "database.admin.config.js",
    apsp: "app.admin.js"
});