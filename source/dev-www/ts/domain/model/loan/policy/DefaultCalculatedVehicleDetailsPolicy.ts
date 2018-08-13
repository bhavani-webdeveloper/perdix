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

export class DefaultCalculatedVehicleDetailsPolicy extends IPolicy<LoanProcess> {

    enrolmentRepo: IEnrolmentRepository;
    queryRepo:IQueryRepository;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
        this.queryRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Queries);
    }

    setArguments(args) {
    }

    defaultCalculatedVehicleDetails (loanProcess, res) {
        let data = res.results;
        if (loanProcess.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1.toUpperCase() == 'NO') {
                if (_.hasIn(loanProcess.loanAccount, 'vehicleLoanDetails')) {
                for (let d of data) {
                    if (loanProcess.loanAccount.vehicleLoanDetails.vehicleModel == d.model) {
                        
                        // Adding dummy fields for showing calculation
                        let calculateFields = {
                            "validation": "",
                            "totalMonthlyExpense": "",
                            "freeCashFlow": "",
                            "fcfToEmi": "",
                            "emi": "",                                                        
                            "monthlyWorkingHours" : ""
                        };
                        _.assign(loanProcess.loanAccount.vehicleLoanDetails, calculateFields);


                        if (_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0]) {
                            var calculateFieldsForRoute = {
                                "kmPerMonth": null
                            };
                            _.assign(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0], calculateFieldsForRoute);
                        }


                        // Calculation for Km per month
                        if(_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routesKms && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) {
                            loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth = loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routesKms * loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips;
                        }

                        // Calculation for monthly working hours
                        if (d.calculation_method == 'TIME' && loanProcess.loanAccount.vehicleLoanDetails.dailyWorkingHours && loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingDays) {
                            loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingHours = parseFloat(loanProcess.loanAccount.vehicleLoanDetails.dailyWorkingHours)* parseFloat(loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingDays);
                        }


                        // Calculation for Validation
                        if (d.calculation_method == "DISTANCE") {
                            if (loanProcess.loanAccount.vehicleLoanDetails.ratePerTrip && _.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) {
                                if (loanProcess.loanAccount.vehicleLoanDetails.ratePerTrip * parseFloat(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) > loanProcess.loanAccount.vehicleLoanDetails.payload) {
                                    loanProcess.loanAccount.vehicleLoanDetails.validation = "ERROR";
                                } else {
                                    loanProcess.loanAccount.vehicleLoanDetails.validation = "OK";
                                }    
                            } else {
                                console.log("Fields required for validation are empty");
                                return Observable.of(loanProcess);
                            }                       
                        }

                         // Calculation for totalMonthlyExpense
                         if (_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses)) {
                             let sum = 0;   
                             for (var i=0; i<loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses.length; i++) {
                                let vehicleLoanExpense = loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[i];
                                sum = sum + vehicleLoanExpense.expenseAmount;
                             }
                             loanProcess.loanAccount.vehicleLoanDetails.totalMonthlyExpense = sum;
                         } else {
                                console.log("Fields required for Total Monthly Expenses are empty");
                                return Observable.of(loanProcess);                                                            
                         }

                         // Calculation for free cash flow
                         if (_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes) && loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0] && loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0].incomeAmount && loanProcess.loanAccount.vehicleLoanDetails.totalMonthlyExpense)
                            loanProcess.loanAccount.vehicleLoanDetails.freeCashFlow = parseFloat(loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0].incomeAmount) - parseFloat(loanProcess.loanAccount.vehicleLoanDetails.totalMonthlyExpense);
                         else {
                            console.log("Fields required for Free Cash Flow are empty");
                            return Observable.of(loanProcess);
                         }

                         // Calculation for fcfToEmi
                         if (loanProcess.loanAccount.estimatedEmi)
                             loanProcess.loanAccount.vehicleLoanDetails.fcfToEmi = parseFloat(loanProcess.loanAccount.vehicleLoanDetails.freeCashFlow) / parseFloat(loanProcess.loanAccount.estimatedEmi);
                         else {
                            console.log("Fields required for fcfToEmi are  empty");
                            return Observable.of(loanProcess);                                                                                                     
                         }

                         break;
                    }
                }
            }
        } else if (loanProcess.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1.toUpperCase() == 'YES') {
               let calculateFields = {
                    "validation": "",
                    "totalMonthlyExpense": "",
                    "freeCashFlow": "",
                    "fcfToEmi": "",
                    "emi": "",                                                        
                    "monthlyWorkingHours" : ""
                };
                _.assign(loanProcess.loanAccount.vehicleLoanDetails, calculateFields);

               if (_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0]) {
                    var calculateFieldsForRoute = {
                        "kmPerMonth": null
                    };
                    _.assign(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0], calculateFieldsForRoute);
                }


                // Calculation for Km per month
                if(_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routesKms && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) {
                    loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth = loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routesKms * loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips;
                }

                // Calculation for monthly working hours
                if (loanProcess.loanAccount.vehicleLoanDetails.segment.toUpperCase() == "CONSTRUCTION EQUIPMENT" && loanProcess.loanAccount.vehicleLoanDetails.dailyWorkingHours && loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingDays) {
                    loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingHours = parseFloat(loanProcess.loanAccount.vehicleLoanDetails.dailyWorkingHours)* parseFloat(loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingDays);
                }


                // Calculation for Validation
                if ( loanProcess.loanAccount.vehicleLoanDetails.segment.toUpperCase() == "GOODS") {
                    if (loanProcess.loanAccount.vehicleLoanDetails.ratePerTrip && _.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) {
                        if (loanProcess.loanAccount.vehicleLoanDetails.ratePerTrip * parseFloat(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) > loanProcess.loanAccount.vehicleLoanDetails.payload) {
                            loanProcess.loanAccount.vehicleLoanDetails.validation = "ERROR";
                        } else {
                            loanProcess.loanAccount.vehicleLoanDetails.validation = "OK";
                        }    
                    } else {
                        console.log("Fields required for validation are empty");
                        return Observable.of(loanProcess);
                    }                       
                }


                // Calculation for totalMonthlyExpense
                 if (_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses)) {
                     var sum = 0;   
                     for (var i=0; i<loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses.length; i++) {
                        var vehicleLoanExpense = loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[i];
                        sum = sum + vehicleLoanExpense.expenseAmount;
                     }
                     loanProcess.loanAccount.vehicleLoanDetails.totalMonthlyExpense = sum;
                 } else {
                        console.log("Fields required for Total Monthly Expenses are empty");
                        return Observable.of(loanProcess);                                                            
                 }


                 // Calculation for free cash flow
                 if (_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes) && loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0] && loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0].incomeAmount && loanProcess.loanAccount.vehicleLoanDetails.totalMonthlyExpense)
                    loanProcess.loanAccount.vehicleLoanDetails.freeCashFlow = Math.round((parseFloat(loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0].incomeAmount) - parseFloat(loanProcess.loanAccount.vehicleLoanDetails.totalMonthlyExpense))*100)/100;
                 else {
                    console.log("Fields required for Free Cash Flow are empty");
                    return Observable.of(loanProcess);
                 }


                 // Calculation for fcfToEmi
                 if (loanProcess.loanAccount.estimatedEmi)
                     loanProcess.loanAccount.vehicleLoanDetails.fcfToEmi = Math.round(parseFloat(loanProcess.loanAccount.vehicleLoanDetails.freeCashFlow) / parseFloat(loanProcess.loanAccount.estimatedEmi))*100/100;
                 else {
                    console.log("Fields required for fcfToEmi are  empty");
                    return Observable.of(loanProcess);                                                                                                     
                 }

        }
        return Observable.of(loanProcess);  
    };

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        let activeSession:ISession = ObjectFactory.getInstance("Session");
        let formHelper:IFormHelper = ObjectFactory.getInstance("FormHelper");
        try {
            this.queryRepo.getVehicleDetails().toPromise().then(function(res){
                console.log(res);
                DefaultCalculatedVehicleDetailsPolicy.prototype.defaultCalculatedVehicleDetails(loanProcess, res);
            });
        }
        catch(err) {
            console.log(err);
            return Observable.of(loanProcess);
        }

        return Observable.of(loanProcess);
    }
}
