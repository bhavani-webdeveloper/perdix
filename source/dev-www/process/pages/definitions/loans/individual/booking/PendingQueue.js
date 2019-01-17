irf.pageCollection.factory(irf.page("loans.individual.booking.PendingQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "IndividualLoan", "LoanBookingCommons","$filter",
function($log, formHelper, Enrollment, $state, SessionStore, $q, IndividualLoan, LoanBookingCommons, $filter){
    return {
        "type": "search-list",
        "title": "LOAN_BOOKING_QUEUE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.stage = 'LoanBooking';
            model.branch = SessionStore.getCurrentBranch().branchId;
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
                    'branch': {
                        'title': "BRANCH",
                        "type": ["string", "null"],
                        "x-schema-form": {
                            "type": "userbranch",
                            "screenFilter": true
                        }
                    },
                    "centre": {
                        "title": "CENTRE",
                        "type": ["integer", "null"],
                        "x-schema-form": {
                            "type": "select",
                            "enumCode": "centre",
                            "parentEnumCode": "branch",
                            "parentValueExpr": "model.branch",
                            "screenFilter": true
                        }
                    },
                    "sanction_date": {
                        "title": "SANCTION_DATE",
                        "type": "string",
                        "x-schema-form": {
                            "type": "date"
                        }
                    },
                    "partner_code": {
                        "title": "PARTNER_CODE",
                        "type":["string","null"],
                        "x-schema-form": {
                            "type":"select",
                            "enumCode": "partner"
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
                    'branchId':searchOptions.branch,
                    'centreCode': searchOptions.centre,
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
