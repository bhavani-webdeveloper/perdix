import {LeadPolicy} from "./LeadPolicy";
import {Observable} from "@reactivex/rxjs";
import LeadInteraction = require("../LeadInteraction");
import {LeadProcess} from "../LeadProcess";

export interface PopulateBasicLeadDataArgs {
    defaultLeadStatus: string;
}

export class PopulateBasicLeadDataPolicy extends LeadPolicy<PopulateBasicLeadDataArgs>{

    args: PopulateBasicLeadDataArgs;

    setArguments(args: PopulateBasicLeadDataArgs) {
        this.args = args;
    }

    run(leadProcess: LeadProcess): Observable<LeadProcess> {
        return Observable.create((observer: any) => {

            if (leadProcess.lead) {
                leadProcess.lead.leadStatus = "Incomplete";
            }
            observer.next(leadProcess);
            observer.complete();
        })

    }

}
