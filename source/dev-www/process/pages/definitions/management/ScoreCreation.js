irf.pageCollection.factory(irf.page("management.ScoreCreation"),
["$log", "$state","ScoresMaintenance", "formHelper", "$q", "irfProgressMessage","ReportsMaintenance","PageHelper", "Utils", "irfNavigator",
function($log, $state, ScoresMaintenance, formHelper, $q, irfProgressMessage,ReportsMaintenance,PageHelper, Utils, irfNavigator){

    return {
        "type": "schema-form",
        "title": "SCORE_CREATION",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            var defered = $q.defer();
            var ReportGroupName = [];
            var resp_array=[];
            PageHelper.showLoader();
            self = this;
            var p1 = ScoresMaintenance.allCriteria().$promise.then(function(resp) {
                console.log(resp);
                resp_array=resp.body;
                var flags = [], output = [], l = resp_array.length, i;
                for( i=0; i<l; i++) {
                    if( flags[resp_array[i].criteriaName]) continue;
                    flags[resp_array[i].criteriaName] = true;
                    output.push({
                        name: resp_array[i].criteriaName, 
                        value:  resp_array[i].criteriaName
                    });
                }
                self.formSource[0].items[7].items[0].titleMap = output;
                self.form = self.formSource;
                }, function(errResp) {
                    PageHelper.showErrors(errResp);
                }).finally(function() {
                    PageHelper.hideLoader();
            });

            $q.all([ p1]).then(function(value) {

                self.form = self.formSource;

            }).finally(function() {

                PageHelper.hideLoader();
            });

        },
        modelPromise: function(pageId, _model) {
            self = this;
            var defered = $q.defer();
            if(!pageId) {
                return deferred.promise;
            }
            PageHelper.showLoader();
            // irfProgressMessage.pop("enrollment-save","Loading Reports Data...");

            //self.formSource[0].items[0].readonly = true;
           // self.formSource[0].items[0].readonly = true;
            ScoresMaintenance.getScoresById({id:pageId},function(resp,header){

               model = _model;
                DataResponse = resp.body;

                model.scoreMaster.scoreName = DataResponse.scoreMaster.scoreName;
                model.scoreMaster.stage = DataResponse.scoreMaster.stage;
                model.scoreMaster.scoreId = pageId;
                model.scoreMaster.order = DataResponse.scoreMaster.order;
                model.scoreMaster.partnerOrSelf = DataResponse.scoreMaster.partnerOrSelf;
                model.scoreMaster.overallPassvalue = DataResponse.scoreMaster.overallPassvalue;
                model.scoreMaster.maxScoreValue = DataResponse.scoreMaster.maxScoreValue;
                model.scoreMaster.status=DataResponse.scoreMaster.status;
                model.scoreMaster.scoreCriterias=DataResponse.scoreMaster.scoreCriterias;
            },function(resp){
                deferred.resolve(resp);
                PageHelper.hideLoader();
                   }, function(err){
                defered.reject(err);
                PageHelper.hideLoader();
            });
            return defered.promise;

        },
        form: [ ],
        formSource: [{
            "type": "box",
            colClass: "col-sm-9",
            "title": "SCORE_CREATION",
            "items": [
                {
                    "key":"scoreMaster.scoreName",
                    "title": "SCORE_NAME",
                    "type":"text",
                    "required": true,
                },
                {
                    "key":"scoreMaster.stage",
                    "title": "STAGE",
                    "type": "select",
                    "enumCode": "origination_stage",
                    "required": true
                },
                {
                    "key":"scoreMaster.order",
                    "title": "ORDER",
                    "type":"text",
                    "required": true,
                },
                {
                    "key": "scoreMaster.scoreId",
                    "type": "hidden",
                },
                {
                    "key":"scoreMaster.partnerOrSelf",
                    "title":"PARTNER_SELF",
                    "type": "select",
                    "enumCode": "partner",
                },
                {
                    "key":"scoreMaster.overallPassvalue",
                    "title": "OVER_ALL_PASS_VALUE",
                    "type":"text",
                    "required": true,
                },
                {
                    "key":"scoreMaster.maxScoreValue",
                    "title": "MAX_SCORE",
                    "type":"text",
                    "required": true,
                },
                {
                    "key":"scoreMaster.scoreCriterias",
                    "type": "array",    
                    "title":"CRITERIA",
                    "items": [{
                        "key" :"scoreMaster.scoreCriterias[].criteriaName",
                        "startEmpty": true,
                        "title": "CRITERIA_NAME",
                        "type":"select",
                        "required": true,
                        "onChange": function(modelValue, form, model, formCtrl, event) {
                            for (var i = 0; i < model.scoreMaster.scoreCriterias.length; i++) {       
                                if(i != form.arrayIndex){                                   
                             if(model.scoreMaster.scoreCriterias[i].criteriaName == modelValue){
                                 Utils.alert("already selected");
                             delete model.scoreMaster.scoreCriterias[form.arrayIndex].criteriaName;
                             }
                               }
                             }   
                            delete model.scoreMaster.scoreCriterias.criteriaValue;
                        }
                        },
                        {
                        "key" :"scoreMaster.scoreCriterias[].criteriaValue",
                        "startEmpty": true,
                        "title": "CRITERIA_VALUE",
                        "type":"lov",
                        "required": true,
                        "condition":"model.scoreMaster.scoreCriterias[arrayIndex].criteriaName",
                        lovonly: true,
                        searchHelper: formHelper,
                        search: function(inputModel, form, model,context) {
                            var defered = $q.defer();
                            ScoresMaintenance.allCriteria().$promise.then(
                                function(data){
                                    var resp_array=[];
                                    resp_array=data.body;
                                    var output = [], l = resp_array.length, i;
                                    for( i=0; i<l; i++) {
                                        if(resp_array[i].criteriaName==model.scoreMaster.scoreCriterias[context.arrayIndex].criteriaName){
                                        output.push({
                                            name: resp_array[i].criteriaValue, 
                                            value:  resp_array[i].criteriaValue
                                        });
                                    }
                                    }
                                    defered.resolve({
                                        headers: {
                                            "x-total-count": output.length
                                        },
                                        body: output
                                    });
                                }, function(err){
                                defered.reject(err);
                            });
                            return defered.promise;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.name
                            ];
                        },
                        onSelect: function(result, model, context) {
                            model.scoreMaster.scoreCriterias[context.arrayIndex].criteriaValue = result.value;
                            model.scoreMaster.scoreCriterias[context.arrayIndex].status='ACTIVE';
                            model.scoreMaster.scoreCriterias[context.arrayIndex].scoreName=model.scoreMaster.scoreName;
                        }
                    }
                    
                        
                    ]
                },
                {
                    "key":"scoreMaster.status",
                    "title":"STATUS",
                    "type": "select",
                    "titleMap": [{
                        "value": 'ACTIVE',
                        "name": "Active"
                    },{
                        "value": 'INACTIVE',
                        "name": "InActive"
                    }]
                },
            ]
        },
            {
                "type": "actionbox",
                "condition": "!model.customer.id",
                "items": [
                {
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            }
        ],
        schema: function() {
            return ReportsMaintenance.getConfigurationJson({name:"reportManagementInformation.json"}).$promise;
        },
        actions: {
            submit: function(model, form, formName){
                if(model.scoreMaster.scoreId === 0 || model.scoreMaster.scoreId == null){
                    model.scoreMaster.status='ACTIVE';
                ScoresMaintenance.scoreCreate(model).$promise.then(function(resp){
                        Utils.alert("Score Created Successfully");
                        irfNavigator.goBack();
                        deferred.resolve(resp);
                        }, function(errResp){
                            PageHelper.showErrors(errResp);
                        }).finally(function(){
                            PageHelper.hideLoader();
                        });
                } else {
                    ScoresMaintenance.scoreUpdate(model).$promise.then(function(resp){
                        Utils.alert("Score Updated Successfully");
                        irfNavigator.goBack();
                        deferred.resolve(resp);
                        }, function(errResp){
                            PageHelper.showErrors(errResp);
                        }).finally(function(){
                            PageHelper.hideLoader();
                        });    
                }  

            }
        }
    };
}]);
