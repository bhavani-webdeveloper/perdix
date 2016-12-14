irf.pageCollection.factory(irf.page('loans.individual.screening.ScreeningInput'),
	["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
        ,"LoanAccount", "Lead", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
        "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch","Queries", "Utils", "IndividualLoan", "BundleManager",
        function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,LoanAccount, Lead, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch,Queries, Utils, IndividualLoan, BundleManager) {
        	$log.info("Inside LoanBookingBundle");

            var onLeadLoad = function(lead){
                BundleManager.broadcastEvent('l')
            }


        	return {
        		"type": "page-bundle",
        		"title": "SCREENING",
        		"subTitle": "LOAN_BOOKING_BUNDLE_SUB_TITLE",
        		"bundlePages": [],
                "pre_pages_initialize": function(bundleModel){
                    $log.info("Inside pre_page_initialize");
                    bundleModel.currentStage = "Screening";
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

                                    for (var i=0; i<res.loanCustomerRelations.length; i++){
                                        var cust = res.loanCustomerRelations[i];
                                        if (cust.relation == 'APPLICANT' || cust.relation == 'Applicant' || cust.relation =='Sole Proprieter'){
                                            applicant = cust;
                                            urnNos.push(cust.urn);
                                        } else if (cust.relation == 'COAPPLICANT' || cust.relation == 'Co-Applicant') {
                                            coApplicants.push(cust);
                                            urnNos.push(cust.urn);
                                        } else if (cust.relation == 'GUARANTOR'){
                                            guarantors.push(cust);
                                        }
                                    }

                                    $this.bundlePages.push({
                                        pageName: 'customer.IndividualEnrolment2',
                                        title: 'APPLICANT',
                                        pageClass: 'applicant',
                                        minimum: 1,
                                        maximum: 1,
                                        model: {
                                            loanRelation: applicant
                                        }
                                    });

                                    for (var i=0;i<coApplicants.length; i++){
                                        $this.bundlePages.push({
                                            pageName: 'customer.IndividualEnrolment2',
                                            title: 'CO_APPLICANT',
                                            pageClass: 'co-applicant',
                                            minimum: 1,
                                            maximum: 1,
                                            model: {
                                                loanRelation: coApplicants[i]
                                            }
                                        });
                                    }

                                    for (var i=0;i<guarantors.length; i++){
                                        $this.bundlePages.push({
                                            pageName: 'customer.IndividualEnrolment2',
                                            title: 'GUARANTOR',
                                            pageClass: 'guarantor',
                                            minimum: 1,
                                            maximum: 1,
                                            model: {
                                                loanRelation: guarantors[i]
                                            }
                                        });
                                    }

                                    $this.bundlePages.push({
                                        pageName: 'customer.EnterpriseEnrolment2',
                                        title: 'BUSINESS',
                                        pageClass: 'business',
                                        minimum: 1,
                                        maximum: 1,
                                        model: {
                                            loanRelation: {customerId:res.customerId}
                                        }
                                    });

                                    $this.bundlePages.push({
                                        pageName: 'loans.individual.screening.LoanRequest',
                                        title: 'LOAN_REQUEST',
                                        pageClass: 'loan-request',
                                        minimum: 1,
                                        maximum: 1,
                                        model: {
                                            loanAccount: res
                                        }
                                    });

                                    $this.bundlePages.push({
                                        pageName: 'loans.individual.screening.CBCheck',
                                        title: 'CB_CHECK',
                                        pageClass: 'cb-check',
                                        minimum: 1,
                                        maximum: 1,
                                        model: {
                                            loanAccount: res
                                        }
                                    });

                                    $this.bundlePages.push({
                                        pageName: 'customer.IndividualEnrolment2',
                                        title: 'CO_APPLICANT',
                                        pageClass: 'co-applicant',
                                        minimum: 0,
                                        maximum: 3
                                    });

                                    $this.bundlePages.push({
                                        pageName: 'customer.IndividualEnrolment2',
                                        title: 'GUARANTOR',
                                        pageClass: 'guarantor',
                                        minimum: 0,
                                        maximum: 3
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
                    } else {
                        $this.bundlePages = [
                            {
                                pageName: 'customer.IndividualEnrolment2',
                                title: 'APPLICANT',
                                pageClass: 'applicant',
                                minimum: 1,
                                maximum: 1
                            },
                            {
                                pageName: 'customer.IndividualEnrolment2',
                                title: 'CO_APPLICANT',
                                pageClass: 'co-applicant',
                                minimum: 0,
                                maximum: 3
                            },
                            {
                                pageName: 'customer.IndividualEnrolment2',
                                title: 'GUARANTOR',
                                pageClass: 'guarantor',
                                minimum: 0,
                                maximum: 3
                            },
                            {
                                pageName: 'customer.EnterpriseEnrolment2',
                                title: 'BUSINESS',
                                pageClass: 'business',
                                minimum: 1,
                                maximum: 1
                            },
                            {
                                pageName: 'loans.individual.screening.LoanRequest',
                                title: 'LOAN_REQUEST',
                                pageClass: 'loan-request',
                                minimum: 1,
                                maximum: 1
                            },
                            {
                                pageName: 'loans.individual.screening.CBCheck',
                                title: 'CB_CHECK',
                                pageClass: 'cb-check',
                                minimum: 1,
                                maximum: 1
                            }
                        ];

                        deferred.resolve();
                    }
                    return deferred.promise;

                },
                "post_pages_initialize": function(bundleModel){
                    $log.info("Inside post_page_initialize");
                    BundleManager.broadcastEvent('origination-stage', 'Screening');
                    if (_.hasIn($stateParams.pageData, 'lead_id') &&  _.isNumber($stateParams.pageData['lead_id'])){
                        PageHelper.showLoader();
                        PageHelper.showProgress("screening-input", 'Loading lead details');
                        var _leadId = $stateParams.pageData['lead_id'];
                        Lead.get({id: _leadId})
                            .$promise
                            .then(function(res){
                                PageHelper.showProgress('screening-input', 'Done.', 5000);
                                BundleManager.broadcastEvent('lead-loaded', res);
                            }, function(httpRes){
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function(){
                                PageHelper.hideLoader();
                            })
                    }
                    
                },
        		eventListeners: {
        			"on-customer-load": function(pageObj, bundleModel, params){
                        BundleManager.broadcastEvent("test-listener", {name: "SHAHAL AGAIN"});
        			},
                    "new-loan": function(pageObj, bundleModel, params){
                        $log.info("Inside new-loan of CBCheck");
                        BundleManager.broadcastEvent("new-loan", params);
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
                                BundleManager.broadcastEvent('new-guarantor', params);
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
                    }
        		}
        	}
        }
    ]
)
