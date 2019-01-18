        irf.pageCollection.factory(irf.page("management.ReportMasterSearch"),
        ["$log", "formHelper", "filterFilter", "ReportMaintenance","Queries","$state", "SessionStore", "Utils", "PagesDefinition", "irfNavigator", "PageHelper", "$q",
        function($log, formHelper, filterFilter , ReportMaintenance,Queries,$state, SessionStore, Utils, PagesDefinition, irfNavigator, PageHelper, $q ){
           
            var branch = SessionStore.getBranch();
            return {
                "type": "search-list",
                "title": "SEARCH_REPORTS_MASTER",
                "subTitle": "",
                initialize: function (model, form, formCtrl) { 
                 var defered = $q.defer();             
                 var self = this;  

                formCtrl.submit();                  
                },
                definition: {
                    title: "SEARCH_REPORTS_MASTER",
                //    searchForm: [],
                    autoSearch : false,
                   // searchSources: [],
                   searchForm: [
                        {
                            "type": "section",
                            items: [
                            {
                                key: "group", 
                                title: "GROUP",
                                type: "lov",
                                lovonly: true,
                                searchHelper: formHelper,
                                search: function(inputModel, form, model) {
                                    var defered = $q.defer();
                                    ReportMaintenance.reportGroupName().$promise.then(
                                        function(data){
                                            defered.resolve({
                                                headers: {
                                                    "x-total-count": data.DataResponse.length
                                                },
                                                body: data.DataResponse
                                            });
                                    }, function(err){
                                        defered.reject(err);
                                    });
                                    return defered.promise;
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.name
                                    ];
                                },
                                onSelect: function(result, model, context) {
                                    model.group = result.value
                                }
                            },
                            {
                                key: "report_display_name", 
                            },
                            {
                                key: "is_active",
                                title: "IS_ACTIVE",
                                type: "radios",
                                titleMap: {
                                           "1": "YES",
                                           "0": "NO",
                                           }
                            }
                            ],
                            required:["group", 'is_active']
                        }
                    ],
                    searchSchema: {
                        "type": 'object',
                        "title": 'SEARCH_OPTIONS',
                        "properties": {
                            "group": {
                                "title": "GROUP",
                                "type": "select"

                            },
                            "report_display_name": {
                                "title": "REPORT_DISPLAY_NAME",
                                "type": "string"
                            },
                            "is_active": {
                                "title": "IS_ACTIVE",
                                
                            }
        
                        },
                        "required":["group", 'active']
                    },
                   
                    getSearchFormHelper: function() {
                        return formHelper;
                    },
                    getResultsPromise: function(searchOptions, pageOpts){/* Should return the Promise */
        
                        var promise = ReportMaintenance.search({
                            'group': searchOptions.group,
                            'report_display_name': searchOptions.report_display_name,
                            'is_active': searchOptions.is_active
                        }).$promise;
    
                        return promise;
                    },
                    paginationOptions: {
                        "getItemsPerPage": function(response, headers){
                            return 100;
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
                            return [
                                Utils.getFullName(item.group, item.report_name, item.report_display_name,item.is_active),
                                'GROUP : ' + item.group,
                                "'REPORT_DISPLAY_NAME': " + item.report_display_name,
                                "'IS_ACTIVE' : " + item.is_active
                            ]
                        },
                        getTableConfig: function() {
                            return {
                                "serverPaginate": true,
                                "paginate": true,
                                "pageLength": 10
                            };
                        },
                        getColumns: function(){
                            var centres = formHelper.enum('centre').data;
                            return [
                                {
                                    title:'GROUP',
                                    data: 'group'
                                    
                                },
                                {
                                    title:'REPORT_DISPLAY_NAME',	
                                    data: 'report_display_name'
                                },
                                {
                                    title:'IS_ACTIVE',
                                    data: 'is_active',
                                    render: function(data, type, full, meta) {
                                        if (data == 1) {
                                            data = "YES"
                                        }else{
                                            data = "NO"
                                        }
                                        return data;
                                    }	
                                }
                            ]
                        },
                        getActions: function(){
                            return [
                                {
                                    name: "EDIT_REPORT_MASTER",
                                    desc: "",
                                    icon: "fa fa-pencil",
                                    fn: function(item, model){
                                        irfNavigator.go({
                                            state: "Page.Engine",
                                            pageName: "management.ReportMasterCreation",
                                            pageId: item.id,
                                        });
                                    },
                                    isApplicable: function(item, model){
                                         return true;
                                    }
                                },
                                 {
                                    name: "DELETE_REPORT_MASTER",
                                    desc: "",
                                    icon: "fa fa-trash",
                                    fn: function(item, model){
                                        Utils.confirm('Do You Want to Delete?').then(function() {
                                        PageHelper.showLoader();
                                        ReportMaintenance.deleteReport({id:item.id},function(resp,header){
                                            Utils.alert("Reports Deleted Successfully");
                                        }).finally(PageHelper.hideLoader);
                                    },function(resp){
                                        PageHelper.hideLoader();
                                    });
                                        PageHelper.hideLoader();

                                        $state.go("Page.Engine",{
                                            pageName:"management.ReportMasterSearch",
                                            pageId:item.id
                                        },{
                                            reload: true,
                                            inherit: false,
                                            notify: true
                                        });
                                        
                                    },
                                    isApplicable: function(item, model){
                                         return true;
                                    }
                                },
                                {
                                    name: "DOWNLOAD_SQL",
                                    desc: "",
                                    icon: "fa fa-pencil",
                                    fn: function(item, model){
                                            var biDownloadUrl = irf.MANAGEMENT_BASE_URL+'/server-ext/reportmaster/report_master_export_sql.php?report_name='+item.report_name;
                                            $log.info(biDownloadUrl);
                                            window.open(biDownloadUrl);
                                    },
                                    isApplicable: function(item, model){
                                         return true;
                                    }
                                },
                            ];
                        }
                    }
                }
            };
        }]);
        