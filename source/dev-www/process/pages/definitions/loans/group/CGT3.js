define({
    pageUID: "loans.group.CGT3",
    pageType: "Engine",
    dependencies: ["$log", "irfSimpleModal", "GroupProcess", "Enrollment", "CreditBureau",
        "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, irfSimpleModal, GroupProcess, Enrollment, CreditBureau,
        Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

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
            "title": "CGT_3",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info(model);
                if ($stateParams.pageId) {
                    var groupId = $stateParams.pageId;
                    PageHelper.showLoader();
                    irfProgressMessage.pop("cgt3-init", "Loading, Please Wait...");
                    GroupProcess.getGroup({
                        groupId: groupId
                    }, function(response, headersGetter) {
                        model.group = _.cloneDeep(response);
                        fillNames(model);
                        model.group.tenure = parseInt(model.group.tenure);
                        model.group.cgt3DoneBy = SessionStore.getUsername();
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
                    "CGT Date : " + item.group.cgtDate3
                ]
            },

            form: [{
                "type":"box",
                "title":"START_CGT3",
                "items":[{
                    "key": "group.groupName",
                    "readonly":true,
                    "title": "GROUP_NAME",
                },{
                    "key": "group.groupCode",
                    "readonly":true,
                    "title": "GROUP_CODE",
                }, {
                    "key": "group.partnerCode",
                    "title": "PARTNER",
                    "readonly":true,
                    "type": "select",
                    "enumCode": "partner"
                },{
                    "key": "group.cgt3Photo",
                    "title": "CGT_3_PHOTO",
                    "category": "Group",
                    "subCategory": "CGT3PHOTO",
                    "type": "file",
                    "fileType": "image/*",
                },{
                    "key": "group.Cgtbutton",
                    "title": "START_CGT3",
                    "type":"button",
                    "onClick":"actions.startCGT3(model,form)"   
                }]
            },{
                "type": "box",
                "title": "END_CGT3",
                "items": [{
                    "key": "group.cgt3DoneBy",
                    "title": "CGT_3_DONE_BY",
                    "readonly": true
                }, {
                    "key": "group.cgt3Latitude",
                    "title": "CGT_3_LOCATION",
                    "type": "geotag",
                    "latitude": "group.cgt3Latitude",
                    "longitude": "group.cgt3Longitude"
                }, {
                    "key": "group.cgt3EndPhoto",
                    "title": "CGT_3_PHOTO",
                    "category": "Group",
                    "subCategory": "CGT3PHOTO",
                    "type": "file",
                    "fileType": "image/*",
                }, {
                    "key": "group.cgt3Remarks",
                    "title": "CGT_3_REMARKS",
                    "type": "textarea"
                },{
                    "key": "group.Cgtbutton",
                    "title": "END_CGT3",
                    "type":"button",
                    "onClick":"actions.endCGT3(model,form)"   
                }]
            },
            {
                "type": "box",
                "title": "GROUP_MEMBERS",
                "items": [{
                    "key": "group.jlgGroupMembers",
                    "type": "array",
                    "title": "GROUP_MEMBERS",
                    "add": null,
                    //"remove": null,
                    "titleExpr": "model.group.jlgGroupMembers[arrayIndex].urnNo + ' : ' + model.group.jlgGroupMembers[arrayIndex].firstName",
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
                    }]
                }]
            }, 
            {
                "type": "actionbox",
                "items": [{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                }, {
                    "type": "button",
                    "title": "PROCEED",
                    "onClick":"actions.submit(model,form,formName)" 
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
                            "centreId": {
                                "title": "CENTRE_CODE",
                                "type": "integer"
                            }
                        }
                    }
                }
            },

            actions: {
                preSave: function(model, form, formName) {},
                startCGT3: function(model, form) {
                    PageHelper.showLoader();
                    model.group.cgtDate3 = new Date();
                    model.group.cgt3DoneBy=SessionStore.getUsername();
                    $log.info("Inside submit()");
                    var reqData = _.cloneDeep(model);
                    reqData.groupAction = 'SAVE';
                    PageHelper.clearErrors();
                    Utils.removeNulls(reqData, true);
                    GroupProcess.updateGroup(reqData, function(res) {
                        irfProgressMessage.pop('group-save', 'Done.', 5000);
                        model.group = _.clone(res.group);
                        fillNames(model);
                        model.group.tenure = parseInt(model.group.tenure);
                        PageHelper.hideLoader();
                    }, function(res) {
                        PageHelper.hideLoader();
                        PageHelper.showErrors(res);
                        irfProgressMessage.pop('group-save', 'Oops. Some error.', 2000); 
                    });
                },
                endCGT3: function(model, form) {
                    if(!model.group.cgtDate3) {
                        irfProgressMessage.pop('CGT-End', 'CGT is not yet started.', 3000);
                        return;
                    }
                    PageHelper.showLoader();
                    model.group.cgtEndDate3 = new Date();
                    model.group.cgt3DoneBy=SessionStore.getUsername();
                    $log.info("Inside submit()");
                    var reqData = _.cloneDeep(model);
                    reqData.groupAction = 'SAVE';
                    GroupProcess.updateGroup(reqData, function(res) {
                        irfProgressMessage.pop('group-save', 'Done.', 5000);
                        Utils.removeNulls(res.group, true);
                        model.group = _.clone(res.group);
                        fillNames(model);
                        model.group.tenure = parseInt(model.group.tenure);
                        PageHelper.hideLoader();
                    }, function(res) {
                        PageHelper.hideLoader();
                        PageHelper.showErrors(res);
                        irfProgressMessage.pop('group-save', 'Oops. Some error.', 2000);
                    });
                },
                submit: function(model, form, formName) {
                    if(!model.group.cgtEndDate3) {
                        irfProgressMessage.pop('CGT-proceed', 'Please End CGT before proceeding.', 3000);
                        return;
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('CGT3-proceed', 'Working...');
                    PageHelper.clearErrors();
                    model.groupAction = "PROCEED";
                    model.group.cgt3DoneBy=SessionStore.getUsername();
                    var reqData = _.cloneDeep(model);
                    GroupProcess.updateGroup(reqData, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('CGT3-proceed', 'Operation Succeeded. Proceeded to Next Stage.', 5000);
                        irfNavigator.goBack();
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('CGT3-proceed', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);
                    });
                }
            }
        }
    }
})