irf.pageCollection.factory("Pages__GrtQueue", ["$log", "formHelper", "Groups","$state","entityManager",
    "SessionStore","groupCommons",
    function($log, formHelper, Groups,$state,entityManager,SessionStore,groupCommons){
        var listOptions= {
            itemCallback: function(item, index) {
                // This will not be called in case of selectable = true in definition
                $log.info(item);
                entityManager.setModel('Grt', {_request:item});
                $state.go("Page.Engine",{
                    pageName:"Grt",
                    pageId:null
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
        var definition = groupCommons.getSearchDefinition('Stage07',listOptions);
        return {
            "id": "grtqueue",
            "type": "search-list",
            "name": "GrtQueue",
            "title": "GRT Queue",
            "subTitle": "",
            "uri":"Groups/GRT Queue",
            offline: true,
            getOfflineDisplayItem: groupCommons.getOfflineDisplayItem(),
            getOfflinePromise: groupCommons.getOfflinePromise('Stage07'),
            initialize: function (model, form, formCtrl) {
                $log.info("GRT Q got initialized");
            },
            definition: definition
        };
    }]);
