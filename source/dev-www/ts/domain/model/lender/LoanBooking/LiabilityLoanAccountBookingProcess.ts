import {RepositoryIdentifiers} from '../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../shared/RepositoryFactory');
import {IEnrolmentRepository} from "./IEnrolmentRepository";
import {Observable} from "@reactivex/rxjs";
import {plainToClass} from "class-transformer";
import {PolicyManager} from "../../shared/PolicyManager";
import {LiabilityAccounts} from "./lender";

export class LiabilityLoanAccountBookingProcess {
    
    liabilityAccounts: LiabilityAccounts;
    constructor() {
        this.LiabilityLoanAccountBookingProcessRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LiabilityLoanAccountBookingProcess);
    }

    save(): any {
        this.liabilityProcessAction = 'SAVE';
        let obs1 = this.LiabilityLoanAccountBookingProcessRepo.saveLiabilityLoanAccount(this)
        return Observable.concat(obs1).last();
    }
}
