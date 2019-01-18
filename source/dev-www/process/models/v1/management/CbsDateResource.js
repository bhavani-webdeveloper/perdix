    irf.models.factory('CbsDateResource',function($resource,$httpParamSerializer,BASE_URL, searchResource){
        
        var endpoint = BASE_URL + '/api/centre';
        
        return $resource(endpoint, null, {
            getSchema:{
                        method:'GET',
                        url:'process/schemas/cbs_date.json'
                         },
            fetchDates:{
                        method:'GET',
                        url:BASE_URL+'/api/bankMasters/fetchDates'
            },
            updateDates:{
                        method:'PUT',
                        url:BASE_URL+'/api/bankMasters/updateDates'
            }
        });
    });