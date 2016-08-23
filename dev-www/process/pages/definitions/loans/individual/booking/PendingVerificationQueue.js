irf.pageCollection.factory(irf.page("loans.individual.booking.PendingVerificationQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "IndividualLoan",
function($log, formHelper, Enrollment, $state, SessionStore, $q, IndividualLoan){
    return {
        "type": "search-list",
        "title": "PENDING_VERIFICATION_QUEUE",
        "subTitle": "",
        "uri":"Loan Booking/Stage 2",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branchName = SessionStore.getBranch();
            model.stage = 'LoanBooking';
            console.log(model);
        },

        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      /* Should return the Promise */
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },
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
                        "x-schema-form": {
                            "type": "select"
                        },
                        "enumCode": "branch"
                    },
                    "centreCode": {
                        "title": "CENTER_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        },
                        "enumCode": "centre"
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
                    'customerId': searchOptions.customerId
                }).$promise;
                //var out = {
                //    body: [
                //        {
                //            "name": "Ajay Karthik | GKB Industries Ltd.",
                //            "loan_amount": "7,50,000",
                //            "cycle": "5607891 | Belgaum branch",
                //            "sanction_date": "12/07/2016"
                //        },
                //        {
                //            "name":"Ravi S | Key Metals Pvt. Ltd.",
                //            "loan_amount": "20,00,00",
                //            "cycle": "8725678 | Hubli branch",
                //            "sanction_date": "17/07/2016"
                //        },
                //        {
                //            "name":"Kaushik G | HPL",
                //            "loan_amount": "30,00,000",
                //            "cycle": "9057328 | Trichy branch",
                //            "sanction_date": "01/07/2016"
                //        }
                //    ],
                //    headers: {
                //        "method": "GET",
                //        "x-total-count": 20
                //    }
                //}
                //return $q.resolve(out)
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
                    $state.go('Page.Engine', {pageName: 'LoanBookingScreen', pageId: item.id});
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.name,
                        "Rs."+item.loan_amount+" | Sanction Date:"+item.sanction_date,
                        item.cycle
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Book Loan",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'LoanBookingScreen', pageId: item.id});
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
