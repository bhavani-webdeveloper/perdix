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
import VehicleAccessory = require('../VehicleAccessory');
import {FormHelper, IFormHelper} from "../../../shared/FormHelper";
/**
 * Created by shahalpk on 28/11/17.
 */

export class DefaultVehicleAccessoriesPolicy extends IPolicy<LoanProcess> {

    enrolmentRepo: IEnrolmentRepository;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        let activeSession:ISession = ObjectFactory.getInstance("Session");
        return Observable.defer(
            () => {
                let formHelper:IFormHelper = ObjectFactory.getInstance("FormHelper");
                let data = formHelper.getAccessorries();

                if(_.isArray(data) && data.length > 0) {

                    try {

                        let vehicleLoanDetails = new VehicleLoanDetails();
                        if(!_.hasIn(loanProcess.loanAccount, 'vehicleLoanDetails') || !loanProcess.loanAccount.vehicleLoanDetails) {
                            loanProcess.loanAccount.vehicleLoanDetails = vehicleLoanDetails;
                        }
                        loanProcess.loanAccount.vehicleLoanDetails.vehicleAccessories = loanProcess.loanAccount.vehicleLoanDetails.vehicleAccessories || [];
                        for(let accesory of data) {
                            let vehicleAccessory = new VehicleAccessory();
                            vehicleAccessory.accessoryType = accesory.accessoryType
                            loanProcess.loanAccount.vehicleLoanDetails.vehicleAccessories.push(vehicleAccessory);
                        }
                        return Observable.of(loanProcess);
                    }
                    catch(err) {
                        console.log(err)
                        return Observable.of(loanProcess);
                    }


                }


            }
        )
    }

}
