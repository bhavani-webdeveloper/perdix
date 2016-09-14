irf.models.factory('BIReports', function($resource, $httpParamSerializer, searchResource) {
    var endpoint = irf.BI_BASE_URL;

    var res = $resource(endpoint, null, {
        reportList: {
            method: 'GET',
            url: endpoint + '/report_list.php',
            isArray: true
        }
    });

    return res;
});