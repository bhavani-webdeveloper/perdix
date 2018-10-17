///<amd-dependency path="perdixConfig/LiabilityRepaymentConfig" name="liabilityRepaymentConfig"/>

import {RepositoryIdentifiers} from '../../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../../shared/RepositoryFactory');
import {ILiabilityRepaymentRepository} from "./ILiabilityRepaymentRepository";
import {Observable} from "@reactivex/rxjs";
import {plainToClass} from "class-transformer";
import {PolicyManager} from "../../../shared/PolicyManager";
import {LiabilityRepay} from "./LiabilityRepay";
import {LiabilityRepaymentPolicyFactory}  from "./policy/LiabilityRepaymeentPolicyFactory";
import {LiabilityLoanAccountBookingProcess} from "./LiabilityLoanAccountBookingProcess";



declare var liabilityRepaymentConfig: Object;

export class LiabilityRepayment{
	LiabilityRepaymentRepo:ILiabilityRepaymentRepository;
	liabilityProcessAction: string;
    liabilityLoanAccountBookingProcess:any;
    
    liabilityRepay: LiabilityRepay;
    constructor() {
        this.LiabilityRepaymentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LiabilityRepayment);
       // this.liabilityLoanAccountBookingProcess  = new LiabilityLoanAccountBookingProcess();
    }
   
    save(): any {
        //this.liabilityProcessAction = 'SAVE';
        let obs1 = this.LiabilityRepaymentRepo.repay(this);
      return Observable.concat(obs1).last();
    }

      update(): any {
        let obs1 = this.LiabilityRepaymentRepo.partialRepay(this.liabilityRepay);
        return Observable.concat(obs1).last();
    }

     static createNewProcess(): Observable<LiabilityRepayment> {
        let ep = new LiabilityRepayment();
        ep.liabilityRepay = new LiabilityRepay();
        let pm: PolicyManager<LiabilityRepayment> = new PolicyManager<LiabilityRepayment>(ep, LiabilityRepaymentPolicyFactory.liabilityRepayment, 'onNew', LiabilityRepayment.getProcessConfig());
        return pm.applyPolicies();
    }

     static getProcessConfig() {
        return liabilityRepaymentConfig;
    }


}
