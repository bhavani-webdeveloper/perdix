irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHClose"), ["$log", "ACH", "IndividualLoan", "LoanAccount", "PageHelper", "irfProgressMessage", "SessionStore", "$state", "Utils", "$stateParams", "formHelper", "CustomerBankBranch", 'Queries', "$q",
    "irfNavigator",
    function($log, ACH, IndividualLoan, LoanAccount, PageHelper, irfProgressMessage, SessionStore, $state, Utils, $stateParams, formHelper, CustomerBankBranch, Queries, $q, irfNavigator) {

        var branch = SessionStore.getBranch();
        var achSearchPromise;
        var loanAccountPromise;
        var queriesPromise;

        return {
            "type": "schema-form",
            "title": "ACH_CLOSE",
            "subTitle": "",

            initialize: function(model, form, formCtrl) {
                //Create Model ach
                model.ach = model.ach || {};
                model.temp = model.temp || {};
                model.achACHSearch = model.achACHSearch || {};

                $log.info("ACH_CLOSE got initialized");
            },
            offline: false,

            getOfflineDisplayItem: function(item, index) {},

            form: [{
                "type": "box",
                "notitle": true,
                "items": [{
                    "type": "fieldset",
                    "title": "ACH_DETAILS",
                    "items": [{
                        key: "ach.accountNumber",
                        type: "lov",
                        autolov: true,
                        title: "ACCOUNT_NUMBER",
                        bindMap: {},
                        inputMap: {

                        },
                        outputMap: {

                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            // console.log(model.ach.accountNumber);
                            return ACH.search({
                                'accountNumber': model.ach.accountNumber
                            }).$promise;
                        },
                        onSelect: function(result, model, arg1) {
                            model.ach = result;
                            model.ach.accountNumber = result.accountId;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                'Account Number : ' + item.accountId,
                                'Branch : ' + item.bankName,
                                'Bank : ' + item.branchName,
                                'IFSC Code : ' + item.ifscCode
                            ];
                        }
                    }, {
                        "key": "ach.accountType",
                        "title": "ACCOUNT_TYPE",
                    }, {
                        "key": "ach.applicantName",
                        "title": "APPLICANT_NAME",
                    }, {
                        "key": "ach.bankAccountNumber",
                        "title": "BANK_ACCOUNT_NUMBER",
                    }, {
                        "key": "ach.accountHolderName",
                        "title": "ACCOUNT_HOLDER_NAME",
                    }, {
                        "key": "ach.bankName",
                        "title": "BANK_NAME",
                    }, {
                        "key": "ach.ifscCode",
                        "title": "IFSC_CODE",
                    }, {
                        "key": "ach.registrationDate",
                        "title": "REGISTRATION_DATE",
                    }]
                }]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            }],

            schema: function() {
                return ACH.getSchema().$promise;
            },

            actions: {
                submit: function(model, form, formName) {
                    PageHelper.clearErrors();
                    PageHelper.showLoader();

                    ACH.ACHClose(model.ach).$promise.then(
                        function(response) {
                            PageHelper.hideLoader();
                            PageHelper.showProgress("page-init", "Done.", 2000);
                            irfNavigator.goBack();
                            /*$state.go("Page.Engine", {
                            	pageName: 'loans.individual.achpdc.ACHPDCQueue',
                            	pageId: null
                            });*/
                        },
                        function(errorResponse) {
                            PageHelper.hideLoader();
                            PageHelper.showErrors(errorResponse);
                        }
                    ).finally(function() {
                        PageHelper.hideLoader();
                    });

                    //model.ach=response;
                },
            }

        }
    }
]);