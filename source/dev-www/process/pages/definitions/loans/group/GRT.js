define({
    pageUID: "loans.group.GRT",
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
            "title": "GRT",
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
                "type":"box",
                "title":"START_GRT",
                "items":[{
                    "key": "group.grtPhoto",
                    "title": "GRT_PHOTO",
                    "category": "Group",
                    "subCategory": "GRTPHOTO",
                    "type": "file",
                    "fileType": "image/*",
                },{
                    "key": "group.Cgtbutton",
                    "title": "START_GRT",
                    "type":"button",
                    "onClick":"actions.startGRT(model,form)"   
                }]

            },{
                "type": "box",
                "title": "END_GRT",
                "items": [{
                    "key": "group.grtDoneBy",
                    "title": "GRT_DONE_BY",
                    "readonly": true
                },{
                    "key": "group.grtLatitude",
                    "title": "GRT_LOCATION",
                    "type": "geotag",
                    "latitude": "group.grtLatitude",
                    "longitude": "group.grtLongitude"
                }, {
                    "key": "group.grtEndPhoto",
                    "type": "file",
                    "title": "GRT_PHOTO",
                    "category": "Group",
                    "subCategory": "GRTPHOTO",
                    "fileType": "image/*",
                }, {
                    "key": "group.grtRemarks",
                    "title": "GRT_REMARKS",
                    "type": "textarea"
                },{
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
                }]
            }, {
                "type": "box",
                "title": "GROUP_MEMBERS",
                "items": [{
                    "key": "group.scheduledDisbursementDate",
                    "title": "SCHEDULED_DISBURSEMENT_DATE",
                    "required":true,
                    "type": "date",
                },{
                    "key": "group.firstRepaymentDate",
                    "title": "FIRST_REPAYMENT_DATE",
                    "required":true,
                    "type": "date",
                },
                {
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
                    }, {
                        "key": "group.jlgGroupMembers[].isHouseVerificationDone",
                        "title": "IS_HOUSE_VERIFIED",
                        "type": "checkbox",
                         schema: { default:true }
                    }, {
                        "key": "group.jlgGroupMembers[].latitude",
                        "condition": "model.group.jlgGroupMembers[arrayIndex].isHouseVerificationDone==true",
                        "title": "HOUSE_LOCATION",
                        "type": "geotag",
                        "latitude": "group.jlgGroupMembers[].latitude",
                        "longitude":"group.jlgGroupMembers[].longitude"
                    }, {
                        "key": "group.jlgGroupMembers[].photoImageId1",
                        "condition": "model.group.jlgGroupMembers[arrayIndex].isHouseVerificationDone==true",
                        "title": "HOUSE_PHOTO",
                        "type": "file",
                        "category": "Group",
                        "subCategory": "GRTPHOTO",
                        "fileType": "image/*",
                    },{
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
                },{
                    "key": "group.Cgtbutton",
                    "title": "END_GRT",
                    "type":"button",
                    "onClick":"actions.endGRT(model,form)"   
                }]
            }, {
                "type": "box",
                "title": "SEND_BACK",
                "items": [
                {
                    type: "section",
                    items: [
                    {
                        key: "group.review",
                        type: "checkbox",
                        schema:{
                            "default":false
                        },
                        "title":"SEND_BACK"                          
                    },
                    {
                        title: "REMARKS",
                        condition:"model.group.review == true",
                        key: "review.remarks",
                        type: "textarea",
                        required: true
                    }, {
                        key: "review.targetStage",
                        condition:"model.group.review == true",
                        type: "lov",
                        autolov: true,
                        lovonly: true,
                        title: "SEND_BACK_TO_STAGE",
                        bindMap: {},
                        searchHelper: formHelper,
                        search: function(inputModel, form, model, context) {
                            var stage1 = model.currentStage;
                            var targetstage = formHelper.enum('targetstage').data;
                            var out = [];
                            for (var i = 0; i < targetstage.length; i++) {
                                var t = targetstage[i];
                                if (t.field1 == stage1) {
                                    out.push({
                                        name: t.name,
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
                        condition:"model.group.review == true",
                        type: "button",
                        title: "SEND_BACK",
                        onClick: "actions.sendBack(model, formCtrl, form, $event)"
                    }]
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
                startGRT: function(model, form) {
                    PageHelper.showLoader();
                    model.group.grtDate = new Date();
                    model.group.grtDoneBy=SessionStore.getUsername();
                    if (model.group.firstRepaymentDate || model.group.scheduledDisbursementDate) {
                        for (i = 0; i < model.group.jlgGroupMembers.length; i++) {
                            model.group.jlgGroupMembers[i].scheduledDisbursementDate = model.group.scheduledDisbursementDate;
                            model.group.jlgGroupMembers[i].firstRepaymentDate = model.group.firstRepaymentDate;
                        }
                    }
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
                    PageHelper.showLoader();
                    model.group.grtEndDate = new Date();
                    model.group.grtDoneBy=SessionStore.getUsername();
                    if (model.group.firstRepaymentDate || model.group.scheduledDisbursementDate) {
                        for (i = 0; i < model.group.jlgGroupMembers.length; i++) {
                            model.group.jlgGroupMembers[i].scheduledDisbursementDate = model.group.scheduledDisbursementDate;
                            model.group.jlgGroupMembers[i].firstRepaymentDate = model.group.firstRepaymentDate;
                        }
                    }
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
                    PageHelper.showLoader();
                    irfProgressMessage.pop('GRT-proceed', 'Working...');
                    PageHelper.clearErrors();
                    model.groupAction = "PROCEED";
                    model.group.grtDoneBy=SessionStore.getUsername();
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
                }
            }
        }
    }
})