define({
    pageUID: "loans.group.GroupDisbursement",
    pageType: "Engine",
    dependencies: ["$log", "irfSimpleModal", "Groups","GroupProcess", "AccountingUtils", "LoanProcess", "Enrollment", "CreditBureau",
        "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, irfSimpleModal, Groups,GroupProcess, AccountingUtils, LoanProcess, Enrollment, CreditBureau,
        Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

        var nDays = 15;
        var fixData = function(model) {
            model.group.tenure = parseInt(model.group.tenure);
        };

        var fillNames = function(model) {
            var deferred = $q.defer();
            angular.forEach(model.group.jlgGroupMembers, function(member, key) {
                Enrollment.get({
                    id: member.customerId
                }, function(resp, headers) {
                    model.group.jlgGroupMembers[key].firstName = resp.firstName;
                    try {
                        if (resp.middleName.length > 0)
                            model.group.jlgGroupMembers[key].firstName += " " + resp.middleName;
                        if (resp.lastName.length > 0)
                            model.group.jlgGroupMembers[key].firstName += " " + resp.lastName;
                    } catch (err) {

                    }
                    if (key >= model.group.jlgGroupMembers.length - 1) {
                        deferred.resolve(model);
                    }
                }, function(res) {
                    deferred.reject(res);
                });
            });
            return deferred.promise;
        };


        return {
            "type": "schema-form",
            "title": "GROUP_LOAN_DISBURSEMENT",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.group = model.group || {};
                var centres = SessionStore.getCentres();
                model.group.branchId = model.group.branchId || SessionStore.getCurrentBranch().branchId;
                model.group.centreId = model.group.centreId || ((_.isArray(centres) && centres.length > 0) ? centres[0].value : model.group.centreId);

                if ($stateParams.pageId) {
                    var groupId = $stateParams.pageId;
                    PageHelper.showLoader();
                    irfProgressMessage.pop("group-init", "Loading, Please Wait...");
                    GroupProcess.getGroup({
                        groupId: groupId
                    }, function(response, headersGetter) {
                        model.group = _.cloneDeep(response);
                        fixData(model);
                        if (model.group.jlgGroupMembers.length > 0) {
                            fillNames(model).then(function(m) {
                                model = m;
                                PageHelper.hideLoader();
                            }, function(m) {
                                PageHelper.showErrors(m);
                                PageHelper.hideLoader();
                                irfProgressMessage.pop("group-init", "Oops. An error occurred", 2000);
                            });
                        } else {
                            PageHelper.hideLoader();
                            irfProgressMessage.pop("group-init", "Load Complete. No Group Members Found", 2000);
                            backToDashboard();
                        }
                    }, function(resp) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("group-init", "Oops. An error occurred", 2000);
                        backToDashboard();
                    });
                }


                /*if ($stateParams.pageId) {
                    var groupInfo = $stateParams.pageId.split('.');
                    var partnerCode = groupInfo[0];
                    var groupCode = groupInfo[1];
                    $log.info("Group Code ::" + groupCode + "\nPartner Code::" + partnerCode);
                    PageHelper.showLoader();
                    irfProgressMessage.pop('group-disbursement', 'Loading Disbursement Details');
                    LoanProcess.disbursementList({
                        partnerCode: partnerCode,
                        groupCode: groupCode
                    }, function(data) {
                        var disbursementDTOs = [];
                        disbursementDTOs = data.body.disbursementDTOs;
                        $log.info(disbursementDTOs);
                        for (var i = 0; i < disbursementDTOs.length; i++) {
                            var account = disbursementDTOs[i];
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
                        model.disbursements = disbursementDTOs[i];
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
                }*/
            },
            offline: false,
            form: [{
                    "type": "box",
                    "readonly": true,
                    "title": "GROUP_DETAILS",
                    "items": [{
                        "key": "group.groupName",
                        "title": "GROUP_NAME",
                    }, {
                        "key": "group.partnerCode",
                        "title": "PARTNER",
                        "type": "select",
                        "enumCode": "partner"
                    }, {
                        "key": "group.centreCode",
                        "title": "CENTRE_CODE",
                        "type": "select",
                        "enumCode": "centre_code",
                        "parentEnumCode": "branch_id",
                        "parentValueExpr": "model.group.branchId",
                    }, {
                        "key": "group.productCode",
                        "title": "PRODUCT",
                        "type": "select",
                        "enumCode": "loan_product",
                        "parentEnumCode": "partner",
                        "parentValueExpr": "model.group.partnerCode"
                    }, {
                        "key": "group.frequency",
                        "title": "FREQUENCY",
                        "type": "select",
                        "titleMap": {
                            "M": "Monthly",
                            "Q": "Quarterly"
                        }
                    }, {
                        "key": "group.tenure",
                        "title": "TENURE",
                    }]
                }, {
                    "type": "box",
                    "readonly": true,
                    "title": "GROUP_MEMBERS",
                    "items": [{
                        "key": "group.jlgGroupMembers",
                        "type": "array",
                        "title": "GROUP_MEMBERS",
                        "add": null,
                        "remove": null,
                        "items": [{
                            "key": "group.jlgGroupMembers[].urnNo",
                            "title": "URN_NO",
                        }, {
                            "key": "group.jlgGroupMembers[].firstName",
                            "type": "string",
                            "title": "GROUP_MEMBER_NAME"
                        }, {
                            "key": "group.jlgGroupMembers[].husbandOrFatherFirstName",
                            "title": "FATHER_NAME"
                        }, {
                            "key": "group.jlgGroupMembers[].relation",
                            "title": "RELATION",
                        }, {
                            "key": "group.jlgGroupMembers[].loanAmount",
                            "title": "LOAN_AMOUNT",
                            "type": "amount",
                        }, {
                            "key": "group.jlgGroupMembers[].loanPurpose1",
                            "title": "LOAN_PURPOSE_1",
                            "enumCode": "loan_purpose_1",
                            "type": "select",
                        }, {
                            "key": "group.jlgGroupMembers[].loanPurpose2",
                            "type": "string",
                            "title": "LOAN_PURPOSE_2",
                        }, {
                            "key": "group.jlgGroupMembers[].loanPurpose3",
                            "type": "string",
                            "title": "LOAN_PURPOSE3",
                        }, {
                            "key": "group.jlgGroupMembers[].witnessFirstName",
                            "title": "WitnessLastName",
                        }, {
                            "key": "group.jlgGroupMembers[].witnessRelationship",
                            "title": "RELATION",
                            "type": "select",
                            "enumCode": "relation"
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
                            PageHelper.showLoader();
                            irfProgressMessage.pop('Disbursement-proceed', 'Working...');
                            PageHelper.clearErrors();
                            model.groupAction = "PROCEED";
                            for(i=0;i<model.group.jlgGroupMembers.length;i++)
                            {
                               model.group.jlgGroupMembers[i].modeOfDisbursement='CASH';
                            }
                            var reqData = _.cloneDeep(model);

                            GroupProcess.updateGroup(reqData, function(res) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('Disbursement-proceed', 'Operation Succeeded.  Disbursement Complete.', 5000);
                                irfNavigator.goBack();
                            }, function(res) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('Disbursement-proceed', 'Oops. Some error.', 2000);
                                PageHelper.showErrors(res);
                            });
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