irf.pageCollection.factory(irf.page("loans.individual.booking.PendingVerificationQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "IndividualLoan", "entityManager", "LoanBookingCommons", "irfNavigator","$filter","irfProgressMessage","Locking",
function($log, formHelper, Enrollment, $state, SessionStore, $q, IndividualLoan, entityManager, LoanBookingCommons, irfNavigator, $filter,irfProgressMessage,Locking){
    return {
        "type": "search-list",
        "title": "LOAN_PENDING_VERIFICATION_QUEUE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
        
            model.stage = 'DocumentVerification';
            model.branch = SessionStore.getCurrentBranch().branchId;
            siteCode = SessionStore.getGlobalSetting('siteCode');
            console.log(model);
        },

        offline: false,
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
                
                return IndividualLoan.search({
                    'stage': 'DocumentVerification',
                    'branchId':searchOptions.branch,
                    'centreCode': searchOptions.centre,
                    'customerId': searchOptions.customerId,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage,
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
                expandable: true,
                itemCallback: function(item, index) {
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
                getActions: function(){
                    return [
                        {
                            name: "VERIFY_DOCUMENT",
                            desc: "",
                            fn: function(item, index){
                                Locking.findlocks({}, {}, function (resp, headers) {
                                    var i;
                                    for (i = 0; i < resp.body.length; i++) {
                                        if (item.loanId == resp.body[i].recordId) {
                                            var def = true;
                                        }
                                    }
                                    if (def) {
                                        irfProgressMessage.pop("Selected list", "File is Locked, Please unlock from AdminScreen", 4000);
                                    }
                                    else {
                                        if (siteCode == 'pahal') {
                                            entityManager.setModel('pahal.loans.individual.booking.DocumentVerification', {_queue:item});
                                            irfNavigator.go({
                                                state: 'Page.Engine', 
                                                pageName: 'pahal.loans.individual.booking.DocumentVerification', 
                                                pageId: item.loanId,
                                                pageData: item
                                            },
                                            {
                                                state: 'Page.Engine',
                                                pageName: "loans.individual.booking.PendingVerificationQueue"
                                            });   
                                        } else if (siteCode == 'witfin') {
                                            entityManager.setModel('witfin.loans.individual.booking.DocumentVerification', {_queue:item});
                                            irfNavigator.go({
                                                state: 'Page.Engine', 
                                                pageName: 'witfin.loans.individual.booking.DocumentVerification', 
                                                pageId: item.loanId,
                                                pageData: item
                                            },
                                            {
                                                state: 'Page.Engine',
                                                pageName: "loans.individual.booking.PendingVerificationQueue"
                                            });   
                                        } else {
                                            entityManager.setModel('loans.individual.booking.DocumentVerification', {_queue:item});
                                            irfNavigator.go({
                                                state: 'Page.Engine', 
                                                pageName: 'loans.individual.booking.DocumentVerification', 
                                                pageId: item.loanId
                                            },
                                            {
                                                state: 'Page.Engine',
                                                pageName: "loans.individual.booking.PendingVerificationQueue"
                                            }); 
                                        }
                                    }
                                }, function (resp) {
                                    $log.error(resp);
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
