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


let PageHelper = AngularResourceService.getInstance().getNGService("PageHelper");
declare var moment: Function;

export class VerifyTrackDetailsPolicy extends IPolicy<EnrolmentProcess> {


    enrolmentRepo: IEnrolmentRepository;
    flag: number;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(enrolmentProcess: EnrolmentProcess): Observable<EnrolmentProcess> {

        if(_.hasIn(enrolmentProcess.customer, "customerType") && enrolmentProcess.customer.customerType.toLowerCase() == 'enterprise'){
            if(enrolmentProcess.customer.vehiclesOwned >= enrolmentProcess.customer.vehiclesFinanced){
                enrolmentProcess.customer.vehiclesFree = enrolmentProcess.customer.vehiclesOwned - enrolmentProcess.customer.vehiclesFinanced;
            }
            else {
                console.log("No. of vehicles owned should be greater that no. of vehicles financed");
                return Observable.throw(new ValidationError("No. of vehicles owned should be greater that no. of vehicles financed"));
            }
        }
        return Observable.of(enrolmentProcess);
    }
}
