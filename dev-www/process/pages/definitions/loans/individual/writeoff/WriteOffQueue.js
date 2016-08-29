irf.pageCollection.factory(irf.page("loans.individual.writeoff.AccountQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "IndividualLoan",
function($log, formHelper, Enrollment, $state, SessionStore, $q, IndividualLoan){
    return {
        "type": "search-list",
        "title": "PENDING_WRITEOFF_QUEUE",
        "subTitle": "",
        "uri":"Loan WriteOff/Stage 1",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branchName = SessionStore.getBranch();
            model.stage = 'WriteOff';
            console.log(model);
        },

        offline: false,
        
        definition: {
            title: "SEARCH",
            autoSearch: false,
            sorting:true,
            sortByColumns:{
                "days":"OD Days"
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
                            "enumCode": "loan_product"
                        }
                    },
                    "branchName": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        },
                        "enumCode": "branch"
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                return IndividualLoan.search({
                    'stage': 'DocumentUpload',
                    'branchName': searchOptions.branchName,
                    'centreCode': searchOptions.centreCode,
                    'customerId': searchOptions.customerId
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
                        item.accountNumber,
                        item.customerName,
                        "<em>Write-off Amount: Rs."+item.writeOffAmount+", Write-off Date: "+item.writeOffDate + "</em>"
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "WRITE_OFF",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'loans.individual.writeoff.execute', pageId: item.loanId});
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
