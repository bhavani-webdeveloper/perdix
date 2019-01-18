    irf.models.factory('BranchCreationResource',
    function($resource,$httpParamSerializer,BASE_URL, searchResource){
        
        var endpoint = BASE_URL + '/api/branch';
        
        return $resource(endpoint, null, {
            branchCreation:{
                        method:'POST',
                        url:endpoint
            },
            branchEdit:{
                        method:'PUT',
                        url:endpoint
            },
            branchSearch: searchResource({
                        method:'GET',
                        url:endpoint
            }),
            getBranchByID:{
                        method:'GET',
                        url: endpoint + '/:id'
            },
            deleteBranch:{
                        method:'DELETE',
                        url: endpoint + '/:id'
            },
            refreshBranchset:{
                        method:'GET',
                        url: endpoint + '/refreshBranchsetAccess'
            }
        });
    });