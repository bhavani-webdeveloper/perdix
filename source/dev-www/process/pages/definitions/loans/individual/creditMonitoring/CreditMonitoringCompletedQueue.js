define({
    pageUID: "loans.individual.creditMonitoring.CreditMonitoringCompletedQueue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "CreditMonitoring", "$state", "SessionStore", "Utils", "irfNavigator"],
    $pageFn: function($log, formHelper, CreditMonitoring, $state, SessionStore, Utils, irfNavigator) {

        return {
            "type": "search-list",
            "title": "CREDIT_MONITORING_COMPLETED_QUEUE",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("Credit Monitoring Schedule Queue got initialized");
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
                        "applicantName": {
                            "title": "APPLICANT_NAME",
                            "type": "string"
                        },
                        "businessName": {
                            "title": "BUSINESS_NAME",
                            "type": "string"
                        },
                        "accountNumber": {
                            "title": "LOAN_ACCOUNT_NUMBER",
                            "type": "string",

                        },
                        "lucCompletedDate": {
                            "title": "CM_COMPLETED_DATE",
                            "type": "string",
                            "x-schema-form": {
                                "type": "date"
                            }
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
                var centreId=[];
                 if(centres && centres.length)
                {
                    for (var i = 0; i < centres.length; i++) {
                    centreId.push(centres[i].centreId);
                }

                }

                    var promise = CreditMonitoring.search({
                        'accountNumber': searchOptions.accountNumber,
                        'currentStage':"Completed",
                        'centreId': centreId[0],
                        'branchName': branch.branchName,
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage,
                        'applicantName': searchOptions.applicantName,
                        'businessName': searchOptions.businessName,
                        'lucDate': searchOptions.lucCompletedDate
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
                        return [
                        {
                            title: 'HUB',
                            data: 'branchName'
                        },
                         {
                            title: 'CENTRE',
                            data: 'centreName'
                        },
                        {
                            title: 'APPLICANT_NAME',
                            data: 'customerName'
                        }, {
                            title: 'BUSINESS_NAME',
                            data: 'bussinessName'
                        }, {
                            title: 'LOAN_ACCOUNT_NUMBER',
                            data: 'accountNumber'
                        }, {
                            title: 'LOAN_ID',
                            data: 'loanId'
                        },{
                            title: 'CM_COMPLETED_DATE',
                            data: 'lucDate'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "Capture Credit Monitoring Data",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    state: "Page.Engine", 
                                    pageName: "loans.individual.creditMonitoring.CMData",
                                    pageId: item.id,
                                    pageData: {_lucCompleted : true}
                                },
                                {
                                    state: "Page.Engine", 
                                    pageName: "loans.individual.creditMonitoring.CreditMonitoringCompletedQueue",
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
})