import {Observable} from "@reactivex/rxjs";
import {plainToClass} from "class-transformer";

import RepositoryFactory = require('../../shared/RepositoryFactory');
import {RepositoryIdentifiers} from '../../shared/RepositoryIdentifiers';
import {PolicyManager} from "../../shared/PolicyManager";
import {Utils} from "../../shared/Utils";

import {IPaymentRepository} from "./IPaymentRepository";
import {Payment} from "./Payment";
import {PaymentProcess} from "./PaymentProcess";

export class PaymentProcessFactory {
    static createFromPaymentID(id){
        let paymentRepo: IPaymentRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Payment);
        return paymentRepo.get(id)
            .map(
                (value: Object) => {
                    let obj: Object = Utils.toJSObj(value);
                    let pp: PaymentProcess = new PaymentProcess();
                    let pt: Payment = <Payment>plainToClass<Payment, Object>(Payment, obj);
                    pp.payment = pt;
                    return pp;
                }
            )
    }
}
