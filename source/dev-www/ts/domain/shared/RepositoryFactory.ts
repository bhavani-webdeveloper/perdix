import LoanRepository = require('../model/loan/LoanRepository');
import LeadRepository = require('../model/lead/LeadRepository');
import { RepositoryIdentifiers } from './RepositoryIdentifiers';
import {EnrolmentProcess} from "../model/customer/EnrolmentProcess";
import {EnrolmentRepository} from "../model/customer/EnrolmentRepository";
import {LiabilityLoanAccountBookingRepository} from "../model/lender/LoanBooking/LiabilityLoanAccountBookingRepository";
import {LiabilityRepaymentRepository} from "../model/lender/LoanBooking/LiabilityRepaymentRepository";

import {QueryRepository} from "./query/QueryRepository";
import { BranchPostingPolicyFactory } from '../model/journal/branchposting/policy/BranchPostingPolicyFactory';

import { BranchPostingProcess } from '../model/journal/branchposting/BranchPostingProcess';
import BranchPostingRepository = require('../model/journal/branchposting/BranchRepository');

import { FinconPostingProcess } from '../model/journal/finconaccounting/FinconPostingProcess';
import FinconRepository = require('../model/journal/finconaccounting/FinconRepository');

import {AgentProcess} from '../model/agent/AgentProcess';
import AgentRepository = require('../model/agent/AgentRepository');

import {PaymentRepository} from '../model/payment/PaymentRepository';

//import {TagMasterRepository} from "../model/TMaster/TagMasterRepository"


class RepositoryFactory {

    public static createRepositoryObject(type: RepositoryIdentifiers) : any  {

    	switch(type) {
    		case RepositoryIdentifiers.LoanProcess:
    			return new LoanRepository();
    		case RepositoryIdentifiers.LeadProcess:
    			return new LeadRepository();
            case RepositoryIdentifiers.Enrolment:
                return new EnrolmentRepository;
            case RepositoryIdentifiers.Queries:
                return new QueryRepository();
            case RepositoryIdentifiers.LiabilityLoanAccountBookingProcess:
                return new LiabilityLoanAccountBookingRepository();
            case RepositoryIdentifiers.LiabilityRepayment:
                return new LiabilityRepaymentRepository();
            case RepositoryIdentifiers.BranchPostingProcess:
                return new BranchPostingRepository();
            case RepositoryIdentifiers.FinconPostingProcess:
                return new FinconRepository();      
            case RepositoryIdentifiers.AgentProcess:
                return new AgentRepository();     
            case RepositoryIdentifiers.Payment:
                return new PaymentRepository();   

            // case RepositoryIdentifiers.TagMasterProcess:
            //     return new TagMasterRepository();
    		default:
    			return null;
    	}
    }
}

export = RepositoryFactory;
