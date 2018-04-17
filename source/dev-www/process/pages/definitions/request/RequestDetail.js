define([], function(){

	return {
		pageUID: "request.RequestDetail",
		pageType: "Engine",
        dependencies: ["$log", "$q",'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
            'irfProgressMessage','SessionStore',"$state", "$stateParams", "Utils",
            "BundleManager", "IrfFormRequestProcessor","UIRepository", "$injector", "irfNavigator", "Worklist", "$filter"],

        $pageFn: function($log, $q, SchemaResource, PageHelper,formHelper,elementsUtils,
                          irfProgressMessage,SessionStore,$state,$stateParams, Utils,
                          BundleManager, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator, Worklist, $filter) {

          var branchId = SessionStore.getCurrentBranch();
          return {
            "type": "schema-form",
            "title": "REQUEST_DETAIL",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("Request Detail got initialized");
                model.reqDetail = {};
                var id = $stateParams.pageId;
                Worklist.get({
                  id : id
                }, function(res) {
                model.reqDetail= res;
                model.reqDetail.branchName = branchId.branchName;
                console.log(model.reqDetail)
                  formCtrl.redraw();
                })

            },
            offline: false,
            form: [
                  {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "title": "Basic Information",
                    "overrideType": "default-view",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "reqDetail.branchName",
                                "title": "HUB_NAME"
                            }, {
                                "key": "reqDetail.customerName",
                                "title": "CUSTOMER_NAME"
                            }, {
                                "key": "reqDetail.customerUrn",
                                "title": "CUSTOMER_URN"
                            }, {
                                "key": "reqDetail.requestType",
                                "title": "REQUEST_TYPE"
                            }, {
                                "key": "reqDetail.requestDate",
                                "title": "REQUEST_DATE"
                            }]
                        }]
                    }]
                  },
                  {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "title": "REQUEST_INFORMATION",
                    "overrideType": "default-view",
                    "condition": "model.reqDetail.requestType == 'tranche'",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "reqDetail.loanId",
                                "title": "LOAN_ID"
                            }, {
                                "key": "reqDetail.udf1",
                                "title": "TRANCHE_CONDITION"
                            }, {
                                "key": "reqDetail.udf2",
                                "title": "TRANCHE_CONDITION_STATUS"
                            },{
                                "key": "reqDetail.udf3",
                                "title": "PHOTO_CAPTURE",
                                "type": "file",
                                "fileType": "image/*",
                                "category": "CustomerEnrollment",
                                "subCategory": "PHOTO"
                            },{
                                "key": "reqDetail.udf4",
                                "title": $filter("translate")("LOCATION"),
                                "type": "geotag",
                                "latitude": "reqDetail.udf4",
                                "longitude": "reqDetail.udf5"
                            }]
                        }]
                    }]
                  },
                  {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "title": "REQUEST_INFORMATION",
                    "overrideType": "default-view",
                    "condition": "model.reqDetail.requestType == 'pre-closure'",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "reqDetail.loanId",
                                "title": "LOAN_ID"
                              },
                              {
                                "key": "reqDetail.udf1",
                                "title": "OUTSTANDING_AMOUNT"
                              },
                              {
                                "key": "reqDetail.udf2",
                                "type": "date",
                                "title": "REQUEST_PRE_CLOSURE_BY"
                              }]
                        }]
                    }]
                  },
                  {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "title": "REQUEST_INFORMATION",
                    "overrideType": "default-view",
                    "condition": "model.reqDetail.requestType == 'loc-renewal'",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "reqDetail.udf1",
                                "title": "Do you want to renew LOC?",
                                "enumCode": "decisionmaker1",
                                "type": "select"
                              },
                              {
                                "key": "reqDetail.udf2",
                                "title": "Do you want to increase limit?",
                                "enumCode": "decisionmaker1",
                                "type": "select"
                              },
                              {
                                "key": "reqDetail.udf3",
                                "condition": "model.reqDetail.udf2 == 'yes'",
                                "title": "LIMIT_VALUE",
                                "type": "amount"
                              },
                              {
                                "key": "reqDetail.udf4",
                                "title": "REQUIRED_BY"
                              }]
                        }]
                    }]
                  },
                  {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "title": "REQUEST_HISTORY",
                    "overrideType": "default-view",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "reqDetail.requestDate",
                                "title": "REQUEST_DATE"
                            }, {
                                "key": "reqDetail.subProcessStatus",
                                "title": "STATUS"
                            }, {
                                "key": "reqDetail.requestorRemarks",
                                "title": "REMARKS"
                            }]
                        }]
                    }]
                  },
                  {
                    "type": "box",
                    "colClass": "col-sm-12",
                    "title": "REQUEST_STATUS",
                    // "overrideType": "default-view",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "reqDetail.subProcessStatus",
                                "title": "STATUS",
                                "type": "select",
                                "enumCode": "request_type"
                            }, {
                                "key": "reqDetail.requestorRemarks",
                                "title": "REMARKS"
                            }]
                        }]
                    }]
                  },
                  {
                      "type": "actionbox",
                      "items": [
                          {
                              "type": "button",
                              "icon": "fa fa-circle-o",
                              "title": "CUSTOMER_360",
                              "onClick": "actions.gotoCustomer(model, formCtrl, form, $event)"
                          },
                          {
                              "type": "button",
                              "icon": "fa fa-circle-o",
                              "title": "UPDATE",
                              "onClick": "actions.update(model, formCtrl, form, $event)"
                          },
                          {
                              "type": "button",
                              "icon": "fa fa-circle-o",
                              "title": "CLOSE",
                              "onClick": "actions.close(model, formCtrl, form, $event)"
                          }]
                  }
                  ],
            schema: function() {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            actions: {
                update: function(model, formCtrl, form, $event) {
                  $log.info("Inside Update");
                  PageHelper.clearErrors();
                  PageHelper.showLoader();
                  PageHelper.showProgress('request', 'Updating Request');
                  var reqData = _.cloneDeep(model);
                  $log.info(reqData);
                  var promise = Worklist.update(reqData.tranche).$promise;
                  promise.then((data)=>{
                      PageHelper.showProgress('request', 'Update Done.', 5000);
                      irfNavigator.goBack();
                  },(err)=>{
                      PageHelper.showProgress('request', 'Oops. Some error.', 5000);
                      PageHelper.showErrors(err);
                      PageHelper.hideLoader();
                  })
                },close: function(model, formCtrl, form, $event) {
                    irfNavigator.goBack();
                },
                gotoCustomer: function(model, formCtrl, form, $event) {
                    var customerId = model.reqDetail.customerId;
                    $state.go("Page.Customer360",{
                        pageId:customerId
                    });
                }
            }
          };
	     }
   }
})