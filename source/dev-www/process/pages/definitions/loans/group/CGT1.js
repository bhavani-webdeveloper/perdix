/*
* @TODO : 1 CGT page for all CGTs, with CGT# as param
* */
irf.pageCollection.factory("Pages__Cgt1", ["$log","authService","entityManager","Groups","$state","$stateParams",
    "PageHelper","irfProgressMessage",'Utils',"irfStorageService",
    function($log,authService,entityManager,Groups,$state,$stateParams,PageHelper,irfProgressMessage,Utils,irfStorageService) {
    return {
        "id": "cgt1",
        "type": "schema-form",
        "name": "Cgt1",
        "title": "CGT_1",
        "subTitle": "",
        "uri": "Groups/CGT 1",
        "offline":true,
        getOfflineDisplayItem: function(item, index){
            return [
                "Group ID : "+item.group.id,
                "Group Code : "+item.group.groupCode,
                "CGT Date : "+ item.group.cgtDate1
            ]
        },
        initialize: function (model, form, formCtrl) {
            $log.info(model);
            if(model._request==undefined || model._request==null){
                $state.go("Page.Engine", {pageName:"Cgt1Queue", pageId:null});
                return;
            }
            PageHelper.showLoader();
            irfProgressMessage.pop("cgt1-init","Loading... Please Wait...");
            model.group= model.group || {};


            model.group.cgtDate1 = model.group.cgtDate1 || Utils.getCurrentDate();
            model.group.id = model.group.id || model._request.id;
            model.group.groupCode = model.group.groupCode || model._request.groupCode;
            model.group.partnerCode = model.group.groupCode || model._request.partnerCode;
            model.group.productCode = model.group.productCode|| model._request.productCode;

            authService.getUser().then(function(data){
                model.group.cgt1DoneBy = data.login;
                PageHelper.hideLoader();
                $log.info("AfterLoad",model);
                irfProgressMessage.pop("cgt1-init","Load Complete",2000);
            },function(resp){
                $log.error(resp);
                PageHelper.hideLoader();
                irfProgressMessage.pop("cgt1-init","Oops, an error occurred",2000);
            });

            /*var groupId = $stateParams.pageId;
            Groups.getGroup({groupId:groupId},function(response,headersGetter){
                $log.info(response);

                model.group = _.cloneDeep(response);
                var date = new Date();
                var y = date.getFullYear();
                var m = (date.getMonth()+1);
                var d = date.getDate();
                m = (m.toString().length<2)?("0"+m):m;
                d = (d.toString().length<2)?("0"+d):d;

                model.group.cgtDate1 = y+"-"+m+"-"+d;

                var prom = authService.getUser().then(function(data){
                    model.group.cgt1DoneBy = data.login;
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("cgt1-init","Load Complete",2000);
                },function(resp){
                    $log.error(resp);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("cgt1-init","Oops, an error occurred",2000);
                });


            },function(resp){
                $log.error(resp);
                PageHelper.hideLoader();
                irfProgressMessage.pop("cgt1-init","Oops, an error occurred",2000);

            });*/
        },
        form: [
            {
                "type":"box",
                "title":"CGT_1",
                "items":[
                    {
                        "key":"group.cgt1DoneBy",
                        "readonly":true
                    },
                    {
                        "key":"group.cgtDate1",
                        "type":"text",
                        "readonly":true

                    },
                    {
                        "key":"group.cgt1Latitude",
                        "title": "CGT_1_LOCATION",
                        "type":"geotag",
                        "latitude": "group.cgt1Latitude",
                        "longitude": "group.cgt1Longitude"
                    },
                    {
                        "key":"group.cgt1Photo",
                        "type":"file",
                        "fileType":"image/*",
                        "offline":true

                    },
                    {
                        "key":"group.cgt1Remarks",
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
                        "title":"SUBMIT_CGT_1"
                    }
                ]
            }
        ],
        actions: {
            submit: function (model, form, formName) {

                model.enrollmentAction = 'PROCEED';
                if (form.$invalid){
                    irfProgressMessage.pop('cgt1-submit', 'Please fix your form', 5000);
                    return;
                }
                PageHelper.showLoader();
                irfProgressMessage.pop('cgt1-submit', 'Working...');
                PageHelper.clearErrors();
                //var reqData = _.cloneDeep(model);
                var userData = irfStorageService.retrieveJSON('UserData');
                var reqData = {
                    "cgtDate": model.group.cgtDate1,
                    "cgtDoneBy": model.group.cgt1DoneBy+'-'+userData.userName,
                    "groupCode": model.group.groupCode,
                    "latitude": model.group.cgt1Latitude,
                    "longitude": model.group.cgt1Longitude,
                    "partnerCode": model.group.partnerCode,
                    "photoId": model.group.cgt1Photo,
                    "productCode": model.group.productCode,
                    "remarks": model.group.cgt1Remarks

                };
                var promise = Groups.post({service:'process',action:'cgt'},reqData,function(res){
                    console.debug(res);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('cgt1-submit', 'CGT 1 Updated. Proceed to CGT 2', 5000);
                    $state.go('Page.GroupDashboard',{
                        pageName:"GroupDashboard"
                    });

                },function(res){
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('cgt1-submit', 'Oops. Some error.', 2000);
                    PageHelper.showErrors(res);

                });
            }
        },
        schema: function () {
            return Groups.getSchema().$promise;
        }
    }
}]);
