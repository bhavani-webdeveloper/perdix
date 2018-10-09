define({
    pageUID: "kgfs.loans.individual.booking.DocumentUploadQueue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper","IndividualLoan", "SessionStore", "PageHelper", "Groups", "$state", "irfProgressMessage", "irfNavigator"],
    $pageFn: function($log, formHelper, IndividualLoan,SessionStore, PageHelper, Groups, $state, irfProgressMessage, irfNavigator) {

        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();
        var siteCode = SessionStore.getGlobalSetting('siteCode');

        return {
            "type": "search-list",
            "title": "DOCUMENT_EXECUTION",
            "subTitle": "",
            // "uri":"Loan Booking/Stage 3",
            initialize: function (model, form, formCtrl) {
                $log.info("search-list sample got initialized");
                model.branchName = SessionStore.getBranch();
                model.branchId = SessionStore.getBranchId();
                siteCode = SessionStore.getGlobalSetting('siteCode');
            },
    
            definition: {
                title: "LOAN_TYPE",
                autoSearch: true,
                sorting:true,
                sortByColumns:{
                    "customer name":"Customer Name",
                    "centre id":"Centre",
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
                        // "branchName": {
                        //     "title": "BRANCH_NAME",
                        //     "type": ["string", "null"],
                        //     "enumCode": "branch",
                        //     "x-schema-form": {
                        //         "type": "select"
                        //     }
    
                        // },
                        "centreCode": {
                            "title": "CENTER_NAME",
                            "type": ["number", "null"],
                            "enumCode": "centre",
                            "x-schema-form": {
                                "type": "select",
                                "parentValueExpr": "model.branchId"
                            }
                        },
                        "partner_code": {
                            "title": "PARTNER_CODE",
                            "type":["string","null"],
                            "x-schema-form": {
                                "type":"select",
                                "enumCode": "partner"
                            }
                        },
                        "loan_product": {
                            "title": "Loan Product",
                            "type": "string",
    
                            "x-schema-form": {
                                "type": "lov",
                                "lovonly": true,
                                search: function (inputModel, form, model, context) {
                                    var loanProduct = formHelper.enum('loan_product').data;
                                    var products = $filter('filter')(loanProduct, {parentCode: model.partner_code ? model.partner_code : undefined}, true);
    
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": products.length
                                        },
                                        body: products
                                    });
                                },
                                onSelect: function (valueObj, model, context) {
                                    model.loan_product = valueObj.field1;
                                },
                                getListDisplayItem: function (item, index) {
                                    return [
                                        item.name
                                    ];
                                },
                            }
                        },
                        // "customer_name": {
                        //     "title": "CUSTOMER_NAME",
                        //     "type": "string",
                        //     "x-schema-form": {
                        //         "type": "select"
                        //     }
                        // },
                        // "entity_name": {
                        //     "title": "ENTITY_NAME",
                        //     "type": "string",
                        //     "x-schema-form": {
                        //         "type": "select"
                        //     }
                        // },
                        // "sanction_date": {
                        //     "title": "SANCTION_DATE",
                        //     "type": "string",
                        //     "x-schema-form": {
                        //         "type": "date"
                        //     }
                        // }
                    }
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts){
                    if (_.hasIn(searchOptions, 'centreCode')){
                        searchOptions.centreCodeForSearch = LoanBookingCommons.getCentreCodeFromId(searchOptions.centreCode, formHelper);
                    }
                    return IndividualLoan.search({
                        'stage': 'DocumentUpload',
                        'branchName': searchOptions.branchName,
                        'centreCode': searchOptions.centreCodeForSearch,
                        'customerId': searchOptions.customerId,
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage,
                    }).$promise;
                },
                paginationOptions: {
                    "getItemsPerPage": function(response, headers){
                        return 20;
                    },
                    "getTotalItemsCount": function(response, headers){
                        return headers['x-total-count']
                    }
                },
                listOptions: {
					listStyle: "table",
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
                            item.customerName ,
                            "<em>Loan Amount: Rs."+item.loanAmount+", Sanction Date: "+item.sanctionDate + "</em>",
                        ]
                    },
                    getTableConfig: function() {
						return {
							"serverPaginate": true,
							"paginate": true,
							"pageLength": 10
						};
                    },
                    getColumns: function() {
						return [{
							title: 'ENTITY_NAME',
							data: 'customerName'
                        },
                            {

							title: 'LOAN_AMOUNT',
							data: 'loanAmount'
						}, {
                            title: 'SANCTION_DATE',
                            data: 'sanctionDate'
                        }
                    ]
					},
                    getActions: function(){
                        return [
                            {
                                name: "View / Upload Documents",
                                desc: "",
                                fn: function(item, index){
                                    if (siteCode == 'pahal') {
                                        //     irfNavigator.go({
                                        //     state: 'Page.Engine',
                                        //     pageName: 'pahal.loans.individual.booking.DocumentUpload',
                                        //     pageData: item,
                                        //     pageId: item.loanId
                                        // }, {
                                        //     state: 'Page.Engine',
                                        //     pageName: "loans.individual.booking.DocumentUploadQueue"
                                        // });
                                    } else {
                                        // irfNavigator.go({
                                        //     state: 'Page.Engine',
                                        //     pageName: 'loans.individual.booking.DocumentUpload',
                                        //     pageData: item,
                                        //     pageId: item.loanId
                                        // }, {
                                        //     state: 'Page.Engine',
                                        //     pageName: "loans.individual.booking.DocumentUploadQueue"
                                        // });
                                    }
    
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
    }
})