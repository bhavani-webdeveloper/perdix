define([], function(){

	return {
		pageUID: "request.PreClosure",
		pageType: "Engine",
        dependencies: ["$log", "$q",'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
            'irfProgressMessage','SessionStore',"$state", "$stateParams", "Utils",
            "BundleManager", "IrfFormRequestProcessor","UIRepository", "$injector", "irfNavigator", "worklist"],

        $pageFn: function($log, $q, PageHelper,formHelper,elementsUtils,
                          irfProgressMessage,SessionStore,$state,$stateParams, Utils,
                          BundleManager, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator, Worklist) {
          
          console.log("Inside Pre Clsoure");   
          return {}
		  }
	 }
})