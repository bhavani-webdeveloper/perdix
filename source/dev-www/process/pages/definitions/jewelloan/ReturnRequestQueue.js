irf.pageCollection.factory(irf.page("jewelloan.ReturnRequestQueue"),
 ["$log", "formHelper","PageHelper", "JewelLoan", "$q", "SessionStore","irfNavigator","irfProgressMessage","Utils",
	function($log, formHelper,PageHelper, JewelLoan,$q, SessionStore,irfNavigator,irfProgressMessage,Utils) {
        
            var BulkJewelPouchUpdate = function(items) {
                $log.info("Inside submit()");

                var branches               = formHelper.enum('branch_id').data;
                destinationBranchId        = model.jewelloanResponse[0].destinationBranchId;
               
                for (var i=0;i<branches.length && i<items.length; i++){
                    var branch = branches[i];
                    items[i].destinationBranch      = items.destinationBranch
                    items[i].sentBy                 = loginuser ;   
                    items[i].jewelLoanId            = items[i].id; 
                    items[i].jewelPouchMovementId   = null;
                    items[i].statusUpdatedBy        = loginuser ;

                    if (branch.name == items[i].destinationBranch)
                        items[i].destinationBranchId  = branch.code;	

                    if(items[i].transitStatus && items[i].transitStatus.toUpperCase() == 'RETURN_REQUESTED'){
                        items[i].status =  "PENDING_TRANSIT" 
                     }
	 
                }

                status  = items[0].status ;	
                Utils.removeNulls(items, true);
                
                var reqData = _.cloneDeep(items);

                console.log(reqData);

                /*  1)req data will now contain jewelloans with same transitstatus because of validation 
                        on branch jewel queue 
                */
               Utils.alert("Are you want to Proceed!!!");

    

            $log.info(reqData); 
           
            PageHelper.showLoader();
            PageHelper.showProgress("Assign-Jewel", "Working...",3000);
            JewelLoan.bulkJewelStatusUpdate({ "sourceBranchId": sourceBranchId , "destinationBranchId": destinationBranchId ,"status": status,"rejectReason":"","remarks":remarks,"sentBy":loginuser },reqData)
           .$promise
                .then(function(res){
                    PageHelper.showProgress("Assign-Jewel", "Done.", 3000);
                    $log.info(res);
                }, function(httpRes){
                    PageHelper.showProgress("Assign-Jewel", "Oops. Some error occured.", 3000);
                    PageHelper.showErrors(httpRes);
                })
                .finally(function(){
                    PageHelper.hideLoader();
                })

            }
        

        var sourceBranchId      = SessionStore.getBranchId();
        var destinationBranch   = SessionStore.getBranch();
        var loginuser           = SessionStore.getLoginname();
		var branch              = SessionStore.getBranch();
		var transitStatusValue 	= 'RETURN_REQUESTED' ;
        var branchId ;
        var status   ; 
        var destinationBranchId ;    

		return {
			"type": "search-list",
			"title": "RETURN_REQUEST_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.originBranch = branch;
				model.destinationBranch = destinationBranch;
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
						"destinationBranch": {
							"title": "DESTINATION_BRANCH",
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
						 if (branch.name == searchOptions.destinationBranch){
							branchId = branch.code;
						 }
					}
					
					var promise = JewelLoan.search({
						//"originBranchid"	  : branchId,
						'currentStage'		  : "ReturnRequestQueue",
						"transitStatus"		  : "RETURN_REQUESTED",
                        "sourceBranchId"	  : sourceBranchId,
                        "destinationBranchId" : branchId,	
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
								//Utils.removeNulls(value, true);
								//_.isNull(item['transactionType'])
								response[i].customerFullName 	= response[i].customerFirstName + " "+(response[i].customerLastName!=null?response[i].customerLastName:"");
								response[i].transitStatus    	= transitStatusValue;
								response[i].sourceBranch 	 	= sourceBranchName;
								response[i].destinationBranch	= destinationBranchName;
								response[i].disbursedAmount     = (response[i].disbursedAmountInPaisa/100);
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
							item.disbursedAmount,
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
									data: 'disbursedAmount'
								},{
									title: 'Loan Disbursement Date',
									data: 'loanDisbursementDate'
								},{
									title: 'Investor',
									data: 'investor'
								}
								,{
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
								BulkJewelPouchUpdate(items);		
							},
								
						
						    isApplicable: function (items) {
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
