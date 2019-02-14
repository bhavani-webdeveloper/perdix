irf.pageCollection.factory(irf.page("shramsarathi.dashboard.loans.individual.disbursement.DisbursementConfirmationQueue"),
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

                            'branch': {
                                'title': "BRANCH",
                                "type": ["string", "null"],
                                "x-schema-form": {
                                    "type": "userbranch",
                                    "screenFilter": true
                                }
                            },
                            "centre": {
                                "title": "ZONE",
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
                                "<em>Disbursed Amount:  &#8377;" + ((!item.disbursedAmount) ? 0 : item.disbursedAmount) + ", Disbursement Amount :  &#8377;" + item.disbursementAmount
                                +", Scheduled Disbursement Date :" + ((!item.scheduledDisbursementDate) ? " NA " : item.scheduledDisbursementDate) + "</em>"
                            ]
                        },
                        getActions: function () {
                            return [
                                {
                                    name: "Confirm Disbursement",
                                    desc: "",
                                    fn: function (item, index) {
                                        entityManager.setModel('shramsarathi.dashboard.loans.individual.disbursement.DisbursementConfirmation', { _disbursementConfirmation: item });
                                                $state.go("Page.Engine", {
                                                    pageName: "shramsarathi.dashboard.loans.individual.disbursement.DisbursementConfirmation",
                                                    pageId: [item.loanId, item.id].join(".")
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
