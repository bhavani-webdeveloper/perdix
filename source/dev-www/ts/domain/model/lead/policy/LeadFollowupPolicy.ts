import {LeadPolicy} from "./LeadPolicy";
import {Observable} from "@reactivex/rxjs";
import LeadInteraction = require("../LeadInteraction");
import {UserSession, ISession} from "../../../shared/Session";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import Utils = require("../../../shared/Utils");
import {LeadProcess} from "../LeadProcess";

export interface LeadFollowupPolicyArgs {
    stageForFollowup: string;
}

export class LeadFollowupPolicy implements LeadPolicy<LeadFollowupPolicyArgs> {

    args: LeadFollowupPolicyArgs;

    setArguments(args: LeadFollowupPolicyArgs ) {
        this.args = args;
    }

    run(leadProcess: LeadProcess): Observable<LeadProcess> {

        return Observable.defer(function(){
            console.log("SHAHALPASS1");
            if (leadProcess.lead) {
                leadProcess.stage = this.args.stageForFollowup;
            }
            return Observable.of(leadProcess);
        })
    }

}
