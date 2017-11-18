irf.pageCollection.factory(irf.page("loans.individual.misc.Dedupe"), 
["$log", "$state", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
"PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "irfNavigator", "Dedupe",
function($log, $state, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
    PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, irfNavigator, Dedupe){
       return {
            "type": "schema-form",
            "title": "Dedupe",
             initialize: function (model, form, formCtrl) {
                var dedupeCustomerIdArray = [];
                $log.info("Dedupe View Details initialize");
                $log.info(model);
                angular.forEach(model.loanAccount.loanCustomerRelations, function(item, index) {
                            dedupeCustomerIdArray.push(item.customerId);
                });

                var dedupeIds;

                var p1 = $q.when()
                    .then(function(){
                        $log.info("p1_1 is resolved");
                        var p1_1 = Queries.getDedupeDetails({
                             "ids" : dedupeCustomerIdArray
                        });
                        return p1_1;
                    })
                    .then(function(d){
                        var dedupeIds = [];
                        $log.info("p1_2 is resolved");
                        angular.forEach(d, function(item, index){
                            dedupeIds.push(item.id);
                        });
                        var p1_2 = Dedupe.getCustomerId({
                            "dedupeRequestIds" : dedupeIds
                        })
                        .$promise
                        .then(function(data){
                            $log.info(data);
                            model.dedupeData = data;
                        })
                    })
            },
            form: [{
                "type": "box",
                "title": "CUSTOMER_INFORMATION",
                "items": [
                    {
                        "key": "dedupeData",
                        "type": "array",
                        "items": [
                            {
                                "key": "dedupeData[].customerId",
                                "title": "CUSTOMER_ID",
                                "readonly" : true
                            },
                            {
                                "key": "dedupeData[].dedupeRequestDeatils",
                                "type":"array",
                                "title": "MATCHES_FOUND",
                                "items": [{
                                    "key": "dedupeData[].dedupeRequestDeatils[].dedupeCustomerId",
                                    "title": "MATCH_ID",
                                    "readonly": true
                                }]
                            }    
                        ]
                    }],
                }]       
            ,
            schema: function(){
                return Dedupe.getSchema().$promise;
                },
            actions: {
                submit: function(model, form, formName){
                }
            }
        } 
    }
])

