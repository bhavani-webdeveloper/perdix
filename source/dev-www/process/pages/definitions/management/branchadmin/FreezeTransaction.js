define(['perdix/infra/api/AngularResourceService'], function (AngularResourceService) {
    return {
        pageUID: "management.branchadmin.FreezeTransaction",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository","irfNavigator","Transaction","BranchCreationResource"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
            PageHelper, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository,irfNavigator,Transaction,BranchCreationResource) {

            AngularResourceService.getInstance().setInjector($injector);
            return {
                "type": "schema-form",
                "title": "FREEZE_TRANSACTION",
                "subTitle": "",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    };
                    
                    model.freezeTransaction={};
                    // model.cashManagement.eodCashBalanceDto={};
                    // model.cashManagement.eodCashDenominationDto={};

                    /* Setting data for the form */
                    var branchId = SessionStore.getBranchId();
                    if (!model.customer) {

                    }

                    else if (branchId && !model.customer.customerBranchId) {
                        model.customer.customerBranchId = branchId;
                    };

                    var configFile = function () {
                        return {
                            "loanProcess.loanAccount.currentStage": {
                            }
                        }
                    }
                    var overridesFields = function (bundlePageObj) {
                        return {
        
                        }
                    }
                    var getIncludes = function (model) {
                        return [
                            "Bank",
                            "Bank.bankId",
                            "Bank.branchId",
                            "Bank.freezeDate",
                            "Bank.freezeTime"
                        ];
                    }

                    /* Form rendering starts */
                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {
                             "Bank":{
                                 "type":"box",
                                 "orderNo": 1,
                                 "title":"FREEZE_TRANSACTION",
                                 "items":{
                                        "bankId":{
                                            "key":"freezeTransaction.bankId",
                                            "type":"text",
                                            "title": "BANK_ID",
                                            "required": true
                                        },
                                        "branchId":{
                                            "key":"freezeTransaction.branchId",
                                            "type":"text",
                                            "title": "BRANCH_ID",
                                            "required": true
                                        },
                                        "freezeDate":{
                                            "key":"freezeTransaction.freezeDate",
                                            "condition": "model.freezeTransaction.freezeDate",
                                            "type":"text",
                                            "title": "FREEZE_DATE",
                                            "readonly": true
                                        },
                                        "freezeTime":{
                                            "key":"freezeTransaction.freezeTime",
                                            "condition": "model.freezeTransaction.freezeTime",
                                            "type":"text",
                                            "title": "FREEZE_TIME",
                                            "readonly": true
                                        },
                                }
                            }
                        },
                            "additions": [
                                {
                                    "type": "actionbox",
                                    "orderNo": 2,
                                    "items":[
                                        {
                                            "type": "submit",
                                            "title": "SUBMIT",
                                        },
                                    ]
                                }
                            ]
                        }
                };

                    UIRepository.getEnrolmentProcessUIRepository().$promise
                        .then(function (repo) {
                            console.log(model.pageClass);
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function (form) {
                            self.form = form;
                            console.log(form);
                            console.log("_________________Testing form data___________");
                        });

                    /* Form rendering ends */
                },

                preDestroy: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    return $q.resolve();
                },
                eventListeners: {
                  
                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                },
                form: [],
              
                schema: function () {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    save: function (model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }
                        // $q.all start
                      
                    },
                    proceed: function (model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                    },
                    submit: function (model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showLoader();
                        Transaction.saveFreezeTransaction({"bankId":model.freezeTransaction.bankId,"branchId":model.freezeTransaction.branchId}).$promise.then(function(resp){
                            console.log("resp",resp);
                            model.freezeTransaction.freezeDate = resp.freezeDate;
                            model.freezeTransaction.freezeTime = resp.freezeTime;
                            model.freezeTransaction.freezeTime = moment( model.freezeTransaction.freezeTime).format('HH:MM:SS');
                            PageHelper.hideLoader();
                        },function(err){
                            console.log("ERR",err);
                            PageHelper.hideLoader();
                            PageHelper.showErrors(err);
                        })
                    }
                }
            };
        }
    }
})

