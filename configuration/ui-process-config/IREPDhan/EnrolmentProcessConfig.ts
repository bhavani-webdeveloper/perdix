let config = {
    "policies": {
        "default" : {
            "onNew": {
                "defaults": [
                    {
                        "name": "LoadNewCustomerData",
                        "arguments": null
                    }
                ]
            },
            "onLoad": {
                "defaults": [
                    {
                        "name":"EnrolmentDerivedPolicy",
                        "arguments": {}
                    }
                ]
            },
            "beforeProceed": {
                "defaults": [
                    
                ],
                "overrides": [
                    {
                        "type": "expr",
                        "expr": "this.customer.customerType == 'Enterprise'",
                        "add": [
                            {
                                "name": "VerifyBankAccountNumberPolicy",
                                "arguments": null
                            },
                            {
                                "name": "PreSaveCustomerPolicy",
                                "arguments": null
                            }
                        ]
                    }
                ]
            },
            "beforeSave": {
                "defaults": [
                    {
                        "name": "LoadEnrolmentCustomerDataPolicy",
                        "arguments": null
                    },
                    {
                        "name": "PreSaveCustomerPolicy",
                        "arguments": null
                    }
                ],
                "overrides": [
                    {
                        "type": "expr",
                        "expr": "this.customer.customerType == 'applicant'",
                        "add": [
                            {
                                "name":"SelfRelationshipRequiredPolicy",
                                "arguments": null
                            }
                        ]
                    }
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
