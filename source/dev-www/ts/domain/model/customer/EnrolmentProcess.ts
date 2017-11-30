///<amd-dependency path="perdixConfig/EnrolmentProcessConfig" name="enrolmentProcessConfig"/>

import { RepositoryIdentifiers } from '../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../shared/RepositoryFactory');
import Customer = require("./Customer");
import {IEnrolmentRepository} from "./IEnrolmentRepository";
import {Observable} from "@reactivex/rxjs";
import Utils = require("../../shared/Utils");
import {plainToClass} from "class-transformer";


declare var enrolmentProcessConfig: Object;

export class EnrolmentProcess {
	remarks: string;
	stage: string;
    customer: Customer;
    enrolmentRepo: IEnrolmentRepository;

    constructor(){
    	this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
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

	save() :any{
        /* Calls all business policies associated with save */
		// return this.enrolmentRepo.updateIndividualLoan(loanAccount);
	}

	update(): any {
        /* Calls all business policies assocaited with proceed */

        // plainToClass

		// return this.enrolmentRepo.updateIndividualLoan(loanAccount);
	}

    get(id: number): Observable<EnrolmentProcess> {
        return this.enrolmentRepo.getCustomerById(id)
            .map(
                (value) => {
                    this.customer = value;
                    // this.loanAccount.currentStage = "SHAHAL STGE";
                    return this;
                }
            )
    }

    static fromCustomerID(id: number): Observable<EnrolmentProcess> {
      let enrolmentRepo: IEnrolmentRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
      return enrolmentRepo.getCustomerById(id)
        .map(
            (value: Object) => {
                let obj:Object = Utils.toJSObj(value);
                let ep:EnrolmentProcess = new EnrolmentProcess();
                let cs:Customer = <Customer>plainToClass<Customer, Object>(Customer, obj);
                ep.customer = cs;

                return ep;
            }
        )
    }

    static getProcessConfig() {
        return enrolmentProcessConfig;
    }
}
