define(['perdix/infra/api/AngularResourceService'], function (AngularResourceService) {
    return {
        pageUID: "customer.banking.Remittance",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository","irfNavigator","Transaction"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
            PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository,irfNavigator,Transaction) {

            AngularResourceService.getInstance().setInjector($injector);
            return {
                "type": "schema-form",
                "title": "REMITTANCE",
                "subTitle": "",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    };
                    model.remittance={};
                    var getEnrollment=function(id){
                        var deferred=$q.defer();
                        Enrollment.getCustomerById(id).$promise
                        .then(function(resp,header){
                            deferred.resolve(resp)
                        },function(err){
                            deferred.reject(err);
                        })
                        return deferred.promise;
                      }
    
                        if($stateParams.pageId!=null || $stateParams.pageId!=undefined){
                           var res= getEnrollment({id:$stateParams.pageId});
                           res.then(function(resp){
                                model.customer=resp;
                                model.remittance.customerId=resp.id;
                            },function(err){
                                console.log(err);
                            });
                        }

                        var remittance = function(id){
                            var deferred = $q.defer();
                            Transaction.getRemittance({"customerId":id}).$promise
                            .then(function(resp,header){
                                deferred.resolve(resp)
                            },function(err){
                                deferred.reject(err);
                            })
                            return deferred.promise;
                        }

                        remittance($stateParams.pageId).then(function(resp){
                            console.log(resp);
                            model.remittance.table=resp.body;
                        },function(err){
                            console.log(err);
                        })

                    //  if($stateParams.pageId!=null || $stateParams.pageId!=undefined){
                    //     Enrollment.getCustomerById({id:$stateParams.pageId},function(resp,header){
                    //         model.customer=resp;
                    //     })
                    // }
                    // else
                    // {
                    //     irfNavigator.go({
                    //         "state": "Page.Engine",
                    //         "pageName": "customer.banking.Banking"
                    //     });
                    // }
                   

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
                            "Remittance",
                            "Remittance.amount",
                            "Remittance.transactioncode",
                            "Remittance.serviceProvider"
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
                             "Remittance":{
                                 "type":"box",
                                 "orderNo": 1,
                                 "title":"REMITTANCE",
                                 "items":{
                                    "serviceProvider":{
                                        "key":"remittance.serviceProvider",
                                        "type":"radios",
                                        "title": "SERVICE_PROVIDER",
                                        "required": true,
                                        "titleMap":[
                                        {
                                            "name": "WESTERN_UNION",
                                            "value": "Western Union"
                                        },
                                        {
                                            "name": "EXPRESS_MONEY",
                                            "value": "Express Money"
                                        },
                                        //{
                                        //     "name": "NEFT",
                                        //     "value": "NEFT"
                                        // },
                                        {
                                            "name": "RIA_MONEY",
                                            "value": "Ria Money"
                                        }]
                                        },
                                        "amount":{
                                            "key":"remittance.amountInPaisa",
                                            "type":"text",
                                            "title": "AMOUNT",
                                            "required": true
                                        },
                                        "transactioncode":{
                                            "key":"remittance.trxnCode",
                                            "type":"text",
                                            "title": "TRANSACTION_CODE",
                                            "required": true
                                        },
                                    }
                                },
                            },
                            "additions": [
                                {
                                    "type": "actionbox",
                                    "orderNo": 2,
                                    "items": [
                                        {
                                            "type": "submit",
                                            "title": "SUBMIT"
                                        },
                                    ]
                                }
                            ]
                        }
                    };
              var formTable={
                "type": "box",
                "colClass": "col-sm-12",
                "title": "REMITTANCE",
                "items": [{
                    "type": "section",
                    "colClass": "col-sm-12",
                    "html": '<table class="table"><colgroup><col width="20%"><col width="5%"><col width="20%"></colgroup><thead><tr><th>CustomerId</th><th>Transaction Code</th><th>Amount</th><th>Transaction Type</th><th>Transaction Date</th></tr></thead><tbody>' +
                        '<tr ng-repeat="item in model.remittance.table">' +
                        '<td>{{ item["customerId"] }}</td>' +
                        '<td>{{ item["trxnCode"] }}</td>' +
                        '<td>{{ item["amountInPaisa"] }}</td>' +
                        '<td>{{ item["trxnType"] }}</td>' +
                        '<td>{{ item["trxnDate"] | date }}</td>' +
                        '</li></ul></td></tr></tbody></table>'
                }]
            };
                    UIRepository.getEnrolmentProcessUIRepository().$promise
                        .then(function (repo) {
                            console.log(model.pageClass);
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function (form) {
                            self.form = form;
                            self.form.push(formTable);
                            console.log(form);
                            console.log("_________________Testing form data___________");
                        });

                    /* Form rendering ends */
                },
                listOptions: {
                    selectable: false,
                    expandable: true,
                    listStyle: "table",
                    // itemCallback: function(item, index) {},
                    itemCallback: function(item, index) {
                        $log.info(item);
                        console.log(item);
                        // $state.goBack();
                    },
                    getItems: function(response, headers) {
                        if (response != null && response.length && response.length != 0) {
                            return response;
                        }
                        return [];
                    },
                    getListItem: function(item) {
                        return [
                            'ID:' +  item.id,
                            'AMOUNT' + item.amountInPaisa,
                            'TRANSACTION_CODE' + item.trxnCode,
                            'TRANSACTION_DATE' + item.trxnDate,
                            'TRANSACTION_TYPE' + item.trxnType,
                            'TRANSACTION_DONE_BY' + item.trxnDoneBy,
                            'BRANCH_ID' + item.branchId,
                            'MOBILE_NO' + item.mobileNo
                        ]
                    },
                    getTableConfig: function() {
                        return {
                            "serverPaginate": true,
                            "paginate": true,
                            "pageLength": 10
                        };
                    },
                    getColumns: function() {
                        return [{
                            title: 'ID',
                            data: 'id'
                        }, {
                            title: 'AMOUNT',
                            data: 'amountInPaisa'
                        }, {
                            title: 'TRANSACTION_CODE',
                            data: 'trxnCode'
                        }, {
                            title: 'TRANSACTION_DATE',
                            data: 'trxnDate'
                        }, {
                            title: 'TRANSACTION_TYPE',
                            data: 'trxnType'
                        }, {
                            title: 'TRANSACTION_DONE_BY',
                            data: 'trxnDoneBy'
                        }, {
                            title: 'BRANCH_ID',
                            data: 'branchId'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "Follow Up",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                entityManager.setModel('customer.banking.Remittance', {
                                    _request: item
                                });
                                $state.go("Page.Engine", {
                                    pageName: "customer.banking.Remittance",
                                    pageId: item.id
                                });
                            },
                            isApplicable: function(item, index) {
                                return true;
                            }
                        }];
                    }
                },

                preDestroy: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    return $q.resolve();
                },
                eventListeners: {
                  
                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                    return [
                    ]
                },
                form: [
                ],

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
                            PageHelper.showProgress("remittance", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }
                    },
                    proceed: function (model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('remittance', 'Updating remittance');
                        PageHelper.showLoader();
                      
                    },
                    submit: function (model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        model.remittance.trxnType = "REM_CASHOUT";  
                        Transaction.saveRemittance(model.remittance).$promise.then(function(resp){
                            console.log("resp",resp);
                        },function(err){
                            console.log("ERR",err);
                        });

                        var remittance = function(id){
                            var deferred = $q.defer();
                            Transaction.getRemittance({"customerId":id}).$promise
                            .then(function(resp,header){
                                deferred.resolve(resp)
                            },function(err){
                                deferred.reject(err);
                            })
                            return deferred.promise;
                        }

                        remittance($stateParams.pageId).then(function(resp){
                            console.log(resp);
                            model.remittance.table=resp.body;
                        },function(err){
                            console.log(err);
                        })

                    }
                }
            };
        }
    }
})
