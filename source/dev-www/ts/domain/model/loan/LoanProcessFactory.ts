
import LoanAccount = require("./LoanAccount");
import {PolicyManager} from "../../shared/PolicyManager";
import {LoanPolicyFactory} from "./policy/LoanPolicyFactory";
import {Observable} from "@reactivex/rxjs";
import {ILoanRepository} from "./ILoanRepository";
import RepositoryFactory = require("../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../shared/RepositoryIdentifiers";
import {LoanProcess} from "./LoanProcess";
import {plainToClass} from "class-transformer";
import Utils = require("../../shared/Utils");
class LoanProcessFactory {

    static loanRepo:ILoanRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LoanProcess);

    static createFromLoanId(id: number): Observable<LoanProcess> {
        let lp: LoanProcess = new LoanProcess();
        return LoanProcessFactory.loanRepo.getIndividualLoan(id)
            .map(
                (loanAccount:Object) => {
                    lp.loanAccount = <LoanAccount>plainToClass<LoanAccount, Object>(LoanAccount, Utils.toJSObj(loanAccount));
                    // lp.loanAccount = plainToClass(LoanAccount, Utils.toJSObj(loanAccount));
                    return lp;
                }
            )

    }

    static fromLoanAccountObject(loanAccount: any): LoanProcess{
        return null;
    }

    static createNew(): Observable<LoanProcess>{
        return Observable.defer(() => {
            let lp: LoanProcess = new LoanProcess();
            lp.loanAccount = new LoanAccount();
            return Observable.of(lp);
        });
    }
}

export = LoanProcessFactory;
