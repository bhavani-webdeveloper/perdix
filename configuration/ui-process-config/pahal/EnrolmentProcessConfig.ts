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
                        "name": "VerifyBankAccountNumberPolicy",
                        "arguments": null
                    },
                    {
                        "name": "VerifyTrackDetailsPolicy",
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
                        "name": "VerifyBankAccountNumberPolicy",
                        "arguments": null
                    },
                    {
                        "name": "VerifyTrackDetailsPolicy",
                        "arguments": null
                    }
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
