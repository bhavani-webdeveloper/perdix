let config = {
    'policies': {
        'default' : {
            onNew: {
                "defaults": [
                    {
                        "name": "DefaultRelatedCustomersPolicy",
                        "arguments": {
                            "applicant": true,
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
                        "arguments": {}
                    }
                ],
                "overrides": []
            },
            beforeSave: {
                "defaults": [
                    {
                        "name":"MandatoryFieldsPolicy",
                        "arguments": null
                    }
                ]
            },
            afterSave: {
                "overrides": [
                  
                ]
            },
            beforeProceed: {
                "defaults": [
                    {
                        "name": "CustomerEnrolmentCompletedPolicy",
                        "arguments": {}
                    }
                ],
                "overrides": [                  
                  
                ]
            }
        },
        'command': {
            'OverlayLeadData': {

            }
        }
    }
}

export = config;
