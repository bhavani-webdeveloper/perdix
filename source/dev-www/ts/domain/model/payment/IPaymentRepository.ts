
import {Observable} from "@reactivex/rxjs";
import {PaymentProcess} from "./PaymentProcess";

export interface IPaymentRepository {
	get(id: number): Observable<PaymentProcess>;
    update(reqData: Object): Observable<PaymentProcess>;
}
