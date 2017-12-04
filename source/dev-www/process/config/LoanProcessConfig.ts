let config = {
    'policies': {
        'default' : {
            onNew: {
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
            onLoad: {
                "defaults": [
                    {
                        "name": "LoadRelatedCustomersPolicy",
                        "arguments": null
                    }
                ]
            },
            beforeProceed: {
                "defaults": [
                    {
                        "name": "preSaveCustomerPolicy",
                        "arguments": null
                    }
                ]
            },
        },

        'command': {
            'OverlayLeadData': {

            }
        }
    }
}

export = config;
