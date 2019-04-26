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
                            "loanType": {
                                "key": "product.loanType",
                                "title": "LOAN_TYPE",
                                "type": ["string","null"],
                                "x-schema-form": {
                                    "type": "select",
                                    "titleMap": [{
                                        "name": "JLG",
                                        "value": "JLG"
                                    }, {
                                        "name": "JEWEL",
                                        "value": "JEWEL"
                                    }, {
                                        "name": "SECURED",
                                        "value": "SECURED",
                                    }, {
                                        "name": "UNSECURED",
                                        "value": "UNSECURED",
                                    }]
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
                            'loanType':searchOptions.loanType,
                            'productCode': searchOptions.loan_product,
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
                                "<em>Disbursed Amount:  &#8377;"+((!item.disbursedAmount)?0:item.disbursedAmount)+", Disbursement Amount :  &#8377;"+item.disbursementAmount
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
