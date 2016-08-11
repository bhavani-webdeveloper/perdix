irf.commons.config(function($translateProvider) {
	
	$translateProvider.useStaticFilesLoader({
    prefix: './process/translations/',
    suffix: '.json'
  })
  .preferredLanguage('en')
  //.useMissingTranslationHandlerLog()
  ;
});