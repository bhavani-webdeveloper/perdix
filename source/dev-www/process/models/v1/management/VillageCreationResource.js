irf.models.factory('VillageCreationResource',
function($resource,$httpParamSerializer,BASE_URL, searchResource){
        
    var endpoint = BASE_URL + '/api/villageMaster';
    
    return $resource(endpoint, null, {
        villageCreation:{
                    method:'POST',
                    url:endpoint
        },
        villageEdit:{
                    method:'PUT',
                    url:endpoint
        },
        villageSearch: searchResource({
                    method:'GET',
                    url:endpoint
        }),
        villageGetByID:{
                    method:'GET',
                    url:endpoint + '/:villageid'
        },
    });
});