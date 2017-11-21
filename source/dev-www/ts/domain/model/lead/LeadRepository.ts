import { ILeadRepository } from './ILeadRepository';

import { RxObservable as Ro} from '../../shared/RxObservable';


import AngularResourceService = require('../../shared/AngularResourceService');
import {Observable} from "@reactivex/rxjs";

class LoanRepository implements ILeadRepository {

	private leadService: any;
	constructor() {
		this.leadService = AngularResourceService.getInstance().getInjector('Lead');
	}
	
	getLead(id: number):Observable<any> {
		let observable = Ro.fromPromise(this.leadService.get({id: id}).$promise);
		return observable;
	}

}

export = LoanRepository;
