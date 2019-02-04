irf.pageCollection.factory(irf.page("management.UserRoles"),
["$log", "SessionStore", "PageHelper", "formHelper", "RolesPages", "Utils","User","$stateParams",
    function($log, SessionStore, PageHelper, formHelper, RolesPages, Utils,User,$stateParams) {
       
        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "User Roles",
            initialize: function (model, form, formCtrl) {
                $log.info("User Maintanance loaded");
                var bankName = SessionStore.getBankName();
                var banks = formHelper.enum('bank').data;
                var userRole = SessionStore.getUserRole();
                if (userRole && userRole.accessLevel && userRole.accessLevel === 5) {
                    model.fullAccess = true;
                }

                for (var i = 0; i < banks.length; i++) {
                    if (banks[i].name == bankName) {
                        model.bankId = banks[i].value;
                        model.bankName = banks[i].name;
                    }
                }

                if(!$stateParams.pageId) {
                    model.create = true;
                    model.user = {
                        "roleCode": "A",
                        "activated": true,
                        "userState": "ACTIVE",
                        "userType": "A",
                        "bankName":model.bankName,
                        "validUntil": "2010-05-26",
                        "accessType": "BRANCH",
                        "imeiNumber":"",
                        "userRoles": [
                            
                        ],
                        "userBranches": [
                        ]
                    };
                }

                else{
                    PageHelper.showBlockingLoader("Loading the user...");
                    PageHelper.showProgress("loading-user", 'Loading user...');
                    User.get({user_id: $stateParams.pageId})
                        .$promise
                        .then(function(user){
                            PageHelper.showProgress('loading-user', 'Done.', 5000);
                            model.user = user;
                            var branches = formHelper.enum('branch_id').data;
                            for (var i = 0; i < branches.length; i++) {
                                var branch = branches[i];
                                if (branch.name == model.user.branchName) {
                                    model.user.branchId = branch.value;
                                }
                            }
                        }, function(httpResponse){
                            PageHelper.showProgress('loading-user', 'Failed.', 5000);
                        }).finally(function(){
                            PageHelper.hideBlockingLoader();
                        })
                }
            },
            form: [{
                "type": "box",
                "title": "User Role Mapping",
                "items": [{
                    key: "userRoles.userId",
                    type: "lov",
                    lovonly: true,
                    inputMap: {
                        "userId": {
                            "key": "userRoles.userId"
                        },
                        "userName": {
                            "key": "userRoles.userName"
                        }
                    },
                    outputMap: {
                        "userId": "userRoles.userId",
                        "userName": "userRoles.userName",
                        "roleId": "userRoles.roleId",
                        "roleName": "userRoles.roleName",
                        "userRoleId": "userRoles.userRoleId"
                    },
                    searchHelper: formHelper,
                    search: function(inputModel, form, model) {
                        return RolesPages.searchUsers({
                            userId: inputModel.userId,
                            userName: inputModel.userName
                        }).$promise;
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.userId + ': ' + item.userName,
                            item.roleId ? (item.roleId + ': ' + item.roleName) : ''
                        ];
                    }
                }, {
                    key: "userRoles.userName",
                    readonly: true
                }, {
                    key: "userRoles.roleId",
                    title: "Role ID",
                    type: "lov",
                    lovonly: true,
                    fieldType: "number",
                    outputMap: {
                        "id": "userRoles.roleId",
                        "name": "userRoles.roleName"
                    },
                    searchHelper: formHelper,
                    search: function(inputModel, form, model) {
                        return RolesPages.allRoles({
                            userid: inputModel.id
                        }).$promise;
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.id,
                            item.name
                        ];
                    }
                }, {
                    key: "userRoles.roleName",
                    title: "Role name",
                    readonly: true
                }]
            }, {
                type: "actionbox",
                condition: "!model.userRoles.id",
                items: [{
                    type: "submit",
                    title: "Add User Role"
                }]
            }, {
                type: "actionbox",
                condition: "model.userRoles.id",
                items: [{
                    type: "submit",
                    title: "Update User Role"
                }]
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "userRoles": {
                        "type": "object",
                        "properties": {
                            "userId": {
                                "type": "string",
                                "title": "User ID"
                            },
                            "id": {
                                "key": "userRoles.userRolesId",
                                "type": "number",
                                "title": " id"
                            },
                            "userName": {
                                "type": "string",
                                "title": "User Name"
                            },
                            "roleId": {
                                "type": ["null", "string", "number"],
                                "title": "Role ID"
                            },
                            "roleName": {
                                "type": ["null", "string"],
                                "title": "Role Name"
                            }
                        }
                    }
                }
            },

            
            actions: {
                submit: function(model, form, formName) {
                    Utils.confirm('Are you sure?').then(function() {
                        PageHelper.clearErrors();
                        PageHelper.showLoader();
                        model.userRoles.id=0;
                        model.userRoles.id=model.userRoles.userRoleId;
                        User.get({user_id: model.userRoles.userId})
                            .$promise
                            .then(function(user){
                                PageHelper.showProgress('loading-user', 'Done.', 5000);
                                model.user = user;  
                                model.user.userRoles=[];  
                                model.user.userRoles.push(model.userRoles);
                                model.userRoles=null;
                        RolesPages.updateUserRole(model.user).$promise.then(function(resp) {
                            model.user = resp;
                            PageHelper.showProgress("user", "Role created/updated " + model.user.user_role.user_role_id, 3000);
                        }, function(err) {
                            PageHelper.showErrors(err);
                        }).finally(function() {
                            PageHelper.hideLoader();
                        });
                      })
                    });
                }
            }
        };
    }
]);
