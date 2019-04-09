irf.models.factory('Telecalling',[
    "$resource","$httpParamSerializer","BASE_URL","searchResource","Upload","$q","PageHelper",
    function($resource,$httpParamSerializer,BASE_URL,searchResource,Upload,$q,PageHelper){
        var endpoint = BASE_URL + '/api/telecallingdetails'; 
      
    
        var resource = $resource(endpoint, null, {
            save:{
                method:'POST',
                url:endpoint
            },
            update:{
                method:'PUT',
                url:endpoint
            }
        });
            return resource;
    }]);