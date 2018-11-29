define({
    pageUID: "kgfs.loans.individual.booking.Checker1Queue",
    pageType: "Engine",
    dependencies: ["$log", "irfNavigator", "formHelper", "entityManager", "IndividualLoan", "$state", "SessionStore", "Utils","$filter","$q"],
    $pageFn: function ($log, irfNavigator, formHelper, EntityManager, IndividualLoan, $state, SessionStore, Utils,$filter,$q) {
        var branch = SessionStore.getBranch();
        return {
            "type": "search-list",
            "title": "CHECKER1_QUEUE",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                model.branch = SessionStore.getBranch();
                model.branchId = SessionStore.getBranchId();
            },
            definition: {
                title: "SEARCH_LOANS",
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
                        'loanType':
                        {
                            'title': "LOAN_TYPE",
                            "type": ["string", "null"],
                            "x-schema-form": {
                                "type": "select",
                                "screenFilter": true,
                                "enumCode": "booking_loan_type"
                            }
                        },
                        "loan_product": {
                            "title": "Loan Product",
                            "type": "string",
    
                            "x-schema-form": {
                                "type": "lov",
                                "lovonly": true,
                                search: function (inputModel, form, model, context) {
                                    var loanProduct = formHelper.enum('loan_product').data;
                                    var products = $filter('filter')(loanProduct, {parentCode: model.partner_code ? model.partner_code : undefined}, true);
    
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": products.length
                                        },
                                        body: products
                                    });
                                },
                                onSelect: function (valueObj, model, context) {
                                    model.loan_product = valueObj.field1;
                                },
                                getListDisplayItem: function (item, index) {
                                    return [
                                        item.name
                                    ];
                                },
                            }
                        },
                        "accountNumber":
                        {
                            "title": "ACCOUNT_NUMBER",
                            "type": "string"
                        }
                    },
                    "required": []
                },
                getSearchFormHelper: function () {
                    return formHelper;
                },
                getResultsPromise: function (searchOptions, pageOpts) {
                    var promise = IndividualLoan.search({
                        'stage': 'Checker1',
                        'branch': searchOptions.branch,
                        'loanType': searchOptions.loanType,
                        'productName': searchOptions.productName,
                        'requestType': searchOptions.requestType,
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
                            "{{'LOAN_AMOUNT'|translate}} : " + item.loanAmount,
                            "{{'LOAN_TYPE'|translate}} : " + item.loanType,
                            "{{'PARTNER_CODE'|translate}} : " + item.partnerCode,
                            "{{'PROCESS_TYPE'|translate}} : " + item.processType

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
                                title: 'LOAN_ID',
                                data: 'loanId'
                            }, {
                                title: 'ENTITY_NAME',
                                data: 'customerName'
                            },
                            {
                                title: 'ACCOUNT_NUMBER',
                                data: 'accountNumber'
                            }, {
                                title: 'PRODUCT_TYPE',
                                data: 'productCode'
                            }, {
                                title: 'APPLICATION_DATE',
                                data: 'applicationDate'
                            },
                        ]
                    },
                    getActions: function () {
                        return [
                            {
                                name: "CHECKER_1",
                                desc: "",
                                icon: "fa fa-book",
                                fn: function (item, index) {
                                    irfNavigator.go({
                                        'state': 'Page.Bundle',
                                        'pageName': 'kgfs.loans.individual.booking.Checker1',
                                        'pageId': item.loanId,
                                        'pageData': item
                                    },
                                    {
                                        state: 'Page.Engine',
                                    pageName: "kgfs.loans.individual.booking.Checker1Queue"
                                    }
                                    );
                                },
                                isApplicable: function (item, model) {
                                    return true;
                                }
                            }];
                    }
                }
            }
        };
    }

})
