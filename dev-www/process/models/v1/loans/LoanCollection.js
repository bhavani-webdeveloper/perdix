irf.models.factory('LoanCollection',[
"$resource","$httpParamSerializer","BASE_URL","searchResource",
function($resource,$httpParamSerializer,BASE_URL,searchResource){
    var endpoint = BASE_URL + '/api/loanCollection';
    /*
    * GET /api/loanaccounts/reverse/{transactionId}/{transactionName} will translate into
    * {action:'reverse',param1:'<tid>',param2:'<tname>'}
    *
    * */

    return $resource(endpoint, null, {
        get:{
            method:'GET',
            url:endpoint+'/:id'
        },
        query: searchResource({
            method: "GET",
            url: endpoint + '/',
            transformResponse: function(data, headersGetter, status){
                data = JSON.parse(data);
                if (status === 200 && data){
                    var collectionLength = data.length;
                    for (var i=0; i<collectionLength; i++){
                        var collection = data[i];
                        if (_.hasIn(collection, 'overdueAmount') && _.isString(collection['overdueAmount'])){
                            collection.overdueAmount = parseFloat(collection['overdueAmount']);
                        }
                        if (_.hasIn(collection, 'feeDue') && _.isString(collection['feeDue'])){
                            collection.feeDue = parseFloat(collection['feeDue']);
                        }
                        if (_.hasIn(collection, 'penalInterestDue') && _.isString(collection['penalInterestDue'])){
                            collection.penalInterestDue = parseFloat(collection['penalInterestDue']);
                        }
                        if (_.hasIn(collection, 'interestAmount') && _.isString(collection['interestAmount'])){
                            collection.interestAmount = parseFloat(collection['interestAmount']);
                        }
                        if (_.hasIn(collection, 'principalDue') && _.isString(collection['principalDue'])){
                            collection.principalDue = parseFloat(collection['principalDue']);
                        }
                        if (_.hasIn(collection, 'scheduleDemandAmount') && _.isString(collection['scheduleDemandAmount'])){
                            collection.scheduleDemandAmount = parseFloat(collection['scheduleDemandAmount']);
                        }
                        if (_.hasIn(collection, 'feeAmount') && _.isString(collection['feeAmount'])){
                            collection.feeAmount = parseFloat(collection['feeAmount']);
                        }
                        if (_.hasIn(collection, 'securityEmiAmount') && _.isString(collection['securityEmiAmount'])){
                            collection.securityEmiAmount = parseFloat(collection['securityEmiAmount']);
                        }

                    }
                }
                var headers = headersGetter();
                var response = {
                    body: data,
                    headers: headers
                }
                return response;
            }

        }),
        save:{
            method:'POST',
            url:endpoint+'/',
        },
        update:{
            method:'PUT',
            url:endpoint+'/',
        },
        processCashDeposite:{
            method:'POST',
            url:endpoint+'/processCashDeposite',
            isArray: true
        }
    });
}]);
