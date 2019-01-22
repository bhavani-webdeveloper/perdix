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
                if ($stateParams.pageData && $stateParams.pageData.page) {
                    returnObj.definition.listOptions.tableConfig.page = $stateParams.pageData.page;
                } else {
                    returnObj.definition.listOptions.tableConfig.page = 0;
                }
                var userRole = SessionStore.getUserRole();
                if (userRole && userRole.accessLevel && userRole.accessLevel === 5) {
                    model.fullAccess = true;
                }
                Queries.getGlobalSettings("audit.auditor_role_id").then(function(value) {
                    model.auditor_role_id = Number(value);
                }, PageHelper.showErrors);
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
                }
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
					"required": []
				},

                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    return Groups.getDscOverrideList({
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
                                if(response[i].jlgGroup == null || typeof response[i].jlgGroup == 'undefined')
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
                            data: 'jlgGroupMember.urnNo'
                        }, {
                            title: 'Group ID',
                            data: 'jlgGroup.id'
                        }, {
                            title: 'GROUP_CODE',
                            data: 'jlgGroup.groupCode'
                        }, {
                            title: 'Group Name',
                            data: 'jlgGroup.groupName'
                        }, {
                            title: 'BRANCH_NAME',
                            data: 'jlgGroup.branchId',
                            render: function(data, type, full, meta) {
                                if(data){
                                    return branches[data];
                                }
                                else{
                                   return data; 
                                }
                            }
                        }, {
                            title: 'CENTRE_CODE',
                            data: 'jlgGroupMember.centreCode',
                            render: function(data, type, full, meta) {
                                if(data){
                                    return centres[data];
                                }
                                else{
                                   return data; 
                                }
                            }
                        }]
                    },
                    getActions: function() {
                        return [
                            {
                            name: "Do DSC Override",
                            desc: "",
                            fn: function(item, index) {
                                PageHelper.showLoader();
                                irfProgressMessage.pop("dsc-override", "Performing DSC Override");
                                var remarks = window.prompt("Enter Remarks", "");
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
                                } else {
                                    PageHelper.hideLoader();
                                }
                            },
                            isApplicable: function(item, model) {
                                return model.siteCode === "KGFS";
                            }
                        }, {
                            name: "Do DSC Override",
                            desc: "",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    state: "Page.Engine",
                                    pageName: "loans.group.DscOverride",
                                    pageId: item.dscIntegration.id,
                                    pageData: {
                                        jlgGroup: item.jlgGroup,
                                        jlgGroupMember: item.jlgGroupMember,
                                    }, 
                                }, {
                                    state: "Page.Engine",
                                    pageName: "loans.group.DscOverrideQueue",
                                });   
                            },
                            isApplicable: function(item, model) {
                                return model.siteCode != "KGFS";
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



