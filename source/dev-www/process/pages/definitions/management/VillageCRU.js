

irf.pageCollection.factory("Pages__Management_VillageCRU",
["$log","$q", 'Pages_ManagementHelper','PageHelper','formHelper','irfProgressMessage',
'SessionStore',"$state","$stateParams","Masters","authService",
function($log, $q, ManagementHelper, PageHelper,formHelper,irfProgressMessage,
	SessionStore,$state,$stateParams,Masters,authService){

	var branch = SessionStore.getBranch();
	var branchId = SessionStore.getBranchId();
    var populateData = function(model){
        PageHelper.showLoader();
        Masters.get({action:'village',id:model.village.id},function(resp,header){

            var village = model.village;
            var vm = resp.village_master;
            var rc = resp.reference_code;
            var ts = resp.translation;

            village.id = vm.id;
            village.village_name = vm.village_name;
            village.version = Number(rc.version);
            village.pincode = Number(vm.pincode);
            village.fregcode = Number(vm.fregcode);
            village.village_name_in_local = ts.t_value;
            village.language_code = ts.language_code;
            village.created_by = vm.created_by;
            village.field1 = rc.field1 || "";
            village.field2 = rc.field2 || "";
            village.field3 = rc.field3 || "";
            village.field4 = rc.field4 || "";
            village.field5 = rc.field5 || "";

            PageHelper.hideLoader();
        },function(resp){
            ManagementHelper.backToDashboard();
            PageHelper.showProgress('error',"Oops an error occurred",2000);
            PageHelper.showErrors(resp);
            PageHelper.hideLoader();
        });

    };

	return {
		"id": "Management_VillageCRU",
        "name":"Management_VillageCRU",
		"type": "schema-form",
		"title": $stateParams.pageId ? "EDIT_VILLAGE" : "ADD_VILLAGE",
		"subTitle": branch,
		initialize: function (model, form, formCtrl) {
			$log.info("Management VillageCRU page got initialized");
			model.branch = branch;
            model.village.branch_id = branchId;

            if(!$stateParams.pageId) {
                PageHelper.showLoader();
                authService.getUser().then(function (data) {
                    PageHelper.hideLoader();
                    model.village.created_by = data.login;

                }, function (resp) {
                    PageHelper.hideLoader();
                });
            }
			else{
				model.village.id = $stateParams.pageId;
				populateData(model);
			}

		},
		
		form: [
			{
				"type":"box",
				"title":"VILLAGE",
				"items":[

					"village.village_name",
					"village.village_name_in_local",
					"village.language_code",
                    {
                        key:"village.pincode",
                        onChange:"actions.generateFregCode(model,form)"
                    },
                    {
                        key:"village.fregcode",
                        readonly:true
                    },
					{
						key:"village.created_by",
						readonly:true

					}



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
			return ManagementHelper.getVillageSchemaPromise();
		},
		actions: {
            generateFregCode:function(model,form){
                console.log(model);
                if(model.village.pincode>100000){
                    model.village.fregcode = Number(model.village.pincode+"001");
                }
                else {
                    model.village.fregcode="";
                }

            },
			submit: function(model, form, formName){
				$log.info("Inside submit()");
				console.warn(model);
				if (window.confirm("Save?") && model.village) {
					PageHelper.showLoader();
                    if(isNaN(model.village.version)) model.village.version=0;
                    model.village.version = Number(model.village.version)+1;
                    Masters.post({
                        action:"AddVillage",
                        data:model.village
                    },function(resp,head){
                        PageHelper.hideLoader();
                        PageHelper.showProgress("add-village","Done. Village ID :"+resp.id,2000);
                        console.log(resp);
                        ManagementHelper.backToDashboard();
                    },function(resp){
                        PageHelper.hideLoader();
                        PageHelper.showErrors(resp);
                        ManagementHelper.backToDashboard();
                        PageHelper.showProgress('error',"Oops. An error occurred.",2000);
                    });
				}
			}
		}
	};
}]);
