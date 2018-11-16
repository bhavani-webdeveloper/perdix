irf.pageCollection.factory(irf.page("customer.Dedupe"),
["IndividualLoan", "$log", "$state", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
"PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "irfNavigator", "Dedupe",
function(IndividualLoan, $log, $state, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
    PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, irfNavigator, Dedupe){
       return {
            "type": "schema-form",
            "title": "Dedupe",
            "eventListeners": {
                "customer-loaded": function(bundleModel, model, obj){
                    if (!model.customers) {
                        model.customers = {};
                    }
                    model.customers[obj.id] = obj;
                },
                "business-loaded": function(bundleModel, model, obj){
                    if (!model.customers) {
                        model.customers = {};
                    }
                    model.customers[obj.id] = obj;
                }
            },
            initialize: function (model, form, formCtrl) {
                model.customers = [];
                var dedupeCustomerIdArray = [];
                $log.info("Dedupe View Details initialize");
                $log.info(model);
                angular.forEach(model.loanAccount.loanCustomerRelations, function(item, index) {
                            dedupeCustomerIdArray.push(item.customerId);
                });
                dedupeCustomerIdArray.push(model.loanAccount.customerId);

                var dedupeIds;

                model.allMarkedAsNotDuplicate = false;
                model.areThereAnyDuplicates = false;



                var p1 = $q.when()
                    .then(function(){
                        $log.info("p1_1 is resolved");
                        var p1_1 = Queries.getDedupeDetails({
                             "ids" : dedupeCustomerIdArray
                        });
                        return p1_1;
                    })
                    .then(function(d){
                        if(d.length != 0){
                            BundleManager.pushEvent('dedupe-customer-list', model._bundlePageObj, {"K": false});
                        }
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

                                    if (_.hasIn(data[i], 'dedupeRequestDeatils') && _.isArray(data[i].dedupeRequestDeatils)) {
                                        _.forEach(data[i].dedupeRequestDeatils, function(i){
                                            i.matchDetailsDef = {
                                                'columns': [
                                                    {
                                                        'data': 'fieldName',
                                                        'title': "FIELD_NAME"
                                                    },
                                                    {
                                                        'data': 'matchFieldValue',
                                                        'title': 'MATCHED_CUSTOMER_FIELD_VALUE'
                                                    },
                                                    {
                                                        'data': 'requestFieldValue',
                                                        'title': 'CUSTOMER_FIELD_VALUE'
                                                    }
                                                ],
                                                'data': i.dedupeMatchDetails
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    })
            },
            form: [
                {
                    "type": "box",
                    "title": "DEDUPE_DETAILS",
                    "colClass": "col-sm-12",
                    "items": [
                        {
                            "key": "dedupeData",
                            "type": "array",
                            "add": null,
                            "remove":null,
                            "titleExpr": "model.dedupeData[arrayIndexes[0]].customerName + ' - ' + model.dedupeData[arrayIndexes[0]].customerType",
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
                                    "titleExpr":"'Matched Customer: ' + model.dedupeData[arrayIndexes[0]].dedupeRequestDeatils[arrayIndexes[1]].customerName",
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
                                            "key": "dedupeData[].dedupeRequestDeatils[].markAsDuplicate",
                                            "title": "MARK_AS_DUPLICATE",
                                            "schema":{
                                                "default": false
                                            },
                                            "default": false,
                                            "readonly": false,
                                            "type": "checkbox",
                                            "onChange": function(modelValue, form, model, formCtrl, event) {
                                                var requestedCustomer = model.dedupeData[form.arrayIndexes[0]];
                                                var selectedCustomer = model.dedupeData[form.arrayIndexes[0]].dedupeRequestDeatils[form.arrayIndexes[1]];
                                                _.forEach(requestedCustomer.dedupeRequestDeatils, function(i){
                                                    if (i.dedupeCustomerId != selectedCustomer.dedupeCustomerId && i.markAsDuplicate){
                                                        PageHelper.showProgress("enrolment","You can only select one customer as duplicate. Please unselect customer id :" + i.dedupeCustomerId, 5000);
                                                        selectedCustomer.markAsDuplicate = false;
                                                        return false;
                                                    }
                                                })

                                                model.areThereAnyDuplicates = false;
                                                _.forEach(model.dedupeData, function(i){
                                                    if (model.areThereAnyDuplicates == false){
                                                        _.forEach(i.dedupeRequestDeatils, function(j){
                                                            if (j.markAsDuplicate==true){
                                                                model.areThereAnyDuplicates = true;
                                                                return false;
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        },
                                        {
                                            type: "section",
                                            colClass: "col-sm-12",
                                            html: "<irf-simple-summary-table irf-table-def='model.dedupeData[arrayIndexes[0]].dedupeRequestDeatils[arrayIndexes[1]].matchDetailsDef'></irf-simple-summary-table>"
                                        }
                                        // {
                                        //     "key": "dedupeData[].dedupeRequestDeatils[].dedupeMatchDetails",
                                        //     "title": "MATCHING_FIELDS",
                                        //     "type": "array",
                                        //     "view": "fixed",
                                        //     "add": null,
                                        //     "remove": null,
                                        //     "titleExpr":  "model.dedupeData[arrayIndexes[0]].dedupeRequestDeatils[arrayIndexes[1]].dedupeMatchDetails[arrayIndexes[2]].fieldName",
                                        //     "items": [
                                        //         {
                                        //             "key": "dedupeData[].dedupeRequestDeatils[].dedupeMatchDetails[].fieldName",
                                        //             "title": "FIELD_NAME",
                                        //             "readonly": true
                                        //         },
                                        //         {
                                        //             "key": "dedupeData[].dedupeRequestDeatils[].dedupeMatchDetails[].score",
                                        //             "title": "SCORE",
                                        //             "readonly": true
                                        //         },
                                        //         {
                                        //             "key": "dedupeData[].dedupeRequestDeatils[].dedupeMatchDetails[].matchFieldValue",
                                        //             "title": "MATCHED_CUSTOMER_FIELD_VALUE", // Matched Customer Value
                                        //             "readonly": true
                                        //         },
                                        //         {
                                        //             "key": "dedupeData[].dedupeRequestDeatils[].dedupeMatchDetails[].requestFieldValue",
                                        //             "title": "CUSTOMER_FIELD_VALUE", // Customer Value
                                        //             "readonly": true
                                        //         }
                                        //     ]
                                        // }
                                    ]
                                }
                            ]
                        }],
                    },
                    {
                        "type": "box",
                        "title": "REMARKS",
                        "condition": "model.areThereAnyDuplicates==false",
                        "items": [
                            {
                                "key": "dedupeData.remarks",
                                "title": "PROCEED_REMARKS",
                                "required": true,
                                "type": "textarea"
                            }
                        ]
                    },
                    {
                        "type": "box",
                        "title": "REMARKS",
                        "condition": "model.areThereAnyDuplicates==true",
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
                        "condition": "model.areThereAnyDuplicates==false",
                        "items": [
                            {
                                "type": "button",
                                "icon": "fa fa-circle-o",
                                "title": "PROCEED",
                                "onClick": "actions.proceed(model, formCtrl, form, $event)"
                            }]
                    },
                    {
                        "type": "actionbox",
                        "condition": "model.areThereAnyDuplicates==true",
                        "items": [
                            {
                                "type": "button",
                                "icon": "fa fa-circle-o",
                                "title": "SEND_BACK",
                                "onClick": "actions.sendback(model, formCtrl, form, $event)"
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

                        var customersToUpdate = [];

                        PageHelper.showProgress("marking-duplicates", "Marking selected customer(s)/entites(s) as duplicates...");
                        _.forEach(model.dedupeData, function(i){
                            var originalCustomerDetail = _.find(i.dedupeRequestDeatils, function(j){
                                return j.markAsDuplicate;
                            });
                            if (originalCustomerDetail){
                                model.customers[i.customerId].duplicateCustomerId = originalCustomerDetail.dedupeCustomerId;
                                customersToUpdate.push(model.customers[i.customerId]);
                            }
                        });

                        var promisesForDuplicateCustomerUpdate = [];

                        _.forEach(customersToUpdate, function(i){
                            var requestObj = {
                                customer: i,
                                enrollmentAction: "PROCEED"
                            };
                            var p = Enrollment.updateEnrollment(requestObj).$promise;
                            promisesForDuplicateCustomerUpdate.push(p);
                        })

                        PageHelper.showLoader();

                        $q.all(promisesForDuplicateCustomerUpdate)
                        .then(function(res){
                            var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                            reqData.loanProcessAction = "PROCEED";
                            reqData.stage = "Screening";
                            reqData.remarks = model.dedupeData.remarks;

                            PageHelper.showProgress("marking-duplicates", "Marking duplicates completed.", 3000);

                            PageHelper.showProgress("update-loan", "Sending Loan back...");
                            IndividualLoan.update(reqData).$promise
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

                        }, function(httpRes){
                            PageHelper.showProgress("marking-duplicates", "Oops. Some error occured.", 3000);
                            PageHelper.showErrors(httpRes);
                            return false;
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
                }
            }
        }
    }
])

