define({
    pageUID: "loans.group.CreateGroup",
    pageType: "Engine",
    dependencies: ["$log", "GroupProcess", "Enrollment", "CreditBureau", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, GroupProcess, Enrollment, CreditBureau, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

        var validateForm = function(formCtrl){
            formCtrl.scope.$broadcast('schemaFormValidate');
            if (formCtrl && formCtrl.$invalid) {
                PageHelper.showProgress("Checker","Your form have errors. Please fix them.", 5000);
                return false;
            }
            return true;
        }
        var bankName = SessionStore.getBankName();
        var banks = formHelper.enum('bank').data;
        var branch1 = formHelper.enum('branch_id').data;
        var centres = SessionStore.getCentres();
        var nDays = 15;
        var fixData = function(model) {
            for (var i = 0; i < banks.length; i++){
                if(banks[i].name == bankName){
                    model.group.bankId = model.group.bankId || banks[i].value;
                    model.bankName = banks[i].name;
                    break;
                }
            }
            model.group.branchId = model.group.branchId || SessionStore.getCurrentBranch().branchId;
            for (var i = 0; i < branch1.length; i++) {
                if ((branch1[i].value) == model.group.branchId) {
                    model.group.branchName = branch1[i].name;
                    break;
                }
            }
            var products = formHelper.enum('loan_product').data;
            for (var i = 0; i < products.length; i++) {
                if ((products[i].value) == model.group.productCode) {
                    model.group.productName = products[i].name;
                    break;
                }
            }
            model.group.tenure = parseInt(model.group.tenure);
        };
        var fillNames = function(model) {
            var deferred = $q.defer();
            angular.forEach(model.group.jlgGroupMembers, function(member, key) {
                Enrollment.get({
                    id: member.customerId
                }, function(resp, headers) {
                    if (resp.firstName && resp.firstName.length > 0) {
                        model.group.jlgGroupMembers[key].firstName = resp.firstName;
                    }
                    var familyMembers = [];
                    for (i in resp.familyMembers) {
                        var obj = {};
                        if (resp.familyMembers[i].relationShip != 'Self' || resp.familyMembers[i].relationShip != 'self') {
                            obj.name = resp.familyMembers[i].familyMemberFirstName;
                            obj.relationShip = resp.familyMembers[i].relationShip;
                            obj.age = moment().diff(moment(resp.familyMembers[i].dateOfBirth), 'years');
                            familyMembers.push(obj);
                        }
                    }
                    model.group.jlgGroupMembers[key].familyMembers=familyMembers;
                    try {
                        if (resp.middleName && resp.middleName.length > 0)
                            model.group.jlgGroupMembers[key].firstName += " " + resp.middleName;
                        if (resp.lastName && resp.lastName.length > 0)
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
            "title": "CREATE_EDIT_GROUP",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.group = model.group || {};
                model.group.siteCode = SessionStore.getGlobalSetting("siteCode");
                for (var i = 0; i < banks.length; i++){
                    if(banks[i].name == bankName){
                        model.group.bankId = model.group.bankId || banks[i].value;
                        model.bankName = banks[i].name;
                        break;
                    }
                }
                model.group.branchId = model.group.branchId || SessionStore.getCurrentBranch().branchId;
                for (var i = 0; i < branch1.length; i++) {
                    if ((branch1[i].value) == model.group.branchId) {
                        model.group.branchName = branch1[i].name;
                    }
                }
                model.group.branchdescription =SessionStore.getBankName();
                model.group.groupFormationDate= SessionStore.getCBSDate();

                if ($stateParams.pageId) {
                    var groupId = $stateParams.pageId;
                    PageHelper.showLoader();
                    irfProgressMessage.pop("group-init", "Loading, Please Wait...");
                    GroupProcess.getGroup({
                        groupId: groupId
                    }, function(response, headersGetter) {
                        model.group = _.cloneDeep(response);
                        model.group.branchId = model.group.branchId || SessionStore.getCurrentBranch().branchId;
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
            form: [{
                "type": "box",
                "title": "GROUP_DETAILS",
                "items": [
                 {
                    "key": "group.branchId",
                    "title": "BRANCH_NAME",
                    "required": true,
                    readonly: true,
                    "parentEnumCode": "bank",
                    "parentValueExpr": "model.group.bankId",
                },{
                    "key": "group.partnerCode",
                    "title": "PARTNER",
                    "required": true,
                    "type": "select",
                    "enumCode": "partner"
                },{
                    "key": "group.groupName",
                    "required": true,
                    "title": "GROUP_NAME",
                },{
                    "key": "group.centreCode",
                    "title": "CENTRE_CODE",
                    "required": true,
                    "type": "select",
                    "enumCode": "centre_code",
                    "parentEnumCode": "branch_id",
                    "parentValueExpr": "model.group.branchId"
                }, {
                    "key": "group.productName",
                    "title": "PRODUCT",
                    "required": true,
                    "type": "lov",
                    lovonly: true,
                    autolov: true,
                    bindMap: {"Partner": "group.partnerCode"},
                    required: true,
                    searchHelper: formHelper,
                    search: function(inputModel, form, model, context) {
                        return Queries.getGroupLoanProductsByPartner(model.group.partnerCode);
                    },
                    onSelect: function(valueObj, model, context) {
                        model.group.productCode = valueObj.productCode;
                        model.group.productName = valueObj.productName;
                        model.group.frequency = valueObj.frequency;
                        if(valueObj.tenure_from == valueObj.tenure_to) {
                            model.group.tenure = valueObj.tenure_to;
                        }
                        else {
                            delete model.group.tenure;
                            model.tenurePlaceHolderExpr = valueObj.tenure_from + '-' + valueObj.tenure_to;
                        }
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.productName
                        ];
                    }
                }, {
                    "key": "group.frequency",
                    "title": "FREQUENCY",
                    "required": true,
                    "type": "select",
                    "enumCode":"loan_product_frequency"
                }, {
                    "key": "group.tenure",
                    "required": true,
                    "placeholderExpr": "model.tenurePlaceHolderExpr",
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
                    {
                        "key": "group.jlgGroupMembers[].urnNo",
                        "title": "URN_NO",
                        "required": true,
                        "type": "lov",
                        "lovonly": true,
                        initialize: function(model, form, parentModel, context) {
                            model.branchId = parentModel.group.branchId;
                            var centres = formHelper.enum('centre').data;
                            for (var i = 0; i < centres.length; i++) {
                                if ((centres[i].field3) == parentModel.group.centreCode) {
                                    model.centreId = centres[i].value;
                                    break;
                                }
                            }
                        },
                        "bindMap": {
                            "Spoke": "group.centreCode",
                        },
                        "inputMap": {
                            "branchId": {
                                "key": "group.branchId",
                                "title": "BRANCH_NAME",
                                "type": "select",
                                "readonly": true,
                                "enumCode": "branch_id"
                            },
                            "centreId": {
                                "key": "group.centreId",
                                "readonly": true,
                                "title": "CENTRE",
                                "type": ["number", null],
                                "enumCode": "centre",
                                "type": "select",
                                "parentEnumCode": "branch_id",
                                "parentValueExpr": "model.branchId",
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
                            "customerId": "group.jlgGroupMembers[arrayIndex].customerId",
                            "spouseFirstName": "group.jlgGroupMembers[arrayIndex].spouseFirstName"
                        },
                        "searchHelper": formHelper,
                        "search": function(inputModel, form) {
                            var branches = formHelper.enum('branch_id').data;
                            var branchName;
                            for (var i = 0; i < branches.length; i++) {
                                if (branches[i].value == inputModel.branchId)
                                {
                                    branchName = branches[i].name;
                                    break;
                                }
                            }
                            var today = moment(new Date());
                            var nDaysBack = moment(new Date()).subtract(nDays, 'days');
                            console.log(inputModel);
                            var promise = CreditBureau.listCreditBureauStatus({
                                'branchName': branchName,
                                'status': inputModel.status,
                                'centreId': inputModel.centreId,
                                'fromDate': nDaysBack.format('YYYY-MM-DD'),
                                'toDate': today.format('YYYY-MM-DD')
                            }).$promise.then(function(response){
                                $log.info(response.body);
                                var ret = [];
                                angular.forEach(response.body,function(value,key){
                                    var isDuplicate = false;
                                    for(var i=0;i<ret.length;i++){
                                        if(ret[i].urnNo === value.urnNo){
                                            isDuplicate = true;
                                            break;
                                        }
                                    }
                                    if(value.urnNo!=null && !isDuplicate) ret.push(value);
                                });                                
                                return $q.resolve({
                                    headers: {
                                        "x-total-count": ret.length
                                    },
                                    body: ret
                                });
                            });
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
                            var familyMembers = [];
                            model.group.jlgGroupMembers[context.arrayIndex].relation = "Father";
                            Enrollment.getCustomerById({id:valueObj.customerId}).$promise
                                 .then(function(res){
                                 model.group.jlgGroupMembers[context.arrayIndex].maritalStatus = res.maritalStatus;
                                 model.group.jlgGroupMembers[context.arrayIndex].loanAmount = res.requestedLoanAmount;
                                 model.group.jlgGroupMembers[context.arrayIndex].loanAmountRequested = res.requestedLoanAmount;
                                 model.group.jlgGroupMembers[context.arrayIndex].spouseDob=res.spouseDateOfBirth;
                                 model.group.jlgGroupMembers[context.arrayIndex].loanPurpose1 = res.requestedLoanPurpose;
                                 model.group.jlgGroupMembers[context.arrayIndex].witnessFirstName = undefined;
                                 model.group.jlgGroupMembers[context.arrayIndex].witnessRelationship = undefined;
                                for (i in res.familyMembers) {
                                    var obj = {};
                                    if (res.familyMembers[i].relationShip != 'Self' || res.familyMembers[i].relationShip != 'self') {
                                        obj.name = res.familyMembers[i].familyMemberFirstName;
                                        obj.relationShip = res.familyMembers[i].relationShip;
                                        obj.age = moment().diff(moment(res.familyMembers[i].dateOfBirth), 'years');
                                        familyMembers.push(obj);
                                    }
                                }
                                model.group.jlgGroupMembers[context.arrayIndex].familyMembers=familyMembers;
                                $log.info(model.group.jlgGroupMembers[context.arrayIndex].familyMembers);

                                }, function(httpRes){
                                    PageHelper.showErrors(httpRes);
                                })
                                .finally(function(){
                                    PageHelper.hideLoader();
                                })        
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
                        "title": "HUSBAND_OR_FATHER_NAME"
                    }, {
                        "key": "group.jlgGroupMembers[].relation",
                        "readonly": true,
                        "title": "RELATION",
                    },{
                        "key": "group.jlgGroupMembers[].maritalStatus",
                        "title": "MARITAL_STATUS",
                        "type":"select",
                        "enumCode":"marital_status"
                    },{
                        "key": "group.jlgGroupMembers[].outStandingLoanAmount",
                        "condition":"model.group.partnerCode=='AXIS'",
                        "type": "amount",
                        "title": "OUTSTANDING_LOAN_AMOUNT"
                    },{
                        "key": "group.jlgGroupMembers[].loanAmount",
                        "title": "LOAN_AMOUNT",
                        "required": true,
                        "type": "amount",
                    }, {
                        "key": "group.jlgGroupMembers[].loanPurpose1",
                        "title": "LOAN_PURPOSE_1",
                        "required": true,
                        // "enumCode": "loan_purpose_1",
                        // "type": "select",
                        bindMap: {"URN": "group.jlgGroupMembers[arrayIndex].urnNo"},
                        "lovonly": true,
                        "type": "lov",
                        outputMap: {
                            
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            if (model.group.productCode)
                                return Queries.getLoanPurpose1(model.group.productCode);
                            else
                                return Queries.getAllLoanPurpose1();

                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.purpose1
                            ];
                        },
                        onSelect: function(result, model, context) {
                            model.group.jlgGroupMembers[context.arrayIndex].loanPurpose1 = result.purpose1;
                            model.group.jlgGroupMembers[context.arrayIndex].loanPurpose2 = undefined;
                        }
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
                    },{
                        "key": "group.jlgGroupMembers[].witnessFirstName",
                        "required": true,
                        "title": "WITNESS_NAME",
                        "condition" : "model.siteCode != 'KGFS'",
                        "bindMap": {"URN": "group.jlgGroupMembers[arrayIndex].urnNo"},
                        "lovonly": true,
                        "type": "lov",
                        "searchHelper": formHelper,
                        "search": function(inputModel, form, model, context) {
                            var familyMembers = [];
                            if(model.group.jlgGroupMembers[context.arrayIndex].familyMembers)
                            for (var idx = 0; idx < model.group.jlgGroupMembers[context.arrayIndex].familyMembers.length; idx++){
                                if(model.group.jlgGroupMembers[context.arrayIndex].familyMembers[idx].relationShip != 'self') {
                                    familyMembers.push(model.group.jlgGroupMembers[context.arrayIndex].familyMembers[idx]);
                                }
                            }
                            return $q.resolve({
                                headers: {
                                    "x-total-count": familyMembers.length
                                },
                                body: familyMembers
                            });
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                data.name,
                                data.relationShip,
                                "Age: " + data.age ? (data.age + ' years') : '' ,
                            ];
                        },
                        onSelect: function(valueObj, model, context) {
                            model.group.jlgGroupMembers[context.arrayIndex].witnessFirstName=valueObj.name;
                            model.group.jlgGroupMembers[context.arrayIndex].witnessRelationship=valueObj.relationShip;
                        }       
                    }, {
                        "key": "group.jlgGroupMembers[].witnessFirstName",
                        "required": true,
                        "title": "WITNESS_NAME",
                        "condition" : "model.siteCode == 'KGFS'",
                        "type": "lov",
                        "searchHelper": formHelper,
                        "search": function(inputModel, form, model, context) {
                            var familyMembers = [];
                            if(model.group.jlgGroupMembers[context.arrayIndex].familyMembers)
                            for (var idx = 0; idx < model.group.jlgGroupMembers[context.arrayIndex].familyMembers.length; idx++){
                                if(model.group.jlgGroupMembers[context.arrayIndex].familyMembers[idx].relationShip != 'self') {
                                    familyMembers.push(model.group.jlgGroupMembers[context.arrayIndex].familyMembers[idx]);
                                }
                            }
                            return $q.resolve({
                                headers: {
                                    "x-total-count": familyMembers.length
                                },
                                body: familyMembers
                            });
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                data.name,
                                data.relationShip,
                                "Age: " + data.age ? (data.age + ' years') : '' ,
                            ];
                        },
                        onSelect: function(valueObj, model, context) {
                            model.group.jlgGroupMembers[context.arrayIndex].witnessFirstName=valueObj.name;
                            model.group.jlgGroupMembers[context.arrayIndex].witnessRelationship=valueObj.relationShip;
                        }       
                    }, {
                        "key": "group.jlgGroupMembers[].witnessRelationship",
                        "title": "RELATION",
                        "required":true,
                        "type": "select",
                        "enumCode": "relation"
                    }]
                }]
            }, {
                "type": "actionbox",
                "condition": "!model.group.id",
                "items": [{
                    "type": "submit",
                    "title": "CREATE_GROUP"
                }]
            }, {
                "type": "actionbox",
                "condition": "model.group.id",
                "items": [{
                    "type": "submit",
                    "title": "SUBMIT"
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
                                "type": ["string", "null"]
                            },
                            "branchId": {
                                "title": "BRANCH_NAME",
                                "type": ["integer", "null"],
                                "enumCode": "branch_id",
                                "x-schema-form": {
                                    "type": "select",
                                    "screenFilter": true,
                                }
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

                submit: function(model, form, formName) {
                    $log.info("Inside submit()");
                    if(!validateForm(form)) {
                        return;
                    }
                    // var centres = formHelper.enum('centre').data;
                    // for (var i = 0; i < centres.length; i++) {
                    //     if ((centres[i].value) == model.group.centreId) {
                    //         model.group.centreCode = centres[i].field3;
                    //         break;
                    //     }
                    // }

                    PageHelper.clearErrors();
                    PageHelper.showLoader();
                    var reqData = _.cloneDeep(model);
                    Utils.confirm("Please Verify customer/spouse DOB in the system with actual ID Proof. DOB change request will not be allowed afterwards").then(function(){
                        if (reqData.group.id) {
                            proceedData(reqData).then(function(res) {
                                irfNavigator.goBack();
                                PageHelper.hideLoader();
                            }, function(err) {
                                Utils.removeNulls(res.group, true);
                                model.group = _.clone(res.group);
                                fixData(model);
                                fillNames(model);
                                PageHelper.hideLoader();
                            });
                        } else {
                            for (var i=0; i< reqData.group.jlgGroupMembers.length; i++){
                                reqData.group.jlgGroupMembers[i].centreCode = reqData.group.centreCode;
                                if(!reqData.group.id){
                                    reqData.group.jlgGroupMembers[i].loanAmountSanctionedInPaisa = reqData.group.jlgGroupMembers[i].loanAmount * 100;
                                }   
                            }
                            saveData(reqData).then(function(res) {
                                proceedData(res).then(function(res1) {
                                    irfNavigator.goBack();
                                    PageHelper.hideLoader();
                                }, function(err) {
                                    Utils.removeNulls(res1.group, true);
                                    model.group = _.clone(res1.group);
                                    fixData(model);
                                    fillNames(model);
                                    PageHelper.hideLoader();
                                });
                            });
                        }

                    }); 
                }
            }
        }
    }
})