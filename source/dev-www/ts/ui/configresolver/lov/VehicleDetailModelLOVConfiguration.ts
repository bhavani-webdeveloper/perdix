import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");

import * as _ from 'lodash';
export class VehicleDetailModelLOVConfiguration extends LOVElementConfiguration {
    outputMap: Object = {
    };


    search: Function = function(inputModel, form, model, context) {

        let $q = AngularResourceService.getInstance().getNGService("$q");
        let SessionStore = AngularResourceService.getInstance().getNGService("SessionStore");
        let formHelper = AngularResourceService.getInstance().getNGService("formHelper");
        let Enrollment = AngularResourceService.getInstance().getNGService("Enrollment");

        let $filter = AngularResourceService.getInstance().getNGService("$filter");
        
        var vehicleDetails = model.vehicleDetails;
        var out = [];
        var res = $filter('filter')(vehicleDetails, {
            'segment': inputModel.segment1,
            'category': inputModel.vehicle_category1,
            'manufacturer': inputModel.vehicle_make1
        }, false);
        out = _.uniqBy(res, 'model');
        return $q.resolve({
            headers: {
                "x-total-count": out.length
            },
            body: out
        });
    };

    getListDisplayItem: Function =  function(item, index) {
        return [
            item.model,
            item.segment + ' , ' + item.category,
            item.manufacturer, 
        ];
    };

    onSelect: Function = function(valueObj, model, context){
        model.loanAccount.vehicleLoanDetails.segment = valueObj.segment;
        model.loanAccount.vehicleLoanDetails.category = valueObj.category;
        model.loanAccount.vehicleLoanDetails.make = valueObj.manufacturer;
        model.loanAccount.vehicleLoanDetails.vehicleModel = valueObj.model;
    };

    // initialize: Function = function(model, form, parentModel, context) {
    
    // };


    inputMap: Object = {
        "vehicle_segment1": {
            "key": "loanAccount.vehicleLoanDetails.segment1",
            "type": "select",
            "enumCode": "vehicle_segment",
            "title": "SEGMENT",
            onChange: function(modelValue, form, model) {
                model.loanAccount.vehicleLoanDetails.category = null;
                model.loanAccount.vehicleLoanDetails.make = null;
                model.loanAccount.vehicleLoanDetails.make1 = null;
                model.loanAccount.vehicleLoanDetails.vehicleModel = null;
                model.loanAccount.vehicleLoanDetails.yearOfManufacture = null;
                model.loanAccount.vehicleLoanDetails.assetDetails = null;
                model.loanAccount.vehicleLoanDetails.assetSubDetails = null;
                model.loanAccount.vehicleLoanDetails.price = null;
                model.loanAccount.vehicleLoanDetails.registrationNumber = null;
                model.loanAccount.vehicleLoanDetails.permitType = null;
                model.loanAccount.vehicleLoanDetails.insuredDeclaredValue = null;
                model.loanAccount.vehicleLoanDetails.viabilityCategory = null;
                model.loanAccount.vehicleLoanDetails.grossVehicleWeight = null;
                model.loanAccount.vehicleLoanDetails.payLoad = null;
                model.loanAccount.vehicleLoanDetails.typeofLoad = null;
                model.loanAccount.vehicleLoanDetails.ratePerTrip = null;
                model.loanAccount.vehicleLoanDetails.mileage = null;
                model.loanAccount.vehicleLoanDetails.fuelConsumptionPerHour = null;
                model.loanAccount.vehicleLoanDetails.noOfTyres = null;
                model.loanAccount.vehicleLoanDetails.costOfTyre = null;
                model.loanAccount.vehicleLoanDetails.lifeOfTyre = null;
                model.loanAccount.vehicleLoanDetails.fuelConsumptionPerHour = null;
                model.loanAccount.vehicleLoanDetails.validation = null;
                model.loanAccount.vehicleLoanDetails.totalMonthlyExpense = null;
                model.loanAccount.vehicleLoanDetails.freeCashFlow = null;
                model.loanAccount.vehicleLoanDetails.fcfToEmi = null;
                model.loanAccount.vehicleLoanDetails.dailyWorkingHours = null;
                model.loanAccount.vehicleLoanDetails.monthlyWorkingDays = null;
                model.loanAccount.vehicleLoanDetails.hourlyRate = null;
                model.loanAccount.vehicleLoanDetails.monthlyWorkingHours = null;

                model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routeTo = null;
                model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routeVia = null;
                model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routesKms = null;
                model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips = null;
                model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth = null;

                if (_.isArray(model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses)) {
                    for (var i=0;i<model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses.length;i++) {
                        var vehicleLoanExpense = model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[i];
                        vehicleLoanExpense.expenseAmount = 0;
                    }
                }

                if (_.isArray(model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes)) {
                   for (var i=0;i<model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes.length;i++) {
                        var vehicleLoanIncome = model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[i];
                        vehicleLoanIncome.incomeAmount = 0;
                    } 
                }
                                
            },
        },
        "vehicle_category1": {
            "key": "loanAccount.vehicleLoanDetails.category1",
            "title": "CATEGORY",
            "type": "text"
        },
        "vehicle_make1": {
            "key": "loanAccount.vehicleLoanDetails.make1",
            "type": "text",
            "enumCode": "vehicle_make",
            "title": "MAKE",
        }
    };

    lovonly: boolean = true;
    autolov: boolean = false;
}