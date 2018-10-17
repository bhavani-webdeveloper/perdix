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
export class MinimumReferencesPolicy extends IPolicy<EnrolmentProcess> {

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

        if (enrolmentProcess.customer.verifications.length<2){
            return Observable.throw(new ValidationError("minimum two references are mandatory"));
        }
    }
}