class AngularResourceRepository {
	
	private static _instance = new AngularResourceRepository();
	private $injector: any;
 	private constructor() {
        if(AngularResourceRepository._instance){
            throw new Error("Error: Instantiation failed: Use AngularResourceRepository.getInstance() instead of new.");
        }
        AngularResourceRepository._instance = this;
    }

    public static getInstance():AngularResourceRepository {
        return AngularResourceRepository._instance;
    }

    public setInjector(service: any):void {
    	this.$injector = service;
    }

    public getInjector(serviceName: string) {
    	return this.$injector.get(serviceName);
    }


}

export = AngularResourceRepository;