define({
    pageUID: "loans.group.CreateGroup",
    pageType: "Engine",
    dependencies: ["$log", "$state", "GroupProcess", "Enrollment", "CreditBureau", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, $state, GroupProcess, Enrollment, CreditBureau, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
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
                    if (resp.firstName > 0) {
                        model.group.jlgGroupMembers[key].firstName = resp.firstName;
                    }
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

        var proceedData = function(res) {
            var deferred = $q.defer();
            if (res.group.id === undefined || res.group.id === null) {
                $log.info("Group id null, cannot proceed");
                deferred.reject(null);
            } else {
                PageHelper.showLoader();
                irfProgressMessage.pop('group-save', 'Working...');
                res.groupAction = "PROCEED";
                Utils.removeNulls(res, true);
                GroupProcess.updateGroup(res, function(res, headers) {
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
                model.group.branchName = model.group.branchName || SessionStore.getCurrentBranch().branchId;
                model.group.branchdescription =SessionStore.getBankName();
                var date = SessionStore.getFormatedCBSDate();
                model.group.groupFormationDate=date.split("-").reverse().join("-");

                if ($stateParams.pageId) {
                    var groupId = $stateParams.pageId;
                    PageHelper.showLoader();
                    irfProgressMessage.pop("group-init", "Loading, Please Wait...");
                    GroupProcess.getGroup({
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
                    "required": true,
                    "title": "GROUP_NAME",
                }, {
                    "key": "group.partnerCode",
                    "title": "PARTNER",
                    "required": true,
                    "type": "select",
                    "enumCode": "partner"
                }, {
                    "key": "group.centreCode",
                    "title": "CENTRE_CODE",
                    "required": true,
                    "type": "select",
                    "enumCode": "centre_code",
                    "parentEnumCode": "branch_id",
                    "parentValueExpr": "model.group.branchName"
                }, {
                    "key": "group.productName",
                    "title": "PRODUCT",
                    "required": true,
                    "type": "lov",
                    //"field2": "JLG",
                    //"enumCode": "loan_product",
                    //"parentEnumCode": "partner",
                    //"parentValueExpr": "model.group.partnerCode",
                    autolov: true,
                    bindMap: {},
                    required: true,
                    searchHelper: formHelper,
                    search: function(inputModel, form, model, context) {
                        var product = formHelper.enum('loan_product').data;
                        var partner = model.group.partnerCode;
                        var out = [];
                        if (product && product.length) {
                            for (var i = 0; i < product.length; i++) {
                                    if (product[i].parentCode == partner && product[i].field2 == "JLG") {
                                        out.push({
                                            name: product[i].name,
                                            id: product[i].value
                                        })
                                    }   
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
                        model.group.productCode = valueObj.id;
                        model.group.productName = valueObj.name;
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.name
                        ];
                    }
                }, {
                    "key": "group.frequency",
                    "title": "FREQUENCY",
                    "required": true,
                    "type": "select",
                    "enumCode":"loan_product_frequency"
                    /*"titleMap": [{
                        "name": "Monthly",
                        "value": "M"
                    }, {
                        "name": "Quarterly",
                        "value": "Q"
                    }]*/
                }, {
                    "key": "group.tenure",
                    "title": "TENURE",
                },{
                    "key": "group.groupFormationDate",
                    "readonly":true,
                    "title": "GROUP_FORMATION_DATE",
                    "type":"date"
                }, {
                    "key": "group.jlgGroupMembers",
                    "type": "array",
                    "titleExpr":"model.group.jlgGroupMembers[arrayIndex].urnNo + ' : ' + model.group.jlgGroupMembers[arrayIndex].firstName",
                    "title": "GROUP_MEMBERS",
                    "items": [
                   /* {
                        "key": "group.jlgGroupMembers[].urnNo",
                        "title": "URN_NO",
                        "required": true,
                        "type": "lov",
                        "lovonly": true,
                        initialize: function(model, form, parentModel, context) {
                            model.branchName = parentModel.group.branchName;
                        },
                        "inputMap": {
                            "branchName": {
                                "key": "group.branchName",
                                "title": "BRANCH_NAME",
                                "type": "select",
                                "readonly": true,
                                //"enumCode": "branch",
                                "enumCode": "branch_id"
                            },
                            "centreCode": {
                                "key": "group.centreCode",
                                "title": "CENTRE",
                                "type":["number",null],
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
                            "id": "group.jlgGroupMembers[arrayIndex].CustomerId",
                        },
                        "searchHelper": formHelper,
                        "search": function(inputModel, form) {
                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                            var branches = formHelper.enum('branch').data;
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
                    },*/
                    {
                        "key": "group.jlgGroupMembers[].urnNo",
                        "title": "URN_NO",
                        "required": true,
                        "type": "lov",
                        "lovonly": true,
                        initialize: function(model, form, parentModel, context) {
                            model.branchName = parentModel.group.branchName;
                        },
                        "inputMap": {
                            "branchName": {
                                "key": "group.branchName",
                                "title": "BRANCH_NAME",
                                "type": "select",
                                "readonly": true,
                                //"enumCode": "branch",
                                "enumCode": "branch_id"
                            },
                            "centreCode": {
                                "key": "group.centreCode",
                                "title": "CENTRE",
                                "type": ["number", null],
                                "enumCode": "centre",
                                "type": "select",
                                "parentEnumCode": "branch_id",
                                "parentValueExpr": "model.branchName",
                            },
                            "status": {
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
                            },
                        },
                        "outputMap": {
                            "urnNo": "group.jlgGroupMembers[arrayIndex].urnNo",
                            "firstName": "group.jlgGroupMembers[arrayIndex].firstName",
                            "fatherFirstName": "group.jlgGroupMembers[arrayIndex].husbandOrFatherFirstName",
                            "id": "group.jlgGroupMembers[arrayIndex].CustomerId",
                        },
                        "searchHelper": formHelper,
                        "search": function(inputModel, form) {
                            var branches = formHelper.enum('branch_id').data;
                            var branchId;
                            for (var i = 0; i < branches.length; i++) {
                                if (branches[i].value == inputModel.branchName)
                                {
                                    branchId = branches[i].name;
                                }
                            }
                            var today = moment(new Date());
                            var nDaysBack = moment(new Date()).subtract(nDays, 'days');
                            console.log(inputModel);
                            var promise = CreditBureau.listCreditBureauStatus({
                                'branchName': branchId,
                                'status': inputModel.status,
                                'centreCode': inputModel.centreCode,
                                'fromDate': nDaysBack.format('YYYY-MM-DD'),
                                'toDate': today.format('YYYY-MM-DD')
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
                    },
                    {
                        "key": "group.jlgGroupMembers[].firstName",
                        "readonly": true,
                        "type": "string",
                        "title": "GROUP_MEMBER_NAME"
                    }, {
                        "key": "group.jlgGroupMembers[].husbandOrFatherFirstName",
                        "readonly": true,
                        "title": "FATHER_NAME"
                    }, {
                        "key": "group.jlgGroupMembers[].relation",
                        "readonly": true,
                        "title": "RELATION",
                        //"readonly": readonly,
                        /*"type": "select",
                        "titleMap": {
                            "Father": "Father",
                            "Husband": "Husband"
                        }*/
                    },{
                        "key": "group.jlgGroupMembers[].maritalStatus",
                        "title": "MARITAL_STATUS",
                        "type":"select",
                        "enumCode":"marital_status"
                    },{
                        "key": "group.jlgGroupMembers[].outStandingLoanAmount",
                        "type": "amount",
                        "title": "OUTSTANDING_LOAN_AMOUNT"
                    }, {
                        "key": "group.jlgGroupMembers[].loanAmount",
                        "title": "LOAN_AMOUNT",
                        "required": true,
                        "type": "amount",
                    }, {
                        "key": "group.jlgGroupMembers[].loanPurpose1",
                        "title": "LOAN_PURPOSE_1",
                        "required": true,
                        "enumCode": "loan_purpose_1",
                        "type": "select",
                    }, {
                        "key": "group.jlgGroupMembers[].loanPurpose2",
                        "type": "select",
                        "required": true,
                        "title": "LOAN_PURPOSE_2",
                        "enumCode": "loan_purpose_2",
                        "parentEnumCode": "loan_purpose_1",
                        "parentValueExpr": "model.group.jlgGroupMembers[arrayIndex].loanPurpose1"
                    }, {
                        "key": "group.jlgGroupMembers[].loanPurpose3",
                        "type": "select",
                        "required": true,
                        "title": "LoanPurpose3",
                        "enumCode": "loan_purpose_3",
                        "parentEnumCode": "loan_purpose_2",
                        "parentValueExpr": "model.group.jlgGroupMembers[arrayIndex].loanPurpose2"
                    }, {
                        "key": "group.jlgGroupMembers[].witnessFirstName",
                        "required": true,
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
                                id: model.group.jlgGroupMembers[context.arrayIndex].CustomerId,
                            }).$promise.then(function(res) {
                                var familyMembers = [];
                                //var obj={};
                                for (i in res.familyMembers) {
                                    var obj = {};
                                    if (res.familyMembers[i].relationShip != 'Self' || res.familyMembers[i].relationShip != 'self') {
                                        obj.name = res.familyMembers[i].familyMemberFirstName;
                                        obj.relationShip = res.familyMembers[i].relationShip;
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
            }, {
                "type": "actionbox",
                "condition": "!model.group.id",
                "items": [{
                    "type": "submit",
                    "title": "CREATE_GROUP"
                }, {
                    "type": "save",
                    "title": "SAVE_OFFLINE"
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
                                "type": "string"
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
                    if (reqData.group.id) {
                        proceedData(reqData).then(function(res) {
                            $state.go('Page.GroupDashboard', null);
                        }, function(err) {
                            Utils.removeNulls(res.group, true);
                            model.group = _.clone(res.group);
                            fixData(model);
                            fillNames(model);
                        });
                    } else {
                        saveData(reqData).then(function(res) {
                            proceedData(res).then(function(res1) {
                                $state.go('Page.GroupDashboard', null);
                            }, function(err) {
                                Utils.removeNulls(res1.group, true);
                                model.group = _.clone(res1.group);
                                fixData(model);
                                fillNames(model);
                            });
                        });
                    }
                }
            }
        }
    }
})