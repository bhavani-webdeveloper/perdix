define({
    pageUID: "management.branchadmin.AllotKey",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "PageHelper", "$state", "User", "BranchCreationResource", "BranchKeyResource", "SessionStore", "Utils", "irfNavigator", "$stateParams", "RolesPages", "$filter", "Enrollment", "Queries", "$q", "PagesDefinition"],
    $pageFn:
        function ($log, formHelper, PageHelper, $state, User, BranchCreationResource, BranchKeyResource, SessionStore, Utils, irfNavigator, $stateParams, RolesPages, $filter, Enrollment, Queries, $q, PagesDefinition) {
            return {
                "type": "schema-form",
                "title": "ALLOT_KEY",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    model.allot = model.allot || {};
                    PagesDefinition.getPageConfig("Page/Engine/management.branchadmin.AllotKey")
                        .then(function (data) {
                            model.pageConfig = data;

                            /* Handle Allowed Branches */

                        });
                    $log.info("Allot Creation sample got initialized");
                },
                form: [{
                    "type": "box",
                    "title": "ALLOT_KEY",
                    "items": [
                        {
                            key: "allot.branchId",
                            title: "BRANCH",
                            type: "select",
                            required: true,
                            enumCode: "branch_id"
                        },
                        {
                            "type": "button",
                            "title": "SEARCH",
                            onClick: function (model) {
                                var deferred = $q.defer();
                                BranchKeyResource.KeySearch({
                                    branchId: model.allot.branchId
                                }).$promise.then(function (response) {
                                    model.allotKey = _.cloneDeep(response);
                                    model.allot.key1Custodian = model.allotKey.body.key1KepperUserId.userName;
                                    model.allot.key2Custodian = model.allotKey.body.key2KepperUserId.userName;
                                    // var branch = formHelper.enum('branch_id').data;
                                    // for (var i = 0; i < branch.length; i++) {
                                    //     if (branch[i].value == model.allot.branchId) {
                                    //         model.allot.branchName = branch[i].name;
                                    //     }
                                    // }
                                    console.log("success");
                                    deferred.resolve(model);
                                }, deferred.reject);
                                return deferred.promise;
                            }
                        },
                        {
                            key: "allot.key1Custodian",
                            type: "string",
                            readonly: true,
                            title: "KEY1_CUSTODIAN"
                        },
                        {
                            key: "allot.key2Custodian",
                            type: "string",
                            readonly: true,
                            title: "KEY2_CUSTODIAN"
                        },
                        {
                            key: "allot.key1UserId",
                            title: "KEY1_CUSTODIAN",
                            type: "lov",
                            required: true,
                            lovonly: true,
                            inputMap: {
                                "login": {
                                    "key": "allot.key1UserId",
                                    "title": "User ID"
                                },
                                "userName": {
                                    "key": "allot.userName",
                                    "title": "User Name"
                                }

                            },
                            outputMap: {
                                "login": "allot.key1UserId",
                                "userName": "allot.userName"
                            },
                            searchHelper: formHelper,
                            search: function (inputModel, form, model) {
                                var branch = formHelper.enum('branch_id').data;
                                for (var i = 0; i < branch.length; i++) {
                                    if (branch[i].value == model.allot.branchId) {
                                        model.allot.branchName = branch[i].name;
                                    }
                                }
                                return User.query({
                                    branchName: model.allot.branchName,
                                    login: inputModel.login,
                                    userName: inputModel.userName
                                }).$promise;
                            },
                            getListDisplayItem: function (item, index) {
                                return [item.login, item.userName]

                            }
                        },
                        {
                            key: "allot.key2UserId",
                            title: "KEY2_CUSTODIAN",
                            type: "lov",
                            required: true,
                            lovonly: true,
                            inputMap: {
                                "login": {
                                    "key": "allot.key2UserId",
                                    "title": "User ID"
                                },
                                "userName": {
                                    "key": "allot.userName",
                                    "title": "User Name"
                                }
                            },
                            outputMap: {
                                "login": "allot.key2UserId",
                                "userName": "allot.userName"
                            },
                            searchHelper: formHelper,
                            search: function (inputModel, form, model) {
                                return User.query({
                                    branchName: model.allot.branchName,
                                    login: inputModel.login,
                                    userName: inputModel.userName
                                }).$promise;
                            },
                            getListDisplayItem: function (item, index) {
                                return [item.login, item.userName]

                            }
                        }

                    ],
                },
                {

                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Submit"
                    }]

                }],
                schema: {
                    "type": "object",
                    "properties": {
                        "allot": {
                            "type": "object",
                            "properties": {
                                "key1Custodian": {
                                    "type": "string"
                                },
                                "key2Custodian": {
                                    "type": "string"
                                },
                                "key1UserId": {
                                    "type": ["string", "null"]
                                },
                                "key2UserId": {
                                    "type": ["string", "null"]
                                },
                                "login": {
                                    "type": "string"
                                },
                                "userName": {
                                    "type": "string"
                                },
                                "branch": {
                                    "title": "BRANCH",
                                    "type": ["integer", "null"],
                                    "enumCode": "branch_id",
                                    // "x-schema-form": {
                                    //     "type": "userbranch"
                                    // }
                                },
                            }
                        }
                    }
                },
                actions: {
                    submit: function (model, form, formName) {
                        PageHelper.showLoader();
                        PageHelper.clearErrors();
                        PageHelper.showProgress('allotKeyCreationSubmitRequest', 'Processing');
                        var tempModelData = _.clone(model.allot);
                        var deferred = {};
                        deferred = BranchKeyResource.allotKeyCreation(tempModelData).$promise;
                        deferred.then(function (data) {
                            PageHelper.hideLoader();
                            PageHelper.showProgress('allotKeyCreationSubmitRequest', 'Done', 5000);
                            model.key = {};
                            form.$setPristine();
                            // $state.go('management.AllotKey', null);
                        }, function (data) {
                            PageHelper.hideLoader();
                            PageHelper.showProgress('allotKeyCreationSubmitRequest', 'Oops some error happend', 5000);
                            PageHelper.showErrors(data);
                        });
                    }
                }
            };
        }
})
