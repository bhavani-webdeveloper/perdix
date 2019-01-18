define({
     pageUID: "witfin.loans.individual.screening.vehiclevaluation.ReassignVehicleValuationQueue",
    pageType: "Engine",
    dependencies: ["Queries","$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager","IndividualLoan", "LoanBookingCommons"],
    $pageFn: function(Queries,$log, formHelper, $state, $q, SessionStore, Utils, entityManager, IndividualLoan, LoanBookingCommons) {
        var branch = SessionStore.getBranch();
        var centres = SessionStore.getCentres();
        var centreId=[];
        if (centres && centres.length) {
            for (var i = 0; i < centres.length; i++) {
                centreId.push(centres[i].centreId);
            }
        }
        return {
            "type": "search-list",
            "title": "VEHICLE_VALUATION_QUEUE",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                // model.branch = branch;
                $log.info("search-list sample got initialized");

            },
            definition: {
                title: "SEARCH_LOAN",
                searchForm: [
                    "*"
                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SEARCH_OPTIONS',
                    "properties": {
                        'branch': {
                            'title': "BRANCH",
                            "type": ["string", "null"],
                            "enumCode": "branch",
                            "x-schema-form": {
                                "type": "select",
                                "screenFilter": true
                            }
                        }
                    },
                    "required": []
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    if (_.hasIn(searchOptions, 'centreCode')){
                        searchOptions.centreCodeForSearch = LoanBookingCommons.getCentreCodeFromId(searchOptions.centreCode, formHelper);
                    }
 
                    return Queries.searchReAssignment(searchOptions.branch);

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
                            /*item.area,
                            item.villageName,
                            item.enterprisePincode*/
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
                            title: 'SCREENING_DATE',
                            data: 'screeningDate'
                        }, {
                            title: 'APPLICANT_NAME',
                            data: 'applicantName'
                        },{
                            title: 'BUSINESS_NAME',
                            data: 'customerName'
                        }, /*{
                            title: 'AREA',
                            data: 'area'
                        }, {
                            title: 'CITY_TOWN_VILLAGE',
                            data: 'villageName'
                        }, {
                            title: 'PIN_CODE',
                            data: 'enterprisePincode'
                        }*/{
                            title: 'BRANCH_NAME',
                            data: 'branchName'
                        }, {
                            title: 'CENTRE_NAME',
                            data: 'centreName'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "VEHICLE_VALUATION",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                entityManager.setModel('witfin.loans.individual.screening.vehiclevaluation.ReassignVehicleValuation', {
                                    _request: item
                                });
                                $state.go("Page.Engine", {
                                    pageName: "witfin.loans.individual.screening.vehiclevaluation.ReassignVehicleValuation",
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
})

