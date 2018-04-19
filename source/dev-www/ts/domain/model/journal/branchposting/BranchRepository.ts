import { IBranchRepository } from './IBranchRepository';

import { RxObservable as Ro} from '../../../shared/RxObservable';


import AngularResourceService = require('../../../../infra/api/AngularResourceService');
import {Observable} from "@reactivex/rxjs";

class BranchRepository implements IBranchRepository {

	private branchService: any;
	constructor() {
		this.branchService = AngularResourceService.getInstance().getNGService('Journal');
	}

	getJournal(id: number):Observable<any> {
		let observable = Ro.fromPromise(this.branchService.get({id: id}).$promise);
		return observable;
	}

	createJournal(reqData: Object): Observable<any> {
		return Ro.fromPromise(this.branchService.createJournalEntry(reqData).$promise);
	}

	updateJournal(reqData: Object): Observable<any> {
		return Ro.fromPromise(this.branchService.updateJournalEntry(reqData).$promise);
	}


}

export = BranchRepository;
