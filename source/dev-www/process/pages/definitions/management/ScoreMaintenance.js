define({
    pageUID: "management.ScoreMaintenance",
    pageType: "Engine",
    dependencies: ["$log","Pages_ManagementHelper","PagesDefinition","Queries","Lead","Enrollment","BranchCreationResource", "$q",'PageHelper', 'formHelper','irfProgressMessage',
        'SessionStore', "$state", "$stateParams", "Masters", "authService"],
    $pageFn: function($log,Pages_ManagementHelper,PagesDefinition,Queries,Lead,Enrollment,BranchCreationResource, $q, PageHelper, formHelper, irfProgressMessage,
        SessionStore, $state, $stateParams, Masters, authService) {

        return {
            "name": "Score Maintenance",
            "type": "schema-form",
            "title": "Score Maintenance",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("Create Branch Page loaded");
                model.branch= model.branch||{};
                model.branch.parentBranchId1="SECURED";
                model.branch.branchName2="Manufacturing";
                model.branch.branchName3="Existing";
                model.branch.branchCode4="Asset Purchase";
                model.branch.branchMailId6="RiskScore1";
                model.branch.branchContactNo14="60";
                model.branch.branchContactNo15="ACTIVE";

                model.branch.scores1= [{
                    "branchContactNo7": "ManagementScore",
                    "branchContactNo8":"20",
                    "params":[{
                        'branchContactNo9':"Age",
                        'branchContactNo10':"Age",
                        'branchContactNo13':"5"
                    },{
                        'branchContactNo9':"Qualification",
                        'branchContactNo10':"Qualification",
                        'branchContactNo13':"3"
                    }]
                },{
                    "branchContactNo7": "BusinessScore",
                    "branchContactNo8":"40",  
                }];
            },

            form: [
            {
                "type": "box",
                "title": "Score Details",
                "items": [
                {
                    "key": "branch.parentBranchId1",
                    "type": "select",
                    "title": "Loan Type",
                    "type": "select",
                    "titleMap":{
                        "All":"All",
                        "SECURED":"SECURED"
                    }
                },{
                    "key": "branch.branchName2",
                    "title": "Business Type",
                    "type": "select",
                    "titleMap":{
                        "All":"All",
                        "Manufacturing":"Manufacturing",
                        "Trading":"Trading"
                    }

                },{
                    "key": "branch.branchName3",
                    "title": "Customer Type",
                    "type": "select",
                    "titleMap":{
                        "New":"New",
                        "Existing":"Existing"
                    }

                },{
                    "key": "branch.branchCode4",
                    "title": "Loan Purpose",
                    "type": "select",
                    "titleMap":{
                        "Asset Purchase":"Asset Purchase",
                        "Working Capital":"Working Capital",
                    }
                },
                {
                    "key": "branch.branchMailId6",
                    "title": "Score name",
                    "type": "string",
                    bindMap: {},
                    searchHelper: formHelper,
                    search: function (inputModel, form, model, context) {
                        var out = [
                            {
                                'name':'RiskScore1',
                                'passvalue':60,
                                'maxscore':5,
                                'status':'ACTIVE'
                            },
                            {
                                'name':'RiskScore2',
                                'passvalue':60,
                                'maxscore':5,
                                'status':'ACTIVE'
                            },
                            {
                                'name':'RiskScore3',
                                'passvalue':60,
                                'maxscore':5,
                                'status':'ACTIVE'
                            }
                        ];
                        return $q.resolve({
                            headers: {
                                "x-total-count": out.length
                            },
                            body: out
                        });
                    },
                    onSelect: function (valueObj, model, context) {
                        model.branch.branchMailId6= valueObj.name;
                        model.branch.branchContactNo15=valueObj.status;
                        model.branch.branchContactNo13=valueObj.maxscore;
                        model.branch.branchContactNo14=valueObj.passvalue;
                    },
                    getListDisplayItem: function (item, index) {
                        return [
                            item.name
                        ];
                    }

                },
                {
                    "key": "branch.branchContactNo14",
                    "type": "string",
                    "title": "Parameter Pass Value",
                },{
                    "key": "branch.branchContactNo15",
                    "title": "Status",
                    "type": "radios",
                    "titleMap":{
                        "ACTIVE":"ACTIVE",
                        "IN ACTIVE":"IN ACTIVE"
                    }
                },

                {
                    "key":"branch.scores1",
                    "title":"Sub Score Details",
                    titleExpr:"model.branch.scores1[arrayIndex].branchContactNo7",
                    type: "array",
                    startEmpty: true,
                    items: [
                        {
                            "key": "branch.scores1[].branchContactNo7",
                            "type": "string",
                            "title": "Sub Score Name",
                        },{
                            "key": "branch.scores1[].branchContactNo8",
                            "type": "string",
                            "title": "Sub Score Weightage",
                        },
                        {
                            "key":"branch.scores1[].params",
                            "title":"Parameter",
                            type: "array",
                            startEmpty: true,
                            titleExpr:"model.branch.scores1[arrayIndexes[0]].params[arrayIndexes[1]].branchContactNo9",
                            items: [
                                {
                                    "key": "branch.scores1[].params[].branchContactNo9",
                                    "type": "string",
                                    "title": "Parameter Name",
                                },{
                                    "key": "branch.scores1[].params[].branchContactNo10",
                                    "type": "string",
                                    "title": "Parameter Display Name",
                                }, {
                                    "key": "branch.scores1[].params[].branchContactNo13",
                                    "type": "string",
                                    "title": "Max Parameter Score",
                                },
                            ]
                        }
                    ]
                }]
            },
        
            {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            }],
            schema: function() {
                 return Lead.getLeadSchema().$promise;  
            },
            actions: {
                submit: function(model, form, formName) {
                    PageHelper.showProgress("Branch Save", "Scoring Details Updated" , 3000);
                    $log.info("Inside submit()");
                }
            }
        };
    }
})