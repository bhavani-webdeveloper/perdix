irf.pageCollection.factory("Pages__Cgt2", ["$log","authService","Groups","$state","$stateParams","PageHelper",
    "irfProgressMessage",'Utils',"irfStorageService",
    function($log,authService,Groups,$state,$stateParams,PageHelper,irfProgressMessage,Utils,irfStorageService) {
        return {
            "id": "cgt2",
            "type": "schema-form",
            "name": "Cgt2",
            "title": "CGT 2",
            "subTitle": "",
            "uri": "Groups/CGT 2",
            "offline":true,
            getOfflineDisplayItem: function(item, index){
                return [
                    "Group ID : "+item.group.id,
                    "Group Code : "+item.group.groupCode,
                    "CGT Date : "+ item.group.cgtDate2
                ]
            },
            initialize: function (model, form, formCtrl) {
                if(model._request==undefined || model._request==null){
                    $state.go("Page.Engine", {pageName:"Cgt2Queue", pageId:null});
                    return;
                }
                PageHelper.showLoader();
                irfProgressMessage.pop("cgt2-init","Loading... Please Wait...");
                model.group= model.group || {};


                model.group.cgtDate2 = model.group.cgtDate2 || Utils.getCurrentDate();
                model.group.id = model.group.id || model._request.id;
                model.group.groupCode = model.group.groupCode || model._request.groupCode;
                model.group.partnerCode = model.group.groupCode || model._request.partnerCode;
                model.group.productCode = model.group.productCode|| model._request.productCode;

                var prom = authService.getUser().then(function(data){
                    model.group.cgt2DoneBy = data.login;
                    PageHelper.hideLoader();
                    $log.info("AfterLoad",model);
                    irfProgressMessage.pop("cgt2-init","Load Complete",2000);
                },function(resp){
                    $log.error(resp);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("cgt2-init","Oops, an error occurred",2000);
                });
                /*var groupId = $stateParams.pageId;
                Groups.getGroup({groupId:groupId},function(response,headersGetter){
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
                    var m = (date.getMonth()+2);
                    var d = date.getDate();
                    m = (m.toString().length<2)?("0"+m):m;
                    d = (d.toString().length<2)?("0"+d):d;

                    model.group.cgtDate2 = y+"-"+m+"-"+d;

                    var prom = authService.getUser().then(function(data){
                        PageHelper.hideLoader();
                        model.group.cgt2DoneBy = data.login;
                        irfProgressMessage.pop("cgt2-init","Load Completed.",2000);
                    },function(resp){
                        PageHelper.hideLoader();
                        $log.error(resp);
                        irfProgressMessage.pop("cgt2-init","Oops, an error occurred",2000);
                    });


                },function(resp){
                    PageHelper.hideLoader();
                    $log.error(resp);
                    irfProgressMessage.pop("cgt2-init","Oops, an error occurred",2000);

                });*/
            },
            form: [
                {
                    "type":"box",
                    "title":"CGT_2",
                    "items":[
                        {
                            "key":"group.cgt2DoneBy",
                            "readonly":true
                        },
                        {
                            "key":"group.cgtDate2",
                            "type":"text",
                            "readonly":true

                        },
                        {
                            "key":"group.cgt2Latitude",
                            "title": "CGT_2_LOCATION",
                            "type":"geotag",
                            "latitude": "group.cgt2Latitude",
                            "longitude": "group.cgt2Longitude"
                        },
                        {
                            "key":"group.cgt2Photo",
                            "type":"file",
                            "fileType":"image/*",
                            "offline":true

                        },
                        {
                            "key":"group.cgt2Remarks",
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
                            "title":"SUBMIT_CGT_2"
                        }
                    ]
                }
            ],
            actions: {
                submit: function (model, form, formName) {

                    model.enrollmentAction = 'PROCEED';
                    if (form.$invalid){
                        irfProgressMessage.pop('cgt2-submit', 'Please fix your form', 5000);
                        return;
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('cgt2-submit', 'Working...');
                    PageHelper.clearErrors();
                    //var reqData = _.cloneDeep(model);
                    var userData = irfStorageService.retrieveJSON('UserData');
                    var reqData = {
                        "cgtDate": model.group.cgtDate2,
                        "cgtDoneBy": model.group.cgt2DoneBy+'-'+userData.userName,
                        "groupCode": model.group.groupCode,
                        "latitude": model.group.cgt2Latitude,
                        "longitude": model.group.cgt2Longitude,
                        "partnerCode": model.group.partnerCode,
                        "photoId": model.group.cgt2Photo,
                        "productCode": model.group.productCode,
                        "remarks": model.group.cgt2Remarks

                    };
                    var promise = Groups.post({service:'process',action:'cgt'},reqData,function(res){
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('cgt2-submit', 'CGT 2 Updated. Proceed to CGT 3.', 5000);
                        $state.go('Page.GroupDashboard',{
                            pageName:"GroupDashboard"
                        });

                    },function(res){
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('cgt2-submit', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);

                    });
                }
            },
            schema: function () {
                return Groups.getSchema().$promise;
            }
        }
    }]);
