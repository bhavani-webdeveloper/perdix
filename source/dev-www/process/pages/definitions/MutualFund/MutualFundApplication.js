    define({
        pageUID: "MutualFund.MutualFundApplication",
        pageType: "Engine",
        dependencies: ["$log", "$q", "Enrollment", 'EnrollmentHelper', 'PageHelper', 'formHelper', "elementsUtils",

            'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "irfNavigator", "CustomerBankBranch", "MutualFund",
        ],

        $pageFn: function($log, $q, Enrollment, EnrollmentHelper, PageHelper, formHelper, elementsUtils,
            irfProgressMessage, SessionStore, $state, $stateParams, irfNavigator, CustomerBankBranch, MutualFund) {

            var branch = SessionStore.getBranch();
            return {
                "type": "schema-form",
                "title": "MUTUAL_FUND_APPLICATION",
                initialize: function(model, form, formCtrl) {
                    model.customer = {};
                    model.formApplication = {};
                    model.application = {
                        mutualFundAccountProfile: {},
                        nominations: []
                    };
                    if (!$stateParams.pageId) {
                        irfNavigator.goBack();
                    }
                    model.isCreated = false;
                    model.customerSummary = {};
                    PageHelper.showLoader();
                    MutualFund.summary({
                        id: $stateParams.pageId
                    }).$promise.then(function(resp) {
                        model.customerSummary = resp[0];
                        if (model.customerSummary.id) {
                            model.isCreated = true;
                            PageHelper.hideLoader();
                            PageHelper.setError({
                                message: "First Purchase is Completed"
                            });
                        }
                    }, function(err) {
                        //irfProgressMessage.pop("summary-get", "An Error Occurred. Failed to fetch Data", 5000);
                        PageHelper.hideLoader();
                    });
                    Enrollment.getCustomerById({
                        id: $stateParams.pageId
                    }).$promise.then(function(resp) {
                        model.customer = resp;
                        model.application.mutualFundAccountProfile.dateOfBirth = model.customer.dateOfBirth;
                        model.application.mutualFundAccountProfile.mutualFundSchemeMasterId = 1;
                        model.application.mutualFundAccountProfile.customerId = $stateParams.pageId;
                        model.application.mutualFundAccountProfile.dateOfBirth = model.customer.dateOfBirth;
                        model.application.mutualFundAccountProfile.firstName = model.customer.firstName;
                        model.application.mutualFundAccountProfile.id = $stateParams.pageId;
                        model.application.mutualFundAccountProfile.middleName = model.customer.middleName;
                        model.application.mutualFundAccountProfile.pan = model.customer.panNo;
                        model.application.mutualFundAccountProfile.pekrn = model.customer.pekrn;
                        model.application.nominations[0] = model.application.nominations[0] || {};
                        model.application.nominations[0].nomineeDistrict = model.customer.district;
                        model.application.nominations[0].nomineeDoorNo = model.customer.doorNo;
                        model.application.nominations[0].nomineeLocality = model.customer.locality;
                        model.application.nominations[0].nomineePincode = model.customer.pincode;
                        model.application.nominations[0].nomineeState = model.customer.state;
                        model.application.nominations[0].nomineeAddressSameAsCustomer = true;
                        PageHelper.hideLoader();
                    }, function(err) {
                        irfProgressMessage.pop("enrollment-save", "An Error Occurred. Failed to fetch Data", 5000);
                        irfNavigator.goBack();
                        PageHelper.hideLoader();
                    });

                },
                form: [{
                    type: "box",
                    title: "KYC_REGISTRATION_INCOMPLETE",
                    condition: "!model.customer.ekycDone",
                    items: [{
                        "type": "section",
                        "html": '<hr><t><div>eKYC is incomplete.</t></div>',
                    }, {
                        "type": "button",
                        "title": "DO_EKYC",
                        "onClick": "actions.proceed(model, formCtrl, form, $event)"
                    }]
                }, 
                {
                    "type": "box",
                    "title": "CUSTOMER_INFORMATION",
                    "condition": "model.customer.ekycDone === true",
                    "readonly": true,
                    "items": [{
                        key: "customer.firstName",
                        title: "FULL_NAME",
                        required: false
                    }, {
                        key: "customer.fatherFirstName",
                        title: "FATHER_FULL_NAME",
                        required: false
                    }, {
                        title: "MOBILE_NO",
                        key: "customer.mobilePhone",
                        required: false
                    }, {
                        title: "DOB",
                        key: "customer.dateOfBirth",
                        type: "date",
                        required: false
                    }]
                },
                {
                    "type": "box",
                    "title": "BANK_ACCOUNTS",
                    "condition": "model.customer.ekycDone === true",
                    "items": [
                        {
                        key: "application.mutualFundAccountProfile.accountNumber",
                        "title": "ACCOUNT_NUMBER",
                        required:true,
                        type: "lov",
                        autolov: true,
                        lovonly: true,
                        bindMap: {},
                        searchHelper: formHelper,
                        search: function(inputModel, form, model, context) {
                            return $q.resolve({
                                headers: {
                                    "x-total-count":model.customer.customerBankAccounts.length
                                },
                                body: model.customer.customerBankAccounts
                            });
                        },
                        onSelect: function(valueObj, model, context) {
                            model.application.mutualFundAccountProfile.accountNumber= valueObj.accountNumber;
                            model.application.mutualFundAccountProfile.accountType= valueObj.accountType;
                            model.application.mutualFundAccountProfile.bankCity= valueObj.customerBankBranchName;
                            model.application.mutualFundAccountProfile.bankName= valueObj.customerBankName;
                            model.application.mutualFundAccountProfile.branchName= valueObj.customerBankBranchName;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.customerBankName,
                                item.accountNumber,
                                item.accountType
                            ];
                        }
                    },{
                        key: "application.mutualFundAccountProfile.bankName",
                        "readonly":true,
                        "title": "BANK_NAME",
                    },{
                        key: "application.mutualFundAccountProfile.branchName",
                        "readonly":true,
                        "title": "BANK_BRANCH_NAME",
                    }]
                },
                {
                    type: "box",
                    title: "FIRST_PURCHASE",
                    "condition": "model.customer.ekycDone === true && !model.isCreated",
                    key: "formApplication",
                    items: [{
                        type: "fieldset",
                        title: "",
                        items: [{
                            title: "INITIAL_INVESTMENT",
                            key: "formApplication.intialInvestment",
                            type: "amount",
                            required: true
                        }, 
                        {
                            title: "NOMINEE_FIRST_NAME",
                            key: "formApplication.nomineeFirstName",
                            type: "lov",
                            autolov: true,
                            lovonly: true,
                            required: true,
                            searchHelper: formHelper,
                            search: function(inputModel, form, model, context) {
                                var nomineeList = model.customer.familyMembers;
                                var self = this;
                                var out = [];
                                if (nomineeList && nomineeList.length) {
                                    for (var i = 0; i < nomineeList.length; i++) {
                                        if (nomineeList[i].familyMemberFirstName) {
                                            out.push({
                                                name: nomineeList[i].familyMemberFirstName,
                                                dateOfBirth: nomineeList[i].dateOfBirth,
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
                            onSelect: function(result, model, context) {
                                console.log(result);
                                model.formApplication.nomineeFirstName = result.name;
                                if (result.dateOfBirth) {
                                    result.dateOfBirth = moment(result.dateOfBirth).format("YYYY-MM-DD");
                                    model.formApplication.nomineeMinorDOB = result.dateOfBirth;
                                    model.application.nominations[0].nomineeMinorDOB = result.dateOfBirth;
                                } else {
                                    ageDiff = 0;
                                    model.formApplication.nomineeMinorDOB = "";
                                    model.application.nominations[0].nomineeMinorDOB = "";
                                }
                                model.application.nominations[0].nomineeFirstName = result.name;
                                var ageDiff = moment().diff(result.dateOfBirth, 'years');
                                if (ageDiff < 18) {
                                    model.isMinor = true;
                                } else {
                                    model.isMinor = false;
                                }
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.name
                                ];
                            }
                        }, {
                            title: "NOMINEE_DOB",
                            type: "date",
                            key: "formApplication.nomineeMinorDOB",
                            onChange: function(modelValue, form, model) {
                                PageHelper.clearErrors();
                                model.customer.inputDOB = moment(model.formApplication.nomineeMinorDOB).format("YYYY-MM-DD");
                                var ageDiff = moment().diff(model.customer.inputDOB, 'years');
                                var daydiff = moment().diff(model.customer.inputDOB, 'days');
                                if (ageDiff < 18) {
                                    model.isMinor = true;
                                    if (daydiff < 0) {
                                        PageHelper.setError({
                                            message: "DOB can not be future date"
                                        });
                                    }
                                } else {
                                    model.isMinor = false;
                                }
                            }
                        }, {
                            title: "NOMINEE_RELATIONSHIP",
                            key: "formApplication.nomineerRelationship",
                            required: true,
                            type: "select",
                            enumCode: "relation"
                        }, {
                            title: "NOMINEE_GENDER",
                            key: "formApplication.nomineerGender",
                            required: true,
                            type: "select",
                            enumCode: "gender"
                        }, {
                            "condition": "model.isMinor",
                            title: "GUARDIAN_FIRST_NAME",
                            key: "formApplication.guardianFirstName",
                            type: "lov",
                            lovonly: true,
                            required: true,
                            searchHelper: formHelper,
                            search: function(inputModel, form, model, context) {
                                var nomineeList = model.customer.familyMembers;
                                var self = this;
                                var out = [];
                                if (nomineeList && nomineeList.length) {
                                    for (var i = 0; i < nomineeList.length; i++) {
                                        if (nomineeList[i].familyMemberFirstName) {
                                            out.push({
                                                name: nomineeList[i].familyMemberFirstName,
                                                dateOfBirth: nomineeList[i].dateOfBirth,
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
                            onSelect: function(result, model, context) {
                                model.application.nominations[0].guardianAddressSameAsCustomer = true;
                                model.application.nominations[0].guardianFirstName = result.name;
                                model.application.nominations[0].guardianDistrict = model.customer.district;
                                model.application.nominations[0].guardianDoorNo = model.customer.doorNo;
                                model.application.nominations[0].guardianLocality = model.customer.locality;
                                model.application.nominations[0].guardianPincode = model.customer.pincode;
                                model.application.nominations[0].guardianState = model.customer.state;
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.name
                                ];
                            }
                        }, {
                            "condition": "model.isMinor",
                            title: "GUARDIAN_DOB",
                            type: "date",
                            key: "formApplication.guardianDOB",
                            onChange: function(modelValue, form, model) {
                                PageHelper.clearErrors();
                            }
                        }, {
                            "condition": "model.isMinor",
                            title: "GUARDIAN_RELATIONSHIP",
                            key: "formApplication.guardianRelationship",
                            required: true,
                            type: "select",
                            enumCode: "relation"
                        }, {
                            "condition": "model.isMinor",
                            title: "GUARDIAN_GENDER",
                            key: "formApplication.guardianGender",
                            required: true,
                            type: "select",
                            enumCode: "gender"
                        }]
                    }]

                }, {
                    "type": "actionbox",
                    condition: " model.customer.ekycDone === true && !model.isCreated",
                    "items": [{
                        "type": "submit",
                        "title": "SUBMIT"
                    }]
                }],
                schema: function() {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    submit: function(model, form, formName) {
                        PageHelper.showLoader();
                        PageHelper.clearErrors();
                        model.application.mutualFundAccountProfile.unitBalance = model.formApplication.unitBalance;
                        model.application.mutualFundAccountProfile.intialInvestment = model.formApplication.intialInvestment;
                        model.application.nominations[0].nomineeRelationship = model.formApplication.nomineerRelationship;
                        model.application.nominations[0].nomineeGender = model.formApplication.nomineerGender;
                        var reqData = _.cloneDeep(model.application);
                        MutualFund.createApplication(reqData).$promise.then(function(res) {
                            PageHelper.hideLoader();
                            irfProgressMessage.pop("First-Purchase ", "Successful", 5000);
                            irfNavigator.goBack();
                        }, function(errResp) {
                            PageHelper.showErrors(errResp);
                            PageHelper.hideLoader();
                        });
                    },
                    proceed: function(model, formCtrl, form, $event) {
                        PageHelper.showLoader();
                        irfNavigator.go({
                            state: "Page.Adhoc",
                            pageName: "MutualFund.MutualFundEKYC",
                            pageId:  model.customer.id
                        });                       
                        PageHelper.hideLoader();
                    }
                }
            };
        }
    })