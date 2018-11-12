    irf.models.factory('RuleMaintenance',function($resource,$httpParamSerializer,BASE_URL, searchResource){
        
        var endpoint = BASE_URL + '/api/stageflowmanagement/rule';

        
        return $resource(endpoint, null, {
            save: {
                method:'POST',
                url:endpoint
            },
            getRules:searchResource({
                method:'GET',
                url:endpoint
            }),
            getRuleParams:{
                method:'GET',
                url: endpoint + '/inputparams'
            },         
            validateRule:{
                method:'POST',
                url: endpoint + '/validate'
            },
            DeleteRules:{
                method: 'DELETE',
                url: endpoint + '/:id',
            }         
        });
    });