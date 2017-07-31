define({
    pageUID: "loans.group.GroupLoanBooking",
    pageType: "Engine",
    dependencies: ["$log", "irfSimpleModal", "Groups", "GroupProcess", "Enrollment", "CreditBureau",
        "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, irfSimpleModal, Groups, GroupProcess, Enrollment, CreditBureau,
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
            "title": "Group Loan Booking",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info(model);
                model.group = model.group || {};
                var centres = SessionStore.getCentres();
                model.group.branchId = model.group.branchId || SessionStore.getCurrentBranch().branchId;
                model.group.centreId = model.group.centreId || ((_.isArray(centres) && centres.length > 0) ? centres[0].value : model.group.centreId);
                if ($stateParams.pageId) {
                    var groupId = $stateParams.pageId;
                    PageHelper.showLoader();
                    irfProgressMessage.pop("cgt1-init", "Loading, Please Wait...");
                    GroupProcess.getGroup({
                        groupId: groupId
                    }, function(response, headersGetter) {
                        model.group = _.cloneDeep(response);
                        model.group.udfDate1 = model.group.udfDate1 || "";
                        model.group.grtDoneBy = model.group.grtDoneBy || SessionStore.getUsername();
                        fixData(model);
                        if (model.group.jlgGroupMembers.length > 0) {
                            fillNames(model).then(function(m) {
                                model = m;
                            }, function(m) {
                                PageHelper.showErrors(m);
                                irfProgressMessage.pop("group-init", "Oops. An error occurred", 2000);
                            });
                        }

                        PageHelper.hideLoader();
                    }, function(resp) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("group-init", "Oops. An error occurred", 2000);
                        //backToDashboard();
                    });
                }
                /*else {
                                   irfNavigator.goBack();
                               }*/
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
                "title": "GROUP_DETAILS",
                "items": [{
                    "key": "group.groupName",
                    "readonly": true,
                    "title": "GROUP_NAME",
                }, {
                    "key": "group.partnerCode",
                    "readonly": true,
                    "title": "PARTNER",
                    "type": "select",
                    "enumCode": "partner"
                }, /*{
                    "key": "group.centreCode",
                    "title": "CENTRE_CODE",
                    "type": "select",
                    "enumCode": "centre"
                },*/ {
                    "key": "group.productCode",
                    "readonly": true,
                    "title": "PRODUCT",
                    "type": "select",
                    "enumCode": "loan_product",
                    "parentEnumCode": "partner",
                    "parentValueExpr": "model.group.partnerCode"
                }, {
                    "key": "group.frequency",
                    "readonly": true,
                    "title": "FREQUENCY",
                    "type": "select",
                    "enumCode":"loan_product_frequency"
                }, {
                    "key": "group.tenure",
                    "readonly": true,
                    "title": "TENURE",
                },{
                    "key": "group.scheduledDisbursementDate",
                    "required":true,
                    "title": "SCHEDULED_DISBURSEMENT_DATE",
                    "type": "date",
                },{
                    "key": "group.firstRepaymentDate",
                    "title": "FIRST_REPAYMENT_DATE",
                    "required":true,
                    "type": "date",
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
                    "titleExpr":"model.group.jlgGroupMembers[arrayIndex].urnNo + ' : ' + model.group.jlgGroupMembers[arrayIndex].firstName",
                    "items": [{
                        "key": "group.jlgGroupMembers[].urnNo",
                        "readonly": true,
                        "title": "URN_NO",
                    }, {
                        "key": "group.jlgGroupMembers[].firstName",
                        "type": "string",
                        "readonly": true,
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
                    }, /*{
                        "key": "group.jlgGroupMembers[].scheduledDisbursementDate",
                        "required":true,
                        "title": "SCHEDULED_DISBURSEMENT_DATE",
                        "type": "date",
                    }, {
                        "key": "group.jlgGroupMembers[].firstRepaymentDate",
                        "title": "FIRST_REPAYMENT_DATE",
                        "required":true,
                        "type": "date",
                    }*/]
                }]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                }, {
                    "type": "submit",
                    "title": "PROCEED"
                }]
            }],

            schema: function() {
                return Groups.getSchema().$promise;
            },

            actions: {
                preSave: function(model, form, formName) {},
                submit: function(model, form, formName) {
                    PageHelper.showLoader();
                    irfProgressMessage.pop('proceed', 'Working...');
                    PageHelper.clearErrors();
                    model.groupAction = "PROCEED";
                    model.group.grtDoneBy = SessionStore.getUsername();
                    if (model.group.firstRepaymentDate || model.group.scheduledDisbursementDate) {
                        for (i = 0; i < model.group.jlgGroupMembers.length; i++) {
                            model.group.jlgGroupMembers[i].scheduledDisbursementDate = model.group.scheduledDisbursementDate;
                            model.group.jlgGroupMembers[i].firstRepaymentDate = model.group.firstRepaymentDate;
                        }
                    }
                    var reqData = _.cloneDeep(model);
                    GroupProcess.updateGroup(reqData, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('proceed', 'Operation Succeeded. Proceeded to GRT', 5000);
                        irfNavigator.goBack();
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('proceed', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);
                    });
                }
            }
        }
    }
})