   irf.pageCollection.factory(irf.page("management.ReportsParameterMapping"), ["$log", "RolesPages", "ReportMaintenance", "SessionStore", "PageHelper", "formHelper", "$httpParamSerializer", "AuthTokenHelper", "$filter", "$q", "$http", "irfProgressMessage","Utils","irfNavigator",
     function($log, RolesPages, ReportMaintenance, SessionStore, PageHelper, formHelper, $httpParamSerializer, AuthTokenHelper, $filter, $q, $http, irfProgressMessage, Utils, irfNavigator) {
             
            return {
                "type": "schema-form",
                "title": "REPORTS_MAPPING",
                "subTitle": "",
                initialize: function(model, form, formCtrl) {
                    PageHelper.showLoader();
                    var defered = $q.defer();
                    model.report = {};
                    model.report.role = SessionStore.getUserRole();
                    $log.info(model.report.role.id);
                    model.done = function(val) {
                        return val === 'true' ? true : false;
                    }
                    var self = this;
                    self.form = []; 
                    
                var p1 = ReportMaintenance.reportParametername().$promise.then(function(resp) {
                    self.parameter_name = resp.DataResponse;  
                    self.formSource[1].items[0].items[0].titleMap =  self.parameter_name;                     
                 }, function(errResp) {
                     PageHelper.showErrors(errResp);
                 });


                 var p2 = ReportMaintenance.getConfigurationJson({name:"reportListOperator.json"}).$promise.then(function(resp) {

                    self.param_operator = resp.operators;   
                    self.formSource[1].items[0].items[5].items[0].titleMap = self.param_operator
                                               
                 }, function(errResp) {
                     PageHelper.showErrors(errResp);
                 });
                 
                 var p3 = ReportMaintenance.getConfigurationJson({name:"reportListOperator.json"}).$promise.then(function(resp) {

                    self.param_type = resp.type;   
                    self.formSource[1].items[0].items[1].titleMap =self.param_type;
                                               
                 }, function(errResp) {
                     PageHelper.showErrors(errResp);
                 });
                 var p4 = ReportMaintenance.reportList().$promise.then(function(resp) {
                        RolesPages.getReportsByRole({
                            roleId: model.report.role.id
                        }).$promise.then(function(response) {
                            var object=[];
                            for (i in resp) {
                                if (response && response.body && response.body.length) {
                                    for (j in response.body) {
                                        if (resp[i].value == response.body[j].report_name)
                                        {
                                            object.push(resp[i]);
                                        }
                                    }
                                }
                            }
                            $log.info(object);
                            self.formSource[0].items[0].titleMap = object; 
                             model.report.masterData = object;
                            
                        });
                    }, function(errResp) {
                        PageHelper.showErrors(errResp);
                    });                    
                    $q.all([ p1,p2,p3,p4 ]).then(function(value) {

                        self.form = self.formSource;

                    }).finally(function() {
                        
                        PageHelper.hideLoader();
                    });

                    return defered.promise;
                },
                modelPromise: function(pageId, model) {
                    var self = this;
                    var defered = $q.defer();
                    PageHelper.showLoader();                    
                    return defered;
                },
                form: [],
                formSource: [{
                    "type": "box",
                    "title": "CHOOSE_REPORT",
                    colClass: "col-sm-9",
                    "items": [{
                        "key": "management.report_name",                        
                        "type": "select",
                        onChange: function(modelValue, form, model, formCtrl, event){
                            PageHelper.showLoader();
                        var promise =  ReportMaintenance.reportParameterList({report_name : model.management.report_name}).$promise;
                        promise .then(function(resp) {  
                            model.selectedReport = resp;                              
                            delete model.management._filterCollection;
                            model.management._filterCollection = [];
                            if (model.selectedReport) {
                                for (var i = 0; i < model.selectedReport.length; i++) {
                                    model.management._filterCollection[i] = model.management._filterCollection[i] || {};
                                    if (model.management._filterCollection[i] ) {
                                        model.management._filterCollection[i] = model.selectedReport[i];
                                        model.management._filterCollection[i].operators = JSON.parse(model.selectedReport[i].operators)
                                     } 
                                }
                            }

                            PageHelper.hideLoader();
                        },function(resp){
                            PageHelper.hideLoader();
                            PageHelper.showProgress("Report-mater","An Error Occurred. Failed to fetch Data",5000);                             
                        });

                        }
                    }]
                },
                {
                    type: "box",
                    title: "REPORT_PARAMETERS",                                        
                    condition:"model.management.report_name",
                    colClass: "col-sm-9",
                    items: [
                        {
                            key: "management._filterCollection",
                            type: "array",
                            title: "PARAMETERS_LIST",
                            "titleExpr": "model.management._filterCollection[arrayIndex].name",
                             startEmpty: true,
                            items: [                               
                                {
                                    key: "management._filterCollection[].name",
                                    title:"PARAMETER_NAME", 
                                    type: "select", 
                                     onChange: function(modelValue, form, model, formCtrl, event){ 
                                        for (var i = 0; i < model.management._filterCollection.length; i++) {       
                                           if(i != form.arrayIndex){                                   
                                        if(model.management._filterCollection[i].name == modelValue){
                                            Utils.alert("already selected");
                                        delete model.management._filterCollection[form.arrayIndex].name;
                                        }
                                          }
                                        }                                    
                                    },
                                    required:true                                                                  
                                },
                                {
                                    key: "management._filterCollection[].type",
                                    title:"PARAMETER_TYPE",
                                    type: "select",
                                    required:true 
                                                                    
                                },
                                {
                                    key:"management._filterCollection[].report_query_column_name",
                                    title: "REPORT_QUERY_COLUMN_NAME",
                                    type:"textarea",
                                    required:true
                                    // screenFilter: true
                                },
                                {
                                   key: "management._filterCollection[].query",
                                   title:"PARAMETER_QUERY", 
                                   condition:"model.management._filterCollection[arrayIndex].type == 'select'",
                                   type: "textarea", 
                                  //required:true                               
                                } ,                                                              
                                {
                                    key:"management._filterCollection[].required",
                                    title: "PARAMETER_REQUIRED",
                                    type:"radios",
                                    titleMap:{
                                        1 : "yes",
                                        0 : "No"
                                    }
                                } ,
                                {
                                    key:"management._filterCollection[].operators",
                                    title: "PARAMETER_OPERATORS",
                                    type: "array",                                    
                                    items: [{
                                        key: "management._filterCollection[].operators[]",
                                        title:"PARAMETER_OPERATOR",
                                       type: "select", 
                                        onChange: function(modelValue, form, model, formCtrl, event){ 
                                          
                                          for(var i= 0; i < model.management._filterCollection[form.arrayIndexes[0]].operators.length; i++){
                                            if( i != form.arrayIndex){
                                                if(model.management._filterCollection[form.arrayIndexes[0]].operators[i] == modelValue){
                                                    Utils.alert("already selected");
                                                delete model.management._filterCollection[form.arrayIndexes[0]].operators[form.arrayIndex]
                                                }
                                            }
                                          }                                    
                                    },
                                       required:true,                              
                                    }                                    
                                ]  
                                   
                                }
                            ]
                        }
                    ]
                }
                ,{
                    type: "actionbox",
                    condition:"model.management.report_name",
                    items: [{
                        type: "submit",
                        title: "SUBMIT"
                    },
                    {
                        type: "button",
                        title: "DOWNLOAD_SQL",
                        icon: "fa fa-pencil", 
                        onClick: function(model, form, formName) {
                            var DownloadUrl = irf.BI_BASE_URL_LOCALHOST+'/server-ext/reportmaster/report_parameter_mapping_export_sql.php?report_name='+model.management.report_name;
                            $log.info(DownloadUrl);
                            window.open(DownloadUrl);
                        }                      
                    }]
                },{
                    type: "actionbox",
                    items: [{
                        type: "button",
                        title: "BACK",
                        onClick: function(model, form, formName) {
                            irfNavigator.goBack();
                        }
                    }]
                },
               
            ], schema: function() {
                return ReportMaintenance.getReportSchema().$promise;
            },
                actions: {
                    submit: function(model, form, formName) {
                        var req = {
                            report_name :model.management.report_name,
                            parameter: []
                        };   
                         for (var i = 0; i < model.management._filterCollection.length; i++) {
                            if (model.management._filterCollection[i].name) {
                                var parameter_list = {
                                    report_name: model.management.report_name,
                                    parameter_name: model.management._filterCollection[i].name,
                                    type: model.management._filterCollection[i].type,
                                    operator:JSON.stringify( model.management._filterCollection[i].operators),
                                    query: model.management._filterCollection[i].query,
                                    report_query_column_name: model.management._filterCollection[i].report_query_column_name,
                                    required: model.management._filterCollection[i].required
                                };
                                req.parameter.push(parameter_list);
                           }
                        };
                     Utils.confirm("Are you sure?").then(function() {
                            PageHelper.showLoader();
                            ReportMaintenance.updateReportMapping(req).$promise.then(function(resp) {
                                PageHelper.showProgress("reportsparametermapping-pages", "Page reports parameter mapping updated", 3000);
                            }, function(err) {
                                PageHelper.showErrors(err);
                            }).finally(function() {
                                PageHelper.hideLoader();
                            });
                        });

                    },
                }
            };
        }
    ]);
    