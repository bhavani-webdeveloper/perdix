 irf.models.factory('PaymentApprove',function($resource,$httpParamSerializer,BASE_URL){
    var endpoint = BASE_URL;
    return $resource(endpoint, null, {
        getSearch:{
            method:'GET',
            url:'process/schemas/payment.json'
        },          
    });
});