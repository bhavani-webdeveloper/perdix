///<amd-dependency path="perdixConfig/LeadProcessConfig" name="leadProcessConfig"/>

import {IPolicy} from "../../../shared/IPolicy";
import LeadProcess = require("../LeadProcess");
import {Observable} from "@reactivex/rxjs";
import * as _ from "lodash";

declare let leadProcessConfig:any;

abstract class LeadPolicy extends IPolicy<LeadProcess> {
    abstract setArguments(argument: any);

    abstract run(obj: LeadProcess): Observable<LeadProcess>;

    static resolvePolicy(leadProcess: LeadProcess, policyStage: string) {
        if (!_.hasIn(leadProcessConfig, 'default.' + policyStage)) {
            return [];
        }

        let pObj = leadProcessConfig['default'][policyStage];
        let policies = [];

        for(let entry of pObj["defaults"]) {
            policies.push(entry);
        }
        if (_.hasIn(pObj, 'overrides') && _.isArray(pObj.overrides)) {
            for (let entry of pObj["overrides"]) {
                if (entry.type == 'expr') {
                    let shouldConsiderPolicy = Utils.evalInContext(leadProcess, entry['expr']);
                    if (!shouldConsiderPolicy) continue;

                    for (let pToAdd of entry['add']){
                        policies.push(pToAdd);
                    }

                    for (let pToRemove of entry['remove']) {
                        _.remove(policies, function (policy) {
                            return policy.name == pToRemove.name;
                        })
                    }
                }
            }
        }
        return policies;
    }
}

export {LeadPolicy}
