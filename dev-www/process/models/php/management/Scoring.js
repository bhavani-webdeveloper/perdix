irf.models.factory('Scoring',function($resource,$httpParamSerializer, searchResource){
    var endpoint = irf.MANAGEMENT_BASE_URL + '/scoring/Api';

    return $resource(endpoint, null, {

        get:{
            method:'GET',
            url:endpoint + '/getScoreDetails.php'
        }
    });
});
