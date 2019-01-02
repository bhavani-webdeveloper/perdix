irf.pageCollection.factory(irf.page("customer360.Insurance"), ["$log", "Insurance", "$q", "PageHelper","$stateParams","UIRepository","IrfFormRequestProcessor","Misc","Utils",
    function($log, Insurance, $q, PageHelper,$stateParams,UIRepository,IrfFormRequestProcessor,Misc,Utils) {
            
            var globalListkeys = [];
            var getIncludesFromJson = function(params){};
            var getInsurancePolicyOverrides = function(){

            };
            var getAllIncludesFromJson = function(parentKey,previousKey,object){
                var thisParentKey = previousKey+parentKey;
                var keys =  Object.keys(object);
                if(keys.length<=0)
                    return;
                for(var i = 0;i < keys.length;i++){
                    globalListkeys.push(thisParentKey+keys[i]);
                    if(typeof object[keys[i]].items != "undefined"){
                        previousKey =thisParentKey;
                        getAllIncludesFromJson(keys[i]+".",previousKey,object[keys[i]].items);
                    }
                }
                return;
            };
            var getOverrides = function(){
                return {
                    "InsurancePolicyInformation":{
                        readonly:true
                    },
                    "InsuranceNomineeDetails":{
                        readonly:true
                    },
                    "InsuranceTransactionDetails":{
                        readonly:true
                    },
                };
                var overridesObject = {};
                // overridesObject = Object.assign(getInsurancePolicyOverrides(),overridesObject);
                // overridesObject = Object.assign(getInsurancePolicyOverrides(),overridesObject);
                // overridesObject = Object.assign(getInsurancePolicyOverrides(),overridesObject);
                return overridesObject;
            };
            var getExcludes = function(){
                return [
                    "actionbox",
                    "actionbox.save",
                    "actionboxBeforeSave",
                    "actionboxAfterSave",
                ];
            };
            var getOptions =function(){
                return {
                    "repositoryAdditions":{
                        "insuranceDocuments":{
                            "type":"box",
                            "title":"INSURANCE_DOCUMENTS",
                            "items":{
                                "listOfDocuments":{
                                    "type":"array",
                                    "key":"insurancePolicyDetailsDTO.insuranceDocumentsDTO",
                                    "notitle": "true",
                                    "view": "fixed",
                                    "add": null,
                                    "remove": null,
                                    "items":{
                                        "section":{
                                            "type": "section",
                                            "htmlClass": "row",
                                            "items":{
                                                "selectionList":{
                                                    "type": "section",
                                                    "htmlClass": "col-sm-3",
                                                    "items": {
                                                        "documentTitle":{
                                                            "key": "insurancePolicyDetailsDTO.insuranceDocumentsDTO[].documentCode",
                                                            "notitle": true,
                                                            "titleExpr": "model.insurancePolicyDetailsDTO.insuranceDocumentsDTO[arrayIndex].documentCode",
                                                            "type": "anchor",
                                                            "fieldHtmlClass": "text-bold",
                                                            "onClick": function (model, form, schemaForm, event) {
                                                                var doc = model.insurancePolicyDetailsDTO.insuranceDocumentsDTO[event.arrayIndex];
                                                                Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=" + doc.documentCode + "&record_id=" + doc.insuranceId)
                                                                // Utils.downloadFile(Misc.allFormsDownload());
                                                            }   
                                                        },
                                                    }
                                                }
                                            }    
                                        }
                                    }   
                                },
                                // "downloadAll":{
                                //     "type":"button",
                                //     "title":"DOWNLOAD_ALL_FORMS",
                                //     "condition":"model.insurancePolicyDetailsDTO.productCode == 'PAI-Future Generali India'",
                                //     onClick:function(model,form){
                                //         Utils.downloadFile(Misc.formDownload({formName:"fgi_policy",recordId:model.insurancePolicyDetailsDTO.id}));
                                //     }
                                // },
                                "downloadAll":{
                                    "type": "button",
                                    "title": "DOWNLOAD_FORM",
                                    "condition":"model.insurancePolicyDetailsDTO.productCode == 'PAI-Liberty'",
                                    onClick: function(model,form){
                                        Queries.getInsuranceFormName({productCode : model.insurancePolicyDetailsDTO.productCode}).then(function(resp){
                                            Utils.downloadFile(Misc.formDownload({formName:resp,recordId:model.insurancePolicyDetailsDTO.id}));
                                        })
                                        
                                    }
                                },
                            }
                        }
                    },
                    "additions":{
                        
                    }
                };
            };
            var configFile =function(){

            };
            var getRepositoryAdditions = function(){
                return [
                    "insuranceDocuments",
                    "insuranceDocuments.downloadAll",
                    // "insuranceDocuments.tempDownloadAll",
                    
                    // "insuranceDocuments.listOfDocuments",
                    // "insuranceDocuments.listOfDocuments.section",
                    // "insuranceDocuments.listOfDocuments.section.selectionList",
                    // "insuranceDocuments.listOfDocuments.section.selectionList.documentTitle",
                ]
            };

            return {
                "type": "schema-form",
                "title": "INSURANCE",
                "subTitle": "",
                initialize : function(model,form,formCtrl){
                    var self = this;
                    var formRequest = {
                        "overrides":getOverrides(),
                        "excludes":getExcludes(),
                        "options": getOptions(),
                    };
                        PageHelper.showLoader();
                        if($stateParams.pageId){
                            PageHelper.showLoader();
                            Insurance.getById({ id: $stateParams.pageId }).$promise.then(function(resp){
                                    model.insurancePolicyDetailsDTO = resp;
                                    PageHelper.hideLoader();
                                });
                        };
                        UIRepository.getInsuranceProcessDetails().$promise
                        .then(function(repo){
                            getAllIncludesFromJson("","",repo);
                            formRequest.includes = globalListkeys.concat(getRepositoryAdditions());
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function(form){
                            self.form = form;
                        });
                },
                
               
                form :[],
                schema :function(){
                    return Insurance.getSchema().$promise;
                },
                actions:{
                },

            }
        }])