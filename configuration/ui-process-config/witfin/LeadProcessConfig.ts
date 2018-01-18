let config = {
    'policies': {
        'default' : {
            onLoad: {
                "defaults": [
                    {
                        "name": "PopulateLeadInteractionPolicy",
                        "arguments": {

                        }
                    },
                    {
                        "name":"LeadDerivedColumnsPolicy",
                        "arguments": {}
                    }

                ],
                "overrides": [
                    {
                        "type": "expr",
                        "expr": "this.lead.currentStage=='InProcess' || this.lead.currentStage=='Incomplete'",
                        "add": [
                            {
                                "name": "PopulateLeadInteractionPolicy",
                                "arguments": {

                                }
                            }
                        ],
                        "remove": [

                        ]
                    }
                ]
            },
            onNew: {
                "defaults": [
                    {
                        "name": "PopulateLeadInteractionPolicy",
                        "arguments": {

                        }
                    },
                    {
                        "name": "PopulateLeadDefaultFieldsPolicy",
                        "arguments":null
                    }
                ]
            },
            "beforeProceed": {
                "overrides": [
                    {
                        "type": "expr",
                        "expr": "this.lead.currentStage!='Inprocess' && this.lead.interestedInProduct && this.lead.interestedInProduct.toUpperCase() == 'NO' || this.lead.eligibleForProduct == 'NO'",
                        "add": [
                            {
                                "name": "LeadRejectPolicy",
                                "arguments": {
                                    "stageForRejection": "Inprocess"
                                }
                            }
                        ]
                    },
                    {
                        "type": "expr",
                        "expr": "(this.lead.interestedInProduct && this.lead.interestedInProduct.toUpperCase() == 'YES') && this.lead.leadStatus == 'FollowUp'",
                        "add": [
                            {
                                "name": "LeadFollowupPolicy",
                                "arguments": {
                                    "stageForFollowup": "Inprocess"
                                }
                            }
                        ]

                    },
                    {
                        "type": "expr",
                        "expr": "(this.lead.currentStage!='ReadyForScreening' && this.lead.interestedInProduct && this.lead.interestedInProduct == 'YES') && this.lead.leadStatus == 'Screening'",
                        "add": [
                            {
                                "name": "LeadScreeningPolicy",
                                "arguments": {
                                    "stageForScreening": "ReadyForScreening"
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
