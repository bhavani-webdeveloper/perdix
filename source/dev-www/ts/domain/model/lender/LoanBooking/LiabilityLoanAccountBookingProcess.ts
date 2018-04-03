///<amd-dependency path="perdixConfig/LiabilityLoanAccountBookingProcessConfig" name="liabilityLoanAccountBookingProcessConfig"/>

import {RepositoryIdentifiers} from '../../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../../shared/RepositoryFactory');
import {ILiabilityLoanAccountBookingRepository} from "./ILiabilityLoanAccountBookingRepository";
import {Observable} from "@reactivex/rxjs";
import {plainToClass} from "class-transformer";
import {PolicyManager} from "../../../shared/PolicyManager";
import {LiabilityLoanAccountBookingPolicyFactory}  from "./policy/LiabilityLoanAccountBookingPolicyFactory";
import {LiabilityLoanAccountBookingProcessFactory} from "./LiabilityLoanAccountBookingProcessFactory";
import {LiabilityAccount} from "./LiabilityAccount";
import {EnrolmentProcess} from "../../customer/EnrolmentProcess";

declare var liabilityLoanAccountBookingProcessConfig: Object;

export class LiabilityLoanAccountBookingProcess {
	LiabilityLoanAccountBookingProcessRepo:ILiabilityLoanAccountBookingRepository;
	liabilityProcessAction: string;
    
    liabilityAccount: LiabilityAccount;
    lenderEnrolmentProcess: EnrolmentProcess;
    constructor() {
        this.LiabilityLoanAccountBookingProcessRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LiabilityLoanAccountBookingProcess);
    }

    save(): any {
        this.liabilityProcessAction = 'SAVE';
        let obs1 = this.LiabilityLoanAccountBookingProcessRepo.saveLiabilityLoanAccount(this);
        console.log("booking process");
        console.log(this.liabilityAccount);
        return Observable.concat(obs1).last();
    }

    proceed(): any {
        this.liabilityProcessAction = 'PROCEED';
        let obs1 = this.LiabilityLoanAccountBookingProcessRepo.proceedLiabilityLoanAccount(this);
        return Observable.concat(obs1).last();
    }

    static createNewProcess(): Observable<LiabilityLoanAccountBookingProcess> {
        let ep = new LiabilityLoanAccountBookingProcess();
        ep.liabilityAccount = new LiabilityAccount();
       //  ep.customer.customerType = customerType;
        let pm: PolicyManager<LiabilityLoanAccountBookingProcess> = new PolicyManager<LiabilityLoanAccountBookingProcess>(ep, LiabilityLoanAccountBookingPolicyFactory.liabilityLoanFactory, 'onNew', LiabilityLoanAccountBookingProcess.getProcessConfig());
        return pm.applyPolicies();
    }

    static get(id: number): Observable<LiabilityLoanAccountBookingProcess> {
        return LiabilityLoanAccountBookingProcessFactory.createFromLoanId(id).flatMap(
            (liabilityLoanAccountBookingProcess) => {
                let pm: PolicyManager<LiabilityLoanAccountBookingProcess> = new PolicyManager<LiabilityLoanAccountBookingProcess>(liabilityLoanAccountBookingProcess, LiabilityLoanAccountBookingPolicyFactory.getInstance(), 'onLoad', LiabilityLoanAccountBookingProcess.getProcessConfig());
                return pm.applyPolicies();
            }
        );
    }

     static getProcessConfig() {
        return liabilityLoanAccountBookingProcessConfig;
    }

    setLender(lender:EnrolmentProcess): LiabilityLoanAccountBookingProcess {
        this.lenderEnrolmentProcess = lender;
        return this;
    }

}
