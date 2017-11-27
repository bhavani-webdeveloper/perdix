import EnrolmentProcess = require("./EnrolmentProcess");
import {Observable} from "@reactivex/rxjs";
import Customer = require("./Customer");
import {IEnrolmentRepository} from "./IEnrollmentRepository";
import RepositoryFactory = require('../../shared/RepositoryFactory');
import { RepositoryIdentifiers } from '../../shared/RepositoryIdentifiers';
import {plainToClass} from "class-transformer";
import Utils = require("../../shared/Utils");
import {IPolicy} from "../../shared/IPolicy";
// import {LeadPolicy} from "./policy/LeadPolicy";
// import {LeadPolicyFactory} from "./policy/LeadPolicyFactory";
import {PolicyManager} from "../../shared/PolicyManager";
import EnrolmentProcess = require("./EnrolmentProcess");

/**
 * Created by shahalpk on 21/11/17.
 */


class EnrolmentProcessFactory {


  static fromCustomer(obj: Customer): EnrolmentProcess {
      let ep = new EnrolmentProcess();
      ep.customer = obj;

      return ep;
  }


  static fromCustomerID(id: number): Observable<EnrolmentProcess> {
      let enrollmentRepo: IEnrolmentRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrollment);
      return enrollmentRepo.getCustomerById(id)
            .map(
                (value: Object) => {
                    let ep:EnrolmentProcess = new EnrolmentProcess();
                    //noinspection TypeScriptValidateTypes
                    ep.customer = plainToClass(Customer, Utils.toJSObj(value));
                    return ep;
                }
            )
  }




}

export = EnrolmentProcessFactory;
