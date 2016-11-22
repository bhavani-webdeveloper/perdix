irf.pages.controller("PsychometricTestCtrl",
	["$log", "$scope", "SessionStore", "$stateParams", "Psychometric", "$element", "$timeout",
	function($log, $scope, SessionStore, $stateParams, Psychometric, $element, $timeout){
	$log.info("PsychometricTest loaded");

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
	Psychometric.getLanguages({}, function(resp){
		$scope.LANGUAGES = resp;
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

	var submitAnswers = function() {
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
		}, function(errResp) {
			$log.error(errResp);
		});
	};

	$scope.moveStage = function(toStage) {
		$scope.stage = toStage;
		switch ($scope.stage) {
		case STAGES.INSTRUCTIONS:
			$scope.lastIndex = -1;
			$log.info($scope.chosenLanguage);
			Psychometric.getTest({
				"participantId": $stateParams.pageId,
				"createdBy": SessionStore.getLoginname(),
				"langCode": $scope.chosenLanguage
			}, function(test) {
				$scope.test = test;
				$scope.allowedIntervals = $scope.test.noOfInterval;
				$scope.lastIndex = $scope.test.questions.length - 1;
			}, function(err) {
				$scope.preparationFailed = true;
			});
			break;
		case STAGES.TEST:
			startTestCountdown($scope.test.testDuration);
			break;
		case STAGES.END:
			clearInterval(testCountdownId);
			submitAnswers();
			break;
		}
	}

	$scope.complete = function() {
		$scope.stage = STAGES.LANG_CHOICE; // TODO remove
	}

}]);