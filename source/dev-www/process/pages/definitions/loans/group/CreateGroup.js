define({
    pageUID: "loans.group.CreateGroup",
    pageType: "Engine",
    dependencies: ["$log", "$state", "Groups", "Enrollment", "CreditBureau", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, $state, Groups, Enrollment, CreditBureau, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
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

        var saveData = function(reqData) {
            PageHelper.showLoader();
            irfProgressMessage.pop('group-save', 'Working...');
            var deferred = $q.defer();
            if (reqData.group.id) {
                deferred.reject(true);
                $log.info("Group id not null, skipping save");
            } else {
                reqData.enrollmentAction = 'SAVE';
                reqData.group.groupFormationDate = Utils.getCurrentDate();
                //delete reqData.group.screenMode;
                //reqData.group.frequency = reqData.group.frequency[0];
                PageHelper.clearErrors();
                Utils.removeNulls(reqData, true);
                Groups.post(reqData, function(res) {
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

        var proceedData = function(res) {
            var deferred = $q.defer();
            if (res.group.id === undefined || res.group.id === null) {
                $log.info("Group id null, cannot proceed");
                deferred.reject(null);
            } else {
                PageHelper.showLoader();
                irfProgressMessage.pop('group-save', 'Working...');
                res.enrollmentAction = "PROCEED";
                //res.group.frequency = res.group.frequency[0];
                Utils.removeNulls(res, true);
                Groups.update(res, function(res, headers) {
                    $log.info(res);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('group-save', 'Done. Group ID: ' + res.group.id, 5000);
                    deferred.resolve(res);
                }, function(res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('group-save', 'Oops. Some error.', 2000);
                    PageHelper.showErrors(res);
                    deferred.reject(null);
                });
            }
            return deferred.promise;
        };

        return {
            "type": "schema-form",
            "title": "CREATE_GROUP",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.group = model.group || {};
                model.group.branchName = SessionStore.getCurrentBranch().branchId;
                $log.info(model.group.branchName);

                if ($stateParams.pageId) {
                    var groupId = $stateParams.pageId;
                    PageHelper.showLoader();
                    irfProgressMessage.pop("group-init", "Loading, Please Wait...");
                    Groups.getGroup({
                        groupId: groupId
                    }, function(response, headersGetter) {
                        model.group = _.cloneDeep(response);
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
                    "title": "GROUP_DETAILS",
                    "items": [{
                        "key": "group.groupName",
                        "title": "GROUP_NAME",
                        //readonly: readonly
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
                        "enumCode": "centre"
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
                        //"enumCode": "frequency",
                        "titleMap": [{
                                "name": "Monthly",
                                "value": "M"
                            }, {
                                "name": "Quarterly",
                                "value": "Q"
                            }]
                            //readonly: readonly
                    }, {
                        "key": "group.tenure",
                        "title": "TENURE",
                        //readonly: readonly
                    }, {
                        "key": "group.jlgGroupMembers",
                        "type": "array",
                        "title": "GROUP_MEMBERS",
                        //"condition": "model.group.jlgGroupMembers.length>0",
                        //"add": null,
                        //"remove": null,
                        "items": [{
                            "key": "group.jlgGroupMembers[].urnNo",
                            "title": "URN_NO",
                            //"readonly": true
                            "type": "lov",
                            initialize: function(model, form, parentModel, context) {
                                model.branchName = parentModel.group.branchName;
                            },
                            "inputMap": {
                                /*"status": {
                                    "key": "group.status",
                                    "title": "STATUS",
                                    "type": "select",
                                    "titleMap": [{
                                        "name": "All",
                                        "value": ""
                                    }, {
                                        "name": "Processed",
                                        "value": "PROCESSED"
                                    }, {
                                        "name": "Pending",
                                        "value": "PENDING"
                                    }, {
                                        "name": "Error",
                                        "value": "ERROR"
                                    }]
                                },*/
                                "branchName": {
                                    "key": "group.branchName",
                                    "title": "BRANCH_NAME",
                                    "type": "select",
                                    "enumCode": "branch_id"
                                },
                                "centreCode": {
                                    "key": "group.centreCode",
                                    "title": "CENTRE",
                                    "enumCode": "centre",
                                    "type": "select",
                                    "parentEnumCode": "branch_id",
                                    "parentValueExpr": "model.branchName",
                                }
                            },
                            "outputMap": {
                                "urnNo": "group.jlgGroupMembers[arrayIndex].urnNo",
                                "firstName": "group.jlgGroupMembers[arrayIndex].firstName",
                                "fatherFirstName": "group.jlgGroupMembers[arrayIndex].husbandOrFatherFirstName",
                                "id": "group.jlgGroupMembers[arrayIndex].id",
                            },
                            "searchHelper": formHelper,
                            "search": function(inputModel, form) {
                                /*var today = moment(new Date());
                                var nDaysBack = moment(new Date()).subtract(nDays, 'days');
                                var promise = CreditBureau.listCreditBureauStatus({
                                    'branchName': inputModel.branchName,
                                    'status': inputModel.status,
                                    'centreCode': inputModel.centreCode,
                                    'fromDate': nDaysBack.format('YYYY-MM-DD'),
                                    'toDate': today.format('YYYY-MM-DD')
                                }).$promise;
                                return promise;*/

                                $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                var branches = formHelper.enum('branch_id').data;
                                var branchId;
                                $log.info(inputModel.branchName);
                                for (var i = 0; i < branches.length; i++) {
                                    if (branches[i].code == inputModel.branchName)
                                        branchId = branches[i].name;
                                }
                                var promise = Enrollment.search({
                                    'branchName': branchId || SessionStore.getBranch(),
                                    'centreId': inputModel.centreId,
                                    'customerType': "individual",
                                }).$promise;
                                return promise;
                            },
                            getListDisplayItem: function(data, index) {
                                return [
                                    data.urnNo,
                                    data.firstName
                                ];
                            },
                            onSelect: function(valueObj, model, context) {
                                $log.info("Hi Selected");
                                model.group.jlgGroupMembers[context.arrayIndex].relation = "Father";
                            }
                        }, {
                            "key": "group.jlgGroupMembers[].firstName",
                            "type": "string",
                            //"readonly": true,
                            "title": "GROUP_MEMBER_NAME"
                        }, {
                            "key": "group.jlgGroupMembers[].husbandOrFatherFirstName",
                            "title": "FATHER_NAME"
                                //"readonly": readonly
                        }, {
                            "key": "group.jlgGroupMembers[].relation",
                            "title": "RELATION",
                            //"readonly": readonly,
                            /*"type": "select",
                            "titleMap": {
                                "Father": "Father",
                                "Husband": "Husband"
                            }*/
                        }, {
                            "key": "group.jlgGroupMembers[].loanAmount",
                            "title": "LOAN_AMOUNT",
                            "type": "amount",

                            //readonly: readonly

                        }, {
                            "key": "group.jlgGroupMembers[].loanPurpose1",
                            "title": "LOAN_PURPOSE_1",
                            "enumCode": "loan_purpose_1",
                            "type": "select",
                            //readonly: readonly
                        }, {
                            "key": "group.jlgGroupMembers[].loanPurpose2",
                            "type": "select",
                            "title": "LOAN_PURPOSE_2",
                            "enumCode": "loan_purpose_2",
                            "parentEnumCode": "loan_purpose_1",
                            "parentValueExpr": "model.group.jlgGroupMembers[arrayIndex].loanPurpose1"
                                //readonly: readonly
                        }, {
                            "key": "group.jlgGroupMembers[].loanPurpose3",
                            "type": "select",
                            "title": "LoanPurpose3",
                            "enumCode": "loan_purpose_2",
                            //"parentEnumCode": "loan_purpose_2",
                            //"parentValueExpr": "model.group.jlgGroupMembers[arrayIndex].loanPurpose2"
                            //readonly: readonly
                        }, {
                            "key": "group.jlgGroupMembers[].witnessFirstName",
                            "title": "WitnessLastName",
                            "type": "lov",
                            initialize: function(model, form, parentModel, context) {
                                model.branchName = parentModel.group.branchName;
                            },
                            "outputMap": {
                                "name": "group.jlgGroupMembers[arrayIndex].witnessFirstName",
                                "relationShip": "group.jlgGroupMembers[arrayIndex].witnessRelationship",
                            },
                            "searchHelper": formHelper,
                            "search": function(inputModel, form, model, context) {
                                /*var branches = formHelper.enum('branch_id').data;
                                var branchId;
                                $log.info(inputModel.branchName);
                                for (var i = 0; i < branches.length; i++) {
                                    if (branches[i].code == inputModel.branchName)
                                        branchId = branches[i].name;
                                }
                                var promise = Enrollment.search({
                                    'urnNo': model.group.jlgGroupMembers[context.arrayIndex].urnNo,
                                    'branchName': branchId || SessionStore.getBranch(),
                                    'customerType': "individual",
                                }).$promise;
                                return promise;*/

                                var promise = Enrollment.getCustomerById({
                                    id: model.group.jlgGroupMembers[context.arrayIndex].id,
                                }).$promise.then(function(res) {
                                    var familyMembers=[];
                                    //var obj={};
                                    for(i in res.familyMembers)
                                    {
                                        var obj={};
                                        if(res.familyMembers[i].relationShip!='Self'||res.familyMembers[i].relationShip!='self')
                                        {
                                            obj.name=res.familyMembers[i].familyMemberFirstName;
                                            obj.relationShip=res.familyMembers[i].relationShip;
                                            familyMembers.push(obj);
                                        }
                                    }
                                    $log.info(familyMembers);

                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": familyMembers.length
                                        },
                                        body: familyMembers
                                    });
                                });
                                return promise;
                            },
                            getListDisplayItem: function(data, index) {
                                return [
                                    data.name,
                                    data.relationShip,
                                ];
                            },
                            onSelect: function(valueObj, model, context) {}
                                //"readonly": readonly
                        }, {
                            "key": "group.jlgGroupMembers[].witnessRelationship",
                            "title": "RELATION",
                            "type": "select",
                            "enumCode": "relation"
                                //"readonly": readonly
                        }]
                    }]
                },

                {
                    "type": "actionbox",
                    "condition": "!model.group.id",
                    "items": [{
                        "type": "submit",
                        "title": "CREATE_GROUP"
                    }, {
                        "type": "save",
                        "title": "SAVE_OFFLINE"
                    }]
                },

                {
                    "type": "actionbox",
                    "condition": "model.group.id",
                    "items": [{
                        "style": "btn-theme",
                        "title": "CLOSE_GROUP",
                        "icon": "fa fa-times",
                        "onClick": "actions.closeGroup(model,form)"
                    }, {
                        "style": "btn-theme",
                        "title": "UPDATE_GROUP",
                        "icon": "fa fa-times",
                        "onClick": "actions.proceedAction(model,form)"
                    }]
                },
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
                    $log.info("Inside submit()");
                    var reqData = _.cloneDeep(model);
                    saveData(reqData).then(function(res) {
                        model.group = _.clone(res.group);
                        reqData = _.cloneDeep(model);
                        fixData(model);
                        //model.group.screenMode = screenMode;
                        proceedData(reqData).then(function(res) {
                            //backToDashboard();
                        });
                    }, function(doProceed) {
                        if (doProceed === true) {
                            proceedData(reqData).then(function(res) {
                                backToDashboard();
                            });
                        } else {
                            fixData(model);
                            //model.group.screenMode = screenMode;
                        }
                    });
                },
                proceedAction: function(model, form) {
                    if (window.confirm("Proceed to Next Stage?")) {
                        var reqData = _.cloneDeep(model);
                        proceedData(reqData).then(function(res) {
                            //backToDashboard();
                        }, function(res) {});
                    }
                },
                closeGroup: function(model, form) {
                    if (window.confirm("Close Group - Are you sure?")) {
                        var remarks = window.prompt("Enter Remarks", "Test Remarks");
                        if (remarks) {
                            PageHelper.showLoader();
                            irfProgressMessage.pop('close-group', "Working...");
                            Groups.update({
                                service: "close"
                            }, {
                                "groupId": model.group.id,
                                "remarks": remarks
                            }, function(resp, header) {

                                PageHelper.hideLoader();
                                irfProgressMessage.pop('close-group', "Done", 5000);
                                //backToDashboard();
                            }, function(res) {
                                $log.error(res);
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('close-group', "Oops. An Error Occurred, Please try Again", 5000);
                                PageHelper.showErrors(res);
                            });
                        }
                    }
                },
            }
        }
    }
})