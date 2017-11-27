
import {Observable} from "@reactivex/rxjs";

export interface IEnrollmentRepository {
	
	getCustomerById(id: number): Observable<any>;
}
