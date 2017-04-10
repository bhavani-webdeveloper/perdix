define({
    pageUID: "loans.individual.luc.LucCompletedQueue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "LUC", "$state", "SessionStore", "Utils", "irfNavigator"],
    $pageFn: function($log, formHelper, LUC, $state, SessionStore, Utils, irfNavigator) {

        return {
            "type": "search-list",
            "title": "LUC_COMPLETED_QUEUE",
            "subTitle": "",
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
                        "lucCompletedDate": {
                            "title": "LUC_COMPLETED_DATE",
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
                var centreId=[];
                 if(centres && centres.length)
                {
                    for (var i = 0; i < centres.length; i++) {
                    centreId.push(centres[i].centreId);
                }

                }

                    var promise = LUC.search({
                        'accountNumber': searchOptions.accountNumber,
                        'currentStage':"Completed",
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
                        return [
                        {
                            title: 'HUB',
                            data: 'branchName'
                        },
                         {
                            title: 'CENTRE',
                            data: 'centreId'
                        },
                        {
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
                        },{
                            title: 'LUC Completion Date',
                            data: 'lucDate'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "Capture LUC Data",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    state: "Page.Engine", 
                                    pageName: "loans.individual.luc.LucData",
                                    pageId: item.id,
                                    pageData: {_lucCompleted : true}
                                },
                                {
                                    state: "Page.Engine", 
                                    pageName: "loans.individual.luc.LucCompletedQueue",
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