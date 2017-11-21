///<amd-dependency path="perdixConfig/LeadProcessConfig" name="leadProcessConfig"/>

import { RepositoryIdentifiers } from '../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../shared/RepositoryFactory');
import Lead = require("./Lead");
import {ILeadRepository} from "./ILeadRepository";
import {Observable} from "@reactivex/rxjs";
import {plainToClass} from "class-transformer";

declare var leadProcessConfig:Object

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


    newLeadProcess(): LeadProcess {
        let onNewObj = leadProcessConfig['default']['onNew'];
        let policies: Array<any> = [];


        for(let entry of onNewObj['defaults']) {
        	console.log(entry.name)
        	
        	policies.push(entry);
        }
        console.log(policies)
        return null;
    }

    utilJSON(data: Object): Object{
        return JSON.parse(JSON.stringify(data));
    }

    get(id: number): Observable<LeadProcess> {
        return this.leadRepo.getLead(id)
            .map(
                (value: Object) => {
                    this.lead = plainToClass(Lead, this.utilJSON(value));
                    // this.lead = value;
                    // this.lead.currentStage = "SOME STGE";
                    return this;
                }
            )
    }

    save(reqData: any): Observable<LeadProcess> {
		reqData.lead.udf = {};
        reqData.lead.udfDate = {};
        reqData.lead.udf.userDefinedFieldValues = {};
        reqData['leadAction'] = 'SAVE';
        if (reqData.lead.leadStatus == "Screening") {
            if (reqData.lead.siteCode == 'sambandh') {
                reqData['stage'] = 'ReadyForEnrollment';
            } else {
                reqData['stage'] = 'ReadyForScreening';
            }
        } else if (reqData.lead.leadStatus == "Incomplete") {
            reqData['stage'] = 'Incomplete';
        } else {
            reqData['stage'] = 'Inprocess';
        }

        return this.leadRepo.saveLead(reqData);
    }

    update(reqData: any): Observable<LeadProcess> {
    	if (reqData.lead.id === undefined || reqData.lead.id === null) {
            // TO Do
        } else {
            reqData.leadAction = "PROCEED";
            if (reqData.lead.leadStatus == "Screening") {
                if (reqData.lead.siteCode == 'sambandh') {
                    reqData.stage = 'ReadyForEnrollment';
                } else {
                    reqData.stage = 'ReadyForScreening';
                }
            } else if (reqData.lead.leadStatus == "Reject") {
                reqData.stage = 'Inprocess';
            } else if (reqData.lead.leadStatus == "Incomplete") {
                reqData.stage = 'Incomplete';
            }
            

            return this.leadRepo.updateLead(reqData);
            
        }
    }

    followUp(reqData: any): Observable<LeadProcess> {
    	reqData.leadAction = "SAVE";
    	return this.leadRepo.updateLead(reqData);
    }
}

export = LeadProcess;
