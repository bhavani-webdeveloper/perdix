import {Observable} from "@reactivex/rxjs";
import LeadInteraction = require("../LeadInteraction");
import {IPolicy} from "../../../shared/IPolicy";
import LoanRepository = require("../LoanRepository");
import {plainToClass} from "class-transformer";
import {map} from "@reactivex/rxjs/dist/cjs/operator/map";
import LoanAccount = require("../LoanAccount");
import {LoanProcess} from "../LoanProcess";
import {Utils} from "../../../shared/Utils";

export interface SampleSimplePolicyArgs {
    defaultLeadStatus: string;
}

export class SampleMultiPolicy extends IPolicy<LoanProcess>{

    args: SampleSimplePolicyArgs;

    setArguments(args: SampleSimplePolicyArgs) {
        this.args = args;
    }

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        let repo:LoanRepository = new LoanRepository();

        return repo.getIndividualLoan(6894)
            .map(
                (value: Object) => {
                    console.log("SHAHAL inside1");
                    console.log(value);
                    //noinspection TypeScriptValidateTypes
                    loanProcess.loanAccount = plainToClass(LoanAccount, Utils.toJSObj(value));
                    return loanProcess;
                }
            )
            .flatMap(
                (x) => {
                    console.log("SHAHAL inside2");
                    console.log(x);
                    return repo.getIndividualLoan(6893)
                        .map(
                            (value) => {
                                console.log("SHAHAL inside3" + value.id);
                                return value;
                            }
                        )
                }
            )
            .flatMap(
                (x) => {
                    console.log("SHAHAL inside4");
                    console.log(x);
                    return Observable.of(x);
                }
            )

    }

}
