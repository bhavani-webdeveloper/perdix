define({
    pageUID: "loans.individual.collections.ReminderFollowUpData",
    pageType: "Engine",
    dependencies: ["$log", "$state", "$stateParams", "LUC", "Enrollment", "IndividualLoan", "LucHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator", "RepaymentReminder"],
    $pageFn: function($log, $state, $stateParams, LUC, Enrollment, IndividualLoan, LucHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator, RepaymentReminder) {

        return {
            "type": "schema-form",
            "title": "Reminder Follow Up Data Details",
            "subTitle": "Repayment Reminder",
            initialize: function(model, form, formCtrl) {
                model = Utils.removeNulls(model, true);
                $log.info("Reminder Follow Up Data Details got initiated");
                var reminderId = $stateParams.pageId;
                if (!reminderId) {
                    PageHelper.hideLoader();
                }
                RepaymentReminder.get({
                        id: reminderId
                    },
                    function(res) {
                        model.reminder = res;
                        $log.info(model.reminder);
                        model.reminder.repaymentReminderDTO = res.repaymentReminderDTO;
                        model.reminder.repaymentCurrentHistories = res.repaymentCurrentHistories;
                        model.reminder.repaymentPreviousHistories = res.repaymentPreviousHistories;
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



                        Queries.getLoanCustomerRelations({
                            accountNumber: model.reminder.repaymentReminderDTO.accountNumber
                        }).then(
                            function(response) {
                                $log.info(response);
                                model.reminder.repaymentReminderDTO.coAppArray = [];
                                model.reminder.repaymentReminderDTO.guarantorArray = [];
                                for(i=0;i<response.length;i++){
                                    if (response[i].relation == 'Applicant') {
                                        model.reminder.repaymentReminderDTO.applicantName =  response[i].first_name;
                                    } else if (response[i].relation == 'Co-Applicant') {
                                        model.reminder.repaymentReminderDTO.coAppArray.push(response[i]);
                                        //model.reminder.repaymentReminderDTO.coAppName =  response[i].first_name;
                                    } else if (response[i].relation == 'Guarantor') {
                                        model.reminder.repaymentReminderDTO.guarantorArray.push(response[i]);
                                     /*   model.reminder.repaymentReminderDTO.guarantorName =  response[i].first_name;*/
                                    }
                                }
                            }
                        );

                        IndividualLoan.get({id: model.reminder.repaymentReminderDTO.loanId})
                            .$promise
                            .then(
                                function(res){
                                        $log.info(res);
                                        model.reminder.repaymentReminderDTO.loanAmount = res.loanAmount;
                                });

                        PageHelper.hideLoader();
                    }
                );
                $log.info("Reminder Follow Up Data Details is initiated");

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
                    type: "number",
                    title: "BUSINESS_PHONE_NO"
                }, {
                    key: "reminder.repaymentReminderDTO.applicantName",
                    type: "string",
                    title: "APPLICANT_NAME"
                }, {
                    key: "reminder.repaymentReminderDTO.applicantPhoneNo",
                    type: "number",
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
                        "items": [{
                            "key": "reminder.repaymentReminderDTO.coAppArray[].first_name",
                            "title": "CO_APP_NAME",
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
                        }]
                    }]
                },




                 /*{
                    key: "reminder.repaymentReminderDTO.coAppName",
                    type: "string",
                    title: "CO_APP_NAME"
                }, {
                    key: "reminder.repaymentReminderDTO.coApplicantNumber",
                    type: "number",
                    title: "CO_APPLICANT_PH_NO"
                }, {
                    key: "reminder.repaymentReminderDTO.guarantorName",
                    type: "string",
                    title: "GUARANTOR_NAME"
                }, {
                    key: "reminder.repaymentReminderDTO.guarantorPhoneNo",
                    type: "number",
                    title: "GUARNATOR_PH_NO"
                },*/ 
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
                        title: "REMINDER_HISTORY",
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
                            title: "DATA_&_TIMESTAMP"
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
                    title: "3_MONTH_REMINDER_HISTORY",
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
                    PageHelper.showProgress("Reminder Follow Up Data Details Save", "Working...");
                    
                    if (model.reminder.repaymentReminderDTO.id) {
                        RepaymentReminder.update(model.reminder)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("Reminder Follow Up Data Details Save", "Repayment Reminder Updated with id" + '  ' + res.repaymentReminderDTO.id, 3000);
                                $log.info(res);
                                model.reminder = res;
                                irfNavigator.goBack();

                                //$state.go('Page.JournalMaintenanceDashboard', null);
                            }, function(httpRes) {
                                PageHelper.showProgress("Reminder Follow Up Data Details Save", "Oops. Some error occured.", 3000);
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