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
            if(model.group.jlgGroupMembers && model.group.jlgGroupMembers.length)
            {
               if(model.group.jlgGroupMembers[0].scheduledDisbursementDate){
                model.group.scheduledDisbursementDate=model.group.jlgGroupMembers[0].scheduledDisbursementDate;
               }
               if(model.group.jlgGroupMembers[0].firstRepaymentDate){
                model.group.firstRepaymentDate=model.group.jlgGroupMembers[0].firstRepaymentDate;
               }
            }
        };

        var validateForm = function(formCtrl){
            formCtrl.scope.$broadcast('schemaFormValidate');
            if (formCtrl && formCtrl.$invalid) {
                PageHelper.showProgress("Disbursement","Your form have errors. Please fix them.", 5000);
                return false;
            }
            return true;
        }

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
                model.review = model.review || {};
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
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
            offline: false,
            form: [{
                    "type": "box",
                    "title": "GROUP_DETAILS",
                    "items": [{
                        "key": "group.groupName",
                        "readonly": true,
                        "title": "GROUP_NAME",
                    }, {
                        "key": "group.branchId",
                        "readonly": true,
                        "title": "BRANCH_NAME",
                        "enumCode": "branch_id",
                        "type":"select",
                        readonly: true,
                        "parentEnumCode": "bank",
                        "parentValueExpr": "model.group.bankId",
                    }, {
                        "key": "group.centreCode",
                        "title": "CENTRE_CODE",
                        "readonly": true,
                        "type": "select",
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
                        "readonly": true,
                        "type": "select",
                        "enumCode": "loan_product",
                        "parentEnumCode": "partner",
                        "parentValueExpr": "model.group.partnerCode"
                    }, {
                        "key": "group.frequency",
                        "title": "FREQUENCY",
                        "readonly": true,
                        "type": "select",
                        "enumCode": "loan_product_frequency",
                    }, {
                        "key": "group.tenure",
                        "readonly": true,
                        "title": "TENURE",
                    }, {
                        "key": "group.scheduledDisbursementDate",
                        "required":true,
                        "readonly": true,
                        "title": "SCHEDULED_DISBURSEMENT_DATE",
                        "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                        "type": "date",
                    }, {
                        "key": "group.firstRepaymentDate",
                        "title": "FIRST_REPAYMENT_DATE",
                        "required":true,
                        "readonly": true,
                        "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                        "type": "date",
                    }, {
                        "key": "group.groupPhotoFileId",
                        "required": true,
                        "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                        "title": "GROUP_PHOTO",
                        "category": "Group",
                        "subCategory": "GROUPPHOTO",
                        "type": "file",
                        "offline": true,
                        "fileType": "image/*",
                    }]
                }, {
                    "type": "box",
                    "condition": "model.siteCode == 'KGFS'",
                    "title": "GROUP_MEMBERS",
                    "items": [{
                        "key": "group.jlgGroupMembers",
                        "type": "array",
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
                            "title": "WITNESS_NAME",
                        }, {
                            "key": "group.jlgGroupMembers[].witnessRelationship",
                            "readonly": true,
                            "title": "RELATION",
                            "type": "select",
                            "enumCode": "relation"
                        }, {
                            "key": "group.jlgGroupMembers[]",
                            "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                            "title": "PRINT",
                            "type": "button",
                            "onClick": function(model, formCtrl, form, $event) {
                                $log.info(model.group.jlgGroupMembers[form.arrayIndex]);
                                var r = model.group.jlgGroupMembers[form.arrayIndex];
                                var repaymentInfo = {
                                    'customerURN': r.urnNo,
                                    'customerId': r.customerId,
                                    'customerName': r.firstName,
                                    'accountNumber': r.loanAccount.accountNumber,
                                    'transactionType': "Disbursement",
                                    'transactionID': 1,
                                    'productCode': r.loanAccount.productCode,
                                    'loanAmount': r.loanAmount,
                                    'disbursedamount': (r.loanAmount - (r.loanAccount.processingFeeInPaisa / 100)),
                                    'partnerCode': r.loanAccount.partnerCode,
                                    'processingFee': (r.loanAccount.processingFeeInPaisa / 100)
                                };
                                var opts = {
                                    'branch': SessionStore.getBranch(),
                                    'entity_name': SessionStore.getBankName() + " KGFS",
                                    'company_name': "IFMR Rural Channels and Services Pvt. Ltd.",
                                    'cin': 'U74990TN2011PTC081729',
                                    'address1': 'IITM Research Park, Phase 1, 10th Floor',
                                    'address2': 'Kanagam Village, Taramani',
                                    'address3': 'Chennai - 600113, Phone: 91 44 66687000',
                                    'website': "http://ruralchannels.kgfs.co.in",
                                    'helpline': '18001029370',
                                    'branch_id': SessionStore.getBranchId(),
                                    'branch_code': SessionStore.getBranchCode()
                                };
                                GroupProcess.getLoanPrint(repaymentInfo,opts);
                            }
                        }]
                    }]
                }, {
                    "type": "box",
                    "title": "GROUP_MEMBERS",
                    "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                    "items": [{
                        "key": "group.jlgGroupMembers",
                        "type": "array",
                        "title": "GROUP_MEMBERS",
                        "titleExpr":"model.group.jlgGroupMembers[arrayIndex].urnNo + ' : ' + model.group.jlgGroupMembers[arrayIndex].firstName",
                        "add": null,
                        "items": [{
                            "key": "group.jlgGroupMembers[].urnNo",
                            "title": "URN_NO",
                            "readonly": true,
                        }, {
                            "key": "group.jlgGroupMembers[].firstName",
                            "type": "string",
                            "readonly": true,
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
                            "title": "LOAN_AMOUNT",
                            "readonly": true,
                            "type": "amount",
                        }, {
                            "key": "group.jlgGroupMembers[].loanPurpose1",
                            "title": "LOAN_PURPOSE_1",
                            "enumCode": "loan_purpose_1",
                            "readonly": true,
                            "type": "select",
                        }, {
                            "key": "group.jlgGroupMembers[].loanPurpose2",
                            "type": "string",
                            "readonly": true,
                            "title": "LOAN_PURPOSE_2",
                        }, {
                            "key": "group.jlgGroupMembers[].loanPurpose3",
                            "type": "string",
                            "readonly": true,
                            "title": "LOAN_PURPOSE3",
                        }, {
                            "key": "group.jlgGroupMembers[].witnessFirstName",
                            "readonly": true,
                            "title": "WITNESS_NAME",
                        }, {
                            "key": "group.jlgGroupMembers[].witnessRelationship",
                            "title": "RELATION",
                            "type": "select",
                            "readonly": true,
                            "enumCode": "relation"
                        }, {
                            "key": "group.jlgGroupMembers[]",
                            "title": "PRINT",
                            "type": "button",
                            "onClick": function(model, formCtrl, form, $event) {
                                $log.info(model.group.jlgGroupMembers[form.arrayIndex]);
                                var r = model.group.jlgGroupMembers[form.arrayIndex];
                                var repaymentInfo = {
                                    'customerURN': r.urnNo,
                                    'customerId': r.customerId,
                                    'customerName': r.firstName,
                                    'accountNumber': r.loanAccount.accountNumber,
                                    'transactionType': "Disbursement",
                                    'transactionID': 1,
                                    'productCode': r.loanAccount.productCode,
                                    'loanAmount': r.loanAmount,
                                    'disbursedamount': (r.loanAmount - (r.loanAccount.processingFeeInPaisa / 100)),
                                    'partnerCode': r.loanAccount.partnerCode,
                                    'processingFee': (r.loanAccount.processingFeeInPaisa / 100)
                                };
                                var opts = {
                                    'branch': SessionStore.getBranch(),
                                    'entity_name': SessionStore.getBankName() + " KGFS",
                                    'company_name': "IFMR Rural Channels and Services Pvt. Ltd.",
                                    'cin': 'U74990TN2011PTC081729',
                                    'address1': 'IITM Research Park, Phase 1, 10th Floor',
                                    'address2': 'Kanagam Village, Taramani',
                                    'address3': 'Chennai - 600113, Phone: 91 44 66687000',
                                    'website': "http://ruralchannels.kgfs.co.in",
                                    'helpline': '18001029370',
                                    'branch_id': SessionStore.getBranchId(),
                                    'branch_code': SessionStore.getBranchCode()
                                };
                                GroupProcess.getLoanPrint(repaymentInfo,opts);
                            }
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
                                "type": "submit",
                                condition:"model.action == 'PROCEED'",
                                "title": "PROCEED",
                            }]
                        }
                    ]
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

                submit: function(model, formCtrl, form) {
                    if(!validateForm(formCtrl)) 
                        return;
                    if(model.siteCode == 'saija') {
                        var cbsdate = SessionStore.getCBSDate();
                        if (model.group.scheduledDisbursementDate && moment(model.group.scheduledDisbursementDate, SessionStore.getSystemDateFormat()).diff(cbsdate, "days") <0) {
                            PageHelper.showProgress("loan-create", "Scheduled disbursement date should be greater than or equal to system date", 5000);
                            return false;
                        }

                        if (model.group.firstRepaymentDate && moment(model.group.firstRepaymentDate, SessionStore.getSystemDateFormat()).diff(model.group.scheduledDisbursementDate, "days") <=0) {
                            PageHelper.showProgress("loan-create", "Repayment date should be greater than disbursement date", 5000);
                            return false;
                        }
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('Disbursement-proceed', 'Working...');
                    PageHelper.clearErrors();
                    if(model.siteCode == 'saija') {
                        model.groupAction = "PROCEED";
                    } else {
                        model.groupAction = "SAVE";
                    }
                    for(i=0;i<model.group.jlgGroupMembers.length;i++)
                    {
                       model.group.jlgGroupMembers[i].modeOfDisbursement='CASH';
                    }
                    var reqData = _.cloneDeep(model);

                    GroupProcess.updateGroup(reqData, function(res) {
                        res.groupAction = "PROCEED";
                        if(model.siteCode == 'saija') {
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('Disbursement-proceed', 'Operation Succeeded.  Disbursement Complete.', 5000);
                            irfNavigator.goBack();
                            return;
                        }
                        GroupProcess.groupDisbursement(res, function(resp) {
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('Disbursement-proceed', 'Operation Succeeded.  Disbursement Complete.', 5000);
                            irfNavigator.goBack();
                        }, function(err) {
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('Disbursement-proceed', 'Oops. Some error.', 2000);
                            PageHelper.showErrors(err);
                        });
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('Disbursement-proceed', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);
                    });
                },
                sendBack: function(model, form, formName) {
                    if (!model.review.targetStage){
                        irfProgressMessage.pop('Send Back', "Send to Stage is mandatory", 2000);
                        return false;
                    }
                    if (!model.group.groupRemarks){
                        irfProgressMessage.pop('Send Back', "Remarks is mandatory", 2000);
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
                    if (!model.group.groupRemarks){
                        irfProgressMessage.pop('Reject', "Remarks is mandatory", 2000);
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