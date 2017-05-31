define({
    pageUID: "loans.group.CGT1",
    pageType: "Engine",
    dependencies: ["$log", "$state", "irfSimpleModal", "Groups","GroupProcess", "Enrollment", "CreditBureau",
        "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, $state, irfSimpleModal, Groups,GroupProcess, Enrollment, CreditBureau,
        Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

        return {
            "type": "schema-form",
            "title": "CGT_1",
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
                        model.group.cgtDate1 = model.group.cgtDate1 || Utils.getCurrentDate();
                        model.group.cgt1DoneBy = SessionStore.getUsername();
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
                "title": "CGT_1",
                "items": [{
                    "key": "group.cgt1DoneBy",
                    "title": "CGT_1_DONE_BY",
                    "readonly": true
                }, {
                    "key": "group.cgtDate1",
                    "type": "text",
                    "title": "CGT_1_DATE",
                    "readonly": true
                }, {
                    "key": "group.cgt1Latitude",
                    "title": "CGT_1_LOCATION",
                    "type": "geotag",
                    "latitude": "group.cgt1Latitude",
                    "longitude": "group.cgt1Longitude"
                }, {
                    "key": "group.cgt1Photo",
                    "title": "CGT_1_PHOTO",
                    "category": "Group",
                    "subCategory": "CGT1PHOTO",
                    "type": "file",
                    "fileType": "image/*",
                    "offline": true
                }, {
                    "key": "group.cgt1Remarks",
                    "title": "CGT_1_REMARKS",
                    "type": "textarea"
                }]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                }, {
                    "type": "submit",
                    "title": "SUBMIT_CGT_1"
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
                submit: function(model, form, formName) {
                    PageHelper.showLoader();
                    irfProgressMessage.pop('CGT1-proceed', 'Working...');
                    PageHelper.clearErrors();
                    model.groupAction = "PROCEED";
                    model.group.cgt1DoneBy=SessionStore.getLoginname()+'-'+model.group.cgt1DoneBy;
                    if(model.group.siteCode=='sambandh')
                    {
                        var n=model.group.jlgGroupMembers.length;
                        var c=0;
                        for(i=0;i<model.group.jlgGroupMembers.length;i++)
                        {
                            if(model.group.jlgGroupMembers[i].loanCycle >0)
                            {
                                c++;
                            }
                        }
                        var percentage=Math.round((c/n)*100);
                        if(percentage > 50)
                        {
                            model.stage='GRT';
                        }
                    }
                    var reqData = _.cloneDeep(model);
                    GroupProcess.updateGroup(reqData, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('CGT1-proceed', 'Operation Succeeded. Proceeded to CGT 2.', 5000);
                        $state.go('Page.GroupDashboard', null);
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('CGT1-proceed', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);
                    });
                }
            }
        }
    }
})