
irf.pages.controller("Customer360Ctrl",
["$log", "$scope", "$stateParams","Queries", "$q", "formHelper", "SessionStore", "PagesDefinition", "Enrollment",
"entityManager", "Utils", "PageHelper", "$filter", "$httpParamSerializer", "AuthTokenHelper","irfProgressMessage","$http",
function($log, $scope, $stateParams,Queries, $q, formHelper, SessionStore, PagesDefinition, Enrollment,
	entityManager, Utils, PageHelper, $filter, $httpParamSerializer, AuthTokenHelper,irfProgressMessage,$http){
	$log.info("Customer360 loaded");

	$scope.branch = SessionStore.getBranch();
	$scope.role = SessionStore.getRole();
	$scope.customerId = $stateParams.pageId;
	var siteCode = SessionStore.getGlobalSetting('siteCode');
	$log.info($stateParams);
	//$scope.siteCode=$stateParams.pageData;
	$scope.formHelper = formHelper;
	
	var getCustomerProfilePageUrl = function() {
		if (siteCode == 'sambandh') {
			return "Page/Engine/sambandh.customer.IndividualEnrollment3";
		}  else if (siteCode == 'saija') {
			return "Page/Engine/customer.IndividualEnrollmentStage2";
		} else if(siteCode == 'witfin') {
			return "Page/Engine/witfin.customer360.CustomerProfile";
		} else if(siteCode == 'pahal') {
			return "Page/Engine/pahal.customer360.CustomerProfile";
		}
		else if(siteCode == 'shramsarathi'){
			return "Page/Engine/shramsarathi.customer360.CustomerProfile";
		}else {
			return "Page/Engine/customer360.CustomerProfile";
		}

	}

	var getBusinessProfilePageUrl = function() {
		if(siteCode == 'witfin') {
			return "Page/Engine/witfin.customer360.BusinessProfile";
		}else if(siteCode == 'pahal') {
			return "Page/Engine/pahal.customer360.BusinessProfile";
		} else {
			return "Page/Engine/customer360.BusinessProfile";
		}
	}

	var customerDefinition = {
		"title": "CUSTOMER_360",
		"items": [
			getCustomerProfilePageUrl(),
			{
				"title": "LOANS",
				"iconClass": "fa fa-key",
				"items": [
					{
						"title": "NEW_LOAN",
						"iconClass": "fa fa-key",
						"items": [
							"Page/Engine/Loans.NewJewel",
							"Page/Engine/Loans.NewMEL"
						]
					},
					"Page/Engine/customer360.loans.View",
					"Page/Engine/customer360.loans.Service"
				]
			},
			{
                "title": "CREDIT_BUREAU",
                "iconClass": "fa fa-user",
                "items": [
                    {
                        "title": "CREDIT_BUREAU",
                        "iconClass": "fa fa-user",
                        "items": [
                            ]
                    },
                    "Page/Engine/customer360.Idencheck",
					"Page/Engine/customer360.CreditBureauResults"
                ]
            } ,
			{
				"title": "REQUEST_RECAPTURE",
				"shortTitle": "REQUEST",
				"iconClass": "fa fa-lightbulb-o",
				"items": [
					"Page/Engine/customer360.RequestRecapturePhoto",
					"Page/Engine/customer360.RequestRecaptureFingerprint",
					"Page/Engine/customer360.RequestRecaptureGPS"
				]
			},
			"Page/Engine/customer360.Recapture",
			"Page/Engine/customer360.CustomerHistorySummary",
			"Page/Engine/customer360.CustomerDeathMarking",
			"Page/Engine/customer360.loans.CustomerGroupsView",
			"Page/Engine/customer360.ViewInsurance"
		]
	};

	var witfinCustomerDefinition = {
		"title": "CUSTOMER_360",
		"items": [
			getCustomerProfilePageUrl(),
			{
				"title": "LOANS",
				"iconClass": "fa fa-key",
				"items": [
					{
						"title": "NEW_LOAN",
						"iconClass": "fa fa-key",
						"items": [
							"Page/Engine/Loans.NewJewel",
							"Page/Engine/Loans.NewMEL"
						]
					},
					"Page/Engine/customer360.loans.View",
					"Page/Engine/customer360.loans.Service"
				]
			},
			{
                "title": "CREDIT_BUREAU",
                "iconClass": "fa fa-user",
                "items": [
                    {
                        "title": "CREDIT_BUREAU",
                        "iconClass": "fa fa-user",
                        "items": [
                            ]
                    },
                    "Page/Engine/customer360.Idencheck",
					"Page/Engine/customer360.CreditBureauResults"
                ]
            } ,
			{
				"title": "REQUEST_RECAPTURE",
				"shortTitle": "REQUEST",
				"iconClass": "fa fa-lightbulb-o",
				"items": [
					"Page/Engine/customer360.RequestRecapturePhoto",
					"Page/Engine/customer360.RequestRecaptureFingerprint",
					"Page/Engine/customer360.RequestRecaptureGPS"
				]
			},
			"Page/Engine/customer360.CustomerHistorySummary",
			"Page/Engine/customer360.CustomerDeathMarking"
		]
	};
	//"Page/CustomerHistory",

	var witfinCustomerDefinition = {
		"title": "CUSTOMER_360",
		"items": [
			getCustomerProfilePageUrl(),
			{
				"title": "LOANS",
				"iconClass": "fa fa-key",
				"items": [
					{
						"title": "NEW_LOAN",
						"iconClass": "fa fa-key",
						"items": [
							"Page/Engine/Loans.NewJewel",
							"Page/Engine/Loans.NewMEL"
						]
					},
					"Page/Engine/customer360.loans.View",
					"Page/Engine/customer360.loans.Service"
				]
			},
			{
                "title": "CREDIT_BUREAU",
                "iconClass": "fa fa-user",
                "items": [
                    {
                        "title": "CREDIT_BUREAU",
                        "iconClass": "fa fa-user",
                        "items": [
                            ]
                    },
                    "Page/Engine/customer360.Idencheck",
					"Page/Engine/customer360.CreditBureauResults"
                ]
            } ,
			{
				"title": "REQUEST_RECAPTURE",
				"shortTitle": "REQUEST",
				"iconClass": "fa fa-lightbulb-o",
				"items": [
					"Page/Engine/customer360.RequestRecapturePhoto",
					"Page/Engine/customer360.RequestRecaptureFingerprint",
					"Page/Engine/customer360.RequestRecaptureGPS"
				]
			},
			"Page/Engine/customer360.CustomerHistorySummary",
			"Page/Engine/customer360.CustomerDeathMarking",
			"Page/Engine/customer360.loans.CustomerGroupsView",
			"Page/Engine/customer360.ViewInsurance"
		]
	};
	//"Page/CustomerHistory",

	var enrollmentDefinition = {
		"title": "CUSTOMER_360",
		"items": [
			"Page/Engine/customer360.EnrollmentProfile",
			"Page/Engine/customer360.loans.View",
			"Page/Engine/customer360.loans.Service",
			{
				"title": "REQUEST_RECAPTURE",
				"shortTitle": "REQUEST",
				"iconClass": "fa fa-lightbulb-o",
				"items": [
					"Page/Engine/customer360.RequestRecapturePhoto",
					"Page/Engine/customer360.RequestRecaptureFingerprint",
					"Page/Engine/customer360.RequestRecaptureGPS"
				]
			},
			"Page/Adhoc/customer360.FinancialWellbeingReport",
			"Page/Engine/customer360.CustomerHistorySummary",
			"Page/Engine/customer360.Recapture",
			"Page/Engine/customer360.CustomerSummaryView",
			"Page/Engine/customer360.CustomerDeathMarking",
			"Page/Engine/customer360.loans.CustomerGroupsView",
			"Page/Engine/customer360.ViewInsurance"

		]
	};

	var enterpriseDefinition = {
		"title": "BUSINESS_360",
		"items": [
			getBusinessProfilePageUrl(),
			{
				"title": "LOANS",
				"iconClass": "fa fa-key",
				"items": [
					"Page/Engine/loans.individual.booking.LoanInput",
					"Page/Engine/customer360.loans.View",
					"Page/Engine/customer360.loans.Service"
				]
			},
			{
				"title": "REQUEST_RECAPTURE",
				"shortTitle": "REQUEST",
				"iconClass": "fa fa-lightbulb-o",
				"items": [
					"Page/Engine/customer360.RequestRecapturePhoto",
					"Page/Engine/customer360.RequestRecaptureFingerprint",
					"Page/Engine/customer360.RequestRecaptureGPS"
				]
			},
			"Page/CustomerHistory",
			"Page/Engine/customer360.Recapture"
		]
	};

	var witfinEnterpriseDefinition = {
		"title": "BUSINESS_360",
		"items": [
			getBusinessProfilePageUrl(),
			{
				"title": "LOANS",
				"iconClass": "fa fa-key",
				"items": [
					"Page/Engine/loans.individual.booking.LoanInput",
					"Page/Engine/customer360.loans.View",
					"Page/Engine/customer360.loans.Service"
				]
			},
			{
				"title": "REQUEST_RECAPTURE",
				"shortTitle": "REQUEST",
				"iconClass": "fa fa-lightbulb-o",
				"items": [
					"Page/Engine/customer360.RequestRecapturePhoto",
					"Page/Engine/customer360.RequestRecaptureFingerprint",
					"Page/Engine/customer360.RequestRecaptureGPS"
				]
			},
			"Page/Engine/customer360.CustomerHistorySummary"
		]
	};

	var customerPortfolioForm = [{
		"type": "box",
		"title": "PORTFOLIO",
		"colClass": "col-sm-12",
		"items": [{
			"type": "section",
			"htmlClass": "row",
			"items": [{
				"type": "section",
				"htmlClass": "col-sm-4",
				"items": [{
					"key": "customer.photoImageId",
					"type": "file",
					"fileType": "image/*",
					"viewParams": function(modelValue, form, model) {
						return {
							customerId: model.customer.id
						};
					},
					"readonly": true,
					"notitle": true
				}]
			},{
				"type": "section",
				"htmlClass": "col-sm-6",
				"items": [{
					"readonly": true,
					"key": "customer.nameWithAge",
					"title": "CUSTOMER_NAME"
				},{
					"readonly": true,
					"key": "customer.dateOfBirth",
					"title": "T_DATEOFBIRTH",
					"type": "date"
				},{
					"readonly": true,
					"key": "customer.mobilePhone",
					"title": "MOBILE_PHONE"
				},{
					"readonly": true,
					"key": "customer.identityProofNo",
					"titleExpr": "model.customer.identityProof | translate"
				},{
					"readonly": true,
					"key": "customer.idAndBcCustId",
					"title": "Id & Legacy Cust Id",
					"titleExpr": "('ID'|translate) + ' & ' + ('BC_CUST_ID'|translate)"
				},{
					"readonly": true,
					"key": "customer.urnNo",
					"title": "URN_NO"
				}, {
					"key": "customerBlockedStatusHtml",
					"condition":"model.pageConfig.isBlockAccess",
					"type": "html",
					"title": "STATUS"
				},{
					"key":"customer.blockingRemarks",
					"condition":"model.customer.blocked && model.pageConfig.isBlockAccess && model.additions.blockStatusChange",
					"type": "string",
					"required":true,
					'title': "REASON_FOR_BLOCKING",
					// "titleExpr": "REASON_FOR_+(model.customer.blocked ? 'BLOCK':'UNBLOCK'",
				},
				{
					"key":"customer.blockingRemarks",
					"condition":"!model.customer.blocked && model.pageConfig.isBlockAccess && model.additions.blockStatusChange",
					"type": "string",
					"required":true,
					'title': "REASON_FOR_UNBLOCKING",
					// "titleExpr": "REASON_FOR_+(model.customer.blocked ? 'BLOCK':'UNBLOCK'",
				},
				{
					"key":"customer.blockingRemarks",
					"condition":"model.customer.blocked && model.pageConfig.isBlockAccess && !model.additions.blockStatusChange",
					"type": "string",
					// "required":true,
					"readonly":true,
					'title': "REASON_FOR_BLOCKING",
					// "titleExpr": "REASON_FOR_+(model.customer.blocked ? 'BLOCK':'UNBLOCK'",
				},
				{
					"type":"button",
					condition:"model.additions.blockStatusChange",
					"title":"SUBMIT",
					onClick:"actions.modifyBlockedStatus(model,false)"
				}
				
			]
			},{
				"type": "section",
				"htmlClass": "col-sm-2 hidden-xs",
				"items": []
			}]
		}]
	}];

	var enterprisePortfolioForm = [{
		"type": "box",
		"title": "PORTFOLIO",
		"colClass": "col-sm-12",
		"items": [{
			"type": "section",
			"htmlClass": "row",
			"items": [/*{
				"type": "section",
				"htmlClass": "col-sm-4",
				"items": [{
					"key": "customer.photoImageId",
					"type": "file",
					"fileType": "image/*",
					"viewParams": function(modelValue, form, model) {
						return {
							customerId: model.customer.id
						};
					},
					"readonly": true,
					"notitle": true
				}]
			},*/{
				"type": "section",
				"htmlClass": "col-sm-8",
				"items": [{
					"readonly":true,
					"key": "customer.firstName",
					"title": "ENTITY_NAME"
				},{
					"readonly":true,
					"key": "customer.enterprise.companyOperatingSince",
					"title": "OPERATING_SINCE",
					"type": "date"
				},{
					"readonly":true,
					"key": "customer.latitude",
					"title": "BUSINESS_LOCATION",
					"type": "geotag",
					"latitude": "customer.latitude",
					"longitude": "customer.longitude"
				},{
					"readonly":true,
					"key": "customer.urnNo",
					"title": "URN_NO"
				}, {
					"key": "customerBlockedStatusHtml",
					"condition":"model.pageConfig.isBlockAccess",
					"type": "html",
					"title": "STATUS"
				},{
					"key":"customer.blockingRemarks",
					"condition":"model.customer.blocked && model.pageConfig.isBlockAccess && model.additions.blockStatusChange",
					"type": "string",
					"required":true,
					'title': "REASON_FOR_BLOCKING",
					// "titleExpr": "REASON_FOR_+(model.customer.blocked ? 'BLOCK':'UNBLOCK'",
				},
				{
					"key":"customer.blockingRemarks",
					"condition":"!model.customer.blocked && model.pageConfig.isBlockAccess && model.additions.blockStatusChange",
					"type": "string",
					"required":true,
					'title': "REASON_FOR_UNBLOCKING",
					// "titleExpr": "REASON_FOR_+(model.customer.blocked ? 'BLOCK':'UNBLOCK'",
				},
				{
					"key":"customer.blockingRemarks",
					"condition":"model.customer.blocked && model.pageConfig.isBlockAccess && !model.additions.blockStatusChange",
					"type": "string",
					// "required":true,
					"readonly":true,
					'title': "REASON_FOR_BLOCKING",
					// "titleExpr": "REASON_FOR_+(model.customer.blocked ? 'BLOCK':'UNBLOCK'",
				},
				{
					"type":"button",
					condition:"model.additions.blockStatusChange",
					"title":"SUBMIT",
					onClick:"actions.modifyBlockedStatus(model,false)"
				}
			
			]
			},{
				"type": "section",
				"htmlClass": "col-sm-2 hidden-xs",
				"items": []
			}]
		}]
	}];

	var reportBox = {
		"type": "box",
		"title": "REPORTS",
		"colClass": "col-sm-12",
		"items": [{
			"type": "fieldset",
			"title": "Customer Statement"
		},{
			"type": "section",
			"htmlClass": "row",
			"items": [{
				"type": "section",
				"condition": "model.pageConfig && model.pageConfig.customerStatementReportFromDate == 'show'",
				"htmlClass": "col-sm-5",
				"items": [{
					"key": "reports.fromDate",
					"title": "FROM_DATE",
					"type": "date"
				}]
			},{
				"type": "section",
				"htmlClass": "col-sm-5",
				"items": [{
					"key": "reports.toDate",
					"title": "TO_DATE",
					"type": "date"
				}]
			},{
				"type": "section",
				"htmlClass": "col-sm-2",
				"items": [{
					"notitle": true,
					"title": "DOWNLOAD",
					"type": "button",
					"fieldHtmlClass": "btn-block",
					"onClick": function(model, form) {
						PageHelper.clearErrors();
						if (model.pageConfig && model.pageConfig.customerStatementReportFromDate == 'show'){
							if(!model.reports || !model.reports.fromDate || !model.reports.toDate) {
								PageHelper.setError({message:"'From' date & 'To' date are required"});
								return;
							} else if (moment(model.reports.fromDate, SessionStore.getSystemDateFormat()).isAfter(moment(model.reports.toDate, SessionStore.getSystemDateFormat()), 'day')) {
								PageHelper.setError({message:"'From' date should be less than 'To' date"});
								return;
							} else if (moment(model.reports.toDate, SessionStore.getSystemDateFormat()).isAfter(moment(), 'day')) {
								PageHelper.setError({message:"'To' date cannot exceed today"});
								return;
							}
							var requestParams = {
								auth_token: AuthTokenHelper.getAuthData().access_token,
								report_name: "customer_statement",
								customer_id: model.customer.id,
								from_date: model.reports.fromDate,
								to_date: model.reports.toDate
							};
						} else {
							if(!model.reports || !model.reports.toDate) {
								PageHelper.setError({message:"'To' date is required"});
								return;
							} else if (moment(model.reports.toDate, SessionStore.getSystemDateFormat()).isAfter(moment(), 'day')) {
								PageHelper.setError({message:"'To' date cannot exceed today"});
								return;
							}
							var requestParams = {
								auth_token: AuthTokenHelper.getAuthData().access_token,
								report_name: "customer_statement",
								customer_id: model.customer.id,
								to_date: model.reports.toDate
							};
						}
						if (siteCode == 'kinara') {

						    var reqData = {}
						    reqData.auth_data = {
						        'auth_token': AuthTokenHelper.getAuthData().access_token,
						    }
						    reqData.report_name = 'customer_statement_report';
						    reqData.filters = [];
						    reqData.filters.push({
						        "operator": "=",
						        "parameter": "from_date",
						        "value": model.reports.fromDate
						    });
						    reqData.filters.push({
						        "operator": "=",
						        "parameter": "to_date",
						        "value": model.reports.toDate
						    });
						    reqData.filters.push({
						        "operator": "=",
						        "parameter": "urn",
						        "value": model.customer.urnNo
						    });

						    irfProgressMessage.pop("Reports", "Downloading Report. Please wait...");
						    $http.post(
						        irf.BI_BASE_URL + '/newdownload.php',
						        reqData, {
						            responseType: 'arraybuffer'
						        }
						    ).then(function (response) {
						        var headers = response.headers();
						        if (headers['content-type'].indexOf('json') != -1 && !headers["content-disposition"]) {
						            var decodedString = String.fromCharCode.apply(null, new Uint8Array(response.data));
						            console.log(decodedString);
						            PageHelper.showErrors({
						                data: {
						                    error: decodedString
						                }
						            });
						            irfProgressMessage.pop("Reports", "Report download failed.", 5000);
						            return;
						        }
						        var blob = new Blob([response.data], {
						            type: headers['content-type']
						        });
						        if (!$("#reportdownloader").length) {
						            var l = document.createElement('a');
						            l.id = "reportdownloader";
						            document.body.appendChild(l);
						        }
						        $("#reportdownloader").css({
						            "position": "absolute",
						            "height": "-1px",
						            "top": "-100px",
						            "left": "-100px",
						            "width": "-100px",
						        });
						        var link = document.getElementById("reportdownloader");
						        link.href = window.URL.createObjectURL(blob);

						        if (headers["content-disposition"] && headers["content-disposition"].split('filename=').length == 2) {
						            var filename = headers["content-disposition"].split('filename=')[1];
						            link.download = filename.replace(/"/g, "");
						        } else {
						            link.download = SessionStore.getLoginname() + '_' + model.selectedReport.name + '_' + moment().format('YYYYMMDDhhmmss');
						        }
						        link.click();
						        irfProgressMessage.pop("Reports", "Report downloaded.", 5000);
						    }, function (err) {
						        var decodedString = String.fromCharCode.apply(null, new Uint8Array(err.data));
						        PageHelper.showErrors({
						            data: {
						                error: decodedString
						            }
						        });
						        irfProgressMessage.pop("Reports", "Report download failed.", 5000);
						    }).finally(function () {
						        PageHelper.hideLoader();
						    });
						}
						else{

							var requestParams = {
								auth_token: AuthTokenHelper.getAuthData().access_token,
								report_name: "customer_statement",
								customer_id: model.customer.id,
								from_date: model.reports.fromDate,
								to_date: model.reports.toDate
							};
							url = irf.BI_BASE_URL + "/download.php?" + $httpParamSerializer(requestParams);
							Utils.downloadFile(url);
						}
					}
				}]
			}]
		}]
	};

	Enrollment.getSchema().$promise.then(function(customerSchemaResponse) {
		Enrollment.get({
			id: $scope.customerId
		}).$promise.then(function(response) {
			var fullDefinition = customerDefinition;
			if (siteCode == "witfin") {
				fullDefinition = witfinCustomerDefinition;
			}
			if (response.customerType === 'Enterprise') {
				fullDefinition = enterpriseDefinition;
			}
			if (response.customerType === 'Enterprise' && siteCode == "witfin") {
				fullDefinition = witfinEnterpriseDefinition;
			}
			if (siteCode == "KGFS") {
				fullDefinition = enrollmentDefinition;
			}
			$log.info("siteCode:" + $scope.siteCode);
			PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
				$scope.dashboardDefinition = resp;
				$scope.customerSchema = customerSchemaResponse;
				$scope.pageConfig = {};
				PagesDefinition.getRolePageConfig("Page/customer360").then(function(config) {
					if (config) {
						$scope.pageConfig = config;
					}
				}).finally(function() {
					$scope.initialize(response);
				});
			});
		}, function(errorResponse) {
			PageHelper.showErrors(errorResponse);
		});
	});

	$scope.initialize = function(data) {
		$log.info(data);
		$scope.model = {
			customer: data,
			actions: $scope.actions,
			customerBlockedStatusHtml: '{{(model.customer.blocked?"BLOCKED":"ACTIVE")|translate}} (<a href="" ng-click="model.actions.modifyBlockedStatus(model,true)">{{(model.customer.blocked?"UNBLOCK":"BLOCK")|translate}}</a>)'
		};
		$scope.introFormName = "introForm";
		$scope.pageTitle = 'CUSTOMER_360';
		$scope.model.pageConfig = $scope.pageConfig;
		if (data.customerType === 'Enterprise') {
			$scope.introForm = enterprisePortfolioForm
			//$scope.pageTitle = 'BUSINESS_360';
		} else {
			$scope.introForm = customerPortfolioForm;
		}

		$scope.introForm.push(reportBox);
		$log.info($scope.pageTitle);

		if($scope.siteCode == "KGFS")
		{
			$scope.introForm = customerPortfolioForm;
		}

		$scope.model.customer.idAndBcCustId = data.id + ' / ' + data.bcCustId;
		$scope.model.customer.fullName = Utils.getFullName(data.firstName, data.middleName, data.lastName);

		$scope.dashboardDefinition.title = /*(data.urnNo ? (data.urnNo + ": ") : "") + */$scope.model.customer.fullName;

		$scope.model.customer.idAndUrn = data.id + ' | ' + data.urnNo;

		$scope.model.customer.age = moment().diff(moment(data.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
		$scope.model.customer.nameWithAge = $scope.model.customer.fullName + ' (' + data.age + ')';
		$scope.model.pageConfig = {
			'customerStatementReportFromDate': 'show'
		};

		PagesDefinition.getPageConfig("Page/customer360").then(function(data){
			$log.info(data);
			$scope.model.pageConfig.customerStatementReportFromDate = data.customerStatementReportFromDate;
		});

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.CustomerProfile'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.CustomerProfile'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			entityManager.setModel(menu.stateParams.pageName, $scope.model);
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer.IndividualEnrollment3']) {
			$scope.dashboardDefinition.$menuMap['Page/Engine/customer.IndividualEnrollment3'].onClick = function(event, menu) {
				menu.stateParams.pageId = $scope.customerId;
				return $q.resolve(menu);
			};
		}

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer.IndividualEnrollmentStage2']) {
			$scope.dashboardDefinition.$menuMap['Page/Engine/customer.IndividualEnrollmentStage2'].onClick = function(event, menu) {
				menu.stateParams.pageId = $scope.customerId;
				return $q.resolve(menu);
			};
		}

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/sambandh.customer.IndividualEnrollment3']) {
			$scope.dashboardDefinition.$menuMap['Page/Engine/sambandh.customer.IndividualEnrollment3'].onClick = function(event, menu) {
				menu.stateParams.pageId = $scope.customerId;
				return $q.resolve(menu);
			};
		}

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.EnrollmentProfile'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.EnrollmentProfile'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			menu.stateParams.pageData = menu.stateParams.pageData || {};
			menu.stateParams.pageData.enabletrue = !!$scope.pageConfig.readonly;
			entityManager.setModel(menu.stateParams.pageName, $scope.model);
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.BusinessProfile'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.BusinessProfile'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			entityManager.setModel(menu.stateParams.pageName, $scope.model);
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/witfin.customer360.BusinessProfile'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/witfin.customer360.BusinessProfile'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			entityManager.setModel(menu.stateParams.pageName, $scope.model);
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/witfin.customer360.CustomerProfile'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/witfin.customer360.CustomerProfile'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			entityManager.setModel(menu.stateParams.pageName, $scope.model);
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/shramsarathi.customer360.CustomerProfile'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/shramsarathi.customer360.CustomerProfile'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			entityManager.setModel(menu.stateParams.pageName, $scope.model);
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/pahal.customer360.BusinessProfile'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/pahal.customer360.BusinessProfile'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			entityManager.setModel(menu.stateParams.pageName, $scope.model);
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/pahal.customer360.CustomerProfile'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/pahal.customer360.CustomerProfile'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			entityManager.setModel(menu.stateParams.pageName, $scope.model);
			return $q.resolve(menu);
		};

		var requestMenu = [$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.RequestRecapturePhoto'],
			$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.RequestRecaptureFingerprint'],
			$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.RequestRecaptureGPS']];
		_.each(requestMenu, function(v,k){
			if (v) {
				v.onClick = function(event, menu) {
					menu.stateParams.pageId = $scope.customerId + menu.stateParams.pageId.substring(menu.stateParams.pageId.indexOf(':'));
					entityManager.setModel(menu.stateParams.pageName, $scope.model);
					return $q.resolve(menu);
				};
			}
		});

		if ($scope.dashboardDefinition.$menuMap['Page/CustomerHistory'])
		$scope.dashboardDefinition.$menuMap['Page/CustomerHistory'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap['Page/Adhoc/customer360.FinancialWellbeingReport'])
		$scope.dashboardDefinition.$menuMap['Page/Adhoc/customer360.FinancialWellbeingReport'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			return $q.resolve(menu);
		};


		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.CustomerSummaryView'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.CustomerSummaryView'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			return $q.resolve(menu);
		};



		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.CustomerHistorySummary'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.CustomerHistorySummary'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.Idencheck'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.Idencheck'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			return $q.resolve(menu);
		};
		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.CreditBureauResults'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.CreditBureauResults'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.CustomerDeathMarking'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.CustomerDeathMarking'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.loans.View'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.loans.View'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.model.customer.urnNo;
			menu.stateParams.pageData = {pageType:'View'};
			return $q.resolve(menu);
		};

        if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.loans.Service'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.loans.Service'].onClick = function(event, menu) {
			menu.stateParams.pageData = {pageType:'Service'};
			menu.stateParams.pageId = $scope.model.customer.urnNo;
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.loans.CustomerGroupsView'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.loans.CustomerGroupsView'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.model.customer.urnNo;
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.Recapture'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.Recapture'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.model.customer.id + ':FINGERPRINT';
			entityManager.setModel(menu.stateParams.pageName, $scope.model);
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.booking.LoanInput"])
		$scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.booking.LoanInput"].onClick = function(event, menu) {
			var loanInput = {};
			try {
				loanInput = {
					loanAccount: {
						bankId: $filter('filter')(formHelper.enum("bank").data, {name:SessionStore.getBankName()}, true)[0].code,
						branchId: $filter('filter')(formHelper.enum("branch").data, {name:$scope.model.customer.kgfsName}, true)[0].code,
						urnNo: $scope.model.customer.urnNo,
						customerId: $scope.model.customer.id,
						loanCentre: {
							branchId: $scope.model.customer.kgfsName,
							centreId: $scope.model.customer.centreId
						}
					},
					additional: {
						branchName: $scope.model.customer.kgfsName
					},
					customer: {
						firstName: $scope.model.customer.firstName
					}
				};
			} catch (e) {}
			entityManager.setModel(menu.stateParams.pageName, loanInput);
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.ViewInsurance'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.ViewInsurance'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			return $q.resolve(menu);
		};

	};

	$scope.initializeSF = function(model, form, formCtrl) {
	};

	$scope.actions = {
		modifyBlockedStatus: function(model,api) {
			if(api){
				model.customer.blocked = !model.customer.blocked;
				model.customer.blockingRemarks = null;
				model.additions = {};
				model.additions.blockStatusChange = true;
				return;
			}
			var message = model.customer.blocked? "Do you want to activate the customer?": "Do you want to block the customer?";
			Utils.confirm(message).then(function() {
				PageHelper.showBlockingLoader("Changing...");
				if(model.customer.blockingRemarks == null || model.customer.blockingRemarks == ""){
					PageHelper.showProgress('Blocking','Block Remarks Required',2000);
					return
				}
				Enrollment.modifyBlockedStatus({
					customerId: model.customer.id,
					isBlocked : model.customer.blocked,
					blockingRemarks : model.customer.blockingRemarks
				}).$promise.then(function(response){
					model.customer.blocked = response.blocked;
					model.customer.version = response.version;
					model.customer.blockStatusChangedBy = response.blockStatusChangedBy;
					model.customer.blockStatusChangedAt = response.blockStatusChangedAt;
					model.additions.blockStatusChange = false;
				}, PageHelper.showErrors).finally(PageHelper.hideBlockingLoader);
			});
		}
	};

}]);
