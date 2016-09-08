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
            url: endpoint + '/show/:accountId',
            transformResponse: function(data, headersGetter, status){
                data = JSON.parse(data);
                if (status === 200){
                    // debugger;
                    if (_.hasIn(data, 'accountBalance') && _.isString(data['accountBalance'])){
                        data.accountBalance = parseInt(data['accountBalance']);
                    }
                    if (_.hasIn(data, 'totalPrincipalDue') && _.isString(data['totalPrincipalDue'])){
                        data.totalPrincipalDue = parseInt(data['totalPrincipalDue']);
                    }
                    if (_.hasIn(data, 'totalNormalInterestDue') && _.isString(data['totalNormalInterestDue'])){
                        data.totalNormalInterestDue = parseInt(data['totalNormalInterestDue']);
                    }
                    if (_.hasIn(data, 'totalPenalInterestDue') && _.isString(data['totalPenalInterestDue'])){
                        data.totalPenalInterestDue = parseInt(data['totalPenalInterestDue']);
                    }
                    if (_.hasIn(data, 'totalFeeDue') && _.isString(data['totalFeeDue'])){
                        data.totalFeeDue = parseInt(data['totalFeeDue']);
                    }
                    if (_.hasIn(data, 'totalDemandDue') && _.isString(data['totalDemandDue'])){
                        data.totalDemandDue = parseInt(data['totalDemandDue']);
                    }
                }
                
                return data;

            }

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
        },
        writeOffQueue:searchResource({
            method:'GET',
            url:endpoint+'/findwriteoffList'
        }),
        writeOff:{
            method:'POST',
            url:endpoint+'/writeoff'
        },
        reversalSearch:{
            method:'POST',
            url:endpoint+'/findtransactionforreversal'
        },
        writeOff:{
            method:'POST',
            url:endpoint+'/manualreversal'
        }

    });
});
