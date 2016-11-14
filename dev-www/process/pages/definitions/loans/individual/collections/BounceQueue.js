irf.pageCollection.factory(irf.page("loans.individual.collections.BounceQueue"),
["$log", "formHelper", "LoanProcess", "$state", "SessionStore", "$q", "entityManager", "Utils", "PagesDefinition",
function($log, formHelper, LoanProcess, $state, SessionStore,$q, entityManager, Utils, PagesDefinition){
    return {
        "type": "search-list",
        "title": "BOUNCED_PAYMENTS",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branchId = SessionStore.getBranchId();
            model.pageConfig = {
                isAllBranchAllowed: false,
                centresRestricted: false
            };

            PagesDefinition.getRolePageConfig("Page/Engine/loans.individual.collections.BounceQueue")
                .then(
                function(config){
                    if (config && _.hasIn(config, 'all_branch_allowed') && config['all_branch_allowed']) {
                        model.pageConfig.isAllBranchAllowed = true;
                    }

                    if (model.pageConfig.isAllBranchAllowed === false){
                        model.centres = SessionStore.getCentres();

                        /* Default centre */
                        if (model.centres && model.centres.length>0){
                            model.centre = model.centres[0].centreCode;
                            model.centreName = model.centres[0].centreName;
                        }
                    }
                }, function(err){
                    model.pageConfig.isAllBranchAllowed = false;
                }
            )
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
                    "key": "branchId",
                    "condition": "model.pageConfig.isAllBranchAllowed"
                },
                {
                    "key": "centre",
                    "condition": "model.pageConfig.isAllBranchAllowed"
                },
                {
                    key: "centreName",
                    type: "lov",
                    autolov: false,
                    title:"CENTRE",
                    condition: "model.pageConfig.isAllBranchAllowed===false",
                    bindMap: {
                    },
                    searchHelper: formHelper,
                    search: function(inputModel, form, model, context) {
                        var centres = SessionStore.getCentres();
                        return $q.resolve({
                            headers: {
                                "x-total-count": centres.length
                            },
                            body: centres
                        });
                    },
                    onSelect: function(valueObj, model, context){
                        model.centre = valueObj.centreCode;
                        model.centreName = valueObj.centreName;
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.centreName
                        ];
                    }
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
                    "branchId": {
                        "title": "BRANCH_NAME",
                        "type": ["null","number"],
                        "enumCode": "branch_id",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "centre": {
                        "title": "CENTRE",
                        "type": ["null", "number"],
                        "enumCode": "centre",
                        "x-schema-form": {
                            "type": "select",
                            "parentValueExpr": "model.branchId"
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
                    'accountNumbers': searchOptions.loan_no,  /*Service missing_27082016*/
                    'branchId': searchOptions.branchId || SessionStore.getBranchId(),
                    'centreId': searchOptions.centre,
                    'customerName': searchOptions.first_name,
                    'promisreToPayDate': searchOptions.promisreToPayDate,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage
                }).$promise;

                return promise;
            },
            paginationOptions: {
                "getItemsPerPage": function(response, headers){
                    return 10;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers && headers['x-total-count'] || 10;
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
                    return [
                        item.customerName,
                        "{{'LOAN_ACCOUNT_NUMBER'|translate}}: " + item.accountId,
                        "{{'TOTAL_AMOUNT_DUE'|translate}}: " + Utils.ceil(item.amount1 + item.amount2 + item.amount3),
                        "{{'PRINCIPAL_DUE'|translate}}: " + item.part1,         
                        "{{'INTEREST_DUE'|translate}}: " + item.part2,             
                        "{{'PENAL_INTEREST'|translate}}: " + item.part3,  
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
