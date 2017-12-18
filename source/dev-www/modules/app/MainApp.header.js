
MainApp.directive('irfHeader', function(){
	return {
		restrict: "E",
		replace: true,
		scope: {
			theme: '='
		},
		templateUrl: "modules/app/templates/header.html",
		link: function(scope, elem, attrs, ctrl) {
			//ctrl.init(elem);
		},
		controller: "irfHeaderController",
		controllerAs: "c"
	};
});

MainApp.controller("irfHeaderController",
["$scope", "$log", "$http", "$templateCache", "irfConfig", "SessionStore", "$translate", "languages", "$state", "$q", "User",
	"authService", "irfSimpleModal", "irfProgressMessage", "irfStorageService", "Utils", "Auth", "PageHelper", "Account", "formHelper", "elementsUtils",
function($scope, $log, $http, $templateCache, irfConfig, SessionStore, $translate, languages, $state, $q, User,
	authService, irfSimpleModal, irfProgressMessage, irfStorageService, Utils, Auth, PageHelper, Account, formHelper, elementsUtils) {

	$scope.ss = SessionStore;

	$scope.photo = SessionStore.getPhoto();

	$("a[href='#']").click(function(e){e.preventDefault()});

	$scope.branchSwitch = {
		"showBranchSelect": false,
		"currentBranch": SessionStore.getCurrentBranch()
	};

	this.toggleSwitchBranch = function(){
		$scope.branchSwitch.showBranchSelect = !!!$scope.branchSwitch.showBranchSelect;
	}

	this.updateNewBranch = function($event, selectedBranch){
		var $this = this;
		var currentBranch = SessionStore.getCurrentBranch();
		Utils.confirm("Are you sure you want to switch to " + selectedBranch.branchName + "?")
		.then(function(){

			PageHelper.showBlockingLoader("Switching...");
			Auth.changeBranch({userId: SessionStore.getLoginname(), branchName: selectedBranch.branchName})
				.$promise
				.then(function(response){
					/* Now load centres for the user */
					Account.getCentresForUser(selectedBranch.branchId, SessionStore.getLoginname())
						.then(function(centres){
							selectedBranch.centresMappedToUser = centres;
						})
						.finally(function(){
							$this.toggleSwitchBranch();
							SessionStore.setCurrentBranch(selectedBranch);	
							window.location.reload();
						})
				}, function(httpResponse){
					Utils.alert("Unknown error while trying to switch branch");
				})
				.finally(function(){
					PageHelper.hideBlockingLoader();
				})
			
		},
		function(){
			$scope.branchSwitch.selectedBranch = $scope.branchSwitch.currentBranch;
		})
	}

	$scope.preventClose = function($event){
		$event.stopPropagation();
	}

	/* Loading branch details */
	var branches = SessionStore.getItem("UserAllowedBranches");
	//getting the home branch details from masters
	var homeBranch = Account.getHomeBranchForUser();
	var homebranchCode = homeBranch.branchCode;
	/* Need to add homebranch to list, if its already not there */
	var indexForHome = _.findIndex(branches, function(b){
		return b.branchCode == homebranchCode;
	})

	if (indexForHome == -1) {
		branches.push(homeBranch);
	}

	$scope.branchSwitch.allowedBranches = branches;
	$scope.branchSwitch.selectedBranch = $scope.branchSwitch.currentBranch;

	$scope.showLogs = function() {
		var allLogs = $log.getAllLogs();
		var body = '<div class="log-div">' + allLogs + '</div>';
		irfSimpleModal('<i class="fa fa-terminal">&nbsp;</i>Console Logs', body).opened.then(function(){
			setTimeout(function() {
				$(".log-div span.object").each(function(){
					try {
						var jjson = JSON.parse($(this).text());
						$(this).html('');
						this.appendChild(renderjson.set_show_to_level(1)(jjson));
					} catch (e) {}
				});
				$('.modal-dialog button.pull-left')[0].scrollIntoView({
					behavior: "smooth",
					block: "end",
				});
			}, 500);
		});
	};

	$scope.clearLogs = function() {
		$log.clearLogs();
		irfProgressMessage.pop("logs", "Console Logs Cleared", 2500);
	};

	$scope.gotoPageEngine = function(stateParams) {
		$state.go('Page.Engine', stateParams);
	};

	$scope.logout = function() {
		var promise = authService.logout();
		promise.then(
			function(){
				$state.go("Login");
			}, function(){
				alert('Logout failed');
			}
		)
	};

	$scope.downloadFile = function(url, e) {
		e.preventDefault();
		Utils.downloadFile(url);
	};

	$scope.languages = languages;

	$scope.changeLanguage = function(lang) {
		$translate.use(lang.code);
		SessionStore.session.language = lang.code;
	};

	var dxScale = 0.1;
	$scope.changeFontSize = function(event, increase) {
		event.preventDefault();
		if (typeof(increase)=='undefined')
			initialScale = 1;
		else
			initialScale += increase ? dxScale : -dxScale;
		setFontSize(initialScale);
	};

	var setFontSize = function(scale) {
		$('meta[name="viewport"]').attr("content", "width=100, initial-scale=" + scale + ", maximum-scale=" + scale + ", user-scalable=no");
		$scope.scalePercent = Math.round(scale * 100) - 100;
		localStorage.setItem('initialScale', scale);
	};

	var initialScale = localStorage.getItem('initialScale');
	if (initialScale == null)
		initialScale = 1;
	else
		initialScale = Number(initialScale);
	setFontSize(initialScale);

	$scope.isTouchDevice = (function () {
		try {
			document.createEvent("TouchEvent");
			return true;
		} catch (e) {
			return false;
		}
	})();

	try {
		$scope.themeColors = elementsUtils.getAllThemeColors();
	} catch (e) {
		$log.error(e);
	}
	$scope.changeTheme = function(color) {
		return themeswitch.changeTheme(color, true)
	}

	$scope.isPerdix7Integrated = !!parent.i7;
}]);
