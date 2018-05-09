irf.models.factory('SecurityEMIRefundResource',function($resource,$httpParamSerializer,BASE_URL, searchResource){
        
        var endpoint = BASE_URL + '/api/loanaccounts';
        
        return $resource(endpoint, null, {
            getSchema:{
                        method:'GET',
                        url:'process/schemas/securityEMI_refund.json'
            },            
            search:searchResource({
                        method:'GET',
                        url: endpoint +'/findSecurityDepositRefundAccounts'
            }),
            processrepaymentcomposite:{
                        method:'POST',
                        url: endpoint+'/processrepaymentcomposite'
            }
        });
    });