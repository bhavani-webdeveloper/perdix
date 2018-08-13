import { IBranchRepository } from './IBranchRepository';

import { RxObservable as Ro} from '../../../shared/RxObservable';
import {plainToClass} from "class-transformer";

import AngularResourceService = require('../../../../infra/api/AngularResourceService');
import BranchEntry = require("./BranchEntry");
import {Observable} from "@reactivex/rxjs";
import * as _ from 'lodash';
import {BranchPostingProcess} from './BranchPostingProcess'

class BranchRepository implements IBranchRepository {

	private branchService: any;
	constructor() {
		this.branchService = AngularResourceService.getInstance().getNGService('Journal');
	}

	getJournal(id: number):Observable<any> {
		let observable = Ro.fromPromise(this.branchService.getJournalEntry({id: id}).$promise);
		return observable;
	}

	createJournal(reqData: BranchPostingProcess): Observable<any> {
		return Ro.fromPromise(this.branchService.createJournalEntry(reqData).$promise)
		.map((obj:any) => {
			let branchEntry:BranchEntry = <BranchEntry>plainToClass<BranchEntry, Object>(BranchEntry, obj.journalEntryDto);
			_.merge(reqData.journalEntryDto, branchEntry);
			return reqData;
		})
	}

	updateJournal(reqData: BranchPostingProcess): Observable<any> {
		return Ro.fromPromise(this.branchService.updateJournalEntry(reqData).$promise)
		.map((obj:any) => {
			let branchEntry:BranchEntry = <BranchEntry>plainToClass<BranchEntry, Object>(BranchEntry, obj.journalEntryDto);
			_.merge(reqData.journalEntryDto, branchEntry);
			return reqData;
		})
	}


}

export = BranchRepository;
