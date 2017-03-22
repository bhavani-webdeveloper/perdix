irf.pageCollection.factory("Pages__DscOverrideQueue", ["$log", "formHelper","PageHelper", "Groups","$state","irfProgressMessage",
    "groupCommons",
    function($log, formHelper,PageHelper,Groups,$state,irfProgressMessage,groupCommons){
    return {
        "id": "dscoverridequeue",
        "type": "search-list",
        "name": "DscOverrideQueue",
        "title": "DSC Override Requests",
        "subTitle": "",
        "uri":"Groups/DSC Override Requests",
        initialize: function (model, form, formCtrl) {
            $log.info("DSC Override got initialized");
        },
        definition: {
            title: "GROUPS_LIST",
            
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                var promise = Groups.getDscOverrideList({

                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage
                }).$promise;

                return promise;
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 20;
                },
                "getTotalItemsCount": function(response, headers){
                    try {
                        return headers['x-total-count'];
                    }catch(err){
                        return 0;
                    }
                }
            },
            listOptions: {
                itemCallback: function(item, index) {
                    // This will not be called in case of selectable = true in definition
                    $log.info(item);
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [

                        'URN : ' + item.jlgGroupMember.urnNo,
                        'Group ID : '+item.jlgGroup.id,
                        'Group Name : '+item.jlgGroup.groupName,
                        null
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Do DSC Override",
                            desc: "",
                            fn: function(item, index){
                                PageHelper.showLoader();
                                irfProgressMessage.pop("dsc-override","Performing DSC Override");
                                var remarks = window.prompt("Enter Remarks","Test Remark");
                                if(remarks) {
                                    Groups.post({
                                        service: "overridedsc",
                                        urnNo: item.jlgGroupMember.urnNo,
                                        groupCode: item.jlgGroup.groupCode,
                                        productCode: item.jlgGroup.productCode,
                                        remarks: remarks
                                    }, {}, function (resp, headers) {
                                        $log.info(resp);
                                        PageHelper.hideLoader();
                                        irfProgressMessage.pop("dsc-override", "Override Succeeded", 2000);
                                        $state.go('Page.Engine', {
                                            pageName: "DscOverrideQueue"
                                        }, {
                                            reload: true,
                                            inherit: false,
                                            notify: true
                                        });

                                    }, function (resp) {
                                        $log.error(resp);
                                        PageHelper.hideLoader();
                                        irfProgressMessage.pop("dsc-override", "An error occurred. Please Try Again", 2000);
                                        PageHelper.showErrors(resp);
                                    });
                                }


                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //	return false;
                                //}
                                return true;
                            }
                        },
                        {
                            name: "View DSC Response",
                            desc: "",
                            fn: function(item, index){

                                groupCommons.showDSCData(item.jlgGroupMember.dscId);

                            },
                            isApplicable: function(item, index){

                                return true;
                            }
                        }
                    ];
                }
            }


        }
    };
}]);
