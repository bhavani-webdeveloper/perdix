import {IPolicy} from "../../../shared/IPolicy";
import {Observable} from "@reactivex/rxjs";
import {IEnrolmentRepository} from "../../customer/IEnrolmentRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import {UserSession, ISession} from "../../../shared/Session";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import {Customer} from  "../../customer/Customer";
import * as _ from 'lodash';
import {EnrolmentProcess} from "../../customer/EnrolmentProcess";
import Verification = require('../Verification');
import {FormHelper, IFormHelper} from "../../../shared/FormHelper";

export class DefaultIndividualReferencePolicy extends IPolicy<EnrolmentProcess> {

    enrolmentRepo: IEnrolmentRepository;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(EnrolmentProcess: EnrolmentProcess): Observable<EnrolmentProcess> {
        let activeSession:ISession = ObjectFactory.getInstance("Session");
        let formHelper:IFormHelper = ObjectFactory.getInstance("FormHelper");
        let reference_type = formHelper.getReferencetype();

        if(_.isArray(reference_type) && reference_type.length > 0) {

            try {
                if(_.isArray(EnrolmentProcess.customer.verifications) && EnrolmentProcess.customer.verifications.length > 0) {
                    return Observable.of(EnrolmentProcess);
                } else {
                    EnrolmentProcess.customer.verifications = [];
                }
                for(let reference of reference_type) {
                    let verification = new Verification();
                    verification.relationship = reference.name;
                    EnrolmentProcess.customer.verifications.push(verification);
                }
                return Observable.of(EnrolmentProcess);
            }
            catch(err) {
                console.log(err)
                return Observable.of(EnrolmentProcess);
            }
        }

        return Observable.of(EnrolmentProcess);
    }
}
