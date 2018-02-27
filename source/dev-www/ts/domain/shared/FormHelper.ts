import AngularResourceService = require("../../infra/api/AngularResourceService");
import {applyMixins} from "@reactivex/rxjs/dist/cjs/util/applyMixins";
function getInjector(serviceName: string) {
    return AngularResourceService.getInstance().getNGService(serviceName)
}

export interface IFormHelper {
    getBranchId(): any;
    getVehicleComponents(): any;
    getAccessorries(): any;
    getStages(): any;
    getCenters(): any;
    getAddressProof(): any;
    getIncomeType(): any;
    getExpenseType(): any;
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

    getVehicleComponents() : any {
        return this.getInjector().enum('vehicle_components').data;
    }

    getAccessorries(): any {
        return this.getInjector().enum('vehicle_accessory_type').data;
    }

    getStages(): any {
        return this.getInjector().enum('targetstage').data;
    }

    getCenters(): any {
        return this.getInjector().enum('centre').data;
    }

    getAddressProof(): any {
        return this.getInjector().enum('identity_proof').data;
    }

    getIncomeType(): any {
        return this.getInjector().enum('vehicle_income_types').data;
    }

    getExpenseType(): any {
        return this.getInjector().enum('vehicle_expense_types').data;
    }
}
