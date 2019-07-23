irf.pageCollection.factory(irf.page("loans.individual.collections.BouncePromiseQueue"),
["$log", "entityManager", "formHelper", "LoanProcess", "$state", "SessionStore", "$q","Utils",
function($log, entityManager, formHelper, LoanProcess, $state, SessionStore,$q,Utils){
    
    return {
        "type": "search-list",
        "title": "BOUNCED_PAYMENTS",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
           // model.branch = SessionStore.getBranch();
            var branch = SessionStore.getBranch();
	        //var centres = SessionStore.getCentres();
        },
        definition: {
            title: "SEARCH_BOUNCED_PAYMENTS",
            searchForm: [
                "*"
            ],
            autoSearch:false,
            sorting:true,
            sortByColumns:{
                "customerName":"Customer Name",
                "centreId":"Centre",
                "p2pDate":"Promise to Pay Date",
                "collectionPriority":"Collection Priority"
            },
            searchSchema: {
                "type": 'object',
                "required":["branch"],
                "properties": {
                    "loan_no": {
                        "title": "LOAN_ACCOUNT_NUMBER",
                        "type": "string",
                        "pattern": "^[0-9a-zA-Z]+$"
                    },
                    "first_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string"
                    },
                    "branchId": {
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
                            "parentEnumCode": "branch_id",
                            "parentValueExpr": "model.branchId",
                            "screenFilter": true
                        }
                    },
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                //var branchId = SessionStore.getCurrentBranch().branchId;
                
                var promise = LoanProcess.bounceCollectionDemand({
                    'accountNumbers': searchOptions.loan_no,  /*Service missing_27082016*/
                    'branchId':searchOptions.branchId,
                    'centreId': searchOptions.centre,
                    'customerName': searchOptions.first_name,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage,
                    "sortBy": searchOptions.sortBy 
                }).$promise;

                return promise;
            },
            paginationOptions: {
                "getItemsPerPage": function(response, headers){
                    return 100;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers && headers['x-total-count'];
                }
            },
            listOptions: {
                expandable: true,
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    if (_.hasIn(item, 'amount1') && _.isString(item['amount1'])){
                        item.amount1 = parseFloat(item['amount1']);
                    }
                    if (_.hasIn(item, 'amount3') && _.isString(item['amount3'])){
                        item.amount3 = parseFloat(item['amount3']);
                    }
                    if (_.hasIn(item, 'amount2') && _.isString(item['amount2'])){
                        item.amount2 = parseFloat(item['amount2']);
                    }
                    if (_.hasIn(item, 'part5') && _.isString(item['part5'])){
                        item.part5 = parseFloat(item['part5']);
                    }
                    return [
                        item.customerName,
                        "{{'LOAN_ACCOUNT_NUMBER'|translate}}: " + item.accountId,
                        "{{'TOTAL_AMOUNT_DUE'|translate}}: " + Utils.ceil(item.amount1 + item.amount2 + item.amount3 + item.part5),
                        "{{'PRINCIPAL_DUE'|translate}}: " + item.part1,         
                        "{{'INTEREST_DUE'|translate}}: " + item.part2,             
                        "{{'PENAL_INTEREST'|translate}}: " + item.part3, 
                        "{{'BOOKED_NOT_DUE_PENAL_INTEREST'|translate}}:" + item.part5, 
                        "{{'FEES_DUE'|translate}}: " + item.amount2,
                        "{{'UNAPPROVED_AMOUNT'|translate}}: " + item.repaidAmountSum,
                        "{{'Collection Priority'}}: " + item.collectionPriority
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "COLLECT_PAYMENT",
                            desc: "",
                            fn: function(item, index){
                                entityManager.setModel('loans.LoanRepay', {_bounce:item,_screen:"BounceQueue"});
                                $state.go('Page.Engine',
                                    {
                                        pageName: 'loans.LoanRepay',
                                        pageId: item.accountId,
                                        pageData: {
                                            'onlyDemandAllowed': true
                                        }
                                    }
                                );
                            },
                            isApplicable: function(item, index){
                                return true;
                            }
                        },
                        {
                            name: "COLLECTION_STATUS",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                entityManager.setModel('loans.individual.collections.P2PUpdate', {_bounce:item,_screen:"BouncePromiseQueue"});
                                $state.go('Page.Engine', {pageName: 'loans.individual.collections.P2PUpdate', pageId: item.accountId});
                            },
                            isApplicable: function(item, index){
                                return true;
                            }
                        },
                        {
                            name: "COLLECT_ADHOC_CHARGES",
                            desc: "",
                            fn: function(item, index){
                                $state.go("Page.Engine",{
                                    pageName:"loans.individual.collections.ChargeFee",
                                    pageId:item.accountId
                                });
                            },
                            isApplicable: function(item, index){
                                var siteCode = SessionStore.getGlobalSetting('siteCode');
                                if(siteCode == 'witfin') { 
                                    return true
                                }else{
                                    return false
                                }                                     }
                        },
                        {
							name: "View Details",
							desc: "",
							fn: function(item, index){
								$state.go('Page.Engine', {
									pageName: 'customer360.loans.LoanDetails',
									pageId: item.loanId
								})
							},
							isApplicable: function(item, index){
								var siteCode = SessionStore.getGlobalSetting('siteCode');
								if (siteCode=='witfin'){
									return true;
								}
								return false;
							}
						}
                    ];
                }
            }
        }
    };
}]);
