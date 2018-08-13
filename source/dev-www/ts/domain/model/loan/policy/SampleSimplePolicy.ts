import {Observable} from "@reactivex/rxjs";
import LoanProcess = require("../LoanProcess");
import LeadInteraction = require("../LeadInteraction");
import {IPolicy} from "../../../shared/IPolicy";
import LoanProcess = require("../LoanProcess");

export interface SampleSimplePolicyArgs {
    defaultLeadStatus: string;
}

export class SampleSimplePolicy extends IPolicy<LoanProcess>{

    args: SampleSimplePolicyArgs;

    setArguments(args: SampleSimplePolicyArgs) {
        this.args = args;
    }

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        console.log("Running simple policy");
        console.log("Printing arguments");
        console.log(this.args);
        return Observable.of(loanProcess);
    }

}
