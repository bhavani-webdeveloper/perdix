let config = {
    "policies": {
        "default" : {
            "onNew": {
                "defaults": [
                    {
                        "name": "DefaultRelatedCustomersPolicy",
                        "arguments": {
                            "applicant": true,
                            "coApplicant": false,
                            "guarantor": false,
                            "loanCustomer": true,
                            "loanCustomerType": "Enterprise"
                        }
                    }
                ]
            },
            "onLoad": {
                "defaults": [
                    {
                        "name": "LoadRelatedCustomersPolicy",
                        "arguments": {}
                    }
                ]
            },
            "beforeSave": {
                "defaults": [
                    {
                        "name":"MandatoryFieldsPolicy",
                        "arguments": null
                    }
                ]
            },
            "afterSave": {
                "overrides": [
                   
                ]
            },
            "beforeProceed": {
                "overrides": [
                   
                ]
            }
        },
        "command": {
            "OverlayLeadData": {

            }
        }
    }
}

export = config;
