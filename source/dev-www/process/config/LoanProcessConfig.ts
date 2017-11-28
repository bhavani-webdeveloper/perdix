let config = {
    'policies': {
        'default' : {
            onLoad: {
                "defaults": [
                    {
                        "name": "Dumm1",
                        "arguments": {}
                    },
                    {
                        "name": "Dumm2",
                        "arguments": {}
                    },
                    {
                        "name": "PopulateLeadInteractionPolicy",
                        "arguments": {

                        }
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
                        "name": "SampleSimplePolicy",
                        "arguments": {
                            "name": "sasdf"
                        }
                    },
                    {
                        "name": "SampleMultiPolicy",
                        "arguments": {
                            "testargs": {
                                "shahal": "tharique"
                            }
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
            }
        },
        'command': {
            'OverlayLeadData': {

            }
        }
    }
}

export = config;
