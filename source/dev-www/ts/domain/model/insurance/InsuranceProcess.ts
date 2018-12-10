///<amd-dependency path="perdixConfig/InsuranceProcessConfig" name="insuranceProcessConfig"/>

import {RepositoryIdentifiers} from '../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../shared/RepositoryFactory');
import {IInsuranceRepository} from "./IInsuranceRepository";
import {Observable} from "@reactivex/rxjs";

import {PolicyManager} from "../../shared/PolicyManager";
import {InsurancePolicyFactory} from "./policy/InsurancePolicyFactory";
import InsuranceProcessFactory = require("./InsuranceProcessFactory");
import InsurancePolicyDetails  from "./InsurancePolicyDetails";

import * as _ from 'lodash';



declare var insuranceProcessConfig: Object;

export class InsuranceProcess {
    
       
    insuranceRepo: IInsuranceRepository;
    insurancePolicyDetailsDTO: InsurancePolicyDetails;
  

    constructor() {
        this.insuranceRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Insurance);
    }

    
    save(): any {
        return this.insuranceRepo.create(this)
       
    }
    getPremiumAmount():any{
        return this.insuranceRepo.getPremiumAmount(this)
    }

     static createNewProcess(): Observable<InsuranceProcess> {
        return InsuranceProcessFactory
            .createNew();
            // .flatMap((insuranceProcess) => {
            //     let pm: PolicyManager<LoanProcess> = new PolicyManager<LoanProcess>(loanProcess, LoanPolicyFactory.getInstance(), 'onNew', LoanProcess.getProcessConfig());
            //     return pm.applyPolicies();
            // });
        // let ep = new InsuranceProcess();  
        // ep.insurancePolicyDetailsDTO = new InsurancePolicyDetails();
        // return Observable.of(ep);       
        // let pm: PolicyManager<InsuranceProcess> = new PolicyManager<InsuranceProcess>(ep, InsurancePolicyFactory.getInstance(), 'onNew', InsuranceProcess.getProcessConfig());
        // return pm.applyPolicies();
    }

   
    static fromInsurancePolicyID(id: number): Observable<InsuranceProcess> {
        return InsuranceProcessFactory.createFromInsurancePolicyID(id);
    }

    static get(id: number): Observable<InsuranceProcess> {
        return this.insuranceRepo.getById(id)
            .map(
                (value) => {
                    this.insurancePolicyDetailsDTO = value;
                    // this.loanAccount.currentStage = "SHAHAL STGE";
                    return this;
                }
            )
    } 

    static getProcessConfig() {
        return insuranceProcessConfig;
    }

    

   
}
