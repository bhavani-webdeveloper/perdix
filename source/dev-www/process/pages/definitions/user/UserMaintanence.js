irf.pageCollection.factory(irf.page("user.UserMaintanence"),
    ["$log","$q", 'Pages_ManagementHelper','PageHelper','formHelper','Utils',
        'SessionStore',"$state","$stateParams","Masters","authService", "User", "SchemaResource",
        function($log, $q, ManagementHelper, PageHelper, formHelper,Utils,
                 SessionStore,$state,$stateParams,Masters,authService, User, SchemaResource){
            
            return {
                "name":"USER_MAINTANENCE",
                "type": "schema-form",
                "title": $stateParams.pageId ? "EDIT_USER" : "NEW_USER",
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

                form: [
                    {
                        type: "box",
                        title: "USER_INFORMATION",
                        items: [
                            {
                                key: "user.userName",
                                title: "FULL_NAME"
                            },
                            {
                                key: "user.login",
                                title: "LOGIN",
                                readonly: true,
                                condition: "model.user.id"
                            },
                            {
                                key: "user.login",
                                title: "LOGIN",
                                condition: "!model.user.id",
                                required: true
                            },
                            {
                                key: "user.password",
                                title: "PASSWORD",
                                type: "password",
                                condition: "!model.user.id",
                                required: true
                            },
                            {
                                key: "user.confirmPassword",
                                title: "CONFIRM_PASSWORD",
                                type: "password",
                                condition: "!model.user.id",
                                required: true
                            },
                            {
                                key: "user.email",
                                title: "EMAIL",
                                required: true
                            },
                            {
                                key: "user.validUntil",
                                title: "VALID_UNTIL",
                                type: "date",
                                required: true
                            },
                            {
                                "key": "bankId",
                                "title": "BANK_NAME",
                                "type": "select",
                                enumCode: "bank",
                                "condition": "model.fullAccess"
                            },
                            {
                                key: "user.branchId",
                                title: "HOME_BRANCH",
                                type: "select",
                                enumCode: "branch_id",
                                required: true,
                                "parentEnumCode": "bank",
                                "parentValueExpr": "model.bankId",
                            },
                            {
                                key: "user.userBranches",
                                type: "array",
                                //view: "fixed",
                                title: "MAPPED_BRANCHES",
                                titleExpr: "model.user.userBranches[arrayIndex].branchId",
                                startEmpty: true,
                                onArrayAdd: function(modelValue, form, model, formCtrl, $event) {
                                    //modelValue.bankId=model.bankId;
                                },
                                items: [
                                    {
                                        "key": "user.userBranches[].bankId",
                                        "title": "BANK_NAME",
                                        "type": "select",
                                        enumCode: "bank",
                                        "condition": "model.fullAccess"
                                    },
                                    {
                                        key: "user.userBranches[].branchId",
                                        title: "BRANCH_NAME",
                                        type: "select",
                                        enumCode: "branch_id",
                                        "parentEnumCode": "bank",
                                        "parentValueExpr": "model.bankId",
                                        required: true
                                    }
                                ]
                            },
                            {
                                key: "user.accessType",
                                type: "select",
                                title: "ACCESS_TYPE",
                                "titleMap":{
                                    "BRANCH":"BRANCH",
                                    "PARTNER":"PARTNER"
                                },
                                //enumCode: "access_type"
                            },
                            {
                                key: "user.partnerCode",
                                condition: "model.user.accessType=='PARTNER'",
                                type: "select",
                                title: "PARTNER_CODE",
                                enumCode: "partner"
                            }
                        ]
                    },
                    {
                        "type": "actionbox",
                        condition: "!model.create",
                        "items": [{
                            "type": "submit",
                            "title": "SAVE"
                        }]
                    },
                    {
                        "type": "actionbox",
                        condition: "model.create",
                        "items": [{
                            "type": "submit",
                            "title": "SAVE"
                        },
                        {
                            type: "button",
                            icon: "fa fa-refresh",
                            style: "btn-default",
                            title: "Reset",
                            onClick: function(model) {
                                model.user = {
                                    "roleCode": "A",
                                    "activated": true,
                                    "userState": "ACTIVE",
                                    "userType": "A",
                                    "validUntil": "2010-05-26",
                                    "accessType": "BRANCH",
                                    "userRoles": [],
                                    "userBranches": []
                                };
                                model.user.bankName = SessionStore.getBankName();

                            }
                        }]
                    }
                ],
                schema: function() {
                    return SchemaResource.getUserSchema().$promise;
                },
                actions: {
                    submit: function(model, form, formName){
                        $log.info("Inside submit()");
                        PageHelper.clearErrors();
                        var branches = formHelper.enum('branch').data;
                        for (var i = 0; i < branches.length; i++) {
                            var branch = branches[i];
                            if (branch.code == model.user.branchId) {
                                model.user.branchName = branch.name;
                            }
                        }

                        if (_.has(model.user, 'id') && !_.isNull(model.user.id)){

                        } else {
                            /* New User */
                            if (model.user.password != model.user.confirmPassword){
                                PageHelper.showProgress("user-validate", "Password and Confirm Password doesnt match", 5000);
                                return;
                            }
                        }
                        

                        PageHelper.showLoader();
                        PageHelper.showProgress("user-update", 'Working...');
                        Utils.confirm("Are you sure?")
                            .then(function(){
                                if (_.has(model.user, 'id') && !_.isNull(model.user.id)){
                                    /* Existing User */
                                    User.update(model.user)
                                        .$promise
                                        .then(function(response){
                                            PageHelper.showProgress("user-update", 'Done', 5000);
                                            model.user = response;
                                            var branches = formHelper.enum('branch_id').data;
                                            for (var i = 0; i < branches.length; i++) {
                                                var branch = branches[i];
                                                if (branch.name == model.user.branchName) {
                                                    model.user.branchId = branch.value;
                                                }
                                            }
                                        }, function(httpResponse){
                                            PageHelper.showProgress("user-update", 'Failed.', 5000);
                                            PageHelper.showErrors(httpResponse);
                                        })
                                        .finally(function(){
                                            PageHelper.hideLoader();
                                        })
                                } else {
                                    /* New User */
                                    User.create(model.user)
                                        .$promise
                                        .then(function(response){
                                            PageHelper.showProgress("user-update", 'Done', 5000);
                                            model.user = response;
                                            $state.go("Page.Engine", {pageName: 'user.UserMaintanence'}, {reload: true});
                                        }, function(httpResponse){
                                            PageHelper.showProgress("user-update", 'Failed.', 5000);
                                            PageHelper.showErrors(httpResponse);
                                        })
                                        .finally(function(){                                    
                                            PageHelper.hideLoader();
                                        })

                                }
                                
                        })
                    }
                }
            };
        }
    ]
);
