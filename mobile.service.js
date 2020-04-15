var server = require('./server.js'); 
var routes = ['user'];
var serviceName = "mobile";
var servicePort = 8082;
server.start(serviceName, routes, servicePort);