import AngularResourceService = require("../../infra/api/AngularResourceService");
import {applyMixins} from "@reactivex/rxjs/dist/cjs/util/applyMixins";
import Utils = require("./Utils");
function getInjector(serviceName: string) {
    return AngularResourceService.getInstance().getNGService(serviceName)
}

export interface IFormHelper {
    getBranchId(): any;
    
}

export abstract class NeedsAngularInjector {

    abstract angularServiceName: string;
    getInjector(): any {
        return AngularResourceService.getInstance().getNGService(this.angularServiceName)
    }
}


export class FormHelper extends NeedsAngularInjector implements IFormHelper {

    angularServiceName: string = "formHelper";

    private static _instance:any = null;

    static getInstance(): FormHelper {
        if (this._instance == null) {
            this._instance = new FormHelper();
        }
        return this._instance;
    }

    getBranchId(): any {
        // formHelper.enum('branch_id').data;
        return this.getInjector().enum('branch_id').data;
    }

    
}
