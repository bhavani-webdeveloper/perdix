irf.pageCollection.factory("Pages__Demo",
["$log", "Enrollment", "SessionStore","Files",
    function($log, Enrollment, SessionStore,Files){

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "Demo Page",
            "subTitle": "Demo Page secondary title",
            initialize: function (model, form, formCtrl) {
                $log.info("Demo Customer Page got initialized");


            },
            form: [
                {
                    "type":"box",
                    "title":"Details",
                    "items":[
                        "address.streetAddress",
                        {
                            key:"address.city",
                            type:"select",
                            titleMap:{
                                "city_A":"City A",
                                "city_B":"City B"
                            }

                        },
                        "phoneNumber",
                        {
                            "key":"name",
                            "type":"radios",
                            "titleMap":{
                                "value1":"name1",
                                "value2":"name2"
                            },
                            "title":"Name"
                        }
                    ]
                }

            ],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "address": {
                        "type": "object",
                        "title":"Address",
                        "properties": {
                            "streetAddress": {
                                "type": "string",
                                "title":"Street Address"
                            },
                            "city": {
                                "type": "string",
                                "title":"City"
                            }
                        },
                        "required": [
                            "streetAddress",
                            "city"
                        ]
                    },
                    "phoneNumber": {
                        "type": "array",
                        "title":"Phone Numbers",
                        "items": {
                            "type": "object",
                            "title":"Phone#",
                            "properties": {
                                "location": {
                                    "type": "string",
                                    "title":"Location"
                                },
                                "code": {
                                    "type": "integer",
                                    "title":"Code"
                                },
                                "number":{
                                    "type":"integer",
                                    "title":"Number"
                                }
                            },
                            "required": [
                                "code",
                                "number"
                            ]
                        }
                    }
                },
                "required": [
                    "address",
                    "phoneNumber"
                ]
            },
            actions: {
                submit: function(model, form, formName){
                }
            }
        };
    }
]);
