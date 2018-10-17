import {IPolicy} from "../../../shared/IPolicy";
import {Observable} from "@reactivex/rxjs";
import {IEnrolmentRepository} from "../../customer/IEnrolmentRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import {UserSession, ISession} from "../../../shared/Session";
import {FormHelper, IFormHelper} from "../../../shared/FormHelper";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import Customer = require("../Customer");
import {ValidationError} from "../../../../ui/errors/ValidationError";
import FamilyMember = require("../FamilyMember");
import Expenditure = require("../Expenditure");
import {EnrolmentProcess} from "../EnrolmentProcess";
import {AgentProcess} from "../../agent/AgentProcess";
import AngularResourceService = require("../../../../infra/api/AngularResourceService");
import * as _ from 'lodash';


declare var moment: Function;

export class VerifyBankAccountNumberPolicy extends IPolicy<EnrolmentProcess> {

    enrolmentRepo: IEnrolmentRepository;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(enrolmentProcess: EnrolmentProcess): Observable<EnrolmentProcess> {
        if (_.hasIn(enrolmentProcess.customer, "customerType") && enrolmentProcess.customer.customerType.toLowerCase() == 'enterprise') {
             if(_.hasIn(enrolmentProcess.customer, "customerBankAccounts") && _.isArray(enrolmentProcess.customer.customerBankAccounts) && enrolmentProcess.customer.customerBankAccounts.length > 0) {
                for (let i=0;i<enrolmentProcess.customer.customerBankAccounts.length;i++) {
                     var banckAccount = enrolmentProcess.customer.customerBankAccounts[i];
                     if (banckAccount.accountNumber != banckAccount.confirmedAccountNumber) {
                        console.log("Account Number and Confirmed Account Number must be same");
                        return Observable.throw(new ValidationError("Account Number and Confirmed Account Number must be same"));
                    }
                }
            }
        }
        else if (_.hasIn(enrolmentProcess.customer, "customerType") && enrolmentProcess.customer.customerType.toLowerCase() == 'individual') {
           if(_.hasIn(enrolmentProcess.customer, "customerBankAccounts") && _.isArray(enrolmentProcess.customer.customerBankAccounts) && enrolmentProcess.customer.customerBankAccounts.length > 0) {
                for (let i=0;i<enrolmentProcess.customer.customerBankAccounts.length;i++) {
                     var banckAccount = enrolmentProcess.customer.customerBankAccounts[i];
                     if (banckAccount.accountNumber != banckAccount.confirmedAccountNumber) {
                         console.log("Account Number and Confirmed Account Number must be same");
                         return Observable.throw(new ValidationError("Account Number and Confirmed Account Number must be same"));
                    }
                }
            } 
        }

        return Observable.of(enrolmentProcess);
    }
}
