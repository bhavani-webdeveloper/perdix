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
                    
                    if(!$stateParams.pageId) {
                        model.create = true;
                        model.user = {
                            "roleCode": "A",
                            "activated": true,
                            "bankName": "Kinara",
                            "userState": "ACTIVE",
                            "userType": "A",
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
                                key: "user.branchName",
                                title: "HOME_BRANCH",
                                type: "select",
                                enumCode: "branch",
                                required: true
                            },
                            {
                                key: "user.userBranches",
                                type: "array",
                                view: "fixed",
                                title: "MAPPED_BRANCHES",
                                items: [
                                    {
                                        key: "user.userBranches[].branchId",
                                        title: "BRANCH_NAME",
                                        type: "select",
                                        enumCode: "branch_id",
                                        required: true
                                    }
                                ]
                            },
                            {
                                key: "user.accessType",
                                type: "select",
                                title: "ACCESS_TYPE",
                                enumCode: "access_type"
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
                                    "bankName": "Kinara",
                                    "userState": "ACTIVE",
                                    "userType": "A",
                                    "validUntil": "2010-05-26",
                                    "accessType": "BRANCH",
                                    "userRoles": [],
                                    "userBranches": []
                                };
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
