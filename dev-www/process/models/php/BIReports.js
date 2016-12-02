irf.models.factory('BIReports', function($resource, $httpParamSerializer, searchResource) {
    var endpoint = irf.BI_BASE_URL;

    var res = $resource(endpoint, null, {
        reportList: {
            method: 'GET',
            url: endpoint + '/report_list.php',
            isArray: true
        },
        reportMenuList: {
            method: 'GET',
            url: endpoint + '/biportal/api/MenuDefinition.php'
        },
		reportDataList: {
            method: 'GET',
            url: endpoint + '/biportal/api/ReportDefinition.php?report_id=:report_id'
        },
		reportTabList: {
            method: 'GET',
            url: endpoint + '/biportal/api/TabDefinition.php?menu_id=:menu_id'
        }
    });

    return res;
});