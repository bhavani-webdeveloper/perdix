    irf.models.factory('BIReports', function($resource, $httpParamSerializer, searchResource, formHelper, SessionStore, Enrollment, IndividualLoan) {
    var endpoint = irf.BI_BASE_URL;
	var endpoint2 = irf.MANAGEMENT_BASE_URL;

    var res = $resource(endpoint, null, {
        reportList: {
            method: 'GET',
            url: endpoint + '/report_list.php',
            isArray: true
        },
        /*reportMenuList: {
            method: 'GET',
            url: endpoint + '/biportal/api/MenuDefinition.php'
        },*/
        reportDataList: {
            method: 'GET',
            url: endpoint + '/biportal/api/ReportDefinition.php'
        },
		reportDrilldown: {
            method: 'PUT',
            url: endpoint + '/biportal/api/ReportDrilldown.php'
        },
		reportFilterList: {
            method: 'GET',
            url: endpoint + '/biportal/api/AccessLevelDefinition.php'
        },
		reportTabList: {
            method: 'GET',
            url: endpoint + '/biportal/api/TabDefinition.php'
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
            url: endpoint2 + '/scoring/Api/UpdateScore.php'
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
            url: endpoint2 + '/scoring/Api/UpdateScore.php'
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
            url: endpoint2 + '/scoring/Api/listScoreParameters.php'
        },
		CreateParameterValues: {
            method: 'POST',
            url: endpoint2 + '/scoring/Api/CreateParamValues.php'
        },
		GetSpecificParamValue: {
            method: 'GET',
            url: endpoint2 + '/scoring/Api/getParameterValues.php'
        },
		UpdateParamValue: {
            method: 'POST',
            url: endpoint2 + '/scoring/Api/UpdateParameterValues.php'
        },
        allReportParameters: {
            method: 'GET',
            url: endpoint + '/report_parameters.php',
            isArray: true
        },
        downLoadReport: {
            method: 'POST',
            url: endpoint + '/newdownload.php',
        },
		
    });

    var biReportsUtil = res.Utils = {};

    biReportsUtil.setOptionsForReportParameter = function(item, reportParameter) {

        item['key'] = "bi." + reportParameter.parameter;
        item['title'] = reportParameter.name;
        item['titleMap'] = reportParameter.titleMap;

        if(reportParameter.type.indexOf(':') > -1){
            var fieldArray = reportParameter.type.split(':');
            var typeOfSearch = fieldArray[1];
            item['type'] = fieldArray[0];
            item['autolov'] = false;
            item['inputMap'] = {
                "branchId": {
                    "key": "bi.branchId",
                    "title": "BRANCH_NAME",
                    "type": "select",
                    "enumCode": "branch_id"
                },
                "centreId": {
                    "key": "bi.centreId",
                    "title": "CENTRE",
                    "enumCode": "centre",
                    "type": "select",
                    "parentEnumCode": "branch_id",
                    "parentValueExpr": "model.branchId",
                },
                "firstName": {
                    "key": "bi.firstName",
                    "title": "CUSTOMER_NAME",
                    "type": "string"
                }
            };
            item["searchHelper"] = formHelper;
            item["search"] = function(inputModel, form) {
                var branches = formHelper.enum('branch_id').data;
                var branchName;
                for (var i=0; i<branches.length;i++){
                    if(branches[i].code==inputModel.branchId)
                        branchName = branches[i].name;
                }
                var promise;
                if (typeOfSearch == 'customerSearch') {
                    promise = Enrollment.search({
                        'branchName': branchName ||SessionStore.getBranch(),
                        'firstName': inputModel.firstName,
                        'centreId':inputModel.centreId,
                    }).$promise;
                } else if(typeOfSearch == 'accountNumber') {

                    promise = IndividualLoan.search({
                        'branchName':branchName ||SessionStore.getBranch(),                       
                        'customerName': inputModel.firstName,
                        'centreCode': inputModel.centreId

                    }).$promise;
                }
                
                return promise;
            };
            if(typeOfSearch == 'customerSearch') {
                item["getListDisplayItem"] = function(data, index) {
                    return [
                        [data.firstName, data.fatherFirstName].join(' | '),
                        data.id,
                        data.urnNo 
                    ];
                };
                item["onSelect"] = function(valueObj, model, context) {
                    model.bi.urn = valueObj.urnNo;
                };
            } else if (typeOfSearch == 'accountNumber') {
                 item["getListDisplayItem"] = function(data, index) {
                    return [
                        data.customerName,
                        data.id,
                        data.accountNumber 
                    ];
                };
                item["onSelect"] = function(valueObj, model, context) {
                    model.bi.loan_account_id = valueObj.accountNumber;
                };
            }
            

        } else {
            item['type'] = reportParameter.type;
        }
    }

    return res;
});