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


declare var enrolmentProcessConfig: Object;

export class EnrolmentProcess {
    remarks: string;
    stage: string;
    customer: Customer;
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
        /* Calls all business policies associated with save */
        // return this.enrolmentRepo.updateIndividualLoan(loanAccount);
    }

    proceed(): any {
        /* Calls all business policies assocaited with proceed */

        // plainToClass

        // return this.enrolmentRepo.updateIndividualLoan(loanAccount);
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
