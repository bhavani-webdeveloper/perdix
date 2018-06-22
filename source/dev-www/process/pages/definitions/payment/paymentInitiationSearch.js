define({
    pageUID: "payment.paymentInitiationSearch",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager", "Payment", "LoanBookingCommons"],
    $pageFn: function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, Payment, LoanBookingCommons) {
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
            "title": "PAYMENT_INITIATION_SEARCH",
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
                title: "PAYMENT_INITIATION_SEARCH",

                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                   
                    var promise = Payment.search({
                        'id': searchOptions.id,
                        'debitAccountName': searchOptions.debitAccountName,
                        'transactionType': searchOptions.transactionType,
                        'currentStage':"PaymentInitiation",
                    }).$promise;

                   
                    return promise;
                        
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
                    selectable: true,
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
                        return [item.id, item.debitAccountName, item.transactionType];
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
                            title: 'PAYMENT_ID',
                            data: 'id'
                        }, {
                            title: 'DEBIT_ACCOUNT_NAME',
                            data: 'debitAccountName'
                        },{
                            title: 'PAYMENT_TYPE',
                            data: 'transactionType'
                        }];
                    },
                    getActions: function() {
                        return [{
                            name: "EDIT_PAYMENT_INITIATION",
                            desc: "",
                            icon: "fa fa-user",
                            fn: function(item, index){
                                $state.go("Page.Engine", {
                                    pageName: "payment.PaymentInitiation",
                                    pageId: item.id,
                                    pageData: item
                                });
                            },
                            isApplicable: function(item, index){
                                    return true;
                            }
                        }];
                    }
                }
            }
        };
    }
});
