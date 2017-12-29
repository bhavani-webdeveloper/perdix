irf.pageCollection.factory(irf.page("CentrePaymentCollection"),
["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper",
"$stateParams", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService",
"$filter", "elementsUtils", "Utils","PagesDefinition", "irfNavigator",
function($log, $q, $timeout, SessionStore, $state, entityManager, formHelper,
	$stateParams, LoanProcess, PM, PageHelper, StorageService,
	$filter, elementsUtils, Utils,PagesDefinition, irfNavigator ){

	return {
		"id": "CentrePaymentCollection",
		"type": "schema-form",
		"name": "CentrePaymentCollection",
		"title": "CENTRE_PAYMENT_COLLECTION",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			if (!model.$$STORAGE_KEY$$) {
				model.showDenomination = false;
				
				PagesDefinition.getPageConfig("Page/Engine/CentrePaymentCollection").then(function(data){
					if(data.showDenomination) {
						model.showDenomination = data.showDenomination;
						model.collectionDemandSummary.denominationFifty = null;
						model.collectionDemandSummary.denominationFive = null;
						model.collectionDemandSummary.denominationFiveHundred = null;
						model.collectionDemandSummary.denominationHundred = null;
						model.collectionDemandSummary.denominationTwoHundred = null;
						model.collectionDemandSummary.denominationOne = null;
						model.collectionDemandSummary.denominationTen =null;
						model.collectionDemandSummary.denominationThousand = null;
						model.collectionDemandSummary.denominationTwenty = null;
						model.collectionDemandSummary.denominationTwo = null;
						model.collectionDemandSummary.denominationTwoThousand = null;
					}
					$log.info("showDenomination: "+model.showDenomination);
				});
				model._offlineKey = formCtrl.$name+"Download" + "__" + SessionStore.getBranch();
				var collectionData = StorageService.retrieveJSON(model._offlineKey);
				model._storedData  = $stateParams.pageData;
				model.collectionDemandSummary.centreId = 0;
				var branch1 = formHelper.enum('branch_id').data;
	            for (var i = 0; i < branch1.length; i++) {
	                if ((branch1[i].name) == SessionStore.getBranch()) {
	                    model.customerBranchId = branch1[i].value;
	                }
	            }
				if (!model.$$STORAGE_KEY$$) {
					model.collected = 0;
					$timeout(function() {
						model.groupCollectionDemand = [];
					});
				} else {
					formCtrl.disabled = true;
					model._mode = 'VIEW';
				}
				if (model._storedData && model._storedData.collectionDate) {
					var cDate = moment(model._storedData.collectionDate);
					model._storedData.formatedCollectionDate = SessionStore.getFormatedDate(cDate);
					// if (!cDate.startOf('day').isSame(moment(new Date()).startOf('day')))
						model._storedData.expired = false;
					if (!model.$$STORAGE_KEY$$) {
						model.collectionDemandSummary.demandDate = model._storedData.collectionDate;
					}
				}
				$log.info("I got initialized");
			}
		},
		offlineInitialize: function (model, form, formCtrl) {
			if (model.$$STORAGE_KEY$$) {
				//formCtrl.disabled = true;
				model._mode = 'VIEW';
				// for(var i = 0; i < form.length; i++) {
				// 	if(i == 1 || i == 2) {
				// 		form[i].readonly = true; 
				// 	}
				// }
				// model.groupCollectionDemand = [];
				// var collectionDemands = model._storedData.collectionDemands;
				// var centreDemands = $filter('filter')(collectionDemands, {centreId: model.collectionDemandSummary.centreId}, true);
				// var totalToBeCollected = 0;
				// var groups = {};
				// if(!centreDemands || centreDemands.length <= 0) {
				// 	model.collectionDemandSummary.collectionExist = false;
				// 	PM.pop('collection-demand', 'No Collection available for the selected Centre. Try a different centre.', 5000);
				// 	return;
				// }
				// model.collectionDemandSummary.collectionExist = true;
				// _.each(centreDemands, function(v,k){
				// 	v.amountPaid = v.installmentAmount;
				// 	if (v.totalToBeCollected > v.installmentAmount) {
				// 		v.amountPaid = v.totalToBeCollected;
				// 		v.overdue = true;
				// 	}
				// 	totalToBeCollected += v.amountPaid;
				// 	if (!v.groupCode) v.groupCode = 'Individual Loans';
				// 	if (!groups[v.groupCode]) groups[v.groupCode] = [];
				// 	groups[v.groupCode].push(v);
				// });
				// _.each(groups, function(v,k){
				// 	var d = {groupCode:k, collectiondemand:v};
				// 	model.groupCollectionDemand.push(d);
				// });
				// model.totalToBeCollected = model.collected = totalToBeCollected;
			}
		},
		offline: true,
		getOfflineDisplayItem: function(item, index){
			return [
				'Centre: ' + item["collectionDemandSummary"]["centreName"] + ' (' +item["collectionDemandSummary"]["centreId"] + ') - ' + item["collectionDemandSummary"]["demandDate"],
				'Total: '+item["totalToBeCollected"],
				'Collected: '+item["collected"]
			]
		},
		form: [
		{
			"type": "box",
			"title": "CENTRE",
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
					"type": "fieldset",
					"title": "CHOOSE_CENTRE",
					// "condition": "model._storedData && !model._storedData.expired",
					"items": [
						{
							"key":"collectionDemandSummary.demandDate",
							"type": "date",
							"condition": "model._mode!=='VIEW'",
							"readonly": true
						},
						{
							"key":"collectionDemandSummary.demandDate",
							"type": "date",
							"condition": "model._mode == 'VIEW'",
							"readonly": true,
						},
						{
							"key":"collectionDemandSummary.centreName",
							"title": "CENTRE",
							type: "lov",
							"condition": "model._mode!=='VIEW'",
		                    autolov: true,
		                    lovonly: true,
		                    bindMap: {},
		                    required: true,
		                    searchHelper: formHelper,
		                    "inputMap": {
	                            "centreName": {
	                                "key": "collectionDemandSummary.centreName",
	                                "title": "CENTRE"
	                            },
	                        },
	                        initialize: function(model, form, parentModel, context) {
	                            //model.centreName = parentModel.collectionDemandSummary.centreName;
	                        },
		                    search: function (inputModel, form, model, context) {
		                        var centres = SessionStore.getCentres();
		                        $log.info("hi");
		                        $log.info(centres);

		                        var centreCode = formHelper.enum('usercentre').data;
		                        var out = [];
		                        if (centres && centres.length) {
		                            for (var i = 0; i < centreCode.length; i++) {
		                                for (var j = 0; j < centres.length; j++) {
		                                	if(inputModel.centreName && !centres[j].centreName.toLowerCase().includes(inputModel.centreName.toLowerCase())){
		                                		continue;
		                                	}
		                                    if (centreCode[i].value == centres[j].id) {
		                                        out.push({
		                                            name: centreCode[i].name,
		                                            id: centreCode[i].value
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
		                    onSelect: function (valueObj, model, context) {
		                        model.collectionDemandSummary.centreName = valueObj.name;
		                        model.collectionDemandSummary.centreId = valueObj.id;
		                        delete model.collectionDemandSummary.photoOfCentre;
		                        if(model.$$OFFLINE_FILES$$ && model.$$OFFLINE_FILES$$.collectionDemandSummary$photoOfCentre)
		                        {
			                        model.$$OFFLINE_FILES$$.collectionDemandSummary$photoOfCentre['data'] = null;
			                        model.$$OFFLINE_FILES$$.collectionDemandSummary$photoOfCentre['filename'] = null;
		                        }
		                        model.collectionDemandSummary.latitude = ' ';
		                        model.collectionDemandSummary.longitude = ' ';
		                        model.collected = 0;
								model.groupCollectionDemand = [];
								var collectionDemands = model._storedData.collectionDemands;
								var centreDemands = $filter('filter')(collectionDemands, {centreId: model.collectionDemandSummary.centreId}, true);
								var totalToBeCollected = 0;
								var groups = {};
								if(!centreDemands || centreDemands.length <= 0) {
									model.collectionDemandSummary.collectionExist = false;
									PM.pop('collection-demand', 'No Collection available for the selected Centre. Try a different centre.', 5000);
									return;
								}
								model.collectionDemandSummary.collectionExist = true;
								_.each(centreDemands, function(v,k){
									v.amountPaid = v.installmentAmount;
									if (v.totalToBeCollected > v.installmentAmount) {
										v.amountPaid = v.totalToBeCollected;
										v.overdue = true;
									}
									totalToBeCollected += v.amountPaid;
									if (!v.groupCode) v.groupCode = 'Individual Loans';
									if (!groups[v.groupCode]) groups[v.groupCode] = [];
									groups[v.groupCode].push(v);
								});
								_.each(groups, function(v,k){
									var d = {groupCode:k, collectiondemand:v};
									model.groupCollectionDemand.push(d);
								});
								model.totalToBeCollected = model.collected = totalToBeCollected;
		                    },
		                    getListDisplayItem: function (item, index) {
		                        return [
		                            item.name
		                        ];
		                    }
						},
						{
							"key":"collectionDemandSummary.centreName",
							"title": "CENTRE",
							"readonly": true,
							"condition": "model._mode == 'VIEW'",
						},
						{
							"key": "collectionDemandSummary.photoOfCentre",
							"type": "file",
							"fileType": "image/*",
							"offline": true
						},
						{
							"key": "collectionDemandSummary.latitude",
							"title": "CENTRE_LOCATION",
							"type": "geotag",
							"latitudeExpr": "model.collectionDemandSummary.latitude",
							"longitudeExpr":"model.collectionDemandSummary.longitude",
							"latitude": "collectionDemandSummary.latitude",
							"longitude": "collectionDemandSummary.longitude",
							"condition": "model._mode!=='VIEW'"
						},
						{
							"key": "collectionDemandSummary.latitude",
							"title": "CENTRE_LOCATION",
							"type": "geotag",
							"latitude": "collectionDemandSummary.latitude",
							"longitude": "collectionDemandSummary.longitude",
							"condition": "model._mode==='VIEW'",
							"readonly": true
						}
					]
				}
			]
		},
		{
			"type": "box",
			"title": "GROUPS",
			"condition": "model._storedData && model.collectionDemandSummary.centreId && model.collectionDemandSummary.collectionExist",
			"items": [{
				"key":"collectionDemandSummary.allAttendance",
				"fullwidth": true,
				"onChange": function(modelValue, form, model) {
					_.each(model.groupCollectionDemand, function(value, key){
						_.each(value.collectiondemand, function(v,k){
							v.attendance = modelValue;
						});
					});
				}
			},
			{
				"key": "groupCollectionDemand",
				"add": null,
				"remove": null,
				"titleExpr": "form.title + ' - ' + model.groupCollectionDemand[arrayIndex].groupCode",
				"items": [
					{
						"key": "groupCollectionDemand[].collectiondemand",
						"titleExpr": "model.groupCollectionDemand[arrayIndexes[0]].collectiondemand[arrayIndexes[1]].customerName",
						"add": null,
						"remove": null,
						"view": "fixed",
						"fieldHtmlClass": "no-border",
						"items": [
							{
								"type": "section",
								"htmlClass": "row",
								"items": [{
									"type": "section",
									"htmlClass": "col-xs-5",
									"items": [{
										"type": "section",
										"html": "{{'INSTALLMENT_AMOUNT'|translate}}: {{(model.groupCollectionDemand[arrayIndexes[0]].collectiondemand[arrayIndexes[1]].totalToBeCollected|irfCurrency)+(model.groupCollectionDemand[arrayIndexes[0]].collectiondemand[arrayIndexes[1]].overdue?' (with overdue)':'')}}<br><small style='color:tomato'>{{model.groupCollectionDemand[arrayIndexes[0]].collectiondemand[arrayIndexes[1]].error}}</small>",
									}]
								},{
									"type": "section",
									"htmlClass": "col-xs-5",
									"items": [{
										"key": "groupCollectionDemand[].collectiondemand[].amountPaid",
										"type": "amount",
										"notitle": true,
										"onChange": function(modelValue, form, model){
											var demand = model.groupCollectionDemand[form.arrayIndexes[0]].collectiondemand[form.arrayIndexes[1]];
											demand.error = '';
											if (demand.amountPaid > demand.totalToBeCollected) {
												demand.error = "No advance payment allowed";
												return;
											}
											var collected = 0;
											var l1 = model.groupCollectionDemand.length;
											for(i=0;i<l1;i++){
												var l2=model.groupCollectionDemand[i].collectiondemand.length;
												for(j=0;j<l2;j++){
													collected += Number(model.groupCollectionDemand[i].collectiondemand[j].amountPaid);
												}
											}
											model.collected = collected;
										}
									}]
								},{
									"type": "section",
									"htmlClass": "col-xs-2",
									"items": [{
										"key": "groupCollectionDemand[].collectiondemand[].attendance",
										"notitle": true
									}]
								}]
							}
						]
					}
				]
			}]
		},
		// {
		// 	"type": "box",
		// 	"title": "GROUPS",
		// 	"condition": "model._mode==='VIEW'",
		// 	"readonly": true,
		// 	"items": [
		// 		{
		// 			"key":"collectionDemandSummary.allAttendance",
		// 			"fullwidth": true
		// 		},
		// 		{
		// 			"key": "groupCollectionDemand",
		// 			"add": null,
		// 			"remove": null,
		// 			"titleExpr": "form.title + ' - ' + model.groupCollectionDemand[arrayIndex].groupCode",
		// 			"items": [
		// 				{
		// 					"key": "groupCollectionDemand[].collectiondemand",
		// 					"add": null,
		// 					"remove": null,
		// 					"view": "fixed",
		// 					"fieldHtmlClass": "no-border",
		// 					"items": [
		// 					{
		// 							"type": "section",
		// 							"htmlClass": "row",
		// 							"items": [{
		// 								"type": "section",
		// 								"htmlClass": "col-xs-5",
		// 								"items": [{
		// 									"key": "groupCollectionDemand[].collectiondemand[].customerName",
		// 									"readonly": true,
		// 									"notitle": true
		// 								}]
		// 							}, 
		// 							]
		// 						},
		// 						{
		// 							"type": "section",
		// 							"htmlClass": "row",
		// 							"items": [
		// 							{
		// 								"type": "section",
		// 								"htmlClass": "col-xs-5",
		// 								"items": [{
		// 									"type": "section",
		// 									"html": "{{'INSTALLMENT_AMOUNT'|translate}}: {{(model.groupCollectionDemand[arrayIndexes[0]].collectiondemand[arrayIndexes[1]].totalToBeCollected|irfCurrency)+(model.groupCollectionDemand[arrayIndexes[0]].collectiondemand[arrayIndexes[1]].overdue?' (with overdue)':'')}}<br><small style='color:tomato'>{{model.groupCollectionDemand[arrayIndexes[0]].collectiondemand[arrayIndexes[1]].error}}</small>",
		// 								}]
		// 							}, {
		// 								"type": "section",
		// 								"htmlClass": "col-xs-5",
		// 								"items": [{
		// 									"key": "groupCollectionDemand[].collectiondemand[].amountPaid",
		// 									"type": "amount",
		// 									"notitle": true
		// 								}]
		// 							},{
		// 								"type": "section",
		// 								"htmlClass": "col-xs-2",
		// 								"items": [{
		// 									"key": "groupCollectionDemand[].collectiondemand[].attendance",
		// 									"notitle": true
		// 								}]
		// 							}]
		// 						}
		// 					]
		// 				}
		// 			]
		// 		}
		// 	]
		// },
		{
			"type": "box",
			"title": "COLLECTION",
			"condition": "((model._storedData && !model._storedData.expired)) && model.collectionDemandSummary.centreId && model.collectionDemandSummary.collectionExist",
			"items": [
				{
					"key": "totalToBeCollected",
					"title": "TO_COLLECT",
					"type": "amount",
					"readonly": true
				},
				{
					"key": "collected",
					"title": "COLLECTED",
					"type": "amount",
					"readonly": true
				},
				{
					"type": "fieldset",
					"title": "DENOMINATIONS",
					"condition": "model.showDenomination",
					"items": [{
						"type": "section",
						"htmlClass": "row",
						"items": [{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationTwoThousand",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						}, 
						// {
						// 	"type": "section",
						// 	"htmlClass": "col-xs-4",
						// 	"items": [{
						// 		key:"collectionDemandSummary.denominationThousand",
						// 		onChange:"actions.valueOfDenoms(model,form)"
						// 	}]
						// }, 
						{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationFiveHundred",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationTwoHundred",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},]
					},{
						"type": "section",
						"htmlClass": "row",
						"items": [{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationHundred",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationFifty",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationTwenty",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},]
					},{
						"type": "section",
						"htmlClass": "row",
						"items": [{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationTen",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						}, {
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationFive",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationTwo",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						},{
							"type": "section",
							"htmlClass": "col-xs-4",
							"items": [{
								key:"collectionDemandSummary.denominationOne",
								onChange:"actions.valueOfDenoms(model,form)"
							}]
						}]
					},
					{
						key:"collectionDemandSummary._denominationTotal",
						title:"TOTAL",
						"type": "amount",
						readonly:true
					}]
				},
			]
		},
		{
			"type": "actionbox",
			"items": [{
				"type": "save",
				"title": "SAVE_CENTRE_COLLECTION"
			},{
				"type": "submit",
				"title": "SUBMIT"
			}]
		}
		],
		actions: {
			valueOfDenoms : function(model,form){
				var thousands = 1000*parseInt(model.collectionDemandSummary.denominationThousand,10);
				var twoTthousands = 2000*parseInt(model.collectionDemandSummary.denominationTwoThousand,10);
				var fivehundreds = 500*parseInt(model.collectionDemandSummary.denominationFiveHundred,10);
				var twohundreds = 200*parseInt(model.collectionDemandSummary.denominationTwoHundred,10);
				var hundreds = 100*parseInt(model.collectionDemandSummary.denominationHundred,10);

				var fifties = 50*parseInt(model.collectionDemandSummary.denominationFifty,10);
				var twenties = 20*parseInt(model.collectionDemandSummary.denominationTwenty,10);
				var tens = 10*parseInt(model.collectionDemandSummary.denominationTen,10);

				var fives = 5*parseInt(model.collectionDemandSummary.denominationFive,10);
				var twos = 2*parseInt(model.collectionDemandSummary.denominationTwo,10);
				var ones = parseInt(model.collectionDemandSummary.denominationOne,10);

				var denominationTotal = 0;
				if(!isNaN(twoTthousands)) denominationTotal+=twoTthousands;
				if(!isNaN(thousands)) denominationTotal+=thousands;
				if(!isNaN(fivehundreds)) denominationTotal+=fivehundreds;
				if(!isNaN(twohundreds)) denominationTotal+=twohundreds;
				if(!isNaN(hundreds)) denominationTotal+=hundreds;

				if(!isNaN(fifties)) denominationTotal+=fifties;
				if(!isNaN(twenties)) denominationTotal+=twenties;
				if(!isNaN(tens)) denominationTotal+=tens;

				if(!isNaN(fives)) denominationTotal+=fives;
				if(!isNaN(twos)) denominationTotal+=twos;
				if(!isNaN(ones)) denominationTotal+=ones;
				model.collectionDemandSummary._denominationTotal = denominationTotal;
				return (denominationTotal===model.collected);
			},
			print: function(model){
				console.log(model);
				var groupDemand = model.groupCollectionDemand;
				var summary = model.collectionDemandSummary;
				var printData = [
					{
						"bFont": 2,
						"text": "SAIJA FINANCE PVT. LTD",
						"style": {
							center: true
						}
					},
					{
						"bFont": 1,
						"text": "RECIEPT",
						"style": {
							"center": true
						}
					},
					{
						"bFont": 3,
						"text": "No: <Receipt No here>"
					},
					{
						"bFont": 3,
						"text": "Mr/Mrs. <Group Leader Name Here>"
					},
					{
						"bFont": 3,
						"text": "Group No: <Group No here>"
					},
					{
						"bFont": 3,
						"text": "Group Name: <Group Name here>"
					},
					{
						"bFont": 3,
						"text": ""
					},
					{
						"bFont": 4,
						"text": "Received " + model.collected + " as Loan Installment."
					},
					{
						"bFont": 1,
						"text": ""
					},
					{
						"bFont": 1,
						"text": "2000  x" + summary.denominationTwoThousand
					},
					{
						"bFont": 1,
						"text": "1000  x" + summary.denominationThousand
					},
					{
						"bFont": 1,
						"text": "500   x" + summary.denominationFiveHundred
					},
					{
						"bFont": 1,
						"text": "200   x" + summary.denominationTwoHundred
					},
					{
						"bFont": 1,
						"text": "100   x" + summary.denominationHundred
					},
					{
						"bFont": 2,
						"text": "Total Rs. " + summary._denominationTotal
					},
					{
						"bFont": 2,
						"text": ""
					},
					{
						"bFont": 2,
						"text": ""
					},
					{
						"bFont": 3,
						"text": "Group Head Sign  Local Representative Sign"
					}

				]
				var printObj = {
					"data": printData
				};

				return;
			},
			validateCollection: function(model, formCtrl) {
				if (!(model._storedData && !model._storedData.expired && model.collectionDemandSummary.centreId)) {
					PM.pop('collection-demand', 'Demand not avilable / Centre is mandatory', 5000);
					return false;
				}
				var cds = model.collectionDemandSummary;
				var gcd = model.groupCollectionDemand;
				if (!model.collectionDemandSummary || !model.groupCollectionDemand || !model.groupCollectionDemand.length) {
					PM.pop('collection-demand', 'Collection demand missing. Try again with correct centre.', 6000);
					return false;
				}
				if (!model.collectionDemandSummary.latitude) {
					PM.pop('collection-demand', 'Centre location is mandatory', 5000);
					return false;
				}
				if (!(model.collectionDemandSummary.photoOfCentre || model.$$OFFLINE_FILES$$.collectionDemandSummary$photoOfCentre.data)) {
					PM.pop('collection-demand', 'Centre Photo is mandatory', 5000);
					return false;
				}
				if(!this.valueOfDenoms(model)) {
					PM.pop('collection-demand', 'Denomination Sum Does not Match Collected Amount',5000);
					return false;
				}
				var memberError = false;
				_.each(model.groupCollectionDemand, function(group, gk){
					_.each(group.collectiondemand, function(v,k){
						if (v.error) {
							memberError = v.error + ' for ' + v.customerName + ' on Group - ' + v.groupCode;
						}
					});
				});
				if (memberError) {
					PM.pop('collection-demand', memberError,5000);
					return false;
				}
				return true;
			},
			preSave: function(model, formCtrl) {
				if (!this.validateCollection(model, formCtrl)) {
					return;
				}

				var deferred = $q.defer();
				var fdate = moment(model.collectionDemandSummary.demandDate).format('YYYY-MM-DD');
				var skey = model.collectionDemandSummary.centreId + fdate;
				var off = StorageService.getJSON('CentrePaymentCollection', skey);
				if ((model.$$STORAGE_KEY$$ && !model.$$STORAGE_KEY$$.includes(skey))  && _.isObject(off) && !_.isEmpty(off)) {
					PM.pop('collection-demand', 'Collection already saved in offline for CENTRE: ' + model.collectionDemandSummary.centreName + ' and DATE: ' + model.collectionDemandSummary.demandDate + '. Cannot process again. Please submit existing offline data.', 7000);
					return;
				}
				if (_.isObject(off) && !_.isEmpty(off)) {
					Utils.confirm(model.collectionDemandSummary.centreId+' Demand for '+fdate+' already saved. Do you want to overwrite?', 'Demand overwrite!').then(function(){
						//model._storedData = null;
						model.$$STORAGE_KEY$$ = skey;
						deferred.resolve();
					});
				} else {
					//model._storedData = null;
					model.$$STORAGE_KEY$$ = skey;
					deferred.resolve();
				}
				return deferred.promise;
			},
			submit: function(model, formCtrl, formName) {
				if (!this.validateCollection(model, formCtrl)) {
					return;
				}
				$log.warn(model);
				if (formCtrl.$valid) {
					var cds = model.collectionDemandSummary;
					var gcd = model.groupCollectionDemand;
					var cd = [];
					var cdIds = [];
					if (cds && gcd && gcd.length) {
						cds.demandDate = moment(cds.demandDate).format('YYYY-MM-DD') + "T00:00:00Z";
						_.each(gcd, function(group, gk){
							_.each(group.collectiondemand, function(v,k){
								if (v.amountPaid) {
									cd.push(v);
									cdIds.push(v.id);
								}
							});
						});

						var cashDenomination = {
							"denominationFifty": 0,
							"denominationFive": 0,
							"denominationFiveHundred": 0,
							"denominationHundred": 0,
							"denominationTwoHundred": 0,
							"denominationOne": 0,
							"denominationTen": 0,
							"denominationThousand": 0,
							"denominationTwenty": 0,
							"denominationTwo": 0,
							"denominationTwoThousand": 0
						};

						var collectionDemandSummary = {};
						collectionDemandSummary.centreId = cds.centreId;
						collectionDemandSummary.demandDate = cds.demandDate = moment(cds.demandDate).format('YYYY-MM-DD');
						collectionDemandSummary.latitude = cds.latitude;
						collectionDemandSummary.longitude = cds.longitude;
						collectionDemandSummary.photoOfCentre = cds.photoOfCentre;
						collectionDemandSummary.totalAmount = cds._denominationTotal;
						
						if (model.showDenomination) {
							cashDenomination.denominationFifty = model.collectionDemandSummary.denominationFifty;
							cashDenomination.denominationFive = model.collectionDemandSummary.denominationFive;
							cashDenomination.denominationFiveHundred = model.collectionDemandSummary.denominationFiveHundred;
							cashDenomination.denominationHundred = model.collectionDemandSummary.denominationHundred;
							cashDenomination.denominationTwoHundred = model.collectionDemandSummary.denominationTwoHundred;
							cashDenomination.denominationOne = model.collectionDemandSummary.denominationOne;
							cashDenomination.denominationTen = model.collectionDemandSummary.denominationTen;
							cashDenomination.denominationThousand = model.collectionDemandSummary.denominationThousand;
							cashDenomination.denominationTwoThousand = model.collectionDemandSummary.denominationTwoThousand;
							cashDenomination.denominationTwenty = model.collectionDemandSummary.denominationTwenty;
							cashDenomination.denominationTwo = model.collectionDemandSummary.denominationTwo;

							collectionDemandSummary.cashDenomination = cashDenomination;
						};

						var requestObj = {
							collectionDemandSummary: collectionDemandSummary,
							collectionDemands: _.clone(cd)
						};
						$log.info(requestObj);
						PM.pop('collection-demand', 'Submitting...');
						LoanProcess.collectionDemandUpdate(requestObj,
							function(response){
								$log.info(response);
								PM.pop('collection-demand', 'Collection Submitted Successfully', 3000);
								if(model.$$STORAGE_KEY$$) {
									var fdate = moment(requestObj.collectionDemandSummary.demandDate).format('YYYY-MM-DD');
									var skey = requestObj.collectionDemandSummary.centreId + fdate;
									StorageService.deleteJSON($stateParams.pageName, skey);
								}
								var modidifiedCollectionData = [], modifiedCollectionDemand = [];
								var _offlineKey = formCtrl.$name+"Download" + "__" + SessionStore.getBranch();
								var localStorageCollectionData = StorageService.retrieveJSON(_offlineKey);
								if(localStorageCollectionData) {
									for(var index = 0; index < localStorageCollectionData.length; index++) {
										if(requestObj.collectionDemandSummary.demandDate == 
											localStorageCollectionData[index].collectionDate) {
											var _collectionDemandStored = localStorageCollectionData[index].collectionDemands;
											for (var i =0; i < _collectionDemandStored.length; i++) {
												if(cdIds.indexOf(_collectionDemandStored[i].id) == -1) {
													modifiedCollectionDemand.push(_collectionDemandStored[i]);
												}
											}
											if (modifiedCollectionDemand.length == 0){
												continue;
											}
											localStorageCollectionData[index].collectionDemands = modifiedCollectionDemand;
										}
										modidifiedCollectionData.push(localStorageCollectionData[index]);
									}
									StorageService.storeJSON(model._offlineKey, modidifiedCollectionData);
									if (modifiedCollectionDemand.length == 0 || model.$$STORAGE_KEY$$) irfNavigator.goBack();
								}

							},
							function(errorResponse){
								$log.error(errorResponse);
								PM.pop('collection-demand', 'Oops. Some error.', 2000);
								PageHelper.showErrors(errorResponse);
							});
					} else {
						PM.pop('collection-demand', 'Collection demand missing. Try again with correct centre.', 7000);
					}
				}
			}
		},
		schema: {
			"type": "object",
			"properties": {
				"collectionDemandSummary": {
					"type": "object",
					"required": ["centreId", "latitude", "longitude", "photoOfCentre"],
					"properties": {
						"centreId": {
							"title": "CENTRE",
							"type": "number"
						},
						"centreName": {
		                    "type": ["string","null"],
		                    "title": "CENTRE",
		                },
						"allAttendance": {
							"title": "ALL_ATTENDANCE",
							"type": "boolean"
						},
						"demandDate": {
							"title": "DEMAND_DATE",
							"type": "string"
						},
						"latitude": {
							"type": "string"
						},
						"langitude": {
							"type": "string"
						},
						"photoOfCentre": {
							"type": "string",
							"title": "CENTRE_PHOTO",
							"category": "Collection",
							"subCategory": "PHOTOOFCENTRE"
						},
						"denominationTwoThousand": {
							"type": "integer",
							"title": "2000 x"
						},
						"denominationThousand": {
							"type": "integer",
							"title": "1000 x",
						},
						"denominationFiveHundred": {
							"type": "integer",
							"title": "500 x"
						},
						"denominationHundred": {
							"type": "integer",
							"title": "100 x"
						},
						"denominationTwoHundred": {
							"type": "integer",
							"title": "200 x"
						},
						"denominationFifty": {
							"type": "integer",
							"title": "50 x"
						},
						"denominationTwenty": {
							"type": "integer",
							"title": "20 x"
						},
						"denominationTen": {
							"type": "integer",
							"title": "10 x"
						},
						"denominationFive": {
							"type": "integer",
							"title": "5 x"
						},
						"denominationTwo": {
							"type": "integer",
							"title": "2 x"
						},
						"denominationOne": {
							"type": "integer",
							"title": "1 x"
						}
					}
				},
				"groupCollectionDemand": {
					"type": "array",
					"title": "Group",
					"items": {
						"type": "object",
						"properties": {
							"groupCode": {
								"type": "string",
								"title": "GROUP_CODE"
							},
							"collectiondemand": {
								"type": "array",
								"title": "MEMBER",
								"items": {
									"type": "object",
									"properties": {
										"customerId": {
											"type": "string"
										},
										"branch": {
											"type": "string",
											"title": "BRANCH"
										},
										"accountNumber": {
											"type": "string",
											"title": "ACCOUNT_NO"
										},
										"customerName": {
											"type": "string",
											"title": "CUSTOMER_NAME"
										},
										"groupCode": {
											"type": "string",
											"title": "GROUP_CODE"
										},
										"demandDate": {
											"type": "string",
											"title": "DEMAND_DATE"
										},
										"installmentAmount": {
											"type": "number",
											"title": "INSTALLMENT_AMOUNT"
										},
										"fees": {
											"type": "number",
											"title": "FEES"
										},
										"totalToBeCollected": {
											"type": "number",
											"title": "TOTAL_TO_BE_COLLECTED"
										},
										"amountPaid": {
											"type": "number",
											"title": "AMOUNT_PAID"
										},
										"attendance": {
											"type": "boolean",
											"title": "ATTENDANCE"
										},
										"mode": {
											"type": "string",
											"title": "PAYMENT_MODE"
										},
										"centreId": {
											"type": "number",
											"title": "CENTRE"
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};
}]);
