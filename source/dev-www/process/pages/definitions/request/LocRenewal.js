define([], function(){

	return {
		pageUID: "request.LocRenewal",
		pageType: "Engine",
        dependencies: ["$log", "$q",'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
            'irfProgressMessage','SessionStore',"$state", "$stateParams", "Utils",
            "BundleManager", "IrfFormRequestProcessor","UIRepository", "$injector", "irfNavigator"],

        $pageFn: function($log, $q, PageHelper,formHelper,elementsUtils,
                          irfProgressMessage,SessionStore,$state,$stateParams, Utils,
                          BundleManager, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator) {

          console.log("Inside Loc Renewal");          
          return {}

		}
	}
})