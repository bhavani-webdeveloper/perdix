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
import AngularResourceService = require("../../../../infra/api/AngularResourceService");
import Collateral = require("../Collateral");


export interface CollateralFieldPolicyArgs {
    postStage: string;
    ltv: boolean;
}
export class CollateralFieldPolicy extends IPolicy<LoanProcess> {

    args: CollateralFieldPolicyArgs;
    setArguments(args) {       
        this.args = args;
    }

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        let Queries = AngularResourceService.getInstance().getNGService("Queries");
        let ltv = null;
        
        if(this.args && this.args.ltv && this.args.ltv == true) {
            return Observable.fromPromise(Queries.getLTVValue({
                "make":loanProcess.loanAccount.vehicleLoanDetails.make,
                "vehicle_model":loanProcess.loanAccount.vehicleLoanDetails.vehicleModel,
                "registration_number":loanProcess.loanAccount.vehicleLoanDetails.registrationNumber,
                "year_of_manufacture":loanProcess.loanAccount.vehicleLoanDetails.yearOfManufacture
            })).map((res:any)=>{
                let vintageValue = null;
                if(res.body.length>0 && res.body[0].value) {
                    vintageValue = res.body[0].value;
                }

                if(loanProcess.loanAccount.vehicleLoanDetails.vehicleType == 'New') {
                    ltv = loanProcess.loanAccount.vehicleLoanDetails.price;
                } else if(loanProcess.loanAccount.vehicleLoanDetails.vehicleType == 'Used') {
                    ltv = _.min([
                            loanProcess.loanAccount.vehicleLoanDetails.insuredDeclaredValue, 
                            loanProcess.loanAccount.vehicleLoanDetails.currentMarketValue, 
                            loanProcess.loanAccount.vehicleLoanDetails.price, 
                            vintageValue
                        ]);
                } else {
                    ltv = _.min([
                            loanProcess.loanAccount.vehicleLoanDetails.insuredDeclaredValue, 
                            loanProcess.loanAccount.vehicleLoanDetails.currentMarketValue, 
                            vintageValue
                        ]);
                }

                let col;               
                if(_.hasIn(loanProcess.loanAccount, "collateral") && loanProcess.loanAccount.collateral.length == 0) {
                    col = new Collateral();
                    let vehicleDetails = loanProcess.loanAccount.vehicleLoanDetails;
                    col.collateralType = 'Vehicle';
                    col.collateralCategory = 'Vehicle';
                    col.quantity = 1;
                    col.electricityAvailable = vehicleDetails.segment;
                    col.collateralDescription = vehicleDetails.category;
                    col.udf1 = vehicleDetails.yearOfManufacture;
                    col.manufacturer = vehicleDetails.make;
                    col.modelNo = vehicleDetails.vehicleModel;
                    col.serialNo = vehicleDetails.registrationNumber;
                    col.collateralValue = ltv;
                    col.machineOld = (vehicleDetails.vehicleType == 'Used') ? 'true': 'false';
                    loanProcess.loanAccount.collateral.push(col); 
                }
                return loanProcess;
           });
        } else {
            let col;
            if(_.hasIn(loanProcess.loanAccount, "collateral") && loanProcess.loanAccount.collateral.length == 0) {
                col = new Collateral();
                let vehicleDetails = loanProcess.loanAccount.vehicleLoanDetails;
                col.collateralType = 'Vehicle';
                col.collateralCategory = 'Vehicle';
                col.quantity = 1;
                col.electricityAvailable = vehicleDetails.segment;
                col.collateralDescription = vehicleDetails.category;
                col.udf1 = vehicleDetails.yearOfManufacture;

                col.manufacturer = vehicleDetails.make;
                col.modelNo = vehicleDetails.vehicleModel;
                col.serialNo = vehicleDetails.registrationNumber;
                col.machineOld = (vehicleDetails.vehicleType == 'Used') ? 'true': 'false';
                loanProcess.loanAccount.collateral.push(col); 
            }
            
            return Observable.of(loanProcess);
       }
    }
}
