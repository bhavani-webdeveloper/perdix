import LoanRepository = require('../model/loan/LoanRepository');
import { RepositoryIdentifiers } from './RepositoryIdentifiers';

class RepositoryFactory {	

    public static createRepositoryObject(type: RepositoryIdentifiers)  {
        if (type === RepositoryIdentifiers.LoanProcess) {
            return new LoanRepository();
        }

        return null;
    }
}

export = RepositoryFactory;