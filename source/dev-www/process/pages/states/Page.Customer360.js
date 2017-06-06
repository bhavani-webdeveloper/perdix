irf.pages.controller("Customer360Ctrl",
["$log", "$scope", "$stateParams", "$q", "formHelper", "SessionStore", "PagesDefinition", "Enrollment", 
"entityManager", "Utils",
function($log, $scope, $stateParams, $q, formHelper, SessionStore, PagesDefinition, Enrollment, 
	entityManager, Utils){
	$log.info("Customer360 loaded");

	$scope.branch = SessionStore.getBranch();
	$scope.userid = SessionStore.getLoginname();
	$scope.role = SessionStore.getRole();
	$scope.customerId = $stateParams.pageId;
	$scope.formHelper = formHelper;

	var fullDefinition = {
		"title": "CUSTOMER_360",
		"items": [
			"Page/Engine/customer360.CustomerProfile",
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

	PagesDefinition.getUserAllowedDefinition($scope.userid, fullDefinition).then(function(resp){
		$scope.dashboardDefinition = resp;

		Enrollment.getSchema().$promise.then(function(response){
			$scope.customerSchema = response;

			Enrollment.get({id:$scope.customerId}).$promise.then(function(response){
				$scope.initialize(response);
			}, function(errorResponse){

			});
		});

	});

	$scope.initialize = function(data) {
		$log.info(data);
		$scope.model = {};
		$scope.model.customer = data;

		$scope.model.customer.idAndBcCustId = data.id + ' / ' + data.bcCustId;
		$scope.model.customer.fullName = Utils.getFullName(data.firstName, data.middleName, data.lastName);

		$scope.dashboardDefinition.title = (data.urnNo ? (data.urnNo + ": ") : "")
			+ $scope.model.customer.fullName;

		$scope.model.customer.idAndUrn = data.id + ' | ' + data.urnNo;

		$scope.model.customer.age = moment().diff(moment(data.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
		$scope.model.customer.nameWithAge = $scope.model.customer.fullName + ' (' + data.age + ')';

		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.CustomerProfile'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			entityManager.setModel(menu.stateParams.pageName, $scope.model);
			return $q.resolve(menu);
		};
		var requestMenu = [$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.RequestRecapturePhoto'],
			$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.RequestRecaptureFingerprint'],
			$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.RequestRecaptureGPS']];
		_.each(requestMenu, function(v,k){
			v.onClick = function(event, menu) {
				menu.stateParams.pageId = $scope.customerId + menu.stateParams.pageId.substring(menu.stateParams.pageId.indexOf(':'));
				entityManager.setModel(menu.stateParams.pageName, $scope.model);
				return $q.resolve(menu);
			};
		});
		$scope.dashboardDefinition.$menuMap['Page/CustomerHistory'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			return $q.resolve(menu);
		};
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.loans.View'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.model.customer.urnNo;
			return $q.resolve(menu);
		};
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.loans.Service'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.model.customer.urnNo;
			return $q.resolve(menu);
		};
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.Recapture'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.model.customer.id + ':FINGERPRINT';
			entityManager.setModel(menu.stateParams.pageName, $scope.model);
			return $q.resolve(menu);
		};
	};

	$scope.initializeSF = function(model, form, formCtrl) {
		$scope.introFormName = "introForm";

		$scope.introForm = [{
			"type": "box",
			"title": "PORTFOLIO",
			"colClass": "col-sm-12",
			"readonly": true,
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
						"key": "customer.nameWithAge",
						"title": "CUSTOMER_NAME"
					},{
						"key": "customer.dateOfBirth",
						"title": "T_DATEOFBIRTH",
						"type": "date"
					},{
						"key": "customer.mobilePhone",
						"title": "MOBILE_PHONE"
					},{
						"key": "customer.identityProofNo",
						"titleExpr": "model.customer.identityProof | translate"
					},{
						"key": "customer.idAndBcCustId",
						"title": "Id & Legacy Cust Id",
						"titleExpr": "('ID'|translate) + ' & ' + ('BC_CUST_ID'|translate)"
					},{
						"key": "customer.urnNo",
						"title": "URN_NO"
					}]
				},{
					"type": "section",
					"htmlClass": "col-sm-2 hidden-xs",
					"items": []
				}]
			}]
		},{
			"type": "box",
			"title": "PRODUCT_SUMMARY",
			"colClass": "col-sm-12",
			"items": []
		}];
	};

	$scope.actions = {};

}]);