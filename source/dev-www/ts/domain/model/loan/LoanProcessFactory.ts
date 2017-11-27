
import LoanProcess = require("./LoanProcess");
import LoanAccount = require("./LoanAccount");
import {PolicyManager} from "../../shared/PolicyManager";
import {LoanPolicyFactory} from "./policy/LoanPolicyFactory";
import LeadProcess = require("../lead/LeadProcess");
import {Observable} from "@reactivex/rxjs";
class LoanProcessFactory {

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
