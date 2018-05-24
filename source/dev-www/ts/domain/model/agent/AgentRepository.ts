import { IAgentRepository } from './IAgentRepository';

import { RxObservable as Ro} from '../../shared/RxObservable';


import AngularResourceService = require('../../../infra/api/AngularResourceService');
import {Observable} from "@reactivex/rxjs";

class AgentRepository implements IAgentRepository {

	private agentService: any;
	constructor() {
		this.agentService = AngularResourceService.getInstance().getNGService('Agent');
	}

	getAgent(id: number):Observable<any> {
		let observable = Ro.fromPromise(this.agentService.get({id: id}).$promise);
		return observable;
	}

	saveAgent(reqData: Object): Observable<any> {
		return Ro.fromPromise(this.agentService.submit(reqData).$promise);
	}

	updateAgent(reqData: Object): Observable<any> {
		return Ro.fromPromise(this.agentService.update(reqData).$promise);
	}

}

export = AgentRepository;
