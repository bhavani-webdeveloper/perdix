irf.models.factory('PaymentBank',[
    "$resource","$httpParamSerializer","BASE_URL","searchResource",
    function($resource,$httpParamSerializer,BASE_URL,searchResource){
        var endpoint = BASE_URL + '/api/bankValidation';
        
        return $resource(endpoint, null, {
            get: {
                method:'GET',
                url:endpoint+'/:id'
            },
            query: searchResource({
                method: "GET",
                url: endpoint + '/'  
            }),
            update: {
                method: 'PUT',
                url: endpoint+ '/update'
            },
            validation: {
                method: 'GET',
                url: endpoint + '/:ifscCode',
            }
        });
    }]);
    