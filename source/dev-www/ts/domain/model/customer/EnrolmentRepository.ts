
import {IEnrolmentRepository} from "./IEnrolmentRepository";
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

    getCustomerById(id: any): Observable<Customer> {
        return Observable.fromPromise(this.enrolmentService.getCustomerById({id: id}).$promise)
            .map((value) => {
                return plainToClass(Customer, Utils.toJSObj(value));
            });
    }

}
