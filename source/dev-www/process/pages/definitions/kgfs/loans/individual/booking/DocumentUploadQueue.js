define({
    pageUID: "kgfs.loans.individual.booking.DocumentUploadQueue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper","IndividualLoan", "SessionStore", "PageHelper", "Groups", "$state", "irfProgressMessage", "irfNavigator","$filter","$q"],
    $pageFn: function($log, formHelper, IndividualLoan,SessionStore, PageHelper, Groups, $state, irfProgressMessage, irfNavigator,$filter,$q) {

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
                model.branch = SessionStore.getCurrentBranch().branchId;
                siteCode = SessionStore.getGlobalSetting('siteCode');
            },
    
            definition: {
                title: "LOAN_TYPE",
                autoSearch: true,
                searchForm: [
                    "*"
                ],
                searchSchema: {
                    "type": 'object',
                    "title": "VIEW_LOANS",
                    "required":["branch"],
                    "properties": {
                        "branchName": {
                            "title": "BRANCH",
                            "type": ["string", "null"],
                            "enumCode": "branch",
                            "x-schema-form": {
                                "type": "select"
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
                        "applicantName": {
                        "title": "CUSTOMER_NAME",
                        "type": "string"
                        },
                        "urn": {
                            "title": "URN_NO",
                            "type": "string"
                        },
                        "loanAccountNo": {
                            "title": "LOAN_ACCOUNT_NO",
                            "type": "string"
                        },
                        "loanType": {
                            "title": "PRODUCT_TYPE",
                            "enumCode": "booking_loan_type",
                            "type": "string",
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                        "partner_code": {
                            "title": "PARTNER_CODE",
                            "type":["string","null"],
                            "x-schema-form": {
                                "type":"select",
                                "enumCode": "partner"
                            }
                        }
                        // "loan_product": {
                        //     "title": "Loan Product",
                        //     "type": "string",
    
                        //     "x-schema-form": {
                        //         "type": "lov",
                        //         "lovonly": true,
                        //         search: function (inputModel, form, model, context) {
                        //             var loanProduct = formHelper.enum('loan_product').data;
                        //             var products = $filter('filter')(loanProduct, {parentCode: model.partner_code ? model.partner_code : undefined}, true);
    
                        //             return $q.resolve({
                        //                 headers: {
                        //                     "x-total-count": products.length
                        //                 },
                        //                 body: products
                        //             });
                        //         },
                        //         onSelect: function (valueObj, model, context) {
                        //             model.loan_product = valueObj.field1;
                        //         },
                        //         getListDisplayItem: function (item, index) {
                        //             return [
                        //                 item.name
                        //             ];
                        //         },
                        //     }
                        // },
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
                        'centreCode': searchOptions.centre,
                        'applicantName': searchOptions.applicantName,
                        'urn':searchOptions.urn,
                        'accountNumber':searchOptions.loanAccountNo,
                        'loanType':searchOptions.loanType,
                        'partnerCode': searchOptions.partner_code,
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
                            item.loanType,
                            item.customerName ,
                            item.urn,
                            item.accountNumber,
                            item.loanAmount
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
						return [
                        {
                            title: 'LOAN_ID',
                            data: 'id'
                        },{
							title: 'CUSTOMER_NAME',
							data: 'customerName'
                        },{
                            title: 'URN_NO',
                            data: 'urn'
                        },{
                            title: 'LOAN_ACCOUNT_NO',
                            data: 'accountNumber'
                        },{

							title: 'LOAN_AMOUNT_SANCTIONED',
							data: 'loanAmount'
						},{
                            title: 'PRODUCT_TYPE',
                            data: 'loanType'
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
                                        irfNavigator.go({
                                            state: 'Page.Bundle',
                                            pageName: 'kgfs.loans.individual.booking.LoanDocument',
                                            pageData: item,
                                            pageId: item.loanId
                                        }, {
                                            state: 'Page.Engine',
                                            pageName: "kgfs.loans.individual.booking.DocumentUploadQueue"
                                        });
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