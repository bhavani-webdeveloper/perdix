import {IPolicy} from "../../../shared/IPolicy";
import {Observable} from "@reactivex/rxjs";
import {IEnrolmentRepository} from "../../customer/IEnrolmentRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import {UserSession, ISession} from "../../../shared/Session";
import {FormHelper, IFormHelper} from "../../../shared/FormHelper";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import Customer = require("../Customer");
import FamilyMember = require("../FamilyMember");
import Expenditure = require("../Expenditure");
import {EnrolmentProcess} from "../EnrolmentProcess";
import * as _ from 'lodash';
import Utils = require("../../../shared/Utils");


declare var moment: Function;

export class EnrolmentDerivedPolicy extends IPolicy<EnrolmentProcess> {

    enrolmentRepo: IEnrolmentRepository;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(enrolmentProcess: EnrolmentProcess): Observable<EnrolmentProcess> {
        let activeSession:ISession = ObjectFactory.getInstance("Session");
        let formHelperData:IFormHelper = ObjectFactory.getInstance("FormHelper");
        return Observable.defer(
            () => {
                try {

                    let centers = formHelperData.getCenters();
                    enrolmentProcess.customer.age = moment().diff(moment(enrolmentProcess.customer.dateOfBirth, 'YYYY-MM-DD'), 'years');

                    return Observable.of(enrolmentProcess);
                } catch(err) {
                    console.error(err);
                    return Observable.of(enrolmentProcess);
                }

            }
        )
    }

}
