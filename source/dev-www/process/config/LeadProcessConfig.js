define(["require", "exports"], function (require, exports) {
    "use strict";
    var config = {
        'policies': {
            'default': {
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
                                    "arguments": {}
                                }
                            ],
                            "remove": []
                        }
                    ]
                },
                onNew: {
                    "defaults": [
                        {
                            "name": "PopulateLeadInteractionPolicy",
                            "arguments": {}
                        }
                    ]
                },
                "beforeProceed": {
                    "overrides": [
                        {
                            "type": "expr",
                            "expr": "this.lead.productRequiredBy == '> 1 month'",
                            "add": [
                                {
                                    "name": "LeadFollowupPolicy",
                                    "arguments": {
                                        "stageForFollowup": "Inprocess"
                                    }
                                }
                            ]
                        }, {
                            "type": "expr",
                            "expr": "this.lead.productRequiredBy == '< 1 month'",
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
                'OverlayLeadData': {}
            }
        }
    };
    return config;
});
