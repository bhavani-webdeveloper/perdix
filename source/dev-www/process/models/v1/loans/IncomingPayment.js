irf.models.factory('IncomingPayment',[
    "$resource","$httpParamSerializer","BASE_URL","searchResource",
    function($resource,$httpParamSerializer,BASE_URL,searchResource){
        var endpoint = BASE_URL + '/api';
        return $resource(endpoint, null, {
           
            IncomingPaymentSearch:searchResource({
                method: 'GET',
                url:endpoint+ '/incoming_payments/find',
            }),
            get:{
                method:'GET',
                url:endpoint + "/incoming_payments/:id"
            },
            update:{
                method: 'PUT',
                url:endpoint+'/incoming_payments'
            }
        });
    }]);
    