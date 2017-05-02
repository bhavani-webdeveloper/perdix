irf.pageCollection.factory("Pages__GroupCRUD",
    ["$log","$q",'Enrollment', 'Groups','CreditBureau','LoanProducts','formHelper','PageHelper','$state',
    '$stateParams','irfProgressMessage', "irfModalQueue","SessionStore","Utils",
        "groupCommons","LoanProcess",
    function($log, $q, Enrollment, Groups, CreditBureau, LoanProducts, formHelper, PageHelper, $state,
        $stateParams, irfProgressMessage, irfModalQueue,SessionStore,Utils,groupCommons,LoanProcess) {
        var branch = SessionStore.getBranch();


        var fixData = function(model){
            //fixData from server for Display
            switch(model.group.frequency){
                case 'M': model.group.frequency="Monthly"; break;
                case 'Q': model.group.frequency="Quarterly"; break;
                case 'A': model.group.frequency="Annually"; break;
                case 'D': model.group.frequency="Daily"; break;
                case 'W': model.group.frequency="Weekly"; break;
                case 'F': model.group.frequency="Fortnightly"; break;
                case 'H': model.group.frequency="Half Yearly"; break;
                case 'B': model.group.frequency="Bullet"; break;
            }
            model.group.tenure = parseInt(model.group.tenure);
            //return model;
        };

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
                    deferred.reject(res);
                });
            });
            return deferred.promise;
        };

        var saveData = function(reqData){

            PageHelper.showLoader();
            irfProgressMessage.pop('group-save', 'Working...');

            var deferred = $q.defer();

            if(reqData.group.id){
                deferred.reject(true);
                $log.info("Group id not null, skipping save");

            }
            else {
                reqData.enrollmentAction = 'SAVE';
                reqData.group.groupFormationDate = Utils.getCurrentDate();
                delete reqData.group.screenMode;
                reqData.group.frequency = reqData.group.frequency[0];

                /*for(var i=0; i<reqData.group.jlgGroupMembers.length; i++){
                    reqData.group.jlgGroupMembers[i].loanPurpose2 = reqData.group.jlgGroupMembers[i].loanPurpose1;
                    reqData.group.jlgGroupMembers[i].loanPurpose3 = reqData.group.jlgGroupMembers[i].loanPurpose1;
                }*/

                PageHelper.clearErrors();
                Utils.removeNulls(reqData,true);
                Groups.post(reqData, function (res) {

                    irfProgressMessage.pop('group-save', 'Done.',5000);
                    deferred.resolve(res);

                }, function (res) {
                    PageHelper.hideLoader();
                    PageHelper.showErrors(res);
                    irfProgressMessage.pop('group-save', 'Oops. Some error.', 2000);
                    deferred.reject(false);

                });
            }
            return deferred.promise;

        };

        var proceedData = function(res){



            var deferred = $q.defer();
            if(res.group.id===undefined || res.group.id===null){
                $log.info("Group id null, cannot proceed");
                deferred.reject(null);
            }
            else {
                PageHelper.showLoader();
                irfProgressMessage.pop('group-save', 'Working...');
                res.enrollmentAction = "PROCEED";
                try {
                    delete res.group.screenMode;
                }catch(err){

                }
                res.group.frequency = res.group.frequency[0];

                /*for(var i=0; i<res.group.jlgGroupMembers.length; i++){
                    res.group.jlgGroupMembers[i].loanPurpose2 = res.group.jlgGroupMembers[i].loanPurpose1;
                    res.group.jlgGroupMembers[i].loanPurpose3 = res.group.jlgGroupMembers[i].loanPurpose1;
                }*/

                Utils.removeNulls(res,true);
                Groups.update(res, function (res, headers) {
                    $log.info(res);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('group-save', 'Done. Group ID: ' + res.group.id, 5000);
                    deferred.resolve(res);



                }, function (res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('group-save', 'Oops. Some error.', 2000);
                    PageHelper.showErrors(res);
                    deferred.reject(null);
                });
            }
            return deferred.promise;

        };
        var backToDashboard = function(){
            $state.go('Page.GroupDashboard',{
                pageName:"GroupDashboard",
                pageId:null,
                pageData:null
            });
        };
        return {
		"id": "GroupsCRUD",
		"type": "schema-form",
		"name": "GroupCRUD",
		"title": "",
		"subTitle": "",
		"uri": "Groups/Group Details",


		initialize: function (model, form, formCtrl) {
            $log.info($stateParams);
            var screenMode = 'CREATE';
            try {
                if ($stateParams.pageId !== null) {
                    if ($stateParams.pageData.intent !== undefined) {
                        screenMode = $stateParams.pageData.intent;
                    }
                }
            }catch(err){
                $log.error(err);
                backToDashboard();
            }
            this.form = groupCommons.getFormDefinition(screenMode);
			$log.info("Group got initialized");
			model.group = {};
            model.group.jlgGroupMembers = [];
            model.branchName = branch;
            if(screenMode!='CREATE'){
                //Except for create, all modes require to load group data.
                //This code block can be moved to commons in future version
                var groupId = $stateParams.pageId;
                PageHelper.showLoader();
                irfProgressMessage.pop("group-init","Loading, Please Wait...");
                Groups.getGroup({groupId:groupId},function(response,headersGetter){
                    model.group = _.cloneDeep(response);

                    fixData(model);

                   if(model.group.jlgGroupMembers.length>0) {
                       fillNames(model).then(function (m) {
                           model = m;
                           if(screenMode=='APP_DWNLD'){
                               groupCommons.checkGroupLoanActivated(model).then(function(res){
                                   PageHelper.hideLoader();
                                   irfProgressMessage.pop("group-init", "Load Complete.", 2000);
                               },function(res){
                                   PageHelper.hideLoader();
                                   irfProgressMessage.pop("group-init", "Load Complete.", 2000);
                               });
                           }
                           else {
                               PageHelper.hideLoader();
                               irfProgressMessage.pop("group-init", "Load Complete.", 2000);
                           }
                       }, function (m) {
                           PageHelper.showErrors(m);
                           PageHelper.hideLoader();
                           irfProgressMessage.pop("group-init", "Oops. An error occurred", 2000);
                       });
                   }
                    else {
                       PageHelper.hideLoader();
                       irfProgressMessage.pop("group-init", "Load Complete. No Group Members Found", 2000);
                       backToDashboard();
                   }
                },function(resp){

                    PageHelper.hideLoader();
                    irfProgressMessage.pop("group-init","Oops. An error occurred",2000);
                    backToDashboard();
                });
            }

		},
		form: [],
		actions:{

            doDSCCheck:function(model,form){
                PageHelper.clearErrors();
                PageHelper.showLoader();
                irfProgressMessage.pop('group-dsc-check', 'Performing DSC Check');
                Groups.dscQuery(
                    {
                        groupCode:model.group.groupCode,
                        partnerCode:model.group.partnerCode
                    },
                    {},
                    function(resp){
                        $log.warn(resp);
                        irfProgressMessage.pop('group-dsc-check', 'Almost Done...');
                        var screenMode = model.group.screenMode;
                        Groups.getGroup({groupId:model.group.id},function(response,headersGetter){
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('group-dsc-check', 'DSC Check Complete',2000);
                            model.group = _.cloneDeep(response);
                            model.group.screenMode = screenMode;
                            fixData(model);


                            fillNames(model).then(function(m){
                                model = m;
                                PageHelper.hideLoader();

                            },function(m){
                                PageHelper.hideLoader();
                                irfProgressMessage.pop("group-dsc-check","Oops. An error occurred",2000);
                            });

                            var dscFailedStatuses = ['DSC_OVERRIDE_REQUIRED','DSC_OVERRIDE_REQUESTED'];
                            var allOk = true;
                            var failedMsg = Array();
                            angular.forEach(model.group.jlgGroupMembers,function(member){
                                if(dscFailedStatuses.indexOf(member.dscStatus)>=0){
                                    $log.warn("DSC Failed for",member);
                                    allOk = false;
                                    return;
                                }

                            });
                            $log.info("DSC Check Status :"+allOk);
                            if(allOk===true){
                                if(window.confirm("DSC Check Succeeded for the Group. Proceed to next stage?")){
                                    model.enrollmentAction = 'PROCEED';
                                    PageHelper.showLoader();
                                    irfProgressMessage.pop('dsc-proceed', 'Working...');
                                    PageHelper.clearErrors();
                                    var reqData = _.cloneDeep(model);
                                    delete reqData.screenMode;
                                    reqData.group.frequency = reqData.group.frequency[0];
                                    Groups.update(reqData,function(res){
                                        PageHelper.hideLoader();
                                        irfProgressMessage.pop('dsc-proceed', 'Operation Succeeded. Proceeded to CGT 1.', 5000);
                                        backToDashboard();

                                    },function(res){
                                        PageHelper.hideLoader();
                                        irfProgressMessage.pop('dsc-proceed', 'Oops. Some error.', 2000);
                                        PageHelper.showErrors(res);

                                    });
                                }
                            }
                            else{
                                var errors = Array();
                                PageHelper.hideLoader();
                                errors.push({message:"DSC Check Failed for some member(s). Please Take required action"});
                                PageHelper.setErrors(errors);
                            }

                        },function(resp){
                            $log.error(resp);
                            PageHelper.hideLoader();
                            irfProgressMessage.pop("group-dsc-check","Oops. An error occurred",2000);

                        });

                    },function(resp){
                        PageHelper.showErrors(resp);
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('group-dsc-check', 'Oops... An error occurred. Please try again',2000);
                    });
            },
			submit: function(model, form, formName) {
                if (form.$invalid){
                    irfProgressMessage.pop('group-submit', 'Please fix your form', 5000);
                    return;
                }


				$log.info(model);
                var screenMode = model.group.screenMode;
                var reqData = _.cloneDeep(model);
                saveData(reqData).then(function(res){
                    model.group = _.clone(res.group);
                    reqData = _.cloneDeep(model);
                    fixData(model);
                    model.group.screenMode = screenMode;
                    proceedData(reqData).then(function(res){
                        backToDashboard();
                    });
                },function(doProceed){
                    if(doProceed===true) {
                        proceedData(reqData).then(function (res) {
                            backToDashboard();
                        });
                    }
                    else{
                        fixData(model);
                        model.group.screenMode = screenMode;
                    }
                });

			},
            closeGroup:function(model,form){
                if(window.confirm("Close Group - Are you sure?")){
                    var remarks = window.prompt("Enter Remarks","Test Remarks");
                    if(remarks) {
                        PageHelper.showLoader();
                        irfProgressMessage.pop('close-group', "Working...");
                        Groups.update({service: "close"}, {
                            "groupId": model.group.id,
                            "remarks": remarks
                        }, function (resp, header) {

                            PageHelper.hideLoader();
                            irfProgressMessage.pop('close-group', "Done", 5000);
                            backToDashboard();

                        }, function (res) {
                            $log.error(res);
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('close-group', "Oops. An Error Occurred, Please try Again", 5000);
                            PageHelper.showErrors(res);
                            

                        });
                    }
                }
            },

            proceedAction:function(model,form){

                if(window.confirm("Proceed to Next Stage?")){
                    var reqData = _.cloneDeep(model);
                    proceedData(reqData).then(function (res) {
                        backToDashboard();
                    },function(res){
                    });
                }
            },
            downloadApplication:function(model,form){
                PageHelper.showLoader();
                groupCommons.checkGroupLoanActivated(model).then(function(isActivated){
                    PageHelper.hideLoader();
                    if(isActivated){
                        try {
                            var url = irf.FORM_DOWNLOAD_URL+'?form_name=app_loan&record_id=' +  model._loanAccountId;
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

                    groupCommons.checkGroupLoanActivated(model).then(function(isActivated){
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
		schema: function() {
			return Groups.getSchema().$promise;
		}
	}
}]);
