irf.models.factory('Scoring',function($resource,$httpParamSerializer, searchResource){
    var endpoint = irf.MANAGEMENT_BASE_URL + '/scoring/Api';

    return $resource(endpoint, null, {

        get:{
            method:'GET',
            url:endpoint + '/getScoreDetails.php'
        },
        financialSummary: {
            method: 'GET',
            url: irf.BI_BASE_URL + "/financial_summary.php",
            isArray: true
        },
        financialSummarySnapshot: {
            method: "GET",
            url: irf.BI_BASE_URL + "/financial_summary_snapshot.php",
            isArray: true  
        }
    });
});
