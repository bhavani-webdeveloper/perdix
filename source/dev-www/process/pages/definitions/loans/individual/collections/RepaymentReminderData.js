define({
    pageUID: "loans.individual.collections.RepaymentReminderData",
    pageType: "Engine",
    dependencies: ["$log", "$state", "$stateParams", "LUC", "Enrollment", "IndividualLoan", "LucHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator", "RepaymentReminder"],
    $pageFn: function($log, $state, $stateParams, LUC, Enrollment, IndividualLoan, LucHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator, RepaymentReminder) {

        return {
            "type": "schema-form",
            "title": "Repayment Reminder Details",
            "subTitle": "Repayment Reminder",
            initialize: function(model, form, formCtrl) {
                PageHelper.showLoader();
                model = Utils.removeNulls(model, true);
                model.currentDate = Utils.getCurrentDate();
                $log.info("Reminder Follow Up Data Details got initiated");
                var reminderId = $stateParams.pageId;
                if (!reminderId) {
                    PageHelper.hideLoader();
                }

                RepaymentReminder.get({id: reminderId})
                .$promise
                .then(function(res) {
                        // code for setting model
                        model.reminder = res;
                        $log.info(model.reminder);
                        model.reminder.repaymentReminderDTO = res.repaymentReminderDTO;
                        model.reminder.repaymentCurrentHistories = res.repaymentCurrentHistories;
                        model.reminder.repaymentPreviousHistories = res.repaymentPreviousHistories;
                        model.reminder.repaymentReminderDTO.interactionDate = Utils.getCurrentDateTime();
                        var branches = formHelper.enum('branch').data;
                        var branchName = null;
                        for (var i = 0; i < branches.length; i++) {
                            var branch = branches[i];
                            if (branch.code ==  model.reminder.repaymentReminderDTO.branchId) {
                                model.reminder.repaymentReminderDTO.branchName = branch.name;
                            }
                        }
                        var centres = formHelper.enum('centre').data;
                        var centreName = null;
                        for (var i = 0; i < centres.length; i++) {
                            var centre = centres[i];
                            if (centre.code ==  model.reminder.repaymentReminderDTO.centreId) {
                                model.reminder.repaymentReminderDTO.centreName = centre.name;
                            }
                        }
                })
                .then(function(){
                        var promises = [];
                        var p1 = Queries.getLoanCustomerDetails(model.reminder.repaymentReminderDTO.loanId)
                                 .then(function(response){
                                    $log.info(response);
                                    model.reminder.repaymentReminderDTO.coAppArray = [];
                                    model.reminder.repaymentReminderDTO.guarantorArray = [];
                                    if (_.hasIn(response, 'loanCustomer') && response.loanCustomer.relation == "Loan Customer"){
                                        model.reminder.repaymentReminderDTO.businessPhoneNo = response.loanCustomer.mobile_phone;
                                    }
                                    if (_.hasIn(response, 'applicant') && response.applicant.relation.toLowerCase() == 'applicant'){
                                        model.reminder.repaymentReminderDTO.applicantName = response.applicant.first_name;
                                        model.reminder.repaymentReminderDTO.mobile_phone = response.applicant.mobile_phone;
                                        if (model.reminder.repaymentReminderDTO.mobile_phone == null) {
                                            model.reminder.repaymentReminderDTO.mobile_phone = 'NA';
                                        }
                                    }
                                    if (_.hasIn(response, 'coApplicants') && response.coApplicants[0] && response.coApplicants[0].relation == 'Co-Applicant') {
                                        for (i=0;i<response.coApplicants.length;i++) {
                                            model.reminder.repaymentReminderDTO.coAppArray.push(response.coApplicants[i]);
                                            if (model.reminder.repaymentReminderDTO.coAppArray[i].mobile_phone == null) {
                                                model.reminder.repaymentReminderDTO.coAppArray[i].mobile_phone = 'NA';
                                            }
                                        }
                                    }
                                    if (_.hasIn(response, 'guarantors') && response.guarantors[0] && response.guarantors[0].relation.toLowerCase() == 'guarantors') {
                                        for (i=0;i<response.guarantors.length;i++) {
                                            model.reminder.repaymentReminderDTO.guarantorArray.push(response.guarantorArray[i]);
                                            if (model.reminder.repaymentReminderDTO.guarantorArray[i].mobile_phone == null) {
                                                model.reminder.repaymentReminderDTO.guarantorArray[i].mobile_phone = 'NA';
                                            }
                                        }
                                    }
                                });
                        promises.push(p1);

                        var p2 = IndividualLoan.get({id: model.reminder.repaymentReminderDTO.loanId})
                                .$promise
                                .then(
                                    function(res){
                                        $log.info(res);
                                        model.reminder.repaymentReminderDTO.loanAmount = res.loanAmount;
                                    });
                        promises.push(p2);

                        var p3 = RepaymentReminder.getAccountDetails({accountNumber: model.reminder.repaymentReminderDTO.accountNumber})
                                .$promise
                                .then(
                                    function (res) {
                                        $log.info(res);
                                        model.accountDetails = [];
                                        for(var i=0; i<res.length; i++) {
                                            model.accountDetails.push(res[i]);
                                        }
                                        for(var i=0; i<model.accountDetails.length;i++){
                                            model.accountDetails[i].installmentAmount = (model.accountDetails[i].installmentAmount/100);
                                            model.accountDetails[i].repaymentAmountInPaisa = (model.accountDetails[i].repaymentAmountInPaisa/100);
                                        }
                                    });
                        promises.push(p3);
                        return $q.all(promises);
                })
                .then(function(){
                    PageHelper.hideLoader();  
                })
            },

            offline: true,

            form: [{
                "type": "box",
                "title": "LOAN_DETAILS",
                "readonly": true,
                "items": [{
                    "key": "reminder.repaymentReminderDTO.branchName",
                    "title": "BRANCH",
                    "type": "string"
                }, {
                    key: "reminder.repaymentReminderDTO.centreName",
                    type: "string",
                    title: "SPOKE"
                }, {
                    key: "reminder.repaymentReminderDTO.customerUrn",
                    type: "string",
                    title: "URN_NO"
                }, {
                    key: "reminder.repaymentReminderDTO.customerName",
                    type: "string",
                    title: "SPOKE",
                    title: "BUSINESS_NAME"
                }, {
                    key: "reminder.repaymentReminderDTO.businessPhoneNo",
                    type: "string",
                    title: "BUSINESS_PHONE_NO"
                }, {
                    key: "reminder.repaymentReminderDTO.applicantName",
                    type: "string",
                    title: "APPLICANT_NAME"
                }, {
                    key: "reminder.repaymentReminderDTO.mobile_phone",
                    type: "string",
                    title: "APPLICANT_PHONE_NO"
                },
                {
                    "type": "fieldset",
                    "title": "COAPPLICANTS",
                    "condition":"model.reminder.repaymentReminderDTO.coAppArray.length",
                    "items": [{
                        "key": "reminder.repaymentReminderDTO.coAppArray",
                        "title": "COAPPLICANTS",
                        "titleExpr": "model.reminder.repaymentReminderDTO.coAppArray[arrayIndex].urn + ': ' + model.reminder.repaymentReminderDTO.coAppArray[arrayIndex].first_name",
                        "type": "array",
                        "add":null,
                        "remove":null,
                        "startEmpty": true,
                        "view" : "fixed",
                        "items": [{
                            "key": "reminder.repaymentReminderDTO.coAppArray[].first_name",
                            "title": "CO_APP_NAME",
                        }, {
                            "key": "reminder.repaymentReminderDTO.coAppArray[].mobile_phone",
                            "title": "CO_APP_NO"
                        }]
                    }]
                },
                {
                    "type": "fieldset",
                    "title": "GUARANTER",
                    "condition":"model.reminder.repaymentReminderDTO.guarantorArray.length",
                    "items": [{
                        "key": "reminder.repaymentReminderDTO.guarantorArray",
                        "title": "COAPPLICANTS",
                        "titleExpr": "model.reminder.repaymentReminderDTO.guarantorArray[arrayIndex].urn + ': ' + model.reminder.repaymentReminderDTO.guarantorArray[arrayIndex].first_name",
                        "type": "array",
                        "add":null,
                        "remove":null,
                        "startEmpty": true,
                        "items": [{
                            "key": "reminder.repaymentReminderDTO.guarantorArray[].first_name",
                            "title": "GUARANTOR_NAME",
                        }, {
                            "key": "reminder.repaymentReminderDTO.guarantorArray[].mobile_phone",
                            "title": "GUARANTER_NO"
                        }]
                    }]
                },
                {
                    key: "reminder.repaymentReminderDTO.loanAmount",
                    type: "number",
                    title: "LOAN_AMOUNT"
                }, {
                    key: "reminder.repaymentReminderDTO.installmentNumber",
                    type: "number",
                    title: "INSTALLMENT_NO"
                }, {
                    key: "reminder.repaymentReminderDTO.installmentAmount",
                    type: "",
                    title: "INSTALLMENT_AMO"
                }]
            }, {
                "type": "box",
                "title": "STATUS",
                "items": [{
                    "key": "reminder.repaymentReminderDTO.reminderStatus",
                    "title": "CALL_STATUS",
                    "type": "select",
                    "enumCode": "repayment_call_status"
                }, {
                    "key": "reminder.repaymentReminderDTO.reason",
                    "type": "select",
                    "title": "REASON_FOR_NOT_ABLE_TO_REACH",
                    "enumCode": "call_not_reachable_status",
                    "condition": "model.reminder.repaymentReminderDTO.reminderStatus == 'Customer Not Reachable'"
                }, {
                    "key": "reminder.repaymentReminderDTO.remarks",
                    "type": "string",
                    "title": "REMARKS"
                }]
            }, {
                    type: "box",
                    title: "REMINDER_HISTORY",
                    "readonly": true,
                    items: [{
                        key: "reminder.repaymentCurrentHistories",
                        type: "array",
                        add: null,
                        remove: null,
                        titleExpr: "'Reminder: ' + moment(model.reminder.repaymentCurrentHistories[arrayIndexes[0]].interactionDate).format('DD, MMMM YYYY')",
                        titleExprLocals: {moment: window.moment},
                        items: [{
                            key: "reminder.repaymentCurrentHistories[].reminderStatus",
                            type: "string",
                            title: "CRM_CALL_STATUS"
                        }, {
                            key: "reminder.repaymentCurrentHistories[].remarks",
                            type: "string",
                            title: "REMARKS"
                        }, {
                            key: "reminder.repaymentCurrentHistories[].customerName",
                            type: "string",
                            title: "USERNAME"
                        }, {
                            key: "reminder.repaymentCurrentHistories[].interactionDate",
                            type: "date",
                            title: "DATE_&_TIMESTAMP"
                        }, ]
                    }]
            }, {
                type: "box",
                title: "3_MONTH_REMINDER_HISTORY",
                "readonly": true,
                items: [{
                    key: "reminder.repaymentPreviousHistories",
                    type: "array",
                    add: null,
                    remove: null,
                    titleExpr: "moment(model.reminder.repaymentPreviousHistories[arrayIndexes[0]].interactionDate.startMonth).format('MMMM YYYY')",
                    titleExprLocals: {moment: window.moment},
                    items: [{
                        key: "reminder.repaymentPreviousHistories[].reminderStatus",
                        type: "string",
                        title: "CRM_CALL_STATUS"
                    }, {
                        key: "reminder.repaymentPreviousHistories[].remarks",
                        type: "string",
                        title: "REMARKS"
                    }, {
                        key: "reminder.repaymentPreviousHistories[].customerName",
                        type: "string",
                        title: "USERNAME"
                    }, {
                        key: "reminder.repaymentPreviousHistories[].interactionDate",
                        type: "date",
                        title: "DATA_&_TIMESTAMP"
                    }, ]
                }]
            }, {
                type: "box",
                title: "REMINDER_/_REPAYMEMT_HISTORY",
                "readonly": true,
                items: [{
                    key: "accountDetails",
                    type: "array",
                    add: null,
                    remove: null,
                    "titleExpr": "model.accountDetails[arrayIndex].repaymentType == 'Scheduled' || model.accountDetails[arrayIndex].repaymentType == 'Scheduled Demand'  ? 'Repayment' + ': '+ moment(model.reminder.accountDetails[arrayIndexes[0]].createdAt).format('DD, MMMM YYYY') : model.accountDetails[arrayIndex].repaymentType + ': '+ moment(model.reminder.accountDetails[arrayIndexes[0]].createdAt).format('DD, MMMM YYYY')",
                    "titleExprLocals": {moment: window.moment},
                    items: [{
                        key: "accountDetails[].instrumnetType",
                        type: "string",
                        title: "INSTRUMENT_TYPE",
                        condition: "model.accountDetails[arrayIndex].repaymentType == 'Scheduled' || model.accountDetails[arrayIndex].repaymentType == 'Scheduled Demand'"
                    },
                    {
                        key: "accountDetails[].repaymentAmountInPaisa",
                        type: "string",
                        title: "AMOUNT",
                        condition: "model.accountDetails[arrayIndex].repaymentType == 'Scheduled' || model.accountDetails[arrayIndex].repaymentType == 'Scheduled Demand'"
                    },
                    {
                        key: "accountDetails[].installmentAmount",
                        type: "string",
                        title: "AMOUNT",
                        condition: "model.accountDetails[arrayIndex].repaymentType == 'Reminder'"
                    },
                    {
                        key: "accountDetails[].reference",
                        type: "string",
                        title: "REFERENCE",
                        condition: "model.accountDetails[arrayIndex].repaymentType == 'Scheduled' || model.accountDetails[arrayIndex].repaymentType == 'Scheduled Demand'"
                    },
                    {
                        key: "accountDetails[].interactionMode",
                        type: "string",
                        title: "INTERACTION_MODE",
                        condition: "model.accountDetails[arrayIndex].repaymentType == 'Reminder'"
                    },
                    {
                        key: "accountDetails[].createdAt",
                        type: "string",
                        title: "INTERACTION_DATE_",
                        condition: "model.accountDetails[arrayIndex].repaymentType == 'Reminder'"
                    }]
                }]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            }],

            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "reminder": {
                        "type": "object",
                        "properties": {

                        }
                    }
                },
            },

            actions: {
                submit: function(model, form, formName) {
                    $log.info("Inside submit()");
                    PageHelper.showLoader();
                    PageHelper.showProgress("Repayment Reminder Save", "Working...");

                    if (model.reminder.repaymentReminderDTO.id) {
                        RepaymentReminder.update(model.reminder)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("Repayment Reminder Save", "Repayment Reminder Updated with id" + '  ' + res.repaymentReminderDTO.id, 3000);
                                $log.info(res);
                                model.reminder = res;
                                irfNavigator.goBack();
                            }, function(httpRes) {
                                PageHelper.showProgress("Repayment Reminder Save", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            }).finally(function() {
                                PageHelper.hideLoader();
                            })
                    }
                }
            }
        }
    }
})
