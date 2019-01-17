    irf.models.factory('RuleMaintenance',function($resource,$httpParamSerializer,BASE_URL, searchResource){
        
        var endpoint = BASE_URL + '/api/stageflowmanagement/rule';
        

        var resource =  $resource(endpoint, null, {
            save: {
                method:'POST',
                url:endpoint,
                isArray:true
            },
            getRules:searchResource({
                method:'GET',
                url:endpoint
            }),
            getRuleParams:{
                method:'GET',
                isArray:true,
                url: endpoint + '/inputparams',
            },       
            validateRule:{
                method:'POST',
                isArray:true,
                url: endpoint + '/validate'
            },
            DeleteRules:{
                method: 'DELETE',
                url: endpoint + '/:id',
            }         
        });

        resource.asString=function(group,model) {
            if (!group) return "";
            return JSON.stringify(group);
        }
        
        return resource;
    });