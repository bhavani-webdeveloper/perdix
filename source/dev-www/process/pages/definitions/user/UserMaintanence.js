irf.pageCollection.factory(irf.page("user.UserMaintanence"),
    ["$log","$q", 'Pages_ManagementHelper','PageHelper','formHelper','Utils',
        'SessionStore',"$state","$stateParams","Masters","authService", "User", "SchemaResource","Queries", "Account",
        function($log, $q, ManagementHelper, PageHelper, formHelper,Utils,
            SessionStore,$state,$stateParams,Masters,authService, User, SchemaResource,Queries, Account){
            var getBranchByCode= function(code){
                var temp = formHelper.enum('branch').data;
                for (var i=0;i<temp.length;i++){
                    if (temp[i].code == code)
                        return temp[i].name;
                }
                return "MAPPED_BRANCH";
            
            }
            var branchNameTitleMap = function(branches,model){
                var userBranchLength = model.user.userBranches.length;
                var arrayIndex = 0;
                for (var i = 0; i < branches.length; i++) {
                    var branch = branches[i];
                    if (arrayIndex < userBranchLength){
                        if ( branch.value == model.user.userBranches[arrayIndex].branchId) {
                            model.user.userBranches[arrayIndex].branchId = branch.value;
                            model.user.userBranches[arrayIndex].bankId = Number(branch.parentCode);
                            model.user.userBranches[arrayIndex].titleExpr = branch.name;
                            arrayIndex++;
                            i=-1;
                        }
                    }
                }
            }
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
                                model.user.userState = "ACTIVE";
                                var branches = formHelper.enum('branch_id').data;
                                for (var i = 0; i < branches.length; i++) {
                                    var branch = branches[i];
                                    if (branch.name == model.user.branchName) {
                                        model.user.branchId = branch.value;
                                    }
                                }
                                var userBranchLength = model.user.userBranches.length;
                                var arrayIndex = 0;
                                for (var i = 0; i < branches.length; i++) {
                                    var branch = branches[i];
                                    if (arrayIndex < userBranchLength){
                                        if ( branch.value == model.user.userBranches[arrayIndex].branchId) {
                                            model.user.userBranches[arrayIndex].branchId = branch.value;
                                            model.user.userBranches[arrayIndex].bankId = Number(branch.parentCode);
                                            model.user.userBranches[arrayIndex].titleExpr = branch.name;
                                            arrayIndex++;
                                            i=-1;
                                        }
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
                                titleExpr: "model.user.userBranches[arrayIndex].titleExpr",
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
                                        "condition": "model.fullAccess",
                                        "parentValueExpr": "model.user.userBranches[arrayIndex].bankId",
                                        required: true,
                                        onChange: function(valueObj,context,model){
                                                model.user.userBranches[context.arrayIndex].titleExpr = getBranchByCode(valueObj.toString());
                                        }

                                    },
                                    {
                                        key: "user.userBranches[].branchId",
                                        title: "BRANCH_NAME",
                                        type: "select",
                                        "condition": "!model.fullAccess",
                                        enumCode: "branch_id",
                                        "parentEnumCode": "bank",
                                        "parentValueExpr": "model.bankId",
                                        required: true,
                                        onChange: function(valueObj,context,model){
                                                model.user.userBranches[context.arrayIndex].titleExpr = getBranchByCode(valueObj.toString());
                                        }
                                    }
                                ]
                            },
                            {
                                key: "user.imeiNumber",
                                title: "IMEI_NUMBER",
                                //required: false
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
                                "key": "user.userState",
                                "title":"User",
                                "type": "radios",
                                "titleMap": {
                                    "ACTIVE": "Active",
                                    "INACTIVE": "InActive",
                                }
                            },
                            {
                                key: "user.partnerCode",
                                condition: "model.user.accessType=='PARTNER'",
                                type: "select",
                                title: "PARTNER_CODE",
                                enumCode: "partner"
                            },
                            // {
                            //     key: "user.imeiNumber",
                            //     type: "string",
                            //     schema:{
                            //         pattern: "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$",
                            //     },
                            //     title: "MAC Address",   
                            //     validationMessage: { 202: "Only Valid Mac address is Allowed." }

                            // },

                            
                            // {
                            //     key: "user.allowedDevices",
                            //     type: "array",
                            //     //view: "fixed",
                            //     title: "MAC_ADRESS",
                            //     startEmpty: true,
                            //     onArrayAdd: function(modelValue, form, model, formCtrl, $event) {
                            //         //modelValue.bankId=model.bankId;
                            //     },
                            //     items: [
                            //         {
                            //             "key": "user.allowedDevices[].deviceId",
                            //             "title": "DEVICE_ID",
                            //             "type": "String",
                            //         },
                            //         {
                            //             "key": "user.login",
                            //             "title": "USER_ID",
                            //             readonly: true,
                            //             "type": "String",
                            //         },
                            //     ]
                            // },
                            
                        ]
                    },
                    {
                        "type": "actionbox",
                        condition: "!model.create",
                        "items": [{
                            "type": "submit",
                            "title": "SAVE"
                        },
                        {
                            "condition": "model.user && model.user.login",
                            "type": "button",
                            "title": "Reset Password",
                            "onClick": "actions.resetPassword(model, formCtrl, form, $event)"
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
                        try {
                            Queries.getBankName(model.bankId).then(function(data){
                                model.user.bankName = data;
                                // PageHelper.showLoader();
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
                                                    branchNameTitleMap(branches,model);

                                                }, function(httpResponse){
                                                    PageHelper.showProgress("user-update", 'Failed.', 5000);
                                                    PageHelper.showErrors(httpResponse);
                                                })
                                                .finally(function(){
                                                    PageHelper.hideLoader();
                                                })
                                        } else {
                                            /* New User */
                                            model.user.changePasswordOnLogin = true;
                                            User.create(model.user)
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
                                                    branchNameTitleMap(formHelper.enum('branch_id').data,model);
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

                            })
                        }
                        catch(e){
                            PageHelper.hideLoader();
                            console.log(e);
                            PageHelper.showProgress("","Error while calling query service",2000);
                        }

                    },
                    resetPassword: function(model, form, formName) {
                        Utils.confirm("Are you sure?")
                        .then(function(){
                            PageHelper.showProgress("password-reset", 'Working...');
                            PageHelper.showLoader();
                            Account.resetPassword({userId: model.user.login}, null)
                            .$promise
                            .then()
                            .finally(function(){
                                PageHelper.showProgress("password-reset", 'Done', 5000);
                                PageHelper.hideLoader();
                            })
                        })
                    }
                }
            };
        }
    ]
);
