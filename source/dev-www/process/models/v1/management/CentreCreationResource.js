    irf.models.factory('CentreCreationResource',function($resource,$httpParamSerializer,BASE_URL, searchResource){
        
        var endpoint = BASE_URL + '/api/centre';
        
        return $resource(endpoint, null, {
            getSchema:{
                        method:'GET',
                        url:'process/schemas/centre_creation.json'
                         },
            centreCreation:{
                        method:'POST',
                        url:BASE_URL+'/api/centre'
            },
            centreEdit:{
                        method:'PUT',
                        url:BASE_URL+'/api/centre'
            },
            centreSearch: searchResource({
                        method:'GET',
                        url:BASE_URL+'/api/centre' + "/"
            }),
            centreGetByID:{
                        method:'GET',
                        url:BASE_URL+'/api/centre' + '/:centreid'
            },
        });
    });