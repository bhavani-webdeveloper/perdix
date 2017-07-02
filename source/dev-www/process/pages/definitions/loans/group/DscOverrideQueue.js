define({
    pageUID: "loans.group.DscOverrideQueue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "SessionStore", "PageHelper", "Groups", "$state", "irfProgressMessage", "irfNavigator"],
    $pageFn: function($log, formHelper, SessionStore, PageHelper, Groups, $state, irfProgressMessage, irfNavigator) {

        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();

        return {
            "type": "search-list",
            "title": "DSC Override Queue",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("DSC Queue got initialized");
            },
            definition: {
                title: "DSC QUEUE",

                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    return Groups.getDscOverrideList({
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage
                    }).$promise;
                },
                paginationOptions: {
                    "getItemsPerPage": function(response, headers) {
                        return 100;
                    },
                    "getTotalItemsCount": function(response, headers) {
                        return headers['x-total-count']
                    }
                },
                listOptions: {
                    selectable: false,
                    expandable: true,
                    listStyle: "table",
                    itemCallback: function(item, index) {},
                    getItems: function(response, headers) {
                        if (response != null && response.length && response.length != 0) {
                            return response;
                        }
                        return [];
                    },
                    getListItem: function(item) {
                        return []
                    },
                    getTableConfig: function() {
                        return {
                            "serverPaginate": true,
                            "paginate": true,
                            "pageLength": 10
                        };
                    },
                    getColumns: function() {
                        return [{
                            title: 'URN',
                            data: 'jlgGroupMember.urnNo'
                        }, {
                            title: 'Group ID',
                            data: 'jlgGroup.id'
                        }, {
                            title: 'Group Name',
                            data: 'jlgGroup.groupName'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "Do DSC Override",
                            desc: "",
                            fn: function(item, index) {
                                PageHelper.showLoader();
                                irfProgressMessage.pop("dsc-override", "Performing DSC Override");
                                var remarks = window.prompt("Enter Remarks", "Test Remark");
                                if (remarks) {
                                    Groups.post({
                                        service: "overridedsc",
                                        urnNo: item.jlgGroupMember.urnNo,
                                        groupCode: item.jlgGroup.groupCode,
                                        productCode: item.jlgGroup.productCode,
                                        remarks: remarks
                                    }, {}, function(resp, headers) {
                                        $log.info(resp);
                                        PageHelper.hideLoader();
                                        irfProgressMessage.pop("dsc-override", "Override Succeeded", 2000);
                                        $state.go('Page.Engine', {
                                            pageName: "loans.group.DscOverrideQueue"
                                        },{
                                            reload: true,
                                            inherit: false,
                                            notify: true
                                        });
                                    }, function(resp) {
                                        $log.error(resp);
                                        PageHelper.hideLoader();
                                        irfProgressMessage.pop("dsc-override", "An error occurred. Please Try Again", 2000);
                                        PageHelper.showErrors(resp);
                                    });
                                }
                            },
                            isApplicable: function(item, index) {
                                return true;
                            }
                        }, {
                            name: "View DSC Response",
                            desc: "",
                            fn: function(item, index) {
                                Groups.showDscDataPopup(item.jlgGroupMember.dscId);
                            },
                            isApplicable: function(item, index) {
                                return true;
                            }
                        }];
                    }
                }
            }
        };
    }
})