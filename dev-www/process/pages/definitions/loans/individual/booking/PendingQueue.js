irf.pageCollection.factory(irf.page("loans.individual.booking.PendingQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "IndividualLoan",
function($log, formHelper, Enrollment, $state, SessionStore, $q, IndividualLoan){
    return {
        "type": "search-list",
        "title": "LOAN_BOOKING_QUEUE",
        "subTitle": "",
        "uri":"Loan Booking/Stage 2",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branchName = SessionStore.getBranch();
            model.stage = 'LoanBooking';
            console.log(model);
        },
        offline: false,
        definition: {
            title: "LOAN_TYPE",
            autoSearch: false,
            sorting:true,
            sortByColumns:{
                "name":"Customer Name",
                "centre_name":"Centre",
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

                    "loan_product": {
                        "title": "Loan Product",
                        "type": "string",
                        "default": "1",
                        "x-schema-form": {
                            "type": "select",
                            /*"titleMap": {
                                "1": "Asset Purchase- Secured",
                                "2": "Working Capital - Secured",
                                "3": "Working Capital -Unsecured",
                                "4": "Machine Refinance- Secured",
                                "5": "Business Development- Secured",
                                "6": "Business Development- Unsecured",
                                "7": "LOC- RFD-Secured",
                                "8": "LOC- RFD-Unsecured",
                                "9": "LOC RFID- Secured",
                                "10": "LOC- RFID- Unsecured"
                            }*/
                            "enumCode": "loan_product"
                        }
                    },

                    "customer_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "entity_name": {
                        "title": "ENTITY_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "sanction_date": {
                        "title": "SANCTION_DATE",
                        "type": "string",
                        "x-schema-form": {
                            "type": "date"
                        }
                    },
                    "branchName": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "enumCode": "branch",
                        "x-schema-form": {
                            "type": "select"
                        }
                        
                    },
                    "centreCode": {
                        "title": "CENTER_NAME",
                        "type": "string",
                        "enumCode": "centre",
                        "x-schema-form": {
                            "type": "select"
                        },
                        "parentEnumCode":"branch"
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                return IndividualLoan.search({
                    'stage': 'LoanBooking',
                    'branchName': searchOptions.branchName,
                    'centreCode': searchOptions.centreCode,
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
                    return headers['x-total-count']
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
