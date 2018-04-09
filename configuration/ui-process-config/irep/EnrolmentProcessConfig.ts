let config = {
    'policies': {
        'default' : {
            onNew: {
                "defaults": [
                    {
                        "name": "LoadNewCustomerData",
                        "arguments": null
                    }
                ]
            },
            onLoad: {
                "defaults": [
                    {
                        "name":"EnrolmentDerivedPolicy",
                        "arguments": {}
                    }
                ]
            },
            beforeProceed: {
                "defaults": [
                    {
                        "name": "PreSaveCustomerPolicy",
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
                ]
            },
            beforeSave: {
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
                        "expr": "this.loanAccount.currentStage=='Application'",
                        "add": [
                            {
                                "name": "MinimumReferencesPolicy",
                                "arguments": {}
                            }
                        ]
                    },
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='ScreeningReview'",
                        "add": [
                            {
                                "name": "CommercialCBCheckPolicy",
                                "arguments": {}
                            }
                        ]
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
