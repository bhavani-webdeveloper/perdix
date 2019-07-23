import {IPolicy} from "../../../shared/IPolicy";
import {LoanProcess} from "../LoanProcess";
import {Observable} from "@reactivex/rxjs";
import LoanCentre = require("../LoanCentre");
/**
 * Created by shahalpk on 11/01/18.
 */

export class LoanDerivedFieldsUpdate extends IPolicy<LoanProcess> {

    setArguments(args) {
    }

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        if (_.hasIn(loanProcess, 'applicantEnrolmentProcess.customer.centreId') && _.isNumber(loanProcess.applicantEnrolmentProcess.customer.centreId)){
            if (!_.hasIn(loanProcess.loanAccount, 'loanCentre.centreId') || _.isUndefined(loanProcess.loanAccount.loanCentre.centreId)){
                loanProcess.loanAccount.loanCentre = loanProcess.loanAccount.loanCentre || new LoanCentre();
                loanProcess.loanAccount.loanCentre.centreId = loanProcess.applicantEnrolmentProcess.customer.centreId;
            }
        }
        return Observable.of(loanProcess);
    }

}
