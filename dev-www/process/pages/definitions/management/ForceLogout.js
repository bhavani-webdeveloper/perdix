irf.pageCollection.factory(irf.page("management.ForceLogout"),
["$log", "$q","Logout","Enrollment", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch","Scoring","AuthTokenHelper",
function($log, $q, Logout,Enrollment, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch,Scoring,AuthTokenHelper){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "",
        "subTitle": "",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
            model.currentStage = bundleModel.currentStage;
            model.customer = model.customer|| {};
            model.customer = {};
            if (_.hasIn(model, 'cbModel')){

                Scoring.get({
                    auth_token:AuthTokenHelper.getAuthData().access_token,
                    LoanId:model.cbModel.loanId,
                    ScoreName:model.cbModel.scoreName
                },function(httpres){
                    model.ScoreDetails = httpres.ScoreDetails;
                },function (errResp){

                });
                Enrollment.getCustomerById({id:model.cbModel.customerId})
                    .$promise
                    .then(function(res){
                        model.customer = res;
                    }, function(httpRes){
                        PageHelper.showErrors(httpRes);
                    })
                    .finally(function(){
                        PageHelper.hideLoader();
                    })
            } 
        },
        eventListeners: {
        },
        
        form: [
            {
                "type": "box",
                "title": "Emplyoee Profile",
                "colClass": "col-sm-12",

                "items": [
                            {
                                type:"fieldset",
                                title:"",
                                items:[
                                    {
                                        "key":"customer.userId",
                                        "title":"User ID",
                                      //  readonly:true
                                    },
                                    {
                                        "key":"customer.userName",
                                        "title":"User Name",
                                        //readonly:true
                                    }
                                ]
                            }
                        ]
            },
           {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Submit"
                    }]
                },             
            
        ],
        schema: 
                {
                  "$schema": "http://json-schema.org/draft-04/schema#",
                  "type": "object",
                  "properties": {
                    "customer": {
                    "type": "object",
                    "required": [],
                    "properties": {
                        "userId": {
                      "type": "string"
                  },
                  "userName": {
                      "type": "string"
                  }, 
                    }
                    
              }
          }
             
          },
        actions: {
            submit: function(model, form, formName){
                $log.info("Inside submit()");
                Logout.forceLogOut({
                            userId: model.customer.userId
                        }).$promise.then(
                                function(response) {
                                    PageHelper.hideLoader();
                                    PageHelper.showProgress("forcelogout", "Done.", 2000);
                                },
                                function(errorResponse) {
                                    PageHelper.hideLoader();
                                    PageHelper.showErrors(errorResponse);
                                }
                            ); 
            }
        }

    }
}

]);

