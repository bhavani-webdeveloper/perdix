
import {Observable} from "@reactivex/rxjs";
import {EnrolmentProcess} from "./EnrolmentProcess";

export interface IEnrolmentRepository {

	getCustomerById(id: number): Observable<EnrolmentProcess>;
    updateEnrollment(reqData: Object): Observable<EnrolmentProcess>;
}
