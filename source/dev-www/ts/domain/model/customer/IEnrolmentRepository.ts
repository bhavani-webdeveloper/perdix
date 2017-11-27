
import {Observable} from "@reactivex/rxjs";

export interface IEnrolmentRepository {

	getCustomerById(id: number): Observable<any>;
}
