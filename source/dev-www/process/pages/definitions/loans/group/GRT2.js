define({
    pageUID: "loans.group.GRT2",
    pageType: "Engine",
    dependencies: ["$log", "irfSimpleModal", "Groups","GroupProcess","Enrollment", "CreditBureau",
        "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, irfSimpleModal, Groups,GroupProcess, Enrollment, CreditBureau,
        Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

        var nDays = 15;
        var fixData = function(model) {
            model.group.tenure = parseInt(model.group.tenure);
            if (model.group.udf1 == "true") model.group.udf1 = true;
            if (model.group.udf2 == "true") model.group.udf2 = true;
            if (model.group.udf3 == "true") model.group.udf3 = true;
            if (model.group.udf4 == "true") model.group.udf4 = true;
            if (model.group.udf5 == "true") model.group.udf5 = true;
            if (model.group.udf6 == "true") model.group.udf6 = true;

            if(model.siteCode == 'sambandh') {
                if (model.group.udf7 == "true") model.group.udf7 = true;
                if (model.group.udf8 == "true") model.group.udf8 = true;
                if (model.group.udf9 == "true") model.group.udf9 = true;
                if (model.group.udf10 == "true") model.group.udf10 = true;
                if (model.group.udf11 == "true") model.group.udf11 = true;
                if (model.group.udf12 == "true") model.group.udf12 = true;
                if (model.group.udf13 == "true") model.group.udf13 = true;
                if (model.group.udf14 == "true") model.group.udf14 = true;
                if (model.group.udf15 == "true") model.group.udf15 = true;
                if (model.group.udf16 == "true") model.group.udf16 = true;
                if (model.group.udf17 == "true") model.group.udf17 = true;
                if (model.group.udf18 == "true") model.group.udf18 = true;
                if (model.group.udf19 == "true") model.group.udf19 = true;
                if (model.group.udf20 == "true") model.group.udf20 = true;
                if (model.group.udf21 == "true") model.group.udf21 = true;
                if (model.group.udf22 == "true") model.group.udf22 = true;
            }

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
            "title": "GRT2",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info(model);
                model.group = model.group || {};
                model.review = model.review || {};
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
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
                        model.group.cgt3DoneBy = model.group.cgt3DoneBy || SessionStore.getUsername();
                        model.group.groupRemarks = null;
                        fixData(model);
                        if (model.group.jlgGroupMembers.length > 0) {
                            fillNames(model).then(function(m) {
                                model = m;
                                Queries.getGroupLoanRemarksHistoryById(model.group.id).then(function(resp){
                                    model.group.remarksHistory = resp;
                                }).finally(function(){
                                    PageHelper.hideLoader();
                                });
                            }, function(m) {
                                PageHelper.showErrors(m);
                                PageHelper.hideLoader();
                                irfProgressMessage.pop("group-init", "Oops. An error occurred", 2000);
                            });
                        }
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
                    "GRT Date : " + item.group.cgtDate3
                ]
            },

            form: [{
                "type":"box",
                "title":"START_GRT",
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
                    "key": "group.cgt3Photo",
                    "title": "GRT_2_PHOTO",
                    required: true,
                    "category": "Group",
                    "subCategory": "CGT3PHOTO",
                    "type": "file",
                    "fileType": "image/*",
                },{
                    "key": "group.Cgtbutton",
                    "title": "START_GRT",
                    "type":"button",
                    "onClick":"actions.startGRT(model,form)"   
                }]

            }, {
                "type": "box",
                "title": "END_GRT",
                "items": [{
                    "key": "group.cgt3DoneBy",
                    "title": "GRT_DONE_BY",
                    "readonly": true
                }, {
                    "key": "group.cgt3Latitude",
                    "title": "GRT_LOCATION",
                    "type": "geotag",
                    "latitude": "group.cgt3Latitude",
                    "longitude": "group.cgt3Longitude"
                }, {
                    "key": "group.cgt3EndPhoto",
                    "type": "file",
                    required: true,
                    "title": "GRT_PHOTO",
                    "category": "Group",
                    "subCategory": "CGT3PHOTO",
                    "fileType": "image/*",
                }, {
                    "key": "group.udf1",
                    "required":true,
                    "type":"checkbox",
                    "schema":{
                        "default":false
                    },
                    "title": "QUESTION_1"
                }, {
                    "key": "group.udf2",
                    "required":true,
                    "type":"checkbox",
                    "schema":{
                        "default":false
                    },
                    "title": "QUESTION_2"
                }, {
                    "key": "group.udf3",
                    "required":true,
                    "type":"checkbox",
                    "schema":{
                        "default":false
                    },
                    "title": "QUESTION_3"
                }, {
                    "key": "group.udf4",
                    "required":true,
                    "type":"checkbox",
                    "schema":{
                        "default":false
                    },
                    "title": "QUESTION_4"
                }, {
                    "key": "group.udf5",
                    "required":true,
                    "type":"checkbox",
                    "schema":{
                        "default":false
                    },
                    "title": "QUESTION_5"
                }, {
                    "key": "group.udf6",
                    "required":true,
                    "type":"checkbox",
                    "schema":{
                        "default":false
                    },
                    "title": "QUESTION_6"
                }, {
                    "key": "group.udf7",
                    "required":true,
                    "type":"checkbox",
                    "schema":{
                        "default":false
                    },
                    "title": "QUESTION_7"
                }, {
                    "key": "group.udf8",
                    "required":true,
                    "type":"checkbox",
                    "schema":{
                        "default":false
                    },
                    "title": "QUESTION_8"
                }, {
                    "key": "group.udf9",
                    "required":true,
                    "type":"checkbox",
                    "schema":{
                        "default":false
                    },
                    "title": "QUESTION_9"
                }, {
                    "key": "group.udf10",
                    "required":true,
                    "type":"checkbox",
                    "schema":{
                        "default":false
                    },
                    "title": "QUESTION_10"
                }, {
                    "key": "group.udf11",
                    "required":true,
                    "type":"checkbox",
                    "schema":{
                        "default":false
                    },
                    "title": "QUESTION_11"
                }, {
                    "key": "group.udf12",
                    "required":true,
                    "type":"checkbox",
                    "schema":{
                        "default":false
                    },
                    "title": "QUESTION_12"
                }, {
                    "key": "group.udf13",
                    "required":true,
                    "type":"checkbox",
                    "schema":{
                        "default":false
                    },
                    "title": "QUESTION_13"
                }, {
                    "key": "group.udf14",
                    "required":true,
                    "type":"checkbox",
                    "schema":{
                        "default":false
                    },
                    "title": "QUESTION_14"
                }, {
                    "key": "group.udf15",
                    "required":true,
                    "type":"checkbox",
                    "schema":{
                        "default":false
                    },
                    "title": "QUESTION_15"
                }, {
                    "key": "group.udf16",
                    "required":true,
                    "type":"checkbox",
                    "schema":{
                        "default":false
                    },
                    "title": "QUESTION_16"
                }, {
                    "key": "group.udf17",
                    "required":true,
                    "type":"checkbox",
                    "schema":{
                        "default":false
                    },
                    "title": "QUESTION_17"
                }, {
                    "key": "group.Cgtbutton",
                    "title": "END_GRT",
                    "type":"button",
                    "onClick":"actions.endGRT(model,form)"   
                }, {
                    "key": "group.cgt3Remarks",
                    "title": "GRT_REMARKS",
                    "type": "textarea"
                }]
            }, {
                "type": "box",
                "title": "GROUP_MEMBERS",
                "items": [{
                    "key": "group.scheduledDisbursementDate",
                    "title": "SCHEDULED_DISBURSEMENT_DATE",
                    "readonly":true,
                    "type": "date",
                },{
                    "key": "group.firstRepaymentDate",
                    "title": "FIRST_REPAYMENT_DATE",
                    "readonly":true,
                    "type": "date",
                },
                {
                    "key": "group.jlgGroupMembers",
                    "type": "array",
                    "title": "GROUP_MEMBERS",
                    "add": null,
                    //"remove": null,
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
                    },]
                }]
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
            },{
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
                            "title": "PROCEED"
                        }]
                    }
                ]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                }]
            }],

            schema: function() {
                return Groups.getSchema().$promise;
            },

            actions: {
                preSave: function(model, form, formName) {},
                startGRT: function(model, form) {
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
                        model.group = _.cloneDeep(res.group);
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
                    }, function(res) {
                        PageHelper.hideLoader();
                        PageHelper.showErrors(res);
                        irfProgressMessage.pop('group-save', 'Oops. Some error.', 2000); 
                    });
                },
                endGRT: function(model, form) {
                    if(!model.group.cgtDate3) {
                        irfProgressMessage.pop('GRT-End', 'GRT is not yet started.', 3000);
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
                        model.group = _.cloneDeep(res.group);
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
                    }, function(res) {
                        PageHelper.hideLoader();
                        PageHelper.showErrors(res);
                        irfProgressMessage.pop('group-save', 'Oops. Some error.', 2000);
                    });
                },
                submit: function(model, form, formName) {

                    if(!model.group.cgtEndDate3) {
                        irfProgressMessage.pop('GRT-proceed', 'Please End GRT before proceeding with the action.', 3000);
                        return;
                    }

                    PageHelper.showLoader();
                    irfProgressMessage.pop('GRT-proceed', 'Working...');
                    PageHelper.clearErrors();
                    model.groupAction = "PROCEED";
                    model.group.cgt3DoneBy=SessionStore.getUsername();
                    if (model.group.firstRepaymentDate || model.group.scheduledDisbursementDate) {
                        for (i = 0; i < model.group.jlgGroupMembers.length; i++) {
                            model.group.jlgGroupMembers[i].scheduledDisbursementDate = model.group.scheduledDisbursementDate;
                            model.group.jlgGroupMembers[i].firstRepaymentDate = model.group.firstRepaymentDate;
                        }
                    }
                    var reqData = _.cloneDeep(model);
                    GroupProcess.updateGroup(reqData, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('GRT-proceed', 'Operation Succeeded. Proceeded to Applications Pending', 5000);
                        irfNavigator.goBack();
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('GRT-proceed', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);
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
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('GRT-proceed', 'Operation Succeeded. Done', 5000);
                        irfNavigator.goBack();
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('GRT-proceed', 'Oops. Some error.', 2000);
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