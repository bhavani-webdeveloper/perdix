import {IPolicy} from "../../../shared/IPolicy";
import {LoanProcess} from "../LoanProcess";
import {Observable} from "@reactivex/rxjs";
/**
 * Created by shahalpk on 11/01/18.
 */

export class ProcessingFeeInRupees extends IPolicy<LoanProcess> {

    setArguments(args) {
    }

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        if(loanProcess.loanAccount && loanProcess.loanAccount.processingFeeInPaisa && loanProcess.loanAccount.processingFeeInPaisa != 0) {
            loanProcess.loanAccount.processingFeeInPaisa = loanProcess.loanAccount.processingFeeInPaisa/100;
        }
        return Observable.of(loanProcess);
    }

}
