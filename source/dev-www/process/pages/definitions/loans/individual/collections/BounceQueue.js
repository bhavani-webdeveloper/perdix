irf.pageCollection.factory(irf.page("loans.individual.collections.BounceQueue"),
["$log", "formHelper", "LoanProcess", "$state", "SessionStore", "$q", "entityManager", "Utils", "PagesDefinition", "$stateParams",
function($log, formHelper, LoanProcess, $state, SessionStore,$q, entityManager, Utils, PagesDefinition, $stateParams){
        return {
        "type": "search-list",
        "title": "BOUNCED_PAYMENTS",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getCurrentBranch().branchId;
            PagesDefinition.getPageConfig("Page/Engine/loans.individual.collections.BounceQueue")
            .then(function(data){
                console.log(data);
                var defaultConfig = {
                    IncludeUserFilter: false
                };
                _.defaults(data, defaultConfig);
                model.pageConfig = _.extend(model.pageConfig, data);
                if (model.pageConfig.IncludeUserFilter)
                    model.assignedTo = SessionStore.getLoginname();
            });
        },
        definition: {
            title: "SEARCH_BOUNCED_PAYMENTS",
            autoSearch: false,
            sorting:true,
            sortByColumns:{
                "name":"Customer Name",
                "centre_name":"Centre",
                "sanction_date":"Sanction Date"
            },
            searchForm: [
                "loan_no",
                "first_name",
                {
                    "key": "branch",
                    "readonly":true
                },
                {
                    "key": "centre",
                    "type":"select",
                    "enumCode":"usercentre",
                    title:"CENTRE",
                    required:true,
                },
                {
                    "key": "promisreToPayDate"
                }
            ],
            searchSchema: {
                "type": 'object',
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
                    "branch": {
                        'title': "BRANCH",
                        "type": ["string", "null"],
                        "x-schema-form": {
                            "type":"userbranch",
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
                            "parentValueExpr": "model.branch",
                            "screenFilter": true
                        }
                    },
                    "promisreToPayDate":{
                        "title": "PROMISE_TO_PAY_DATE",
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

            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                var promise = LoanProcess.bounceCollectionDemand({
                    'accountNumbers': searchOptions.loan_no,
                    /*Service missing_27082016*/
                    'branchId': searchOptions.branch || SessionStore.getBranchId(),
                    'centreId': searchOptions.centre,
                    'customerName': searchOptions.first_name,
                    'promiseToPayDate': searchOptions.promisreToPayDate,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage,
                    'assignedTo': searchOptions.assignedTo
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
                        "{{'UNAPPROVED_AMOUNT'|translate}}: " + item.repaidAmountSum
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "COLLECT_PAYMENT",
                            desc: "",
                            fn: function(item, index){
                                console.log("Th9s os yessssss");
                                console.log(item);
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
                                entityManager.setModel('loans.individual.collections.P2PUpdate', {_bounce:item,_screen:"BounceQueue"});
                                $state.go('Page.Engine', {pageName: 'loans.individual.collections.P2PUpdate', pageId: item.accountId});
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
