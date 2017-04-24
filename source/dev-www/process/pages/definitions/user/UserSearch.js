irf.pageCollection.factory(irf.page("user.UserSearch"), 
	["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager","User", "SchemaResource",
		function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, User, SchemaResource) {
		var branch = SessionStore.getBranch();
		return {
			"type": "search-list",
			"title": "USER_SEARCH_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
			},
			definition: {
				title: "SEARCH_LOAN",
				searchForm: [
					"*"
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
                        "branchName": {
                        	"title": "BRANCH_NAME",
                        	"type": "string",
                        	"x-schema-form": {
                        		"type": "select",
                        		"enumCode": "branch"
                        	}
                        },
                        "partnerCode": {
                            "title": "Partner_Code",
                            "type": "string",
                            "x-schema-form": {
                                "type": "select",
                                "enumCode": "partner"
                            }
                        }
                    }
                },
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {
                    return User.query(
                        {
                            page: pageOpts.pageNo,
                            per_page: pageOpts.itemsPerPage,
                            userName: searchOptions.userName,
                            login: searchOptions.login,
                            branchName: searchOptions.branchName,
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