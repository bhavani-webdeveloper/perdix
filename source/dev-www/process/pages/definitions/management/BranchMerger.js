irf.pageCollection.factory(irf.page("management.BranchMerger"), ["$log", "Maintenance","Enrollment" ,"$state", "$stateParams", "Lead", "SessionStore",
    "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries",
    function($log, Maintenance,Enrollment, $state, $stateParams, Lead, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "BRANCH_MERGER",

            initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                model.customer = model.customer || {};
                $log.info("Spoke Merger page ");
            },

            offline: false,
            getOfflineDisplayItem: function(item, index) {
                return []
            },

            "form": [{
                    "type": "box",
                    "title": "BRANCH_MERGER",
                    "items": [{
                            key: "model.customer.fromBranchId",
                            title: "From Hub",
                            type: "select",
                            enumCode: "branch_id"
                        },
                        {
                            key: "model.customer.toBranchId",
                            title: "To Hub",
                            type: "select",
                            enumCode: "branch_id"
                        },  


                        {
                            type: "actionbox",
                            items: [{
                                type: "submit",
                                title: "submit"
                            }]
                        },


                    ]
                },



            ],

            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "customer": {
                        "type": "object",
                        "required": [],
                        "properties": {
                            "fromBranchId": {
                                "type": "long"
                            },
                            "toBranchId": {
                                "type": "long"
                            }
                        }
                    }
                }
            },
            actions: {
                submit: function(model, form, formName) {
                    Utils.confirm("Are You Sure").then(function(){
                    $log.info('on submit action ....');
                    $log.info(model.model.customer);
                    var reqData = _.cloneDeep(model.model.customer);
                    
                    // Maintenance.updateBranch(model.model.customer).$promise.then(
                    //     function(response) {
                    //         PageHelper.hideLoader();
                    //         PageHelper.showProgress("Hub updated", "Done.", 2000);
                    //     },
                    //     function(errorResponse) {
                    //         PageHelper.hideLoader();
                    //         PageHelper.showErrors(errorResponse);
                    //     }
                    // );

                     Maintenance.updateBranch({fromBranchId :reqData.fromBranchId,toBranchId:reqData.toBranchId},{}).$promise.then(
                        function(response) {
                            PageHelper.hideLoader();
                            PageHelper.showProgress("Hub updated", "Done.", 2000);
                        },
                        function(errorResponse) {
                            PageHelper.hideLoader();
                            PageHelper.showErrors(errorResponse);
                        }
                    );
                    })
                },
            }
        };
    }
]);