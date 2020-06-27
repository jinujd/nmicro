module.exports = (app, methods, options) => { 
    const mobile = methods.loadController('mobileApp', options);
    //const mobile1 = methods.loadController('mobileApp1', options);

    mobile.methods.patch('/users1/test',mobile.test, {
        auth:false, 
    });  
}