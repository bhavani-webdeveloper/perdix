///<amd-dependency path="perdixConfig/paymentProcessConfig" name="paymentProcessConfig"/>

import {Observable} from "@reactivex/rxjs";
import {plainToClass} from "class-transformer";

import {RepositoryIdentifiers} from '../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../shared/RepositoryFactory');
import {PolicyManager} from "../../shared/PolicyManager";

import {Payment} from "./Payment";
import {IPaymentRepository} from "./IPaymentRepository";
import {PaymentPolicyFactory} from "./policy/PaymentPolicyFactory";

declare var paymentProcessConfig: Object;

export class PaymentProcess {
	paymentsAction: string;
	remarks: string;
	stage: string;
	payment: Payment;
	paymentRepo: IPaymentRepository;

	constructor() {
		this.paymentRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Payment);
	}

	get(id:number): Observable<PaymentProcess> {
		return this.paymentRepo.get(id).map(
			(value: any)=> {
				this.payment = value;
				return this;
			}
		);
	}

	save(): any {
        this.paymentsAction = 'SAVE'; 
        let pmBeforeUpdate:PolicyManager<PaymentProcess>  = new PolicyManager(this, PaymentPolicyFactory.getInstance(), 'beforeSave', PaymentProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.paymentRepo.update(this)
        let pmAfterUpdate:PolicyManager<PaymentProcess>  = new PolicyManager(this, PaymentPolicyFactory.getInstance(), 'afterSave', PaymentProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }

    proceed(): any {
        this.paymentsAction = 'PROCEED';
        let pmBeforeUpdate:PolicyManager<PaymentProcess>  = new PolicyManager(this, PaymentPolicyFactory.getInstance(), 'beforeProceed', PaymentProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.paymentRepo.update(this)
        let pmAfterUpdate:PolicyManager<PaymentProcess>  = new PolicyManager(this, PaymentPolicyFactory.getInstance(), 'afterProceed', PaymentProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }

    sendBack(stage: string): any {    	
        this.stage = stage;
        this.paymentsAction = "PROCEED";
        let pmBeforeUpdate: PolicyManager<PaymentProcess> = new PolicyManager(this, PaymentPolicyFactory.getInstance(), 'beforeSendBack', PaymentProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.paymentRepo.update(this);
        let pmAfterUpdate: PolicyManager<PaymentProcess> = new PolicyManager(this, PaymentPolicyFactory.getInstance(), 'afterSendBack', PaymentProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }

    reject(): any {
        this.stage = "PaymentRejected";
        this.paymentsAction = "PROCEED";
        let pmBeforeUpdate: PolicyManager<PaymentProcess> = new PolicyManager(this, PaymentPolicyFactory.getInstance(), 'beforeReject', PaymentProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.paymentRepo.update(this);
        let pmAfterUpdate: PolicyManager<PaymentProcess> = new PolicyManager(this, PaymentPolicyFactory.getInstance(), 'afterReject', PaymentProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }

    static create(): Observable<PaymentProcess> {
        let pp = new PaymentProcess();  
        pp.payment = new Payment();              
        pp.stage = 'PaymentInitiation';
        let pm: PolicyManager<PaymentProcess> = new PolicyManager<PaymentProcess>(pp, PaymentPolicyFactory.getInstance(), 'onNew', PaymentProcess.getProcessConfig());
        return pm.applyPolicies();
    }

    static getProcessConfig() {
    	return paymentProcessConfig;
    }
}