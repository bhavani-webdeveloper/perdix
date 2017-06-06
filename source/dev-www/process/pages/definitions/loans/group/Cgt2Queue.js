irf.pageCollection.factory("Pages__Cgt2Queue", ["$log", "formHelper", "Groups","$state","entityManager",
    "SessionStore","groupCommons","Queries","PageHelper",
    function($log, formHelper, Groups,$state,entityManager,SessionStore,groupCommons,Queries,PageHelper){

        var listOptions= {
            itemCallback: function(item, index) {
                // This will not be called in case of selectable = true in definitions             
                Queries.getGlobalSettings("CGTApprovalCoolingDays").then(function(result) 
                {
                    PageHelper.showLoader();
                    PageHelper.clearErrors();
                    if(moment().format()>=moment(item.cgtDate1, 'YYYY-MM-DD').add('days', result).format())
                    {

                            $log.info(item);
                            entityManager.setModel('Cgt2', {_request:item});
                            $state.go("Page.Engine",
                            {
                                 pageName:"Cgt2",
                                 pageId:null
                            });
                            PageHelper.hideLoader();
                    }
                    else
                    {
                        PageHelper.hideLoader();
                        PageHelper.showProgress('CgtProgress', 'Cgt2 stage will come only after '+result+' days from Cgt1 Date : ('+item.cgtDate1+')',5000);
                                  
                    }
                },function(data)
                {
                     PageHelper.hideLoader();
                     PageHelper.showProgress('CgtProgress', 'Oops some error happend in getting CGT Cooling Days',5000);
                     PageHelper.showErrors(data);
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
