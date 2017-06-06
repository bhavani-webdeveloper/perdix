/*
 * @TODO : 1 CGT page for all CGTs, with CGT# as param
 * */
irf.pageCollection.factory("Pages__Grt", ["$log","authService","Groups","LoanProcess","$state","$stateParams",
    "PageHelper","irfProgressMessage",'Utils',"irfStorageService",
    function($log,authService,Groups,LoanProcess,$state,$stateParams,PageHelper,irfProgressMessage,Utils,irfStorageService) {
        return {
            "id": "grt",
            "type": "schema-form",
            "name": "Grt",
            "title": "GRT",
            "subTitle": "",
            "uri": "Groups/GRT",
            "offline":true,
            getOfflineDisplayItem: function(item, index){
                return [
                    "Group ID : "+item.group.id,
                    "Group Code : "+item.group.groupCode,
                    "GRT Date : "+ item.group.grtDate
                ]
            },
            initialize: function (model, form, formCtrl) {
                $log.info("I got initialized");
                if(model._request==undefined || model._request==null){
                    $state.go("Page.Engine", {pageName:"GrtQueue", pageId:null});
                    return;
                }
                PageHelper.showLoader();
                irfProgressMessage.pop("grt-init","Loading... Please Wait...");
                model.group= model.group || {};


                model.group.grtDate = model.group.grtDate || Utils.getCurrentDate();
                model.group.id = model.group.id || model._request.id;
                model.group.groupCode = model.group.groupCode || model._request.groupCode;
                model.group.partnerCode = model.group.partnerCode || model._request.partnerCode;
                model.group.productCode = model.group.productCode|| model._request.productCode;
                for(var i=1;i<18;i++){
                    model.group["udf"+i] = model.group["udf"+i] || false;
                }
                model.group.udfDate1 = model.group.udfDate1 || "";
                var prom = authService.getUser().then(function(data){
                    model.group.grtDoneBy = data.login;
                    PageHelper.hideLoader();
                    $log.info("AfterLoad",model);
                    irfProgressMessage.pop("grt-init","Load Complete",2000);
                },function(resp){
                    $log.error(resp);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("grt-init","Oops, an error occurred",2000);
                });
                /*Groups.getGroup({groupId:groupId},function(response,headersGetter){

                    /*model.group = {
                     id:response.id,
                     groupCode:response.groupCode,
                     partnerCode:response.partnerCode,
                     productCode:response.productCode

                     };
                    model.group = _.cloneDeep(response);
                    var date = new Date();
                    var y = date.getFullYear();
                    var m = (date.getMonth()+1);
                    var d = date.getDate();
                    m = (m.toString().length<2)?("0"+m):m;
                    d = (d.toString().length<2)?("0"+d):d;

                    model.group.grtDate = y+"-"+m+"-"+d;

                    var prom = authService.getUser().then(function(data){
                        model.group.grtDoneBy = data.login;
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("grt-init","Load Completed.",2000);
                    },function(resp){
                        $log.error(resp);
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("grt-init","Oops, an error occurred",2000);
                    });


                },function(resp){
                    $log.error(resp);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("grt-init","Oops, an error occurred",2000);

                });*/
            },
            form: [
                {
                    "type":"box",
                    "title":"GRT",
                    "items":[
                        {
                            "key":"group.grtDoneBy",
                            "readonly":true
                        },
                        {
                            "key":"group.grtDate",
                            "type":"text",
                            "readonly":true

                        },
                        {
                            "key":"group.grtLatitude",
                            "title": "GRT_LOCATION",
                            "type":"geotag",
                            "latitude": "group.grtLatitude",
                            "longitude": "group.grtLongitude"
                        },
                        {
                            "key":"group.grtPhoto",
                            "type":"file",
                            "fileType":"image/*",
                            "offline":true

                        },
                        {
                            "key":"group.grtRemarks",
                            "type":"textarea"
                        },
                        {
                            "key":"group.udfDate1",
                            "type":"date"
                        },
                        {
                            "key":"group.udf1"
                        },
                        {
                            "key":"group.udf2"
                        },
                        {
                            "key":"group.udf3"
                        },
                        {
                            "key":"group.udf4"
                        },
                        {
                            "key":"group.udf5"
                        },
                        {
                            "key":"group.udf6"
                        }


                    ]
                },{
                    "type":"actionbox",
                    "items":[
                        {
                            "type": "save",
                            "title": "SAVE_OFFLINE",
                        },
                        {
                            "type":"submit",
                            "style":"btn-primary",
                            "title":"SUBMIT_GRT"
                        }
                    ]
                }
            ],
            actions: {
                submit: function (model, form, formName) {

                    model.enrollmentAction = 'PROCEED';
                    if (form.$invalid){
                        irfProgressMessage.pop('grt-submit', 'Please fix your form', 5000);
                        return;
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('grt-submit', 'Working...');
                    PageHelper.clearErrors();
                    //var reqData = _.cloneDeep(model);
                    var userData = irfStorageService.retrieveJSON('UserData');
                    var reqData = {
                        "grtDate": model.group.grtDate,
                        "grtDoneBy": model.group.grtDoneBy+'-'+userData.userName,
                        "groupCode": model.group.groupCode,
                        "latitude": model.group.grtLatitude,
                        "longitude": model.group.grtLongitude,
                        "partnerCode": model.group.partnerCode,
                        "photoId": model.group.grtPhoto,
                        "productCode": model.group.productCode,
                        "remarks": model.group.grtRemarks,
                        "udfDate1":model.group.udfDate1,
                        "udf1":model.group.udf1,
                        "udf2":model.group.udf2,
                        "udf3":model.group.udf3,
                        "udf4":model.group.udf4,
                        "udf5":model.group.udf5,
                        "udf6":model.group.udf6,
                        

                    };

                    var promise = Groups.post({service:'process',action:'grt'},reqData,function(res){

                        irfProgressMessage.pop('grt-submit', 'GRT Updated, activating loan account');
                        
                        LoanProcess.get({action:'groupLoans',groupCode:model.group.groupCode,partner:model.group.partnerCode},function(resp,header){
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('grt-submit', 'GRT Updated, Loan Account Activated. Proceed to Applications Pending screen.',5000);
                            $state.go('Page.GroupDashboard',{
                                pageName:"GroupDashboard"
                            });

                        },function(res){
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('grt-submit', 'An error occurred while activating loan account. Please Try from Applications Pending Screen',2000);
                            var data = res.data;
                            var errors = [];
                            if (data.errors){
                                _.forOwn(data.errors, function(keyErrors, key){
                                    var keyErrorsLength = keyErrors.length;
                                    for (var i=0;i<keyErrorsLength; i++){
                                        var error  = {"message": "<strong>" + key  + "</strong>: " + keyErrors[i]};
                                        errors.push(error);
                                    }
                                })
                                PageHelper.setErrors(errors);
                            }
                            $state.go('Page.GroupDashboard',{
                                pageName:"GroupDashboard"
                            });

                        });



                    },function(res){
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('grt-submit', 'Oops. Some error.');
                        PageHelper.showErrors(res);


                    });
                }
            },
            schema: function () {
                return Groups.getSchema().$promise;
            }
        }
    }]);
