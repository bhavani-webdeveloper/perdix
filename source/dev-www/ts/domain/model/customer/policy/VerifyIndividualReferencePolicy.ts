import {IPolicy} from "../../../shared/IPolicy";
import {Observable} from "@reactivex/rxjs";
import {IEnrolmentRepository} from "../../customer/IEnrolmentRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import {UserSession, ISession} from "../../../shared/Session";
import {FormHelper, IFormHelper} from "../../../shared/FormHelper";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import Customer = require("../Customer");
import {ValidationError} from "../../../../ui/errors/ValidationError";
import FamilyMember = require("../FamilyMember");
import Expenditure = require("../Expenditure");
import {EnrolmentProcess} from "../EnrolmentProcess";
import AngularResourceService = require("../../../../infra/api/AngularResourceService");
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

        if(_.hasIn(enrolmentProcess.customer, "verifications") && _.isArray(enrolmentProcess.customer.verifications) && enrolmentProcess.customer.verifications.length > 0) {
            this.flag = 0;
            for (let i=0;i<enrolmentProcess.customer.verifications.length;i++) {
                 var verification = enrolmentProcess.customer.verifications[i];
                 if (verification.referenceFirstName && verification.relationship && verification.mobileNo) {
                    this.flag++;
                } else {
                    console.log("Please Fill Reference Details");
                    return Observable.throw(new ValidationError("Please Fill Reference Details"));
                }
            }
            if (this.flag == enrolmentProcess.customer.verifications.length) {
                console.log("Individual Reference Verified");
                return Observable.of(enrolmentProcess);
            }
        }

    }
}
