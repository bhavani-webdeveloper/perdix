class AngularResourceService {
	
	private static _instance = new AngularResourceService();
	private $injector: any;
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
    	this.$injector = service;
    }

    public getInjector(serviceName: string) {
    	return this.$injector.get(serviceName);
    }


}

export = AngularResourceService;