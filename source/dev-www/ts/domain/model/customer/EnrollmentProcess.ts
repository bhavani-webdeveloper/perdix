///<amd-dependency path="perdixConfig/LoanProcessConfig" name="loanProcessConfig"/>

import { RepositoryIdentifiers } from '../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../shared/RepositoryFactory');
import Customer = require("./Customer");
import {IEnrollmentRepository} from "./IEnrollmentRepository";
import {Observable} from "@reactivex/rxjs";
import {plainToClass} from "class-transformer";


declare var loanProcessConfig: Object;

class EnrollmentProcess {
	remarks: string;
	stage: string;
    customer: Customer;
    enrolmentRepo: IEnrollmentRepository;

    constructor(){
    	this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrollment);
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

	save(customer: Customer, remarks?: string) :any{
        /* Calls all business policies associated with save */
		// return this.enrolmentRepo.updateIndividualLoan(loanAccount);
	}

	update(customer: Customer, remarks?: string): any {
        /* Calls all business policies assocaited with proceed */

        // plainToClass

		// return this.enrolmentRepo.updateIndividualLoan(loanAccount);
	}

    get(id: number): Observable<EnrollmentProcess> {
        return this.enrolmentRepo.getCustomerById(id)
            .map(
                (value) => {
                    this.customer = value;
                    // this.loanAccount.currentStage = "SHAHAL STGE";
                    return this;
                }
            )
    }

    static getProcessConfig() {
        return loanProcessConfig;
    }
}

export = EnrollmentProcess;
