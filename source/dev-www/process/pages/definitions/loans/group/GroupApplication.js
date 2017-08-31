define({
    pageUID: "loans.group.GroupApplication",
    pageType: "Engine",
    dependencies: ["$log", "LoanProcess", "irfSimpleModal", "Groups", "GroupProcess", "Enrollment", "CreditBureau", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, LoanProcess, irfSimpleModal, Groups, GroupProcess, Enrollment, CreditBureau, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
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

        var validateForm = function(formCtrl){
            formCtrl.scope.$broadcast('schemaFormValidate');
            if (formCtrl && formCtrl.$invalid) {
                PageHelper.showProgress("Application","Your form have errors. Please fix them.", 5000);
                return false;
            }
            return true;
        }

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
                    if (model.group.jlgGroupMembers[key].loanAccount) {
                        if (model.group.jlgGroupMembers[key].loanAccount.closed == true) {
                            model.group.jlgGroupMembers[key].closed1 = "Inactive";
                        } else {
                            model.group.jlgGroupMembers[key].closed1 = "Active";
                        }
                        model.group.jlgGroupMembers[key].loanAccount.applicationStatus="OPEN";
                        if(model.group.jlgGroupMembers[key].loanAccount.bcAccount){
                            model.group.jlgGroupMembers[key].loanAccount.bcAccount.agreementStatus="OPEN";
                        }   
                    }

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
                var centres = SessionStore.getCentres();
                model.review = model.review || {};
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
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
                        model.group.groupRemarks = null;
                        fixData(model);
                        if (model.group.jlgGroupMembers.length > 0) {
                            fillNames(model).then(function(m) {
                                model = m;
                                Queries.getGroupLoanRemarksHistoryById(model.group.id).then(function(resp){
                                    for (i = 0; i < resp.length; i++) {
                                        $log.info("hi");
                                        resp[i].updatedOn = moment(resp[i].updatedOn).format("DD-MM-YYYY");
                                        $log.info(resp[i].updatedOn);
                                    }
                                    model.group.remarksHistory = resp;
                                }).finally(function(){
                                    PageHelper.hideLoader();
                                });
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
                    "title": "GROUP_DETAILS",
                    "items": [{
                        "key": "group.groupName",
                        "title": "GROUP_NAME",
                        "readonly": true,
                    }, {
                        "key": "group.branchId",
                        "title": "BRANCH_NAME",
                        "enumCode": "branch_id",
                        "type":"select",
                        readonly: true,
                        "parentEnumCode": "bank",
                        "parentValueExpr": "model.group.bankId",
                    }, {
                        "key": "group.centreCode",
                        "title": "CENTRE_CODE",
                        "type": "select",
                        "readonly": true,
                        "enumCode": "centre_code",
                        "parentEnumCode": "branch_id",
                        "parentValueExpr": "model.group.branchId",
                    }, {
                        "key": "group.partnerCode",
                        "title": "PARTNER",
                        "readonly": true,
                        "type": "select",
                        "enumCode": "partner"
                    }, {
                        "key": "group.productCode",
                        "title": "PRODUCT",
                        "type": "select",
                        "readonly": true,
                        "enumCode": "loan_product",
                        "parentEnumCode": "partner",
                        "parentValueExpr": "model.group.partnerCode"
                    }, {
                        "key": "group.frequency",
                        "title": "FREQUENCY",
                        "type": "select",
                        "readonly": true,
                        "titleMap": {
                            "M": "Monthly",
                            "Q": "Quarterly"
                        }
                    }, {
                        "key": "group.tenure",
                        "title": "TENURE",
                        "readonly": true,
                    }, {
                        "key": "group.scheduledDisbursementDate",
                        "required":true,
                        "title": "SCHEDULED_DISBURSEMENT_DATE",
                        "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                        "type": "date",
                    }, {
                        "key": "group.firstRepaymentDate",
                        "title": "FIRST_REPAYMENT_DATE",
                        "required":true,
                        "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                        "type": "date",
                    }]
                }, {
                    "type": "box",
                    "title": "GROUP_MEMBERS",
                    "items": [{
                        "key": "group.jlgGroupMembers",
                        "type": "array",
                        "condition": "model.siteCode == 'KGFS'",
                        "title": "GROUP_MEMBERS",
                        "titleExpr":"model.group.jlgGroupMembers[arrayIndex].urnNo + ' : ' + model.group.jlgGroupMembers[arrayIndex].firstName",
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
                            "title": "HUSBAND_OR_FATHER_NAME"
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
                        },{
                            "title": "LOAN_ACCOUNT_NUMBER",
                            "readonly": true,
                            "key": "group.jlgGroupMembers[].loanAccount.accountNumber", 
                            "type": "string"
                        },{
                            "title": "ACCOUNT_NUMBER",
                            "condition":"model.group.partnerCode=='AXIS'",
                            "readonly": true,
                            "key": "group.jlgGroupMembers[].loanAccount.bcAccount.bcAccountNo", 
                            "type": "string"
                        },{
                            "title": "TENURE",
                            "readonly": true,
                            "key": "group.jlgGroupMembers[].loanAccount.tenure"
                        },{
                            "title": "LOAN_APPLICATION_DATE",
                            "readonly": true,
                            "key": "group.jlgGroupMembers[].loanAccount.loanApplicationDate",
                            "type": "date"
                        }, {
                            "title": "LOAN_STATUS",
                            "readonly": true,
                            "key": "group.jlgGroupMembers[].closed1",
                        },{
                            "key": "group.jlgGroupMembers[].loanAccount.applicationFileId",
                            required: true,
                            "title": "APPLICATION_UPLOAD",
                            "category": "Group",
                            "subCategory": "APPLICATION",
                            "type": "file",
                            "fileType": "application/pdf",  
                        }, 
                        {
                            "type": "button",
                            "key": "group.jlgGroupMembers[]",
                            "title": "DOWNLOAD_APPLICATION_FORM",
                            "onClick": function(model, form, schemaForm, event) {
                                    Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=app_Loan&record_id=" + model.group.jlgGroupMembers[event.arrayIndex].loanAccount.id);
                            }
                        }, {
                            "type": "button",
                            "key": "group.jlgGroupMembers[]",
                            condition: "model.group.partnerCode === 'AXIS'",
                            "title": "DOWNLOAD_AGREEMENT_FORM",
                            "onClick": function(model, form, schemaForm, event) {
                                Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=agmt_loan&record_id=" + model.group.jlgGroupMembers[event.arrayIndex].loanAccount.id);
                            }
                        }]
                    }, {
                        "key": "group.jlgGroupMembers",
                        "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                        "type": "array",
                        "titleExpr":"model.group.jlgGroupMembers[arrayIndex].urnNo + ' : ' + model.group.jlgGroupMembers[arrayIndex].firstName",
                        "title": "GROUP_MEMBERS",
                        "add": null,
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
                            "title": "HUSBAND_OR_FATHER_NAME"
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
                            "title": "LOAN_ACCOUNT_NUMBER",
                            "readonly": true,
                            "key": "group.jlgGroupMembers[].loanAccount.accountNumber", 
                            "type": "string"
                        }, {
                            "title": "ACCOUNT_NUMBER",
                            "condition":"model.group.partnerCode=='AXIS'",
                            "readonly": true,
                            "key": "group.jlgGroupMembers[].loanAccount.bcAccount.bcAccountNo", 
                            "type": "string"
                        }, {
                            "title": "TENURE",
                            "readonly": true,
                            "key": "group.jlgGroupMembers[].loanAccount.tenure"
                        }, {
                            "title": "LOAN_APPLICATION_DATE",
                            "readonly": true,
                            "key": "group.jlgGroupMembers[].loanAccount.loanApplicationDate",
                            "type": "date"
                        }, {
                            "title": "LOAN_STATUS",
                            "readonly": true,
                            "key": "group.jlgGroupMembers[].closed1",
                        }, {
                            
                            "key": "group.jlgGroupMembers[].loanAccount.applicationFileId",
                            "title": "APPLICATION_UPLOAD",
                            "category": "Group",
                            "subCategory": "APPLICATION",
                            "type": "file",
                            "fileType": "application/pdf", 
                        }, {
                            "type": "button",
                            "key": "group.jlgGroupMembers[]",
                            "title": "DOWNLOAD_APPLICATION_FORM",
                            "onClick": function(model, form, schemaForm, event) {
                                    Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=app_Loan&record_id=" + model.group.jlgGroupMembers[event.arrayIndex].loanAccount.id);
                            }
                        }, {
                            "type": "button",
                            "key": "group.jlgGroupMembers[]",
                            condition: "model.group.partnerCode === 'AXIS'",
                            "title": "DOWNLOAD_AGREEMENT_FORM",
                            "onClick": function(model, form, schemaForm, event) {
                                    Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=app_Loan&record_id=" + model.group.jlgGroupMembers[event.arrayIndex].loanAccount.id);
                            }
                        }]
                    }]
                },
                {
                    type: "box",
                    "readonly":true,
                    "condition":"model.group.checkerTransactionHistory.length",
                    title: "CHECKER_HISTORY",
                    items: [{
                        key: "group.checkerTransactionHistory",
                        "titleExpr":"model.group.checkerTransactionHistory[arrayIndex].typeOfApprover + ' : ' + model.group.checkerTransactionHistory[arrayIndex].status",
                        type: "array",
                        "add": null,
                        "remove": null,
                        title: "CHECKER_HISTORY",
                        items: [{
                            key: "group.checkerTransactionHistory[].remarks",
                            title: "CHECKER_REMARKS",
                        }, {
                            key: "group.checkerTransactionHistory[].status",
                            title: "STATUS",
                        }, {
                            key: "group.checkerTransactionHistory[].typeOfApprover",
                            title: "APPROVER_TYPE",
                        },{
                           key: "group.checkerTransactionHistory[].statusUpDatedBy",
                           title: "APPROVER",
                        },{
                           key: "group.checkerTransactionHistory[].statusUpDatedAt",
                           title: "APPROVED_AT",
                        }]
                    }]
                },
                {
                    "title": "REMARKS_HISTORY",
                    "type": "box",
                    condition: "model.group.remarksHistory && model.group.remarksHistory.length > 0",
                    "items": [{
                        "key": "group.remarksHistory",
                        "type": "array",
                        "view": "fixed",
                        add: null,
                        remove: null,
                        "items": [{
                            "type": "section",
                            "htmlClass": "",
                            "html": '<i class="fa fa-user text-gray">&nbsp;</i> {{model.group.remarksHistory[arrayIndex].updatedBy}}\
                            <br><i class="fa fa-clock-o text-gray">&nbsp;</i> {{model.group.remarksHistory[arrayIndex].updatedOn}}\
                            <br><i class="fa fa-commenting text-gray">&nbsp;</i> <strong>{{model.group.remarksHistory[arrayIndex].remarks}}</strong>\
                            <br><i class="fa fa-pencil-square-o text-gray">&nbsp;</i>{{model.group.remarksHistory[arrayIndex].stage}}-{{model.group.remarksHistory[arrayIndex].action}}<br>'
                        }]
                    }]
                },
                {
                    "type": "box",
                    "title": "POST_REVIEW",
                    "items": [
                        {
                            key: "action",
                            type: "radios",
                            titleMap: {
                                "PROCEED": "PROCEED",
                                "REJECT": "REJECT",
                                "SEND_BACK": "SEND_BACK",
                            },
                            onChange: function(modelValue, form, model, formCtrl, event) {
                                if(model.action == 'PROCEED') {
                                    return;
                                }
                                var stage1 = model.group.currentStage;
                                var targetstage = formHelper.enum('groupLoanBackStages').data;
                                var out = [];
                                for (var i = 0; i < targetstage.length; i++) {
                                    var t = targetstage[i];
                                    if (t.name == stage1 && 'default' == t.field2) {
                                        model.review.targetStage = t.field1;
                                        model.review.rejectStage = "Rejected";
                                        break;
                                    }
                                }
                            }
                        },
                        {
                            type: "section",
                            condition:"model.action",
                            items: [
                            {
                                title: "REMARKS",
                                key: "group.groupRemarks",
                                type: "textarea",
                                required: true
                            }, 
                            {
                                key: "review.targetStage",
                                required: true,
                                condition:"model.action == 'SEND_BACK'",
                                type: "lov",
                                autolov: true,
                                lovonly: true,
                                title: "SEND_BACK_TO_STAGE",
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function(inputModel, form, model, context) {
                                    var stage1 = model.group.currentStage;
                                    var targetstage = formHelper.enum('groupLoanBackStages').data;
                                    var out = [];
                                    for (var i = 0; i < targetstage.length; i++) {
                                        var t = targetstage[i];
                                        if (t.name == stage1 && 'reject' != t.field2) {
                                            out.push({
                                                name: t.field1,
                                            })
                                        }
                                    }
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": out.length
                                        },
                                        body: out
                                    });
                                },
                                onSelect: function(valueObj, model, context) {
                                    model.review.targetStage = valueObj.name;
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.name
                                    ];
                                }
                            }, {
                                key: "review.sendBackButton",
                                condition:"model.action == 'SEND_BACK'",
                                type: "button",
                                title: "SEND_BACK",
                                onClick: "actions.sendBack(model, formCtrl, form, $event)"
                            }, {
                                key: "review.rejectStage",
                                condition:"model.action == 'REJECT'",
                                type: "lov",
                                autolov: true,
                                lovonly: true,
                                title: "SEND_BACK_TO_STAGE",
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function(inputModel, form, model, context) {
                                    var out = [{name: "Rejected"}];
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": out.length
                                        },
                                        body: out
                                    });
                                },
                                onSelect: function(valueObj, model, context) {
                                    model.review.rejectStage = valueObj.name;
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.name
                                    ];
                                }
                            }, {
                                key: "review.reject",
                                condition:"model.action == 'REJECT'",
                                type: "button",
                                title: "REJECT",
                                onClick: "actions.reject(model, formCtrl, form, $event)"
                            }, {
                                "type": "button",
                                "icon": "fa fa-arrow-right",
                                condition:"model.action == 'PROCEED'",
                                "title": "PROCEED",
                                "onClick": "actions.proceedAction(model, formCtrl, form)"
                            }]
                        }
                    ]
                }
            ],

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
                            "centreId": {
                                "title": "CENTRE_CODE",
                                "type": ["integer", "null"]
                            }
                        }
                    }
                }
            },

            actions: {
                preSave: function(model, form, formName) {},
                proceedAction: function(model, formCtrl, form) {
                    if(!validateForm(formCtrl)) 
                        return;
                    PageHelper.showLoader();
                    irfProgressMessage.pop('Application-proceed', 'Working...');
                    PageHelper.clearErrors();
                    model.group.endTime= new Date();
                    model.groupAction = "PROCEED";
                    var reqData = _.cloneDeep(model);
                    GroupProcess.updateGroup(reqData, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('Application-proceed', 'Operation Succeeded', 5000);
                        irfNavigator.goBack();
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('Application-proceed', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);
                    });
                },
                sendBack: function(model, form, formName) {
                    if (!model.review.targetStage){
                        irfProgressMessage.pop('Send Back', "Send to Stage is mandatory", 2000);
                        return false;
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('Send Back', 'Working...');
                    PageHelper.clearErrors();
                    model.groupAction = "PROCEED";                    
                    var reqData = _.cloneDeep(model);
                    reqData.stage = model.review.targetStage;
                    GroupProcess.updateGroup(reqData, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('Send back', 'Operation Succeeded. Done', 5000);
                        irfNavigator.goBack();
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('Send back', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);
                    });   
                },
                reject: function(model, form, formName) {
                    if (!model.review.rejectStage){
                        irfProgressMessage.pop('Reject', "Send to Stage is mandatory", 2000);
                        return false;
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('Reject', 'Working...');
                    PageHelper.clearErrors();
                    model.groupAction = "PROCEED";
                    var reqData = _.cloneDeep(model);
                    reqData.stage = model.review.rejectStage;
                    GroupProcess.updateGroup(reqData, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('Reject', 'Operation Succeeded. Done', 5000);
                        irfNavigator.goBack();
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('Reject', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);
                    });   
                }
            }
        }
    }
})