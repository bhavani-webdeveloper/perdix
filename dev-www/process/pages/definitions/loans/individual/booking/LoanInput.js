irf.pageCollection.factory(irf.page("loans.individual.loaninput"),
    ["$log","SessionStore","$state", "$stateParams", "SchemaResource","PageHelper","Enrollment","formHelper","IndividualLoan",
    function($log, SessionStore,$state,$stateParams, SchemaResource,PageHelper,Enrollment,formHelper,IndividualLoan){

        var branch = SessionStore.getBranch();

        return {
            "id": "LoanInput",
            "type": "schema-form",
            "name": "LoanInput",
            "title": "Loan Input",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                model.loanAccount.disbursementSchedules=[];

            },
            offline: false,
            getOfflineDisplayItem: function(item, index){

            },
            form: [{
                "type": "box",
                "title": "LOAN_INPUT",
                "colClass": "col-sm-6",

                "items":[
                    {
                        "type": "fieldset",
                        "title": "Product Details",


                        "items": [
                            {
                                "key": "loanAccount.partnerCode",
                                "title": "PARTNER",
                                "type": "select"
                            },
                            {
                                "key": "loanAccount.productCode",
                                "title": "PRODUCT",
                                "type": "select"
                            },


                            {
                                "key": "loanAccount.tenure"
                            },
                            {
                                "key": "loanAccount.isRestructure",
                                "title":"IS_RESTRUCTURE"
                            }
                        ]
                    },
                    {
                        "type": "fieldset",
                        "title": "Customer Details",
                        "items": [
                            {
                                "key": "loanAccount.urnNo",
                                "title": "URN_NO",
                                "type":"lov",
                                "inputMap": {
                                    "firstName": {
                                        "key": "customer.firstName",
                                        "title": "CUSTOMER_NAME"
                                    },
                                    "branch": {
                                        "key": "customer.branch",
                                        "type": "select",
                                        "screenFilter": true
                                    },
                                    "centreCode": {
                                        "key": "customer.centreCode",
                                        "type": "select",
                                        "screenFilter": true
                                    }
                                },
                                "outputMap": {
                                    "id": "loanAccount.customerId",
                                    "urnNo": "loanAccount.urnNo",
                                    "firstName":"customer.firstName",
                                    "fatherFirstName":"loanAccount.husbandOrFatherFirstName"
                                },
                                "searchHelper": formHelper,
                                "search": function(inputModel, form) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = Enrollment.search({
                                        'branchName': inputModel.branch ||SessionStore.getBranch(),
                                        'firstName': inputModel.first_name,
                                        'centreCode':inputModel.centreCode
                                    }).$promise;
                                    return promise;
                                },
                                getListDisplayItem: function(data, index) {
                                    return [
                                        [data.firstName, data.fatherFirstName].join(' | '),
                                        data.id,
                                        data.urnNo
                                    ];
                                }
                            },
                            {
                                "key":"loanAccount.customerId",
                                "title":"CUSTOMER_ID"
                            },
                            {
                                "key": "customer.firstName",
                                "title": "CUSTOMER_NAME"
                            },
                            {
                                "key":"loanAccount.husbandOrFatherFirstName",
                                "title":"HUSBAND_OR_FATHER_NAME"
                            },
                            {
                                "key":"loanAccount.relationFirstName",
                                "title":"RELATIVE_NAME"
                            },
                            {
                                "key":"loanAccount.relation",
                                "type":"select",
                                "title":"T_RELATIONSHIP"

                            }


                        ]
                    },

                    {
                        "type": "fieldset",
                        "title": "Account Details",
                        "items": [
                            {
                                key:"loanAccount.documentTracking",
                                "title":"DOCUMENT_TRACKING"

                            },
                            {
                                key:"loanAccount.customerBankAccountNumber",
                                title:"CUSTOMER_BANK_ACC_NO"
                                
                            },
                            {
                                key:"loanAccount.customerBankIfscCode",
                                title:"CUSTOMER_BANK_IFSC"

                            },
                            {
                                "key": "loanAccount.loanAmount",
                                "type":"amount",
                                "title":"LOAN_AMOUNT"
                            },
                            {
                                "key": "loanAccount.loanAmountRequested",
                                "type":"amount",
                                "title":"LOAN_AMOUNT_REQUESTED"
                            },
                            {
                                "key":"loanAccount.interestRate"

                            },
                            {
                                "key": "loanAccount.loanApplicationDate",
                                "title": "LOAN_APPLICATION_DATE",
                                "type":"date"
                            },
                            {
                                "key": "loanAccount.loanPurpose1",
                                "title": "LOAN_PURPOSE_1",
                                "type":"select"
                            },
                            {
                                "key": "loanAccount.loanPurpose2",
                                "title": "LOAN_PURPOSE_2",
                                "type":"select",
                                "filter":{
                                    "parentCode as loan_purpose_1":"model.loanAccount.loanPurpose1"
                                }
                            },
                            {
                                "key": "loanAccount.loanPurpose3",
                                "title": "LOAN_PURPOSE_3",
                                "type":"select",
                                "filter":{
                                    "parentCode as loan_purpose_2":"model.loanAccount.loanPurpose2"
                                }

                            }
                        ]
                    }


                ]
            },{
                "type": "box",
                "title": "",
                "items":[
                    {
                        "type":"fieldset",
                        "title":"GUARANTORS",
                        "items":[
                            {
                                key:"loanAccount.guarantors",
                                titleExpr:"model.loanAccount.guarantors[arrayIndex].guaUrnNo",
                                type:"array",
                                items:[
                                    {
                                        key:"loanAccount.guarantors[].guaUrnNo",
                                        title:"URN_NO"
                                    },
                                    {
                                        key:"loanAccount.guarantors[].guaDscOverride",
                                        title:"DSC_OVERRIDE"
                                    },
                                    {
                                        key:"loanAccount.guarantors[].guaDscRemarks",
                                        title:"DSC_OVERRIDE_REMARKS"
                                    },
                                    {
                                        key:"loanAccount.guarantors[].totalLiabilities",
                                        type:"amount"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "fieldset",
                        "title": "Disbursement Details",
                        "items": [
                            {
                                key:"loanAccount.sanctionDate",
                                type:"date",
                                title:"SANCTION_DATE"
                            },
                            {
                                key:"loanAccount.numberOfDisbursements",
                                title:"NUM_OF_DISBURSEMENTS",
                                onChange:function(value,form,model){
                                    console.log(value);
                                    console.log(model);

                                    model.loanAccount.disbursementSchedules=[];
                                    for(var i=0;i<value;i++){
                                        model.loanAccount.disbursementSchedules.push({
                                            disbursementAmount:0
                                        });
                                    }
                                }
                            },
                            {
                                key:"loanAccount.disbursementSchedules",
                                title:"DISBURSEMENT_SCHEDULES",
                                add:null,
                                remove:null,
                                items:[
                                    {
                                        key:"loanAccount.disbursementSchedules[].disbursementAmount",
                                        title:"DISBURSEMENT_AMOUNT",
                                        type:"amount"
                                    }
                                ]
                            },
                            {
                                key:"loanAccount.disbursementFromBankAccountNumber",
                                title:"DISBURSEMENT_ACCOUNT"
                            },
                            {
                                key:"loanAccount.originalAccountNumber",
                                title:"ORIGINAL_ACCOUNT"
                            }
                        ]
                    }
                ]
            },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "SUBMIT"
                    }
                    ]
                }],
            schema: function() {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName){
                    console.log(model);
                    PageHelper.clearErrors();
                    var reqData = _.cloneDeep(model);
                    reqData.loanProcessAction="SAVE";

                    if(window.confirm("Are You Sure?")){
                        PageHelper.showLoader();
                        IndividualLoan.create(reqData,function(resp,headers){
                            delete resp.$promise;
                            delete resp.$resolved;
                            console.log(resp);
                            resp.loanProcessAction="PROCEED";
                            //reqData.loanProcessAction="PROCEED";
                            PageHelper.showLoader();
                            IndividualLoan.create(resp,function(resp,headers){
                                console.log(resp);
                                PageHelper.showProgress("loan-create","Loan Created",5000);
                            },function(resp){
                                console.log(resp);
                                PageHelper.showErrors(resp);
                                PageHelper.showProgress("loan-create","Oops. An Error Occurred",5000);

                            }).$promise.finally(function(){
                                PageHelper.hideLoader();
                            });


                        },function(resp){
                            console.log(resp);
                            PageHelper.showErrors(resp);
                            PageHelper.showProgress("loan-create","Oops. An Error Occurred",5000);

                        }).$promise.finally(function(){
                            PageHelper.hideLoader();
                        });
                    }
                }
            }
        };
    }]);

