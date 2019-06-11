irf.pageCollection.factory(irf.page("forms.FormsSearch"), 
	["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager","User", "SchemaResource","FormsMaintenence",
		function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, User, SchemaResource,FormsMaintenence) {
		var branch = SessionStore.getBranch();
		return {
			"type": "search-list",
			"title": "FORMS_LIST",
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
				title: "SEARCH_USER",
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
                    var promise =  FormsMaintenence.search().$promise;
                    return promise;
				},
				paginationOptions: {
					"getItemsPerPage": function(response, headers) {
						return 100;
					},
					"getTotalItemsCount": function(response, headers) {
						return response.length;
					}
				},
				listOptions: {
					selectable: false,
					expandable: true,
					listStyle: "table",
					itemCallback: function(item, index) {},
					getItems: function(response, headers) {
                        if (response!=null && response.length && response.length!=0){
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
                                title:"Output",
                                data:"Output",
                                htmlClass: "col-sm-2 col-md-2 col-lg-2"
                            },
                            {
                                title:"Form name",
                                data:"form_name",
                                htmlClass: "col-sm-2 col-lg-2 col-md-2",
                            },
                            {
                                title:"Table query",
                                data:"table_query",
                                htmlClass: "col-sm-2 col-lg-2 col-md-2",

                            },
                            // {
                            //     title:"Perdix_form_name",
                            //     data:"perdix_form_name",
                            //     htmlClass: "col-sm-2 col-lg-2 col-md-2",
                            // },
                            // {
                            //     title:"query",
                            //     data:"query"
                            // },
                            // {
                            //     title:"table_investor_id",
                            //     data:"table_investor_id"
                            // },
                            // {
                            //     title:"table_product_id",
                            //     data:"table_product_id"
                            // },
                            // {
                            //     title:"section_name",
                            //     data:"section_name"
                            // },
                            // {
                            //     title:"footer",
                            //     data:"footer"
                            // },
                            // {
                            //     title:"Notes",
                            //     data:"Notes"
                            // }
                        ]
					},
					getActions: function() {
						return [
                            {
                                name: "EDIT_FORM",
                                desc: "",
                                fn: function(item, index){
                                    $state.go('Page.Engine',
                                        {
                                            pageName: 'forms.FormsMaintanence',
                                            pageId: item.id,
                                            pageData: item
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