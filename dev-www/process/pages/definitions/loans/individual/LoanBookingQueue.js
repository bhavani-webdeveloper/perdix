irf.pageCollection.factory(irf.page("loans.individual.booking.LoanBookingQueue"),
["$log", "formHelper", "IndividualLoan", "$state", "SessionStore",
function($log, formHelper, IndividualLoan, $state, SessionStore){
    return {
        "id": "LoanBookingQueue",
        "type": "search-list",
        "name": "Pending for Loan Booking Queue",
        "title": "Pending for Loan Booking Queue",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
        },
        definition: {
            title: "Search Loans pending for Booking",
            searchForm: [
                "*"
            ],
            searchSchema: {
                "type": 'object',
                "title": 'SearchOptions',
                "required":["branch"],
                "properties": {
                    "loan_no": {
                        "title": "Loan Account Number",
                        "type": "string"
                    },
                    "first_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string"
                    },
                    "kyc_no": {
                        "title": "KYC_NO",
                        "type": "string"
                    },
                    "branch": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "enumCode": "branch",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "centre": {
                        "title": "CENTRE",
                        "type": "string",
                        "enumCode": "centre",
                        "x-schema-form": {
                            "type": "select",
                            "filter": {
                                "parentCode as branch": "model.branch"
                            }
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                var promise = IndividualLoan.search({
                    'stage': 'LoanBooking',
                    'branchName': searchOptions.branch,
                    'centreCode': searchOptions.centre,
                    'customerId': null,
                    'accountNumber':loan_no,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage,
                }).$promise;

                return promise;
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 20;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
                }
            },
            listOptions: {
                itemCallback: function(item, index) {
                    $log.info(item);
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.firstName + " " + (item.lastName!=null?item.lastName:""),
                        'Customer ID : ' + item.id,
                        null
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Do House Verification",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        }
                    ];
                }
            }
        }
    };
}]);
