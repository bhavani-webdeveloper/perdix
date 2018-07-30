///<amd-dependency path="perdixConfig/LoanProcessConfig" name="loanProcessConfig"/>

import {RepositoryIdentifiers} from '../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../shared/RepositoryFactory');
import LoanAccount = require("./LoanAccount");
import {ILoanRepository} from "./ILoanRepository";
import {Observable} from "@reactivex/rxjs";
import {plainToClass} from "class-transformer";
import EnrollmentProcessFactory = require("../customer/EnrolmentProcessFactory");
import {EnrolmentProcess} from "../customer/EnrolmentProcess";
import {Customer} from  "../customer/Customer";
import LoanProcessFactory = require("./LoanProcessFactory");
import {PolicyManager} from "../../shared/PolicyManager";
import {LeadProcess} from "../lead/LeadProcess";
import {LoanPolicyFactory} from "./policy/LoanPolicyFactory";
import EnrolmentProcessFactory = require("../customer/EnrolmentProcessFactory");
import LoanCenter = require("./LoanCentre");
import * as _ from 'lodash';
import {LoanCustomerRelationTypes, LoanCustomerRelation} from "./LoanCustomerRelation";


declare var loanProcessConfig: Object;

export class LoanProcess {
    remarks: string;
    stage: string;
    loanProcessAction: string;
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
            if (!_.isArray(this.guarantorsEnrolmentProcesses)) {
                    this.guarantorsEnrolmentProcesses = [];
                }
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
        /* Loan customer */
        let lc = new LoanCenter();
        if (_.hasIn(this.loanCustomerEnrolmentProcess, 'customer.id')) {
            this.loanAccount.customerId = this.loanCustomerEnrolmentProcess.customer.id;
            this.loanAccount.urnNo = this.loanCustomerEnrolmentProcess.customer.urnNo;

            lc.centreId = this.loanCustomerEnrolmentProcess.customer.centreId;
            this.loanAccount.loanCentre = lc;
        }

        this.loanAccount.loanCustomerRelations = this.loanAccount.loanCustomerRelations || [];

        if (_.hasIn(this.applicantEnrolmentProcess, 'customer.id')) {
            this.loanAccount.applicant = this.applicantEnrolmentProcess.customer.urnNo;
            lc.centreId = this.applicantEnrolmentProcess.customer.centreId;
            this.loanAccount.loanCentre = lc;

            let aIndex = _.findIndex(this.loanAccount.loanCustomerRelations, (item) => {
                return item.customerId == this.applicantEnrolmentProcess.customer.id;
            });

            if (aIndex == -1){
                let lcr:LoanCustomerRelation = new LoanCustomerRelation();
                lcr.customerId = this.applicantEnrolmentProcess.customer.id;
                lcr.urn = this.applicantEnrolmentProcess.customer.urnNo;
                lcr.name = this.applicantEnrolmentProcess.customer.firstName;
                lcr.relation = LoanCustomerRelationTypes.APPLICANT;
                this.loanAccount.loanCustomerRelations.push(lcr);
            }
        }

        for (let coApplicant:EnrolmentProcess of this.coApplicantsEnrolmentProcesses){

            /* Need details on coBorrower */

            if (!_.isNumber(coApplicant.customer.id)){
                continue;
            }

            let aIndex = _.findIndex(this.loanAccount.loanCustomerRelations, (item) => {
                return item.customerId == coApplicant.customer.id;
            });

            if (aIndex == -1){
                let lcr:LoanCustomerRelation = new LoanCustomerRelation();
                lcr.customerId = coApplicant.customer.id;
                lcr.urn = coApplicant.customer.urnNo;
                lcr.name = coApplicant.customer.firstName;
                lcr.relation = LoanCustomerRelationTypes.CO_APPLICANT;
                this.loanAccount.loanCustomerRelations.push(lcr);
            }
        }

        for (let guarantor:EnrolmentProcess of this.guarantorsEnrolmentProcesses){

            /* Need details on coBorrower */
            if (!_.isNumber(guarantor.customer.id)){
                continue;
            }

            let aIndex = _.findIndex(this.loanAccount.loanCustomerRelations, (item) => {
                return item.customerId == guarantor.customer.id;
            });

            if (aIndex == -1){
                let lcr:LoanCustomerRelation = new LoanCustomerRelation();
                lcr.customerId = guarantor.customer.id;
                lcr.urn = guarantor.customer.urnNo;
                lcr.name = guarantor.customer.firstName;
                lcr.relation = LoanCustomerRelationTypes.GUARANTOR;
                this.loanAccount.loanCustomerRelations.push(lcr);
            }
        }

