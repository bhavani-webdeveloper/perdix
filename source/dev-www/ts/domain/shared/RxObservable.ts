

import Rx = require('@reactivex/rxjs');
// import Observable = require("@reactivex/rxjs");


export class RxObservable {

	static fromPromise(serviceName: any): any {
		var observable = Rx.Observable.create(function (observer) {
		  observer.next(Rx.Observable.fromPromise(serviceName));
		  
		  observer.complete();
		});

		// var promiseObserver =  Rx.Observable.fromPromise(serviceName);
		
		// return observable.map(function(res) {
		// 	return res.subscribe();
		// });
		return observable;
	}

}