irf.pageCollection.factory(irf.page("jewelloan.ReturnRequestQueue"),
["$log", "formHelper","PageHelper", "JewelLoan", "$q", "SessionStore","irfNavigator","irfProgressMessage",
   function($log, formHelper,PageHelper, JewelLoan,$q, SessionStore ,irfNavigator,irfProgressMessage) {
       var branch = SessionStore.getBranch();

       var BulkJewelPouchUpdate = function(req) {
           var deferred = $q.defer();
           for (var i = 0 ; i<req.length;i++){
               if (req[i].transitStatus == "Source"){
                   req[i].transitStatus = "PENDING_TRANSIT";
               }
           }
               
           $log.info("Attempting to BulkLeadStatus Update");
           $log.info(req);

           PageHelper.clearErrors();
           PageHelper.showLoader();
           //irfProgressMessage.pop('JewelPouchBulkUpdate', 'Working ... ');
           JewelLoan.bulkJewelStatusUpdate(req, function(res, headers) {
               PageHelper.hideLoader();
               //irfProgressMessage.pop('JewelPouchBulkUpdate', 'Done. Request Sent', 5000);
               deferred.resolve(res);
           }, function(res, headers){
               PageHelper.hideLoader();
           //	irfProgressMessage.pop('JewelPouchBulkUpdate', 'Oops. Some error.', 2000);
               PageHelper.showErrors(res);
               deferred.reject(res);
           });
           return deferred.promise;	
       };
       return {
           "type": "search-list",
           "title": "RETURN_REQUEST_QUEUE",
           "subTitle": "",
           initialize: function(model, form, formCtrl) {
               model.originBranch = branch;
               model.sourceBranch = branch;
               model.jewelloan = model.jewelloan || {};
               $log.info("search-list sample got initialized");
           },
           definition: {
               title: "SEARCH_JEWEL",
               searchForm: [
                   "*"
               ],
               autoSearch:false, 

               searchSchema: {
                   "type": 'object',
                   "title": 'searchOptions',
                   "properties": {
                    "sourceBranch": {
                        "title": "SOURCE_BRANCH",
                        "type": ["string","null"],
                        "enumCode": "branch",
                        "x-schema-form": {
                            "type": "select",
                            "screenFilter": true
                            }	
                        },
                   },
                   "required": ["transitStatus"]
               },
               
               getSearchFormHelper: function() {
                   return formHelper;
               },
               getResultsPromise: function(searchOptions, pageOpts) {
                   var promise = JewelLoan.search({
                       'sourceBranch'			: branch,
                       'currentStage'			: "ReturnRequestQueue",
                       'destinataionBranch'	    : searchOptions.destinataionBranch,
                       'transitStatus'			: "RETURN_REQUEST",
                       'page'					: pageOpts.pageNo,
                       'per_page'				: pageOpts.itemsPerPage,
                   }).$promise;
                   return promise;
               },
               paginationOptions: {
                   "getItemsPerPage": function(response, headers) {
                       return 100;
                   },
                   "getTotalItemsCount": function(response, headers) {
                       return headers['x-total-count']
                   }
               },
               listOptions: {
                   selectable: true,
                   expandable: true,
                   listStyle: "table",
                   itemCallback: function(item, index) {},
                   getItems: function(response, headers) {
                       if (response != null && response.length && response.length != 0) {
                        for (var i=0;i<response.length;i++){
                            response[i].customerFullName = response[i].customerFirstName + " "+response[i].customerLastName;
                            }
                           return response;
                       }
                       return [];
                   },
                   getListItem: function(item) {
                    return [
                        item.id,
                        item.accountNo,
                        item.sourceBranch,
                        item.destinataionBranch,
                        item.urnNo,
                        item.jewelPouchNo,
                        item.transitStatus,
                        item.currentMarketGoldRateInPaisa, 
                        item.customerFullName,
                        item.disbursedAmountInPaisa,
                        item.grossWeightInGrams,
                        item.investor,
                        item.jewelPouchNo,
                        item.loanDisbursementDate,
                        item.loanSendDate,
                        item.marketValueInPaisa,
                        item.netWeightInGrams,
                        item.rejectedRemarks
                    ]
                 },
                   getTableConfig: function() {
                       return {
                           "serverPaginate": true,
                           "paginate": true,
                           "pageLength": 10
                       };
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
                                title: 'CurrentMarket GoldRate In Ps.',
                                data: 'currentMarketGoldRateInPaisa'
                            },{
                                title: 'Customer FullName',
                                data: 'customerFullName'
                            },{
                                title: 'Disbursed Amount InPaisa',
                                data: 'disbursedAmountInPaisa'
                            }, {
                                title: 'GrossWeight InGrams',
                                data: 'grossWeightInGrams'
                            },{
                                title: 'Investor',
                                data: 'investor'
                            },
                            {
                                title: 'JewelPouch No',
                                data: 'jewelPouchNo'
                            },
                            {
                                title: 'Loan Disbursement Date',
                                data: 'loanDisbursementDate'
                            },    
                            {
                                title: 'Loan Send Date',
                                data: 'loanSendDate'
                            },
                            {
                                title: 'Market Value InPaisa',
                                data: 'marketValueInPaisa'
                            },    
                            {
                                title: 'NetWeight InGrams',
                                data: 'netWeightInGrams'
                            },        
                            {
                                title: 'Rejected Remarks',
                                data: 'rejectedRemarks'
                            }];
                },
                   getActions: function() {
                       return [];
                   },
                   getBulkActions: function() {
                    return [{
                        name: "Approve",
                        desc: "",
                        icon: "fa fa-pencil-square-o",
                        fn: function(items) {
                            
                            if (items.length == 0) {
                                PageHelper.showProgress("bulk-create", "Atleast one loan should be selected for Batch creation", 5000);
                                return false;
                            }
                       	
                            BulkJewelPouchUpdate(items).then(function(resp) {
                             PageHelper.showProgress("Bulk-Jewel-Approve", "Request for return has approved sucessfully", 5000);
                             }, function(err){
                             PageHelper.showProgress("Bulk-Jewel-Approve", "Oops. Some error.", 5000);
                             });  

                        },
                            
                    
                        isApplicable: function (items) {
                            return true;
                        }
                    },

                    
                    ];
                }
              
               }
           }
       };
   }
]);
