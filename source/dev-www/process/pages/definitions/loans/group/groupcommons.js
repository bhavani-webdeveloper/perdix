irf.commons.factory('groupCommons', ["SessionStore","formHelper","Groups","Pages__CBCheckStatusQueue","Utils",
    "irfModalQueue","$log","PageHelper","irfSimpleModal","irfProgressMessage","Enrollment","LoanProcess","$q","$uibModal",
    function(SessionStore,formHelper,Groups,Pages__CBCheckStatusQueue,Utils,irfModalQueue,$log,PageHelper,irfSimpleModal,
             irfProgressMessage,Enrollment,LoanProcess,$q,$uibModal
    ){

        var branchId = ""+SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();
        /*Search Page Stuffs*/
        var defaultListOptions = {
            itemCallback: function(item, index) {
            },
            getItems: function(response, headers){
                if (response!=null && response.length && response.length!=0){
                    return response;
                }
                return [];
            },
            getListItem: function(item){
                return [

                    'Group ID : ' + item.id,
                    'Group Name : '+item.groupName,
                    null
                ]
            },
            getActions: function(){
                return [];
            }
        };
        var defaultPaginationOptions= {
            viewMode: "page",
            getItemsPerPage: function(response, headers){
                return 20;
            },
            getTotalItemsCount: function(response, headers){
                try {
                    return headers['x-total-count'];
                }catch(err){
                    return 0;
                }
            }
        };

        /*Group CRUD stuffs*/
        function showDscData(dscId){
            PageHelper.showLoader();
            Groups.getDSCData({dscId:dscId},function(resp,headers){
                PageHelper.hideLoader();
                var dataHtml = "<table class='table table-striped table-bordered table-responsive'>";

                dataHtml += "<tr><td>Response : </td><td>"+resp.response+"</td></tr>";
                dataHtml+= "<tr><td>Response Message: </td><td>"+resp.responseMessage+"</td></tr>";
                dataHtml+= "<tr><td>Stop Response: </td><td>"+resp.stopResponse+"</td></tr>";
                dataHtml+="</table>"
                irfSimpleModal('DSC Check Details',dataHtml);
            },function(res){
                PageHelper.showErrors(res);
                PageHelper.hideLoader();
            });
        }

        return {
            /*Search Page Stuffs*/
            getDefaultPaginationOptions:function(){
                return defaultPaginationOptions;
            },
            getSearchDefinition:function(stage,listOptions,pageOptions){
                var defaultPartner = 'KGFS';
                var definition= {
                    title: "GROUPS_LIST",
                        searchForm: [
                        "*"
                    ],
                        searchSchema: {
                        "type": 'object',
                            "title": 'SearchOptions',
                            "properties": {

                                "partner": {
                                        "title": "PARTNER",
                                        "default":defaultPartner,
                                        "type": "string",
                                        "enumCode":"partner",
                                        "x-schema-form":{
                                        "type":"select"
                                    }
                                }

                        },
                        "required":["partner"]
                    },
                    getSearchFormHelper: function() {
                        return formHelper;
                    },
                    getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

                        var params = {
                            'branchId': branchId,
                            'partner':searchOptions.partner,
                            'groupStatus':true,
                            'page': pageOpts.pageNo,
                            'per_page': pageOpts.itemsPerPage
                        };
                        if(stage) {
                            params.currentStage = stage
                        }

                        var promise = Groups.search(params).$promise;

                        return promise;
                    },
                    paginationOptions: pageOptions || defaultPaginationOptions,
                    listOptions: listOptions || defaultListOptions


                };

                return definition;


            },
            getOfflineDisplayItem: function() {
               return  function (item, index) {
                    return [
                        'Partner : ' + item.partner,
                        'Record Count : ' + item._result.items.length
                    ]
                };
            },
            getOfflinePromise: function(stage){
                return function(searchOptions){      /* Should return the Promise */
                    var promise = Groups.search({
                        'branchId':branchId,
                        'partner':searchOptions.partner,
                        'currentStage':stage,
                        'page': 1,
                        'per_page': 100
                    }).$promise;

                    return promise;
                }
            },

            /*Group CRUD stuffs*/
            /*
            * modes available = CREATE,DSC_CHECK,VIEW,EDIT(not enabled),DELETE,APP_DWNLD
            * */

            getFormDefinition:function(mode){
                console.info("Generating form definition for "+mode);
                var readonly = true;
                if(mode=='CREATE' || mode=='EDIT'){
                    readonly = false;
                }

                var basicDefinition = [{
                    "key":"group",
                    "type": "box",
                    "title":"GROUP_DETAILS",
                    "items":[
                        {
                            "key":"group.groupName",
                            readonly:readonly
                        },
                        {
                            "key":"group.partnerCode",
                            "type":"select",
                            readonly:readonly
                        },
                        {
                            "key":"group.centreCode",
                            "type":"select",
                            readonly:readonly
                        },
                        {
                            "key":"group.productCode",
                            "type":"select",
                            readonly:readonly,
                            "filter": {
                                "parentCode as partner": "model.group.partnerCode",
                                "field2": "JLG"
                            }
                        },

                        {
                            "key":"group.frequency",
                            "type":"select",
                            readonly:readonly
                        },
                        {
                            "key":"group.tenure",
                            readonly:readonly
                        },
                        {
                            "key":"group.jlgGroupMembers",
                            "type":"array",
                            "title":"GROUP_MEMBERS",
                            "condition":"model.group.jlgGroupMembers.length>0",
                            "add":null,
                            "remove":null,
                            "titleExpr":"model.group.jlgGroupMembers[arrayIndex].urnNo + ' : ' + model.group.jlgGroupMembers[arrayIndex].firstName",
                            "items":[
                                {
                                    "key":"group.jlgGroupMembers[].urnNo",
                                    "readonly":true

                                },
                                {
                                    "key":"group.jlgGroupMembers[].firstName",
                                    "type":"string",
                                    "readonly":true,
                                    "title":"GROUP_MEMBER_NAME"
                                },
                                {
                                    "key":"group.jlgGroupMembers[].husbandOrFatherFirstName",
                                    "readonly":readonly
                                },
                                {
                                    "key":"group.jlgGroupMembers[].relation",
                                    "readonly":readonly,
                                    "type":"select",
                                    "titleMap":{
                                        "Father":"Father",
                                        "Husband":"Husband"
                                    }
                                },
                                {
                                    "key": "group.jlgGroupMembers[].outStandingLoanAmount",
                                    "condition":"model.group.partnerCode=='AXIS'",
                                    "required": true,
                                    "type": "amount",
                                    "title": "OUTSTANDING_LOAN_AMOUNT"
                                },
                                {
                                    "key":"group.jlgGroupMembers[].loanAmount",
                                    "type":"amount",
                                    readonly:readonly

                                },
                                {
                                    "key":"group.jlgGroupMembers[].loanPurpose1",
                                    "type":"select",
                                    onChange: function(modelValue, form, model) {
                                        $log.info(modelValue);
                                    },
                                    readonly:readonly
                                },
                                {
                                    "key":"group.jlgGroupMembers[].loanPurpose2",
                                    "type":"select",
                                    "parentEnumCode": (readonly ? undefined :  "loan_purpose_1"),
                                    /*"filter": {
                                        "parentCode as loan_purpose_1": "model.jlgGroupMembers[arrayIndex].loanPurpose1"
                                    },*/
                                    readonly:readonly
                                },
                                {
                                    "key":"group.jlgGroupMembers[].loanPurpose3",
                                    "type":"select",
                                    "parentEnumCode": (readonly ? undefined :  "loan_purpose_2"),
                                    /*"filter": {
                                        "parentCode as loan_purpose_2": "model.jlgGroupMembers[arrayIndex].loanPurpose2"
                                    },*/
                                    readonly:readonly
                                },
                                {
                                    "key":"group.jlgGroupMembers[].witnessFirstName",
                                    "readonly":readonly
                                },
                                {
                                    "key":"group.jlgGroupMembers[].witnessRelationship",
                                    "type":"select",
                                    "readonly":readonly
                                }/*,
                                {
                                    "key":"group.jlgGroupMembers[].getDSCData",
                                    "type":"button",
                                    "title":"VIEW_DSC_RESPONSE",
                                    "icon":"fa fa-eye",
                                    "style": "btn-primary",
                                    //"condition":"model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED'",
                                    "onClick":function(model, formCtrl, form, event){
                                        console.log(form);
                                        console.warn(event);
                                        var i = event['arrayIndex'];
                                        console.warn("dscid :"+model.group.jlgGroupMembers[i].dscId);
                                        var dscId = model.group.jlgGroupMembers[i].dscId;
                                        showDscData(dscId);
                                    }
                                }*/

                            ]
                        }

                    ]
                }];

                if(mode=='VIEW') return basicDefinition;

                var retDefinition = _.clone(basicDefinition);

                if(mode=='CREATE' || mode=='EDIT'){
                    this.addCreateElements(retDefinition);
                }
                else if(mode=='DSC_CHECK'){
                    this.addDSCElements(retDefinition);
                }

                else if(mode=='DELETE'){
                    this.addDeleteElements(retDefinition);
                }
                else if(mode=='APP_DWNLD'){
                    this.addAppDwnldElements(retDefinition);
                }

                return retDefinition;


            },
            addCreateElements:function(retDefinition){
                retDefinition[0].items.push({
                    "type": "button",
                    "fieldHtmlClass":"btn-block",
                    "title": "SELECT_MEMBERS",

                    onClick: function(model, form, formName) {
                        var modalQueuedefinition = _.cloneDeep(Pages__CBCheckStatusQueue.definition);
                        modalQueuedefinition.title = "CREDIT_BUREAU_COMPLETED_CUSTOMERS";
                        var modelOutside = model;
                        modalQueuedefinition.initialize = function(model, form, formCtrl){
                            model.branchName = branchName;
                            model.centreCode = modelOutside.group.centreCode;
                        };
                        modalQueuedefinition.listOptions.getItems = function(response, headers){
                            if (response!=null && response.length && response.length!=0){
                                var ret = [];
                                angular.forEach(response,function(value,key){
                                    var isDuplicate = false;
                                    for(var i=0;i<ret.length;i++){
                                        if(ret[i].urnNo === value.urnNo){
                                            isDuplicate = true;
                                            break;
                                        }
                                    }
                                    if(value.urnNo!=null && !isDuplicate) ret.push(value);
                                });
                                console.warn(ret);
                                return ret;
                            }
                            return [];
                        };
                        modalQueuedefinition.listOptions.getListItem = function(item){
                            return [
                                item.firstName,
                                ':' + item.urnNo
                            ];
                        };
                        irfModalQueue.showModalQueue(modalQueuedefinition).then(function(items){
                            $log.info("on return callback of modal queue");
                            $log.info(items);

                            if(items.length>0)
                                PageHelper.showLoader();



                            model.group.jlgGroupMembers = [];
                            angular.forEach(items,function(value,key){
                                var fatherName = "";
                                var familyMembers = [];
                                var maritalStatus = null;
                                var spouseFirstName = null;;
                                Enrollment.getCustomerById({id:value.customerId},function(resp,head){

                                    fatherName = resp.fatherFirstName;
                                    familyMembers = resp.familyMembers;
                                    maritalStatus = resp.maritalStatus;
                                    spouseFirstName = resp.spouseFirstName;
                                    spouseDob=resp.spouseDateOfBirth;
                                },function(resp){}).$promise.finally(function(){

                                    var uname = value.firstName;
                                    try{
                                        if(value.middleName.length>0)
                                            uname+= " "+value.middleName;
                                    }catch(err){

                                    }
                                    try{
                                        if(value.lastName.length>0)
                                            uname+= " "+value.lastName;

                                    }catch(err){

                                    }
                                    model.group.jlgGroupMembers.push({
                                        urnNo:value.urnNo,
                                        firstName:uname,
                                        husbandOrFatherFirstName:fatherName,
                                        relation:"Father",
                                        _familyMembers:familyMembers,
                                        maritalStatus: maritalStatus,
                                        spouseFirstName:spouseFirstName
                                    });
                                    console.log(key);
                                    if(key >= (items.length-1)){
                                        PageHelper.hideLoader();
                                    }

                                });


                            });
                        });
                    }

                });
                retDefinition[0].items[6].items.push({
                    "type":"button",
                    "key":"group.jlgGroupMembers[].btnChooseWitness",
                    "fieldHtmlClass":"btn-block",
                    "title":"CHOOSE_FAMILY_MEMBER_AS_WITNESS",
                    "onClick":function(model,schemaForm,form,event){
                        //@TODO : Use an irf element for this, if possible
                        var familyMembers = model.group.jlgGroupMembers[form.arrayIndex]._familyMembers;
                        var  html="<div class='modal-header'><button type='button' class='close' ng-click='$close()' aria-label='Close'><span aria-hidden='true'>x</span></button>";
                        html+="<h4 class='modal-title'>Choose</h4></div>";
                        html+="<div class='modal-body'><table class='table table-striped table-bordered table-responsive'>";
                        html+="<th>Name</th><th>Relationship</th><th>Action</th>";
                        for(var i=0;i<familyMembers.length;i++){
                            if(familyMembers[i].relationShip =="Self" || familyMembers[i].relationShip =="self") continue;
                            var name = Utils.getFullName(familyMembers[i].familyMemberFirstName,
                                familyMembers[i].familyMemberMiddleName ,familyMembers[i].familyMemberLastName);
                            html += "<tr>";

                            html += "<td>";
                            html += name;
                            html += "</td>";

                            html += "<td>";
                            html += familyMembers[i].relationShip;
                            html += "</td>";

                            html += "<td>";
                            html += "<button ng-click='returnWitness(\""+name+"\",\""+familyMembers[i].relationShip+"\")' class='btn btn-theme'>Select</button>";
                            html += "</td>";

                            html += "</tr>";
                        }
                        html +="</table></div>";
                        html+="<div class='modal-footer'>";
                        html+="<button type='button' class='btn btn-default pull-left' ng-click='$close()'>Close</button>";
                        html+="</div>";
                        var chooseWin = $uibModal.open({
                            template:html,
                            controller:["$scope",function($scope){
                                $scope.returnWitness = function(name,relationship){
                                    model.group.jlgGroupMembers[form.arrayIndex].witnessFirstName = name;
                                    model.group.jlgGroupMembers[form.arrayIndex].witnessRelationship = relationship;
                                    $scope.$close();
                                }
                            }]
                        });
                        console.warn(chooseWin);

                    }
                });
                retDefinition.push({
                    "type":"actionbox",
                    "items":[
                        {
                            "type":"submit",
                            "style":"btn-primary",
                            "title":"CREATE_GROUP"

                        }
                    ]
                });
            },
            addDSCElements:function(retDefinition){
                retDefinition[0].items[6].items.push({
                        "key":"group.jlgGroupMembers[].dscStatus",
                        "readonly":true,
                        "condition":"model.group.jlgGroupMembers[arrayIndex].dscStatus"
                    },
                    {
                        "key":"group.jlgGroupMembers[].requestDSCOverride",
                        "type":"button",
                        "title":"REQUEST_DSC_OVERRIDE",
                        "icon":"fa fa-reply",
                        "onClick":function(model, formCtrl, form, event) {
                            console.log(form);
                            console.warn(event);
                            var i = event['arrayIndex'];

                            PageHelper.clearErrors();
                            var urnNo = model.group.jlgGroupMembers[i].urnNo;
                            PageHelper.showLoader();
                            $log.info("Requesting DSC override for ",urnNo);
                            irfProgressMessage.pop('group-dsc-override-req', 'Requesting DSC Override');
                            Groups.post({
                                service:"dscoverriderequest",
                                urnNo:urnNo,
                                groupCode:model.group.groupCode,
                                productCode:model.group.productCode
                            },{
                            },function(resp,header){
                                $log.warn(resp);
                                irfProgressMessage.pop('group-dsc-override-req', 'Almost Done...');
                                var screenMode = model.group.screenMode;
                                Groups.getGroup({groupId:model.group.id},function(response,headersGetter){
                                    PageHelper.hideLoader();
                                    irfProgressMessage.pop('group-dsc-override-req', 'DSC Override Requested',2000);
                                    model.group = _.cloneDeep(response);
                                    model.group.screenMode = screenMode;
                                    fixData(model);
                                },function(resp){
                                    $log.error(resp);
                                    PageHelper.hideLoader();
                                    irfProgressMessage.pop("group-dsc-override-req","Oops. An error occurred",2000);
                                    PageHelper.showErrors(resp);
                                    fixData(model);
                                });

                            },function(resp,header){
                                $log.error(resp);
                                PageHelper.hideLoader();
                                irfProgressMessage.pop("group-dsc-override-req","Oops. An error occurred",2000);
                                PageHelper.showErrors(resp);
                            });
                        },
                        "condition":"model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED'"
                    },
                    {
                        "key":"group.jlgGroupMembers[].getDSCData",
                        "type":"button",
                        "title":"VIEW_DSC_RESPONSE",
                        "icon":"fa fa-eye",
                        "style": "btn-primary",
                        //"condition":"model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED'",
                        "onClick":function(model, formCtrl, form, event){
                            console.log(form);
                            console.warn(event);
                            var i = event['arrayIndex'];
                            console.warn("dscid :"+model.group.jlgGroupMembers[i].dscId);
                            var dscId = model.group.jlgGroupMembers[i].dscId;
                            showDscData(dscId);
                        }
                    },
                    {
                        "key":"group.jlgGroupMembers[].removeMember",
                        "type":"button",
                        "title":"REMOVE_MEMBER",
                        "icon":"fa fa-times",
                        "onClick":function(model, formCtrl, form, event) {
                            console.log(form);
                            console.warn(event);
                            var i = event['arrayIndex'];
                            var urnNo = model.group.jlgGroupMembers[i].urnNo;
                            $log.warn("Remove member from grp ",urnNo);
                            if(window.confirm("Are you sure?")){
                                PageHelper.showLoader();
                                PageHelper.clearErrors();
                                irfProgressMessage.pop('group-dsc-remove-req', 'Removing Group Member...');
                                Groups.get({
                                        service:"process",
                                        action:"removeMember",
                                        groupCode:model.group.groupCode,
                                        urnNo:urnNo

                                    },
                                    function(resp,headers){
                                        var screenMode = model.group.screenMode;
                                        Groups.getGroup({groupId:model.group.id},function(response,headersGetter){
                                            irfProgressMessage.pop('group-dsc-remove-req', 'Group Member Removed',2000);
                                            model.group = _.cloneDeep(response);
                                            model.group.screenMode = screenMode;
                                            fixData(model);
                                            PageHelper.hideLoader();

                                        },function(resp){
                                            $log.error(resp);
                                            PageHelper.hideLoader();
                                            irfProgressMessage.pop("group-dsc-remove-req","Oops. An error occurred",2000);
                                            fixData(model);
                                        });
                                    },
                                    function(resp){
                                        $log.error(resp);
                                        PageHelper.hideLoader();
                                        irfProgressMessage.pop("group-dsc-remove-req","Oops. An error occurred",2000);
                                        PageHelper.showErrors(resp);
                                        fixData(model);
                                    });
                            }
                        },
                        "condition":"model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED'"
                    });
                retDefinition.push({
                    "type":"actionbox",
                    "items":[
                        {
                            "style":"btn-primary",
                            "title":"PERFORM_DSC_CHECK",
                            "type":"button",
                            "onClick":"actions.doDSCCheck(model,form)"

                        }
                    ]

                });
            },
            addDeleteElements:function(retDefinition){
                retDefinition.push({
                    "type":"actionbox",
                    "items":[
                        {
                            "type":"button",
                            "style":"btn-theme",
                            "title":"CLOSE_GROUP",
                            "icon":"fa fa-times",
                            "onClick":"actions.closeGroup(model,form)"

                        }
                    ]
                });
            },
            addAppDwnldElements:function(retDefinition){

                retDefinition.push({
                        "type":"actionbox",
                        "condition":"!model._isGroupLoanAccountActivated",
                        "items":[
                            {
                                "type":"button",
                                "icon": "fa fa-check-square",
                                "title":"ACTIVATE_LOAN_ACCOUNT",
                                "onClick":"actions.activateLoanAccount(model,form)",

                            }
                        ]
                    },
                    {
                        "type":"actionbox",
                        "condition":"model._isGroupLoanAccountActivated",
                        "items":[
                            {
                                "type":"button",
                                "icon": "fa fa-download",
                                "title":"DOWNLOAD_APPLICATION",
                                "onClick":"actions.downloadApplication(model,form)",

                            },
                            {
                                "type":"button",
                                "icon": "fa fa-arrow-right",
                                "title":"PROCEED_TO_DISBURSEMENT",
                                "onClick":"actions.proceedAction(model,form)"

                            }
                        ]
                    });

            },

            /*
            * Common Functionalities
            * */

            showDSCData: function(dscId){
                showDscData(dscId);
            },
            checkGroupLoanActivated: function(model){
                //@TODO: check if model data is valid

                var deferred = $q.defer();
                try {
                    model._isGroupLoanAccountActivated = false;
                    LoanProcess.query({
                        action: 'groupdisbursement',
                        param1: model.group.partnerCode,
                        param2: model.group.groupCode
                    }, function (resp, headers) {
                        $log.info("checkGroupLoanActivated", resp.length);
                        try {
                            if (resp.length > 0) {
                                //for application download endpoint (1st accountId is the param)
                                model._loanAccountId = resp[0].accountId;
                                model._isGroupLoanAccountActivated = true;
                                deferred.resolve(true);

                            }

                        } catch (err) {

                        }

                        deferred.resolve(false);

                    }, function (resp) {
                        deferred.resolve(false);
                    });
                }
                catch(err){
                    deferred.resolve(false);
                }
                return deferred.promise;
            }

        }
}]);
