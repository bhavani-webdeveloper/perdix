import {LeadPolicy} from "./LeadPolicy";
import LeadProcess = require("../LeadProcess");
import {Observable} from "@reactivex/rxjs";

export class PopulateLeadInteractionPolicy implements LeadPolicy{

    setArguments(arguments: Array<any>) {
    }

    run(leadProcess: LeadProcess): Observable<LeadProcess> {
        return undefined;
    }

}
