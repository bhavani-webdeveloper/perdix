import {IPolicy} from "../../../shared/IPolicy";
import {Observable} from "@reactivex/rxjs";
import {IEnrolmentRepository} from "../../customer/IEnrolmentRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import {UserSession, ISession} from "../../../shared/Session";
import {FormHelper, IFormHelper} from "../../../shared/FormHelper";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import Customer = require("../Customer");
import FamilyMember = require("../FamilyMember");
import Expenditure = require("../Expenditure");
import {EnrolmentProcess} from "../EnrolmentProcess";
import * as _ from 'lodash';





export class PreSaveCustomerPolicy extends IPolicy<EnrolmentProcess> {

    enrolmentRepo: IEnrolmentRepository;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(enrolmentProcess: EnrolmentProcess): Observable<EnrolmentProcess> {
        let activeSession:ISession = ObjectFactory.getInstance("Session");
        let formHelperData:IFormHelper = ObjectFactory.getInstance("FormHelper");
        try {
            let observables = [];
            let fm = enrolmentProcess.customer.familyMembers;
            let incomes;
            for(var i=0;i<fm.length;i++){
                incomes = fm[i].incomes;
                if (incomes){
                    for(var j=0;j<incomes.length;j++){
                        switch(incomes[i].frequency){
                            case 'M':
                            case 'Monthly': incomes[i].monthsPerYear=12; break;
                            case 'D':
                            case 'Daily': incomes[i].monthsPerYear=365; break;
                            case 'W':
                            case 'Weekly': incomes[i].monthsPerYear=52; break;
                            case 'F':
                            case 'Fornightly': incomes[i].monthsPerYear=26; break;
                            case 'Fortnightly': incomes[i].monthsPerYear=26; break;
                        }
                    }
                }
            }

            if (_.hasIn(enrolmentProcess, 'customer.currentAssets') && _.isArray(enrolmentProcess.customer.currentAssets)){
                let current_asset_type=formHelperData.getByEnumCode('current_asset_type');
                let ca = enrolmentProcess.customer.currentAssets;
                var currentAsset = ca.map(function (ca, index, array) {
                    if(ca.assetType && !ca.assetCategory){
                        let c = current_asset_type.map(function (cas, index, array){
                            if(cas.name == ca.assetType){
                                ca.assetCategory = cas.parentCode;
                            }
                        }) 
                    }
                    return ca.assetCategory; 
                });
                      
            }

            return Observable.of(enrolmentProcess);
        } catch(err) {
            console.error(err);
            console.log("Error in PreSaveCustomerPolicy");
            return Observable.of(enrolmentProcess);
        }
    }

}
