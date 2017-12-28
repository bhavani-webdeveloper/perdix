///<amd-dependency path="perdixConfig/EnrolmentProcessConfig" name="enrolmentProcessConfig"/>

import {RepositoryIdentifiers} from '../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../shared/RepositoryFactory');
import {IEnrolmentRepository} from "./IEnrolmentRepository";
import {Observable} from "@reactivex/rxjs";
import Utils = require("../../shared/Utils");
import {plainToClass} from "class-transformer";
import {PolicyManager} from "../../shared/PolicyManager";
import {Customer, CustomerTypes} from "./Customer";
import {EnrolmentPolicyFactory} from "./policy/EnrolmentPolicyFactory";
import {EnrolmentProcessFactory} from "./EnrolmentProcessFactory";
import EnterpriseCustomerRelation = require("./EnterpriseCustomerRelation");
import {LoanProcess} from "../loan/LoanProcess";


declare var enrolmentProcessConfig: Object;

export class EnrolmentProcess {
    remarks: string;
    stage: string;
    customer: Customer;
    enrollmentAction: string;
    enrolmentRepo: IEnrolmentRepository;

    constructor() {
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
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

    save(): any {
        this.enrollmentAction = 'SAVE';
        let pmBeforeUpdate:PolicyManager<EnrolmentProcess>  = new PolicyManager(this, EnrolmentPolicyFactory.getInstance(), 'beforeSave', EnrolmentProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.enrolmentRepo.updateEnrollment(this)
        let pmAfterUpdate:PolicyManager<EnrolmentProcess>  = new PolicyManager(this, EnrolmentPolicyFactory.getInstance(), 'afterSave', EnrolmentProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }

    proceed(): any {
        this.enrollmentAction = 'PROCEED';
        let pmBeforeUpdate:PolicyManager<EnrolmentProcess>  = new PolicyManager(this, EnrolmentPolicyFactory.getInstance(), 'beforeProceed', EnrolmentProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.enrolmentRepo.updateEnrollment(this)
        let pmAfterUpdate:PolicyManager<EnrolmentProcess>  = new PolicyManager(this, EnrolmentPolicyFactory.getInstance(), 'afterProceed', EnrolmentProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
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

    public refreshEnterpriseCustomerRelations(loanProcess: LoanProcess): void{
        /* Loan customer */

        this.customer.enterpriseCustomerRelations = this.customer.enterpriseCustomerRelations || [];

        if (_.hasIn(loanProcess.applicantEnrolmentProcess, 'customer.id')) {
            loanProcess.loanAccount.applicant = loanProcess.applicantEnrolmentProcess.customer.urnNo;

            let aIndex = _.findIndex(this.customer.enterpriseCustomerRelations, (item) => {
                return item.linkedToCustomerId == loanProcess.applicantEnrolmentProcess.customer.id;
            });

            /* @TODO Code to insert to enterprise customer relations */

            if (aIndex==-1){
                let a:EnterpriseCustomerRelation = new EnterpriseCustomerRelation();
                a.linkedToCustomerId = loanProcess.applicantEnrolmentProcess.customer.id;
                this.customer.enterpriseCustomerRelations.push(a);
            }

        }

        for (let coApplicant:EnrolmentProcess of loanProcess.coApplicantsEnrolmentProcesses){

            /* Need details on coBorrower */

            let aIndex = _.findIndex(this.customer.enterpriseCustomerRelations, (item) => {
                return item.linkedToCustomerId == coApplicant.customer.id;
            });

            if (aIndex == -1) {
                let a:EnterpriseCustomerRelation = new EnterpriseCustomerRelation();
                a.linkedToCustomerId = coApplicant.customer.id;
                this.customer.enterpriseCustomerRelations.push(a);
            }
        }

        for (let guarantor:EnrolmentProcess of loanProcess.guarantorsEnrolmentProcesses){

            /* Need details on guarantor */

            let aIndex = _.findIndex(this.customer.enterpriseCustomerRelations, (item) => {
                return item.linkedToCustomerId == guarantor.customer.id;
            });

            if (aIndex == -1) {
                let a:EnterpriseCustomerRelation = new EnterpriseCustomerRelation();
                a.linkedToCustomerId = guarantor.customer.id;
                this.customer.enterpriseCustomerRelations.push(a);
            }
        }
    }

    addEnterpriseCustomerRelation(customer: Customer){
        let i = _.findIndex(this.customer.enterpriseCustomerRelations, function(item){
            return item.linkedToCustomerId == customer.id;
        })
        if (i != -1){
            return;
        }

        let ecr:EnterpriseCustomerRelation = new EnterpriseCustomerRelation();
        ecr.linkedToCustomerId = customer.id;
        this.customer.enterpriseCustomerRelations = this.customer.enterpriseCustomerRelations || [];
        this.customer.enterpriseCustomerRelations.push(ecr);
    }

    static createNewProcess(customerType: CustomerTypes = CustomerTypes.INDIVIDUAL): Observable<EnrolmentProcess> {
        let ep = new EnrolmentProcess();
        ep.customer = new Customer();
        ep.customer.customerType = customerType;
        let pm: PolicyManager<EnrolmentProcess> = new PolicyManager<EnrolmentProcess>(ep, EnrolmentProcessFactory.enrolmentPolicyFactory, 'onNew', EnrolmentProcessFactory.enrolmentProcessConfig);
        return pm.applyPolicies();
    }

    static fromCustomerID(id: number): Observable<EnrolmentProcess> {
        return EnrolmentProcessFactory.createFromCustomerID(id)
            .flatMap((enrolmentProcess) => {
                let pm: PolicyManager<EnrolmentProcess> = new PolicyManager<EnrolmentProcess>(enrolmentProcess, EnrolmentPolicyFactory.getInstance(), 'onLoad', EnrolmentProcess.getProcessConfig());
                return pm.applyPolicies();
            })
    }

    static getProcessConfig() {
        return enrolmentProcessConfig;
    }
}
