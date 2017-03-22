irf.pageCollection.factory('Pages_ManagementHelper', ["$state", "$q",function($state, $q){
    return {
        backToDashboard : function(){
            $state.go('Page.ManagementDashboard',{
                pageName:"ManagementDashboard",
                pageId:null,
                pageData:null
            });
        },
        getCentreSchemaPromise: function(){
            return $q.resolve({
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "required":["centre"],
                "properties": {
                    "centre":{
                        "type":"object",
                        "required": [
                            "version",
                            "centre_name",
                            "centre_code",
                            "centre_address",
                            "branch_id",
                            "status",
                            "language_code",
                            "centre_name_in_local"
                        ],
                        "properties":{
                            "version":{
                                "title":"VERSION",
                                "type":"number",
                                "default":0,
                                "minimum":0
                            },
                            "centre_name":{
                                "title":"CENTRE_NAME",
                                "type":"string",
                                "minLength":2
                            },
                            "centre_code":{
                                "title":"CENTER_CODE",
                                "type":"string",
                                "minLength":1
                            },
                            "centre_address":{
                                "title":"ADDRESS",
                                "type":"string"
                            },
                            "branch_id":{
                                "title":"BRANCH_ID",
                                "type":"number",
                                "minimum":0
                            },
                            "status":{
                                "title":"STATUS",
                                "type":"string",
                                "enum":["ACTIVE","INACTIVE"],
                                "default":"ACTIVE"
                            },
                            "employee":{
                                "title":"EMPLOYEE_CODE",
                                "type":"string"
                            },
                            "centre_leader_urn":{
                                "title":"CENTRE_LEADER_URN",
                                "type":"string"
                            },
                            "weekly_meeting_day":{
                                "type":"string",
                                "title":"WEEKLY_MEETING_DAY",
                                "enum":["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"]
                            },
                            "weekly_meeting_time":{
                                "title":"WEEKLY_MEETING_TIME",
                                "type":"string"
                            },
                            "monthly_meeting_date":{
                                "type":"string",
                                "title":"MONTHLY_MEETING_DATE"
                            },
                            "monthly_meeting_day":{
                                "type":"string",
                                "title":"MONTHLY_MEETING_DAY"
                            },
                            "monthly_meeting_time":{
                                "type":"string",
                                "title":"MONTHLY_MEETING_TIME"
                            },
                            "created_by":{
                                "type":"string",
                                "readonly":true
                            },
                            "field3":{
                                "title":"FIELD3",
                                "type":"string"
                            },
                            "field4":{
                                "title":"FIELD4",
                                "type":"string"
                            },
                            "field5":{
                                "title":"FIELD5",
                                "type":"string"
                            },
                            "language_code":{

                                "type":"string",
                                "minLength":2,
                                "maxLength":2,
                                "default": "hi",
                                "title": "LANGUAGE_CODE",
                                "enum":["hi","en"]
                            },
                            "centre_name_in_local":{
                                "type":"string",
                                "title":"CENTRE_NAME_IN_LOCAL"
                            }
                        }
                    }
                }
            });
        },
        getVillageSchemaPromise: function() {
            return $q.resolve({
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "required":["village"],
                "properties": {
                    "village": {
                        "required": [
                            "version",
                            "village_name",
                            "village_name_in_local",
                            "language_code",
                            "pincode",
                            "fregcode"
                        ],
                        "type": "object",
                        "properties": {
                            "version": {
                                "type": "number",
                                "title": "VERSION",
                                "default":0,
                                "minimum":0
                            },
                            "village_name": {
                                "type": "string",
                                "title": "VILLAGE_NAME"
                            },
                            "village_name_in_local": {
                                "type": "string",
                                "title": "VILLAGE_NAME_IN_LOCAL"
                            },
                            "language_code": {
                                "type": "string",
                                "default": "hi",
                                "title": "LANGUAGE_CODE",
                                "enum":["hi","en"]
                            },
                            "branch_id": {
                                "type": "number",
                                "enumCode":"branch",
                                "title": "BRANCH"
                            },
                            "pincode": {
                                "type": "number",
                                "title": "PIN_CODE",
                                "minimum": 100000,
                                "maximum": 999999
                            },
                            "fregcode": {
                                "type": "number",
                                "title": "FREGCODE"
                            },
                            "created_by": {
                                "type": "string",
                                "title": "CREATED_BY"
                            },
                            "field1": {
                                "type": "string",
                                "title": "FIELD1"
                            },
                            "field2": {
                                "type": "string",
                                "title": "FIELD2"
                            },
                            "field3": {
                                "type": "string",
                                "title": "FIELD3"
                            },
                            "field4": {
                                "type": "string",
                                "title": "FIELD4"
                            },
                            "field5": {
                                "type": "string",
                                "title": "FIELD5"
                            }
                        }
                    }
                }
            });
        }
    };
}]);
