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
                model.transactions=model.transactions ||{};          
                var customerId = $stateParams.pageId;
                PageHelper.showLoader();
                MutualFund.summary({
                    id: customerId
                    },function(res) {
                        model.customer = res[0];
                        console.log(model.customer);
                        MutualFund.transaction(
                            {
                                mutualFundAccountProfileNewId:model.customer.id
                            }).$promise.then(function(response){
                                model.transactions= response.body;
                                PageHelper.hideLoader();
                            },function(err){
                                PageHelper.hideLoader();
                                irfProgressMessage.pop("summary-get", "An Error Occurred. Failed to fetch Data", 5000);
                            });
                        
                    },function(err){
                        console.log(err);
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("summary-get", "An Error Occurred. Failed to fetch Data", 5000);
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
                {
                    type: "box",
                    "readonly": true,
                    "condition":"model.transactions.length",
                    title: "Mutual Fund Transactions",
                    items: [
                        {
                            type: "tableview",
                            listStyle: "table",
                            key: "transactions",
                            title: "Mutual Fund Transactions",
                            paginate: false,
                            searching: false,
                            getColumns: function() {
                                return [{
                                    title: 'Transaction Number',
                                    data: 'userTrxnNumber',
                                }, {
                                    title: 'Transaction Type',
                                    data: 'transactionType'
                                },{
                                    title: 'Transaction Amount',
                                    data: 'transactionAmount'
                                }, {
                                    title: 'Transaction Date',
                                    data: 'transactionDate',
                                    render: function(data, type, full, meta) {
                                        return (moment(data).format("DD-MM-YYYY"));
                                    }
                                },{
                                    title: 'First Purchase',
                                    data: 'firstInvest',
                                    render: function(data, type, full, meta) {
                                        if(full.firstInvest){
                                            return date='YES'
                                        }else if(!full.firstInvest){
                                            return date='NO'
                                        }
                                    }
                                },{
                                    title: 'Processing Status',
                                    data: 'processingStatus'
                                }]
                            },
                            getActions: function(item) {
                                return [];
                            }
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