irf.pageCollection.factory("Pages__DscQueue", ["$log", "formHelper", "Groups","$state","groupCommons",
    function($log, formHelper, Groups,$state,groupCommons){
        var listOptions= {
            itemCallback: function(item, index) {
                // This will not be called in case of selectable = true in definition
                $log.info(item);
                $state.go("Page.Engine",{
                    pageName:"GroupCRUD",
                    pageId:item.id,
                    pageData:{
                        intent:"DSC_CHECK"
                    }
                },{
                    reload: true, 
                    inherit: false,
                    notify: true
                });
            },
            getItems: function(response, headers){
                $log.error(response);
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
        var definition = groupCommons.getSearchDefinition('Stage03',listOptions);
        return {
        "id": "cgt1queue",
        "type": "search-list",
        "name": "DscQueue",
        "title": "DSC Queue",
        "subTitle": "",
        "uri":"Groups/DSC Queue",
        initialize: function (model, form, formCtrl) {
            $log.info("DSC Q got initialized");
        },
        definition: definition
    };
}]);
