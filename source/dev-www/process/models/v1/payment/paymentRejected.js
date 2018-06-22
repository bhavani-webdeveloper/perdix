    irf.models.factory('paymentRejected',function($resource,$httpParamSerializer,BASE_URL, searchResource){
        
        var endpoint = BASE_URL + '/api/centre';
        
        return $resource(endpoint, null, {
            getSchema:{
                        method:'GET',
                        url:'process/schemas/paymentRejected.json'
                         },
        });
    });