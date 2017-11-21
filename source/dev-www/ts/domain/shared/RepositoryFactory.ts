import LoanRepository = require('../model/loan/LoanRepository');
import LeadRepository = require('../model/lead/LeadRepository');
import { RepositoryIdentifiers } from './RepositoryIdentifiers';

class RepositoryFactory {	

    public static createRepositoryObject(type: RepositoryIdentifiers) : any  {

    	switch(type) {
    		case RepositoryIdentifiers.LoanProcess:
    			return new LoanRepository();
    		case RepositoryIdentifiers.LeadProcess:
    			return new LeadRepository();
    		default:
    			return null;
    	}
    }
}

export = RepositoryFactory;