import {IPolicy} from "../../../shared/IPolicy";
import {Observable} from "@reactivex/rxjs";
import {IEnrolmentRepository} from "../../customer/IEnrolmentRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import {UserSession, ISession} from "../../../shared/Session";
import {FormHelper, IFormHelper} from "../../../shared/FormHelper";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import {Customer} from  "../../customer/Customer";
import {ValidationError} from "../../../../ui/errors/ValidationError";
import FamilyMember = require("../FamilyMember");
import Expenditure = require("../Expenditure");
import {EnrolmentProcess} from "../EnrolmentProcess";
import AngularResourceService = require("../../../../infra/api/AngularResourceService");
import Verification = require("../Verification");

import * as _ from 'lodash';


declare var moment: Function;

export class VerifyIndividualReferencePolicy extends IPolicy<EnrolmentProcess> {

    enrolmentRepo: IEnrolmentRepository;
    flag: number;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(enrolmentProcess: EnrolmentProcess): Observable<EnrolmentProcess> {
        let activeSession:ISession = ObjectFactory.getInstance("Session");
        let formHelper:IFormHelper = ObjectFactory.getInstance("FormHelper");
        let data = formHelper.getReferencetype();
        
        if(_.isArray(data) && data.length > 0) {
            try {
                
                if(_.isArray(enrolmentProcess.customer.verifications) && enrolmentProcess.customer.verifications.length > 0 && enrolmentProcess.customer.customerType.toLowerCase() == 'enterprise') {
                    enrolmentProcess.customer.verifications = enrolmentProcess.customer.verifications;
                    return Observable.of(enrolmentProcess);
                } else {
                    enrolmentProcess.customer.verifications = [];
                }
                if(enrolmentProcess.customer.customerType.toLowerCase() == 'enterprise'){

                    for(let component of data) {
                        let verification = new Verification();
                        verification.relationship = component.name;
                        enrolmentProcess.customer.verifications.push(verification);
                    }
                    return Observable.of(enrolmentProcess);
                }
            }
            catch(err) {
                console.log(err);
                return Observable.of(enrolmentProcess);
            }

        }
        return Observable.of(enrolmentProcess);
    }
}
