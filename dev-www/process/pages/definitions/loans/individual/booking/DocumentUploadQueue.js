irf.pageCollection.factory(irf.page("loans.individual.booking.DocumentUploadQueue"),
["$log", "formHelper","$state", "SessionStore", "$q", "IndividualLoan", "entityManager", "LoanBookingCommons",
function($log, formHelper,$state, SessionStore, $q, IndividualLoan, entityManager, LoanBookingCommons){
    return {
        "type": "search-list",
        "title": "DOCUMENT_EXECUTION",
        "subTitle": "",
        "uri":"Loan Booking/Stage 3",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            // model.branchName = SessionStore.getBranch();
        },

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
                    "branchName": {
                        "title": "BRANCH_NAME",
                        "type": ["string", "null"],
                        "enumCode": "branch",
                        "x-schema-form": {
                            "type": "select"
                        }

                    },
                    "centreCode": {
                        "title": "CENTER_NAME",
                        "type": ["number", "null"],
                        "enumCode": "centre",
                        "x-schema-form": {
                            "type": "select",
                            "parentEnumCode":"branch"
                        }
                    },
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
                    // },
                    // "sanction_date": {
                    //     "title": "SANCTION_DATE",
                    //     "type": "string",
                    //     "x-schema-form": {
                    //         "type": "date"
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
                    'stage': 'DocumentUpload',
                    'branchName': searchOptions.branchName,
                    'centreCode': searchOptions.centreCodeForSearch,
                    'customerId': searchOptions.customerId,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage,
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
                            name: "View / Upload Documents",
                            desc: "",
                            fn: function(item, index){
                                entityManager.setModel('loans.individual.booking.DocumentUpload', {_queue:item});
                                $state.go('Page.Engine', {pageName: 'loans.individual.booking.DocumentUpload', pageId: item.loanId});
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
