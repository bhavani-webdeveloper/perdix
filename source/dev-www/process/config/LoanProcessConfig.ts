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
                ],
                "overrides": [
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='VehicleValuation'",
                        "add": [
                            {
                                "name": "DefaultVehicleComponentsPolicy",
                                "arguments": null
                            }, {
                                "name":"DefaultVehicleAccessoriesPolicy",
                                "arguments": null
                            }
                        ]
                    }
                ]
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
            },
            beforeProceed: {
                "overrides": [
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='ManagementCommittee'",
                        "add": [
                            {
                                "name": "OriginationToBookingPolicy",
                                "arguments": {
                                    "postStage":"LoanInitiation"
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
