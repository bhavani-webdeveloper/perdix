///<amd-dependency path="perdixConfig/AgentProcessConfig" name="agentProcessConfig"/>

import {RepositoryIdentifiers} from '../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../shared/RepositoryFactory');
import {EnrolmentProcess} from "../customer/EnrolmentProcess";
import {IAgentRepository} from "./IAgentRepository";
import {Observable} from "@reactivex/rxjs";
import {plainToClass} from "class-transformer";
import {PolicyManager} from "../../shared/PolicyManager";
import {Customer, CustomerTypes} from "../customer/Customer";
import {AgentPolicyFactory} from "./policy/AgentPolicyFactory";
import AgentProcessFactory = require("./AgentProcessFactory");
import AgentEnterpriseCustomerRelation = require("./AgentEnterpriseCustomerRelation");


declare var agentProcessConfig: Object;

export class AgentProcess {
    remarks: string;
    stage: string;    
    agentProcessAction: string;
    customer: Customer;
    agentAction: string;
    agentRepo: IAgentRepository;

    
    loanCustomerEnrolmentProcess: EnrolmentProcess;
    applicantEnrolmentProcess: EnrolmentProcess;
    agent : AgentProcess;


    constructor() {
        this.agentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.AgentProcess);
    }

    save(): any {
        /* Calls all business policies associated with save */
        this.agentProcessAction = "SAVE";
        let pmBeforeUpdate: PolicyManager<AgentProcess> = new PolicyManager(this, AgentPolicyFactory.getInstance(), 'beforeSave', AgentProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = null;       

        let pmAfterUpdate: PolicyManager<AgentProcess> = new PolicyManager(this, AgentPolicyFactory.getInstance(), 'afterSave', AgentProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }


    // proceed(toStage: string): any {
    //     /* Calls all business policies assocaited with proceed */
    //     this.stage = toStage;
    //     this.agentProcessAction = "SAVE";
    //     let pmBeforeUpdate: PolicyManager<AgentProcess> = new PolicyManager(this, AgentPolicyFactory.getInstance(), 'beforeProceed', AgentProcess.getProcessConfig());
    //     let obs1 = pmBeforeUpdate.applyPolicies();
    //     let obs2 = this.agentRepo.updateAgent(this);
    //     let pmAfterUpdate: PolicyManager<AgentProcess> = new PolicyManager(this, AgentPolicyFactory.getInstance(), 'afterProceed', AgentProcess.getProcessConfig());
    //     let obs3 = pmAfterUpdate.applyPolicies();
    //     return Observable.concat(obs1, obs2, obs3).last();
    // }

   

    // static get(id: number): Observable<AgentProcess> {
    //     return AgentProcessFactory.createFromLoanId(id).flatMap(
    //         (AgentProcess) => {
    //             let pm: PolicyManager<AgentProcess> = new PolicyManager<AgentProcess>(AgentProcess, AgentPolicyFactory.getInstance(), 'onLoad', AgentProcess.getProcessConfig());
    //             return pm.applyPolicies();
    //         }
    //     );
    // }


    // get(id: number): Observable<AgentProcess> {
    //     return this.agentRepo.getIndividualLoan(id)
    //         .map(
    //             (value) => {
    //                 this.loanAccount = value;
    //                 this.loanAccount.currentStage = "SHAHAL STGE";
    //                 return this;
    //             }
    //         )
    // }

    getCustomerRelation(customer: Customer, coCustomers: Array<Customer>): Customer {
        if (customer) {
            let index = _.findIndex(coCustomers, function (cust) {
                return customer.id == cust.id;
            })
            if (index == -1) {
                return new Customer();
            }
            return coCustomers[index];
        } else {
            return new Customer();
        }
    }

    static createNewProcess(): Observable<AgentProcess> {
        return AgentProcessFactory
            .createNew()
            // .flatMap((AgentProcess) => {
            //     let pm: PolicyManager<AgentProcess> = new PolicyManager<AgentProcess>(AgentProcess, LoanPolicyFactory.getInstance(), 'onNew', AgentProcess.getProcessConfig());
            //     return pm.applyPolicies();
            // });
    }


    static getProcessConfig() {
        return agentProcessConfig;
    }
}
