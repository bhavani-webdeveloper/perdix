import { RepositoryIdentifiers } from '../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../shared/RepositoryFactory');
import LoanAccount = require("./LoanAccount");



class LoanProcess {
	remarks: string;
	stage: string;
	
	loanProcessAction(actionName: string): boolean {
		switch(actionName) {
			case "SAVE":
				// var loanProcess = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LoanProcess)
				// loanProcess.createIndividualLoan();
				return true;
			default:
				return false;
		}
	}

	save(loanAccount: LoanAccount, remarks?: string) :any{
		var individualLoanRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LoanProcess)
		return individualLoanRepo.updateIndividualLoan(loanAccount);
	}

	create(loanAccount: LoanAccount, remarks?: string): any {
		var individualLoanRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LoanProcess)
		return individualLoanRepo.updateIndividualLoan(loanAccount);
	}
}

export = LoanProcess;