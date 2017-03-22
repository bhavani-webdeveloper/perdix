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
['languages', 'Queries', '$q', 'irfStorageService', '$log',
function(languages, Queries, $q, irfStorageService, $log){
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
			Queries.downloadTranslations().then(function(translationResult) {
				$log.info('Translations loading from server');
				var langCodes = _.keys(languages);
				translations = {
					_timestamp: new Date().getTime()
				};
				for (var i = langCodes.length - 1; i >= 0; i--) {
					translations[langCodes[i]] = Queries.getTranslationJSON(translationResult, langCodes[i]);
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