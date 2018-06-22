    irf.models.factory('ReportMaintenance', function($resource, $httpParamSerializer, BASE_URL,searchResource, formHelper, SessionStore, Enrollment, IndividualLoan) {
        
    var endpoint = irf.MANAGEMENT_BASE_URL;
   
    var res = $resource(endpoint, null, {
        reportGroupName:{
            method: 'GET',
            url: endpoint + '/server-ext/reportmaster/report_master_group_names.php'
        },
        search: searchResource({
            method: 'GET',
            url: endpoint + '/server-ext/reportmaster/report_master_list.php'
        }),
        reportCreate: {
            method: 'POST',
            url: endpoint + '/server-ext/reportmaster/report_master_add.php'
        },
	reportParameterList: {
            method: 'GET',
            url: endpoint + '/server-ext/reportmaster/report_parameter_mapping.php',
            isArray: true
        },
        reportParametername: {
            method: 'GET',
            url: endpoint + '/server-ext/reportmaster/report_parameter_master_names.php',
          
        },
        reportList: {
            method: 'GET',
            url: endpoint + '/server-ext/reportmaster/report_master_names.php',
            isArray: true
        }, 
        reportUpdate: {
            method: 'POST',
            url: endpoint + '/server-ext/reportmaster/report_master_update.php'
        },
        reportDownload: {
            method: 'GET',
            url: endpoint + '/server-ext/reportmaster/report_master_export_sql.php'
        },
        reportParameterDownload: {
            method: 'GET',
            url: endpoint + '/server-ext/reportmaster/report_parameter_mapping_export_sql.php'
        },
        getReportsById: {
            method: 'GET',
            url: endpoint + '/server-ext/reportmaster/report_master_get.php',
        },
        deleteReport: {
            method:'GET',
            url: endpoint + '/server-ext/reportmaster/report_master_delete.php'
        },
	getConfigurationJson:{
            method:'GET',
            url:'process/schemas/:name'
        },
        updateReportMapping:{
            method:'POST',
            url: endpoint +'/server-ext/reportmaster/report_parameter_mapping_data.php'
        },
    });
    return res;
});
