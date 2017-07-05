define({
    pageUID: "loans.group.CGT1",
    pageType: "Engine",
    dependencies: ["$log", "$state", "irfSimpleModal","GroupProcess", "Enrollment", "CreditBureau",
        "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, $state, irfSimpleModal, GroupProcess, Enrollment, CreditBureau,
        Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

        var saveData = function(reqData) {
            PageHelper.showLoader();
            irfProgressMessage.pop('group-save', 'Working...');
            var deferred = $q.defer();
            if (reqData.group.id) {
                deferred.reject(true);
                $log.info("Group id not null, skipping save");
            } else {
                reqData.groupAction = 'SAVE';
                //reqData.group.groupFormationDate = Utils.getCurrentDate();
                PageHelper.clearErrors();
                Utils.removeNulls(reqData, true);
                GroupProcess.save(reqData, function(res) {
                    irfProgressMessage.pop('group-save', 'Done.', 5000);
                    deferred.resolve(res);
                }, function(res) {
                    PageHelper.hideLoader();
                    PageHelper.showErrors(res);
                    irfProgressMessage.pop('group-save', 'Oops. Some error.', 2000);
                    deferred.reject(false);
                });
            }
            return deferred.promise;
        };

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
                    GroupProcess.getGroup({
                        groupId: groupId
                    }, function(response, headersGetter) {
                        model.group = _.cloneDeep(response);
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
                "type":"box",
                "title":"START_CGT1",
                "items":[{
                    "key": "group.cgt1Photo",
                    "title": "CGT_1_PHOTO",
                    "category": "Group",
                    "subCategory": "CGT1PHOTO",
                    "type": "file",
                    "fileType": "image/*",
                },{
                    "key": "group.Cgtbutton",
                    "title": "START_CGT1",
                    "type":"button",
                    "onClick":"actions.startCGT1(model,form)"   
                }]

            },
                {
                "type": "box",
                "title": "END_CGT1",
                "items": [{
                    "key": "group.cgt1DoneBy",
                    "title": "CGT_1_DONE_BY",
                    "readonly": true
                },{
                    "key": "group.cgt1Latitude",
                    "title": "CGT_1_LOCATION",
                    "type": "geotag",
                    "latitude": "group.cgt1Latitude",
                    "longitude": "group.cgt1Longitude"
                }, {
                    "key": "group.cgt1EndPhoto",
                    "title": "CGT_1_PHOTO",
                    "category": "Group",
                    "subCategory": "CGT1PHOTO",
                    "type": "file",
                    "fileType": "image/*",
                }, {
                    "key": "group.cgt1Remarks",
                    "title": "CGT_1_REMARKS",
                    "type": "textarea"
                },{
                    "key": "group.Cgtbutton",
                    "title": "END_CGT1",
                    "type":"button",
                    "onClick":"actions.endCGT1(model,form)"   
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
                startCGT1: function(model, form) {
                    model.group.cgtDate1 = new Date();
                    $log.info("Inside submit()");
                    var reqData = _.cloneDeep(model);
                    reqData.groupAction = 'SAVE';
                    PageHelper.clearErrors();
                    Utils.removeNulls(reqData, true);
                    GroupProcess.updateGroup(reqData, function(res) {
                        irfProgressMessage.pop('group-save', 'Done.', 5000);
                        model.group = _.clone(res.group);
                        PageHelper.hideLoader();
                    }, function(res) {
                        PageHelper.hideLoader();
                        PageHelper.showErrors(res);
                        irfProgressMessage.pop('group-save', 'Oops. Some error.', 2000);
                    });
                },
                endCGT1: function(model, form) {
                    model.group.cgtEndDate1 = new Date();
                    $log.info("Inside submit()");
                    var reqData = _.cloneDeep(model);
                    reqData.groupAction = 'SAVE';
                    GroupProcess.updateGroup(reqData, function(res) {
                        irfProgressMessage.pop('group-save', 'Done.', 5000);
                        model.group = _.clone(res.group);
                        PageHelper.hideLoader();
                    }, function(res) {
                        PageHelper.hideLoader();
                        PageHelper.showErrors(res);
                        irfProgressMessage.pop('group-save', 'Oops. Some error.', 2000);
                    });
                },
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