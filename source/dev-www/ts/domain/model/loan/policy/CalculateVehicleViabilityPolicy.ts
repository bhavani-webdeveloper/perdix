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
 
export class CalculateVehicleViabilityPolicy extends IPolicy<LoanProcess> {

    enrolmentRepo: IEnrolmentRepository;
    queryRepo:IQueryRepository;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
        this.queryRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Queries);
    }

    setArguments(args) {
    }

    CalculatedVehicleDetails (loanProcess, res) {
        let data = res.results;
        if (loanProcess.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1.toUpperCase() == 'NO') {
                if (_.hasIn(loanProcess.loanAccount, 'vehicleLoanDetails')) {
                for (let d of data) {
                    if (loanProcess.loanAccount.vehicleLoanDetails.vehicleModel == d.model) {
                        
                        // Adding dummy fields for showing calculation
                        let calculateFields = {
                            "validation": null,
                            "totalMonthlyExpense": null,
                            "freeCashFlow": null,
                            "fcfToEmi": null,
                            "emi": null,                                                        
                            "monthlyWorkingHours" : null
                        };
                        _.assign(loanProcess.loanAccount.vehicleLoanDetails, calculateFields);


                        if (_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0]) {
                            var calculateFieldsForRoute = {
                                "kmPerMonth": null
                            };
                            _.assign(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0], calculateFieldsForRoute);
                        }

                        loanProcess.loanAccount.vehicleLoanDetails.vehicleModel = d.model;
                        loanProcess.loanAccount.vehicleLoanDetails.viabilityCategory = d.viability_category;
                        loanProcess.loanAccount.vehicleLoanDetails.grossVehicleWeight = d.gvw;
                        loanProcess.loanAccount.vehicleLoanDetails.payLoad = d.payload;
                        loanProcess.loanAccount.vehicleLoanDetails.typeofLoad = d.type_of_load;
                        loanProcess.loanAccount.vehicleLoanDetails.ratePerTrip = d.rate_per_trip;
                        loanProcess.loanAccount.vehicleLoanDetails.mileage = d.mileage;
                        loanProcess.loanAccount.vehicleLoanDetails.fuelConsumptionPerHour = d.fuel_consumption;
                        loanProcess.loanAccount.vehicleLoanDetails.noOfTyres = d.no_of_tyres;
                        loanProcess.loanAccount.vehicleLoanDetails.costOfTyre = d.cost_of_tyre;
                        loanProcess.loanAccount.vehicleLoanDetails.lifeOfTyre = d.life_of_tyre;

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
                                    'expenseType': "Driver\'s Salary",
                                    'expenseAmount': d.driver_salary
                                },
                                {
                                    'expenseType': "Cleaner\'s Salary",
                                    'expenseAmount': d.cleaner_salary
                                },
                                {
                                    'expenseType': "PTMI",
                                    'expenseAmount': d.ptmi
                                }
                            );      
                        }

                         // Calculation for Monthly Working Hours
                         if (d.calculation_method == 'TIME'){
                            if(loanProcess.loanAccount.vehicleLoanDetails.dailyWorkingHours && loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingDays) {
                                loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingHours = parseFloat(loanProcess.loanAccount.vehicleLoanDetails.dailyWorkingHours) * parseFloat(loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingDays);
                            }
                        }

                        // Calculation for Km per month
                        if (d.calculation_method == "DISTANCE") {
                            if(_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0] && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routesKms && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) {
                                loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth = loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routesKms * loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips;
                            }    
                        }

                         // Calculation for Fuel_Cost_per_month
                         if (d.calculation_method == "DISTANCE") {
                                let incomeAmount =  loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].ratePerTrip *  loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips;

                                loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[0].expenseAmount = parseFloat(incomeAmount) * parseFloat( parseFloat(d.fuel_cost_pm);                                

                        } else if (d.calculation_method == "TIME") {

                                let incomeAmount =  loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingHours *  loanProcess.loanAccount.vehicleLoanDetails.hourlyRate;
                            
                                loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[0].expenseAmount = parseFloat(incomeAmount) * parseFloat( parseFloat(d.fuel_cost_pm);
                            
                        }

                        // Calculation for Tyre_Cost_per_month
                        if(d.calculation_method && d.calculation_method == "DISTANCE") {

                             let incomeAmount =  loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].ratePerTrip *  loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips;

                            loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[1].expenseAmount = parseFloat(incomeAmount) * parseFloat( parseFloat(d.tyre_cost_pm);       
                                
                        } else {
                                let incomeAmount =  loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingHours *  loanProcess.loanAccount.vehicleLoanDetails.hourlyRate;

                                loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[1].expenseAmount = parseFloat(incomeAmount) * parseFloat( parseFloat(d.tyre_cost_pm);
                        }
                       

                        // Vehicle Income Details
                         if (d.calculation_method == 'DISTANCE') {
                            let incomeAmount =  loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].ratePerTrip *  loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips;
                            if ( loanProcess.loanAccount &&  loanProcess.loanAccount.vehicleLoanDetails &&  loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes && _.isArray( loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes)) {
                                loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes = [];   
                                loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes.push({
                                    'incomeType': 'Monthly Revenue',
                                    'incomeAmount': incomeAmount
                                });
                            };
                         } else if (d.calculation_method == 'TIME'){
                            let incomeAmount =  loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingHours *  loanProcess.loanAccount.vehicleLoanDetails.hourlyRate;
                            if ( loanProcess.loanAccount &&  loanProcess.loanAccount.vehicleLoanDetails &&  loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes && _.isArray( loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes)) {
                                loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes = [];   
                                loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes.push({
                                    'incomeType': 'Monthly Revenue',
                                    'incomeAmount': incomeAmount
                                });
                            };
                         }



                         // Calculation for validation
                         if (d.calculation_method == "DISTANCE") {
                            if ( loanProcess.loanAccount.vehicleLoanDetails.ratePerTrip && _.isArray( loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails) &&  loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0] &&  loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) {
                                if (parseFloat( loanProcess.loanAccount.vehicleLoanDetails.ratePerTrip) * parseFloat( loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) > parseFloat( loanProcess.loanAccount.vehicleLoanDetails.payLoad)*parseFloat( loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth)*2.4) {
                                    loanProcess.loanAccount.vehicleLoanDetails.validation = "ERROR";
                                } else {
                                    loanProcess.loanAccount.vehicleLoanDetails.validation = "OK";
                                }    
                            }     
                         }

                        // calculation for totalMonthlyExpense
                        if (_.isArray( loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses)) {
                            var sum = 0;   

                            for (i=0; i< loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses.length; i++) {
                                var vehicleLoanExpense =  loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[i];
                                sum = sum + vehicleLoanExpense.expenseAmount;
                            }

                            loanProcess.loanAccount.vehicleLoanDetails.totalMonthlyExpense = Math.round((parseFloat(sum))*100)/100;
                        }


                        // Calculation for free cash flow
                        if (_.isArray( loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes) &&  loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0] &&  loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0].incomeAmount &&  loanProcess.loanAccount.vehicleLoanDetails.totalMonthlyExpense)
                        loanProcess.loanAccount.vehicleLoanDetails.freeCashFlow = Math.round((parseFloat( loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0].incomeAmount) - parseFloat( loanProcess.loanAccount.vehicleLoanDetails.totalMonthlyExpense))*100)/100;


                        // Calculation for fcfToEmi
                        if ( loanProcess.loanAccount.vehicleLoanDetails.freeCashFlow &&  loanProcess.loanAccount.estimatedEmi)
                        loanProcess.loanAccount.vehicleLoanDetails.fcfToEmi = Math.round((parseFloat( loanProcess.loanAccount.vehicleLoanDetails.freeCashFlow) / parseFloat( loanProcess.loanAccount.estimatedEmi))*100)/100;
                                   
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

              //Adding dummy field kmPerMonth for showing calculated value
              if (_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0]) {
                var calculateFieldsForRoute = {
                    "kmPerMonth": null
                };
                _.assign(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0], calculateFieldsForRoute);
            }


            // Calculation for KmPerMonth
            if(_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routesKms && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) {
                loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth = loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routesKms * loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips;
            }


            // Calculation for Monthly Working Hours
            if (loanProcess.loanAccount.vehicleLoanDetails.segment.toUpperCase() == "CONSTRUCTION EQUIPMENT"){
                if(loanProcess.loanAccount.vehicleLoanDetails.dailyWorkingHours && loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingDays) {
                    loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingHours = parseFloat(loanProcess.loanAccount.vehicleLoanDetails.dailyWorkingHours * loanProcess.loanAccount.vehicleLoanDetails.monthlyWorkingDays);
                }
            }


             // Calculation for validation
             if (loanProcess.loanAccount.vehicleLoanDetails.segment.toUpperCase() == "GOODS") {
                if (loanProcess.loanAccount.vehicleLoanDetails.ratePerTrip && _.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) {
                    if (parseFloat(loanProcess.loanAccount.vehicleLoanDetails.ratePerTrip) * parseFloat(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) > parseFloat(loanProcess.loanAccount.vehicleLoanDetails.payLoad)*parseFloat(loanProcess.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth)*2.4 ) {
                        loanProcess.loanAccount.vehicleLoanDetails.validation = "ERROR";
                    } else {
                        loanProcess.loanAccount.vehicleLoanDetails.validation = "OK";
                    }    
                }   
             }


             // calculation for totalMonthlyExpense
             if (_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses)) {
                 var sum = 0;   
                 for (var i=0; i < loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses.length; i++) {
                    var vehicleLoanExpense = loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[i];
                    sum = sum + vehicleLoanExpense.expenseAmount;
                 }
                 loanProcess.loanAccount.vehicleLoanDetails.totalMonthlyExpense = Math.round((parseFloat(sum))*100)/100;
             }


             // Calculation for free cash flow
             if (_.isArray(loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes) && loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0] && loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0].incomeAmount && loanProcess.loanAccount.vehicleLoanDetails.totalMonthlyExpense)
             loanProcess.loanAccount.vehicleLoanDetails.freeCashFlow = Math.round((parseFloat(loanProcess.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0].incomeAmount) - parseFloat(loanProcess.loanAccount.vehicleLoanDetails.totalMonthlyExpense))*100)/100;


             // Calculation for fcfToEmi
             if (loanProcess.loanAccount.vehicleLoanDetails.freeCashFlow && loanProcess.loanAccount.estimatedEmi)
             loanProcess.loanAccount.vehicleLoanDetails.fcfToEmi = Math.round((parseFloat(loanProcess.loanAccount.vehicleLoanDetails.freeCashFlow) / parseFloat(loanProcess.loanAccount.estimatedEmi))*100)/100;

        }
        return Observable.of(loanProcess);  
    };

    run(loanProcess: LoanProcess): Observable<LoanProcess> {
        let activeSession:ISession = ObjectFactory.getInstance("Session");
        let formHelper:IFormHelper = ObjectFactory.getInstance("FormHelper");
        try {
            this.queryRepo.getVehicleDetails().toPromise().then(function(res){
                console.log(res);
                CalculateVehicleViabilityPolicy.prototype.CalculatedVehicleDetails(loanProcess, res);
            });
        }
        catch(err) {
            console.log(err);
            return Observable.of(loanProcess);
        }

        return Observable.of(loanProcess);
    }
}
