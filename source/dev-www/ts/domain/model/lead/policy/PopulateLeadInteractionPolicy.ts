import {LeadPolicy} from "./LeadPolicy";
import LeadProcess = require("../LeadProcess");
import {Observable} from "@reactivex/rxjs";
import LeadInteraction = require("../LeadInteraction");
import {UserSession, ISession} from "../../../shared/Session";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import Utils = require("../../../shared/Utils");

export interface PopulateLeadInteractionPolicyArgs {
    NoOfInteractions: string;
}

export class PopulateLeadInteractionPolicy implements LeadPolicy<PopulateLeadInteractionPolicyArgs> {

    args: PopulateLeadInteractionPolicyArgs;

    setArguments(args: PopulateLeadInteractionPolicyArgs ) {
        this.args = args;
    }

    run(leadProcess: LeadProcess): Observable<LeadProcess> {

        return Observable.defer(function(){
            if (leadProcess.lead && leadProcess.lead.leadInteractions) {
                let activeSession:ISession = ObjectFactory.getInstance("Session");
                let i = new LeadInteraction();
                if (this.args &&  this.args.defaultUserName == true) {
                    i.loanOfficerId = activeSession.getUsername();
                }
                i.interactionDate = Utils.getCurrentDate();
                leadProcess.lead.leadInteractions.push(i);
            }
            return Observable.of(leadProcess);
        })
    }

}
