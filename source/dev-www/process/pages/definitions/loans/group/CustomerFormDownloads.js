irf.pageCollection.factory("Pages__CustomerFormDownloads",
["$log", "formHelper", "Enrollment","$state", "SessionStore",
function($log, formHelper, Enrollment,$state, SessionStore){
	var branch = SessionStore.getBranch();
	return {
		"id": "CustomerFormDownloads",
		"type": "search-list",
		"name": "CustomerFormDownloads",
		"title": "Customer Form Downloads",
		"subTitle": "",
		"uri":"Customer Form Downloads",
		initialize: function (model, form, formCtrl) {
			$log.info("search-list sample got initialized");
		},
		definition: {
			title: "Search Customers",
			searchForm: [
				"*"
			],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"properties": {
					"first_name": {
						"title": "CUSTOMER_NAME",
						"type": "string"
					},
					"lastName": {
						"title": "LASTNAME",
						"type": "string"
					},
					"kyc_no": {
						"title": "KYC_NO",
						"type": "string"
					},
					"branch": {
						"title": "BRANCH_NAME",
						"type": "string",
						"enumCode": "branch",
						"default": branch,
						"x-schema-form": {
							"type": "select"
						}
					},
					"centre": {
						"title": "CENTRE",
						"type": "string",
						"enumCode": "centre",
						"x-schema-form": {
							"type": "select"
						}
					}

				},
				"required":["branch"]
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

				var promise = Enrollment.search({
					'branchName': searchOptions.branch,
					'firstName': searchOptions.first_name,
					'centreCode': searchOptions.centre,
					'page': pageOpts.pageNo,
					'per_page': pageOpts.itemsPerPage,
                    'kycNumber': searchOptions.kyc_no,
                    'lastName': searchOptions.lastName
				}).$promise;

				return promise;
			},
			paginationOptions: {
				"viewMode": "page",
				"getItemsPerPage": function(response, headers){
					return 20;
				},
				"getTotalItemsCount": function(response, headers){
					return headers['x-total-count']
				}
			},
			listOptions: {
				itemCallback: function(item, index) {
					$log.info(item);

				},
				getItems: function(response, headers){
					if (response!=null && response.length && response.length!=0){
                        var ret = [];
                        angular.forEach(response,function(value,key){

                            if(value.urnNo!=null) ret.push(value);
                        });
                        console.warn(ret);
                        return ret;
					}
					return [];
				},
				getListItem: function(item){
					return [
						item.firstName + " " + (item.lastName!=null?item.lastName:""),
						'Customer ID : ' + item.id,
						'URN : '+item.urnNo,
						null
					]
				},
				getActions: function(){
					return [
                        {
                            name: "Download Personal Information Form",
                            desc: "",
                            icon: "fa fa-user",
                            fn: function(item, index){
                                if(window.confirm("Start Download?")){
                                    var url = irf.FORM_DOWNLOAD_URL+'?form_name=personal_information&record_id='+item.urnNo;
                                    try {
                                        cordova.InAppBrowser.open(url, '_system', 'location=yes');
                                    }catch(err){
                                        window.open(url, '_blank', 'location=yes');
                                    }
                                }

                            },
                            isApplicable: function(item, index){
                                if(item.urnNo)
                                    return true;
                                else
                                    return false;

                            }
                        },
                        {
                            name: "Download Appraisal and Verification Form",
                            desc: "",
                            icon: "fa fa-check-circle-o",
                            fn: function(item, index){
                                if(window.confirm("Start Download?")){
                                    var url = irf.FORM_DOWNLOAD_URL+'?form_name=appraisal_and_verification&record_id='+item.urnNo;
                                    try {
                                        cordova.InAppBrowser.open(url, '_system', 'location=yes');
                                    }catch(err){
                                        window.open(url, '_blank', 'location=yes');
                                    }
                                }

                            },
                            isApplicable: function(item, index){
                                if(item.urnNo)
                                    return true;
                                else
                                    return false;

                            }
                        }
					];
				}
			}


		}
	};
}]);
