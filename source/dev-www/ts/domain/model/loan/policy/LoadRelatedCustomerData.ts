import {IPolicy} from "../../../shared/IPolicy";
import {Observable} from "@reactivex/rxjs";
import {IEnrolmentRepository} from "../../customer/IEnrolmentRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import {UserSession, ISession} from "../../../shared/Session";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import Customer = require("../../customer/Customer");
import FamilyMember = require("../../customer/FamilyMember");
import {LoanProcess} from "../LoanProcess";
import * as _ from 'lodash';
import Utils = require("../../../shared/Utils");
import EnrolmentProcessFactory = require("../../customer/EnrolmentProcessFactory");






export class LoadRelatedCustomerData extends IPolicy<LoanProcess> {

    enrolmentRepo: IEnrolmentRepository;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        let activeSession:ISession = ObjectFactory.getInstance("Session");
        return Observable.defer(
            () => {
                try {
                    let observables = [];
                    let cs = new Customer();
                    let obs1 = EnrolmentProcessFactory.fromCustomer(cs);

                    observables.push(obs1);
                    loanProcess.loanAccount.applicantCustomer = cs;
                    // loanProcess.customer = cs;
                    observables.push(Observable.of(loanProcess));
                   
                    return Observable.merge(observables, 5)
                        .concatAll()
                        .last()
                        .map(
                            (value) => {
                                return loanProcess;
                            }
                        );
                } catch(err) {
                    console.error(err);
                    return Observable.of(loanProcess);
                }
                
            }
        )
    }

}
