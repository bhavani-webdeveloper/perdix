irf.pageCollection.factory(irf.page("loans.individual.booking.PendingQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "IndividualLoan", "LoanBookingCommons",
function($log, formHelper, Enrollment, $state, SessionStore, $q, IndividualLoan, LoanBookingCommons){
    return {
        "type": "search-list",
        "title": "LOAN_BOOKING_QUEUE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branchName = SessionStore.getBranch();
            model.branchId = SessionStore.getBranchId();
            model.stage = 'LoanBooking';
            console.log(model);
        },
        offline: false,
        definition: {
            title: "LOAN_TYPE",
            autoSearch: true,
            sorting:true,
            sortByColumns:{
                "customer name":"Customer Name",
                "centre id":"Centre",
                "sanction_date":"Sanction Date"
            },
            searchForm: [
                "*"
            ],
            searchSchema: {
                "type": 'object',
                "title": "VIEW_LOANS",
                "required":["branch"],
                "properties": {
                    "centreCode": {
                        "title": "CENTER_NAME",
                        "type": ["number", "null"],
                        "enumCode": "centre",
                        "x-schema-form": {
                            "type": "select",
                            "parentValueExpr": "model.branchId"
                        },
                        
                    },
                    "sanction_date": {
                        "title": "SANCTION_DATE",
                        "type": "string",
                        "x-schema-form": {
                            "type": "date"
                        }
                    },
                    "loan_product": {
                        "title": "Loan Product",
                        "type": "string",
                        "default": "1",
                        "x-schema-form": {
                            "type": "select",
                            "enumCode": "loan_product"
                        }
                    },
                    "account_number": {
                        "title": "LOAN_ACCOUNT_NUMBER",
                        "type": "string"
                    }
                    // "customer_name": {
                    //     "title": "CUSTOMER_NAME",
                    //     "type": "string",
                    //     "x-schema-form": {
                    //         "type": "select"
                    //     }
                    // },
                    // "entity_name": {
                    //     "title": "ENTITY_NAME",
                    //     "type": "string",
                    //     "x-schema-form": {
                    //         "type": "select"
                    //     }
                    // }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                if (_.hasIn(searchOptions, 'centreCode')){
                    searchOptions.centreCodeForSearch = LoanBookingCommons.getCentreCodeFromId(searchOptions.centreCode, formHelper);
                }
                return IndividualLoan.search({
                    'stage': 'LoanBooking',
                    'branchName': searchOptions.branchName,
                    'centreCode': searchOptions.centreCodeForSearch,
                    'customerId': null,
                    'accountNumber':null,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage,
                    'sortBy':searchOptions.sortBy
                }).$promise;
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 20;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count'];
                }
            },
            listOptions: {
                itemCallback: function(item, index) {
                    $log.info(item);
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.customerName ,
                        "<em>Loan Amount: Rs."+item.loanAmount+", Sanction Date: "+item.sanctionDate + "</em>",
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Book Loan",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'loans.individual.booking.LoanBooking', pageId: item.loanId});
                            },
                            isApplicable: function(item, index){
                                return true;
                            }
                        }
                    ];
                }
            }
        }
    };
}]);
