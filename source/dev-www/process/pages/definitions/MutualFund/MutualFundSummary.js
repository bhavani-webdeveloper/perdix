define({
    pageUID: "MutualFund.MutualFundSummary",
    pageType: "Engine",
    dependencies: ["$log", "$q", "Enrollment", 'EnrollmentHelper', 'PageHelper', 'formHelper', "elementsUtils",

        'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "irfNavigator", "CustomerBankBranch","MutualFund"
    ],

    $pageFn: function($log, $q, Enrollment, EnrollmentHelper, PageHelper, formHelper, elementsUtils,
        irfProgressMessage, SessionStore, $state, $stateParams, irfNavigator, CustomerBankBranch,MutualFund) {

        var branch = SessionStore.getBranch();
        return {
            "id": "summary",
            "type": "schema-form",
            "name": "MUTUAL_FUND_SUMMARY",
            "title": "MUTUAL_FUND_SUMMARY",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.customer = model.customer || {};             
                var customerId = $stateParams.pageId;
                MutualFund.summary({
                    id: customerId
                    },function(res) {
                        model.customer = res[0];
                        console.log(model.customer)
                        }
                )
            },          
            form: [                
                {
                    type: "box",
                    title: "MUTUAL_FUND_SUMMARY",
                    items: [
                            {
                            type: "fieldset",
                            title: "",
                            readonly: true,
                            items: [
                                {
                                    title: "FIRST_NAME",
                                    key: "customer.firstName"                                         
                                },
                                {
                                    title: "CURRENT_VALUE",
                                    key: "customer.currentValue"                                    
                                },
                                {
                                    title: "INITIAL_INVESTMENT",
                                    key: "customer.intialInvestment"                                    
                                },
                                {
                                    title: "SIP_REGISTRATION_NUMBER",
                                    key: "customer.sipRegistrationNumber"                                    
                                },
                                {
                                    title: "SIP_REGISTRATION_DATE",
                                    key: "customer.sipRegistrationDate"                                    
                                },
                                {
                                    title: "FOLIO_NO",
                                    key: "customer.folioNo"                                    
                                },
                                {
                                    title: "UNIT_BALANCE",
                                    key: "customer.unitBalance"                                  
                                },
                                {
                                    title: "MUTUAL_FUND_ACCOUNT_PROFILE_ID",
                                    key: "customer.id"                                    
                                }   
                            ]
                        },               
                    ]
                },  
           ],
            schema: function() {
                return Enrollment.getSchema().$promise;
            },           
        };
    }
})