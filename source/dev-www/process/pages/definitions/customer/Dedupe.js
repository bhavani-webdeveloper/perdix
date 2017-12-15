irf.pageCollection.factory(irf.page("customer.Dedupe"),
["IndividualLoan", "$log", "$state", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
"PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "irfNavigator", "Dedupe",
function(IndividualLoan, $log, $state, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
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
                dedupeCustomerIdArray.push(model.loanAccount.customerId);

                var dedupeIds;

                model.allMarkedAsNotDuplicate = false;

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
                            model.dedupeData = [];

                            for (var i=0;i<data.length;i++){
                                if (data[i].duplicateAboveThresholdCount > 0){
                                    model.dedupeData.push(data[i]);
                                }
                            }
                        })
                    })
            },
            form: [
                {
                    "type": "box",
                    "title": "CUSTOMER_INFORMATION",
                    "items": [
                        {
                            "key": "dedupeData",
                            "type": "array",
                            "add": null,
                            "remove":null,
                            "view": "fixed",
                            "items": [
                                {
                                    "key": "dedupeData[].customerId",
                                    "title": "CUSTOMER_ID",
                                    "readonly" : true
                                },
                                {
                                    "key": "dedupeData[].customerName",
                                    "title": "CUSTOMER_NAME",
                                    "readonly" : true
                                },
                                {
                                    "key": "dedupeData[].customerType",
                                    "title": "CUSTOMER_TYPE",
                                    "readonly" : true
                                },
                                {
                                    "key": "dedupeData[].dedupeRequestDeatils",
                                    "type":"array",
                                    "title": "MATCHES_FOUND",
                                    "add": null,
                                    "remove": null,
                                    "view": "fixed",
                                    "items": [
                                        {
                                            "key": "dedupeData[].dedupeRequestDeatils[].dedupeCustomerId",
                                            "title": "MATCH_ID",
                                            "readonly": true
                                        },
                                        {
                                            "key": "dedupeData[].dedupeRequestDeatils[].score",
                                            "title": "SCORE",
                                            "readonly": true
                                        },
                                        {
                                            "key": "dedupeData[].dedupeRequestDeatils[].markAsNotDuplicate",
                                            "title": "MARK_AS_NOT_DUPLICATE",
                                            "schema":{
                                                "default": false
                                            },
                                            "default": false,
                                            "readonly": false,
                                            "type": "checkbox",
                                            "onChange": function(modelValue, form, model, formCtrl, event) {
                                                var allNonDuplicates = true;

                                                outerloop:
                                                for (var i=0;i<model.dedupeData.length;i++){
                                                    var d = model.dedupeData[i];
                                                    for (var j=0;j<d.dedupeRequestDeatils.length;j++){
                                                        var e = d.dedupeRequestDeatils[j];
                                                        if (e.markAsNotDuplicate == false) {
                                                            allNonDuplicates = false;
                                                            break outerloop;
                                                        }
                                                    }
                                                }

                                                model.allMarkedAsNotDuplicate = allNonDuplicates;
                                            }
                                        },
                                        {
                                            "key": "dedupeData[].dedupeRequestDeatils[].dedupeMatchDetails",
                                            "title": "MATCHING_FIELDS",
                                            "type": "array",
                                            "view": "fixed",
                                            "add": null,
                                            "remove": null,
                                            "titleExpr":  "model.dedupeData[arrayIndexes[0]].dedupeRequestDeatils[arrayIndexes[1]].dedupeMatchDetails[arrayIndexes[2]].fieldName",
                                            "items": [
                                                {
                                                    "key": "dedupeData[].dedupeRequestDeatils[].dedupeMatchDetails[].fieldName",
                                                    "title": "FIELD_NAME",
                                                    "readonly": true
                                                },
                                                {
                                                    "key": "dedupeData[].dedupeRequestDeatils[].dedupeMatchDetails[].score",
                                                    "title": "SCORE",
                                                    "readonly": true
                                                },
                                                {
                                                    "key": "dedupeData[].dedupeRequestDeatils[].dedupeMatchDetails[].matchFieldValue",
                                                    "title": "MATCHED_CUSTOMER_FIELD_VALUE", // Matched Customer Value
                                                    "readonly": true
                                                },
                                                {
                                                    "key": "dedupeData[].dedupeRequestDeatils[].dedupeMatchDetails[].requestFieldValue",
                                                    "title": "CUSTOMER_FIELD_VALUE", // Customer Value
                                                    "readonly": true
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }],
                    },
                    {
                        "type": "box",
                        "title": "REMARKS",
                        "condition": "model.allMarkedAsNotDuplicate==false",
                        "items": [
                            {
                                "key": "dedupeData.remarks",
                                "title": "SEND_BACK_REMARKS",
                                "required": true,
                                "type": "textarea"
                            }
                        ]
                    },
                    {
                        "type": "actionbox",
                        "condition": "model.allMarkedAsNotDuplicate==false",
                        "items": [
                            {
                                "type": "button",
                                "icon": "fa fa-circle-o",
                                "title": "SEND_BACK",
                                "onClick": "actions.sendback(model, formCtrl, form, $event)"
                            }]
                    },
                    {
                        "type": "actionbox",
                        "condition": "model.allMarkedAsNotDuplicate==true",
                        "items": [
                            {
                                "type": "button",
                                "icon": "fa fa-circle-o",
                                "title": "PROCEED",
                                "onClick": "actions.proceed(model, formCtrl, form, $event)"
                            }]
                    },
                ]
            ,
            schema: function(){
                return Dedupe.getSchema().$promise;
                },
            actions: {
                sendback: function(model, form, formName){
                    form.scope.$broadcast('schemaFormValidate');
                    if (form && form.$invalid){
                        PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
                        return;
                    }
                    Utils.confirm("Are You Sure?").then(function(){
                        var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                        reqData.loanProcessAction = "PROCEED";
                        reqData.stage = "Screening";
                        reqData.remarks = model.dedupeData.remarks;

                        PageHelper.showProgress("update-loan", "Working...");
                        IndividualLoan.update(reqData)
                        .$promise
                        .then(function(res){
                            PageHelper.showProgress("update-loan", "Done.", 3000);
                            return $state.go('Page.Engine', {pageName: 'loans.individual.screening.DedupeQueue', pageId:null});
                        }, function(httpRes){
                            PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                            PageHelper.showErrors(httpRes);
                        })
                        .finally(function(){
                            PageHelper.hideLoader();
                        })
                    })
                },
                proceed: function(model){
                    Utils.confirm("Are You Sure?").then(function(){
                        var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                        reqData.loanProcessAction = "PROCEED";

                        PageHelper.showProgress("update-loan", "Working...");
                        IndividualLoan.update(reqData)
                        .$promise
                        .then(function(res){
                            PageHelper.showProgress("update-loan", "Done.", 3000);
                            return $state.go('Page.Engine', {pageName: 'loans.individual.screening.DedupeQueue', pageId:null});
                        }, function(httpRes){
                            PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                            PageHelper.showErrors(httpRes);
                        })
                        .finally(function(){
                            PageHelper.hideLoader();
                        })
                    })
                }
            }
        }
    }
])

