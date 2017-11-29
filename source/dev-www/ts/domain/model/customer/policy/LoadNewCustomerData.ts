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





export class LoadNewCustomerData extends IPolicy<EnrolmentProcess> {

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
        return Observable.defer(
            () => {
                try {
                    let observables = [];
                    

                   
                    let fm: FamilyMember = new FamilyMember();
                    let exp = new Expenditure();
                    // let fm = new loanProcess.loanAccount.applicantCustomer.familyMembers();
                    fm.relationShip = 'self';
                    exp.expenditureSource = "Others";
                    exp.frequency = 'Monthly';
                    enrolmentProcess.customer.familyMembers.push(fm);
                    enrolmentProcess.customer.expenditures.push(exp)
                    
                    
                    

                    let branch1 = formHelperData.getBranchId();
                    let allowedBranch = [];
                    for (var i = 0; i < branch1.length; i++) {
                        if ((branch1[i].name) == activeSession.getBranch()) {
                            allowedBranch.push(branch1[i]);
                            break;
                        }
                    }

                    let allowedCentres = [];
                    let centres = activeSession.getCenters();
                    let centreName = [];
                    if(centres && centres.length)
                    {
                        for (var i = 0; i < centres.length; i++) {
                            centreName.push(centres[i].id);
                            allowedCentres.push(centres[i]);
                        }
                    }
                    enrolmentProcess.customer.centreId = centreName[0];
                    enrolmentProcess.customer.centreName = (allowedCentres && allowedCentres.length > 0) ? allowedCentres[0].centreName : "";
                    
                    enrolmentProcess.customer.customerBranchId = enrolmentProcess.customer.customerBranchId || allowedBranch[0].value;


                    enrolmentProcess.customer.date = enrolmentProcess.customer.date || Utils.getCurrentDate();
                    


                    enrolmentProcess.customer.nameOfRo = enrolmentProcess.customer.nameOfRo || activeSession.getLoginname();
                    enrolmentProcess.customer.customerType = 'Individual';
                    enrolmentProcess.customer.identityProof = enrolmentProcess.customer.identityProof || "Pan Card";
                    enrolmentProcess.customer.addressProof= enrolmentProcess.customer.addressProof || "Aadhar Card";
                    
                    // return Observable.merge(observables, 5)
                    //     .concatAll()
                    //     .last()
                    //     .map(
                    //         (value) => {
                    //             return enrolmentProcess;
                    //         }
                    //     );
                    return Observable.of(enrolmentProcess);
                } catch(err) {
                    console.error(err);
                    return Observable.of(enrolmentProcess);
                }
                
            }
        )
    }

}