        /**
         * Remove
         */
        _.remove(this.loanAccount.loanCustomerRelations, (lcr:LoanCustomerRelation) => {
            if (lcr.relation == LoanCustomerRelationTypes.APPLICANT){
                if (_.hasIn(this.applicantEnrolmentProcess, 'customer.id') &&
                    this.applicantEnrolmentProcess.customer.id != lcr.customerId) {
                    return true;
                }
            } else if (lcr.relation == LoanCustomerRelationTypes.CO_APPLICANT){
                return _.every(this.coApplicantsEnrolmentProcesses, (coApplicant) =>{
                    return (_.hasIn(coApplicant, "customer.id") && coApplicant.customer.id != lcr.customerId)
                })
            } else if (lcr.relation == LoanCustomerRelationTypes.GUARANTOR){
                return _.every(this.guarantorsEnrolmentProcesses, (guarantor) => {
                    return (_.hasIn(guarantor, "customer.id") && guarantor.customer.id != lcr.customerId)
                });
            } else if (lcr.relation == LoanCustomerRelationTypes.LOAN_CUSTOMER) {
                if (_.hasIn(this.loanCustomerEnrolmentProcess, 'customer.id') &&
                    this.loanCustomerEnrolmentProcess.customer.id != lcr.customerId) {
                    return true;
                }
            }
            return false;

        });

    }

    /**
     * Removes any related customers from the process. Internally calls refreshRelatedCustomers to update
     * the values in LoanAccount.
     *
     * @param customerId
     * @param re`lation
     */
    public removeRelatedEnrolmentProcess(enrolmentProcess: EnrolmentProcess, relation: LoanCustomerRelationTypes) {
        if (relation == LoanCustomerRelationTypes.APPLICANT &&
            this.applicantEnrolmentProcess === enrolmentProcess ) {
            this.applicantEnrolmentProcess = null;
        } else if (relation == LoanCustomerRelationTypes.CO_APPLICANT){
            let index = _.findIndex(this.coApplicantsEnrolmentProcesses, function(ep){
                return ep === enrolmentProcess
            })
            if (index > -1){
                this.coApplicantsEnrolmentProcesses.splice(index, 1);
            }
        } else if (relation == LoanCustomerRelationTypes.GUARANTOR){
            let index = _.findIndex(this.guarantorsEnrolmentProcesses, function(ep){
                return ep === enrolmentProcess
            })
            if (index > -1){
                this.guarantorsEnrolmentProcesses.splice(index, 1);
            }
        } else if (relation == LoanCustomerRelationTypes.LOAN_CUSTOMER &&
            this.loanCustomerEnrolmentProcess === enrolmentProcess){
            this.loanCustomerEnrolmentProcess = null;
        }

        this.refreshRelatedCustomers();
    }

    public setRelatedCustomer(enrolmentProcess: EnrolmentProcess): LoanProcess {
        let index = -1;
        if(_.hasIn(enrolmentProcess, "customer")) {
            index = _.findIndex(this.loanAccount.loanCustomerRelations, function (lcr) {
                return lcr.customerId == enrolmentProcess.customer.id;
            });
        }

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



    save(): any {
        /* Calls all business policies associated with save */
        this.loanProcessAction = "SAVE";
        let pmBeforeUpdate: PolicyManager<LoanProcess> = new PolicyManager(this, LoanPolicyFactory.getInstance(), 'beforeSave', LoanProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = null;
        if (this.loanAccount.id){
            obs2 = this.individualLoanRepo.update(this);
        } else {
            obs2 = this.individualLoanRepo.create(this);
        }

        let pmAfterUpdate: PolicyManager<LoanProcess> = new PolicyManager(this, LoanPolicyFactory.getInstance(), 'afterSave', LoanProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }

    hold(): any {
        this.loanProcessAction = "SAVE";
        this.loanAccount.status = 'HOLD';
        let pmBeforeUpdate: PolicyManager<LoanProcess> = new PolicyManager(this, LoanPolicyFactory.getInstance(), 'beforeSave', LoanProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = null;
        if (this.loanAccount.id){
            obs2 = this.individualLoanRepo.update(this);
        } else {
            obs2 = this.individualLoanRepo.create(this);
        }

        let pmAfterUpdate: PolicyManager<LoanProcess> = new PolicyManager(this, LoanPolicyFactory.getInstance(), 'afterSave', LoanProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }

    proceed(toStage: string): any {
        /* Calls all business policies assocaited with proceed */
        this.stage = toStage;
        this.loanProcessAction = "PROCEED";
        let pmBeforeUpdate: PolicyManager<LoanProcess> = new PolicyManager(this, LoanPolicyFactory.getInstance(), 'beforeProceed', LoanProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.individualLoanRepo.update(this);
        let pmAfterUpdate: PolicyManager<LoanProcess> = new PolicyManager(this, LoanPolicyFactory.getInstance(), 'afterProceed', LoanProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }

    sendBack(): any {
        this.loanProcessAction = "PROCEED";
        let pmBeforeUpdate: PolicyManager<LoanProcess> = new PolicyManager(this, LoanPolicyFactory.getInstance(), 'beforeSendBack', LoanProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.individualLoanRepo.update(this);
        let pmAfterUpdate: PolicyManager<LoanProcess> = new PolicyManager(this, LoanPolicyFactory.getInstance(), 'afterSendBack', LoanProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }

    reject(): any {
        this.stage = "REJECTED";
        this.loanProcessAction = "PROCEED";
        let pmBeforeUpdate: PolicyManager<LoanProcess> = new PolicyManager(this, LoanPolicyFactory.getInstance(), 'beforeReject', LoanProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.individualLoanRepo.update(this);
        let pmAfterUpdate: PolicyManager<LoanProcess> = new PolicyManager(this, LoanPolicyFactory.getInstance(), 'afterReject', LoanProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
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
