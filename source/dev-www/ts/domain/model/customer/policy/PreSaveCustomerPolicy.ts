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
import Utils = require("../../../shared/Utils");





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

            return Observable.of(enrolmentProcess);
        } catch(err) {
            console.error(err);
            return Observable.of(enrolmentProcess);
        }
    }

}
