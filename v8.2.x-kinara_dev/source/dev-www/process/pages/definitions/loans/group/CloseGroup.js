irf.pageCollection.factory("Pages__CloseGroup", ["$log", "formHelper", "Groups","$state","PageHelper",
    "irfProgressMessage","SessionStore","groupCommons",

    function($log, formHelper, Groups,$state,PageHelper,irfProgressMessage,SessionStore,groupCommons){

        var listOptions= {
            itemCallback: function(item, index) {
                // This will not be called in case of selectable = true in definition
                $log.info(item);
                $state.go("Page.Engine",{
                    pageName:"GroupCRUD",
                    pageId:item.id,
                    pageData:{
                        intent:"DELETE"
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
                    'Group Code : '+item.groupCode
                ]
            },
            getActions: function(){
                return [];
            }
        };
        var definition = groupCommons.getSearchDefinition(null,listOptions);

    return {
        "id": "closegroup",
        "type": "search-list",
        "name": "CloseGroup",
        "title": "VIEW_OR_CLOSE_GROUP",
        "subTitle": "",
        "uri":"Groups/View or Close Group",
        initialize: function (model, form, formCtrl) {
            $log.info("CloseGrp Q got initialized");
        },
        definition: definition
    };
}]);
