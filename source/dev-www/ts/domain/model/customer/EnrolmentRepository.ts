
import {IEnrolmentRepository} from "./IEnrolmentRepository";
import {EnrolmentProcess} from "./EnrolmentProcess";
import Customer = require("./Customer");
import {Observable} from "@reactivex/rxjs";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {RxObservable} from "../../shared/RxObservable";
import {plainToClass} from "class-transformer";
import Utils = require("../../shared/Utils");

export class EnrolmentRepository implements IEnrolmentRepository {

    enrolmentService: any;

    constructor(){
        this.enrolmentService = AngularResourceService.getInstance().getNGService('Enrollment');
    }

    getCustomerById(id: any): Observable<EnrolmentProcess> {
        let customerPromise = this.enrolmentService.getCustomerById({id: id}).$promise;
        return Observable.fromPromise(customerPromise);
    }

    updateEnrollment(reqData: Object): Observable<EnrolmentProcess> {
        let promise = this.enrolmentService.updateEnrollment(reqData).$promise;
        return Observable.fromPromise(promise);
    }

}
