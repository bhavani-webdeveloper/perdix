
import {Observable} from "@reactivex/rxjs";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {RxObservable} from "../../shared/RxObservable";
import {plainToClass} from "class-transformer";

import {IInsuranceRepository} from "./IInsuranceRepository";
import {InsuranceProcess} from "./InsuranceProcess";
import {InsurancePolicyDetails} from "./InsurancePolicyDetails";


export class InsuranceRepository implements IInsuranceRepository {
	insuranceService: any;
	constructor() {
		this.insuranceService = AngularResourceService.getInstance().getNGService('Insurance');
	}

	getById(id: any): Observable<InsuranceProcess> {
		let insurancePromise = this.insuranceService.getById({id: id}).$promise;
        return Observable.fromPromise(insurancePromise);

	}

	getPremiumAmount(insuranceProcess:InsuranceProcess): Observable<InsuranceProcess> {
		let promise = this.insuranceService.getPremiumAmount({premiumRateCode:insuranceProcess.insurancePolicyDetailsDTO.premiumRateCode,
			
			sumInsured:insuranceProcess.insurancePolicyDetailsDTO.sumInsured,
			}).$promise;
        return Observable.fromPromise(promise)
            .map((obj: any) => {
            	if(obj && obj.length > 0)
            		var a = obj[0].totalPremium;
                    insuranceProcess.insurancePolicyDetailsDTO.insuranceTransactionDetailsDTO = [];
                    insuranceProcess.insurancePolicyDetailsDTO.insuranceTransactionDetailsDTO.push({totalPremium: a});
                return insuranceProcess;
            });
	}

	getInsuranceRecommendation(insuranceProcess:InsuranceProcess): Observable<InsuranceProcess> {
		let promise = this.insuranceService.getInsuranceRecommendation({id:insuranceProcess.insurancePolicyDetailsDTO.customerId,
			familyEnrollmentId:insuranceProcess.insurancePolicyDetailsDTO.benificieryFamilyMemberId,
			InsuranceType:insuranceProcess.insurancePolicyDetailsDTO.insuranceType,
			moduleConfigMasterId:insuranceProcess.insurancePolicyDetailsDTO.moduleConfigId}).$promise;
        return Observable.fromPromise(promise)
            .map((obj: any) => {
            	if(obj)
            		var a = obj.insuranceRecmdtnInPaisa/100;
                    insuranceProcess.insurancePolicyDetailsDTO.recommendationAmount = a;
                    insuranceProcess.insurancePolicyDetailsDTO.recommendationStatus = obj.trxnStatus;
                return insuranceProcess;
            });
	}

	create(insuranceProcess:InsuranceProcess): Observable<InsuranceProcess> {
		let promise = this.insuranceService.create(insuranceProcess).$promise;
        return Observable.fromPromise(promise)
            .map((obj: any) => {InsurancePolicyDetails
                let insurancePolicyDetailsDTO: InsurancePolicyDetails = <InsurancePolicyDetails>plainToClass<InsurancePolicyDetails, Object>(InsurancePolicyDetails, obj.insurancePolicyDetailsDTO);
                _.merge(insuranceProcess.insurancePolicyDetailsDTO, insurancePolicyDetailsDTO);
                return insuranceProcess;
            });
	}
	update(insuranceProcess:InsuranceProcess): Observable<InsuranceProcess> {
		let promise = this.insuranceService.update(insuranceProcess).$promise;
        return Observable.fromPromise(promise)
            .map((obj: any) => {InsurancePolicyDetails
                let insurancePolicyDetailsDTO: InsurancePolicyDetails = <InsurancePolicyDetails>plainToClass<InsurancePolicyDetails, Object>(InsurancePolicyDetails, obj.insurancePolicyDetailsDTO);
                _.merge(insuranceProcess.insurancePolicyDetailsDTO, insurancePolicyDetailsDTO);
                return insuranceProcess;
            });
	}
}