import { RepositoryIdentifiers } from '../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../shared/RepositoryFactory');
import LoanAccount = require("./LoanAccount");
import {ILoanRepository} from "./ILoanRepository";
import {Observable} from "@reactivex/rxjs";
import {plainToClass} from "class-transformer";




class LoanProcess {
	remarks: string;
	stage: string;
    loanAccount: LoanAccount;
    individualLoanRepo: ILoanRepository;

    constructor(){
    	this.individualLoanRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LoanProcess);
	}

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
        /* Calls all business policies associated with save */
		return this.individualLoanRepo.updateIndividualLoan(loanAccount);
	}

	update(loanAccount: LoanAccount, remarks?: string): any {
        /* Calls all business policies assocaited with proceed */

        plainToClass

		return this.individualLoanRepo.updateIndividualLoan(loanAccount);
	}

    get(id: number): Observable<LoanProcess> {
        return this.individualLoanRepo.getIndividualLoan(id)
            .map(
                (value) => {
                    this.loanAccount = value;
                    this.loanAccount.currentStage = "SHAHAL STGE";
                    return this;
                }
            )
    }
}

export = LoanProcess;
