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
export interface CloseLeadonLoanSave {
    stage: string;
    fromStage: string;
}
export class CloseLeadonLoanSave extends IPolicy<LoanProcess> {

    enrolmentRepo: IEnrolmentRepository;
    args: CloseLeadonLoanSave;

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
                        // return Observable.throw(new Error("shahal error"));
                        return LeadProcessFactory.createFromLeadId(lead_id)
                            .map((leadProcess) => {
                                leadProcess.stage = this.args.stage;
                                if(leadProcess.lead.currentStage==this.args.fromStage) {
                                    return leadProcess.proceed();
                                }

                                return Observable.of(loanProcess);
                            })
                        // return LeadProcessFactory.createFromLeadId(lead_id)
                        //     .map((leadProcess) => {
                        //         leadProcess.stage = this.args.stage;

                        //         if (leadProcess.lead.currentStage==this.args.fromStage) {
                        //             return leadProcess.proceed();
                        //         }
                        //         return Observable.of(loanProcess);
                        //     })
                        //     .concatAll((leadProcess) => {
                        //         return loanProcess;
                        //     })
                    }
                    return Observable.of(loanProcess);
                }
            )




    }

}
