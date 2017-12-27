define({
    pageUID: "loans.individual.collections.ReminderFollowUpQueue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "LUC", "$state", "SessionStore", "Utils", "irfNavigator", "RepaymentReminder"],
    $pageFn: function($log, formHelper, LUC, $state, SessionStore, Utils, irfNavigator, RepaymentReminder) {
        return {
            "type": "search-list",
            "title": "REMINDER_FOLLOW_UP",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("Reminder Follow Up Queue got initialized");
                model.branchName = SessionStore.getCurrentBranch().branchId;
                Queries.getNextInstallmentDate()
                .then(function(response){
                    $log.info(response);
                    if (response.body[0].min_date != null) {
                        model.demandDate = response.body[0].min_date;
                    }
                });
            },
            definition: {
                title: "SEARCH",
                searchForm: [
                    "*"
                ],
                autoSearch: false,
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        "applicantName": {
                            "title": "APPLICANT_NAME",
                            "type": "string"
                        },
                        "businessName": {
                            "title": "BUSINESS_NAME",
                            "type": "string"
                        },
                        "branchName": {
                            "title": "HUB_NAME",
                            "type": ["integer", "null"],
                            "enumCode": "branch_id",
                            "x-schema-form": {
                                "type": "select",
                                "screenFilter": true
                            }
                        },
                        "centreName": {
                            "title": "SPOKE",
                            "type": ["integer", "null"],
                            "enumCode": "centre",
                            "x-schema-form": {
                                "parentEnumCode": "branch_id",
                                "parentValueExpr": "model.branchName",
                                "type": "select",
                                "screenFilter": true
                            }
                        },
                        "customerUrn": {
                            "title": "CUSTOMER_URN",
                            "type": "string"
                        },
                        "area": {
                            "title": "AREA",
                            "type": "string"
                        },
                        "city": {
                            "title": "CITY/_VILLAGE/_TOWN",
                            "type": "string"
                        },
                        "demandDate": {
                            "title": "DEMAND_DATE",
                            "type": ["string", "null"],
                            "required": true,
                            "x-schema-form": {
                                "type": "date",
                                "screenFilter": true
                            }
                        },
                        "reminderStatus": {
                            "title": "REMINDER_STATUS",
                            "type": ["string", "null"],
                            "enumCode": "repayment_call_status",
                            "x-schema-form": {
                                "type": "select",
                                "screenFilter": true
                            }
                        },
                    },
                    "required": []
                },

                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    var branches = formHelper.enum('branch').data;
                    var branchName = null;
                    for (var i = 0; i < branches.length; i++) {
                        var branch = branches[i];
                        if (branch.code == searchOptions.branchName) {
                            branchName = branch.name;
                        }
                    }
                    var centres = formHelper.enum('centre').data;
                    var centreName = null;
                    for (var i = 0; i < centres.length; i++) {
                        var centre = centres[i];
                        if (centre.code == searchOptions.centreName) {
                            centreName = centre.name;
                        }
                    }

                    var promise = RepaymentReminder.query({
                        'customerUrn': searchOptions.customerUrn,
                        'branchName': branchName,
                        'centreName': centreName,
                        'businessName': searchOptions.businessName,
                        'applicantName': searchOptions.applicantName,
                        'area': searchOptions.area,
                        'city': searchOptions.city,
                        'demandDate': searchOptions.demandDate,
                        'reminderStatus': searchOptions.reminderStatus
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
                        return [
                            item.id
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
                        return [
                        {
                            title: 'ID',
                            data: 'id'
                        },
                        {
                            title: 'BRANCH_NAME',
                            data: 'branchName'
                        },
                        {
                            title: 'SPOKE_NAME',
                            data: 'centreName'
                        }, {
                            title: 'BUSINESS_NAME',
                            data: 'customerName'
                        }, {
                            title: 'DUE_DATE',
                            data: 'installmentDate'
                        }, {
                            title: 'DEMAND_AMOUNT',
                            data: 'installmentAmount'
                        },{
                            title: 'PHONE_NUMBER',
                            data: 'mobilePhone'
                        },{
                            title: 'STATUS',
                            data: 'reminderStatus'
                        }
                        ]
                    },
                    getActions: function() {
                        return [{
                            name: "View Reminder Follow Up Data",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    state: "Page.Engine",
                                    pageName: "loans.individual.collections.RepaymentReminderData",
                                    pageId: item.id,
                                },
                                {
                                    state: "Page.Engine",
                                    pageName: "loans.individual.collections.ReminderFollowUpQueue",
                                });
                            },
                            isApplicable: function(item, index) {
                                return true;
                            }
                        }];
                    }
                }
            }
        };
    }
})
