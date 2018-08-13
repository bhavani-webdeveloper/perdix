import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {AgentProcess} from '../../../domain/model/agent/AgentProcess';
import * as _ from 'lodash';
export class AgentCompanyIdLOVConfiguration extends LOVElementConfiguration {
    outputMap: Object = {        
        "agentId": "agent.agentId",
        'agentName': "agent.agentName",
        'agentType': "agent.agentType"
    };
    
    search: Function = function(inputModel, form) {
        let SessionStore = AngularResourceService.getInstance().getNGService("SessionStore");
        let formHelper = AngularResourceService.getInstance().getNGService("formHelper");
        let Agent = AngularResourceService.getInstance().getNGService("Agent");
        let promise = Agent.search({
             'agentId': inputModel.agentId,
             'agentName': inputModel.agentName,
             'agentType': inputModel.agentType,
             'currentStage': "",
             'customerType': ""
        }).$promise;
        return promise;

    };
    getListDisplayItem: Function =  function(data, index) {
        return [
            data.agentId,
            data.agentType,
            data.agentName
        ];
    };
       onSelect: Function = function(valueObj, model, context) {
            model.agent.agentId = valueObj.id;     
            model.agent.agentCompanyId = valueObj.agentCompanyId;     
            model.agent.agentName = valueObj.agentName;     
            model.agent.agentRegistrationNumber = valueObj.agentRegistrationNumber;     
            model.agent.companyName = valueObj.companyName;     
    };   
     
    initialize: Function = function(model, form, parentModel, context) {    

    };
    inputMap: Object = {
        "agentId": {
            "key": "agent.agentId", 
            "type": "number"
        },
        // "agentName": {
        //     "key": "agent.agentName", 
        //     "type": "string"
        // },            
        "agentType": {
            "key": "agent.agentType",                    
            "type": "select",
            "enumCode" : "agent_type",
            "title": "AGENT_TYPE"
        },
    };

    lovonly: boolean = true;
    autolov: boolean = false;
}


