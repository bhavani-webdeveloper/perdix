irf.pages.controller("PsychometricTestCtrl",
	["$log", "$scope", "SessionStore", "$stateParams", "Psychometric", "$element", "$timeout",
	function($log, $scope, SessionStore, $stateParams, Psychometric, $element, $timeout){
	$log.info("PsychometricTest loaded");

	$scope.currentIndex = 0;
	$scope.indexText = function() {
		var i = $scope.currentIndex + 1;
		return i < 10 ? '0'+i:i;
	};

	var STAGES = {
		"LANG_CHOICE": "LANG_CHOICE",
		"INSTRUCTIONS": "INSTRUCTIONS",
		"TEST": "TEST",
		"END": "END"
	};

	$scope.stage = STAGES.LANG_CHOICE;
	$scope.chosenLanguage = null;
	$scope.testPaused = false;
	var testCountdownId = null, breakCountdownId = null, testResumed = true;
	var startTestCountdown = function(testDuration) {
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

	var startBreakCountdown = function(breakDuration) {
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
			startBreakCountdown($scope.test.intervalDuration);
		} else if ($scope.testPaused) {
			$scope.testPaused = false;
			testResumed = true;
			clearInterval(breakCountdownId);
			$scope.allowedIntervals--;
		}
		$event && $event.preventDefault();
		return false;
	};

	$scope.submit = function() {
		if ($scope.currentIndex == $scope.lastIndex) {
			$scope.moveStage(STAGES.END);
		} else {
			$scope.currentIndex++;
		}
	};

	$scope.moveStage = function(toStage) {
		$scope.stage = toStage;
		if ($scope.stage == STAGES.TEST) {
			startTestCountdown($scope.test.testDuration);
		}
	}

	$scope.complete = function() {
		$scope.stage = STAGES.LANG_CHOICE;
	}

	$scope.lastIndex = -1;
	Psychometric.getTest({
		"participantId": $stateParams.pageId,
		"createdBy": SessionStore.getLoginname(),
		"langCode": "en"
	}, function(test) {
		$scope.test = test;
		$scope.allowedIntervals = $scope.test.noOfInterval;
		$scope.lastIndex = $scope.test.questions.length - 1;
	}, function(err) {

	});

}]);