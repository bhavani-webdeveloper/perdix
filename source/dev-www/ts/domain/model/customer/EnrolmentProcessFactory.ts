import {Observable} from "@reactivex/rxjs";
import Customer = require("./Customer");
import {IEnrolmentRepository} from "./IEnrolmentRepository";
import RepositoryFactory = require('../../shared/RepositoryFactory');
import { RepositoryIdentifiers } from '../../shared/RepositoryIdentifiers';
import {plainToClass} from "class-transformer";
import Utils = require("../../shared/Utils");
import {IPolicy} from "../../shared/IPolicy";
// import {LeadPolicy} from "./policy/LeadPolicy";
// import {LeadPolicyFactory} from "./policy/LeadPolicyFactory";
import {PolicyManager} from "../../shared/PolicyManager";
import {EnrolmentProcess} from "./EnrolmentProcess";
import FamilyMember = require("./FamilyMember");
import {EnrolmentPolicyFactory} from "./policy/EnrolmentPolicyFactory";



/**
 * Created by shahalpk on 21/11/17.
 */


class EnrolmentProcessFactory {


  static fromCustomer(obj: Customer): Observable<EnrolmentProcess> {
    let ep = new EnrolmentProcess();
    ep.customer = obj;
    let pm: PolicyManager<EnrolmentProcess> = new PolicyManager<EnrolmentProcess>(ep, EnrolmentPolicyFactory.getInstance(), 'onNew', EnrolmentProcess.getProcessConfig());
    return pm.applyPolicies();
  }

  static beforeProceedCustomer(obj: Customer): Observable<EnrolmentProcess> {
    let ep = new EnrolmentProcess();
    ep.customer = obj;
    let pm: PolicyManager<EnrolmentProcess> = new PolicyManager<EnrolmentProcess>(ep, EnrolmentPolicyFactory.getInstance(), 'beforeProceed', EnrolmentProcess.getProcessConfig());
    return pm.applyPolicies();
  }

  static beforeSaveEnrolment(obj: Customer): Observable<EnrolmentProcess> {
    let ep = new EnrolmentProcess();
    ep.customer = obj;
    let pm: PolicyManager<EnrolmentProcess> = new PolicyManager<EnrolmentProcess>(ep, EnrolmentPolicyFactory.getInstance(), 'beforeSave', EnrolmentProcess.getProcessConfig());
    return pm.applyPolicies();
  }







}

export = EnrolmentProcessFactory;
