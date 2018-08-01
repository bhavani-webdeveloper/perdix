let config = {
    'policies': {
        'default' : {
            onNew: {
                "defaults": [
                    {
                        "name": "LoadTransactionBranchData",
                        "arguments": null
                    }
                ]
            },
            onLoad: {
                // "defaults": [
                //     {
                //         "name": "LoadTotalAmountPolicy",
                //         "arguments": {}
                //     }
                // ]
                
            },
            beforeProceed: {
               
            },
            beforeSave: {
                
            },
        },

        'command': {
            'OverlayLeadData': {

            }
        }
    }
}

export = config;
