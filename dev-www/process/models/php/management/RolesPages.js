irf.models.factory('RolesPages', function($resource, $httpParamSerializer, searchResource) {
    var endpoint = irf.MANAGEMENT_BASE_URL + "/user-management";

    var res = $resource(endpoint, null, {
        allRoles: searchResource({
            method: 'GET',
            url: endpoint + '/allRoles.php'
        }),
        allPages: searchResource({
            method: 'GET',
            url: endpoint + '/allPages.php'
        }),
        updateRolePageAccess: {
            method: 'PUT',
            url: endpoint + '/updateRolePageAccess.php'
        },
        getPage: {
            method: 'GET',
            url: endpoint + '/getPage.php'
        }
    });

    return res;
});