irf.models.factory('RolesPages', function($resource, $httpParamSerializer, searchResource) {
    var endpoint = "http://52.4.230.141:8081/perdix-user-management";

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
        }
    });

    return res;
});