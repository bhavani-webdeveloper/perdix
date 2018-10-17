
import {IEnrolmentRepository} from "./IEnrolmentRepository";
import {EnrolmentProcess} from "./EnrolmentProcess";

import {Observable} from "@reactivex/rxjs";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {RxObservable} from "../../shared/RxObservable";
import {plainToClass} from "class-transformer";
import {Customer} from "./Customer";

export class EnrolmentRepository implements IEnrolmentRepository {

    enrolmentService: any;

    constructor(){
        this.enrolmentService = AngularResourceService.getInstance().getNGService('Enrollment');
    }

    getCustomerById(id: any): Observable<EnrolmentProcess> {
        let customerPromise = this.enrolmentService.getCustomerById({id: id}).$promise;
        return Observable.fromPromise(customerPromise);
    }

    updateEnrollment(enrolmentProcess: EnrolmentProcess): Observable<EnrolmentProcess> {
        let promise = this.enrolmentService.updateEnrollment(enrolmentProcess).$promise;
        return Observable.fromPromise(promise)
            .map((obj: any) => {
                let customer: Customer = <Customer>plainToClass<Customer, Object>(Customer, obj.customer);
                _.merge(enrolmentProcess.customer, customer);
                return enrolmentProcess;
            });
    }

}
