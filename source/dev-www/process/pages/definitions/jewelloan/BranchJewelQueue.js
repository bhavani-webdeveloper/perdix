irf.pageCollection.factory(irf.page("jewelloan.BranchJewelQueue"),
 ["$log", "formHelper","PageHelper", "JewelLoan", "$q", "SessionStore","irfNavigator","irfProgressMessage",
	function($log, formHelper,PageHelper, JewelLoan,$q, SessionStore,irfNavigator,irfProgressMessage) {
		
		var branch = SessionStore.getBranch();
		var transitStatusValue = true ;
		
		return {
			"type": "search-list",
			"title": "BRANCH_JEWEL_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.originBranch = branch;
				model.jewelloan = model.jewelloan || {};
				$log.info("search-list sample got initialized");
			},
			definition: {
				title: "SEARCH_JEWEL_POUCH",
				searchForm: [
					"*"
				],
				autoSearch:false,
				searchSchema: {
					"type": 'object',
					"title": 'searchOptions',
					"properties": {
						"fromDate": {
							 "title": "FROM_DATE",
							 "type" : "string",
							  "x-schema-form": {
							       "type": "date",
							       "screenFilter": true,
							         			}
							        },
						"toDate": {
							"title": "TO_DATE",
							"type" : "string",
							"x-schema-form": {
								    "type": "date", 
								    "screenFilter": true,
								            },
								},
						"urnNo": {
							"type": ["string","null"],
							"title": "URN_NO"
								},
						"accountNo":{
							"type": ["string","null"],
							"title": "ACCOUNT_NUMBER"
						},  
						"transitStatus":{
							"title":"TRANSIT_STATUS",
							"type": ["string","null"],
							"x-schema-form": {
								"type": "select",
								"screenFilter": true,
								"titleMap":{
									"SOURCE"			: "Source",
									"PENDING_TRANSIT"   : "Pending Transit",
									"IN_TRANSIT"		: "In Transit",
									"DESTINATION"		: "Destination",
									"RETURN_REQUESTED"	: "Return Request"	
								}
                            }
						} 
					},
					"required": ["transitStatus"]
				},
				
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {
					transitStatusValue = typeof searchOptions.transitStatus != 'undefined' ? (searchOptions.transitStatus.toLowerCase() == 'source' || searchOptions.transitStatus.toLowerCase() == 'destination') ? true: false:false;
					var promise = JewelLoan.search({
						'sourceBranch'			: branch,
						'currentStage'			: "JewelLoanSummary",
						'fromDate'				: searchOptions.fromDate,
						'toDate'				: searchOptions.toDate,
						'urnNo'					: searchOptions.urnNo,
						'accountNo'				: searchOptions.accountNo,
						'transitStatus'			: searchOptions.transitStatus,
						'page'					: pageOpts.pageNo,
						'per_page'				: pageOpts.itemsPerPage,
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
					selectable: true,
					expandable: true,
					listStyle: "table",
					itemCallback: function(item, index) {},
					getItems: function(response, headers) {
						if (response != null && response.length && response.length != 0) {
							for (var i=0;i<response.length;i++){
								response[i].customerFullName = response[i].customerFirstName + " "+response[i].customerLastName;
								}
							return response;
						}
						return [];
					},
					getListItem: function(item) {
						return [
							item.id,
							item.accountNo,
							item.sourceBranch,
							item.destinataionBranch,
							item.urnNo,
							item.jewelPouchNo,
							item.transitStatus,
							item.customerFullName,
							item.disbursedAmountInPaisa,
							item.investor,
							item.jewelPouchNo,
							item.loanDisbursementDate,
							item.rejectedRemarks,
							item.remarks
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
									title: 'Source Branch',
									data: 'sourceBranch'
								},{
									title: 'Destination Branch',
									data: 'destinationBranch'
								},{
									title: 'Account No',
									data: 'accountNo'
								},{
									title: 'URN No',
									data: 'urnNo'
								},{
									title: 'Jewel Pouch No',
									data: 'jewelPouchNo'
								},{
									title: 'Transit Status',
									data: 'transitStatus'
								},{
									title: 'Customer FullName',
									data: 'customerFullName'
								}, {
									title: 'Disbursed Amount',
									data: 'disbursedAmountInPaisa'
								},{
									title: 'Loan Disbursement Date',
									data: 'loanDisbursementDate'
								},{
									title: 'Investor',
									data: 'investor'
								},{
									title: 'Rejected Remarks',
									data: 'rejectedRemarks'
								},{
									title: 'Remarks',
									data: 'remarks'
								}];
					},
					getActions: function() {
						return [];
					},
					getBulkActions: function() {
						return [{
							name: "Send Request",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(items) {
								
								if (items.length == 0) {
									PageHelper.showProgress("bulk-create", "Atleast one loan should be selected for Batch creation", 5000);
									return false;
								}

						let ValidateSameTransitStatus = items[0]['transitstatus']
						_.each(items, function (item) {
							if (item['transitstatus'] != ValidateSameTransitStatus) {
								PageHelper.showProgress("bulk-create", "Transit Status of selected items should be same", 5000);
								ValidateSameTransitStatus=false;
							}
						});		
						 		
								irfNavigator.go({
									'state': 'Page.Engine',
									'pageName': 'jewelloan.JewelPouchRequest',
									'pageData': items
								});
						
	
							},
								
						
						    isApplicable: function (items) {
						        return transitStatusValue == true;
						    }
						}
						
						];
					}
				}
			}
		};
	}
]);
