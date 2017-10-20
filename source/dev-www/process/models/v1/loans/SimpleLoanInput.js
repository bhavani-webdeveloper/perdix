irf.models.factory('SimpleLoanInput', function($resource, $filter, Utils, $log, PagesDefinition, SessionStore, formHelper, Queries, BASE_URL, searchResource, IndividualLoan, Enrollment, PageHelper) {
    var endpoint = BASE_URL + '/api/enrollments';

    var loanJson = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "isMinimumFingerPrintRequired": 1,
        "properties": {
            "customer": {
                "type": "object",
                "properties": {
                    "customerId": {
                        "type": ["integer", "null"]
                    },
                    "firstName": {
                        "type": ["string", "null"]
                    },
                    "branch": {
                        "type": ["string", "null"],
                        "enumCode": "branch",
                        "title": "BRANCH"
                    },
                    "centreId": {
                        "type": ["null", "number"],
                        "enumCode": "centre",
                        "title": "CENTRE"
                    },
                    "applicantName": {
                        "type": ["string", "null"]
                    },
                    "customerType": {
                        "type": ["string", "null"]
                    }
                }
            },

            "loanAccount": {
                "type": "object",
                "properties": {
                    "loanCentre": {
                        "type": "object",
                        "properties": {                            
                            "centreId": {
                            "type": ["integer", "null"],
                            "title": "CENTER",
                            "enumCode": "centre",
                            "x-schema-form": {
                                "type": "select",
                                "parentEnumCode": "branch_id",
                                "parentValueExpr": "model.loanAccount.branchId",
                             }
                          },
                        }
                    },
                    "branchId": {
                        "type": ["integer", "null"],
                        "title": "BRANCH_NAME",
                        "enumCode": "branch_id",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "centreId": {
                        "type": ["integer", "null"],
                        "title": "CENTER",
                        "enumCode": "centre",
                        "parentEnumCode": "branch_id",
                        "parentValueExpr": "model.loanAccount.branchId",
                        "x-schema-form": {
                            "type": "select",
                            "parentEnumCode": "branch_id",
                            "parentValueExpr": "model.loanAccount.branchId",
                        }
                    },
                    "created_by": {
                        "type": ["string", "null"],
                        "title": "CREATED_BY",
                        "readonly": true
                    },
                    "partnerCode": {
                        "type": ["string", "null"],
                        "title": "partner",
                        "enumCode": "partner",
                        "x-schema-form": {
                            "type": "select",
                        },
                        onChange: function(value, form, model) {
                            partnerChange(value, model);
                        }
                    },
                    "productCategory": {
                        "type": ["string", "null"],
                        "title": "PRODUCT_CATEGORY",
                        "x-schema-form": {
                            "type": "select",
                        },
                        "enumCode": "loan_product_category"
                    },
                    "frequency": {
                        "type": ["string", "null"],
                        "title": "FREQUENCY",
                        "x-schema-form": {
                            "type": "select",
                        },
                        "enumCode": "loan_product_frequency"
                    },
                    "productCode": {
                        "type": ["string", "null"],
                        "title": "PRODUCT",
                        "x-schema-form": {
                            "type": "lov",
                            "lovonly": true,
                            "bindMap": {
                                "Partner": "loanAccount.partnerCode",
                                "ProductCategory": "loanAccount.productCategory",
                                "Frequency": "loanAccount.frequency",
                            },
                            "autolov": true,
                            "required": true,
                            searchHelper: formHelper,
                            search: function(inputModel, form, model, context) {

                                return Queries.getLoanProductCode(model.loanAccount.productCategory, model.loanAccount.frequency, model.loanAccount.partnerCode);
                            },
                            onSelect: function(valueObj, model, context) {
                                model.loanAccount.productCode = valueObj.productCode;
                                if(valueObj.tenure_from == valueObj.tenure_to) {
                                    model.loanAccount.tenure = valueObj.tenure_to;
                                }
                                else {
                                    delete model.loanAccount.tenure;
                                    model.tenurePlaceHolderExpr = valueObj.tenure_from + '-' + valueObj.tenure_to;
                                }
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.name
                                ];
                            },
                            onChange: function(value, form, model) {
                                getProductDetails(value, model);
                            },
                        }
                    },
                    "tenure": {
                        "type": ["number", "null"],
                        "title": "LOAN_TENURE",
                        "x-schema-form": {
                            "placeholderExpr": "model.tenurePlaceHolderExpr",
                        }
                    },
                    // "tenure": {
                    //     "type": ["string", "null"],
                    //     "title":"TENURE",
                    //     "placeholderExpr": "model.tenurePlaceHolderExpr",
                    //     "minimum":0
                    // },
                    "applicant": {
                        "type": ["string", "null"],
                        "title": "APPLICANT_URN",                        
                        "x-schema-form": {
                            "lovonly": true,
                            "type": "lov",
                            "inputMap": {
                                "customerId": {
                                    "key": "customer.customerId",
                                    "title": "CUSTOMER_ID"
                                },
                                "firstName": {
                                    "key": "customer.firstName",
                                    "title": "CUSTOMER_NAME"
                                },
                                "branch": {
                                    "key": "customer.branch",
                                    "type": "select"
                                },
                                "centreId": {
                                    "key": "customer.centreId",
                                    "type": "select"
                                }
                            },
                            "outputMap": {
                                "id": "loanAccount.customerId",
                                "urnNo": "loanAccount.applicant",
                                "firstName": "loanAccount.applicantName",
                            },
                            "initialize": function(inputModel, form, model, context) {
                                var branches = formHelper.enum('branch').data;
                                var branchName = null;
                                for (var i=0;i<branches.length; i++){
                                     if ( branches[i].code == model.loanAccount.branchId){
                                        branchName = branches[i].name;
                                        break;
                                     }
                                }
                                inputModel.branch = branchName || SessionStore.getBranch();
                                inputModel.centreId = model.loanAccount.loanCentre.centreId;
                            },
                            "searchHelper": formHelper,
                            "search": function(inputModel, form) {
                                $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                var promise = Enrollment.search({
                                    'customerId': inputModel.customerId,
                                    'branchName': inputModel.branch || SessionStore.getBranch(),
                                    'firstName': inputModel.firstName,
                                    'centreId': inputModel.centreId,
                                    'customerType': "individual",
                                    'stage': "Completed"
                                }).$promise;
                                return promise;
                            },
                            getListDisplayItem: function(data, index) {
                                return [
                                    [data.firstName, data.fatherFirstName].join(' | '),
                                    data.id,
                                    data.urnNo
                                ];
                            }
                        }
                    },
                    "applicantName": {
                        "type": ["string", "null"],
                        "title": "APPLICANT_NAME",
                        "readonly": true
                    },
                    "loanAmount": {
                        "type": ["number", "null"],
                        "title": "LOAN_AMOUNT",
                        "placeholderExpr": "model.additional.product.amountBracket",
                    },
                    "processingFeePercentage": {
                        "type": ["number", "null"],
                        "title": "PROCESSING_FEES_IN_PERCENTAGE",
                        "minimum": 0,
                        "maximum": 100
                    },
                    "interestRate": {
                        "type": ["number", "null"],
                        "title": "INTEREST_RATE",
                        "placeholderExpr": "model.additional.product.interestBracket"
                    },
                    "loanApplicationDate": {
                        "type": ["string", "null"],
                        "title": "LOAN_APPLICATION_DATE",
                        "format": "date",
                        "x-schema-form": {
                            type: "date"
                        },
                    },
                    "loanPurpose1": {
                        "type": ["string", "null"],
                        "title": "LOAN_PURPOSE_1",
                        "x-schema-form": {
                            "lovonly": true,
                            "type": "lov",
                            bindMap: {},
                            outputMap: {
                                "purpose1": "loanAccount.loanPurpose1"
                            },
                            searchHelper: formHelper,
                            search: function(inputModel, form, model) {
                                if (model.loanAccount.productCode != null)
                                    return Queries.getLoanPurpose1(model.loanAccount.productCode);
                                else
                                    return Queries.getAllLoanPurpose1();

                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.purpose1
                                ];
                            },
                            onSelect: function(result, model, context) {
                                model.loanAccount.loanPurpose2 = '';
                            }

                        }

                    },
                    "loanPurpose2": {
                        "type": ["string", "null"],
                        "title": "LOAN_PURPOSE_2",
                        "x-schema-form": {
                            "type": "lov",
                            "lovonly": true,
                            bindMap: {},
                            outputMap: {
                                "purpose2": "loanAccount.loanPurpose2"
                            },
                            searchHelper: formHelper,
                            search: function(inputModel, form, model) {
                                if (model.loanAccount.productCode != null)
                                    return Queries.getLoanPurpose2(model.loanAccount.productCode, model.loanAccount.loanPurpose1);
                                else
                                    return Queries.getAllLoanPurpose2(model.loanAccount.loanPurpose1);
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.purpose2
                                ];
                            }
                        }
                    },                
                    "portfolioInsuranceUrn": {
                        "type": ["string", "null"],
                        "title": "URN",
                        "readonly": true
                    },
                    "portfolioInsuranceCustomerName": {
                        "type": ["string", "null"],
                        "title": "NAME",
                        "readonly": true
                    },
                    "remarks": {
                        "type": ["string", "null"],
                        "title": "REMARKS"
                    },
                    "sanctionDate": {
                        "title": "SANCTION_DATE",
                        "type": ["string", "null"],
                        required: true,
                        "format": "date",
                        "x-schema-form": {
                            type: "date",
                            onChange:function(value,form,model){
                                PageHelper.showProgress("loan-create","Verify Disbursement Schedules",5000);
                                model.loanAccount.disbursementSchedules=[];
                                for(var i=0;i<model.loanAccount.numberOfDisbursements;i++){
                                    model.loanAccount.disbursementSchedules.push({
                                        trancheNumber:""+(i+1),
                                        disbursementAmount:0
                                    });
                                }
                                if (model.loanAccount.numberOfDisbursements ==1){
                                    model.loanAccount.disbursementSchedules[0].disbursementAmount = model.loanAccount.loanAmount;
                                }  
                            },
                        },
                    },
                    "numberOfDisbursements": {
                        "type": ["null", "integer"],
                        title:"NUM_OF_DISBURSEMENTS",
                        "default": 1,
                        "readonly": true,
                        "x-schema-form": {
                            onChange:function(value,form,model){
                                PageHelper.showProgress("loan-create","Verify Disbursement Schedules",5000);
                                model.loanAccount.disbursementSchedules=[];
                                for(var i=0;i<value;i++){
                                    model.loanAccount.disbursementSchedules.push({
                                        trancheNumber:""+(i+1),
                                        disbursementAmount:0
                                    });
                                }
                                if (value ==1){
                                    model.loanAccount.disbursementSchedules[0].disbursementAmount = model.loanAccount.loanAmount;
                                }  
                            },
                        }
                    },
                    "disbursementSchedules": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {                           
                                "disbursementAmount": {
                                    "type":  ["null","integer"],
                                    "minimum":0,
                                    title:"DISBURSEMENT_AMOUNT",
                                    "x-schema-form": {
                                        type:"amount"
                                    },
                                },                           
                                "trancheNumber": {
                                    "type": ["string", "null"],
                                    title: "TRANCHE_NUMBER",
                                    "readonly": true,
                                },
                            },
                            "required": [
                                "disbursementAmount",
                                "trancheNumber"
                            ]
                        }
                    },
                },
                "required": [
                    "branchName",
                    "centreId",
                    "partner",
                    "product",
                    "tenure",
                    "frequency",
                    "applicant",
                    "applicantName",
                    "loanAmount",
                    "processingFeePercentage",
                    "interestRate",
                    "loanApplicationDate",
                    "loanPurpose1",
                    "loanPurpose2"                   
                ]
            },

            "additional": {
                "type": "object",
                "properties": {
                    "branchName": {
                        "type": ["string", "null"],
                        "title": "BRANCH_NAME"
                    },
                    "processingFeeMultiplier": {
                        "type": ["null", "number"]

                    },
                    "portfolioUrnSelector": {
                        "type": ["string", "null"],
                        "title": "INSURED_PERSON",
                        "x-schema-form": {
                            "type": "select",
                            "titleMap": [{
                                "name": "applicant",
                                "value": "applicant",
                            }],
                           onChange:function(value,form,model){
                            switch(value){
                                case "applicant":
                                    if(_.isEmpty(model.loanAccount.applicant)){
                                        Utils.alert("Please Select an Applicant");
                                        model.additional.portfolioUrnSelector = "";                                        
                                        break;
                                    }
                                    model.loanAccount.portfolioInsuranceUrn = model.loanAccount.applicant;
                                    model.loanAccount.portfolioInsuranceCustomerName = model.loanAccount.applicantName;
                                    break;
                                }
                                 
                              if(!model.additional.portfolioUrnSelector){
                                    model.loanAccount.portfolioInsuranceUrn ='';
                                    model.loanAccount.portfolioInsuranceCustomerName ='';
                              }
                              

                            }
                         }

                    },

                }
            },
        }
    };
    var res = $resource(endpoint, null, {

    });
    res.getSchema = function() {
        return loanJson;
    }
    return res;
});