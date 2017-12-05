define({
    pageUID: "witfin.lead.ReadyForScreeningQueue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "Lead", "$state", "$q", "SessionStore", "Utils", "entityManager"],

    $pageFn: function($log, formHelper, Lead, $state, $q, SessionStore, Utils, entityManager) {

		var branch = SessionStore.getBranch();
		var centres = SessionStore.getCentres();
		var centreName = [];

		var siteCode = SessionStore.getGlobalSetting('siteCode');

		if(centres && centres.length)
		{
		for (var i = 0; i < centres.length; i++) {
			centreName.push(centres[i].centreName);
		}
		}

		/*var branches = formHelper.enum('branch_id').data;
					var centres = formHelper.enum('centre').data;
					var branchCode;
					var centreName =[];
					for (var i = 0; i < branches.length; i++) {
						if (branches[i].name== branch)
							branchCode = branches[i].code;
						    $log.info(branchCode);
					}
					for (var i = 0; i < centres.length; i++) {
						if ((centres[i].parentCode) == branchCode) {
							centreName.push(centres[i].name);
						}
					}
*/
		return {
			"type": "search-list",
			"title": siteCode == 'sambandh' || siteCode == 'saija' ? "READY_FOR_ENROLLMENT" :"READY_FOR_SCREENING",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.branch = branch;
				$log.info("search-list sample got initialized");
				var branchId = SessionStore.getBranchId();
				var branchName = SessionStore.getBranch();
				model.branchName = SessionStore.getCurrentBranch().branchName;
				var centres = SessionStore.getCentres();
				if (_.isArray(centres) && centres.length > 0){
					model.centre = centres[0].centreName;
				}
			},
			definition: {
				title: "SEARCH_LEAD",
				searchForm: [
					 "*"
				],
				// autoSearch: true,
				searchSchema: {
					"type": 'object',
					"title": 'SEARCH_OPTIONS',
					"properties": {
						"leadName": {
							"title": "LEAD_NAME",
							"type": "string"
						},
						"businessName": {
							"title": "BUSINESS_NAME",
							"type": "string"
						},
						"area": {
							"title": "AREA",
							"type": "string"
						},
						"cityTownVillage": {
							"title": "CITY/_TOWN_VILLAGE",
							"type": "string"
						},
						"screeningDate": {
							"title": "SCREENING_DATE",
							"type": "string",
							"x-schema-form": {
								"type": "date",
								"screenFilter": true
							}
						},
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
	                                                    id:centreCode[i].value
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
	                            },
	                            getListDisplayItem: function(item, index) {
	                                return [
	                                    item.name
	                                ];
	                            }
							}
						}
					},
					"required": []
				},
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {
					var promise = Lead.search({
						'branchName': searchOptions.branchName,
						'currentStage': "ReadyForScreening",
						'leadName': searchOptions.leadName,
						'businessName': searchOptions.businessName,
						'page': pageOpts.pageNo,
						'per_page': pageOpts.itemsPerPage,
						'area': searchOptions.area,
						'cityTownVillage': searchOptions.cityTownVillage,
						'centreName': searchOptions.centre
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
							item.leadId,
							item.leadName,
							item.businessName,
							item.branchName,
							item.addressLine1,
							item.cityTownVillage,
							item.pincode,
							item.mobileNo
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
						}, {
							title: 'Lead Name',
							data: 'leadName'
						}, {
							title: 'Business Name',
							data: 'businessName'
						}, {
							title: 'Lead Status',
							data: 'leadStatus'
						},{
							title: 'Screening Date',
							data: 'screeningDate'
						}, {
							title: 'Address Line1',
							data: 'addressLine1'
						}, {
							title: 'CityTownVillage',
							data: 'cityTownVillage'
						}, {
							title: 'Pincode',
							data: 'pincode'
						}]
					},
					getActions: function() {
						return [{
							name: "Do Screening",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								entityManager.setModel('lead.LeadGeneration', {
									_request: item
								});
								$state.go("Page.Bundle", {
									pageName: "witfin.loans.individual.screening.ScreeningInput",
									pageData: {
										lead_id: item.id
									}
								});
							},
							isApplicable: function(item, index) {
								return siteCode !== 'sambandh' && siteCode !== 'saija' ? true : false;
							}
						},
						{
							name: "DO_ENROLLMENT",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								entityManager.setModel('witfin.lead.LeadGeneration', {
									_request: item
								});
								$state.go("Page.Engine", {
									pageName: "witfin.customer.IndividualEnrollment2",
									pageData: {
										lead_id: item.id
									}
								});
							},
							isApplicable: function(item, index) {
								return siteCode == 'sambandh' || siteCode == 'saija' ? true : false;
							}
						},
						{
							name: "reject Lead",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								entityManager.setModel('witfin.lead.LeadReject', {
									_request: item
								});
								$state.go("Page.Engine", {
									pageName: "witfin.lead.LeadReject",
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
});
