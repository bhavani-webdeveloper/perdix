define([], function() {      

    return {
        pageUID: "payment.PaymentCreateBatch",
        pageType: "Engine",
       
   dependencies: ["$log", "irfElementsConfig", "Enrollment", "SessionStore", "formHelper", "$q",
   "PageHelper", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator", "Payment", "AuthTokenHelper", "$http", "$filter", "$httpParamSerializer", "irfProgressMessage",
],

$pageFn: function($log, elementsConfig, Enrollment, SessionStore, formHelper, $q,
   PageHelper, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator, Payment, AuthTokenHelper, $http, $filter, $httpParamSerializer, irfProgressMessage ) {

            var configFile = function() {
                return {}
            }
            var overridesFields = function() {
                return {
                    "CreateBatch":{
                        colClass: "col-sm-8",
                        "orderNo": 10,
                    },
                    "BatchSummary":{
                            "condition": "model.dispatch",
                    },
                    "CreateBatch.debitAccountName":{
                        "resolver": "PaymentBankAccountsLOVConfiguration"
                    },
                    "CreateBatch.modeOfPayment": {
                        "required": false
                    }
                }
            } 
            var getIncludes = function(model) {
                return [                  
                    "CreateBatch",
                    "CreateBatch.paymentDate",
                    "CreateBatch.modeOfPayment",
                    "CreateBatch.branchName",
                    "CreateBatch.spokeName",
                    "CreateBatch.debitAccountName",
                    "CreateBatch.dispatchName",
                    "CreateBatch.beneficiaryName",
                    "CreateBatch.paymentPurpose",
                    "CreateBatch.beneficiaryAccountName",
                    "CreateBatch.submit",
                    "BatchSummary",
                    "BatchSummary.dispatchId",
                    "BatchSummary.dispatchName",
                    "BatchSummary.bankCode",
                    "BatchSummary.count",
                    "BatchSummary.totalAmount",
                    "BatchSummary.downloadButton"
                ]
            }
            return {
                "type": "schema-form",
                "title": "READY_FOR_DISPATCH",
                "subTitle": "",
                initialize: function(model, form, formCtrl) {                   
                    var self = this;                                                     
                    model.authToken = AuthTokenHelper.getAuthData().access_token;
                    model.userLogin = SessionStore.getLoginname();     
                      var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {
                                "CreateBatch":  {
                                "items":{
                                    "submit": {                                         
                                        "type": "button",
                                        "title": "Create Batch",
                                        "onClick": "actions.submit(model, formCtrl, form, $event)"  
                                    }
                                }                                                           
                            },
                            "BatchSummary": {
                                "items": {
                                    "downloadButton" : {
                                    "title": "DOWNLOAD",
                                    "htmlClass": "btn-block",
                                    "icon": "fa fa-download",
                                    "type": "button",
                                    "notitle": true,
                                    "readonly": false,
                                    "onClick": function(model, formCtrl, form, $event) {
                                        var reqdownload = {
                                            auth_data:{auth_token:model.authToken},
                                            report_name :"icici_integration_ircs",
                                            filters: [{"parameter":"dispatch_name","operator":"IN","value":[model.payment.dispatchName]}]
                                        };  
        
                                    $http.post(
                                        irf.BI_BASE_URL + '/newdownload.php',
                                        reqdownload, {
                                            responseType: 'arraybuffer'
                                        }
                                    ).then(function (response) {
                                        var headers = response.headers();
                                        if (headers['content-type'].indexOf('json') != -1 && !headers["content-disposition"]) {
                                            var decodedString = String.fromCharCode.apply(null, new Uint8Array(response.data));
                                            PageHelper.showErrors({
                                                data: {
                                                    error: decodedString
                                                }
                                            });
                                            irfProgressMessage.pop("Reports", "Report download failed.", 5000);
                                            return;
                                        }
                                        var blob = new Blob([response.data], {
                                            type: headers['content-type']
                                        });
                                        if (!$("#reportdownloader").length) {
                                            var l = document.createElement('a');
                                            l.id = "reportdownloader";
                                            document.body.appendChild(l);
                                        }
                                        $("#reportdownloader").css({
                                            "position": "absolute",
                                            "height": "-1px",
                                            "top": "-100px",
                                            "left": "-100px",
                                            "width": "-100px",
                                        });
                                        var link = document.getElementById("reportdownloader");
                                        link.href = window.URL.createObjectURL(blob);
            
                                        if (headers["content-disposition"] && headers["content-disposition"].split('filename=').length == 2) {
                                            var filename = headers["content-disposition"].split('filename=')[1];
                                            link.download = filename.replace(/"/g, "");
                                        } else {
                                            link.download = SessionStore.getLoginname() + '_' + model.selectedReport.name + '_' + moment().format('YYYYMMDDhhmmss');
                                        }
                                        link.click();
                                        irfProgressMessage.pop("Reports", "Report downloaded.", 5000);
                                    }, function (err) {
                                        var decodedString = String.fromCharCode.apply(null, new Uint8Array(err.data));
                                        PageHelper.showErrors({
                                            data: {
                                                error: decodedString
                                            }
                                        });
                                        irfProgressMessage.pop("Reports", "Report download failed.", 5000);
                                    }).finally(function () {
                                        PageHelper.hideLoader();
                                    });                                  
                                        }
                                    }
                                }
                            }
                        }
                        }
                    };
                   
                    PageHelper.showLoader();

                    UIRepository.getPaymentDetails().$promise
                        .then(function(repo) {
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                          })
                        .then(function(form) {                        
                            self.form = form;
                            PageHelper.hideLoader();
                        }); 

                },

                preDestroy: function(model, form, formCtrl, bundlePageObj, bundleModel) {

                },
                eventListeners: {},
                offline: false,
                getOfflineDisplayItem: function(item, index) {},
                form: [],
                schema: {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "type": "object",
                    "properties": {
                        "payment": {
                            "type": "object",
                            "required": [],
                            "properties": {
                                "debitAccountName": {
                                    "title": "DEBIT_ACCOUNT_NAME",
                                    "type": "string"
                                },
                                "debitAccountNumber": {
                                    "title": "DEBIT_ACCOUNT_NO",
                                    "type": "string"
                                }
                            }
                        }
                    }
                },
                actions: {
                    submit: function(model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("payment", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }                       
                        
                        model.payment.currentStage = "ReadyForManualDispatch";
                        model.payment.paymentType = "Manual";
                        PageHelper.showLoader();
                        Payment.search(model.payment).$promise.then(function(resp) {  
                          // response = resp                         
                           if(resp.body.length > 0){
                               var req = {
                                dispatchName :model.payment.dispatchName,
                                paymentsList: resp.body
                                };   
                            Payment.createBatch(req).$promise.then(function(res) {                              //return res;    
                                model.dispatch = res;
                            }, function(err){                                
                                PageHelper.showErrors(err); 
                            }).finally(function() {                       
                                PageHelper.hideLoader();                            
                            });
                           } else {
                                PageHelper.showProgress("payment", "Transaction details are not available for the search.", 5000);
                                PageHelper.hideLoader();                     
                           }                            
                     
                    }, function(errResp) {
                            PageHelper.showErrors(errResp);
                            PageHelper.hideLoader();
                        });                                
                    },
                }
            };
        }
    }
})