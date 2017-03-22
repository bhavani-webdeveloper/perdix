irf.pageCollection.factory(irf.page("demo.Demo"),
["$log", "Enrollment", "SessionStore","Files",
    function($log, Enrollment, SessionStore,Files){

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "Demo Page",
            "subTitle": "Demo Page secondary title",
            initialize: function (model, form, formCtrl) {
                $log.info("Demo Customer Page got initialized");

                model.address = model.address || {};
                model.address.streetAddress = "Stt";

                Files.getBase64DataFromFileId(
                    '482acbaf-0090-4168-adca-76aaba818d5a',
                    true
                ).then(function(base64String){
                    console.log(base64String);
                },function(err){

                });
            },
            form: [
                {
                    "type":"box",
                    "title":"Details",
                   // colClass: "col-sm-12",
                    "items":[
                        {
                            key: "address.streetAddress",
                            type: "date"
                        },
                        {
                            key:"address.city",
                            type:"select",
                            titleMap:{
                                "city_A":"City A",
                                "city_B":"City B"
                            }
                        },
                        {
                            key: "phoneNumber",
                            type: "table",
                            items: [
                                "phoneNumber[].location",
                                "phoneNumber[].code",
                                "phoneNumber[].number"
                            ]
                        },
                        {
                            type: "section",
                            html: "<i>asdf</i>{{model.address.streetAddress}}"
                        }
                    ]
                },
                {
                    type: "actionbox",
                    items: [{
                        type: "submit",
                        title: "Download Dump"
                    }]
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
                                },
                                "boo": {
                                    "type": "boolean",
                                    "title": "Check Done?"
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
                    $log.info('on submit action ....');
                }
            }
        };
    }
]);
