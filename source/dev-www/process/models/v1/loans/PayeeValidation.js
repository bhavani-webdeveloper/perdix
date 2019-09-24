irf.models.factory('PayeeValidation',[
    "$resource","$httpParamSerializer","BASE_URL","searchResource",
    function($resource,$httpParamSerializer,BASE_URL,searchResource){
        var endpoint = BASE_URL + '/api/payeevalidation';
        
        return $resource(endpoint, null, {
            validation: {
                method: 'POST',
                url: endpoint+ '/validate'
            },
            getBenificiaryValidationDetails:{
                method: 'GET',
                url:BASE_URL+'/api/getBenificiaryValidationDetail/:id',
            }
        });
    }]);
