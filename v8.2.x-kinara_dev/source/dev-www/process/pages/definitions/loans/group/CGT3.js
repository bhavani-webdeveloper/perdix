irf.pageCollection.factory("Pages__Cgt3", ["$log","authService","Groups","$state","$stateParams",
    "PageHelper","irfProgressMessage",'Utils',
    function($log,authService,Groups,$state,$stateParams,PageHelper,irfProgressMessage,Utils) {
        return {
            "id": "cgt3",
            "type": "schema-form",
            "name": "Cgt3",
            "title": "CGT 3",
            "subTitle": "",
            "uri": "Groups/CGT 3",
            "offline":true,
            getOfflineDisplayItem: function(item, index){
                return [
                    "Group ID : "+item.group.id,
                    "Group Code : "+item.group.groupCode,
                    "CGT Date : "+ item.group.cgtDate3
                ]
            },
            initialize: function (model, form, formCtrl) {
                if(model._request==undefined || model._request==null){
                    $state.go("Page.Engine", {pageName:"Cgt3Queue", pageId:null});
                    return;
                }
                PageHelper.showLoader();
                irfProgressMessage.pop("cgt3-init","Loading... Please Wait...");

                model.group= model.group || {};

                model.group.cgtDate3 = model.group.cgtDate3 || Utils.getCurrentDate();
                model.group.id = model.group.id || model._request.id;
                model.group.groupCode = model.group.groupCode || model._request.groupCode;
                model.group.partnerCode = model.group.groupCode || model._request.partnerCode;
                model.group.productCode = model.group.productCode|| model._request.productCode;

                var prom = authService.getUser().then(function(data){
                    model.group.cgt3DoneBy = data.login;
                    PageHelper.hideLoader();
                    $log.info("AfterLoad",model);
                    irfProgressMessage.pop("cgt3-init","Load Complete",2000);
                },function(resp){
                    $log.error(resp);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("cgt3-init","Oops, an error occurred",2000);
                });

                /*Groups.getGroup({groupId:groupId},function(response,headersGetter){
                    console.warn(response);
                    /*model.group = {
                     id:response.id,
                     groupCode:response.groupCode,
                     partnerCode:response.partnerCode,
                     productCode:response.productCode

                     };
                    model.group = _.cloneDeep(response);
                    var date = new Date();
                    var y = date.getFullYear();
                    var m = (date.getMonth()+3);
                    var d = date.getDate();
                    m = (m.toString().length<2)?("0"+m):m;
                    d = (d.toString().length<2)?("0"+d):d;

                    model.group.cgtDate3 = y+"-"+m+"-"+d;

                    var prom = authService.getUser().then(function(data){
                        model.group.cgt3DoneBy = data.login;
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("cgt3-init","Load Completed.",2000);
                    },function(resp){
                        $log.error(resp);
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("cgt3-init","Oops, an error occurred",2000);
                    });


                },function(resp){
                    $log.error(resp);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("cgt3-init","Oops, an error occurred",2000);

                });*/
            },
            form: [
                {
                    "type":"box",
                    "title":"CGT_3",
                    "items":[
                        {
                            "key":"group.cgt3DoneBy",
                            "readonly":true
                        },
                        {
                            "key":"group.cgtDate3",
                            "type":"text",
                            "readonly":true

                        },
                        {
                            "key":"group.cgt3Latitude",
                            "title": "CGT_3_LOCATION",
                            "type":"geotag",
                            "latitude": "group.cgt3Latitude",
                            "longitude": "group.cgt3Longitude"
                        },
                        {
                            "key":"group.cgt3Photo",
                            "type":"file",
                            "fileType":"image/*",
                            "offline":true

                        },
                        {
                            "key":"group.cgt3Remarks",
                            "type":"textarea"
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
                            "title":"SUBMIT_CGT_3"
                        }
                    ]
                }
            ],
            actions: {
                submit: function (model, form, formName) {

                    model.enrollmentAction = 'PROCEED';
                    if (form.$invalid){
                        irfProgressMessage.pop('cgt3-submit', 'Please fix your form', 5000);
                        return;
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('cgt3-submit', 'Working...');
                    PageHelper.clearErrors();
                    //var reqData = _.cloneDeep(model);
                    var reqData = {
                        "cgtDate": model.group.cgtDate3,
                        "cgtDoneBy": model.group.cgt3DoneBy,
                        "groupCode": model.group.groupCode,
                        "latitude": model.group.cgt3Latitude,
                        "longitude": model.group.cgt3Longitude,
                        "partnerCode": model.group.partnerCode,
                        "photoId": model.group.cgt3Photo,
                        "productCode": model.group.productCode,
                        "remarks": model.group.cgt3Remarks

                    };

                    var promise = Groups.post({service:'process',action:'cgt'},reqData,function(res){
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('cgt3-submit', 'CGT 3 Updated. Proceed to GRT.', 5000);
                        $state.go('Page.GroupDashboard',{
                            pageName:"GroupDashboard"
                        });

                    },function(res){
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('cgt3-submit', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);

                    });
                }
            },
            schema: function () {
                return Groups.getSchema().$promise;
            }
        }
    }]);
