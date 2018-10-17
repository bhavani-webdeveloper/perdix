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
import AngularResourceService = require("../../../../infra/api/AngularResourceService");
import * as _ from 'lodash';


declare var moment: Function;

export class EnrolmentDerivedPolicy extends IPolicy<EnrolmentProcess> {

    enrolmentRepo: IEnrolmentRepository;

    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(enrolmentProcess: EnrolmentProcess): Observable<EnrolmentProcess> {
        let activeSession:ISession = ObjectFactory.getInstance("Session");
        let Queries = AngularResourceService.getInstance().getNGService("Queries");
        let formHelperData:IFormHelper = ObjectFactory.getInstance("FormHelper");
        try {
            enrolmentProcess.customer.age = moment().diff(moment(enrolmentProcess.customer.dateOfBirth, 'YYYY-MM-DD'), 'years');
            if(enrolmentProcess.customer.customerType.toLowerCase() == 'enterprise') {
                let linkIds = [];
                if(_.hasIn(enrolmentProcess.customer, "enterpriseCustomerRelations") && _.isArray(enrolmentProcess.customer.enterpriseCustomerRelations) && enrolmentProcess.customer.enterpriseCustomerRelations.length  > 0) {
                    for(let enterpriseCustomer of enrolmentProcess.customer.enterpriseCustomerRelations) {
                        linkIds.push(enterpriseCustomer.linkedToCustomerId);
                    }

                    Queries.getCustomerBasicDetails({
                        "ids": linkIds
                    }).then(function(result) {
                        if(result && result.ids) {
                            for(let i=0;i<enrolmentProcess.customer.enterpriseCustomerRelations.length;i++) {
                                let cust = result.ids[enrolmentProcess.customer.enterpriseCustomerRelations[i].linkedToCustomerId];
                                if(cust) {
                                    enrolmentProcess.customer.enterpriseCustomerRelations[i].linkedToCustomerName = cust.first_name;
                                }
                            }
                        }
                    })
                }
                return Observable.of(enrolmentProcess);
            } else {
                return Observable.of(enrolmentProcess);
            }
           

            
        } catch(err) {
            console.error(err);
            return Observable.of(enrolmentProcess);
        }
    }

}
