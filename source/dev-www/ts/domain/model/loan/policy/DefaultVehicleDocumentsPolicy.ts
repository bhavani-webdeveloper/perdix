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
import vehicleLoanDocument = require('../vehicleLoanDocuments');
import {FormHelper, IFormHelper} from "../../../shared/FormHelper";
/**
 * Created by shahalpk on 28/11/17.
 */

export class DefaultVehicleDocumentsPolicy extends IPolicy<LoanProcess> {

    enrolmentRepo: IEnrolmentRepository;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        let activeSession:ISession = ObjectFactory.getInstance("Session");
        let formHelper:IFormHelper = ObjectFactory.getInstance("FormHelper");
        let data = formHelper.getVehicleComponents();

        if(_.isArray(data) && data.length > 0) {
            try {

                let vehicleLoan = new VehicleLoanDetails();
                if(!_.hasIn(loanProcess.loanAccount, 'vehicleLoanDetails') || !loanProcess.loanAccount.vehicleLoanDetails) {
                    loanProcess.loanAccount.vehicleLoanDetails = vehicleLoan;

                }

                if(_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanDocuments) && loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanDocuments.length > 0) {
                    loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanDocuments = loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanDocuments;
                    return Observable.of(loanProcess);
                } else {
                    loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanDocuments = [];
                }
                for(let component of data) {
                    let vehicleLoanDoc = new vehicleLoanDocument();
                    vehicleLoanDoc.docType = component.docType;
                    loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanDocuments.push(vehicleLoanDoc);
                }
                return Observable.of(loanProcess);
            }
            catch(err) {
                console.log(err);
                return Observable.of(loanProcess);
            }

        }
        return Observable.of(loanProcess);
    }

}
