irf.pageCollection.factory(irf.page("user.MarkAttendance"),
    ["$log","$q", 'Pages_ManagementHelper','PageHelper','formHelper','Utils',
        'SessionStore',"$state","$stateParams","Masters","authService", "User", "SchemaResource","Queries","Enrollment",
        function($log, $q, ManagementHelper, PageHelper, formHelper,Utils,
            SessionStore,$state,$stateParams,Masters,authService, User, SchemaResource,Queries,Enrollment){

           
                
            return {
                "name":"MARK_ATTENDANCE",
                "type": "schema-form",
                "title": "MARK_ATTENDANCE",
                initialize: function (model, form, formCtrl) {
                    $log.info("mark attendance loaded");
                    var bankName = SessionStore.getBankName();
                    var banks = formHelper.enum('bank').data;
                    var userRole = SessionStore.getUserRole();
                    var customer = {};
                    customer.entrytype = ""; 
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
                                Enrollment.getCustomerById({id:user.customerId}).$promise.then(function(resp){
                                    model.customer = resp;
                                })
                                model.customer.userType = user.roleCode;
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
                        title: "LOG_ATTENDANCE",
                        items: [
                            {
                                key: "user.userName",
                                title: "FULL_NAME" ,
                                readonly :true
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
                                readonly :true,
                                "parentEnumCode": "bank",
                                "parentValueExpr": "model.bankId",
                            },
                            {
                                key: "customer.type",
                                title: "ENTRY_TYPE",
                                type: "radios",
                                "titleMap": {
                                    IN  : "IN",
                                    OUT : "OUT",
                                },
                                "onChange": function(modelValue, form, model) {
                                    if (model.customer.type) {
                                        model.customer.datetime = new Date().toLocaleDateString()+ ' ' + new Date().toLocaleTimeString();
                                        model.customer.time     = new Date().toLocaleTimeString();
                                        model.customer.date     = new Date();
                                    }
                                    console.log(model.customer.datetime);
                                }
                            
                            }, 
                            {
                                key:"customer.datetime",
                                title:"LOGIN_TIME",
                                
                                "readonly": true,
                                condition:"model.customer.type"

                            } ,
                            {
                                title:   "REMARKS",
                                key  :   "customer.remarks",
                                type :   "textarea",
                                required: true
                            },
                        ]
                    },
                    {
                        "type":"box",
                        "orderNo":4,
                        "title":"VALIDATE_BIOMETRIC",                                   
                         "items":[{
                                    key:"customer.fpOverrideRequested",
                                    type: "checkbox",
                                    "orderNo" : 10,
                                    "title": "OVERRIDE_FINGERPRINT",
                                    schema: {
                                    "default": false
                                    },
                                },    
                               {
                                 key:"customer.overrideReasons",
                                 type:"text",
                                 "orderNo":20,
                                 "title":"OVERRIDE_REMARKS",
                                 condition:"model.customer.fpOverrideRequested"
                                },
                                {
                                    condition: "!model.customer.fpOverrideRequested",
                                    key: "customer.isBiometricValidated",
                                    "title": "CHOOSE_A_FINGER_TO_VALIDATE",
                                    type: "validatebiometric",
                                    category: 'CustomerEnrollment',
                                    "orderNo":40,
                                    subCategory: 'FINGERPRINT',
                                    helper: formHelper,
                                    biometricMap: {
                                        leftThumb:   "model.customer.leftHandThumpImageId",
                                        leftIndex:   "model.customer.leftHandIndexImageId",
                                        leftMiddle:  "model.customer.leftHandMiddleImageId",
                                        leftRing:    "model.customer.leftHandRingImageId",
                                        leftLittle:  "model.customer.leftHandSmallImageId",
                                        rightThumb:  "model.customer.rightHandThumpImageId",
                                        rightIndex:  "model.customer.rightHandIndexImageId",
                                        rightMiddle: "model.customer.rightHandMiddleImageId",
                                        rightRing:   "model.customer.rightHandRingImageId",
                                        rightLittle: "model.customer.rightHandSmallImageId"
                                    },
                                    viewParams: function(modelValue, form, model) {
                                        return {
                                            customerId: model.customer.id
                                        };
                                    },
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
                        try {
                            Queries.getBankName(model.bankId).then(function(data){
                                model.user.bankName = data;
                                // PageHelper.showLoader();
                                PageHelper.showProgress("user-update", 'Working...');

                                if (!(model.customer.fpOverrideRequested) && !(model.customer.isBiometricValidated)){
                                    PageHelper.hideLoader();
                                    PageHelper.showErrors({
                                        data:{
                                            error:"Bio metric validation is required"
                                        }
                                    })
                                    return false;
                                }   

                                Utils.confirm("Are you sure?")
                                    .then(function(){
                                        // if (_.has(model.user, 'id') && !_.isNull(model.user.id)){
                                        //     /* Existing User */
                                        //     User.update(model.user)
                                        //         .$promise
                                        //         .then(function(response){
                                        //             PageHelper.showProgress("user-update", 'Done', 5000);
                                        //             model.user = response;
                                        //             var branches = formHelper.enum('branch_id').data;
                                        //             for (var i = 0; i < branches.length; i++) {
                                        //                 var branch = branches[i];
                                        //                 if (branch.name == model.user.branchName) {
                                        //                     model.user.branchId = branch.value;
                                        //                 }
                                        //             }
                                        //         }, function(httpResponse){
                                        //             PageHelper.showProgress("user-update", 'Failed.', 5000);
                                        //             PageHelper.showErrors(httpResponse);
                                        //         })
                                        //         .finally(function(){
                                        //             PageHelper.hideLoader();
                                        //         })
                                        // } else {
                                            /* New User */
                                            console.log(model.customer);    
                                            User.createUserAttendance(model.user)
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

                                        //}

                                    })

                            })
                        }
                        catch(e){
                            PageHelper.hideLoader();
                            console.log(e);
                            PageHelper.showProgress("","Error while calling query service",2000);
                        }

                    }
                }
            };
        }
    ]
);
