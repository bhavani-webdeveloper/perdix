irf.pageCollection.factory(irf.page("jewelloan.JewelPouchReject"), ["$log", "$stateParams", "formHelper", "PageHelper", "Utils", "irfNavigator","JewelLoan","SessionStore",

function($log,$stateParams,formHelper,PageHelper, Utils,irfNavigator,JewelLoan,SessionStore) {

    var branch      = SessionStore.getBranch();
    var loginuser   = SessionStore.getLoginname();
    var status      ; 
    var sourceBranchId ;
    var destinationBranchId;
    var remarks         =  "";
    var rejectedRemarks = "";

    return {
        "type": "schema-form", 
        "title": "JEWEL_POUCH_REJECT",
        "subTitle": "JewelPouch",
        initialize: function(model, form, formCtrl) {

            model.jewelloanResponse = model.jewelloanResponse || {};
            model = Utils.removeNulls(model, true);
            $log.info("create new tranist request page");
            
                
            if ($stateParams.pageData) {
                model.jewelloanResponse = $stateParams.pageData;
                model.jewelloanResponse.currentBranch = branch;
                
            }
            
        },
        offline: false,
        getOfflineDisplayItem: function(item, index) {
            return []
        },

        form: [
            {
                type: "box",
                colClass: "col-sm-12",
                title: "JEWEL_POUCH_REJECT_DETAIL",
                readonly: true,
                items: [{
                    key: "jewelloanResponse",
                    type: "tableview",
                    add: null,
                    remove: null,
                    startEmpty: true,
                    titleMap:"model.jewelloanResponse[arrayIndex].id",
                    title: "JEWEL SUMMARY",
                    "selectable": false,
                    "editable": false,
                    "tableConfig": {
                        "searching": false,
                        "paginate": false,
                        "pageLength": 10,
                    },
                    getColumns: function() {
						return [{
									title: 'ID',
									data: 'id'
								},{
									title: 'Source Branch',
									data: 'sourceBranch'
								},{
									title: 'Destination Branch',
									data: 'destinationBranch'
								},{
									title: 'Customer Name',
									data: 'customerFullName'
								},{
									title: 'URN No',
									data: 'urnNo'
								},{
									title: 'Account No',
									data: 'accountNo'
								},{
									title: 'Disbursement Date',
									data: 'loanDisbursementDate'
								},{
									title: 'Disbursed Amount',
									data: 'disbursedAmount'
								},{
									title: 'Transit Status',
									data: 'transitStatus'
								},{
									title: 'Jewel Pouch No',
									data: 'jewelPouchNo'
								},{
									title: 'Remarks',
									data: 'remarks'
								},{
									title: 'Reject Reason',
									data: 'rejectedReason'
								}
							];
                    },
                }]
            },   
            {
                type: "box",
                title: "SEND_BACK",
                items: [
                        {
                            title: "Rejected Reason",
                            key: "jewelloanResponse.rejectedRemarks",
                            type: "textarea",
                            required: true
                        },
                        {
                            "title" : "Remarks",
                            "type"  : "textarea",
                            key     : "jewelloanResponse.remarks",
                            required: true
                        }
                    ]
            },

            {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "PROCEED"
                }]
            }
        ],
        
        schema: {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "jewelloan": {
                    "type": "object",
                    "required": [
                    ],
                    // "properties": {
                    //     "accountNo": {
                    //         "type": "string",
                    //         "title": "ACCOUNT_NO"
                    //     },
                    //     "closed": {
                    //         "type": "boolean",
                    //         "title": "CLOSED"
                    //     },
                    //     "currentMarketGoldRateInPaisa": {
                    //         "type": ["null", "number"],
                    //         "title": "CURRENT_MARKET_GOLD_RATE_IN_PAISA",                  
                    //     },
                    //     "customerFirstName": {
                    //         "type": "string",
                    //         "title": "CUSTOMER_FIRST_NAME",
                    //     },
                    //     "customerLastName": {
                    //         "type": "string",
                    //         "title": "CUSTOMER_LAST_NAME",
                    //     },
                    //     "disbursedAmountInPaisa":{
                    //         "type": ["null", "number"],
                    //         "title": "DISBURSED_AMOUNT_IN_PAISA",  
                    //     },
                    //     "id": {
                    //         "type": "integer",
                    //         "title": "ID"
                    //     },
                    //     "investor": {
                    //         "type": "string",
                    //         "title": "INVESTOR"
                    //     },
                    //     "jewelPouchNo": {
                    //         "type": "string",
                    //         "title": "JEWEL_POUCH_NO",
                    //     },
                    //     "kgfsName": {
                    //         "type": "string",
                    //         "title": "KGFS_NAME"
                    //     },
                    //     "loanDisbursementDate": {
                    //         "type": "string",
                    //         "title": "LOAN_DISBURSEMENT_DATE"
                    //     },
                    //     "loanSendDate": {
                    //         "type": "string",
                    //         "title": "LOAN_SEND_DATE"
                    //     },
                    //     "marketValueInPaisa": {
                    //         "type": ["null", "number"],
                    //         "title": "MARKET_VALUE_IN_PAISA"
                    //     },
                    //     "netWeightInGrams": {
                    //         "title": "NET_WT_IN_GMS",
                    //         "type": "integer"
                    //     },
                    //     "urnNo": {
                    //         "type": ["null", "number"],
                    //         "title": "URN_NO"
                    //     },
                    //     "version": {
                    //         "type": ["null", "number"],
                    //         "title": "VERSION"
                    //     },
                    //     "transitStatus":{
                    //         "type": "string",
                    //         "title": "TRANSIT_STATUS"
                    //     }
                    // }
                }
            }
        },
        actions: {
            submit: function(model, form, formName) {
                $log.info("Inside submit()");
                $log.warn(model.jewelloanResponse);

                var branches = formHelper.enum('branch_id').data;
                sourceBranchId      = model.jewelloanResponse[0].sourceBranchId;
                destinationBranchId = model.jewelloanResponse[0].destinationBranchId;
                remarks             = model.jewelloanResponse.remarks    
                rejectedRemarks     = model.jewelloanResponse.rejectedRemarks;
               
                for (var i=0;i<branches.length && i<model.jewelloanResponse.length; i++){
                    var branch = branches[i];
                    model.jewelloanResponse[i].destinationBranch = model.jewelloanResponse.destinationBranch
                    
                    model.jewelloanResponse[i].sentBy            = loginuser  ; 
                    model.jewelloanResponse[i].jewelLoanId       = model.jewelloanResponse[i].id ;
                    model.jewelloanResponse[i].jewelPouchMovementId = null ; 
                    model.jewelloanResponse[i].statusUpdatedBy   = loginuser ;
                    
                    if (branch.name == model.jewelloanResponse[i].destinationBranch)
                        model.jewelloanResponse[i].destinationBranchId  = branch.code;	

                    if((model.jewelloanResponse[i].transitStatus && model.jewelloanResponse[i].transitStatus.toUpperCase() == 'PENDING_TRANSIT') &&
                        (model.jewelloanResponse[i].originBranchId != model.jewelloanResponse[i].sourceBranchId)){
                            model.jewelloanResponse[i].status =  "DESTINATION" 
                     }
                     else {
                        model.jewelloanResponse[i].status =  "SOURCE" 
                     }
	 
                }

                status = model.jewelloanResponse[0].status ;
    
                Utils.removeNulls(model.jewelloanResponse, true);
                
                var reqData = _.cloneDeep(model.jewelloanResponse);

                console.log(reqData);

                /*  1)req data will now contain jewelloans with same transitstatus because of validation 
                        on branch jewel queue 
                */
               Utils.alert("Are you want to Proceed!!!");

                $log.info(reqData); 
           
                PageHelper.showLoader();
                PageHelper.showProgress("Assign-Jewel", "Working...",3000);

                JewelLoan.bulkJewelStatusUpdate({ "sourceBranchId": sourceBranchId , "destinationBranchId": destinationBranchId ,"status": status,"rejectReason":"","remarks":remarks,"sentBy":loginuser },reqData)
                .$promise
                .then(function(res){
                    PageHelper.showProgress("Assign-Jewel", "Done.", 3000);
                    irfNavigator.goBack();
                }, function(httpRes){
                    PageHelper.showProgress("Assign-Jewel", "Oops. Some error occured.", 3000);
                    PageHelper.showErrors(httpRes);
                })
                .finally(function(){
                    PageHelper.hideLoader();
                })

            }
        }

    };
}
]);