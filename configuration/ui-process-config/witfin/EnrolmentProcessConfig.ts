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
                ],
                "overrides": [
                    {
                         "type": "expr",
                         "expr": "this.currentStage == 'Applciation'",
                         "add": [
                             {
                                 "name": "VerifyIndividualReferencePolicy",
                                 "arguments": {}
                             }
                        ]   
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
                        "name": "VerifyBankAccountNumberPolicy",
                        "arguments": null
                    }
                ],
                "overrides": [
                    {
                         "type": "expr",
                         "expr": "this.currentStage == 'Applciation'",
                         "add": [
                             {
                                 "name": "VerifyIndividualReferencePolicy",
                                 "arguments": {}
                             }
                        ]   
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
                        "name": "VerifyBankAccountNumberPolicy",
                        "arguments": null
                    }
                ],
                "overrides": [
                    {
                         "type": "expr",
                         "expr": "this.currentStage == 'Applciation'",
                         "add": [
                             {
                                 "name": "VerifyIndividualReferencePolicy",
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
