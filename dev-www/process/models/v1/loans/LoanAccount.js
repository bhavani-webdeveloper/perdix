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
                if (status === 200 && data){
                    data = JSON.parse(data);
                    if (_.hasIn(data, 'accountBalance') && _.isString(data['accountBalance'])){
                        data.accountBalance = parseFloat(data['accountBalance']);
                    }
                    if (_.hasIn(data, 'totalPrincipalDue') && _.isString(data['totalPrincipalDue'])){
                        data.totalPrincipalDue = parseFloat(data['totalPrincipalDue']);
                    }
                    if (_.hasIn(data, 'totalNormalInterestDue') && _.isString(data['totalNormalInterestDue'])){
                        data.totalNormalInterestDue = parseFloat(data['totalNormalInterestDue']);
                    }
                    if (_.hasIn(data, 'totalPenalInterestDue') && _.isString(data['totalPenalInterestDue'])){
                        data.totalPenalInterestDue = parseFloat(data['totalPenalInterestDue']);
                    }
                    if (_.hasIn(data, 'totalFeeDue') && _.isString(data['totalFeeDue'])){
                        data.totalFeeDue = parseFloat(data['totalFeeDue']);
                    }
                    if (_.hasIn(data, 'totalDemandDue') && _.isString(data['totalDemandDue'])){
                        data.totalDemandDue = parseFloat(data['totalDemandDue']);
                    }
                    if (_.hasIn(data, 'payOffAndDueAmount') && _.isString(data['payOffAndDueAmount'])){
                        data.payOffAndDueAmount = parseFloat(data['payOffAndDueAmount']);
                    }
                    if (_.hasIn(data, 'totalFeeDue') && _.isString(data['totalFeeDue'])){
                        data.totalFeeDue = parseFloat(data['totalFeeDue']);
                    }
                    if (_.hasIn(data, 'recoverableInterest') && _.isString(data['recoverableInterest'])){
                        data.recoverableInterest = parseFloat(data['recoverableInterest']);
                    }
                    if (_.hasIn(data, 'principalNotDue') && _.isString(data['principalNotDue'])){
                        data.principalNotDue = parseFloat(data['principalNotDue']);
                    }
                    if (_.hasIn(data, 'preclosureFee') && _.isString(data['preclosureFee'])){
                        data.preclosureFee = parseFloat(data['preclosureFee']);
                    }
                    if (_.hasIn(data, 'payOffAmount') && _.isString(data['payOffAmount'])){
                        data.payOffAmount = parseFloat(data['payOffAmount']);
                    }
                    if (_.hasIn(data, 'bookedNotDueNormalInterest') && _.isString(data['bookedNotDueNormalInterest'])){
                        data.bookedNotDueNormalInterest = parseFloat(data['bookedNotDueNormalInterest']);
                    }
                    if (_.hasIn(data, 'bookedNotDuePenalInterest') && _.isString(data['bookedNotDuePenalInterest'])){
                        data.bookedNotDuePenalInterest = parseFloat(data['bookedNotDuePenalInterest']);
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
        manualReversal:{
            method:'POST',
            url:endpoint+'/manualreversal'
        },
        "chargeFee": {
            "method": "POST",
            "url": endpoint + "/chargefee"
        }
    });
});
