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

        resource.getDataName= function(data, options) {
            var name;
            if (data.id) {
                options.some(function(option) {
                    if (option.id === data.id) {
                        name = option.name;
                        return true;
                    }
                })
            } else {
                name = data.name;
            }
            return name;
        };
    
        resource.getDataValue= function getDataValue(data, options) {
            var value;
            if (data.id) {
                options.some(function(option) {
                    if (option.id === data.id) {
                        value =  option.value|| option.id ;
                        return true;
                    }
                })
            } else {
                value = data.value;
            }
            if (angular.isUndefined(value)) {
                value = data.id;
            }
            return value;
        }

        resource.asString=function(group,model) {
            if (!group) return "";
            return JSON.stringify(group);
        }
        
        return resource;
    });