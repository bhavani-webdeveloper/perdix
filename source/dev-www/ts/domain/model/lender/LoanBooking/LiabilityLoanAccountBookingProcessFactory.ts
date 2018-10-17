
import {plainToClass} from "class-transformer";
import {Utils} from "../../../shared/Utils";
import  LiabilityAccount = require("./LiabilityAccount") ;
import {PolicyManager} from "../../../shared/PolicyManager";
import {LiabilityLoanAccountBookingPolicyFactory} from "./policy/LiabilityLoanAccountBookingPolicyFactory";
import {Observable} from "@reactivex/rxjs";
import {ILiabilityLoanAccountBookingRepository} from "./ILiabilityLoanAccountBookingRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import {LiabilityLoanAccountBookingProcess} from "./LiabilityLoanAccountBookingProcess";


export class LiabilityLoanAccountBookingProcessFactory {

    static liabilityRepo:ILiabilityLoanAccountBookingRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LiabilityLoanAccountBookingProcess);
    
    static createFromLoanId(id: number): Observable<LiabilityLoanAccountBookingProcess> {
        var liabilityAccount:LiabilityAccount ;
        let lp: LiabilityLoanAccountBookingProcess = new LiabilityLoanAccountBookingProcess();
        return LiabilityLoanAccountBookingProcessFactory.liabilityRepo.getLenderLoan(id)
            .map(
                (value:Object) => {
                    let obj:Object = Utils.toJSObj(value);
                    liabilityAccount = <LiabilityAccount>plainToClass<LiabilityAccount, Object>(LiabilityAccount, obj);
                     let liabilityLoanAccountBookingProcess = new LiabilityLoanAccountBookingProcess();
                     liabilityLoanAccountBookingProcess.liabilityAccount = liabilityAccount;
                     return liabilityLoanAccountBookingProcess
                    // console.log(liabilityAccount);
                    // lp.liabilityAccount = <LiabilityAccount>plainToClass<LiabilityAccount,Object>(LiabilityAccount, Utils.toJSObj(liabilityAccount));
                    // // lp.loanAccount = plainToClass(LoanAccount, Utils.toJSObj(loanAccount));
                    // return lp;
                }
            )

    }

}
