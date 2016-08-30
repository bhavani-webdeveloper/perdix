irf.pageCollection.factory(irf.page("loans.individual.disbursement.MultiTrancheQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q",
function($log, formHelper, Enrollment, $state, SessionStore,$q){
    return {
        "type": "search-list",
        "title": "Multi Tranche Queue",
        "subTitle": "",
        "uri":"Customer Enrollment/Stage 2",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
            model.stage = 'Stage02';
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
            title: "Choose Loan Type",
            autoSearch: true,
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
                "title": 'SearchOptions',
                "required":["branch"],
                "properties": {
                    /*
                    "loan_product": {
                        "title": "Loan Product",
                        "type": "string",
                        "default": "1",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": {
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
                            }
                        }
                    },
                    */
                    "customer_name": {
                        "title": "Customer Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "entity_name": {
                        "title": "Entity Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "sanction_date": {
                        "title": "Sanction Date",
                        "type": "string",
                        "x-schema-form": {
                            "type": "date"
                        }
                    },
                    "branch_name": {
                        "title": "Branch Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "centre_name": {
                        "title": "Centre Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                var out = {
                    body: [
                        {
                            "name": "Ajay Karthik | GKB Industries Ltd.",
                            "loan_amount": "7,50,000",
                            "Tranche": "2 | Belgaum branch",
                            "sanction_date": "12/07/2016"
                        },
                        {
                            "name":"Ravi S | Key Metals Pvt. Ltd.",
                            "loan_amount": "20,00,00",
                            "Tranche": "3 | Hubli branch",
                            "sanction_date": "17/07/2016"
                        },
                        {
                            "name":"Kaushik G | HPL",
                            "loan_amount": "30,00,000",
                            "Tranche": "2 | Trichy branch",
                            "sanction_date": "01/07/2016"
                        }
                    ],
                    headers: {
                        "method": "GET",
                        "x-total-count": 20
                    }
                }
                return $q.resolve(out)
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
                        item.name,
                        "Rs."+item.loan_amount+" | Sanction Date:"+item.sanction_date,
                        item.Tranche                        
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Book Loan",
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
