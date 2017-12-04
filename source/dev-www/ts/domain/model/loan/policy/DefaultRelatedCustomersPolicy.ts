
import {IPolicy} from "../../../shared/IPolicy";
import {LoanProcess} from "../LoanProcess";
import {Observable} from "@reactivex/rxjs";
import LoanRepository = require("../LoanRepository");
import {IEnrolmentRepository} from "../../customer/IEnrolmentRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import EnrolmentProcessFactory = require("../../customer/EnrolmentProcessFactory");
import {EnrolmentProcess, enrolmentProcessConfig} from "../../customer/EnrolmentProcess";
import {CustomerTypes} from "../../customer/Customer";
import {LoanCustomerRelationTypes} from "../LoanCustomerRelation";
export class DefaultRelatedCustomersPolicy extends IPolicy<LoanProcess> {

    args: DefaultRelatedCustomersPolicyType;

    setArguments(args: DefaultRelatedCustomersPolicyType) {
        this.args = args;
    }

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        let repo:IEnrolmentRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);

        let observables = [];
        if (this.args.applicant == true){
            let applicantProcessObs: Observable<EnrolmentProcess> = EnrolmentProcess
                .createNewProcess()
                .map((enrolmentProcess: EnrolmentProcess) => {
                    loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, LoanCustomerRelationTypes.APPLICANT);
                    return loanProcess;
                });
            observables.push(applicantProcessObs);
        }

        if (this.args.loanCustomer == true){
            let customerType:CustomerTypes = <CustomerTypes>this.args.loanCustomerType;
            let loanCustomerProcessObs: Observable<EnrolmentProcess> = EnrolmentProcess
                .createNewProcess(customerType)
                .map((enrolmentProcess: EnrolmentProcess) => {
                    loanProcess.loanCustomerEnrolmentProcess = enrolmentProcess;
                    return loanProcess;
                })
            observables.push(loanCustomerProcessObs);
        }

        return Observable.merge(...observables).last();
    }
}

export interface DefaultRelatedCustomersPolicyType {
    applicant: boolean;
    coApplicant: boolean;
    guarantor: boolean;
    loanCustomer: boolean;
    loanCustomerType: string;
}
