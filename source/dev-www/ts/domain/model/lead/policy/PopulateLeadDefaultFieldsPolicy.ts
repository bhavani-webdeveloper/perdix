
import {LeadPolicy} from "./LeadPolicy";
import {Observable} from "@reactivex/rxjs";
import LeadInteraction = require("../LeadInteraction");
import {UserSession, ISession} from "../../../shared/Session";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import {LeadProcess} from "../LeadProcess";
import {IPolicy} from "../../../shared/IPolicy";
import * as _ from 'lodash';


export class PopulateLeadDefaultFieldsPolicy implements IPolicy<LeadProcess> {

    setArguments(args: any) {

    }

    run(leadProcess: LeadProcess): Observable<LeadProcess> {

        return Observable.defer(function(){
            if (leadProcess.lead) {
                let activeSession:ISession = ObjectFactory.getInstance("Session");
                leadProcess.lead.eligibleForProduct = 'YES';
                let centers = activeSession.getCenters();
                if(_.isArray(centers) && centers.length > 0) {
                    leadProcess.lead.centreName = centers[0].centreName;
                    leadProcess.lead.centreId = centers[0].id;
                }

            }
            return Observable.of(leadProcess);
        })
    }

}
