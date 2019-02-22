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
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='RiskReviewAndLoanSanction'",
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
        "command": {
            "OverlayLeadData": {

            }
        }
    }
}

export = config;
