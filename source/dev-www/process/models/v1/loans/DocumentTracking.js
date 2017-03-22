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
    return resource;
}]);
