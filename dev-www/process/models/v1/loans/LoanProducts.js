irf.models.factory('LoanProducts',function($resource,$httpParamSerializer,BASE_URL,searchResource,$q){
    var endpoint = BASE_URL + '/api/loanproducts';


    var ret = $resource(endpoint, null, {

        get:{
            method:'GET',
            url:endpoint,
            isArray:true
        },
        getProductData:{
            method:'GET',
            url:endpoint+'/:productCode'
        }

    });

    ret.getLoanPurpose = function(productCode){

        var deferred = $q.defer();
        
        ret.getProductData({productCode:productCode},function(response,headersGetter){
            console.warn(response);
            var result = {
                body:response.purposes,
                headers:headersGetter()
            };
            deferred.resolve(result);
        },function(resp){
            deferred.reject(resp);
        });

        return deferred.promise;

    };

    return ret;
});
