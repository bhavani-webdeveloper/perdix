///<amd-dependency path="perdixConfig/AgentProcessConfig" name="agentProcessConfig"/>

import {RepositoryIdentifiers} from '../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../shared/RepositoryFactory');
import Agent = require("./Agent");
import EnrollmentProcessFactory = require("../customer/EnrolmentProcessFactory");
import {EnrolmentProcess} from "../customer/EnrolmentProcess";
import {IAgentRepository} from "./IAgentRepository";
import {Observable} from "@reactivex/rxjs";
import {plainToClass} from "class-transformer";
import {PolicyManager} from "../../shared/PolicyManager";
import {Customer, CustomerTypes} from "../customer/Customer";
import {AgentPolicyFactory} from "./policy/AgentPolicyFactory";
import AgentProcessFactory = require("./AgentProcessFactory");
import * as _ from 'lodash';



declare var agentProcessConfig: Object;

export class AgentProcess {
    remarks: string;
    stage: string;    
    agentProcessAction: string;
    customer: Customer;
    public agent: Agent;   
    processType: string;
    agentAction: string;
    agentRepo: IAgentRepository;

    
    loanCustomerEnrolmentProcess: EnrolmentProcess;
    applicantEnrolmentProcess: EnrolmentProcess;

    constructor() {
        this.agentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.AgentProcess);
    }

    public setRelatedCustomerWithRelation(enrolmentProcess: EnrolmentProcess): AgentProcess {            
            this.applicantEnrolmentProcess = enrolmentProcess;
            this.loanCustomerEnrolmentProcess = enrolmentProcess;
        return this;
    }

    save(): any {
        /* Calls all business policies associated with save */
      
        let pmBeforeUpdate: PolicyManager<AgentProcess> = new PolicyManager(this, AgentPolicyFactory.getInstance(), 'beforeSave', AgentProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = null;
        if (this.agent.id){
            obs2 = this.agentRepo.update(this);
        } 
        let pmAfterUpdate: PolicyManager<AgentProcess> = new PolicyManager(this, AgentPolicyFactory.getInstance(), 'afterSave', AgentProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }

   
    hold(): any {
        this.agentProcessAction = "SAVE";  
        let pmBeforeUpdate: PolicyManager<AgentProcess> = new PolicyManager(this, AgentPolicyFactory.getInstance(), 'beforeSave', AgentProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = null;
        if (this.agent.id){
            obs2 = this.agentRepo.update(this);
        } 

        let pmAfterUpdate: PolicyManager<AgentProcess> = new PolicyManager(this, AgentPolicyFactory.getInstance(), 'afterSave', AgentProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }

    proceed(): any {
        /* Calls all business policies assocaited with proceed */
        this.agentProcessAction = "SAVE";
        let pmBeforeUpdate: PolicyManager<AgentProcess> = new PolicyManager(this, AgentPolicyFactory.getInstance(), 'beforeProceed', AgentProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.agentRepo.save(this);
        let pmAfterUpdate: PolicyManager<AgentProcess> = new PolicyManager(this, AgentPolicyFactory.getInstance(), 'afterProceed', AgentProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs2).last();
    }

    sendBack(): any {
        this.agentProcessAction = "PROCEED";
        let pmBeforeUpdate: PolicyManager<AgentProcess> = new PolicyManager(this, AgentPolicyFactory.getInstance(), 'beforeSendBack', AgentProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.agentRepo.update(this);
        let pmAfterUpdate: PolicyManager<AgentProcess> = new PolicyManager(this, AgentPolicyFactory.getInstance(), 'afterSendBack', AgentProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }

    reject(): any {
        this.stage = "REJECTED";
        this.agentProcessAction = "PROCEED";
        let pmBeforeUpdate: PolicyManager<AgentProcess> = new PolicyManager(this, AgentPolicyFactory.getInstance(), 'beforeReject', AgentProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.agentRepo.update(this);
        let pmAfterUpdate: PolicyManager<AgentProcess> = new PolicyManager(this, AgentPolicyFactory.getInstance(), 'afterReject', AgentProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }

    

    static get(id: number): Observable<AgentProcess> {
        return AgentProcessFactory.createFromAgentId(id).flatMap(
            (agentProcess) => {
                let pm: PolicyManager<AgentProcess> = new PolicyManager<AgentProcess>(agentProcess, AgentPolicyFactory.getInstance(), 'onLoad', AgentProcess.getProcessConfig());
                return pm.applyPolicies();
            }
        );
    }

    get(id: number): Observable<AgentProcess> {
        return this.agentRepo.get(id)
            .map(
                (value) => {
                    this.agent = value;
                    this.agent.currentStage = "SHAHAL STGE";
                    return this;
                }
            )
    }


   
    static createNewProcess(): Observable<AgentProcess> {
        return AgentProcessFactory
            .createNew()
            .flatMap((agentProcess) => {
                let pm: PolicyManager<AgentProcess> = new PolicyManager<AgentProcess>(agentProcess, AgentPolicyFactory.getInstance(), 'onNew', AgentProcess.getProcessConfig());
                return pm.applyPolicies();
            });
    }

   
    static getProcessConfig() {
        return agentProcessConfig;
    }
}
