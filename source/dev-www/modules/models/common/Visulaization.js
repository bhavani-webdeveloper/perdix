irf.models.factory('VisualizationCodeResource', function ($resource, $httpParamSerializer, BASE_URL, searchResource) {
    var userManagementEndpoint = irf.MANAGEMENT_BASE_URL + '/server-ext';
    return $resource(userManagementEndpoint, null, {
        getDashboardData: {
            method: 'post',
            url: userManagementEndpoint + '/fetchDashboard.php',
        },
    });
});
