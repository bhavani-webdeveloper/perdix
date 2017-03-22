irf.pageCollection.factory("Pages__JLGDisbursementQueue", ["$log", "formHelper", "Groups","$state","groupCommons",
    function($log, formHelper, Groups,$state,groupCommons){
        var listOptions={
            itemCallback: function(item, index) {
                // This will not be called in case of selectable = true in definition
                $log.info(item);
                $state.go("Page.Engine",{
                    pageName:"GroupDisbursement",
                    pageId:item.partnerCode+"."+item.groupCode
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
        var definition = groupCommons.getSearchDefinition('Stage08',listOptions);
        return {
            "id": "JLGDisbursementQueue",
            "type": "search-list",
            "name": "JLGDisbursementQueue",
            "title": "GROUP_LOAN_DISBURSEMENT_QUEUE",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                $log.info("JLGDisbursementQueue got initialized");
            },
            definition: definition
        };
    }]);
