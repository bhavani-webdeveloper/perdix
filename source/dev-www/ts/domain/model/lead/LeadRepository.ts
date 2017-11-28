import { ILeadRepository } from './ILeadRepository';

import { RxObservable as Ro} from '../../shared/RxObservable';


import AngularResourceService = require('../../../infra/api/AngularResourceService');
import {Observable} from "@reactivex/rxjs";

class LeadRepository implements ILeadRepository {

	private leadService: any;
	constructor() {
		this.leadService = AngularResourceService.getInstance().getNGService('Lead');
	}

	getLead(id: number):Observable<any> {
		let observable = Ro.fromPromise(this.leadService.get({id: id}).$promise);
		return observable;
	}

	saveLead(reqData: Object): Observable<any> {
		return Ro.fromPromise(this.leadService.save(reqData).$promise);
	}

	updateLead(reqData: Object): Observable<any> {
		return Ro.fromPromise(this.leadService.updateLead(reqData).$promise);
	}

}

export = LeadRepository;
