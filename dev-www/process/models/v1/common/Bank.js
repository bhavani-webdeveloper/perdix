irf.models.factory('Bank',[
    "$resource","$httpParamSerializer","BASE_URL","searchResource",
    function($resource,$httpParamSerializer,BASE_URL,searchResource){
        var endpoint = BASE_URL + '/api';


        return $resource(endpoint, null, {
            getBankAccounts: {
                method: 'GET',
                url: endpoint + '/bankaccounts',
                isArray: true
            }
        });B

    }]);
