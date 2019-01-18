irf.pageCollection.controller(irf.controller("Journal.FinconAccountingReview"), ["$log", "$scope", "Journal", "$state", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator", "UIRepository", "IrfFormRequestProcessor", "$injector", "entityManager", "SchemaResource", "irfSimpleModal", "Queries",
    function($log, $scope, Journal, $state, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator, UIRepository, IrfFormRequestProcessor, $injector, entityManager, SchemaResource, irfSimpleModal, Queries) {
        $log.info("Page.FinconAccounting.html loaded");
        $scope.$templateUrl = "process/pages/templates/Page.FinconAccounting.html";
        $scope.pageName = $stateParams.pageName;

        $scope.formHelper = formHelper;

        $scope.page = {
            "type": "schema-form",
            "title": "BRANCH_POSTING_ENTRY",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                var self = this;

                var pageDefPath = "perdix/domain/model/journal/finconaccounting/FinconPostingProcess";
                var journaldetail = "perdix/domain/model/journal/finconaccounting/JournalDetail";
                // var pageDefPath = "pages/" + $scope.pageName.replace(/\./g, "/");
                PageHelper.showLoader();
                require([pageDefPath, journaldetail], function(FinconPostingProcess, JournalDetails) {
                    FinconPostingProcess = FinconPostingProcess['FinconPostingProcess'];

                    model.journal = model.journal || {};
                    model.entryType = [{
                        'name': 'Debit',
                        'value': 'Debit'
                    }, {
                        'name': 'Credit',
                        'value': 'Credit'
                    }]

                    model.myFunc = function(journaldetails) {
                        var debitSum = 0;
                        var creditSum = 0;
                        _.forEach(journaldetails, function(journaldetail) {
                            if (journaldetail.drCrIndicator == "Credit" && journaldetail.transactionAmount) {
                                creditSum = creditSum + journaldetail.transactionAmount;
                            } else if (journaldetail.drCrIndicator == "Debit" && journaldetail.transactionAmount) {
                                debitSum = debitSum + journaldetail.transactionAmount;
                            }

                        })
                        model.totalAmount = creditSum - debitSum;
                    }

                    var configFile = function() {
                        return {}
                    }

                    var getOverrides = function(param) {
                        return {
                            "FinconAccounting": {
                                "readonly": true
                            },
                            "FinconAccounting.instrumentSection.billUpload":{
                                "readonly": true
                            },
                            "FinconAccounting.transactionSection.entryType": {
                                onChange: function(modelValue, form, model) {
                                    model.showFeilds = false;
                                    model.showFeild = false;
                                    if (modelValue == ("Payment - Account") || modelValue == ("Payment") || modelValue == ("Journal - Account") || modelValue == ("Journal")) {
                                        model.showFeilds = true;
                                    }
                                    if (modelValue == ("Payment - Account") || modelValue == ("Payment") || modelValue == ("Receipt - Account") || modelValue == ("Receipt")) {
                                        model.showFeild = true;
                                    }
                                }
                            },
                            "FinconAccounting.transactionSection.billNumber": {
                                "condition": "model.showFeilds"
                            },
                            "FinconAccounting.transactionSection.billDate": {
                                "condition": "model.showFeilds"
                            },
                            "FinconAccounting.instrumentSection.billUpload": {
                                "condition": "model.showFeilds"
                            },
                            "FinconAccounting.instrumentSection": {

                            },
                            "FinconAccounting.instrumentSection.instrumentType": {
                                "condition": "model.showFeild"
                            },
                            "FinconAccounting.instrumentSection.instrumentDate": {
                               "condition": "model.journal.journalHeader.instrumentType !='CASH' && model.showFeild "
                                //"condition": "FinconAccounting.instrumentSection.instrumentType !='CASH' && model.showFeild "
                              //  "condition": "model.showFeild"
                            },
                            
                            "FinconAccounting.instrumentSection.instrumentNumber": {
                                "condition": "model.journal.journalHeader.instrumentType !='CASH' && model.showFeild "
                            },
                            "FinconAccounting.instrumentSection.instrumentBankName": {
                                "condition": "model.journal.journalHeader.instrumentType !='CASH' && model.showFeild "
                            },
                            "FinconAccounting.instrumentSection.instrumentBranchName": {
                                "condition": "model.journal.journalHeader.instrumentType !='CASH' && model.showFeild "
                            },
                            "FinconAccounting.transactionSection.entryType": {
                                "type": "string"
                            }
                        }
                    }
                    var getIncludes = function(model) {
                        return [
                            "FinconAccounting",
                            "FinconAccounting.transactionSection",
                            "FinconAccounting.transactionSection.entryType",
                            "FinconAccounting.transactionSection.transactionDate",
                            "FinconAccounting.transactionSection.transactionBranchId",
                            "FinconAccounting.transactionSection.remarks",
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
                            "Entries"
                        ]

                    }
                    var formRequest = {
                        "overrides": getOverrides(model),
                        "includes": getIncludes(model),
                        "excludes": [
                            ""
                        ],
                        "options": {
                            "additions": [{
                                "type": "actionbox",
                                "orderNo": 1200,
                                "items": [{
                                    "type": "button",
                                    "title": "PROCEED",

                                    "onClick": "actions.save(model, formCtrl, form, $event)"
                                }, {
                                    "type": "button",
                                    "title": "SENDBACK",
                                    "onClick": "actions.sendBack(model, formCtrl, form, $event)"
                                }, {
                                    "type": "button",
                                    "title": "REJECT",
                                    "onClick": "actions.reject(model, formCtrl, form, $event)"

                                }]
                            }, {
                                "targetID": "Entries",
                                "items": [{
                                    "type": "section",
                                    "html": "\
                                        <style>\
                                        .margin-top-5px{\
                                                margin-top:10px \
                                        }\
                                        .margin-top-10px{\
                                                margin-top:20px \
                                        }\
                                        .custom-popup-wrapper {\
                                            position: absolute;\
                                            top: 100%;\
                                            left: 0;\
                                            z-index: 1000;\
                                            display: none;\
                                            background-color: #f9f9f9;\
                                          }\
                                            .custom-popup-wrapper > .message {\
                                            padding: 10px 20px;\
                                            border-bottom: 1px solid #ddd;\
                                            color: #868686;\
                                          }\
                                             .custom-popup-wrapper > .dropdown-menu {\
                                            position: static;\
                                            float: none;\
                                            display: block;\
                                            min-width: 160px;\
                                            background-color: transparent;\
                                            border: none;\
                                            border-radius: 0;\
                                            box-shadow: none;\
                                          }\
                                        </style>\
                                        <script type=\"text/ng-template\" id=\"customTemplate.html\">\
                                          <a>\
                                              <b>Name: </b>{{ match.model.glName }} -- <small>{{ match.model.category}}</small> <br />\
                                              <b>Code:</b><span ng-bind-html=\"match.label | uibTypeaheadHighlight:query\"></span>\
                                          </a>\
                                        </script>\
                                        <script type=\"text/ng-template\" id=\"customTemplat.html\">\
                                          <a>\
                                              <b>Customer:</b> {{ match.model.customer }} , <b>Applicant:</b>{{ match.model.applicant}} <br />\
                                              <b>AccountNumber:</b> <span ng-bind-html=\"match.label | uibTypeaheadHighlight:query\"></span>\
                                          </a>\
                                        </script>\
                                        <script type=\"text/ng-template\" id=\"customPopupTemplate.html\">\
                                          <div class=\"custom-popup-wrapper\"\
                                             ng-style=\"{top: position().top+'px', left: position().left+'px'}\"\
                                             style=\"display: block;\"\
                                             ng-show=\"isOpen() && !moveInProgress\"\
                                             aria-hidden=\"{{!isOpen()}}\">\
                                            <p class=\"message\">select gl account from dropdown.</p>\
                                            <ul class=\"dropdown-menu\" role=\"listbox\">\
                                              <li class=\"uib-typeahead-match\" ng-repeat=\"match in matches track by $index\" ng-class=\"{active: isActive($index) }\"\
                                                ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index)\" role=\"option\" id=\"{{::match.id}}\">\
                                                <div uib-typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></div>\
                                                \
                                              </li>\
                                            </ul>\
                                          </div>\
                                        </script>\
                                        <div class='row'> \
                                            <div class='col-xs-12'> \
                                            <table >\
                                                <thead>\
                                                    <th class='col-xs-3'>GL_AC_NO</th>\
                                                    <th class='col-xs-1'>Type</th>\
                                                    <th class='col-xs-2'>Amount</th>\
                                                    <th class='col-xs-3'>Loan Account No</th>\
                                                    <th class='col-xs-2'>Narration</th>\
                                                    <th class='col-xs-1'>Delete</th>\
                                                </thead>\
                                                <tbody>\
                                                    <tr ng-repeat='d in model.journal.journalHeader.journalDetails track by $index'>\
                                                        <td readonly class='col-xs-3'>\
                                                            <div> \
                                                                <input type=\"text\" disabled class=\"form-control\" ng-change='myFun()' ng-model=\"d['glAcNo']\" uib-typeahead=\"glcode as glcode.productCode for glcode in model.glcodes | filter:$viewValue | limitTo:10 \" placeholder=\"Enter code\" typeahead-editable='false' typeahead-popup-template-url=\"customPopupTemplate.html\" typeahead-template-url=\"customTemplate.html\" >\
                                                            </div>\
                                                        </td>\
                                                        <td class='col-xs-2'> \
                                                            <select class='form-control' disabled ng-model=\"d['drCrIndicator']\" schema-validate='form' ng-options='item.value as item.name for item in model.entryType'><option value=''>{{('CHOOSE'|translate)+' '+(form.title|translate)}}</option> </select>\
                                                        \
                                                        </td>\
                                                        <td class='col-xs-1'>\
                                                            <input ng-model=\"d['transactionAmount']\" disabled type='number' ng-change='model.myFunc(d,model.journal.journalHeader.journalDetails)' class='form-control' />\
                                                        </td>\
                                                        <td class='col-xs-3'>\
                                                            <div> \
                                                                <input disabled typeahead-append-to-body=\"true\" class=\"form-control\" ng-model=\"d['relatedAccountNo']\" uib-typeahead=\"loanNumb as loanNumb.account_number for loanNumb in model.getLoanAccountNumber($viewValue) | limitTo:10\"  typeahead-popup-template-url=\"customPopupTemplate.html\" typeahead-template-url=\"customTemplat.html\" >\
                                                            </div>\
                                                        </td>\
                                                        <td class='col-xs-2'><textarea disabled rows=\"1\" ng-model=\"d['remarks']\" class='form-control' />\
                                                        </td>\
                                                        <td class='col-xs-1'><a href='' ng-click=\"return false\"'>Delete</a>\
                                                        </td>\
                                                    </tr> \
                                                </tbody>\
                                            </table>\
                                            <div class=\"margin-top-5px pull-right\"><a onclick=\"return false\" href='' ng-click=\"return false;\"><i class='fa fa-plus'>Add Entry</i></a></div>\
                                            <div class=\"margin-top-10px text-center\"><span disabled ng-model=\"d['totalAmount']\"><b>TotalAmount :</b> {{' ' + model.totalAmount}}</span></div>"

                                }]
                            }]
                        }
                    }
                    UIRepository.getFinconAccountingUIRepository().$promise
                        .then(function(repo) {
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function(form) {
                            console.log(form)
                            self.form = form;
                        });
                    if (!_.hasIn($stateParams, 'pageId') || _.isNull($stateParams.pageId)) {
                        FinconPostingProcess.createNewProcess()
                            .finally(function() {
                                PageHelper.showProgress('Posting', 'Loading Finished.', 5000);
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(journal) {
                                model.finconProcess = journal;
                                console.log(journal);
                                model.journal.journalHeader = {};
                                model.journal.journalHeader = journal.journalHeader;
                                journalDetailsClass = JournalDetails;
                                // model.journal.journalEntryDto.branchId = SessionStore.getCurrentBranch().branchId;
                            });
                    } else {
                        var obs = FinconPostingProcess.getJournal($stateParams.pageId);
                        obs.subscribe(function(res) {
                            PageHelper.hideLoader();
                            console.log(res);
                            model.finconProcess = res
                                // model.finconProcess = res
                            model.journal.journalHeader = res.journalHeader;
                            model.showFeilds = false;
                            model.showFeild = false;
                            _.forEach(res.journalHeader.journalDetails ,function(journaldetail){
                                journaldetail.glAcNo = "TESTGL101"
                            })
                            if (res.journalHeader.entryType == ("Payment - Account") || res.journalHeader.entryType == ("Payment") || res.journalHeader.entryType == ("Journal - Account") || res.journalHeader.entryType == ("Journal")) {
                                model.showFeilds = true;
                            }
                            if (res.journalHeader.entryType == ("Payment - Account") || res.journalHeader.entryType == ("Payment") || res.journalHeader.entryType == ("Receipt - Account") || res.journalHeader.entryType == ("Receipt")) {
                                model.showFeild = true;
                            }
                            model.journal.journalHeader.billNumber = parseInt(res.journalHeader.billNumber);
                            model.journal.journalHeader.instrumentNumber = parseInt(res.journalHeader.instrumentNumber);
                            model.myFunc(res.journalHeader.journaldetails)
                        })
                    }


                })

            },
            form: [],
            schema: function() {
                return SchemaResource.getJournalMultiSchema().$promise;
            },
            actions: {
                save: function(model, formCtrl, form, $event) {
                    PageHelper.showLoader();
                    console.log(model.finconProcess);
                    model.finconProcess.proceed("Completed")
                        .finally(function() {
                            PageHelper.hideLoader();
                        })
                        .subscribe(function(out) {
                            console.log(out);
                            irfNavigator.goBack();
                        }, function(err) {
                            console.log(err);
                            PageHelper.hideLoader();
                        })
                },
                reject: function(model, formCtrl, form, $event) {
                    $log.info("Inside reject()");
                    // if (PageHelper.isFormInvalid(formCtrl)) {
                    //     return false;
                    // }
                    PageHelper.showLoader();
                    //model.branchProcess.remarks = model.journal.remarks;
                    model.finconProcess.reject()
                        .finally(function() {
                            PageHelper.hideLoader();
                        })
                        .subscribe(function(out) {
                            PageHelper.showProgress("Review Rejected", "Posting Rejected", 3000);
                            // PageHelper.showProgress('Posting', 'Done.', 5000);
                            irfNavigator.goBack();
                        }, function(err) {
                            PageHelper.showProgress('Posting', 'Oops. Some error.', 5000);
                            PageHelper.showErrors(err);
                            PageHelper.hideLoader();
                        });
                },
                sendBack: function(model, formCtrl, form, $event) {
                    model.finconProcess.sendBack("multiJournalEntry")
                        .finally(function() {
                            PageHelper.hideLoader();
                        })
                        .subscribe(function(out) {
                            PageHelper.showProgress("Posting Send Back", "Posting Send Back", 3000);
                            PageHelper.showProgress('Posting', 'Done.', 5000);
                            irfNavigator.goBack();
                        }, function(err) {
                            PageHelper.showProgress('Posting', 'Oops. Some error.', 5000);
                            PageHelper.showErrors(err);
                            PageHelper.hideLoader();
                        });
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
        promise.then(function(data) {
            $scope.schema = data;
        });
        $scope.model = entityManager.getModel($scope.pageName);

    }
]);
