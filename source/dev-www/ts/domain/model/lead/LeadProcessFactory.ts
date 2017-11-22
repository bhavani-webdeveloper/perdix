import LeadProcess = require("./LeadProcess");
import {Observable} from "@reactivex/rxjs";
/**
 * Created by shahalpk on 21/11/17.
 */


export class LeadProcessFactory {
    createNew() : Observable<LeadProcess>{
        let leadPro: LeadProcess = new LeadProcess();
        return leadPro.applyPolicies('onNew');
    }
}
