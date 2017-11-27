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
import {PolicyManager} from "../../shared/PolicyManager";
import {LeadProcessFactory} from "./LeadProcessFactory";

declare var leadProcessConfig: Object;

export class LeadProcess implements CanApplyPolicy {
	remarks: string;
	stage: string;
    lead: Lead;
    leadRepo: ILeadRepository;
    private leadAction: string;

    constructor(){
    	this.leadRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LeadProcess);
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

    static createNewProcess() : Observable<LeadProcess>{
        let obs1 = LeadProcessFactory.createNew();
        return obs1.flatMap(
            (leadProcess) => {
                let pm: PolicyManager<LeadProcess> = new PolicyManager<LeadProcess>(leadProcess, LeadPolicyFactory.getInstance(), 'onNew', LeadProcess.getProcessConfig());
                return pm.applyPolicies();
            }
        )
    }

    static get(id: number): Observable<LeadProcess> {
        let obs1 = LeadProcessFactory.createFromLeadId(id);
        return obs1.flatMap(
            (leadProcess) => {
                let pm: PolicyManager<LeadProcess> = new PolicyManager<LeadProcess>(leadProcess, LeadPolicyFactory.getInstance(), 'onLoad', LeadProcess.getProcessConfig());
                return pm.applyPolicies();
            }
        )
    }

    save(): Observable<LeadProcess> {
        this.leadAction = 'SAVE';
        let pmBeforeUpdate:PolicyManager  = new PolicyManager(this, LeadPolicyFactory, 'beforeSave', LeadProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.leadRepo.updateLead(this);
        let pmAfterUpdate:PolicyManager  = new PolicyManager(this, LeadPolicyFactory, 'afterSave', LeadProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3);
    }

    proceed(toStage: string): Observable<LeadProcess>{
        this.stage = toStage;
        this.leadAction = 'PROCEED';
        let pmBeforeUpdate:PolicyManager  = new PolicyManager(this, LeadPolicyFactory, 'beforeProceed', LeadProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.leadRepo.updateLead(this);
        let pmAfterUpdate:PolicyManager  = new PolicyManager(this, LeadPolicyFactory, 'afterProceed', LeadProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3);
    }

    sendBack(toStage: string): Observable<LeadProcess> {
        this.stage = toStage;
        this.leadAction = 'PROCEED';
        let pmBeforeUpdate:PolicyManager  = new PolicyManager(this, LeadPolicyFactory, 'beforeSendBack', LeadProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.leadRepo.updateLead(this);
        let pmAfterUpdate:PolicyManager  = new PolicyManager(this, LeadPolicyFactory, 'afterSendBack', LeadProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3);
    }

    followUp(reqData: any): Observable<LeadProcess> {
    	reqData.leadAction = "SAVE";
    	return this.leadRepo.updateLead(reqData);
    }

    static getProcessConfig(){
        return leadProcessConfig;
    }
}
