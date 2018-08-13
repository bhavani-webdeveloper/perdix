import {IPolicy} from "../../../shared/IPolicy";
import {Observable} from "@reactivex/rxjs";
import {IEnrolmentRepository} from "../../customer/IEnrolmentRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import {UserSession, ISession} from "../../../shared/Session";
import {FormHelper, IFormHelper} from "../../../shared/FormHelper";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import {Customer} from  "../../customer/Customer";
import {LoanProcess} from "../LoanProcess";
import {ValidationError} from "../../../../ui/errors/ValidationError";
import AngularResourceService = require("../../../../infra/api/AngularResourceService");
import Verification = require("../../customer/Verification");
import {LoanPolicyFactory} from "./LoanPolicyFactory";
import * as _ from 'lodash';


declare var moment: Function;

export class DefaultIndividualReferencePolicy extends IPolicy<LoanProcess> {

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
        let data = formHelper.getReferencetype();
        
        if(_.isArray(data) && data.length > 0) {
            try {

                if(_.isArray(loanProcess.loanCustomerEnrolmentProcess.customer.verifications) && loanProcess.loanCustomerEnrolmentProcess.customer.verifications.length > 0 && loanProcess.loanCustomerEnrolmentProcess.customer.customerType.toLowerCase() == 'enterprise') {
                    loanProcess.loanCustomerEnrolmentProcess.customer.verifications = loanProcess.loanCustomerEnrolmentProcess.customer.verifications;
                    return Observable.of(loanProcess);
                } else {
                    loanProcess.loanCustomerEnrolmentProcess.customer.verifications = [];
                }
                if(loanProcess.loanCustomerEnrolmentProcess.customer.customerType.toLowerCase() == 'enterprise'){

                    for(let component of data) {
                        let verification = new Verification();
                        verification.relationship = component.name;
                        loanProcess.loanCustomerEnrolmentProcess.customer.verifications.push(verification);
                    }
                    return Observable.of(loanProcess);
                }
            }
            catch(err) {
                console.log(err);
                return Observable.of(loanProcess);
            }

        }
        return Observable.of(loanProcess);
    }
}
