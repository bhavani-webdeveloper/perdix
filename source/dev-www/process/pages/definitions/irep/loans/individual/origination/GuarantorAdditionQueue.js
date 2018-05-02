define({
	pageUID: "irep.loans.individual.origination.GuarantorAdditionQueue", 
	pageType: "Engine",
	dependencies: ["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager","IndividualLoan", "LoanBookingCommons", "irfNavigator"],
	$pageFn: function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, IndividualLoan, LoanBookingCommons, irfNavigator) {
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
			"title": "IREP_GUARANTOR_ADDITION_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.branch = branch;
				$log.info("search-list sample got initialized");
				var centres = SessionStore.getCentres();
				if (_.isArray(centres) && centres.length > 0){
					model.centre = centres[0].centreName;
					model.centreCode = centres[0].centreCode;
				}
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
						"centre": {
							"title": "CENTRE",
							"type": "string",
							"required": true,
							"x-schema-form": {
								type: "lov",
	                            autolov: true,
	                            bindMap: {},
	                            searchHelper: formHelper,
	                            lovonly: true,
	                            search: function(inputModel, form, model, context) {
	                                var centres = SessionStore.getCentres();
	                                var centreCode = formHelper.enum('centre').data;
	                                var out = [];
	                                if (centres && centres.length) {
	                                    for (var i = 0; i < centreCode.length; i++) {
	                                        for (var j = 0; j < centres.length; j++) {
	                                            if (centreCode[i].value == centres[j].id) {
	                                                out.push({
	                                                    name: centreCode[i].name,
	                                                    value:centreCode[i].code
	                                                })
	                                            }
	                                        }
	                                    }
	                                }
	                                return $q.resolve({
	                                    headers: {
	                                        "x-total-count": out.length
	                                    },
	                                    body: out
	                                });
	                            },
	                            onSelect: function(valueObj, model, context) {
	                                model.centre = valueObj.name;
	                                model.centreCode = valueObj.value;
	                            },
	                            getListDisplayItem: function(item, index) {
	                                return [
	                                    item.name
	                                ];
	                            }
							}
						},
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
	                    "pincode": {
	                        "title": "PINCODE",
	                        "type": "string",
	                       
	                    },
	                     "status": 
	                    {
                            "type":"string",
                            "title":"STATUS",
                            "enumCode": "origination_status",
                            "x-schema-form": {
                            	"type": "select"
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
	                    searchOptions.centreCodeForSearch = LoanBookingCommons.getCentreCodeFromId(searchOptions.centre, formHelper);
	                }
					return IndividualLoan.search({
	                    'stage': 'GuarantorAddition',
	                    'centreCode':searchOptions.centreCode,
	                    'branchName':branch,
	                    'enterprisePincode':searchOptions.pincode,
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
							item.customerName,
							item.area,
							item.villageName,
							item.enterprisePincode
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
                            data: 'id'
                        },{
							title: 'SCREENING_DATE',
							data: 'screeningDate'
						}, {
							title: 'APPLICANT_NAME',
							data: 'applicantName'
						},{
							title: 'BUSINESS_NAME',
							data: 'customerName'
						},{
							title: 'Loan Amount',
							data: 'loanAmount'
						}, {
							title: 'AREA',
							data: 'area'
						}, {
							title: 'CITY_TOWN_VILLAGE',
							data: 'villageName'
						}, {
							title: 'PIN_CODE',
							data: 'enterprisePincode'
						}]
					},
					getActions: function() {
						return [{
							name: "IREP_GUARANTOR_ADDITION",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								entityManager.setModel('irep.loans.individual.origination.GuarantorAddition', {
									_request: item
								});
								$state.go("Page.Bundle", {
									pageName: "irep.loans.individual.origination.GuarantorAddition",
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