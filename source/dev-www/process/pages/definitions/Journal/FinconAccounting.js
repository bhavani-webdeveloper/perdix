
irf.pageCollection.controller(irf.controller("Journal.FinconAccounting"), ["$log", "$scope", "Journal", "$state", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator", "UIRepository", "IrfFormRequestProcessor", "$injector", "entityManager", "SchemaResource", "irfSimpleModal",
    function($log, $scope, Journal, $state, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
            PageHelper, Utils, PagesDefinition, Queries, irfNavigator, UIRepository, IrfFormRequestProcessor, $injector, entityManager, SchemaResource, irfSimpleModal) {
        $log.info("Page.FinconAccounting.html loaded");
        $scope.$templateUrl = "process/pages/templates/Page.FinconAccounting.html";
        $scope.pageName = $stateParams.pageName;
        
        $scope.formHelper = formHelper;
        // $scope.page = $injector.get(irf.page($scope.pageName));
        // $scope.page.type = "schema-form";
        // $scope.initialize = function(model, form, formCtrl) {
        //     console.log(model)
        // }
        
        $scope.page = {
            "type": "schema-form",
            "title": "BRANCH_POSTING_ENTRY",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                var self = this;
                var journalDetailsClass;
                model.entries = [];
                model.entries.push(model.entries.length+1)
                var result = [];
                model.entryType = [{
                    'name':'Debit',
                    'value':'Debit'
                }, {
                    'name':'Credit',
                    'value':'Credit'
                }]
                model.addEntry = function() {
                    var length = model.journal.journalHeader.journalDetails.length;
                    model.entries.push(length + 1)
                    console.log(journalDetailsClass)
                    model.journal.journalHeader.journalDetails[length] = new journalDetailsClass();
                }
                model.delete = function(index) {
                    model.entries.splice(index , 1)
                    model.journal.journalHeader.journalDetails.splice(index, 1)
                }
                Journal.listAccountCode({
                    'glType': 'LEDGER'
                }).$promise.then(function(response){
                    model.glcodes = response.body;
                });
                var GLAccountHTML = '\
                <div class="list-group" ng-repeat="code in model.glcodes">\
                  <a href="" class="list-group-item" ng-click="$close(model.takeData(code))">{{code.productCode}}</a>\
                </div>\
                    <div id="responsediv" class="text-danger">\
                    </div>';
                model.openLov = function(index) {
                    var glAccCode = irfSimpleModal("GL Account Code", GLAccountHTML, {
                        "glcodes": model.glcodes,
                        takeData: function(code) {
                            
                            model.journal.journalHeader.journalDetails[index].glAcNo = code.productCode;
                            
                        }
                    });
                }
            
                var pageDefPath = "perdix/domain/model/journal/finconaccounting/FinconPostingProcess";
                var journaldetail = "perdix/domain/model/journal/finconaccounting/JournalDetail";
                // var pageDefPath = "pages/" + $scope.pageName.replace(/\./g, "/");
                PageHelper.showLoader();
                require([pageDefPath, journaldetail], function(FinconPostingProcess, JournalDetails){
                    FinconPostingProcess = FinconPostingProcess['FinconPostingProcess'];

                    model.journal = model.journal || {};
                    
                    var configFile = function() {
                        return {}
                    }

                    var getOverrides = function(param) {
                        return {

                        }
                    }
                    var getIncludes = function(model) {
                        return [
                            "FinconAccounting",
                            "FinconAccounting.transactionSection",
                            "FinconAccounting.transactionSection.entryType",
                            "FinconAccounting.transactionSection.transactionDate",
                            "FinconAccounting.transactionSection.transactionBranch",
                            "FinconAccounting.transactionSection.valueDate",
                            "FinconAccounting.transactionSection.billNumber",
                            "FinconAccounting.transactionSection.billDate",
                            "FinconAccounting.instrumentSection",
                            "FinconAccounting.instrumentSection.billUpload",
                            "FinconAccounting.instrumentSection.instrumentType",
                            "FinconAccounting.instrumentSection.instrumentDate",
                            "FinconAccounting.instrumentSection.instrumentNumber",
                            "FinconAccounting.instrumentSection.instrumentBankName",
                            "FinconAccounting.instrumentSection.instrumentBranchName",
                            "Entries",
                            "Entries.section1"
                        ]
                        
                    }
                    var formRequest = {
                        "overrides": getOverrides(model),
                        "includes": getIncludes (model),
                        "excludes": [
                        ""
                        ],
                        "options": {
                            "additions": [
                            {
                                "type": "actionbox",
                                "orderNo": 1200,
                                "items": [
                                {
                                    "type": "button",
                                    "title": "SAVE",

                                    "onClick": "actions.save(model, formCtrl, form, $event)"
                                },
                                {
                                    "type": "submit",

                                    "title": "SUBMIT"
                                }]
                            }
                            ]
                        }
                    }



                    FinconPostingProcess.createNewProcess()
                        .finally(function() {
                            PageHelper.showProgress('Posting', 'Loading Finished.', 5000);    
                            PageHelper.hideLoader();
                        })
                        .subscribe(function(journal) {
                            model.finconProcess = journal;
                            model.journal.journalHeader = {};
                            model.journal.journalHeader = journal.journalHeader;
                            journalDetailsClass =  JournalDetails;
                            UIRepository.getFinconAccountingUIRepository().$promise
                            .then(function(repo){
                                return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                            })
                            .then(function(form){
                                console.log(form)
                                self.form = form;
                            });
                            // model.journal.journalEntryDto.branchId = SessionStore.getCurrentBranch().branchId;
                        })
                })
                // model.journal = model.journal || {};
               
            },
            form: [],
            schema: function() {
                return SchemaResource.getJournalMultiSchema().$promise;
            },
            actions: {
                save: function (model, formCtrl, form, $event) {
                    PageHelper.showLoader();
                    model.finconProcess.save()
                        .finally(function() {
                            PageHelper.hideLoader();
                        })
                        .subscribe(function(out) {
                            console.log(out)
                        }, function(err) {
                            console.log(err);
                            PageHelper.hideLoader();
                        })
                }       
                    
            }
        }

        $scope.initialize = function(model, form, formCtrl) {
            if (model.$$STORAGE_KEY$$) {
                if (angular.isFunction($scope.page.offlineInitialize)) {
                    $scope.page.offlineInitialize(model, form, formCtrl);
                }
            } else {
                $scope.page.initialize(model, form, formCtrl);
            }
        };

        var promise = $scope.page.schema();
        promise.then(function(data){
            $scope.schema = data;
        });
        $scope.model = entityManager.getModel($scope.pageName);

    }
]);
