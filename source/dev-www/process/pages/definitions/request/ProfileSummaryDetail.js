define([], function(){

	return {
		pageUID: "request.ProfileSummaryDetail",
		pageType: "Engine",
        dependencies: ["$log", "$q",'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
            'irfProgressMessage','SessionStore',"$state", "$stateParams", "Utils",
            "BundleManager", "IrfFormRequestProcessor","UIRepository", "$injector", "irfNavigator", "Worklist", "$filter"],

        $pageFn: function($log, $q, SchemaResource, PageHelper,formHelper,elementsUtils,
                          irfProgressMessage,SessionStore,$state,$stateParams, Utils,
                          BundleManager, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator, Worklist, $filter) {


          return {
            "type": "schema-form",
            "title": "PROFILE_DETAILS",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.userInfo = {};
                $log.info("Customer Profile Detail got initialized");
                var urn = $stateParams.pageId;
                Worklist.getProfile({
                  userId : urn
                }, function(res) {
                    model.userInfo = res;
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
                                "key": "userInfo.firstName",
                                "title": "CUSTOMER_NAME"
                            }, {
                                "key": "userInfo.email",
                                "title": "EMAIL"
                            }, {
                                "key": "userInfo.mobilePhone",
                                "title": "MOBILE_PHONE"
                            }, {
                                "key": "userInfo.urnNo",
                                "title": "CUSTOMER_URN"
                            }, {
                                "key":"userInfo.doorNo",
                                "title": "DOOR_NO"
                            }, {
                                "key":"userInfo.locality",
                                "title": "LOCALITY"
                            }, {
                                "key":"userInfo.pincode",
                                "title": "PINCODE"
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
                              // "onClick": "actions.save(model, formCtrl, form, $event)"
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
                  var request = {
                    "customerProfileSummaryProcessAction": "PROCEED",
                    "profileSummary": reqData.userInfo
                  }
                  var promise = Worklist.updateProfile(request).$promise;
                  promise.then(function(data) {
                    PageHelper.showProgress('request', 'Update Done.', 5000);
                    irfNavigator.goBack();
                  }, function(err) {
                    PageHelper.showProgress('request', 'Oops. Some error.', 5000);
                    PageHelper.showErrors(err);
                    PageHelper.hideLoader();
                  })
                },
                close: function(model, formCtrl, form, $event) {
                    irfNavigator.goBack();
                }
            }
          };
	     }
   }
})