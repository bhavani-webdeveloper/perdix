irf.pageCollection.factory(irf.page("loans.individual.disbursement.ReadyForDisbursementQueue"),
    ["$log", "formHelper", "$state", "SessionStore", "$q", "IndividualLoan",
        function($log, formHelper,  $state, SessionStore, $q, IndividualLoan){
            return {
                "type": "search-list",
                "title": "READY_FOR_DISBURSEMENT_QUEUE",
                "subTitle": "",
                "uri":"Loan Disbursement/Ready",
                initialize: function (model, form, formCtrl) {

                    model.branchName = SessionStore.getBranch();
                    model.stage = 'ReadyForDisbursement';
                    console.log(model);
                },
                offline: false,
                definition: {
                    title: "ReadyForDisbursement",
                    autoSearch: false,
                    sorting:true,
                    sortByColumns:{
                        "customerSignatureDate":"Customer Signature Date",
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

                            "customerSignatureDate": {
                                "title": "CUSTOMER_SIGNATURE_DATE",
                                "type": "string",
                                "x-schema-form": {
                                    "type": "date"

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
                            'customerSignatureDate': searchOptions.customerSignatureDate,
                            'scheduledDisbursementDate': searchOptions.scheduledDisbursementDate

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
                                item.customerName,
                                "Disbursed Amount:  &#8377;"+item.disbursedAmount+", Disbursement Amount :  &#8377;"+item.disbursementAmount,
                                "Customer Signature Date  : " + item.customerSignatureDate+", Scheduled Disbursement Date :"+item.scheduledDisbursementDate
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
