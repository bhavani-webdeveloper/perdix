irf.pageCollection.factory(irf.page("psychometric.Queue"), 
	["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager","IndividualLoan", "LoanBookingCommons",
	"Psychometric", "PsychometricTestService", "PageHelper", "irfSimpleModal", "Queries",
	function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, IndividualLoan, LoanBookingCommons,
		Psychometric, PsychometricTestService, PageHelper, irfSimpleModal, Queries) {
		var branch = SessionStore.getBranch();
		var centres = SessionStore.getCentres();
		var centreId=[];
		for (var i = 0; i < centres.length; i++) {
			centreId.push(centres[i].centreId);
		}

		var startPsychometricTest = function(participantId, applicationId) {
			PsychometricTestService.start(participantId, applicationId).then(function(resp) {
				PageHelper.showLoader();
				IndividualLoan.get({
					id: resp.applicationId
				}, function(reqData) {
					var allTestCompleted = true;
					if (_.isArray(reqData.loanCustomerRelations)) {
						for (i in reqData.loanCustomerRelations) {
							if (reqData.loanCustomerRelations[i].customerId == participantId) {
								reqData.loanCustomerRelations[i].psychometricCompleted = 'YES';
							}
							if (reqData.loanCustomerRelations[i].psychometricRequired == 'YES' && reqData.loanCustomerRelations[i].psychometricCompleted != 'YES') {
								allTestCompleted = false;
							}
						}
					}
					if (allTestCompleted) {
						reqData.psychometricCompleted = 'Completed';
					}
					IndividualLoan.update({
						loanProcessAction: 'SAVE',
						loanAccount: reqData
					}).$promise.then(function(loanResp){
						
					}, function(errResp){
						PageHelper.setErrors(errResp);
					}).finally(function(){
						$state.go('Page.Engine', {
							pageName: 'psychometric.Queue',
							pageId: null
						});
						PageHelper.hideLoader();
					});
				});
			}, function(errResp) {
				$log.error('Psychometric Test failed');
			});
		};

		var participantBodyHtml =
'<div ng-show="model.$showLoader" class="text-center">Loading...</div>'+
'<div ng-hide="model.$showLoader">'+
	'<table class="table table-striped">'+
		'<tr>'+
			'<th style="width: 10px">#</th> <th>Participant ID</th> <th>Participant Name</th> <th>Relationship</th> <th style="width: 40px">Test</th>'+
		'</tr>'+
		'<tr ng-repeat="r in model.loanCustomerRelations track by $index">'+
			'<td ng-bind="$index+1"></td>'+
			'<td ng-bind="r.customerId"></td>'+
			'<td ng-bind="r.customerName"></td>'+
			'<td ng-bind="r.relation"></td>'+
			'<td>'+
				'<button ng-show="r.psychometricRequired==\'YES\' && r.psychometricCompleted==\'NO\'" ng-click="$close([r.customerId, r.loanId]);" class="btn btn-sm btn-theme"><i class="fa fa-eye-slash">&nbsp;</i>Start</button>'+
				'<div ng-show="r.psychometricRequired==\'YES\' && r.psychometricCompleted==\'YES\'" class="text-center">Completed</div>'+
				'<div ng-show="r.psychometricRequired==\'NO\'" class="text-center text-gray">NA</div>'+
			'</td>'+
		'</tr>'+
	'</table>'+
'</div>'
;

		return {
			"type": "search-list",
			"title": "Psychometric Test",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.branch = branch;
				$log.info("psychometric.Queue got initialized");
			},
			definition: {
				title: "SEARCH",
				searchForm: [
					"*"
				],
				autoSearch: true,
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
	                    searchOptions.centreCodeForSearch = LoanBookingCommons.getCentreCodeFromId(searchOptions.centreCode, formHelper);
	                }
					return IndividualLoan.search({
	                    'stage': 'Application',
	                    'centreCode':centreId[0],
	                    'branchName':branch,
	                    'enterprisePincode':searchOptions.pincode,
	                    'applicantName':searchOptions.applicantName,
	                    'area':searchOptions.area,
	                    'status':searchOptions.status,
	                    'villageName':searchOptions.villageName,
	                    'customerName': searchOptions.businessName,
	                    'psychometric_completed': 'N',
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
							title: 'SCREENING_DATE',
							data: 'screeningDate'
						}, {
							title: 'APPLICANT_NAME',
							data: 'applicantName'
						},{
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
						}]
					},
					getActions: function() {
						return [{
							name: "List Participants",
							desc: "",
							icon: "fa fa-genderless", //fa-eye-slash
							fn: function(item, index) {
								var participantModel = {
									$showLoader: true
								};

								IndividualLoan.get({id: item.loanId}).$promise.then(function(loanAccount) {
									participantModel.loanCustomerRelations = loanAccount.loanCustomerRelations;
									if (_.isArray(participantModel.loanCustomerRelations)) {
										var ids = [];
										for (i in participantModel.loanCustomerRelations) {
											ids.push(participantModel.loanCustomerRelations[i].customerId);
										}
									}
									return Queries.getCustomerBasicDetails({ids:ids});
								}).then(function(basicDetails) {
									for (i in participantModel.loanCustomerRelations) {
										participantModel.loanCustomerRelations[i].customerName = basicDetails.ids[participantModel.loanCustomerRelations[i].customerId].first_name;
									}
								}).finally(function() {
									participantModel.$showLoader = false;
								});

								var modalInstance = irfSimpleModal('Choose a participant', participantBodyHtml, participantModel);
								modalInstance.result.then(function(result) {
									if (_.isArray(result) && result.length == 2) {
										startPsychometricTest(result[0], result[1]);
									}
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
]);