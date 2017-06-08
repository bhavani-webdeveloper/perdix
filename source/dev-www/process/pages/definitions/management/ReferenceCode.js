define({
	pageUID: "management.ReferenceCode",
    pageType: "Engine",
    dependencies: ["$log","ReferenceCodeResource","$q","PageHelper","$stateParams"],
    $pageFn: function($log,ReferenceCodeResource,$q,PageHelper,$stateParams){
    	return{
    		 "type": "schema-form",
            "title": "Demo Form",
            "subTitle": "Model of First Demo",
            initialize: function (model, form, formCtrl) {
            	model.referenceCode={};
            	
            	if (($stateParams.pageId!="")&&($stateParams.pageId!=undefined)) {
            		model.referenceCode = $stateParams.pageData;
            	}

                $log.info("Not Required for this demo");
            },
            form: [
            {
            		"type":"box",
                    "title":"DETAILS",
                    "items" :
                    [
                    	{
                    		key: "referenceCode.name",
                            type: "text"
                   		},
                   		{
                    		key: "referenceCode.code",
                            type: "text"
                   		},
                   		{
                    		key: "referenceCode.classifier",
                            type: "select",
                            enumCode: "refcode_classifiers"
                   		},
                   		{
                    		key: "referenceCode.field1",
                            type: "text"
                   		},
                   		{
                    		key: "referenceCode.field2",
                            type: "text"
                   		},
                   		{
                    		key: "referenceCode.field3",
                            type: "text"
                   		},
                   		{
                    		key: "referenceCode.field4",
                            type: "text"
                   		},
                   		{
                    		key: "referenceCode.field5",
                            type: "text"
                   		}
                    ]
            },
            {
                    "type": "actionbox",
                    "items": [{
                        "type": "save",
                        "title": "Reset"
                    }, {
                        "type": "submit",
                        "title": "Submit"
                    }]
                }
            ],

            schema: function() {
                return ReferenceCodeResource.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName){

                		PageHelper.showLoader();
                         PageHelper.clearErrors();
                		PageHelper.showProgress('referenceCodesSubmitRequest', 'Processing');

					console.log(model.referenceCode);

					var deferred = {};

					if((model.referenceCode.id!="")&&(model.referenceCode.id!=undefined)){
						deferred =	 ReferenceCodeResource.referenceCodesEdit(model.referenceCode).$promise;
					}
					else{
						deferred = ReferenceCodeResource.referenceCodesSubmit(model.referenceCode).$promise;
					}

					deferred.then(function(data) {
     							  PageHelper.hideLoader();
     							  PageHelper.showProgress('referenceCodesSubmitRequest', 'Done',5000);
     							  
     							  model.referenceCode={};
     							 form.$setPristine();
                                                    
   							 },
   							 function(data){
						   		 PageHelper.hideLoader();
						   		 PageHelper.showProgress('referenceCodesSubmitRequest', 'Oops some error happend',5000);
						   		 PageHelper.showErrors(data);
						   		
						   });

                }
            }
    	}
    }
   
})