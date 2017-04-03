irf.models.factory('User', function($resource, $httpParamSerializer, BASE_URL, searchResource) {
    var endpoint = BASE_URL + '/api/users';
    return $resource(endpoint, null, {
        query: searchResource({
            method: 'GET',
            url: endpoint
        }),
        get: {
            method: "GET",
            url: endpoint + "/:user_id"
        },
        update: {
            method: "PUT",
            url: endpoint
        },
        create: {
            method: "POST",
            url: endpoint
        },
        logout: {
            method: "POST",
            url: BASE_URL + "/api/admin/forceLogout/:userId"
        },
        lock: {
            method: "POST",
            url: BASE_URL + "/api/admin/lock"
        },
        unlock: {
            method: "POST",
            url: BASE_URL + "/api/admin/unlock/"
        }
    });
});