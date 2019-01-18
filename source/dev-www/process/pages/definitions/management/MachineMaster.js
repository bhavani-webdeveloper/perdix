define({
    pageUID: "management.MachineMaster",
    pageType: "Engine",
    dependencies: ["$log","formHelper","$state","SessionStore","Utils","irfNavigator","Queries"],
    $pageFn: 
    function($log, formHelper,$state, SessionStore, Utils, irfNavigator,Queries){
    
    return {
        "type": "search-list",
        "title": "MACHINE_MASTER",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            
            model.siteCode = SessionStore.getGlobalSetting("siteCode");
            $log.info("search-list sample got initialized");
        },
        definition: {
            
            getSearchFormHelper: function() {
                return formHelper;
            },
            
            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

                var promise = Queries.searchMachineMaster();

                return promise;
            },
            paginationOptions: {
                "getItemsPerPage": function(response, headers){
                    return 1000;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                selectable: false,
                expandable: true,
                listStyle: "table",
                itemCallback: function(item, index) {
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){                 
                        return response;
                    }
                    return [];
                },
                
                getListItem: function(item){
                    return []
                },
                getTableConfig: function() {
                    return {
                        "serverPaginate": true,
                        "paginate": false,
                        "pageLength": 20
                    };
                },
                getColumns: function(){
                    return [
                        {
                            title:'MANUFACTURER_NAME',
                            data: 'machineName'
                        },
                        {
                            title:'MACHINE_TYPE',
                            data: 'machineType'
                        },
                        {
                            title:'WORK_PROCESS',
                            data: 'workProcess'
                        },
                        {
                            title:'MODEL',
                            data: 'model'
                        },
                        {
                            title:'YEAR_OF_MANUFACTURING',
                            data: 'yearOfManufacturing'
                        },
                        {
                            title:'DEPRECIATION_PERCENTAGE',
                            data: 'depreciation'
                        }

                    ]
                },
                getActions: function(){
                    return [
                    ]}
            }
        }
    };
}
   
})


                        