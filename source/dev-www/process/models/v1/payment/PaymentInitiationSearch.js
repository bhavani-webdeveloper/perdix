    irf.models.factory('PaymentInitiationSearch',function($resource,$httpParamSerializer,BASE_URL, searchResource){
        
        var endpoint = BASE_URL + '/api/centre';
        //var endpoint = BASE_URL;
        
        return $resource(endpoint, null, {
            getSchema:{
                        method:'GET',
                        url:'process/schemas/paymentsearch.json'
                        //url: endpoint + "/api/payments"
                         },
        });
    });