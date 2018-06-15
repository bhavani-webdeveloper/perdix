irf.pageCollection.factory(irf.page("management.ReportMasterCreation"), 
["$log", "$state","ReportMaintenance", "formHelper", "$q", "irfProgressMessage","PageHelper", "Utils", "irfNavigator",
function($log, $state, ReportMaintenance, formHelper, $q, irfProgressMessage,PageHelper, Utils, irfNavigator){

    return {
        "type": "schema-form",
        "title": "REPORT_MANAGEMENT", 
        "subTitle": "",
        initialize: function (model, form, formCtrl) {  
            var defered = $q.defer();  
            var ReportGroupName = [];
            PageHelper.showLoader();
            self = this;

            var p1 = ReportMaintenance.reportGroupName().$promise.then(function(resp) {
                if(model.id === 0 || model.id == null){
                    self.formSource[0].items[0].readonly = false;
                    self.formSource[0].items[1].readonly = false;
                }
                self.formSource[0].items[0].titleMap = resp.DataResponse;
                self.form = self.formSource;
                }, function(errResp) {
                    PageHelper.showErrors(errResp);
                }).finally(function() {
                    PageHelper.hideLoader();
            });  

                var p2 = ReportMaintenance.getConfigurationJson({name: 'reportsFileType.json'}).$promise.then(function(resp) {

                self.formSource[0].items[5].titleMap = resp.file_type;
                self.formSource[0].items[6].titleMap = resp.file_extension;
               
                }, function(errResp) {
                    PageHelper.showErrors(errResp);
                });  
            $q.all([ p1, p2 ]).then(function(value) {

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

            self.formSource[0].items[0].readonly = true;
            self.formSource[0].items[1].readonly = true;

            ReportMaintenance.getReportsById({id:pageId},function(resp,header){

                model = _model;
                DataResponse = resp.DataResponse[0];

                model.report_display_name = DataResponse.report_display_name;
                model.id = DataResponse.id;
                model.group = DataResponse.group;
                model.query = DataResponse.query;
                model.group_by = DataResponse.group_by;
                model.file_type = DataResponse.file_type;
                model.file_extension = DataResponse.file_extension;

                 if(DataResponse.is_header_less){
                    model.is_header_less = 'yes';
                }else{
                    model.is_header_less = 'no';
                }  

                if(DataResponse.is_active){
                    model.is_active = 'yes';
                }else{
                    model.is_active = 'no';
                }      
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
            "title": "REPORT_MASTER_CREATION",
            "items": [
                {
                    key: "group",
                    title:"REPORT_GROUP",
                    type: "select",
                    required: true,
                    readonly: false
                },
                {
                    key: "report_display_name",
                    title:"REPORT_DISPLAY_NAME",
                    required: true,
                    readonly: false,
                },
                {
                    key: "id",
                    type: "hidden",
                },
                {
                    key:"query",
                    title: "REPORT_QUERY",
                    type:"textarea",
                    required: true,
                },
                {
                    key:"group_by",
                    title: "GROUP_BY",
                    type:"textarea"
                },
                 {
                    key:"file_type",
                    title: "FILE_TYPE",
                    type: "select",
                },
                {
                    key:"file_extension",
                    title: "FILE_EXTENSION",
                    type: "select",
                },
                {
                    key:"is_header_less",
                    title: "IS_HEADER_LESS",
                    type:"radios",
                    titleMap:{
                        "yes" : "YES",
                        "no"  : "NO"
                    },
                    required: true,
                },
                {
                    key:"is_active",
                    title: "IS_ACTIVE",
                    type: "radios",
                    titleMap:{
                        "yes" : "YES",
                        "no"  : "NO"
                    },
                    required: true,
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
            },
            {
                "type": "actionbox",
                "condition": "model.customer.id",
                "items": [{
                    "type": "submit",
                    "title": "SUBMIT"
                },{
                    "type": "button",
                    "title": "RELOAD",
                    "icon": "fa fa-refresh",
                    "onClick": "actions.reload(model, formCtrl, form, $event)"
                }]
            }
        ],
        schema: function() {
            return ReportMaintenance.getConfigurationJson({name:"reportManagementInformation.json"}).$promise;
        },
        actions: {
            submit: function(model, form, formName){ 
                    var reportArray = [];
                    var defered = $q.defer();  
                    reportArray.push(model);   
                    PageHelper.showLoader();
                    if(reportArray[0].is_header_less == "yes"){
                        reportArray[0].is_header_less = 1;
                    }else{
                        reportArray[0].is_header_less = 0;
                    }

                    if(reportArray[0].is_active == "yes"){
                        reportArray[0].is_active = 1;
                    }else{
                        reportArray[0].is_active = 0;
                    }
            

                    if(model.id === 0 || model.id == null){
                    ReportMaintenance.reportCreate(reportArray).$promise.then(function(resp){
                       Utils.alert("Reports Created Successfully");
                       irfNavigator.goBack();
                        
                        }, function(errResp){
                            PageHelper.hideLoader();
                            PageHelper.showErrors(errResp);
                            
                        }).finally(function(){
                            PageHelper.hideLoader();
                            return deferred.promise;
                        });
                    }else{
                        ReportMaintenance.reportUpdate(reportArray).$promise.then(function(resp){
                        Utils.alert("Reports Updated Successfully");
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
