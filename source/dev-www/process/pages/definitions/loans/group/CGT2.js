define({
    pageUID: "loans.group.CGT2",
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
            "title": "CGT_2",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info(model);
                model.review = model.review || {};
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
                if ($stateParams.pageId) {
                    var groupId = $stateParams.pageId;
                    PageHelper.showLoader();
                    irfProgressMessage.pop("cgt1-init", "Loading, Please Wait...");
                    GroupProcess.getGroup({
                        groupId: groupId
                    }, function(response, headersGetter) {
                        model.group = _.cloneDeep(response);
                        model.group.cgt2DoneBy = SessionStore.getUsername();
                        model.group.groupRemarks = null;
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
                                irfProgressMessage.pop("group-init", "Oops. An error occurred", 2000);
                                PageHelper.hideLoader();        
                            });
                        }
                    }, function(resp) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("group-init", "Oops. An error occurred", 2000);
                        //backToDashboard();
                    });
                } else {
                    irfNavigator.goBack();
                }
            },
            newOffline: true,
            // offlineInitialize: function(model, form, formCtrl) {}, // optional offline only initialize
            form: [{
                "type":"box",
                "title":"START_CGT2",
                "items":[{
                    "key": "group.groupName",
                    readonly: true,
                    "title": "GROUP_NAME",
                }, {
                    "key": "group.groupCode",
                    "readonly":true,
                    "title": "GROUP_CODE",
                }, {
                    "key": "group.partnerCode",
                    "title": "PARTNER",
                    "readonly":true,
                    "type": "select",
                    "enumCode": "partner"
                }, {
                    "key": "group.branchId",
                    "title": "BRANCH_NAME",
                    readonly: true,
                    "type": "select",
                    "enumCode": "branch_id",
                    "parentEnumCode": "bank",
                    "parentValueExpr": "model.group.bankId",
                }, {
                    "key": "group.centreCode",
                    "title": "CENTRE_CODE",
                    readonly: true,
                    "type": "select",
                    "enumCode": "centre_code",
                    "parentEnumCode": "branch_id",
                    "parentValueExpr": "model.group.branchId",
                }, {
                    "key": "group.cgt2Photo",
                    required: true,
                    "title": "CGT_2_PHOTO",
                    "category": "Group",
                    "subCategory": "CGT1PHOTO",
                    "type": "file",
                    "fileType": "image/*",
                },{
                    "key": "group.Cgtbutton",
                    "title": "START_CGT2",
                    "type":"button",
                    "onClick":"actions.startCGT2(model,form)"   
                }]

            },{
                "type": "box",
                "title": "END_CGT2",
                "items": [{
                    "key": "group.cgt2DoneBy",
                    "title": "CGT_2_DONE_BY",
                    "readonly": true
                }, {
                    "key": "group.cgt2Latitude",
                    "condition": "model.siteCode == 'KGFS'",
                    "title": "CGT_2_LOCATION",
                    "type": "geotag",
                    "latitude": "group.cgt2Latitude",
                    "longitude": "group.cgt2Longitude"
                }, {
                    "key": "group.cgt2Latitude",
                    required: true,
                    "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                    "title": "CGT_2_LOCATION",
                    "type": "geotag",
                    "latitude": "group.cgt2Latitude",
                    "longitude": "group.cgt2Longitude"
                }, {
                    "key": "group.cgt2EndPhoto",
                    required: true,
                    "title": "CGT_2_PHOTO",
                    "category": "Group",
                    "subCategory": "CGT2PHOTO",
                    "type": "file",
                    "fileType": "image/*",
                }, {
                    "key": "group.Cgtbutton",
                    "title": "END_CGT2",
                    "type":"button",
                    "onClick":"actions.endCGT2(model,form)"   
                }, {
                    title: "CGT_2_REMARKS",
                    key: "group.cgt2Remarks",
                    type: "textarea",
                    required: true
                },]
            }, { 
                "type": "box",
                "title": "GROUP_MEMBERS",
                "items": [
                    {
                        "key": "group.jlgGroupMembers",
                        "condition": "model.siteCode == 'KGFS'",
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
                        }]
                    },
                    {
                        "key": "group.jlgGroupMembers",
                        "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                        "type": "array",
                        "title": "GROUP_MEMBERS",
                        "add": null,
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
                        }]
                    }
                ]
            }, {
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
            }, {
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
                        }, {
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
                                    // var stage1 = model.group.currentStage;
                                    // var targetstage = formHelper.enum('groupLoanBackStages').data;
                                    var out = [{name: "Rejected"}];
                                    // for (var i = 0; i < targetstage.length; i++) {
                                    //     var t = targetstage[i];
                                    //     if (t.name == stage1 && 'default' == t.field2) {
                                    //         out.push({
                                    //             name: t.field1,
                                    //         });
                                    //         break;
                                    //     }
                                    // }
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
                            "title": "PROCEED"
                        }]
                    }
                ]
            },],

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
                // preSave: function(model, form, formName) {},
                startCGT2: function(model, form) {
                    PageHelper.showLoader();
                    model.group.cgtDate2 = new Date();
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
                endCGT2: function(model, form) {
                    if(!model.group.cgtDate2) {
                        irfProgressMessage.pop('CGT-End', 'CGT is not yet started.', 3000);
                        return;
                    }
                    PageHelper.showLoader();
                    model.group.cgtEndDate2 = new Date();
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
                    if(!model.group.cgtEndDate2) {
                        irfProgressMessage.pop('CGT-proceed', 'Please End CGT before proceeding.', 3000);
                        return;
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('CGT2-proceed', 'Working...');
                    PageHelper.clearErrors();
                    model.groupAction = "PROCEED";
                    model.group.cgt2DoneBy=SessionStore.getUsername();
                    var validPromiseArray = [];
                    if(model.siteCode=='sambandh' || model.siteCode=='saija')
                    {
                        var numOfMembers = model.group.jlgGroupMembers.length;
                        var oldCustomers =0;
                        for(i=0; i<model.group.jlgGroupMembers.length; i++)
                        {
                            if(model.group.jlgGroupMembers[i].loanCycle && model.group.jlgGroupMembers[i].loanCycle > 1)
                            {
                                oldCustomers++;
                            }
                        }
                        if(oldCustomers >= (numOfMembers/2))
                        {
                            model.stage='GRT';

                            var cbPromise = GroupProcess.isCBCheckValid(model);
                            validPromiseArray.push(cbPromise);
                        }
                    }
                
                    var reqData = _.cloneDeep(model);
                    $q.all(validPromiseArray).then(function(){ 
                        GroupProcess.updateGroup(reqData, function(res) {
                            formHelper.newOffline.deleteOffline($stateParams.pageName, model);
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('CGT2-proceed', 'Operation Succeeded. Proceeded to CGT 3.', 5000);
                            irfNavigator.goBack();
                        }, function(res) {
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('CGT2-proceed', 'Oops. Some error.', 2000);
                            PageHelper.showErrors(res);
                        });
                    }, function (respErr){
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('CGT2-proceed', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(respErr);
                    });
                },
                sendBack: function(model, form, formName) {
                    if (!model.review.targetStage){
                        irfProgressMessage.pop('Send Back', "Send to Stage is mandatory", 2000);
                        return false;
                    }
                    if (!model.group.groupRemarks){
                        irfProgressMessage.pop('Reject', "Remarks is mandatory", 2000);
                        return false;
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('Send Back', 'Working...');
                    PageHelper.clearErrors();
                    model.groupAction = "PROCEED";                    
                    var reqData = _.cloneDeep(model);
                    reqData.stage = model.review.targetStage;
                    GroupProcess.updateGroup(reqData, function(res) {
                        formHelper.newOffline.deleteOffline($stateParams.pageName, model);
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
                        formHelper.newOffline.deleteOffline($stateParams.pageName, model);
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