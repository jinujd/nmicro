var server = require('./server.js'); 
var routes = ['master'];
var serviceName = "admin";
server.start(serviceName, routes,{
    port: 3307,
    db: "database.admin.config.js",
    apsp: "app.admin.js"
});