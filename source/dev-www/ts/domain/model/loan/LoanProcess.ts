///<amd-dependency path="perdixConfig/LoanProcessConfig" name="loanProcessConfig"/>

import { RepositoryIdentifiers } from '../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../shared/RepositoryFactory');
import LoanAccount = require("./LoanAccount");
import {ILoanRepository} from "./ILoanRepository";
import {Observable} from "@reactivex/rxjs";
import {plainToClass} from "class-transformer";
import EnrollmentProcessFactory = require("../customer/EnrolmentProcessFactory");
import Customer = require("../customer/Customer");
import LoanProcessFactory = require("./LoanProcessFactory");
import {PolicyManager} from "../../shared/PolicyManager";
import {LeadProcess} from "../lead/LeadProcess";
import {LoanPolicyFactory} from "./policy/LoanPolicyFactory";
import EnrolmentProcessFactory = require("../customer/EnrolmentProcessFactory");





declare var loanProcessConfig: Object;

export class LoanProcess {
	remarks: string;
	stage: string;
    public loanAccount: LoanAccount;
    customer: Customer;
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

	save(toStage: string) :any{
        /* Calls all business policies associated with save */
		this.stage = toStage;
        let pmBeforeUpdate:PolicyManager<LoanProcess>  = new PolicyManager(this, LoanPolicyFactory.getInstance(), 'beforeSave', LeadProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.individualLoanRepo.updateIndividualLoan(this);
        let pmAfterUpdate:PolicyManager<LoanProcess>  = new PolicyManager(this, LoanPolicyFactory.getInstance(), 'afterSave', LeadProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3);
	}

	proceed(toStage: string): any {
        /* Calls all business policies assocaited with proceed */
        this.stage = toStage;
        let pmBeforeUpdate:PolicyManager<LoanProcess>  = new PolicyManager(this, LoanPolicyFactory.getInstance(), 'beforeProceed', LeadProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.individualLoanRepo.updateIndividualLoan(this);
        let pmAfterUpdate:PolicyManager<LoanProcess>  = new PolicyManager(this, LoanPolicyFactory.getInstance(), 'afterProceed', LeadProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        let obs4 = EnrollmentProcessFactory.beforeProceedCustomer(this.loanAccount.applicantCustomer);
        return Observable.concat(obs1, obs2, obs3, obs4);
	}

    static get(id: number): Observable<LoanProcess> {
        return LoanProcessFactory.createFromLoanId(id).flatMap(
            (loanProcess) => {
                let pm: PolicyManager<LoanProcess> = new PolicyManager<LoanProcess>(loanProcess, LoanPolicyFactory.getInstance(), 'onLoad', LoanProcess.getProcessConfig());
                return pm.applyPolicies();
            }
        );
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

    // getCustomerId(id: number): Observable<LoanProcess> {
    //     return EnrollmentProcessFactory.fromCustomer(this.customer).get(id)
    //         .map(
    //             (value) => {
    //                 this.loanAccount.loanCustomer = value;
    //                 return this;
    //             }
    //         )
    // }

    static getProcessConfig() {
        return loanProcessConfig;
    }
}
