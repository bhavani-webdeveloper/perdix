import {Observable} from "@reactivex/rxjs";
import {CanApplyPolicy, IPolicy, PolicyDefinition} from "./IPolicy";
import Utils = require("./Utils");
import {IPolicyFactory} from "./IPolicyFactory";
import * as _ from "lodash";
/**
 * Created by shahalpk on 24/11/17.
 */

export class PolicyManager<T> {

    obj: T;
    policyFactory: IPolicyFactory;
    policyStage: string;
    policyConfig: Object;


    constructor(obj: T, policyFactory: IPolicyFactory, policyStage: string, policyConfig: Object) {
        this.obj = obj;
        this.policyFactory = policyFactory;
        this.policyStage = policyStage;
        this.policyConfig = policyConfig;
    }

    public applyPolicies(): Observable<T> {
        let policies = this.resolvePolicy();

        /* If there are no policies applicable */
        if (!_.isArray(policies) || (_.isArray(policies) && policies.length == 0)) {
            return Observable.of(this.obj);
        }

        let observables = [];

        for (let policy of policies) {
            try {
                let policyObj: IPolicy<T> = this.policyFactory.fromPolicyName(policy.name);
                if (policyObj && policy.arguments) {
                    policyObj.setArguments(policy.arguments);
                    observables.push(policyObj.run(this.obj));
                }
            } catch (e) {
                console.log("Unable to apply policy :: " + policy.name + ". Skipping now.");
                console.error(e);
            }
        }

        if (observables.length == 0){
            return Observable.of(this.obj);
        }

        return Observable.concat(...observables).last();
    }

    private resolvePolicy(): Array<PolicyDefinition> {
        if (!_.hasIn(this.policyConfig, 'policies.default.' + this.policyStage)) {
            return [];
        }

        let pObj = this.policyConfig['policies']['default'][this.policyStage];
        let policies = [];

        for (let entry of pObj["defaults"]) {
            policies.push(entry);
        }

        if (_.hasIn(pObj, 'overrides') && _.isArray(pObj.overrides)) {
            for (let entry of pObj["overrides"]) {
                if (entry.type == 'expr') {
                    let shouldConsiderPolicy = Utils.evalInContext(this.obj, entry['expr']);
                    if (!shouldConsiderPolicy) continue;

                    for (let pToAdd of entry['add']) {
                        policies.push(pToAdd);
                    }

                    for (let pToRemove of entry['remove']) {
                        _.remove(policies, function (policy) {
                            return policy.name === pToRemove.name;
                        })
                    }
                }
            }
        }
        return _.uniqBy(policies, 'name');
    }
}
