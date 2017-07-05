define({
    pageUID: "loans.group.Checker2",
    pageType: "Engine",
    dependencies: ["$log", "$state", "irfSimpleModal", "GroupProcess", "Enrollment", "CreditBureau",
        "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, $state, irfSimpleModal, GroupProcess, Enrollment, CreditBureau,
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
                    model.group.jlgGroupMembers[key].address=[resp.doorNo, resp.street, resp.postOffice, resp.locality,resp.villageName,resp.district,resp.state].filter(function (val) {return val;}).join(" " );
                    model.group.jlgGroupMembers[key].dateOfBirth=resp.dateOfBirth;
                    model.group.jlgGroupMembers[key].spouseFirstName=resp.spouseFirstName;

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
            "title": "Checker2",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info(model);
                if ($stateParams.pageId) {
                    var groupId = $stateParams.pageId;
                    PageHelper.showLoader();
                    irfProgressMessage.pop("cgt1-init", "Loading, Please Wait...");
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
                } else {
                    irfNavigator.goBack();
                }
            },
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return [
                    "Group ID : " + item.group.id,
                    "Group Code : " + item.group.groupCode,
                    "CGT Date : " + item.group.cgtDate1
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
                        "type": "string",
                        "readonly": true,
                        "title": "GROUP_MEMBER_NAME"
                    },{
                        "key": "group.jlgGroupMembers[].dateOfBirth",
                        "type": "date",
                        "readonly": true,
                        "title": "DATE_OF_BIRTH"
                    }, {
                        "key": "group.jlgGroupMembers[].husbandOrFatherFirstName",
                        "readonly": true,
                        "title": "FATHER_NAME"
                    },{
                        "key": "group.jlgGroupMembers[].spouseFirstName",
                        "readonly": true,
                        "title": "SPOUSE_NAME"
                    }, {
                        "key": "group.jlgGroupMembers[].relation",
                        "readonly": true,
                        "title": "RELATION",
                    },{
                        "key": "group.jlgGroupMembers[].address",
                        "readonly": true,
                        "title": "ADDRESS",
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
                    }]
                }]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "button",
                    "title": "APPROVE",
                    "onClick":"actions.approve(model,form)"  
                }, {
                    "type": "button",
                    "title": "REJECT",
                    "onClick":"actions.reject(model,form)"  
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
                reject: function(model, form) {
                    $log.info("Inside submit()");
                    var reqData = _.cloneDeep(model);
                    reqData.groupAction = 'SAVE';
                    PageHelper.clearErrors();
                    Utils.removeNulls(reqData, true);
                    GroupProcess.updateGroup(reqData, function(res) {
                        irfProgressMessage.pop('CHECKER-save', 'Done.', 5000);
                        model.group = _.clone(res.group);
                        PageHelper.hideLoader();
                    }, function(res) {
                        PageHelper.hideLoader();
                        PageHelper.showErrors(res);
                        irfProgressMessage.pop('CHECKER-save', 'Oops. Some error.', 2000); 
                    });
                },
                approve: function(model, form, formName) {
                    PageHelper.showLoader();
                    irfProgressMessage.pop('CHECKER-proceed', 'Working...');
                    PageHelper.clearErrors();
                    model.groupAction = "PROCEED";
                    model.group.grtDoneBy=SessionStore.getLoginname()+'-'+model.group.grtDoneBy;
                    var reqData = _.cloneDeep(model);
                    GroupProcess.updateGroup(reqData, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('CHECKER-proceed', 'Operation Succeeded. Proceeded ', 5000);
                        $state.go('Page.GroupDashboard', null);
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('CHECKER-proceed', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);
                    });   
                }
            }
        }
    }
})