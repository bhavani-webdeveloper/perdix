irf.models.factory('DocumentTracking',[
"$resource","$httpParamSerializer","BASE_URL","searchResource","Upload","$q","PageHelper",
function($resource,$httpParamSerializer,BASE_URL,searchResource,Upload,$q,PageHelper){
    var endpoint = BASE_URL + '/api/accountDocumentTracking'; 
  

    var resource = $resource(endpoint, null, {
        getSchema: {
            method: 'GET',
            url: 'process/schemas/documentTracking.json'
        },
        search:searchResource({
            method:'GET',
            url:endpoint+'/find'
        }),
        get:{
            method:'GET',
            url:endpoint+'/:id'
        },
        create:{
            method:'POST',
            url:endpoint
        },
        update:{
            method:'PUT',
            url:endpoint
        },
        findBatches:searchResource({
            method:'GET',
            url:endpoint+'/findBatches'
        }),
        getBatch:{
            method:'GET',
            url:endpoint+'/getBatch/:batchNumber',
            isArray:true
        },
        getbyAccountNumber:{
            method:'GET',
            url:endpoint+'/getbyAccountNumber'
        }

    });

    resource.BulkFileUpload = function(file, progress) {
            var deferred = $q.defer();
            Upload.upload({
                url: BASE_URL + "/api/accountDocumentTracking/bulkFileUpload",
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
