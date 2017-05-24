/*
* NOTE : DEPRECIATED
* */
irf.pageCollection.factory("Pages__LoanInitAndApplicationDownload",
    ["$q","$log","Enrollment","LoanProcess","Groups","$state","$stateParams","PageHelper","irfProgressMessage",
    function($q,$log,Enrollment,LoanProcess,Groups,$state,$stateParams,PageHelper,irfProgressMessage) {

        var fillNames = function(model){

            var deferred = $q.defer();

            angular.forEach(model.group.jlgGroupMembers,function(member,key){
                Enrollment.get({id:member.customerId},function(resp,headers){
                    model.group.jlgGroupMembers[key].firstName = resp.firstName;
                    try {
                        if (resp.middleName.length > 0)
                            model.group.jlgGroupMembers[key].firstName += " " + resp.middleName;
                        if (resp.lastName.length > 0)
                            model.group.jlgGroupMembers[key].firstName += " " + resp.lastName;
                    }catch(err){
                        
                    }
                    if(key>=model.group.jlgGroupMembers.length-1){
                        deferred.resolve(model);
                    }
                },function(res){
                    deferred.reject(model);
                });
            });
            return deferred.promise;
        };
        var checkGroupLoanActivated = function(model){
            var deferred = $q.defer();

            LoanProcess.query({
                action:'groupdisbursement',
                param1:model.group.partnerCode,
                param2:model.group.groupCode
            },function (resp,headers) {
                $log.info("checkGroupLoanActivated",resp.length);
                try {
                    if (resp.length > 0) {
                        model._loanAccountId = resp[0].accountId;
                        deferred.resolve(true);
                    }
                }catch(err){

                }
                deferred.resolve(false);
            },function(resp){
                deferred.resolve(false);
            });
            return deferred.promise;
        };
    return {
        "id": "loaninitandapplicationdownload",
        "type": "schema-form",
        "name": "LoanInitAndApplicationDownload",
        "title": "APPLICATION_DOWNLOAD",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("I got initialized");
            PageHelper.showLoader();
            irfProgressMessage.pop("ap-init","Loading... Please Wait...");
            console.error("Group ID :"+$stateParams.pageId);
            var groupId = $stateParams.pageId;
            Groups.getGroup({groupId:groupId},function(response,headersGetter){
                model.group = _.cloneDeep(response);
                if(model.group.currentStage!='StageAP'){
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("ap-init","Oops, an error occurred",2000);
                    $state.go('Page.GroupDashboard',{
                        pageName:"GroupDashboard"
                    });
                }
                fillNames(model).then(function(m){
                    model = m;

                    model.isGroupLoanAccountActivated = false;
                    checkGroupLoanActivated(model).then(function(isActivated){
                        model.isGroupLoanAccountActivated = isActivated;
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("ap-init","Load Complete",2000);
                    });


                },function(m){
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("ap-init","Oops, an error occurred",2000);
                });

            },function(resp){
                $log.error(resp);
                PageHelper.hideLoader();
                irfProgressMessage.pop("ap-init","Oops, an error occurred",2000);

            });
        },
        form: [
            {
                "type":"box",
                "title":"ACTIONS",
                "items":[
                    {
                        "key":"group.id",
                        "title":"GROUP_ID",
                        "readonly":true
                    },
                    {
                        "key":"group.groupName",
                        "title":"GROUP_NAME",
                        "readonly":true
                    },
                    {
                        "key":"group.groupCode",
                        "readonly":true
                    },
                    {
                        "key":"group.jlgGroupMembers",
                        "type":"array",
                        "title":"GROUP_MEMBERS",
                        "condition":"model.group.jlgGroupMembers.length>0",
                        "add":null,
                        "remove":null,
                        "readonly":true,
                        "items":[
                            {
                                "key":"group.jlgGroupMembers[].urnNo"
                            },
                            {
                                "key":"group.jlgGroupMembers[].firstName",
                                "type":"string",
                                "readonly":true,
                                "title":"GROUP_MEMBER_NAME"
                            },
                            {
                                "key":"group.jlgGroupMembers[].loanAmount"
                            },
                            {
                                "key":"group.jlgGroupMembers[].loanPurpose1"
                            }
                        ]
                    }
                ]
            },{
                "type":"actionbox",
                "condition":"!model.isGroupLoanAccountActivated",
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
                "condition":"model.isGroupLoanAccountActivated",
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
            }
        ],
        actions: {
            proceedAction:function(model,form){
                if(window.confirm("Proceed to Next Stage?")){
                    PageHelper.showLoader();
                    var reqData={};
                    reqData.group = _.cloneDeep(model.group);
                    reqData.enrollmentAction='PROCEED';
                    irfProgressMessage.pop('ap-proceed',"Working...");
                    Groups.update(reqData,function(resp,headers){
                        irfProgressMessage.pop('ap-proceed',"Operation Success. Forwarded to Disbursement",5000);
                        PageHelper.hideLoader();
                        $state.go('Page.GroupDashboard',{
                            pageName:"GroupDashboard"
                        });
                    },function(res){
                        irfProgressMessage.pop('ap-proceed',"Oops. An Error Occurred. Please Try Again",3000);
                        PageHelper.hideLoader();
                        $log.error(res);
                        PageHelper.showErrors(res);
                    });
                }
            },
            downloadApplication:function(model,form){
                PageHelper.showLoader();
                checkGroupLoanActivated(model).then(function(isActivated){
                    PageHelper.hideLoader();
                    if(isActivated){
                        try {
                            var url = 'http://115.113.193.14:443/bi-portal/Forms/DownloadForms.php?';
                            url += 'form_name=app_loan&record_id=' +  model._loanAccountId;
                            try {
                                cordova.InAppBrowser.open(url, '_system', 'location=yes');
                            } catch (err) {
                                window.open(url, '_blank', 'location=yes');
                            }
                        }catch(err){
                            irfProgressMessage.pop('ap-download', 'An Error Occur during download. Please Try Again',2000);
                        }
                    }
                    else{
                        irfProgressMessage.pop('ap-download', 'An Error Occur during download. Please Try Again',2000);
                    }
                },function(res){
                    PageHelper.hideLoader();
                });
            },
            activateLoanAccount: function (model, form) {
                PageHelper.clearErrors();
                PageHelper.showLoader();
                irfProgressMessage.pop('ap-activate', 'Activating loan account');
                LoanProcess.get({action:'groupLoans',groupCode:model.group.groupCode,partner:model.group.partnerCode},function(resp,header){
                    checkGroupLoanActivated(model).then(function(isActivated){
                        model.isGroupLoanAccountActivated = isActivated;
                        PageHelper.hideLoader();
                        if(isActivated){

                            irfProgressMessage.pop('ap-activate', 'Loan Account Activated',5000);
                        }
                        else{
                            irfProgressMessage.pop('ap-activate', 'An error occurred while activating loan account',2000);
                        }
                    });
                },function(res){
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('ap-activate', 'An error occurred while activating loan account',2000);
                    PageHelper.showErrors(res);
                });
            }
        },
        schema: function () {
            return Groups.getSchema().$promise;
        }
    }
}]);
