/// <amd-module name="perdix/infra/api/AngularResourceService"/>


declare var angular: any;

class AngularResourceService {

	private static _instance = new AngularResourceService();
	private $injector: any = null;
 	private constructor() {
        if(AngularResourceService._instance){
            throw new Error("Error: Instantiation failed: Use AngularResourceService.getInstance() instead of new.");
        }
        AngularResourceService._instance = this;
    }

    public static getInstance():AngularResourceService {
        return AngularResourceService._instance;
    }

    public setInjector(service: any):void {
 	    console.log("INJECTOR set for TS modules");
    	this.$injector = service;
    }

    public getNGService(serviceName: string) {
 	    let injector = this.$injector;
 	    if (injector==null){
            let elem = angular.element(document.querySelector('[ng-controller]'));
 	        injector = elem.injector();
        }
    	return injector.get(serviceName);
    }


}
console.log("Loaded ARS");
export = AngularResourceService;
