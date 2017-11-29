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
                        "name": "LoadRelatedCustomersPolicy",
                        "arguments": null
                    }
                ]
            },
            beforeProceed: {
                "defaults": [
                    {
                        "name": "PreSaveCustomerPolicy",
                        "arguments": null
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
