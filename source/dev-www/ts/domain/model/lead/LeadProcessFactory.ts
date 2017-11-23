import LeadProcess = require("./LeadProcess");
import {Observable} from "@reactivex/rxjs";
import Lead = require("./Lead");
/**
 * Created by shahalpk on 21/11/17.
 */


export = class LeadProcessFactory {
    static createNew() : Observable<LeadProcess>{
        let leadPro: LeadProcess = new LeadProcess();
        leadPro.lead = new Lead();
        return leadPro.applyPolicies('onNew');
    }
}
