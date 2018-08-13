import {LeadPolicy} from "./LeadPolicy";
import {Observable} from "@reactivex/rxjs";
import LeadInteraction = require("../LeadInteraction");
import {UserSession, ISession} from "../../../shared/Session";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import {LeadProcess} from "../LeadProcess";

export interface LeadScreeningPolicyArgs {
    stageForScreening: string;
}

export class LeadScreeningPolicy implements LeadPolicy<LeadScreeningPolicyArgs> {

    args: LeadScreeningPolicyArgs;

    setArguments(args: LeadScreeningPolicyArgs ) {
        this.args = args;
    }

    run(leadProcess: LeadProcess): Observable<LeadProcess> {
        if (leadProcess.lead) {
            leadProcess.stage = this.args.stageForScreening;
        }
        return Observable.of(leadProcess);
    }

}
