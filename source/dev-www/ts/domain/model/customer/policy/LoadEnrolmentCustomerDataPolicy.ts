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


export class LoadEnrolmentCustomerDataPolicy extends IPolicy<EnrolmentProcess> {

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
                    let observables = [];
                    let fm = enrolmentProcess.customer.familyMembers;
                    let incomes;
                    for(var i=0;i<fm.length;i++){
                        incomes = fm[i].incomes;
                        if (incomes){
                            for(var j=0;j<incomes.length;j++){
                                switch(incomes[i].frequency){
                                    case 'M':
                                    case 'Monthly': incomes[i].monthsPerYear=12; break;
                                    case 'D':
                                    case 'Daily': incomes[i].monthsPerYear=365; break;
                                    case 'W':
                                    case 'Weekly': incomes[i].monthsPerYear=52; break;
                                    case 'F':
                                    case 'Fornightly': incomes[i].monthsPerYear=26; break;
                                    case 'Fortnightly': incomes[i].monthsPerYear=26; break;
                                }
                            }
                        }
                    }
                    if (enrolmentProcess.customer.addressProof == 'Aadhar Card' &&
                        !_.isNull(enrolmentProcess.customer.addressProofNo)){
                        enrolmentProcess.customer.aadhaarNo = enrolmentProcess.customer.addressProofNo;
                    }

                    enrolmentProcess.customer.verified = true;
                    if (enrolmentProcess.customer.hasOwnProperty('verifications')){
                        let verifications = enrolmentProcess.customer['verifications'];
                        for (var i=0; i<verifications.length; i++){
                            if (verifications[i].houseNoIsVerified){
                                verifications[i].houseNoIsVerified=1;
                            }
                            else{
                                verifications[i].houseNoIsVerified=0;
                            }
                        }
                    }

                    if(enrolmentProcess.customer.mailSameAsResidence) {
                        enrolmentProcess.customer.mailingLocality = enrolmentProcess.customer.locality;
                        enrolmentProcess.customer.mailingDoorNo = enrolmentProcess.customer.doorNo;
                        enrolmentProcess.customer.mailingStreet = enrolmentProcess.customer.street;
                        enrolmentProcess.customer.mailingPostoffice = enrolmentProcess.customer.postOffice;
                        enrolmentProcess.customer.mailingPincode = enrolmentProcess.customer.pincode.toString();
                        enrolmentProcess.customer.mailingDistrict = enrolmentProcess.customer.district;
                        enrolmentProcess.customer.mailingState = enrolmentProcess.customer.state;
                    }

                    return Observable.of(enrolmentProcess);
                } catch(err) {
                    console.error(err);
                    return Observable.of(enrolmentProcess);
                }

            }
        )
    }

}
