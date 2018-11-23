
import LoanAccount = require("./LoanAccount");
import {EnrolmentProcess} from "../customer/EnrolmentProcess";
import {PolicyManager} from "../../shared/PolicyManager";
import {LoanPolicyFactory} from "./policy/LoanPolicyFactory";
import {Observable} from "@reactivex/rxjs";
import {ILoanRepository} from "./ILoanRepository";
import RepositoryFactory = require("../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../shared/RepositoryIdentifiers";
import {LoanProcess} from "./LoanProcess";
import {plainToClass} from "class-transformer";
import {Utils} from "../../shared/Utils";
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

    static plainToClass(loanProcess: LoanProcess): Observable<LoanProcess> {
        let lp: LoanProcess = new LoanProcess();
        lp.loanAccount = <LoanAccount>plainToClass<LoanAccount, Object>(LoanAccount, Utils.toJSObj(loanProcess.loanAccount));
        lp.loanCustomerEnrolmentProcess = <EnrolmentProcess>plainToClass<EnrolmentProcess, Object>(EnrolmentProcess, Utils.toJSObj(loanProcess.loanCustomerEnrolmentProcess));
        lp.applicantEnrolmentProcess = <EnrolmentProcess>plainToClass<EnrolmentProcess, Object>(EnrolmentProcess, Utils.toJSObj(loanProcess.applicantEnrolmentProcess));
        lp.coApplicantsEnrolmentProcesses = <EnrolmentProcess>plainToClass<EnrolmentProcess, Object>(EnrolmentProcess, Utils.toJSObj(loanProcess.coApplicantsEnrolmentProcesses));
        lp.guarantorsEnrolmentProcesses = <EnrolmentProcess>plainToClass<EnrolmentProcess, Object>(EnrolmentProcess, Utils.toJSObj(loanProcess.guarantorsEnrolmentProcesses));
        return Observable.of(lp);
    }
}

export = LoanProcessFactory;
