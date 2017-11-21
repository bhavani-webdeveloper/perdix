import { RepositoryIdentifiers } from '../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../shared/RepositoryFactory');
import Lead = require("./Lead");
import {ILeadRepository} from "./ILeadRepository";
import {Observable} from "@reactivex/rxjs";
import {plainToClass} from "class-transformer";

/// <amd-dependency path="perdixConfig/LeadProcessConfig" name="leadProcessConfig"/>
declare var leadProcessConfig: Object;



class LeadProcess {
	remarks: string;
	stage: string;
    lead: Lead;
    leadRepo: ILeadRepository;

    constructor(){
    	this.leadRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LeadProcess);
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

	// save(loanAccount: LoanAccount, remarks?: string) :any{
 //        /* Calls all business policies associated with save */
	// 	return this.leadRepo.updateIndividualLoan(loanAccount);
	// }

	// update(loanAccount: LoanAccount, remarks?: string): any {
 //        /* Calls all business policies assocaited with proceed */

	// 	return this.leadRepo.updateIndividualLoan(loanAccount);
	// }

    newLeadProcess(): LeadProcess {
        /// <amd-dependency path="perdixConfig/LeadProcessConfig" name="leadProcessConfig"/>
        console.log(leadProcessConfig);
        return null;
    }

    utilJSON(data): any{
        return JSON.parse(JSON.stringify(data));
    }

    get(id: number): Observable<LeadProcess> {
        return this.leadRepo.getLead(id)
            .map(
                (value) => {
                    this.lead = <Lead>plainToClass(Lead, this.utilJSON(value));
                    this.lead.currentStage = "SOME STGE";
                    return this;
                }
            )
    }
}

export = LeadProcess;
