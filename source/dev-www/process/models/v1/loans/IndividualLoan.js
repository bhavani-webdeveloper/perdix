irf.models.factory('IndividualLoan',[
"$resource","$httpParamSerializer","BASE_URL","searchResource","Upload","$q","PageHelper",
function($resource,$httpParamSerializer,BASE_URL,searchResource,Upload,$q,PageHelper){
    var endpoint = BASE_URL + '/api/individualLoan'; 
  

    var resource = $resource(endpoint, null, {
        create:{
            method:'POST',
            url:endpoint
        },
        update:{
            method:'PUT',
            url:endpoint
        },
        close:{
            method:'PUT',
            url:endpoint+'/close'
        },
        getDefiniftion: {
            method: "GET",
            url: endpoint + '/definition'
        },
        disburse:{
            method:'PUT',
            url:endpoint+'/disburse'
        },
        batchDisburse:{
            method:'PUT',
            url:endpoint+'/batchDisbursement'
        },
        batchDisbursementConfirmation:{
            method:'POST',
            url:endpoint+'/batchDisbursementConfirmation'
        },
        multiTrancheDisbursement:{
            method:'GET',
            url:endpoint+'/disbursementProcess/:loanId'
        },
        search:searchResource({
            method:'GET',
            url:endpoint+'/find'
        }),
        searchHead:{
            method:'HEAD',
            url:endpoint+'/find',
            isArray:true
        },
        searchDisbursement:searchResource({
            method:'GET',
            url:endpoint+'/findDisbursement'
        }),
        searchDisbursementHead:{
            method:'HEAD',
            url:endpoint+'/findDisbursement',
            isArray:true
        },
        getDisbursementList:{
            method:'GET',
            url:endpoint+'/getDisbursementList',
            isArray:true
        },
        getDocuments:{
            method:'GET',
            url:endpoint+'/getIndividualLoanDocuments'
        },
        downloadAllDocuments: {
            method: 'GET',
            url: endpoint + "/documents/loanId"
        }, 
        documentsHead:{
            method:'HEAD',
            url:endpoint+'/getIndividualLoanDocuments',
            isArray:true
        },
        updateDisbursement:{
            method:'PUT',
            url:endpoint+'/updateDisbursement'
        },       
         loadSingleLoanWithHistory:{
            method:'GET',
            url:endpoint+'/withhistory/:id'
        },
        get:{
            method:'GET',
            url:endpoint+'/:id',
            transformResponse: function(data, headersGetter, status){
                if (status === 200 && data){
                    data = JSON.parse(data);
                    if (!_.isUndefined(data.nominees) && !_.isNull(data.nominees) && _.isArray(data.nominees) && data.nominees.length>0){
                        for (var i=0;i<data.nominees.length; i++){
                            var n = data.nominees[i];
                            if (!_.isUndefined(n.nomineePincode)){
                                data.nominees[i].nomineePincode = parseInt(n.nomineePincode);
                            }
                        }
                    }

                    if (_.hasIn(data, 'securityEmiRequired') && !_.isNull(data.securityEmiRequired) && _.isString(data.securityEmiRequired)){
                        data.securityEmiRequired = data.securityEmiRequired.toUpperCase();
                    }

                    if (_.isArray(data.collateral)){
                        _.forEach(data.collateral, function(collateral){
                            if (_.hasIn(collateral, 'machineAttachedToBuilding') && !_.isNull(collateral.machineAttachedToBuilding) && _.isString(collateral.machineAttachedToBuilding)){
                                collateral.machineAttachedToBuilding = collateral.machineAttachedToBuilding.toUpperCase();
                            }
                            if (_.hasIn(collateral, 'hypothecatedToBank') && !_.isNull(collateral.hypothecatedToBank) && _.isString(collateral.hypothecatedToBank)){
                                collateral.hypothecatedToBank = collateral.hypothecatedToBank.toUpperCase();
                            }
                            if (_.hasIn(collateral, 'electricityAvailable') && !_.isNull(collateral.electricityAvailable) && _.isString(collateral.electricityAvailable)){
                                collateral.electricityAvailable = collateral.electricityAvailable.toUpperCase();
                            }
                            if (_.hasIn(collateral, 'spaceAvailable') && !_.isNull(collateral.spaceAvailable) && _.isString(collateral.spaceAvailable)){
                                collateral.spaceAvailable = collateral.spaceAvailable.toUpperCase();
                            }
                        })
                    }
                }

                return data;

            }
        },
        addTranch:{
            method:'PUT',
            url:endpoint+'/addTranch'
        },
        close: {
            method: 'PUT',
            url: endpoint + "/close"
        },       
         loanRemarksSummary:{
            method:'GET',
            url:endpoint+'/loanActionSummary/:id',
            isArray:true
        },
    });
    resource.getAllDocumentsUrl = function(loanId){
        return endpoint + '/documents/loanId?loanId='+loanId;

    };
    resource.ConfirmationUpload = function(file, progress) {
            var deferred = $q.defer();
            Upload.upload({
                url: BASE_URL + "/api/individualLoan/batchDisbursementConfirmationUpload",
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
        }
    resource.disbursementUpload = function(file, progress) {
        var deferred = $q.defer();
        Upload.upload({
            url: BASE_URL + "/api/individualLoan/batchDisbursementUpload",
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
    }
        return resource;
}]);
