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
        if (_.hasIn(loanProcess.loanAccount, 'vehicleLoanDetails') && loanProcess.loanAccount.vehicleLoanDetails) {
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

                    var calculateFieldsForRoute = {
                        "kmPerMonth": null
                    };
                    _.assign(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0], calculateFieldsForRoute);

                    // Calculation for Km per month
                    if(_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routesKms && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) {
                        loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth = loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routesKms * loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips;
                    } else {
                        console.log("Route Kms/Trips are empty");
                        return Observable.of(loanProcess);
                    }

                    // vehicle Expense Details
                    if (loanProcess.loanAccount && loanProcess.loanAccount.vehicleLoanDetails && loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses && _.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses)) {
                            loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses = [];
                            loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses.push(
                                {
                                    'expenseType': "Fuel Cost per month",
                                    'expenseAmount': null
                                },
                                {
                                    'expenseType': "Tyre Cost per month",
                                    'expenseAmount': null
                                },
                                {
                                    'expenseType': "Lubricant Cost",
                                    'expenseAmount': null
                                },
                                {
                                    'expenseType': "Driver\'s Salary",
                                    'expenseAmount': d.driver_salary
                                },
                                {
                                    'expenseType': "Cleaner\'s Salary",
                                    'expenseAmount': d.cleaner_salary
                                },
                                {
                                    'expenseType': "Permit Cost",
                                    'expenseAmount': d.permit_cost
                                },
                                {
                                    'expenseType': "Taxes",
                                    'expenseAmount': d.taxes
                                },
                                {
                                    'expenseType': "Maintenance",
                                    'expenseAmount': d.maintenance
                                },
                                {
                                    'expenseType': "Insurance",
                                    'expenseAmount': d.insurance
                                },
                                {
                                    'expenseType': "Miscellaneous",
                                    'expenseAmount': d.miscellaneous_expense
                                }
                            );      
                        }


                    // Calculation for Fuel_Cost_per_month
                    if (d.calculation_method && d.calculation_method == "DISTANCE") {
                        if (d.fuel_cost && loanProcess.loanAccount.vehicleLoanDetails.mileage && _.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth)
                            loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[0].expenseAmount = parseFloat(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth) * parseFloat(d.fuel_cost) / parseFloat(loanProcess.loanAccount.vehicleLoanDetails.mileage);
                        else {
                            console.log("Fields required for Fuel_Cost_per_month are empty");
                            Observable.of(loanProcess);
                        }                               
                    } else if (d.calculation_method == "TIME") {
                        if (loanProcess.loanAccount.vehicleLoanDetails.fuelConsumptionPerHour && loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingDays && d.fuel_cost && _.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth)
                            loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[0].expenseAmount = parseFloat(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth) * parseFloat(loanProcess.loanAccount.vehicleLoanDetails.fuelConsumptionPerHour) * parseFloat(loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingDays) * parseFloat(d.fuel_cost);
                        else {
                            console.log("Fields required for Fuel_Cost_per_month are empty");
                            Observable.of(loanProcess);
                        }
                    }


                    // Calculation for Tyre_Cost_per_month
                    if(d.calculation_method && d.calculation_method == "DISTANCE") {
                        if (_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth && loanProcess.loanAccount.vehicleLoanDetails.noOfTyres && loanProcess.loanAccount.vehicleLoanDetails.costOfTyre && loanProcess.loanAccount.vehicleLoanDetails.lifeOfTyre)
                            loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[1].expenseAmount = parseFloat(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth * loanProcess.loanAccount.vehicleLoanDetails.noOfTyres * loanProcess.loanAccount.vehicleLoanDetails.costOfTyre)/parseFloat(loanProcess.loanAccount.vehicleLoanDetails.lifeOfTyre);
                        else{
                             console.log("Fields required for Tyre_Cost_per_month are empty");
                             Observable.of(loanProcess);   
                        }
                    } else {
                            loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[1].expenseAmount = 0;
                    }


                    // Calculation for lubricant
                    if(_.isArray(loanProcess.vehicleDetails) && d.calculation_method && d.calculation_method == "TIME") {
                        loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[2].expenseAmount = parseFloat(loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[0].expenseAmount * 0.1);
                    } else {
                        loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[2].expenseAmount = 0;
                    }


                    // Calculation for monthly working hours
                    if (d.calculation_method == 'TIME' && loanProcess.loanAccount.vehicleLoanDetails.dailyWorkingHours && loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingDays) {
                        loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingHours = parseFloat(loanProcess.loanAccount.vehicleLoanDetails.dailyWorkingHours * loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingDays);
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


                    // Vehicle Income Details
                     if (d.calculation_method == 'DISTANCE') {
                        let incomeAmount = loanProcess.loanAccount.vehicleLoanDetails.ratePerTrip * loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips;
                        if (loanProcess.loanAccount && loanProcess.loanAccount.vehicleLoanDetails && loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes && _.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes)) {
                            loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes = [];   
                            loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes.push({
                                'incomeType': 'Total Monthly Revenue',
                                'incomeAmount': incomeAmount
                            });
                        };
                     } else if (d.calculation_method == 'TIME'){
                        let incomeAmount = loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingHours * loanProcess.loanAccount.vehicleLoanDetails.hourlyRate;
                        if (loanProcess.loanAccount && loanProcess.loanAccount.vehicleLoanDetails && loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes && _.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes)) {
                            loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes = [];   
                            loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes.push({
                                'incomeType': 'Total Monthly Revenue',
                                'incomeAmount': incomeAmount
                            });
                        };
                     }


                     // Calculation for totalMonthlyExpense
                     if (_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses)) {
                         let sum = 0;   
                         for (i=0; i<loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses.length; i++) {
                            let vehicleLoanExpense = loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[i];
                            sum = sum + vehicleLoanExpense.expenseAmount;
                         }
                         loanProcess.loanAccount.vehicleLoanDetails.totalMonthlyExpense = parseFloat(sum);
                     } else {
                            console.log("Fields required for Total Monthly Expenses are empty");
                            return Observable.of(loanProcess);                                                            
                     }

                     // Calculation for free cash flow
                     if (_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes) && loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0].incomeAmount && loanProcess.loanAccount.vehicleLoanDetails.totalMonthlyExpense)
                        loanProcess.loanAccount.vehicleLoanDetails.freeCashFlow = parseFloat(loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0].incomeAmount - loanProcess.loanAccount.vehicleLoanDetails.totalMonthlyExpense);
                     else {
                        console.log("Fields required for Free Cash Flow are empty");
                        return Observable.of(loanProcess);
                     }

                     // Calculation for fcfToEmi
                     if (loanProcess.loanAccount.vehicleLoanDetails.freeCashFlow && loanProcess.loanAccount.estimatedEmi)
                         loanProcess.loanAccount.vehicleLoanDetails.fcfToEmi = parseFloat(loanProcess.loanAccount.vehicleLoanDetails.freeCashFlow / parseFloat(loanProcess.loanAccount.estimatedEmi));
                     else {
                        console.log("Fields required for fcfToEmi are  empty");
                        return Observable.of(loanProcess);                                                                                                     
                     }
                }
                break;
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
            return Observable.of(loanprocess);
        }

        return Observable.of(loanProcess);
    }
}
