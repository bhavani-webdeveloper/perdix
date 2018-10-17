import {IPolicy} from "../../../shared/IPolicy";
import {EnrolmentProcess} from "../EnrolmentProcess";
import {IEnrolmentRepository} from "../IEnrolmentRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import {Observable} from "@reactivex/rxjs";
import {ISession} from "../../../shared/Session";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import {IFormHelper} from "../../../shared/FormHelper";
import {ValidationError} from "../../../../ui/errors/ValidationError";
export class CommercialCBCheckPolicy extends IPolicy<EnrolmentProcess> {

    enrolmentRepo: IEnrolmentRepository;

    constructor() {
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(enrolmentProcess: EnrolmentProcess): Observable<EnrolmentProcess> {
        let activeSession:ISession = ObjectFactory.getInstance("Session");
        let formHelperData:IFormHelper = ObjectFactory.getInstance("FormHelper");

        let commercialCheckFailed = false;
        if(enrolmentProcess.customer.enterpriseBureauDetails && enrolmentProcess.customer.enterpriseBureauDetails.length>0){
            for (let i = enrolmentProcess.customer.enterpriseBureauDetails.length - 1; i >= 0; i--) {
                if(!enrolmentProcess.customer.enterpriseBureauDetails[i].fileId
                    || !enrolmentProcess.customer.enterpriseBureauDetails[i].bureau
                    || enrolmentProcess.customer.enterpriseBureauDetails[i].doubtful==null
                    || enrolmentProcess.customer.enterpriseBureauDetails[i].loss==null
                    || enrolmentProcess.customer.enterpriseBureauDetails[i].specialMentionAccount==null
                    || enrolmentProcess.customer.enterpriseBureauDetails[i].standard==null
                    || enrolmentProcess.customer.enterpriseBureauDetails[i].subStandard==null){
                    commercialCheckFailed = true;
                    break;
                }
            }
        } else {
            commercialCheckFailed = true;
        }
        if(commercialCheckFailed && enrolmentProcess.customer.customerBankAccounts && enrolmentProcess.customer.customerBankAccounts.length>0){
            for (let i = enrolmentProcess.customer.customerBankAccounts.length - 1; i >= 0; i--) {
                if(enrolmentProcess.customer.customerBankAccounts[i].accountType == 'OD' || enrolmentProcess.customer.customerBankAccounts[i].accountType == 'CC'){
                    return Observable.throw(new ValidationError("Commercial bureau check fields are mandatory"));
                }
            }
        }
    }    
}