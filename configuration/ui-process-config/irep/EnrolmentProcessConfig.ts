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
                    
                ]
            },
            "beforeSave": {
                "defaults": [
                    {
                        "name": "LoadEnrolmentCustomerDataPolicy",
                        "arguments": null
                    },
                    {
                        "name":"SelfRelationshipRequiredPolicy",
                        "arguments": null
                    },
                    {
                        "name":"GSTApplicablePolicy",
                        "arguments": null
                    }
                ],
                "overrides": [
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='Appraisal'",
                        "add": [
                            {
                                "name": "MinimumReferencesPolicy",
                                "arguments": {}
                            }
                        ]
                    },
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='KYCReview'",
                        "add": [
                            {
                                "name": "CommercialCBCheckPolicy",
                                "arguments": {}
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
