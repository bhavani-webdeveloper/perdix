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
import TelecallingDetails = require('../TelecallingDetail');
import {FormHelper, IFormHelper} from "../../../shared/FormHelper";
/**
 * Created by shahalpk on 28/11/17.
 */

export class CustomerReferencePolicy extends IPolicy<LoanProcess> {

    enrolmentRepo: IEnrolmentRepository;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        let tlc;
        if(_.hasIn(loanProcess.loanAccount, "telecallingDetails") && _.isArray(loanProcess.loanAccount.telecallingDetails) && loanProcess.loanAccount.telecallingDetails.length > 0) {
            loanProcess.loanAccount.telecallingDetails = loanProcess.loanAccount.telecallingDetails;
        }
        else {
            loanProcess.loanAccount.telecallingDetails = [];
        }


        if(_.hasIn(loanProcess, "applicantEnrolmentProcess") && _.hasIn(loanProcess.applicantEnrolmentProcess, "customer")) {
            for(let index = 0; index < loanProcess.applicantEnrolmentProcess.customer.verifications.length; index++) {
                let existing = _.findIndex(loanProcess.loanAccount.telecallingDetails, function(item){
                    return item.contactNumber == loanProcess.applicantEnrolmentProcess.customer.verifications[index].mobileNo;
                });
                if (existing){
                    continue;
                }
                tlc = new TelecallingDetails();
                let verification = loanProcess.applicantEnrolmentProcess.customer.verifications[index];
                tlc.personContacted = verification.referenceFirstName;
                tlc.contactNumber = verification.mobileNo;
                tlc.occupation = verification.occupation;
                tlc.address = verification.address;
                loanProcess.loanAccount.telecallingDetails.push(tlc);
            }
        }

            return Observable.of(loanProcess);



    }

}
