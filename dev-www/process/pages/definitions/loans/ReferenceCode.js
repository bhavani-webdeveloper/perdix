irf.pageCollection.factory(irf.page('loans.ReferenceCode'),
    ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
    ,"LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
    "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils",
    function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils) {


        return {
            "type": "schema-form",
            "title": "UPDATE_REFERENCE_CODE",
            "subTitle": "",
            offline: false,
            form: [
            {
                        //"type": "box",
                        type:"box",
                        title: "REFERENCE_CODE",
                        items: [
                        {
                            "type": "box",
                            "title": "UPDATE_REFERENCE_CODE",
                            "type": "array",
                            "items": [
                            {
                                key: "classifier",
                                title: "CLASSIFIER_NAME",
                                type: "lov",
                                fieldType: "text",//number/text
                                //autolov: true,
                                lovonly: true,
                                inputMap: {
                                    "id": ".currentRoleId",
                                },
                                outputMap: {
                                    "id": "rolePage.currentRoleId",
                                    "name": "rolePage.currentRoleName"
                                },
                                searchHelper: formHelper,
                                search: function(inputModel, form, model) {
                                    return RolesPages.allRoles().$promise;
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                    item.id,
                                    item.name
                                    ];
                                },
                                onSelect: function(result, model, context) {
                                    PageHelper.showLoader();
                                    RolesPages.allPages({roleId:result.id}).$promise.then(function(result){
                                        if (result && result.body && result.body.length) {
                                            model.rolePage.access = [];
                                            for (var i = 0; i < result.body.length; i++) {
                                                var a = {
                                                    id: result.body[i].id, // page_id
                                                    uri: result.body[i].uri,
                                                    rpa_id: result.body[i].rpa_id,
                                                    page_config: result.body[i].page_config,
                                                    access: !!result.body[i].rpa_id
                                                };
                                                model.rolePage.access.push(a);
                                            };
                                        }
                                    }).finally(function(){
                                        PageHelper.hideLoader();
                                    });
                                }
                            },
                            {
                                key: "rolePage.access",
                                condition: "model.rolePage.access.length",
                                type: "array",
                                add: null,
                                remove: null,
                                titleExpr: "(model.rolePage.access[arrayIndex].access?'⚫ ':'⚪ ') + model.rolePage.access[arrayIndex].uri",
                                items: [
                                {
                                    type: "section",
                                    htmlClass: "row",
                                    items: [
                                    {
                                        type: "section",
                                        htmlClass: "col-sm-3",
                                        items: [
                                        {
                                            key: "rolePage.access[].access",
                                            title: "Allow Access",
                                            type: "checkbox",
                                            fullwidth: true,
                                            schema: { default:true }
                                        }
                                        ]
                                    },
                                    {
                                        type: "section",
                                        htmlClass: "col-sm-9",
                                        items: [
                                        {
                                            key: "rolePage.access[].page_config",
                                            title: "Config",
                                            type: "textarea"
                                        }
                                        ]
                                    }
                                    ]
                                }
                                ]
                            },
                           /* {
                                key:".classifierName",
                                title: "CLASSIFIER_NAME",
                                readonly:true
                            },*/
                            {
                                key: ".name",
                                //readonly: true,
                                title: "NAME",
                                type: "textarea"
                            },
                            {
                                key: ".code",
                                title: "CODE",
                                type: "textarea"
                            },
                           // "repayment.repaymentDate",
                          //  "repayment.cashCollectionRemark",
                          {
                            key:".parentClassifier",
                            title:"PARENT_CLASSIFIER",
                            "type":"text",
                            "required": true,
                            readonly:true   
                        },
                        {
                            key: ".parentCode",
                            readonly: true,
                            title: "PARENT_CODE",
                            type: "text"
                        },
                        {
                            key: ".field1",
                            title: "FIELD1",
                            type: "textarea"
                        },{
                            key: ".field2",
                            title: "FIELD2",
                            type: "textarea"
                        },{
                            key: ".field3",
                            title: "FIELD3",
                            type: "textarea"
                        },{
                            key: ".field4",
                            title: "FIELD4",
                            type: "textarea"
                        },{
                            key: ".field5",
                            title: "FIELD5",
                            type: "textarea"
                        }
                        ]
                    }
                    ]
                },

                {
                    "type":"actionbox",
                    "items": [
                    {
                        "type":"submit",
                        "style":"btn-theme",
                        "title":"SUBMIT"

                    }
                    ]
                }
                ],
                schema: 
                {
                  "$schema": "http://json-schema.org/draft-04/schema#",
                  "type": "object",
                  "properties": {
                    "classifier": {
                      "type": "string"
                  },
                  "code": {
                      "type": "string"
                  },
                  "field1": {
                      "type": "string"
                  },
                  "field2": {
                      "type": "string"
                  },
                  "field3": {
                      "type": "string"
                  },
                  "field4": {
                      "type": "string"
                  },
                  "field5": {
                      "type": "string"
                  },
                  "id": {
                      "type": "integer"
                  },
                  "name": {
                      "type": "string"
                  },
                  "parentClassifier": {
                      "type": "string"
                  },
                  "parentReferenceCode": {
                      "type": "string"
                  },
                  "version": {
                      "type": "integer"
                  }
              },
              "required": [
              ]
          },
          actions: {
            preSave: function (model, formCtrl) {
                var deferred = $q.defer();
                model._storedData = null;
                deferred.resolve();
                return deferred.promise;
            },
            submit: function (model, formCtrl, formName) {
                if (model.repayment.demandAmount > 0 && model.repayment.transactionName == "Advance Repayment"){
                    PageHelper.showProgress("loan-repay","Advance Repayment is not allowed for an outstanding Loan",5000);
                    return false;
                }
                $log.info("Inside submit");
                if(window.confirm("Are you Sure?")){
                    PageHelper.showLoader();
                    var postData = _.cloneDeep(model.repayment);
                    postData.amount = parseInt(Number(postData.amount))+"";
                    postData.instrument = model.repayment.instrument;
                    LoanAccount.repay(postData,function(resp,header){
                        $log.info(resp);
                        try{
                            alert(resp.response);
                            PageHelper.navigateGoBack();
                        }catch(err){

                        }
                    },function(resp){
                        PageHelper.showErrors(resp);
                    }).$promise.finally(function(){
                        PageHelper.hideLoader();
                    });

                }
            }
        }
    }
}]);
