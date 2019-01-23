irf.models.factory('Scoring',function($resource,$httpParamSerializer, searchResource){
    var endpoint = irf.MANAGEMENT_BASE_URL + '/scoring/Api';
   
    return $resource(endpoint, null, {

        get:{
            method:'GET',
            url:endpoint + '/getScoreDetails.php'
        },
        getV2:{
            method:'GET',
            url: irf.MANAGEMENT_BASE_URL + '/server-ext/getScoreDetailsV2.php'
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
        },
        getGroupScore: {
            method:'GET',
            url:endpoint + '/getGroupScoreDetails.php' 
        }
    });
});
