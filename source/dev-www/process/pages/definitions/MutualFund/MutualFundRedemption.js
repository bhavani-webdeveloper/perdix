define({
    pageUID: "MutualFund.MutualFundRedemption",
    pageType: "Engine",
    dependencies: ["$log", "$q","Enrollment", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",

                'irfProgressMessage','SessionStore',"$state", "$stateParams", "irfNavigator","CustomerBankBranch","MutualFund",],

    $pageFn: function($log, $q, Enrollment, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, irfNavigator,CustomerBankBranch,MutualFund) {

    var branch = SessionStore.getBranch();

    return {
        "id": "Redemption",
        "type": "schema-form",
        "name": "Stage 3",
        "title": "MUTUAL_FUND_REDEMPTION",
        
        initialize: function (model, form, formCtrl) {
            model.customer = model.customer || {};
            model.customer.customerType="Individual";
            var branch1 = formHelper.enum('branch_id').data;
            var allowedBranch = [];
            for (var i = 0; i < branch1.length; i++) {
                if ((branch1[i].name) == SessionStore.getBranch()) {
                    allowedBranch.push(branch1[i]);
                    break;
                }
            }
            model.customer.customerBranchId = allowedBranch.length ? allowedBranch[0].value : '';
            model.customer.kgfsBankName = SessionStore.getBankName();
            $log.info(model.customer.kgfsBankName);
            $log.info(formHelper.enum('bank'));
            $log.info("ProfileInformation page got initialized:"+model.customer.customerBranchId);

            var customerId = $stateParams.pageId;

            if(customerId){
                Enrollment.getCustomerById({id:customerId},function(resp,header){ 
                model.customer = resp;
                model.customer.addressProofSameAsIdProof=Boolean(model.customer.title);
                model.customer.customerBranchId = model.customer.customerBranchId || _model.customer.customerBranchId;
                model.customer.kgfsBankName= model.customer.kgfsBankName || SessionStore.getBankName();
                model = EnrollmentHelper.fixData(model);
                model.customer.addressProofSameAsIdProof=Boolean(model.customer.title);
                if (model.customer.dateOfBirth) {
                    model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                }
                if (model.customer.spouseDateOfBirth) {
                    model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                }                
                PageHelper.hideLoader();
            },function(resp){
                PageHelper.hideLoader();
                irfProgressMessage.pop("enrollment-save","An Error Occurred. Failed to fetch Data",5000);
            });

            }    
        },
        offline: true,
        getOfflineDisplayItem: function(item, index){
            return [
                item["customer"]["urnNo"],
                item["customer"]["firstName"],
                item["customer"]["villageName"]
            ]
        },
        form: [
                  {
            "type": "box",
            "title": "CUSTOMER_INFORMATION",
            "items": [
                {  
                     key: "customer.IsKycDone",                                
                     title: "IS_KYC_DONE",
                     type: "checkbox",
                     "schema": {
                                  "default": "0"
                                }
                },

                {
                    key: "customer.firstName",
                    title:"FULL_NAME",
                    type:"qrcode",
                    onCapture: EnrollmentHelper.customerAadhaarOnCapture
                },
              
                {
                    key:"customer.centreId",
                    type:"select",
                    "enumCode": "centre",
                    "parentEnumCode": "branch_id",
                    "parentValueExpr": "model.customer.customerBranchId",
                },
                {
                    key:"customer.enrolledAs",
                    type:"radios"
                },
             
                {
                    key: "customer.fatherFirstName",
                    title: "FATHER_FULL_NAME"
                },
                {
                    key:"customer.maritalStatus",
                    type:"select"
                },
                {
                            key: "customer.mobilePhone",
                            required: true
                }                                
               

           ]
                  }, 

                  {
                    type: "box",
                    title: "REDEMPTION",
                    items: [
                            {
                            type: "fieldset",
                            title: "",
                            items: [{
                                    title: "CUSTOMER_ID",
                                    key: "customer.customerId",
                                    type: ["string","null"]
                                },
                                {
                                    title: "Mutual Fund Transaction Type",
                                    key: "customer.mfTransactionType",                                    
                                    type: ["string","null"]

                                },
                                {
                                    title: "Mutual Fund Account ProfileID",
                                    key: "customer.mutualFundAccountProfileId",
                                    type: ["string","null"]
                                },                             
                                {
                                   title: "Amount",
                                   key: "customer.amount",
                                   type: ["string","null"]
                                }
                                
                            ]
                        }, 

               
                    ]
               
                  },      
           
                  {
            "type": "actionbox",
            "condition": "model._mode != 'EDIT'",
            "items": [{
                "type": "save",
                "title": "SAVE_OFFLINE",
            },{
                "type": "submit",
                "title": "SUBMIT"
            }]
                  },

                  {
            "type": "actionbox",
            "condition": "model._mode == 'EDIT'",
            "items": [{
                "type": "save",
                "title": "SAVE_OFFLINE",
            },{
                "type": "submit",
                "title": "SUBMIT"
            },{
                "type": "button",
                "icon": "fa fa-user-plus",
                "title": "ENROLL_CUSTOMER",
                "onClick": "actions.proceed(model, formCtrl, form, $event)"
            },{
                "type": "button",
                "icon": "fa fa-refresh",
                "title": "RELOAD",
                "onClick": "actions.reload(model, formCtrl, form, $event)"
            }]
                  },
         
              ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {

          
           
            submit: function(model, form, formName){
                $log.info("Inside submit()");              
                $log.warn(model);               
                var reqData = _.cloneDeep(model);           
           
                MutualFund.purchaseOrRedemption(reqData).then(function(res){
                         
                          irfNavigator.go({
                                          'state': 'Page.Engine',
                                       'pageName': 'MutualFund.MutualFfundSummary',
  
                                     });

                    });
            },
           
           
        }
    };
    }
})
