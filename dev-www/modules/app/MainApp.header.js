
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
		controller: "irfHeaderController"
	};
});

MainApp.controller("irfHeaderController",
["$scope", "$log", "$http", "irfConfig", "SessionStore", "$translate", "languages", "$state",
	"authService", "irfSimpleModal", "irfProgressMessage",
function($scope, $log, $http, irfConfig, SessionStore, $translate, languages, $state,
	authService, irfSimpleModal, irfProgressMessage) {

	$scope.ss = SessionStore;

	$scope.photo = SessionStore.getPhoto();

	$("a[href='#']").click(function(e){e.preventDefault()});

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
}]);
