irf.pageCollection.factory(irf.page('loans.individual.screening.ScreeningInput'),
	["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
        ,"LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
        "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch","Queries", "Utils", "IndividualLoan", "BundleManager",
        function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch,Queries, Utils, IndividualLoan, BundleManager) {
        	$log.info("Inside LoanBookingBundle");


        	return {
        		"type": "page-bundle",
        		"title": "LOAN_BOOKING_BUNDLE",
        		"subTitle": "LOAN_BOOKING_BUNDLE_SUB_TITLE",
        		"bundlePages": [
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
			            minimum: 1,
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
			        }

        		],
                "pre_pages_initialize": function(bundleModel){
                    $log.info("Inside pre_page_initialize");
                },
                "post_pages_initialize": function(bundleModel){
                    $log.info("Inside post_page_initialize");
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
