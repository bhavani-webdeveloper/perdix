define({
    pageUID: "loans.group.DscOverrideQueue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "SessionStore", "PageHelper", "Groups", "$state", "irfProgressMessage", "irfNavigator"],
    $pageFn: function($log, formHelper, SessionStore, PageHelper, Groups, $state, irfProgressMessage, irfNavigator) {

        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();
        var siteCode = SessionStore.getGlobalSetting('siteCode');

        return {
            "type": "search-list",
            "title": "DSC Override Queue",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.Audits = model.Audits || {};
                // model.branch_id = SessionStore.getCurrentBranch().branchId;
                var bankName = SessionStore.getBankName();
                var banks = formHelper.enum('bank').data;
                for (var i = 0; i < banks.length; i++) {
                    if (banks[i].name == bankName) {
                        model.bankId = banks[i].value;
                        model.bankName = banks[i].name;
                    }
                }
                localFormController = formCtrl;
                syncCheck = false;
                
                var userRole = SessionStore.getUserRole();
                if (userRole && userRole.accessLevel && userRole.accessLevel === 5) {
                    model.fullAccess = true;
                }
               
            },
            definition: {
                title: "DSC QUEUE",
                searchForm: [{
                    key: "bankId",
                    readonly: true,
                    condition: "!model.fullAccess"
                }, {
                    key: "bankId",
                    condition: "model.fullAccess"
                },
               "branch"
            ],
				
				searchSchema: {
					"type": 'object',
					"title": 'SearchOptions',
					"properties": {
                        "bankId": {
                            "title": "BANK_NAME",
                           
                            "type": ["integer", "null"],
                            "enumCode": "bank",
                            "x-schema-form": {
                                "type": "select",
                                "screenFilter": true,

                            }
                        },
                    "branch": {
                        "title": "BRANCH_NAME",
                        "type": ["integer", "null"],
                        "enumCode": "branch_id",
                        "parentEnumCode": "bank",
                        "parentValueExpr": "model.bankId",
                        "x-schema-form": {
                            "type": "select",
                            "screenFilter": true,
                        }
                    },
					},
					"required": ["bankId"]
				},

                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    return Groups.getDcsOverrideViewList({
                        'bankId':searchOptions.bankId,
                        'branchId':searchOptions.branch,
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
                            var temp = [];
                            for (var i=0;i<response.length;i++){
                                if(response[i] == null || typeof response[i] == 'undefined')
                                // temp.push({
                                //     "urnNo":response[i].jlgGroupMember.urnNo,
                                //     "id":response[i].jlgGroup.id
                                // });
                                {
                                    console.log(i);
                                }
                            }
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
                        var branchList = formHelper.enum('branch_id').data;
                        var branches = {}
                        for (var i = 0; i < branchList.length; i++) {
                            branches[branchList[i].value] = branchList[i].name;
                        }
                        var centreList = formHelper.enum('centre').data;
                        var centres = {}
                        for (var i = 0; i < centreList.length; i++) {
                            centres[centreList[i].field3] = centreList[i].name;
                        }
                        return [{
                            title: 'URN',
                            data: 'urnNo'
                        }, {
                            title: 'Group ID',
                            data: 'groupId'
                        }, {
                            title: 'GROUP_CODE',
                            data: 'groupCode'
                        }, {
                            title: 'Group Name',
                            data: 'groupName'
                        }, {
                            title: 'BRANCH_NAME',
                            data: 'branchId',
                            render: function(data, type, full, meta) {
                                return (data && branches[data])? branches[data]: data;
                            }
                        }, {
                            title: 'CENTRE_CODE',
                            data: 'centreCode',
                            render: function(data, type, full, meta) {
                                return (data && centres[data])? centres[data]: data;
                            }
                        }]
                    },
                    getActions: function() {
                        return [
                            {
                            name: "Do DSC Override",
                            desc: "",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    state: "Page.Engine",
                                    pageName: "loans.group.DscOverride",
                                    pageId: item.dscId,
                                    pageData: {
                                        jlgGroupId: item.groupId,
                                        jlgGroupMemberId: item.id,
                                        customerId:item.customerId
                                    }, 
                                }, {
                                    state: "Page.Engine",
                                    pageName: "loans.group.DscOverrideQueue",
                                });   
                            },
                            isApplicable: function(item, model) {
                                return true;
                            }
                        }, {
                            name: "View DSC Response",
                            desc: "",
                            fn: function(item, index) {
                                Groups.showDscDataPopup(item.dscId);
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



