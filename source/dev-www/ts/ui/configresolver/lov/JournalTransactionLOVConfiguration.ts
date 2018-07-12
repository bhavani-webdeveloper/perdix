import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {EnrolmentProcess} from '../../../domain/model/customer/EnrolmentProcess';
import * as _ from 'lodash';
declare var angular: any;
export class JournalTransactionLOVConfiguration extends LOVElementConfiguration {
    outputMap: Object = {
        "id": "journal.journalEntryDto.journalMasterId",
        "transactionName": "journal.journalEntryDto.transactionName",
        "transactionType": "journal.journalEntryDto.transactionType",
        "productType": "journal.journalEntryDto.entryType",
        "transactionDescription": "journal.journalEntryDto.transactionDescription",
        "debitGLNo": "journal.journalEntryDto.debitGLNo",
        "creditGLNo": "journal.journalEntryDto.creditGLNo",
    };

    search: Function = function(inputModel, form, model) {
        let ret = [];
        let $q = AngularResourceService.getInstance().getNGService("$q");
        let defered = $q.defer();
        let Journal = AngularResourceService.getInstance().getNGService("Journal");
        Journal.journalSearch().$promise.then(function(response){
            let count=0;
            angular.forEach(response.body, function(value, key) {

                Journal.get({
                    id: value.id
                }, function(res) {

                    if (res.journalBranches && res.journalBranches) {
                        for (let k = 0; k < res.journalBranches.length; k++) {
                            if (_.hasIn(res.journalBranches[k], 'branchId') && res.journalBranches[k].branchId == model.journal.journalEntryDto.branchId) {
                                ret.push(value);
                            }
                        }
                    }
                    count++;
                    if(count==response.body.length)
                    {
                        defered.resolve({
                            headers: {
                                "x-total-count": ret.length
                            },
                            body: ret
                        });
                    }
                });
            });
        });
        return defered.promise;
    };
    getListDisplayItem: Function =  function(data, index) {
        return [
            data.id,
            data.transactionName,
            data.transactionDescription
        ];
    };

    onSelect: Function = function(valueObj, model, context){


    };

    initialize: Function = function(model, form, parentModel, context) {


    };

    inputMap: Object = {
        "transactionName": {
            "key": "journal.journalEntryDto.transactionName",
            "title": "TRANSACTION_NAME",
            "type": "string"
        },
        "transactionDescription": {
            "key": "journal.journalEntryDto.transactionDescription",
            "title": "TRANSACTION_DESCRIPTION",
            "type": "string"
        },
        "debitGLNo": {
            "key": "journal.journalEntryDto.debitGLNo",
            "title": "DEBIT_GL_NO",
            "type": "string",
        },
        "creditGLNo": {
            "key": "journal.journalEntryDto.creditGLNo",
            "title": "CREDIT_GL_NO",
            "type": "string",
        }


    };

    lovonly: boolean = true;
    autolov: boolean = false;
}


