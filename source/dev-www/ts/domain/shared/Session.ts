import AngularResourceService = require("../../infra/api/AngularResourceService");
import {applyMixins} from "@reactivex/rxjs/dist/cjs/util/applyMixins";
import Utils = require("./Utils");
function getInjector(serviceName: string) {
    return AngularResourceService.getInstance().getNGService(serviceName)
}

export interface ISession {
    getUsername(): string;
    getBranchId(): number;
    getBranch(): string
}

export abstract class NeedsAngularInjector {

    abstract angularServiceName: string;
    getInjector(): any {
        return AngularResourceService.getInstance().getNGService(this.angularServiceName)
    }
}


export class UserSession extends NeedsAngularInjector implements ISession {

    angularServiceName: string = "SessionStore";

    private static _instance:any = null;

    static getInstance(): UserSession {
        if (this._instance == null) {
            this._instance = new UserSession();
        }
        return this._instance;
    }

    getUsername(): string {
        return this.getInjector().getUsername();
    }

    getBranchId(): number {
        return this.getInjector().getBranchId();
    }

    getBranch(): string {
        return this.getInjector().getBranch();
    }
}
