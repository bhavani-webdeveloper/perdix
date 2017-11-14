import { ILoanRepository } from './ILoanRepository';
import LoanProcess = require('./LoanProcess');
import AngularResourceRepository = require('../../shared/AngularResourceRepository');

class LoanRepository implements ILoanRepository {

	private individualLoanService: any;
	constructor() {
		this.individualLoanService = AngularResourceRepository.getInstance().getInjector('IndividualLoan');
	}
	getLoanProcess():LoanProcess {
		let data;
		this.individualLoanService.getData(function(d) {
			data = d;
		})

		return data;
	}
}