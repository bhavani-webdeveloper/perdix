irf.pageCollection.factory("Pages__Management_CentreCRU",
    ["$log","$q", 'Pages_ManagementHelper','PageHelper','formHelper','irfProgressMessage',
        'SessionStore',"$state","$stateParams","Masters","authService",
        function($log, $q, ManagementHelper, PageHelper,formHelper,irfProgressMessage,
                 SessionStore,$state,$stateParams,Masters,authService){

            var populateData = function(model){
                PageHelper.showLoader();
                Masters.get({action:'centre',id:model.centre.id},function(resp,header){
                    
                    var centre = model.centre;
                    var cm = resp.centre_master;
                    var rc = resp.reference_code;
                    var ts = resp.translation;

                    centre.id = cm.id;
                    centre.centre_name = cm.centre_name;
                    centre.version = Number(cm.version);
                    centre.centre_code = cm.centre_code;
                    centre.centre_address = cm.centre_address;
                    centre.status = cm.status;
                    centre.weekly_meeting_day = cm.weekly_meeting_day || "";
                    centre.monthly_meeting_date = cm.monthly_meeting_date || "";
                    centre.monthly_meeting_day = cm.monthly_meeting_day || "";
                    centre.monthly_meeting_time = cm.monthly_meeting_time || "";
                    centre.centre_name_in_local = ts.t_value;
                    centre.language_code = ts.language_code;
                    centre.created_by = cm.created_by;
                    centre.field3 = rc.field3 || "";
                    centre.field4 = rc.field4 || "";
                    centre.field5 = rc.field5 || "" ;


                    PageHelper.hideLoader();
                },function(resp){
                    ManagementHelper.backToDashboard();
                    PageHelper.showProgress('error',"Oops an error occurred",2000);
                    PageHelper.showErrors(resp);
                    PageHelper.hideLoader();
                });

            };
            return {
                "name":"USER_MAINTANENCE",
                "type": "schema-form",
                "title": $stateParams.pageId ? "EDIT_USER" : "ADD_USER",
                "subTitle": branch,
                initialize: function (model, form, formCtrl) {
                    $log.info("User Maintanance loaded");
                    
                    if(!$stateParams.pageId) {

                        PageHelper.showLoader();
                        authService.getUser().then(function (data) {
                            PageHelper.hideLoader();
                            model.centre.created_by = data.login;

                        }, function (resp) {
                            PageHelper.hideLoader();
                        });
                    }
                    else{
                        model.centre.id = $stateParams.pageId;
                        populateData(model);
                    }

                },

                form: [
                    {
                        "type":"box",
                        "title":"CENTRE",
                        "items":[
                            "centre.centre_name",
                            "centre.centre_name_in_local",
                            "centre.language_code",
                            "centre.centre_code",
                            {
                                key:"branch",
                                readonly:true,
                                title:"BRANCH"

                            },
                            {
                                key:"centre.centre_address",
                                type:"textarea"
                            },
                            {
                                key:"centre.status",
                                type:"select"

                            },
                            "centre.weekly_meeting_day",
                            "centre.weekly_meeting_time",
                            "centre.monthly_meeting_date",
                            "centre.monthly_meeting_day",
                            "centre.monthly_meeting_time",
                            "centre.created_by"
                        ]


                    }
                    ,
                    {
                        "type": "actionbox",
                        "items": [{
                            "type": "submit",
                            "title": "SAVE"
                        }]
                    }],
                schema: function() {
                    return ManagementHelper.getCentreSchemaPromise();
                },
                actions: {
                    submit: function(model, form, formName){
                        $log.info("Inside submit()");
                        console.warn(model);
                        if (window.confirm("Save?") && model.centre) {
                            PageHelper.showLoader();
                            if(isNaN(model.centre.version)) model.centre.version=0;
                            model.centre.version = Number(model.centre.version)+1;
                            Masters.post({
                                action:"AddCentre",
                                data:model.centre
                            },function(resp,head){
                                PageHelper.hideLoader();
                                PageHelper.showProgress("add-centre","Done. Centre ID :"+resp.id,2000);
                                ManagementHelper.backToDashboard();
                                console.log(resp);
                            },function(resp){
                                PageHelper.hideLoader();
                                PageHelper.showErrors(resp);
                            });
                        }
                    }
                }
            };
        }]);
