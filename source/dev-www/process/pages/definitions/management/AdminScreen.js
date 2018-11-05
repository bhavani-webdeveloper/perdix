define({
    pageUID: "management.AdminScreen",
    pageType: "Engine",
    dependencies: ["$q", "$log", "irfNavigator", "formHelper", "entityManager", "IndividualLoan", "$state", "SessionStore", "Utils", "Locking"],
    $pageFn: function ($q, $log, irfNavigator, formHelper, EntityManager, IndividualLoan, $state, SessionStore, Utils, Locking) {
        var branch = SessionStore.getBranch();
        return {
            "type": "search-list",
            "title": "ADMIN_UNLOCK_UI_SCREEN",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                model.branch = SessionStore.getCurrentBranch().branchId;
            },
            definition: {
                title: "SEARCH",
                autoSearch: true,
                searchForm: [
                    "*"
                ],
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        'branch':
                        {
                            'title': "BRANCH_NAME",
                            "type": ["string", "null"],
                            "x-schema-form": {
                                "type": "select",
                                "screenFilter": true,
                                "enumCode": "branch"
                            }
                        },
                        'loanId': {
                            'title': "RECORD_ID",
                            "type": "number"
                        },
                        "centre": {
                            "title": "CENTRE",
                            "type": "string",
                            "x-schema-form": {
                                type: "lov",
                                autolov: true,
                                bindMap: {},
                                searchHelper: formHelper,
                                lovonly: true,
                                search: function (inputModel, form, model, context) {
                                    var centers = [];
                                    centers = formHelper.enum('centre').data;
                                    if (!centers.length) {
                                        centers.push({
                                            name: "No Records",
                                        })
                                    }
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": centers.length
                                        },
                                        body: centers
                                    });
                                },
                                onSelect: function (valueObj, model, context) {
                                    model.centre = valueObj.name;
                                    model.centreCode = valueObj.code;
                                },
                                getListDisplayItem: function (item, index) {
                                    return [
                                        item.name,
                                        item.code
                                    ];
                                }
                            }
                        },
                        'customerId': {
                            "title": "CUSTOMER_ID",
                            "type": "number"
                        },
                        "accountNumber":
                        {
                            "title": "ACCOUNT_NUMBER",
                            "type": "string"
                        },
                    },
                    "required": []
                },
                getSearchFormHelper: function () {
                    return formHelper;
                },
                getResultsPromise: function (searchOptions, pageOpts) {
                    var promise = Locking.findlocks({
                        'recordId': searchOptions.loanId,
                        'branchName': searchOptions.branch,
                        'customerId': searchOptions.customerId,
                        'centreCode': searchOptions.centreCode,
                        'accountNumber': searchOptions.accountNumber,
                        'page': pageOpts.pageNo
                    }).$promise;
                    return promise;
                },
                paginationOptions: {
                    "getItemsPerPage": function (response, headers) {
                        return 20;
                    },
                    "getTotalItemsCount": function (response, headers) {
                        return headers['x-total-count']
                    }
                },
                listOptions: {
                    selectable: true,
                    expandable: true,
                    listStyle: "table",
                    itemCallback: function (item, index) { },
                    getItems: function (response, headers) {
                        if (response != null && response.length && response.length != 0) {
                            return response;
                        }
                        return [];
                    },
                    getListItem: function (item) {
                        return [

                            "{{'ACCOUNT_NUMBER'|translate}} : " + item.accountNumber,
                            "{{'ENTITY_NAME'|translate}} : " + item.customerName,
                        ]
                    },
                    getTableConfig: function () {
                        return {
                            "serverPaginate": true,
                            "paginate": true,
                            "pageLength": 10
                        };
                    },
                    getColumns: function () {
                        return [
                            {
                                title: 'RECORD_ID',
                                data: 'loanId'
                            },{
                                title: 'ACCOUNT_NUMBER',
                                data: 'accountNumber'
                            }, 
                        ]
                    },
                    getActions: function () {
                        return [
                            ];
                    },
                    getBulkActions: function () {
                        return [
                            {
                                name: "UNLOCK",
                                desc: "",
                                htmlClass: "style='margin-left:10px'",
                                fn: function (items) {
                                    if (items.length == 0) {
                                        PageHelper.showProgress("Select atleast one item for Unlocking", 5000);
                                        return false;
                                    }
                                    Locking.clearlocks(items).then(function (resp) {
                                        PageHelper.showProgress("Selected Pages are Unlocked", "Done.", 5000);
                                    }, function (err) {
                                        PageHelper.showProgress("Selected Pages", "error in Unlocking", 5000);
                                    });
                                },
                                isApplicable: function () {
                                    return true;
                                }
                            }
                        ];
                    },
                }
            }
        };
    }

})
