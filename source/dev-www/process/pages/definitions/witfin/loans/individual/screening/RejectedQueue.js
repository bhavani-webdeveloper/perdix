define({
    pageUID: "witfin.loans.individual.screening.RejectedQueue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager","IndividualLoan", "LoanBookingCommons"],
    $pageFn: function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, IndividualLoan, LoanBookingCommons) {
        var branch = SessionStore.getBranch();
        var centres = SessionStore.getCentres();
        var centreId=[];
        for (var i = 0; i < centres.length; i++) {
            centreId.push(centres[i].centreId);
        }
        return {
            "type": "search-list",
            "title": "REJECTED_QUEUE",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.branch = branch;
                $log.info("search-list sample got initialized");
            },
            definition: {
                title: "SEARCH_LOAN",
                searchForm: [
                    "*"
                ],
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
                        "screeningDate":
                        {
                            "title": "SCREENING_DATE",
                            "type": "string",
                            "x-schema-form": {
                                "type": "date"
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
                    return IndividualLoan.search({
                        'stage': 'Rejected',
                        'centreCode':centreId[0],
                        'branchName':branch,
                        'screeningDate':searchOptions.screeningDate,
                        'applicantName':searchOptions.applicantName,
                        'area':searchOptions.area,
                        'status':searchOptions.status,
                        'villageName':searchOptions.villageName,
                        'customerName': searchOptions.businessName,
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage,
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
                            item.area,
                            item.villageName
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
                        },{
                            title: 'ID',
                            data: 'id'
                        }, {
                            title: 'SCREENING_DATE',
                            data: 'screeningDate'
                        }, {
                            title: 'APPLICANT_NAME',
                            data: 'applicantName'
                        }, {
                            title: 'AREA',
                            data: 'area'
                        }, {
                            title: 'CITY_TOWN_VILLAGE',
                            data: 'villageName'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "REJECTED",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                entityManager.setModel('loan.Rejected', {
                                    _request: item
                                });
                                $state.go("Page.Bundle", {
                                    pageName: "witfin.loans.individual.screening.Rejected",
                                    pageId: item.id
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
