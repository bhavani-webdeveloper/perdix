
import {IPolicy} from "../../../shared/IPolicy";
import {AgentProcess} from "../AgentProcess";
import {Observable} from "@reactivex/rxjs";
import {IEnrolmentRepository} from "../../customer/IEnrolmentRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import EnrolmentProcessFactory = require("../../customer/EnrolmentProcessFactory");
import {EnrolmentProcess, enrolmentProcessConfig} from "../../customer/EnrolmentProcess";
import {CustomerTypes} from "../../customer/Customer";
export class DefaultRelatedCustomersPolicy extends IPolicy<AgentProcess> {

    args: DefaultRelatedCustomersPolicyType;

    setArguments(args: DefaultRelatedCustomersPolicyType) {
        this.args = args;
    }

    run(agentProcess: AgentProcess): Observable<AgentProcess> {
        let repo:IEnrolmentRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);

        let observables = [];
        if (this.args.applicant == true){
            let applicantProcessObs: Observable<EnrolmentProcess> = EnrolmentProcess
                .createNewProcess()
                .map((enrolmentProcess: EnrolmentProcess) => {
                    agentProcess.setRelatedCustomerWithRelation(enrolmentProcess);
                    return agentProcess;
                });
            observables.push(applicantProcessObs);
        }

       

        return Observable.merge(...observables).last();
    }
}

export interface DefaultRelatedCustomersPolicyType {
    applicant: boolean;

}
