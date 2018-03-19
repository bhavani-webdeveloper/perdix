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
export class GSTApplicablePolicy extends IPolicy<EnrolmentProcess> {

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

        if (enrolmentProcess.customer.enterprise.isGSTAvailable === "YES"){
            let count = 0;
            for (let i = 0; i < enrolmentProcess.customer.enterpriseRegistrations.length; i++) {
                if (enrolmentProcess.customer.enterpriseRegistrations[i].registrationType === "GST No"
                    && enrolmentProcess.customer.enterpriseRegistrations[i].registrationNumber != ""
                    && enrolmentProcess.customer.enterpriseRegistrations[i].registrationNumber != null
                    ) {
                    count++;
                }
            }
            if (count < 1) {               
                return Observable.throw(new ValidationError("Self Relationship is mandatory!"));
            }
        }
    }
}