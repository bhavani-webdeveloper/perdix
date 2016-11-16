irf.pageCollection.factory(irf.page('loans.LoanBookingBundle'),
	["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
        ,"LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
        "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch","Queries", "Utils", "IndividualLoan",
        function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch,Queries, Utils, IndividualLoan) {
        	$log.info("Inside LoanBookingBundle");


        	return {
        		"type": "page-bundle",
        		"title": "LOAN_BOOKING_BUNDLE",
        		"subTitle": "LOAN_BOOKING_BUNDLE_SUB_TITLE",
        		"bundlePages": [
        			{
			            pageName: 'customer.IndividualEnrolment2',
			            title: 'APPLICANT',
			            type: 'applicant',
			            minimum: 1,
			            maximum: 1
			        }, 
			        {
			            pageName: 'customer.IndividualEnrolment2',
			            title: 'CO_APPLICANT',
			            type: 'co-applicant',
			            minimum: 1,
			            maximum: 3
			        }, 
			        {
			            pageName: 'customer.EnterpriseEnrollment',
			            title: 'BUSINESS',
			            type: 'business',
			            minimum: 1,
			            maximum: 1
			        }
        		],
        		"initialize": function(model, form, formCtrl, bundleManager){

        		},
        		eventListeners: {
        			"on-customer-load": function(params){

        			}
        		}
        	}
        }
    ]
)