let config = {
    'policies': {
        'default' : {
            onNew: {
                "defaults": []
            },
            onLoad: {
                "defaults": [
                    {
                        "name": "LiabilityRelatedLenderPolicy",
                        "arguments": {}
                    }
                ]
            },
            beforeProceed: {
                "defaults": []
            },
            beforeSave: {
                "defaults": []
            },
        },
        'command': {
            'OverlayLeadData': {

            }
        }
    }
}

export = config;
