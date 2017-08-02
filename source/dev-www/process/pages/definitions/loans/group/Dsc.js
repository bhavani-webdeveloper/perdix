define({
    pageUID: "loans.group.Dsc",
    pageType: "Engine",
    dependencies: ["$log", "irfSimpleModal", "Groups","GroupProcess", "Enrollment", "CreditBureau", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, irfSimpleModal, Groups,GroupProcess, Enrollment, CreditBureau, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {


        var nDays = 15;

        function showDscData(dscId) {
            PageHelper.showLoader();
            Groups.getDSCData({
                dscId: dscId
            }, function(resp, headers) {
                PageHelper.hideLoader();
                var dataHtml = "<table class='table table-striped table-bordered table-responsive'>";
                dataHtml += "<tr><td>Response : </td><td>" + resp.response + "</td></tr>";
                dataHtml += "<tr><td>Response Message: </td><td>" + resp.responseMessage + "</td></tr>";
                dataHtml += "<tr><td>Stop Response: </td><td>" + resp.stopResponse + "</td></tr>";
                dataHtml += "</table>"
                irfSimpleModal('DSC Check Details', dataHtml);
            }, function(res) {
                PageHelper.showErrors(res);
                PageHelper.hideLoader();
            });
        };

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
            "title": "GROUP",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.group = model.group || {};
                var branch1 = formHelper.enum('branch_id').data;
                var centres = SessionStore.getCentres();
                model.group.branchId = model.group.branchId || SessionStore.getCurrentBranch().branchId;
                for (var i = 0; i < branch1.length; i++) {
                    if ((branch1[i].value) == model.group.branchId) {
                        model.group.branchName = branch1[i].name;
                    }
                }
                model.group.centreId = model.group.centreId || ((_.isArray(centres) && centres.length > 0) ? centres[0].value : model.group.centreId);
                $log.info(model.group.branchName);
                if ($stateParams.pageId) {
                    var groupId = $stateParams.pageId;
                    PageHelper.showLoader();
                    irfProgressMessage.pop("group-init", "Loading, Please Wait...");
                    GroupProcess.getGroup({
                        groupId: groupId
                    }, function(response, headersGetter) {
                        model.group = _.cloneDeep(response);
                        fixData(model);
                        if (model.group.jlgGroupMembers.length > 0) {
                            fillNames(model).then(function(m) {
                                model = m;
                                PageHelper.hideLoader();
                            }, function(m) {
                                PageHelper.showErrors(m);
                                PageHelper.hideLoader();
                                irfProgressMessage.pop("group-init", "Oops. An error occurred", 2000);
                            });
                        } else {
                            PageHelper.hideLoader();
                            irfProgressMessage.pop("group-init", "Load Complete. No Group Members Found", 2000);
                            backToDashboard();
                        }
                    }, function(resp) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("group-init", "Oops. An error occurred", 2000);
                        backToDashboard();
                    });
                }
            },
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return [
                    item.journal.transactionName
                ]
            },

            form: [{
                    "type": "box",
                    "readonly": true,
                    "title": "GROUP_DETAILS",
                    "items": [{
                        "key": "group.groupName",
                        "title": "GROUP_NAME",
                    }, {
                        "key": "group.partnerCode",
                        "title": "PARTNER",
                        "type": "select",
                        "enumCode": "partner"
                            //readonly: readonly
                    }, {
                        "key": "group.centreCode",
                        "title": "CENTRE_CODE",
                        "type": "select",
                        "enumCode": "centre_code",
                        "parentEnumCode": "branch_id",
                        "parentValueExpr": "model.group.branchId",
                            //readonly: readonly
                    }, {
                        "key": "group.productCode",
                        "title": "PRODUCT",
                        "type": "select",
                        "enumCode": "loan_product",
                        "parentEnumCode": "partner",
                        "parentValueExpr": "model.group.partnerCode"
                            //readonly: readonly,
                    }, {
                        "key": "group.frequency",
                        "title": "FREQUENCY",
                        "type": "select",
                        "titleMap": {
                            "M": "Monthly",
                            "Q": "Quarterly"
                        }
                    }, {
                        "key": "group.tenure",
                        "title": "TENURE",
                    }]
                }, {
                    "type": "box",
                    "title": "GROUP_MEMBERS",
                    "items": [{
                        "key": "group.jlgGroupMembers",
                        "type": "array",
                        "title": "GROUP_MEMBERS",
                        "add": null,
                        "items": [{
                            "key": "group.jlgGroupMembers[].urnNo",
                            "readonly": true,
                            "title": "URN_NO"
                        }, {
                            "key": "group.jlgGroupMembers[].firstName",
                            "readonly": true,
                            "type": "string",
                            //"readonly": true,
                            "title": "GROUP_MEMBER_NAME"
                        }, {
                            "key": "group.jlgGroupMembers[].husbandOrFatherFirstName",
                            "readonly": true,
                            "title": "FATHER_NAME"
                                //"readonly": readonly
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
                                //"readonly": readonly
                        }, {
                            type: "fieldset",
                            "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus && model.group.currentStage == 'DSC'",
                            title: "DSC_STATUS",
                            items: [{
                                "key": "group.jlgGroupMembers[].dscStatus",
                                "title": "DSC_STATUS",
                                "readonly": true,
                                "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus"
                            }, {
                                "key": "group.jlgGroupMembers[].requestDSCOverride",
                                "type": "button",
                                "title": "REQUEST_DSC_OVERRIDE",
                                "icon": "fa fa-reply",
                                "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED'",
                                "onClick": function(model, formCtrl, form, event) {
                                    console.log(form);
                                    console.warn(event);
                                    var i = event['arrayIndex'];
                                    PageHelper.clearErrors();
                                    var urnNo = model.group.jlgGroupMembers[i].urnNo;
                                    PageHelper.showLoader();
                                    $log.info("Requesting DSC override for ", urnNo);
                                    irfProgressMessage.pop('group-dsc-override-req', 'Requesting DSC Override');
                                    Groups.post({
                                        service: "dscoverriderequest",
                                        urnNo: urnNo,
                                        groupCode: model.group.groupCode,
                                        productCode: model.group.productCode
                                    }, {}, function(resp, header) {
                                        $log.warn(resp);
                                        irfProgressMessage.pop('group-dsc-override-req', 'Almost Done...');
                                        //var screenMode = model.group.screenMode;
                                        GroupProcess.getGroup({
                                            groupId: model.group.id
                                        }, function(response, headersGetter) {
                                            PageHelper.hideLoader();
                                            irfProgressMessage.pop('group-dsc-override-req', 'DSC Override Requested', 2000);
                                            model.group = _.cloneDeep(response);
                                            fixData(model);
                                        }, function(resp) {
                                            $log.error(resp);
                                            PageHelper.hideLoader();
                                            irfProgressMessage.pop("group-dsc-override-req", "Oops. An error occurred", 2000);
                                            PageHelper.showErrors(resp);
                                            fixData(model);
                                        });
                                    }, function(resp, header) {
                                        $log.error(resp);
                                        PageHelper.hideLoader();
                                        irfProgressMessage.pop("group-dsc-override-req", "Oops. An error occurred", 2000);
                                        PageHelper.showErrors(resp);
                                    });
                                },
                            }, {
                                "key": "group.jlgGroupMembers[].getDSCData",
                                "type": "button",
                                "title": "VIEW_DSC_RESPONSE",
                                "icon": "fa fa-eye",
                                "style": "btn-primary",
                                "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED'",
                                "onClick": function(model, formCtrl, form, event) {
                                    console.log(form);
                                    console.warn(event);
                                    var i = event['arrayIndex'];
                                    console.warn("dscid :" + model.group.jlgGroupMembers[i].dscId);
                                    var dscId = model.group.jlgGroupMembers[i].dscId;
                                    showDscData(dscId);
                                }
                            }, /*{
                                "key": "group.jlgGroupMembers[].removeMember",
                                "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED'",
                                "type": "button",
                                "title": "REMOVE_MEMBER",
                                "icon": "fa fa-times",
                                "onClick": function(model, formCtrl, form, event) {
                                    console.log(form);
                                    console.warn(event);
                                    var i = event['arrayIndex'];
                                    var urnNo = model.group.jlgGroupMembers[i].urnNo;
                                    $log.warn("Remove member from grp ", urnNo);
                                    if (window.confirm("Are you sure?")) {
                                        PageHelper.showLoader();
                                        PageHelper.clearErrors();
                                        irfProgressMessage.pop('group-dsc-remove-req', 'Removing Group Member...');
                                        Groups.get({
                                                service: "process",
                                                action: "removeMember",
                                                groupCode: model.group.groupCode,
                                                urnNo: urnNo
                                            },
                                            function(resp, headers) {
                                                GroupProcess.getGroup({
                                                    groupId: model.group.id
                                                }, function(response, headersGetter) {
                                                    irfProgressMessage.pop('group-dsc-remove-req', 'Group Member Removed', 2000);
                                                    model.group = _.cloneDeep(response);
                                                    fixData(model);
                                                    PageHelper.hideLoader();

                                                }, function(resp) {
                                                    $log.error(resp);
                                                    PageHelper.hideLoader();
                                                    irfProgressMessage.pop("group-dsc-remove-req", "Oops. An error occurred", 2000);
                                                    fixData(model);
                                                });
                                            },
                                            function(resp) {
                                                $log.error(resp);
                                                PageHelper.hideLoader();
                                                irfProgressMessage.pop("group-dsc-remove-req", "Oops. An error occurred", 2000);
                                                PageHelper.showErrors(resp);
                                                fixData(model);
                                            });
                                    }
                                },
                            }*/]
                        }]
                    }]
                },

                {
                    "type": "actionbox",
                    "condition": "model.group.id",
                    "items": [{
                        "title": "PERFORM_DSC_CHECK",
                        "type": "button",
                        "onClick": "actions.doDSCCheck(model,form)"
                    },{
                        "title": "SAVE",
                        "type": "submit"
                    }]
                }
            ],

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
                submit: function(model, formCtrl, form) {
                    PageHelper.showLoader();
                    irfProgressMessage.pop('Save', 'Working...');
                    PageHelper.clearErrors();
                    model.groupAction = "SAVE";
                    var reqData = _.cloneDeep(model);
                    GroupProcess.updateGroup(reqData, function(res) {
                        PageHelper.hideLoader();
                        model.group = _.cloneDeep(response);
                        fixData(model);
                        fillNames(model);
                        irfProgressMessage.pop('Save', 'Operation Succeeded.', 5000);
                        irfNavigator.goBack();
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('Save', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);
                    });
                },

                doDSCCheck: function(model, form) {
                    PageHelper.clearErrors();
                    PageHelper.showLoader();
                    irfProgressMessage.pop('group-dsc-check', 'Performing DSC Check');
                    GroupProcess.DSCCheck({
                            groupCode: model.group.groupCode,
                            partnerCode: model.group.partnerCode
                        }, {},
                        function(resp) {
                            $log.warn(resp);
                            irfProgressMessage.pop('group-dsc-check', 'Almost Done...');
                            Groups.getGroup({
                                groupId: model.group.id
                            }, function(response, headersGetter) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('group-dsc-check', 'DSC Check Complete', 2000);
                                model.group = _.cloneDeep(response);
                                fixData(model);
                                fillNames(model).then(function(m) {
                                    model = m;
                                    PageHelper.hideLoader();
                                }, function(m) {
                                    PageHelper.hideLoader();
                                    irfProgressMessage.pop("group-dsc-check", "Oops. An error occurred", 2000);
                                });
                                var dscFailedStatuses = ['DSC_OVERRIDE_REQUIRED', 'DSC_OVERRIDE_REQUESTED'];
                                var allOk = true;
                                var failedMsg = Array();
                                angular.forEach(model.group.jlgGroupMembers, function(member) {
                                    if (dscFailedStatuses.indexOf(member.dscStatus) >= 0) {
                                        $log.warn("DSC Failed for", member);
                                        allOk = false;
                                        return;
                                    }
                                });
                                $log.info("DSC Check Status :" + allOk);
                                if (allOk === true) {
                                    if (window.confirm("DSC Check Succeeded for the Group. Proceed to next stage?")) {
                                        model.groupAction = "PROCEED";
                                        PageHelper.showLoader();
                                        irfProgressMessage.pop('dsc-proceed', 'Working...');
                                        PageHelper.clearErrors();
                                        var reqData = _.cloneDeep(model);
                                        //reqData.group.frequency = reqData.group.frequency[0];
                                        GroupProcess.updateGroup(reqData, function(res) {
                                            PageHelper.hideLoader();
                                            irfProgressMessage.pop('dsc-proceed', 'Operation Succeeded. Proceeded to CGT 1.', 5000);
                                            irfNavigator.goBack();
                                        }, function(res) {
                                            PageHelper.hideLoader();
                                            irfProgressMessage.pop('dsc-proceed', 'Oops. Some error.', 2000);
                                            PageHelper.showErrors(res);
                                        });
                                    }
                                } else {
                                    var errors = Array();
                                    PageHelper.hideLoader();
                                    errors.push({
                                        message: "DSC Check Failed for some member(s). Please Take required action"
                                    });
                                    PageHelper.setErrors(errors);
                                }
                            }, function(resp) {
                                $log.error(resp);
                                PageHelper.hideLoader();
                                irfProgressMessage.pop("group-dsc-check", "Oops. An error occurred", 2000);
                            });
                        },
                        function(resp) {
                            PageHelper.showErrors(resp);
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('group-dsc-check', 'Oops... An error occurred. Please try again', 2000);
                        });
                }
            }
        }
    }
})