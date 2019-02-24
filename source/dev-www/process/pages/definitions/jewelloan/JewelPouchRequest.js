
irf.pageCollection.factory(irf.page("jewelloan.JewelPouchRequest"), ["$log", "$stateParams", "formHelper", "PageHelper", "Utils", "irfNavigator","JewelLoan","SessionStore",

    function($log,$stateParams,formHelper,PageHelper, Utils,irfNavigator,JewelLoan,SessionStore) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form", 
            "title": "JEWEL_POUCH_REQUEST",
            "subTitle": "JewelPouch",
            initialize: function(model, form, formCtrl) {
    
                model.jewelloan = model.jewelloan || {};
                model.customer = model.customer || {};
                model.customer.currentBranch = branch;
                model = Utils.removeNulls(model, true);
                $log.info("create new tranist request page");
                
                    
                if ($stateParams.pageData) {
                    var jewelloanarray = $stateParams.pageData;
                   
                    $log.info(jewelloanarray); 
                    for (i in jewelloanarray) {
                        if (i == 0) {
                            var jewelloanIdList = "jewelloanIdList=" + jewelloanarray[i].id
                        } else {
                            var jewelloanIdList = jewelloanIdList + "&jewelloanIdList=" + jewelloanarray[i].id
                        }
                    }
                    var jewelloanArray = []
                    JewelLoan.findJewelPouch({
                        id: jewelloanIdList
                    }).$promise.then(
                        function(res) {
                            model.jewelloanResponse = res;
                            for (i in jewelloanarray) {
                                jewelloanArray[i] = model.jewelloanResponse[i];
                                jewelloanArray[i].customerFullName = model.jewelloanResponse[i].customerFirstName + " "+model.jewelloanResponse[i].customerLastName;
                            }

                            model.jewelloan.jewelloans = jewelloanArray;
                            model.customer.branchName = jewelloanArray[0].sourceBranch;

                        },
                        function(err) {
                            console.log(err);
                            PageHelper.showError(err);
                        });
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
                    title: "JEWEL_LOAN_SUMMARY",
                    readonly: true,
                    items: [{
                        key: "jewelloan.jewelloans",
                        type: "tableview",
                        add: null,
                        remove: null,
                        startEmpty: true,
                        titleMap:"model.jewelloan.jewelloans[arrayIndex].id",
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
                                        title: 'Account No',
                                        data: 'accountNo'
                                    },{
                                        title: 'URN No',
                                        data: 'urnNo'
                                    },{
                                        title: 'Jewel Pouch No',
                                        data: 'jewelPouchNo'
                                    },{
                                        title: 'Transit Status',
                                        data: 'transitStatus'
                                    },{
                                        title: 'Customer Fullname',
                                        data: 'customerFullName'
                                    },{
                                        title: 'Disbursed Amount',
                                        data: 'disbursedAmountInPaisa'
                                    },{
                                        title: 'Loan Disbursement Date',
                                        data: 'loanDisbursementDate'
                                    },{
                                        title: 'Investor',
                                        data: 'investor'
                                    },{
                                        title: 'Rejected Remarks',
                                        data: 'rejectedRemarks'
                                    },{
                                        title: 'Remarks',
                                        data: 'remarks'
                                    }];
                        },
                    }]
                },   
                {
                    type: "box",
                    title: "REQUEST_TO_DESTINATION",
                    items: [{
                        "key": "customer.currentBranch",
                        "title": "SOURCE_BRANCH",
                        "type": "string",
                         "enumCode": "branch",
                         readonly: true
                    }, 
                    {
                        key: "destinationBranch",
                        "title": "DESTINATION_BRANCH",
                        "enumCode": "branch",
                        type: "select",
                        "x-schema-form": {
                            "type": "select",
                            "screenFilter": true
                        },
                        onChange: function(value, form, model, event){
                                    if (model.customer.currentBranch && model.destinationBranch == model.customer.currentBranch){
                                    PageHelper.showProgress("pre-save-validation", "Source Branch and Destination Branch should be Different", 5000);		 	
                                    model.destinationBranch = null;
                                }	
                            },
                        required: true
                    },
                    {
                        "title" : "Remarks",
                        "type"  : "textarea",
                        key     : "jewelloan.jewelloans.remarks",
                        required: false
                    }
                ]
                },

                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "ASSIGN"
                    }, ]
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
                    $log.warn(model.jewelloan);
                    Utils.removeNulls(model.jewelloan, true);
                    
                    var reqData = _.cloneDeep(model.jewelloan);

                    /*  1)req data will now contain jewelloans with same transitstatus because of validation 
                            on branch jewel queue 
                    */
                   Utils.alert("Are you want to Proceed!!!");
                    
                   for (i = 0; i < reqData.jewelloans.length; i++) {
                    if(reqData.jewelloans[i].transitStatus && reqData.jewelloans[i].transitStatus.toLowerCase() == 'source'){
                        reqData.jewelloans[i].transitStatus =  "PENDING_TRANSIT" 
                    }
                    else if(reqData.jewelloans[i].transitStatus && reqData.jewelloans[i].transitStatus.toLowerCase() == 'destination'){
                        reqData.jewelloans[i].transitStatus =  "RETURN_REQUESTED" 
                    }

                   
                }    

                $log.info(reqData); 
               
                PageHelper.showLoader();
                PageHelper.showProgress("Assign-Jewel", "Working...");
                JewelLoan.bulkJewelStatusUpdate(reqData)
                    .$promise
                    .then(function(res){
                        PageHelper.showProgress("Assign-Jewel", "Done.", 3000);
                        $log.info(res);
                        $log.info(items);
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