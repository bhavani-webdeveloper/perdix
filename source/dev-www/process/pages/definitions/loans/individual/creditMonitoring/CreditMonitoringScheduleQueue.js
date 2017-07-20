irf.pageCollection.factory(irf.page("loans.individual.creditMonitoring.CreditMonitoringScheduleQueue"), ["$log", "formHelper", "LUC", "$state", "SessionStore", "Utils",
    function($log, formHelper, LUC, $state, SessionStore, Utils) {

        return {
            "type": "search-list",
            "title": "CREDIT_MONITORING_SCHEDULED_QUEUE",
            initialize: function(model, form, formCtrl) {
                $log.info("creditMonitoring Schedule Queue got initialized");
            },
            definition: {
                title: "SEARCH_CREDIT_MONITORING",
                searchForm: [
                    "*"
                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        "branch": {
                            "title": "BRANCH_NAME",
                            "type": "integer",
                            "enumCode": "branch_id",
                            "x-schema-form": {
                                "type": "select",
                                "screenFilter": true
                            }
                        },
                        "centre": {
                            "title": "CENTRE",
                            "type": "integer",
                            "enumCode": "centre",
                            "x-schema-form": {
                                "type": "select",
                                "parentEnumCode": "branch_id",
                                "parentValueExpr": "model.branch",
                                "screenFilter": true
                            }
                        },
                        "applicantName": {
                            "title": "APPLICANT_NAME",
                            "type": "string"
                        },
                        "businessName": {
                            "title": "BUSINESS_NAME",
                            "type": "string"
                        },
                        "cmScheduledDate": {
                            "title": "CM_SCHEDULED_DATE",
                            "type": "string",
                            "x-schema-form": {
                                "type": "date"
                            }
                        },
                        "accountNumber": {
                            "title": "LOAN_ACCOUNT_NUMBER",
                            "type": "string"
                        },
                    },
                    "required": ["LoanAccountNumber"]
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    var branches = formHelper.enum('branch').data;
                    var branchName = null;
                    for (var i = 0; i < branches.length; i++) {
                        var branch = branches[i];
                        if (branch.code == searchOptions.branch) {
                            branchName = branch.name;
                        }
                    }
                    var promise = LUC.search({
                        'accountNumber': searchOptions.accountNumber,
                        'monitoringType': "CM",
                        'currentStage': "CMSchedule",
                        'lucScheduledDate': searchOptions.cmScheduledDate,
                        'centreId': searchOptions.centre,
                        'branchName': branchName,
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage,
                        'applicantName': searchOptions.applicationName,
                        'businessName': searchOptions.businessName,
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
                        return [
                            item.applicantName,
                            item.businessName,
                            item.accountNumber,
                            item.loanId,
                            item.disbursementDate,
                            item.lucDate,
                        ]
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
                            title: 'Applicant Name',
                            data: 'customerName'
                        }, {
                            title: 'Business Name',
                            data: 'bussinessName'
                        }, {
                            title: 'Account Number',
                            data: 'accountNumber'
                        }, {
                            title: 'Loan Id',
                            data: 'loanId'
                        }, {
                            title: 'Disbursement Date',
                            data: 'disbursementDate'
                        }, {
                            title: 'CM Date',
                            data: 'lucDate'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "Capture Credit Monitoring Data",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                $state.go("Page.Engine", {
                                    pageName: "loans.individual.creditMonitoring.CMData",
                                    pageId: item.id
                                });
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
]);