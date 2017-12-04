///<amd-dependency path="perdixConfig/LoanProcessConfig" name="loanProcessConfig"/>

import {RepositoryIdentifiers} from '../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../shared/RepositoryFactory');
import LoanAccount = require("./LoanAccount");
import {ILoanRepository} from "./ILoanRepository";
import {Observable} from "@reactivex/rxjs";
import {plainToClass} from "class-transformer";
import EnrollmentProcessFactory = require("../customer/EnrolmentProcessFactory");
import {EnrolmentProcess} from "../customer/EnrolmentProcess";
import Customer = require("../customer/Customer");
import LoanProcessFactory = require("./LoanProcessFactory");
import {PolicyManager} from "../../shared/PolicyManager";
import {LeadProcess} from "../lead/LeadProcess";
import {LoanPolicyFactory} from "./policy/LoanPolicyFactory";
import EnrolmentProcessFactory = require("../customer/EnrolmentProcessFactory");
import Utils = require("../../shared/Utils");
import * as _ from 'lodash';
import {LoanCustomerRelationTypes, LoanCustomerRelation} from "./LoanCustomerRelation";


declare var loanProcessConfig: Object;

export class LoanProcess {
    remarks: string;
    stage: string;
    public loanAccount: LoanAccount;
    customer: Customer;
    individualLoanRepo: ILoanRepository;

    loanCustomerEnrolmentProcess: EnrolmentProcess;
    applicantEnrolmentProcess: EnrolmentProcess;
    coApplicantsEnrolmentProcesses: EnrolmentProcess[] = [];
    guarantorsEnrolmentProcesses: EnrolmentProcess[] = [];

    constructor() {
        this.individualLoanRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LoanProcess);
    }


    /**
     * Sets a new enrolment process as relation to the customer. Internally calls the refresh API to update the loanAccount
     * accordingly.
     *
     * @param enrolmentProcess
     * @param relation
     * @returns {LoanProcess}
     */
    public setRelatedCustomerWithRelation(enrolmentProcess: EnrolmentProcess, relation: LoanCustomerRelationTypes): LoanProcess {
        switch (relation) {
            case LoanCustomerRelationTypes.APPLICANT:
                this.applicantEnrolmentProcess = enrolmentProcess;
                break;

            case LoanCustomerRelationTypes.CO_APPLICANT:
                if (!_.isArray(this.coApplicantsEnrolmentProcesses)) {
                    this.coApplicantsEnrolmentProcesses = [];
                }
                this.coApplicantsEnrolmentProcesses.push(enrolmentProcess);
                break;

            case LoanCustomerRelationTypes.GUARANTOR:
                this.guarantorsEnrolmentProcesses.push(enrolmentProcess);
                break;

            case LoanCustomerRelationTypes.LOAN_CUSTOMER:
                this.loanCustomerEnrolmentProcess = enrolmentProcess;
                break;
            default:
                break;
        }

        this.refreshRelatedCustomers();

        return this;
    }

    /**
     * Traverse through all the sub enrolment process and update the customer id to loanInput. This
     * function should be triggered on every customer / save / update.
     *
     */
    public refreshRelatedCustomers(){

    }

    /**
     * Removes any related customers from the process. Internally calls refreshRelatedCustomers to update
     * the values in LoanAccount.
     *
     * @param customerId
     * @param relation
     */
    public removeRelatedEnrolmentProcess(customerId: number, relation: LoanCustomerRelationTypes) {
        if (relation == LoanCustomerRelationTypes.APPLICANT &&
            this.applicantEnrolmentProcess.customer &&
            customerId == this.applicantEnrolmentProcess.customer.id) {
            this.applicantEnrolmentProcess = null;
        } else if (relation == LoanCustomerRelationTypes.CO_APPLICANT){
            let index = _.findIndex(this.coApplicantsEnrolmentProcesses, function(ep){
                return ep.customer && (ep.customer.id == customerId);
            })
        } else if (relation == LoanCustomerRelationTypes.GUARANTOR){
            let index = _.findIndex(this.coApplicantsEnrolmentProcesses, function(ep){
                return ep.customer && (ep.customer.id == customerId);
            })
        } else if (relation == LoanCustomerRelationTypes.LOAN_CUSTOMER &&
            this.loanCustomerEnrolmentProcess.customer &&
            this.loanCustomerEnrolmentProcess.customer.id == customerId){
            this.loanCustomerEnrolmentProcess = null;
        }

        this.refreshRelatedCustomers();
    }

    public setRelatedCustomer(enrolmentProcess: EnrolmentProcess): LoanProcess {
        let index = _.findIndex(this.loanAccount.loanCustomerRelations, function (lcr) {
            return lcr.customerId == enrolmentProcess.customer.id;
        });

        if (index == -1) {
            return this;
        }

        let lcr: LoanCustomerRelation = this.loanAccount.loanCustomerRelations[index];
        let relation = (<string>lcr.relation).toUpperCase();


        switch (relation) {
            case 'APPLICANT':
                this.applicantEnrolmentProcess = enrolmentProcess;
                break;

            case 'COAPPLICANT':
            case 'CO-APPLICANT':
                this.coApplicantsEnrolmentProcesses.push(enrolmentProcess);
                break;
            case 'GUARANTOR':
                this.guarantorsEnrolmentProcesses.push(enrolmentProcess);
                break;
            default:
                break;
        }
        return this;
    }

    loanProcessAction(actionName: string): boolean {
        switch (actionName) {
            case "SAVE":
                // var loanProcess = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LoanProcess)
                // loanProcess.createIndividualLoan();
                return true;
            default:
                return false;
        }
    }

    save(toStage: string): any {
        /* Calls all business policies associated with save */
        this.stage = toStage;
        let pmBeforeUpdate: PolicyManager<LoanProcess> = new PolicyManager(this, LoanPolicyFactory.getInstance(), 'beforeSave', LeadProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.individualLoanRepo.updateIndividualLoan(this);
        let pmAfterUpdate: PolicyManager<LoanProcess> = new PolicyManager(this, LoanPolicyFactory.getInstance(), 'afterSave', LeadProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();

        return Observable.concat(obs1, obs2, obs3);
    }

    proceed(toStage: string): any {
        /* Calls all business policies assocaited with proceed */
        this.stage = toStage;
        let pmBeforeUpdate: PolicyManager<LoanProcess> = new PolicyManager(this, LoanPolicyFactory.getInstance(), 'beforeProceed', LeadProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.individualLoanRepo.updateIndividualLoan(this);
        let pmAfterUpdate: PolicyManager<LoanProcess> = new PolicyManager(this, LoanPolicyFactory.getInstance(), 'afterProceed', LeadProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3);
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

    getCustomerRelation(customer: Customer, coCustomers: Array<Customer>): Customer {
        if (customer) {
            let index = _.findIndex(coCustomers, function (cust) {
                return customer.id == cust.id;
            })
            if (index == -1) {
                return new Customer();
            }
            return coCustomers[index];
        } else {
            return new Customer();
        }
    }

    static createNewProcess(): Observable<LoanProcess> {
        return LoanProcessFactory
            .createNew()
            .flatMap((loanProcess) => {
                let pm: PolicyManager<LoanProcess> = new PolicyManager<LoanProcess>(loanProcess, LoanPolicyFactory.getInstance(), 'onNew', LoanProcess.getProcessConfig());
                return pm.applyPolicies();
            });
    }


    static getProcessConfig() {
        return loanProcessConfig;
    }
}
