

import AngularResourceService = require("./AngularResourceService");
import {applyMixins} from "@reactivex/rxjs/dist/cjs/util/applyMixins";
import Utils = require("./Utils");
function getInjector(serviceName) {
    return AngularResourceService.getInstance().getInjector(serviceName)
}

export interface ISession {
    getUsername(): string;
}

export abstract class NeedsAngularInjector {

    abstract angularServiceName: string;
    getInjector(): any {
        return AngularResourceService.getInstance().getInjector(this.angularServiceName)
    }
}


export class UserSession extends NeedsAngularInjector implements ISession {

    angularServiceName: string = "SessionStore";

    private static _instance = null;

    static getInstance(): UserSession {
        if (this._instance == null) {
            this._instance = new UserSession();
        }
        return this._instance;
    }

    getUsername(): string {
        return this.getInjector().getUsername();
    }
}
