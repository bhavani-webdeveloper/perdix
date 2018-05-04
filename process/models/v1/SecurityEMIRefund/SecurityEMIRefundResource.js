    irf.models.factory('SecurityEMIRefundResource',function($resource,$httpParamSerializer,BASE_URL, searchResource){
        
        var endpoint = BASE_URL + '/api/loanaccounts';
        
        return $resource(endpoint, null, {
            getSchema:{
                        method:'GET',
                        url:'process/schemas/securityEMI_refund.json'
            },            
            findSecurityDepositRefundAccounts:searchResource({
                        method:'GET',
                        url:'process/schemas/securityEMI_refund1.json'
            }),
            processrepaymentcomposite:{
                        method:'POST',
                        url:BASE_URL+'/api/loanaccounts/processrepaymentcomposite'
            }

        });
    });