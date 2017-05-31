define({
    pageUID: "loans.group.GRT",
    pageType: "Engine",
    dependencies: ["$log", "$state", "irfSimpleModal", "Groups","GroupProcess","Enrollment", "CreditBureau",
        "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, $state, irfSimpleModal, Groups,GroupProcess, Enrollment, CreditBureau,
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
                if ($stateParams.pageId) {
                    var groupId = $stateParams.pageId;
                    PageHelper.showLoader();
                    irfProgressMessage.pop("cgt1-init", "Loading, Please Wait...");
                    Groups.getGroup({
                        groupId: groupId
                    }, function(response, headersGetter) {
                        model.group = _.cloneDeep(response);
                        model.group.grtDate = model.group.grtDate || Utils.getCurrentDate();
                        for (var i = 1; i < 18; i++) {
                            model.group["udf" + i] = model.group["udf" + i] || false;
                        }
                        model.group.udfDate1 = model.group.udfDate1 || "";
                        model.group.grtDoneBy = SessionStore.getUsername();
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
                "title": "GRT",
                "items": [{
                    "key": "group.grtDoneBy",
                    "title": "GRT_DONE_BY",
                    "readonly": true
                }, {
                    "key": "group.grtDate",
                    "title": "GRT_DATE",
                    "type": "text",
                    "readonly": true
                }, {
                    "key": "group.grtLatitude",
                    "title": "GRT_LOCATION",
                    "type": "geotag",
                    "latitude": "group.grtLatitude",
                    "longitude": "group.grtLongitude"
                }, {
                    "key": "group.grtPhoto",
                    "type": "file",
                    "title": "GRT_PHOTO",
                    "category": "Group",
                    "subCategory": "GRTPHOTO",
                    "fileType": "image/*",
                    "offline": true
                }, {
                    "key": "group.grtRemarks",
                    "title": "GRT_REMARKS",
                    "type": "textarea"
                }, {
                    "key": "group.udfDate1",
                    "title": "DISBURSEMENT_DATE",
                    "type": "date"
                }, {
                    "key": "group.udf1",
                    "title": "QUESTION_1"
                }, {
                    "key": "group.udf2",
                    "title": "QUESTION_2"
                }, {
                    "key": "group.udf3",
                    "title": "QUESTION_3"
                }, {
                    "key": "group.udf4",
                    "title": "QUESTION_4"
                }, {
                    "key": "group.udf5",
                    "title": "QUESTION_5"
                }, {
                    "key": "group.udf6",
                    "title": "QUESTION_6"
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
                        "key": "group.jlgGroupMembers[].isHouseVerified",
                        "title": "IS_HOUSE_VERIFIED",
                        "type": "radios",
                        "titleMap":{
                            "Yes":"Yes",
                            "No":"No"
                        }
                    }, {
                        "key": "group.jlgGroupMembers[].houseLocation",
                        "condition": "model.group.jlgGroupMembers[arrayIndex].isHouseVerified=='Yes'",
                        "title": "HOUSE_LOCATION",
                        "type": "geotag",
                        "latitude": "group.grtLatitude",
                        "longitude": "group.grtLongitude"
                    }, {
                        "key": "group.jlgGroupMembers[].housePhoto",
                        "condition": "model.group.jlgGroupMembers[arrayIndex].isHouseVerified=='Yes'",
                        "title": "HOUSE_PHOTO",
                        "type": "file",
                        "category": "Group",
                        "subCategory": "GRTPHOTO",
                        "fileType": "image/*",
                    }]
                }]
            }, {
                "type": "box",
                "title": "SEND_BACK",
                "items": [{
                    type: "section",
                    items: [{
                        title: "REMARKS",
                        key: "review.remarks",
                        type: "textarea",
                        required: true
                    }, {
                        key: "review.targetStage",
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
                    "title": "SUBMIT_GRT"
                }]
            }],

            schema: function() {
                return Groups.getSchema().$promise;
            },

            actions: {
                preSave: function(model, form, formName) {},
                submit: function(model, form, formName) {
                    PageHelper.showLoader();
                    irfProgressMessage.pop('GRT-proceed', 'Working...');
                    PageHelper.clearErrors();
                    model.groupAction = "PROCEED";
                    model.group.grtDoneBy=SessionStore.getLoginname()+'-'+model.group.grtDoneBy;
                    var reqData = _.cloneDeep(model);
                    GroupProcess.updateGroup(reqData, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('GRT-proceed', 'Operation Succeeded. Proceeded to Applications Pending', 5000);
                        $state.go('Page.GroupDashboard', null);
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