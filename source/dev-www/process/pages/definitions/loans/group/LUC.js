/*
* @TODO : 1 CGT page for all CGTs, with CGT# as param
* */
irf.pageCollection.factory("Pages__Luc", ["$log","authService","LoanProcess","$state","$stateParams","PageHelper","irfProgressMessage",
    function($log,authService,LoanProcess,$state,$stateParams,PageHelper,irfProgressMessage) {
    return {
        "id": "luc",
        "type": "schema-form",
        "name": "Luc",
        "title": "Loan Utility Check",
        "subTitle": "",
        "uri": "Groups/Loan Utility Check",
        initialize: function (model, form, formCtrl) {
            PageHelper.showLoader();
            irfProgressMessage.pop("luc-init","Loading... Please Wait...");
            try {
                $log.info("Account Number :" + $stateParams.pageId);
                var accountNumber = $stateParams.pageId;
            }catch(err){

            }

            var date = new Date();
            var y = date.getFullYear();
            var m = (date.getMonth()+1);
            var d = date.getDate();
            m = (m.toString().length<2)?("0"+m):m;
            d = (d.toString().length<2)?("0"+d):d;

            model.pldcDto = Array();
            authService.getUser().then(function(data){
                var date=y+"-"+m+"-"+d

                model.pldcDto.push({
                    accountNumber:accountNumber,
                    pldcDate:date,
                    pldcDoneBy:data.login
                });
                PageHelper.hideLoader();
                irfProgressMessage.pop("luc-init","Load Complete",2000);
            },function(resp){
                $log.error(resp);
                PageHelper.hideLoader();
                irfProgressMessage.pop("luc-init","Oops, an error occurred",2000);
            });

        },
        form: [
            {
                "type":"box",
                "title":"LOAN_UTILITY_CHECK",
                "items":[
                    {
                        "key":"pldcDto",
                        "title":"",
                        "add":null,
                        "remove":null,
                        "items":[
                            {
                                "key": "pldcDto[].accountNumber",
                                "title":"ACCOUNT_NUMBER"

                            },
                            {
                                "key":"pldcDto[].pldcDoneBy",
                                "readonly":true,
                                "title":"PLDC_DONE_BY"
                            },
                            {
                                "key": "pldcDto[].pldcDate",
                                "type": "date",
                                "title":"DATE"
                            },
                            {
                                "key": "latitude",
                                "title": "PLDC_LOCATION",
                                "type": "geotag",
                                "latitude": "pldcDto[arrayIndex].latitude",
                                "longitude": "pldcDto[arrayIndex].longitude"
                            },
                            {
                                "key": "pldcDto[].photoId",
                                "title":"PLDC_DOCUMENT",
                                "type": "file",
                                "fileType": "image/*"


                            },
                            {
                                "key": "pldcDto[].pldcComments",
                                "type": "textarea",
                                "title":"COMMENTS"
                            }
                        ]
                    }

                ]
            },{
                "type":"actionbox",
                "items":[
                    {
                        "type":"submit",
                        "style":"btn-primary",
                        "title":"Submit LUC"
                    }
                ]
            }
        ],
        actions: {
            submit: function (model, form, formName) {

                PageHelper.clearErrors();
                PageHelper.showLoader();
                irfProgressMessage.pop('luc-submit',"Submitting Data, Please Wait...");
                $log.info("Submitting LUC",model);
                
                var reqData = _.cloneDeep(model.pldcDto);
                
                LoanProcess.postArray({action:'pldc'},reqData,function (resp,headers) {
                    PageHelper.hideLoader();
                    $log.info("submit result",resp);
                    irfProgressMessage.pop('luc-submit',"Saved Successfully",5000);
                },function (res) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('luc-submit',"Oops. An Error Occurred",2000);
                    PageHelper.showErrors(res);
                });
            }
        },
        schema: function () {
            return LoanProcess.getPldcSchema().$promise;
        }
    }
}]);
