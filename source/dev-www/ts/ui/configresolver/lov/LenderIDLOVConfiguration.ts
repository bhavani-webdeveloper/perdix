import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {EnrolmentProcess} from '../../../domain/model/customer/EnrolmentProcess';
import * as _ from 'lodash';
export class LenderIDLOVConfiguration extends LOVElementConfiguration {
	inputMap: Object = {
		 "firstName": {
            "key": "customer.firstName",
            "title": "LENDER_NAME"
        }
	};
	outputMap: Object = {
		"lenderId": "customer.id"
	};
	onSelect: Function = function(result, model, context) {
		model.liabilityAccount.lenderId = result.id;
		NGHelper.refreshUI();
	};
	getListDisplayItem: Function = function(item, index) {
	 	return [
            [item.firstName, item.fatherFirstName].join(' '),
            item.id
        ];
	};
	search: Function = function(inputModel, form, model) {
		let SessionStore = AngularResourceService.getInstance().getNGService("SessionStore");
        let Enrollment = AngularResourceService.getInstance().getNGService("Enrollment");
        if (!inputModel.branchName)
            inputModel.branchName = SessionStore.getBranch();
       	let promise = Enrollment.lenderSearch({
            'branchName': inputModel.branchName,
            'firstName': inputModel.firstName,
            'customerType': 'lender',
            'stage': 'Completed'
        }).$promise;
        return promise;
	};
	autolov: boolean = true;
	lovonly: boolean = false;
}