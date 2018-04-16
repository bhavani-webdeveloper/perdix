define({
    pageUID: "management.CentreCreation",
    pageType: "Engine",
    dependencies: ["$log","formHelper","PageHelper","CentreCreationResource","$state","SessionStore","Utils","irfNavigator","$stateParams", "RolesPages", "$filter", "Enrollment", "Queries", "$q"],
    $pageFn: 
    function($log, formHelper, PageHelper, CentreCreationResource,$state, SessionStore, Utils,irfNavigator,$stateParams, RolesPages, $filter, Enrollment, Queries, $q){
    //var branch = SessionStore.getBranch();
    return {
                "type": "schema-form",
                "title": "CENTRE_CREATION",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    model.editMode = true;
                    model.centre=model.centre||{};
                    model.centre.branchId = SessionStore.getBranchId();
                    model.centre.centreGpsCaptureDate = model.centre.centreGpsCaptureDate || Utils.getCurrentDate();
                    //model.branch = branch;
                    if ($stateParams.pageId) {
                        model.editMode = false;
                        var id = $stateParams.pageId;
                        PageHelper.showLoader();                        
                        CentreCreationResource.centreGetByID({
                            centreid: id
                        }, function(response, headersGetter) {
                            model.centre = _.cloneDeep(response);

                            model.centre.monthlyMeetingTime = moment(model.centre.monthlyMeetingTime).toDate();
                            model.centre.weeklyMeetingTime = moment(model.centre.weeklyMeetingTime).toDate();
                            var addressArr = model.centre.centreAddress.split("~#");
                            if(addressArr && addressArr.length > 0) {
                                model.centre.centreAddress = addressArr[0];

                                if(addressArr.length >= 6) {
                                    model.centre.locality = addressArr[1];
                                    model.centre.villageName = addressArr[2];
                                    model.centre.district = addressArr[3];
                                    model.centre.state = addressArr[4];
                                    model.centre.pincode = Number(addressArr[5]);                                    
                                }
                            }
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
                                        key: "centre.branchId",
                                        type: "select",
                                       // "readonly": true,
                                        title: "BRANCH_NAME",
                                        enumCode: "branch_id",
                                        condition:"model.editMode"

                                    },
                                    {
                                        key: "centre.branchId",
                                        type: "select",
                                        title: "BRANCH_NAME",
                                        enumCode: "branch_id",
                                        condition: "!model.editMode"                                        
                                    },
                                    //it sud be auto updated 
                                    {
                                        key: "centre.centreName",
                                        condition:"!model.editMode",
                                        readonly: true
                                    },
                                    /*{
                                        key: "centre.centreCode",
                                        condition:"!model.editMode",
                                        readonly: true
                                    },*/
                                    //it sud be auto updated 
                                    {
                                        key: "centre.centreName",
                                        condition:"model.editMode"
                                    },
                                    {
                                        key: "centre.centreAddress",
                                        type: "textarea"     
                                    },
                                    {
                                        key: "centre.pincode",
                                        type: "lov",
                                        required: true,
                                        fieldType: "number",
                                        autolov: true,
                                        inputMap: {
                                            "pincode": "centre.pincode",
                                            "division": "centre.locality",
                                            "region": "centre.villageName",
                                            "taluk" : "centre.taluk",
                                            "district": {
                                                key: "centre.district"
                                            },
                                            "state": {
                                                key: "centre.state"
                                            }
                                        },
                                        outputMap: {
                                            "division": "centre.locality",
                                            "region": "centre.villageName",
                                            "pincode": "centre.pincode",
                                            "district": "centre.district",
                                            "state": "centre.state",
                                        },
                                        searchHelper: formHelper,
                                        initialize: function(inputModel) {
                                            $log.warn('in pincode initialize');
                                            $log.info(inputModel);
                                        },
                                        search: function(inputModel, form, model) {
                                            if (!inputModel.pincode) {
                                                return $q.reject();
                                            }
                                            return Queries.searchPincodes(
                                                    inputModel.pincode,
                                                    inputModel.district,
                                                    inputModel.state,
                                                    inputModel.division,
                                                    inputModel.region,
                                                    inputModel.taluk
                                            );
                                        },
                                        getListDisplayItem: function(item, index) {
                                            return [
                                                item.division + ', ' + item.region,
                                                item.pincode,
                                                item.district + ', ' + item.state,
                                            ];
                                        },
                                        onSelect: function(result, model, context) {
                                            $log.info(result);
                                        }
                                    },
                                    {
                                        key: "centre.locality",
                                        readonly: true
                                    },
                                    {
                                        key: "centre.villageName",
                                        readonly: true
                                    },
                                    {
                                        key: "centre.district",
                                        readonly: true
                                    },
                                    {
                                        key: "centre.state",
                                        readonly: true,
                                    },
                                    {
                                        key: "centre.status",
                                        type: "radios",
                                        condition: "model.centre.status = 'ACTIVE'",

                                        titleMap:{
                                        "ACTIVE":"ACTIVE",
                                        "INACTIVE":"INACTIVE"
                                        },

                                        
                                        
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
                                        type: "date",
                                        onChange : function (modelValue, form, model) {
                                        PageHelper.clearErrors();
                                        //model.centre.date_creation = moment(model.centre.centreGpsCaptureDate).format("YYYY-MM-DD");                                        
                                        var daydiff = moment().diff(model.centre.centreGpsCaptureDate, 'days');
                                        if(daydiff < 0) {  
                                            PageHelper.clearErrors();                                  
                                            PageHelper.setError({message: "Centre Creation Date can not be future date"});                                    
                                        }
                                        } 
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
                                        type: "lov",
                                        lovonly: true,
                                        initialize: function(model, form, parentModel, context) {
                                            model.branchId = parentModel.centre.branchId;
                                            var centres = formHelper.enum('centre').data;

                                            var centreName = $filter('filter')(centres, {field3: parentModel.centre.centreCode, parentCode: parentModel.centre.branchId});
                                            if(centreName && centreName.length > 0) {
                                                model.centreId = centreName[0].value;
                                            }

                                        },
                                        inputMap: {
                                            "branchId": {
                                                "key": "centre.branchId",
                                                "title": "BRANCH_NAME",
                                                "type": "select",
                                                required: true,
                                                readonly: true,
                                                "enumCode": "branch_id"
                                            },
                                            "centreId": {
                                                "key": "centre.centreId",
                                                "title": "CENTRE",
                                                readonly: true,
                                                "enumCode": "centre",
                                                required: true,
                                                "type": "select",
                                                "parentEnumCode": "branch_id",
                                                "parentValueExpr": "model.branchId",
                                            },
                                            "firstName": {
                                                "key": "centre.firstName",
                                                "title": "CUSTOMER_NAME",
                                                "type": "string"
                                            },
                                            "urn": {
                                                "key": "centre.centreLeaderUrn",
                                                "title": "CUSTOMER_NAME",
                                                "type": "string",
                                                "title": "URN_NO",
                                            }
                                        },
                                        bindMap: {"Branch": "centre.branchId", "CentreCode" : "centre.centreCode"},
                                        "outputMap": {
                                            "urnNo": "centre.centreLeaderUrn",
                                        },
                                        "searchHelper": formHelper,
                                        "search": function(inputModel, form) {
                                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                            var branches = formHelper.enum('branch_id').data;
                                            var branchName;
                                            for (var i=0; i<branches.length;i++){
                                                if(branches[i].code==inputModel.branchId)
                                                    branchName = branches[i].name;
                                            }
                                            var promise = Enrollment.search({
                                                'branchName': branchName,
                                                'firstName': inputModel.firstName,
                                                'centreId':inputModel.centreId,
                                                'customerType':"individual",
                                                'urnNo': inputModel.urn
                                            }).$promise;
                                            return promise;
                                        },
                                        getListDisplayItem: function(data, index) {
                                            return [
                                                [data.firstName, data.fatherFirstName].join(' | '),
                                                data.id,
                                                data.urnNo
                                            ];
                                        },
                                        onSelect: function(valueObj, model, context){
                                            
                                        }                                        
                                    },
                                    {
                                        key: "centre.meetingpreference",
                                        title :"MEETING_FREQUENCY",
                                        type: "select",
                                        titleMap: {
                                            "WEEKLY": "WEEKLY",
                                            "MONTHLY": "MONTHLY",
                                            "FORTNIGHTLY": "FORTNIGHTLY"
                                        }

                                    },
                                    {
                                        condition : "model.centre.meetingpreference === 'MONTHLY'",
                                        key: "centre.monthlyMeeting",
                                        type: "radios",
                                        titleMap:{
                                        "DAY":"DAY",
                                        "DATE":"DATE"
                                        }
                                        /*onChange: function(model) {

                                        }*/

                                    },
                                    {
                                        condition : "model.centre.meetingpreference === 'MONTHLY'",
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
                                        condition : "model.centre.meetingpreference === 'MONTHLY'",
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
                                        condition : "model.centre.meetingpreference === 'MONTHLY'",
                                        key: "centre.monthlyMeetingDay",
                                        type: "select",
                                        condition: "model.centre.monthlyMeeting=='DAY'",
                                        titleMap:{
                                        "SUNDAY":"SUNDAY",
                                        "MONDAY":"MONDAY",
                                        "TUESDAY":"TUESDAY",
                                        "WEDNESDAY":"WEDNESDAY",
                                        "THURSDAY":"THURSDAY",
                                        "FRIDAY":"FRIDAY",
                                        "SATURDAY":"SATURDAY"
                                        }
                                        
                                    },
                                    {
                                        condition : "model.centre.meetingpreference === 'MONTHLY'",
                                        key: "centre.monthlyMeetingTime",
                                        type: "time",
                                    },
                                    {
                                        condition : "model.centre.meetingpreference === 'WEEKLY'",
                                        key: "centre.weeklyMeetingDay",
                                        type: "select",
                                        titleMap:{
                                        "SUNDAY":"SUNDAY",
                                        "MONDAY":"MONDAY",
                                        "TUESDAY":"TUESDAY",
                                        "WEDNESDAY":"WEDNESDAY",
                                        "THURSDAY":"THURSDAY",
                                        "FRIDAY":"FRIDAY",
                                        "SATURDAY":"SATURDAY"
                                        }
                                    },
                                    {
                                        condition : "model.centre.meetingpreference === 'WEEKLY'",
                                        key: "centre.weeklyMeetingTime",
                                        type: "time",
                                    },
                                    {
                                        condition : "model.centre.meetingpreference === 'FORTNIGHTLY'",
                                        key: "centre.fortnightlyMeetingDay",
                                        type: "select",
                                        titleMap:{
                                        "SUNDAY":"SUNDAY",
                                        "MONDAY":"MONDAY",
                                        "TUESDAY":"TUESDAY",
                                        "WEDNESDAY":"WEDNESDAY",
                                        "THURSDAY":"THURSDAY",
                                        "FRIDAY":"FRIDAY",
                                        "SATURDAY":"SATURDAY"
                                        }
                                    },
                                    {
                                        condition : "model.centre.meetingpreference === 'FORTNIGHTLY'",
                                        key: "centre.fortnightlyMeetingTime",
                                        type: "time",
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
                        tempModelData.centreAddress = [tempModelData.centreAddress, tempModelData.locality, tempModelData.villageName, tempModelData.district, tempModelData.state, tempModelData.pincode].join("~#");
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
                            //irfNavigator.goBack();
                            $state.go('Page.CentreCreationDashboard', null);
                                                        
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
