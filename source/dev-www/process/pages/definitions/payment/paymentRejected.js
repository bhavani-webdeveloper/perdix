define({
    pageUID: "payment.paymentRejected",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager", "paymentRejected", "LoanBookingCommons"],
    $pageFn: function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, paymentRejected, LoanBookingCommons) {
        var branch = SessionStore.getBranch();
        var centres = SessionStore.getCentres();
        var centreId = [];
        if (centres && centres.length) {
            for (var i = 0; i < centres.length; i++) {
                centreId.push(centres[i].centreId);
            }
        }
        return {
            "type": "search-list",
            "title": "Payment_Rejected_Search",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.branch = branch;
                $log.info("search-list sample got initialized");
                var centres = SessionStore.getCentres();
                if (_.isArray(centres) && centres.length > 0) {
                    model.centre = centres[0].centreName;
                    model.centreCode = centres[0].centreCode;
                }
            },
            definition: {
                title: "SEARCH",
                searchForm: [
                    "*"
                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SEARCH_OPTIONS',
                    "properties": {
                        "debitAccountName": {
                            "title": "DebitAccountName",
                            "type": "string",
                            "required": true,
                            "x-schema-form": {
                                type: "lov",
                                autolov: true,
                                bindMap: {},
                                searchHelper: formHelper,
                                lovonly: true,
                                search: function(inputModel, form, model) {
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": [].length
                                        },
                                        body: []
                                    });
                                },
                                getListDisplayItem: function(item, index) {
                                    return [];
                                },
                                onSelect: function(result, model, context) {
                                    
                                }
                            }
                        },
                        "paymentDate": {
                            "title": "Payment_Date",
                            "type": "string"
                        },
                        "branchName": {
                            "title": "Branch_Name",
                            "type": "string"
                        },
                        "spokeName": {
                            "title": "Spoke_Name",
                            "type": "string"
                        },
                        "beneficiaryName": {
                            "title": "Beneficiary_Name",
                            "type": "string"
                        },
                        "paymentType": {
                            "type": "string",
                            "title": "Payment_Type",
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                        "paymentMode": {
                            "type": "string",
                            "title": "Payment_Mode",
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                        "paymentPurpose": {
                            "type": "string",
                            "title": "Payment_Purpose",
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                    },
                    "required": []
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    return paymentRejected.getSchema().$promise;
                },
                paginationOptions: {
                    "getItemsPerPage": function(response, headers) {
                        return 100;
                    },
                    "getTotalItemsCount": function(response, headers) {
                        return headers['x-total-count']
                    }
                },
                listOptions: {
                    selectable: false,
                    expandable: true,
                    listStyle: "table",
                    itemCallback: function(item, index) {},
                    getItems: function(response, headers) {
                        if (response != null && response.length && response.length != 0) {
                            return response;
                        }
                        return [];
                    },
                    getListItem: function(item) {
                        return [
                            item.payment_date,
                            item.branch,
                            item.spoke,
                            item.type,
                            item.payment_mode,
                            item.payment_purpose,
                            item.account_name,
                            item.b_name,
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
                            title: 'Payment_Date',
                            data: 'payment_date'
                        }, {
                            title: 'Branch',
                            data: 'branch'
                        }, {
                            title: 'Spoke',
                            data: 'spoke'
                        }, {
                            title: 'Payment_Type',
                            data: 'type'
                        }, {
                            title: 'Payment_Mode',
                            data: 'payment_mode'
                        }, {
                            title: 'Payment_Purpose',
                            data: 'payment_purpose'
                        }, {
                            title: 'Debit_Account_Name',
                            data: 'account_name'
                        }, {
                            title: 'Beneficiary_Name',
                            data: 'b_name'
                        }]
                    },
                    getActions: function() {
                        return [                           {
                                    name: "ViewDetails",
                                    desc: "",
                                    icon: "fa fa-pencil",
                                    fn: function(item, model){
                                        irfNavigator.go({
                                            state: "Page.Engine",
                                            pageName: "payment.PaymentInitiation",
                                            pageId: item.id,
                                        });
                                    },
                                    isApplicable: function(item, model){
                                         return true;
                                    }
                                },
                                                                 {
                                    name: "Payment_Reinitiated",
                                    desc: "",
                                    icon: "fa fa-pencil",
                                    fn: function(item, model){
                                        irfNavigator.go({
                                            state: "Page.Engine",
                                            pageName: "payment.PaymentInitiation",
                                            pageId: item.id,
                                        });
                                    },
                                    isApplicable: function(item, model){
                                         return true;
                                    }
                                }];
                    }
                }
            }
        };
    }
});
