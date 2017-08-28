define({
    pageUID: "management.CentreCreation",
    pageType: "Engine",
    dependencies: ["$log","formHelper","PageHelper","CentreCreationResource","$state","SessionStore","Utils","irfNavigator","$stateParams", "RolesPages"],
    $pageFn: 
    function($log, formHelper, PageHelper, CentreCreationResource,$state, SessionStore, Utils,irfNavigator,$stateParams, RolesPages){
    var branch = SessionStore.getBranch();
    return {
                "type": "schema-form",
                "title": "CENTRE_CREATION",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    model.editMode = false;
                    if ($stateParams.pageId) {
                        model.editMode = true;
                        var id = $stateParams.pageId;
                        PageHelper.showLoader();
                        
                        CentreCreationResource.centreGetByID({
                            centreid: id
                        }, function(response, headersGetter) {
                            model.centre = _.cloneDeep(response);
                            PageHelper.hideLoader();
                        }, function(resp) {
                            PageHelper.hideLoader();
                            //irfProgressMessage.pop("group-init", "Oops. An error occurred", 2000);
                            //backToDashboard();
                        });
                    }

                    $log.info("Centre Creation sample got initialized");
                },
                form: [
                        {
                        "type": "box",
                        "title": "CENTRE_CREATION",
                        "items": [
                                    {
                                        key: "centre.centreName",
                                        condition:"model.editMode",
                                        readonly: true
                                    },
                                    {
                                        key: "centre.centreCode",
                                        condition:"model.editMode",
                                        readonly: true
                                    },
                                    {
                                        key: "centre.centreName",
                                        condition:"!model.editMode"
                                    },
                                    {
                                        key: "centre.centreCode",
                                        condition:"!model.editMode"
                                    },
                                    {
                                        key: "centre.centreAddress",
                                        type: "textarea"     
                                    },
                                    {
                                        key: "centre.branchId",
                                        type: "select",
                                        enumCode: "branch_id",
                                        condition:"!model.editMode"
                                    },
                                    {
                                        key: "centre.branchId",
                                        type: "select",
                                        enumCode: "branch_id",
                                        condition: "model.editMode",
                                        readonly: true
                                    },
                                    {
                                        key: "centre.status",
                                        type: "radios",
                                        titleMap:{
                                        "ACTIVE":"ACTIVE",
                                        "INACTIVE":"INACTIVE"
                                        }
                                    },
                                    {
                                        key: "centre.centreLatitude",
                                        type: "geotag",
                                        required: false,
                                        latitude: "centre.centreLatitude",
                                        longitude: "centre.centreLongitude"
                                    },
                                    {
                                        key: "centre.centreGpsCaptureDate",
                                        type: "date"
                                    },
                                    {
                                        key: "centre.employee",
                                        type: "lov",
                                        lovonly: true,
                                        searchHelper: formHelper,
                                        inputMap: {
                                            "userId": {
                                                "key": "centre.employee",
                                                "title": "USER_ID"
                                            },
                                            "userName": {
                                                "key": "centre.employeeName",
                                                "title": "USER_NAME",
                                                "type": "string"
                                            }
                                        },
                                        outputMap: {
                                            "userId": "centre.employee"
                                        },
                                        search: function(inputModel, form, model) {
                                            return RolesPages.searchUsers({
                                                userId: inputModel.userId,
                                                userName: inputModel.userName
                                            }).$promise;
                                        },
                                        getListDisplayItem: function(item, index) {
                                            return [
                                                item.userId + ': ' + item.userName,
                                                item.roleId ? (item.roleId + ': ' + item.roleName) : ''
                                            ];
                                        }
                
                                    },
                                    {
                                        key: "centre.centreLeaderUrn",
                                        
                                    },
                                    {
                                        key: "centre.monthlyMeeting",
                                        type: "radios",
                                        titleMap:{
                                        "DAY":"DAY",
                                        "DATE":"DATE"
                                        }

                                    },
                                    {
                                        key: "centre.monthlyMeetingDate",
                                        type: "select",
                                        condition: "model.centre.monthlyMeeting=='DATE'",
                                         titleMap:{
                                        "1":"1",
                                        "2":"2",
                                        "3":"3",
                                        "4":"4",
                                        "5":"5",
                                        "6":"6",
                                        "7":"7",
                                        "8":"8",
                                        "9":"9",
                                        "10":"10",
                                        "11":"11",
                                        "12":"12",
                                        "13":"13",
                                        "14":"14",
                                        "15":"15",
                                        "16":"16",
                                        "17":"17",
                                        "18":"18",
                                        "19":"19",
                                        "20":"20",
                                        "21":"21",
                                        "22":"22",
                                        "23":"23",
                                        "24":"24",
                                        "25":"25",
                                        "26":"26",
                                        "27":"27",
                                        "28":"28",
                                        "29":"29",
                                        "30":"30",
                                        "31":"31"
                                        }
                                    },
                                    {
                                        key: "centre.monthlyMeetingDateNumber",
                                        type: "select",
                                        condition: "model.centre.monthlyMeeting=='DAY'",
                                        titleMap:{
                                        "1":"1",
                                        "2":"2",
                                        "3":"3",
                                        "4":"4"
                                        }
                                    },
                                    {
                                        key: "centre.monthlyMeetingDay",
                                        type: "select",
                                        condition: "model.centre.monthlyMeeting=='DAY'",
                                        titleMap:{
                                        "SUNDAY":"SUNDAY",
                                        "MONDAY":"MONDAY",
                                        "TUESDAY":"TUESDAY",
                                        "WEDNESDAY":"WEDNESDAY",
                                        "THRUSDAY":"THRUSDAY",
                                        "FRIDAY":"FRIDAY",
                                        "SATURDAY":"SATURDAY"
                                        }
                                        
                                    },
                                    {
                                        key: "centre.monthlyMeetingTime"
                                    },
                                    {
                                        key: "centre.weeklyMeetingDay",
                                        type: "select",
                                        titleMap:{
                                        "SUNDAY":"SUNDAY",
                                        "MONDAY":"MONDAY",
                                        "TUESDAY":"TUESDAY",
                                        "WEDNESDAY":"WEDNESDAY",
                                        "THRUSDAY":"THRUSDAY",
                                        "FRIDAY":"FRIDAY",
                                        "SATURDAY":"SATURDAY"
                                        }
                                    },
                                    {
                                        key: "centre.weeklyMeetingTime"
                                    }
                                    
                                 ]
                        },
                        {
                            "type": "actionbox",
                            "items": [{
                                "type": "submit",
                                "title": "Submit"
                            }]
                        }
                      ],
                schema: function() {
                        return CentreCreationResource.getSchema().$promise;
                },
                actions: {
                    submit: function(model, form, formName){
                        PageHelper.showLoader();
                        PageHelper.clearErrors();
                        PageHelper.showProgress('centreCreationSubmitRequest', 'Processing');
                        var tempModelData = _.clone(model.centre);
                        delete tempModelData['monthlyMeeting'];
                        var deferred = {};

                        if((model.centre.id!="")&&(model.centre.id!=undefined)){
                            deferred =   CentreCreationResource.centreEdit(tempModelData).$promise;
                        }
                        else{
                            deferred = CentreCreationResource.centreCreation(tempModelData).$promise;
                        }

                        deferred.then(function(data) {
                            PageHelper.hideLoader();
                            PageHelper.showProgress('centreCreationSubmitRequest', 'Done',5000);
                            model.centre={};
                            form.$setPristine();
                            irfNavigator.goBack();
                                                        
                        }, function(data){
                            PageHelper.hideLoader();
                            PageHelper.showProgress('centreCreationSubmitRequest', 'Oops some error happend',5000);
                            PageHelper.showErrors(data);
                                    
                        });

                    }
                }
            };
    }
})
