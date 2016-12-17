irf.models.factory('BIReports', function($resource, $httpParamSerializer, searchResource) {
    var endpoint = irf.BI_BASE_URL;
	var endpoint2 = irf.MANAGEMENT_BASE_URL;

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
        },		
        listOfscoreServices: {
            method: 'GET',
            url: endpoint2 + '/scoring/Api/ListOfServices.php'
        },
		ListAllScores:{
            method: 'GET',
            url: endpoint2 + '/scoring/Api/listAllScores.php'
        },
		CreateScore: {
            method: 'POST',
            url: endpoint2 + '/scoring/Api/CreateNewScore.php'
        },
		UpdateScore: {
            method: 'POST',
            url: endpoint2 + '/scoring/Api/UpdateScore.php?ScoreName=:ScoreName'
        },
		ListAllScoreParams:{
            method: 'GET',
            url: endpoint2 + '/scoring/Api/listAllScoreParameters.php'
        },
		CreateParams: {
            method: 'POST',
            url: endpoint2 + '/scoring/Api/CreateNewScore.php'
        },
		UpdateScoreParams: {
            method: 'POST',
            url: endpoint2 + '/scoring/Api/UpdateScore.php?ScoreName=:ScoreName'
        },
		ListScoreElements: {
            method: 'POST',
            url: endpoint2 + '/scoring/Api/listScoreElements.php'
        },
		SpecificScoreName: {
            method: 'GET',
            url: endpoint2 + '/scoring/Api/getSpecificScore.php'
        },
		ScoreNameList: {
            method: 'GET',
            url: endpoint2 + '/scoring/Api/listScoreNames.php'
        },
		CreateScoreParameters: {
            method: 'POST',
            url: endpoint2 + '/scoring/Api/CreateParameters.php'
        },
		GetSpecificParameter: {
            method: 'GET',
            url: endpoint2 + '/scoring/Api/getScoreParameters.php'
        },
		UpdateScoreParameters: {
            method: 'POST',
            url: endpoint2 + '/scoring/Api/UpdateScoreParameters.php'
        },
		ListParameterValues: {
            method: 'GET',
            url: endpoint2 + '/scoring/Api/listParametervalues.php'
        },
		ListAssignedParameters: {
            method: 'GET',
            url: endpoint2 + '/scoring/Api/listScoreParameters.php?ScoreName=:ScoreName'
        },
		CreateParameterValues: {
            method: 'POST',
            url: endpoint2 + '/scoring/Api/CreateParamValues.php'
        },
		GetSpecificParamValue: {
            method: 'GET',
            url: endpoint2 + '/scoring/Api/getParameterValues.php?Id=:Id'
        },
		UpdateParamValue: {
            method: 'POST',
            url: endpoint2 + '/scoring/Api/UpdateParameterValues.php?Id=:Id'
        }
		
    });

    return res;
});