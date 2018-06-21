
import {Observable} from "@reactivex/rxjs";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {RxObservable} from "../../shared/RxObservable";
import {plainToClass} from "class-transformer";

import {IPaymentRepository} from "./IPaymentRepository";
import {PaymentProcess} from "./PaymentProcess";
import {Payment} from "./Payment";

export class PaymentRepository implements IPaymentRepository {
	paymentService: any;
	constructor() {
		this.paymentService = AngularResourceService.getInstance().getNGService('Payment');
	}

	get(id: number): Observable<PaymentProcess> {
		let paymentPromise = this.paymentService.get({id: id}).$promise;
        return Observable.fromPromise(paymentPromise);
	}

	update(paymentProcess:PaymentProcess): Observable<PaymentProcess> {
		let promise = this.paymentService.update(paymentProcess).$promise;
        return Observable.fromPromise(promise)
            .map((obj: any) => {
                let payemnt: Payment = <Payment>plainToClass<Payment, Object>(Payment, obj.payemnt);
                _.merge(paymentProcess.payment, payemnt);
                return paymentProcess;
            });
	}

	create(paymentProcess:PaymentProcess): Observable<PaymentProcess> {
		let promise = this.paymentService.create(paymentProcess).$promise;
        return Observable.fromPromise(promise)
            .map((obj: any) => {
                let payemnt: Payment = <Payment>plainToClass<Payment, Object>(Payment, obj.payemnt);
                _.merge(paymentProcess.payment, payemnt);
                return paymentProcess;
            });
	}
}