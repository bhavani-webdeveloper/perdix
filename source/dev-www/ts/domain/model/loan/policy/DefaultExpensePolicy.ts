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
import VehicleLoanDetails = require('../VehicleLoanDetails');
import VehicleLoanExpense = require("../VehicleLoanExpense");
import {FormHelper, IFormHelper} from "../../../shared/FormHelper";

export class DefaultExpensePolicy extends IPolicy<LoanProcess> {

    enrolmentRepo: IEnrolmentRepository;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        let activeSession:ISession = ObjectFactory.getInstance("Session");
        let formHelper:IFormHelper = ObjectFactory.getInstance("FormHelper");
        let data_expense = formHelper.getExpenseType();

        if(_.isArray(data_expense) && data_expense.length > 0) {

            try {

                let vehicleLoanDetails = new VehicleLoanDetails();
                if(!_.hasIn(loanProcess.loanAccount, 'vehicleLoanDetails') || !loanProcess.loanAccount.vehicleLoanDetails) {
                    loanProcess.loanAccount.vehicleLoanDetails = vehicleLoanDetails;
                }

                if(_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses) && loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses.length > 0) {
                    return Observable.of(loanProcess);
                } else {
                    loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses = [];
                }
                for(let income of data_expense) {
                    let vehicleLoanExpense = new VehicleLoanExpense();
                    vehicleLoanExpense.expenseType = income.name;
                    loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses.push(vehicleLoanExpense);
                }
                return Observable.of(loanProcess);
            }
            catch(err) {
                console.log(err)
                return Observable.of(loanProcess);
            }
        }
        return Observable.of(loanProcess);
    }
}
