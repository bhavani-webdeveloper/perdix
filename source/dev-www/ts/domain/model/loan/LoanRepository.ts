import { ILoanRepository } from './ILoanRepository';

import { RxObservable as Ro} from '../../shared/RxObservable';

import LoanProcess = require('./LoanProcess');
import AngularResourceService = require('../../../infra/api/AngularResourceService');
import {Observable} from "@reactivex/rxjs";

class LoanRepository implements ILoanRepository {

	private individualLoanService: any;
	constructor() {
		this.individualLoanService = AngularResourceService.getInstance().getNGService('IndividualLoan');
	}
	getIndividualLoan(id: number):Observable<any> {
		let observable = Ro.fromPromise(this.individualLoanService.get({id: id}).$promise);
		return observable;
	}

	searchIndividualLoan(): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.search().$promise);
	}

	createIndividualLoan(reqData: any): Observable<any> {

		return Ro.fromPromise(this.individualLoanService.create(reqData).$promise);
	}

	updateIndividualLoan(reqData: any): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.update(reqData).$promise);
	}

	closeIndividualLoan(): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.close().$promise);
	}

	getLoanDefinition(): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.getDefiniftion().$promise);
	}

	loanDisburse(): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.disburse().$promise);
	}

	loanBatchDisburse(): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.batchDisburse().$promise);
	}

	loanBatchDisburseConfirmation(): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.batchDisbursementConfirmation().$promise);
	}

	loanMultiTrancheDisbursement(): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.multiTrancheDisbursement().$promise);
	}

	loanSearchHead(): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.searchHead().$promise);
	}

	loanSearchDisbursement(): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.searchDisbursement().$promise);
	}

	loanSearchDisbursementHead(): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.searchDisbursementHead().$promise);
	}

	loanGetDisbursementList(): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.getDisbursementList().$promise);
	}

	loanGetDocuments(): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.getDocuments().$promise);
	}

	loanDownloadAllDocuments(): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.downloadAllDocuments().$promise);
	}

	loanDocumentsHead(): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.documentsHead().$promise);
	}

	loanUpdateDisbursement(): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.updateDisbursement().$promise);
	}

	loanLoadSingleLoanWithHistory(): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.loadSingleLoanWithHistory().$promise);
	}

	loanAddTranch(): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.addTranch().$promise);
	}

	loanRemarksSummary(): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.loanRemarksSummary().$promise);
	}

	loanGetAllDocumentsUrl(loanId: number): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.getAllDocumentsUrl(loanId).$promise);
	}

	loanConfirmationUpload(file: any, progress: any): Observable<any> {
		return Ro.fromPromise(this.individualLoanService.ConfirmationUpload(file, progress).$promise);
	}

}

export = LoanRepository;
