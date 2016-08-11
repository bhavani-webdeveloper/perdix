irf.pageCollection.factory("Pages__Cgt3Queue", ["$log", "formHelper", "Groups","$state",
    "entityManager","groupCommons",
    function($log, formHelper, Groups,$state,entityManager,groupCommons){
        var listOptions= {
            itemCallback: function(item, index) {
                // This will not be called in case of selectable = true in definition
                $log.info(item);
                entityManager.setModel('Cgt3', {_request:item});
                $state.go("Page.Engine",{
                    pageName:"Cgt3",
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
        var definition = groupCommons.getSearchDefinition('Stage06',listOptions);
        return {
            "id": "cgt3queue",
            "type": "search-list",
            "name": "Cgt3Queue",
            "title": "CGT 3 Queue",
            "subTitle": "",
            "uri":"Groups/CGT 3 Queue",
            offline: true,
            getOfflineDisplayItem: groupCommons.getOfflineDisplayItem(),
            getOfflinePromise: groupCommons.getOfflinePromise('Stage06'),
            initialize: function (model, form, formCtrl) {
                $log.info("CGT 3 Q got initialized");
            },
            definition: definition
        };
    }]);
