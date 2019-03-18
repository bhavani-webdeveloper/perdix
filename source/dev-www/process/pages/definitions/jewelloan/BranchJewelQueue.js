irf.pageCollection.factory(irf.page("jewelloan.BranchJewelQueue"),
 ["$log", "formHelper","PageHelper", "JewelLoan", "$q", "SessionStore","irfNavigator","irfProgressMessage",
	function($log, formHelper,PageHelper, JewelLoan,$q, SessionStore,irfNavigator,irfProgressMessage) {
		
		var originBranchId = SessionStore.getBranchId();
		var transitStatusValue 	= '' ;
		var istransitStatus 	= true ;
		
		return {
			"type": "search-list",
			"title": "BRANCH_JEWEL_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
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
					istransitStatus	   = typeof searchOptions.transitStatus != 'undefined' ? (searchOptions.transitStatus.toLowerCase() == 'source' || searchOptions.transitStatus.toLowerCase() == 'destination') ? true: false:false;	
					transitStatusValue = searchOptions.transitStatus ;
					var promise = JewelLoan.search({
									"originBranchid"	  : originBranchId,
									'currentStage'		  : "BranchJewelQueue",
									"fromDate"			  : searchOptions.fromDate,
									"toDate"			  : searchOptions.toDate,	
									"urnNo"				  : searchOptions.urnNo,
									"accountNo"			  : searchOptions.accountNo,
									"transitStatus"		  : searchOptions.transitStatus,
									//"sourceBranchId"	  : originBranchId,	
									//"destinationBranchId" : originBranch
									'page'				  : pageOpts.pageNo,
									'per_page'			  : pageOpts.itemsPerPage,
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

							var branches = formHelper.enum('branch_id').data;
							var sourceBranchName = null;
							var destinationBranchName = null;
	
							for (var i=0; i<response.length; i++){
								for (var j=0; j<branches.length; j++){
									var branch = branches[j];
									if (branch.code == response[i].sourceBranchId)
								 		sourceBranchName = branch.name;
								 	if (response[i].destinationBranchId != null && branch.code == response[i].destinationBranchId){	
										 destinationBranchName = branch.name ;
										 if	(sourceBranchName!=null && destinationBranchName!=null)
									 		break; 	
									 }	
									 if (response[i].destinationBranchId == null && sourceBranchName!=null )
									 		break;
								}
							}	

							for (var i=0;i<response.length;i++){
								response[i].customerFullName 	= response[i].customerFirstName + " "+(response[i].customerLastName!=null?response[i].customerLastName:"");
								response[i].transitStatus    	= transitStatusValue;
								response[i].sourceBranch 	 	= sourceBranchName;
								response[i].destinationBranch	= destinationBranchName;
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
							item.destinationBranch,
							item.urnNo,
							item.jewelPouchNo,
							item.transitStatus,
							item.customerFullName,
							item.disbursedAmountInPaisa,
							item.investor,
							item.loanDisbursementDate,
							item.rejectedReason,
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
									title: 'Customer FullName',
									data: 'customerFullName'
								},{
									title: 'Account No',
									data: 'accountNo'
								},{
									title: 'URN No',
									data: 'urnNo'
								},{
									title: 'Jewel Pouch No',
									data: 'jewelPouchNo'
								}, {
									title: 'Disbursed Amount',
									data: 'disbursedAmountInPaisa'
								},{
									title: 'Loan Disbursement Date',
									data: 'loanDisbursementDate'
								},
								// {
								// 	title: 'Investor',
								// 	data: 'investor'
								// },{
								// 	title: 'Rejected Reason',
								// 	data: 'rejectedReason'
								// },
								{
									title: 'Remarks',
									data: 'remarks'
								},
								// {
								// 	title: 'Transit Status',
								// 	data: 'transitStatus'
								// }
							];
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
						        return istransitStatus == true;
						    }
						}
						
						];
					}
				}
			}
		};
	}
]);
