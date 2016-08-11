irf.pageCollection.factory(irf.page('loans.groups.GroupLoanRepay'),
    ["$log","SessionStore", "$state",  "formHelper",
        "$stateParams", "LoanAccount", "LoanProcess", "PageHelper",
        "Groups", "Utils","elementsUtils",
        function ($log,SessionStore, $state, formHelper, $stateParams,
                  LoanAccount, LoanProcess,  PageHelper,
                  Groups, Utils) {

            function backToQueue(){
                $state.go("Page.Engine",{
                    pageName:"loans.groups.GroupLoanRepaymentQueue",
                    pageId:null
                });
            }

            var cashCollectionRemarks = {
                "Cash received at the branch":"Cash received at the branch",
                "Cash collected at field by WM":"Cash collected at field by WM",
                "Cash collected at field through CSP":"Cash collected at field through CSP",
                "Receipt Number":"Receipt Number"
            };

            return {
                "type": "schema-form",
                "title": "LOAN_REPAYMENT",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    PageHelper.showLoader();

                    //pageId = PartnerCode.GroupCode.isLegacy
                    var groupParams = $stateParams.pageId.toString().split(".");
                    var isLegacy = false;
                    try{
                        isLegacy = groupParams[2]=="true";
                    }
                    catch (err){
                        isLegacy = false;
                    }

                    var promise = LoanAccount.getGroupRepaymentDetails({
                        partnerCode: groupParams[0],
                        groupCode:groupParams[1],
                        isLegacy:isLegacy
                    }).$promise;
                    promise.then(function (data) { /* SUCCESS */
                            delete data.$promise;
                            delete data.$resolved;

                            console.warn(data);
                            model.repayments = Array();
                            model.total=0;
                            model.groupCode = groupParams[1];
                            for(var i=0;i<data.length;i++){

                                var repData = data[i];

                                var totalDemandDue = Number(repData.totalDemandDue);
                                var txName = (totalDemandDue==0)?"Advance Repayment":"Scheduled Demand";
                                model.repayments.push({

                                    accountId:repData.accountId,
                                    amount:parseInt(Number(repData.equatedInstallment)),
                                    groupCode:repData.groupCode,
                                    productCode:repData.productCode,
                                    urnNo:repData.urnNo,
                                    transactionName:txName,
                                    repaymentDate:Utils.getCurrentDate(),
                                    additional:{
                                        name:Utils.getFullName(repData.firstName,repData.middleName,repData.lastName),
                                        accountBalance:Number(repData.accountBalance)

                                    }

                                });
                                model.total += parseInt(Number(repData.equatedInstallment));


                            }
                            if(model.repayments.length<1){
                                PageHelper.showProgress("group-repayment","No Records",3000);
                                backToQueue();
                            }


                        }, function (resData) {
                            PageHelper.showProgress("group-repayment","No Records",3000);
                            backToQueue();
                        })
                        .finally(function () {
                            PageHelper.hideLoader();
                        });

                },
                offline: false,
                form: [
                    {
                        "type": "box",
                        "title": "GROUP_LOAN_REPAYMENT",
                        "items": [
                            {
                                "key":"groupCode",
                                "title":"GROUP_CODE",
                                "readonly":true

                            },
                            {
                                "key":"_cashCollectionRemark",
                                "title":"CASH_COLLECTION_REMARK",
                                "titleMap":cashCollectionRemarks,
                                "type":"select",
                                "onChange":function(value,form,model){
                                    for(var i=0;i<model.repayments.length;i++){
                                        var repayment = model.repayments[i];
                                        repayment.cashCollectionRemark  = value;
                                    }
                                }


                            },
                            {
                                "key":"_remarks",
                                "title":"REMARKS",
                                "onChange":function(value,form,model){
                                    console.warn(model);
                                    console.warn(value);
                                    for(var i=0;i<model.repayments.length;i++){
                                        var repayment = model.repayments[i];
                                        repayment.remarks  = value;
                                    }
                                }


                            },
                            {
                                key:"repayments",
                                add:null,
                                remove:null,
                                titleExpr:"model.repayments[arrayIndex].urnNo + ' : ' + model.repayments[arrayIndex].name",
                                items:[
                                    {
                                        key:"repayments[].accountId",
                                        readonly:true

                                    },
                                    {
                                        key:"repayments[].additional.name",
                                        readonly:true,
                                        title:"NAME",
                                        condition:"model.repayments[arrayIndex].name!=null"

                                    },
                                    {
                                        key:"repayments[].urnNo",
                                        readonly:true

                                    },
                                    {
                                        key:"repayments[].additional.accountBalance",
                                        title:"ACCOUNT_BALANCE",
                                        type:"amount",
                                        readonly:true

                                    },
                                    {
                                        key:"repayments[].amount",
                                        type:"amount",
                                        validationMessage: {
                                            'invalidAmount': 'Should be Less than Account Balance'
                                        },
                                        onChange:function(value,form,model,schemaForm){

                                            try {
                                                var i = form["arrayIndex"];
                                                if (value > model.repayments[i].additional.accountBalance) {
                                                    Utils.alert("Amount should be Less than Account Balance");
                                                }
                                                model.total=0;
                                                for(var i=0;i<model.repayments.length;i++){
                                                    model.total +=  model.repayments[i].amount;
                                                }

                                            }catch(err){
                                                console.error(err);
                                            }

                                        }


                                    },
                                    {
                                        key:"repayments[].cashCollectionRemark",
                                        "type":"select",
                                        "titleMap":cashCollectionRemarks

                                    },
                                    "repayments[].remarks",
                                    {
                                        key:"repayments[].repaymentDate",
                                        type:"date"
                                    },
                                    {
                                        key:"repayments[].transactionName",
                                        "type":"select",
                                        "titleMap":{
                                            "Advance Repayment":"Advance Repayment",
                                            "Scheduled Demand":"Scheduled Demand",
                                            "Fee Payment":"Fee Payment",
                                            "Pre-closure":"Pre-closure",
                                            "Prepayment":"Prepayment"
                                        }
                                    }


                                ]
                            },
                            {
                                "key":"total",
                                "type":"amount",
                                "title":"TOTAL",
                                readonly:true
                            }

                        ]
                    },
                    {
                        "type":"actionbox",
                        "items": [
                            {
                                "type":"submit",
                                "style":"btn-theme",
                                "title":"SUBMIT"

                            }
                        ]
                    }
                ],
                schema: {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "type": "object",
                    "properties": {
                        "advanceRepayment": {
                            "title":"ADVANCE_REPAYMENT",
                            "type": "boolean"
                        },
                        "repayments": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {

                                    "accountId": {
                                        "type": "string",
                                        "title":"ACCOUNT_ID"
                                    },
                                    "amount": {
                                        "type": "integer",
                                        "title":"AMOUNT"
                                    },
                                    "authorizationRemark": {
                                        "type": "string",
                                        "title":"AUTHORIZATION_REMARK"
                                    },
                                    "authorizationUsing": {
                                        "type": "string",
                                        "title":"AUTHORIZATION_USING"
                                    },
                                    "cashCollectionRemark": {
                                        "type": "string",
                                        "title":"CASH_COLLECTION_REMARK"
                                    },
                                    "groupCode": {
                                        "type": "string",
                                        "title":"GROUP_CODE"
                                    },
                                    "productCode": {
                                        "type": "string",
                                        "title":"PRODUCT_CODE"
                                    },
                                    "remarks": {
                                        "type": "string",
                                        "title":"REMARKS"
                                    },
                                    "repaymentDate": {
                                        "type": "string",
                                        "title":"REPAYMENT_DATE"
                                    },
                                    "transactionId": {
                                        "type": "string",
                                        "title":"TRANSACTION_ID"
                                    },
                                    "transactionName": {
                                        "type": "string",
                                        "title":"TRANSACTION_NAME"


                                    },
                                    "urnNo": {
                                        "type": "string",
                                        "title":"URN_NO"
                                    }
                                },
                                "required": [
                                    "accountId",
                                    "amount",
                                    "cashCollectionRemark",
                                    "groupCode",
                                    "productCode",
                                    "repaymentDate",
                                    "transactionName",
                                    "urnNo"
                                ]
                            }
                        }
                    },
                    "required": [
                        "repayments"
                    ]
                },
                actions: {
                    preSave: function (model, formCtrl) {
                        var deferred = $q.defer();
                        model._storedData = null;
                        deferred.resolve();
                        return deferred.promise;
                    },
                    submit: function (model, formCtrl, formName) {
                        $log.info("Inside submit");
                        console.log(formCtrl);
                        var reqData = _.cloneDeep(model);
                        var msg="";
                        for(var i=0;i<reqData.repayments.length;i++) {

                            //Check for advance repayments
                            if(reqData.repayments[i].transactionName=="Advance Repayment") {
                                reqData.advanceRepayment = true;
                                msg = "There are Advance Repayments - ";
                            }

                            //check for larger amounts
                            if(Number(reqData.repayments[i].amount)>reqData.repayments[i].additional.accountBalance) {
                                msg = "For URN "+reqData.repayments[i].urnNo;
                                msg+=" Payable amount is larger than account balance."
                                Utils.alert(msg);
                                return;
                            }
                        }

                        if(window.confirm(msg+"Are you Sure?")){
                            PageHelper.showLoader();


                            LoanAccount.groupRepayment(reqData,function(resp,headers){
                                console.log(resp);
                                try {
                                    alert(resp.response);
                                    backToQueue();
                                }catch(err){
                                    console.error(err);
                                    PageHelper.showProgress("group-repay","Oops. An Error Occurred",3000);
                                }

                            },function(resp){
                                console.error(resp);
                                try{
                                    PageHelper.showErrors(resp);
                                }catch(err){
                                    console.error(err);
                                }

                                PageHelper.showProgress("group-repay","Oops. An Error Occurred",3000);
                            }).$promise.finally(function(){
                                PageHelper.hideLoader();
                            });
                        }
                    }
                }
            }
        }]);
