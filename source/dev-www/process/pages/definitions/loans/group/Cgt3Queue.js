irf.pageCollection.factory("Pages__Cgt3Queue", ["$log", "formHelper", "Groups","$state",
    "entityManager","groupCommons","Queries","PageHelper",
    function($log, formHelper, Groups,$state,entityManager,groupCommons,Queries,PageHelper){
        var listOptions= {
            itemCallback: function(item, index) {
                // This will not be called in case of selectable = true in definition            
                Queries.getGlobalSettings("CGTApprovalCoolingDays")
                .then(function(result) 
                {
                    PageHelper.showLoader();
                    PageHelper.clearErrors();
                    if(moment().format()>=moment(item.cgtDate2, 'YYYY-MM-DD').add('days', result).format())
                    {

                            $log.info(item);
                            entityManager.setModel('Cgt3', {_request:item});
                            $state.go("Page.Engine",{
                            pageName:"Cgt3",
                            pageId:null
                          });
                        PageHelper.hideLoader();
                    }
                    else
                    {
                        PageHelper.hideLoader();
                        PageHelper.showProgress('CgtProgress', 'Cgt3 stage will come only after '+result+' days from Cgt2 Date : ('+item.cgtDate2+')',5000);                 
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
