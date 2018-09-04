irf.pageCollection.factory("Pages__CentrePaymentCollectionDownload",
["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper",
"$stateParams", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService",
"$filter", "elementsUtils", "Utils","authService", "$rootScope", "Queries","PagesDefinition",
function($log, $q, $timeout, SessionStore, $state, entityManager, formHelper,
	$stateParams, LoanProcess, PM, PageHelper, StorageService,
	$filter, elementsUtils, Utils,authService, $rootScope, Queries, PagesDefinition){

	return {
		"id": "CentrePaymentCollection",
		"type": "schema-form",
		"name": "CentrePaymentCollection",
		"title": "CENTRE_PAYMENT_COLLECTION",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			model._offlineKey = formCtrl.$name + "__" + SessionStore.getBranch();
			var collectionData= StorageService.retrieveJSON(model._offlineKey);
			if(collectionData){
				model.collectionDemandData = collectionData;
			}
			$log.info("I got initialized");
			PagesDefinition.getPageConfig("Page/Engine/CentrePaymentCollectionDownload")
		    .then(function(data) {
		        // defaulting
		        var defaultConfig = {
		            AllowBackDatedDemandDownload: true,
		            AllowBackDatedCollection: true
		        };
		        model.$pageConfig = _.defaults(data, defaultConfig);
		    });
		    model.todaysDate = SessionStore.getCBSDate();

		},
		form: [{
			"type": "box",
			"title": "DOWNLOAD DEMAND",
			//"readonly": true,
			"items": [
				{
					"type": "help",
					"helpExpr": "!model._storedData"
					+"?('SAVE_DATA_UNAVAILABLE'|translate)"
					+":(model._storedData.expired"
						+"?('SAVED_DATA_EXPIRED'|translate)"
						+":(model._storedData.collectionBranch + ' ' + ('COLLECTION_INFO_DOWNLOADED'|translate))"
					+")"
				},
                {
					"key":"demandDate",
					"type": "date",
					"readonly": false
				},
				{
					"type": "button",
					"notitle": true,
					"fieldHtmlClass": "btn-block",
					"title": "DL_SAVE_BRANCH_COLLECTION",
					"onClick": function(model, form, formName){
						$log.info("Downloading branch Collection data..");
						PageHelper.showLoader();
						PM.pop('collection-demand', "Downloading Collection Demands...", 2000);
						var collectionBranch = SessionStore.getBranch();
						var collectionDate = SessionStore.getCBSDate();	
						if(model.demandDate== undefined || model.demandDate==""){
							PM.pop('collection-demand', 'Demand date is mandatory', 5000);
							PageHelper.hideLoader();
						}
						else if(model.$pageConfig.AllowBackDatedDemandDownload == false && moment(model.demandDate).format('YYYY-MM-DD') < collectionDate){
							PM.pop('collection-demand','Demand date should not less than system\'s date',5000);
							PageHelper.hideLoader();
						}
						else if(model.$pageConfig.AllowBackDatedDemandDownload == true || (model.$pageConfig.AllowBackDatedDemandDownload == false && moment(model.demandDate).format('YYYY-MM-DD') >= collectionDate)){
							collectionDate = moment(model.demandDate).format('YYYY-MM-DD');
							LoanProcess.collectionDemandSearch({
								branch: collectionBranch,
								// userId: SessionStore.getLoginname(),
								demandDate: collectionDate
							}, function(response) {
								var userCentreCollectionDemands = [];
								var userCentres = SessionStore.getCentres();
								if(!userCentres || userCentres.length == 0) {
									PM.pop('collection-demand', "No Collection Demands found. There are no centres mapped to user", 5000);
									PageHelper.hideLoader();
									return;
								}
								for(var i = 0; i < userCentres.length; i++) {
									userCentreCollectionDemands = userCentreCollectionDemands.concat($filter('filter')(response.body, {centreId: userCentres[i].id, userId: SessionStore.getLoginname()}, true));
								}

								var temp = {};
								var groupCodes = userCentreCollectionDemands.reduce(function (a, b) {
								  if (b.groupCode && !temp[b.groupCode]) {
								    a.push(b.groupCode)
								    temp[b.groupCode] = true;
								  }
								  return a;
								}, []);

								Queries.getGroupDetailsByGroupcode(groupCodes).then(function(groups) {

									if (groups && angular.isArray(groups) && groups.length > 0) {
										var groupNames = groups.reduce(function(a, b) {
											a[b.group_code] = b.group_name;
											return a;
										}, {});
										for(var i = 0; i < userCentreCollectionDemands.length; i++) {
											if (userCentreCollectionDemands[i]['groupCode']) {
												userCentreCollectionDemands[i]['groupName'] = groupNames[userCentreCollectionDemands[i]['groupCode']];
											}
										}
									}
								}).finally(function(){
									var storedData = {
										collectionDemands: userCentreCollectionDemands,
										collectionBranch: collectionBranch,
										collectionDate: collectionDate
									};
									var tempDataArray = StorageService.retrieveJSON(model._offlineKey);
									if(tempDataArray != null){

										var indexForDate = _.findIndex(tempDataArray, function(b) {
											return b.collectionDate == collectionDate;
										});
										if (indexForDate == -1) {
											if (storedData.collectionDemands.length >0) {
												tempDataArray.push(storedData);
												StorageService.storeJSON(model._offlineKey, tempDataArray);
												PM.pop('collection-demand', "Collection Demands Saved Successfully", 3000);
											} else {
												PM.pop('collection-demand', "No Collection Demands found", 3000);
											}	
										} else {
											PM.pop('collection-demand', "Collection Demands already Downloaded for this date", 2000);
										}
									} else {
										tempDataArray = [];
										if (storedData.collectionDemands.length >0) {
											tempDataArray.push(storedData);
											StorageService.storeJSON(model._offlineKey, tempDataArray);
											PM.pop('collection-demand', "Collection Demands Saved Successfully", 2000);
										} else {
											PM.pop('collection-demand', "No Collection Demands found", 2000);
										}		
									}															
									PageHelper.hideLoader();
									$state.go("Page.Engine", {
										pageName: 'CentrePaymentCollectionDownload'
									},{
										reload: true
									});
								});
							}, function(errorResponse){
								PageHelper.hideLoader();
								PM.pop('collection-demand', "Couldn't fetch branch Collection Demands", 5000);
							});
						}
						
					}
				},
				{
                    key: "collectionDemandData",
                    type: "array",
                    title: "COLLECTION DEMAND DOWNLOADED",
                    titleExpr: "moment(model.collectionDemandData[arrayIndex].collectionDate).format('YYYY-MM-DD')",
                    titleExprLocals: {moment: window.moment},
                    startEmpty: true,
                    add: null,
                    // remove: null,
                    view: "fixed",
                    items: [
						{	"key":"collectionDemandData[].button",
							"type": "button",
							"notitle": true,
							"fieldHtmlClass": "btn-block",
							"title": "COLLECT",
							"condition": "model.$pageConfig.AllowBackDatedCollection == false && model.collectionDemandData[arrayIndex].collectionDate < model.todaysDate",
							"onClick": function(model, form, formName,context){
								console.log(model.collectionDemandData[context.arrayIndex]);
								PM.pop('collection-demand','Demand date should not less than system\'s date',5000);
								PageHelper.hideLoader();
							}	
						},
						{	"key":"collectionDemandData[].button",
							"type": "button",
							"notitle": true,
							"fieldHtmlClass": "btn-block",
							"title": "COLLECT",
							"condition" : "model.$pageConfig.AllowBackDatedCollection == true || (model.$pageConfig.AllowBackDatedCollection == false && model.collectionDemandData[arrayIndex].collectionDate >= model.todaysDate)",
							"onClick": function(model, form, formName,context){
								console.log(model.collectionDemandData[context.arrayIndex]);
								$state.go("Page.Engine", {
	                    			pageName: 'CentrePaymentCollection',
	                    			pageData: model.collectionDemandData[context.arrayIndex]
	               				});
								$log.info("Downloading branch Collection data..");
							}
						}
                    ]
                }
			]
		}
		],
		actions: {},
		schema: {
			"type": "object",
			"properties": {
				"demandDate": {
					"title": "DEMAND_DATE",
					"type": "string"
				}
			}
		}
	};
}]);
