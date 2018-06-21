/**
 * Created by shahalpk on 05/12/17.
 */

irf.models.factory('UIRepository', function($resource, $httpParamSerializer, BASE_URL, searchResource, $q) {

    var ret = $resource("modules/ui/", null, {
        getLoanProcessUIRepository: {
            method: 'GET',
            url: 'modules/ui/loan/LoanProcess.json'
        },
        getEnrolmentProcessUIRepository: {
            method: "GET",
            url: 'modules/ui/customer/EnrolmentProcess.json'
        },
        getLenderLiabilitiesLoanAccountBookingProcess: {
            method: "GET",
            url: 'modules/ui/lender/LenderLiabilitiesLoanAccountBookingProcess.json'
        },
        getLiabilityRepayment: {
            method: "GET",
            url: 'modules/ui/lender/LiabilityRepayment.json'
        },
        getPostingEntryUIRepository: {
            method: 'GET',
            url: 'modules/ui/journal/SingleEntryJournalPosting.json'
        },
        getFinconAccountingUIRepository: {
            method: 'GET',
            url: 'modules/ui/journal/FinconAccountingEntry.json'
        },
        getAgentProcessUIRepository: {
            method: 'GET',
            url: 'modules/ui/agent/AgentProcess.json'
        },
        getCustomerAgentProcessUIRepository: {
            method: 'GET',
            url: 'modules/ui/agent/CustomerAgentProcess.json'
        }, 
        getPaymentDetails: {
            method: "GET",
            url: 'modules/ui/payment/payment.json'
        }
    });

    return ret;
});