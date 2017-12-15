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
export interface LoadStageRelatedPolicyArgs {
    stage: string;
}
export class LoadStageRelatedPolicy extends IPolicy<LoanProcess> {

    enrolmentRepo: IEnrolmentRepository;
    args: LoadStageRelatedPolicyArgs;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
        this.args = args;
    }

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        return Observable.defer(
            () => {
                if (_.hasIn(loanProcess, "loanAccount.leadId")){
                    let lead_id = loanProcess.loanAccount.leadId;
                    LeadProcessFactory.createFromLeadId(lead_id)
                    .subscribe( (value) => {

                        value.lead.currentStage = this.args.stage;
                        return Observable.of(value.proceed());

                    })
                }

            }
        )
    }

}
