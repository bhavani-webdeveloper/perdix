    irf.models.factory('DeathMarking',function($resource,$httpParamSerializer,BASE_URL, searchResource){
        
        var endpoint = BASE_URL + '/api/enrollments';
        
        return $resource(endpoint, null, {
            getSchema: searchResource({
                method:'GET',
                url: endpoint + '/fetchDeceasedDetails'
            }),
            updateDeadMarkingStatus: searchResource({
                method:'POST',
                url:endpoint+'/updatedDeceasedDetails'
            }),
            deathMarkingSchema:{
                method:'GET',
                url:'process/schemas/deathMarking.json'
            },            
            getCustomerDeathMarking:{
                method:'GET',
                url:'process/schemas/customerDeathMarking.json'
            },
            postCustomerDeathMarking:{
                method: 'POST',
                url: endpoint + '/capturedeathdetails/:customerId',
            }         
        });
    });