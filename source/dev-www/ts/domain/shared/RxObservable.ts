import {Observable} from "@reactivex/rxjs";

export class RxObservable {

	static fromPromise(serviceName: any): any{
		let observable =  Observable.fromPromise(serviceName);
		return observable;
	}

}
