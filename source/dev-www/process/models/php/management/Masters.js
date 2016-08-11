irf.models.factory('Masters',function($resource,$httpParamSerializer, searchResource){
    var endpoint = irf.MANAGEMENT_BASE_URL;

    return $resource(endpoint, null, {

        get:{
            method:'GET',
            url:endpoint
        },
        query:searchResource({
            method:'GET',
            url:endpoint
        }),
        post:{
            method:'POST',
            url:endpoint,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function (data) {
                return $httpParamSerializer(data);
            }
        }
    });
});
