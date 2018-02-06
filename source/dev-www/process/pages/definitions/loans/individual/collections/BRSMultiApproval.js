define({
    pageUID: "loans.individual.collections.BRSMultiApproval",
    pageType: "Engine",
    dependencies: ["$log", "LoanCollection", "SessionStore", "PageHelper", "formHelper", "RolesPages", "Utils", "translateFilter", "$state", "Queries"],
    $pageFn: function ($log, LoanCollection, SessionStore, PageHelper, formHelper, RolesPages, Utils, translateFilter, $state, Queries) {
        var branch = SessionStore.getBranch();
        var localFormCtrl;
        return {
            "type": "search-list",
            "title": "BRS_MULTI_APPROVAL",
             initialize: function (model, form, formCtrl) {
                // loadBRSRecords(model);
                localFormCtrl = formCtrl;
                model.mainPartner = SessionStore.getGlobalSetting("mainPartner");
            },
            definition: {
                "title": "BRS_MULTI_APPROVAL",
                searchForm: [
                    {
                        key: "bankAccountNumber",
                        type: "lov",
                        autolov: true,
                        title: "ACCOUNT_NUMBER",
                        required: true,
                        bindMap: {},
                        outputMap: {
                            "account_number": "bankAccountNumber"
                        },
                        searchHelper: formHelper,
                        search: function (inputModel, form, model) {
                            return Queries.getBankAccountsByPartnerForLoanRepay(model.mainPartner);
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.account_number,
                                item.ifsc_code + ', ' + item.bank_name,
                                item.branch_name
                            ];
                        },
                        onSelect: function (valueObj, model, context) {
                            //loadBRSRecords(model);
                            model.bankAccountGLCode = valueObj.account_code;
                            setTimeout(function(){
                                localFormCtrl.submit();
                            });
                            
                        }
                    },
                    {
                        "key": "bankAccountGLCode",
                        "type": "string",
                        "title": "GL_CODE"
                    }

                ], 
                autoSearch: false,
               
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        "bankAccountNumber": {
                            "title": "ACCOUNT_NUMBER",
                            "type": ["string"]
                            // "x-schema-form": {
                            //     "type": "select"
                            // }
                        },
                        "bankAccountGLCode": {
                            "title": "GL_CODE",
                            "type": "string"
                        },
                    }
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) { 
                    var promise = LoanCollection.findDepositSummaries({
                        'currentStage': "BRSValidation",
                        'bankAccountNumber': searchOptions.bankAccountNumber,
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage
                    }).$promise;
                    return promise;
                },
                paginationOptions: {
                    "getItemsPerPage": function(response, headers) {
                        return 20;
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
                        return [];
                    },
                    getTableConfig: function() {
                        return {
                            "serverPaginate": true,
                            "paginate": false,
                            //"pageLength": 50
                        };
                    },
                    getColumns: function () {
                        return [
                            {
                                "title": "Date",
                                "data": "depositedOn"
                            },
                            {
                                "title": "Reference",
                                "data": "reference"
                            },
                            {
                                "title": "Amount",
                                "data": "amount"
                            },
                            {
                                "title": "Instrument Type",
                                "data": "instrumentType"
                            },
                            {
                                "title": "Deposited BY",
                                "data": "depositedby"
                            },
                            {
                                "title": "Deposited Branch",
                                "data": "bankBranchDetails"
                            }
                        ]
                    },
                    getActions: function() {
                        return [];
                    },
                    getBulkActions: function() {
                        return [{
                                name: "Submit",
                                fn: function(items) {
                                    if(items.length==0){
                                        PageHelper.showProgress("bulk-process","Atleast one record should be selected",5000);
                                        return false;
                                    }
                                    Utils.confirm("Do you wish to Process the selected records?").then(function(){
                                        var temp = [];
                                        for (var i = items.length - 1; i >= 0; i--) {
                                            var item = items[i]
                                            if (item.$selected) {
                                                temp.push(item);
                                            }
                                        }
                                        ;

                                        var reqData = {"loanCollectionSummaryDTOs": temp};
                                        if (items.length >= 1) {

                                            PageHelper.showLoader();
                                            PageHelper.showProgress("brs-update", "Working");
                                            reqData.repaymentProcessAction = "PROCEED";
                                            LoanCollection.batchUpdate(reqData, function (resp, header) {
                                                PageHelper.showProgress("brs-update", "Done", 5000);
                                                localFormCtrl.submit();
                                            }, function (resp) {
                                                PageHelper.showProgress("brs-update", "Failed.");
                                                PageHelper.showErrors(resp);
                                            }).$promise.finally(function () {
                                                PageHelper.hideLoader();
                                            });
                                        }
                                    });
                                },
                                isApplicable: function(items) {
                                    return true;
                                }
                            },
                            {
                                name: "Reject",
                                fn: function(items) {
                                    var temp = [];
                                    var instrument = null;
                                    if(items.length==0){
                                        PageHelper.showProgress("bulk-process","Atleast one record should be selected",5000);
                                        return false;
                                    }
                                    for (var i = items.length - 1; i >= 0; i--) {
                                        var item = items[i]
                                        if (item.$selected) {
                                            temp.push(item);
                                            instrument = item.instrumentType;
                                        }
                                    };

                                    if (temp.length > 1 ) {
                                        PageHelper.showProgress("brs-reject", "Only 1 entry can be rejected at a time.", 5000);
                                        return;
                                    }

                                    var reqData = { "loanCollectionSummaryDTOs": temp };

                                    if (instrument == 'CASH') {
                                        reqData.stage = 'Deposit';
                                    } else {
                                        reqData.stage = 'Rejected';
                                    }

                                    Utils.confirm("Are You Sure?")
                                        .then(function() {
                                        PageHelper.showLoader();
                                        PageHelper.showProgress("brs-reject", "Working");
                                        reqData.repaymentProcessAction = "PROCEED";
                                        LoanCollection.batchUpdate(reqData, function(resp, header) {
                                            PageHelper.showProgress("brs-reject", "Done", 5000);
                                            localFormCtrl.submit();
                                        }, function(resp) {
                                            PageHelper.showProgress("brs-reject", "Failed.");
                                            PageHelper.showErrors(resp);
                                        }).$promise.finally(function() {
                                            PageHelper.hideLoader();
                                        });
                                    });
                                },
                                isApplicable: function(items) {
                                    return true;
                                }
                            }
                        ];
                    }
                }
            }
        }
    }
})
