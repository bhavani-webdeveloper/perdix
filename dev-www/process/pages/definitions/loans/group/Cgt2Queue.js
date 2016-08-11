irf.pageCollection.factory("Pages__Cgt2Queue", ["$log", "formHelper", "Groups","$state","entityManager",
    "SessionStore","groupCommons",
    function($log, formHelper, Groups,$state,entityManager,SessionStore,groupCommons){

        var listOptions= {
            itemCallback: function(item, index) {
                // This will not be called in case of selectable = true in definition
                $log.info(item);
                entityManager.setModel('Cgt2', {_request:item});
                $state.go("Page.Engine",{
                    pageName:"Cgt2",
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
        var definition = groupCommons.getSearchDefinition('Stage05',listOptions);

        return {
            "id": "cgt2queue",
            "type": "search-list",
            "name": "Cgt2Queue",
            "title": "CGT 2 Queue",
            "subTitle": "",
            "uri":"Groups/CGT 2 Queue",
            offline: true,
            getOfflineDisplayItem: groupCommons.getOfflineDisplayItem(),
            getOfflinePromise: groupCommons.getOfflinePromise('Stage05'),
            initialize: function (model, form, formCtrl) {
                $log.info("CGT 2 Q got initialized");
            },
            definition: definition
        };
    }]);
