irf.pageCollection.factory(irf.page("management.ForceLogout"),
["$log", "$q","Enrollment", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch","Scoring","AuthTokenHelper",
function($log, $q, Enrollment, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch,Scoring,AuthTokenHelper){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "",
        "subTitle": "",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
            model.currentStage = bundleModel.currentStage;
            model.ScoreDetails = [];
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
                                        "key":"ScoreDetails[0].UserID",
                                        "title":"User ID",
                                      //  readonly:true
                                    },
                                    {
                                        "key":"ScoreDetails[0].UserName",
                                        "title":"User Name",
                                        //readonly:true
                                    }
                                ]
                            }
                        ]
            },
           {
                    type: "actionbox",
                    key:"ScoreDetails[0].submit",
                    items: [
                        {
                            type: "submit",
                            title: "Submit"
                        }
                    ]
            },                 
            
        ],

        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        actions: {
            save: function(customerId, CBType, loanAmount, loanPurpose){
                $log.info("Inside submit()");
                $log.warn(model);
            }
        }

    };
}

]);

