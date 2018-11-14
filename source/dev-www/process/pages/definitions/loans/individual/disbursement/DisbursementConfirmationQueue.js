irf.pageCollection.factory(irf.page("loans.individual.disbursement.DisbursementConfirmationQueue"),
    ["$log", "formHelper", "$state", "SessionStore", "$q", "IndividualLoan", "entityManager","irfProgressMessage","Locking",
        function ($log, formHelper, $state, SessionStore, $q, IndividualLoan, entityManager,irfProgressMessage,Locking) {
            return {
                "type": "search-list",
                "title": "DISBURSEMENT_CONFIRMATION_QUEUE",
                "subTitle": "",
                "uri": "Loan Disbursement/Ready",
                initialize: function (model, form, formCtrl) {

                    model.branchName = SessionStore.getBranch();
                    model.branch = SessionStore.getCurrentBranch().branchId;

                    model.stage = 'DisbursementConfirmation';
                    console.log(model);
                },
                offline: false,
                definition: {
                    title: "ReadyForDisbursement",
                    autoSearch: true,
                    sorting: true,
                    sortByColumns: {
                        "customerSignatureDate": "Customer Signature Date",
                        "scheduledDisbursementDate": "Scheduled Disbursement Date"

                    },
                    searchForm: [
                        "*"
                    ],
                    searchSchema: {
                        "type": 'object',
                        "title": "VIEW_LOANS",
                        "required": [],
                        "properties": {

                            // "customerSignatureDate": {
                            //     "title": "CUSTOMER_SIGNATURE_DATE",
                            //     "type": "string",
                            //     "x-schema-form": {
                            //         "type": "date"

                            //     }
                            // },
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

                            "scheduledDisbursementDate": {
                                "title": "SCHEDULED_DISBURSEMENT_DATE",
                                "type": "string",
                                "x-schema-form": {
                                    "type": "date"
                                }
                            }
                        }
                    },
                    getSearchFormHelper: function () {
                        return formHelper;
                    },
                    getResultsPromise: function (searchOptions, pageOpts) {
                        return IndividualLoan.searchDisbursement({
                            'currentStage': 'DisbursementConfirmation',
                            'branchId': searchOptions.branch,
                            'centreId': searchOptions.centre,
                            'customerSignatureDate': searchOptions.customerSignatureDate,
                            'scheduledDisbursementDate': searchOptions.scheduledDisbursementDate,
                            'page': pageOpts.pageNo,
                            'per_page': pageOpts.itemsPerPage,
                            'sortBy': searchOptions.sortBy

                        }).$promise;

                    },
                    paginationOptions: {
                        "viewMode": "page",
                        "getItemsPerPage": function (response, headers) {
                            return 20;
                        },
                        "getTotalItemsCount": function (response, headers) {
                            return headers['x-total-count']
                        }
                    },
                    listOptions: {
                        itemCallback: function (item, index) {
                            $log.info(item);

                        },
                        getItems: function (response, headers) {
                            if (response != null && response.length && response.length != 0) {
                                return response;
                            }
                            return [];
                        },
                        getListItem: function (item) {
                            return [
                                item.customerName + " ( Account #: " + item.accountNumber + ")",
                                "<em>Disbursed Amount:  &#8377;" + (_.isEmpty(item.disbursedAmount) ? 0 : item.disbursedAmount) + ", Disbursement Amount :  &#8377;" + item.disbursementAmount + "</em>",
                                "Customer Signature Date  : " + (_.isEmpty(item.customerSignatureDate) ? " NA " : item.customerSignatureDate) + ", Scheduled Disbursement Date :" + (_.isEmpty(item.scheduledDisbursementDate) ? " NA " : item.scheduledDisbursementDate)
                            ]
                        },
                        getActions: function () {
                            return [
                                {
                                    name: "Confirm Disbursement",
                                    desc: "",
                                    fn: function (item, index) {
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
                                                entityManager.setModel('loans.individual.disbursement.DisbursementConfirmation', { _disbursementConfirmation: item });
                                                $state.go("Page.Engine", {
                                                    pageName: "loans.individual.disbursement.DisbursementConfirmation",
                                                    pageId: [item.loanId, item.id].join(".")
                                                });
                                            }
                                        }, function (resp) {
                                            $log.error(resp);
                                        });
                                    },
                                    isApplicable: function (item, index) {
                                        return true;
                                    }
                                }
                            ];
                        }
                    }
                }
            };
        }]);
