
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
                    lp.loanAccount = plainToClass(LoanAccount, Utils.toJSObj(loanAccount));
                    return lp;
                }
            )

    }

    static fromLoanAccountObject(loanAccount: any): LoanProcess{
        return null;
    }

    static newLoanProcess(): Observable<LoanProcess> {
        let lp: LoanProcess = new LoanProcess();
        lp.loanAccount = new LoanAccount();
        let pm: PolicyManager<LoanProcess> = new PolicyManager<LoanProcess>(lp, LoanPolicyFactory.getInstance(), 'onNew', LoanProcess.getProcessConfig());
        return pm.applyPolicies();
    }
}

export = LoanProcessFactory;
