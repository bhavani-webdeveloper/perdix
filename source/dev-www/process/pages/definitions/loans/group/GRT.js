define({
    pageUID: "loans.group.GRT",
    pageType: "Engine",
    dependencies: ["$log", "$state", "irfSimpleModal", "Groups", "Enrollment", "CreditBureau",
        "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, $state, irfSimpleModal, Groups, Enrollment, CreditBureau,
        Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

        return {
            "type": "schema-form",
            "title": "GRT",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info(model);
                if ($stateParams.pageId) {
                    var groupId = $stateParams.pageId;
                    PageHelper.showLoader();
                    irfProgressMessage.pop("cgt1-init", "Loading, Please Wait...");
                    Groups.getGroup({
                        groupId: groupId
                    }, function(response, headersGetter) {
                        model.group = _.cloneDeep(response);
                        model.group.grtDate = model.group.grtDate || Utils.getCurrentDate();
                        for (var i = 1; i < 18; i++) {
                            model.group["udf" + i] = model.group["udf" + i] || false;
                        }
                        model.group.udfDate1 = model.group.udfDate1 || "";
                        model.group.grtDoneBy = SessionStore.getUsername();
                        PageHelper.hideLoader();
                    }, function(resp) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("group-init", "Oops. An error occurred", 2000);
                        //backToDashboard();
                    });
                } else {
                    irfNavigator.goBack();
                }
            },
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return [
                    "Group ID : " + item.group.id,
                    "Group Code : " + item.group.groupCode,
                    "GRT Date : " + item.group.grtDate
                ]
            },

            form: [{
                "type": "box",
                "title": "GRT",
                "items": [{
                    "key": "group.grtDoneBy",
                    "readonly": true
                }, {
                    "key": "group.grtDate",
                    "type": "text",
                    "readonly": true
                }, {
                    "key": "group.grtLatitude",
                    "title": "GRT_LOCATION",
                    "type": "geotag",
                    "latitude": "group.grtLatitude",
                    "longitude": "group.grtLongitude"
                }, {
                    "key": "group.grtPhoto",
                    "type": "file",
                    "fileType": "image/*",
                    "offline": true
                }, {
                    "key": "group.grtRemarks",
                    "type": "textarea"
                }, {
                    "key": "group.udfDate1",
                    "type": "date"
                }, {
                    "key": "group.udf1"
                }, {
                    "key": "group.udf2"
                }, {
                    "key": "group.udf3"
                }, {
                    "key": "group.udf4"
                }, {
                    "key": "group.udf5"
                }, {
                    "key": "group.udf6"
                }]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                }, {
                    "type": "submit",
                    "style": "btn-primary",
                    "title": "SUBMIT_GRT"
                }]
            }],

            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "group": {
                        "type": "object",
                        "required": [],
                        "properties": {
                            "status": {
                                "title": "STATUS",
                                "type": "string"
                            },
                            "branchName": {
                                "title": "BRANCH_NAME",
                                "type": "integer"
                            },
                            "centreCode": {
                                "title": "CENTRE_CODE",
                                "type": "integer"
                            }
                        }
                    }
                }
            },

            actions: {
                preSave: function(model, form, formName) {},
                submit: function(model, form, formName) {
                    model.enrollmentAction = 'PROCEED';
                    if (form.$invalid) {
                        irfProgressMessage.pop('grt-submit', 'Please fix your form', 5000);
                        return;
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('grt-submit', 'Working...');
                    PageHelper.clearErrors();
                    var reqData = {
                        "grtDate": model.group.grtDate,
                        "grtDoneBy": model.group.grtDoneBy,
                        "groupCode": model.group.groupCode,
                        "latitude": model.group.grtLatitude,
                        "longitude": model.group.grtLongitude,
                        "partnerCode": model.group.partnerCode,
                        "photoId": model.group.grtPhoto,
                        "productCode": model.group.productCode,
                        "remarks": model.group.grtRemarks,
                        "udfDate1": model.group.udfDate1,
                        "udf1": model.group.udf1,
                        "udf2": model.group.udf2,
                        "udf3": model.group.udf3,
                        "udf4": model.group.udf4,
                        "udf5": model.group.udf5,
                        "udf6": model.group.udf6,
                    };
                    var promise = Groups.post({
                        service: 'process',
                        action: 'grt'
                    }, reqData, function(res) {
                        irfProgressMessage.pop('grt-submit', 'GRT Updated, activating loan account');
                        LoanProcess.get({
                            action: 'groupLoans',
                            groupCode: model.group.groupCode,
                            partner: model.group.partnerCode
                        }, function(resp, header) {
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('grt-submit', 'GRT Updated, Loan Account Activated. Proceed to Applications Pending screen.', 5000);
                            $state.go('Page.GroupDashboard', {
                                pageName: "GroupDashboard"
                            });
                        }, function(res) {
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('grt-submit', 'An error occurred while activating loan account. Please Try from Applications Pending Screen', 2000);
                            var data = res.data;
                            var errors = [];
                            if (data.errors) {
                                _.forOwn(data.errors, function(keyErrors, key) {
                                    var keyErrorsLength = keyErrors.length;
                                    for (var i = 0; i < keyErrorsLength; i++) {
                                        var error = {
                                            "message": "<strong>" + key + "</strong>: " + keyErrors[i]
                                        };
                                        errors.push(error);
                                    }
                                })
                                PageHelper.setErrors(errors);
                            }
                            $state.go('Page.GroupDashboard', {
                                pageName: "GroupDashboard"
                            });
                        });
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('grt-submit', 'Oops. Some error.');
                        PageHelper.showErrors(res);
                    });
                }
            }
        }
    }
})