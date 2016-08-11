irf.models.factory('LoanAccount',function($resource,$httpParamSerializer,BASE_URL,searchResource){
    var endpoint = BASE_URL + '/api/loanaccounts';
    return $resource(endpoint, null, {
        activateLoan: {
            method: 'GET',
            url: BASE_URL + '/api/loanaccounts/activate/:accountId',
            transformResponse: []
        },
        disburse: {
            method: 'POST',
            url: endpoint + '/disburse'
        },
        getDisbursementDetails: {
            method: 'GET',
            url: BASE_URL + '/api/loanaccounts/groupdisbursement/:partnerCode/:groupCode',
            isArray: true
        },
        get: {
            method: 'GET',
            url: endpoint + '/show/:accountId'
        },
        viewLoans: searchResource({
            method: 'GET',
            url: BASE_URL + '/api/loanaccounts/viewloans/:urn'
        }),
        repay:{
            method:'POST',
            url:endpoint +'/repay'
        },
        getGroupRepaymentDetails:{
            method:'GET',
            url:endpoint+'/grouprepayment/:partnerCode/:groupCode/:isLegacy',
            isArray:true
        },
        groupRepayment:{
            method:'POST',
            url:endpoint+'/grouprepayment'
        }
    });
});
