///<amd-dependency path="perdixConfig/LeadProcessConfig" name="leadProcessConfig"/>

import { RepositoryIdentifiers } from '../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../shared/RepositoryFactory');
import Lead = require("./Lead");
import {ILeadRepository} from "./ILeadRepository";
import {Observable} from "@reactivex/rxjs";
import {plainToClass} from "class-transformer";
import {LeadPolicy} from "./policy/LeadPolicy";
import {LeadPolicyFactory} from "./policy/LeadPolicyFactory";
import {CanApplyPolicy} from "../../shared/IPolicy";
import Utils = require("../../shared/Utils");
import * as _ from "lodash";



declare var leadProcessConfig: Object;

class LeadProcess implements CanApplyPolicy {
	remarks: string;
	stage: string;
    lead: Lead;
    leadRepo: ILeadRepository;

    constructor(){
    	this.leadRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LeadProcess);
	}

	applyPolicies(policyStage: string): Observable<LeadProcess> {
        let policies = LeadPolicy.resolvePolicy(this, policyStage);

        /* If there are no policies applicable */
        if (!_.isArray(policies) || (_.isArray(policies) && policies.length == 0)) {
            return Observable.of(this);
        }

        let observables = [];

        for (let policy of policies) {
            try{
                let policyObj:LeadPolicy = LeadPolicyFactory.fromPolicyName(policy.name);
                observables.push(policyObj.run(this));
            } catch (e){
                console.log("Unable to apply policy :: " + policy.name + ". Skipping now.");
                console.error(e);
            }
        }

        return Observable.concat(observables);
    }

	loanProcessAction(actionName: string): boolean {
		switch(actionName) {
			case "SAVE":
				// var loanProcess = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LoanProcess)
				// loanProcess.createIndividualLoan();
				return true;
			default:
				return false;
		}
	}

    get(id: number): Observable<LeadProcess> {
        return this.leadRepo.getLead(id)
            .map(
                (value: Object) => {
                    this.lead = plainToClass(Lead, Utils.toJSObj(value));
                    // this.lead = value;
                    // this.lead.currentStage = "SOME STGE";
                    return this;
                }
            )
    }

    save(reqData: any): Observable<LeadProcess> {
		reqData.lead.udf = {};
        reqData.lead.udfDate = {};
        reqData.lead.udf.userDefinedFieldValues = {};
        reqData['leadAction'] = 'SAVE';
        if (reqData.lead.leadStatus == "Screening") {
            if (reqData.lead.siteCode == 'sambandh') {
                reqData['stage'] = 'ReadyForEnrollment';
            } else {
                reqData['stage'] = 'ReadyForScreening';
            }
        } else if (reqData.lead.leadStatus == "Incomplete") {
            reqData['stage'] = 'Incomplete';
        } else {
            reqData['stage'] = 'Inprocess';
        }

        return this.leadRepo.saveLead(reqData);
    }

    update(reqData: any): Observable<LeadProcess> {
    	if (reqData.lead.id === undefined || reqData.lead.id === null) {
            // TO Do
        } else {
            reqData.leadAction = "PROCEED";
            if (reqData.lead.leadStatus == "Screening") {
                if (reqData.lead.siteCode == 'sambandh') {
                    reqData.stage = 'ReadyForEnrollment';
                } else {
                    reqData.stage = 'ReadyForScreening';
                }
            } else if (reqData.lead.leadStatus == "Reject") {
                reqData.stage = 'Inprocess';
            } else if (reqData.lead.leadStatus == "Incomplete") {
                reqData.stage = 'Incomplete';
            }


            return this.leadRepo.updateLead(reqData);

        }
    }

    followUp(reqData: any): Observable<LeadProcess> {
    	reqData.leadAction = "SAVE";
    	return this.leadRepo.updateLead(reqData);
    }
}

export = LeadProcess;
