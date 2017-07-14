define({
    pageUID: "loans.group.GroupApplication",
    pageType: "Engine",
    dependencies: ["$log", "$state", "LoanProcess", "irfSimpleModal", "Groups", "GroupProcess", "Enrollment", "CreditBureau", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, $state, LoanProcess, irfSimpleModal, Groups, GroupProcess, Enrollment, CreditBureau, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {


        var nDays = 15;

        function showDscData(dscId) {
            PageHelper.showLoader();
            Groups.getDSCData({
                dscId: dscId
            }, function(resp, headers) {
                PageHelper.hideLoader();
                var dataHtml = "<table class='table table-striped table-bordered table-responsive'>";
                dataHtml += "<tr><td>Response : </td><td>" + resp.response + "</td></tr>";
                dataHtml += "<tr><td>Response Message: </td><td>" + resp.responseMessage + "</td></tr>";
                dataHtml += "<tr><td>Stop Response: </td><td>" + resp.stopResponse + "</td></tr>";
                dataHtml += "</table>"
                irfSimpleModal('DSC Check Details', dataHtml);
            }, function(res) {
                PageHelper.showErrors(res);
                PageHelper.hideLoader();
            });
        };

        // var validateForm = function(formCtrl){
        //     formCtrl.scope.$broadcast('schemaFormValidate');
        //     if (formCtrl && formCtrl.$invalid) {
        //         PageHelper.showProgress("Checker","Your form have errors. Please fix them.", 5000);
        //         return false;
        //     }
        //     return true;
        // }

        var checkGroupLoanActivated = function(model) {
            var deferred = $q.defer();
            try {
                model._isGroupLoanAccountActivated = false;
                LoanProcess.disbursementList({
                    partnerCode: model.group.partnerCode,
                    groupCode: model.group.groupCode
                }, function(resp, headers) {
                    $log.info(resp.body.disbursementDTOs);
                    try {
                        if (resp.body.disbursementDTOs.length > 0) {
                            model._loanAccountId = resp.body.disbursementDTOs[0].accountId;
                            model._isGroupLoanAccountActivated = true;
                            deferred.resolve(true);
                        }
                    } catch (err) {}
                    deferred.resolve(false);
                }, function(resp) {
                    deferred.resolve(false);
                });
            } catch (err) {
                deferred.resolve(false);
            }
            return deferred.promise;
        };

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

        var saveData = function(reqData) {
            PageHelper.showLoader();
            irfProgressMessage.pop('group-save', 'Working...');
            var deferred = $q.defer();
            if (reqData.group.id) {
                deferred.reject(true);
                $log.info("Group id not null, skipping save");
            } else {
                reqData.enrollmentAction = 'SAVE';
                reqData.group.groupFormationDate = Utils.getCurrentDate();
                PageHelper.clearErrors();
                Utils.removeNulls(reqData, true);
                Groups.post(reqData, function(res) {
                    irfProgressMessage.pop('group-save', 'Done.', 5000);
                    deferred.resolve(res);
                }, function(res) {
                    PageHelper.hideLoader();
                    PageHelper.showErrors(res);
                    irfProgressMessage.pop('group-save', 'Oops. Some error.', 2000);
                    deferred.reject(false);
                });
            }
            return deferred.promise;
        };

        var proceedData = function(res) {
            var deferred = $q.defer();
            if (res.group.id === undefined || res.group.id === null) {
                $log.info("Group id null, cannot proceed");
                deferred.reject(null);
            } else {
                PageHelper.showLoader();
                irfProgressMessage.pop('group-save', 'Working...');
                res.enrollmentAction = "PROCEED";
                Utils.removeNulls(res, true);
                Groups.update(res, function(res, headers) {
                    $log.info(res);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('group-save', 'Done. Group ID: ' + res.group.id, 5000);
                    deferred.resolve(res);
                }, function(res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('group-save', 'Oops. Some error.', 2000);
                    PageHelper.showErrors(res);
                    deferred.reject(null);
                });
            }
            return deferred.promise;
        };

        return {
            "type": "schema-form",
            "title": "APPLICATION_PENDING",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.group = model.group || {};
                model.group.branchName = SessionStore.getCurrentBranch().branchId;
                $log.info(model.group.branchName);
                if ($stateParams.pageId) {
                    var groupId = $stateParams.pageId;
                    PageHelper.showLoader();
                    irfProgressMessage.pop("group-init", "Loading, Please Wait...");
                    GroupProcess.getGroup({
                        groupId: groupId
                    }, function(response, headersGetter) {
                        model.group = _.cloneDeep(response);
                        var centreCode = formHelper.enum('centre').data;
                        for (var i = 0; i < centreCode.length; i++) {
                            if (centreCode[i].code == model.group.centreCode) {
                                model.group.centreCode = centreCode[i].value;
                            }
                        }
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
            },
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return [
                    item.journal.transactionName
                ]
            },

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
                    "enumCode": "centre"
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
                "title": "GROUP_MEMBERS",
                "items": [{
                    "key": "group.jlgGroupMembers",
                    "type": "array",
                    "title": "GROUP_MEMBERS",
                    "add": null,
                    "remove": null,
                    "items": [{
                        "key": "group.jlgGroupMembers[].urnNo",
                        "readonly": true,
                        "title": "URN_NO",
                    }, {
                        "key": "group.jlgGroupMembers[].firstName",
                        "readonly": true,
                        "type": "string",
                        "title": "GROUP_MEMBER_NAME"
                    }, {
                        "key": "group.jlgGroupMembers[].husbandOrFatherFirstName",
                        "readonly": true,
                        "title": "FATHER_NAME"
                    }, {
                        "key": "group.jlgGroupMembers[].relation",
                        "readonly": true,
                        "title": "RELATION",
                    }, {
                        "key": "group.jlgGroupMembers[].loanAmount",
                        "readonly": true,
                        "title": "LOAN_AMOUNT",
                        "type": "amount",

                    }, {
                        "key": "group.jlgGroupMembers[].loanPurpose1",
                        "readonly": true,
                        "title": "LOAN_PURPOSE_1",
                        "enumCode": "loan_purpose_1",
                        "type": "select",
                    }, {
                        "key": "group.jlgGroupMembers[].loanPurpose2",
                        "readonly": true,
                        "type": "string",
                        "title": "LOAN_PURPOSE_2",

                    }, {
                        "key": "group.jlgGroupMembers[].loanPurpose3",
                        "readonly": true,
                        "type": "string",
                        "title": "LOAN_PURPOSE3",
                    }, {
                        "key": "group.jlgGroupMembers[].witnessFirstName",
                        "readonly": true,
                        "title": "WitnessLastName",

                    }, {
                        "key": "group.jlgGroupMembers[].witnessRelationship",
                        "readonly": true,
                        "title": "RELATION",
                        "type": "select",
                        "enumCode": "relation"
                    }, {

                        "key": "group.jlgGroupMembers[].loanAccount.applicationFileId",
                        required: true,
                        "title": "APPLICATION_UPLOAD",
                        "category": "Group",
                        "subCategory": "APPLICATION",
                        "type": "file",
                        "fileType": "application/pdf",
                    }]
                }]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "button",
                    "icon": "fa fa-download",
                    "title": "DOWNLOAD_APPLICATION",
                    "onClick": "actions.downloadApplication(model,form)",
                }, {
                    "type": "button",
                    "icon": "fa fa-arrow-right",
                    "title": "PROCEED",
                    "onClick": "actions.proceedAction(model,form,formCtrl)"
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
                                "type": ["integer", "null"]
                            }
                        }
                    }
                }
            },

            actions: {
                preSave: function(model, form, formName) {},
                downloadApplication: function(model, form) {
                    PageHelper.showLoader();
                    checkGroupLoanActivated(model).then(function(isActivated) {
                        PageHelper.hideLoader();
                        if (isActivated) {
                            try {
                                var url = irf.FORM_DOWNLOAD_URL + '?form_name=app_loan&record_id=' + model._loanAccountId;
                                try {
                                    cordova.InAppBrowser.open(url, '_system', 'location=yes');
                                } catch (err) {
                                    window.open(url, '_blank', 'location=yes');
                                }
                            } catch (err) {
                                irfProgressMessage.pop('ap-download', 'An Error Occur during download. Please Try Again', 2000);
                            }
                        } else {
                            irfProgressMessage.pop('ap-download', 'An Error Occur during download. Please Try Again', 2000);
                        }
                    }, function(res) {
                        PageHelper.hideLoader();
                    });
                },
                proceedAction: function(model, form, formCtrl) {
                    formHelper.validate(formCtrl).then(function() {
                        PageHelper.showLoader();
                        irfProgressMessage.pop('Application-proceed', 'Working...');
                        PageHelper.clearErrors();
                        model.groupAction = "PROCEED";
                        var reqData = _.cloneDeep(model);
                        GroupProcess.updateGroup(reqData, function(res) {
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('Application-proceed', 'Operation Succeeded. Proceeded to Disbursement.', 5000);
                            $state.go('Page.GroupDashboard', null);
                        }, function(res) {
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('Application-proceed', 'Oops. Some error.', 2000);
                            PageHelper.showErrors(res);
                        });
                    });
                    // if(!validateForm(form)) 
                    //     return;

                },
            }
        }
    }
})