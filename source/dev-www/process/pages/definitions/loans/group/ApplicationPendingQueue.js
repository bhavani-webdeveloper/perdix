irf.pageCollection.factory("Pages__ApplicationPendingQueue", ["$log", "formHelper", "Groups","$state",
    "SessionStore","groupCommons",
    function($log, formHelper, Groups,$state,SessionStore,groupCommons){
        var listOptions= {
            itemCallback: function(item, index) {
                // This will not be called in case of selectable = true in definition
                $log.info(item);
                $state.go("Page.Engine",{
                    pageName:"GroupCRUD",
                    pageId:item.id,
                    pageData:{
                        intent:"APP_DWNLD"
                    }
                },{
                    reload: true,
                    inherit: false,
                    notify: true
                });
            },
            getItems: function(response, headers){
                if (response!=null && response.length && response.length!=0){
                    return response;
                }
                return [];
            },
            getListItem: function(item){
                return [

                    'Group ID : ' + item.id,
                    'Group Name : '+item.groupName,
                    null
                ]
            },
            getActions: function(){

                return [

                ];
            }
        };

        var definition = groupCommons.getSearchDefinition('StageAP',listOptions);
        return {
            "id": "applicationpendingqueue",
            "type": "search-list",
            "name": "ApplicationPendingQueue",
            "title": "Application Pending Queue",
            "subTitle": "",
            "uri":"Groups/Application Pending Queue",
            initialize: function (model, form, formCtrl) {
                $log.info("AP Q got initialized");
            },
            definition: definition
        };
    }]);
