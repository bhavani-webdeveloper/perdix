irf.pageCollection.factory(irf.page("jewelloan.IncomingTransitQueue"),
["$log", "formHelper","PageHelper", "JewelLoan", "$q", "SessionStore","irfNavigator","irfProgressMessage",
   function($log, formHelper,PageHelper, JewelLoan,$q, SessionStore,irfNavigator,irfProgressMessage) {
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

            irfProgressMessage.pop('JewelPouchBulkUpdate', 'Working ... ');
            
            JewelLoan.bulkJewelStatusUpdate(req, function(res, headers) {
               PageHelper.hideLoader();
               irfProgressMessage.pop('JewelPouchBulkUpdate', 'Done. Request Sent', 5000);
               deferred.resolve(res);
            }, function(res, headers){
               PageHelper.hideLoader();
            	irfProgressMessage.pop('JewelPouchBulkUpdate', 'Oops. Some error.', 2000);
               PageHelper.showErrors(res);
               deferred.reject(res);
           });
           
           return deferred.promise;	
       };

       return {
           "type": "search-list",
           "title": "INCOMING_TRANSIT_QUEUE",
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
                       'sourceBranch'			: searchOptions.sourceBranch,
                       'currentStage'			: "PendingTransitQueue",
                       'destinataionBranch'	    : searchOptions.destinataionBranch,
                       'transitStatus'			: "IN_TRANSIT",
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
                        item.customerFullName,
                        item.disbursedAmountInPaisa,
                        item.investor,
                        item.jewelPouchNo,
                        item.loanDisbursementDate,
                        item.rejectedRemarks,
                        item.remarks
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
                                title: 'Customer FullName',
                                data: 'customerFullName'
                            }, {
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
                                PageHelper.showProgress("Bulk-Jewel-Approve", "Approval has done sucessfully", 5000);
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
