irf.pageCollection.factory(irf.page("loans.individual.collections.P2PUpdate"),
["$log","$q", 'Pages_ManagementHelper','LoanProcess','PageHelper','formHelper','irfProgressMessage',
'SessionStore',"$state","$stateParams","Masters","authService","Utils", "LoanAccount",
function($log, $q, ManagementHelper, LoanProcess, PageHelper,formHelper,irfProgressMessage,
	SessionStore,$state,$stateParams,Masters,authService, Utils, LoanAccount){

	return {
		"type": "schema-form",
		"title": "COLLECTION_STATUS_FOR_LOAN",
		initialize: function (model, form, formCtrl) {
            PageHelper.showLoader();
            irfProgressMessage.pop('loading-P2PUpdate', 'Loading P2PUpdate');
            console.log(SessionStore.getRole());

            model.validateP2PDate = function (model) {

                if ((moment(model.additional.promiseToPayDate).isBefore(new Date()))) {
                    PageHelper.setError({
                        message: "P2P date should be more than to current system date" + " " + moment(new Date()).format(SessionStore.getDateFormat())
                    });
                    return;
                }
            }

            //PageHelper
            var loanAccountNo = $stateParams.pageId;
            var promise = LoanAccount.get({accountId: loanAccountNo}).$promise;
            model.additional = {};
            promise.then(function (data) { /* SUCCESS */
                model.P2PUpdate = data;
                console.log(data);



                model.siteCode = SessionStore.getGlobalSetting("siteCode");

                model.promise = model.promise || {};
                model.promise.customerName=data.customer1FirstName;
                model.promise.applicant = data.customer2FirstName;
                model.promise.productCode=data.productCode;
                model.promise.customer1Phone1=data.customer1Phone1;
                //model.promise.customerCategoryLoanOfficer=data.customerCategoryLoanOfficer;
                //model.promise.urnNo=data.customerId1;
                //model.promise.instrument='CASH_IN';
                model.promise.authorizationUsing="";
                model.promise.remarks='';
                model.promise.accountNumber = data.accountId;
                model.promise.amount = data.totalDemandDue;
                var currDate = moment(new Date()).format("YYYY-MM-DD");
                model.promise.repaymentDate = currDate;
                model.promise.transactionDate = currDate;
                model.promise.visitedDate=SessionStore.getCBSDate();

                LoanProcess.p2pKGFSList({"accountNumber":model.promise.accountNumber},
                    function(response){
                        if (response.body.length){
                        model.previousPromise = response.body[0];

                model.promise.latitude = response.body[0].latitude;
                model.promise.longitude = response.body[0].longitude;
                    }
                });
                irfProgressMessage.pop('loading P2PUpdate', 'Loaded.', 2000);
            }, function (resData) {
                irfProgressMessage.pop('loading P2PUpdate', 'Error loading P2PUpdate.', 4000);
                PageHelper.showErrors(resData);
                backToLoansList();
            })
            .finally(function () {
                PageHelper.hideLoader();
            })

            if(model._screen && model._screen == "BouncePromiseQueue"){
                model.additional.fromBouncePromiseQueue = true;
                model.additional.fromBounceQueue = false;
            }else if(model._screen && model._screen == "BounceQueue"){
                model.additional.fromBouncePromiseQueue = false;
                model.additional.fromBounceQueue = true;
            }
            else{
                model.additional.fromBouncePromiseQueue = false;
                model.additional.fromBounceQueue = false;
            }



           /* if (!model._bounce) {
                $state.go('Page.Engine', {pageName: 'loans.individual.collections.BounceQueue', pageId: null});
            } else {
                 model.promise = model._bounce;
                 model.promise.assignTo='Null-testing';
                 model.promise.bankName=model._bounce.;
                model.promise.amountdue = model._bounce.amount1;
                model.promise.custname = model._bounce.customerName;
                model.promise.accountNumber = model._bounce.accountId;
                model.promise.transactionDate = Utils.getCurrentDate();
                model.promise.scheduledDate = Utils.getCurrentDate();

            }
            */
        },
		form: [
			{
                "type":"box",
                "title":"LAST_P2P_DETAILS",
                "readonly":true,
                "condition": "model.previousPromise",
                        "items": [
                            {
                                key: "previousPromise.customerCategoryLoanOfficer",
                                title: "CUSTOMER_CATEGORY_LOAN_OFFICER",
                                "condition": "model.previousPromise.customerCategoryLoanOfficer",
                            },
                            {
                                key: "previousPromise.customerCategoryHubManager",
                                title: "CUSTOMER_CATEGORY_HUB_MANAGER",
                                "condition": "model.previousPromise.customerCategoryHubManager",
                            },
                            {
                                key: "previousPromise.customerAvailable",
                                title: "CUSTOMER_AVAILABLE",
                                type: "checkbox",
                                schema: {
                                    default: false
                                }
                            },
                            {
                                key: "previousPromise.udf1",
                                title: "BUSINESS_RUNNING",
                            },
                            {
                                key: "previousPromise.udf2",
                                title: "COLLATERAL_AVAILABLE",
                            },
                            {
                                key: "previousPromise.promiseToPay",
                                title: "P2P_DATA_PRODIDED",
                            },
                            {
                                key: "previousPromise.promiseToPayDate",
                                title: "PROMISE_TO_PAY_DATE",
                                "condition": "model.previousPromise.promiseToPay=='YES'",
                                readonly: true,
                            },
                            {
                                key: "previousPromise.reasonType",
                                title: "REASON_FOR_DELAY",
                                readonly: true,
                                "condition": "model.previousPromise.promiseToPay=='YES'"
                            },

                            {
                                key: "previousPromise.overdueReasons",
                                title: "REASON",
                                condition: "model.previousPromise.promiseToPay=='YES'",
                            },
                            {
                                key: "previousPromise.currentCollectionStatus",
                                title: "RECOVERY_ATTEMPT",
                                "condition": "model.previousPromise.promiseToPay=='NO'",
                            },
                            {
                                key: "previousPromise.scheduledDate",
                                title: "FOLLOW_UP_DATE",
                                readonly: true,
                                "condition": "model.previousPromise.promiseToPay=='NO' && model.previousPromise.currentCollectionStatus=='Contact Again' ",
                            },
                            /*{
                                key:"previousPromise.overdueReasons",
                                title:"OTHER_REASON",
                                type:"textarea",
                                condition:"model.previousPromise.reason=='Others'"
                            },*/
                            {
                                key: "previousPromise.remarks",
                                title: "REMARKS",
                                type: "textarea"
                            }
                        ]
            },
            {
				"type":"box",
				"title":"COLLECTION_STATUS",
				"items":[
                    {
                        key:"promise.customerName",
                        title:"ENTERPRISE_NAME",
                        readonly:true
                    },
                    {
                        key:"promise.applicant",
                        title:"APPLICANT",
                        readonly:true,
                        "condition":"model.promise.applicant"
                    }/*,
                    {
                        key:"promise.coApplicant",
                        title:"CO_APPLICANT",
                        readonly:true
                    }*/,
                    {
                        key: "promise.accountNumber",
                        title: "LOAN_ACCOUNT_NUMBER",
                        readonly: true
                    },
                    {
                        key:"promise.amount",
                        title:"AMOUNT_DUE",
                        //type:"amount",
                        readonly:true
                    },
                    {
                        key: "promise.customer1Phone1",
                        title: "MOBILE_PHONE",
                        "condition": "model.siteCode == 'witfin'",
                        readonly: true
                    },
                    {
                        key:"promise.visitedDate",
                        title:"VISITED_DATE",
                        type:"date",
                        //type:"amount",
                        readonly:true
                    },
                    {
                        key: "promise.customerAvailable",
                        title: "CUSTOMER_AVAILABLE",
                        required: true,
                        type: "checkbox",
                        schema: {
                            default: false
                        }
                    },
                    {
                        key:"promise.contactable",
                        title:"CONTACTABLE",
                        required: true,
                        "type":"select",
                        "enumCode":"decisionmaker"
                    }, {
                        key: "promise.latitude",
                        title: "LOCATION",
                        type: "geotag",
                        latitude: "promise.latitude",
                        longitude: "promise.longitude"
                    },
                    {
                        key: "promise.udf1",
                        type: "radios",
                        title: "BUSINESS_RUNNING",
                        "titleMap": {
                            "YES": "YES",
                            "NO": "NO"
                        }
                    },
                    {
                        key: "promise.udf2",
                        type: "radios",
                        title: "COLLATERAL_AVAILABLE",
                        "titleMap": {
                            "YES": "YES",
                            "NO": "NO"
                        }
                    },
                    {
                                "type": "fieldset",
                                "title": "COLLECTION_STATUS_DETAILS",
                                "items": [
                                    {
                                        key: "promise.customerCategoryLoanOfficer", // When User change this condition should also change
                                        title: "CUSTOMER_CATEGORY",
                                        type: "select",
                                        "condition": "model.additional.fromBounceQueue==true",
                                        enumCode: "p2p_customer_category"

                                    },
                                    {
                                        key: "promise.customerCategoryHubManager", // When User change this condition should also change
                                        title: "CUSTOMER_CATEGORY",
                                        type: "select",
                                        "condition": "model.additional.fromBouncePromiseQueue==true",
                                        enumCode: "p2p_customer_category"

                                    },
                                    {
                                        key: "promise.promiseToPay",
                                        type: "radios",
                                        required: true,
                                        title: "P2P_DATA_PROVIDED",
                                        "titleMap": {
                                            "YES": "YES",
                                            "NO": "NO"
                                        }
                                    },
                                    {
                                        key: "additional.promiseToPayDate",
                                        title: "P2P_DATE",
                                        readonly: false,
                                        required: true,
                                        "condition": "model.promise.promiseToPay=='YES'",
                                        type: "date",
                                        "onChange": function (value, form, model, event) {
                                            model.validateP2PDate(model);
                                        }

                                    },
                                    {
                                        key: "additional.currentCollectionStatus",
                                        title: "RECOVERY_ATTEMPT",
                                        type: "select",
                                        required: true,
                                        "condition": "model.promise.promiseToPay=='NO'",
                                        enumCode: "recovery_attempt",
                                    },
                                    {
                                        key: "additional.collectionSubStatus",
                                        title: "SUB_STATUS",
                                        type: "select",
                                        required: true,
                                        "condition": "model.promise.promiseToPay=='NO'",
                                        enumCode: "collection_sub_status",
                                        parentEnumCode: "recovery_attempt",
                                        parentValueExpr:"model.additional.currentCollectionStatus",
                                    },
                                    {
                                        key: "additional.reasonType",
                                        title: "REASON_FOR_DELAY",
                                        type: "select",
                                        required: true,
                                        titleMap: {
                                            "Business not running":"Business not running",
                                            "Hardship": "Hardship",
                                            "Wilful default":"Wilful default",
                                            "Can pay":"Can pay",
                                            "Others":"Others"
                                        },

                                    },
                                    // {
                                    //     key: "additional.reason",
                                    //     title: "REASON",
                                    //     type: "select",
                                    //     required: true,
                                    //     condition: "model.additional.reasonType=='Business'",
                                    //     // enumCode: "business_overdue_reasons",
                                    //     titleMap:[
                                    //         {
                                    //             "value":"others",
                                    //             "name":"Others"
                                    //     }
                                    //     ]

                                    // },
                                    // {
                                    //     key: "additional.reason",
                                    //     title: "REASON",
                                    //     type: "select",
                                    //     required: true,
                                    //     condition: "model.additional.reasonType=='Personal'",
                                    //     // enumCode: "personal_overdue_reasons",
                                    //     titleMap:[
                                    //         {
                                    //             "value":"others",
                                    //             "name":"Others"
                                    //     }
                                    //     ]
                                    // },
                                    {
                                        key: "additional.scheduledDate",
                                        title: "FOLLOW_UP_DATE",
                                        required: true,
                                        readonly: false,
                                        "condition": "model.promise.promiseToPay=='NO' && model.additional.currentCollectionStatus=='Contact Again' ",
                                        type: "date",

                                    },
                                    {
                                        key: "additional.overdueReasons",
                                        title: "OVERDUE_REASON",
                                        type: "textarea",
                                        required: true,
                                        "condition": "model.additional.reason=='Others'"

                                    },

                                    {
                                        key: "promise.remarks",
                                        title: "REMARKS",
                                        type: "textarea",

                                    }]
                            }
				]
			}
			,
			{
				"type": "actionbox",
				"items": [{
					"type": "submit",
					"title": "SUBMIT"
			}]
		}],
		schema: function() {
			return ManagementHelper.getVillageSchemaPromise();
		},
		actions: {
            generateFregCode:function(model,form){
                console.log(model);
            },
			submit: function(model, form, formName){
				$log.info("Inside submit()");
                console.warn(model);
                var siteCode = SessionStore.getGlobalSetting("siteCode");

                if(siteCode == "witfin"){

                    var selecteddate = model.additional.promiseToPayDate;
                    var currentdate = moment(new Date()).format("YYYY-MM-DD");
                    var fivedays = moment(new Date(new Date().getTime()+(5*24*60*60*1000))).format("YYYY-MM-DD");
                    var fivedaysvalidate = moment(new Date(new Date().getTime()+(5*24*60*60*1000))).format("DD-MM-YYYY");
                    var oneday = moment(new Date(new Date().getTime()+(1*24*60*60*1000))).format("DD-MM-YYYY");
                    var currentmonth = moment(new Date()).format("MM");
                    var selectedmonth = moment(new Date(selecteddate)).format("MM");
                    var date = new Date();
                    var currentday = moment(new Date()).format("DD");
                    var lastday =  moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format("DD");
                    var lastfullday =  moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format("DD-MM-YYYY");
                    var daydiff = lastday - currentday;

                    if(daydiff < 4 && daydiff > 1){
                        var remain = "Only Select Date Between "+ oneday +" To "+ lastfullday;
                    }
                    if(daydiff == 1){
                        var remain = "You have To select "+ lastfullday +" From This Month";
                    }
                    if(daydiff == 0){
                        var remain = "No Days Left For Select From Current Month";
                    }
                    if(daydiff > 5){
                        var remain = "Only Select Date Between "+ oneday +" To "+ fivedaysvalidate;
                    }

                    if(selecteddate <= currentdate ||  selecteddate > fivedays || currentmonth != selectedmonth){
                        PageHelper.showProgress("Date Error", "Your Next Action Date "+ remain , 5000);
                        return false;
                    }
                }

                PageHelper.showLoader();


                        // delete model.promise.udf1;
                        // delete model.promise.udf2;
                        delete model.promise.promiseToPayDate;
                        delete model.promise.reasonType;
                        delete model.promise.overdueReasons;
                        delete model.promise.scheduledDate;

                        // if (model.promise.isBusinessRunning)
                        //     model.promise.udf1 = model.promise.isBusinessRunning;
                        // if (model.promise.isCollateralAvailable)
                        //     model.promise.udf2 = model.promise.isCollateralAvailable;

                        if (model.promise.promiseToPay == 'YES') {
                            model.promise.promiseToPayDate = model.additional.promiseToPayDate;
                            if ((moment(model.additional.promiseToPayDate).isBefore(new Date()))) {
                                PageHelper.setError({
                                    message: "P2P date should be more than to current system date" + " " + moment(new Date()).format(SessionStore.getDateFormat())
                                });
                                PageHelper.hideLoader();
                                return;
                            }

                        } else {

                            model.promise.collectionSubStatus = model.additional.collectionSubStatus;
                            model.promise.currentCollectionStatus = model.additional.currentCollectionStatus;
                            if (model.additional.currentCollectionStatus == 'Contact Again'){
                                model.promise.scheduledDate = model.additional.scheduledDate;
                                if ((moment(model.additional.scheduledDate).isBefore(new Date()))) {
                                    PageHelper.setError({
                                        message: "Follow Up date should be more than to current system date" + " " + moment(new Date()).format(SessionStore.getDateFormat())
                                    });
                                    PageHelper.hideLoader();
                                    return;
                                }
                            }
                                
                        }
                        model.promise.reasonType = model.additional.reasonType;
                        if (model.additional.reason && model.additional.reason == "Others")
                            model.promise.overdueReasons = model.additional.overdueReasons;
                        else
                            model.promise.overdueReasons = model.additional.reason;

                model.promise.overdueAmount=model.promise.amount;

                $log.info("going to submit");
                $log.info(model._screen);

                if (model.previousPromise){
                    if(model._screen && model._screen == "BouncePromiseQueue"){
                        model.promise.customerCategoryLoanOfficer = model.previousPromise.customerCategoryLoanOfficer;
                    }else if (model._screen && model._screen == "BounceRecoveryQueue"){
                        model.promise.customerCategoryLoanOfficer = model.previousPromise.customerCategoryLoanOfficer;
                        model.promise.customerCategoryHubManager = model.previousPromise.customerCategoryHubManager;
                    }else{
                        model.promise.customerCategoryHubManager = model.previousPromise.customerCategoryHubManager;
                    }
                }
                $log.info(model.promise.customerCategoryLoanOfficer);
                $log.info(model.promise.customerCategoryHubManager);

                LoanProcess.p2pUpdate(model.promise, function(response){
                    if(model._screen && model._screen == "BouncePromiseQueue")
                        $state.go('Page.Engine', {pageName: 'loans.individual.collections.BouncePromiseQueue', pageId: null});
                    else if(model._screen && model._screen == "BounceRecoveryQueue")
                        $state.go('Page.Engine', {pageName: 'loans.individual.collections.BounceRecoveryQueue', pageId: null});
                    else if(model._screen && model._screen == "BounceQueue")
                        $state.go('Page.Engine', {pageName: 'loans.individual.collections.BounceQueue', pageId: null});

                    PageHelper.hideLoader();
                    irfNavigator.goBack();

                }, function(errorResponse){
                    PageHelper.hideLoader();
                    PageHelper.showErrors(errorResponse);
                });
			}
		}
	};
}]);
