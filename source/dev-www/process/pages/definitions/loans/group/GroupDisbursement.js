define({
    pageUID: "loans.group.GroupDisbursement",
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
            "title": "GROUP_LOAN_DISBURSEMENT",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                if ($stateParams.pageId) {
                    var groupInfo = $stateParams.pageId.split('.');
                    var partnerCode = groupInfo[0];
                    var groupCode = groupInfo[1];
                    $log.info("Group Code ::" + groupCode + "\nPartner Code::" + partnerCode);
                    PageHelper.showLoader();
                    irfProgressMessage.pop('group-disbursement', 'Loading Disbursement Details');
                    Groups.getDisbursementDetails({
                        partnerCode: partnerCode,
                        groupCode: groupCode
                    }, function(data) {
                        for (var i = 0; i < data.length; i++) {
                            var account = data[i];
                            var totalFeeAmount = 0;
                            if (account && account['fees']) {
                                for (var j = 0; j < account['fees'].length; j++) {
                                    var fee = parseFloat(account['fees'][j]['amount1']);
                                    totalFeeAmount = totalFeeAmount + fee;
                                }
                            }
                            var disburseAmount = parseFloat(account['amount']);
                            account['totalFeeAmount'] = AccountingUtils.formatMoney(totalFeeAmount);
                            account['finalDisbursementAmount'] = AccountingUtils.formatMoney(disburseAmount - totalFeeAmount);
                        }
                        model.disbursements = data;
                        irfProgressMessage.pop('group-disbursement', 'Loading Group Details');
                        Groups.search({
                                groupCode: groupCode,
                                partner: partnerCode
                            },
                            function(res) {
                                if (res.body.length > 0) {
                                    group = res.body[0];
                                    model.group = group;
                                }
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('group-disbursement', 'Done.', 2000);
                            },
                            function(res) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('group-disbursement', 'Error loading group details.', 2000);
                            }
                        )
                    }, function(resp) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('group-disbursement', 'Error loading disbursement details.', 2000);
                    });
                }
            },
            offline: false,
            form: [{
                    "type": "box",
                    "title": "ACCOUNTS",
                    "items": [{
                        "type": "fieldset",
                        "title": "ACCOUNTS",
                        "items": [{
                            key: "disbursements",
                            type: "array",
                            titleExpr: "'URN: ' + model.disbursements[arrayIndex].urnNo",
                            remove: null,
                            add: null,
                            items: [{
                                condition: "model.disbursements[arrayIndex].disbursementDate!=null",
                                type: "text",
                                title: "DISBURSED_AT",
                                key: "disbursements[].disbursementDate"
                            }, {
                                type: "fieldset",
                                title: "DISBURSEMENT_DETAILS",
                                condition: "model.disbursements[arrayIndex].disbursementDate==null",
                                items: [{
                                    "key": "disbursements[].accountId",
                                    "readonly": true
                                }, {
                                    "key": "disbursements[].amount",
                                    "readonly": true
                                }, {
                                    "type": "fieldset",
                                    "title": "FEES",
                                    "items": [{
                                        "key": "disbursements[].fees",
                                        "type": "array",
                                        "title": "FEE",
                                        "add": null,
                                        "remove": null,
                                        "items": [{
                                            key: "disbursements[].fees[].description",
                                            "readonly": true,
                                        }, {
                                            key: "disbursements[].fees[].amount1"
                                        }]
                                    }]
                                }, {
                                    "key": "disbursements[].totalFeeAmount",
                                    "readonly": true
                                }, {
                                    "key": "disbursements[].finalDisbursementAmount",
                                    "readonly": true
                                }, {
                                    "key": "disbursements[].modeOfDisbursement",
                                    "type": "select",
                                    "titleMap": [{
                                        value: "CASH",
                                        name: "Cash"
                                    }]
                                }, {
                                    type: "fieldset",
                                    title: "ACTIONS",
                                    items: [{
                                        "key": "disbursements[].validate_fp",
                                        "type": "button",
                                        "style": "btn-default",
                                        "notitle": true,
                                        "title": "VALIDATE_FINGERPRINT",
                                        "onClick": function(model, formCtrl, form, event) {
                                            $log.info(model);
                                            $log.info(form);
                                            $log.info(event);
                                            var ds = model.disbursements;
                                            var i = event['arrayIndex'];
                                            var d = ds[i];
                                            PageHelper.showLoader();

                                            Enrollment.getCustomerById({
                                                    id: d.customerId
                                                },
                                                function(res) {
                                                    if (res.leftHandThumpImageId) {
                                                        Files.stream({
                                                                fileId: res.leftHandThumpImageId
                                                            },
                                                            function(res) {
                                                                $log.info(res);
                                                                cordova.plugins.irfBluetooth.validate(
                                                                    function(data) {
                                                                        console.log(data);

                                                                    },
                                                                    function() {}, res.data);
                                                            },
                                                            function() {}).$promise.finally(
                                                            function() {
                                                                PageHelper.hideLoader();
                                                            })
                                                    } else {
                                                        PageHelper.showProgress('disbursement', "Fingerprint data not available", 2000);
                                                        PageHelper.hideLoader();
                                                    }

                                                },
                                                function() {
                                                    PageHelper.hideLoader();
                                                }
                                            ).$promise.finally(function() {

                                            })
                                        }
                                    }, {
                                        "key": "disbursements[].override_fp",
                                        title: "OVERRIDE_FINGERPRINT",
                                        "onChange": function(modelValue, form, model) {
                                            console.log(modelValue);
                                            console.log(form);
                                            console.log(model);
                                        }
                                    }, {
                                        "key": "disbursements[].disburse",
                                        "type": "button",
                                        "notitle": true,
                                        "style": "btn-primary btn-block",
                                        "title": "DISBURSE",
                                        "onClick": function(model, formCtrl, form, event) {
                                            $log.info("Inside disburse()");
                                            $log.info(model);
                                            $log.info(form);
                                            $log.info(event);
                                            PageHelper.clearErrors();
                                            var d = model.disbursements;
                                            var i = event['arrayIndex'];
                                            var accountId = d[i].accountId;
                                            if (!_.has(d[i], 'fp_verified') || d[i].fp_verified != true) {
                                                if (!_.has(d[i], 'override_fp') || d[i].override_fp != true) {
                                                    elementsUtils.alert('Fingerprint not verified.');
                                                    return;
                                                }
                                            }
                                            PageHelper.showLoader();
                                            PageHelper.showProgress('disbursement', 'Disbursing ' + accountId + '. Please wait.')
                                            LoanAccount.activateLoan({
                                                    "accountId": accountId
                                                },
                                                function(data) {
                                                    $log.info("Inside success of activateLoan");
                                                    var currDate = moment(new Date()).format("YYYY-MM-DD");
                                                    var toSendData = _.cloneDeep(d[i]);
                                                    toSendData.disbursementDate = currDate;
                                                    LoanAccount.disburse(toSendData,
                                                        function(data) {
                                                            PageHelper.showProgress('disbursement', 'Disbursement done', 2000);
                                                            d[i] = toSendData;
                                                        },
                                                        function(res) {
                                                            PageHelper.showErrors(res);
                                                            PageHelper.showProgress('disbursement', 'Disbursement failed', 2000);
                                                        }).$promise.finally(function() {
                                                        PageHelper.hideLoader();
                                                    });
                                                },
                                                function(res) {
                                                    PageHelper.hideLoader();
                                                    PageHelper.showErrors(res);
                                                    PageHelper.showProgress('disbursement', 'Error while activating loan.', 2000);
                                                })
                                        }
                                    }]
                                }]
                            }]
                        }]
                    }]
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "button",
                        "style": "btn-theme",
                        "title": "PROCEED",
                        "onClick": function(model, formCtrl, form) {
                            $log.info("inside proceed");
                            PageHelper.clearErrors();
                            PageHelper.showLoader();
                            PageHelper.showProgress("disbursement-proceed", "Proceeding..");
                            $log.info(model.group);
                            Groups.getGroup({
                                    groupId: model.group.id
                                },
                                function(res) {
                                    $log.info(res);
                                    var data = {
                                        "enrollmentAction": "PROCEED",
                                        "group": res
                                    }
                                    Groups.update({}, data,
                                        function(res) {
                                            PageHelper.showProgress("disbursement-proceed", "Done", 2000);
                                            PageHelper.hideLoader();
                                            $state.go('Page.GroupDashboard', {
                                                pageName: "GroupDashboard"
                                            });
                                        },
                                        function(res) {
                                            PageHelper.hideLoader();
                                            PageHelper.showProgress("disbursement-proceed", "Error", 2000);
                                            PageHelper.showErrors(res);
                                        }
                                    )
                                },
                                function(res) {
                                    PageHelper.hideLoader();
                                }
                            ).$promise.finally(function() {
                            })
                        }
                    }]
                }
            ],

            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "title": "Root",
                "properties": {
                    "disbursements": {
                        "type": "array",
                        "title": "ACCOUNTS",
                        "items": {
                            "type": "object",
                            "properties": {
                                "accountId": {
                                    "type": "string",
                                    "title": "ACCOUNT_NUMBER"
                                },
                                "amount": {
                                    "type": "string",
                                    "title": "DISBURSEMENT_AMOUNT"
                                },
                                "finalDisbursementAmount": {
                                    "type": "string",
                                    "title": "GROSS_DISBURSEMENT_AMOUNT"
                                },
                                "modeOfDisbursement": {
                                    "type": "string",
                                    "title": "MODE_OF_DISBURSEMENT"
                                },
                                "totalFeeAmount": {
                                    "type": "string",
                                    "title": "TOTAL_FEE_AMOUNT"
                                },
                                "validate_fp": {
                                    "type": "string",
                                    "title": "VALIDATE_FINGERPRINT"
                                },
                                "override_fp": {
                                    "type": "boolean",
                                    "title": "OVERRIDE_FINGERPRINT"
                                },
                                "fees": {
                                    "type": "array",
                                    "title": "FEE",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "description": {
                                                "type": "string",
                                                "title": "DESCRIPTION"
                                            },
                                            "amount1": {
                                                "type": "string",
                                                "title": "CASH"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },

            actions: {
                preSave: function(model, formCtrl) {
                    var deferred = $q.defer();
                    model._storedData = null;
                    deferred.resolve();
                    return deferred.promise;
                },
               
                submit: function(model, form, formName) {
                    model.enrollmentAction = 'PROCEED';
                    if (form.$invalid) {
                        irfProgressMessage.pop('cgt1-submit', 'Please fix your form', 5000);
                        return;
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('cgt1-submit', 'Working...');
                    PageHelper.clearErrors();
                    var reqData = {
                        "cgtDate": model.group.cgtDate1,
                        "cgtDoneBy": SessionStore.getLoginname() + '-' + model.group.cgt1DoneBy,
                        "groupCode": model.group.groupCode,
                        "latitude": model.group.cgt1Latitude,
                        "longitude": model.group.cgt1Longitude,
                        "partnerCode": model.group.partnerCode,
                        "photoId": model.group.cgt1Photo,
                        "productCode": model.group.productCode,
                        "remarks": model.group.cgt1Remarks
                    };
                    var promise = Groups.post({
                        service: 'process',
                        action: 'cgt'
                    }, reqData, function(res) {
                        console.debug(res);
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('cgt1-submit', 'CGT 1 Updated. Proceed to CGT 2', 5000);
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('cgt1-submit', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);
                    });
                }
            }
        }
    }
})