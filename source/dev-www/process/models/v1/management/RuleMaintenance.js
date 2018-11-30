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
            for (var str = "(", i = 0; i < group.rules.length; i++) {
                i > 0 && (str += group.operator.value);
                var dataString = '';
                if (!!group.rules[i].field && !!group.rules[i].field.options &&
                    group.rules[i].field.options.length > 0) {
                    var isFirst = true;
                    if (!!group.rules[i].data && Array.isArray(group.rules[i].data)) {
                        group.rules[i].data.forEach(function(data) {
                            if (!isFirst) {
                                dataString += ',' + resource.getDataValue(data, group.rules[i].field.options);
                            } else {
                                isFirst = false;
                                dataString += resource.getDataValue(data, group.rules[i].field.options);
                            }
                        });
                    } else {
                        dataString = resource.getDataValue(group.rules[i].data, group.rules[i].field.options);
                    }
                } else {
                    dataString = group.rules[i].data;
                }
                str += group.rules[i].group ?
                resource.asString(group.rules[i].group) :(group.rules[i].field.value + group.rules[i].comparator.value + (group.rules[i].field.type=='number'?dataString:("\'" + dataString + "\'")));    
            }
            return str + ")";
        }
        
        return resource;
    });