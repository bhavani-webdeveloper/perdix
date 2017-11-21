import {IPolicy} from "../../../shared/IPolicy";
import LeadProcess = require("../LeadProcess");
import {Observable} from "@reactivex/rxjs";

abstract class LeadPolicy extends IPolicy<LeadProcess> {
    abstract setArguments(argument: any);

    abstract run(obj: LeadProcess): Observable<LeadProcess>;
}

export {LeadPolicy}
