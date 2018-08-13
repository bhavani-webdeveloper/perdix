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
import {LeadProcessFactory} from '../../lead/LeadProcessFactory';


/**
 * Created by shahalpk on 28/11/17.
 */
export interface OriginationToBookingPolicyArgs {
    postStage: string;
}
export class OriginationToBookingPolicy extends IPolicy<LoanProcess> {

    enrolmentRepo: IEnrolmentRepository;
    args: OriginationToBookingPolicyArgs;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
        this.args = args;
    }

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        loanProcess.stage = this.args.postStage;
        return Observable.of(loanProcess);
    }

}
