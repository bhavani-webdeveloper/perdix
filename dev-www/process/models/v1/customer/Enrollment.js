irf.models.factory('Enrollment',function($resource,$httpParamSerializer,BASE_URL, searchResource){
    var endpoint = BASE_URL + '/api/enrollments';
    /*
     * $get : /api/enrollments/{blank/withhistory/...}/{id}
     *  eg: /enrollments/definitions -> $get({service:'definition'})
     *      /enrollments/1           -> $get({id:1})
     * $post will send data as form data, save will send it as request payload
     */
    return $resource(endpoint, null, {

        get:{
            method:'GET',
            url:endpoint+'/:service/:id'
        },
        query:{
            method:'GET',
            url:endpoint+'/:service/:id',
            isArray:true
        },

        getSchema:{
            method:'GET',
            url:'process/schemas/profileInformation.json'
        },
        search: searchResource({
            method: 'GET',
            url: endpoint + '/'
        }),
        put:{
            method:'PUT',
            url:endpoint+'/:service'
        },
        update:{
            method:'PUT',
            url:endpoint+'/:service'
        },
        post:{
            method:'POST',
            url:endpoint+'/:service/:format',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function (data) {
                return $httpParamSerializer(data);
            }
        },
        postWithFile:{
            method:'POST',
            url:endpoint+'/:service/:format',
            headers: {
                'Content-Type': 'undefined'
            },
            transformRequest: function (data) {
                var fd = new FormData();
                angular.forEach(data, function(value, key) {
                    fd.append(key, value);
                });
                return fd;
            }
        },
        save:{
            method:'POST',
            url:endpoint
        },
        updateEnrollment: {
            method: 'PUT',
            url: endpoint
        },
        getCustomerById: {
            method: 'GET',
            url: endpoint+'/:id',
            transformResponse: function(data){
                var customer = JSON.parse(data);
                if (status === 200){
                    if (_.hasIn(customer, "customerBankAccounts") && _.isArray(customer.customerBankAccounts)){
                        _.forEach(customer.customerBankAccounts, function(bankAccount){
                            if (_.hasIn(bankAccount, 'netBankingAvailable') && !_.isNull(bankAccount.netBankingAvailable) && _.isString(bankAccount.netBankingAvailable)){
                                bankAccount.netBankingAvailable = bankAccount.netBankingAvailable.toUpperCase();
                            }
                        })
                    }
                }
                return customer;
            }
        },
        getWithHistory: {
            method: 'GET',
            url: endpoint+'/withhistory/:id'
        }
    });
});
