define({
    pageUID: "loans.group.Checker1",
    pageType: "Engine",
    dependencies: ["$log", "$state", "irfSimpleModal", "Groups", "Enrollment", "CreditBureau",
        "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, $state, irfSimpleModal, Groups, Enrollment, CreditBureau,
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
                    model.group.jlgGroupMembers[key].mobilePhone=resp.mobilePhone;
                    model.group.jlgGroupMembers[key].landLineNo=resp.landLineNo;
                    model.group.jlgGroupMembers[key].latitude=resp.latitude;
                    model.group.jlgGroupMembers[key].aadhaarNo=resp.aadhaarNo;
                    model.group.jlgGroupMembers[key].identityProof=resp.identityProof;
                    model.group.jlgGroupMembers[key].identityProofImageId1=resp.identityProofImageId;
                    model.group.jlgGroupMembers[key].identityProofImageId2=resp.udf.userDefinedFieldValues.udf30;
                    model.group.jlgGroupMembers[key].identityProofNo=resp.identityProofNo;
                    model.group.jlgGroupMembers[key].addressProof=resp.addressProof;
                    model.group.jlgGroupMembers[key].addressProofImageId1=resp.addressProofImageId;
                    model.group.jlgGroupMembers[key].addressProofImageId2=resp.udf.userDefinedFieldValues.udf29;
                    model.group.jlgGroupMembers[key].addressProofNo=resp.addressProofNo;

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
            "title": "Checker1",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info(model);
                 //model.group = model.group || {};
                /*if (!_.hasIn(model.group, 'jlgGroupMembers') || model.group.jlgGroupMembers==null){
                     model.group.jlgGroupMembers = {};
                 }*/
                if ($stateParams.pageId) {
                    var groupId = $stateParams.pageId;
                    PageHelper.showLoader();
                    irfProgressMessage.pop("cgt1-init", "Loading, Please Wait...");
                    Groups.getGroup({
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

                /*var self = this;
                self.form = [];
                var tableDetails = [];
                form: [];
                for (i in model.group.jlgGroupMembers) {
                    tableDetails.push({
                        "type": "section",
                        "htmlClass": "row col-md-12",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                key: "group.jlgGroupMembers[" + i + "].urnNo",
                                readonly: true,
                                type: "string",
                                notitle: true
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-2 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].firstName",
                                "type": "text",
                                "notitle": true,
                                "readonly": true
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].dateOfBirth",
                                type: "date"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].husbandOrFatherFirstName",
                                "type": "text",
                                "notitle": true
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].spouseFirstName",
                                "type": "text",
                                "notitle": true
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].address",
                                "type": "text",
                                "notitle": true
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].mobilePhone",
                                "type": "text",
                                "notitle": true
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].landLineNo",
                                "type": "text",
                                "notitle": true
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].latitude",
                                "type": "text",
                                "notitle": true
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].aadhaarNo",
                                "type": "text",
                                "notitle": true
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].addressProof",
                                "type": "text",
                                "notitle": true
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].addressProofImageId1",
                                "type": "text",
                                "notitle": true
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].addressProofImageId2",
                                "type": "text",
                                "notitle": true
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].addressProofNo",
                                "type": "text",
                                "notitle": true
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].identityProof",
                                "type": "text",
                                "notitle": true
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].identityProofImageId1",
                                "type": "text",
                                "notitle": true
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].identityProofImageId2",
                                "type": "text",
                                "notitle": true
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].identityProofNo",
                                "type": "text",
                                "notitle": true
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].loanAmount",
                                "type": "text",
                                "notitle": true
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].loanPurpose1",
                                "type": "text",
                                "notitle": true
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].loanPurpose2",
                                "type": "text",
                                "notitle": true
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "key": "group.jlgGroupMembers[" + i + "].loanPurpose3",
                                "type": "text",
                                "notitle": true
                            }]
                        }]
                    })
                };
                self.form = [{
                    "type": "box",
                    "title": "GROUP_MEMBERS",
                    "colClass": "col-md-12",
                    "items": [{
                        "type": "section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'URN_NO'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-2 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'GROUP_MEMBER_NAME'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'DATE_OF_BIRTH'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'FATHER_NAME'|translate}}"
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'SPOUSE_NAME'|translate}}"
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'ADDRESS'|translate}}"
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'MOBILE_NUMBER'|translate}}"
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'LANDLINE_NO'|translate}}"
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'HOUSEVERIFICATION_GPS'|translate}}"
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'AADHAAR_NO'|translate}}"
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'ADDRESS_PROOF'|translate}}"
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'ADDRESS_PROOF_IMAGE_ID'|translate}}"
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'ADDRESS_PROOF_REVERSE_IMAGE_ID'|translate}}"
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'ADDRESS_PROOF_NO'|translate}}"
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'IDENTITY_PROOF'|translate}}"
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'IDENTITY_PROOF_DOCUMENT'|translate}}"
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'IDENTITY_PROOF_REVERSE_DOCUMENT'|translate}}"
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'IDENTITY_PROOFNO'|translate}}"
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'LOAN_AMOUNT'|translate}}"
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'LOAN_PURPOSE_1'|translate}}"
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'LOAN_PURPOSE_2'|translate}}"
                            }]
                        },{
                            "type": "section",
                            "htmlClass": "col-sm-3 col-xs-3",
                            "items": [{
                                "type": "section",
                                "html": "{{'LOAN_PURPOSE3'|translate}}"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "row",
                            "items": [{
                                "type": "section",
                                "htmlClass": "col-md-12",
                                "items": tableDetails
                            }]

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
            }]*/
            },
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return [
                    "Group ID : " + item.group.id,
                    "Group Code : " + item.group.groupCode,
                    "CGT Date : " + item.group.cgtDate1
                ]
            },

            form: [ {
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
                        "key": "group.jlgGroupMembers[].address",
                        "readonly": true,
                        "title": "ADDRESS",
                    },{
                        "key": "group.jlgGroupMembers[].mobilePhone",
                        "readonly": true,
                        "title": "MOBILE_NUMBER",
                    },{
                        "key": "group.jlgGroupMembers[].landLineNo",
                        "readonly": true,
                        "title": "LANDLINE_NO",
                    },{
                        "key": "group.jlgGroupMembers[].latitude",
                        "readonly": true,
                        "title": "HOUSEVERIFICATION_GPS",
                    },{
                        "key": "group.jlgGroupMembers[].aadhaarNo",
                        "readonly": true,
                        "title": "AADHAAR_NO",
                    },{
                        "key": "group.jlgGroupMembers[].addressProof",
                        "readonly": true,
                        "title": "ADDRESS_PROOF",
                    },{
                        "key": "group.jlgGroupMembers[].addressProofImageId1",
                        "readonly": true,
                        "title": "ADDRESS_PROOF_IMAGE_ID",
                    },{
                        "key": "group.jlgGroupMembers[].addressProofImageId2",
                        "readonly": true,
                        "title": "ADDRESS_PROOF_REVERSE_IMAGE_ID",
                    },{
                        "key": "group.jlgGroupMembers[].addressProofNo",
                        "readonly": true,
                        "title": "ADDRESS_PROOF_NO",
                    },{
                        "key": "group.jlgGroupMembers[].identityProof",
                        "readonly": true,
                        "title": "IDENTITY_PROOF",
                    },{
                        "key": "group.jlgGroupMembers[].identityProofImageId1",
                        "readonly": true,
                        "title": "IDENTITY_PROOF_DOCUMENT",
                    },{
                        "key": "group.jlgGroupMembers[].identityProofImageId2",
                        "readonly": true,
                        "title": "IDENTITY_PROOF_REVERSE_DOCUMENT",
                    },{
                        "key": "group.jlgGroupMembers[].identityProofNo",
                        "readonly": true,
                        "title": "IDENTITY_PROOFNO",
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