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
            afterSave: {
                "overrides": [
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='Screening'",
                        "add": [
                            {
                                "name": "LoadStageRelatedPolicy",
                                "arguments": {
                                    "stage":"Completed"
                                }
                            }
                        ]
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
