import { ILoanRepository } from './ILoanRepository';

import { RxObservable as Ro} from '../../shared/RxObservable';

import LoanProcess = require('./LoanProcess');
import AngularResourceService = require('../../shared/AngularResourceService');
import {Observable} from "@reactivex/rxjs";

class LoanRepository implements ILoanRepository {

	private individualLoanService: any;
	constructor() {
		this.individualLoanService = AngularResourceService.getInstance().getInjector('IndividualLoan');
	}
	getIndividualLoan(id: number):Observable<any> {
		let observable = Ro.fromPromise(this.individualLoanService.get({id: id}).$promise);
		return observable;
	}

	searchIndividualLoan(): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.search().$promise);
	}

	createIndividualLoan(reqData: any): LoanProcess {

		return Ro.fromPromise(this.individualLoanService.create(reqData).$promise);
	}

	updateIndividualLoan(reqData: any): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.update(reqData).$promise);
	}

	closeIndividualLoan(): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.close().$promise);
	}

	getLoanDefinition(): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.getDefiniftion().$promise);
	}

	loanDisburse(): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.disburse().$promise);
	}

	loanBatchDisburse(): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.batchDisburse().$promise);
	}

	loanBatchDisburseConfirmation(): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.batchDisbursementConfirmation().$promise);
	}

	loanMultiTrancheDisbursement(): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.multiTrancheDisbursement().$promise);
	}

	loanSearchHead(): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.searchHead().$promise);
	}

	loanSearchDisbursement(): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.searchDisbursement().$promise);
	}

	loanSearchDisbursementHead(): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.searchDisbursementHead().$promise);
	}

	loanGetDisbursementList(): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.getDisbursementList().$promise);
	}

	loanGetDocuments(): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.getDocuments().$promise);
	}

	loanDownloadAllDocuments(): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.downloadAllDocuments().$promise);
	}

	loanDocumentsHead(): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.documentsHead().$promise);
	}

	loanUpdateDisbursement(): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.updateDisbursement().$promise);
	}

	loanLoadSingleLoanWithHistory(): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.loadSingleLoanWithHistory().$promise);
	}

	loanAddTranch(): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.addTranch().$promise);
	}

	loanRemarksSummary(): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.loanRemarksSummary().$promise);
	}

	loanGetAllDocumentsUrl(loanId: number): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.getAllDocumentsUrl(loanId).$promise);
	}

	loanConfirmationUpload(file: any, progress: any): LoanProcess {
		return Ro.fromPromise(this.individualLoanService.ConfirmationUpload(file, progress).$promise);
	}

}

export = LoanRepository;
