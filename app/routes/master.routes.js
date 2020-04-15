module.exports = (app, methods, options) => {
    const admin = methods.loadController('admin', options);
    const mobile = methods.loadController('mobile', options);

    //District

    admin.methods.post('/masters/districts', admin.createDistrict, {
        auth: true
    });

    admin.methods.get('/masters/districts', admin.listDistrict, {
        auth: true
    });
    mobile.methods.get('/masters/districts', mobile.appListDistrict, {
        auth: true
    });
    admin.methods.patch('/masters/districts/:id', admin.updateDistrict, {
        auth: true
    });
    admin.methods.get('/masters/districts/:id', admin.getDistrict, {
        auth: true
    });
    admin.methods.delete('/masters/districts/:id', admin.deleteDistrict, {
        auth: true
    });


    //Lsgi Type

    admin.methods.post('/masters/lsgi-types', admin.createLsgiType, {
        auth: true
    });
    admin.methods.patch('/masters/lsgi-types/:id', admin.updateLsgiType, {
        auth: true
    });
    admin.methods.get('/masters/lsgi-types/:id', admin.getLsgiType, {
        auth: true
    });
    admin.methods.get('/masters/lsgi-types', admin.listLsgiType, {
        auth: true
    });
    mobile.methods.get('/masters/lsgi-types', mobile.listAppLsgiType, {
        auth: true
    });
    admin.methods.delete('/masters/lsgi-types/:id', admin.deleteLsgiType, {
        auth: true
    });

    // Lsgi

    admin.methods.post('/masters/lsgis', admin.createLsgi, {
        auth: true
    });
    admin.methods.patch('/masters/lsgis/:id', admin.updateLsgi, {
        auth: true
    });
    admin.methods.get('/masters/lsgis/:id', admin.getLsgi, {
        auth: true
    });
    admin.methods.get('/masters/lsgis', admin.listLsgi, {
        auth: true
    });
    mobile.methods.get('/masters/lsgis', mobile.appListLsgi, {
        auth: true
    });
    admin.methods.delete('/masters/lsgis/:id', admin.deleteLsgi, {
        auth: true
    });

    //Wards

    admin.methods.post('/masters/wards', admin.createWard, {
        auth: true
    });
    admin.methods.patch('/masters/wards/:id', admin.updateWard, {
        auth: true
    });
    admin.methods.get('/masters/wards/:id', admin.getWard, {
        auth: true
    });
    admin.methods.get('/masters/wards', admin.listWard, {
        auth: true
    });
    mobile.methods.get('/masters/wards', mobile.appListWard, {
        auth: true
    });
    admin.methods.delete('/masters/wards/:id', admin.deleteWard, {
        auth: true
    });

    //Category
    admin.methods.post('/masters/categories', admin.createCategory, {
        auth: true
    });
    admin.methods.patch('/masters/categories/:id', admin.updateCategory, {
        auth: true
    });
    admin.methods.get('/masters/categories', admin.listCategory, {
        auth: true
    });
    admin.methods.get('/masters/categories/:id', admin.getCategory, {
        auth: true
    });
    mobile.methods.get('/masters/categories', mobile.appListCategory, {
        auth: true
    });
    admin.methods.delete('/masters/categories/:id', admin.deleteCategory, {
        auth: true
    });

    //Category Relationship
    admin.methods.post('/masters/category-relationships', admin.createCategoryRelationship, {
        auth: true
    });
    admin.methods.patch('/masters/category-relationships/:id', admin.updateCategoryRelationship, {
        auth: true
    });

    admin.methods.get('/masters/category-relationships', admin.listCategoryReletionship, {
        auth: true
    });
    admin.methods.get('/masters/category-relationships/:id', admin.getCategoryRelationship, {
        auth: true
    });
    mobile.methods.get('/masters/category-relationships', mobile.appListCategoryRelationship, {
        auth: true
    });
    admin.methods.delete('/masters/category-relationships/:id', admin.deleteCategoryRelationship, {
        auth: true
    });



    //user
    admin.methods.get('/user-types', admin.getUserTypes, {
        auth: true
    });
    admin.methods.post('/users', admin.createUser, {
        auth: true
    });
    admin.methods.patch('/users/:id', admin.updateUser, {
        auth: true
    });
    admin.methods.get('/users', admin.listUser, {
        auth: true
    });
    admin.methods.patch('/users/change-password/:id', admin.changeUserPassword, {
        auth: true
    });
  
 
    // mobile.methods.post('/user/signup', mobile.signup, {
    //     auth: false
    // });
    // admin.methods.patch('/user/status-update/:id', admin.statusUpdate, {
    //     auth: false
    // });
    admin.methods.get('/users/:id', admin.getUser, {
        auth: false
    });
    admin.methods.delete('/users/:id', admin.deleteUser, {
        auth: false
    });






    //meta
    admin.methods.post('/masters/metas', admin.createMeta, {
        auth: true
    });
    admin.methods.patch('/masters/metas/:id', admin.updateMeta, {
        auth: true
    });

    admin.methods.get('/masters/metas', admin.listMeta, {
        auth: true
    });
    admin.methods.get('/masters/metas/:id', admin.getMeta, {
        auth: true
    });
    mobile.methods.get('/masters/metas', mobile.appListMeta, {
        auth: true
    });
    admin.methods.delete('/masters/metas/:id', admin.deleteMeta, {
        auth: true
    });

    //Grade Configuaration
    admin.methods.post('/masters/grade-configs', admin.createGradeConfig, {
        auth: true
    });
    admin.methods.patch('/masters/grade-configs/:id', admin.updateGradeConfig, {
        auth: true
    });

    admin.methods.get('/masters/grade-configs', admin.listGradeConfig, {
        auth: true
    });
    admin.methods.get('/masters/grade-configs/:id', admin.getGradeConfiguaration, {
        auth: true
    });
    // mobile.methods.get('/masters/metas', mobile.appListMeta, {
    //     auth: true
    // });
    admin.methods.delete('/masters/grade-configs/:id', admin.deleteGradeConfiguaration, {
        auth: true
    });

    //Percentage Configuaration
    admin.methods.post('/masters/percentage-configs', admin.createPercentageConfig, {
        auth: true
    });
    admin.methods.patch('/masters/percentage-configs/:id', admin.updatePercentageConfig, {
        auth: true
    });

    admin.methods.get('/masters/percentage-configs', admin.listPercentageConfig, {
        auth: true
    });
    admin.methods.get('/masters/percentage-configs/:id', admin.getPercentageConfig, {
        auth: true
    });
    // mobile.methods.get('/masters/percentage-config', mobile.appListMeta, {
    //     auth: true
    // });
    admin.methods.delete('/masters/percentage-configs/:id', admin.deletePercentageConfig, {
        auth: true
    });

    //Percentage Configuaration Slab
    admin.methods.post('/masters/percentage-config-slabs', admin.createPercentageConfigSlab, {
        auth: true
    });
    admin.methods.patch('/masters/percentage-config-slabs/:id', admin.updatePercentageConfigSlab, {
        auth: true
    });

    admin.methods.get('/masters/percentage-config-slabs', admin.listPercentageConfigSlab, {
        auth: true
    });
    admin.methods.get('/masters/percentage-config-slabs/:id', admin.getPercentageConfigSlab, {
        auth: true
    });
    // // mobile.methods.get('/masters/percentage-config', mobile.appListMeta, {
    // //     auth: true
    // // });
    admin.methods.delete('/masters/percentage-config-slabs/:id', admin.deletePercentageConfigSlab, {
        auth: true
    });


    //Notification
    admin.methods.post('/masters/notifications', admin.createNotification, {
        auth: true
    });
    admin.methods.patch('/masters/notifications/:id', admin.updateNotification, {
        auth: true
    });

    admin.methods.get('/masters/notifications', admin.listNotification, {
        auth: true
    });
    admin.methods.get('/masters/notifications/:id', admin.getNotification, {
        auth: true
    });
    // // // mobile.methods.get('/masters/percentage-config', mobile.appListMeta, {
    // // //     auth: true
    // // // });
    admin.methods.delete('/masters/notifications/:id', admin.deleteNotification, {
        auth: true
    });


    //Sidebar menu
    admin.methods.post('/masters/sidebar-menus', admin.createSidebarMenu, {
        auth: true
    });
    admin.methods.patch('/masters/sidebar-menus/:id', admin.updateSidebarMenu, {
        auth: true
    });

    admin.methods.get('/masters/sidebar-menus', admin.listSidebarMenu, {
        auth: true
    });
    admin.methods.get('/masters/sidebar-menus/:id', admin.getSidebarMenu, {
        auth: true
    });
    // // // mobile.methods.get('/masters/percentage-config', mobile.appListMeta, {
    // // //     auth: true
    // // // });
    admin.methods.delete('/masters/sidebar-menus/:id', admin.deleteSidebarMenu, {
        auth: true
    });

    //Question
    admin.methods.post('/masters/questions', admin.createQuestion, {
        auth: true
    });
    admin.methods.patch('/masters/questions/:id', admin.updateQuestion, {
        auth: true
    });

    admin.methods.get('/masters/questions', admin.listQuestion, {
        auth: true
    });
    admin.methods.get('/masters/questions/:id', admin.getQuestion, {
        auth: true
    });
    // // // // mobile.methods.get('/masters/percentage-config', mobile.appListMeta, {
    // // // //     auth: true
    // // // // });
    admin.methods.delete('/masters/questions/:id', admin.deleteQuestion, {
        auth: true
    });


    //Question Option
    admin.methods.post('/masters/question-options', admin.createQuestionOption, {
        auth: true
    });
    admin.methods.patch('/masters/question-options/:id', admin.updateQuestionOption, {
        auth: true
    });

    admin.methods.get('/masters/question-options', admin.listQuestionOption, {
        auth: true
    });
    admin.methods.get('/masters/question-options/:id', admin.getQuestionOption, {
        auth: true
    });
    // // // // mobile.methods.get('/masters/percentage-config', mobile.appListMeta, {
    // // // //     auth: true
    // // // // });
    admin.methods.delete('/masters/question-options/:id', admin.deleteQuestionOption, {
        auth: true
    });



    admin.methods.post('/login', admin.login, { auth: false });
    admin.methods.patch('/change-password/:id', admin.changeAdminPassword, {
        auth: false
    });
    //facilityType

    admin.methods.post('/masters/facility-types', admin.createFacilityType, {
        auth: true
    });
    admin.methods.patch('/masters/facility-types/:id', admin.updateFacilityType, {
        auth: true
    });

    admin.methods.get('/masters/facility-types', admin.listFacilityType, {
        auth: true
    });
    admin.methods.get('/masters/facility-types/:id', admin.getFacilityType, {
        auth: true
    });
    // // // // mobile.methods.get('/masters/percentage-config', mobile.appListMeta, {
    // // // //     auth: true
    // // // // });
    admin.methods.delete('/masters/facility-types/:id', admin.deleteFacilityType, {
        auth: true
    });



    //FacilitySurveyQuestion

    admin.methods.post('/masters/facility-survey-questions', admin.createFacilitySurveyQuestion, {
        auth: true
    });
    admin.methods.patch('/masters/facility-survey-questions/:id', admin.updateFacilitySurveyQuestion, {
        auth: true
    });

    admin.methods.get('/masters/facility-survey-questions', admin.listFacilitySurveyQuestion, {
        auth: true
    });
    admin.methods.get('/masters/facility-survey-questions/:id', admin.getFacilitySurveyQuestion, {
        auth: true
    });
    // // // // mobile.methods.get('/masters/percentage-config', mobile.appListMeta, {
    // // // //     auth: true
    // // // // });
    admin.methods.delete('/masters/facility-survey-questions/:id', admin.deleteFacilitySurveyQuestion, {
        auth: true
    });


    //categoryFacilitySurveyQuestion

    admin.methods.post('/masters/category-facility-survey-questions', admin.createCategoryFacilitySurveyQuestion, {
        auth: true
    });
    admin.methods.patch('/masters/category-facility-survey-questions/:id', admin.updateCategoryFacilitySurveyQuestion, {
        auth: true
    });

    admin.methods.get('/masters/category-facility-survey-questions', admin.listCategoryFacilitySurveyQuestion, {
        auth: true
    });
    admin.methods.get('/masters/category-facility-survey-questions/:id', admin.getCategoryFacilitySurveyQuestion, {
        auth: true
    });
    // // // // mobile.methods.get('/masters/percentage-config', mobile.appListMeta, {
    // // // //     auth: true
    // // // // });
    admin.methods.delete('/masters/category-facility-survey-questions/:id', admin.deleteCategoryFacilitySurveyQuestion, {
        auth: true
    });


    //fecility survey


    admin.methods.patch('/facility-surveys/:id', admin.updateFacilitySurvey, {
        auth: true
    });

    admin.methods.get('/facility-surveys', admin.listFacilitySurvey, {
        auth: true
    });
    admin.methods.get('/facility-surveys/:id', admin.getFacilitySurvey, {
        auth: true
    });
    // // // // mobile.methods.get('/masters/percentage-config', mobile.appListMeta, {
    // // // //     auth: true
    // // // // });
    admin.methods.delete('/facility-surveys/:id', admin.deleteFacilitySurvey, {
        auth: true
    });


    //image



    admin.methods.post('/images', admin.createImage, {
        auth: true
    });

    admin.methods.patch('/images/:id', admin.updateImage, {
        auth: true
    });

    admin.methods.get('/images', admin.listImage, {
        auth: true
    });
    // mobile.methods.get('/masters/district', mobile.appListDistrict, {
    //     auth: true
    // });

    admin.methods.get('/images/:id', admin.getImage, {
        auth: true
    });
    admin.methods.delete('/images/:id', admin.deleteImage, {
        auth: true
    });

    //facilitySurveyImage

    admin.methods.post('/facility-survey-images', admin.createFacilitySurveyImage, {
        auth: true
    });

    admin.methods.get('/facility-survey-images', admin.listFacilitySurveyImage, {
        auth: true
    });
    // mobile.methods.get('/masters/district', mobile.appListDistrict, {
    //     auth: true
    // });
    admin.methods.patch('/facility-survey-images/:id', admin.updateFacilitySurveyImage, {
        auth: true
    });
    admin.methods.get('/facility-survey-images/:id', admin.getFacilitySurveyImage, {
        auth: true
    });
    admin.methods.delete('/facility-survey-images/:id', admin.deleteFacilitySurveyImage, {
        auth: true
    });



    //mainSurveyMasterQuestion

    admin.methods.post('/masters/main-survey-master-questions', admin.createMainSurveyMasterQuestion, {
        auth: true
    });
    admin.methods.patch('/masters/main-survey-master-questions/:id', admin.updateMainSurveyMasterQuestion, {
        auth: true
    });

    admin.methods.get('/masters/main-survey-master-questions', admin.listMainSurveyMasterQuestion, {
        auth: true
    });
    admin.methods.get('/masters/main-survey-master-questions/:id', admin.getMainSurveyMasterQuestion, {
        auth: true
    });
    // // // // mobile.methods.get('/masters/percentage-config', mobile.appListMeta, {
    // // // //     auth: true
    // // // // });
    admin.methods.delete('/masters/main-survey-master-questions/:id', admin.deleteMainSurveyMasterQuestion, {
        auth: true
    });

    admin.methods.get('/masters/main-survey-field-names', admin.listMainSurveyFieldName, {
        auth: true
    });

    admin.methods.get('/masters/facility-survey-field-names', admin.listFacilitySurveyFieldName, {
        auth: true
    });

    admin.methods.post('/masters/versions', admin.updateVersion, {
        auth: true
    });
    // admin.methods.get('/masters/version', admin.getVersion, {
    //     auth: true
    // });

    //authController

    admin.methods.post('/masters/auth-controllers', admin.createAuthController, {
        auth: true
    });

    admin.methods.get('/masters/auth-controllers', admin.listAuthController, {
        auth: true
    });
    // mobile.methods.get('/masters/district', mobile.appListDistrict, {
    //     auth: true
    // });
    admin.methods.patch('/masters/auth-controllers/:id', admin.updateAuthController, {
        auth: true
    });
    admin.methods.get('/masters/auth-controllers/:id', admin.getAuthController, {
        auth: true
    });
    admin.methods.delete('/masters/auth-controllers/:id', admin.deleteAuthController, {
        auth: true
    });

    //Main Survey CRUDS

    admin.methods.get('/masters/main-surveys', admin.listMainSurvey, {
        auth: true
    });

    admin.methods.get('/masters/main-surveys/:id', admin.getMainSurvey, {
        auth: true
    });

    admin.methods.delete('/masters/main-surveys/:id', admin.deleteMainSurvey, {
        auth: true
    });

    admin.methods.patch('/masters/main-surveys/:id', admin.updateMainSurvey, {
        auth: true
    });


    //AuthPermission 

    admin.methods.post('/masters/auth-permissions', admin.createAuthPermission, {
        auth: true
    });

    admin.methods.get('/masters/auth-permissions', admin.listAuthPermission, {
        auth: true
    });

    admin.methods.patch('/masters/auth-permissions/:id', admin.updateAuthPermission, {
        auth: true
    });
    admin.methods.get('/masters/auth-permissions/:id', admin.getAuthPermission, {
        auth: true
    });
    admin.methods.delete('/masters/auth-permissions/:id', admin.deleteAuthPermission, {
        auth: true
    });
    admin.methods.get('/masters/auth-permission-list', admin.listAuthPermission, {
        auth: true
    });
    //authRole

    admin.methods.post('/masters/auth-roles', admin.createAuthRole, {
        auth: true
    });

    admin.methods.get('/masters/auth-roles', admin.listAuthRole, {
        auth: true
    });
    // mobile.methods.get('/masters/district', mobile.appListDistrict, {
    //     auth: true
    // });
    admin.methods.patch('/masters/auth-roles/:id', admin.updateAuthRole, {
        auth: true
    });
    admin.methods.get('/masters/auth-roles/:id', admin.getAuthRole, {
        auth: true
    });
    admin.methods.delete('/masters/auth-roles/:id', admin.deleteAuthRole, {
        auth: true
    });


     //authrRolePermission

     admin.methods.post('/masters/auth-role-permissions', admin.createAuthRolePermission, {
        auth: true
    });

    admin.methods.get('/masters/auth-role-permissions/list/:id', admin.listAuthRolePermission, {
        auth: true
    });
    // mobile.methods.get('/masters/district', mobile.appListDistrict, {
    //     auth: true
    // });
    // admin.methods.patch('/masters/auth-role-permission/:id', admin.updateAuthRolePermission, {
    //     auth: true
    // });
    admin.methods.patch('/masters/auth-role-permissions/:id', admin.updateAuthRolePermissionWithRole, {
        auth: true
    });
    // admin.methods.get('/masters/auth-role-permission/:id', admin.getAuthRolePermission, {
    //     auth: true
    // });
    admin.methods.delete('/masters/auth-role-permissions/:id', admin.deleteAuthRolePermission, {
        auth: true
    });



      //AuthSideBarPermission

      admin.methods.post('/masters/auth-permission-sidebar-menus', admin.createAuthPermissionSidebarMenu, {
        auth: true
    });

    admin.methods.get('/masters/auth-permission-sidebar-menus', admin.listAuthPermissionSidebarMenu, {
        auth: true
    });

    admin.methods.patch('/masters/auth-permission-sidebar-menus/:id', admin.updateAuthPermissionSidebarMenu, {
        auth: true
    });
    admin.methods.get('/masters/auth-permission-sidebar-menus/:id', admin.getAuthPermissionSidebarMenu, {
        auth: true
    });
    admin.methods.delete('/masters/auth-permission-sidebar-menus/:id', admin.deleteAuthPermissionSidebarMenu, {
        auth: true
    });
  

}
