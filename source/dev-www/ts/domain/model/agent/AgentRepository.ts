import { IAgentRepository } from './IAgentRepository';
import {AgentProcess} from "./AgentProcess";
import {EnrolmentProcess} from "../customer/EnrolmentProcess";

import { RxObservable as Ro} from '../../shared/RxObservable';
import Agent = require("./Agent");
import {plainToClass} from "class-transformer";
import * as _ from 'lodash';
import {Customer} from "../customer/Customer";

import AngularResourceService = require('../../../infra/api/AngularResourceService');
import {Observable} from "@reactivex/rxjs";

class AgentRepository implements IAgentRepository {

	private agentService: any;
	
	constructor() {
		this.agentService = AngularResourceService.getInstance().getNGService('Agent');
	}

	// create(agentProcess: any): Observable<any> {
	// 	return Ro.fromPromise(this.agentService.create(agentProcess).$promise)
 //            .map( (obj:any) => {
 //                let agent :Agent = <Agent> plainToClass<Agent, Object>(Agent, obj.agent);
 //                _.merge(agentProcess.agent, agent);
 //                return agentProcess;
 //            })
	// }

	get(id: number):Observable<any> {
		let observable = Ro.fromPromise(this.agentService.get({id: id}).$promise);
		return observable;
	}

	save(reqData: Object): Observable<any> {
		return Ro.fromPromise(this.agentService.submit(reqData).$promise);
	}

	update(reqData: Object): Observable<any> {
		return Ro.fromPromise(this.agentService.update(reqData).$promise);
	}	

	// getCustomerById(id: any): Observable<AgentProcess> {
 //        let customerPromise = this.agentService.getCustomerById({id: id}).$promise;
 //        return Observable.fromPromise(customerPromise);
 //    }

 //    updateEnrollment(enrolmentProcess: AgentProcess): Observable<AgentProcess> {
 //        let promise = this.agentService.updateEnrollment(AgentProcess).$promise;
 //        return Observable.fromPromise(promise)
 //            .map((obj: any) => {
 //                let customer: Customer = <Customer>plainToClass<Customer, Object>(Customer, obj.customer);
 //                _.merge(enrolmentProcess.customer, customer);
 //                return enrolmentProcess;
 //            });
 //    }

}

export = AgentRepository;
