irf.pageCollection.factory(irf.page('loans.individual.screening.DedupeView'),
    ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
        ,"LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
        "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch","Queries", "Utils", "IndividualLoan", "BundleManager", "Message",
        function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch,Queries, Utils, IndividualLoan, BundleManager, Message) {
            $log.info("Inside LoanBookingBundle");


            return {
                "type": "page-bundle",
                "title": "DEDUPE_VIEW",
                "subTitle": "LOAN_BOOKING_BUNDLE_SUB_TITLE",
                "readonly": true,
                "bundleDefinition": [
                    {
                        pageName: 'customer.Dedupe',
                        title: 'DEDUPE',
                        pageClass: 'dedupe',
                        minimum: 1,
                        maximum: 1,
                        order: 10
                    },
                    {
                        pageName: 'customer.IndividualEnrolment2',
                        title: 'APPLICANT',
                        pageClass: 'applicant',
                        minimum: 1,
                        maximum: 1,
                        order: 20
                    },
                    {
                        pageName: 'customer.IndividualEnrolment2',
                        title: 'CO_APPLICANT',
                        pageClass: 'co-applicant',
                        minimum: 0,
                        maximum: 3,
                        order: 30
                    },
                    {
                        pageName: 'customer.IndividualEnrolment2',
                        title: 'GUARANTOR',
                        pageClass: 'guarantor',
                        minimum: 0,
                        maximum: 3,
                        order: 40
                    },
                    {
                        pageName: 'customer.EnterpriseEnrolment2',
                        title: 'BUSINESS',
                        pageClass: 'business',
                        minimum: 1,
                        maximum: 1,
                        order: 50
                    },
                    {
                        pageName: 'loans.individual.screening.LoanRequest',
                        title: 'LOAN_REQUEST',
                        pageClass: 'loan-request',
                        minimum: 1,
                        maximum: 1,
                        order: 60
                    },
                    {
                        pageName: 'loans.individual.screening.CBCheck',
                        title: 'CB_CHECK',
                        pageClass: 'cb-check',
                        minimum: 1,
                        maximum: 1,
                        order: 70
                    },
                    {
                        pageName: 'loans.individual.screening.Summary',
                        title: 'SUMMARY',
                        pageClass: 'summary',
                        minimum: 1,
                        maximum: 1,
                        order: 70
                    },
                    {
                        pageName: 'loans.individual.screening.CreditBureauView',
                        title: 'CREDIT_BUREAU',
                        pageClass: 'cbview',
                        minimum: 1,
                        maximum: 1,
                        order: 80
                    },
                    {
                        pageName: 'loans.individual.screening.Review',
                        title: 'REVIEW',
                        pageClass: 'loan-review',
                        minimum: 1,
                        maximum: 1,
                        order: 90
                    },
                    {
                        pageName: 'loans.individual.misc.BalanceSheetHistory',
                        title: 'BALANCE_SHEET_HISTORY',
                        pageClass: 'balance-sheet-history',
                        minimum: 1,
                        maximum: 1,
                        order: 100
                    }
                ],
                "bundlePages": [],
                "offline": true,
                "getOfflineDisplayItem": function(value, index){
                    var out = new Array(2);
                    for (var i=0; i<value.bundlePages.length; i++){
                        var page = value.bundlePages[i];
                        if (page.pageClass == "applicant"){
                            out[0] = page.model.customer.firstName;
                        } else if (page.pageClass == "business"){
                            out[1] = page.model.customer.firstName;
                        }
                    }
                    return out;
                },

                bundleActions: [{
                    name: "Conversation",
                    desc: "",
                    icon: "fa fa-comment",
                    fn: function(bundleModel) {
                        Message.openOrCreateConversation("Loan", $stateParams.pageId);
                    },
                    isApplicable: function(bundleModel) {
                        return true;
                    }
                }],

                "pre_pages_initialize": function(bundleModel){
                    $log.info("Inside pre_page_initialize");
                    bundleModel.currentStage = "Dedupe";
                    var deferred = $q.defer();

                    var $this = this;
                    if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)){
                        PageHelper.showLoader();
                        bundleModel.loanId = $stateParams.pageId;
                        IndividualLoan.get({id: bundleModel.loanId})
                            .$promise
                            .then(
                                function(res){
                                    var applicant;
                                    var coApplicants = [];
                                    var guarantors = [];
                                    var business;
                                    var urnNos = [];
                                    res.mscore="RiskScore1";

                                    for (var i=0; i<res.loanCustomerRelations.length; i++){
                                        var cust = res.loanCustomerRelations[i];
                                        if (cust.relation == 'APPLICANT' || cust.relation == 'Applicant' || cust.relation =='Sole Proprieter'){
                                            applicant = cust;
                                            urnNos.push(cust.urn);
                                        } else if (cust.relation == 'COAPPLICANT' || cust.relation == 'Co-Applicant') {
                                            coApplicants.push(cust);
                                            urnNos.push(cust.urn);
                                        } else if (cust.relation == 'GUARANTOR' || cust.relation == 'Guarantor') {
                                            guarantors.push(cust);
                                        }
                                    }

                                    $this.bundlePages.push({
                                        pageClass: 'summary',
                                        model: {
                                            cbModel: {customerId:res.customerId,loanId:bundleModel.loanId, scoreName:'RiskScore1'}
                                        }
                                    });

                                    $this.bundlePages.push({
                                        pageClass: 'balance-sheet-history',
                                        model: {customerUrn:res.urnNo, loanId:bundleModel.loanId}
                                    });

                                    $this.bundlePages.push({
                                        pageClass: 'applicant',
                                        model: {
                                            loanRelation: applicant
                                        }
                                    });

                                    for (var i=0;i<coApplicants.length; i++){
                                        $this.bundlePages.push({
                                            pageClass: 'co-applicant',
                                            model: {
                                                loanRelation: coApplicants[i]
                                            }
                                        });
                                    }

                                    for (var i=0;i<guarantors.length; i++){
                                        $this.bundlePages.push({
                                            pageClass: 'guarantor',
                                            model: {
                                                loanRelation: guarantors[i]
                                            }
                                        });
                                    }

                                    $this.bundlePages.push({
                                        pageClass: 'business',
                                        model: {
                                            loanRelation: {customerId:res.customerId}
                                        }
                                    });

                                    $this.bundlePages.push({
                                        pageClass: 'loan-request',
                                        model: {
                                            loanAccount: res
                                        }
                                    });

                                    $this.bundlePages.push({
                                        pageClass: 'cbview',
                                        model: {
                                            loanAccount: res
                                        }
                                    });

                                    $this.bundlePages.push({
                                        pageClass: 'loan-review',
                                        model: {
                                            loanAccount: res,
                                        }
                                    });

                                    $this.bundlePages.push({
                                        pageClass: 'dedupe',
                                        model: {
                                            loanAccount: res,
                                        }
                                    });

                                    deferred.resolve();

                                }, function(httpRes){
                                    deferred.reject();
                                    PageHelper.showErrors(httpRes);
                                }
                            )
                            .finally(function(){
                                PageHelper.hideLoader();
                            })
                    }
                    return deferred.promise;
                },
                "post_pages_initialize": function(bundleModel){
                    $log.info("Inside post_page_initialize");
                    BundleManager.broadcastEvent('origination-stage', 'ScreeningReview');

                },
                eventListeners: {
                    "on-customer-load": function(pageObj, bundleModel, params){
                        BundleManager.broadcastEvent("test-listener", {name: "SHAHAL AGAIN"});
                    },
                    "customer-loaded": function(pageObj, bundleModel, params){
                        console.log("custome rloaded :: " + params.customer.firstName);
                        BundleManager.broadcastEvent("customer-loaded", params.customer);
                        if (pageObj.pageClass =='applicant'){
                            BundleManager.broadcastEvent("applicant-updated", params.customer);
                        }
                    },
                    "new-enrolment": function(pageObj, bundleModel, params){
                        switch (pageObj.pageClass){
                            case 'applicant':
                                $log.info("New applicant");
                                bundleModel.applicant = params.customer;
                                BundleManager.broadcastEvent("new-applicant", params);
                                break;
                            case 'co-applicant':
                                $log.info("New co-applicant");
                                if (!_.hasIn(bundleModel, 'coApplicants')) {
                                    bundleModel.coApplicants = [];
                                }
                                BundleManager.broadcastEvent("new-co-applicant", params);
                                bundleModel.coApplicants.push(params.customer);
                                break;
                            case 'guarantor':
                                $log.info("New guarantor");
                                if (!_.hasIn(bundleModel, 'guarantors')){
                                    bundleModel.guarantors = [];
                                }
                                bundleModel.guarantors.push(params.guarantor);
                                break;
                            case 'business':
                                $log.info("New Business Enrolment");
                                bundleModel.business = params.customer;
                                BundleManager.broadcastEvent("new-business", params);
                                break;
                            default:
                                $log.info("Unknown page class");
                                break;

                        }
                    },
                    "deviation-loaded":function(pageObj, bundleModel, params){
                        BundleManager.broadcastEvent("load-deviation", params);
                    },
                    "dedupe-customer-list":function(pageObj, bundleModel, params){
                        BundleManager.broadcastEvent("dedupe-list", params);
                    }
                }
            }
        }
    ]
)
