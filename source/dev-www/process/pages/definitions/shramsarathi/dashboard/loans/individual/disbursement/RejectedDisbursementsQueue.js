irf.pageCollection.factory(irf.page("shramsarathi.dashboard.loans.individual.disbursement.RejectedDisbursementQueue"),
    ["$log", "formHelper", "$state", "SessionStore", "$q", "IndividualLoan","PageHelper","entityManager",
        function($log, formHelper,  $state, SessionStore, $q, IndividualLoan,PageHelper,entityManager){
            return {
                "type": "search-list",
                "title": "REJECTED_DISBURSEMENT_QUEUE",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {

                    model.branch = SessionStore.getCurrentBranch().branchId;
                    model.stage = 'RejectedDisbursement';
                    console.log(model);
                },
                offline: false,
                definition: {
                    title: "REJECTED_DISBURSEMENT_QUEUE",
                    autoSearch: true,
                    sorting:true,
                    sortByColumns:{
                        "scheduledDisbursementDate":"Scheduled Disbursement Date"

                    },
                    searchForm: [
                        "*"
                    ],
                    searchSchema: {
                        "type": 'object',
                        "title": "VIEW_LOANS",
                        "required":[],
                        "properties": {
                            "scheduledDisbursementDate": {
                                "title": "SCHEDULED_DISBURSEMENT_DATE",
                                "type": "string",
                                "x-schema-form": {
                                    "type": "date"
                                }
                            },
                            'branch': {
                                'title': "BRANCH",
                                "type": ["string", "null"],
                                "x-schema-form": {
                                    "type": "userbranch",
                                    "readonly":true,
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
                            }

                        }
                    },
                    getSearchFormHelper: function() {
                        return formHelper;
                    },
                    getResultsPromise: function(searchOptions, pageOpts){
                        return IndividualLoan.searchDisbursement({
                            'currentStage': 'RejectedDisbursement',
                            'customerSignatureDate': searchOptions.customerSignatureDate,
                            'scheduledDisbursementDate': searchOptions.scheduledDisbursementDate,
                            'branchId':searchOptions.branch,
                            'centreId': searchOptions.centre
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
                                item.customerName + " ( Account #: "+item.accountNumber+")",
                                "<em>Disbursed Amount:  &#8377;"+((!item.disbursedAmount)?0:item.disbursedAmount)+", Disbursement Amount :  &#8377;"+item.disbursementAmount
                                + ", Scheduled Disbursement Date :" + ((!item.scheduledDisbursementDate) ? " NA " : item.scheduledDisbursementDate) + "</em>"
                            ]
                        },
                        getActions: function(){
                            return [
                                {
                                    name: "UPDATE_ACCOUNT",
                                    desc: "",
                                    fn: function(item, index){

                                        entityManager.setModel('shramsarathi.dashboard.loans.individual.disbursement.UpdateAccountDetails', {_rejectedDisbursementQueue:item});
                                        $state.go("Page.Engine",{
                                            pageName:"shramsarathi.dashboard.loans.individual.disbursement.UpdateAccountDetails",
                                            pageId:[item.loanId,item.id].join(".")
                                        });

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
