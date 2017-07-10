irf.pageCollection.factory("Pages__Cgt1Queue", ["$log", "formHelper", "Groups","$state","entityManager",
    "SessionStore","groupCommons",
    function($log, formHelper, Groups,$state,entityManager,SessionStore,groupCommons){

        var listOptions = {
            itemCallback: function(item, index) {
                // This will not be called in case of selectable = true in definition
                $log.info(item);
                entityManager.setModel('Cgt1', {_request:item});
                $state.go("Page.Engine",{
                    pageName:"Cgt1",
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

        var definition = groupCommons.getSearchDefinition('Stage04',listOptions);

        return {
        "id": "cgt1queue",
        "type": "search-list",
        "name": "Cgt1Queue",
        "title": "CGT 1 Queue",
        "subTitle": "",
        "uri":"Groups/CGT 1 Queue",
        //offline: true,
        getOfflineDisplayItem: groupCommons.getOfflineDisplayItem(),
        getOfflinePromise: groupCommons.getOfflinePromise('Stage04'),
        initialize: function (model, form, formCtrl) {
            $log.info("CGT 1 Q got initialized");
        },
        definition: definition
    };
}]);
