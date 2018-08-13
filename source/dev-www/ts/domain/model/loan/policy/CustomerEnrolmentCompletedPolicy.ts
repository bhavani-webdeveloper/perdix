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
import VehicleLoanDetails = require('../VehicleLoanDetails');
import VehicleAssetCondition = require('../VehicleAssetCondition');
import {FormHelper, IFormHelper} from "../../../shared/FormHelper";
/**
 * Created by shahalpk on 28/11/17.
 */

export class CustomerEnrolmentCompletedPolicy extends IPolicy<LoanProcess> {

    enrolmentRepo: IEnrolmentRepository;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        if((loanProcess.applicantEnrolmentProcess && loanProcess.applicantEnrolmentProcess.customer.currentStage != 'Completed')) {
            Observable.throw(new Error("Kindly Enrol the customer."));
        }
        if(_.isArray(loanProcess.coApplicantsEnrolmentProcesses) && loanProcess.coApplicantsEnrolmentProcesses.length > 0) {
            for(let index=0;index<loanProcess.coApplicantsEnrolmentProcesses.length;index++) {
                if(loanProcess.coApplicantsEnrolmentProcesses[index].customer.currentStage != 'Completed') {
                    Observable.throw(new Error("Kindly Enrol the customer."));
                }
            }
        }

        if(_.isArray(loanProcess.guarantorsEnrolmentProcesses) && loanProcess.guarantorsEnrolmentProcesses.length > 0) {
            for(let index=0;index<loanProcess.guarantorsEnrolmentProcesses.length;index++) {
                if(loanProcess.guarantorsEnrolmentProcesses[index].customer.currentStage != 'Completed') {
                    Observable.throw(new Error("Kindly Enrol the customer."));
                }
            }
        }
        if(loanProcess.loanCustomerEnrolmentProcess.customer.currentStage != 'Completed') {
            Observable.throw(new Error("Kindly Enrol the customer."));
        }
        return Observable.of(loanProcess);
    }

}
