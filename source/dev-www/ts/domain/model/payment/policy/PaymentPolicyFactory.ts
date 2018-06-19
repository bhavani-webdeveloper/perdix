import {IPolicyFactory} from "../../../shared/IPolicyFactory";
import {IPolicy} from "../../../shared/IPolicy";

export class PaymentPolicyFactory implements IPolicyFactory {
	static _instance:PaymentPolicyFactory = null;

	public static getInstance():PaymentPolicyFactory {
		if(PaymentPolicyFactory._instance == null) {
			PaymentPolicyFactory._instance = new PaymentPolicyFactory();
		}
		return PaymentPolicyFactory._instance;
	}

	fromPolicyName(name: string):IPolicy<Object>{
	 	switch (name) {	 		
	 		default:
	 			return null;
	 	}
 	}
}