irf.pageCollection.factory(irf.page('loans.individual.screening.SanctionInput'),
	["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
        ,"LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
        "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch","Queries", "Utils", "IndividualLoan", "BundleManager",
        function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch,Queries, Utils, IndividualLoan, BundleManager) {
        	$log.info("Inside LoanBookingBundle");
        	return {
        		"type": "page-bundle",
        		"title": "SANCTION",
        		"subTitle": "",
                "bundleDefinition": [
                    {
                        pageName: 'loans.individual.screening.Summary',
                        title: 'SUMMARY',
                        pageClass: 'summary',
                        minimum: 1,
                        maximum: 1
                    },
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
                        pageName: 'loans.individual.screening.Review',
                        title: 'REVIEW',
                        pageClass: 'loan-review',
                        minimum: 1,
                        maximum: 1
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
                "pre_pages_initialize": function(bundleModel){
                    $log.info("Inside pre_page_initialize");
                    bundleModel.currentStage = "Sanction";
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
                                            applicant.enterpriseId=res.customerId;
                                            urnNos.push(cust.urn);
                                        } else if (cust.relation == 'COAPPLICANT' || cust.relation == 'Co-Applicant') {
                                            coApplicants.push(cust);
                                            urnNos.push(cust.urn);
                                        }
                                        /* TODO HANDLE Guarantors */
                                    }

                                    /*Queries.getCustomerBasicDetails({urns: urnNos})
                                        .then(function(customers){
                                            for (var i=0;i<coApplicants.length; i++){
                                                coApplicants[i].customerId = customers.urns[coApplicants[i].urn].id;
                                            }*/
                                            //applicant.customerId = customers.urns[applicant.urn].id;

                                            $this.bundlePages.push({
                                                pageClass: 'summary',
                                                model: {
                                                    cbModel: {customerId:res.customerId,loanId:bundleModel.loanId, scoreName:'RiskScore3'}
                                                }
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
                                                pageClass: 'loan-review',
                                                model: {
                                                    loanAccount: res
                                                }
                                            });

                                            
                                            deferred.resolve();
                                        /*}, function(httpRes){
                                            PageHelper.showErrors(httpRes);
                                        })*/
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
                    BundleManager.broadcastEvent('origination-stage', 'CreditCommitteeReview');
                    
                },
        		eventListeners: {
        			"on-customer-load": function(pageObj, bundleModel, params){
                        BundleManager.broadcastEvent("test-listener", {name: "SHAHAL AGAIN"});
        			},
                    "new-enrolment": function(pageObj, bundleModel, params){
                        switch (pageObj.pageClass){
                            case 'applicant':
                                $log.info("New applicant");
                                break;
                            case 'co-applicant':
                                $log.info("New co-applicant");
                                break;
                            case 'guarantor':
                                $log.info("New guarantor");
                                break;
                            default:
                                $log.info("Unknown page class");

                        }
                    }
        		}
        	}
        }
    ]
)
