irf.models.factory('LoanCollection',[
"$resource","$httpParamSerializer","BASE_URL","searchResource","Upload","$q","PageHelper",
function($resource,$httpParamSerializer,BASE_URL,searchResource, Upload, $q, PageHelper){
    var endpoint = BASE_URL + '/api/loanCollection';

    var biEndPoint= irf.MANAGEMENT_BASE_URL; 
    /*
    * GET /api/loanaccounts/reverse/{transactionId}/{transactionName} will translate into
    * {action:'reverse',param1:'<tid>',param2:'<tname>'}
    *
    * */

    var resource = $resource(endpoint, null, {
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
        fetchDepositSummary: {
            method: "GET",
            url: endpoint + '/fetchBankDepositSummaries',
            isArray: true
        },
        getDepositSummary:{
            method:'GET',
            url:endpoint+'/depositSummary'
        },
        save:{
            method:'POST',
            url:endpoint+'/',
        },
        update:{
            method:'PUT',
            url:endpoint+'/',
        },
        batchUpdate: {
            method: 'PUT',
            url: endpoint + '/batchRepay',
            isArray: true
        },
        processCashDeposite:{
            method:'POST',
            url:endpoint+'/processCashDeposite'
        },
        updateDeposiSummary:{
            method: 'PUT',
            url:endpoint + '/updateDeposiSummary'
        },
        findDepositSummaries: {
            method: "GET",
            url: endpoint + "/findDepositSummaries",
            transformResponse: function(data, headersGetter, status){
                data = JSON.parse(data);
                var headers = headersGetter();
                var response = {
                    body: data,
                    headers: headers
                }
                return response;
            }
        },
        collectionRemainder:{
            method:'GET',
            //isArray: true,
            url:biEndPoint+'/server-ext/repayment_reminder.php/',
        }
    });

    resource.loanAssignmentUpload = function(file, progress) {
            var deferred = $q.defer();
            Upload.upload({
                url: BASE_URL + "/api/individualLoan/loanCollectionAssignmentUpload",
                data: {
                    file: file
                }
            }).then(function(resp) {
                // TODO handle success
                PageHelper.showProgress("page-init", "successfully uploaded.", 2000);
                deferred.resolve(resp);
            }, function(errResp) {
                // TODO handle error
                PageHelper.showErrors(errResp);
                deferred.reject(errResp);
            }, progress);
            return deferred.promise;
        };
    
    return resource;
}]);
