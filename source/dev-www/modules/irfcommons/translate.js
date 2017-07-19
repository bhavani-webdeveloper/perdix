irf.commons.config(function($translateProvider) {
	/*$translateProvider.useStaticFilesLoader({
		prefix: './process/translations/',
		suffix: '.json'
	});*/
	$translateProvider.useLoader('irfTranslateLoader');
	$translateProvider.preferredLanguage('en').fallbackLanguage('en');
	//$translateProvider.useMissingTranslationHandlerLog();
});
irf.commons.factory('irfTranslateLoader',
['languages', '$resource', '$q', 'irfStorageService', '$log',
function(languages, $resource, $q, irfStorageService, $log){
	var prepareTranslationJSON = function(arr, langCode) {
		var result = {};
		for (var i = arr.length - 1; i >= 0; i--) {
			result[arr[i].code] = arr[i][langCode];
		}
		return result;
	};
	var translationLangs = {};
	var getTranslationJSON = function(translationResult, langCode) {
		if (!translationLangs[langCode] && translationResult && translationResult.length) {
			$log.info('all translation array avilable in memory for ' + langCode);
			translationLangs[langCode] = prepareTranslationJSON(translationResult, langCode);
		}
		return translationLangs[langCode];
	};
	return function(options) {
		var deferred = $q.defer();
		var translations = irfStorageService.retrieveJSON('irfTranslations');
		var isSameWeek = false;
		if (translations && translations._timestamp) {
			isSameWeek = moment(translations._timestamp).diff(moment(new Date().getTime()), 'day') < 7;
			$log.info('Translations isSameWeek:' + isSameWeek);
		}
		if (isSameWeek && translations && translations[options.key] && !options.forceServer) {
			deferred.resolve(translations[options.key]);
		} else {
			$resource(irf.MANAGEMENT_BASE_URL, null, {
				"downloadTranslations": {
					"method": 'GET',
					"url": "http://devkinara.perdix.in:8081/management" + "/server-ext/translations.php",
					"isArray": true
				}
			}).downloadTranslations().$promise.then(function(translationResult) {
				$log.info('Translations loading from server');
				var langCodes = _.keys(languages);
				translations = {
					_timestamp: new Date().getTime()
				};
				for (var i = langCodes.length - 1; i >= 0; i--) {
					translations[langCodes[i]] = getTranslationJSON(translationResult, langCodes[i]);
				};
				irfStorageService.storeJSON('irfTranslations', translations);
				deferred.resolve(translations[options.key]);
			}, function() {
				deferred.reject(options.key);
			});
		}
		return deferred.promise;
	};
}]);