irf.pageCollection.factory(irf.page("loans.individual.disbursement.ReadyForDisbursementQueue"),
    ["$log", "formHelper", "$state", "SessionStore", "$q", "IndividualLoan","PageHelper","entityManager","irfProgressMessage","Locking","$filter",
        function($log, formHelper,  $state, SessionStore, $q, IndividualLoan,PageHelper,entityManager,irfProgressMessage,Locking,$filter){
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
                            'branch': {
                                'title': "BRANCH",
                                "type": ["string", "null"],
                                "x-schema-form": {
                                    "type": "userbranch",
                                    "screenFilter": true
                                }
                            },
                            "applicantName": {
                            "title": "CUSTOMER_NAME",
                            "type": "string"
                            },
                            // "urn": { /** as there is no query parameter in search api */
                            //     "title": "URN_NO",
                            //     "type": "string"
                            // },
                            "loanAccountNo": {
                            "title": "LOAN_ACCOUNT_NO",
                            "type": "string"
                            },
                            "scheduledDisbursementDate": {
                                "title": "SCHEDULED_DISBURSEMENT_DATE",
                                "type": "string",
                                "x-schema-form": {
                                    "type": "date"
                                }
                            },
                            "centre": {
                                "title": "CENTRE_ID",
                                "type": ["integer", "null"],
                                "x-schema-form": {
                                    "type": "select",
                                    "enumCode": "centre",
                                    "parentEnumCode": "branch",
                                    "parentValueExpr": "model.branch",
                                    "screenFilter": true
                                }
                            },
                            "loanType": {
                                "condition":"siteCode != 'kgfs'",
                                "key": "product.loanType",
                                "title": "LOAN_TYPE",
                                "type": ["string","null"],
                                "x-schema-form": {
                                        "type": "select",
                                        "enumCode": "booking_loan_type",                                        
                                    }
                            },
                            "loanType": {
                                "condition":"siteCode == 'kgfs'",
                                "key": "product.loanType",
                                "title": "LOAN_TYPE",
                                "type": ["string","null"],
                                "x-schema-form": {
                                        "type": "select",
                                        "enumCode": "booking_loan_type_readyForDisburse",                                        
                                    }
                            },
                            "productCategory":{
                                "condition":"siteCode != 'kgfs'",
                                "key": "product.productCategory",
                                "title": "PRODUCT_CATEGORY",
                                "type": ["string","null"],
                                    "x-schema-form": {
                                        "type": "select",
                                        "enumCode": "loan_product_category_master",
                                        "parentEnumCode": "booking_loan_type",
                                        "screenFilter": true
                                    }
                            },  
                            "productCategory":{
                                "condition":"siteCode == 'kgfs'",
                                "key": "product.productCategory",
                                "title": "PRODUCT_CATEGORY",
                                "type": ["string","null"],
                                    "x-schema-form": {
                                        "type": "select",
                                        "enumCode": "loan_product_category_master_readyForDisburse",
                                        "parentEnumCode": "booking_loan_type_readyForDisburse",
                                        "screenFilter": true
                                    }
                            },                          
                            "loan_product": {
                                "title": "PRODUCT_CODE",
                                "type": "string",
        
                                "x-schema-form": {
                                    "type": "lov",
                                    "lovonly": true,
                                    search: function (inputModel, form, model, context) {
                                        var loanProduct = formHelper.enum('loan_product').data;
                                        var products = $filter('filter')(loanProduct, 
                                            {   
                                                parentCode: model.partner_code ? model.partner_code : undefined,
                                                field2 : model.loanType ? model.loanType : undefined}, true);
        
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
                            'customerName': searchOptions.applicantName,
                            'accountNumber':searchOptions.loanAccountNo,
                            'productCode': searchOptions.loan_product,
                            'loanType':searchOptions.loanType,
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
                                "<em>Loan amount sanctioned:  &#8377;"+((!item.disbursedAmount)?0:item.disbursedAmount)+",Disbursed Amount:  &#8377;"+((!item.disbursedAmount)?0:item.disbursedAmount)+", Disbursement Amount :  &#8377;"+item.disbursementAmount
                                +", Scheduled Disbursement Date :" + ((!item.scheduledDisbursementDate) ? " NA " : item.scheduledDisbursementDate) + (item.productCode?  ", Product Code :" +item.productCode : "" )+(item.groupCode?  ", Group Code :" +item.groupCode : "" ) + "</em>"
                            ]
                        },
                        getActions: function(){
                            return [
                                {
                                    name: "Proceed to Disbursement",
                                    desc: "",
                                    fn: function(item, index){
                                        entityManager.setModel('loans.individual.disbursement.Disbursement', {_disbursement:item});
                                        var siteCode = SessionStore.getGlobalSetting("siteCode");
                                        if(siteCode=="kinara"){
                                            $state.go("Page.Engine",{
                                                pageName:"kinara.loans.individual.disbursement.Disbursement",
                                                pageId:[item.loanId,item.id].join(".")
                                            });
                                        }else{
                                            $state.go("Page.Engine",{
                                                pageName:"loans.individual.disbursement.Disbursement",
                                                pageId:[item.loanId,item.id].join(".")
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
        }]);
