irf.pageCollection.factory(irf.page("loans.individual.creditMonitoring.CreditMonitoringRiskQueue"), ["$log", "formHelper", "CreditMonitoring", "$state", "SessionStore", "Utils",
    function($log, formHelper, CreditMonitoring, $state, SessionStore, Utils) {

        return {
            "type": "search-list",
            "title": "CREDIT_MONITORING_RISK_QUEUE",
            initialize: function(model, form, formCtrl) {
                $log.info("luc Schedule Queue got initialized");
            },
            definition: {
                title: "SEARCH CUSTOMER",
                searchForm: [
                    "*"
                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        "branchName": {
                            "title": "HUB_NAME",
                            "type": "string",
                            "enumCode": "branch",
                            "x-schema-form": {
                                "type": "select",
                                "screenFilter": true
                            }
                        },
                        "centreId": {
                            "title": "SPOKE_NAME",
                            "type": "number",
                            "enumCode": "centre",
                            "x-schema-form": {
                                "type": "select",
                                "parentEnumCode": "branch",
                                "screenFilter": true
                            }
                        },
                        "applicantName": {
                            "title": "APPLICANT_NAME",
                            "type": "string"
                        },
                        "businessName": {
                            "title": "BUSINESS_NAME",
                            "type": "number"
                        },
                        "accountNumber": {
                            "title": "LOAN_ACCOUNT_NUMBER",
                            "type": "number"
                        },
                        "lucScheduledDate": {
                            "title": "CREDIT_MONITORING_SCHEDULED_DATE",
                            "type": "number"
                        },

                    },
                    "required": ["LoanAccountNumber"]
                },

                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    var branch = SessionStore.getCurrentBranch();
                    var centres = SessionStore.getCentres();
                    var centreId = [];
                    if (centres && centres.length) {
                        for (var i = 0; i < centres.length; i++) {
                            centreId.push(centres[i].centreId);
                        }

                    }
                    var promise = CreditMonitoring.search({
                        'accountNumber': searchOptions.accountNumber,
                        'currentStage': "LUCEscalate",
                        'centreId': centreId[0],
                        'branchName': branch.branchName,
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage,
                        'applicantName': searchOptions.applicantName,
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
                            title: 'LUC Date',
                            data: 'lucDate'
                        }, {
                            title: 'Escalated Reason',
                            data: 'lucEscalatedReason'
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