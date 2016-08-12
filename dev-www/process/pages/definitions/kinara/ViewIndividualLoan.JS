irf.pageCollection.factory("Pages__ViewIndividualLoan",
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "irfSimpleModal",
function($log, formHelper, Enrollment, $state, SessionStore,$q,showModal){
    return {
        "id": "ViewIndividualLoan",
        "type": "search-list",
        "name": "ViewIndividualLoan",
        "title": "View Individual Loan",
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
            searchForm: [
                "*"
            ],
            searchSchema: {
                "type": 'object',
                "title": 'SearchOptions',
                "required":["branch"],
                "properties": {
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
                    "entity": {
                        "title": "Entity",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "sanction_date": {
                        "title": "Sanction Date",
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
                            "name": "Ajay Karthik",
                            "loan_amount": "25000",
                            "cycle": "First Cycle",
                            "sanction_date": "12/07/2016"
                        },
                        {
                            "name":"Ravi S",
                            "loan_amount": "20000",
                            "cycle": "First Cycle",
                            "sanction_date": "17/07/2016"
                        },
                        {
                            "name":"Kaushik G",
                            "loan_amount": "30000",
                            "cycle": "Second Cycle",
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
                    showModal("Loan Documents",
                                        "<table><tr><td>Artifact</td><td>&nbsp;</td><td>&nbsp;</td></tr> <tr><td>Loan Application</td><td>&nbsp;<a>Download</a></td><td>&nbsp;<a>Upload</a></td></tr> <tr><td>Legal Agreements </td><td>&nbsp;<a></a></td><td>&nbsp;<a>Upload</a></td></tr> <tr><td>Legal Schedule</td><td>&nbsp;<a>Download</a></td><td>&nbsp;<a>Upload</a></td></tr> <tr><td>Loan sanction documents</td><td>&nbsp;<a>Download</a></td><td>&nbsp;<a>Upload</a></td></tr> <tr><td>PDC/ACH</td><td>&nbsp;<a></a></td><td>&nbsp;<a>Upload</a></td></tr> <tr><td>PHS</td><td>&nbsp;<a></a></td><td>&nbsp;<a>Upload</a></td></tr> <tr><td>Supporting documents</td><td>&nbsp;<a>Download</a></td><td>&nbsp;<a>Upload</a></td></tr> <tr><td>Others</td><td>&nbsp;<a></a></td><td>&nbsp;<button>Upload</button></td></tr></table>"
                                    );
                    
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.name+" | Sanction Date:"+item.sanction_date,
                        item.loan_amount,
                        item.cycle                        
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Download Loan Application",
                            icon: "fa fa-download",
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
                        },
                        {
                            name: "Download Demand Schedule",
                            icon: "fa fa-cloud-download",
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
                        },
                        {
                            name: "Upload",
                            icon: "fa fa-upload",
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
