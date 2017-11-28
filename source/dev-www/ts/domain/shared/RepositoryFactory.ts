import LoanRepository = require('../model/loan/LoanRepository');
import LeadRepository = require('../model/lead/LeadRepository');
import { RepositoryIdentifiers } from './RepositoryIdentifiers';
import {EnrolmentProcess} from "../model/customer/EnrolmentProcess";
import {EnrolmentRepository} from "../model/customer/EnrolmentRepository";

class RepositoryFactory {

    public static createRepositoryObject(type: RepositoryIdentifiers) : any  {

    	switch(type) {
    		case RepositoryIdentifiers.LoanProcess:
    			return new LoanRepository();
    		case RepositoryIdentifiers.LeadProcess:
    			return new LeadRepository();
            case RepositoryIdentifiers.Enrolment:
                return new EnrolmentRepository;
    		default:
    			return null;
    	}
    }
}

export = RepositoryFactory;
