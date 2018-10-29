define({
    pageUID: "pahal.loans.individual.screening.TeleVerification1Queue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager", "IndividualLoan", "LoanBookingCommons"],
    $pageFn: function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, IndividualLoan, LoanBookingCommons) {
        var branch = SessionStore.getBranch();
        return {
            "type": "search-list",
            "title": "TELE_VERIFICATION_QUEUE",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                // model.branch = branch;
                model.branchId = SessionStore.getCurrentBranch().branchId;
                $log.info("search-list sample got initialized");
            },
            definition: {
                title: "SEARCH_LOAN",
                searchForm: [
                    "*"
                ],
                // autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SEARCH_OPTIONS',
                    "properties": {
                        "applicantName": {
                            "title": "APPLICANT_NAME",
                            "type": "string"
                        },
                        "businessName": {
                            "title": "BUSINESS_NAME",
                            "type": "string"
                        },
                        'branch': {
                            'title': "BRANCH",
                            "type": ["string", "null"],
                            "enumCode": "branch",
                            "x-schema-form": {
                                "type": "select",
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
                                "parentValueExpr": "model.branchId",
                                "screenFilter": true
                            }
                        },
                        "customerId": {
                            "title": "CUSTOMER_ID",
                            "type": "string"
                        },
                        "area": {
                            "title": "AREA",
                            "type": "string"
                        },
                        "cityTownVillage": {
                            "title": "CITY_TOWN_VILLAGE",
                            "type": "string"
                        },
                        "pincode": {
                            "title": "PIN_CODE",
                            "type": "string"
                        }
                    },
                    "required": []
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    if (_.hasIn(searchOptions, 'centreCode')) {
                        searchOptions.centreCodeForSearch = LoanBookingCommons.getCentreCodeFromId(searchOptions.centre, formHelper);
                    }
                    return IndividualLoan.search({
                        'stage': 'TeleVerification1',
                        'branchName': searchOptions.branch,
                        'enterprisePincode': searchOptions.pincode,
                        'enterprisePincode': searchOptions.pincode,
                        'applicantName': searchOptions.applicantName,
                        'area': searchOptions.area,
                        'status': searchOptions.status,
                        'villageName': searchOptions.villageName,
                        'customerName': searchOptions.businessName,
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage,
                        'centreCode': searchOptions.centre

                    }).$promise;
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
                            item.screeningDate,
                            item.applicantName,
                            item.customerName,
                            item.area,
                            item.villageName,
                            item.enterprisePincode,
                            item.branchName,
                            item.centreName
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
                            title: 'ID',
                            data: 'loanId'
                        }, {
                            title: 'SCREENING_DATE',
                            data: 'screeningDate'
                        }, {
                            title: 'APPLICANT_NAME',
                            data: 'applicantName'
                        }, {
                            title: 'BUSINESS_NAME',
                            data: 'customerName'
                        }, {
                            title: 'AREA',
                            data: 'area'
                        }, {
                            title: 'CITY_TOWN_VILLAGE',
                            data: 'villageName'
                        }, {
                            title: 'PIN_CODE',
                            data: 'enterprisePincode'
                        },{
                            title: 'BRANCH_NAME',
                            data: 'branchName'
                        },{
                            title: 'CENTRE_NAME',
                            data: 'centreName'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "TELE_VERIFICATION_QUEUE",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                entityManager.setModel('pahal.loans.individual.screening.TeleVerification2', {
                                    _request: item
                                });
                                $state.go("Page.Bundle", {
                                    pageName: "pahal.loans.individual.screening.TeleVerification2",
                                    pageId: item.loanId
                                });
                            },
                            isApplicable: function(item, index) {

                                return true;
                            }
                        }];
                    }
                }
            }
        };
    }
});