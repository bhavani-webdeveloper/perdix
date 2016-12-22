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
                "title": "Business Summary",
                "readonly": true,
                "items": [
                    {
                        type: "section",
                        htmlClass: "row",
                        items: [
                            {
                                type: "section",
                                htmlClass: "col-sm-6",
                                items: [
                                    {
                                        title: "Company Name",
                                        key: "business.firstName"
                                    },
                                    {
                                        title: "CONSTITUTION",
                                        key: "business.enterprise.businessConstitution",
                                        type: "select",
                                        enumCode: "constitution"
                                    },
                                    {
                                        title: "BUSINESS_SECTOR",
                                        key: "business.enterprise.businessSector",
                                        type: "select",
                                        enumCode: "businessSector",
                                        parentEnumCode: "businessType",
                                        parentValueExpr:"model.business.enterprise.businessType",
                                    },
                                    {
                                        key: "business.enterprise.businessSubsector",
                                        title: "BUSINESS_SUBSECTOR",
                                        type: "select",
                                        enumCode: "businessSubSector",
                                        parentEnumCode: "businessSector",
                                        parentValueExpr:"model.business.enterprise.businessSector",
                                    },
                                    {
                                       key: "loanAccount.productCategory",
                                       title:"PRODUCT_TYPE",
                                       condition:"model.currentStage!='Application'"
                                    }
                                ]
                            },
                            {
                                type: "section",
                                htmlClass: "col-sm-6",
                                items: [
                                    {
                                        key: "business.customerBranchId",
                                        title:"BRANCH_NAME",
                                        type: "select",
                                        enumCode: "branch_id"
                                    },
                                    {
                                        key:"business.centreId",
                                        type:"select",
                                        title:"CENTRE_NAME",
                                        enumCode: "centre",
                                        parentValueExpr:"model.business.customerBranchId",
                                        parentEnumCode:"branch_id",
                                    },
                                    {
                                        key: "business.enterprise.monthlyTurnover",
                                        title: "MONTHLY_TURNOVER",
                                        type: "amount"
                                    },
                                    {
                                        key: "business.enterprise.monthlyBusinessExpenses",
                                        title: "MONTHLY_BUSINESS_EXPENSES",
                                        type: "amount"
                                    },
                                    {
                                        key: "business.enterprise.avgMonthlyNetIncome",
                                        title: "AVERAGE_MONTHLY_NET_INCOME",
                                        type: "amount"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type": "box",
                "colClass": "col-sm-12",
                "title": "SCORING_DETAILS",
                "items": [
                    {
                        type:"tableview",
                        key:"ScoreDetails[0].Parameters",
                        // title:"SCORING_DETAILS",
                        selectable: false,
                        paginate: false,
                        searching: false,
                        getColumns: function(){
                            return [{
                                title: 'PARAMETER',
                                data: 'ParameterName'
                            }, {
                                title: 'VALUE',
                                data: 'UserInput'
                            }, {
                                title: 'SCORE',
                                data: 'ParamterScore'
                            },{
                                title: 'RESULT',
                                data: 'ParameterPassStatus'
                            }]
                        }
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
        formInitialiize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
            var deferred = $q.defer();
/*
            // Business Summary - starts
            var sFieldsLeft = [], sFieldsRight = [];
            var bsCnt = Math.floor(model.businessSummary.length/2);
            for (i = 0; i < bsCnt; i++) {
                var bs = model.businessSummary[i];
                model.businessSummaryFields[bs.key] = bs.value;
                sFieldsLeft.push({
                    title: bs.key,
                    key: "businessSummaryFields." + bs.key
                });
            }
            for (i = bsCnt; i < model.businessSummary.length; i++) {
                var bs = model.businessSummary[i];
                model.businessSummaryFields[bs.key] = bs.value;
                sFieldsRight.push({
                    title: bs.key,
                    key: "businessSummaryFields." + bs.key
                });
            }
            var businessSummaryForm = {
                type: "box",
                title: "Business Summary",
                colClass: "col-sm-12",
                "readonly": true,
                items: [
                    {
                        type: "section",
                        htmlClass: "row",
                        items: [
                            {
                                type: "section",
                                htmlClass: "col-sm-6",
                                items: sFieldsLeft
                            },
                            {
                                type: "section",
                                htmlClass: "col-sm-6",
                                items: sFieldsRight
                            }
                        ]
                    }
                ]
            };
            // Business SUmmary - ends

            // Scores - starts
            var scoreForms = [];
            for (i in model.scoreDetails) {
                scoreForms.push({
                    type: "box",
                    items: [
                        {
                            type: "tableview",
                            key: "scoreDetails.data",
                            title: model.scoreDetails[i].title,
                            selectable: false,
                            paginate: false,
                            searching: false,
                            getColumns: function(){
                                return model.scoreDetails[i].columns;
                            }
                        }
                    ]
                });
            }
            // Scores - ends

            // Deviation & Mitigation - starts
            var deviationForm = {
                type: "box",
                colClass: "col-sm-12",
                items: [
                    {
                        type: "tableview",
                        key: "deviationDetails.data",
                        title: model.deviationDetails[i].title,
                        selectable: false,
                        paginate: false,
                        searching: false,
                        getColumns: function(){
                            return model.deviationDetails[i].columns;
                        }
                    }
                ]
            };
            // Deviation & Mitigation - ends

            // Sector & Sub-sector - starts
            var sectorSubSectorForm = {
                type: "box",
                colClass: "col-sm-12",
                items: [
                    {
                        type: "tableview",
                        key: "sectorSubSectorDetails.data",
                        title: model.sectorSubSectorDetails[i].title,
                        selectable: false,
                        paginate: false,
                        searching: false,
                        getColumns: function(){
                            return model.sectorSubSectorDetails[i].columns;
                        }
                    }
                ]
            };
            // Sector & Sub-sector - ends

            // Loan recommendations - starts
            var sectorSubSectorForm = {
                type: "box",
                colClass: "col-sm-12",
                items: [
                    {
                        type: "tableview",
                        key: "sectorSubSectorDetails.data",
                        title: model.sectorSubSectorDetails[i].title,
                        selectable: false,
                        paginate: false,
                        searching: false,
                        getColumns: function(){
                            return model.sectorSubSectorDetails[i].columns;
                        }
                    }
                ]
            };
            // Loan recommendations - ends

            this.form = [businessSummaryForm];
            this.form.concat(scoreForms);
            this.form.push(deviationForm);
            this.form.push(sectorSubSectorForm);
*/
            deferred.resolve();
            return deferred.promise;
        },
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        eventListeners: {
            "business-loaded": function(bundleModel, pageModel, eventModel) {
                pageModel.business = eventModel.customer;
            },
            "loan-account-loaded": function(bundleModel, pageModel, eventModel) {
                pageModel.loanAccount = eventModel.loanAccount;
            },
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
