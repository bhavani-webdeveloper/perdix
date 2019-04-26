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
import Guarantor = require("../Guarantor");
import {ValidationError} from "../../../../ui/errors/ValidationError";
/**
 * Created by shahalpk on 28/11/17.
 */

export class VerifyEnrollmentSpokePolicy extends IPolicy<LoanProcess> {

    enrolmentRepo: IEnrolmentRepository;
    centreId = null;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    spokeVerify(enrollment) {
        if(_.hasIn(enrollment, 'customer.centreId') && _.isNumber(enrollment.customer.centreId) && this.centreId == enrollment.customer.centreId) {
            return true;
        }
        return false;
    }

    run(loanProcess: LoanProcess): Observable<LoanProcess> {

        if(_.hasIn(loanProcess, 'loanAccount.loanCentre.centreId') && _.isNumber(loanProcess.loanAccount.loanCentre.centreId)) {
            this.centreId = loanProcess.loanAccount.loanCentre.centreId;
            
            // Applicant process
            if(_.hasIn(loanProcess, 'applicantEnrolmentProcess.customer.centreId') && _.isNumber(loanProcess.applicantEnrolmentProcess.customer.centreId)) {
                if(!this.spokeVerify(loanProcess.applicantEnrolmentProcess)) {
                    return Observable.throw({data:{error:"Applicant spoke should be same as customer spoke"}});
                }
            }

            // Co-Applicant process
            if(_.hasIn(loanProcess, "coApplicantsEnrolmentProcesses")) {
                for(var i=0; i<loanProcess.coApplicantsEnrolmentProcesses.length; i++) {
                    if(!this.spokeVerify(loanProcess.coApplicantsEnrolmentProcesses[i])) {
                        return Observable.throw({data:{error:"Co-Applicant spoke should be same as customer spoke"}});
                    }
                }
            }

            // Guarantor process
            if(_.hasIn(loanProcess, "guarantorsEnrolmentProcesses")) {
                for(var i=0; i<loanProcess.guarantorsEnrolmentProcesses.length; i++) {
                    if(!this.spokeVerify(loanProcess.guarantorsEnrolmentProcesses[i])) {
                        return Observable.throw(new ValidationError("Guarantor spoke should be same as customer spoke"));
                    }
                }
            }
        }
        return Observable.of(loanProcess);
    }

}
