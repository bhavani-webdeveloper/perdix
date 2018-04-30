import { IFinconRepository } from './IFinconRepository';

import { RxObservable as Ro} from '../../../shared/RxObservable';
import {plainToClass} from "class-transformer";

import AngularResourceService = require('../../../../infra/api/AngularResourceService');
import JournalHeader = require("./JournalHeader");
import {Observable} from "@reactivex/rxjs";
import * as _ from 'lodash';
import {FinconPostingProcess} from './FinconPostingProcess'

class FinconRepository implements IFinconRepository {

	private finconService: any;
	constructor() {
		this.finconService = AngularResourceService.getInstance().getNGService('Journal');
	}

	getJournal(id: number):Observable<any> {
		let observable = Ro.fromPromise(this.finconService.getMultiJournalEntry({id: id}).$promise);
		return observable;
	}

	createJournal(reqData: FinconPostingProcess): Observable<any> {
		return Ro.fromPromise(this.finconService.createMultiJournal(reqData).$promise)
		.map((obj:any) => {
			let journalHeader:JournalHeader = <JournalHeader>plainToClass<JournalHeader, Object>(JournalHeader, obj.journalEntryDto);
			_.merge(reqData.journalHeader, journalHeader);
			return reqData;
		})
	}

	updateJournal(reqData: FinconPostingProcess): Observable<any> {
		return Ro.fromPromise(this.finconService.updateJournaMultilEntry(reqData).$promise)
		.map((obj:any) => {
			let journalHeader:JournalHeader = <JournalHeader>plainToClass<JournalHeader, Object>(JournalHeader, obj.journalEntryDto);
			_.merge(reqData.journalHeader, journalHeader);
			return reqData;
		})
	}


}

export = FinconRepository;
