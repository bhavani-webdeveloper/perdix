import {IPolicy} from "../../../shared/IPolicy";
import {Observable} from "@reactivex/rxjs";
import {IEnrolmentRepository} from "../../customer/IEnrolmentRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import {UserSession, ISession} from "../../../shared/Session";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import Customer = require("../../customer/Customer");
import {AgentProcess} from "../AgentProcess";
import * as _ from 'lodash';
import {EnrolmentProcess} from "../../customer/EnrolmentProcess";




export class LoadRelatedCustomersPolicy extends IPolicy<AgentProcess> {

    enrolmentRepo: IEnrolmentRepository;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(agentProcess: AgentProcess): Observable<AgentProcess> {
        let activeSession:ISession = ObjectFactory.getInstance("Session");
        let observables = [];      

        if (_.hasIn(agentProcess, "agent.customerId"){
            let obs1 = EnrolmentProcess.fromCustomerID(agentProcess.agent.customerId)
                .map(
                    (customer: EnrolmentProcess) => {
                        agentProcess.applicantEnrolmentProcess = customer;
                        return customer;
                    }
                );
            observables.push(obs1);
        }

        if (_.hasIn(agentProcess, "agent.customerId")){
            let obs2 = EnrolmentProcess.fromCustomerID(agentProcess.agent.customerId)
                .map(
                    (customer: EnrolmentProcess) => {
                        agentProcess.loanCustomerEnrolmentProcess = customer;
                        return customer;
                    }
                );
            observables.push(obs2);
        }

        return Observable.merge(observables, 5)
            .concatAll()
            .last()
            .map(
                (value) => {
                    return agentProcess;
                }
            );
    }

}
