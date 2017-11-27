import EnrollmentProcess = require("./EnrollmentProcess");
import {Observable} from "@reactivex/rxjs";
import Customer = require("./Customer");
import {IEnrollmentRepository} from "./IEnrollmentRepository";
import RepositoryFactory = require('../../shared/RepositoryFactory');
import { RepositoryIdentifiers } from '../../shared/RepositoryIdentifiers';
import {plainToClass} from "class-transformer";
import Utils = require("../../shared/Utils");
import {IPolicy} from "../../shared/IPolicy";
// import {LeadPolicy} from "./policy/LeadPolicy";
// import {LeadPolicyFactory} from "./policy/LeadPolicyFactory";
import {PolicyManager} from "../../shared/PolicyManager";

/**
 * Created by shahalpk on 21/11/17.
 */


class EnrollmentProcessFactory {


  static fromCustomer(obj: Customer): EnrollmentProcess {
      let ep = new EnrollmentProcess();
      ep.customer = obj;

      return ep;
  }


  static fromCustomerID(id: number): Observable<EnrollmentProcess> {
      let enrollmentRepo: IEnrollmentRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrollment);
      return enrollmentRepo.getCustomerById(id)
            .map(
                (value: Object) => {
                    let ep:EnrollmentProcess = new EnrollmentProcess();
                    ep.customer = plainToClass(Customer, Utils.toJSObj(value));
                    return ep;
                }
            )
  }

  // static newLoanProcess(): Observable<EnrollmentProcess> {
  //       // let cs: customer = new Customer();
  //       // cs.loanAccount = new LoanAccount();
  //       // let pm: PolicyManager<LoanProcess> = new PolicyManager<LoanProcess>(lp, LoanPolicyFactory.getInstance(), 'onNew', LoanProcess.getProcessConfig());
  //       // return pm.applyPolicies();
  //   }

  //   static createFromLeadId(id: number): Observable<EnrollmentProcess> {
  //   	// let customerRepo: IEnrollmentRepository = EnrollmentProcess.createRepositoryObject(RepositoryIdentifiers.Enrollment);
  //   	// return customerRepo.getCustomerById(id)
  //    //        .map(
  //    //            (value) => {
  //    //                this.customer = value;
  //    //                // this.loanAccount.currentStage = "SHAHAL STGE";
  //    //                return this;
  //    //            }
  //    //        ).concatAll();
  //   }


}

export = EnrollmentProcessFactory;
