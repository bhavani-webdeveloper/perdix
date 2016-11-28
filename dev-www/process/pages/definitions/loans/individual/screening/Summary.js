irf.pageCollection.factory(irf.page("loans.individual.screening.Summary"),
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
                "colClass": "col-sm-12",
                "items": [
                            {
                                type:"fieldset",
                                title:"SCREENING_SCORE_REVIEW",
                                items:[]
                            },
                            {
                                key:"customer.firstName",
                                title:"CUSTOMER_NAME",
                                readonly:true,
                                type:"string",
                            },
                            {
                                key:"customer.urnNo",
                                title:"URN_NO",
                                readonly:true,
                                type:"string",
                            },
                            {
                                "type":"array",
                                title: "RELATIONSHIP_TO_BUSINESS",
                                "view": "fixed",
                                "key": "ScoreDetails[0].Parameters",
                                "add": null,
                                "remove": null,
                                "items": [
                                {
                                    "type": "section",
                                    "htmlClass": "row",
                                    "items": [
                                    {
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "title": "PARAMETER",
                                            "readonly": true
                                        }]
                                    },
                                    {
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "title": "VALUE",
                                            "readonly": true
                                        }]
                                    },
                                    {
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "title": "SCORE",
                                            "readonly": true
                                        }]
                                    },
                                    {
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "title": "RESULT",
                                            "readonly": true
                                        }]
                                    }]
                                },
                                {
                                    "type": "section",
                                    "htmlClass": "row",
                                    "items": [
                                    {
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "key": "ScoreDetails[0].Parameters[].ParameterName",
                                            "notitle": true,
                                            "readonly": true
                                        }]
                                    },
                                    {
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "key": "ScoreDetails[0].Parameters[].UserInput",
                                            "notitle": true,
                                            "readonly": true
                                        }]
                                    },
                                    {
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "key": "ScoreDetails[0].Parameters[].ParamterScore",
                                            "notitle": true,
                                            "readonly": true
                                        }]
                                    },
                                    {
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "key": "ScoreDetails[0].Parameters[].ParameterPassStatus",
                                            "notitle": true,
                                            "readonly": true
                                        }]
                                    }]
                                }]
                            },
                            {
                                type:"fieldset",
                                title:"",
                                items:[
                                    {
                                        "key":"ScoreDetails[0].OverallWeightedScore",
                                        "title":"TOTAL_SCREENING_SCORE",
                                        readonly:true
                                    },
                                    {
                                        "key":"ScoreDetails[0].OverallPassStatus",
                                        "title":"OVERALL_PASS_STATUS",
                                        readonly:true
                                    }
                                ]
                            }
                        ]
            }
                            
            
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
