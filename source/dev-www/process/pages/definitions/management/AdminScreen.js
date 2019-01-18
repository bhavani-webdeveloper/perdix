define({
    pageUID: "management.AdminScreen",
    pageType: "Engine",
    dependencies: ["$q", "$log", "formHelper", "SessionStore", "Utils", "Locking", "PageHelper", 'irfProgressMessage'],
    $pageFn: function ($q, $log, formHelper, SessionStore, Utils, Locking, PageHelper, irfProgressMessage) {
        return {
            "type": "search-list",
            "title": "ADMIN_UNLOCK_UI_SCREEN",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
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
                                type: "lov",
                                autolov: true,
                                bindMap: {},
                                searchHelper: formHelper,
                                lovonly: true,
                                search: function (inputModel, form, model, context) {
                                    var branches = [],
                                        branches = formHelper.enum('branch').data;
                                    if (!branches.length) {
                                        branches.push({ name: "No Records" })
                                    }
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": branches.length
                                        },
                                        body: branches
                                    });
                                },
                                onSelect: function (valueObj, model, context) {
                                    model.branch = valueObj.name;
                                    model.branchId = valueObj.code;
                                },
                                getListDisplayItem: function (item, index) {
                                    return [
                                        item.name,
                                        item.code
                                    ];
                                }
                            }
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
                        'loanId': {
                            'title': "RECORD_ID",
                            "type": "number"
                        },
                        'currentStage': {
                            'title': "CURRENT_STAGE",
                            "type": ["string", "null"],
                            "x-schema-form": {
                                "enumCode": "loan_stage",
                                "type": "select",
                                "screenFilter": true
                            }
                        }, 'productCode': {
                            'title': "PRODUCT_CODE",
                            "type": ["string", "null"],
                            "x-schema-form": {
                                "enumCode": "loan_product",
                                "type": "select",
                                "screenFilter": true
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
                        'currentStage': searchOptions.currentStage,
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
                                title: "CUSTOMER_ID",
                                data: "customerId"
                            },
                            {
                                title: 'RECORD_ID',
                                data: 'recordId'
                            },
                            {
                                title: "LOCKED_BY",
                                data: "lockedBy"
                            },

                            {
                                title: 'ACCOUNT_NUMBER',
                                data: 'accountNumber'
                            },
                        ]
                    },
                    getActions: function () {
                        return [
                            {
                                name: "UNLOCK",
                                desc: "",
                                icon: "fa fa-book",
                                fn: function (items) {
                                    Utils.confirm("Are you sure?").then(function () {
                                        Locking.clearlocks({ recordIdList: items.id }, {}, function (resp, headers) {
                                            irfProgressMessage.pop("Selected list", "Unlocked", 2000);
                                        }, function (resp) {
                                            $log.error(resp);
                                            PageHelper.hideLoader();
                                            irfProgressMessage.pop("Sorry", "An error occurred. Please Try Again", 2000);
                                            PageHelper.showErrors(resp);
                                        });
                                    });
                                },isApplicable: function () {
                                    return true;
                                }
                            }
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
                                        irfProgressMessage.pop("", "Select Atleast one Item for Unlocking", 5000);
                                        return false;
                                    }
                                    recordIds = [];
                                    for (i = 0; i < items.length; i++) {
                                        recordIds.push(items[i].id);
                                    } console.log("Item from Bulk Actions");
                                    console.log(recordIds);
                                    Utils.confirm("Are you sure?").then(function () {
                                        Locking.clearlocks({ recordIdList: recordIds }, {}, function (resp, headers) {
                                            irfProgressMessage.pop("Selected list", "List of recordId's Unlocked", 2000);
                                        }, function (resp) {
                                            $log.error(resp);
                                            PageHelper.hideLoader();
                                            irfProgressMessage.pop("Sorry", "An error occurred. Please Try Again", 2000);
                                            PageHelper.showErrors(resp);
                                        });
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
