define({
    pageUID: "loans.group.DscOverrideQueue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper","irfSimpleModal", "SessionStore", "PageHelper", "Groups", "$state", "irfProgressMessage",
        "groupCommons", "irfNavigator"
    ],
    $pageFn: function($log, formHelper,irfSimpleModal, SessionStore, PageHelper, Groups, $state, irfProgressMessage,
        groupCommons, irfNavigator) {

        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();

        function showDscData(dscId) {
            PageHelper.showLoader();
            Groups.getDSCData({
                dscId: dscId
            }, function(resp, headers) {
                PageHelper.hideLoader();
                var dataHtml = "<table class='table table-striped table-bordered table-responsive'>";
                dataHtml += "<tr><td>Response : </td><td>" + resp.response + "</td></tr>";
                dataHtml += "<tr><td>Response Message: </td><td>" + resp.responseMessage + "</td></tr>";
                dataHtml += "<tr><td>Stop Response: </td><td>" + resp.stopResponse + "</td></tr>";
                dataHtml += "</table>"
                irfSimpleModal('DSC Check Details', dataHtml);
            }, function(res) {
                PageHelper.showErrors(res);
                PageHelper.hideLoader();
            });
        };

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
                    var promise = Groups.getDscOverrideList({
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage
                    }).$promise;
                    return promise;
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
                                groupCommons.showDSCData(item.jlgGroupMember.dscId);
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