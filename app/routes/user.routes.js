module.exports = (app, methods, options) => {
    const admin = methods.loadController('admin', options);
    const mobile = methods.loadController('mobile', options);

 
    mobile.methods.post('/users/login',mobile.login, {auth:false});

    mobile.methods.post('/users/send-otp',mobile.sendOtp, {auth:false});
    mobile.methods.post('/users/validate-otp',mobile.validateOtp, {auth:false});
    mobile.methods.patch('/users/reset-password',mobile.resetPassword, {auth:false});

        //categoryFacilitySurveyQuestion

        mobile.methods.post('/facility-surveys', mobile.attendFacilitySurvey, {
            auth: true
        });

        mobile.methods.post('/facility-surveys/common-details', mobile.facilitySurveyCommonDetails, {
            auth: true
        });
       
        mobile.methods.post('/main-surveys', mobile.attendSurvey, {
            auth: true, 
            // multer : mobile.getMulter
        });
        mobile.methods.post('/main-surveys/common-details', mobile.mainSurveyCommonDetails, {
            auth: true
        });

        // mobile.methods.get('/version', admin.getVersion, {
        //     auth: true
        // });
}