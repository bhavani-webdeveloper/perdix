
import {Observable} from "@reactivex/rxjs";
import Customer = require("./Customer");

export interface IEnrolmentRepository {

	getCustomerById(id: number): Observable<Customer>;
}
