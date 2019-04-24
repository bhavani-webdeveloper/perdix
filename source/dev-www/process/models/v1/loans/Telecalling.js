irf.models.factory('Telecalling',[
    "$resource","$httpParamSerializer","BASE_URL","searchResource","Upload","$q","PageHelper",
    function($resource,$httpParamSerializer,BASE_URL,searchResource,Upload,$q,PageHelper){
        var endpoint = BASE_URL + '/api/telecallingdetails'; 
        var endpoint2= BASE_URL + '/api/telecallingdetailsBulkUpdate'; 
        var resource = $resource(endpoint, null, {
            save:{
                method:'POST',
                url:endpoint
            },
            update:{
                method:'PUT',
                url:endpoint
            },
            find:{
              method:'GET',
              url:endpoint+'/:processType/:processId',  
            },
            getByCustomerId:{
                method:'GET',
                url: endpoint+'/:id/:customerId'
            },
            getById:{
                method:'GET',
                url:endpoint+'/:id',

            },
            bulkUpdate:{
                method:'PUT',
                url:endpoint2
            },
            deleteById:{
                method:'PUT',
                url:endpoint+'/:id'
            }
        });
            return resource;
    }]);