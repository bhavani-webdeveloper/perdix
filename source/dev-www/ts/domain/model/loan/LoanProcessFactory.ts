
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
import * as _ from "lodash";
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
        let observables = [];
        let lp: LoanProcess = new LoanProcess();

        if(_.hasIn(loanProcess, 'loanAccount')) {
            lp.loanAccount = <LoanAccount>plainToClass<LoanAccount, Object>(LoanAccount, Utils.toJSObj(loanProcess.loanAccount));
        }

        if(_.hasIn(loanProcess, 'loanCustomerEnrolmentProcess') && _.hasIn(loanProcess.loanCustomerEnrolmentProcess, 'customer')) {
            let loanCustomer = EnrolmentProcess.plainToClass(loanProcess.loanCustomerEnrolmentProcess.customer).map(
                    (value: EnrolmentProcess) => {
                        lp.loanCustomerEnrolmentProcess = value;
                        return lp;
                    });
            observables.push(loanCustomer);
        }

        if(_.hasIn(loanProcess, 'applicantEnrolmentProcess') && _.hasIn(loanProcess.applicantEnrolmentProcess, 'customer')) {
            let applicant = EnrolmentProcess.plainToClass(loanProcess.applicantEnrolmentProcess.customer)
                .map(
                    (value: EnrolmentProcess) => {
                        lp.applicantEnrolmentProcess = value;
                        return lp;
                    }
                );
            observables.push(applicant);
        }

        if(_.hasIn(loanProcess, 'coApplicantsEnrolmentProcesses') && loanProcess.coApplicantsEnrolmentProcesses.length > 0) {
            for(let enrolmentProcess of loanProcess.coApplicantsEnrolmentProcesses) {
                let coApplicant = EnrolmentProcess.plainToClass(enrolmentProcess.customer)
                    .map(
                        (value: EnrolmentProcess) => {
                            lp.coApplicantsEnrolmentProcesses.push(value);
                            return lp;
                        }
                    );
                observables.push(coApplicant);
            }
        }

        if(_.hasIn(loanProcess, 'guarantorsEnrolmentProcesses') && loanProcess.guarantorsEnrolmentProcesses.length > 0) {
            for(let enrolmentProcess of loanProcess.guarantorsEnrolmentProcesses) {
                let guarantor = EnrolmentProcess.plainToClass(enrolmentProcess.customer)
                    .map(
                        (value: EnrolmentProcess) => {
                            lp.guarantorsEnrolmentProcesses.push(value);
                            return lp;
                        }
                    );
                observables.push(guarantor);
            }
        }

        if(Observable.length>0) {
            return Observable.concat(...observables).last();
        } else {
            Observable.of(lp);
        }
    }
}

export = LoanProcessFactory;
