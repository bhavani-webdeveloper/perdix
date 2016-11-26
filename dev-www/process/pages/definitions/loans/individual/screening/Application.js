irf.pageCollection.factory(irf.page('loans.individual.screening.Application'),
	["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
        ,"IndividualLoan", "Lead", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
        "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch","Queries", "Utils", "IndividualLoan", "BundleManager",
        function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,IndividualLoan, Lead, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch,Queries, Utils, IndividualLoan, BundleManager) {
        	$log.info("Inside LoanBookingBundle");

            
        	return {
        		"type": "page-bundle",
        		"title": "APPLICATION",
        		"subTitle": "",
        		"bundlePages": [
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
                    // {
                    //     pageName: 'loans.individual.screening.CBCheck',
                    //     title: 'CB_CHECK',
                    //     pageClass: 'cb-check',
                    //     minimum: 1,
                    //     maximum: 1
                    // },
                    // {
                    //     pageName: 'loans.individual.screening.LoanRequest',
                    //     title: 'LOAN_REQUEST',
                    //     pageClass: 'loan-request',
                    //     minimum: 1,
                    //     maximum: 1
                    // }
        		],
                "pre_pages_initialize": function(bundleModel){
                    $log.info("Inside pre_page_initialize");
                    var deferred = $q.defer();

                    var $this = this;
                    if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)){
                        PageHelper.showLoader();
                        bundleModel.loanId = $stateParams.pageId;
                        IndividualLoan.get({id: bundleModel.loanId})
                            .$promise
                            .then(
                                function(res){
                                    // $this.bundlePages.push({
                                    //     pageName: 'loans.individual.screening.LoanRequest',
                                    //     title: 'LOAN_REQUEST',
                                    //     pageClass: 'loan-request',
                                    //     minimum: 1,
                                    //     maximum: 1,
                                    //     model: {
                                    //         loanAccount: res
                                    //     }
                                    // });

                                    var applicant;
                                    var coApplicants = [];
                                    var guarantors = [];
                                    var urnNos = [];

                                    for (var i=0; i<res.loanCustomerRelations.length; i++){
                                        var cust = res.loanCustomerRelations[i];
                                        if (cust.relation == 'APPLICANT' || cust.relation == 'Applicant' || cust.relation =='Sole Proprieter'){
                                            applicant = cust;
                                            urnNos.push(cust.urn);
                                        } else if (cust.relation == 'COAPPLICANT' || cust.relation == 'Co-Applicant') {
                                            coApplicants.push(cust);
                                            urnNos.push(cust.urn);
                                        }
                                        /* TODO HANDLE Guarantors */
                                    }

                                    Queries.getCustomerBasicDetails({urns: urnNos})
                                        .then(function(customers){
                                            for (var i=0;i<coApplicants.length; i++){
                                                coApplicants[i].customerId = customers.urns[coApplicants[i].urn].id;
                                            }
                                            applicant.customerId = customers.urns[applicant.urn].id;
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
                                            deferred.resolve();
                                        }, function(httpRes){
                                            PageHelper.showErrors(httpRes);
                                        })
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
                    BundleManager.broadcastEvent('origination-stage', 'Application');
                    
                },
        		eventListeners: {
        			"on-customer-load": function(pageObj, bundleModel, params){
                        BundleManager.broadcastEvent("test-listener", {name: "SHAHAL AGAIN"});
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
                    }
        		}
        	}
        }
    ]
)
