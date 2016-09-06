irf.commons.config(function($translateProvider) {
	/*$translateProvider.useStaticFilesLoader({
		prefix: './process/translations/',
		suffix: '.json'
	});*/
	$translateProvider.useLoader('irfTranslateLoader');
	$translateProvider.preferredLanguage('en').fallbackLanguage('en');
	//$translateProvider.useMissingTranslationHandlerLog();
});
irf.commons.factory('irfTranslateLoader', ['Queries', '$q', function(Queries, $q){
	return function(options) {
		var deferred = $q.defer();
		Queries.downloadTranslations().then(function(translationResult){
			return Queries.getTranslationJSON(options.key);
		}).then(function(translations){
			deferred.resolve(translations);
		});
		return deferred.promise;
	};
}]);