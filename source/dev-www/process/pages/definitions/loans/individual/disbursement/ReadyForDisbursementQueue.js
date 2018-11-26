irf.pageCollection.factory(irf.page("loans.individual.disbursement.ReadyForDisbursementQueue"),
    ["$log", "formHelper", "$state", "SessionStore", "$q", "IndividualLoan","PageHelper","entityManager","irfProgressMessage","Locking",
        function($log, formHelper,  $state, SessionStore, $q, IndividualLoan,PageHelper,entityManager,irfProgressMessage,Locking){
            return {
                "type": "search-list",
                "title": "READY_FOR_DISBURSEMENT_QUEUE",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {

                    model.branchName = SessionStore.getBranch();
                    model.stage = 'ReadyForDisbursement';
                    model.branch = SessionStore.getCurrentBranch().branchId;
                    //model.branchId = SessionStore.getCurrentBranch().branchId;
                    console.log(model);
                },
                offline: false,
                definition: {
                    title: "READYFORDISBURSEMENT",
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

                            // "customerSignatureDate": {
                            //     "title": "CUSTOMER_SIGNATURE_DATE",
                            //     "type": "string",
                            //     "x-schema-form": {
                            //         "type": "date"

                            //     }
                            // },
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
                            "scheduledDisbursementDate": {
                                "title": "SCHEDULED_DISBURSEMENT_DATE",
                                "type": "string",
                                "x-schema-form": {
                                    "type": "date"
                                }
                            }

                        }
                    },
                    getSearchFormHelper: function() {
                        return formHelper;
                    },
                    getResultsPromise: function(searchOptions, pageOpts){
                        return IndividualLoan.searchDisbursement({
                            'currentStage': 'ReadyForDisbursement',
                            'branchId':searchOptions.branch,
                            'centreId': searchOptions.centre,
                            'customerSignatureDate': searchOptions.customerSignatureDate,
                            'scheduledDisbursementDate': searchOptions.scheduledDisbursementDate,
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
                                item.customerName + " ( Loan Account #: "+item.accountNumber+")",
                                "<em>Disbursed Amount:  &#8377;"+(_.isEmpty(item.disbursedAmount)?0:item.disbursedAmount)+", Disbursement Amount :  &#8377;"+item.disbursementAmount
                                +", Scheduled Disbursement Date :" + (_.isEmpty(item.scheduledDisbursementDate) ? " NA " : item.scheduledDisbursementDate) +"</em>"
                            ]
                        },
                        getActions: function(){
                            return [
                                {
                                    name: "Proceed to Disbursement",
                                    desc: "",
                                    fn: function(item, index){
                                        entityManager.setModel('loans.individual.disbursement.Disbursement', {_disbursement:item});
                                        $state.go("Page.Engine",{
                                            pageName:"loans.individual.disbursement.Disbursement",
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
