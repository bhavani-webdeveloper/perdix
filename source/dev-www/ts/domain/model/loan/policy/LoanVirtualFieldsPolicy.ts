import {IPolicy} from "../../../shared/IPolicy";
import {LoanProcess} from "../LoanProcess";
import {Observable} from "@reactivex/rxjs";
import LoanCentre = require("../LoanCentre");
/**
 * Created by shahalpk on 11/01/18.
 */

export class LoanVirtualFieldsPolicy extends IPolicy<LoanProcess> {

    setArguments(args) {
    }

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        if (_.hasIn(loanProcess, 'loanAccount')) {
	        loanProcess.loanAccount.vProcessingFee = null;
	        loanProcess.loanAccount.vExpectedProcessingFee = null;
	        
	        if(loanProcess.loanAccount.loanAmount && loanProcess.loanAccount.processingFeePercentage) {
	            loanProcess.loanAccount.vProcessingFee = Math.round(((loanProcess.loanAccount.processingFeePercentage / 100) * loanProcess.loanAccount.loanAmount)* 100) / 100;
	        }

	        if(loanProcess.loanAccount.expectedProcessingFeePercentage && loanProcess.loanAccount.loanAmountRequested) {
        		loanProcess.loanAccount.vExpectedProcessingFee = Math.round(((loanProcess.loanAccount.expectedProcessingFeePercentage / 100) * loanProcess.loanAccount.loanAmountRequested)* 100) / 100;
	        }
        }

        return Observable.of(loanProcess);
    }

}
