define({
    pageUID: "management.RuleMaintenance",
    pageType: "Engine",
    dependencies: ["$log","Utils","PagesDefinition","Queries","Lead", "$q",'PageHelper', 'formHelper','irfProgressMessage',
        'SessionStore', "$state", "$stateParams", "RuleMaintenance",'irfSimpleModal'],
    $pageFn: function($log,Utils,PagesDefinition,Queries,Lead, $q, PageHelper, formHelper, irfProgressMessage,
        SessionStore, $state, $stateParams, RuleMaintenance,irfSimpleModal) {

    var NewRuleForm = [{
		"key": "item.ruleName",
		"title": "Rule name",
		"type": "text"
	},{
		"key": "item.ruleDescription",
		"title": "Rule Description",
		"type": "text"
	},{
		"key": "item.order",
		"title": "Order",
		"type": "text"
	},{
		"key": "item.fromStage",
		"title": "From Stage",
		"type": "text"
	}, {
		"key": "item.toStage",
		"title": "To stage",
		"type": "text"
	},{
        type: "section",
        htmlClass: "col-sm-6",
        html: '<div class="form-inline">'+
        '<select ng-options="o.name as o.name for o in operators" ng-model="group.operator" class="form-control input-sm"></select>'+
        '<button style="margin-left: 2px" ng-click="addCondition()" class="btn btn-sm btn-success"><span class="glyphicon glyphicon-plus-sign"></span> Add Condition</button>'+
        '<button style="margin-left: 2px" ng-click="addGroup()" class="btn btn-sm btn-success"><span class="glyphicon glyphicon-plus-sign"></span> Add Group</button>'+
        '<button style="margin-left: 2px" ng-click="removeGroup()" class="btn btn-sm btn-danger"><span class="glyphicon glyphicon-minus-sign"></span> Remove Group</button>'+
    '</div>'
    },{
		"type": "button",
		"title": "validate Rule",
		"onClick": "actions.validateRule(model, formCtrl, form, $event)"
    },{
		"type": "button",
		"title": "Save Rule",
		"onClick": "actions.saveRule(model, formCtrl, form, $event)"
    }];

    var Ruleschema= {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "rule": {
                "type": "object",
                "required": [],
                "properties": {
                    "status": {
                        "title": "STATUS",
                        "type": "string"
                    },
                    "branchName": {
                        "title": "BRANCH_NAME",
                        "type": "integer"
                    },
                    "centreId": {
                        "title": "CENTRE_CODE",
                        "type": "integer"
                    }
                }
            }
        }
    };

    var initialize= function(model) {
        $log.info(model);
    };
    
    	var simpleSchemaFormHtml =
        '    <section class="content">                               '+
        '        <div class="row">                                   '+
        '            <irf-sf                                         '+
        '                initialize= "model.initialize"              '+
        '                irf-schema="model.schema"                   '+
        '                irf-form="model.form"                       '+
        '                irf-actions="model.actions"                 '+
        '                irf-model="model.model"                     '+
        '                irf-helper="model.formHelper"               '+
        '                irf-form-name="model.formName">             '+
        '            </irf-sf>'+
        '        </div>'+
        '    </section>';

        var RuleModel={};

        return {
            "name": "Rule Maintenance",
            "type": "schema-form",
            "title": "Rule Maintenance",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.rule=model.rule||{};
                var self=this;
                $log.info("Create Branch Page loaded");
                RuleModel.formName= 'NewRuleForm';
                RuleModel.formHelper= formHelper;
                RuleModel.form= NewRuleForm;
                RuleModel.schema= Ruleschema;
                RuleModel.model= model;
                RuleModel.actions= self.actions;
                RuleModel.initialize=initialize;

                $log.info(model.createConversationModel);
            },

            form: [
            {
                "type": "box",
                colClass: "col-sm-12",
                "title": "Rule Maintenance",
                "items": [
                {
                    "key": "rule.processName",
                    "title": "Process Name",
                    type: "lov",
                    lovonly: true,
                    outputMap: {
                        "name": "rule.processName"
                    },
                    searchHelper: formHelper,
                    search: function(inputModel, form, model) {
                        var out=[
                            {
                                name:"LoanProcess"
                            },
                            {
                                name:"PaymentsProcess"
                            }
                        ];
                        return $q.resolve({
                            headers: {
                                "x-total-count": out.length
                            },
                            body: out
                        });
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.name
                        ];
                    },
                    onSelect: function(result, model, context) {
                        PageHelper.showLoader();
                        RuleMaintenance.getRules({processName:result.name}).$promise.then(function(res){
                            $log.info(res);
                            if (res && res.body && res.body.length) {
                                model.rule.rules = [];
                                model.rule.stages=[];
                                for (var i = 0; i < res.body.length; i++) {
                                    var a = {
                                        id: res.body[i].id,
                                        expression: res.body[i].expression,
                                        fromStage: res.body[i].fromStage,
                                        order: res.body[i].order,
                                        processName: res.body[i].processName,
                                        ruleDescription: res.body[i].ruleDescription,
                                        ruleName: res.body[i].ruleName,
                                        toStage: res.body[i].toStage,
                                        userExpression: res.body[i].userExpression
                                    };
                                    model.rule.rules.push(a);
                                    model.rule.stages.push({'fromStage':a.fromStage});
                                    
                                };
                            }
                        }).finally(function(){
                            PageHelper.hideLoader();
                        });
                    }
                },{
                    "key": "rule.fromStage",
                    condition: "model.rule.stages.length",
                    "title": "From Stage",
                    bindMap: {"processName": "rule.processName"},
                    type: "lov",
                    lovonly: true,
                    outputMap: {
                        "fromStage": "rule.fromStage"
                    },
                    searchHelper: formHelper,
                    search: function(inputModel, form, model) {
                        var out= _.uniqBy(model.rule.stages,'fromStage');
                        return $q.resolve({
                            headers: {
                                "x-total-count": out.length
                            },
                            body: out
                        });
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.fromStage
                        ];
                    },
                    onSelect: function(result, model, context) {
                        PageHelper.showLoader();
                        RuleMaintenance.getRules({processName:model.rule.processName,fromStage:result.fromStage}).$promise.then(function(res){
                            $log.info(res);
                            if (res && res.body && res.body.length) {
                                model.rule.rules = [];
                                for (var i = 0; i < res.body.length; i++) {
                                    var a = {
                                        id: res.body[i].id,
                                        expression: res.body[i].expression,
                                        fromStage: res.body[i].fromStage,
                                        order: res.body[i].order,
                                        processName: res.body[i].processName,
                                        ruleDescription: res.body[i].ruleDescription,
                                        ruleName: res.body[i].ruleName,
                                        toStage: res.body[i].toStage,
                                        userExpression: res.body[i].userExpression
                                    };
                                    model.rule.rules.push(a);
                                };
                            }
                        }).finally(function(){
                            PageHelper.hideLoader();
                        });
                    }
                },{
                    key: "rule.rules",
                    condition: "model.rule.rules.length",
                    type: "tableview",
                    listStyle: "table",
                    selectable: true,
                    editable: true,
                    paginate: false,
                    searching: false,
                    getColumns: function(){
                        return [{
                            "title": "Rule Name",
                            "data": "ruleName"
                        }, {
                            "title": "Rule Description",
                            "data": "ruleDescription"
                        }, {
                            "title": "Order",
                            "data": "order"
                        }, {
                            "title": "From Stage",
                            "data": "fromStage"
                        },{
                            "title": "To Stage",
                            "data": "toStage"
                        }]
                    },
                    getActions: function() {
                        return [
                            {
                                name: "Edit Rule",
                                desc: "",
                                icon: "fa fa-pencil-square-o",
                                fn: function(item, model) {
                                    $log.info(RuleModel);
                                    RuleModel.model.item=item;
                                    irfSimpleModal('EDIT Rule',simpleSchemaFormHtml,RuleModel);
                                },
                                isApplicable: function (item) {
                                    return true;
                                }
                            },
                            {
                                name: "Delete Rule",
                                desc: "",
                                icon: "fa fa-pencil-square-o",
                                fn: function(item, model) {
                                    Utils.confirm("Please confirm the rule Deletion").then(function(){
                                    PageHelper.showLoader();
                                    irfProgressMessage.pop('Rule-Delete', 'Deleting Rule...');
                                    RuleMaintenance.DeleteRules(item).$promise.then(function(res){
                                        $log.info(res);
                                        PageHelper.hideLoader();
                                    },function(err){
                                        $log.info(err);
                                        PageHelper.hideLoader();
                                    })
                                    });
                                },
                                isApplicable: function (items) {
                                    return true;
                                }
                            }

                        ];
                    },
                    getBulkActions: function() {
                        return [
                            {
                                name: "Edit Rule",
                                desc: "",
                                icon: "fa fa-pencil-square-o",
                                fn: function(items) {
                                    if (items.length == 0) {
                                        PageHelper.showProgress("rule-Edit", "Atleast one loan should be selected for Rule Edit", 5000);
                                        return false;
                                    }
                                },
                                isApplicable: function (items) {
                                    return true;
                                }
                            },
                            
                        ];
                    }
                }]
            },
        
            {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "SUBMIT"
                },{
                    "type": "button",
                    "title": "Add New Rule"
                }]
            }],
            schema: function() {
                 return Lead.getLeadSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {
                    PageHelper.showProgress("Branch Save", "Scoring Details Updated" , 3000);
                    $log.info("Inside submit()");
                    RuleMaintenance.save(model.rule.rules).$promise.then(function(res){
                        $log.info(res);
                    },function(err){
                        $log.info(err);
                    })
                },
                validateRule:function(model, form, formName) {
                    PageHelper.showProgress("rule validate", "validating Rule" , 3000);
                    RuleMaintenance.validateRule(model.item).$promise.then(function(res){
                        $log.info(res);
                        PageHelper.showProgress("rule validate", "Rule is valid" , 3000);
                    },function(err){
                        $log.info(err);
                        PageHelper.showProgress("rule validate", "Rule is invalid" +  err, 3000);
                    })
                }  
            }
        };
    }
})