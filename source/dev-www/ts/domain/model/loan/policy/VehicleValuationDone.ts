import {IPolicy} from "../../../shared/IPolicy";
import {Observable} from "@reactivex/rxjs";
import {IEnrolmentRepository} from "../../customer/IEnrolmentRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import {UserSession, ISession} from "../../../shared/Session";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import Customer = require("../../customer/Customer");
import {LoanProcess} from "../LoanProcess";
import * as _ from 'lodash';
import {EnrolmentProcess} from "../../customer/EnrolmentProcess";
import {LoanCustomerRelationTypes} from "../LoanCustomerRelation";
import VehicleLoanDetails = require("../VehicleLoanDetails");
import VehicleLoanIncome = require("../VehicleLoanIncome");
import {FormHelper, IFormHelper} from "../../../shared/FormHelper";
import {IQueryRepository} from "../../../shared/query/IQueryRepository";
 
export class VehicleValuationDone extends IPolicy<LoanProcess> {

    enrolmentRepo: IEnrolmentRepository;
    queryRepo:IQueryRepository;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
        this.queryRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Queries);
    }

    setArguments(args) {
    }

    
    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        let activeSession:ISession = ObjectFactory.getInstance("Session");
        let formHelper:IFormHelper = ObjectFactory.getInstance("FormHelper");
        // try {
            if(!_.hasIn(loanProcess.loanAccount.vehicleLoanDetails, 'vehicleValuationDoneAt') || loanProcess.loanAccount.vehicleLoanDetails.vehicleValuationDoneAt === null) {
                console.log("Vehicle Valuation should be done");
                Observable.throw(new Error("Vehicle Valuation should be done"));
                //throw Observable.throw(new Error("Vehicle Valuation should be done"));
            }
           
        // }
        // catch(err) {
            // console.log(err);
            // return Observable.of(loanProcess);
        // }

        return Observable.of(loanProcess);
    }
}