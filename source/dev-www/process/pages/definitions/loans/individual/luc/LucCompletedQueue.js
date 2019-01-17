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
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
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
                            "title": "LUC_COMPLETED_DATE",
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
                    centreId.push(centres[i].id);
                }

                }

                    var promise = LUC.search({
                        'accountNumber': searchOptions.accountNumber,
                        'currentStage':"Completed",
                        'centreId': centreId[0],
                        'branchName': branch.branchName,
                        'page': pageOpts.pageNo,
                        'monitoringType':"LUC",
                        'per_page': pageOpts.itemsPerPage,
                        'applicantName': searchOptions.applicantName,
                        'bussinessName': searchOptions.businessName,
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
                            title: 'LUC_COMPLETED_DATE',
                            data: 'lastStageChangedAt',
                            render: function(data, type, full, meta) {
                                return (moment(data).format("DD-MM-YYYY"));
                            }
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "View LUC Data",
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
                            isApplicable: function(item, model) {
                                return (model.siteCode != "KGFS");
                            }
                        },{
                            name: "View LUC Data",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    state: "Page.Engine", 
                                    pageName: "loans.individual.luc.LucVerification",
                                    pageId: item.id,
                                    pageData: {_lucCompleted : true}
                                });
                            },
                            isApplicable: function(item, model) {
                                return (model.siteCode == "KGFS");
                            }
                        }];
                    }
                }
            }
        };
    }
})