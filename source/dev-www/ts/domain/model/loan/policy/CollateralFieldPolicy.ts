import * as _ from 'lodash';
import {IPolicy} from "../../../shared/IPolicy";
import {LoanProcess} from "../LoanProcess";
import {Observable} from "@reactivex/rxjs";
import LoanRepository = require("../LoanRepository");
import {IEnrolmentRepository} from "../../customer/IEnrolmentRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import EnrolmentProcessFactory = require("../../customer/EnrolmentProcessFactory");
import {CustomerTypes} from "../../customer/Customer";
import {LoanCustomerRelationTypes} from "../LoanCustomerRelation";
import Collateral = require("../Collateral");


export interface CollateralFieldPolicyArgs {
    postStage: string;
}
export class CollateralFieldPolicy extends IPolicy<LoanProcess> {

    args: CollateralFieldPolicyArgs;
    setArguments(args) {       
        this.args = args;
    }

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        console.log(loanProcess);
        let col;
        if(_.hasIn(loanProcess.loanAccount, "collateral") && loanProcess.loanAccount.collateral.length == 0) {
            col = new Collateral();
            let vehicleDetails = loanProcess.loanAccount.vehicleLoanDetails;
            col.electricityAvailable = vehicleDetails.segment;
            col.expectedPurchaseDate = null;
            col.collateralDescription = vehicleDetails.category;
            col.manufacturer = vehicleDetails.make;
            col.modelNo = vehicleDetails.vehicleModel;
            col.serialNo = vehicleDetails.registrationNumber;
            loanProcess.loanAccount.collateral.push(col); 
        }
       return Observable.of(loanProcess);
    }
}
