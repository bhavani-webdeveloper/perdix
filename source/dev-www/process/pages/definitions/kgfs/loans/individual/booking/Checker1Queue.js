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
                model.branch = SessionStore.getCurrentBranch().branchId;
                model.branchId = SessionStore.getBranchId();
            },
            definition: {
                title: "SEARCH_LOANS",
                //autoSearch: true,
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
                            "required":true,
                            "x-schema-form": {
                                "type": "select",
                                "screenFilter": true,
                                "enumCode": "branch"
                            }
                        },
                        "centre": {
                            "title": "CENTRE",
                            "type": ["integer", "null"],
                            "x-schema-form": {
                            "type": "select",
                            "enumCode": "centre",
                            "parentEnumCode": "branch_id",
                            "parentValueExpr": "model.branch",
                            "screenFilter": true
                            }
                        },
                        "applicantName": {
                        "title": "CUSTOMER_NAME",
                        "type": "string"
                        },
                        "urn": {
                            "title": "URN_NO",
                            "type": "string"
                        },
                        "loanAccountNo": {
                            "title": "LOAN_ACCOUNT_NO",
                            "type": "string"
                        },
                        "partner_code": {
                            "title": "PARTNER_CODE",
                            "type":["string","null"],
                            "x-schema-form": {
                                "type":"select",
                                "enumCode": "partner"
                            }
                        }
                    },
                    "required": []
                },
                getSearchFormHelper: function () {
                    return formHelper;
                },
                getResultsPromise: function (searchOptions, pageOpts) {
                    if (_.hasIn(searchOptions, 'centreCode')) {
                        searchOptions.centreCodeForSearch = LoanBookingCommons.getCentreCodeFromId(searchOptions.centreCode, formHelper);
                    }
                    var promise = IndividualLoan.search({
                        'stage': 'Checker1',
                        'branchName': searchOptions.branch,
                        'centreCode': searchOptions.centre,
                        'applicantName': searchOptions.applicantName,
                        'urn':searchOptions.urn,
                        'accountNumber':searchOptions.loanAccountNo,
                        'partnerCode': searchOptions.partner_code,
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

                            "{{'CUSTOMER_NAME'|translate}} : " + item.customerName,
                            "{{'URN_NO'|translate}} : " + item.urn,
                            "{{'LOAN_ACCOUNT_NO'|translate}} : " + item.accountNumber,
                            "{{'LOAN_AMOUNT_SANCTIONED'|translate}} : " + item.loanAmount,
                            "{{'DOCUMENT_UPLOADED_TIME'|translate}} : " + item.applicationDate,
                            "{{'PRODUCT_TYPE'|translate}} : " + item.loanType,

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
                                data: 'id'
                            },{
                                title: 'CUSTOMER_NAME',
                                data: 'customerName'
                            },
                            {
                                title: 'URN_NO',
                                data: 'urn'
                            },
                            {
                                title: 'LOAN_ACCOUNT_NO',
                                data: 'accountNumber'
                            },
                            {
                                title: 'LOAN_AMOUNT_SANCTIONED',
                                data: 'loanAmount'
                            },{
                                title: 'DCOUEMT_UPLOADED_TIME',
                                data: 'applicationDate'
                            },{
                                title: 'PRODUCT_TYPE',
                                data: 'loanType'
                            }
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
