define({
    pageUID: "loans.group.CGT3",
    pageType: "Engine",
    dependencies: ["$log", "$state", "irfSimpleModal", "Groups", "Enrollment", "CreditBureau",
        "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, $state, irfSimpleModal, Groups, Enrollment, CreditBureau,
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
                    model.enrollmentAction = 'PROCEED';
                    if (form.$invalid) {
                        irfProgressMessage.pop('cgt3-submit', 'Please fix your form', 5000);
                        return;
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('cgt3-submit', 'Working...');
                    PageHelper.clearErrors();
                    //var reqData = _.cloneDeep(model);
                    var reqData = {
                        "cgtDate": model.group.cgtDate3,
                        "cgtDoneBy": model.group.cgt3DoneBy,
                        "groupCode": model.group.groupCode,
                        "latitude": model.group.cgt3Latitude,
                        "longitude": model.group.cgt3Longitude,
                        "partnerCode": model.group.partnerCode,
                        "photoId": model.group.cgt3Photo,
                        "productCode": model.group.productCode,
                        "remarks": model.group.cgt3Remarks
                    };
                    var promise = Groups.post({
                        service: 'process',
                        action: 'cgt'
                    }, reqData, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('cgt3-submit', 'CGT 3 Updated. Proceed to GRT.', 5000);
                        $state.go('Page.GroupDashboard', {
                            pageName: "GroupDashboard"
                        });
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('cgt3-submit', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);
                    });
                }
            }
        }
    }
})