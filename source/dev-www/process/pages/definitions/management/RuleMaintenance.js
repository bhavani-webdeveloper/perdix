define({
    pageUID: "management.RuleMaintenance",
    pageType: "Engine",
    dependencies: ["$log","Utils","PagesDefinition","Queries","Lead", "$q",'PageHelper', 'formHelper','irfProgressMessage',
        'SessionStore', "$state", "$stateParams", "RuleMaintenance",'irfSimpleModal'],
    $pageFn: function($log,Utils,PagesDefinition,Queries,Lead, $q, PageHelper, formHelper, irfProgressMessage,
        SessionStore, $state, $stateParams, RuleMaintenance,irfSimpleModal) {



    var NewRuleForm = [{
		"key": "item.processName",
		"title": "Process name",
		"type": "text"
	},{
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
    },
    {
		"key": "item.userExpression",
		"title": "Rule Expression",
		"type": "testarea"
    },
    {
        type: "section",
        "key":"item.userquery",
        html:"<query-builder title='query-builder' fields='model.options.fields' operators='model.options.operators' comparators='model.options.comparators' group='model.item.ruleExpression.group' settings='model.options.settings' ></query-builder>"
    },
    {
		"type": "button",
		"title": "Generate Expression",
		"onClick": "actions.validateRule(model.item.ruleExpression.group,model)"
    },
    {
		"type": "button",
        "title": "Create Rule",
        "condition":"model.type=='Create'",
		"onClick": "actions.createNewRule(model)"
    }, 
];

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

                model.options = {};

                RuleMaintenance.getRuleParams().$promise.then(function(res){
                    console.log(res);
                    for(i in res){
                        res[i].id= Number(i)+1;
                        res[i].name=res[i].displayName;
                        res[i].value='${'+res[i].displayName+'}';
                    }
                    model.options.fields= res;
                },function(err){
                    console.log(err);
                    model.options.fields = [
                        {
                          id: 1,
                          value:'${Gender}',
                          name: 'Gender',
                          options: [
                            { name: 'male', id: 1,value:'male'},
                            { name: 'female', id: 2,value:'female'}
                          ],
                          disabledComparators: [
                            3, 4, 5, 6
                          ]
                        },
                        {
                          id: 2,
                          value:'${Age}',
                          name: 'Age'
                        },
                        {
                          name: 'Favorite city', id: 3,
                          value:'${Favorite city}',
                          options: [
                            { name: 'paris', id: 1 ,value:'paris'},
                            { name: 'london', id: 2 ,value:'london'},
                            { name: 'brussels', id: 3 ,value:'brussels'}
                          ],
                          disabledComparators: [
                            3, 4, 5, 6
                          ]
                        }
                      ];
                });

                 model.options.comparators = [
                    { id: 1, name: 'equal to', value: '=='},
                    { id: 2, name: 'not equal to', value: '!=' },
                    { id: 3, name: 'smaller than', value: '<' },
                    { id: 4, name: 'smaller than or equal to', value: '<=' },
                    { id: 5, name: 'greater than', value: '>' },
                    { id: 6, name: 'greater than or equal to', value: '>=' },
                  ];
                  
                 model.options.operators = [
                    { name: 'AND', value: '&&' },
                    { name: 'OR', value: '||' }
                  ];
                  
                 model.options.settings = {
                    nesting: true,
                    addIconClass: 'glyphicon glyphicon-plus',
                    removeIconClass: 'glyphicon glyphicon-minus',
                    addButtonClass: 'btn btn-sm btn-success',
                    removeButtonClass: 'btn btn-sm btn-danger'
                  }     
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
                                        version: res.body[i].version,
                                        expression: res.body[i].expression,
                                        fromStage: res.body[i].fromStage,
                                        order: res.body[i].order,
                                        processName: res.body[i].processName,
                                        ruleDescription: res.body[i].ruleDescription,
                                        ruleName: res.body[i].ruleName,
                                        toStage: res.body[i].toStage,
                                        userExpression: res.body[i].userExpression||res.body[i].expression
                                        
                                    };
                                    a.ruleExpression = {
                                        group: {
                                          operator: model.options.operators[0], rules: []
                                        }
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
                    "type": "button",
                    "title": "Update Rule",
                    "onClick": "actions.saveRule(model, form, formName)"
                },{
                    "type": "button",
                    "title": "Add New Rule",
                    "onClick": "actions.createRule(model, form, formName)"
                }]
            }],
            schema: function() {
                 return Lead.getLeadSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {
                },
                createRule:function(model, form, formName) {
                    RuleModel.model.item={};
                    RuleModel.model.type="Create";
                    RuleModel.model.item.ruleExpression = {
                        group: {
                          operator: model.options.operators[0], rules: []
                        }
                    };
                    irfSimpleModal('Create Rule',simpleSchemaFormHtml,RuleModel);
                },
                createNewRule:function(model, form, formName) {
                    PageHelper.showProgress("new rule Save", "rule Creating" , 3000);
                    $log.info("Inside submit()");
                    var rules=[];var reqData={};
                    rules.push(model.item);
                    reqData.rules=rules;
                    RuleMaintenance.save(reqData).$promise.then(function(res){
                        $log.info(res);
                    },function(err){
                        $log.info(err);
                    })
                },
                saveRule: function(model, form, formName) {
                    PageHelper.showProgress("Branch Save", "Scoring Details Updated" , 3000);
                    $log.info("Inside submit()");
                    var reqData={};
                    reqData.rules=model.rule.rules;
                    RuleMaintenance.save(reqData).$promise.then(function(res){
                        $log.info(res);
                    },function(err){
                        $log.info(err);
                    })
                },
                validateRule:function(group,model) {
                    PageHelper.showProgress("rule validate", "validating Rule" , 3000);
                    var query= RuleMaintenance.asString(group);
                    model.item.userExpression=query;
                    var rules=[];var reqData={};
                    rules.push(model.item);
                    reqData.rules=rules;
                    RuleMaintenance.validateRule(reqData).$promise.then(function(res){
                        $log.info(res);
                        PageHelper.showProgress("rule validate", "Rule is valid" , 3000);
                    },function(err){
                        $log.info(err);
                        PageHelper.showProgress("rule validate", "Rule is invalid" +  err, 3000);
                    })
                },
            }
        };
    }
})