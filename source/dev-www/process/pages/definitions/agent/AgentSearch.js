define({
    pageUID: "agent.AgentSearch",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "Agent", "irfNavigator", "Lead", "$state", "$q", "SessionStore", "Utils", "entityManager"],

    $pageFn: function($log, formHelper, Agent, irfNavigator, Lead, $state, $q, SessionStore, Utils, entityManager) {

        var branch = SessionStore.getBranch();
        return {
            "type": "search-list",
            "title": "AGENT_SEARCH",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.branch = branch;
                $log.info("search-list sample got initialized");
                var branchId = SessionStore.getBranchId();
                var branchName = SessionStore.getBranch();
                var centres = SessionStore.getCentres();
                if (_.isArray(centres) && centres.length > 0) {
                    model.centre = centres[0].centreName;
                }
            },
            definition: {
                title: "SEARCH_LEAD",
                searchForm: [
                    "*"
                ],
                autoSearch: false,
                searchSchema: {
                    "type": 'object',
                    "title": 'SEARCH_OPTIONS',
                    "properties": {
                        "agent": {
                            "title": "AGENT",
                            "type": "string"
                        },
                        "agentName": {
                            "title": "AGENT_NAME",
                            "type": "string"
                        },
                        "agentType": {
                            "title": "AGENT_TYPE",
                            "type": "string"
                        },
                        "agentId": {
                            "title": "AGENT_ID",
                            "type": "number"
                        }
                    },
                    "required": []
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    var promise = Agent.search({
                        'agentId': searchOptions.agentId,
                        'currentStage': '',
                        'agentName': searchOptions.agentName,
                        'agentType': searchOptions.agentType,
                        'customerType': '',
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage
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
                            item.agentName,
                            item.agentId,
                            item.agentType,
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
                            data: 'customer.id'
                        }, {
                            title: 'AGENT_NAME',
                            data: 'customer.firstName'
                        }, {
                            title: 'AGENT_TYPE',
                            data: 'agentType'
                        }, {
                            title: 'CUSTOMER_TYPE',
                            data: 'customer.customerType'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "APPLICATION_REVIEW",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                if (item.customer.customerType == 'Individual') {
                                    entityManager.setModel('agent.IndividualAgentEnrollmentScreening', {
                                        _request: item
                                    });
                                    irfNavigator.go({
                                        'state': 'Page.Bundle',
                                        'pageName': 'agent.IndividualAgentEnrollmentScreening',
                                        'pageId': item.customer.id,
                                        // 'pageData': {
                                        //     "readonly": false
                                        // }
                                    }, {
                                        'state': 'Page.Engine',
                                        'pageName': 'agent.AgentSearch',
                                        'pageId': null
                                    });
                                } else if (item.customer.customerType == 'Enterprise') {
                                    entityManager.setModel('agent.EnterpriseAgentEnrollmentScreening', {
                                        _request: item
                                    });
                                    irfNavigator.go({
                                        'state': 'Page.Bundle',
                                        'pageName': 'agent.EnterpriseAgentEnrollmentScreening',
                                        'pageId': item.customer.id,
                                        // 'pageData': {
                                        //     "readonly": false
                                        // }
                                    }, {
                                        'state': 'Page.Engine',
                                        'pageName': 'agent.AgentSearch',
                                        'pageId': null
                                    });
                                }

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