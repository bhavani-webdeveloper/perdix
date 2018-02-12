irf.pageCollection.factory(irf.page("user.UserSearch"), 
	["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager","User", "SchemaResource",
		function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, User, SchemaResource) {
		var branch = SessionStore.getBranch();
		return {
			"type": "search-list",
			"title": "USER_SEARCH_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
                var bankName = SessionStore.getBankName();
                model.branchId = SessionStore.getCurrentBranch().branchId;
                var banks = formHelper.enum('bank').data;
                for (var i = 0; i < banks.length; i++){
                    if(banks[i].name == bankName){
                        model.bankId = banks[i].value;
                        model.bankName = banks[i].name;
                    }
                }
                var userRole = SessionStore.getUserRole();
                if(userRole && userRole.accessLevel && userRole.accessLevel === 5){
                    model.fullAccess = true;
                }
			},
			definition: {
				title: "SEARCH_LOAN",
                searchForm: [{
                        "type": "section",
                        "items": [{
                            "key": "userName",
                            "title": "USER_NAME",
                        }, {
                            "key": "login",
                            "title": "LOGIN",
                        }, {
                            "key": "bankId",
                            "readonly": true,
                            "type": "select",
                            "condition": "!model.fullAccess"
                        }, {
                            "key": "bankId",
                            "type": "select",
                            "condition": "model.fullAccess"
                        }, {
                            "key": "branchId",
                            "title": "BRANCH_NAME",
                            "type": "select",
                            "parentEnumCode": "bank",
                            "parentValueExpr": "model.bankId",
                        }, {
                            "key": "partnerCode",
                            "title": "Partner_Code",
                            "type": "select",
                            "enumCode": "partner"
                        }]
                    }
                ],
				autoSearch: true,
				searchSchema: {
                    "type": 'object',
                    "title": "VIEW_TRANSACTIONS",
                    "required":[],
                    "properties": {
                        "userName": {
                            "title": "USER_NAME",
                            "type": "string"
                        },
                        "login": {
                        	"title": "LOGIN",
                        	"type": "string"
                        },
                        "bankId": {
                            "title": "BANK_NAME",
                            "type": ["integer", "null"],
                            enumCode: "bank"
                        },
                        "branchId": {
                        	"title": "BRANCH_NAME",
                            "type": ["integer", "null"],
                            "enumCode": "branch_id"
                        },
                        "partnerCode": {
                            "title": "Partner_Code",
                            "type": "string",
                        }
                    }
                },
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {
                    var branches = formHelper.enum('branch').data;
                    var branchName = null;
                    for (var i = 0; i < branches.length; i++) {
                        var branch = branches[i];
                        if (branch.code == searchOptions.branchId) {
                            branchName = branch.name;
                        }
                    }

                    var banks = formHelper.enum('bank').data;
                    var BankName= null;
                    for (var i = 0; i < banks.length; i++) {
                        if (banks[i].value == searchOptions.bankId) {
                            BankName = banks[i].name;
                        }
                    }

                    return User.query(
                        {
                            page: pageOpts.pageNo,
                            per_page: pageOpts.itemsPerPage,
                            userName: searchOptions.userName,
                            login: searchOptions.login,
                            branchName: branchName,
                            bankName:BankName,
                            partnerCode: searchOptions.partnerCode

                        }
                    ).$promise;
				},
				paginationOptions: {
					"getItemsPerPage": function(response, headers) {
						return 20;
					},
					"getTotalItemsCount": function(response, headers) {
						return headers['x-total-count']
					}
				},
				listOptions: {
					selectable: false,
					expandable: true,
					listStyle: "table",
					itemCallback: function(item, index) {},
					getItems: function(response, headers) {
						if (response != null && response.length && response.length != 0) {
							return response;
						}
						return [];
					},
                    getListItem: function(item) {
						return item;
					},
					getTableConfig: function() {
						return {
							"serverPaginate": true,
							"paginate": false,
							"pageLength": 20
						};
					},
					getColumns: function() {
						return [
                            {
                                title: 'User ID',
                                data: 'userName'
                            },
                            {
                                title: 'Bank Name',
                                data: 'bankName'
                            },
                            {
                                title: 'HUB_NAME',
                                data: 'branchName'
                            },
                            {
                                title: 'Login ID',
                                data: 'login'
                            },
                            {
                                title: 'Email',
                                data: 'email'
                            }
                        ]
					},
					getActions: function() {
						return [
                            {
                                name: "EDIT_USER",
                                desc: "",
                                fn: function(item, index){
                                    // entityManager.setModel('user.UserMaintanence');
                                    $state.go('Page.Engine',
                                        {
                                            pageName: 'user.UserMaintanence',
                                            pageId: item.login
                                        }
                                    );
                                },
                                isApplicable: function(){
                                    return true;
                                }
                            }
                        ];
					}
					
				}
			}
		};
	}
]);