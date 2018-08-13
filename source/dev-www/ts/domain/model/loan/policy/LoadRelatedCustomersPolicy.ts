import {IPolicy} from "../../../shared/IPolicy";
import {Observable} from "@reactivex/rxjs";
import {IEnrolmentRepository} from "../../customer/IEnrolmentRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import {UserSession, ISession} from "../../../shared/Session";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import Customer = require("../../customer/Customer");
import {LoanProcess} from "../LoanProcess";
import * as _ from 'lodash';
import {EnrolmentProcess} from "../../customer/EnrolmentProcess";
import {LoanCustomerRelationTypes} from "../LoanCustomerRelation";


/**
 * Created by shahalpk on 28/11/17.
 */

export class LoadRelatedCustomersPolicy extends IPolicy<LoanProcess> {

    enrolmentRepo: IEnrolmentRepository;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        let activeSession:ISession = ObjectFactory.getInstance("Session");
        let observables = [];
        if (_.hasIn(loanProcess, "loanAccount.loanCustomerRelations") || _.isArray(loanProcess.loanAccount.loanCustomerRelations)){
            for (let lcr of loanProcess.loanAccount.loanCustomerRelations){
                if (lcr.customerId!=null){
                    let obs1 = EnrolmentProcess.fromCustomerID(lcr.customerId)
                        .map(
                            (customer: EnrolmentProcess) => {
                                loanProcess.setRelatedCustomer(customer);
                                return customer;
                            }
                        );
                    observables.push(obs1);
                }
            }
        }

        if (_.hasIn(loanProcess, "loanAccount.customerId")){
            let obs2 = EnrolmentProcess.fromCustomerID(loanProcess.loanAccount.customerId)
                .map(
                    (customer: EnrolmentProcess) => {
                        loanProcess.loanCustomerEnrolmentProcess = customer;
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
                    return loanProcess;
                }
            );
    }

}
