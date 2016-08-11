irf.models.factory('CreditBureau',function($resource,$httpParamSerializer,BASE_URL,searchResource,$q){
    var endpoint = BASE_URL + '/api/creditbureau';

    var ret = $resource(endpoint, null, {
        creditBureauCheck: {
            method:'GET',
            url: endpoint + '/check/:customerId/:highMarkType/:purpose/:loanAmount'
        },
        listCreditBureauStatus: searchResource({
            method: "GET",
            url: endpoint + '/list'
        }),
        DSCpostCB: {
            method: 'GET',
            url: endpoint + '/postcb/:customerId'
        },
        reinitiateCBCheck: {
            method: 'GET',
            url: endpoint + '/reinitiate/:creditBureauId'
        }
    });

    return ret;
});
