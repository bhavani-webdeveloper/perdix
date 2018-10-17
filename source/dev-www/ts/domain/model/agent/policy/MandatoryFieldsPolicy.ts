import {IPolicy} from "../../../shared/IPolicy";
import {Observable} from "@reactivex/rxjs";
import {IEnrolmentRepository} from "../../customer/IEnrolmentRepository";
import RepositoryFactory = require("../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../shared/RepositoryIdentifiers";
import {UserSession, ISession} from "../../../shared/Session";
import {ObjectFactory} from "../../../shared/ObjectFactory";
import Customer = require("../../customer/Customer");
import {AgentProcess} from "../AgentProcess";
import * as _ from 'lodash';
import {EnrolmentProcess} from "../../customer/EnrolmentProcess";
import {LeadProcessFactory} from '../../lead/LeadProcessFactory';


/**
 * Created by shahalpk on 28/11/17.
 */

export class MandatoryFieldsPolicy extends IPolicy<AgentProcess> {

    enrolmentRepo: IEnrolmentRepository;


    constructor(){
        super();
        this.enrolmentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
    }

    setArguments(args) {
    }

    run(agentProcess: AgentProcess): Observable<AgentProcess> {
        // agentProcess.agent.nominees = [];
        return Observable.of(agentProcess);
    }

}
