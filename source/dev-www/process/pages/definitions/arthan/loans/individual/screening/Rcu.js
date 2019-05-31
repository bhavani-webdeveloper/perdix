define(["perdix/domain/model/loan/LoanProcess",
    "perdix/domain/model/loan/LoanProcessFactory",
    'perdix/domain/model/customer/EnrolmentProcess',
    "perdix/domain/model/loan/LoanCustomerRelation",
    ], function (LoanProcess, LoanFactory, EnrolmentProcess, LoanCustomerRelation) {
        var LoanProcessts = LoanProcess["LoanProcess"];
        var EnrolmentProcess = EnrolmentProcess["EnrolmentProcess"];
        var LoanCustomerRelationTypes = LoanCustomerRelation["LoanCustomerRelationTypes"];
        return {
            pageUID: "arthan.dashboard.loans.individual.screening.Rcu",
            pageType: "Bundle",
            dependencies: ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
        ,"IndividualLoan", "Lead", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
        "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch","Queries", "Utils", "IndividualLoan", "BundleManager", "Message"],
            $pageFn: function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,IndividualLoan, Lead, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch,Queries, Utils, IndividualLoan, BundleManager, Message) {
                return {
                    "type": "page-bundle",
                    "title": "RCU",
                    "subTitle": "",
                    "bundleDefinitionPromise": function() {
                        return $q.resolve([
                            {
                                pageName: 'arthan.dashboard.loans.individual.screening.detail.BasicDetails',
                                title: 'Basic Details',
                                pageClass: 'basicDetails',
                                minimum: 1,
                                maximum: 1,
                                order:10
                            },
                        ]);
                    },
                    "bundlePages": [],
                    "offline": false,

                    "pre_pages_initialize": function(bundleModel){
                        $log.info("Inside pre_page_initialize");
                        bundleModel.currentStage = "RCU";
                        var deferred = $q.defer();

                        var $this = this;
                        if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)){
                            PageHelper.showLoader();
                            bundleModel.loanId = $stateParams.pageId;
                            LoanProcessts.get(bundleModel.loanId)
                            .subscribe(function(loanProcess){
                                var loanAccount = loanProcess;
                                var customerIds = {};
                                for (var i = 0; i < loanAccount.loanAccount.loanCustomerRelations.length; i++) {
                                    var cust = loanAccount.loanAccount.loanCustomerRelations[i];
                                    if (cust.relation == 'APPLICANT' || cust.relation == 'Applicant' || cust.relation == 'Sole Proprieter') {
                                        customerIds.applicant = cust.customerId;
                                    } 
                                }
                                $this.bundlePages.push({
                                    pageClass: 'basicDetails',
                                    model: {
                                        customerId: customerIds.applicant,
                                        businessCustomerId : loanAccount.loanAccount.customerId,
                                        loanAccount: loanAccount.loanAccount
                                    }
                                });
                                PageHelper.hideLoader();
                                deferred.resolve();

                            });
                        }
                        return deferred.promise;
                    },
                    "post_pages_initialize": function(bundleModel){
                        $log.info("Inside post_page_initialize");
                        BundleManager.broadcastEvent('origination-stage', 'Rcu');
                    },
                    eventListeners: {
                        "on-customer-load": function(pageObj, bundleModel, params){
                            BundleManager.broadcastEvent("test-listener", {name: "SHAHAL AGAIN"});
                        },
                        // "new-enrolment": function(pageObj, bundleModel, params){
                        //     switch (pageObj.pageClass){
                        //         case 'applicant':
                        //             $log.info("New applicant");
                        //             bundleModel.applicant = params.customer;
                        //             BundleManager.broadcastEvent("new-applicant", params);
                        //             break;
                        //         case 'co-applicant':
                        //             $log.info("New co-applicant");
                        //             if (!_.hasIn(bundleModel, 'coApplicants')) {
                        //                 bundleModel.coApplicants = [];
                        //             }
                        //             BundleManager.broadcastEvent("new-co-applicant", params);
                        //             bundleModel.coApplicants.push(params.customer);
                        //             break;
                        //         case 'guarantor':
                        //             $log.info("New guarantor");
                        //             if (!_.hasIn(bundleModel, 'guarantors')){
                        //                 bundleModel.guarantors = [];
                        //             }
                        //             bundleModel.guarantors.push(params.guarantor);
                        //             break;
                        //         case 'business':
                        //             $log.info("New Business Enrolment");
                        //             bundleModel.business = params.customer;
                        //             BundleManager.broadcastEvent("new-business", params);
                        //             break;
                        //         default:
                        //             $log.info("Unknown page class");
                        //             break;

                        //     }
                        // },
                        
                    }
                }
            }
        }
    }
);