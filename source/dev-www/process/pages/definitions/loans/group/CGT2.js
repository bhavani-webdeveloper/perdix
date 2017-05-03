define({
    pageUID: "loans.group.CGT2",
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
            "title": "CGT_2",
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
                        model.group.cgtDate2 = model.group.cgtDate2 || Utils.getCurrentDate();
                        model.group.cgt2DoneBy = SessionStore.getUsername();
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
                    "CGT Date : " + item.group.cgtDate2
                ]
            },

            form: [{
                "type": "box",
                "title": "CGT_2",
                "items": [{
                    "key": "group.cgt2DoneBy",
                    "title": "CGT_2_DONE_BY",
                    "readonly": true
                }, {
                    "key": "group.cgtDate2",
                    "type": "text",
                    "title": "CGT_2_DATE",
                    "readonly": true
                }, {
                    "key": "group.cgt2Latitude",
                    "title": "CGT_2_LOCATION",
                    "type": "geotag",
                    "latitude": "group.cgt1Latitude",
                    "longitude": "group.cgt1Longitude"
                }, {
                    "key": "group.cgt2Photo",
                    "title": "CGT_2_PHOTO",
                    "category": "Group",
                    "subCategory": "CGT1PHOTO",
                    "type": "file",
                    "fileType": "image/*",
                    "offline": true
                }, {
                    "key": "group.cgt2Remarks",
                    "title": "CGT_2_REMARKS",
                    "type": "textarea"
                }]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                }, {
                    "type": "submit",
                    "title": "SUBMIT_CGT_2"
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
                        irfProgressMessage.pop('cgt2-submit', 'Please fix your form', 5000);
                        return;
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('cgt2-submit', 'Working...');
                    PageHelper.clearErrors();
                    //var reqData = _.cloneDeep(model);
                    var reqData = {
                        "cgtDate": model.group.cgtDate2,
                        "cgtDoneBy": SessionStore.getLoginname()+'-'+model.group.cgt2DoneBy,
                        "groupCode": model.group.groupCode,
                        "latitude": model.group.cgt2Latitude,
                        "longitude": model.group.cgt2Longitude,
                        "partnerCode": model.group.partnerCode,
                        "photoId": model.group.cgt2Photo,
                        "productCode": model.group.productCode,
                        "remarks": model.group.cgt2Remarks
                    };
                    var promise = Groups.post({
                        service: 'process',
                        action: 'cgt'
                    }, reqData, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('cgt2-submit', 'CGT 2 Updated. Proceed to CGT 3.', 5000);
                        /*$state.go('Page.GroupDashboard', {
                            pageName: "GroupDashboard"
                        });*/
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('cgt2-submit', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);

                    });
                }
            }
        }
    }
})