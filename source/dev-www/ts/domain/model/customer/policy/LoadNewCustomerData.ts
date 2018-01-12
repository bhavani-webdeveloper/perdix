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
import {CustomerTypes} from "../Customer";
import Enterprise = require("../Enterprise");





export class LoadNewCustomerData extends IPolicy<EnrolmentProcess> {

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
        try {
            let observables = [];

            if (enrolmentProcess.customer.customerType == CustomerTypes.ENTERPRISE){
                enrolmentProcess.customer.enterprise = new Enterprise();
            } else {
                let fm: FamilyMember = new FamilyMember();
                let exp = new Expenditure();
                fm.relationShip = 'self';
                exp.expenditureSource = "Others";
                exp.frequency = 'Monthly';
                enrolmentProcess.customer.familyMembers.push(fm);
                enrolmentProcess.customer.expenditures.push(exp);
            }
            enrolmentProcess.customer.date = enrolmentProcess.customer.date || Utils.getCurrentDate();
            enrolmentProcess.customer.nameOfRo = enrolmentProcess.customer.nameOfRo || activeSession.getLoginname();
                    let proofs = formHelperData.getAddressProof();
                    let panIndex = _.findIndex(proofs, function(p) {
                       return p.name == 'Pan Card';
                    })

                    let addharIndex = _.findIndex(proofs, function(p) {
                        return p.name == 'Aadhar Card';
                    })

                    enrolmentProcess.customer.identityProof = proofs[panIndex].name;
                    enrolmentProcess.customer.addressProof = proofs[addharIndex].name;
            // return Observable.merge(observables, 5)
            //     .concatAll()
            //     .last()
            //     .map(
            //         (value) => {
            //             return enrolmentProcess;
            //         }
            //     );
            return Observable.of(enrolmentProcess);
        } catch(err) {
            console.error(err);
            return Observable.of(enrolmentProcess);
        }
    }

}
