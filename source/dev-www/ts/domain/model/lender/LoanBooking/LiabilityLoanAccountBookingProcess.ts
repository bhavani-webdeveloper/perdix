///<amd-dependency path="perdixConfig/LiabilityLoanAccountBookingProcessConfig" name="liabilityLoanAccountBookingProcessConfig"/>

import {RepositoryIdentifiers} from '../../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../../shared/RepositoryFactory');
import {ILiabilityLoanAccountBookingRepository} from "./ILiabilityLoanAccountBookingRepository";
import {Observable} from "@reactivex/rxjs";
import {plainToClass} from "class-transformer";
import {PolicyManager} from "../../../shared/PolicyManager";
import {LiabilityLoanAccountBookingPolicyFactory}  from "./policy/LiabilityLoanAccountBookingPolicyFactory";
import {LiabilityAccounts} from "./LiabilityAccount";

declare var liabilityLoanAccountBookingProcessConfig: Object;

export class LiabilityLoanAccountBookingProcess {
	LiabilityLoanAccountBookingProcessRepo:ILiabilityLoanAccountBookingRepository;
	liabilityProcessAction: string;
    
    liabilityAccounts: LiabilityAccounts;
    constructor() {
        this.LiabilityLoanAccountBookingProcessRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LiabilityLoanAccountBookingProcess);
    }

    save(): any {
        this.liabilityProcessAction = 'SAVE';
        let obs1 = this.LiabilityLoanAccountBookingProcessRepo.saveLiabilityLoanAccount(this)
        return Observable.concat(obs1).last();
    }

    static createNewProcess(): Observable<LiabilityLoanAccountBookingProcess> {
        let ep = new LiabilityLoanAccountBookingProcess();
        ep.liabilityAccounts = new LiabilityAccounts();
       //  ep.customer.customerType = customerType;
        let pm: PolicyManager<LiabilityLoanAccountBookingProcess> = new PolicyManager<LiabilityLoanAccountBookingProcess>(ep, LiabilityLoanAccountBookingPolicyFactory.liabilityLoanFactory, 'onNew', LiabilityLoanAccountBookingProcess.getProcessConfig());
        return pm.applyPolicies();
    }

     static getProcessConfig() {
        return liabilityLoanAccountBookingProcessConfig;
    }


}
