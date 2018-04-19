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
                    },
                    {
                        "name": "LiabilityDocumentUploadPolicy",
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
