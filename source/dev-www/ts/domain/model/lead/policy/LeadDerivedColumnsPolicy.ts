///<amd-dependency path="moment" name="moment"/>
import {LeadPolicy} from "./LeadPolicy";
import {Observable} from "@reactivex/rxjs";
import LeadInteraction = require("../LeadInteraction");
import {UserSession, ISession} from "../../../shared/Session";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import Utils = require("../../../shared/Utils");
import {LeadProcess} from "../LeadProcess";


export interface LeadDerivedColumnsPolicyArgs {
    NoOfInteractions: string;
}
declare var moment: Function;
export class LeadDerivedColumnsPolicy implements LeadPolicy<LeadDerivedColumnsPolicyArgs> {

    args: LeadDerivedColumnsPolicyArgs;

    setArguments(args: LeadDerivedColumnsPolicyArgs ) {
        this.args = args;
    }

    run(leadProcess: LeadProcess): Observable<LeadProcess> {

        return Observable.defer(function(){
            if (leadProcess.lead) {
                let activeSession:ISession = ObjectFactory.getInstance("Session");
                leadProcess.lead.age = moment().diff(moment(leadProcess.lead.dob, activeSession.getSystemDateFormat()), 'years');
            }
            return Observable.of(leadProcess);
        })
    }

}
