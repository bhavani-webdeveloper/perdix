irf.pageCollection.factory(irf.page('loans.Service'),
    ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter","Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils",
        function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils) {
            return {
                "id": "GroupDisbursement",
                "type": "schema-form",
                "name": "GroupDisbursement",
                "title": "GROUP_LOAN_DISBURSEMENT",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    $log.info("I got initialized");
                    PageHelper.showLoader();
                    irfProgressMessage.pop('loading-loan-details', 'Loading Loan Details');
                    //PageHelper
                    var loanAccountNo = $stateParams.pageId;
                    var promise = LoanAccount.get({accountId: loanAccountNo}).$promise;
                    promise.then(function (data) { /* SUCCESS */
                        model.loanAccount = data;
                        irfProgressMessage.pop('loading-loan-details', 'Loaded.', 2000);
                    }, function (resData) {
                        irfProgressMessage.pop('group-disbursement', 'Error loading disbursement details.', 2000);
                    })
                        .finally(function(){
                            PageHelper.hideLoader();
                        })

                },
                offline: false,
                form: [
                    {
                        "type":"box",
                        "title":"ACCOUNTS",
                        "items":[

                        ]
                    }
                ],
                actions: {
                    preSave: function (model, formCtrl) {
                        var deferred = $q.defer();
                        model._storedData = null;
                        deferred.resolve();
                        return deferred.promise;
                    },
                    submit: function (model, formCtrl, formName) {
                        $log.info("Inside submit");
                    }
                }
            }
        }]);
