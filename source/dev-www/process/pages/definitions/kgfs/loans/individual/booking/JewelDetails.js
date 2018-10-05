define([], function () {

    return {
        pageUID: "kgfs.loans.individual.booking.JewelDetails",
        pageType: "Engine",
        dependencies: ["$log", "$q", "LoanAccount", "LoanProcess", 'Scoring', 'Enrollment', 'EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
            'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
            "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor", "UIRepository", "$injector", "irfNavigator"
        ],

        $pageFn: function ($log, $q, LoanAccount, LoanProcess, Scoring, Enrollment, EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper, formHelper, elementsUtils,
            irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
            BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator) {
            var branch = SessionStore.getBranch();
            var podiValue = SessionStore.getGlobalSetting("percentOfDisposableIncome");
            //PMT calculation
           
            //pmt function completed

            var self;
            var validateForm = function (formCtrl) {
                formCtrl.scope.$broadcast('schemaFormValidate');
                if (formCtrl && formCtrl.$invalid) {
                    PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                    return false;
                }
                return true;
            };
            var getIncludes = function (model) {
                return [];
            }
            var configFile = function (model) {
                return []
            }
            var overridesFields = function (model) {
                return {};
            }

            return {
                "type": "schema-form",
                "title": "DSC",
                "subTitle": "",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
        
                    self = this;
                    var p1 = UIRepository.getLoanProcessUIRepository().$promise;
                    p1.then(function (repo) {
                            console.log("Text");
                            // console.log(repo);                       
                            var formRequest = {
                                "overrides": overridesFields(model),
                                "includes": getIncludes(model),
                                "excludes": [],
                                "options": {
                                    "repositoryAdditions": {
                                    },
                                    "additions": [
                                        {
                                            "type" : "box",
                                            "title" : "JEWEL_LOAN_DETAILS",
                                            "items" : [
                                                {
                                                    "type":"text",
                                                    "title":"POUCH_NO",
                                                    "key": "loanAccount.jewelLoanDetails.jewelPouchNo"
                                                },
                                                {
                                                    "type":"text",
                                                    "title":"ORNAMENT_DESCRIPTION",
                                                },
                                                {
                                                    "type":"text",
                                                    "title":"STONE_DESCRIPTION",

                                                },
                                                {
                                                    "type": "text",
                                                    "title":"JEWEL_DEFECTS"
                                                },
                                                {
                                                    "type": "numeric",
                                                    "title": "NO_OF_ARTICLES",
                                                },
                                                {
                                                    "type": "numeric",
                                                    "title": "GROSS_WEIGHT"
                                                },
                                                {
                                                    "type": "numeric",
                                                    "title": "NET_WEIGHT"
                                                },
                                                {
                                                    "type":"numeric",
                                                    "title":"CARAT"
                                                },
                                                {
                                                    "type":"numeric",
                                                    "title": "RATE"
                                                },
                                                {
                                                    "type":"numeric",
                                                    "title": "MARKET_VALUE"
                                                }

                                                
                                                
                                            ]
                                        },
                                        {
                                            "type" : "box",
                                            "title" : "JEWEL_LOAN_DETAILS",
                                            "items" : [
                                                {
                                                    "type": "numeric",
                                                    "title": "NO_OF_ARTICLES",
                                                    "readonly":true
                                                },
                                                {
                                                    "type": "numeric",
                                                    "title": "GROSS_WEIGHT",
                                                    "readonly":true
                                                },
                                                {
                                                    "type": "numeric",
                                                    "title": "NET_WEIGHT",
                                                    "readonly":true
                                                },
                                                {
                                                    "type":"numeric",
                                                    "title": "TOTAL_MARKET_VALUE",
                                                    "readonly":true
                                                }
                                            ]
                                        }
                                    ]
                                }
                            };
                            var result = IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model);
                            console.log(result);
                            console.log("test");
                            return result;
                        })
                        .then(function (form) {
                            self.form = form;
                        });
                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                    return [
                        item.customer.firstName,
                        item.customer.centreCode,
                        item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                    ]
                },
                eventListeners: {
                },
                form: [],
                schema: function () {
                    console.log("First thing to excecute I guess");
                    return SchemaResource.getLoanAccountSchema().$promise;
                },
                actions: { },
            };

        }
    }
});
