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
import AngularResourceService = require("../../../../infra/api/AngularResourceService");
import * as _ from 'lodash';


declare var moment: Function;

export class MandatoryTangibleWorthPolicy extends IPolicy<EnrolmentProcess> {

    enrolmentRepo: IEnrolmentRepository;
    flag: number;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(enrolmentProcess: EnrolmentProcess): Observable<EnrolmentProcess> {

        if(_.hasIn(enrolmentProcess.customer, "enterpriseNetworth") && _.isArray(enrolmentProcess.customer.enterpriseNetworth) && enrolmentProcess.customer.enterpriseNetworth.length > 0 && enrolmentProcess.customer.enterpriseType.toLowerCase() =='enterprise' && enrolmentProcess.customer.customerCategory.toLowerCase() == 'captive - retail') {
            this.flag = 0;
            for (let i=0;i<enrolmentProcess.customer.enterpriseNetworth.length;i++) {
                var enterpriseNetworth = enrolmentProcess.customer.enterpriseNetworth[i];
                if (enterpriseNetworth.financialYear && enterpriseNetworth.tangibleNetworth) {
                    this.flag++;
                } else {
                    console.log("Please Fill Enterprise Net Worth Section");
                    return Observable.throw(new ValidationError("Please Fill Enterprise Net Worth Section"));
                }
            }
            if (this.flag == enrolmentProcess.customer.enterpriseNetworth.length) {
                console.log("Enterprise Networth Verified");
                return Observable.of(enrolmentProcess);
            }
        }
        return Observable.of(enrolmentProcess);
    }
}
