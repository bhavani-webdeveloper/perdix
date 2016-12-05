var irf = irf || {};
irf.pages.factory("PsychometricTestService", ["$q", "$state", "$rootScope", function($q, $state, $rootScope){
	return {
		start: function(participantId, applicationId) {
			irf.PsychometricTestServiceDeferred = $q.defer();
			$state.go("Page.PsychometricTest", {
				participantId: participantId,
				applicationId: applicationId
			});
			return irf.PsychometricTestServiceDeferred.promise;
		},
		deferred: function () {
			return irf.PsychometricTestServiceDeferred;
		}
	};
}]);
irf.pages.controller("PsychometricTestCtrl",
["$log", "$scope", "SessionStore", "$state", "$stateParams", "Psychometric", "$element", "$timeout", "Queries",
"PsychometricTestService", "PageHelper",
function($log, $scope, SessionStore, $state, $stateParams, Psychometric, $element, $timeout, Queries,
	PsychometricTestService, PageHelper){
	$log.info("PsychometricTest loaded");

	$scope.participantId = $stateParams.participantId;
	$scope.applicationId = $stateParams.applicationId;
	$scope.createdBy = SessionStore.getLoginname();

	$scope.participantCustomer = $scope.participantId;
	$scope.createdByUser = SessionStore.getUsername();
/*
	Queries.getCustomerBasicDetails({ids:[$scope.participantId]}).then(function(resp){
		$scope.participantCustomer = resp.ids[$scope.participantId]['first_name'];
	});
*/

	if (!(PsychometricTestService && _.isFunction(PsychometricTestService.deferred) && PsychometricTestService.deferred())) {
		$log.error("Psychometric Test Service Requested through invalid route");
		$state.go("Page.Engine", {"pageName": "psychometric.Queue", "pageId": null});
		return;
	}

	$scope.currentIndex = 0;
	$scope.indexText = function() {
		var i = $scope.currentIndex + 1;
		return i < 10 ? '0'+i:i;
	};

	$scope.LANGUAGES = [
		{
			"langCode":"en",
			"language":"English"
		}
	];
	Psychometric.getLanguages(null, function(resp){
		$scope.LANGUAGES = resp.body;
	});

	var STAGES = {
		"LANG_CHOICE": "LANG_CHOICE",
		"INSTRUCTIONS": "INSTRUCTIONS",
		"TEST": "TEST",
		"END": "END"
	};
	
	$scope.STAGES = STAGES;

	$scope.stage = STAGES.LANG_CHOICE;
	$scope.chosenLanguage = null;
	$scope.testPaused = false;
	var testCountdownId = null, breakCountdownId = null, testResumed = true;
	var startCountdown = function() {
		$scope.testStatus = 'Answering';
		var testDuration = $scope.test.testDuration;
		var totalTime = testDuration * 1000, startTime = new Date().getTime();

		testCountdownId = setInterval(function(){
			var durationElem = $element.find(".test-duration");
			if ($scope.testPaused) {
				if (testResumed) {
					testResumed = false;
					totalTime = totalTime + startTime - (new Date().getTime());
					durationElem.addClass('breathe_888_tomato');
				}
			} else {
				if (testResumed) {
					testResumed = false;
					startTime = new Date().getTime();
					durationElem.removeClass('breathe_888_tomato');
				}
				var remainingTime = totalTime + startTime - (new Date().getTime());
				if (remainingTime <= 0) {
					remainingTime = 0;
				}
				durationElem.html(moment.utc(remainingTime).format("HH:mm[<em>] ss[</em>]"));
				if (remainingTime == 0) {
					clearInterval(testCountdownId);
					$scope.moveStage(STAGES.END);
				}
			}
		}, 250);
	};

	var startBreakCountdown = function() {
		var breakDuration = $scope.test.intervalDuration;
		var breakTotalTime = breakDuration * 1000, breakStartTime = new Date().getTime();

		breakCountdownId = setInterval(function(){
			var durationElem = $element.find(".break-duration");
			var remainingTime = breakTotalTime + breakStartTime - (new Date().getTime());
			if (remainingTime <= 0) {
				remainingTime = 0;
			}
			durationElem.html(moment.utc(remainingTime).format("HH:mm[<em>] ss[</em>]"));
			if (remainingTime == 0) {
				$timeout(function() {
					$scope.pauseResumeTestCountdown(false);
				});
			}
		}, 250);
	};

	$scope.pauseResumeTestCountdown = function(pause, $event) {
		if (pause) {
			testResumed = true;
			$scope.testPaused = true;
			startBreakCountdown();
		} else if ($scope.testPaused) {
			$scope.testPaused = false;
			testResumed = true;
			clearInterval(breakCountdownId);
			$scope.allowedIntervals--;
		}
		$event && $event.preventDefault();
		return false;
	};

	$scope.next = function() {
		if ($scope.currentIndex == $scope.lastIndex) {
			$scope.moveStage(STAGES.END);
		} else {
			$scope.currentIndex++;
		}
	};

	var prepareQuestionnaire = function() {
		$scope.error = null;
		$scope.testStatus = 'Preparing';
		$scope.lastIndex = -1;
		$log.info("Chosen language: " + $scope.chosenLanguage);
		Psychometric.getTest({
			"participantId": 1, //$scope.participantId,
			"applicationId": $scope.applicationId,
			"createdBy": $scope.createdBy,
			"langCode": $scope.chosenLanguage
		}).$promise.then(function(test) {
			$scope.test = test;
			$scope.allowedIntervals = $scope.test.noOfInterval;
			$scope.lastIndex = $scope.test.questions.length - 1;
			$scope.testStatus = 'Prepared';
		}, function(err) {
			$scope.testStatus = 'Failed';
			$scope.error = err;
		});
	};

	var submitAnswers = function() {
		$scope.error = null;
		$scope.testStatus = 'Submitting';
		clearInterval(testCountdownId);
		var testToSend = _.clone($scope.test);
		testToSend.questions = [];
		for (var i = 0; i < $scope.test.questions.length; i++) {
			testToSend.questions.push({
				id: $scope.test.questions[i].id,
				answerId: $scope.test.questions[i].answerId
			});
		};
		$log.info(testToSend);
		Psychometric.postTest(testToSend, function(resp){
			$log.info(resp);
			$scope.testStatus = 'Close';
		}, function(errResp) {
			$log.error(errResp);
			$scope.testStatus = 'Submission failed';
			$scope.error = errResp;
		});
	};

	$scope.moveStage = function(toStage) {
		$scope.stage = toStage;
		switch ($scope.stage) {
			case STAGES.INSTRUCTIONS:
				prepareQuestionnaire();
				break;
			case STAGES.TEST:
				startCountdown();
				break;
			case STAGES.END:
				submitAnswers();
				break;
		}
	}

	$scope.closeTest = function() {
		if (PsychometricTestService.deferred()) {
			if ($scope.testStatus == 'Close') {
				PsychometricTestService.deferred().resolve({
					participantId: $scope.participantId,
					applicationId: $scope.applicationId
				});
				PsychometricTestService.deferred = null;
			} else {
				$log.info("Returning with Test Status: " + $scope.testStatus);
				PsychometricTestService.deferred().reject({
					participantId: $scope.participantId,
					applicationId: $scope.applicationId
				});
			}
		} else {
			$log.info("Test called through invalid route");
		}
	}

	$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
		if ($scope.testStatus == 'Answering') {
			event.preventDefault();
		}
	});


	$scope.instructionImage = "data:image/png;base64,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QawBAACWINYAAABLEGsAAIAliDUAAMASxBoAAGAJYg0AALAEsQYAAFiCWAMAACxBrAEAAJYg1gAAAEsQawAAgCWINQAAwBLEGgAAYAliDQAAsASxBgAAWIJYAwAALEGsAQAAliDWAAAASxBrAACAJYg1AADAEsQaAABgCWINAACwBLEGAABYglgDAAAsQawBAACWINYAAABLEGsAAIAliDUAAMASxBoAAGAJYg0AALAEsQYAAFiCWAMAACxBrAEAAJYg1gAAAEsQawAAgCWINQAAwBLEGgAAYAliDQAAsASxBgAAWIJYAwAALEGsAQAAliDWAAAASxBrAACAJYg1AADAEsQaAABgCWINAACwBLEGAABYglgDAAAsQawBAACWINYAAABLEGsAAIAliDUAAMASxBoAAGAJYg0AALAEsQYAAFiCWAMAACxBrAEAAJYg1gAAAEsQawAAgCWINQAAwBLEGgAAYAliDQAAsASxBgAAWIJYAwAALEGsAQAAliDWAAAASxBrAACAJYg1AADAEsQaAABgCWINAACwBLEGAABYglgDAAAsQawBAACWINYAAABLEGsAAIAliDUAAMASxBoAAGAJYg0AALAEsQYAAFiCWAMAACxBrAEAAJYg1gAAAEsQawAAgA3W19dPXzyXE2uWL6/qOwEAAMJjaXVZkkw21pxZunBi4blLl1fW1tf1IgAAAA1vceXS3LnTkmSysSa2/Pz88wvHzp6anT9x+OQxiqIoiqKoxq/oqeOSXp67eE6STDbWqGQjSUfuoCiKoiiKCktJelGZZmHl4v8HQWq+3wksQ0oAAAAASUVORK5CYII=";

}]);