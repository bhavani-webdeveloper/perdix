irf.pageCollection.factory(irf.page("CBCheckStatusQueue"),
["$log", "formHelper", "CreditBureau", "SessionStore", "$state", "entityManager",
"irfProgressMessage", "irfSimpleModal", "PageHelper",
function($log, formHelper, CreditBureau, SessionStore, $state, entityManager,
	PM, showModal, PageHelper){
	var nDays = 15;
	return {
		"type": "search-list",
		"title": "CREDIT_BUREAU_CHECK",
		"subTitle": "CUSTOMER_STATUS_QUEUE",
		initialize: function (model, form, formCtrl) {
			model.branchName = SessionStore.getCurrentBranch().branchName;
			model.branchId = SessionStore.getCurrentBranch().branchId;
			model.siteCode = SessionStore.getGlobalSetting("siteCode");
			$log.info("search-list sample got initialized");
		},
		definition: {
			title: "CB_STATUS_LAST_15_DAYS",
			pageName: "CBCheckStatusQueue",
			searchForm: ["*"],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"required": ["branchName"],
				"properties": {
					"status": {
						"title": "STATUS",
						"type": "string",
						"enum": ["PROCESSED", "PENDING", "ERROR"],
						"x-schema-form": {
							"type": "select",
							"titleMap": [
								{"name":"All", "value":""},
								{"name":"Processed", "value":"PROCESSED"},
								{"name":"Pending", "value":"PENDING"},
								{"name":"Error", "value":"ERROR"}
							]
						}
					},/*
					"branchName": {
						"title": "BRANCH_NAME",
						"type": "string",
						"enumCode": "branch",
						"x-schema-form": {
							"type": "select"
						}
					},*/
					"centreId": {
						"title": "CENTRE",
						"type":["number", "null"],
						"enumCode": "centre",
						"x-schema-form": {
							"type": "select",
							"parentEnumCode": "branch_id",
							"parentValueExpr": "model.branchId",
							"screenFilter": true	
						}
					}
				}
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){
				var today = moment(new Date());
				var nDaysBack = moment(new Date()).subtract(nDays, 'days');
                console.log(searchOptions);
				var promise = CreditBureau.listCreditBureauStatus({
					'branchName': searchOptions.branchName,
                    'status': searchOptions.status,
					'centreId': searchOptions.centreId,
					'fromDate': nDaysBack.format('YYYY-MM-DD'),
					'toDate': today.format('YYYY-MM-DD')
				}).$promise;
				return promise;
			},
			paginationOptions: {
				"viewMode": "page",
				"getItemsPerPage": function(response, headers){
					return 20;
				},
				"getTotalItemsCount": function(response, headers){
					return headers['x-total-count']
				}
			},
			listOptions: {
				// listStyle: "simple",
				getItems: function(response, headers){
					if (response!=null && response.length && response.length!=0){
						return response;
					}
					return [];
				},
				getListItem: function(item){
					return [
						item.customerId + ': ' + item.firstName,
						item.status + ' / Loan Amount: ' + item.loanAmount,
						item.reportType + ' - ' + item.requestType
					]
				},
				getActions: function(){
					return [{
						name: "View CB Status",
						icon: "fa fa-star-half-o",
						desc: "",
						fn: function(item, index) {
							PM.pop('cbcheck-submit', 'Checking status...');
							$log.info(item.customerId);
							CreditBureau.DSCpostCB(
								{customerId:item.customerId},
								function(response){
									PM.pop('cbcheck-submit', 'Checking status...', 10);
									showModal("DSC post CB",
										"<dl class='dl-horizontal'><dt>stopResponse</dt><dd>" + response.stopResponse
										+ "</dd><dt>response</dt><dd>" + response.response
										+ "</dd></dl>"
									);
								},
								function(errorResponse){
									$log.error(errorResponse);
									PM.pop('cbcheck-submit', 'Error checking status...', 3000);
								});
						},
						isApplicable: function(item, index){
							return true;
						}
					},{
						name: "Reinitiate CB Check",
						icon: "fa fa-share-square",
						desc: "",
						fn: function(item, index) {
							$log.info(item.id);
							PM.pop('cbcheck-submit', 'Reinitiating CB Check...');
							CreditBureau.reinitiateCBCheck(
								{/*creditBureauId:item.id,*/inqUnqRefNo:item.inqUnqRefNo},
								function(response){
									$log.info(response);
									PM.pop('cbcheck-submit', 'CB Check reinitiated ...', 3000);
								},
								function(errorResponse){
									$log.error(errorResponse);
									PM.pop('cbcheck-submit', 'Error reinitiating...', 3000);
									var data = errorResponse.data;
									var errors = [];
									if (data.errors){
										_.forOwn(data.errors, function(keyErrors, key){
											var keyErrorsLength = keyErrors.length;
											for (var i=0;i<keyErrorsLength; i++){
												var error  = {"message": "<strong>" + key  + "</strong>: " + keyErrors[i]};
												errors.push(error);
											}
										})
										PageHelper.setErrors(errors);
									} else if (data.error) {
										errors.push({"message": data.error});
										PageHelper.setErrors(errors);
									}
								});
						},
						isApplicable: function(item, model){
							if (model.siteCode=='KGFS' && (item.status === 'PENDING' || item.status === 'ERROR')) {
								return true;
							}else if(item.status === 'PENDING'){
 								return true;
							}else{
								return false;
							}	
						}
					},{
						name: "Enroll Customer",
						icon: "fa fa-user-plus",
						desc: "",
						fn: function(item, index) {
							$log.info(item.id);
							PM.pop('cbcheck-submit', 'Reinitiating CB Check...');
							CreditBureau.reinitiateCBCheck(
								{creditBureauId:item.id},
								function(response){
									$log.info(response);
									PM.pop('cbcheck-submit', 'CB Check reinitiated ...', 3000);
								},
								function(errorResponse){
									$log.error(errorResponse);
									PM.pop('cbcheck-submit', 'Error reinitiating...', 3000);
									var data = errorResponse.data;
									var errors = [];
									if (data.errors){
										_.forOwn(data.errors, function(keyErrors, key){
											var keyErrorsLength = keyErrors.length;
											for (var i=0;i<keyErrorsLength; i++){
												var error  = {"message": "<strong>" + key  + "</strong>: " + keyErrors[i]};
												errors.push(error);
											}
										})
										PageHelper.setErrors(errors);
									} else if (data.error) {
										errors.push({"message": data.error});
										PageHelper.setErrors(errors);
									}
								});
						},
						isApplicable: function(item, index){
							if (item.status === 'PENDING') {
								return true;
							}
							return false;
						}
					}];
				}
			}


		}
	};
}]);
