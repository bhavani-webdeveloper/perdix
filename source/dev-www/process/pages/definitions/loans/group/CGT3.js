define({
    pageUID: "loans.group.CGT3",
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
            "title": "CGT_3",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info(model);
                if ($stateParams.pageId) {
                    var groupId = $stateParams.pageId;
                    PageHelper.showLoader();
                    irfProgressMessage.pop("cgt3-init", "Loading, Please Wait...");
                    Groups.getGroup({
                        groupId: groupId
                    }, function(response, headersGetter) {
                        model.group = _.cloneDeep(response);
                        model.group.cgtDate3 = model.group.cgtDate3 || Utils.getCurrentDate();
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
                "type": "box",
                "title": "CGT_3",
                "items": [{
                    "key": "group.cgt3DoneBy",
                    "title": "CGT_3_DONE_BY",
                    "readonly": true
                }, {
                    "key": "group.cgtDate3",
                    "type": "text",
                    "title": "CGT_3_DATE",
                    "readonly": true
                }, {
                    "key": "group.cgt1Latitude",
                    "title": "CGT_3_LOCATION",
                    "type": "geotag",
                    "latitude": "group.cgt3Latitude",
                    "longitude": "group.cgt3Longitude"
                }, {
                    "key": "group.cgt3Photo",
                    "title": "CGT_3_PHOTO",
                    "category": "Group",
                    "subCategory": "CGT1PHOTO",
                    "type": "file",
                    "fileType": "image/*",
                    "offline": true
                }, {
                    "key": "group.cgt3Remarks",
                    "title": "CGT_3_REMARKS",
                    "type": "textarea"
                }]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                }, {
                    "type": "submit",
                    "title": "SUBMIT_CGT_3"
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
                    irfProgressMessage.pop('CGT3-proceed', 'Working...');
                    PageHelper.clearErrors();
                    model.groupAction = "PROCEED";
                    model.group.cgt3DoneBy=SessionStore.getLoginname()+'-'+model.group.cgt3DoneBy;
                    var reqData = _.cloneDeep(model);
                    GroupProcess.updateGroup(reqData, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('CGT3-proceed', 'Operation Succeeded. Proceeded to CGT 3.', 5000);
                        $state.go('Page.GroupDashboard', null);
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