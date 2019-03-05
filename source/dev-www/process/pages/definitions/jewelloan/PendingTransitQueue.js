irf.pageCollection.factory(irf.page("jewelloan.PendingTransitQueue"),
 ["$log", "formHelper","PageHelper", "JewelLoan", "$q", "SessionStore","irfNavigator","irfProgressMessage",
	function($log, formHelper,PageHelper, JewelLoan,$q, SessionStore,irfNavigator,irfProgressMessage) {
		var originBranchId = SessionStore.getBranchId();
		var sourceBranch = SessionStore.getBranch();
		var branch = SessionStore.getBranch();
		var transitStatusValue 	= 'PENDING_TRANSIT' ;
		var branchId ;

		return {
			"type": "search-list",
			"title": "TRANSIT_APPROVAL_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.originBranch = branch;
				model.sourceBranch = sourceBranch;
				model.jewelloan = model.jewelloan || {};
				$log.info("search-list sample got initialized");
			},
			definition: {
				title: "SEARCH_SOURCE_BRANCH",
				searchForm: [
					"*"
				],
				autoSearch:false,

				searchSchema: {
					"type": 'object',
					"title": 'searchOptions',
					"properties": {
						"sourceBranch": {
							"title": "SOURCE_BRANCH",
							"type": ["string","null"],
							"enumCode": "branch",
							"x-schema-form": {
								"type": "select",
								"screenFilter": true
								}	
							},
					},
					"required": []
				},
				
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {
					var branches = formHelper.enum('branch_id').data;
	
					for (var i=0;i<branches.length; i++){
						var branch = branches[i];
						 if (branch.name == searchOptions.sourceBranch){
							branchId = branch.code;
						 }
					}
					
					var promise = JewelLoan.search({
						"originBranchid"	  : originBranchId,
						'currentStage'		  : "PendingTransitQueue",
						"transitStatus"		  : "PENDING_TRANSIT",
						"sourceBranchId"	  : branchId,	
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
									title: 'Rejected Reason',
									data: 'rejectedReason'
								},{
									title: 'Remarks',
									data: 'remarks'
								}
							];
					},
					getActions: function() {
						return [];
					},
					getBulkActions: function() {
						return [{
							name: "Approve",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(items) {
								
								if (items.length == 0) {
									PageHelper.showProgress("bulk-create", "Atleast one loan should be selected for Batch creation", 5000);
									return false;
								}	
								irfNavigator.go({
									'state': 'Page.Engine',
									'pageName': 'jewelloan.JewelPouchApproval',
									'pageData': items
								});
						
	
							},
								
						    isApplicable: function (items) {
						        return true;
						    }
						},
						{
							name: "Reject",
							desc: "",
							htmlClass: "style='margin-left:10px'",
							fn: function(items) {
								if (items.length != 1) {
									PageHelper.showProgress("bulk-reject", "Only one Record should be selected at a time for Batch Rejecton", 5000);
									return false;
								}

								irfNavigator.go({
									'state': 'Page.Engine',
									'pageName': 'jewelloan.JewelPouchReject',
									'pageData': items
								}); 
							},
							isApplicable: function(items) {
                                return true;
							}
						}
						
						];
					}
				}
			}
		};
	}
]);
