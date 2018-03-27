
import { LiabilityAccount } from "./LiabilityAccount";
import {PolicyManager} from "../../../shared/PolicyManager";
import {LiabilityLoanAccountBookingPolicyFactory} from "./policy/LiabilityLoanAccountBookingPolicyFactory";
import {Observable} from "@reactivex/rxjs";
import {ILiabilityLoanAccountBookingRepository} from "./ILiabilityLoanAccountBookingRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import {LiabilityLoanAccountBookingProcess} from "./LiabilityLoanAccountBookingProcess";
import {plainToClass} from "class-transformer";
import {Utils} from "../../../shared/Utils";
export class LiabilityLoanAccountBookingProcessFactory {

    static liabilityRepo:ILiabilityLoanAccountBookingRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LiabilityLoanAccountBookingProcess);

    static createFromLoanId(id: number): Observable<LiabilityLoanAccountBookingProcess> {
        let lp: LiabilityLoanAccountBookingProcess = new LiabilityLoanAccountBookingProcess();
        return LiabilityLoanAccountBookingProcessFactory.liabilityRepo.getLenderLoan(id)
            .map(
                (liabilityAccount:Object) => {
                    console.log(liabilityAccount);
                    lp.liabilityAccount = <LiabilityAccount>plainToClass<LiabilityAccount, Object>(LiabilityAccount, Utils.toJSObj(liabilityAccount));
                    // lp.loanAccount = plainToClass(LoanAccount, Utils.toJSObj(loanAccount));
                    return lp;
                }
            )

    }

}
