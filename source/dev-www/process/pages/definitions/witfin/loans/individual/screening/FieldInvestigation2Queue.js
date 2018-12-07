define({
    pageUID: "witfin.loans.individual.screening.FieldInvestigation2Queue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager", "IndividualLoan", "LoanBookingCommons"],
    $pageFn: function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, IndividualLoan, LoanBookingCommons) {
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
            "title": "FIELD_INVESTIGATION_QUEUE",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                // model.branch = branch;
				model.branch = SessionStore.getCurrentBranch().branchId;
                $log.info("search-list sample got initialized");
                // var centres = SessionStore.getCentres();
                // if (_.isArray(centres) && centres.length > 0) {
                //     model.centre = centres[0].centreName;
                //     model.centreCode = centres[0].centreCode;
                // }
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
                            "x-schema-form": {
                                "type": "userbranch",
                                "screenFilter": true
                            },
                            "readonly": true
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
                        "urn": {
                            "title": "URN",
                            "type": "string"
                        },
                        "area": {
                            "title": "AREA",
                            "type": "string"
                        },
                        "cityTownVillage": {
                            "title": "CITY_TOWN_VILLAGE",
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
                        'stage': 'FieldInvestigation2',
                        'branchId': searchOptions.branch,
                        'applicantName': searchOptions.applicantName,
                        'area': searchOptions.area,
                        'status': searchOptions.status,
                        'villageName': searchOptions.cityTownVillage,
                        'customerName': searchOptions.businessName,
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage,
                        'centreCode': searchOptions.centre,
                        'urn': searchOptions.urn

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
							title: 'BRANCH_NAME',
							data: 'branchName'
                        }, {
							title: 'CENTRE_NAME',
							data: 'centreName'
						} 
                    ]
                    },
                    getActions: function() {
                        return [{
                            name: "FIELD_INVESTIGATION_QUEUE",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                entityManager.setModel('witfin.loans.individual.screening.FieldInvestigation2', {
                                    _request: item
                                });
                                $state.go("Page.Bundle", {
                                    pageName: "witfin.loans.individual.screening.FieldInvestigation2",
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
