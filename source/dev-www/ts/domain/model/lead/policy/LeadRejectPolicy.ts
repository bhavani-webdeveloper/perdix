import {LeadPolicy} from "./LeadPolicy";
import {Observable} from "@reactivex/rxjs";
import LeadInteraction = require("../LeadInteraction");
import {UserSession, ISession} from "../../../shared/Session";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import {LeadProcess} from "../LeadProcess";

export interface LeadRejectPolicyArgs {
    stageForRejection: string;
}

export class LeadRejectPolicy implements LeadPolicy<LeadRejectPolicyArgs> {

    args: LeadRejectPolicyArgs;

    setArguments(args: LeadRejectPolicyArgs ) {
        this.args = args;
    }

    run(leadProcess: LeadProcess): Observable<LeadProcess> {
        if (leadProcess.lead) {
            leadProcess.stage = this.args.stageForRejection;
        }
        return Observable.of(leadProcess);
    }

}
