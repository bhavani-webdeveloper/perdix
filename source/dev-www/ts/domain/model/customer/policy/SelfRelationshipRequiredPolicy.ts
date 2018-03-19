

import {IPolicy} from "../../../shared/IPolicy";
import {EnrolmentProcess} from "../EnrolmentProcess";
import {IEnrolmentRepository} from "../IEnrolmentRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import {Observable} from "@reactivex/rxjs";
import {ISession} from "../../../shared/Session";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import {IFormHelper} from "../../../shared/FormHelper";
import {ValidationError} from "../../../../ui/errors/ValidationError";
export class SelfRelationshipRequiredPolicy extends IPolicy<EnrolmentProcess> {

    enrolmentRepo: IEnrolmentRepository;

    constructor() {
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(enrolmentProcess: EnrolmentProcess): Observable<EnrolmentProcess> {
        let activeSession:ISession = ObjectFactory.getInstance("Session");
        let formHelperData:IFormHelper = ObjectFactory.getInstance("FormHelper");
       // return Observable.throw("Self Relationship is mandatory!");
        if (_.hasIn(enrolmentProcess, 'customer.familyMembers') && _.isArray(enrolmentProcess.customer.familyMembers)){
            let selfExist = false
            for (let i=0;i<enrolmentProcess.customer.familyMembers.length; i++){
                let f = enrolmentProcess.customer.familyMembers[i];
                if (_.isString(f.relationShip) && f.relationShip.toUpperCase() == 'SELF'){
                    selfExist = true;
                    break;
                }
            }
            if (selfExist == false){
                return Observable.throw(new Error("Self Relationship is mandatory!"));
               // PageHelper.showProgress("pre-save-validation", "Self Relationship is Mandatory",5000);
                // return false;
            }
        } else {
            //PageHelper.showProgress("pre-save-validation", "Family Members section is missing. Self Relationship is Mandatory",5000);
           // return false;
           return Observable.throw(new Error("Family Members section is missing. Self Relationship is Mandatory"));
        }        
    }
}
