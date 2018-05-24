irf.models.factory('Agent', function($resource, $httpParamSerializer, BASE_URL, searchResource) {
    var endpoint = BASE_URL + '/api/agent';
    /*var endpintManagement = irf.MANAGEMENT_BASE_URL + '/server-ext/achdemandlist.php?';
    var endpintManagementACHPDC = irf.MANAGEMENT_BASE_URL + '/server-ext/achpdcdemandlist.php?';*/

    var resource = $resource(endpoint, null, {
        submit: {
            method: 'PUT',
            url: BASE_URL + '/api/agent'
        },
        update: {
            method: 'POST',
            url: BASE_URL + '/api/agent'
        },
        search: searchResource({
            method: 'GET',
            url: endpoint
        }),
        get: {
            method: 'GET',
            url: BASE_URL + '/api/agent/:id'
        }
    });
    return resource;
});