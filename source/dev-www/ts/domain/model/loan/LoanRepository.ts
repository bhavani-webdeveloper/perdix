import { ILoanRepository } from './ILoanRepository';
import Rx = require('@reactivex/rxjs');
import LoanProcess = require('./LoanProcess');
import AngularResourceService = require('../../shared/AngularResourceService');

class LoanRepository implements ILoanRepository {

	private individualLoanService: any;
	constructor() {
		this.individualLoanService = AngularResourceService.getInstance().getInjector('IndividualLoan');
	}
	getLoanProcess(id: number):LoanProcess {
		var observable = Rx.Observable.fromPromise(this.individualLoanService.get({id: id}).$promise);
	
		return observable;
	}
}