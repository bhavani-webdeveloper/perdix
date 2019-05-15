define({
    pageUID: "management.branchadmin.TransferKey",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "PageHelper", "User", "BranchKeyResource", "$state", "SessionStore", "$stateParams", "PagesDefinition"],
    $pageFn:
        function ($log, formHelper, PageHelper, User, BranchKeyResource, $state, SessionStore, $stateParams, PagesDefinition) {
            var branchName = SessionStore.getCurrentBranch().branchName;
            var fromUser = SessionStore.getLoginname();
            var keyBranchId = SessionStore.getBranchId()

            return {
                "type": "schema-form",
                "title": "TRANSFER_KEY",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    model.key = model.key || {};
                    PagesDefinition.getPageConfig("Page/Engine/management.TransferKey")
                        .then(function (data) {
                            model.pageConfig = data;
                            /* Handle Allowed Branches */
                        });
                    PageHelper.showLoader();

                    BranchKeyResource.KeySearch({
                        branchId: keyBranchId
                    }, function (response, headersGetter) {
                        model.key = _.cloneDeep(response);
                        model.key.fromUserId = fromUser
                        model.key.keyBranchId = keyBranchId;
                        model.key.key1Custodian = model.key.body.key1KepperUserId.userName;
                        model.key.key2Custodian = model.key.body.key2KepperUserId.userName;
                        PageHelper.hideLoader();
                    }, function (resp) {
                        PageHelper.hideLoader();
                    });

                },
                form: [{
                    "type": "box",
                    "title": "TRANSFER_KEY",
                    "items": [
                        {
                            key: "key.key1Custodian",
                            type: "string",
                            readonly: true,
                            title: "KEY1_CUSTODIAN"
                        },
                        {
                            key: "key.key2Custodian",
                            type: "string",
                            readonly: true,
                            title: "KEY2_CUSTODIAN"
                        },
                        {
                            key: "key.fromUserId",
                            type: "string",
                            readonly: true,
                            title: "TRANSFERING_KEY_FROM"
                        },
                        {
                            key: "key.toUserId",
                            title: "TRANSFERING_KEY_TO",
                            type: "lov",
                            required: true,
                            lovonly: true,
                            inputMap: {
                                "login": {
                                    "key": "key.toUserId",
                                    "title": "User ID"
                                },
                                "userName": {
                                    "key": "key.userName",
                                    "title": "User Name"
                                }
                            },
                            outputMap: {
                                "login": "key.toUserId",
                                "userName": "key.userName"
                            },
                            searchHelper: formHelper,
                            search: function (inputModel, form, model) {
                                return User.query({
                                    branchName: branchName,
                                    login: inputModel.login,
                                    userName: inputModel.userName
                                }).$promise;
                            },
                            getListDisplayItem: function (item, index) {
                                return [item.login, item.userName]

                            }
                        },
                        {
                            key: "key.reason",
                            title: "REASON",
                            type: "select",
                            required: true,
                            enumCode: "reason",
                        },
                        {
                            title: "Specify Reason",
                            key: "key.OtherReason",
                            condition: "model.key.reason=='Others'"
                        },
                        {
                            key: "key.date",
                            title: "TRANSFERING_DATE",
                            type: "date",
                            required: true
                        },
                        {
                            key: "key.amount",
                            title: "CASH_BALANCE",
                            type: "amount"
                        },
                        {
                            key: "key.isEODstatus",
                            title: "IS_EOD_BALANCE",
                            type: "checkbox",
                            "schema": {
                                "default": false
                            }
                        }
                    ]
                },
                {

                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Submit"
                    }]

                }],
                schema: {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "type": "object",
                    "properties": {
                        "key": {
                            "type": "object",
                            "properties": {
                                "key1Custodian": {
                                    "type": ["string", "null"],
                                },
                                "key2Custodian": {
                                    "type": ["string", "null"],
                                },
                                "toUserId": {
                                    "title": "TRANSFERING_KEY_TO",
                                    "type": ["string", "null"]
                                },
                                "reason": {
                                    "title": "REASON",
                                    "type": ["string", "null"],
                                    "enumCode": "reason",
                                    "x-schema-form": {
                                        "type": "select",
                                        "screenFilter": true
                                    }
                                },
                                "date": {
                                    "type": ["string", "null"],
                                    "title": "TRANSFERING_DATE",
                                    "format": "date",
                                },
                                "amount": {
                                    "type": ["integer", "null"],
                                    "title": "CASH_BALANCE",
                                },
                                "login": {
                                    "type": "string"
                                },
                                "userName": {
                                    "type": "string"
                                }

                            }
                        }
                    }
                },
                actions: {
                    submit: function (model, form, formName) {
                        PageHelper.showLoader();
                        PageHelper.clearErrors();
                        PageHelper.showProgress('keyTransferSubmitRequest', 'Processing');
                        if (model.key.reason == "Others") {
                            model.key.reason = model.key.OtherReason;
                        }
                        var tempModelData = _.clone(model.key);
                        var deferred = {};
                        deferred = BranchKeyResource.transferKeyCreation(tempModelData).$promise;
                        deferred.then(function (data) {
                            PageHelper.hideLoader();
                            PageHelper.showProgress('keyTransferSubmitRequest', 'Done', 5000);
                            model.key = {};
                            form.$setPristine();
                            // $state.go('management.TransferKey', null);
                        }, function (data) {
                            PageHelper.hideLoader();
                            PageHelper.showProgress('keyTransferSubmitRequest', 'Oops some error happend', 5000);
                            PageHelper.showErrors(data);
                        });
                    }
                }
            };
        }
})
